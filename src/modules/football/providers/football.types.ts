// src/modules/football/providers/football.types.ts

// ==========================================
// ⚽ STATUS
// ==========================================

export type MatchStatus =

  | 'NS'
  | '1H'
  | 'HT'
  | '2H'
  | 'ET'
  | 'P'
  | 'FT'
  | 'AET'
  | 'PEN'
  | 'SUSP'
  | 'INT'
  | 'LIVE'
  | 'MATCH'
  | 'FINISHED'
  | 'CANCELLED'
  | 'POSTPONED'
  | 'UNKNOWN';

// ==========================================
// ⚽ MATCH STATS
// ==========================================

export type MatchStatistics = {

  possession?: {
    home: number;
    away: number;
  };

  shots?: {
    home: number;
    away: number;
  };

  shotsOnTarget?: {
    home: number;
    away: number;
  };

  corners?: {
    home: number;
    away: number;
  };

  attacks?: {
    home: number;
    away: number;
  };

  dangerousAttacks?: {
    home: number;
    away: number;
  };

  yellowCards?: {
    home: number;
    away: number;
  };

  redCards?: {
    home: number;
    away: number;
  };
};

// ==========================================
// ⚽ FOOTBALL MATCH
// ==========================================

export type FootballMatch = {

  id?: string;

  homeTeam: string;

  awayTeam: string;

  league: string;

  country?: string;

  season?: string;

  date: string;

  timestamp?: number;

  status: MatchStatus;

  minute?: number;

  homeScore?: number;

  awayScore?: number;

  venue?: string;

  referee?: string;

  statistics?: MatchStatistics;

  source?: string;

  lastUpdated?: number;
};

// ==========================================
// ⚽ PROVIDER RESPONSE
// ==========================================

export type FootballProviderResponse = {

  success: boolean;

  total: number;

  matches: FootballMatch[];

  source?: string;

  cached?: boolean;

  updatedAt?: number;

  error?: string;
};