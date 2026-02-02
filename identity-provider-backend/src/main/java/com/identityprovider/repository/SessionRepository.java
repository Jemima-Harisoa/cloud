package com.identityprovider.repository;

import com.identityprovider.entity.Session;
import com.identityprovider.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {
    
    Optional<Session> findByToken(String token);
    
    Optional<Session> findByTokenAndIsActiveTrue(String token);
    
    List<Session> findByUserAndIsActiveTrue(User user);
    
    void deleteByExpiresAtBefore(LocalDateTime dateTime);
    
    void deleteByUserAndIsActiveTrue(User user);
}
