package com.cherifyedeshemdenebenhamed.demo.repository;

import com.cherifyedeshemdenebenhamed.demo.model.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {}
