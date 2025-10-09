/*
wp core install --url="https://hde-barr.42.fr" --title="Título do Site" --admin_user="hde-barr" --admin_password="8335" --admin_email="email@exemplo.com" --path=/var/www/html --allow-root

wp user create hde-barr novousuario@example.com --role=author --user_pass=8335 --allow-root --path=/var/www/html

wp core install --url="https://hde-barr.42.fr" --title="Título do Site" --admin_user="hde-barr" --admin_password="8335" --admin_email="email@exemplo.com" --path=/var/www/html --allow-root

wp user create hde-barr novousuario@example.com --role=author --user_pass=8335 --allow-root --path=/var/www/html


# Domain configuration
DOMAIN_NAME=hde-barr.42.fr

# MySQL/MariaDB configuration
MYSQL_ROOT_PASSWORD=rootpassword123
MYSQL_DATABASE=wordpress
MYSQL_USER=wpuser
MYSQL_PASSWORD=wppassword123

# WordPress configuration
WP_TITLE=Inception
WP_ADMIN_USER=hde-barr
WP_ADMIN_PASSWORD=Senh@Fort3!
WP_ADMIN_EMAIL=hde-barr@42.fr

WP_USER=user
WP_USER_PASSWORD=UsrSenhFrte123!
WP_USER_EMAIL=user@42.fr

# SSL/TLS configuration
SSL_CERT_PATH=/etc/ssl/certs/nginx-selfsigned.crt
SSL_KEY_PATH=/etc/ssl/private/nginx-selfsigned.key

MYSQL_HOST=mariadb




*/
