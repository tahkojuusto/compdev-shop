FROM node:10

WORKDIR /app/order-api
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080

CMD [ "node", "build/src/app.js" ]