FROM node:10

WORKDIR /app/graphql-api
COPY package*.json ./
RUN npm install
ADD . /app/graphql-api
RUN npm run compile
EXPOSE 8081

CMD [ "node", "build/src/app.js" ]