@echo off
echo ========================================
echo    GAMING STORE - INSTALACION AUTOMATICA
echo ========================================
echo.

echo [1/6] Verificando Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker no esta instalado.
    echo Por favor instala Docker Desktop desde: https://www.docker.com/products/docker-desktop/
    pause
    exit /b 1
)
echo [OK] Docker encontrado

echo.
echo [2/6] Iniciando servicios Docker...
docker-compose up -d
if %errorlevel% neq 0 (
    echo [ERROR] No se pudieron iniciar los servicios Docker
    pause
    exit /b 1
)
echo [OK] PostgreSQL y Redis iniciados

echo.
echo [3/6] Instalando dependencias del backend...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Error instalando dependencias del backend
    cd ..
    pause
    exit /b 1
)
echo [OK] Backend dependencies instaladas

echo.
echo [4/6] Configurando Prisma y base de datos...
call npx prisma generate
if %errorlevel% neq 0 (
    echo [ERROR] Error generando Prisma Client
    cd ..
    pause
    exit /b 1
)

call npx prisma migrate dev --name init
if %errorlevel% neq 0 (
    echo [ERROR] Error aplicando migraciones
    cd ..
    pause
    exit /b 1
)

call npm run seed
if %errorlevel% neq 0 (
    echo [ERROR] Error insertando datos de ejemplo
    cd ..
    pause
    exit /b 1
)
echo [OK] Base de datos configurada

cd ..

echo.
echo [5/6] Instalando dependencias del frontend...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Error instalando dependencias del frontend
    cd ..
    pause
    exit /b 1
)
echo [OK] Frontend dependencies instaladas

cd ..

echo.
echo [6/6] Instalando dependencias del proyecto raiz...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Error instalando dependencias del proyecto raiz
    pause
    exit /b 1
)
echo [OK] Proyecto configurado

echo.
echo ========================================
echo    INSTALACION COMPLETADA CON EXITO!
echo ========================================
echo.
echo Credenciales de acceso:
echo.
echo ADMIN:
echo   Email: admin@gaming.com
echo   Password: Admin123!
echo.
echo CLIENTE:
echo   Email: user@gaming.com
echo   Password: User123!
echo.
echo Para iniciar el proyecto ejecuta:
echo   npm run dev:all
echo.
echo El proyecto estara disponible en:
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:3001
echo   Admin:    http://localhost:3000/admin
echo.
pause
