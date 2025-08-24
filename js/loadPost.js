// main.js
import {
  fetchPostsByCategorySlug,
  fetchAllCategories,
  shuffleAndPick
} from './data.js';

let allPosts = [];

function createPostCard(post, categorySlug) {
  const card = document.createElement('div');
  card.classList.add('post-card');
  card.innerHTML = `
    <a href="daday_patical1.html?id=${post.id}&slug=${categorySlug}">
      <img src="${post.img}" alt="${post.title}">
      <div class="post-content">
        <h3>${post.title}</h3>
        <p>${post.excerpt}</p>
      </div>
    </a>
  `;
  return card;
}

 function renderVerticalPosts(posts) {
    
  const container = document.getElementById("random-posts");
  console.log(container);
  if (!container) return;

  container.innerHTML = "";
  posts.forEach(post => {
    const li = document.createElement("li");
    const linkEl = document.createElement("a");
    linkEl.href = `daday_patical1.html?id=${post.id}&slug=${post.categorySlug}`;
    linkEl.style.display = "flex";
    linkEl.style.alignItems = "center";
    linkEl.style.gap = "8px";

    const img = document.createElement("img");
    img.src = post.img || "img/placeholder.png";
    img.alt = "thumb";
    img.style.width = "50px";

    const textEl = document.createElement("div");
    textEl.textContent = post.title || "";

    linkEl.appendChild(img);
    linkEl.appendChild(textEl);
    li.appendChild(linkEl);
    container.appendChild(li);
  });
}

async function loadPostToSwiper(slugs) {
  const postList = document.getElementById('post-list');
  let allPostsLocal = [];

  for (const slug of slugs) {
    const posts = await fetchPostsByCategorySlug(slug);
    allPostsLocal = allPostsLocal.concat(posts);

    posts.forEach(post => {
      const slide = document.createElement('div');
      slide.className = 'swiper-slide active_item';
      slide.appendChild(createPostCard(post, slug));
      postList.appendChild(slide);
    });
  }

  if (typeof swiperActive !== 'undefined') {
    swiperActive.update();
  }

  return allPostsLocal;
}

async function loadAllCategoriesPosts() {
  const slugs = await fetchAllCategories();
  if (!slugs.length) {
    console.warn("Không có category để load bài viết");
    return [];
  }

  const posts = await loadPostToSwiper(slugs);
  allPosts = posts;
  console.log(posts);
  return posts;
}

export async function loadRandomVerticalPosts() {
    console.log("DOM sau khi chèn sidebar:", document.getElementById("sidebar-placeholder").innerHTML);
    console.log("Tìm random-posts:", document.getElementById("random-posts"));
  if (allPosts.length === 0) {
    allPosts = await loadAllCategoriesPosts();
    console.log(allPosts);
  }

  const pickedPosts = shuffleAndPick(allPosts, 4);
  renderVerticalPosts(pickedPosts);
}

document.addEventListener("DOMContentLoaded", async () => {
  await renderVerticalPosts();
  
});
