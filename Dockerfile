# Dockerfile
FROM node:16

# Set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose port and start the application
EXPOSE 3000

# Use nodemon for development or ts-node for production
CMD ["npm", "start"]
