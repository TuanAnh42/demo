// Biến lưu rating được chọn
let selectedRating = 0;

// Toggle form review
function toggleForm() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("กรุณาเข้าสู่ระบบก่อนส่งรีวิว");
        return;
    }

    const form = document.getElementById('review-form');
    form.style.display = (form.style.display === 'none' || form.style.display === '') ? 'block' : 'none';
}

// Hàm giải mã JWT token (nếu token dạng JWT)
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        return {};
    }
}

// Gán sự kiện sao đánh giá
function loadstar() {
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
}

document.addEventListener("DOMContentLoaded", function () {
    loadstar();

    const submitBtn = document.querySelector(".button-star");

    submitBtn.addEventListener("click", async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("กรุณาเข้าสู่ระบบก่อนส่งรีวิว");
            return;
        }

        const userInfo = parseJwt(token);
        const name = userInfo.name || "";
        const email = userInfo.email || "";

        const content = document.getElementById("review-content").value.trim();

        if (!content || selectedRating === 0) {
            alert("กรุณากรอกรีวิว และให้คะแนน");
            return;
        }

        const fullContent = `⭐ ${selectedRating}\n${content}`;

        try {
            const res = await fetch("https://up5sure.com/up5_wp/wp-json/wp/v2/comments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    post: 123,
                    author_name: name,
                    author_email: email,
                    content: fullContent
                })
            });

            // Kiểm tra res có tồn tại và trạng thái HTTP
            if (!res) {
                throw new Error("No response from server");
            }

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const result = await res.json();
            console.log("Đã gửi:", result);
            alert("ขอบคุณสำหรับรีวิวของคุณ!");
            document.getElementById("review-form").style.display = "none";

        } catch (err) {
            console.error("เกิดข้อผิดพลาด:", err);
            alert("ส่งรีวิวไม่สำเร็จ กรุณาลองใหม่");
        }

    });
});
