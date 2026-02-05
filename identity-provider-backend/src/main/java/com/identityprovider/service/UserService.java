package com.identityprovider.service;

import com.identityprovider.dto.UpdateUserRequest;
import com.identityprovider.dto.UserResponse;
import com.identityprovider.entity.User;
import com.identityprovider.exception.AuthenticationException;
import com.identityprovider.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AuthenticationException("Utilisateur non trouvé"));
        return convertToUserResponse(user);
    }
    
    @Transactional
    public UserResponse updateUser(Long userId, UpdateUserRequest request) {
        log.info("Mise à jour de l'utilisateur: {}", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AuthenticationException("Utilisateur non trouvé"));
        
        // Vérifier le mot de passe actuel
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new AuthenticationException("Mot de passe actuel incorrect");
        }
        
        // Mettre à jour les informations
        if (request.getFirstName() != null && !request.getFirstName().isEmpty()) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null && !request.getLastName().isEmpty()) {
            user.setLastName(request.getLastName());
        }
        if (request.getPhoneNumber() != null && !request.getPhoneNumber().isEmpty()) {
            user.setPhoneNumber(request.getPhoneNumber());
        }
        
        // Changer le mot de passe si fourni
        if (request.getNewPassword() != null && !request.getNewPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }
        
        user = userRepository.save(user);
        log.info("Utilisateur {} mis à jour avec succès", userId);
        
        return convertToUserResponse(user);
    }
    
    @Transactional
    public void unlockUser(Long userId) {
        log.info("Déverrouillage de l'utilisateur: {}", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AuthenticationException("Utilisateur non trouvé"));
        
        user.setIsBlocked(false);
        user.setFailedLoginAttempts(0);
        user.setBlockedUntil(null);
        
        userRepository.save(user);
        log.info("Utilisateur {} déverrouillé", userId);
        
        // Envoyer la notification par email
        emailService.sendUnblockNotification(user.getEmail(), user.getFirstName());
    }
    
    public UserResponse convertToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phoneNumber(user.getPhoneNumber())
                .isActive(user.getIsActive())
                .isBlocked(user.getIsBlocked())
                .createdAt(user.getCreatedAt())
                .lastLogin(user.getLastLogin())
                .build();
    }
}
