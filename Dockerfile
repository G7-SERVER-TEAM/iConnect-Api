FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g @nestjs/cli && npm install

COPY . .

RUN npm run build