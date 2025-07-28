window.addEventListener("DOMContentLoaded", async () => {
    fetch("frontend/header.html")
        .then(res => res.text())
        .then(html => {
            document.getElementById("header-placeholder").innerHTML = html;
            function getCart() { return JSON.parse(localStorage.getItem("cart")) || []; }
            
                const cart = getCart();
                const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
                updateCartIcon(totalCount);
               
            });

    fetch("frontend/menu.html")
        .then(res => res.text())
        .then(html => {
            document.getElementById("menu-placeholder").innerHTML = html;
        });
    //nhúng footer
    fetch("frontend/footer.html")
        .then(res => res.text())
        .then(html => {
            document.getElementById("footer-placeholder").innerHTML = html
        })
    fetch("frontend/sidebar.html")
        .then(res => res.text())
        .then(html => {
            document.getElementById("sidebar-placeholder").innerHTML = html
            loadRandomVerticalPosts();
        });

});