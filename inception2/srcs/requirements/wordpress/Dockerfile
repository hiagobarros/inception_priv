# Usando uma imagem base com PHP-FPM e extensões necessárias para o WordPress
FROM php:7.4-fpm-alpine

# Instalar dependências do WordPress
RUN apk add --no-cache bash libpng-dev libjpeg-turbo-dev freetype-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd mysqli opcache


# Copiar o arquivo de configuração PHP (opcional, se necessário)
# COPY ./conf/php.ini /usr/local/etc/php/conf.d/

# Expor a porta 9000 para comunicação com o NGINX
EXPOSE 9000

# O PHP-FPM será o processo principal do container
CMD ["php-fpm"]
