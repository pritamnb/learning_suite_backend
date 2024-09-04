# Use an official Node.js image as a base
FROM node:18

# Set environment variables for non-interactive installation
ENV DEBIAN_FRONTEND=noninteractive

# Install necessary tools and dependencies
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    && curl -fsSL https://www.adacore.com/download/gnat-community/apt/gnat-community-archive-keyring.gpg | apt-key add - \
    && echo "deb [arch=amd64] https://www.adacore.com/download/gnat-community/apt/ ubuntu focal main" | tee /etc/apt/sources.list.d/gnat-community.list \
    && apt-get update && apt-get install -y \
    gnat \
    gprbuild \
    libgnat-11-dev \
    libgnatprj11-dev \
    spark \
    && apt-get clean

# Add a non-root user and switch to it
RUN useradd -m appuser
USER appuser

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY --chown=appuser:appuser package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application code
COPY --chown=appuser:appuser . /app

# Create directories and set permissions
RUN mkdir -p /app/sandbox/tmp
RUN chmod 700 /app/sandbox/tmp

# Build the TypeScript code
RUN npm run build

# Expose the port on which the application runs
EXPOSE 3000

# Start the application
CMD ["node", "dist/server.js"]
