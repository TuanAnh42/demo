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





