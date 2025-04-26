// Biến toàn cục
let products = [];
let cart = [];
let categories = [];

// DOM Elements
const productsContainer = document.getElementById('products');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items');
const totalPriceElement = document.getElementById('total-price');
const cartCountElement = document.getElementById('cart-count');
const closeBtn = document.querySelector('.close-btn');

// Hàm khởi tạo
async function init() {
    await fetchProducts();
    await fetchCategories();
    renderProducts(products);
    setupEventListeners();
}

// Lấy danh sách sản phẩm từ API
async function fetchProducts() {
    try {
        const response = await fetch('https://dummyjson.com/products?limit=20');
        const data = await response.json();
        products = data.products;
    } catch (error) {
        console.error('Lỗi khi tải sản phẩm:', error);
    }
}

// Lấy danh mục sản phẩm từ API
async function fetchCategories() {
    try {
        const response = await fetch('https://dummyjson.com/products/categories');
        categories = await response.json();
        console.log(categories);
        
        renderCategories();
    } catch (error) {
        console.error('Lỗi khi tải danh mục:', error);
    }
}

// Hiển thị danh mục vào dropdown
function renderCategories() {
    categoryFilter.innerHTML = '<option value="">Tất cả danh mục</option>';
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category['name'];
        categoryFilter.appendChild(option);
    });
}

// Hiển thị sản phẩm lên trang
function renderProducts(productsToRender) {
    productsContainer.innerHTML = '';

    if (productsToRender.length === 0) {
        productsContainer.innerHTML = '<div class="no-products">Không tìm thấy sản phẩm nào</div>';
        return;
    }

    productsToRender.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <img src="${product.thumbnail}" alt="${product.title}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-price">${product.price}$</p>
                <button class="add-to-cart" data-id="${product.id}">Thêm vào giỏ</button>
            </div>
        `;
        
        productsContainer.appendChild(productCard);
    });

    // Thêm sự kiện cho nút thêm vào giỏ
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Thêm sản phẩm vào giỏ hàng
function addToCart(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const product = products.find(p => p.id === productId);
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
}

// Cập nhật giỏ hàng
function updateCart() {
    renderCartItems();
    updateCartCount();
    updateTotalPrice();
}

// Hiển thị sản phẩm trong giỏ
function renderCartItems() {
    cartItemsContainer.innerHTML = '';
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        cartItem.innerHTML = `
            <div class="item-info">
                <img src="${item.thumbnail}" alt="${item.title}" width="50">
                <div>
                    <h4>${item.title}</h4>
                    <p>${item.price}$ x ${item.quantity}</p>
                </div>
            </div>
            <button class="remove-item" data-id="${item.id}">Xóa</button>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });

    // Thêm sự kiện cho nút xóa
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', removeFromCart);
    });
}

// Xóa sản phẩm khỏi giỏ
function removeFromCart(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Cập nhật số lượng sản phẩm trong giỏ
function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = totalItems;
}

// Tính tổng giá trị giỏ hàng
function updateTotalPrice() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalPriceElement.textContent = total.toFixed(2);
}

// Lọc sản phẩm
function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;
    
    let filteredProducts = products;
    
    // Lọc theo tìm kiếm
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(product => 
            product.title.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
    }
    
    // Lọc theo danh mục
    if (selectedCategory) {
        filteredProducts = filteredProducts.filter(product => 
            product.category === selectedCategory
        );
    }
    
    renderProducts(filteredProducts);
}

// Thiết lập sự kiện
function setupEventListeners() {
    // Tìm kiếm và lọc
    searchInput.addEventListener('input', filterProducts);
    categoryFilter.addEventListener('change', filterProducts);
    
    // Giỏ hàng
    document.querySelector('.cart-icon').addEventListener('click', () => {
        cartModal.style.display = 'block';
    });
    
    closeBtn.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });
}

// Khởi chạy ứng dụng
init();