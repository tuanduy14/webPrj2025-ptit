const authLink = document.getElementById('auth-link')
const user = JSON.parse(localStorage.getItem('user'))

console.log('user: ', user);


if (!user) {
    authLink.innerHTML = '<a id="auth-link" href="login.html"><i class="fas fa-user"></i></a>'
} else {
    authLink.innerHTML += `<i class="fas fa-user"></i>${user.username}`
}

// Cập nhật số lượng sản phẩm trong giỏ hàng
function updateCartCount() {
    const cart = getCart();
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
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

function renderCart() {
    const cart = getCart();
    const container = document.getElementById('cartContainer');

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Giỏ hàng của bạn đang trống</p>
                <a href="index.html" class="btn btn-primary">Tiếp tục mua sắm</a>
            </div>
        `;
        return;
    }

    // Tính tổng tiền
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 500 ? 0 : 30; // Miễn phí vận chuyển cho đơn hàng trên 500$
    const total = subtotal + shipping;

    let html = `
        <div class="cart-content">
            <div class="cart-items">
                <table class="cart-table">
                    <thead>
                        <tr>
                            <th>Sản phẩm</th>
                            <th>Giá</th>
                            <th>Số lượng</th>
                            <th>Thành tiền</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
    `;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;

        // Tính giảm giá nếu có
        const discountBadge = item.discountPercentage ?
            `<span class="discount-badge">-${Math.round(item.discountPercentage)}%</span>` : '';

        html += `
            <tr>
                <td class="product-col">
                    <div class="cart-product">
                        <div class="product-image">
                            ${discountBadge}
                            <img src="${item.thumbnail}" alt="${item.title}" />
                        </div>
                        <div class="product-info">
                            <h4>${item.title}</h4>
                            <p class="product-category">${item.category}</p>
                            <p class="product-brand">${item.brand}</p>
                        </div>
                    </div>
                </td>
                <td class="price-col">${item.price}$</td>
                <td class="quantity-col">
                    <div class="quantity-selector">
                        <button class="quantity-btn minus" data-index="${index}" data-product-id="${item.id}">-</button>
                        <input type="number" value="${item.quantity}" min="1" data-index="${index}" class="qty-input">
                        <button class="quantity-btn plus" data-index="${index}" data-product-id="${item.id}">+</button>
                    </div>
                </td>
                <td class="total-col">${itemTotal.toFixed(2)}$</td>
                <td class="action-col">
                    <button class="remove-btn" data-index="${index}" data-product-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
                </td>
            </tr>
        `;
    });

    html += `
                    </tbody>
                </table>
            </div>
            <div class="cart-summary">
                <h3>Tổng giỏ hàng</h3>
                <div class="summary-row">
                    <span>Tạm tính:</span>
                    <span>${subtotal.toFixed(2)}$</span>
                </div>
                <div class="summary-row">
                    <span>Phí vận chuyển:</span>
                    <span>${shipping > 0 ? shipping.toFixed(2) + '$' : 'Miễn phí'}</span>
                </div>
                <div class="summary-row total">
                    <span>Tổng cộng:</span>
                    <span>${total.toFixed(2)}$</span>
                </div>
                <div class="coupon-form">
                    <input type="text" placeholder="Mã giảm giá">
                    <button>Áp dụng</button>
                </div>
                <button id="checkoutBtn">Tiến hành thanh toán</button>
                <a href="index.html" class="continue-shopping">Tiếp tục mua sắm</a>
            </div>
        </div>
    `;

    container.innerHTML = html;

    // Thêm CSS cho giỏ hàng
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
        .cart-section {
            padding: 60px 0;
        }
        .empty-cart {
            text-align: center;
            padding: 50px 0;
        }
        .empty-cart i {
            font-size: 5rem;
            color: var(--light-text);
            margin-bottom: 20px;
        }
        .empty-cart p {
            font-size: 1.5rem;
            color: var(--light-text);
            margin-bottom: 30px;
        }
        .cart-content {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 30px;
        }
        .cart-table {
            width: 100%;
            border-collapse: collapse;
        }
        .cart-table th {
            text-align: left;
            padding: 15px;
            background-color: #f5f5f5;
            font-weight: 600;
        }
        .cart-table td {
            padding: 15px;
            border-bottom: 1px solid var(--border-color);
            vertical-align: middle;
        }
        .cart-product {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        .cart-product .product-image {
            width: 100px;
            height: 100px;
            position: relative;
            overflow: hidden;
        }
        .cart-product img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 4px;
        }
        .cart-product h4 {
            margin: 0 0 5px;
            font-size: 1.1rem;
        }
        .product-category, .product-brand {
            margin: 0;
            color: var(--light-text);
            font-size: 0.9rem;
        }
        .discount-badge {
            position: absolute;
            top: 5px;
            left: 5px;
            background-color: var(--primary-color);
            color: white;
            padding: 3px 6px;
            border-radius: 3px;
            font-size: 0.8rem;
            z-index: 1;
        }
        .quantity-selector {
            display: flex;
            align-items: center;
            max-width: 120px;
        }
        .quantity-btn {
            width: 30px;
            height: 30px;
            background-color: #f0f0f0;
            border: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1rem;
            cursor: pointer;
        }
        .quantity-btn:hover {
            background-color: var(--primary-color);
            color: white;
        }
        .qty-input {
            width: 40px;
            height: 30px;
            text-align: center;
            border: 1px solid var(--border-color);
            border-left: none;
            border-right: none;
        }
        .remove-btn {
            background: none;
            border: none;
            color: var(--light-text);
            cursor: pointer;
            transition: var(--transition);
        }
        .remove-btn:hover {
            color: var(--danger-color);
        }
        .cart-summary {
            background-color: #f9f9f9;
            padding: 25px;
            border-radius: 8px;
        }
        .cart-summary h3 {
            margin-top: 0;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid var(--border-color);
        }
        .summary-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
        }
        .summary-row.total {
            font-size: 1.2rem;
            font-weight: 600;
            color: var(--primary-color);
            padding-top: 15px;
            margin-top: 15px;
            border-top: 1px solid var(--border-color);
        }
        .coupon-form {
            display: flex;
            margin: 20px 0;
        }
        .coupon-form input {
            flex: 1;
            padding: 10px 15px;
            border: 1px solid var(--border-color);
            border-radius: 4px 0 0 4px;
        }
        .coupon-form button {
            padding: 10px 15px;
            background-color: var(--dark-bg);
            color: white;
            border: none;
            border-radius: 0 4px 4px 0;
            cursor: pointer;
        }
        #checkoutBtn {
            width: 100%;
            padding: 12px;
            background-color: var(--primary-color);
            color: white;
            border: none;
            border-radius: 4px;
            font-weight: 600;
            margin-bottom: 15px;
            cursor: pointer;
            transition: var(--transition);
        }
        #checkoutBtn:hover {
            background-color: #e05c5c;
            transform: translateY(-3px);
            box-shadow: var(--box-shadow);
        }
        .continue-shopping {
            display: block;
            text-align: center;
            color: var(--text-color);
            text-decoration: underline;
        }
        .continue-shopping:hover {
            color: var(--primary-color);
        }

        @media (max-width: 992px) {
            .cart-content {
                grid-template-columns: 1fr;
            }
        }

        @media (max-width: 768px) {
            .cart-table {
                display: block;
                overflow-x: auto;
            }
            .cart-product {
                flex-direction: column;
                align-items: flex-start;
                text-align: center;
            }
            .cart-product .product-image {
                margin: 0 auto;
            }
        }
    `;
    document.head.appendChild(style);

    // Xử lý thay đổi số lượng
    document.querySelectorAll('.qty-input').forEach(input => {
        input.addEventListener('change', e => {
            const idx = e.target.dataset.index;
            let val = parseInt(e.target.value);
            if (isNaN(val) || val < 1) val = 1;
            e.target.value = val;
            cart[idx].quantity = val;
            saveCart(cart);
            renderCart();
        });
    });

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

    // Xử lý nút giảm số lượng
    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const idx = e.target.dataset.index;
            const productId = e.target.dataset.productId;
            const input = document.querySelector(`.qty-input[data-index="${idx}"]`);
            let val = parseInt(input.value);
            if (val > 1) {
                input.value = val - 1;
                cart[idx].quantity = val - 1;
                saveCart(cart);
                await updateOrderInCartApi({productId: parseInt(productId), quantity: val - 1})
                renderCart();
            }
        });
    });

    // Xử lý nút tăng số lượng
    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const idx = e.target.dataset.index;
            const productId = e.target.dataset.productId;
            const input = document.querySelector(`.qty-input[data-index="${idx}"]`);
            let val = parseInt(input.value);
            input.value = val + 1;
            cart[idx].quantity = val + 1;
            saveCart(cart);
            await updateOrderInCartApi({productId: parseInt(productId), quantity: val + 1})
            renderCart();

        });
    });

    const removeFromCartApi = async (productId) => {
        const user = JSON.parse(localStorage.getItem('user'))
        console.log('prId: ', productId);

        await fetch(`http://localhost:5000/user/remove-from-cart`, {
            method: 'PATCH', headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify({ userId: user._id, productId: productId })
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

    // Xử lý xóa sản phẩm
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const idx = e.target.closest('.remove-btn').dataset.index;
            const productId = e.target.closest('.remove-btn').dataset.productId;
            await removeFromCartApi(productId)
            cart.splice(idx, 1);
            saveCart(cart);
            showNotification('Đã xóa sản phẩm khỏi giỏ hàng!');
            renderCart();
        });
    });

    console.log('cart: ', localStorage.getItem('cart'));


    // Xử lý thanh toán
    document.getElementById('checkoutBtn').addEventListener('click', async () => {
        const items = JSON.parse(localStorage.getItem('cart'))

        console.log('items: ', items);
        
        
        await Promise.all(items.map(async (item) => await removeFromCartApi(item.id)))
        localStorage.removeItem('cart');
        // showNotification('Đặt hàng thành công!');
        alert(`Bạn đã thanh toán ${cart.length} sản phẩm với tổng số tiền ${total.toFixed(2)}$`);
        updateCartCount();
        renderCart();
    });
}

// Xử lý nút trang chủ
document.getElementById('siteTitle').addEventListener('click', () => {
    window.location.href = '/';
});

// Khởi tạo
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    renderCart();
});
