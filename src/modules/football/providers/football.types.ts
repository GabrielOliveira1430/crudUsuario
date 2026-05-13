export type FootballMatch = {
  homeTeam: string;
  awayTeam: string;
  league: string;
  status: string;
  minute?: number;
  homeScore?: number;
  awayScore?: number;
};

export type FootballProviderResponse = {
  success: boolean;
  total: number;
  matches: FootballMatch[];
};