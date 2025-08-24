<?php
/*
Plugin Name: Custom Contact Form API
Description: API nhận form từ FE và lưu vào database
Version: 1.0
Author: Bạn
*/

if (!defined('ABSPATH')) exit;

// Tạo bảng lưu dữ liệu khi kích hoạt plugin
register_activation_hook(__FILE__, function () {
    global $wpdb;
    $table = $wpdb->prefix . "contact_form";
    $charset = $wpdb->get_charset_collate();
    $sql = "CREATE TABLE $table (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        name varchar(255) NOT NULL,
        phone varchar(50) NOT NULL,
        address varchar(255) NOT NULL,
        message text,
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
    ) $charset;";
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
});

// Đăng ký endpoint API
add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/contact', [
        'methods' => 'POST',
        'callback' => 'handle_contact_form',
        'permission_callback' => '__return_true'
    ]);
});

// Hàm xử lý dữ liệu form
function handle_contact_form($request) {
    global $wpdb;
    $table = $wpdb->prefix . "contact_form";

    $name = sanitize_text_field($request['name']);
    $phone = sanitize_text_field($request['phone']);
    $address = sanitize_text_field($request['address']);
    $message = sanitize_textarea_field($request['message']);

    if (!$name || !$phone || !$address) {
        return new WP_Error('missing_field', 'Vui lòng nhập đầy đủ thông tin', ['status' => 400]);
    }

    // Lưu vào DB
    $wpdb->insert($table, [
        'name' => $name,
        'phone' => $phone,
        'address' => $address,
        'message' => $message
    ]);

    // Gửi email cho admin
    $admin_email ="vuthihoaanime@gmail.com"; // Email admin WP
    if (!is_email($admin_email)) {
        return new WP_Error('invalid_email', 'Email admin không hợp lệ', ['status' => 500]);
    }
    $subject = "📩 Có khách hàng mới gửi form liên hệ";
    $body = "
        <strong>Thông tin khách hàng:</strong><br>
        <b>Họ và tên:</b> {$name}<br>
        <b>Số điện thoại:</b> {$phone}<br>
        <b>Địa chỉ:</b> {$address}<br>
        <b>Tin nhắn:</b> {$message}<br>
        <b>Thời gian:</b> " . current_time('Y-m-d H:i:s') . "
    ";
    $headers = [
        'Content-Type: text/html; charset=UTF-8',
        'From: Website UP5 <' . $admin_email . '>'
    ];

    wp_mail($admin_email, $subject, $body, $headers);

    return [
        'status' => 'success',
        'message' => 'ส่งข้อมูลเรียบร้อยแล้ว'
    ];
}

