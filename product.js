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
      container.innerHTML = `
        <img src="${product.thumbnail}" alt="${product.title}" />
        <div class="product-info">
          <h2>${product.title}</h2>
          <p>${product.description}</p>
          <p><strong>Danh mục:</strong> ${product.category}</p>
          <p class="price">${product.price}$</p>
          <button id="addToCartBtn">Thêm vào giỏ</button>
     
        </div>
      `;

      document.getElementById('addToCartBtn').addEventListener('click', () => {
        addToCart(product);
        alert('Đã thêm sản phẩm vào giỏ hàng.');
      });

     
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

    window.addEventListener('DOMContentLoaded', init);