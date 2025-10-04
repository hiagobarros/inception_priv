# Inception - 42 School Project

Este projeto implementa uma infraestrutura Docker completa com NGINX, WordPress e MariaDB, conforme especificado no subject da escola 42.

## Estrutura do Projeto

```
inception2/
├── Makefile
├── README.md
├── secrets/
│   ├── credentials.txt
│   ├── db_password.txt
│   └── db_root_password.txt
└── srcs/
    ├── .env
    ├── docker-compose.yml
    └── requirements/
        ├── nginx/
        │   ├── Dockerfile
        │   ├── .dockerignore
        │   └── conf/
        │       └── nginx.conf
        ├── wordpress/
        │   ├── Dockerfile
        │   ├── .dockerignore
        │   ├── conf/
        │   │   ├── www.conf
        │   │   └── php.ini
        │   └── tools/
        │       └── wp-config.php
        └── mariadb/
            ├── Dockerfile
            ├── .dockerignore
            ├── conf/
            │   └── my.cnf
            └── tools/
                └── init-db.sh
```

## Serviços Implementados

### 1. NGINX (Porta 443)
- Configurado com TLS 1.2/1.3
- Certificado SSL auto-assinado
- Proxy reverso para WordPress
- Headers de segurança
- Compressão Gzip

### 2. WordPress
- PHP-FPM 8.1
- Configuração otimizada
- Conexão com MariaDB
- Volume persistente

### 3. MariaDB
- Banco de dados MySQL
- Usuários configurados
- Volume persistente
- Configuração otimizada

## Como Usar

### Pré-requisitos
- Docker e Docker Compose instalados
- Acesso sudo para criar diretórios
- Domínio configurado (hde-barr.42.fr)

### Comandos Disponíveis

```bash
# Configurar e iniciar tudo
make all

# Apenas configurar diretórios
make setup

# Apenas construir imagens
make build

# Apenas iniciar containers
make up

# Parar containers
make down

# Reiniciar containers
make restart

# Ver status dos containers
make status

# Ver logs
make logs

# Limpar containers e imagens
make clean

# Limpar tudo incluindo volumes
make fclean

# Reconstruir tudo do zero
make re

# Ver ajuda
make help
```

### Configuração do Domínio

Para que o projeto funcione corretamente, você precisa configurar o domínio `hiago_barros.42.fr` para apontar para o IP local da sua máquina.

Adicione esta linha ao arquivo `/etc/hosts`:
```
127.0.0.1 hiago_barros.42.fr
```

### Acesso ao Site

Após executar `make all`, o site estará disponível em:
- https://hiago_barros.42.fr

### Credenciais Padrão

- **WordPress Admin**: hiago / adminpass123
- **Database**: wpuser / wppassword123
- **Database Root**: root / rootpassword123

## Volumes

Os dados são persistidos nos seguintes diretórios:
- `/home/hiago_barros/data/wordpress` - Arquivos do WordPress
- `/home/hiago_barros/data/mariadb` - Dados do banco de dados

## Segurança

- Senhas não estão hardcoded nos Dockerfiles
- Uso de variáveis de ambiente
- Headers de segurança configurados
- SSL/TLS obrigatório
- Firewall interno entre containers

## Troubleshooting

### Verificar Status
```bash
make status
```

### Ver Logs
```bash
make logs
```

### Reiniciar Serviço Específico
```bash
docker-compose -f srcs/docker-compose.yml restart nginx
```

### Limpar e Reconstruir
```bash
make re
```

## Conformidade com o Subject

✅ Docker Compose obrigatório  
✅ Containers dedicados para cada serviço  
✅ Volumes para WordPress e banco de dados  
✅ Rede Docker interna  
✅ Restart automático dos containers  
✅ NGINX como único ponto de entrada (porta 443)  
✅ TLS 1.2/1.3 apenas  
✅ Dockerfiles próprios (sem imagens prontas)  
✅ Variáveis de ambiente obrigatórias  
✅ Secrets em arquivos separados  
✅ Usuário admin sem "admin" no nome  
✅ Domínio configurado (hiago_barros.42.fr)  

## Autor

**hiago_barros** - Escola 42 São Paulo
