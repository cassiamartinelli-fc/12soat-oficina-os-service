# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Instalar apenas dependências de produção
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copiar build do stage anterior
COPY --from=builder /app/dist ./dist

# Expor porta
EXPOSE 3000

# Variáveis de ambiente (serão sobrescritas pelo ConfigMap/Secret do K8s)
ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Usuário não-root para segurança
USER node

# Comando para iniciar a aplicação
CMD ["node", "dist/main"]
