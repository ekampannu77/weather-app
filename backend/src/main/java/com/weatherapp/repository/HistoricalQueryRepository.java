package com.weatherapp.repository;

import com.weatherapp.model.HistoricalQuery;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistoricalQueryRepository extends JpaRepository<HistoricalQuery, Long> {

    @Query("SELECT q FROM HistoricalQuery q WHERE " +
           "(:city IS NULL OR LOWER(q.resolvedCity) LIKE LOWER(CONCAT('%', :city, '%'))) " +
           "ORDER BY q.createdAt DESC")
    Page<HistoricalQuery> findAllWithFilter(@Param("city") String city, Pageable pageable);

    List<HistoricalQuery> findAllByOrderByCreatedAtDesc();
}
