# 🎮 Gaming Store - Tienda de Componentes Gaming

Proyecto completo full-stack de e-commerce profesional especializada en componentes gaming. Sistema listo para producción con autenticación JWT, panel de administración, carrito de compras, checkout con Stripe y gestión de inventario.

---

## 🚀 Tech Stack

### Backend
- **Node.js** + **Express** + **TypeScript 5.3.3**
- **Prisma ORM 5.8.0** + **PostgreSQL 17.4**
- **JWT Authentication** (Access + Refresh tokens con httpOnly cookies)
- **Cloudinary 1.41.1** (gestión de imágenes con transformaciones)
- **Stripe 14.10.0** (procesamiento de pagos con webhooks)
- **Redis 7-alpine** (caché y sesiones)
- **bcryptjs** (hashing de contraseñas)

### Frontend
- **Nuxt 3.9.1** + **Vue 3.4.5** + **TypeScript 5.3.3**
- **Pinia 2.1.7** (state management con persistencia)
- **Tailwind CSS 6.11.4** (diseño personalizado gaming)
- **SSR/SSG** capabilities con auto-imports
- **VueUse** (composables utilities)

### DevOps
- **Docker Compose** (PostgreSQL 17.4 + Redis 7)
- **Prisma Migrations** (control de versiones de BD)
- **Concurrently** (ejecución paralela dev)

---

## 📋 Prerequisitos

Antes de empezar, asegúrate de tener instalado:

- **Node.js 18+** y **npm**
- **Docker Desktop** (para Windows/Mac) o Docker Engine (Linux)
- **Git**
- Un editor de código (recomendado: VS Code)

---

## 🛠️ Instalación Rápida

### 1️⃣ Iniciar servicios Docker

```powershell
docker-compose up -d
```

Esto iniciará:
- ✅ **PostgreSQL 17.4** en puerto **5432** (contenedor: `proyectos`)
  - Usuario: `postgres`
  - Password: `admin`
  - Database: `gaming_store`
- ✅ **Redis 7-alpine** en puerto **6379**

Verifica que los contenedores estén corriendo:

```powershell
docker ps
```

### 2️⃣ Configurar Backend

```powershell
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed
```

**¿Qué hace cada comando?**
- `npm install` - Instala todas las dependencias (Express, Prisma, Stripe, etc.)
- `npx prisma generate` - Genera el cliente de Prisma tipado
- `npx prisma migrate dev` - Crea las tablas en PostgreSQL
- `npm run seed` - Inserta datos de ejemplo (usuarios, productos, categorías)

### 3️⃣ Configurar Frontend

```powershell
cd ..\frontend
npm install
```

Esto instalará Nuxt 3, Vue 3, Pinia, Tailwind CSS y todas las dependencias necesarias.

### 4️⃣ Instalar dependencias del proyecto raíz

```powershell
cd ..
npm install
```

Esto instala `concurrently` para ejecutar backend y frontend simultáneamente.

---

## 🚀 Ejecución

### ⚡ Modo desarrollo (recomendado)

Desde la raíz del proyecto:

```powershell
npm run dev:all
```

Esto ejecutará automáticamente:
- ✅ **Backend** en http://localhost:3001
- ✅ **Frontend** en http://localhost:3000

### O ejecutar individualmente:

**Backend solamente:**
```powershell
cd backend
npm run dev
```

**Frontend solamente:**
```powershell
cd frontend
npm run dev
```

---

## 👤 Credenciales de Acceso

### 👨‍💼 Administrador
- **Email:** `admin@gaming.com`
- **Password:** `Admin123!`
- **Acceso a:** Panel de administración completo

### 👤 Usuario Cliente
- **Email:** `user@gaming.com`
- **Password:** `User123!`
- **Acceso a:** Catálogo, carrito, checkout, perfil

### 3. Configurar variables de entorno

#### Backend (.env en /backend)
```env
# Database
DATABASE_URL="postgresql://postgres:admin@localhost:5432/gaming_store?schema=public"

# JWT
JWT_SECRET=tu_secret_super_seguro_cambiar_en_produccion
JWT_REFRESH_SECRET=tu_refresh_secret_super_seguro
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=alex
CLOUDINARY_API_KEY=897766855773395
CLOUDINARY_API_SECRET=L0O-B1W4a8tKBh06b6U03qnkI40
CLOUDINARY_URL=cloudinary://897766855773395:L0O-B1W4a8tKBh06b6U03qnkI40@alex

# Stripe
STRIPE_SECRET_KEY=sk_test_tu_clave_aqui
STRIPE_PUBLISHABLE_KEY=pk_test_tu_clave_aqui
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_secret

# Redis
REDIS_URL=redis://localhost:6379

# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env en /frontend)
```env
# API
NUXT_PUBLIC_API_URL=http://localhost:3001/api
NUXT_PUBLIC_STRIPE_KEY=pk_test_tu_clave_aqui

# Cloudinary
NUXT_PUBLIC_CLOUDINARY_CLOUD_NAME=alex
```

### 4. Instalar dependencias

#### Backend
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed  # Datos de ejemplo
```

#### Frontend
```bash
cd frontend
npm install
```

### 5. Iniciar en modo desarrollo

#### Opción A: Todo en una terminal (recomendado)
```bash
npm run dev:all
```

#### Opción B: Terminales separadas

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## 🌐 URLs de Acceso

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001/api
- **Admin Dashboard:** http://localhost:3000/admin

## 👤 Credenciales por Defecto

### Admin
- Email: `admin@gaming.com`
- Password: `Admin123!`

### Cliente
- Email: `user@gaming.com`
- Password: `User123!`

## 📁 Estructura del Proyecto

```
/gaming-store
├── backend/                 # API Express + Prisma
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   ├── src/
│   │   ├── routes/         # Rutas API
│   │   ├── controllers/    # Lógica de negocio
│   │   ├── middleware/     # Auth, validación, etc
│   │   ├── services/       # Cloudinary, Stripe, etc
│   │   ├── utils/          # Helpers
│   │   └── types/          # TypeScript types
│   ├── server.ts
│   └── package.json
├── frontend/               # Nuxt 3 Application
│   ├── app/
│   │   ├── components/    # Componentes Vue
│   │   ├── composables/   # Composables reutilizables
│   │   ├── layouts/       # Layouts
│   │   ├── middleware/    # Route middleware
│   │   ├── pages/         # Páginas (auto-routing)
│   │   ├── stores/        # Pinia stores
│   │   └── utils/         # Utilidades
│   ├── public/
│   ├── assets/
│   ├── nuxt.config.ts
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 🎯 Funcionalidades Principales

### Cliente
- ✅ Navegación y filtrado de productos
- ✅ Búsqueda avanzada
- ✅ Carrito de compras persistente
- ✅ Checkout con Stripe
- ✅ Historial de pedidos
- ✅ Reseñas y valoraciones
- ✅ Gestión de perfil

### Admin
- ✅ Dashboard con métricas
- ✅ CRUD completo de productos
- ✅ Subida de imágenes a Cloudinary
- ✅ Gestión de categorías
- ✅ Gestión de pedidos
- ✅ Gestión de cupones
- ✅ Analytics básicos

## 🔐 Autenticación

- JWT con Access Token (15min) y Refresh Token (7 días)
- Cookies httpOnly para mayor seguridad
- Roles: `ADMIN` y `CUSTOMER`
- Middleware de protección de rutas

## 💳 Pagos

- Integración con Stripe (modo test)
- Webhooks para confirmación automática
- Soporte para múltiples métodos de pago
- Preparado para IziPay (Perú)

## 📸 Gestión de Imágenes

- Upload a Cloudinary desde admin
- Transformaciones automáticas (800x800, webp)
- URLs optimizadas
- Lazy loading en frontend

## 🚀 Deploy

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## 🧪 Testing

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 📊 Seeding

Crear datos de prueba:

```bash
cd backend
npm run seed
```

Esto generará:
- 2 usuarios (admin y cliente)
- 5 categorías de componentes gaming
- 20+ productos
- Reseñas de ejemplo

## 🛠️ Scripts Disponibles

### Root
- `npm run dev:all` - Inicia backend y frontend

### Backend
- `npm run dev` - Modo desarrollo con nodemon
- `npm run build` - Compilar TypeScript
- `npm start` - Producción
- `npm run seed` - Poblar BD
- `npm run migrate` - Ejecutar migraciones

### Frontend
- `npm run dev` - Modo desarrollo
- `npm run build` - Build producción
- `npm run preview` - Preview build
- `npm run generate` - SSG

## 🔍 Variables de Entorno

Ver archivos `.env.example` en cada carpeta para la lista completa.

## 📝 Notas Importantes

1. **Nunca subas tus `.env` a Git** - Ya están en `.gitignore`
2. **Cambia los secrets JWT en producción**
3. **Usa Stripe en modo test** hasta estar listo para producción
4. **Configura CORS** según tu dominio en producción
5. **Configura webhooks de Stripe** en producción

## 🆘 Troubleshooting

### Error: Cannot connect to database
```bash
docker-compose restart postgres
```

### Error: Port already in use
```bash
# Backend (3001)
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Frontend (3000)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Error: Prisma Client not generated
```bash
cd backend
npx prisma generate
```

## 📄 Licencia

MIT

## 👨‍💻 Autor

Desarrollado con ❤️ para la comunidad gaming
