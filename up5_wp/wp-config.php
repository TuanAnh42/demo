<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the website, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'bymhuaifhosting_up5db' );
// define( 'DB_NAME', 'up5_wp_db' );
/** Database username */
define( 'DB_USER', 'bymhuaifhosting_up5' );
// define( 'DB_USER', 'root' );
/** Database password */
define( 'DB_PASSWORD', 'kY!z~%%Nc]}*8Eqk' );
// define( 'DB_PASSWORD', '' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         '!%[slJMTEU*:Box#F8O)rY5fHutn]HDqhN)/fdoFiAGJHTN#jvdLd=[]|P+g6;[/' );
define( 'SECURE_AUTH_KEY',  'A3.+{NW %?-vJ`HbN-LkFI6<K03W]13bar+GIbM}%KB)N$c*6J<o)dSga:z2YP#/' );
define( 'LOGGED_IN_KEY',    'a$3_L_6Rk~8Kh/o U;N7TX>DUwZn*-EXsL[!3MNXY k._8D;7/6eR^[Z|Q,}(8ag' );
define( 'NONCE_KEY',        'GFkIqDlV01w2;C<>zvjt0nQev!h<sXtI/m/`lMro7tb@)Kwc0;rh|EA`!r:Y)~LW' );
define( 'AUTH_SALT',        'q@X|dUANr%Jtex3GkL1)j4X$=MuNzO8M;dp-8-#nUX*/e+h*XU6+m!IPvI^L@?ql' );
define( 'SECURE_AUTH_SALT', 'N@aL;#7vx(1-rU!(tCSJs;>MvF/ogsAd.89)Ofks|J*6|)uBq_-x<%EX>eC,y2(k' );
define( 'LOGGED_IN_SALT',   '=TVSa~UW,y,nC>gwM>!aRTxvi^`R@6ko|.C2Q}1PMt%%W8fk~b3O!e-cTkupf^/V' );
define( 'NONCE_SALT',       '}HVtLd|lF/<rrKPlJs1Er~A&)} pt%hUpBRG7yQ2GD(TjKU1%),czTooeoMlN:L3' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 *
 * At the installation time, database tables are created with the specified prefix.
 * Changing this value after WordPress is installed will make your site think
 * it has not been installed.
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/#table-prefix
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://developer.wordpress.org/advanced-administration/debug/debug-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */


define('JWT_AUTH_SECRET_KEY', '[|hb(9v#ofc.Z{SL}*UoC/~s^[Vqxy>r@^6ky=&{76=@GUUT}#2QOn`S#Ltc#;MQ');
define('JWT_AUTH_CORS_ENABLE', true);
 
/* That's all, stop editing! Happy publishing. */

if ( !isset( $_SERVER['HTTP_AUTHORIZATION'] ) ) {
    if ( function_exists( 'apache_request_headers' ) ) {
        $headers = apache_request_headers();
        if ( isset( $headers['Authorization'] ) ) {
            $_SERVER['HTTP_AUTHORIZATION'] = $headers['Authorization'];
        }
    }
}

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
