# 1️⃣ Instalar dependências
FROM node:20-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci

# 2️⃣ Construir a aplicação
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
ARG VERSION="docker-nidoran"
RUN npm run build

# 3️⃣ Criar imagem final para rodar a aplicação
FROM node:20-alpine AS server
WORKDIR /app

# 🟢 Garantir que o OpenSSL está instalado
RUN apk add --no-cache openssl1.1-compat

# 🟢 Copiar apenas o necessário para o ambiente de produção
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

# Definir ambiente de produção
ENV NODE_ENV production

# Expor porta
EXPOSE 3333

# Comando para rodar o servidor
CMD ["npm", "run", "start:prod"]
