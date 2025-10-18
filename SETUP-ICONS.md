# Configuración de Material Icons

## Cambios Realizados para Mostrar Iconos

### 1. index.html
Se agregaron los siguientes links en el `<head>`:

```html
<!-- Google Fonts - Roboto -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">

<!-- Material Icons -->
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
```

Y se agregó la clase `mat-typography` al body:
```html
<body class="mat-typography">
```

### 2. styles.scss
Se actualizó la fuente del body:
```scss
body {
  margin: 0;
  font-family: Roboto, 'Helvetica Neue', sans-serif;
}
```

### 3. material-theme.scss
Se cambió el color primario de `azure` a `violet` para que coincida con el diseño:
```scss
$theme: mat.define-theme((
  color: (
    theme-type: light,
    primary: mat.$violet-palette,  // Violeta/morado
    tertiary: mat.$blue-palette,
  ),
  ...
));
```

## Recursos Cargados

- **Fuente Roboto**: Necesaria para Material Design
- **Material Icons**: Iconos de Google Material
- **Clase mat-typography**: Aplica los estilos de tipografía de Material

## Cómo Usar los Iconos

En cualquier componente que importe `MatIconModule`:

```html
<mat-icon>home</mat-icon>
<mat-icon>shopping_cart</mat-icon>
<mat-icon>person</mat-icon>
```

Referencia completa de iconos: https://fonts.google.com/icons

## Verificación

Para verificar que los iconos están funcionando:
1. Ejecuta `npm start`
2. Abre http://localhost:4200/oferente
3. Deberías ver:
   - Icono de storefront en el sidebar
   - Iconos en el menú de navegación
   - Iconos en la toolbar (menu, folder, accessibility, account_circle)
   - Iconos en el dashboard (dashboard, web, inventory_2, etc.)
   - Iconos en la tabla de productos (edit, delete, content_copy, visibility)

## Troubleshooting

Si los iconos no aparecen:
1. Verifica que estés usando `<mat-icon>` y no solo `<i class="material-icons">`
2. Verifica que el componente importe `MatIconModule`
3. Abre las Dev Tools y verifica que los fonts se carguen correctamente
4. Limpia caché del navegador con Ctrl+Shift+R
