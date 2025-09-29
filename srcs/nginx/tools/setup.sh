#!/bin/bash

# Gera certificados TLS autoassinados (válidos por 365 dias)
mkdir -p /etc/nginx/certs

openssl req -x509 -nodes -days 365 \
  -newkey rsa:2048 \
  -keyout /etc/nginx/certs/nginx.key \
  -out /etc/nginx/certs/nginx.crt \
  -subj "/C=BR/ST=SP/L=SP/O=42SP/OU=Student/CN=${DOMAIN_NAME}"

nginx -g 'daemon off;'

