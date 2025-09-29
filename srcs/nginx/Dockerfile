FROM debian:bullseye

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
    apt-get install -y nginx openssl && \
    rm -rf /var/lib/apt/lists/*

# Copia o arquivo de configuração do NGINX (vamos criar)
COPY conf/nginx.conf /etc/nginx/nginx.conf

# Copia o script de geração do certificado
COPY tools/setup.sh /setup.sh
RUN chmod +x /setup.sh

# Executa o setup e inicia o NGINX
CMD ["/setup.sh"]

