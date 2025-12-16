# 🛠️ COMANDOS ÚTILES - GAMING STORE

## 📦 Instalación

### Instalación Automática
```powershell
# Ejecutar script de instalación automática
.\setup.bat
```

### Instalación Manual Completa
```powershell
# 1. Iniciar servicios Docker
docker-compose up -d

# 2. Backend
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed
cd ..

# 3. Frontend
cd frontend
npm install
cd ..

# 4. Raíz
npm install
```

---

## 🚀 Ejecución

### Ejecutar Todo el Proyecto
```powershell
# Ejecutar backend + frontend simultáneamente
npm run dev:all
```

### Ejecutar Individualmente
```powershell
# Backend solamente (en puerto 3001)
cd backend
npm run dev

# Frontend solamente (en puerto 3000)
cd frontend
npm run dev
```

---

## 🐳 Docker

### Gestión de Contenedores
```powershell
# Iniciar servicios (PostgreSQL + Redis)
docker-compose up -d

# Ver contenedores activos
docker ps

# Ver todos los contenedores (activos e inactivos)
docker ps -a

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes (CUIDADO: borra datos de BD)
docker-compose down -v

# Ver logs en tiempo real
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f postgres
docker-compose logs -f redis

# Reiniciar servicios
docker-compose restart

# Reconstruir contenedores
docker-compose up -d --build
```

### Conectarse a PostgreSQL
```powershell
# Conectarse a la BD desde la terminal
docker exec -it proyectos psql -U postgres -d gaming_store

# Una vez dentro de psql:
\dt              # Listar tablas
\d "User"        # Describir tabla User
SELECT * FROM "User";   # Ver usuarios
\q               # Salir
```

---

## 🗄️ Base de Datos (Prisma)

### Migraciones
```powershell
cd backend

# Generar Prisma Client (después de cambios en schema.prisma)
npx prisma generate

# Crear nueva migración (desarrollo)
npx prisma migrate dev --name nombre_de_migracion

# Aplicar migraciones (producción)
npx prisma migrate deploy

# Ver estado de migraciones
npx prisma migrate status

# Resetear BD (CUIDADO: borra todos los datos)
npx prisma migrate reset

# Aplicar migraciones sin reiniciar BD
npx prisma db push
```

### Seed (Datos de Ejemplo)
```powershell
cd backend

# Insertar datos de ejemplo
npm run seed

# O manualmente
npx tsx prisma/seed.ts
```

### Prisma Studio (Interfaz Gráfica)
```powershell
cd backend

# Abrir Prisma Studio en http://localhost:5555
npx prisma studio
```

---

## 📝 Desarrollo

### Backend

```powershell
cd backend

# Modo desarrollo (hot reload)
npm run dev

# Build para producción
npm run build

# Ejecutar build de producción
npm start

# Linting
npm run lint

# Formatear código
npm run format
```

### Frontend

```powershell
cd frontend

# Modo desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Generar sitio estático
npm run generate

# Linting
npm run lint

# Formatear código
npm run format
```

---

## 🧹 Limpieza

### Limpiar Node Modules
```powershell
# Eliminar todas las carpetas node_modules
Remove-Item -Recurse -Force .\node_modules, .\backend\node_modules, .\frontend\node_modules

# Reinstalar todo
npm run install:all
```

### Limpiar Caché de Nuxt
```powershell
cd frontend

# Eliminar caché de Nuxt
Remove-Item -Recurse -Force .nuxt, .output
```

### Limpiar Docker
```powershell
# Eliminar contenedores detenidos
docker container prune

# Eliminar imágenes no usadas
docker image prune

# Eliminar volúmenes no usados
docker volume prune

# Limpiar todo (CUIDADO)
docker system prune -a --volumes
```

---

## 🔍 Debugging

### Ver Logs

```powershell
# Logs de Docker
docker-compose logs -f

# Logs del backend (en modo dev, aparecen en la consola)
cd backend
npm run dev

# Ver logs de errores de Nuxt
cd frontend
npm run dev
```

### Inspeccionar Base de Datos

```powershell
# Opción 1: Prisma Studio (recomendado)
cd backend
npx prisma studio

# Opción 2: psql (línea de comandos)
docker exec -it proyectos psql -U postgres -d gaming_store

# Opción 3: Cliente gráfico (pgAdmin, DBeaver, etc.)
# Host: localhost
# Puerto: 5432
# Usuario: postgres
# Password: admin
# Database: gaming_store
```

### Verificar Variables de Entorno

```powershell
# Backend
cd backend
type .env

# Frontend
cd frontend
type .env
```

---

## 🧪 Testing (Por implementar)

```powershell
# Backend tests
cd backend
npm run test
npm run test:watch
npm run test:coverage

# Frontend tests
cd frontend
npm run test
npm run test:e2e
```

---

## 📊 Análisis

### Bundle Size (Frontend)
```powershell
cd frontend

# Analizar tamaño del bundle
npm run build
npx nuxi analyze
```

### Dependencias
```powershell
# Listar dependencias desactualizadas
npm outdated

# Actualizar dependencias (con precaución)
npm update

# Verificar vulnerabilidades
npm audit

# Reparar vulnerabilidades automáticamente
npm audit fix
```

---

## 🔄 Git

```powershell
# Inicializar repositorio
git init

# Agregar todos los archivos
git add .

# Commit inicial
git commit -m "Initial commit: Gaming Store complete"

# Conectar con repositorio remoto
git remote add origin <url-del-repo>

# Push
git push -u origin main
```

---

## 🚢 Deployment

### Build para Producción

```powershell
# Backend
cd backend
npm run build
# Genera: dist/

# Frontend
cd frontend
npm run build
# Genera: .output/
```

### Variables de Entorno Producción

```powershell
# Backend (.env.production)
DATABASE_URL="postgresql://user:password@host:5432/database"
JWT_SECRET="secreto-super-seguro-produccion-64-caracteres-minimo-requerido"
JWT_REFRESH_SECRET="secreto-refresh-super-seguro-produccion-64-caracteres-minimo"
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
STRIPE_SECRET_KEY=sk_live_tu_clave_real
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_real
REDIS_URL=redis://host:6379
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://tu-dominio.com

# Frontend (.env.production)
NUXT_PUBLIC_API_URL=https://api.tu-dominio.com/api
NUXT_PUBLIC_STRIPE_KEY=pk_live_tu_clave_publica_real
NUXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu_cloud_name
```

---

## 🆘 Solución de Problemas Rápida

### Error: "Puerto ocupado"
```powershell
# Encontrar proceso en puerto 3000
netstat -ano | findstr :3000

# Matar proceso (reemplazar <PID>)
taskkill /PID <PID> /F

# Encontrar proceso en puerto 3001
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Error: "Docker no responde"
```powershell
# Reiniciar Docker Desktop
# (Buscar en barra de tareas → Docker → Restart)

# O desde PowerShell (como admin)
Restart-Service docker
```

### Error: "Prisma Client no generado"
```powershell
cd backend
Remove-Item -Recurse -Force node_modules\.prisma
npx prisma generate
```

### Error: "Cannot find module"
```powershell
# Reinstalar dependencias
Remove-Item -Recurse -Force node_modules
npm install
```

### Error: "Database connection failed"
```powershell
# Verificar que PostgreSQL esté corriendo
docker ps

# Si no está, iniciarlo
docker-compose up -d

# Verificar logs
docker-compose logs postgres
```

---

## 📋 Comandos de Verificación

### Verificar Instalaciones
```powershell
# Node.js
node --version    # Debe ser v18 o superior

# npm
npm --version     # Debe ser v9 o superior

# Docker
docker --version  # Cualquier versión reciente

# Docker Compose
docker-compose --version
```

### Verificar Estado del Proyecto
```powershell
# Servicios Docker
docker ps
# Debe mostrar 'proyectos' (PostgreSQL) y 'redis'

# Backend dependencies
cd backend
npm list --depth=0

# Frontend dependencies
cd ../frontend
npm list --depth=0

# Base de datos
cd ../backend
npx prisma studio
# Debe abrir en http://localhost:5555
```

---

## 🎯 Atajos de Desarrollo

### Scripts del Proyecto Raíz
```powershell
# Ejecutar todo (backend + frontend)
npm run dev:all

# Instalar todo
npm run install:all

# Setup completo
npm run setup
```

### Scripts del Backend
```powershell
cd backend

npm run dev         # Desarrollo con hot reload
npm run build       # Build producción
npm start           # Ejecutar build
npm run seed        # Insertar datos ejemplo
npm run prisma:studio  # Abrir Prisma Studio
```

### Scripts del Frontend
```powershell
cd frontend

npm run dev         # Desarrollo
npm run build       # Build producción
npm run preview     # Preview build
npm run generate    # SSG (static site generation)
```

---

## 📚 Documentación de Referencia

- **Nuxt 3:** https://nuxt.com/docs
- **Prisma:** https://www.prisma.io/docs
- **Express:** https://expressjs.com/
- **Pinia:** https://pinia.vuejs.org/
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Stripe:** https://stripe.com/docs/api
- **Cloudinary:** https://cloudinary.com/documentation

---

## 🎉 Comandos de Un Solo Paso

### Resetear Todo el Proyecto
```powershell
# ⚠️ CUIDADO: Esto eliminará todos los datos
docker-compose down -v
cd backend
Remove-Item -Recurse -Force node_modules, dist, prisma\migrations
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed
cd ../frontend
Remove-Item -Recurse -Force node_modules, .nuxt, .output
npm install
cd ..
npm install
```

### Start Fresh
```powershell
# Comenzar de cero (después de git clone)
.\setup.bat
npm run dev:all
```

---

**¡Con estos comandos tienes control total del proyecto! 🚀**
