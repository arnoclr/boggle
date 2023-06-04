FROM node:18-alpine

ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD if [ "$NODE_ENV" = "production" ]; \
    then npm run serve; \
    else npm run dev; \
    fi