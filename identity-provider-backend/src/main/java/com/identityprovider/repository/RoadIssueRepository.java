package com.identityprovider.repository;

import com.identityprovider.entity.RoadIssue;
import com.identityprovider.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoadIssueRepository extends JpaRepository<RoadIssue, Long> {

    List<RoadIssue> findByReporter(User reporter);

    List<RoadIssue> findByStatus(String status);

    List<RoadIssue> findBySyncedToFirebase(Boolean synced);

    @Query("SELECT COUNT(i) FROM RoadIssue i")
    Long countAllIssues();

    @Query("SELECT COALESCE(SUM(i.surfaceM2), 0) FROM RoadIssue i")
    Double sumTotalSurface();

    @Query("SELECT COALESCE(SUM(i.budget), 0) FROM RoadIssue i")
    Double sumTotalBudget();

    @Query("SELECT COUNT(i) FROM RoadIssue i WHERE i.status = 'COMPLETED'")
    Long countCompletedIssues();
}
