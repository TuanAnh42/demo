const WP_API_URL = '';
let JWT_TOKEN = localStorage.getItem("token") || null;

async function getToken(username, password) {
    const res = await fetch(`https://up5sure.com/wp-json/jwt-auth/v1/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    JWT_TOKEN = data.token;
}

document.querySelector('.btn-confirm').addEventListener('click', async function () {
    const fullname = document.querySelector('input[name="fullname"]').value.trim();
    const phone = document.querySelector('input[name="phone"]').value.trim();
    const email = document.querySelector('input[name="email"]').value.trim();
    const address = document.querySelector('textarea[name="address"]').value.trim();
    const note = document.querySelector('textarea[name="note"]').value.trim();

    if (!fullname || !phone || !address) {
        alert('Vui lòng điền đầy đủ tên, số điện thoại và địa chỉ.');
        return;
    }

    const paymentInput = document.querySelector('input[name="payment"]:checked');
    const payment = paymentInput ? paymentInput.nextSibling.textContent.trim() : 'COD';


    if (!JWT_TOKEN) {
        alert('Bạn cần đăng nhập để đặt hàng.');
        return;
    }
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const mode = localStorage.getItem('buyMode');
    if (!mode || mode === 'cart' && (!cart || cart.length === 0)) {
        alert('Giỏ hàng đang trống.');
        return;
    }

    function parsePrice(text) {
        return parseInt(text.replace(/[฿,]/g, '')) || 0;
    }

    const subtotal = parsePrice(document.getElementById('subtotal')?.textContent || '0฿');
    const discountAmount = parsePrice(document.getElementById('discount')?.textContent || '0฿');
    const total_price = parsePrice(document.getElementById('total-price')?.textContent || '0฿');

    const orderData = {
        fullname,
        phone,
        email,
        address,
        note,
        payment_method: payment,
        cart,
        discount: discountAmount,
        total_price,
    };

    try {
        const response = await fetch('https://up5sure.com/wp-json/custom/v1/order', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + JWT_TOKEN,
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(orderData),
        });

        const data = await response.json();

        if (response.ok && data.order_code) {
            alert(`Đặt hàng thành công! Mã đơn hàng của bạn: ${data.order_code}`);

            localStorage.removeItem('cart');
            localStorage.removeItem('discountAmount');
            localStorage.removeItem('discountCode');

            if (typeof updateCartIcon === "function") updateCartIcon(0);

            window.location.href = '/thank-you.html?order=' + encodeURIComponent(data.order_code);
        } else {
            alert('Lỗi đặt hàng: ' + (data.message || 'Không rõ lỗi'));
        }
    } catch (error) {
        alert('Lỗi kết nối server, vui lòng thử lại.');
        console.error(error);
    }
});
