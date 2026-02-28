package com.cherifyedeshemdenebenhamed.demo.repository;

import com.cherifyedeshemdenebenhamed.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface usersRepository extends JpaRepository<User, Long> {

    Optional<User> findByFullName(String fullname); //check if fullname exists (using repo)

    /*in login you:
    Check if fullname exists (using repo)
    Then verify the password (in the service layer)*/

            /*Repository should ONLY:
             find user
             save user
             delete user
                It should NOT:
                 compare passwords
                 encode passwords
                 generate JWT
                 validate business rules
            That is the job of the Service layer.*/
}
