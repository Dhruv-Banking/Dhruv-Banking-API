FROM node:19

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=3000

EXPOSE 3000 6379 5432

CMD [ "make" ]
