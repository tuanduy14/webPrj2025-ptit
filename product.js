// Cập nhật số lượng sản phẩm trong giỏ hàng
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Lấy id từ URL
function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

async function updateOrderInCartApi(product) {
    const user = JSON.parse(localStorage.getItem('user'))
    fetch(`http://localhost:5000/user/update-order-in-cart`, {
        method: 'PATCH', headers: {
            'Content-Type': 'application/json'
        }, body: JSON.stringify({ userId: user._id, product: product })
    }).then(res => {
        if (!res.ok) {
            // Throw an error if HTTP status is not OK (200–299)
            return res.json().then(err => {
                throw new Error(err.message || `HTTP error ${res.status}`);
            });
        }
        return res.json();
    }).catch(e => {
        alert(e)
        console.log(e);
        throw new Error(e)
    })
}

// Lấy dữ liệu sản phẩm
async function fetchProduct(id) {
    try {
        const res = await fetch(`https://dummyjson.com/products/${id}`);
        if (!res.ok) throw new Error('Không tìm thấy sản phẩm');
        const product = await res.json();
        return product;
    } catch (error) {
        console.error(error);
        return null;
    }
}

// Hiển thị chi tiết sản phẩm
function displayProduct(product) {
    const container = document.getElementById('productContainer');
    if (!product) {
        container.innerHTML = '<p>Không tìm thấy sản phẩm.</p>';
        return;
    }

    // Cập nhật breadcrumb
    document.getElementById('productCategory').textContent = product.category;
    document.getElementById('productName').textContent = product.title;

    // Tạo gallery hình ảnh nếu có nhiều hình
    let imageGallery = `<img src="${product.thumbnail}" alt="${product.title}" />`;
    if (product.images && product.images.length > 0) {
        imageGallery = `
            <div class="product-gallery">
                <img src="${product.thumbnail}" alt="${product.title}" class="main-image" />
                <div class="thumbnail-gallery">
                    ${product.images.slice(0, 4).map(img =>
            `<img src="${img}" alt="${product.title}" onclick="changeMainImage(this.src)" />`
        ).join('')}
                </div>
            </div>
        `;
    }

    // Tính giảm giá nếu có
    const discountPercentage = product.discountPercentage ?
        `<span class="discount-badge">-${Math.round(product.discountPercentage)}%</span>` : '';

    // Hiển thị đánh giá
    const rating = product.rating ?
        `<div class="rating">
            <span class="stars" style="--rating: ${product.rating};"></span>
            <span class="rating-text">${product.rating}/5 (${product.stock} đánh giá)</span>
        </div>` : '';

    // Tính giá gốc nếu có giảm giá
    const originalPrice = product.discountPercentage ?
        `<span class="original-price">${Math.round(product.price / (1 - product.discountPercentage / 100))}$</span>` : '';

    container.innerHTML = `
        <div class="product-left">
            ${imageGallery}
        </div>
        <div class="product-right">
            <h2>${product.title}</h2>
            ${rating}
            <div class="product-price">
                <span class="current-price">${product.price}$</span>
                ${originalPrice}
                ${discountPercentage}
            </div>
            <div class="product-meta">
                <p><strong>Thương hiệu:</strong> ${product.brand || 'Không có thông tin'}</p>
                <p><strong>Danh mục:</strong> ${product.category}</p>
                <p><strong>Tình trạng:</strong> ${product.stock > 0 ? `<span class="in-stock">Còn hàng (${product.stock})</span>` : '<span class="out-of-stock">Hết hàng</span>'}</p>
            </div>
            <div class="product-description">
                <h3>Mô tả sản phẩm</h3>
                <p>${product.description}</p>
            </div>
            <div class="product-quantity">
                <label for="quantity">Số lượng:</label>
                <div class="quantity-selector">
                    <button class="quantity-btn minus">-</button>
                    <input type="number" id="quantity" value="1" min="1" max="${product.stock}">
                    <button class="quantity-btn plus">+</button>
                </div>
            </div>
            <div class="product-actions">
                <button id="addToCartBtn"><i class="fas fa-shopping-cart"></i> Thêm vào giỏ</button>
                <button id="buyNowBtn"><i class="fas fa-bolt"></i> Mua ngay</button>
                <button id="addToWishlistBtn"><i class="fas fa-heart"></i></button>
            </div>
            <div class="product-share">
                <span>Chia sẻ:</span>
                <div class="social-share">
                    <a href="#"><i class="fab fa-facebook-f"></i></a>
                    <a href="#"><i class="fab fa-twitter"></i></a>
                    <a href="#"><i class="fab fa-pinterest"></i></a>
                    <a href="#"><i class="fab fa-instagram"></i></a>
                </div>
            </div>
        </div>
    `;

    // Xử lý nút tăng giảm số lượng
    const quantityInput = document.getElementById('quantity');
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');

    minusBtn.addEventListener('click', () => {
        let value = parseInt(quantityInput.value);
        if (value > 1) {
            quantityInput.value = value - 1;
        }
    });

    plusBtn.addEventListener('click', () => {
        let value = parseInt(quantityInput.value);
        if (value < product.stock) {
            quantityInput.value = value + 1;
        }
    });

    document.getElementById('addToCartBtn').addEventListener('click', () => {
        const quantity = parseInt(document.getElementById('quantity').value);
        addToCart(product, quantity);
        
        showNotification('Đã thêm sản phẩm vào giỏ hàng!');
    });

    document.getElementById('buyNowBtn').addEventListener('click', () => {
        const quantity = parseInt(document.getElementById('quantity').value);
        addToCart(product, quantity);
        window.location.href = 'cart.html';
    });

    // Hiển thị sản phẩm liên quan
    fetchRelatedProducts(product.category);
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

// Thêm sản phẩm vào giỏ hàng (localStorage)
async function addToCart(product, quantity = 1) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const index = cart.findIndex(item => item.id === product.id);
    if (index > -1) {
        cart[index].quantity += quantity;
        await updateOrderInCartApi({productId: product.id, quantity: cart[index].quantity})
    } else {
        cart.push({ ...product, quantity: quantity });
        await updateOrderInCartApi({productId: product.id, quantity: quantity})
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Lấy sản phẩm liên quan theo danh mục
async function fetchRelatedProducts(category) {
    try {
        const res = await fetch(`https://dummyjson.com/products/category/${category}?limit=4`);
        if (!res.ok) throw new Error('Không thể lấy sản phẩm liên quan');
        const data = await res.json();
        displayRelatedProducts(data.products);
    } catch (error) {
        console.error(error);
        document.getElementById('relatedProducts').innerHTML = '<p>Không thể tải sản phẩm liên quan.</p>';
    }
}

// Hiển thị sản phẩm liên quan
function displayRelatedProducts(products) {
    const container = document.getElementById('relatedProducts');
    if (!products || products.length === 0) {
        container.innerHTML = '<p>Không có sản phẩm liên quan.</p>';
        return;
    }

    container.innerHTML = products.map(product => {
        // Tính giảm giá nếu có
        const discountBadge = product.discountPercentage ?
            `<span class="discount-badge">-${Math.round(product.discountPercentage)}%</span>` : '';

        // Hiển thị đánh giá
        const rating = product.rating ?
            `<div class="rating">
                <span class="stars" style="--rating: ${product.rating};"></span>
                <span class="rating-text">${product.rating}/5</span>
            </div>` : '';

        return `
            <div class="product">
                <div class="product-image">
                    ${discountBadge}
                    <a href="product.html?id=${product.id}">
                        <img src="${product.thumbnail}" alt="${product.title}" />
                    </a>
                    <div class="product-actions">
                        <button class="quick-view" data-id="${product.id}"><i class="fas fa-eye"></i></button>
                        <button class="add-to-cart" data-id="${product.id}"><i class="fas fa-shopping-cart"></i></button>
                        <button class="add-to-wishlist" data-id="${product.id}"><i class="fas fa-heart"></i></button>
                    </div>
                </div>
                <div class="product-info">
                    <a href="product.html?id=${product.id}">
                        <h4>${product.title}</h4>
                    </a>
                    ${rating}
                    <p>${product.price}$</p>
                </div>
            </div>
        `;
    }).join('');

    // Thêm event listeners cho các nút trong sản phẩm liên quan
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = button.getAttribute('data-id');
            const product = products.find(p => p.id == productId);
            if (product) {
                addToCart(product);
                showNotification('Đã thêm sản phẩm vào giỏ hàng!');
            }
        });
    });
}

// Đổi hình ảnh chính khi click vào thumbnail
function changeMainImage(src) {
    document.querySelector('.main-image').src = src;
}

async function init() {
    updateCartCount();

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
        .breadcrumb {
            background-color: #f5f5f5;
            padding: 15px 0;
            margin-bottom: 30px;
        }
        .breadcrumb ul {
            display: flex;
            align-items: center;
        }
        .breadcrumb li {
            position: relative;
        }
        .breadcrumb li:not(:last-child)::after {
            content: '/';
            margin: 0 10px;
            color: var(--light-text);
        }
        .breadcrumb a {
            color: var(--light-text);
        }
        .breadcrumb a:hover {
            color: var(--primary-color);
        }
        .breadcrumb li:last-child span {
            color: var(--primary-color);
            font-weight: 500;
        }
        .product-left, .product-right {
            flex: 1;
            min-width: 300px;
        }
        .product-price {
            display: flex;
            align-items: center;
            margin: 15px 0;
        }
        .current-price {
            font-size: 2rem;
            font-weight: bold;
            color: var(--primary-color);
            margin-right: 15px;
        }
        .original-price {
            font-size: 1.2rem;
            color: var(--light-text);
            text-decoration: line-through;
            margin-right: 10px;
        }
        .in-stock {
            color: var(--success-color);
            font-weight: 500;
        }
        .out-of-stock {
            color: var(--danger-color);
            font-weight: 500;
        }
        .product-quantity {
            margin: 20px 0;
        }
        .quantity-selector {
            display: flex;
            align-items: center;
            max-width: 150px;
            margin-top: 10px;
        }
        .quantity-btn {
            width: 35px;
            height: 35px;
            background-color: #f0f0f0;
            border: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            cursor: pointer;
        }
        .quantity-btn:hover {
            background-color: var(--primary-color);
            color: white;
        }
        #quantity {
            width: 50px;
            height: 35px;
            text-align: center;
            border: 1px solid var(--border-color);
            border-left: none;
            border-right: none;
        }
        .product-actions {
            display: flex;
            gap: 15px;
            margin: 25px 0;
        }
        #addToCartBtn {
            flex: 2;
            background-color: var(--primary-color);
            color: white;
            padding: 12px 25px;
            font-weight: 600;
            border-radius: 30px;
        }
        #buyNowBtn {
            flex: 1;
            background-color: var(--success-color);
            color: white;
            padding: 12px 25px;
            font-weight: 600;
            border-radius: 30px;
        }
        #addToWishlistBtn {
            width: 45px;
            height: 45px;
            border-radius: 50%;
            background-color: #f0f0f0;
            color: var(--text-color);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
        }
        #addToCartBtn:hover, #buyNowBtn:hover {
            transform: translateY(-3px);
            box-shadow: var(--box-shadow);
        }
        #addToWishlistBtn:hover {
            background-color: var(--primary-color);
            color: white;
        }
        .product-share {
            display: flex;
            align-items: center;
            margin-top: 25px;
            padding-top: 25px;
            border-top: 1px solid var(--border-color);
        }
        .product-share span {
            margin-right: 15px;
            color: var(--light-text);
        }
        .social-share {
            display: flex;
            gap: 10px;
        }
        .social-share a {
            width: 35px;
            height: 35px;
            border-radius: 50%;
            background-color: #f0f0f0;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text-color);
            transition: all 0.3s ease;
        }
        .social-share a:hover {
            background-color: var(--primary-color);
            color: white;
            transform: translateY(-3px);
        }
    `;
    document.head.appendChild(style);

    const id = getProductIdFromUrl();
    if (!id) {
        document.getElementById('productContainer').innerHTML = '<p>ID sản phẩm không hợp lệ.</p>';
        return;
    }
    const product = await fetchProduct(id);
    displayProduct(product);
}

document.getElementById('headerTitle').addEventListener('click', () => {
    window.location.href = 'index.html';
});

// Xử lý nút xem giỏ hàng
document.getElementById('btnViewCart').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'cart.html';
});

window.addEventListener('DOMContentLoaded', init);
