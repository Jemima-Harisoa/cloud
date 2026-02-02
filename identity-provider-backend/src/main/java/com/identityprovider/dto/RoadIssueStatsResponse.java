package com.identityprovider.dto;

public class RoadIssueStatsResponse {
    private Long totalIssues;
    private Double totalSurfaceM2;
    private Double totalBudget;
    private Long completedIssues;
    private Double completionPercentage;

    public RoadIssueStatsResponse() {
    }

    public RoadIssueStatsResponse(Long totalIssues, Double totalSurfaceM2, Double totalBudget, Long completedIssues) {
        this.totalIssues = totalIssues;
        this.totalSurfaceM2 = totalSurfaceM2;
        this.totalBudget = totalBudget;
        this.completedIssues = completedIssues;
        this.completionPercentage = totalIssues > 0 ? (completedIssues * 100.0 / totalIssues) : 0.0;
    }

    // Getters and Setters
    public Long getTotalIssues() {
        return totalIssues;
    }

    public void setTotalIssues(Long totalIssues) {
        this.totalIssues = totalIssues;
    }

    public Double getTotalSurfaceM2() {
        return totalSurfaceM2;
    }

    public void setTotalSurfaceM2(Double totalSurfaceM2) {
        this.totalSurfaceM2 = totalSurfaceM2;
    }

    public Double getTotalBudget() {
        return totalBudget;
    }

    public void setTotalBudget(Double totalBudget) {
        this.totalBudget = totalBudget;
    }

    public Long getCompletedIssues() {
        return completedIssues;
    }

    public void setCompletedIssues(Long completedIssues) {
        this.completedIssues = completedIssues;
    }

    public Double getCompletionPercentage() {
        return completionPercentage;
    }

    public void setCompletionPercentage(Double completionPercentage) {
        this.completionPercentage = completionPercentage;
    }
}
