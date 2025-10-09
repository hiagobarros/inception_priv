FROM alpine:3.21.4

# Install PHP and required extensions + utilities
RUN apk update && apk add --no-cache \
    php83 \
    php83-fpm \
    php83-mysqli \
    php83-json \
    php83-openssl \
    php83-curl \
    php83-zlib \
    php83-xml \
    php83-phar \
    php83-intl \
    php83-dom \
    php83-xmlreader \
    php83-ctype \
    php83-session \
    php83-mbstring \
    php83-gd \
    php83-zip \
    php83-iconv \
    php83-simplexml \
    php83-tokenizer \
    php83-fileinfo \
    php83-opcache \
    php83-pecl-redis \
    wget \
    curl \
    mariadb-client \
    unzip \
    vim

# Create www-data user and group if they don't exist
RUN if ! getent group www-data > /dev/null; then addgroup -S www-data; fi && \
    if ! id -u www-data > /dev/null 2>&1; then adduser -S www-data -G www-data; fi

# Create necessary directories
RUN mkdir -p /var/www/html /var/log/php83-fpm /run/php-fpm

# Download and install WordPress
RUN wget https://wordpress.org/latest.tar.gz && \
    tar -xzf latest.tar.gz && \
    rm latest.tar.gz && \
    mv wordpress/* /var/www/html/ && \
    rm -rf wordpress

# Install WP-CLI
RUN curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar && \
    chmod +x wp-cli.phar && \
    mv wp-cli.phar /usr/local/bin/wp

# Copy PHP-FPM and PHP config files
COPY conf/www.conf /etc/php83/php-fpm.d/www.conf
COPY conf/php.ini /etc/php83/php.ini

# Copy scripts and files to set up WordPress
COPY tools/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

COPY tools/wp-config.php /var/www/html/wp-config.php

# Set correct file permissions
RUN chown -R www-data:www-data /var/www/html && \
    chmod -R 755 /var/www/html

# Expose port 9000 for PHP-FPM via TCP
EXPOSE 9000

# Set the entrypoint and command to start the container
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["php-fpm83", "-F"]
