FROM oven/bun:1
WORKDIR /app

# Copy root package files including lockfile config
COPY package.json bun.lock ./

# Copy backend specific package.json
COPY apps/backend/package.json apps/backend/
# Copy frontend package.json to satisfy workspace lockfile if needed
COPY apps/frontend/package.json apps/frontend/

# Install specific dependencies
RUN bun install

# Copy source code
COPY . .

# Set working directory to backend
WORKDIR /apps/backend

# Expose port
EXPOSE 8888

# Run the application
CMD ["bun", "run", "src/index.ts"]
