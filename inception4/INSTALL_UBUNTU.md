# Instalação no Ubuntu - Projeto Inception

## Pré-requisitos

### 1. Instalar Docker e Docker Compose

```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar dependências
sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release

# Adicionar chave GPG oficial do Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Adicionar repositório do Docker
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Instalar Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER

# Verificar instalação
docker --version
docker compose version
```

### 2. Configurar Domínio

```bash
# Executar script de configuração
sudo sh ./setup_domain.sh

# Ou manualmente adicionar ao /etc/hosts
echo "127.0.0.1 hiago_barros.42.fr" | sudo tee -a /etc/hosts
```

### 3. Configurar Diretórios

```bash
# Criar diretórios necessários
sudo mkdir -p /home/hiago_barros/data/wordpress
sudo mkdir -p /home/hiago_barros/data/mariadb

# Definir permissões
sudo chmod 755 /home/hiago_barros/data/wordpress
sudo chmod 755 /home/hiago_barros/data/mariadb
```

## Execução do Projeto

### 1. Iniciar o Projeto

```bash
# Configurar e iniciar tudo
make all
```

### 2. Verificar Status

```bash
# Ver status dos containers
make status

# Ver logs
make logs
```

### 3. Acessar o Site

- URL: https://hiago_barros.42.fr
- Admin WordPress: hiago / adminpass123

## Comandos Úteis

```bash
# Parar containers
make down

# Reiniciar containers
make restart

# Limpar tudo
make fclean

# Reconstruir do zero
make re
```

## Troubleshooting

### Problema: Porta 443 em uso
```bash
# Verificar o que está usando a porta
sudo netstat -tlnp | grep :443

# Parar serviço que está usando a porta
sudo systemctl stop apache2  # se for Apache
sudo systemctl stop nginx    # se for NGINX
```

### Problema: Permissões de diretório
```bash
# Corrigir permissões
sudo chown -R $USER:$USER /home/hiago_barros/data/
sudo chmod -R 755 /home/hiago_barros/data/
```

### Problema: Docker não encontrado
```bash
# Fazer logout e login novamente para aplicar mudanças do grupo
# Ou executar:
newgrp docker
```

### Problema: Certificado SSL
```bash
# Se o navegador reclamar do certificado, aceite como exceção
# O certificado é auto-assinado para desenvolvimento
```

## Verificação Final

1. ✅ Docker e Docker Compose instalados
2. ✅ Domínio configurado no /etc/hosts
3. ✅ Diretórios criados com permissões corretas
4. ✅ Containers rodando (make status)
5. ✅ Site acessível em https://hiago_barros.42.fr
6. ✅ WordPress funcionando
7. ✅ Banco de dados conectado

## Notas Importantes

- O projeto usa Alpine Linux 3.18 (penúltima versão estável)
- Todos os containers têm restart automático
- Volumes são persistidos em /home/hiago_barros/data/
- SSL/TLS é obrigatório (porta 443 apenas)
- Senhas estão em arquivos de secrets (não no código)
