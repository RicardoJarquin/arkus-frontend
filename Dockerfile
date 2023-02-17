FROM node:18.14.0-alpine3.17

WORKDIR /var/www/html

COPY . .

RUN apk add htop

RUN apk add nano

RUN npm install

EXPOSE 3000