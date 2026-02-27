package com.weatherapp.repository;

import com.weatherapp.model.WeatherRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WeatherRecordRepository extends JpaRepository<WeatherRecord, Long> {
    List<WeatherRecord> findByQueryIdOrderByRecordDateAsc(Long queryId);
    void deleteByQueryId(Long queryId);
}
