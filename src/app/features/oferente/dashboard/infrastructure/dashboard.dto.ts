// Data Transfer Object for API communication
export interface DashboardStatsDTO {
  visits: number;
  visitsChange?: string;
  activeProducts: number;
  newMessages: number;
  messagesChange?: string;
  activeServices: number;
}

export interface QuickActionDTO {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  route: string;
}

export interface RecentActivityDTO {
  id: number;
  title: string;
  time: string;
  icon: string;
}

export interface DashboardDataDTO {
  stats: DashboardStatsDTO;
  quickActions: QuickActionDTO[];
  recentActivity: RecentActivityDTO[];
}
