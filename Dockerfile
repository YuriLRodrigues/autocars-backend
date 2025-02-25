FROM node:21-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm install

FROM node:21-alpine AS build
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY prisma ./prisma/
COPY . .
RUN apk add --no-cache openssl3 

ARG VERSION="docker-nidoran"
RUN npm run build

FROM node:21-alpine AS deploy
WORKDIR /app
RUN apt-get update -y 
ENV NODE_ENV production

FROM node:21-alpine AS server
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

EXPOSE 3333

CMD ["npm", "run", "start:prod"]
