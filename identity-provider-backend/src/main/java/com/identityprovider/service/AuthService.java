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
import com.identityprovider.repository.RoadIssueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final SessionRepository sessionRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final RoadIssueRepository roadIssueRepository;

    @Value("${app.auth.max-login-attempts}")
    private int maxLoginAttempts;

    @Value("${app.auth.session-duration}")
    private long sessionDuration;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Vérifier si l'email existe déjà
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AuthenticationException("Un compte avec cet email existe déjà");
        }

        // Créer le nouvel utilisateur
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setIsActive(true);
        user.setIsBlocked(false);
        user.setFailedLoginAttempts(0);

        user = userRepository.save(user);

        // Générer le token
        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getId());

        // Créer la session
        createSession(user, token);

        return new AuthResponse(token, mapToUserResponse(user));
    }

    @Transactional(noRollbackFor = AuthenticationException.class)
    public AuthResponse login(LoginRequest request) {
        // Trouver l'utilisateur
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AuthenticationException("Email ou mot de passe incorrect"));

        // Vérifier si l'utilisateur est bloqué
        if (user.getIsBlocked()) {
            throw new UserBlockedException("Votre compte est bloqué. Contactez l'administrateur.");
        }

        // Vérifier le mot de passe
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            int currentAttempts = handleFailedLogin(user);
            int remaining = maxLoginAttempts - currentAttempts;
            
            String message = "Email ou mot de passe incorrect";
            if (remaining > 0) {
                message += " (Tentative " + currentAttempts + "/" + maxLoginAttempts + ")";
            }
            throw new AuthenticationException(message);
        }

        // Réinitialiser les tentatives échouées
        user.setFailedLoginAttempts(0);
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        // Générer le token
        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getId());

        // Créer la session
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

        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }
        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber());
        }

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

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé"));

        // 1. Supprimer toutes les sessions de l'utilisateur
        sessionRepository.deleteByUser(user);

        // 2. Anonymiser les signalements (mettre reporter à NULL au lieu de les supprimer pour garder l'historique de la carte)
        com.identityprovider.entity.RoadIssue.IssueStatus status; // dummy to ensure RoadIssue is available if needed, but we use injected repo
        roadIssueRepository.findByReporter(user).forEach(issue -> {
            issue.setReporter(null);
            roadIssueRepository.save(issue);
        });

        // 3. Supprimer l'utilisateur
        userRepository.delete(user);
    }

    public java.util.List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToUserResponse)
                .collect(java.util.stream.Collectors.toList());
    }

    public java.util.List<UserResponse> getBlockedUsers() {
        return userRepository.findByIsBlocked(true).stream()
                .map(this::mapToUserResponse)
                .collect(java.util.stream.Collectors.toList());
    }

    private int handleFailedLogin(User user) {
        // Ne pas appliquer de limite si c'est le manager
        if (user.getRole() == com.identityprovider.entity.UserRole.MANAGER || 
            "manager@example.com".equals(user.getEmail())) {
            System.out.println("Échec de connexion pour le Manager " + user.getEmail() + " : Pas de blocage appliqué.");
            return 0;
        }

        int attempts = user.getFailedLoginAttempts() + 1;
        user.setFailedLoginAttempts(attempts);
        System.out.println("Échec de connexion pour " + user.getEmail() + " : " + attempts + "/" + maxLoginAttempts);

        if (attempts >= maxLoginAttempts) {
            user.setIsBlocked(true);
            System.out.println("UTILISATEUR BLOQUÉ : " + user.getEmail());
        }

        userRepository.save(user);
        userRepository.flush(); // Force l'écriture immédiate avant l'exception
        return attempts;
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
