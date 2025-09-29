#!/bin/bash

# Cria wp-config.php, se não existir
if [ ! -f wp-config.php ]; then
    cp wp-config-sample.php wp-config.php
    sed -i "s/database_name_here/${WORDPRESS_DB_NAME}/" wp-config.php
    sed -i "s/username_here/${WORDPRESS_DB_USER}/" wp-config.php
    sed -i "s/password_here/$(cat ${WORDPRESS_DB_PASSWORD_FILE})/" wp-config.php
    sed -i "s/localhost/${WORDPRESS_DB_HOST}/" wp-config.php
fi


# Garante que php-fpm escute na porta 9000 TCP
#CONF_FILE=$(find /etc/php -name www.conf)

#if [ -f "$CONF_FILE" ]; then
#  sed -i 's|^listen = .*|listen = 0.0.0.0:9000|' "$CONF_FILE"
#fi

# Inicia php-fpm em foreground
#exec php-fpm -F


# Garante que php-fpm escute na porta 9000 TCP
echo "[global]
daemonize = no

[www]
listen = 0.0.0.0:9000
listen.owner = www-data
listen.group = www-data
listen.mode = 0660
user = www-data
group = www-data
pm = dynamic
pm.max_children = 5
pm.start_servers = 2
pm.min_spare_servers = 1
pm.max_spare_servers = 3
" > /etc/php/*/fpm/pool.d/www.conf

exec php-fpm -F





# Substitui variáveis de ambiente no wp-config.php
#if [ ! -f wp-config.php ]; then
#    cp wp-config-sample.php wp-config.php
#    sed -i "s/database_name_here/${WORDPRESS_DB_NAME}/" wp-config.php
#    sed -i "s/username_here/${WORDPRESS_DB_USER}/" wp-config.php
#    sed -i "s/password_here/$(cat ${WORDPRESS_DB_PASSWORD_FILE})/" wp-config.php
#    sed -i "s/localhost/${WORDPRESS_DB_HOST}/" wp-config.php
#fi

#exec php-fpm7.4 -F

