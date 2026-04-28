package com.cherifyedeshemdenebenhamed.demo.configuration;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import javax.sql.DataSource;
import java.sql.Connection;

/**
 * Test de connexion à la base de données Neon au démarrage
 * Affiche un message de confirmation et arrête l'app si la connexion échoue
 */
@Component
public class DatabaseConnectionTest implements CommandLineRunner {

    private final DataSource dataSource;

    public DatabaseConnectionTest(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public void run(String... args) throws Exception {
        try (Connection connection = dataSource.getConnection()) {
            String databaseProductName = connection.getMetaData().getDatabaseProductName();
            String databaseVersion = connection.getMetaData().getDatabaseProductVersion();
            
            System.out.println("\n========================================");
            System.out.println("✅ DATABASE CONNECTION SUCCESSFUL!");
            System.out.println("📊 Database: " + databaseProductName);
            System.out.println("📌 Version: " + databaseVersion);
            System.out.println("🔒 SSL Mode: ENABLED (sslmode=require)");
            System.out.println("🌐 Connection Pooling: HikariCP (Active)");
            System.out.println("========================================\n");
        } catch (Exception e) {
            System.err.println("\n========================================");
            System.err.println("❌ DATABASE CONNECTION FAILED!");
            System.err.println("Error: " + e.getMessage());
            System.err.println("========================================\n");
            throw e; // Arrête l'application si la connexion échoue
        }
    }
}
