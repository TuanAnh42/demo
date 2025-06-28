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
    document.getElementById("header-placeholder").innerHTML = html
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

  // Cập nhật breadcrumb và tiêu đề lớn nếu có
  const titleSection = document.querySelector(".dynamic-title-section");
  const titleElement = document.getElementById("dynamic-title");
  const breadcrumbTitle = document.getElementById("breadcrumb-title");

  if (title) {
    if (titleElement) titleElement.innerText = title;
    if (breadcrumbTitle) breadcrumbTitle.innerText = title;
    if (titleSection) titleSection.style.display = "block";
  }

  fetch(url)
    .then(res => res.text())
    .then(html => {
      document.getElementById("main-content").innerHTML = html;
      window.scrollTo({ top: 0, behavior: "smooth" });
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
  if (breadcrumbTitle) breadcrumbTitle.innerText = "Trang chính";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

window.loadPage = loadPage;
window.showHome = showHome;

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





