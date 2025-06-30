let currentIndex = 0;
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

setInterval(() => changeSlide(1), 5000);

window.onload = () => showSlide(currentIndex);

function toggleMenu() {
  const menu = document.getElementById("mainMenu");
  menu.classList.toggle("show");
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
  });
//nhúng footer
fetch("frontend/footer.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("footer-placeholder").innerHTML = html
  });
function loadPage(url, title = "") {
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
  setTimeout(() => {
    const menuItems = document.querySelectorAll(".tabs-left li");

    menuItems.forEach(item => {
      item.addEventListener("click", function () {
        const targetId = this.getAttribute("data-target");
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          const yOffset = -80;
          const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset;

          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      });
      
    });
  }, 100); // Delay 100ms sau khi nội dung đã được gắn vào

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





