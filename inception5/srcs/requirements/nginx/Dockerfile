FROM alpine:3.21.4

# Install nginx and openssl
RUN apk update && apk add --no-cache nginx openssl

# Create the necessary directories
RUN mkdir -p /var/www/html /etc/nginx/ssl /var/log/nginx /var/lib/nginx/tmp

# Generate the self-signed SSL certificate
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/nginx-selfsigned.key \
    -out /etc/nginx/ssl/nginx-selfsigned.crt \
    -subj "/C=PT/ST=Porto/L=Porto/O=42/OU=School/CN=hde-barr.42.fr"

# Copy nginx configuration
COPY conf/nginx.conf /etc/nginx/nginx.conf

# Adjust permissions for nginx user
RUN chown -R nginx:nginx /var/www/html /var/log/nginx /var/lib/nginx

# Expose port 443 (SSL)
EXPOSE 443

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

