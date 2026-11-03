# MySQL setup

Start MySQL (or XAMPP MySQL) on port 3306 and run `.\mvnw.cmd spring-boot:run`.

The application defaults to `jdbc:mysql://localhost:3306/swaptn`, username `root`, and an empty password. Connector/J is included in `pom.xml`. Hibernate creates the database tables and foreign keys; the JDBC URL creates the database if your account has permission.

Set `DB_URL`, `DB_USER`, and `DB_PASSWORD` in `.env` or the process environment to change the connection. See `.env.example` and [README.md](README.md) for startup and integration-test instructions.

This configuration uses a fresh local MySQL database. Existing Neon/PostgreSQL records are not migrated automatically. The old PostgreSQL SQL dump is not a MySQL import script.
