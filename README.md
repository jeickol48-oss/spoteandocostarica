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

Este comando también limpia imports duplicados dentro de bloques `import { ... }` (por ejemplo `Switch` repetido en `App.js`).

2. Abre el archivo/línea reportada y elimina los marcadores:
   - `<<<<<<<`
   - `=======`
   - `>>>>>>>`

3. Conserva solo el bloque de código correcto y vuelve a correr la app.

4. Si ya corregiste el archivo pero el error persiste, limpia caché de Metro:

```bash
npm run start -- --clear
```

> Nota: desde ahora `npm run start`, `npm run android`, `npm run ios` y `npm run web` ejecutan primero `npm run check:conflicts` para detectar este problema antes de abrir Expo.

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

### Preconfiguración para autenticación social (Google / Apple)
Ya quedó preparada la base en `firebaseConfig.js` para usar Firebase Auth (`getFirebaseAuth`) en el siguiente paso de implementación.

Antes de integrar los botones de login social en la UI:

1. En Firebase Console, ve a **Authentication > Sign-in method**.
2. Habilita los proveedores que usarás (Google y/o Apple).
3. Verifica que `EXPO_PUBLIC_FIREBASE_*` estén definidos (los de arriba).
4. Para pruebas limpias en Expo, reinicia Metro con:

```bash
npm run start -- --clear
```

## Estado de próximos pasos
- [ ] **Subida de imágenes (Firebase Storage/CDN).** ⬅️ Pendiente principal.
- [ ] **Autenticación social** (preconfiguración Firebase lista, falta implementar login completo en UI/flujo).
- [x] ~~Moderación y reportes de contenido~~.
- [x] ~~Búsqueda por filtros y mapas~~.
- [x] ~~Modo offline para guardar spots favoritos~~.
- [x] ~~Rankings diarios, semanales y mensuales de spots más visitados~~.
