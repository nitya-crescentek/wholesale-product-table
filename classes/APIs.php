<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}


class WPTW_APIs {

    /**
     * Constructor
     */
    public function __construct() {
        // Initialize the APIs
        $this->init();
    }

    /**
     * Initialize the APIs
     */
    public function init() {
        // Add API endpoints or other initialization code here
        add_action( 'rest_api_init', [ $this, 'register_api_endpoints' ] );

    }

    /**
     * Register API Endpoints. /wp-json/react-base/v1/data
     *
     * @return void
     */
    public function register_api_endpoints() {

        register_rest_route( 'wpt/v1', '/categories', [
            'methods'  => 'GET',
            'callback' => [ $this, 'wptw_get_categories' ],
            'permission_callback' => '__return_true',
        ] );

        register_rest_route( 'wpt/v1', '/settings', [
            'methods'  => 'GET',
            'callback' => [$this, 'wptw_get_settings'],
            'permission_callback' => '__return_true',
        ] );

        register_rest_route( 'wpt/v1', '/settings', [
            'methods'  => 'POST',
            'callback' => [$this, 'wptw_save_settings'],
            'permission_callback' => function ( WP_REST_Request $request ) {
                return current_user_can( 'manage_options' );
            },
            'args' => [
                'selected_columns' => [
                    'required' => false,
                    'type'     => 'array',
                    'items'    => [
                        'type' => 'string',
                    ],
                ],
                'table_style' => [
                    'required' => false,
                    'type'     => 'string',
                ],
                'wholesale_products_opt' => [
                    'required' => false,
                    'type'     => 'string',
                ],
                'wholesale_product_category' => [
                    'required' => false,
                    'type'     => 'string',
                ],
                'wholesale_product_pp' => [
                    'required' => false,
                    'type'     => 'integer',
                ],
            ],
        ] );
        
    }

    public function wptw_get_categories(){
        $categories = get_terms(array(
            'taxonomy'   => 'product_cat',
            'hide_empty' => true,
        ));
 
        return rest_ensure_response( $categories );
    }

    public function wptw_get_settings() {
        $settings = array(
            'selected_columns' => get_option( 'wptw_selected_columns', [] ),
            'table_style'      => get_option( 'wptw_table_style', '' ),
            'wholesale_products_opt' => get_option( 'wptw_wholesale_products_opt', '' ),
            'wholesale_product_category' => get_option( 'wptw_wholesale_product_category', '' ),
            'wholesale_product_pp' => get_option( 'wptw_wholesale_product_pp', '' ),
        );

        return rest_ensure_response( $settings );
    }

    public function wptw_save_settings( WP_REST_Request $request ) {
        $settings = $request->get_json_params();

        if ( isset( $settings['selected_columns'] ) ) {
            update_option( 'wptw_selected_columns', $settings['selected_columns'] );
        }
        if ( isset( $settings['table_style'] ) ) {
            update_option( 'wptw_table_style', sanitize_text_field( $settings['table_style'] ) );
        }
        if ( isset( $settings['wholesale_products_opt'] ) ) {
            update_option( 'wptw_wholesale_products_opt', sanitize_text_field( $settings['wholesale_products_opt'] ) );
        }
        if ( isset( $settings['wholesale_product_category'] ) ) {
            update_option( 'wptw_wholesale_product_category', sanitize_text_field( $settings['wholesale_product_category'] ) );
        }
        if ( isset( $settings['wholesale_product_pp'] ) ) {
            update_option( 'wptw_wholesale_product_pp', intval( $settings['wholesale_product_pp'] ) );
        }

        return rest_ensure_response( [ 'status' => 'success' ] );
    }
}