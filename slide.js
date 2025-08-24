// window.allPosts = window.allPosts || [];
let allPosts = [];

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
  if (slides[index]) slides[index].classList.add("active");
  if (dots[index]) dots[index].classList.add("active");
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

if (prevBtn) prevBtn.onclick = () => changeSlide(-1);
if (nextBtn) nextBtn.onclick = () => changeSlide(1);


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



const swiperActive = new Swiper('.swiper_active', {
  slidesPerView: 2,
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

// async function fetchPostsByCategorySlug(slug, count = 5) {
//   try {
//     const catRes = await fetch(`http://localhost/up5_wp/wp-json/wp/v2/categories?slug=${slug}`);
//     const catData = await catRes.json();
//     if (!catData.length) return [];

//     const catId = catData[0].id;
//     const postRes = await fetch(`http://localhost/up5_wp/wp-json/wp/v2/posts?categories=${catId}&_embed&per_page=${count}`);
//     const posts = await postRes.json();

//     return posts.map(post => ({
//       id: post.id,
//       title: post.title.rendered,
//       link: post.link,
//       img: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'img/placeholder.png',
//       excerpt: post.excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, ""),
//       categorySlug: slug
//     }));
//   } catch (error) {
//     console.error("Lỗi khi fetch posts:", error);
//     return [];
//   }
// }


// async function fetchAllCategories() {
//   try {
//     // Lấy tối đa 100 category (thay số này nếu cần)
//     const res = await fetch('http://localhost/up5_wp/wp-json/wp/v2/categories?per_page=100');
//     const categories = await res.json();
//     // Lọc category có post count > 0 (bạn có thể thay đổi điều kiện lọc)
//     const slugs = categories.filter(cat => cat.count > 0).map(cat => cat.slug);
//     return slugs;
//   } catch (error) {
//     console.error('Lỗi khi lấy danh sách categories:', error);
//     return [];
//   }
// }

// function createPostCard(post, categorySlug) {
//   const card = document.createElement('div');
//   card.classList.add('post-card');
//   card.innerHTML = `
//     <a href="daday_patical1.html?id=${post.id}&slug=${categorySlug}">
//       <img src="${post.img}" alt="${post.title}">
//       <div class="post-content">
//         <h3>${post.title}</h3>
//         <p>${post.excerpt}</p>
//       </div>
//     </a>
//   `;
//   return card;
// }


// // ... giữ nguyên phần fetchPostsByCategorySlug, fetchAllCategories, createPostCard ...

// async function loadPostToSwiper(slugs) {
//   const postList = document.getElementById('post-list');
  

//   // Tạo mảng chứa tất cả bài post để trả về
//   let allPostsLocal = [];

//   for (const slug of slugs) {
//     const posts = await fetchPostsByCategorySlug(slug);
//     allPostsLocal = allPostsLocal.concat(posts);

//     posts.forEach(post => {
//       const slide = document.createElement('div');
//       slide.className = 'swiper-slide active_item';
//       slide.appendChild(createPostCard(post, slug));
//       postList.appendChild(slide);
//     });
//   }

//   if (typeof swiperActive !== 'undefined') {
//     swiperActive.update();
//   }
// console.log(allPostsLocal)
//   return allPostsLocal; // Trả về tất cả posts đã load
// }
// async function getPostsFromCategories(slugs) {
//   for (const slug of slugs) {
//     console.log("Fetching category:", slug);
//     const posts = await fetchPostsByCategorySlug(slug, 10);
//     console.log(`Posts for ${slug}:, posts`);
//     allPosts = allPosts.concat(posts);
//   }
//   return allPosts;
// }


// function renderVerticalPosts(posts) {
//   const container = document.getElementById("random-posts");
//   if (!container) return;

//   container.innerHTML = "";
//   posts.forEach(post => {
//     const li = document.createElement("li");

//     const linkEl = document.createElement("a");
//     linkEl.href = `daday_patical1.html?id=${post.id}&slug=${post.categorySlug}`;

//     linkEl.style.display = "flex";
//     linkEl.style.alignItems = "center";
//     linkEl.style.gap = "8px";

//     const img = document.createElement("img");
//     img.src = post.img || "img/placeholder.png";
//     img.alt = "thumb";
//     img.style.width = "50px";

//     const textEl = document.createElement("div");
//     textEl.textContent = post.title || "";

//     linkEl.appendChild(img);
//     linkEl.appendChild(textEl);
//     li.appendChild(linkEl);
//     container.appendChild(li);
//   });
// }

// function shuffleAndPick(array, count) {
//   return array.sort(() => 0.5 - Math.random()).slice(0, count);
// }
// async function loadAllCategoriesPosts() {
//   const slugs = await fetchAllCategories();
//   if (!slugs.length) {
//     console.warn("Không có category để load bài viết");
//     return [];
//   }
//   console.log("Danh sách slugs:", slugs);
//   const posts = await loadPostToSwiper(slugs);
//   console.log("Tổng bài viết load được:", posts.length);

//   allPosts = posts; // ✅ Gán vào biến toàn cục
//   return posts;
// }


// async function loadRandomVerticalPosts() {
//   console.log("Bắt đầu loadRandomVerticalPosts");
//   if (allPosts.length === 0) {
//     console.log("allPosts trống, load lại");
//     allPosts = await loadAllCategoriesPosts();
//   }
//   console.log("Tổng bài viết trong allPosts:", allPosts.length);

//   const pickedPosts = shuffleAndPick(allPosts, 4);
//   console.log("Bài viết được chọn random:", pickedPosts);

//   renderVerticalPosts(pickedPosts);
// }

// document.addEventListener("DOMContentLoaded", async () => {
//   allPosts = await loadAllCategoriesPosts();
//   await loadRandomVerticalPosts();
// });









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





