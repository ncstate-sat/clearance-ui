FROM node:18

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

RUN npm run build

ENV PORT 3000

EXPOSE $PORT

CMD ["npm", "run", "serve"]