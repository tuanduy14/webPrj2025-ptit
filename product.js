 // Lấy id từ URL
    function getProductIdFromUrl() {
      const params = new URLSearchParams(window.location.search);
      return params.get('id');
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

      container.innerHTML = `
        ${imageGallery}
        <div class="product-info">
          <h2>${product.title}</h2>
          ${rating}
          <p class="price">${product.price} ${discountPercentage}</p>
          <div class="product-meta">
            <p><strong>Thương hiệu:</strong> ${product.brand || 'Không có thông tin'}</p>
            <p><strong>Danh mục:</strong> ${product.category}</p>
            <p><strong>Tình trạng:</strong> ${product.stock > 0 ? `Còn hàng (${product.stock})` : 'Hết hàng'}</p>
          </div>
          <div class="product-description">
            <h3>Mô tả sản phẩm</h3>
            <p>${product.description}</p>
          </div>
          <div class="product-actions">
            <button id="addToCartBtn">Thêm vào giỏ</button>
            <button id="buyNowBtn" style="background-color: #28a745;">Mua ngay</button>
          </div>
        </div>
      `;

      document.getElementById('addToCartBtn').addEventListener('click', () => {
        addToCart(product);
        alert('Đã thêm sản phẩm vào giỏ hàng.');
      });

      document.getElementById('buyNowBtn').addEventListener('click', () => {
        addToCart(product);
        window.location.href = 'cart.html';
      });

      // Hiển thị sản phẩm liên quan
      fetchRelatedProducts(product.category);
    }

    // Thêm sản phẩm vào giỏ hàng (localStorage)
    function addToCart(product) {
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      const index = cart.findIndex(item => item.id === product.id);
      if (index > -1) {
        cart[index].quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
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

      container.innerHTML = products.map(product => `
        <div class="product" onclick="window.location.href='product.html?id=${product.id}'">
          <img src="${product.thumbnail}" alt="${product.title}" />
          <h4>${product.title}</h4>
          <p>${product.price}$</p>
        </div>
      `).join('');
    }

    // Đổi hình ảnh chính khi click vào thumbnail
    function changeMainImage(src) {
      document.querySelector('.main-image').src = src;
    }

    async function init() {
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
    document.getElementById('btnViewCart').addEventListener('click', () => {
      window.location.href = 'cart.html';
    });

    window.addEventListener('DOMContentLoaded', init);
