# Use official Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Set environment variables (should be provided at runtime)
# ENV PORT=5000
# ENV MONGO_URI=mongodb://localhost:27017/fooddelivery
# ENV JWT_SECRET=your_jwt_secret

# Start the application
CMD ["npm", "start"]
