FROM alpine:3.18

# Install MariaDB
RUN apk update && apk add --no-cache \
    mariadb \
    mariadb-client \
    mariadb-common

# Create necessary directories
RUN mkdir -p /var/lib/mysql /var/log/mysql /run/mysqld

# Set proper permissions
RUN chown -R mysql:mysql /var/lib/mysql /var/log/mysql /run/mysqld

# Copy MariaDB configuration
COPY conf/my.cnf /etc/mysql/my.cnf

# Copy initialization script
COPY tools/init-db.sh /docker-entrypoint-initdb.d/init-db.sh
RUN chmod +x /docker-entrypoint-initdb.d/init-db.sh

# Create socket directory
RUN mkdir -p /run/mysqld && \
    chown mysql:mysql /run/mysqld

# Expose port 3306
EXPOSE 3306

# Start MariaDB
CMD ["mysqld", "--user=mysql", "--console"]
