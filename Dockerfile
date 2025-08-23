FROM node:22-alpine

# Set environment
ENV NODE_ENV=production

# Set working directory
WORKDIR /usr/src/

# Copy dependency files first (for layer caching)
COPY package*.json ./

# Install dependencies
RUN npm install --production --silent

# Copy app source
COPY src/ .

# Expose app port
EXPOSE 5001

# Start the app
CMD ["node", "index.js"]
