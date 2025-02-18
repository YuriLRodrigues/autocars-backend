FROM node:23 AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm install

FROM node:23 AS build
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

ARG VERSION="docker-nidoran"
RUN npm run build

FROM node:23 AS deploy
WORKDIR /app
RUN apt-get update -y 
ENV NODE_ENV production

FROM node:23 AS server
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

EXPOSE 3333

CMD ["npm", "run", "start:prod"]
