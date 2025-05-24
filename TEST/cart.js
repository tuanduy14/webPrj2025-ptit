 function getCart() {
      return JSON.parse(localStorage.getItem('cart')) || [];
    }

    function saveCart(cart) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }

    function renderCart() {
      const cart = getCart();
      const container = document.getElementById('cartContainer');
      if (cart.length === 0) {
        container.innerHTML = '<p id="emptyMessage">Giỏ hàng đang trống.</p>';
        return;
      }

      let html = `
        <table>
          <thead>
            <tr>
              <th>Chọn</th>
              <th>Ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Thành tiền</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
      `;

      cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        html += `
          <tr>
            <td><input type="checkbox" class="select-checkbox" data-index="${index}" /></td>
            <td><img src="${item.thumbnail}" alt="${item.title}" /></td>
            <td>${item.title}</td>
            <td>${item.price}$</td>
            <td><input type="number" min="1" value="${item.quantity}" data-index="${index}" class="qty-input" /></td>
            <td>${itemTotal.toFixed(2)}$</td>
            <td>
              <button data-index="${index}" class="delete-btn">Xóa</button>
              <button data-index="${index}" class="pay-btn" style="margin-left:5px; background:#28a745;">Thanh toán</button>
            </td>
          </tr>
        `;
      });

      html += `</tbody></table><button id="checkoutBtn">Thanh toán các sản phẩm đã chọn</button>`;
      container.innerHTML = html;

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

      // Xử lý xóa sản phẩm
      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', e => {
          const idx = e.target.dataset.index;
          cart.splice(idx, 1);
          saveCart(cart);
          renderCart();
        });
      });

      // Xử lý thanh toán tất cả đã chọn
      document.getElementById('checkoutBtn').addEventListener('click', () => {
        const checkboxes = document.querySelectorAll('.select-checkbox');
        const selectedIndexes = Array.from(checkboxes)
          .filter(cb => cb.checked)
          .map(cb => parseInt(cb.dataset.index));

        if (selectedIndexes.length === 0) {
          alert('Vui lòng chọn ít nhất một sản phẩm để thanh toán.');
          return;
        }

        const paidItems = selectedIndexes.map(i => cart[i]);
        const total = paidItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

        alert(`Bạn đã thanh toán ${paidItems.length} sản phẩm với tổng số tiền ${total.toFixed(2)}$`);

        // Xoá các sản phẩm đã thanh toán
        for (let i = selectedIndexes.length - 1; i >= 0; i--) {
          cart.splice(selectedIndexes[i], 1);
        }

        saveCart(cart);
        renderCart();
      });

      // Thanh toán từng sản phẩm
      document.querySelectorAll('.pay-btn').forEach(btn => {
        btn.addEventListener('click', e => {
          const idx = e.target.dataset.index;
          alert(`Bạn đã thanh toán sản phẩm: ${cart[idx].title} với tổng tiền ${(cart[idx].price * cart[idx].quantity).toFixed(2)}$`);
          cart.splice(idx, 1);
          saveCart(cart);
          renderCart();
        });
      });
    }

    renderCart();