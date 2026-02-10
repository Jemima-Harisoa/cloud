package com.identityprovider.controller;

import com.identityprovider.service.FirebaseSyncService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/sync")
@RequiredArgsConstructor
public class FirebaseSyncController {

    private final FirebaseSyncService firebaseSyncService;

    /**
     * Trigger manual sync of all road issues to Firebase
     * Only accessible by MANAGER role
     */
    @PostMapping("/firebase")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Map<String, String>> syncToFirebase() {
        firebaseSyncService.syncAllRoadIssuesToFirebase();
        return ResponseEntity.ok(Map.of(
                "message", "Synchronization to Firebase started",
                "status", "success"
        ));
    }

    /**
     * Get sync status between local database and Firebase
     */
    @GetMapping("/status")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Map<String, Object>> getSyncStatus() {
        Map<String, Object> status = firebaseSyncService.getSyncStatus();
        return ResponseEntity.ok(status);
    }

    /**
     * Start listening to Firebase changes
     * This will enable real-time sync from Firebase to local database
     */
    @PostMapping("/listen")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Map<String, String>> startListening() {
        firebaseSyncService.listenToFirebaseChanges();
        return ResponseEntity.ok(Map.of(
                "message", "Started listening to Firebase changes",
                "status", "success"
        ));
    }
}
