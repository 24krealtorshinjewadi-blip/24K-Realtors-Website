# =======================================================
# Stage 1: Build the React Application static files
# =======================================================
FROM node:20-alpine AS build
WORKDIR /app

# Copy packagers first and cache dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy source code and build the production bundle
COPY . .
RUN npm run build

# =======================================================
# Stage 2: Serve the files using Nginx
# =======================================================
FROM nginx:stable-alpine

# Copy built HTML/JS/CSS assets to Nginx default public directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the custom Nginx server blocks configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose web server port
EXPOSE 80

# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
