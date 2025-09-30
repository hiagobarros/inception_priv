# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: hiago_barros <hiago_barros@student.42.fr>  +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/01/01 00:00:00 by hiago_barros      #+#    #+#              #
#    Updated: 2024/01/01 00:00:00 by hiago_barros     ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

# Colors
GREEN = \033[0;32m
YELLOW = \033[0;33m
RED = \033[0;31m
BLUE = \033[0;34m
NC = \033[0m # No Color

# Variables
COMPOSE_FILE = srcs/docker-compose.yml
ENV_FILE = srcs/.env

# Default target
all: setup build up

# Setup directories and permissions
setup:
	@echo "$(BLUE)Setting up directories...$(NC)"
	@sudo mkdir -p /home/hiago_barros/data/wordpress
	@sudo mkdir -p /home/hiago_barros/data/mariadb
	@sudo chmod 755 /home/hiago_barros/data/wordpress
	@sudo chmod 755 /home/hiago_barros/data/mariadb
	@echo "$(GREEN)Directories created successfully!$(NC)"

# Build Docker images
build:
	@echo "$(BLUE)Building Docker images...$(NC)"
	@docker-compose -f $(COMPOSE_FILE) --env-file $(ENV_FILE) build
	@echo "$(GREEN)Images built successfully!$(NC)"

# Start containers
up:
	@echo "$(BLUE)Starting containers...$(NC)"
	@docker-compose -f $(COMPOSE_FILE) --env-file $(ENV_FILE) up -d
	@echo "$(GREEN)Containers started successfully!$(NC)"
	@echo "$(YELLOW)Your website is available at: https://hiago_barros.42.fr$(NC)"

# Stop containers
down:
	@echo "$(BLUE)Stopping containers...$(NC)"
	@docker-compose -f $(COMPOSE_FILE) --env-file $(ENV_FILE) down
	@echo "$(GREEN)Containers stopped successfully!$(NC)"

# Restart containers
restart: down up

# Show container status
status:
	@echo "$(BLUE)Container status:$(NC)"
	@docker-compose -f $(COMPOSE_FILE) --env-file $(ENV_FILE) ps

# Show container logs
logs:
	@echo "$(BLUE)Container logs:$(NC)"
	@docker-compose -f $(COMPOSE_FILE) --env-file $(ENV_FILE) logs

# Show logs for specific service
logs-nginx:
	@docker-compose -f $(COMPOSE_FILE) --env-file $(ENV_FILE) logs nginx

logs-wordpress:
	@docker-compose -f $(COMPOSE_FILE) --env-file $(ENV_FILE) logs wordpress

logs-mariadb:
	@docker-compose -f $(COMPOSE_FILE) --env-file $(ENV_FILE) logs mariadb

# Clean up containers and images
clean:
	@echo "$(BLUE)Cleaning up containers and images...$(NC)"
	@docker-compose -f $(COMPOSE_FILE) --env-file $(ENV_FILE) down -v
	@docker system prune -f
	@echo "$(GREEN)Cleanup completed!$(NC)"

# Clean up everything including volumes
fclean: clean
	@echo "$(BLUE)Removing volumes...$(NC)"
	@sudo rm -rf /home/hiago_barros/data/wordpress/*
	@sudo rm -rf /home/hiago_barros/data/mariadb/*
	@echo "$(GREEN)All data removed!$(NC)"

# Rebuild everything from scratch
re: fclean all

# Show help
help:
	@echo "$(BLUE)Available commands:$(NC)"
	@echo "  $(GREEN)all$(NC)      - Setup, build and start all containers"
	@echo "  $(GREEN)setup$(NC)    - Create necessary directories"
	@echo "  $(GREEN)build$(NC)    - Build Docker images"
	@echo "  $(GREEN)up$(NC)       - Start containers"
	@echo "  $(GREEN)down$(NC)     - Stop containers"
	@echo "  $(GREEN)restart$(NC)  - Restart containers"
	@echo "  $(GREEN)status$(NC)  - Show container status"
	@echo "  $(GREEN)logs$(NC)    - Show all logs"
	@echo "  $(GREEN)clean$(NC)    - Clean up containers and images"
	@echo "  $(GREEN)fclean$(NC)   - Clean up everything including volumes"
	@echo "  $(GREEN)re$(NC)       - Rebuild everything from scratch"
	@echo "  $(GREEN)help$(NC)     - Show this help message"

# Phony targets
.PHONY: all setup build up down restart status logs logs-nginx logs-wordpress logs-mariadb clean fclean re help
