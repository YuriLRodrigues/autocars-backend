# Usa a imagem base do Node.js 20
FROM node:20-alpine AS builder

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências
COPY package.json package-lock.json ./

# Instala todas as dependências, incluindo as do Prisma
RUN npm ci

# Copia os arquivos do Prisma e gera o client
COPY prisma ./prisma
RUN npx prisma generate

# Copia o restante do código do projeto
COPY . .

# Compila o projeto NestJS
RUN npm run build

# Criar a imagem final para produção
FROM node:20-alpine AS runner

# Define o diretório de trabalho no container final
WORKDIR /home/app

# Copia apenas os arquivos necessários do estágio de build
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist

# Define o usuário não-root para maior segurança
USER node

# Define a variável de ambiente para produção
ENV NODE_ENV=production

# Expõe a porta padrão do NestJS
EXPOSE 3333

# Comando para iniciar a aplicação
CMD ["npm", "run", "start:prod"]
