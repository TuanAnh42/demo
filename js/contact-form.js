document.getElementById("contactForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    let formData = {
        name: document.getElementById("name").value,
        phone: document.getElementById("phone").value,
        address: document.getElementById("address").value,
        message: document.getElementById("message").value
    };

    try {
        let res = await fetch("https://up5sure.com/wp-json/custom/v1/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        let data = await res.json();
        if (res.ok) {
            alert("ส่งข้อมูลเรียบร้อยแล้ว!");
            console.log("Response data:", data);
            document.getElementById("contactForm").reset();

            // ✅ Gọi mã chuyển đổi Google Ads
            gtag('event', 'conversion', {
                'send_to': 'AW-17065536140/TLKoCMCkp_8aEIzVvck_' // ← thay bằng mã thật
            });

            // ✅ Chờ 300ms để đảm bảo tracking được gửi
            setTimeout(() => {
                window.location.href = "frontend/thankyou.html?source=form";
            }, 300);
        

        // Redirect to home page

        alert(data.message || "เกิดข้อผิดพลาด");
    }
    } catch (err) {
    alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์");
}
});