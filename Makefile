.DEFAULT_GOAL := help

PORT ?= 8002

.PHONY: help install compile build serve start run-http-server audit pre-push

help:
	@echo "Available frontend commands:"
	@echo "  make install      - Install locked npm dependencies"
	@echo "  make compile      - Compile Tailwind CSS and runtime config"
	@echo "  make start        - Compile and serve locally on port $(PORT)"
	@echo "  make audit        - Check npm dependencies for vulnerabilities"
	@echo "  make pre-push     - Clean install, compile, and audit before pushing"

install:
	npm ci

# Compile static CSS and browser-safe runtime configuration.
compile:
	npm run build

# Backward-compatible aliases.
build: compile

serve: compile
	python3 -m http.server $(PORT)

start: serve

run-http-server: serve

audit:
	npm audit --audit-level=moderate

pre-push: install compile audit
	@echo "Frontend checks passed; ready to commit and push."
