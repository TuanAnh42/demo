// order.js
const siteUrl = "https://up5sure.com";
let JWT_TOKEN = localStorage.getItem("token") || null;
async function createOrder(orderData) {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Bạn chưa đăng nhập!");
        return;
    }

    try {
        const res = await fetch(`https://up5sure.com//up5_wp/wp-json/wc/v3/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(orderData)
        });

        const data = await res.json();
        console.log("Order response:", data);

        if (res.ok) {
            alert(`Đặt hàng thành công! Mã đơn: ${data.id}`);
            localStorage.removeItem("cart");
        } else {
            alert("Lỗi tạo đơn: " + (data.message || "Không rõ"));
        }
    } catch (err) {
        console.error(err);
        alert("Lỗi kết nối khi tạo đơn");
    }
}


// Sự kiện click nút xác nhận đơn
document.querySelector(".btn-confirm").addEventListener("click", function () {
    const fullname = document.querySelector('input[name="fullname"]').value.trim();
    const phone = document.querySelector('input[name="phone"]').value.trim();
    const email = document.querySelector('input[name="email"]').value.trim();
    const address = document.querySelector('textarea[name="address"]').value.trim();
    const note = document.querySelector('textarea[name="note"]').value.trim();

    if (!fullname || !phone || !address) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    const nameParts = fullname.split(" ");
    const firstName = nameParts.slice(0, -1).join(" ") || fullname;
    const lastName = nameParts.slice(-1).join(" ") || "";

    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

    const lineItems = cartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity
    }));

    const orderData = {
        payment_method: "cod",
        payment_method_title: "Thanh toán khi nhận hàng",
        set_paid: false,
        billing: {
            first_name: firstName,
            last_name: lastName,
            address_1: address,
            city: "Bangkok",
            email: email || "guest@example.com",
            phone: phone
        },
        shipping: {
            first_name: firstName,
            last_name: lastName,
            address_1: address,
            city: "Bangkok"
        },
        customer_note: note,
        line_items: lineItems
    };

    createOrder(orderData);
});
