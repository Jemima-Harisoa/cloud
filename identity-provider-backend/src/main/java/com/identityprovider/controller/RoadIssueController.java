package com.identityprovider.controller;

import com.identityprovider.dto.RoadIssueRequest;
import com.identityprovider.dto.RoadIssueResponse;
import com.identityprovider.dto.RoadIssueStatsResponse;
import com.identityprovider.entity.RoadIssue;
import com.identityprovider.service.RoadIssueService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/road-issues")
@CrossOrigin(origins = "*")
@Tag(name = "Road Issues", description = "API de gestion des signalements de travaux routiers")
public class RoadIssueController {

    @Autowired
    private RoadIssueService roadIssueService;

    @GetMapping
    @Operation(summary = "Récupérer tous les signalements")
    public ResponseEntity<List<RoadIssueResponse>> getAllIssues(
            @RequestParam(required = false) Long reporterId,
            @RequestParam(required = false) RoadIssue.IssueStatus status) {

        List<RoadIssueResponse> issues;

        if (reporterId != null) {
            issues = roadIssueService.getIssuesByReporter(reporterId);
        } else if (status != null) {
            issues = roadIssueService.getIssuesByStatus(status);
        } else {
            issues = roadIssueService.getAllIssues();
        }

        return ResponseEntity.ok(issues);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Récupérer un signalement par ID")
    public ResponseEntity<RoadIssueResponse> getIssueById(@PathVariable Long id) {
        RoadIssueResponse issue = roadIssueService.getIssueById(id);
        return ResponseEntity.ok(issue);
    }

    @PostMapping
    @Operation(summary = "Créer un nouveau signalement")
    public ResponseEntity<RoadIssueResponse> createIssue(
            @RequestBody RoadIssueRequest request,
            @RequestParam Long reporterId) {
        RoadIssueResponse createdIssue = roadIssueService.createIssue(request, reporterId);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdIssue);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Modifier un signalement")
    public ResponseEntity<RoadIssueResponse> updateIssue(
            @PathVariable Long id,
            @RequestBody RoadIssueRequest request) {
        RoadIssueResponse updatedIssue = roadIssueService.updateIssue(id, request);
        return ResponseEntity.ok(updatedIssue);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer un signalement")
    public ResponseEntity<Void> deleteIssue(@PathVariable Long id) {
        roadIssueService.deleteIssue(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats")
    @Operation(summary = "Récupérer les statistiques des signalements")
    public ResponseEntity<RoadIssueStatsResponse> getStatistics() {
        RoadIssueStatsResponse stats = roadIssueService.getStatistics();
        return ResponseEntity.ok(stats);
    }

    @PostMapping("/sync")
    @Operation(summary = "Synchroniser avec Firebase")
    public ResponseEntity<List<RoadIssueResponse>> syncWithFirebase() {
        List<RoadIssueResponse> unsyncedIssues = roadIssueService.syncFromFirebase();
        return ResponseEntity.ok(unsyncedIssues);
    }

    @PostMapping("/{id}/mark-synced")
    @Operation(summary = "Marquer un signalement comme synchronisé")
    public ResponseEntity<Void> markAsSynced(
            @PathVariable Long id,
            @RequestParam String firebaseId) {
        roadIssueService.markAsSynced(id, firebaseId);
        return ResponseEntity.ok().build();
    }
}
