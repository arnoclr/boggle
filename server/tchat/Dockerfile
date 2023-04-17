FROM node:18-alpine

WORKDIR /app

COPY . .

RUN rm -rf node_modules
RUN npm i

EXPOSE 3000

CMD ["npm", "start"]