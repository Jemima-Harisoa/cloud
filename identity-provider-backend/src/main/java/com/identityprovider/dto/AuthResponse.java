package com.identityprovider.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private String type = "Bearer";
    private UserResponse user;
    private long expiresIn = 86400000; // 24 heures en millisecondes

    public AuthResponse(String token, UserResponse user) {
        this.token = token;
        this.user = user;
        this.type = "Bearer";
        this.expiresIn = 86400000;
    }
}
