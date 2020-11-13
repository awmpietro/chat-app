FROM node:12.16.2

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package*.json ./

RUN npm install && npm cache clean --force

COPY . ./