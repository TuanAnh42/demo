<?php
/*
Plugin Name: WP REST Auth with JWT
Description: REST API đăng ký và đăng nhập sử dụng JWT Authentication.
Version: 1.0
Author: Bạn
*/

if (!defined('ABSPATH')) {
    exit;
}
use \Firebase\JWT\JWT;

function generate_jwt_token($user_id)
{
    $secret_key = defined('JWT_AUTH_SECRET_KEY') ? JWT_AUTH_SECRET_KEY : false;
    if (!$secret_key) {
        return false;
    }

    $issued_at = time();
    $not_before = $issued_at;
    $expire = $issued_at + (DAY_IN_SECONDS * 7); // token hợp lệ 7 ngày

    $user = get_user_by('ID', $user_id);
    if (!$user)
        return false;

    $payload = [
        'iss' => get_site_url(),
        'iat' => $issued_at,
        'nbf' => $not_before,
        'exp' => $expire,
        'data' => [
            'user' => [
                'id' => $user_id,
                'username' => $user->user_login,
            ]
        ]
    ];

    return JWT::encode($payload, $secret_key, 'HS256');
}


// Đăng ký REST routes
add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/register', [
        'methods' => 'POST',
        'callback' => 'rest_register_user',
        'permission_callback' => '__return_true',
    ]);
});

// Đăng ký user mới
function rest_register_user(WP_REST_Request $request)
{

    $params = $request->get_json_params();
    error_log('Received register params: ' . print_r($params, true));

    $username = isset($params['username']) ? sanitize_user($params['username']) : '';
    $email = isset($params['email']) ? sanitize_email($params['email']) : '';
    $password = isset($params['password']) ? $params['password'] : '';

    if (empty($username) || empty($email) || empty($password)) {
        return new WP_REST_Response(['message' => 'Vui lòng điền username, email và mật khẩu'], 400);
    }

    if (!is_email($email)) {
        return new WP_REST_Response(['message' => 'Email không hợp lệ'], 400);
    }

    if (username_exists($username) || email_exists($email)) {
        return new WP_REST_Response(['message' => 'Tên đăng nhập hoặc email đã tồn tại'], 409);
    }

    $user_id = wp_create_user($username, $password, $email);
    if (is_wp_error($user_id)) {
        return new WP_REST_Response(['message' => 'Không thể tạo tài khoản'], 500);
    }

    $user = new WP_User($user_id);
    $user->set_role('subscriber');
    update_user_meta($user_id, 'plain_password', $password);

    return new WP_REST_Response([
        'message' => 'Đăng ký thành công',
        'user_id' => $user_id,
    ], 201);

}
// Đăng ký route lấy thông tin user hiện tại
add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/userinfo', [
        'methods' => 'GET',
        'callback' => 'rest_get_current_user_info',
        'permission_callback' => function () {
            return is_user_logged_in();
        }
    ]);
});

// Hàm trả thông tin user hiện tại
function rest_get_current_user_info(WP_REST_Request $request)
{
    $current_user = wp_get_current_user();

    if ($current_user->ID === 0) {
        return new WP_REST_Response(['error' => 'Chưa đăng nhập'], 401);
    }

    return [
        'id' => $current_user->ID,
        'name' => $current_user->display_name,
        'email' => $current_user->user_email,
        'phone' => get_user_meta($current_user->ID, 'phone', true),
        'address' => get_user_meta($current_user->ID, 'address', true),
        'note' => get_user_meta($current_user->ID, 'note', true),
        ''
    ];
}
add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/token', [
        'methods' => 'GET',
        'callback' => 'rest_get_jwt_token_for_logged_in_user',
        'permission_callback' => function () {
            return is_user_logged_in();
        }
    ]);
});

require_once ABSPATH . 'wp-content/plugins/jwt-authentication-for-wp-rest-api/public/class-jwt-auth-public.php';

function rest_get_jwt_token_for_logged_in_user()
{
    $user = wp_get_current_user();

    print_r($user->roles);
    if (!$user || $user->ID === 0) {
        return new WP_REST_Response(['error' => 'Chưa đăng nhập'], 401);
    }

    // Lấy username và password từ user meta hoặc tạo sẵn
    $username = $user->user_login;
    $password = get_user_meta($user->ID, 'plain_password', true); // bạn cần lưu mật khẩu gốc khi tạo user

    if (empty($password)) {
        return new WP_REST_Response(['error' => 'Không có mật khẩu để tạo token'], 500);
    }

    $response = wp_remote_post(site_url('/wp-json/jwt-auth/v1/token'), [
        'body' => [
            'username' => $username,
            'password' => $password
        ]
    ]);

    if (is_wp_error($response)) {
        return new WP_REST_Response(['error' => 'Không gọi được endpoint'], 500);
    }

    $body = json_decode(wp_remote_retrieve_body($response), true);

    if (!isset($body['token'])) {
        return new WP_REST_Response(['error' => 'Không nhận được token'], 401);
    }

    return [
        'token' => $body['token'],
        'user_email' => $user->user_email,
        'user_nicename' => $user->user_nicename,
        'user_display_name' => $user->display_name,
        'role' => $user->roles ? $user->roles[0] : 'subscriber',

    ];


    // In ra mảng role user hiện tại

}
add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/google-login', [
        'methods' => 'POST',
        'callback' => 'rest_google_login',
        'permission_callback' => '__return_true',
    ]);
});

function rest_google_login(WP_REST_Request $request)
{
    $params = $request->get_json_params();
    $google_token = isset($params['token']) ? sanitize_text_field($params['token']) : '';

    if (empty($google_token)) {
        return new WP_REST_Response(['error' => 'Thiếu Google token'], 400);
    }

    // Xác thực token với Google
    $verify_response = wp_remote_get("https://oauth2.googleapis.com/tokeninfo?id_token={$google_token}");
    if (is_wp_error($verify_response)) {
        return new WP_REST_Response(['error' => 'Không xác thực được với Google'], 500);
    }

    $google_data = json_decode(wp_remote_retrieve_body($verify_response), true);

    if (!isset($google_data['email']) || !isset($google_data['sub'])) {
        return new WP_REST_Response(['error' => 'Token không hợp lệ'], 401);
    }

    $email = sanitize_email($google_data['email']);
    $username = sanitize_user(str_replace('@', '_', $email));
    $name = sanitize_text_field($google_data['name'] ?? 'Người dùng Google');

    // Tìm user theo email, nếu chưa có thì tạo mới
    $user = get_user_by('email', $email);
    if (!$user) {
        $user_id = wp_create_user($username, wp_generate_password(), $email);
        if (is_wp_error($user_id)) {
            return new WP_REST_Response(['error' => 'Không tạo được tài khoản'], 500);
        }
        $user = new WP_User($user_id);
        $user->set_role('subscriber');
        wp_update_user(['ID' => $user_id, 'display_name' => $name]);
        $avatar = esc_url_raw($google_data['picture'] ?? '');
        update_user_meta($user->ID, 'google_avatar', $avatar);
    }

    // Tạo JWT token trực tiếp (hàm generate_jwt_token bạn tự định nghĩa theo ví dụ trước)
    $token = generate_jwt_token($user->ID);
    if (!$token) {
        return new WP_REST_Response(['error' => 'Không thể tạo token'], 500);
    }

    return [
        'token' => $token,
        'user_email' => $user->user_email,
        'user_nicename' => $user->user_nicename,
        'user_display_name' => $user->display_name,
        'avatar' => get_user_meta($user->ID, 'google_avatar', true),
    ];
}

add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/login-session', [
        'methods' => 'POST',
        'callback' => 'custom_login_session',
        'permission_callback' => '__return_true',
    ]);
});

function custom_login_session(WP_REST_Request $request)
{
    $params = $request->get_json_params();
    $username = sanitize_user($params['username']);
    $password = $params['password'];

    $creds = [
        'user_login' => $username,
        'user_password' => $password,
        'remember' => true,
    ];

    $user = wp_signon($creds, false);

    if (is_wp_error($user)) {
        return new WP_REST_Response(['error' => $user->get_error_message()], 401);
    }

    // WP sẽ set cookie session trong response header tự động

    return ['message' => 'Đăng nhập thành công'];
}






