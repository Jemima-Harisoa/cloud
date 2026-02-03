package com.identityprovider.config;

import com.identityprovider.entity.User;
import com.identityprovider.entity.UserRole;
import com.identityprovider.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail("manager@example.com")) {
            User manager = User.builder()
                    .email("manager@example.com")
                    .password(passwordEncoder.encode("Manager@123"))
                    .firstName("Test")
                    .lastName("Manager")
                    .role(UserRole.MANAGER)
                    .isActive(true)
                    .isBlocked(false)
                    .build();
            userRepository.save(manager);
            System.out.println("Utilisateur Manager créé par défaut.");
        }
    }
}
