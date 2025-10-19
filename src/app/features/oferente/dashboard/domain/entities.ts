// Domain entities - Pure business logic objects

export interface DashboardStats {
  readonly visits: number;
  readonly visitsChange?: string;
  readonly activeProducts: number;
  readonly newMessages: number;
  readonly messagesChange?: string;
  readonly activeServices: number;
}

export interface QuickAction {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: string;
  readonly color: string;
  readonly route: string;
}

export interface RecentActivity {
  readonly id: number;
  readonly title: string;
  readonly time: string;
  readonly icon: string;
}

export interface DashboardData {
  readonly stats: DashboardStats;
  readonly quickActions: QuickAction[];
  readonly recentActivity: RecentActivity[];
}
