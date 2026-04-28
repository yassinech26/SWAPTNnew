package com.cherifyedeshemdenebenhamed.demo.service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cherifyedeshemdenebenhamed.demo.exception.BadRequestException;

import jakarta.annotation.PostConstruct;

@Service
public class ListingImageStorageService {

    private static final int MAX_IMAGES_PER_LISTING = 10;
    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif"
    );

    private final Path listingUploadDir;

    public ListingImageStorageService(@Value("${app.upload.base-dir:uploads}") String uploadBaseDir) {
        this.listingUploadDir = Paths.get(uploadBaseDir, "listings").toAbsolutePath().normalize();
    }

    @PostConstruct
    public void ensureUploadDirectoryExists() {
        try {
            Files.createDirectories(listingUploadDir);
        } catch (IOException ex) {
            throw new IllegalStateException("Failed to initialize listing upload directory", ex);
        }
    }

    public List<String> storeListingImages(List<MultipartFile> images) {
        if (images == null || images.isEmpty()) {
            throw new BadRequestException("Please upload at least one image.");
        }

        if (images.size() > MAX_IMAGES_PER_LISTING) {
            throw new BadRequestException("You can upload up to " + MAX_IMAGES_PER_LISTING + " images per listing.");
        }

        List<String> storedImageUrls = new ArrayList<>();

        for (MultipartFile image : images) {
            if (image == null || image.isEmpty()) {
                continue;
            }

            String normalizedType = normalizeContentType(image.getContentType());
            if (!ALLOWED_CONTENT_TYPES.contains(normalizedType)) {
                throw new BadRequestException("Only JPG, PNG, WEBP, or GIF images are allowed.");
            }

            String extension = resolveExtension(image.getOriginalFilename(), normalizedType);
            String fileName = UUID.randomUUID() + extension;
            Path destination = listingUploadDir.resolve(fileName).normalize();

            if (!destination.startsWith(listingUploadDir)) {
                throw new BadRequestException("Invalid file path in upload request.");
            }

            try (InputStream inputStream = image.getInputStream()) {
                Files.copy(inputStream, destination, StandardCopyOption.REPLACE_EXISTING);
            } catch (IOException ex) {
                throw new IllegalStateException("Failed to store uploaded image", ex);
            }

            storedImageUrls.add("/uploads/listings/" + fileName);
        }

        if (storedImageUrls.isEmpty()) {
            throw new BadRequestException("Please upload at least one non-empty image file.");
        }

        return storedImageUrls;
    }

    private String normalizeContentType(String contentType) {
        if (contentType == null) {
            return "";
        }
        return contentType.toLowerCase(Locale.ROOT).trim();
    }

    private String resolveExtension(String originalFilename, String contentType) {
        if (originalFilename != null) {
            int dotIndex = originalFilename.lastIndexOf('.');
            if (dotIndex >= 0 && dotIndex < originalFilename.length() - 1) {
                String ext = originalFilename.substring(dotIndex).toLowerCase(Locale.ROOT);
                if (ext.matches("\\.[a-z0-9]{1,6}")) {
                    return ext;
                }
            }
        }

        return switch (contentType) {
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            case "image/gif" -> ".gif";
            default -> ".jpg";
        };
    }
}
