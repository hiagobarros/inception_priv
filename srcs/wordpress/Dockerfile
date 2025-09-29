FROM debian:bullseye

ENV DEBIAN_FRONTEND=noninteractive

# Instala dependências
RUN apt-get update && \
    apt-get install -y \
    php-fpm \
    php-mysql \
    php-curl \
    php-gd \
    php-mbstring \
    php-xml \
    php-xmlrpc \
    php-soap \
    php-intl \
    php-zip \
    curl \
    wget \
    unzip \
    mariadb-client && \
    rm -rf /var/lib/apt/lists/*

# Cria diretório do WordPress
RUN mkdir -p /var/www/html

WORKDIR /var/www/html

# Baixa e instala WordPress
RUN curl -O https://wordpress.org/latest.tar.gz && \
    tar -xzf latest.tar.gz --strip-components=1 && \
    rm latest.tar.gz

# Copia script de configuração (criaremos depois)
COPY ./tools/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expõe a porta usada pelo PHP-FPM
EXPOSE 9000

ENTRYPOINT ["/entrypoint.sh"]

