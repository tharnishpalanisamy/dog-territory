#!/bin/sh
set -e

: "${API_URL:=http://127.0.0.1:8000/api/v1}"

envsubst '${API_URL}' \
  < /usr/share/nginx/html/config.template.js \
  > /usr/share/nginx/html/config.js

exec nginx -g 'daemon off;'
