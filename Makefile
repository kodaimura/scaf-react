DOCKER_COMPOSE = docker compose
ENV ?= dev
DOCKER_COMPOSE_FILE = $(if $(filter prod,$(ENV)),-f docker-compose.prod.yml,)
DOCKER_COMPOSE_CMD = $(DOCKER_COMPOSE) $(DOCKER_COMPOSE_FILE)

.PHONY: up build down stop in log ps reup help

up:
	$(DOCKER_COMPOSE_CMD) up -d

build:
	$(DOCKER_COMPOSE_CMD) build --no-cache

down:
	$(DOCKER_COMPOSE_CMD) down

stop:
	$(DOCKER_COMPOSE_CMD) stop

in:
	$(DOCKER_COMPOSE_CMD) exec web bash

log:
	$(DOCKER_COMPOSE_CMD) logs -f web

ps:
	$(DOCKER_COMPOSE_CMD) ps

reup: down up

help:
	@echo "Usage: make [target] [ENV=dev|prod]"
	@echo ""
	@echo "Targets:"
	@echo "  up        Start containers in the specified environment (default: dev)"
	@echo "  build     Build containers without cache"
	@echo "  down      Stop and remove containers, networks, and volumes"
	@echo "  stop      Stop containers"
	@echo "  in        Access web container via bash"
	@echo "  log       Show logs for the web container"
	@echo "  ps        Show status for containers"
	@echo "  reup      Re-up containers"