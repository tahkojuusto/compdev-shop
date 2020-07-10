FROM node:10

WORKDIR /app/order-api
COPY package*.json ./
RUN npm install
ADD . /app/order-api
RUN npm run compile
EXPOSE 8082

CMD [ "node", "build/src/app.js" ]