# Use lightweight Nginx image
FROM nginx:alpine

# Copy static files into Nginx's default public folder
COPY . /usr/share/nginx/html

# Expose the default port
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]