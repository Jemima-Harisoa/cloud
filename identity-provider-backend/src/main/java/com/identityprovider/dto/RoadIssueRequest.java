package com.identityprovider.dto;

import com.identityprovider.entity.RoadIssue;

public class RoadIssueRequest {
    private Double latitude;
    private Double longitude;
    private String description;
    private RoadIssue.IssueStatus status;
    private Double surfaceM2;
    private Double budget;
    private String companyName;
    private String photoUrl;

    // Getters and Setters
    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public RoadIssue.IssueStatus getStatus() {
        return status;
    }

    public void setStatus(RoadIssue.IssueStatus status) {
        this.status = status;
    }

    public Double getSurfaceM2() {
        return surfaceM2;
    }

    public void setSurfaceM2(Double surfaceM2) {
        this.surfaceM2 = surfaceM2;
    }

    public Double getBudget() {
        return budget;
    }

    public void setBudget(Double budget) {
        this.budget = budget;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }
}
