FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache libssl1.1-compat

COPY package.json package-lock.json ./

RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /home/app

RUN apk add --no-cache libssl1.1-compat

COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist

USER node

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
