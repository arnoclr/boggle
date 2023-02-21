FROM php:7.4-apache

RUN apt-get update && apt-get install -y \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd

RUN docker-php-ext-install pdo pdo_mysql

RUN apt-get install -y openjdk-11-jre-headless && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

COPY /engine /var/www/engine

WORKDIR /var/www/engine
RUN gcc grid_build.c -o grid_build
RUN gcc grid_path.c -o grid_path
RUN gcc dictionnary_lookup.c -o dictionnary_lookup
RUN gcc dictionnary_build.c -o dictionnary_build
RUN gcc score.c -o score

COPY /jdict /var/www/jdict

CMD ["apache2-foreground"]