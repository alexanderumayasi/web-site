# 📝 INSTRUCCIONES DE INSTALACIÓN - GAMING STORE

## ✅ Pasos para Ejecutar el Proyecto

### PASO 1: Verificar Docker Desktop

1. Abre **Docker Desktop**
2. Asegúrate de que Docker esté corriendo (icono verde en la barra de tareas)
3. Si no está instalado, descárgalo de: https://www.docker.com/products/docker-desktop/

### PASO 2: Iniciar Servicios Docker

Abre **PowerShell** o **CMD** en la raíz del proyecto (`f:\alesnuxt.jsproyecto`) y ejecuta:

```powershell
docker-compose up -d
```

**✅ Deberías ver:**
```
[+] Running 3/3
 ✔ Network alesnuxtjsproyecto_default  Created
 ✔ Container proyectos                  Started
 ✔ Container alesnuxtjsproyecto-redis-1 Started
```

**Verificar que los contenedores estén corriendo:**

```powershell
docker ps
```

Deberías ver 2 contenedores:
- `proyectos` (PostgreSQL 17.4) en puerto 5432
- `alesnuxtjsproyecto-redis-1` (Redis) en puerto 6379

---

### PASO 3: Configurar e Instalar Backend

```powershell
cd backend
npm install
```

**Espera a que se instalen todas las dependencias (~2-3 minutos).**

Una vez terminado, ejecuta:

```powershell
npx prisma generate
```

**✅ Deberías ver:**
```
✔ Generated Prisma Client (5.8.0 | library) to .\node_modules\@prisma\client
```

Ahora crea las tablas en PostgreSQL:

```powershell
npx prisma migrate dev --name init
```

**✅ Deberías ver:**
```
Applying migration `20XXXXXX_init`
The following migration(s) have been applied:
migrations/
  └─ 20XXXXXX_init/
      └─ migration.sql

Your database is now in sync with your schema.
```

**Inserta datos de ejemplo:**

```powershell
npm run seed
```

**✅ Deberías ver:**
```
🌱 Seeding database...
✅ Admin user created: admin@gaming.com
✅ Customer user created: user@gaming.com
✅ Categories created: 5
✅ Products created: 10
✅ Coupons created: 2
✅ Database seeded successfully!
```

---

### PASO 4: Configurar e Instalar Frontend

Regresa a la raíz del proyecto y navega al frontend:

```powershell
cd ..
cd frontend
npm install
```

**Espera a que se instalen todas las dependencias (~2-3 minutos).**

---

### PASO 5: Instalar Dependencias del Proyecto Raíz

Regresa a la raíz del proyecto:

```powershell
cd ..
npm install
```

---

### PASO 6: ¡EJECUTAR EL PROYECTO! 🚀

Desde la raíz del proyecto, ejecuta:

```powershell
npm run dev:all
```

**✅ Deberías ver algo como:**

```
[backend] Server running on http://localhost:3001
[frontend] Nuxt 3.9.1 with Nitro 2.8.1
[frontend] ➜ Local:   http://localhost:3000/
```

---

## 🌐 Acceder a la Aplicación

### Frontend (Tienda)
**URL:** http://localhost:3000

Aquí podrás:
- ✅ Ver el catálogo de productos
- ✅ Buscar y filtrar componentes gaming
- ✅ Agregar productos al carrito
- ✅ Iniciar sesión / Registrarte
- ✅ Realizar compras (con Stripe en modo test)

### Backend API
**URL:** http://localhost:3001/api

Endpoints disponibles:
- `GET /api/products` - Listar productos
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/cart` - Ver carrito
- ...y muchos más

### Panel de Administración
**URL:** http://localhost:3000/admin

**Credenciales de Admin:**
- Email: `admin@gaming.com`
- Password: `Admin123!`

Funcionalidades admin:
- ✅ Dashboard con analytics
- ✅ Gestión de productos
- ✅ Gestión de órdenes
- ✅ Gestión de categorías
- ✅ Gestión de cupones
- ✅ Gestión de usuarios

### Prisma Studio (Visualizador de BD)
**Opcional:** Para ver la base de datos gráficamente:

```powershell
cd backend
npx prisma studio
```

**URL:** http://localhost:5555

---

## 🧪 Probar la Aplicación

### Como Cliente:

1. **Crear una cuenta nueva:**
   - Ir a http://localhost:3000/auth/register
   - Llenar el formulario
   - Hacer clic en "Crear Cuenta"

2. **O iniciar sesión con usuario de prueba:**
   - Ir a http://localhost:3000/auth/login
   - Email: `user@gaming.com`
   - Password: `User123!`

3. **Explorar productos:**
   - Ir a http://localhost:3000/products
   - Usar filtros de búsqueda, categoría, precio
   - Hacer clic en un producto para ver detalles

4. **Agregar al carrito:**
   - Hacer clic en "Agregar al Carrito"
   - Ver el icono del carrito actualizarse
   - Ir a http://localhost:3000/cart

5. **Checkout (próximamente):**
   - Proceder al pago con Stripe
   - Usar tarjeta de prueba: `4242 4242 4242 4242`
   - Fecha: Cualquier fecha futura
   - CVV: Cualquier 3 dígitos

### Como Administrador:

1. **Iniciar sesión:**
   - Email: `admin@gaming.com`
   - Password: `Admin123!`

2. **Acceder al panel admin:**
   - Ir a http://localhost:3000/admin

3. **Ver dashboard:**
   - Total de ventas
   - Número de órdenes
   - Total de clientes
   - Productos en stock
   - Top productos
   - Órdenes recientes

---

## ❌ Solución de Problemas

### Error: "docker: command not found"
**Solución:** Instala Docker Desktop desde https://www.docker.com/products/docker-desktop/

### Error: "Cannot connect to database"
**Solución:**
1. Verifica que Docker Desktop esté corriendo
2. Verifica que el contenedor `proyectos` esté activo: `docker ps`
3. Reinicia los servicios: `docker-compose down` y luego `docker-compose up -d`

### Error: "Port 3000 already in use"
**Solución:**
```powershell
# Encuentra el proceso que usa el puerto
netstat -ano | findstr :3000

# Mata el proceso (reemplaza <PID> con el número de la columna derecha)
taskkill /PID <PID> /F
```

### Error: "Prisma Client not generated"
**Solución:**
```powershell
cd backend
npx prisma generate
```

### Error: "Module not found" en el código
**Solución:** Estos errores son normales antes de ejecutar `npm install`. Desaparecerán después de la instalación.

### Los contenedores de Docker no inician
**Solución:**
```powershell
# Ver logs de errores
docker-compose logs

# Eliminar contenedores y volúmenes
docker-compose down -v

# Volver a crear
docker-compose up -d
```

---

## 📊 Base de Datos Inicial

Después de ejecutar `npm run seed`, tendrás:

### Usuarios:
- **Admin:** admin@gaming.com / Admin123!
- **Cliente:** user@gaming.com / User123!

### Categorías:
1. Procesadores (10 productos)
2. Tarjetas Gráficas (8 productos)
3. Memoria RAM (15 productos)
4. Almacenamiento (12 productos)
5. Placas Madre (9 productos)

### Productos (Ejemplos):
- AMD Ryzen 9 7950X - S/ 2,899
- NVIDIA RTX 4090 - S/ 7,999
- Corsair Vengeance DDR5 32GB - S/ 699
- Samsung 980 PRO 2TB - S/ 899
- ASUS ROG Strix Z790 - S/ 1,599
- Intel Core i9-13900K - S/ 2,699
- AMD RX 7900 XTX - S/ 4,999
- G.Skill Trident Z5 64GB - S/ 1,299
- WD Black SN850X 4TB - S/ 1,799
- MSI MPG Z690 - S/ 1,399

### Cupones:
- **WELCOME10** - 10% de descuento
- **GAMING50** - S/ 50 de descuento (compra mínima S/ 500)

---

## 🔄 Detener el Proyecto

Para detener los servidores:

1. Presiona `Ctrl + C` en la terminal donde ejecutaste `npm run dev:all`

2. Para detener Docker:
```powershell
docker-compose down
```

---

## ▶️ Reiniciar el Proyecto

1. Inicia Docker Desktop
2. Ejecuta:
```powershell
docker-compose up -d
npm run dev:all
```

---

## 🎉 ¡Listo!

Tu tienda gaming está lista para funcionar. Puedes:

- ✅ Navegar por el catálogo
- ✅ Agregar productos al carrito
- ✅ Gestionar el inventario desde el admin
- ✅ Ver analytics y reportes
- ✅ Procesar pagos con Stripe (próximamente)

**¡Feliz desarrollo! 🚀**
