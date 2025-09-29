FROM debian:bullseye

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
    apt-get install -y mariadb-server && \
    rm -rf /var/lib/apt/lists/*

COPY ./conf /etc/mysql/conf.d/

COPY ./tools /docker-entrypoint-initdb.d/

EXPOSE 3306

CMD ["mysqld"]

