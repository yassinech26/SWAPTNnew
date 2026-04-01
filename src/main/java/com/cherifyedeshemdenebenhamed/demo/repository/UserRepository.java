package com.cherifyedeshemdenebenhamed.demo.repository;

import com.cherifyedeshemdenebenhamed.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // It is mainly used to avoid NullPointerException (NPE) and make the code more
    // expressive when dealing with values that might be absent.
    // This method will return an Optional containing the User if found, or an empty
    // Optional if no user with the given email exists in the database.
    Optional<User> findByEmail(String email);

    // This method will return true if a user with the given email exists in the
    // database, and false otherwise.
    boolean existsByEmail(String email);
    

}
