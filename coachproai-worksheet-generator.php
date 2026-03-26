<?php
/**
 * Plugin Name: Coachproai Worksheet Generator
 * Plugin URI:  https://coachproai.com/worksheet-generator
 * Description: Generate printable phonics worksheets including letter tracing, CVC word practice, missing letter exercises, picture-word matching, and blending practice.
 * Version:     1.0.0
 * Author:      Coachproai
 * Author URI:  https://coachproai.com
 * License:     GPL-2.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: coachproai-worksheet-generator
 * Domain Path: /languages
 * Requires at least: 5.8
 * Requires PHP: 7.4
 *
 * @package CoachproaiWorksheetGenerator
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'CPWG_VERSION', '1.0.0' );
define( 'CPWG_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'CPWG_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'CPWG_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );

// Load plugin classes.
require_once CPWG_PLUGIN_DIR . 'includes/class-cpwg-worksheet-generator.php';
require_once CPWG_PLUGIN_DIR . 'includes/class-cpwg-pdf-generator.php';
require_once CPWG_PLUGIN_DIR . 'includes/class-cpwg-admin.php';
require_once CPWG_PLUGIN_DIR . 'includes/class-cpwg-shortcode.php';
require_once CPWG_PLUGIN_DIR . 'includes/class-cpwg-ajax.php';

/**
 * Main plugin class.
 */
final class Coachproai_Worksheet_Generator {

	/**
	 * Single instance.
	 *
	 * @var Coachproai_Worksheet_Generator|null
	 */
	private static $instance = null;

	/**
	 * Get plugin instance.
	 *
	 * @return Coachproai_Worksheet_Generator
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor.
	 */
	private function __construct() {
		$this->init_hooks();
	}

	/**
	 * Initialize hooks.
	 */
	private function init_hooks() {
		add_action( 'init', array( $this, 'load_textdomain' ) );

		// Initialize components.
		CPWG_Admin::init();
		CPWG_Shortcode::init();
		CPWG_Ajax::init();
	}

	/**
	 * Load plugin text domain for translations.
	 */
	public function load_textdomain() {
		load_plugin_textdomain(
			'coachproai-worksheet-generator',
			false,
			dirname( CPWG_PLUGIN_BASENAME ) . '/languages'
		);
	}
}

/**
 * Activation hook.
 */
function cpwg_activate() {
	// Set default options.
	$defaults = array(
		'default_difficulty' => 'easy',
		'worksheets_per_page' => 1,
	);
	if ( false === get_option( 'cpwg_settings' ) ) {
		add_option( 'cpwg_settings', $defaults );
	}

	// Flush rewrite rules.
	flush_rewrite_rules();
}
register_activation_hook( __FILE__, 'cpwg_activate' );

/**
 * Deactivation hook.
 */
function cpwg_deactivate() {
	flush_rewrite_rules();
}
register_deactivation_hook( __FILE__, 'cpwg_deactivate' );

// Boot the plugin.
Coachproai_Worksheet_Generator::get_instance();
