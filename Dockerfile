# Use official Playwright image — has Node + all browsers pre-installed
FROM mcr.microsoft.com/playwright:v1.44.0-jammy

# Set working directory inside container
WORKDIR /app

# Copy package files first (Docker caches this layer)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy rest of your project
COPY . .

# Default command when container runs
CMD ["npm", "run", "test:ci"]