# 🚀 GUÍA RÁPIDA DE USO - GAMING STORE

## ⚡ INICIO RÁPIDO (3 pasos)

### 1️⃣ Iniciar Docker
```bash
docker-compose up -d
```
✅ Esto inicia PostgreSQL y Redis

### 2️⃣ Iniciar Backend
```bash
cd backend
npm run dev
```
✅ Backend corriendo en http://localhost:3001

### 3️⃣ Iniciar Frontend
```bash
cd frontend
npm run dev
```
✅ Frontend corriendo en http://localhost:3000

---

## 🎯 ACCESO RÁPIDO

| Servicio | URL | Descripción |
|----------|-----|-------------|
| 🏠 **Frontend** | http://localhost:3000 | Tienda principal |
| 🔧 **Backend API** | http://localhost:3001/api | API REST |
| 🗄️ **PostgreSQL** | localhost:5432 | Base de datos |
| 🔴 **Redis** | localhost:6379 | Caché |

---

## 🤖 PROBAR EL CHATBOT

### Opción 1: Interfaz Web
1. Abrir http://localhost:3000
2. Click en botón flotante (esquina inferior derecha)
3. Escribir: **"Hola"** o usar sugerencias

### Opción 2: API Directa
```bash
# Obtener sugerencias
curl http://localhost:3001/api/chatbot/suggestions

# Enviar mensaje
curl -X POST http://localhost:3001/api/chatbot/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hola","conversationHistory":[]}'
```

### Preguntas de Ejemplo:
```
✅ "Hola, ¿qué puedes hacer?"
✅ "Tengo S/1500 de presupuesto, ¿qué me recomiendas?"
✅ "¿Qué GPUs tienen disponibles?"
✅ "Necesito un procesador Intel"
✅ "Recomiéndame RAM para gaming"
✅ "¿Cuánto cuesta un RTX 4090?"
```

---

## 💳 PROBAR PAGOS CON STRIPE

### Flujo Completo:
1. **Navegar** a http://localhost:3000
2. **Agregar productos** al carrito
3. **Ir al carrito** (icono en header)
4. **Click en "Proceder al Checkout"**
5. **Llenar formulario** de envío
6. **Datos de tarjeta de prueba:**
   ```
   Número: 4242 4242 4242 4242
   Fecha: 12/25 (cualquier fecha futura)
   CVC: 123 (cualquier 3 dígitos)
   ZIP: 15001 (cualquier código)
   ```
7. **Aceptar términos** y click en "Procesar Pago"
8. **Ver confirmación** en página de éxito

### Más Tarjetas de Prueba:
```
✅ Éxito: 4242 4242 4242 4242
❌ Declinada: 4000 0000 0000 0002
⏳ Requiere autenticación: 4000 0025 0000 3155
```

---

## 🔍 PROBAR BÚSQUEDA

1. **Click en barra de búsqueda** (header)
2. **Escribir:** "RTX" o "Intel" o "RAM"
3. **Ver autocompletado** en tiempo real
4. **Click en producto** para ir a detalle

---

## 👤 PROBAR AUTENTICACIÓN

### Crear Cuenta:
1. Click en "Registrarse" (header)
2. Llenar formulario
3. Click en "Crear Cuenta"

### Iniciar Sesión:
1. Click en "Iniciar Sesión"
2. Email: tu-email@ejemplo.com
3. Password: tu-contraseña
4. Click en "Iniciar Sesión"

### Usuario Admin de Prueba:
```
Email: admin@example.com
Password: admin123
```

---

## 📱 FUNCIONALIDADES PRINCIPALES

### Para Clientes:
- ✅ Ver catálogo completo de productos
- ✅ Buscar productos con autocompletado
- ✅ Agregar al carrito
- ✅ Chatbot de asistencia 24/7
- ✅ Proceso de checkout
- ✅ Pagar con Stripe (modo test)
- ✅ Ver confirmación de pedido
- ✅ Ver perfil y órdenes
- ✅ Dejar reseñas

### Para Administradores:
- ✅ Panel de administración (/admin)
- ✅ Gestionar productos
- ✅ Gestionar categorías
- ✅ Gestionar órdenes
- ✅ Gestionar usuarios
- ✅ Gestionar cupones
- ✅ Ver analíticas

---

## 🛠️ COMANDOS ÚTILES

### Backend:
```bash
# Desarrollo
npm run dev

# Prisma Studio (ver base de datos)
npm run studio

# Migrar base de datos
npm run migrate

# Seed de datos
npm run seed
```

### Frontend:
```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview de producción
npm run preview
```

### Docker:
```bash
# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down

# Reiniciar
docker-compose restart
```

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Backend no inicia:
```bash
# Verificar puerto 3001 libre
netstat -ano | findstr :3001

# Detener proceso que usa el puerto
Stop-Process -Id <PID> -Force
```

### Frontend no inicia:
```bash
# Verificar puerto 3000 libre
netstat -ano | findstr :3000

# Limpiar caché de Nuxt
rm -rf .nuxt
npm run dev
```

### Docker no responde:
```bash
# Reiniciar Docker
docker-compose down
docker-compose up -d

# Ver estado
docker ps
```

### Chatbot no responde:
1. Verificar variable GEMINI_API_KEY en backend
2. Ver logs del backend en terminal
3. Verificar conexión a internet

### Stripe no procesa:
1. Verificar claves en frontend/nuxt.config.ts
2. Usar tarjeta de prueba correcta: 4242 4242 4242 4242
3. Ver consola del navegador para errores

---

## 📊 MONITOREO

### Verificar Estado del Sistema:
```bash
# Backend
curl http://localhost:3001/api/products?limit=1

# Chatbot
curl http://localhost:3001/api/chatbot/suggestions

# Frontend
curl http://localhost:3000
```

### Ver Logs:
- **Backend:** Ver terminal donde corre `npm run dev`
- **Frontend:** Ver terminal de Nuxt
- **Docker:** `docker-compose logs -f`
- **Navegador:** F12 → Consola

---

## ✅ CHECKLIST DE VERIFICACIÓN

Antes de usar el sistema, verificar:
- [ ] Docker está corriendo (`docker ps` muestra 2 contenedores)
- [ ] Backend está corriendo (terminal muestra "Server running on port 3001")
- [ ] Frontend está corriendo (terminal muestra "Local: http://localhost:3000")
- [ ] http://localhost:3000 se abre correctamente
- [ ] Chatbot aparece en esquina inferior derecha
- [ ] Productos se ven en la página principal

---

## 🎓 RECURSOS

### Documentación:
- **Nuxt 3:** https://nuxt.com/docs
- **Stripe Test:** https://stripe.com/docs/testing
- **Prisma:** https://www.prisma.io/docs
- **Gemini API:** https://ai.google.dev/docs

### Archivos Importantes:
- **Diagnóstico completo:** `DIAGNOSTICO_SISTEMA.md`
- **Backend routes:** `backend/src/server.ts`
- **Chatbot logic:** `backend/src/routes/chatbot.routes.ts`
- **Checkout page:** `frontend/pages/checkout.vue`
- **Chatbot UI:** `frontend/components/Chatbot.vue`

---

## 🆘 SOPORTE

Si encuentras algún problema:
1. **Ver logs** de backend y frontend
2. **Verificar consola** del navegador (F12)
3. **Revisar** archivo `DIAGNOSTICO_SISTEMA.md`
4. **Verificar Docker** está corriendo

---

**Sistema listo para usar. ¡Disfruta tu tienda gaming con chatbot inteligente!** 🎮🚀
