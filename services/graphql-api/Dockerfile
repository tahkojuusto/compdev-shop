FROM node:10

WORKDIR /app/graphql-api
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8081

CMD [ "node", "build/src/app.js" ]