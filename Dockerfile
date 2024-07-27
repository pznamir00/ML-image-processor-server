FROM node:18.16.0-alpine3.17

RUN mkdir -p /app
WORKDIR /app

COPY package.json .
COPY package-lock.json .
COPY . .

RUN npm install -g nodemon
RUN npm install

EXPOSE 8000

CMD [ "nodemon", "-L", "npm", "run", "dev"]
