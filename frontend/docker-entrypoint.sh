
#!/bin/sh

set -e

# Generate runtime configuration
envsubst '${API_URL}' \
  < /usr/share/nginx/html/config.template.js \
  > /usr/share/nginx/html/config.js

# Start Nginx
exec nginx -g 'daemon off;'
