export function showLoginForm() {
    loadOverlayForm("login", "frontend/login.html", "loginContact", setupLoginHandler);
}

export function showRegisterForm() {
    loadOverlayForm("register", "frontend/register.html", "registerContact", setupRegisterHandler);
}

function loadOverlayForm(type, path, formId, setupCallback) {
    let overlay = document.getElementById("loginOverlay");

    // Nếu overlay chưa có thì tạo mới
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "loginOverlay";
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100vw";
        overlay.style.height = "100vh";
        overlay.style.background = "rgba(0,0,0,0.5)";
        overlay.style.display = "flex";
        overlay.style.alignItems = "center";
        overlay.style.justifyContent = "center";
        overlay.style.zIndex = "9999";
        document.body.appendChild(overlay);
    }




    // Luôn tải lại nội dung mới (dù overlay đã hiển thị)
    fetch(path)
        .then(res => res.text())
        .then(html => {
            overlay.innerHTML = `
                <div id="${type}Form">${html}</div>
            `;

            setupCallback();

            overlay.style.display = "flex";

            // Click ngoài form thì đóng
            overlay.onclick = function (e) {
                const popup = overlay.querySelector("form")?.closest("div");
                if (!popup || !popup.contains(e.target)) {
                    overlay.style.display = "none";
                }
            };

        })
        .catch(err => console.error(`❌ Lỗi khi tải ${type}:`, err));
}
// Đặt đoạn này trong file JS load đầu trang
const params = new URLSearchParams(window.location.search);
const token = params.get('token');
if (token) {
    localStorage.setItem('token', token);
    window.history.replaceState({}, document.title, window.location.pathname);
    updateMenuAfterLogin();
    console.log('Token JWT đã lưu localStorage');
}


function setupLoginHandler() {
    document.getElementById("loginContact").addEventListener("submit", async function (e) {
        e.preventDefault();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        const res = await fetch("https://up5sure.com/wp-json/jwt-auth/v1/token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: email, password })  // chú ý đổi email thành username
        });

        const data = await res.json();
        if (res.ok && data.token) {
            alert("✅ Login Success!");
            localStorage.setItem("token", data.token);
            const userRole = data.user_role || "subscriber";
            const usernameDisplay = data.user_display_name || data.user_nicename || email;

            localStorage.setItem("user", JSON.stringify({
                name: usernameDisplay,
                email: data.user_email || email,
                role: userRole
                // Lưu role nếu cần

            }));
             await loginAndRedirect(email, password);
            console.log(data);
            document.getElementById("loginOverlay").style.display = "none";
            updateMenuAfterLogin(usernameDisplay); // Cập nhật menu sau khi đăng nhập

        } else {
            alert("❌ Đăng nhập thất bại: " + (data.message || "Đã xảy ra lỗi"));
        }
    });
}


function setupRegisterHandler() {
    document.getElementById("registerContact").addEventListener("submit", async function (e) {
        e.preventDefault();
        const name = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirm_password").value.trim();
        // console.log('name:', name);
        if (password !== confirmPassword) {
            alert("❌ Mật khẩu không khớp");
            return;
        }


        const res = await fetch("https://up5sure.com/wp-json/custom/v1/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: name,
                email,
                password,
                password_confirmation: confirmPassword
            })
        });

        const data = await res.json();
        if (res.ok) {
            alert("✅ Đăng ký thành công! Đang đăng nhập tự động...");
            // Sau khi đăng ký thành công, gọi tiếp login để lấy token
            loginAfterRegister(name, password);
        } else {
            alert("❌ Đăng ký thất bại: " + (data.message || "Đã xảy ra lỗi"));
        }
    });
}

async function loginAfterRegister(username, password) {
    const res = await fetch("https://up5sure.com/wp-json/jwt-auth/v1/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (res.ok && data.token) {
        const usernameDisplay = data.user_display_name || data.user_nicename || username;

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify({
            name: usernameDisplay,
            email: data.user_email || username
        }));

        document.getElementById("loginOverlay").style.display = "none";
        updateMenuAfterLogin(usernameDisplay); // Cập nhật menu sau khi đăng ký
    } else {
        alert("❌ Đăng nhập sau khi đăng ký thất bại.");
    }
}

async function loginAndRedirect(username, password) {
    // 1. Gọi lấy token JWT (bạn đã có đoạn này rồi)
    const tokenRes = await fetch("https://up5sure.com/wp-json/jwt-auth/v1/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.token) {
        alert("Đăng nhập thất bại: " + (tokenData.message || "Lỗi"));
        return;
    }

    localStorage.setItem("token", tokenData.token);

    // 2. Gọi API tạo session login WordPress (cookie)
    const sessionRes = await fetch("https://up5sure.com/wp-json/custom/v1/login-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // bắt buộc để gửi cookie
        body: JSON.stringify({ username, password })
    });

    if (!sessionRes.ok) {
        alert("Không thể tạo session đăng nhập WP");
        return;
    }

    // 3. Redirect sang WP admin
    window.location.href = "https://up5sure.com/wp-admin";
}

export function updateMenuAfterLogin(username) {
    const menu = document.getElementById("accountDropdown");
    if (!menu) return;

    menu.innerHTML = `
        <div class="dropdown-account-menu">
            <button class="dropdown-toggle-account" id="userMenuBtn">
                สวัสดี, <strong>${username}</strong> ▼
            </button>
            <div class="dropdown-menu-account" id="userMenuList">
                <a href="profile.html">📄 ข้อมูลส่วนบุคคล</a>
                <a href="post-form.html">📝 บทความของฉัน</a>
                <a href="#" id="logoutMenu">🚪 ออกจากระบบ</a>
            </div>
        </div>
    `;

    // Toggle hiển thị menu khi bấm
    const btn = document.getElementById("userMenuBtn");
    const list = document.getElementById("userMenuList");
    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        list.classList.toggle("show");
    });

    // Ẩn menu khi click ra ngoài
    document.addEventListener("click", () => {
        list.classList.remove("show");
    });

    // Xử lý đăng xuất
    document.getElementById("logoutMenu").addEventListener("click", (e) => {
        e.preventDefault();
        logoutUser();
    });
}
async function handleGoogleLogin(googleToken) {
    // Gửi token Google lên backend WP lấy JWT token của bạn
    const res = await fetch("https://up5sure.com/wp-json/custom/v1/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: googleToken })
    });
    const data = await res.json();

    if (res.ok && data.token) {
        localStorage.setItem("token", data.token);

        const usernameDisplay = data.user_display_name || data.user_nicename || "User";

        localStorage.setItem("user", JSON.stringify({
            name: usernameDisplay,
            email: data.user_email || ""
        }));

        document.getElementById("loginOverlay").style.display = "none";
        updateMenuAfterLogin(usernameDisplay);
    } else {
        console.error("Google login failed:", data);
        alert("❌ Đăng nhập Google thất bại. Vui lòng thử lại.");


    }
}

async function fetchUserInfo(token) {
    try {
        const res = await fetch('https://up5sure.com/wp-json/custom/v1/userinfo', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!res.ok) throw new Error('Không lấy được user');
        const data = await res.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function renderInfo() {
    const tokenObj = localStorage.getItem("token") || '{}';


    if (!tokenObj) {
        console.log("Chưa đăng nhập hoặc chưa có token");
        return;
    }

    const user = await fetchUserInfo(tokenObj);

    if (!user) {
        console.log("Lấy thông tin user thất bại");
        return;
    }

    // Hiển thị thông tin user lên UI
    const userName = document.getElementById("name");
    const userEmail = document.getElementById("email");
    const userPhone = document.getElementById("phone");
    const userAddress = document.getElementById("address");
    const userNote = document.getElementById("note");

    if (userName) userName.textContent = user.name || "";
    if (userEmail) userEmail.textContent = user.email || "";
    if (userPhone) userPhone.textContent = user.phone || "";
    if (userAddress) userAddress.textContent = user.address || "";
    if (userNote) userNote.textContent = user.note || "";

    // Nút sửa
    document.getElementById('editBtn').addEventListener('click', () => {
        document.getElementById('display-info').style.display = 'none';
        document.getElementById('editForm').style.display = 'block';

        document.getElementById('editName').value = user.name || '';
        document.getElementById('editPhone').value = user.phone || '';
        document.getElementById('editEmail').value = user.email || '';
        document.getElementById('editAddress').value = user.address || '';
        document.getElementById('editNote').value = user.note || '';
    });

    // Hủy sửa
    document.getElementById('cancelBtn').addEventListener('click', () => {
        document.getElementById('editForm').style.display = 'none';
        document.getElementById('display-info').style.display = 'block';
    });

    // Lưu thông tin
    document.getElementById('editForm').addEventListener('submit', async e => {
        e.preventDefault();

        // Lấy dữ liệu mới từ form
        const updatedUser = {
            name: document.getElementById('editName').value.trim(),
            phone: document.getElementById('editPhone').value.trim(),
            email: document.getElementById('editEmail').value.trim(),
            address: document.getElementById('editAddress').value.trim(),
            note: document.getElementById('editNote').value.trim()
        };

        // Gửi update lên server (bạn cần tạo API cập nhật thông tin user)
        // Ví dụ:
        // await updateUserInfo(token, updatedUser);

        // Tạm thời cập nhật local UI
        if (userName) userName.textContent = updatedUser.name || "";
        if (userEmail) userEmail.textContent = updatedUser.email || "";
        if (userPhone) userPhone.textContent = updatedUser.phone || "";
        if (userAddress) userAddress.textContent = updatedUser.address || "";
        if (userNote) userNote.textContent = updatedUser.note || "";

        // Ẩn form, hiện info
        document.getElementById('editForm').style.display = 'none';
        document.getElementById('display-info').style.display = 'block';
    });
}



document.addEventListener("DOMContentLoaded", () => {
    renderInfo();
   

});

function logoutUser() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    location.reload(); // Tải lại trang để cập nhật menu
    // hoặc gọi updateMenuBeforeLogin() để phục hồi menu đăng nhập
}


function closeLoginForm() {
    const overlay = document.getElementById("loginOverlay");
    if (overlay) overlay.style.display = "none";

}

export function closeRegisterForm() {
    closeLoginForm(); // dùng chung logic
}


// function showLoginForm() {
//   alert("Hiển thị form đăng nhập");
// }

// function showRegisterForm() {
//   alert("Hiển thị form đăng ký");
// }

document.getElementById('loginBtn').addEventListener('click', (e) => {
  e.preventDefault();
  showLoginForm();
});

document.getElementById('registerBtn').addEventListener('click', (e) => {
  e.preventDefault();
  showRegisterForm();
});
