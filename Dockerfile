FROM node:16.13.2-alpine

RUN npm install -g npm@9.1.1

WORKDIR /app/babble-backend/

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8080

CMD [ "npm", "run", "dev" ]