export interface MatchPair {
  matchNumber: number;
  matchCode: string;
  redCorner: string;
  blueCorner: string;
  status: string;
}

export interface PairingState {
  pairs: MatchPair[];
  oddTeam: string | null;
  totalTeamsCount: number;
}
