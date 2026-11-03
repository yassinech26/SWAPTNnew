# SwapTN

React/Vite frontend and Spring Boot backend, with JPA, MySQL and Lombok.

## Run locally

1. Start MySQL on port 3306 (XAMPP MySQL also works; the local XAMPP installation uses MariaDB).
2. Use Java 21 or newer and Node.js 22.12 or newer.
3. Optionally copy `.env.example` to `.env` and set your database credentials. Defaults are `root`, an empty password and a local `swaptn` database.
4. Start the backend:

   ```powershell
   .\mvnw.cmd spring-boot:run
   ```

5. In another terminal, start the frontend:

   ```powershell
   npm install
   npm run dev
   ```

Open the URL printed by Vite, normally http://localhost:5173. The backend listens on http://localhost:8081. Vite proxies API, authentication, user, admin and uploaded-image requests to the backend.

Hibernate creates/updates the local MySQL tables automatically. This creates a new local database; it does not copy records from the previous Neon/PostgreSQL database. Do not import the old PostgreSQL `marketplace.sql` dump into MySQL.

For a separately hosted frontend, set `VITE_API_BASE_URL` at build time and configure backend CORS for the frontend origin. Otherwise, production hosting needs to proxy the same API paths. Set `JWT_SECRET`, database credentials and `DDL_AUTO` appropriately for deployment.

## Relationships

The model follows `src/pages/Screenshot uml.png`:

| Parent | Children / owning field |
| --- | --- |
| User | Listings (`owner`), messages (`sender`), conversations (`user1` / `user2`) |
| User | Written/received reviews (`reviewer` / `reviewedUser`) |
| User | Submitted/received reports (`reportedBy` / `reportedUser`) |
| Listing | Conversations, reviews and listing reports (`listing`) |
| Conversation | Messages (`conversation`) |

Each child uses `@ManyToOne` and a foreign key; parent collections use `@OneToMany(mappedBy = ...)`. Inverse collections are excluded from JSON to prevent recursive serialization. Parent-user references never cascade deletion into other users. Service transactions remove dependent records before deleting listings or users.

Conversation participants remain named `user1` and `user2` for API compatibility, ordered by ID to prevent duplicate conversations. One participant must own the listing. Reviews identify their listing with `{"listing":{"id":123},"rating":5,"comment":"Great seller"}`; the backend sets the reviewer and reviewed seller. Reports retain `type`/`targetId` for the existing frontend; user/listing targets additionally have foreign-key associations. Messages include a persisted read flag.

Lombok generates standard getters/setters and constructor injection. Custom security/defaulting accessors remain explicit. Enable annotation processing in your IDE if needed; Maven configures the Lombok processor explicitly.

The Contact form saves messages in `contact_messages`; it does not send email. The Report Issue form submits authenticated listing reports. New accounts have the USER role. Admin access requires an existing account with the ADMIN role. Wishlist storage remains local to the frontend and notifications show an empty state until a notification feature is implemented.

## Verification

```powershell
.\mvnw.cmd test
npm run lint
npm run build
```

Backend integration tests require the local MySQL server and use a separate randomly named `swaptn_test_*` database, with test tables dropped after execution. `TEST_DB_USER` and `TEST_DB_PASSWORD` override test credentials. If setting `TEST_DB_URL`, use a disposable test database because test tables are recreated.
