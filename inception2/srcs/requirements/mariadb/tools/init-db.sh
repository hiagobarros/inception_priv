#!/bin/bash

# Wait for MariaDB to be ready
until mysqladmin ping -h"localhost" --silent; do
    echo "Waiting for MariaDB to be ready..."
    sleep 2
done

# Create database and user
mysql -u root -p"$MYSQL_ROOT_PASSWORD" << EOF
CREATE DATABASE IF NOT EXISTS $MYSQL_DATABASE;
CREATE USER IF NOT EXISTS '$MYSQL_USER'@'%' IDENTIFIED BY '$MYSQL_PASSWORD';
GRANT ALL PRIVILEGES ON $MYSQL_DATABASE.* TO '$MYSQL_USER'@'%';
FLUSH PRIVILEGES;
EOF

echo "Database and user created successfully!"
