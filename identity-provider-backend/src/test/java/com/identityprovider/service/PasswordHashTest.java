package com.identityprovider.service;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;

class PasswordHashTest {

    @Test
    void testRealPasswordHash() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        // Le hash stocké dans votre base de données (mis à jour)
        String storedHash = "$2a$10$iayay4dxDl20Ew3rYZetP.rHyLbs6veopw1lpc0w2wDYeDMTLADqK";
        
        // Le mot de passe que vous essayez
        String plainPassword = "Password123!";
        
        // Test si ils correspondent
        boolean matches = encoder.matches(plainPassword, storedHash);
        
        System.out.println("Mot de passe: " + plainPassword);
        System.out.println("Hash stocké: " + storedHash);
        System.out.println("Correspondance: " + matches);
        
        // Si ce test échoue, c'est que le hash ne correspond pas au mot de passe
        assertTrue(matches, "Le hash stocké ne correspond pas au mot de passe 'Password123!'");
    }
    
    @Test
    void generateCorrectHash() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        // Générer le bon hash pour "Password123!"
        String plainPassword = "Password123!";
        String newHash = encoder.encode(plainPassword);
        
        System.out.println("Nouveau hash généré pour '" + plainPassword + "': " + newHash);
        
        // Vérifier que le nouveau hash correspond
        assertTrue(encoder.matches(plainPassword, newHash), "Le nouveau hash devrait correspondre");
    }
}