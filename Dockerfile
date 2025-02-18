# Usa a imagem base do Node.js 20
FROM node:20-alpine AS builder

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos necessários para instalar dependências
COPY package.json package-lock.json ./

# Instala apenas as dependências de produção
RUN npm ci

# Copia o restante do código do projeto
COPY . .

# Compila o projeto NestJS
RUN npm run prisma generate

# Compila o projeto NestJS
RUN npm run build

# Reduz o tamanho da imagem final
FROM node:20-alpine AS runner

# Define o diretório de trabalho no container final
WORKDIR /app

# Copia apenas o código necessário do estágio anterior
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Define a variável de ambiente para produção
ENV NODE_ENV=production

# Expõe a porta padrão do NestJS
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "dist/main"]
