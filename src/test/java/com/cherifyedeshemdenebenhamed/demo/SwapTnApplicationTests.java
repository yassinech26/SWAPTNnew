package com.cherifyedeshemdenebenhamed.demo;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import java.util.UUID;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
class SwapTnApplicationTests {
    // An isolated schema avoids touching application data. Tables are dropped on shutdown.
    @DynamicPropertySource
    static void database(DynamicPropertyRegistry registry) {
        String schema = "swaptn_test_" + UUID.randomUUID().toString().replace("-", "");
        registry.add("spring.datasource.url", () -> System.getenv().getOrDefault("TEST_DB_URL",
                "jdbc:mysql://localhost:3306/" + schema + "?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"));
        registry.add("spring.datasource.username", () -> System.getenv().getOrDefault("TEST_DB_USER", "root"));
        registry.add("spring.datasource.password", () -> System.getenv().getOrDefault("TEST_DB_PASSWORD", ""));
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "create-drop");
        registry.add("logging.level.org.hibernate.tool.schema", () -> "ERROR");
        registry.add("app.upload.base-dir", () -> "target/test-uploads");
    }

    @Autowired MockMvc mvc;
    @Autowired ObjectMapper json;
    @Autowired com.cherifyedeshemdenebenhamed.demo.repository.UserRepository users;
    @Autowired com.cherifyedeshemdenebenhamed.demo.repository.ListingRepository listings;
    @Autowired com.cherifyedeshemdenebenhamed.demo.service.UserService userService;

    private JsonNode postJson(String path, String body, String token, int status) throws Exception {
        var request = post(path).contentType("application/json").content(body);
        if (token != null) request.header("Authorization", "Bearer " + token);
        return json.readTree(mvc.perform(request).andExpect(status().is(status)).andReturn().getResponse().getContentAsString());
    }

    private JsonNode signup(String email) throws Exception {
        return postJson("/auth/signup", "{\"fullName\":\"Same Name\",\"email\":\"" + email + "\",\"password\":\"Password123!\"}", null, 201);
    }

    private String login(String email) throws Exception {
        return postJson("/auth/login", "{\"email\":\"" + email + "\",\"password\":\"Password123!\"}", null, 200).get("token").asText();
    }

    @Test
    void marketplaceWorksWithRealDatabaseAndForeignKeys() throws Exception {
        mvc.perform(get("/api/listings")).andExpect(status().isOk()).andExpect(jsonPath("$.content").isEmpty());
        postJson("/api/contact", "{\"name\":\"Visitor\",\"email\":\"visitor@example.com\",\"subject\":\"Question\",\"message\":\"Hello support\"}", null, 201);
        long sellerId = signup("seller@example.com").get("id").asLong();
        long buyerId = signup("buyer@example.com").get("id").asLong();
        signup("outsider@example.com");
        String seller = login("seller@example.com"), buyer = login("buyer@example.com"), outsider = login("outsider@example.com");
        mvc.perform(get("/users/" + sellerId).header("Authorization", "Bearer " + seller))
                .andExpect(status().isOk()).andExpect(jsonPath("$.password").doesNotExist()).andExpect(jsonPath("$.listings").doesNotExist());
        String listingBody = "{\"title\":\"Test jacket\",\"description\":\"A test listing\",\"price\":25,\"category\":\"Women\",\"condition\":\"New\"}";
        var listingPart = new MockMultipartFile("listing", "listing.json", "application/json", listingBody.getBytes());
        var image = new MockMultipartFile("images", "test.png", "image/png", new byte[] {1, 2, 3});
        JsonNode listing = json.readTree(mvc.perform(multipart("/api/listings").file(listingPart).file(image)
                .header("Authorization", "Bearer " + seller)).andExpect(status().isCreated()).andReturn().getResponse().getContentAsString());
        long listingId = listing.get("id").asLong();
        assertThat(listing.at("/owner/id").asLong()).isEqualTo(sellerId);
        mvc.perform(get(listing.get("imageUrl").asText())).andExpect(status().isOk());
        mvc.perform(put("/api/listings/" + listingId).contentType("application/json").content(listingBody).header("Authorization", "Bearer " + outsider)).andExpect(status().isForbidden());
        mvc.perform(put("/api/listings/" + listingId).contentType("application/json").content(listingBody).header("Authorization", "Bearer " + seller)).andExpect(status().isOk()).andExpect(jsonPath("$.condition").value("New"));
        String conversationBody = "{\"listingId\":" + listingId + ",\"otherUserId\":" + sellerId + "}";
        long conversationId = postJson("/api/conversations", conversationBody, buyer, 200).get("id").asLong();
        assertThat(postJson("/api/conversations", conversationBody, buyer, 200).get("id").asLong()).isEqualTo(conversationId);
        postJson("/api/messages?conversationId=" + conversationId, "{\"content\":\"Not allowed\"}", outsider, 403);
        JsonNode message = postJson("/api/messages?conversationId=" + conversationId, "{\"content\":\"Hello seller\"}", buyer, 201);
        assertThat(message.at("/sender/fullName").asText()).isEqualTo("Same Name");
        mvc.perform(get("/api/messages/conversation/" + conversationId).header("Authorization", "Bearer " + seller)).andExpect(status().isOk()).andExpect(jsonPath("$[0].content").value("Hello seller"));
        mvc.perform(get("/api/messages/conversation/" + conversationId).header("Authorization", "Bearer " + outsider)).andExpect(status().isForbidden());
        JsonNode review = postJson("/api/reviews", "{\"rating\":5,\"comment\":\"Great seller\",\"listing\":{\"id\":" + listingId + "}}", buyer, 201);
        assertThat(review.at("/reviewer/id").asLong()).isEqualTo(buyerId);
        assertThat(review.at("/reviewedUser/id").asLong()).isEqualTo(sellerId);
        assertThat(users.findById(sellerId).orElseThrow().getRating()).isEqualTo(5.0);
        postJson("/api/reports", "{\"type\":\"LISTING\",\"targetId\":" + listingId + ",\"reason\":\"Test report\"}", buyer, 201);
        mvc.perform(delete("/api/reviews/" + review.get("id").asLong()).header("Authorization", "Bearer " + buyer)).andExpect(status().isOk());
        assertThat(users.findById(sellerId).orElseThrow().getRating()).isEqualTo(0.0);
        mvc.perform(delete("/api/listings/" + listingId).header("Authorization", "Bearer " + outsider)).andExpect(status().isForbidden());
        mvc.perform(delete("/api/listings/" + listingId).header("Authorization", "Bearer " + seller)).andExpect(status().isOk());
        assertThat(listings.existsById(listingId)).isFalse();
        userService.deleteUserByAdmin(sellerId);
        assertThat(users.existsById(sellerId)).isFalse();
        assertThat(listings.existsById(listingId)).isFalse();
    }
}
