window.addEventListener("DOMContentLoaded", () => {
    // Load contact.html
    fetch("frontend/contact.html")
        .then(res => res.text())
        .then(html => {
            document.getElementById("contact-placeholder").innerHTML = html;

            // Sau khi đã gắn xong HTML mới xử lý logic gọi điện
            const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
            const callLink = document.getElementById("smart-call-link");

            if (callLink) {
                if (isMobile) {
                    callLink.href = "tel:+66931587658";
                } else {
                    callLink.href = "https://web.skype.com/en/skypeuri/?call:+66931587658";
                    callLink.addEventListener("click", function (e) {
                        setTimeout(() => {
                            alert("หากคุณไม่มี Skype กรุณาโทรที่เบอร์: +66 93 158 7658");
                        }, 200);
                    });
                }
            }
        });
});
