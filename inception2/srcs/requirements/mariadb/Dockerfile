# Usando uma imagem base do MariaDB
FROM mariadb:10.5

# Expor a porta 3306 para comunicação com o WordPress
EXPOSE 3306

# Definir variáveis de ambiente (você vai definir essas no .env)
ENV MYSQL_ROOT_PASSWORD=example
ENV MYSQL_DATABASE=wordpress
ENV MYSQL_USER=wordpress_user
ENV MYSQL_PASSWORD=wordpress_pass

# O MariaDB já tem o entrypoint configurado, então não precisamos mudar nada
