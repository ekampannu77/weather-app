export interface WeatherRecordDTO {
  id: number;
  recordDate: string;
  tempMaxCelsius: number | null;
  tempMinCelsius: number | null;
  precipitationMm: number | null;
  windSpeedKmh: number | null;
  windDirection: number | null;
  weatherCode: number | null;
  weatherDescription: string;
  sunrise: string | null;
  sunset: string | null;
}

export interface HistoricalQueryResponse {
  id: number;
  inputLocation: string;
  displayName: string;
  resolvedCity: string;
  resolvedCountry: string;
  resolvedState: string | null;
  latitude: number;
  longitude: number;
  startDate: string;
  endDate: string;
  avgTempCelsius: number | null;
  minTempCelsius: number | null;
  maxTempCelsius: number | null;
  avgPrecipitation: number | null;
  avgWindSpeed: number | null;
  userNotes: string | null;
  createdAt: string;
  updatedAt: string;
  weatherRecords: WeatherRecordDTO[] | null;
}

export interface HistoricalQueryRequest {
  inputLocation: string;
  startDate: string;
  endDate: string;
  userNotes?: string;
}

export interface UpdateQueryRequest {
  inputLocation?: string;
  startDate?: string;
  endDate?: string;
  userNotes?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface YouTubeVideoResult {
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  channelName: string;
  publishedAt: string;
  watchUrl: string;
}
