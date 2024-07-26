FROM node:18.16.0-alpine3.17

RUN mkdir -p /app
WORKDIR /app

COPY package.json .
COPY package-lock.json .
COPY . .

RUN npm install

EXPOSE 3000

CMD [ "npm", "start"]