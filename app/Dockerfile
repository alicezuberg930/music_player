FROM node:22-alpine

# Set working directory
WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build the application
# RUN npm run build

# Expose the port the app runs on
EXPOSE 5173

# Start the application
# CMD ["node", "server.js"]
# Start the development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]