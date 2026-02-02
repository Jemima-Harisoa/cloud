package com.identityprovider.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(name = "first_name")
    private String firstName;
    
    @Column(name = "last_name")
    private String lastName;
    
    @Column(name = "phone_number")
    private String phoneNumber;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private UserRole role = UserRole.USER;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;
    
    @Column(name = "is_blocked")
    @Builder.Default
    private Boolean isBlocked = false;
    
    @Column(name = "failed_login_attempts")
    @Builder.Default
    private Integer failedLoginAttempts = 0;
    
    @Column(name = "blocked_until")
    private LocalDateTime blockedUntil;
    
    @Column(name = "last_login")
    private LocalDateTime lastLogin;
    
    @Column(name = "firebase_uid")
    private String firebaseUid;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (failedLoginAttempts == null) {
            failedLoginAttempts = 0;
        }
        if (isBlocked == null) {
            isBlocked = false;
        }
        if (isActive == null) {
            isActive = true;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
