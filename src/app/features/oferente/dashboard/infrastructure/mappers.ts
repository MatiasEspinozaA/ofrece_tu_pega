// Mappers: Convert between DTOs and Domain entities
import { DashboardData } from '../domain/entities';
import { DashboardDataDTO } from './dashboard.dto';

export class DashboardMapper {
  /**
   * Convert DTO to Domain entity
   */
  static toDomain(dto: DashboardDataDTO): DashboardData {
    return {
      stats: {
        visits: dto.stats.visits,
        visitsChange: dto.stats.visitsChange,
        activeProducts: dto.stats.activeProducts,
        newMessages: dto.stats.newMessages,
        messagesChange: dto.stats.messagesChange,
        activeServices: dto.stats.activeServices,
      },
      quickActions: dto.quickActions.map(action => ({
        id: action.id,
        title: action.title,
        description: action.description,
        icon: action.icon,
        color: action.color,
        route: action.route,
      })),
      recentActivity: dto.recentActivity.map(activity => ({
        id: activity.id,
        title: activity.title,
        time: activity.time,
        icon: activity.icon,
      })),
    };
  }
}
