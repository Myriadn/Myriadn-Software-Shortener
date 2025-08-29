# ====================================================================================
# Makefile for Myriadn Software URL Shortener (development)
# ====================================================================================

BINARY_NAME=m_shortener_urls.exe

# Entry point
CMD_PATH=./cmd/api/main.go

# Output
OUTPUT_DIR=./output

# Backend
all: build test ## Build binary

run: ## Lokal run
	@echo "Wait..."
	@go run $(CMD_PATH)

build: ## Compile then build
	@echo "Building..."
	@mkdir -p output
	@go build -o $(OUTPUT_DIR)/$(BINARY_NAME) $(CMD_PATH)
	@echo "Build complete. Go Check: $(OUTPUT_DIR)/$(BINARY_NAME)"

test: ## Testing
	@echo "Running tests..."
	@go test ./... -v

clean: ## Clean up build artifacts
	@echo "Cleaning up..."
	@rm -rf $(OUTPUT_DIR) tmp
	@echo "Clean complete."

watch: ## with air live-reload
	@powershell -ExecutionPolicy Bypass -Command "if (Get-Command air -ErrorAction SilentlyContinue) { \
		air; \
		Write-Output 'Watching...'; \
	} else { \
		Write-Output 'Installing air...'; \
		go install github.com/air-verse/air@latest; \
		air; \
		Write-Output 'Watching...'; \
	}"

.PHONY: all build run test clean watch

# FrontEnd
run-fe:
	@echo "Vue Developing..."
	@cd ./client && npm run dev

format-fe:
	@echo "Vue Formatting..."
	@cd ./client && npm run format

build-fe:
	@echo "Building Graphics..."
	@cd ./client && npm run build

install-fe:
	@echo "Installing for Dependencies..."
	@cd ./client && npm install
	@echo "Done."