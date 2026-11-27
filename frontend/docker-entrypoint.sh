#!/bin/sh
set -e

: "${API_URL:=http://localhost:8000/api/v1}"

envsubst '${API_URL}' \
  < /usr/share/nginx/html/config.template.js \
  > /usr/share/nginx/html/config.js

exec nginx -g 'daemon off;'