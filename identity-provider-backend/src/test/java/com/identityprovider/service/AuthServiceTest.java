package com.identityprovider.service;

import com.identityprovider.config.JwtTokenProvider;
import com.identityprovider.dto.AuthResponse;
import com.identityprovider.dto.LoginRequest;
import com.identityprovider.entity.User;
import com.identityprovider.exception.AuthenticationException;
import com.identityprovider.exception.UserBlockedException;
import com.identityprovider.repository.SessionRepository;
import com.identityprovider.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private SessionRepository sessionRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
        // Configure mocks
        when(jwtTokenProvider.generateToken(anyString(), anyLong())).thenReturn("mocked-jwt-token");
        
        // Set up configuration values using ReflectionTestUtils
        ReflectionTestUtils.setField(authService, "maxLoginAttempts", 3);
        ReflectionTestUtils.setField(authService, "sessionDuration", 86400L); // 24 hours
    }

    @Test
    void login_Successful() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setEmail("manager@roadworks.mg");
        request.setPassword("Password123!");

        User user = new User();
        user.setEmail("manager@roadworks.mg");
        user.setPassword("$2a$10$XQjZ0ZQ3Z9Z0Z0Z0Z0Z0ZeJ0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0");
        user.setIsBlocked(false);

        when(userRepository.findByEmail("manager@roadworks.mg")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("Password123!", user.getPassword())).thenReturn(true);

        // Act
        AuthResponse response = authService.login(request);

        // Assert
        assertNotNull(response);
        verify(userRepository, times(1)).findByEmail("manager@roadworks.mg");
        verify(passwordEncoder, times(1)).matches("Password123!", user.getPassword());
    }

    @Test
    void login_UserNotFound() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setEmail("unknown@roadworks.mg");
        request.setPassword("Password123!");

        when(userRepository.findByEmail("unknown@roadworks.mg")).thenReturn(Optional.empty());

        // Act & Assert
        AuthenticationException exception = assertThrows(AuthenticationException.class, () -> authService.login(request));
        assertEquals("Email ou mot de passe incorrect", exception.getMessage());
        verify(userRepository, times(1)).findByEmail("unknown@roadworks.mg");
    }

    @Test
    void login_IncorrectPassword() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setEmail("manager@roadworks.mg");
        request.setPassword("WrongPassword!");

        User user = new User();
        user.setEmail("manager@roadworks.mg");
        user.setPassword("$2a$10$XQjZ0ZQ3Z9Z0Z0Z0Z0Z0ZeJ0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0");
        user.setIsBlocked(false);

        when(userRepository.findByEmail("manager@roadworks.mg")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("WrongPassword!", user.getPassword())).thenReturn(false);

        // Act & Assert
        AuthenticationException exception = assertThrows(AuthenticationException.class, () -> authService.login(request));
        assertEquals("Email ou mot de passe incorrect", exception.getMessage());
        verify(userRepository, times(1)).findByEmail("manager@roadworks.mg");
        verify(passwordEncoder, times(1)).matches("WrongPassword!", user.getPassword());
    }

    @Test
    void login_UserBlocked() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setEmail("manager@roadworks.mg");
        request.setPassword("Password123!");

        User user = new User();
        user.setEmail("manager@roadworks.mg");
        user.setPassword("$2a$10$XQjZ0ZQ3Z9Z0Z0Z0Z0Z0ZeJ0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0");
        user.setIsBlocked(true);

        when(userRepository.findByEmail("manager@roadworks.mg")).thenReturn(Optional.of(user));

        // Act & Assert
        UserBlockedException exception = assertThrows(UserBlockedException.class, () -> authService.login(request));
        assertEquals("Votre compte est bloqué. Contactez l'administrateur.", exception.getMessage());
        verify(userRepository, times(1)).findByEmail("manager@roadworks.mg");
    }
}