# Usando a imagem Alpine com NGINX
FROM nginx:alpine

# Copiando os arquivos de configuração do NGINX para o container
COPY ./conf/nginx.conf /etc/nginx/nginx.conf
COPY ./conf/default.conf /etc/nginx/conf.d/default.conf

# Instalar OpenSSL para suportar TLS 1.2 ou 1.3
RUN apk update && apk add openssl

# Expor a porta 443 para HTTPS
EXPOSE 443

# Definir um entrypoint padrão (não é necessário mudar)
CMD ["nginx", "-g", "daemon off;"]
