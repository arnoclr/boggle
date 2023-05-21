FROM node:18-alpine

COPY /engine /engine

RUN apk add --no-cache gcc g++ make

WORKDIR /engine

RUN gcc dictionnary_build/*.c -o dictionnary_build.bin
RUN gcc dictionnary_lookup/main.c dictionnary_lookup/lookup/*.c -o dictionnary_lookup.bin
RUN gcc grid_build/*.c -o grid_build.bin
RUN gcc grid_path/*.c -o grid_path.bin
RUN gcc score/score_basique.c -o score_basique.bin
RUN gcc score/score_scrabble.c -o score_scrabble.bin
RUN gcc solve/*.c dictionnary_lookup/lookup/*.c -o solve.bin

RUN ./dictionnary_build.bin dictionnary_build/dico.txt dico.lex

RUN apk del gcc g++ make

WORKDIR /app

COPY /tchat/package*.json ./

RUN npm install

COPY /tchat .

EXPOSE 8082

CMD ["npm", "run", "start"]