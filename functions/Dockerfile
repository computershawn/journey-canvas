# Use a Node.js base image that is slim but allows for system package installation.
# 'slim' images are smaller than full ones, and usually Debian-based,
# making apt-get available.
FROM node:22-slim

# Install FFmpeg and other necessary dependencies.
# apt-get update ensures you have the latest package lists.
# apt-get install -y ffmpeg installs FFmpeg.
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container.
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first.
# This allows Docker to cache the 'npm install' step if your dependencies haven't changed.
COPY package*.json ./

# Install production dependencies.
RUN npm ci --omit=dev

# Copy the rest of your application code into the container.
# Make sure your video processing script (e.g., app.js or index.js) is here.
COPY . .

# Expose the port your application will listen on.
# Cloud Run typically listens on port 8080 by default.
EXPOSE 8080

# Start the function using the Functions Framework
CMD [ "npx", "functions-framework", "--target=doAllOfTheThings" ]
