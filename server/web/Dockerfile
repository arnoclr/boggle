FROM php:7.4-apache

RUN apt-get update && apt-get install -y \
    git \
    zip \
    unzip \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

COPY /web /var/www/html

RUN composer install

RUN docker-php-ext-install pdo pdo_mysql

RUN apt-get install -y openjdk-11-jre-headless && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

COPY /engine /var/www/engine

WORKDIR /var/www/engine

RUN gcc dictionnary_build/*.c -o dictionnary_build.bin
RUN gcc dictionnary_lookup/main.c dictionnary_lookup/lookup/*.c -o dictionnary_lookup.bin
RUN gcc grid_build/*.c -o grid_build.bin
RUN gcc grid_path/*.c -o grid_path.bin
RUN gcc score/score_basique.c -o score_basique.bin
RUN gcc score/score_scrabble.c -o score_scrabble.bin
RUN gcc solve/*.c dictionnary_lookup/lookup/*.c -o solve.bin

RUN ./dictionnary_build.bin dictionnary_build/dico.txt dico.lex

COPY /jdict /var/www/jdict

CMD ["apache2-foreground"]