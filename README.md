# Real-Time Weather App

A full-stack weather application built for the **PM Accelerator AI Engineer Intern Technical Assessment**. It combines real-time weather data, historical query management, animated weather backgrounds, and multi-format data export in a single deployable project.

**Built by:** Ekamnoor Singh Pannu — Computer Science Student at York University

---

## About PM Accelerator

PM Accelerator is a product management training and career accelerator program. This project was developed as part of their AI/ML Engineer Intern technical assessment, demonstrating full-stack development skills across frontend, backend, database, and third-party API integrations.

---

## Features

### Tech Assessment #1 — Frontend
- Search by city name, ZIP code, GPS coordinates, or landmark
- Real-time current weather (temperature, humidity, wind speed, weather icons)
- 5-day forecast with daily breakdowns
- Geolocation support ("Use My Location")
- Animated weather backgrounds that change based on live conditions (rain, snow, sun, thunderstorm, fog, clouds)
- Clothing suggestions powered by AI (Claude API)
- Dark mode support
- °C / °F unit toggle
- Last searched city persisted in localStorage

### Tech Assessment #2 — Backend
- Full CRUD for historical weather queries (PostgreSQL + Spring Data JPA)
- RESTful API with pagination, filtering, and validation
- Stores avg/min/max temperature, precipitation, wind speed per query
- Flyway database migrations
- Swagger UI for API documentation

### Additional Integrations
- **YouTube Data API v3** — embeds location-relevant travel/weather videos
- **Google Maps Embed API** — shows an interactive map for the searched location
- **Open-Meteo API** — free historical weather data (no API key required)
- **OpenWeatherMap API** — current weather and 5-day forecast

### Data Export
Exports the full historical query list in 5 formats:
- JSON, CSV, XML, PDF, Markdown

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, TypeScript, Tailwind CSS |
| Backend | Java 21, Spring Boot 3.2, Maven |
| Database | PostgreSQL 16 (Docker) |
| ORM / Migrations | Spring Data JPA, Flyway |
| HTTP Client | Axios (frontend), WebClient (backend) |
| State / Cache | TanStack React Query |
| Forms | React Hook Form + Zod |
| PDF Export | iText PDF |
| CSV Export | OpenCSV |

---

## Prerequisites

- **Node.js** 18+ and **npm**
- **Java 21** (`/usr/libexec/java_home -v 21` on macOS)
- **Maven 3.9+**
- **Docker** (for PostgreSQL)
- API keys for: OpenWeatherMap, YouTube Data API v3, Google Maps Embed API

---

## Setup & Running

### 1. Clone the repository

```bash
git clone https://github.com/ekampannu77/weather-app.git
cd weather-app
```

### 2. Start the Database (Docker)

```bash
cd backend
docker-compose up -d
```

This starts PostgreSQL 16 on port `5432` with database `weatherapp`. Flyway migrations run automatically on backend startup.

### 3. Configure Backend Environment Variables

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` and fill in your API keys:

```env
DB_URL=jdbc:postgresql://localhost:5432/weatherapp
DB_USERNAME=postgres
DB_PASSWORD=postgres

OWM_API_KEY=your_openweathermap_api_key_here
YOUTUBE_API_KEY=your_youtube_data_api_v3_key_here
GOOGLE_MAPS_API_KEY=your_google_maps_embed_api_key_here

SERVER_PORT=8080
ALLOWED_ORIGINS=http://localhost:3000
```

### 4. Start the Backend

```bash
# macOS — source .env vars and run Maven
cd backend
set -a && source .env && set +a
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
mvn spring-boot:run
```

Backend runs at `http://localhost:8080`
Swagger UI: `http://localhost:8080/swagger-ui.html`

### 5. Configure Frontend Environment Variables

```bash
cp frontend/.env.example frontend/.env.local
```

`frontend/.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
```

### 6. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/weather?q={query}` | Current weather by city/ZIP/coords/landmark |
| GET | `/api/v1/weather/forecast?q={query}` | 5-day forecast |
| GET | `/api/v1/queries` | List historical queries (paginated) |
| POST | `/api/v1/queries` | Create a new historical query |
| PUT | `/api/v1/queries/{id}` | Update a query |
| DELETE | `/api/v1/queries/{id}` | Delete a query |
| GET | `/api/v1/export?format=json\|csv\|xml\|pdf\|markdown` | Export all queries |
| GET | `/api/v1/export/{id}?format=...` | Export a single query |
| GET | `/api/v1/media/youtube?location={name}` | YouTube videos for a location |
| GET | `/api/v1/health` | Health check |

---

## Project Structure

```
weather-app/
├── backend/                    # Spring Boot backend
│   ├── src/main/java/com/weatherapp/
│   │   ├── controller/         # REST controllers
│   │   ├── service/            # Business logic + external API calls
│   │   ├── model/              # JPA entities (HistoricalQuery, WeatherRecord)
│   │   ├── repository/         # Spring Data JPA repos
│   │   ├── dto/                # Request/response DTOs
│   │   ├── config/             # CORS, WebClient config
│   │   └── exception/          # Global exception handler
│   ├── src/main/resources/
│   │   ├── db/migration/       # Flyway SQL migrations
│   │   └── application.yml     # Spring configuration
│   ├── docker-compose.yml      # PostgreSQL container
│   └── pom.xml
│
└── frontend/                   # Next.js frontend
    └── src/
        ├── app/                # App Router pages (home, history)
        ├── components/         # React components
        │   ├── weather/        # CurrentWeatherCard, FiveDayForecast, ClothingSuggestion
        │   ├── history/        # QueryTable, HistoricalQueryForm, ExportButtons
        │   ├── location/       # GoogleMapEmbed, YouTubePanel
        │   ├── search/         # SearchBar
        │   └── ui/             # WeatherBackground, LoadingSpinner, ErrorAlert
        ├── hooks/              # React Query hooks
        ├── context/            # UnitContext (°C/°F)
        ├── lib/                # axios client, utils
        └── types/              # TypeScript interfaces
```

---

## Frontend Dependencies

| Package | Purpose |
|---------|---------|
| next 14 | App framework |
| react 18 | UI library |
| @tanstack/react-query | Server state & caching |
| axios | HTTP client |
| react-hook-form + zod | Form validation |
| react-datepicker | Date range picker |
| react-hot-toast | Toast notifications |
| tailwindcss | Utility-first CSS |
| framer-motion | Animations |
| dayjs | Date formatting |

## Backend Dependencies

| Package | Purpose |
|---------|---------|
| spring-boot-starter-web | REST API |
| spring-boot-starter-data-jpa | ORM |
| spring-boot-starter-webflux | WebClient for external APIs |
| spring-boot-starter-validation | Bean validation |
| postgresql | JDBC driver |
| flyway-core | DB migrations |
| itext 5 | PDF generation |
| opencsv | CSV export |
| jackson-datatype-jsr310 | Java 8 date serialization |
| springdoc-openapi | Swagger UI |
| lombok | Boilerplate reduction |
