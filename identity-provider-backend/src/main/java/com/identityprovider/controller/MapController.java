package com.identityprovider.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/maps")
@RequiredArgsConstructor
@Tag(name = "Cartes", description = "API pour la gestion des cartes")
@CrossOrigin(origins = "*")
public class MapController {

    @Value("${app.map.tile-server-url:http://localhost:8081}")
    private String tileServerUrl;

    @GetMapping("/config")
    @Operation(summary = "Récupérer la configuration de la carte")
    public ResponseEntity<Map<String, Object>> getMapConfig() {
        Map<String, Object> config = new HashMap<>();

        // Configuration de la carte pour Antananarivo
        Map<String, Double> center = new HashMap<>();
        center.put("lat", -18.8792);
        center.put("lng", 47.5079);

        config.put("center", center);
        config.put("zoom", 13);
        config.put("tileServerUrl", tileServerUrl);
        config.put("tileUrl", tileServerUrl + "/tile/{z}/{x}/{y}.png");
        config.put("attribution", "© OpenStreetMap contributors via Local Tile Server");

        return ResponseEntity.ok(config);
    }

    @GetMapping("/tile-server-status")
    @Operation(summary = "Vérifier le statut du serveur de tuiles")
    public ResponseEntity<Map<String, String>> getTileServerStatus() {
        Map<String, String> status = new HashMap<>();
        status.put("url", tileServerUrl);
        status.put("status", "active");
        status.put("city", "Antananarivo");

        return ResponseEntity.ok(status);
    }
}
