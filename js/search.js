const pagesToSearch = [
    { url: "daday.html", type: "article" },
    { url: "daitrang.html", type: "article" },
    { url: "tieuhoa.html", type: "article" },
    { url: "product.html", type: "product" }
];

let allSearchItems = [];

async function loadAllSearchData() {
    // Ví dụ bạn có JSON data tương ứng với mỗi trang để load:
    // Nếu không có file JSON, bạn phải parse HTML hoặc có dữ liệu khác
    allSearchItems = [];

    for (const page of pagesToSearch) {
        try {
            const response = await fetch(page.url);
            const text = await response.text();

            // Ví dụ giả định trong file HTML có chứa dữ liệu dạng JSON trong thẻ <script id="data-json">...
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, "text/html");
            const script = doc.querySelector("#data-json");
            if (script) {
                const items = JSON.parse(script.textContent);
                items.forEach(item => {
                    allSearchItems.push({
                        name: item.name,
                        img: item.img,
                        url: page.url + "#" + (item.anchor || ""), // hoặc đường dẫn tùy bạn
                        type: page.type
                    });
                });
            }
        } catch (err) {
            console.error("Failed to load data from", page.url, err);
        }
    }
}

function searchItems(keyword) {
    keyword = keyword.toLowerCase();
    return allSearchItems.filter(item =>
        item.name.toLowerCase().includes(keyword)
    );
}

function showResults(results) {
    const searchResults = document.getElementById("searchResults");
    searchResults.innerHTML = "";
    if (results.length === 0) {
        searchResults.innerHTML = "<div style='padding:8px;'>ไม่พบข้อมูล</div>";
    } else {
        results.forEach(item => {
            const div = document.createElement("div");
            div.classList.add("result-item");
            div.innerHTML = `
                <img src="${item.img}" alt="thumb">
                <div>
                    <div class="title">${item.name}</div>
                    <div class="type">(${item.type})</div>
                </div>
            `;
            div.addEventListener("click", () => {
                window.location.href = item.url;
            });
            searchResults.appendChild(div);
        });
    }
    searchResults.style.display = "block";
}

document.addEventListener("DOMContentLoaded", async () => {
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    const searchResults = document.getElementById("searchResults");

    if (!searchInput || !searchBtn || !searchResults) {
        console.warn("Search elements not found on this page");
        return;
    }

    await loadAllSearchData();

    searchInput.addEventListener("input", () => {
        const keyword = searchInput.value.trim();
        if (keyword.length > 0) {
            const results = searchItems(keyword);
            showResults(results);
        } else {
            searchResults.style.display = "none";
        }
    });

    searchBtn.addEventListener("click", () => {
        const keyword = searchInput.value.trim();
        if (keyword) {
            window.location.href = "search.html?q=" + encodeURIComponent(keyword);
        }
    });

    searchInput.addEventListener("keypress", e => {
        if (e.key === "Enter") {
            searchBtn.click();
        }
    });
});
