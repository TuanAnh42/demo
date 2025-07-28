
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

function changeImage(src) {
  const mainImage = document.getElementById("mainImage");
  mainImage.style.opacity = 0;
  setTimeout(() => {
    mainImage.src = src;
    mainImage.style.opacity = 1;
  }, 150);
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

loadPostToSwiper('daday.html');
loadPostToSwiper('daitrang.html');
loadPostToSwiper('tieuhoa.html');

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
  const pages = ["daday.html", "daitrang.html", "tieuhoa.html"];
  const allPosts = await getPostsFromPages(pages);
  const pickedPosts = shuffleAndPick(allPosts, 4);
  renderVerticalPosts(pickedPosts);
}
document.addEventListener("DOMContentLoaded", () => {
  loadRandomVerticalPosts();
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





