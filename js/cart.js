function addtocart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const image = document.getElementById("mainImage")?.src || "";
    const name = document.querySelector(".product-center h1")?.textContent.trim();

    // 👇 Lấy số từ chuỗi có dấu , và ฿
    const priceText = document.getElementById("price-value")?.textContent.trim().replace(/[฿,]/g, '');
    const pricex = parseInt(priceText); // dạng số, dùng để tính toán

    const price = pricex.toLocaleString('th-TH'); // "1,449"

    const quantity = parseInt(document.getElementById("quantity").value);

    const selectedComboText = selectedCombo.free > 0
        ? `ซื้อ ${selectedCombo.buy} แถม ${selectedCombo.free}`
        : `ซื้อ ${selectedCombo.buy}`;

    const total = pricex * quantity;

    const product = {
        image,
        name,
        price,            // dùng để hiển thị (chuỗi "1,449")
        pricex,           // dùng để tính toán (số 1449)
        quantity,
        total,
        comboText: selectedComboText,
        combo: selectedCombo
    };

    // ✅ Kiểm tra trùng sản phẩm (dựa trên tên + giá trị tính toán)
    const existingIndex = cart.findIndex(item => item.name === product.name && item.pricex === product.pricex);

    if (existingIndex !== -1) {
        cart[existingIndex].quantity += quantity;
        cart[existingIndex].total = cart[existingIndex].quantity * cart[existingIndex].pricex;
    } else {
        cart.push(product);


    }

    localStorage.setItem("cart", JSON.stringify(cart));
    // hoặc "quickBuy"

    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    updateCartIcon(totalCount);

}

export function updateCartIcon(count) {
    const icon = document.getElementById("cart-count");
    if (icon) {
        icon.textContent = count;
        icon.classList.add("cart-bounce");

        icon.classList.add("cart-bounce");
        setTimeout(() => icon.classList.remove("cart-bounce"), 300);
    }

    // Nếu muốn lưu vào localStorage:
    localStorage.setItem('cartCount', count);
    localStorage.setItem('cart', JSON.stringify(JSON.parse(localStorage.getItem('cart')) || []));
}

// Khi load trang, khôi phục số lượng
window.addEventListener('load', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    updateCartIcon(totalCount);
});
function renderCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartBody = document.getElementById("cart-body");
    if (!cartBody) return;

    const subtotalEl = document.getElementById("subtotal");
    const discountEl = document.getElementById("discount");
    const totalEl = document.getElementById("total-price");

    cartBody.innerHTML = "";

    if (cart.length === 0) {
        cartBody.innerHTML = "<tr><td colspan='5'>ไม่มีสินค้าในตะกร้า</td></tr>";
        subtotalEl.textContent = "0฿";
        discountEl.textContent = "0฿";
        totalEl.textContent = "0฿";
        return;
    }

    let subtotal = 0;
    let discount = 0;

    cart.forEach((item, index) => {
        const itemQty = item.quantity;
        const itemPrice = item.pricex; // dùng số để tính
        let itemTotal = itemPrice * itemQty;

        // Áp dụng combo nếu có
        if (item.combo) {
            const { buy, free } = item.combo;
            const unitCount = buy + free;
            const setCount = Math.floor(itemQty / unitCount);
            const remainder = itemQty % unitCount;
            const payableQty = (setCount * buy) + Math.min(remainder, buy);
            const originalPrice = itemQty * itemPrice;
            itemTotal = payableQty * itemPrice;
            discount += originalPrice - itemTotal;
        }

        subtotal += itemTotal;

        const row = document.createElement("tr");
        row.innerHTML = `
      <td class="product-info">
        <div class="product-image">
          <img src="${item.image}" alt="product" />
        </div>
        <div class="product-text">
          <div class="product-name">${item.name}</div>
          <div class="product-sub">${item.comboText}</div>
        </div>
      </td>
      <td class="product-price">${item.price.toLocaleString('th-TH')}฿</td>
      <td>
        <input type="number" min="1" value="${itemQty}" data-index="${index}" class="qty-input" />
      </td>
      <td class="product-total">
  <span class="item-total">${itemTotal.toLocaleString('th-TH')}฿</span>
</td>

      <td><i class="fas fa-trash-alt delete-btn" data-index="${index}"></i></td>
    `;
        cartBody.appendChild(row);
    });

    subtotalEl.textContent = subtotal.toLocaleString('th-TH') + "฿";
    discountEl.textContent = discount > 0
        ? "- " + discount.toLocaleString('th-TH') + "฿"
        : "0฿";
    totalEl.textContent = subtotal.toLocaleString('th-TH') + "฿";


    // Xử lý sự kiện xoá
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const index = parseInt(btn.dataset.index);
            cart.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            renderCart();
            const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
            updateCartIcon(totalCount);
        });
    });

    // Xử lý sự kiện thay đổi số lượng
    document.querySelectorAll(".qty-input").forEach(input => {
        input.addEventListener("change", () => {
            const index = parseInt(input.dataset.index);
            let newQty = parseInt(input.value);
            if (isNaN(newQty) || newQty < 1) newQty = 1;
            cart[index].quantity = newQty;
            localStorage.setItem("cart", JSON.stringify(cart));
            renderCart();
        });
    });
}

function buyNow() {
    const image = document.getElementById("mainImage")?.src || "";
    const name = document.querySelector(".product-center h1")?.textContent.trim();
    const priceText = document.getElementById("price-value")?.textContent.trim().replace("฿", "").replace(",", "");
    const quantity = parseInt(document.getElementById("quantity").value);
    const price = parseInt(priceText);
    const total = price * quantity;
    const selectedComboText = selectedCombo.buy > 1
        ? `ซื้อ ${selectedCombo.buy} แถม ${selectedCombo.free}`
        : "ซื้อ 1";
    const quickBuy = {
        image,
        name,
        price,
        quantity,
        comboText: selectedComboText,
        combo: selectedCombo,
        total,
    };

    localStorage.setItem("quickBuy", JSON.stringify(quickBuy));
    localStorage.setItem("buyMode", "quickBuy");
    window.location.href = "checkout.html"


}
function renderQuickBuyInfo() {
    const product = JSON.parse(localStorage.getItem("quickBuy"));
    const container = document.getElementById("quick-buy-info");
    if (container) {
        container.innerHTML = `
      <div class="checkout-product">
        <img src="${product.image}" alt="product" />
        <div class="product-details">
          <div class="product-title">${product.name}</div>
          <div class="product-sub">${product.comboText || ""}</div>
          <div class="product-meta">
            <span class="price">${product.price.toLocaleString()}฿</span>
            <span class="quantity">x${product.quantity}</span>
          </div>
        </div>
      </div>
    `;
    }

    // Cập nhật tổng
    const total = product.price * product.quantity;
    const subtotalEl = document.querySelector(".subtotal");
    const totalPriceEl = document.querySelector(".total-price");

    if (subtotalEl) subtotalEl.textContent = total.toLocaleString() + "฿";
    if (totalPriceEl) totalPriceEl.textContent = total.toLocaleString() + "฿";
}
let discountAmount = 0;
function applyDiscount() {
    const code = document.getElementById("discount-code").value.trim();
    const cart = getCart();

    const subtotal = cart.reduce((sum, item) => {
        let itemQty = item.quantity;
        let itemPrice = item.pricex;
        let itemTotal = itemQty * itemPrice;

        // Tính lại số lượng cần thanh toán nếu có combo
        if (item.combo) {
            const { buy, free } = item.combo;
            const unitCount = buy + free;
            const setCount = Math.floor(itemQty / unitCount);
            const remainder = itemQty % unitCount;
            const payableQty = (setCount * buy) + Math.min(remainder, buy);
            itemTotal = payableQty * itemPrice;
        }

        return sum + itemTotal;
    }, 0);

    if (code === "ลด200") {
        discountAmount = 200;
        localStorage.setItem("discountCode", code);
        localStorage.setItem("discountAmount", discountAmount.toString());
    } else if (code === "ลด50%") {
        discountAmount = Math.floor(subtotal * 0.5);
        localStorage.setItem("discountCode", code);
        localStorage.setItem("discountAmount", discountAmount.toString());
    } else {
        discountAmount = 0;
        alert("โค้ดไม่ถูกต้อง");

        // 💣 Xóa giá trị sai nếu có trong localStorage
        localStorage.removeItem("discountCode");
        localStorage.removeItem("discountAmount");
    }


    document.getElementById("discount").innerText =
        discountAmount > 0 ? "- " + discountAmount.toLocaleString() + "฿" : "0฿";

    document.getElementById("total-price").innerText =
        (subtotal - discountAmount).toLocaleString() + "฿";

}



function removeItem(el) {
    const row = el.closest("tr");
    row.remove();
    document.getElementById("subtotal").innerText = "0฿";
    document.getElementById("discount").innerText = "0฿";
    document.getElementById("total-price").innerText = "0฿";
}
// Gọi khi checkout được load
// if (window.location.href.includes("checkout.html")) {
//     document.addEventListener("DOMContentLoaded", renderQuickBuyInfo);
// }

function renderCartForCheckout() {
    const cart = JSON.parse(localStorage.getItem("cart"));
    const container = document.getElementById("cart-buy");
    const subtotalCk = document.getElementById("subtotal");
    const discountCk = document.getElementById("discount");
    const totalCk = document.getElementById("total-price");
    const discountAmount = parseInt(localStorage.getItem("discountAmount")) || 0;


    if (!container || cart.length === 0) {
        container.innerHTML = "<p>ไม่มีสินค้าในตะกร้า</p>";
        return;
    }

    let subtotal = 0;
    cart.forEach(item => {
        const itemQty = item.quantity;
        const itemPrice = item.pricex;
        let itemTotal = itemQty * itemPrice;

        // Áp combo nếu có
        if (item.combo) {
            const { buy, free } = item.combo;
            const unitCount = buy + free;
            const setCount = Math.floor(itemQty / unitCount);
            const remainder = itemQty % unitCount;
            const payableQty = (setCount * buy) + Math.min(remainder, buy);
            itemTotal = payableQty * itemPrice;
        }

        subtotal += itemTotal;


        container.innerHTML += `
        <div class="checkout-product">
        <img src="${item.image}" alt="product" />
        <div class="product-details">
          <div class="product-title">${item.name}</div>
          <div class="product-sub">${item.comboText || ""}</div>
          <div class="product-meta">
            <span class="price">${item.price.toLocaleString()}฿</span>
            <span class="quantity">x${item.quantity}</span>
          </div>
        </div>
      </div>
        `;
    });

    // Gán tổng
    subtotalCk.textContent = subtotal.toLocaleString('th-TH') + "฿";
    discountCk.textContent = discountAmount > 0
        ? "- " + discountAmount.toLocaleString('th-TH') + "฿"
        : "0฿";
    totalCk.textContent = (subtotal - discountAmount).toLocaleString('th-TH') + "฿";

}
function renderCheckout() {
    const mode = localStorage.getItem("buyMode");

    if (mode === "cart") {
        renderCartForCheckout();
    } else if (mode === "quickBuy") {
        renderQuickBuyInfo();
    } else {
        console.warn("Không xác định chế độ mua hàng");
    }
}



function gotoCheckout() {
    const input = document.getElementById("discount-code");
    const code = input?.value.trim();
    const mode = localStorage.getItem("buyMode");
     localStorage.setItem("buyMode","cart");

    let valid = false;

    if (mode === "cart") {
        const checkProduct = JSON.parse(localStorage.getItem("cart"));
        valid = Array.isArray(checkProduct) && checkProduct.length > 0;
       
    } else if (mode === "quickBuy") {
        const quickItem = JSON.parse(localStorage.getItem("quickBuy"));
        valid = quickItem && quickItem.name;
    }

    if (!valid) {
        alert("ไม่พบข้อมูลสินค้า กรุณาเลือกสินค้าอีกครั้ง");
        window.location.href = "product.html";
        return;
    }

    if (!code) {
        localStorage.removeItem("discountAmount");
        localStorage.removeItem("discountCode");
    }

    window.location.href = "checkout.html";
}


function getCart() { return JSON.parse(localStorage.getItem("cart")) || []; }
document.addEventListener("DOMContentLoaded", function () {
    const cart = getCart();
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    updateCartIcon(totalCount);

    updateCartIcon(totalCount);
    renderCart();
    renderCheckout();







});

