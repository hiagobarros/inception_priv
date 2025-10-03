FROM alpine:3.18

# Instalar nginx e openssl
RUN apk update && apk add --no-cache nginx openssl

# Criar os diretórios necessários
RUN mkdir -p /var/www/html /etc/nginx/ssl /var/log/nginx /var/lib/nginx/tmp

# Gerar o certificado SSL autoassinado
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/nginx-selfsigned.key \
    -out /etc/nginx/ssl/nginx-selfsigned.crt \
    -subj "/C=BR/ST=SP/L=SaoPaulo/O=42/OU=School/CN=hde-barr.42.fr"

# Copiar configuração do nginx
COPY conf/nginx.conf /etc/nginx/nginx.conf

# Ajustar permissões para o usuário nginx
RUN chown -R nginx:nginx /var/www/html /var/log/nginx /var/lib/nginx

# Expor a porta 443 (SSL)
EXPOSE 443

# Iniciar o nginx
CMD ["nginx", "-g", "daemon off;"]

