FROM node:10

WORKDIR /app/product-catalog-api
COPY package*.json ./
RUN npm install
ADD . /app/product-catalog-api
RUN npm run compile
EXPOSE 8081

CMD [ "node", "build/src/server.js" ]