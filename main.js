let allProducts = [];
let currentFilteredProducts = [];
let productsToShow = 30;

// Cập nhật số lượng sản phẩm trong giỏ hàng
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

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
        // Tính giảm giá nếu có
        const discountBadge = product.discountPercentage ? 
            `<span class="discount-badge">-${Math.round(product.discountPercentage)}%</span>` : '';

        // Hiển thị đánh giá
        const rating = product.rating ? 
            `<div class="rating">
                <span class="stars" style="--rating: ${product.rating};"></span>
                <span class="rating-text">${product.rating}/5</span>
            </div>` : '';

        const div = document.createElement('div');
        div.className = 'product';
        div.innerHTML = `
          <div class="product-image">
            ${discountBadge}
            <a href="product.html?id=${product.id}">
              <img src="${product.thumbnail}" alt="${product.title}" />
            </a>
            <div class="product-actions">
              <button class="quick-view" data-id="${product.id}"><i class="fas fa-eye"></i></button>
              <button class="add-to-cart" data-id="${product.id}"><i class="fas fa-shopping-cart"></i></button>
            </div>
          </div>
          <div class="product-info">
            <a href="product.html?id=${product.id}">
              <h4>${product.title}</h4>
            </a>
            ${rating}
            <p>${product.price}$</p>
          </div>
        `;
        list.appendChild(div);
    });

    // Thêm event listeners cho các nút trong sản phẩm
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = button.getAttribute('data-id');
            addToCartFromList(productId);
        });
    });

    if (productsToShow < products.length) {
        btnLoadMore.style.display = 'inline-block';
    } else {
        btnLoadMore.style.display = 'none';
    }
}

// Thêm sản phẩm vào giỏ hàng từ danh sách sản phẩm
function addToCartFromList(productId) {
    const product = allProducts.find(p => p.id == productId);
    if (!product) return;

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const index = cart.findIndex(item => item.id === product.id);

    if (index > -1) {
        cart[index].quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();

    // Hiển thị thông báo
    showNotification('Đã thêm sản phẩm vào giỏ hàng!');
}

// Hiển thị thông báo
function showNotification(message) {
    // Kiểm tra xem đã có thông báo nào chưa
    let notification = document.querySelector('.notification');

    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
    }

    notification.textContent = message;
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

async function filterAndSearchProducts() {
    const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
    const maxPrice = parseFloat(document.getElementById('maxPrice').value) || Infinity;
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    const selectedCategory = document.getElementById('categorySelect').value;

    let filtered = allProducts;

    filtered = filtered.filter(p => p.price >= minPrice && p.price <= maxPrice);

    if (searchQuery) {
        filtered = filtered.filter(p => p.title.toLowerCase().includes(searchQuery));
    }

    if (selectedCategory) {
        filtered = filtered.filter(p => 
            p.category === selectedCategory
        );
    }

    filtered.sort((a, b) => a.price - b.price);

    currentFilteredProducts = filtered;
    productsToShow = 30; // reset số sản phẩm mỗi lần lọc
    displayProducts(currentFilteredProducts);
}

document.addEventListener("DOMContentLoaded", () => {
    fetchCategories();
    fetchProducts();
    updateCartCount();

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

    document.getElementById("btnViewCart").addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "cart.html"; // dẫn tới trang giỏ hàng
    });

    // Thêm CSS cho thông báo
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: var(--primary-color);
            color: white;
            padding: 15px 25px;
            border-radius: 4px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 1000;
        }
        .notification.show {
            transform: translateY(0);
            opacity: 1;
        }
        .product-image {
            position: relative;
            overflow: hidden;
        }
        .discount-badge {
            position: absolute;
            top: 10px;
            left: 10px;
            background-color: var(--primary-color);
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 1;
        }
        .product-actions {
            position: absolute;
            bottom: -50px;
            left: 0;
            right: 0;
            display: flex;
            justify-content: center;
            gap: 10px;
            transition: all 0.3s ease;
            background: rgba(255,255,255,0.9);
            padding: 10px 0;
        }
        .product:hover .product-actions {
            bottom: 0;
        }
        .product-actions button {
            width: 35px;
            height: 35px;
            border-radius: 50%;
            background-color: white;
            color: var(--text-color);
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid var(--border-color);
            transition: all 0.3s ease;
        }
        .product-actions button:hover {
            background-color: var(--primary-color);
            color: white;
            transform: translateY(-3px);
        }
        .rating {
            display: flex;
            align-items: center;
            margin: 5px 0;
            padding: 0 15px;
        }
        .stars {
            --percent: calc(var(--rating) / 5 * 100%);
            display: inline-block;
            font-size: 0.9rem;
            font-family: Times;
            line-height: 1;
        }
        .stars::before {
            content: '★★★★★';
            letter-spacing: 3px;
            background: linear-gradient(90deg, #ffc107 var(--percent), #e0e0e0 var(--percent));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .rating-text {
            margin-left: 5px;
            color: var(--light-text);
            font-size: 0.8rem;
        }
    `;
    document.head.appendChild(style);
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
