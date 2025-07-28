// fetch('http://127.0.0.1:8000/api/products/101')
//     .then(res => res.json())
//     .then(data => {
//         const product = data.product || data;

//         if (!product) {
//             console.error("Không tìm thấy dữ liệu sản phẩm");
//             return;
//         }

//         // Ảnh chính
//         // Ảnh đại diện (thumbnail chính)
//         const imgEl = document.getElementById("mainImage");
//         if (product.thumbnail) {
//             imgEl.src = "/storage/" + product.thumbnail;
//         } else if (imgEl) {
//             imgEl.src = "";
//         }

//         // Các ảnh phụ (gallery)
//         const thumbnailRow = document.querySelector('.thumbnail-row');
//         if (thumbnailRow && Array.isArray(product.images)) {
//             thumbnailRow.innerHTML = '';
//             product.images.forEach(img => {
//                 const path = "/storage/" + img.path;
//                 thumbnailRow.innerHTML += `<img src="${path}" class="thumb" onclick="changeImage('${path}')" />`;
//             });
//         }


//         // Thumbnail


//         document.querySelector('.product-center h1').innerText = product.name;
//         document.querySelector('.status .in-stock').innerText = product.qty > 0 ? 'มีสินค้า' : 'หมด';
//         document.querySelector('.rating').innerText = `⭐️⭐️⭐️⭐️⭐️ ${product.rating ?? 0} รีวิว`;
//         document.getElementById('price-value').innerText = `${product.price}฿ /`;
//         document.getElementById('price-note').innerText = product.priceNote ?? '';

//         const details = document.querySelector('.product-detailss');
//         details.innerHTML = `
//       <li><strong>แบรนด์:</strong> ${product.brand ?? 'N/A'}</li>
//       <li><strong>วัตถุดิบ:</strong> ${product.ingredients ?? 'N/A'}</li>
//       <li><strong>ประเทศผู้ผลิต:</strong> ${product.origin ?? 'N/A'}</li>
//       <li><strong>รหัส FDA ไทย:</strong> ${product.fda_code ?? 'N/A'}</li>
//       <li><strong>ขนาดบรรจุ:</strong> ${product.packaging_size ?? 'N/A'}</li>
//     `;

//         const options = document.querySelector('.options');
//         options.innerHTML = '';
//         product.combos?.forEach(combo => {
//             const label = combo.gift > 0 ? `ซื้อ ${combo.buy} แถม ${combo.gift}` : `ซื้อ ${combo.buy}`;
//             options.innerHTML += `<button class="combo-button" onclick="setActive(this)">${label}</button>`;
//         });
//     })
//     .catch(err => {
//         console.error('Lỗi fetch:', err);
//         alert('ไม่สามารถโหลดข้อมูลสินค้าได้ กรุณาตรวจสอบ API หรือ kết nốiอินเทอร์เน็ต');
//     });
let selectedCombo = { buy: 1, free: 0 }; // ✅ mặc định

function updateCombo() {
    const priceEl = document.getElementById('price-value');
    const noteEl = document.getElementById('price-note');

    document.querySelectorAll('.combo-button').forEach(button => {
        button.addEventListener('click', () => {
            let buy = 1, free = 0;

            switch (button.id) {
                case 'combo1':
                    priceEl.textContent = '1,449฿ /';
                    noteEl.textContent = 'ซื้อ 1 กระป๋อง ราคา';
                    break;
                case 'combo2':
                    priceEl.textContent = '1,699฿ /';
                    noteEl.textContent = 'ซื้อ 2 กระป๋อง ราคา';
                    buy = 2;
                    break;
                case 'combo31':
                    priceEl.textContent = '2,799฿ /';
                    noteEl.textContent = 'ซื้อ 3 แถม 1';
                    buy = 3; free = 1;
                    break;
                case 'combo42':
                    priceEl.textContent = '3,899฿ /';
                    noteEl.textContent = 'ซื้อ 4 แถม 2';
                    buy = 4; free = 2;
                    break;
                case 'combo53':
                    priceEl.textContent = '4,999฿ /';
                    noteEl.textContent = 'ซื้อ 5 แถม 3';
                    buy = 5; free = 3;
                    break;
                case 'combo75':
                    priceEl.textContent = '6,999฿ /';
                    noteEl.textContent = 'ซื้อ 7 แถม 5';
                    buy = 7; free = 5;
                    break;
            }

            selectedCombo = { buy, free }; // ✅ cập nhật giá trị
            setActive(button);
           
        });

    });
}
function updateTotal() {
    const qtyInput = document.querySelector('input[type="number"]');
    const qty = parseInt(qtyInput.value);
    const pricePerItem = 1449;
    const itemTotal = pricePerItem * qty;

    document.querySelector(".item-total").innerText = itemTotal.toLocaleString();
    document.getElementById("subtotal").innerText = itemTotal.toLocaleString() + "฿";
    document.getElementById("total-price").innerText = (itemTotal - discountAmount).toLocaleString() + "฿";
}

function decrease() {
  const input = document.getElementById("quantity");
  const changePrice = document.getElementById('price-value');
  const changeNote = document.getElementById('price-note');
  let value = parseInt(input.value);
  if (value > 1) input.value = value - 1;
  const unitPrice = 1449;
  let newQty = parseInt(input.value);
  // Cập nhật giá và ghi chú
  if (value === 1) {
    changeNote = document.getElementById('price-note');
  }
  else {
    const totalPrice = unitPrice * newQty - newQty;
    changePrice.textContent = totalPrice.toLocaleString() + "฿";
    changeNote.textContent = `/ ซื้อ ${newQty} กระป๋อง ราคา`;
  }
}
function increase() {
  const input = document.getElementById("quantity");
  const changePrice = document.getElementById('price-value');
  const changeNote = document.getElementById('price-note');

  let value = parseInt(input.value);

  input.value = value + 1;
  const unitPrice = 1449;
  let newQty = parseInt(input.value);

  // Cập nhật giá và ghi chú
  const totalPrice = unitPrice * newQty;
  changePrice.textContent = totalPrice.toLocaleString() + "฿";
  changeNote.textContent = ` / ซื้อ ${newQty} กระป๋อง ราคา`;
}


document.addEventListener("DOMContentLoaded", function () {
    const firstButton = document.querySelector(".combo-button");
    if (firstButton) setActive(firstButton);
    updateCombo();
    updateTotal();
    applyDiscount();
   

});
function setActive(clickedButton) {
    // Bỏ active khỏi tất cả button
    const buttons = document.querySelectorAll(".combo-button");
    buttons.forEach(btn => btn.classList.remove("active"));

    // Thêm active vào button được click
    clickedButton.classList.add("active");
}

