# Use tiny Alpine-based Nginx image
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Add our own simple config
COPY nginx.conf /etc/nginx/conf.d

# Copy static files to html root
COPY . /usr/share/nginx/html

# Expose port 80 for serving
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
