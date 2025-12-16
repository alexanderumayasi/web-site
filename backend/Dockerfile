# Backend Dockerfile
FROM node:20-alpine AS base

# Instalar dependencias del sistema necesarias
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependencias
RUN npm ci --only=production && npm cache clean --force

# Copiar el resto del código
COPY . .

# Generar Prisma Client
RUN npx prisma generate

# Build de TypeScript
RUN npm run build

# Exponer el puerto
EXPOSE 3001

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3001

# Comando para iniciar la aplicación
CMD ["npm", "start"]
