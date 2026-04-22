export interface BadgeDto {
  badgeId?: string;
  name?: string;
}

export interface BadgeResponse {
  id: string;
  name: string;
  color: string;
  gradient: string[];
  icon: string;
  meaning: string;
  description: string;
  count: number;
  percentage: number;
}

export interface BadgesResponse {
  message: string;
  data: BadgeResponse[];
}

export interface StatisticsResponse {
  message: string;
  data: Record<string, { count: number; percentage: number }>;
}
