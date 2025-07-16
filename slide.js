
if (typeof currentIndex === 'undefined') {
  var currentIndex = 0;
}
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.remove("active");
    dots[i].classList.remove("active");
  });
  slides[index].classList.add("active");
  dots[index].classList.add("active");
  currentIndex = index;
}

function changeSlide(direction) {
  let newIndex = currentIndex + direction;
  if (newIndex < 0) newIndex = slides.length - 1;
  if (newIndex >= slides.length) newIndex = 0;
  showSlide(newIndex);
}

function goToSlide(index) {
  showSlide(index);
}

prevBtn.onclick = () => changeSlide(-1);
nextBtn.onclick = () => changeSlide(1);

dots.forEach((dot, i) => {
  dot.onclick = () => goToSlide(i);
});



document.addEventListener("DOMContentLoaded", () => {
  showSlide(currentIndex);
  if (!window.slideInterval) {
    window.slideInterval = setInterval(() => changeSlide(1), 5000);
  }
});
function toggleMenu() {
  const menuWrapper = document.getElementById("mainMenuWrapper");
  const isOpen = menuWrapper.classList.contains("show");
  const toggleBtn = document.querySelector(".menu-toggle");
  if (isOpen) {
    // Đóng menu
    menuWrapper.classList.remove("show");

    toggleBtn.style.display = "block";

  } else {
    // Mở menu
    menuWrapper.classList.add("show");
    toggleBtn.style.display = "none";
  }
}


// Thêm đoạn xử lý dropdown ở đây:
document.addEventListener("DOMContentLoaded", function () {
  const dropdownTriggers = document.querySelectorAll(".dropdown-trigger");

  dropdownTriggers.forEach(trigger => {
    trigger.addEventListener("click", function (e) {
      e.preventDefault();
      const dropdownContent = this.nextElementSibling;

      // Nếu muốn chỉ dropdown trên mobile
      if (window.innerWidth <= 768) {
        dropdownContent.classList.toggle("show-dropdown");
      }
    });
  });
});
function toggleDropdown(button) {
  const parent = button.closest(".menu-dropdown");
  parent.classList.toggle("open");
}

function closeMenu() {
  const menuWrapper = document.getElementById("mainMenuWrapper");
  const toggleBtn = document.querySelector(".menu-toggle");
  const overlay = document.getElementById("menuOverlay");

  menuWrapper.classList.remove("show");
  if (overlay) {
    overlay.style.display = "none";
    toggleBtn.style.display = "block";
  }
}




//hiệu ứng hiện
const reveals = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      observer.unobserve(entry.target); // chỉ hiện 1 lần
    }
  });
}, {
  threshold: 0.1 // phần tử hiển thị ít nhất 10% thì kích hoạt
});

reveals.forEach(reveal => {
  observer.observe(reveal);
});
//nhúng header//
fetch("frontend/header.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("header-placeholder").innerHTML = html;
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    updateCartIcon(totalCount);
  });
//nhúng footer
fetch("frontend/footer.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("footer-placeholder").innerHTML = html
  });

function loadPage(url, title = "") {
  // history.pushState({ url, title }, title, `?page=${url}`);
  document.getElementById("default-content").style.display = "none";
  document.getElementById("main-content").style.display = "block";

  const titleSection = document.querySelector(".dynamic-title-section");
  const breadcrumbTitle = document.getElementById("breadcrumb-title");

  if (title) {
    if (breadcrumbTitle) breadcrumbTitle.innerText = title;
    if (titleSection) titleSection.style.display = "block";
  }

  fetch(url)
    .then(res => res.text())
    .then(html => {
      document.getElementById("main-content").innerHTML = html;
      if (url.includes("faq.html") && typeof initFaqToggle === "function") {
        initFaqToggle();
      }
      if (url.includes("product.html") && typeof updateCombo === "function") {
        updateCombo();
      }
      if (url.includes("cart.html") && typeof renderCart === "function") {
        renderCart();
      }
      if (url.includes("checkout.html") && typeof renderQuickBuyInfo === "function") {

        renderQuickBuyInfo();
       confirm_cart();
      }
      const container = document.getElementById("main-content");
      const scripts = container.querySelectorAll("script");

      const loadedScripts = new Set();

      scripts.forEach(oldScript => {
        const src = oldScript.src;

        if (src) {
          if (!loadedScripts.has(src) && !src.includes("slide.js")) {
            const newScript = document.createElement("script");
            newScript.src = src;
            document.body.appendChild(newScript);
            loadedScripts.add(src);
          }
        } else {
          const inlineScript = document.createElement("script");
          inlineScript.textContent = oldScript.textContent;
          document.body.appendChild(inlineScript);
        }

        oldScript.remove();
      });


      const hash = window.location.hash;
      if (hash) {
        const target = document.querySelector(hash);
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    })
    .catch(err => console.error("Không thể tải nội dung:", err));

}
function showHome() {
  document.getElementById("main-content").style.display = "none";
  document.getElementById("default-content").style.display = "block";

  // Ẩn phần tiêu đề và reset breadcrumb

  const titleSection = document.querySelector(".dynamic-title-section");
  const breadcrumbTitle = document.getElementById("breadcrumb-title");
  if (titleSection) titleSection.style.display = "none";
  if (breadcrumbTitle) breadcrumbTitle.innerText = "";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

window.loadPage = loadPage;
window.showHome = showHome;
function changeImage(src) {
  const mainImage = document.getElementById("mainImage");
  mainImage.style.opacity = 0;
  setTimeout(() => {
    mainImage.src = src;
    mainImage.style.opacity = 1;
  }, 150);
}
let discountAmount = 0;

function updateTotal() {
  const qtyInput = document.querySelector('input[type="number"]');
  const qty = parseInt(qtyInput.value);
  const pricePerItem = 1449;
  const itemTotal = pricePerItem * qty;

  document.querySelector(".item-total").innerText = itemTotal.toLocaleString();
  document.getElementById("subtotal").innerText = itemTotal.toLocaleString() + "฿";
  document.getElementById("total-price").innerText = (itemTotal - discountAmount).toLocaleString() + "฿";
}
let selectedCombo = { buy: 1, free: 0 };
function updateCombo() {
  const unitPrice = 1449;
  const priceEl = document.getElementById('price-value');
  const noteEl = document.getElementById('price-note');
  document.querySelectorAll('.combo-button').forEach(button => {
    button.addEventListener('click', () => {
      let buy = 1, free = 0;
      const id = button.id;
      if (id === 'combo1') {
        priceEl.textContent = '1,449฿ /';
        noteEl.textContent = 'ซื้อ 1 กระป๋อง ราคา';
        return;
      }
      if (id === 'combo31') {
        buy = 3, free = 1;
      } else if (id === 'combo42') {
        buy = 4, free = 2;
      } else if (id === 'combo53') {
        buy = 5, free = 3;
      } else if (id === 'combo75') {
        buy = 7, free = 5;
      }
      selectedCombo = { buy, free };
      const totalPrice = buy * unitPrice;

      priceEl.textContent = totalPrice.toLocaleString() + '฿';
      noteEl.textContent = ` / ซื้อ ${buy} แถม ${free}`;

    });
  });
}

function applyDiscount() {
  const code = document.getElementById("discount-code").value.trim();
  const qty = parseInt(document.querySelector('input[type="number"]').value);
  const pricePerItem = 1499;
  const subtotal = pricePerItem * qty;

  if (code === "ลด200") {
    discountAmount = 200;
  }
  else if (code === "ลด50%") {
    discountAmount = Math.floor(subtotal * 0.5);
  } else {
    alert("โค้ดไม่ถูกต้อง");
    discountAmount = 0;
  }

  document.getElementById("discount").innerText = "-" + discountAmount.toLocaleString() + "฿";
  document.getElementById("total-price").innerText = (subtotal - discountAmount).toLocaleString() + "฿";
}

function removeItem(el) {
  const row = el.closest("tr");
  row.remove();
  document.getElementById("subtotal").innerText = "0฿";
  document.getElementById("discount").innerText = "0฿";
  document.getElementById("total-price").innerText = "0฿";
}

document.addEventListener("DOMContentLoaded", function () {

  const menuItems = document.querySelectorAll(".tabs-left li");

  menuItems.forEach(item => {
    item.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const yOffset = -80; // offset nếu có header cố định
        const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });
});
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
    const totalPrice = unitPrice * newQty / newQty;
    changePrice.textContent = totalPrice.toLocaleString() + "฿";
    changeNote.textContent = `/ ซื้อ ${newQty} กระป๋อง ราคา`;
  }
}
function addtocart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const image = document.getElementById("mainImage")?.src || "";
  const name = document.querySelector(".product-center h1")?.textContent.trim();

  // 👇 Lấy số từ chuỗi có dấu , và ฿
  const priceText = document.getElementById("price-value")?.textContent.trim().replace(/[฿,]/g, '');
  const pricex = parseInt(priceText); // dạng số, dùng để tính toán

  const price = pricex.toLocaleString('th-TH'); // "1,449"

  const quantity = parseInt(document.getElementById("quantity").value);

  const selectedComboText = selectedCombo.buy > 1
    ? `ซื้อ ${selectedCombo.buy} แถม ${selectedCombo.free}`
    : "ซื้อ 1";

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
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  updateCartIcon(totalCount);
}

function updateCartIcon(count) {
  const icon = document.getElementById("cart-count");
  if (icon) {
    icon.textContent = count;

    icon.classList.add("cart-bounce");
    setTimeout(() => icon.classList.remove("cart-bounce"), 300);
  }

  // Nếu muốn lưu vào localStorage:
  localStorage.setItem('cartCount', count);
}

// Khi load trang, khôi phục số lượng
window.addEventListener('load', () => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  updateCartIcon(totalCount);
});



document.addEventListener("DOMContentLoaded", () => {
  renderCart();

  document.querySelector(".checkout-btn")?.addEventListener("click", () => {
    alert("ระบบยังไม่เปิดให้ชำระเงิน");
  });
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
      <td class="product-total"><span class="item-total">${itemTotal.toLocaleString('th-TH')}</span>฿</td>
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


fetch('frontend/form.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('exitFormContainer').innerHTML = data;

    // Bắt đầu lắng nghe sự kiện để hiển thị form khi chuẩn bị rời trang
    let shownExitForm = false;

    document.addEventListener("mouseout", function (e) {
      if (e.clientY < 10 && !shownExitForm) {
        document.getElementById("exitForm").style.display = "flex";
        shownExitForm = true;
      }
    });
    const overlay = document.getElementById("exitForm");
    overlay.addEventListener("click", function (e) {
      const popup = overlay.querySelector(".contact-form");
      if (!popup.contains(e.target)) {
        overlay.style.display = "none";
      }
    });
  });

function closeExitForm() {
  document.getElementById("exitForm").style.display = "none";
}

function showLoginForm() {
  // Kiểm tra nếu overlay đã tồn tại
  const overlay = document.getElementById("loginOverlay");

  if (overlay) {
    overlay.style.display = "flex";
    return;
  }

  // Nếu chưa có → tải form login.html và gắn vào DOM
  fetch('frontend/login.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('showLoginFormContent').innerHTML = data;

      const overlay = document.getElementById("loginOverlay");
      if (!overlay) return;

      overlay.style.display = "flex";

      // Đóng khi click ra ngoài form
      overlay.addEventListener("click", function (e) {
        const popup = document.getElementById("loginForm");
        if (!popup.contains(e.target)) {
          overlay.style.display = "none";
        }
      });
    })
    .catch(error => {
      console.error("Lỗi khi tải form đăng nhập:", error);
    });
}

function closeLoginForm() {
  const overlay = document.getElementById("loginOverlay");
  if (overlay) overlay.style.display = "none";
}

// Hiển thị dữ liệu từ localStorage trên trang checkout


const swiperCombo = new Swiper('.swiper_combo', {
  slidesPerView: 1,
  spaceBetween: 20,

  loop: true,
  navigation: {
    nextEl: '.swiper-button-next-combo',
    prevEl: '.swiper-button-prev-combo',
  },
  autoplay: false,

  breakpoints: {
    320: {
      slidesPerView: 1,
    },
    640: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    }
  }
});



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
  loadPage("frontend/checkout.html", "ซื้อสินค้า");
}
function renderQuickBuyInfo() {
  const product = JSON.parse(localStorage.getItem("quickBuy"));
  const container = document.getElementById("quick-buy-info");

  if (!product) {
    alert("ไม่พบข้อมูลสินค้า กรุณาเลือกสินค้าอีกครั้ง");
    window.location.href = "index.html";
    return;
  }

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

// Gọi khi checkout được load
if (window.location.href.includes("checkout.html")) {
  document.addEventListener("DOMContentLoaded", renderQuickBuyInfo);
}

// main.js
function initFaqToggle() {
  const faqBox = document.getElementById('faq');
  if (!faqBox) return;

  const faqQuestions = faqBox.querySelectorAll('.faq-question');

  faqQuestions.forEach((question) => {
    question.addEventListener('click', () => {
      const answer = question.nextElementSibling;
      const icon = question.querySelector('.toggle-icon');
      const isOpen = answer.style.display === 'block';

      // Ẩn tất cả câu trả lời và đặt lại icon thành "+"
      faqBox.querySelectorAll('.faq-answer').forEach((ans) => {
        ans.style.display = 'none';
      });
      faqBox.querySelectorAll('.faq-question .toggle-icon').forEach((i) => {
        i.textContent = '+';
      });

      // Nếu đang đóng thì mở ra và đổi icon thành "-"
      if (!isOpen) {
        answer.style.display = 'block';
        if (icon) icon.textContent = '–';
      }
    });
  });

  // Mặc định ẩn hết câu trả lời khi trang tải
  faqBox.querySelectorAll('.faq-answer').forEach(a => a.style.display = 'none');
}


function toggleForm() {
  const form = document.getElementById('review-form');
  // Kiểm tra nếu form đang hiển thị thì ẩn, ngược lại thì hiển thị
  if (form.style.display === 'none' || form.style.display === '') {
    form.style.display = 'block';
  } else {
    form.style.display = 'none';
  }
}
let selectedRating = 0;
function loadstar() {
  document.addEventListener('DOMContentLoaded', function () {
    const stars = document.querySelectorAll('#rating-stars span');
    const label = document.getElementById('rating-label');
    const descriptions = ['แย่', 'พอใช้', 'ปานกลาง', 'ดี', 'ยอดเยี่ยม'];

    stars.forEach((star) => {
      const value = parseInt(star.getAttribute('data-star'));

      star.addEventListener('click', () => {
        selectedRating = value;
        updateStars(selectedRating);
      });

      star.addEventListener('mouseover', () => {
        updateStars(value);
      });

      star.addEventListener('mouseout', () => {
        updateStars(selectedRating);
      });
    });

    function updateStars(rating) {
      stars.forEach((star, index) => {
        star.style.color = index < rating ? 'gold' : '#ccc';
      });

      if (label) {
        label.textContent = rating > 0 ? descriptions[rating - 1] : 'กรุณาให้คะแนน';
      }
    }
  });
}
function setActive(clickedButton) {
  // Bỏ active khỏi tất cả button
  const buttons = document.querySelectorAll(".combo-button");
  buttons.forEach(btn => btn.classList.remove("active"));

  // Thêm active vào button được click
  clickedButton.classList.add("active");
}
console.log('Swiper initializing...');


const swiperActive = new Swiper('.swiper_active', {
  slidesPerView: 1,
  spaceBetween: 20,
  loop: true,
  // centeredSlides: true,
  navigation: {
    nextEl: '.swiper-button-next-active',
    prevEl: '.swiper-button-prev-active',
  },
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  breakpoints: {
    320: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 4,
    }

  }

});
console.log('Swiper initialized:', swiperActive);

async function loadPostToSwiper(path) {
  const res = await fetch(path);
  const html = await res.text();

  const tempDOM = document.createElement('div');
  tempDOM.innerHTML = html;

  const posts = tempDOM.querySelectorAll('.post-card');
  if (posts.length > 0) {
    posts.forEach(post => {
      const slide = document.createElement('div');
      slide.className = 'swiper-slide active_item';

      // Clone từng post-card
      slide.appendChild(post.cloneNode(true));
      document.querySelector('#post-list').appendChild(slide);
    });
    swiperActive.update();

  }
}

loadPostToSwiper('frontend/daday.html');
loadPostToSwiper('frontend/daitrang.html');
loadPostToSwiper('frontend/tieuhoa.html');

async function getPostsFromPages(pages) {
  let allPosts = [];

  for (const page of pages) {
    try {
      const res = await fetch(page);
      const htmlText = await res.text();

      const tempDom = document.createElement("div");
      tempDom.innerHTML = htmlText;

      const posts = tempDom.querySelectorAll(".post-card");
      allPosts = allPosts.concat(Array.from(posts));
    } catch (e) {
      console.error("โหลดโพสต์จาก", page, "ไม่สำเร็จ:", e);
    }
  }

  return allPosts;
}

function shuffleAndPick(arr, count = 4) {
  return arr.sort(() => 0.5 - Math.random()).slice(0, count);
}

function renderVerticalPosts(posts) {
  const container = document.getElementById("random-posts");
  if (!container) return;

  posts.forEach(post => {
    const img = post.querySelector("img")?.src;
    const title = post.querySelector("h3")?.innerText;
    const link = post.querySelector("a")?.getAttribute("onclick");

    const li = document.createElement("li");

    const imageEl = document.createElement("img");
    imageEl.src = img || "";
    imageEl.alt = "thumb";

    const textEl = document.createElement("div");
    textEl.textContent = title;

    li.appendChild(imageEl);
    li.appendChild(textEl);

    // Gắn link onclick như trong post gốc
    if (link) li.setAttribute("onclick", link);

    container.appendChild(li);
  });
}


async function loadRandomVerticalPosts() {
  const pages = ["frontend/daday.html", "frontend/daitrang.html", "frontend/tieuhoa.html"];
  const allPosts = await getPostsFromPages(pages);
  const pickedPosts = shuffleAndPick(allPosts, 4);
  renderVerticalPosts(pickedPosts);
}
document.addEventListener("DOMContentLoaded", () => {
  loadRandomVerticalPosts();
});

document.addEventListener("DOMContentLoaded", function () {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const infoContainer = document.getElementById("quick-buy-info");
  const subtotalEl = document.querySelector(".subtotal");
  const totalEl = document.querySelector(".total-price");
  const discountEl = document.querySelector(".discount");

  if (!cart.length) {
    infoContainer.innerHTML = "<p>ไม่มีสินค้าในตะกร้า</p>";
    subtotalEl.textContent = "0฿";
    totalEl.textContent = "0฿";
    return;
  }

  let subtotal = 0;
  let discount = 0;
  let html = "";

  cart.forEach(item => {
    let itemTotal = item.price * item.quantity;

    if (item.combo) {
      const { buy, free } = item.combo;
      const unitCount = buy + free;
      const setCount = Math.floor(item.quantity / unitCount);
      const remainder = item.quantity % unitCount;
      const payableQty = (setCount * buy) + Math.min(remainder, buy);
      const originalPrice = item.quantity * item.price;
      itemTotal = payableQty * item.price;
      discount += originalPrice - itemTotal;
    }

    subtotal += itemTotal;

    html += `
      <div class="checkout-item" style="display: flex; gap: 10px; margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">
        <img src="${item.image}" style="width: 80px; height: 80px; object-fit: cover;" />
        <div>
          <div><strong>${item.name}</strong></div>
          <div>${item.comboText || ""}</div>
          <div>${item.price}฿ x ${item.quantity} = <strong>${itemTotal.toLocaleString()}฿</strong></div>
        </div>
      </div>
    `;
  });

  infoContainer.innerHTML = html;
  subtotalEl.textContent = subtotal.toLocaleString() + "฿";
  discountEl.textContent = discount > 0 ? "- " + discount.toLocaleString() + "฿" : "0฿";
  totalEl.textContent = (subtotal).toLocaleString() + "฿";
});



document.addEventListener("DOMContentLoaded", () => {
  renderCart();

  const checkoutBtn = document.querySelector(".checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      loadPage("frontend/checkout.html", "ซื้อสินค้า");
    });
  }
});




// // Hiện nút khi cuộn xuống 200px
// window.onscroll = function () {
//     const btn = document.getElementById("backToTop");
//     if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
//         btn.style.display = "block";
//     } else {
//         btn.style.display = "none";
//     }
// };
// // Cuộn mượt lên đầu trang
// function scrollToTop() {
//     window.scrollTo({ top: 0, behavior: 'smooth' });
// }





