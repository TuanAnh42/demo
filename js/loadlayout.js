// Bản đồ breadcrumb
import { loadRandomVerticalPosts } from './loadPost.js';
import { updateCartIcon } from './cart.js';
import { updateMenuAfterLogin } from './user.js';
const breadcrumbMap = {

    '/product.html': [
        { name: 'หน้าแรก', url: 'index.html' },
        { name: 'ผลิตภัณฑ์' }
    ],
    '/post-form.html': [
        { name: 'หน้าแรก', url: 'index.html' },
        { name: 'เขียนบทความ' }],
    '/profile.html': [
        { name: 'หน้าแรก', url: 'index.html' },
        { name: 'ข้อมูลส่วนบุคคล' }],
    '/about.html': [
        { name: 'หน้าแรก', url: 'index.html' },
        { name: ' เรื่องราวของ Up5', url: '#' },

    ],
    '/manufacture.html': [
        { name: 'หน้าแรก', url: 'index.html' },
        { name: 'การเดินทางการผลิต', url: '#' },

    ],
    '/quality.html': [
        { name: 'หน้าแรก', url: 'index.html' },
        { name: 'ความมุ่งมั่นด้านคุณภาพ', url: '#' },

    ],
    '/cart.html': [
        { name: 'หน้าแรก', url: 'index.html' },
        { name: 'รถเข็นรถเข็นช้อปปิ้ง' }
    ],
    '/checkout.html': [
        { name: 'หน้าแรก', url: 'index.html' },
        { name: 'จ่ายจ่ายเงิน' }
    ],

    '/daday.html': [
        { name: 'หน้าแรก', url: 'index.html' },
        { name: 'โรคกระเพาะอาหาร', url: '#' },

    ],
    '/daday_patical1.html': [
        { name: 'หน้าแรก', url: 'index.html' },
        { name: 'โรคกระเพาะอาหาร', url: 'daday.html' },
        { name: 'โรคกรดไหลย้อน - หลอดอาหาร: อาการและวิธีการรักษา' }

    ],
    '/daday_patical2.html': [
        { name: 'หน้าแรก', url: 'index.html' },
        { name: 'โรคกระเพาะอาหาร', url: 'daday.html' },
        { name: 'ปวดท้อง: อาการ สาเหตุและวิธีการจัดการ' }

    ],
    '/daitrang.html': [
        { name: 'หน้าแรก', url: 'index.html' },
        { name: 'โรคลำไส้ใหญ่', url: '#' },

    ],
    '/daitrang_patical1.html': [
        { name: 'หน้าแรก', url: 'index.html' },
        { name: 'โรคลำไส้ใหญ่', url: 'daitrang.html' },
        { name: 'โรคลำไส้ใหญ่บวม – โรคที่พบได้บ่อยแต่มักถูกมองข้าม' }

    ],
    '/daitrang_patical2.html': [
        { name: 'หน้าแรก', url: 'index.html' },
        { name: 'โรคลำไส้ใหญ่', url: 'daitrang.html' },
        { name: 'กลุ่มอาการลำไส้แปรปรวน (IBS) – โรคเรื้อรังที่ไม่เกิดจากเชื้อแบคทีเรีย' }

    ],
    '/daitrang_patical3.html': [
        { name: 'หน้าแรก', url: 'index.html' },
        { name: 'โรคลำไส้ใหญ่', url: 'daitrang.html' },
        { name: 'อาการท้องผูก – เมื่อการไปห้องน้ำกลายเป็นฝันร้าย' }

    ],

    '/tieuhoa.html': [
        { name: 'หน้าแรก', url: 'index.html' },
        { name: 'โรคระบบย่อยอาหารอื่นๆ', url: '#' },

    ],
    '/tieuhoa_patical1.html': [
        { name: 'หน้าแรก', url: 'index.html' },
        { name: 'โรคระบบย่อยอาหารอื่นๆ', url: 'tieuhoa.html' },
        { name: 'ปวดกระเพาะดื่มนมอะไรดี? แนะนำ 7 ชนิดนมช่วยบรรเทาอาการแสบท้อง' }

    ],
    '/tieuhoa_patical2.html': [
        { name: 'หน้าแรก', url: 'index.html' },
        { name: 'โรคระบบย่อยอาหารอื่นๆ', url: 'tieuhoa.html' },
        { name: 'ทำไมยิ่งกินยาโรคกระเพาะ อาการกลับยิ่งแย่ลง?' }

    ],
    '/tieuhoa_patical3.html': [
        { name: 'หน้าแรก', url: 'index.html' },
        { name: 'โรคระบบย่อยอาหารอื่นๆ', url: 'tieuhoa.html' },
        { name: '5 วิธีบรรเทาอาการปวดกระเพาะอาหารที่บ้านอย่าง รวดเร็วและได้ผลดีที่สุด' }

    ],
    '/tieuhoa_patical4.html': [
        { name: 'หน้าแรก', url: 'index.html' },
        { name: 'โรคระบบย่อยอาหารอื่นๆ', url: 'tieuhoa.html' },
        { name: 'Up5 – โซลูชันทางโภชนาการเพื่อการย่อยอาหาร อย่างครบวงจรจากสมุนไพรธรรมชาติ' }

    ],

    '/faq.html': [
        { name: 'หน้าแรก', url: 'index.html' },
        { name: 'FAQs' }
    ],
    '/index.html#content-form': [
        { name: 'หน้าแรก', url: 'index.html' },
        { name: 'ติดต่อเลย' }
    ]
};

window.addEventListener("DOMContentLoaded", async () => {
    await Promise.all([
        fetch("frontend/header.html")
            .then(res => res.text())
            .then(html => {
                document.getElementById("header-placeholder").innerHTML = html;
                const cart = JSON.parse(localStorage.getItem("cart")) || [];
                const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
                updateCartIcon(totalCount);
                const user = JSON.parse(localStorage.getItem("user"));
                updateMenuAfterLogin(user.name);

            }),
        fetch("frontend/breadcrumb.html")
            .then(res => res.text())
            .then(html => {
                document.getElementById("breadcrumb-placeholder").innerHTML = html;
                updatePageTitleAndBreadcrumb();
            }),
        fetch("frontend/menu.html")
            .then(res => res.text())
            .then(html => {
                document.getElementById("menu-placeholder").innerHTML = html;
            }),
        fetch("frontend/footer.html")
            .then(res => res.text())
            .then(html => {
                document.getElementById("footer-placeholder").innerHTML = html;
            }),
        fetch("frontend/sidebar.html")
            .then(res => res.text())
            .then(html => {
                document.getElementById("sidebar-placeholder").innerHTML = html;
                requestAnimationFrame(() => {
                    loadRandomVerticalPosts();
                    console.log("huhhu")
                }); // đợi 1 tick để DOM cập nhật
            })

    ]);
});

function updatePageTitleAndBreadcrumb() {
    const path = window.location.pathname.replace(/\/$/, '') || '/index.html'; // Chuẩn hóa đường dẫn
    const titleSection = document.querySelector('.dynamic-title-section');
    const breadcrumbContainer = document.getElementById('breadcrumb-title');


    const crumbs = breadcrumbMap[path];

    if (crumbs && breadcrumbContainer) {
        titleSection.style.display = 'block';
        let breadcrumbHTML = '';

        crumbs.forEach((item, index) => {
            if (index > 0) breadcrumbHTML += `<span> / </span>`;
            const isLast = index === crumbs.length - 1;

            if (!isLast && item.url) {
                breadcrumbHTML += `<a href="${item.url}" style="color:#1e1a5e; text-decoration:none">${item.name}</a>`;
            } else {
                breadcrumbHTML += `<span>${item.name}</span>`;
            }
        });

        breadcrumbContainer.innerHTML = breadcrumbHTML;

    }
}
