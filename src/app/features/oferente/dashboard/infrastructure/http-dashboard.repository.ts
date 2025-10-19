// Infrastructure: HTTP implementation of Dashboard Repository
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, delay, map, of } from 'rxjs';
import { IDashboardRepository } from '../domain/ports';
import { DashboardData } from '../domain/entities';
import { DashboardMapper } from './mappers';
import { DashboardDataDTO } from './dashboard.dto';

@Injectable()
export class HttpDashboardRepository implements IDashboardRepository {
  private readonly apiUrl = '/api/oferente/dashboard'; // Change to your actual API endpoint

  // Mock data for demo purposes
  private mockDashboardData: DashboardDataDTO = {
    stats: {
      visits: 1234,
      visitsChange: '+12.5%',
      activeProducts: 12,
      newMessages: 8,
      messagesChange: '+3',
      activeServices: 5,
    },
    quickActions: [
      {
        id: '1',
        title: 'Agregar Producto',
        description: 'Crea un nuevo producto para tu catálogo',
        icon: 'add_shopping_cart',
        color: 'var(--color-primary)',
        route: '/oferente/products',
      },
      {
        id: '2',
        title: 'Publicar Noticia',
        description: 'Comparte novedades con tus clientes',
        icon: 'article',
        color: 'var(--color-primary)',
        route: '/oferente/news',
      },
      {
        id: '3',
        title: 'Editar Mi Espacio',
        description: 'Personaliza tu sitio web',
        icon: 'web',
        color: 'var(--color-accent)',
        route: '/oferente/space',
      },
      {
        id: '4',
        title: 'Ver Analítica',
        description: 'Revisa las métricas de tu negocio',
        icon: 'analytics',
        color: 'var(--color-primary)',
        route: '/oferente/analytics',
      },
      {
        id: '5',
        title: 'Configurar Marca',
        description: 'Ajusta logo, colores y diseño',
        icon: 'palette',
        color: 'var(--color-accent)',
        route: '/oferente/branding',
      },
      {
        id: '6',
        title: 'Ver Mi Plan',
        description: 'Gestiona tu suscripción',
        icon: 'workspace_premium',
        color: 'var(--color-primary)',
        route: '/oferente/subscription',
      },
    ],
    recentActivity: [
      {
        id: 1,
        title: 'Nuevo mensaje de Juan Pérez',
        time: 'Hace 5 minutos',
        icon: 'mail',
      },
      {
        id: 2,
        title: 'Producto "Notebook HP" fue visto 15 veces',
        time: 'Hace 1 hora',
        icon: 'visibility',
      },
      {
        id: 3,
        title: 'Tu sitio fue visitado 45 veces hoy',
        time: 'Hace 3 horas',
        icon: 'trending_up',
      },
      {
        id: 4,
        title: 'Actualizaste el producto "Mouse Logitech"',
        time: 'Hace 1 día',
        icon: 'edit',
      },
    ],
  };

  constructor(private readonly http: HttpClient) {}

  getDashboardData(): Observable<DashboardData> {
    // Using mock data - Replace with real HTTP call when backend is ready
    // return this.http.get<DashboardDataDTO>(this.apiUrl).pipe(
    //   map(dto => DashboardMapper.toDomain(dto))
    // );

    return of(this.mockDashboardData).pipe(
      delay(500), // Simulate network delay
      map(dto => DashboardMapper.toDomain(dto))
    );
  }
}
