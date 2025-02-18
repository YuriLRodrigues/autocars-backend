FROM node:20-alpine AS builder
WORKDIR /build
COPY package.json ./
COPY package-lock.json ./
COPY .npmrc ./
RUN npm ci --omit=dev --ignore-scripts

FROM node:20-alpine AS compiler
WORKDIR /dist
COPY --chown=node:node . .
RUN npm install && npm run build

FROM node:20-alpine
ENV HOME=/home/app
ENV APP_HOME=$HOME/node/
WORKDIR $APP_HOME
COPY --chown=node:node --from=builder /build $APP_HOME
COPY --chown=node:node --from=compiler /dist/dist $APP_HOME/dist
USER node
CMD npm run prod