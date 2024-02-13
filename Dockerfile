# The base image for development
FROM node:16-alpine as development

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

COPY . .

RUN npm install -g && npm install

RUN npm run build

# Create a production image
FROM node:alpine as production

ARG NODE_ENV=production

ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install --only=production

COPY --from=development /usr/src/app/dist ./dist

COPY --from=development /usr/src/app/package.json ./package.json

CMD [ "node", "dist/apps/auth/main" ]