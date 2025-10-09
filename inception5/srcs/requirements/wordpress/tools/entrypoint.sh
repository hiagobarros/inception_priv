#!/bin/sh

MAX_RETRIES=30000000000
SLEEP_TIME=1
COUNT=0

while [ $COUNT -lt $MAX_RETRIES ]; do
  echo "Attempt $((COUNT+1)) to install WordPress..."

    wp core install --url=$WP_ADMIN_EMAIL --title=$WP_TITLE --admin_user=$WP_ADMIN_USER  --admin_password=$WP_ADMIN_PASSWORD  --admin_email=$WP_ADMIN_EMAIL --path=/var/www/html --allow-root


  if [ $? -eq 0 ]; then
    echo "WordPress installed successfully!"
    break
  else
    echo "Installation failed. Retrying in $SLEEP_TIME seconds..."
    COUNT=$((COUNT+1))
    sleep $SLEEP_TIME
  fi
done

if [ $COUNT -eq $MAX_RETRIES ]; then
  echo "Error: Could not install WordPress after $MAX_RETRIES attempts."
  exit 1
fi

# Creates a second normal user
wp user create "${WP_USER}" "${WP_USER_EMAIL}" --user_pass="${WP_USER_PASSWORD}"  --role=author  --path=/var/www/html --allow-root


# Starts PHP-FPM in foreground to keep the container alive
exec php-fpm83 -F






