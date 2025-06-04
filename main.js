let allProducts = [];
let currentFilteredProducts = [];
let productsToShow = 30;

async function fetchProducts() {
    try {
        const res = await fetch('https://dummyjson.com/products?limit=194');
        const data = await res.json();
        allProducts = data.products;
        currentFilteredProducts = allProducts;
        displayProducts(currentFilteredProducts);
    } catch (error) {
        console.error('Lỗi lấy sản phẩm:', error);
    }
}

function displayProducts(products) {
    const list = document.getElementById('productList');
    const noResults = document.getElementById('noResults');
    const btnLoadMore = document.getElementById('btnLoadMore');
    list.innerHTML = '';

    if (products.length === 0) {
        noResults.style.display = 'block';
        btnLoadMore.style.display = 'none';
        return;
    } else {
        noResults.style.display = 'none';
    }

    const productsToDisplay = products.slice(0, productsToShow);

    productsToDisplay.forEach(product => {
        const div = document.createElement('div');
        div.className = 'product';
        div.innerHTML = `
          <a href="product.html?id=${product.id}" style="color: inherit; text-decoration:none;">
            <img src="${product.thumbnail}" alt="${product.title}" />
            <h4>${product.title}</h4>
          </a>
          <p>${product.price}$</p>
        `;
        list.appendChild(div);
    });

    if (productsToShow < products.length) {
        btnLoadMore.style.display = 'inline-block';
    } else {
        btnLoadMore.style.display = 'none';
    }
}

async function filterAndSearchProducts() {
    const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
    const maxPrice = parseFloat(document.getElementById('maxPrice').value) || Infinity;
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();

    let filtered = allProducts;

    filtered = filtered.filter(p => p.price >= minPrice && p.price <= maxPrice);

    if (searchQuery) {
        filtered = filtered.filter(p => p.title.toLowerCase().includes(searchQuery));
    }

    filtered.sort((a, b) => a.price - b.price);

    currentFilteredProducts = filtered;
    productsToShow = 30; // reset số sản phẩm mỗi lần lọc
    displayProducts(currentFilteredProducts);
}

document.addEventListener("DOMContentLoaded", () => {
    fetchCategories();
    fetchProducts();

    document
        .getElementById("categorySelect")
        .addEventListener("change", filterAndSearchProducts);
    document
        .getElementById("minPrice")
        .addEventListener("change", filterAndSearchProducts);
    document
        .getElementById("maxPrice")
        .addEventListener("change", filterAndSearchProducts);
    document
        .getElementById("btnSearch")
        .addEventListener("click", filterAndSearchProducts);
    document
        .getElementById("searchInput")
        .addEventListener("keyup", (e) => {
            if (e.key === "Enter") filterAndSearchProducts();
        });

    // Nút Xem thêm
    document.getElementById("btnLoadMore").addEventListener("click", () => {
        productsToShow += 20;
        displayProducts(currentFilteredProducts);
    });

    // Bấm vào sitetitle reload trang
    document.getElementById("siteTitle").addEventListener("click", () => {
        location.reload(); // reload trang hiện tại
    });

    document.getElementById("btnViewCart").addEventListener("click", () => {
        window.location.href = "cart.html"; // dẫn tới trang giỏ hàng
    });
});

function fetchCategories() {
    const categories = [
        {slug: "beauty", tên: "Vẻ đẹp"},
        {slug: "fragrances", tên: "Hương thơm"},
        {slug: "furniture", tên: "Đồ nội thất"},
        {slug: "groceries", tên: "Hàng tạp hóa"},
        {slug: "home-decoration", tên: "Trang trí nhà cửa"},
        {slug: "kitchen-accessories", tên: "Phụ kiện nhà bếp"},
        {slug: "laptops", tên: "Máy tính xách tay"},
        {slug: "mens-shirts", tên: "Áo sơ mi nam"},
        {slug: "mens-shoes", tên: "Giày nam"},
        {slug: "mens-watches", tên: "Đồng hồ nam"},
        {slug: "mobile-accessories", tên: "Phụ kiện di động"},
        {slug: "motorcycle", tên: "Xe máy"},
        {slug: "skin-care", tên: "Chăm sóc da"},
        {slug: "smartphones", tên: "Điện thoại thông minh"},
        {slug: "sports-accessories", tên: "Phụ kiện thể thao"},
        {slug: "sunglasses", tên: "Kính râm"},
        {slug: "tablets", tên: "Máy tính bảng"},
        {slug: "tops", tên: "Áo nữ"},
        {slug: "vehicle", tên: "Xe"},
        {slug: "womens-bags", tên: "Túi xách nữ"},
        {slug: "womens-dresses", tên: "Váy nữ"},
        {slug: "womens-jewellery", tên: "Trang sức nữ"},
        {slug: "womens-shoes", tên: "Giày nữ"},
        {slug: "womens-watches", tên: "Đồng hồ nữ"},
    ];

    const categorySelect = document.getElementById("categorySelect");

    categories.forEach((cat) => {
        const option = document.createElement("option");
        option.value = cat.slug;
        option.textContent = cat.tên;
        categorySelect.appendChild(option);
    });
}