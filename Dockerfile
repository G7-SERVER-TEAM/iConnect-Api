FROM node:16-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

COPY . .

RUN npm install -g && npm install

RUN npm run build