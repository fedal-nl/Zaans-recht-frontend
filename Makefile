# Build the static CSS and browser-safe runtime configuration.
build:
	npm run build

# Run the development server on port 8002.
run-http-server: build
	python3 -m http.server 8002
