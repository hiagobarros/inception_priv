FROM alpine:3.18

# Install nginx and openssl
RUN apk update && apk add --no-cache nginx openssl

# Create necessary directories
RUN mkdir -p /var/www/html /etc/nginx/ssl /var/log/nginx /var/lib/nginx/tmp

# Generate self-signed SSL certificate
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/nginx-selfsigned.key \
    -out /etc/nginx/ssl/nginx-selfsigned.crt \
    -subj "/C=BR/ST=SP/L=SaoPaulo/O=42/OU=School/CN=hiago_barros.42.fr"

# Copy nginx configuration
COPY conf/nginx.conf /etc/nginx/nginx.conf

# Set proper permissions
RUN chown -R nginx:nginx /var/www/html /var/log/nginx /var/lib/nginx

# Expose port 443
EXPOSE 443

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
