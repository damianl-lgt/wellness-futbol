# 📱 Setup de la PWA Wellness — Guía Paso a Paso

Tiempo estimado: **45 minutos** (la mayoría es esperar que los servicios carguen)

---

## PASO 1 — Generar tus VAPID Keys (2 minutos)

Las VAPID Keys son como una "firma digital" que autoriza el envío de notificaciones.

1. Ir a: **https://vapidkeys.com** (o buscar "VAPID key generator online")
2. Hacer clic en **Generate**
3. Guardar los 3 valores que aparecen:
   ```
   Public Key:  Bxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   Private Key: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
4. Guardarlos en un lugar seguro (son como contraseñas)

---

## PASO 2 — Crear cuenta GitHub (5 minutos)

1. Ir a **https://github.com**
2. Clic en **Sign up** → completar usuario, email, contraseña
3. Verificar el email

---

## PASO 3 — Subir la app a GitHub (5 minutos)

1. En GitHub, clic en el **+** (arriba a la derecha) → **New repository**
2. Nombre del repositorio: `wellness-futbol`
3. Asegurarse que diga **Public**
4. Clic en **Create repository**
5. En la página del repositorio vacío, buscar el link **"uploading an existing file"**
6. Arrastrar y soltar TODOS los archivos de la carpeta `wellness-app/` (incluyendo la subcarpeta `api/`)
7. En la caja de abajo escribir: `Primera versión de la app`
8. Clic en **Commit changes**

---

## PASO 4 — Crear cuenta Vercel y deployar (10 minutos)

1. Ir a **https://vercel.com**
2. Clic en **Sign Up** → elegir **Continue with GitHub**
3. Autorizar a Vercel a acceder a tu GitHub
4. Clic en **Add New Project**
5. Buscar el repositorio `wellness-futbol` → clic en **Import**
6. Dejar todo por defecto → clic en **Deploy**
7. Esperar ~2 minutos → cuando aparezca "Congratulations!" ya está online
8. **Copiar la URL** que aparece (ej: `https://wellness-futbol-xxxx.vercel.app`) — la vas a necesitar

---

## PASO 5 — Agregar las variables de entorno en Vercel (5 minutos)

1. En Vercel, ir al proyecto → **Settings** → **Environment Variables**
2. Agregar estas 5 variables (una por una):

| Nombre | Valor |
|--------|-------|
| `VAPID_PUBLIC_KEY` | Tu Public Key del Paso 1 |
| `VAPID_PRIVATE_KEY` | Tu Private Key del Paso 1 |
| `VAPID_EMAIL` | `mailto:tuemail@gmail.com` |
| `APPS_SCRIPT_URL` | (lo completás en el Paso 6) |
| `NOTIFY_SECRET` | Inventá una contraseña, ej: `futbol2026secreto` |

3. Después de agregar las 5, ir a **Deployments** → clic en los 3 puntos del último deploy → **Redeploy**

---

## PASO 6 — Publicar el Apps Script como Web App (10 minutos)

1. Abrir tu Google Sheet "Wellness_Futbol"
2. **Extensiones → Apps Script**
3. Si no pegaste el código todavía: pegar el contenido de `wellness_apps_script.gs`
4. Guardar (Ctrl+S)
5. Clic en **Implementar** (arriba a la derecha) → **Nueva implementación**
6. Tipo: **Aplicación web**
7. Configurar:
   - Ejecutar como: **Yo** (tu cuenta de Google)
   - Quién tiene acceso: **Cualquier persona**
8. Clic en **Implementar** → copiar la URL que aparece
9. Volver a Vercel → Settings → Environment Variables → editar `APPS_SCRIPT_URL` → pegar esa URL
10. En el archivo `index.html` de la carpeta wellness-app, reemplazar:
    ```javascript
    const APPS_SCRIPT_URL = 'TU_APPS_SCRIPT_URL_AQUI';
    ```
    por tu URL real. También reemplazar:
    ```javascript
    const VAPID_PUBLIC_KEY = 'TU_VAPID_PUBLIC_KEY_AQUI';
    ```
    por tu Public Key del Paso 1.
11. Subir el `index.html` actualizado a GitHub (GitHub → wellness-futbol → index.html → lápiz para editar → pegar → Commit changes)
12. Vercel hace el redeploy automáticamente

---

## PASO 7 — Agregar PINs al Plantel (2 minutos)

1. Abrir el Google Sheet → hoja **Plantel**
2. Agregar la columna **G** con el encabezado "PIN"
3. Asignar un PIN de 4 dígitos a cada jugador (ej: 1234, 5678, etc.)
4. Comunicar a cada jugador su PIN personal

> Recomendación: usar el año de nacimiento o un número que el jugador elija.

---

## PASO 8 — Configurar los recordatorios automáticos (5 minutos)

1. Ir a **https://cron-job.org** → crear cuenta gratis
2. Crear 2 cron jobs:

**Job 1 — Recordatorio turno Mañana:**
- URL: `https://TU-APP.vercel.app/api/notify?shift=morning&token=TU_NOTIFY_SECRET`
- Schedule: Todos los días a las **8:00 AM**
- Método: GET

**Job 2 — Recordatorio turno Tarde:**
- URL: `https://TU-APP.vercel.app/api/notify?shift=afternoon&token=TU_NOTIFY_SECRET`
- Schedule: Todos los días a las **3:00 PM**
- Método: GET

> Reemplazar `TU-APP` con tu URL de Vercel y `TU_NOTIFY_SECRET` con el valor que pusiste en Vercel.

---

## PASO 9 — Probar e instalar en el teléfono

### Para instalar en Android:
1. Abrir Chrome en el celular
2. Ir a la URL de Vercel (ej: `https://wellness-futbol-xxxx.vercel.app`)
3. Aparece un banner "Instalar app" → tocar **Instalar**
4. O desde el menú de Chrome → "Agregar a pantalla de inicio"

### Para instalar en iPhone:
1. Abrir **Safari** (no Chrome — Safari es obligatorio en iOS)
2. Ir a la URL
3. Tocar el botón de compartir (cuadrado con flecha ↑)
4. Tocar **"Agregar a pantalla de inicio"**
5. Confirmar → aparece el ícono en la pantalla

### Para probar las notificaciones:
- Instalar la app → aceptar notificaciones cuando pregunta
- Ir a cron-job.org → Job 1 → "Ejecutar ahora" para probar

---

## Resumen de URLs importantes

| Servicio | Para qué | URL |
|----------|----------|-----|
| Tu app | Lo que ven los jugadores | `https://wellness-futbol-xxxx.vercel.app` |
| Vercel dashboard | Administrar la app | `https://vercel.com/dashboard` |
| cron-job.org | Ver logs de notificaciones | `https://cron-job.org` |
| Google Sheet | Ver respuestas | Tu Google Sheet |

---

## Solución de problemas

| Problema | Solución |
|----------|----------|
| La app no carga | Verificar que el deploy en Vercel diga "Ready" |
| PIN no funciona | Verificar columna G en hoja Plantel, formato sin espacios |
| No llegan notificaciones | Verificar VAPID keys en Vercel y que el jugador aceptó notificaciones |
| Error en Apps Script | Ir a Apps Script → Ejecutar `doGet` manualmente para ver el error |
| iPhone no instala | Debe ser Safari, no Chrome ni Firefox |
