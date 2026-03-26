# Spoteando Costa Rica

Aplicación móvil para iOS y Android donde las personas pueden compartir “spots” (lugares) de Costa Rica con ubicación, imágenes y características.

## Funcionalidades iniciales
- Crear spots con nombre, descripción, enlace de mapa y etiquetas.
- Listar spots y abrir la ubicación en Google Maps (o cualquier mapa que reconozca el enlace).
- Preparado para ampliar con subida de imágenes, autenticación y moderación.

## Requisitos
- Node.js 18+
- Expo CLI

## Instalación
```bash
npm install
```

## Ejecución
```bash
npm run start
```

## Solución rápida: error `<<<<<<<` en `App.js`
Si ves un error como:

```text
Unexpected token ... <<<<<<< ... ======= ... >>>>>>>
```

tu archivo tiene un conflicto de merge sin resolver.

1. Ejecuta:

```bash
npm run check:conflicts
```

Si quieres remover automáticamente solo las líneas de marcadores (`<<<<<<<`, `=======`, `>>>>>>>`), usa:

```bash
npm run fix:conflicts
```

2. Abre el archivo/línea reportada y elimina los marcadores:
   - `<<<<<<<`
   - `=======`
   - `>>>>>>>`

3. Conserva solo el bloque de código correcto y vuelve a correr la app.

## Firebase (almacenamiento de estado)
Configura estas variables de entorno para habilitar Firestore en Expo:

```bash
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
```

El estado principal de la app (spots, perfil guardado, favoritos, comentarios y ajustes) se sincroniza en el documento `appState/main` de Firestore.

## Próximos pasos sugeridos
- Subida de imágenes (Firebase Storage/CDN).
- Autenticación social.
- Moderación y reportes de contenido.
- Búsqueda por filtros y mapas.
- Modo offline para guardar spots favoritos.
- Rankings semanales de spots más visitados.
