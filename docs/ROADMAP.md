# Roadmap del Proyecto

Este documento detalla el estado actual del proyecto, features pendientes y tareas técnicas.

---

## Estado Actual

### Features Completadas

| Feature | Capas | CRUD | Responsive | Dark Mode | Tests |
|---------|-------|------|------------|-----------|-------|
| **Dashboard** | 4/4 | Read | ✅ | ✅ | ❌ |
| **Products** | 4/4 | Full | ✅ | ✅ | ❌ |
| **Branding** | 4/4 | Full | ✅ | ✅ | Parcial |
| **Layout** | N/A | N/A | ✅ | ✅ | Parcial |

### Componentes Compartidos

| Componente | Estado | Documentación |
|------------|--------|---------------|
| CrudTableComponent | ✅ Completo | ✅ |
| CrudFormDialogComponent | ✅ Completo | ✅ |
| OferenteLayoutComponent | ✅ Completo | ✅ |
| ShellComponent | ✅ Completo (legacy) | ✅ |

---

## Features Pendientes

### Alta Prioridad

#### 1. Services (Servicios)

**Ubicación**: `src/app/features/oferente/services/`

**Descripción**: CRUD para gestionar servicios ofrecidos por el oferente.

**Estructura**:
```
services/
├── domain/
│   ├── entities.ts
│   └── ports.ts
├── application/
│   ├── list-services.use-case.ts
│   ├── get-service.use-case.ts
│   ├── create-service.use-case.ts
│   ├── update-service.use-case.ts
│   └── delete-service.use-case.ts
├── infrastructure/
│   ├── service.dto.ts
│   ├── http-service.repository.ts
│   └── mappers.ts
└── presentation/
    ├── services.store.ts
    ├── services.facade.ts
    ├── services.page.ts
    ├── services.page.html
    ├── services.page.scss
    └── routes.ts
```

**Entidad**:
```typescript
interface Service {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly duration: string;         // "30 min", "1 hora", "2 horas"
  readonly category: string;
  readonly availability: string[];   // ["Lunes", "Martes", "Miércoles"]
  readonly active: boolean;
  readonly imageUrl?: string;
  readonly createdAt: Date;
  readonly updatedAt?: Date;
}

interface CreateServiceData {
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly duration: string;
  readonly category: string;
  readonly availability: string[];
  readonly imageUrl?: string;
}

interface UpdateServiceData {
  readonly name?: string;
  readonly description?: string;
  readonly price?: number;
  readonly duration?: string;
  readonly category?: string;
  readonly availability?: string[];
  readonly active?: boolean;
  readonly imageUrl?: string;
}
```

**Campos del formulario**:
- Nombre (text, required)
- Descripción (textarea)
- Precio (number, required)
- Duración (select: 30min, 1h, 2h, 3h, medio día, día completo)
- Categoría (select: según negocio)
- Disponibilidad (multi-select: días de la semana)
- Imagen (file upload)
- Activo (checkbox)

---

#### 2. News (Noticias)

**Ubicación**: `src/app/features/oferente/news/`

**Descripción**: Sistema de publicación de noticias y novedades.

**Entidad**:
```typescript
interface NewsArticle {
  readonly id: string;
  readonly title: string;
  readonly slug: string;
  readonly content: string;          // HTML o Markdown
  readonly summary: string;
  readonly coverImage?: string;
  readonly status: 'draft' | 'published' | 'archived';
  readonly publishedAt?: Date;
  readonly tags: string[];
  readonly viewCount: number;
  readonly createdAt: Date;
  readonly updatedAt?: Date;
}
```

**Funcionalidades especiales**:
- Editor rich text para contenido (considerar Quill o TipTap)
- Vista previa antes de publicar
- Programar publicación
- Sistema de tags
- Contador de vistas

---

#### 3. Contacts (Contactos/Mensajes)

**Ubicación**: `src/app/features/oferente/contacts/`

**Descripción**: Gestión de mensajes recibidos de clientes potenciales.

**Entidad**:
```typescript
interface Contact {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly phone?: string;
  readonly subject: string;
  readonly message: string;
  readonly status: 'unread' | 'read' | 'replied' | 'archived';
  readonly source: 'website' | 'whatsapp' | 'email' | 'other';
  readonly receivedAt: Date;
  readonly readAt?: Date;
  readonly repliedAt?: Date;
  readonly notes?: string;
}
```

**Funcionalidades especiales**:
- Badge de mensajes no leídos en sidebar
- Filtros por estado
- Marcar como leído/respondido
- Respuesta rápida (abrir cliente email/whatsapp)
- Notas internas

---

### Media Prioridad

#### 4. Gallery (Galería)

**Ubicación**: `src/app/features/oferente/gallery/`

**Descripción**: Gestión de imágenes y archivos multimedia.

**Entidad**:
```typescript
interface GalleryImage {
  readonly id: string;
  readonly url: string;
  readonly thumbnailUrl: string;
  readonly title?: string;
  readonly alt?: string;
  readonly folder?: string;
  readonly mimeType: string;
  readonly size: number;            // bytes
  readonly width?: number;
  readonly height?: number;
  readonly uploadedAt: Date;
}

interface GalleryFolder {
  readonly id: string;
  readonly name: string;
  readonly parentId?: string;
  readonly imageCount: number;
  readonly createdAt: Date;
}
```

**Funcionalidades**:
- Upload drag & drop
- Organización en carpetas
- Vista grid/lista
- Lightbox para preview
- Copiar URL de imagen
- Eliminar múltiples

---

#### 5. Analytics (Analítica)

**Ubicación**: `src/app/features/oferente/analytics/`

**Descripción**: Dashboard con métricas y estadísticas del negocio.

**Componentes**:
- KPIs principales (visitas, contactos, ventas)
- Gráfico de visitas por día/semana/mes
- Gráfico de productos más vistos
- Gráfico de servicios más solicitados
- Tabla de últimas interacciones

**Librería sugerida**: ngx-charts

**Entidades**:
```typescript
interface AnalyticsMetrics {
  readonly totalVisits: number;
  readonly uniqueVisitors: number;
  readonly pageViews: number;
  readonly avgSessionDuration: number;
  readonly bounceRate: number;
  readonly contactsReceived: number;
  readonly period: 'day' | 'week' | 'month' | 'year';
}

interface VisitData {
  readonly date: Date;
  readonly visits: number;
  readonly uniqueVisitors: number;
}
```

---

#### 6. Space (Mi Espacio)

**Ubicación**: `src/app/features/oferente/space/`

**Descripción**: Configuración del sitio público del oferente.

**Entidad**:
```typescript
interface SpaceConfig {
  readonly id: string;
  readonly slug: string;             // URL: /espacio/{slug}
  readonly name: string;
  readonly description: string;
  readonly logoUrl?: string;
  readonly bannerUrl?: string;
  readonly theme: ThemeId;
  readonly sections: SpaceSection[];
  readonly socialLinks: SocialLink[];
  readonly contactInfo: ContactInfo;
  readonly seoTitle?: string;
  readonly seoDescription?: string;
  readonly isPublished: boolean;
}

interface SpaceSection {
  readonly id: string;
  readonly type: 'hero' | 'about' | 'products' | 'services' | 'gallery' | 'contact' | 'custom';
  readonly title?: string;
  readonly content?: string;
  readonly visible: boolean;
  readonly order: number;
}

interface SocialLink {
  readonly platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'youtube' | 'tiktok' | 'whatsapp';
  readonly url: string;
}

interface ContactInfo {
  readonly email?: string;
  readonly phone?: string;
  readonly whatsapp?: string;
  readonly address?: string;
  readonly mapUrl?: string;
  readonly schedule?: string;
}
```

---

### Baja Prioridad

#### 7. Profile (Perfil)

**Funcionalidades**:
- Editar datos personales (nombre, email, teléfono)
- Cambiar foto de perfil
- Cambiar contraseña
- Ver historial de actividad

#### 8. Settings (Configuración)

**Funcionalidades**:
- Preferencias de notificaciones (email, push)
- Idioma de la aplicación
- Zona horaria
- Privacidad (visibilidad del perfil)
- Exportar datos (GDPR)

#### 9. Subscription (Suscripción)

**Funcionalidades**:
- Ver plan actual
- Comparar planes
- Upgrade/downgrade
- Historial de pagos
- Descargar facturas
- Cancelar suscripción

#### 10. Help (Ayuda)

**Funcionalidades**:
- FAQ acordeón
- Tutoriales en video
- Guías paso a paso
- Contactar soporte
- Estado del sistema

---

## Tareas Técnicas

### Testing

| Tarea | Prioridad | Estado |
|-------|-----------|--------|
| Tests unitarios para use cases | Alta | ❌ Pendiente |
| Tests para stores (signals) | Alta | ❌ Pendiente |
| Tests para facades | Alta | ❌ Pendiente |
| Tests para mappers | Media | ❌ Pendiente |
| Tests para componentes | Media | Parcial |
| Configurar coverage mínimo (80%) | Alta | ❌ Pendiente |
| E2E con Playwright | Baja | ❌ Pendiente |

### Infraestructura

| Tarea | Prioridad | Estado |
|-------|-----------|--------|
| Reemplazar mock data con API real | Alta | ❌ Pendiente |
| HTTP interceptor para auth | Alta | ❌ Pendiente |
| HTTP interceptor para errores | Alta | ❌ Pendiente |
| Guards de autenticación | Alta | ❌ Pendiente |
| Refresh token automático | Media | ❌ Pendiente |
| Caché de requests | Baja | ❌ Pendiente |

### UX/UI

| Tarea | Prioridad | Estado |
|-------|-----------|--------|
| Loading skeletons globales | Media | ❌ Pendiente |
| Toast notifications service | Alta | ❌ Pendiente |
| Confirm dialog service | Alta | ❌ Pendiente |
| Empty states mejorados | Media | ❌ Pendiente |
| Error boundaries | Media | ❌ Pendiente |
| Animaciones de transición | Baja | ❌ Pendiente |

### Performance

| Tarea | Prioridad | Estado |
|-------|-----------|--------|
| Lazy loading de imágenes | Media | ❌ Pendiente |
| Service Worker (PWA) | Baja | ❌ Pendiente |
| Bundle size analysis | Media | ❌ Pendiente |
| Preload strategies | Baja | ❌ Pendiente |
| Virtual scrolling en listas largas | Baja | ❌ Pendiente |

### Accesibilidad

| Tarea | Prioridad | Estado |
|-------|-----------|--------|
| Completar alto contraste | Media | ❌ Pendiente |
| Skip-to-content funcional | Media | ❌ Pendiente |
| Auditoría WCAG completa | Alta | ❌ Pendiente |
| Screen reader testing | Media | ❌ Pendiente |
| Keyboard navigation completa | Alta | ✅ Parcial |

---

## Guía para Implementar Nueva Feature

### Paso 1: Crear estructura

```bash
mkdir -p src/app/features/oferente/<feature>/{domain,application,infrastructure,presentation}
```

### Paso 2: Implementar capas en orden

1. **Domain** (entities.ts, ports.ts)
2. **Infrastructure** (dto.ts, mappers.ts, repository.ts)
3. **Application** (use cases)
4. **Presentation** (store, facade, page, routes)

### Paso 3: Registrar ruta

```typescript
// oferente.routes.ts
{
  path: '<feature>',
  loadChildren: () =>
    import('./<feature>/presentation/routes').then(m => m.FEATURE_ROUTES)
}
```

### Paso 4: Actualizar menú

```typescript
// oferente-layout.component.ts
readonly menuItems = [
  // ... existing items
  {
    id: '<feature>',
    label: 'Feature Name',
    icon: 'icon_name',
    route: '/oferente/<feature>',
    ariaLabel: 'Descripción accesible',
  },
];
```

### Paso 5: Verificar checklist

Ver [DELIVERY-CHECKLIST.md](./DELIVERY-CHECKLIST.md)

---

## Migración a API Real

### Estado Actual: Mock Data

Todos los repositories usan datos simulados:

```typescript
// Patrón actual
getAll(): Observable<Product[]> {
  return of(this.mockData).pipe(
    delay(500),
    map(dtos => dtos.map(ProductMapper.toDomain))
  );
}
```

### Pasos para Migrar

1. **Configurar environment**
```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
};
```

2. **Actualizar repository**
```typescript
// Cambiar de mock a HTTP real
getAll(): Observable<Product[]> {
  return this.http.get<ProductDTO[]>(`${environment.apiUrl}/products`).pipe(
    map(dtos => dtos.map(ProductMapper.toDomain))
  );
}
```

3. **Agregar interceptor de auth**
```typescript
// auth.interceptor.ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).getToken();

  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(req);
};
```

4. **Agregar interceptor de errores**
```typescript
// error.interceptor.ts
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const toastService = inject(ToastService);

      if (error.status === 401) {
        // Redirect to login
      } else if (error.status === 403) {
        toastService.error('No tienes permisos para esta acción');
      } else if (error.status >= 500) {
        toastService.error('Error del servidor, intenta más tarde');
      }

      return throwError(() => error);
    })
  );
};
```

5. **Registrar interceptors**
```typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor, errorInterceptor])
    ),
  ],
};
```

---

## Priorización

### Sprint Actual
1. Services (CRUD completo)
2. Toast notifications service
3. Confirm dialog service

### Próximo Sprint
1. News (con editor rich text)
2. Contacts (con badges)
3. Tests para use cases existentes

### Backlog
- Gallery
- Analytics
- Space editor
- Profile
- Settings
- Subscription
- Help
- PWA
- E2E tests
