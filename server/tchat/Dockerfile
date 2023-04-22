FROM node:18-alpine

WORKDIR /app

COPY . .

RUN rm -rf node_modules
RUN npm i

EXPOSE 8082

CMD ["npm", "start"]