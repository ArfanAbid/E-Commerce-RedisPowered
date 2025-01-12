FROM node:20

WORKDIR /usr/backend/app 

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "start" ]
