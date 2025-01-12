FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Command to start Vite development server
CMD ["npm", "run", "dev"]