FROM node:12.4.0

WORKDIR /usr/src/app

COPY package.json ./
RUN npm install
COPY . .

CMD [ "node", "index.js" ]