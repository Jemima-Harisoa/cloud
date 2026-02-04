package com.identityprovider.service;

import com.identityprovider.dto.RoadIssueRequest;
import com.identityprovider.dto.RoadIssueResponse;
import com.identityprovider.dto.RoadIssueStatsResponse;
import com.identityprovider.entity.RoadIssue;
import com.identityprovider.entity.User;
import com.identityprovider.exception.UserNotFoundException;
import com.identityprovider.repository.RoadIssueRepository;
import com.identityprovider.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoadIssueService {

    @Autowired
    private RoadIssueRepository roadIssueRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void migrateData() {
        try {
            // Drop legacy check constraint that prevents English status names
            jdbcTemplate.execute("ALTER TABLE road_issues DROP CONSTRAINT IF EXISTS road_issues_status_check");
            
            jdbcTemplate.execute("UPDATE road_issues SET status = 'NEW' WHERE status IN ('NOUVEAU', 'Nouveau', 'nouveau')");
            jdbcTemplate.execute("UPDATE road_issues SET status = 'IN_PROGRESS' WHERE status IN ('EN_COURS', 'En cours', 'en cours')");
            jdbcTemplate.execute("UPDATE road_issues SET status = 'COMPLETED' WHERE status IN ('TERMINE', 'Terminé', 'terminé', 'Termine')");
        } catch (Exception e) {
            System.err.println("Migration skipped: " + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public List<RoadIssueResponse> getAllIssues() {
        return roadIssueRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RoadIssueResponse> getIssuesByReporter(Long reporterId) {
        User reporter = userRepository.findById(reporterId)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé"));
        return roadIssueRepository.findByReporter(reporter).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RoadIssueResponse> getIssuesByStatus(RoadIssue.IssueStatus status) {
        return roadIssueRepository.findByStatus(status.name()).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RoadIssueResponse getIssueById(Long id) {
        RoadIssue issue = roadIssueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Signalement non trouvé"));
        return convertToResponse(issue);
    }

    @Transactional
    public RoadIssueResponse createIssue(RoadIssueRequest request, Long reporterId) {
        System.out.println("Creating issue for reporterId: " + reporterId);
        System.out.println("Request Title: " + request.getTitle());
        
        User reporter = userRepository.findById(reporterId)
                .orElseThrow(() -> {
                    System.err.println("User NOT FOUND: " + reporterId);
                    return new UserNotFoundException("Utilisateur non trouvé");
                });

        RoadIssue issue = new RoadIssue();
        issue.setLatitude(request.getLatitude());
        issue.setLongitude(request.getLongitude());
        issue.setTitle(request.getTitle());
        issue.setDescription(request.getDescription());
        issue.setStatus(request.getStatus() != null ? request.getStatus() : RoadIssue.IssueStatus.NEW);
        issue.setSurfaceM2(request.getSurfaceM2());
        issue.setBudget(request.getBudget());
        issue.setCompanyName(request.getCompanyName());
        issue.setPhotoUrl(request.getPhotoUrl());
        issue.setReporter(reporter);

        RoadIssue savedIssue = roadIssueRepository.save(issue);
        return convertToResponse(savedIssue);
    }

    @Transactional
    public RoadIssueResponse updateIssue(Long id, RoadIssueRequest request, Long requesterId, String role) {
        RoadIssue issue = roadIssueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Signalement non trouvé"));

        // Vérifier les permissions : Manager ou Propriétaire
        boolean isManager = "MANAGER".equalsIgnoreCase(role);
        boolean isOwner = issue.getReporter() != null && issue.getReporter().getId().equals(requesterId);

        if (!isManager && !isOwner) {
            throw new RuntimeException("Vous n'avez pas l'autorisation de modifier ce signalement");
        }

        if (request.getLatitude() != null)
            issue.setLatitude(request.getLatitude());
        if (request.getLongitude() != null)
            issue.setLongitude(request.getLongitude());
        if (request.getTitle() != null)
            issue.setTitle(request.getTitle());
        if (request.getDescription() != null)
            issue.setDescription(request.getDescription());
        if (request.getStatus() != null)
            issue.setStatus(request.getStatus());
        if (request.getSurfaceM2() != null)
            issue.setSurfaceM2(request.getSurfaceM2());
        if (request.getBudget() != null)
            issue.setBudget(request.getBudget());
        if (request.getCompanyName() != null)
            issue.setCompanyName(request.getCompanyName());
        if (request.getPhotoUrl() != null)
            issue.setPhotoUrl(request.getPhotoUrl());

        RoadIssue updatedIssue = roadIssueRepository.save(issue);
        return convertToResponse(updatedIssue);
    }

    @Transactional
    public void deleteIssue(Long id, Long requesterId, String role) {
        RoadIssue issue = roadIssueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Signalement non trouvé"));

        // Vérifier les permissions : Manager ou Propriétaire
        boolean isManager = "MANAGER".equalsIgnoreCase(role);
        boolean isOwner = issue.getReporter() != null && issue.getReporter().getId().equals(requesterId);

        if (!isManager && !isOwner) {
            throw new RuntimeException("Vous n'avez pas l'autorisation de supprimer ce signalement");
        }

        roadIssueRepository.deleteById(id);
    }

    @Transactional
    public void deleteIssuesBulk(List<Long> ids, Long requesterId, String role) {
        // Seul le manager peut faire des suppressions groupées pour l'instant (ou le proprio de tous les signalements selectionnés)
        boolean isManager = "MANAGER".equalsIgnoreCase(role);
        
        for (Long id : ids) {
            RoadIssue issue = roadIssueRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Signalement " + id + " non trouvé"));
            
            boolean isOwner = issue.getReporter() != null && issue.getReporter().getId().equals(requesterId);
            
            if (!isManager && !isOwner) {
                throw new RuntimeException("Vous n'avez pas l'autorisation de supprimer le signalement " + id);
            }
            roadIssueRepository.deleteById(id);
        }
    }

    @Transactional
    public void updateIssuesStatusBulk(List<Long> ids, RoadIssue.IssueStatus status, String role) {
        if (!"MANAGER".equalsIgnoreCase(role)) {
            throw new RuntimeException("Seul le manager peut effectuer des mises à jour groupées");
        }

        for (Long id : ids) {
            RoadIssue issue = roadIssueRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Signalement " + id + " non trouvé"));
            issue.setStatus(status);
            roadIssueRepository.save(issue);
        }
    }

    @Transactional(readOnly = true)
    public RoadIssueStatsResponse getStatistics() {
        Long totalIssues = roadIssueRepository.countAllIssues();
        Double totalSurface = roadIssueRepository.sumTotalSurface();
        Double totalBudget = roadIssueRepository.sumTotalBudget();
        Long completedIssues = roadIssueRepository.countCompletedIssues();

        return new RoadIssueStatsResponse(totalIssues, totalSurface, totalBudget, completedIssues);
    }

    @Transactional
    public List<RoadIssueResponse> syncFromFirebase() {
        // TODO: Implement Firebase sync logic
        // For now, return unsynchronized issues
        return roadIssueRepository.findBySyncedToFirebase(false).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void markAsSynced(Long id, String firebaseId) {
        RoadIssue issue = roadIssueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Signalement non trouvé"));
        issue.setFirebaseId(firebaseId);
        issue.setSyncedToFirebase(true);
        roadIssueRepository.save(issue);
    }

    private RoadIssueResponse convertToResponse(RoadIssue issue) {
        RoadIssueResponse response = new RoadIssueResponse();
        response.setId(issue.getId());
        response.setLatitude(issue.getLatitude());
        response.setLongitude(issue.getLongitude());
        response.setTitle(issue.getTitle());
        response.setDescription(issue.getDescription());
        response.setStatus(issue.getStatus());
        response.setSurfaceM2(issue.getSurfaceM2());
        response.setBudget(issue.getBudget());
        response.setCompanyName(issue.getCompanyName());
        response.setPhotoUrl(issue.getPhotoUrl());
        response.setCreatedAt(issue.getCreatedAt());
        response.setUpdatedAt(issue.getUpdatedAt());
        response.setFirebaseId(issue.getFirebaseId());
        response.setSyncedToFirebase(issue.getSyncedToFirebase());

        if (issue.getReporter() != null) {
            response.setReporterId(issue.getReporter().getId());
            response.setReporterEmail(issue.getReporter().getEmail());
        }

        return response;
    }
}
