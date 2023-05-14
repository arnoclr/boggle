FROM node:18-alpine

COPY /engine /engine

RUN apk add --no-cache gcc g++ make

WORKDIR /engine

RUN gcc grid_build.c -o grid_build
RUN gcc grid_path.c -o grid_path
RUN gcc dictionnary_lookup.c -o dictionnary_lookup
RUN gcc dictionnary_build.c -o dictionnary_build
RUN gcc score.c -o score

RUN apk del gcc g++ make

WORKDIR /app

COPY /tchat/package*.json ./

RUN npm install

COPY /tchat .

EXPOSE 8082

CMD ["npm", "run", "start"]