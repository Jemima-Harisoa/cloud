package com.identityprovider.controller;

import com.identityprovider.dto.*;
import com.identityprovider.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentification", description = "API d'authentification et de gestion des utilisateurs")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Inscription d'un nouvel utilisateur")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    @Operation(summary = "Connexion d'un utilisateur")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    @Operation(summary = "Déconnexion d'un utilisateur")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        authService.logout(token);
        return ResponseEntity.ok("Déconnexion réussie");
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Récupérer les informations d'un utilisateur")
    public ResponseEntity<UserResponse> getUser(@PathVariable Long userId) {
        UserResponse response = authService.getUserById(userId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/user/{userId}")
    @Operation(summary = "Mettre à jour les informations d'un utilisateur")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long userId,
            @Valid @RequestBody UpdateUserRequest request) {
        UserResponse response = authService.updateUser(userId, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/unblock/{userId}")
    @Operation(summary = "Débloquer un utilisateur", description = "Réinitialise le blocage pour un utilisateur donné")
    public ResponseEntity<String> unblockUser(@PathVariable Long userId) {
        authService.unblockUser(userId);
        return ResponseEntity.ok("Utilisateur débloqué avec succès");
    }

    @PostMapping("/block/{userId}")
    @Operation(summary = "Bloquer un utilisateur", description = "Bloque l'accès pour un utilisateur donné")
    public ResponseEntity<String> blockUser(@PathVariable Long userId) {
        authService.blockUser(userId);
        return ResponseEntity.ok("Utilisateur bloqué avec succès");
    }

    @GetMapping("/blocked-users")
    @Operation(summary = "Récupérer tous les utilisateurs bloqués")
    public ResponseEntity<java.util.List<UserResponse>> getBlockedUsers() {
        java.util.List<UserResponse> blockedUsers = authService.getBlockedUsers();
        return ResponseEntity.ok(blockedUsers);
    }

    @GetMapping("/users")
    @Operation(summary = "Récupérer tous les utilisateurs")
    public ResponseEntity<java.util.List<UserResponse>> getAllUsers() {
        java.util.List<UserResponse> users = authService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/pending-users")
    @Operation(summary = "Récupérer les utilisateurs en attente de validation")
    public ResponseEntity<java.util.List<UserResponse>> getPendingUsers() {
        java.util.List<UserResponse> pendingUsers = authService.getPendingUsers();
        return ResponseEntity.ok(pendingUsers);
    }

    @PostMapping("/activate/{userId}")
    @Operation(summary = "Activer un utilisateur", description = "Valide l'inscription d'un utilisateur")
    public ResponseEntity<String> activateUser(@PathVariable Long userId) {
        authService.activateUser(userId);
        return ResponseEntity.ok("Utilisateur activé avec succès");
    }
}
