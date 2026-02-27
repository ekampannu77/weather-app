CREATE TABLE historical_queries (
    id                BIGSERIAL PRIMARY KEY,
    input_location    VARCHAR(255) NOT NULL,
    resolved_city     VARCHAR(255),
    resolved_country  VARCHAR(10),
    resolved_state    VARCHAR(100),
    latitude          DECIMAL(9,6) NOT NULL,
    longitude         DECIMAL(9,6) NOT NULL,
    start_date        DATE NOT NULL,
    end_date          DATE NOT NULL,
    avg_temp_celsius  DECIMAL(5,2),
    min_temp_celsius  DECIMAL(5,2),
    max_temp_celsius  DECIMAL(5,2),
    avg_precipitation DECIMAL(6,2),
    avg_wind_speed    DECIMAL(5,2),
    raw_meteo_data    JSONB,
    user_notes        TEXT,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_hq_location ON historical_queries (latitude, longitude);
CREATE INDEX idx_hq_dates ON historical_queries (start_date, end_date);
CREATE INDEX idx_hq_created ON historical_queries (created_at DESC);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON historical_queries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
