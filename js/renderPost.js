
function getCategorySlug() {
    return document.body.getAttribute('data-slug');
}

function getCategorySlugFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('slug');
}

async function fetchCategoryBySlug(slug) {
    const categories = await fetchCategories();
    return categories.find(cat => cat.slug === slug);
}

async function fetchCategories() {
    const res = await fetch('https://up5sure.com/wp-json/wp/v2/categories');
    if (!res.ok) throw new Error('Lỗi tải categories');
    return await res.json();
}

async function fetchPostsByCategory(catId) {
    const res = await fetch(`https://up5sure.com/wp-json/wp/v2/posts?categories=${catId}&_embed`);
    if (!res.ok) throw new Error(`Lỗi tải bài viết của category ${catId}`);
    return await res.json();
}

async function loadPostsGroupedByCategory() {
    const container = document.getElementById('posts-by-category');
    container.innerHTML = '';

    try {
        const categories = await fetchCategories();
        const postPromises = categories.map(cat => fetchPostsByCategory(cat.id));
        const postsByCategory = await Promise.all(postPromises);


        for (let i = 0; i < categories.length; i++) {
            const category = categories[i];
            const posts = postsByCategory[i];

            // Tạo tiêu đề đề mục
            const categoryTitle = document.createElement('div');
            categoryTitle.classList.add('section-title');
            categoryTitle.textContent = category.name;
            container.appendChild(categoryTitle);

            // Tạo div section chứa bài viết theo category
            const sectionDiv = document.createElement('div');
            sectionDiv.classList.add('section');

            // Tạo div post-grid như mẫu
            const postGrid = document.createElement('div');
            postGrid.classList.add('post-grid');

            if (posts.length === 0) {
                const noPostMsg = document.createElement('p');
                noPostMsg.textContent = 'Chưa có bài viết nào trong mục này.';
                postGrid.appendChild(noPostMsg);
            } else {
                posts.forEach(post => {
                    if (!post.categories.includes(category.id)) return;
                    const thumb = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'img/placeholder.png';

                    const postCard = document.createElement('div');
                    postCard.classList.add('post-card');

                    postCard.innerHTML = `
        <a href="daday.html?id=${post.id}&slug=${category.slug}">


          <img src="${thumb}" alt="${post.title.rendered}">
          <div class="post-content">
            <h3>${post.title.rendered}</h3>
            <p>${post.excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, "")}</p>
          </div>
        </a>
      `;

                    postGrid.appendChild(postCard);
                });
            }

            sectionDiv.appendChild(postGrid);
            container.appendChild(sectionDiv);


        }
    } catch (error) {
        console.error(error);
        container.innerHTML = '<p>Không tải được bài viết.</p>';
    }
}
function decodeHTMLEntities(str) {
    const txt = document.createElement('textarea');
    txt.innerHTML = str;
    return txt.value;
}

// Lấy ID từ URL
function getPostIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Fetch bài viết theo ID
async function fetchPostById(postId) {
    const res = await fetch(`https://up5sure.com/wp-json/wp/v2/posts/${postId}?_embed`);
    if (!res.ok) throw new Error('Không thể tải bài viết');
    return await res.json();
}

async function renderPostDetail() {
    const postId = getPostIdFromURL();
    const slug = getCategorySlugFromURL();

    if (!postId) {
        document.getElementById('post-content').innerHTML = '<p>Không tìm thấy bài viết.</p>';
        return;
    }

    try {
        const post = await fetchPostById(postId);
        document.getElementById('post-title').textContent = decodeHTMLEntities(post.title.rendered);
        document.getElementById('post-date').textContent = new Date(post.date).toLocaleDateString('vi-VN');
        document.getElementById('post-content').innerHTML = post.content.rendered;

        // Nếu có slug → hiển thị tên chuyên mục
        if (slug) {
            const category = await fetchCategoryBySlug(slug);
            if (category) {
                const categoryTitle = document.getElementById('post-category');
                if (categoryTitle) {
                    categoryTitle.textContent = category.name;
                }
            }
        }
    } catch (error) {
        console.error(error);
        document.getElementById('post-content').innerHTML = '<p>Lỗi khi hiển thị bài viết.</p>';
    }
}




async function loadPostsBySlug(slug) {
    const container = document.getElementById('posts-by-category');
    container.innerHTML = '';

    try {
        const category = await fetchCategoryBySlug(slug);
        if (!category) {
            container.innerHTML = '<p>Chuyên mục không tồn tại.</p>';
            return;
        }

        const posts = await fetchPostsByCategory(category.id);

        const categoryTitle = document.createElement('div');
        categoryTitle.classList.add('section-title');
        categoryTitle.textContent = category.name;
        container.appendChild(categoryTitle);

        const sectionDiv = document.createElement('div');
        sectionDiv.classList.add('section');

        const postGrid = document.createElement('div');
        postGrid.classList.add('post-grid');

        if (posts.length === 0) {
            const noPostMsg = document.createElement('p');
            noPostMsg.textContent = 'Chưa có bài viết nào trong mục này.';
            postGrid.appendChild(noPostMsg);
        } else {
            posts.forEach(post => {
                if (!post.categories.includes(category.id)) return;
                const thumb = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'img/placeholder.png';

                const postCard = document.createElement('div');
                postCard.classList.add('post-card');

                postCard.innerHTML = `
          <a href="daday_patical1.html?id=${post.id}&slug=${category.slug}">


            <img src="${thumb}" alt="${post.title.rendered}">
            <div class="post-content">
              <h3>${post.title.rendered}</h3>
              <p>${post.excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, "")}</p>
            </div>
          </a>
        `;

                postGrid.appendChild(postCard);
            });
        }

        sectionDiv.appendChild(postGrid);
        container.appendChild(sectionDiv);

    } catch (error) {
        console.error(error);
        container.innerHTML = '<p>Lỗi khi tải bài viết.</p>';
    }
}


document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('posts-by-category');

    // Tạo menu chuyên mục
    try {
        const categories = await fetchCategories();
        categories.forEach(cat => {
            const link = document.createElement("a");
            link.classList.add("category-link");
            link.textContent = cat.name;
            link.setAttribute("data-slug", cat.slug);
            link.href = "#";
            document.querySelector(".category-menu").appendChild(link);
        });

        // Gắn sự kiện click để thêm slug vào URL
        document.querySelectorAll('.category-link').forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const slug = this.getAttribute('data-slug');
                const newUrl = `daday.html?slug=${encodeURIComponent(slug)}`;

                window.location.href = newUrl;
            });
        });
    } catch (error) {
        console.error("Lỗi khi tải chuyên mục:", error);
    }

    // Hiển thị bài viết theo slug
    if (container) {
        const slugFromURL = getCategorySlugFromURL();
        const slugFromBody = getCategorySlug();
        const slug = slugFromURL || slugFromBody;

        if (slug) {
            loadPostsBySlug(slug);
        } else {
            loadPostsGroupedByCategory();
        }
    }

    // Trang chi tiết
    if (document.getElementById('post-content')) {
        renderPostDetail();
    }
});



