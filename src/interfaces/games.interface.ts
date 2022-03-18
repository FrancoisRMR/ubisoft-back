export interface IStreamData {
  id: string;
  user_id: string;
  user_login: string;
  user_name: string;
  game_id: string;
  game_name: string;
  type: string;
  title: string;
  viewer_count: number;
  started_at: Date;
  language: string;
  thumbnail_url: string;
  tag_ids: string[];
  is_mature: boolean;
}

export interface IPagination {
  cursor: string;
}

export interface IGameData {
  box_art_url: string;
  id: string;
  name: string;
}

export interface IGameGeneralOverview {
  data: IGameData[];
  pagination: IPagination;
}

export interface IStream {
  data: IStreamData[];
  pagination: IPagination;
}

export interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export interface IGameDetails {
  name: string;
  views: number;
  lastUpdatedAt: Date;
}
