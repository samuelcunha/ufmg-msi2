# Name the node stage "builder"
FROM node:14-alpine AS web-builder
# Set working directory
WORKDIR /app
# Copy all files from current directory to working dir in image
COPY ./web .
# install node modules and build assets
RUN npm install && npm run build

# nginx state for serving content
FROM nginx:alpine
# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html
# Nginx configuration
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
# Remove default nginx static assets
RUN rm -rf ./*
# Copy static assets from builder stage
COPY --from=web-builder /app/build .
# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]