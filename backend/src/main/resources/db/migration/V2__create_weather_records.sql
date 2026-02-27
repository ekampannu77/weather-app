CREATE TABLE weather_records (
    id               BIGSERIAL PRIMARY KEY,
    query_id         BIGINT NOT NULL REFERENCES historical_queries(id) ON DELETE CASCADE,
    record_date      DATE NOT NULL,
    temp_max_celsius DECIMAL(5,2),
    temp_min_celsius DECIMAL(5,2),
    precipitation_mm DECIMAL(6,2),
    wind_speed_kmh   DECIMAL(5,2),
    wind_direction   SMALLINT,
    weather_code     SMALLINT,
    sunrise          TIME,
    sunset           TIME,
    UNIQUE (query_id, record_date)
);

CREATE INDEX idx_wr_query ON weather_records (query_id);
CREATE INDEX idx_wr_date ON weather_records (record_date);
