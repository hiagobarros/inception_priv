FROM alpine:3.18

# Install PHP and required extensions
RUN apk update && apk add --no-cache \
    php81 \
    php81-fpm \
    php81-mysqli \
    php81-json \
    php81-openssl \
    php81-curl \
    php81-zlib \
    php81-xml \
    php81-phar \
    php81-intl \
    php81-dom \
    php81-xmlreader \
    php81-ctype \
    php81-session \
    php81-mbstring \
    php81-gd \
    php81-zip \
    php81-iconv \
    php81-simplexml \
    php81-tokenizer \
    php81-fileinfo \
    php81-opcache \
    php81-pecl-redis \
    wget \
    unzip

# Create necessary directories
RUN mkdir -p /var/www/html /var/log/php-fpm

# Download and install WordPress
RUN wget https://wordpress.org/latest.tar.gz && \
    tar -xzf latest.tar.gz && \
    rm latest.tar.gz && \
    mv wordpress/* /var/www/html/ && \
    rm -rf wordpress

# Copy PHP-FPM configuration
COPY conf/www.conf /etc/php81/php-fpm.d/www.conf
COPY conf/php.ini /etc/php81/php.ini

# Copy WordPress configuration script
COPY tools/wp-config.php /var/www/html/wp-config.php

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html && \
    chmod -R 755 /var/www/html

# Create PHP-FPM socket directory
RUN mkdir -p /run/php-fpm

# Expose port 9000
EXPOSE 9000

# Start PHP-FPM
CMD ["php-fpm81", "-F"]
