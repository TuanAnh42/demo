const WP_API_URL = '';
let JWT_TOKEN = localStorage.getItem("token") || null;

async function getToken(username, password) {
    const res = await fetch(`https://up5sure.com/wp-json/jwt-auth/v1/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    JWT_TOKEN = data.token;
}

async function loadCategoriesToSelect() {
    try {
        const res = await fetch(`https://up5sure.com/wp-json/wp/v2/categories`);
        const categories = await res.json();
        const select = document.getElementById('categories');
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Lỗi load danh mục:', error);
    }
}

// Upload ảnh lên WP
async function uploadImageToWordPress(file) {
    if (!file) {
        throw new Error('Không có file để tải lên');
    }
    console.log('File info:', file.name, file.size, file.type);

    let formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`https://up5sure.com/wp-json/wp/v2/media`, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + JWT_TOKEN
        },
        body: formData
    });

    if (!res.ok) {
        const errorData = await res.json();
        console.error('Error response:', errorData);
        throw new Error(`Lỗi tải ảnh lên: ${res.statusText} - ${errorData.message}`);
    }
    const data = await res.json();
    console.log('Ảnh đã tải lên:', data);
    return data;
}

// Tạo bài viết
async function createPost(title, content, descriptions, categories, thumbnailId ) {
    const res = await fetch(`https://up5sure.com/wp-json/wp/v2/posts`, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + JWT_TOKEN,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: title,
            content: content,
            excerpt: descriptions,
            categories: categories.map(id => parseInt(id)),
            featured_media: thumbnailId,
            status: 'pending'
        })
    });

    return await res.json();
}

// Khởi tạo TinyMCE
tinymce.init({
    selector: '#content',
    plugins: 'image link media table code lists',
    toolbar: 'undo redo | styleselect| fontselect |fontsizeselect| bold italic underline forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media | table | code',
    automatic_uploads: true,
    file_picker_types: 'image',
    file_picker_callback: function (callback, value, meta) {
        if (meta.filetype === 'image') {
            let input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = async function () {
                let file = this.files[0];
                const uploaded = await uploadImageToWordPress(file);
                callback(uploaded.source_url, { alt: file.name });
            };
            input.click();
        }
    }
});

// Preview thumbnail
document.getElementById('thumbnail').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (ev) {
            const img = document.getElementById('thumb-preview');
            img.src = ev.target.result;
            img.style.display = 'block';
        }
        reader.readAsDataURL(file);
    }
});

function convertImageToJPEG(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.onload = function () {
                const canvas = document.createElement('canvas');

                // Giới hạn kích thước max (ví dụ 1024 x 1024)
                const MAX_WIDTH = 1024;
                const MAX_HEIGHT = 1024;

                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(blob => {
                    const jpegFile = new File([blob], file.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' });
                    console.log('File sau khi convert:', jpegFile.name, jpegFile.size, jpegFile.type);
                    resolve(jpegFile);
                }, 'image/jpeg', 0.95);
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

window.addEventListener('DOMContentLoaded', () => {
    loadCategoriesToSelect();
});

// Submit post
document.getElementById('submitPost').addEventListener('click', async function () {
    const title = document.getElementById('title').value;
    const content = tinymce.get('content').getContent();
    const descriptions = document.getElementById('descriptions').value;
    const thumbFile = document.getElementById('thumbnail').files[0];
    const categories = Array.from(document.getElementById('categories').selectedOptions).map(opt => opt.value);


    // Upload thumbnail
    const jpegFile = await convertImageToJPEG(thumbFile);


    const uploadedThumb = await uploadImageToWordPress(jpegFile);
    
    // Tạo bài viết
    const post = await createPost(title, content, descriptions, categories, uploadedThumb.id);
    if (post.id) {
        alert('Bài viết đã được tạo thành công!');
        // window.location.href = `post.html?id=${post.id}`;
    }

});
