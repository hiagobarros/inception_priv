<?php
/**
 * WordPress configuration file
 */

// Database settings
define('DB_NAME', getenv('MYSQL_DATABASE'));
define('DB_USER', getenv('MYSQL_USER'));
define('DB_PASSWORD', getenv('MYSQL_PASSWORD'));
define('DB_HOST', 'mariadb');
define('DB_CHARSET', 'utf8mb4');
define('DB_COLLATE', '');

// Authentication unique keys and salts
define('AUTH_KEY',         'put your unique phrase here');
define('SECURE_AUTH_KEY',  'put your unique phrase here');
define('LOGGED_IN_KEY',    'put your unique phrase here');
define('NONCE_KEY',        'put your unique phrase here');
define('AUTH_SALT',        'put your unique phrase here');
define('SECURE_AUTH_SALT', 'put your unique phrase here');
define('LOGGED_IN_SALT',   'put your unique phrase here');
define('NONCE_SALT',       'put your unique phrase here');

// WordPress table prefix
$table_prefix = 'wp_';

// WordPress debugging
define('WP_DEBUG', false);
define('WP_DEBUG_LOG', false);
define('WP_DEBUG_DISPLAY', false);

// Memory limit
define('WP_MEMORY_LIMIT', '128M');

// File permissions
define('FS_METHOD', 'direct');

// Security
define('DISALLOW_FILE_EDIT', true);
define('DISALLOW_FILE_MODS', true);

// Force SSL
define('FORCE_SSL_ADMIN', true);

// WordPress URL
define('WP_HOME', 'https://hiago_barros.42.fr');
define('WP_SITEURL', 'https://hiago_barros.42.fr');

// Auto-updates
define('WP_AUTO_UPDATE_CORE', false);

// Disable file editing
define('DISALLOW_FILE_EDIT', true);

// Absolute path to the WordPress directory
if (!defined('ABSPATH')) {
    define('ABSPATH', __DIR__ . '/');
}

// Sets up WordPress vars and included files
require_once ABSPATH . 'wp-settings.php';
