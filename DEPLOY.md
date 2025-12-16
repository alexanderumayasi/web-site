# INSTRUCCIONES DE DESPLIEGUE

## 🚀 Railway.app (Backend)

### 1. Crear Proyecto en Railway
1. Ve a https://railway.app
2. Conecta tu cuenta de GitHub
3. Crea nuevo proyecto: "New Project" → "Deploy from GitHub repo"
4. Selecciona el repositorio: `alexanderumayasi/okey`

### 2. Configurar Servicios

#### PostgreSQL:
1. En tu proyecto Railway, haz clic en "+ New"
2. Selecciona "Database" → "PostgreSQL"
3. Railway creará automáticamente la base de datos

#### Backend (API):
1. Haz clic en "+ New" → "GitHub Repo"
2. Selecciona tu repositorio
3. En "Settings" → "Root Directory" → escribe: `backend`

### 3. Variables de Entorno (Backend)

En Railway → Backend Service → Variables, agrega:

```env
# Database (Railway auto-genera estas variables al conectar)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# JWT Secrets (genera tus propios secretos seguros)
JWT_SECRET=tu-jwt-secret-super-seguro-aqui-cambiar
JWT_REFRESH_SECRET=tu-jwt-refresh-secret-super-seguro-aqui-cambiar

# URLs
FRONTEND_URL=https://tu-dominio.vercel.app
NODE_ENV=production

# Cloudinary (tus credenciales)
CLOUDINARY_CLOUD_NAME=tu-cloud-name
CLOUDINARY_API_KEY=tu-api-key
CLOUDINARY_API_SECRET=tu-api-secret

# Stripe (tus claves de producción)
STRIPE_SECRET_KEY=sk_live_tu-clave-secreta-stripe
STRIPE_WEBHOOK_SECRET=whsec_tu-webhook-secret

# Google Gemini AI
GEMINI_API_KEY=tu-api-key-de-gemini

# Redis (opcional, Railway también ofrece Redis)
REDIS_URL=${{Redis.REDIS_URL}}
```

### 4. Conectar Base de Datos
1. En Railway, ve al servicio Backend
2. En "Settings" → "Variables" → "Reference"
3. Conecta `DATABASE_URL` con el servicio PostgreSQL

### 5. Deploy Backend
1. Railway detectará automáticamente el Dockerfile
2. Ejecutará las migraciones de Prisma automáticamente
3. Copia la URL generada (ej: `https://okey-production.up.railway.app`)

---

## ⚡ Vercel (Frontend)

### 1. Conectar Repositorio
1. Ve a https://vercel.com
2. Click en "Add New" → "Project"
3. Importa tu repositorio de GitHub: `alexanderumayasi/okey`

### 2. Configuración del Proyecto

**Root Directory:** `frontend`

**Framework Preset:** Nuxt.js

**Build Command:** `npm run build`

**Output Directory:** `.output/public`

### 3. Variables de Entorno (Frontend)

En Vercel → Project Settings → Environment Variables:

```env
# API URL (tu URL de Railway)
NUXT_PUBLIC_API_URL=https://tu-backend.up.railway.app/api

# Stripe Public Key (tu clave pública)
NUXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_tu-clave-publica-stripe
```

### 4. Deploy Frontend
1. Vercel construirá automáticamente tu proyecto
2. Te dará una URL (ej: `https://tu-proyecto.vercel.app`)

---

## 🔄 Actualizar CORS y URLs

### Después del primer deploy:

1. **Actualiza FRONTEND_URL en Railway** con tu dominio de Vercel
2. **Actualiza NUXT_PUBLIC_API_URL en Vercel** con tu dominio de Railway
3. Ambos servicios se redesplegarán automáticamente

---

## 📦 Base de Datos

### Ejecutar Migraciones y Seed:

Railway ejecutará automáticamente:
```bash
npx prisma migrate deploy
npx prisma db seed
```

Si necesitas ejecutar manualmente:
1. Ve a Railway → Backend Service → "Settings"
2. Abre la terminal del servicio
3. Ejecuta: `npx prisma db seed`

---

## ✅ Verificación Final

### Backend (Railway):
- [ ] PostgreSQL funcionando
- [ ] Variables de entorno configuradas
- [ ] Migraciones ejecutadas
- [ ] URL del backend copiada

### Frontend (Vercel):
- [ ] Variables de entorno configuradas
- [ ] Build exitoso
- [ ] URL del frontend copiada

### Conexión:
- [ ] CORS actualizado con dominio de Vercel
- [ ] Frontend apunta al backend de Railway
- [ ] Pagos Stripe configurados
- [ ] Cloudinary funcionando

---

## 🆘 Solución de Problemas

### Error de migraciones:
```bash
# En Railway terminal:
npx prisma migrate reset --force
npx prisma db seed
```

### Error de CORS:
Verifica que `FRONTEND_URL` en Railway incluya tu dominio de Vercel sin slash final.

### Build falla en Vercel:
Verifica que `Root Directory` esté en `frontend` y no en la raíz.

---

## 🔐 Seguridad

Antes de producción, asegúrate de:
- [ ] Cambiar todos los JWT secrets
- [ ] Usar claves de Stripe de producción
- [ ] Configurar webhook de Stripe en producción
- [ ] Habilitar autenticación de dos factores en ambas plataformas
- [ ] Revisar que no haya credenciales hardcodeadas

---

## 💰 Costos Estimados

**Railway:** 
- $5/mes de crédito gratis
- ~$5-10/mes con uso básico

**Vercel:**
- Plan gratuito (suficiente para proyectos personales)
- Plan Pro: $20/mes (si necesitas más recursos)

**Total:** ~$0-15/mes para empezar
