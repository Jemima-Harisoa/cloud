package com.identityprovider.service;

import com.identityprovider.config.JwtTokenProvider;
import com.identityprovider.dto.*;
import com.identityprovider.entity.Session;
import com.identityprovider.entity.User;
import com.identityprovider.exception.AuthenticationException;
import com.identityprovider.exception.UserBlockedException;
import com.identityprovider.exception.UserNotFoundException;
import com.identityprovider.repository.SessionRepository;
import com.identityprovider.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final SessionRepository sessionRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Value("${app.auth.max-login-attempts}")
    private int maxLoginAttempts;

    @Value("${app.auth.session-duration}")
    private long sessionDuration;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AuthenticationException("Un compte avec cet email existe déjà");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setIsActive(true);
        user.setIsBlocked(false);
        user.setFailedLoginAttempts(0);

        // Définir le rôle sélectionné (par défaut USER si non spécifié)
        if (request.getRole() != null && !request.getRole().isEmpty()) {
            try {
                user.setRole(com.identityprovider.entity.UserRole.valueOf(request.getRole().toUpperCase()));
            } catch (IllegalArgumentException e) {
                user.setRole(com.identityprovider.entity.UserRole.USER);
            }
        } else {
            user.setRole(com.identityprovider.entity.UserRole.USER);
        }

        user = userRepository.save(user);

        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getId());
        createSession(user, token);

        return new AuthResponse(token, mapToUserResponse(user));
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AuthenticationException("Email ou mot de passe incorrect"));

        if (user.getIsBlocked()) {
            throw new UserBlockedException("Votre compte est bloqué. Contactez l'administrateur.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            handleFailedLogin(user);
            throw new AuthenticationException("Email ou mot de passe incorrect");
        }

        user.setFailedLoginAttempts(0);
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getId());
        createSession(user, token);

        return new AuthResponse(token, mapToUserResponse(user));
    }

    @Transactional
    public void logout(String token) {
        Session session = sessionRepository.findByToken(token)
                .orElseThrow(() -> new AuthenticationException("Session invalide"));

        session.setIsActive(false);
        sessionRepository.save(session);
    }

    @Transactional
    public UserResponse updateUser(Long userId, UpdateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé"));

        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());
        if (request.getPhoneNumber() != null) user.setPhoneNumber(request.getPhoneNumber());

        user = userRepository.save(user);
        return mapToUserResponse(user);
    }

    public UserResponse getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé"));
        return mapToUserResponse(user);
    }

    @Transactional
    public void unblockUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé"));

        user.setIsBlocked(false);
        user.setFailedLoginAttempts(0);
        userRepository.save(user);
    }

    public List<UserResponse> getBlockedUsers() {
        return userRepository.findByIsBlocked(true).stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    private void handleFailedLogin(User user) {
        int attempts = user.getFailedLoginAttempts() + 1;
        user.setFailedLoginAttempts(attempts);

        if (attempts >= maxLoginAttempts) {
            user.setIsBlocked(true);
        }

        userRepository.save(user);
    }

    private void createSession(User user, String token) {
        Session session = new Session();
        session.setUser(user);
        session.setToken(token);
        session.setExpiresAt(LocalDateTime.now().plusSeconds(sessionDuration));
        session.setIsActive(true);

        sessionRepository.save(session);
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole().toString())
                .isActive(user.getIsActive())
                .isBlocked(user.getIsBlocked())
                .createdAt(user.getCreatedAt())
                .lastLogin(user.getLastLogin())
                .build();
    }
}
