#!/bin/bash

# Script para configurar o domínio hiago_barros.42.fr
# Execute este script com sudo para configurar o /etc/hosts

echo "Configurando domínio hiago_barros.42.fr..."

# Verificar se já existe a entrada
if grep -q "hiago_barros.42.fr" /etc/hosts; then
    echo "Domínio já configurado no /etc/hosts"
else
    echo "127.0.0.1 hiago_barros.42.fr" | sudo tee -a /etc/hosts
    echo "Domínio configurado com sucesso!"
fi

echo "Configuração concluída!"
echo "Agora você pode executar 'make all' para iniciar o projeto"
