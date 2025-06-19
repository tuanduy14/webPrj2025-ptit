let allProducts = [];
      let currentFilteredProducts = [];
      let currentCategory = "";
      let productsToShow = 30;

      function renderCategories() {
        const categories = [
          {
            slug: "",
            tên: "Tất cả",
            ảnh: "https://media.istockphoto.com/id/639928744/vi/anh/gi%E1%BB%8F-mua-s%E1%BA%AFm-v%E1%BB%9Bi-nhi%E1%BB%81u-s%E1%BA%A3n-ph%E1%BA%A9m-t%E1%BA%A1p-h%C3%B3a-%C4%91%C6%B0%E1%BB%A3c-c%C3%A1ch-ly-tr%C3%AAn-whi.jpg?s=612x612&w=0&k=20&c=NQGMVSfYwmRHwqbgrCy0xU8slpHcT7tRXhFs3uFv9g0=",
          },
          {
            slug: "beauty",
            tên: "Vẻ đẹp",
            ảnh: "https://www.shiseido.com.vn/dw/image/v2/BCSK_PRD/on/demandware.static/-/Sites-itemmaster_shiseido/default/dw14d75c28/images/products/18058/18058_S_01.jpg?sw=1000&sh=1000&sm=fit",
          },
          {
            slug: "fragrances",
            tên: "Hương thơm",
            ảnh: "https://hadoha.com/wp-content/uploads/2024/12/Nuoc-Hoa-Chanel-Chance-EDP-100Ml-cua-Phap-cho-nu-2.webp",
          },
          {
            slug: "furniture",
            tên: "Đồ nội thất",
            ảnh: "https://bizweb.dktcdn.net/thumb/1024x1024/100/429/325/files/53.png?v=1651111707482",
          },
          {
            slug: "groceries",
            tên: "Hàng tạp hóa",
            ảnh: "https://bizweb.dktcdn.net/thumb/grande/100/469/765/products/1503-9de8f3562b364e56b550ff30bc493122-2c0db7cc76fd4b7f8b3c767fb24bc277-d4f804d8fc474b4bae5f628ff0d632e0-master.jpg",
          },
          {
            slug: "home-decoration",
            tên: "Trang trí nhà cửa",
            ảnh: "https://storage.googleapis.com/cdn_dlhf_vn/public/products/DGP1/DGP14HP090/AA0_4022wm_800x800.jpg",
          },
          {
            slug: "kitchen-accessories",
            tên: "Phụ kiện nhà bếp",
            ảnh: "https://thegioidodung.vn/wp-content/uploads/2019/12/chao-chong-dinh-HAPPY-TIME-SIZE20.jpg",
          },
          {
            slug: "laptops",
            tên: "Máy tính xách tay",
            ảnh: "https://cdn1615.cdn4s4.io.vn/media/products/may-tinh-xach-tay/hp/hp-15/laptop%20hp%2015%20-1.webp",
          },
          {
            slug: "mens-shirts",
            tên: "Áo sơ mi nam",
            ảnh: "https://product.hstatic.net/200000588671/product/ao-so-mi-nam-bycotton-trang-art-nhan_8ec622a241ea4deb93a02bdbdcb87954.jpg",
          },
          {
            slug: "mens-shoes",
            tên: "Giày nam",
            ảnh: "https://product.hstatic.net/200000410665/product/giay-the-thao-nam-xb20649fk-2_a2f0e9136e6849da95f6c6476d9dbdec.jpg",
          },
          {
            slug: "mens-watches",
            tên: "Đồng hồ nam",
            ảnh: "https://cdn.vuahanghieu.com/unsafe/0x900/left/top/smart/filters:quality(90)/https://admin.vuahanghieu.com/upload/product/2023/12/dong-ho-nam-rolex-datejust-41mm-steel-and-yellow-gold-126333-0018-mau-bac-vang-658d4260bc1cd-28122023163944.jpg",
          },
          {
            slug: "mobile-accessories",
            tên: "Phụ kiện di động",
            ảnh: "https://bachlongstore.vn/vnt_upload/product/01_2024/54638.png",
          },
          {
            slug: "motorcycle",
            tên: "Xe máy",
            ảnh: "https://giadinh.mediacdn.vn/zoom/740_463/2016/2013-yamaha-yzf-r1-42-600x0w-1457575921684.jpg",
          },
          {
            slug: "skin-care",
            tên: "Chăm sóc da",
            ảnh: "https://product.hstatic.net/1000006063/product/94539265-9556024716508-01.jpg.rendition.767.767_copy_36135c43796e4402a44d4d40250fa473_1024x1024.jpg",
          },
          {
            slug: "smartphones",
            tên: "Điện thoại thông minh",
            ảnh: "https://www.apple.com/v/iphone/home/cb/images/meta/iphone__kqge21l9n26q_og.png",
          },
          {
            slug: "sports-accessories",
            tên: "Phụ kiện thể thao",
            ảnh: "https://thethaominhphu.com/wp-content/uploads/2020/10/qua-bong-da-co-do-sao-vang.jpg",
          },
          {
            slug: "sunglasses",
            tên: "Kính râm",
            ảnh: "https://bizweb.dktcdn.net/100/257/549/products/4570192146924-jpeg.jpg?v=1712567657587",
          },
          {
            slug: "tablets",
            tên: "Máy tính bảng",
            ảnh: "https://cdn.viettelstore.vn/Images/Product/ProductImage/1424814078.jpeg",
          },
          {
            slug: "tops",
            tên: "Áo nữ",
            ảnh: "https://cdn.dummyjson.com/product-images/tops/gray-dress/thumbnail.webp",
          },
          {
            slug: "womens-bags",
            tên: "Túi xách nữ",
            ảnh: "https://cdn.vuahanghieu.com/unsafe/0x900/left/top/smart/filters:quality(90)/https://admin.vuahanghieu.com/upload/product/2022/03/tui-xach-mall-lady-dior-my-abcdior-cannage-lambskin-mau-hong-nhat-6245617f5b9da-31032022150831.jpg",
          },
          {
            slug: "womens-dresses",
            tên: "Váy nữ",
            ảnh: "https://cdn.kkfashion.vn/18825-large_default/dam-cong-so-nu-vien-den-phoi-nut-kk119-31.jpg",
          },
          {
            slug: "womens-jewellery",
            tên: "Trang sức nữ",
            ảnh: "https://lili.vn/wp-content/uploads/2021/12/Bo-trang-suc-bac-nu-dinh-da-Spinel-CZ-hinh-bong-tuyet-LILI_614587_1.jpg",
          },
          {
            slug: "womens-shoes",
            tên: "Giày nữ",
            ảnh: "https://product.hstatic.net/1000003969/product/kem_cg09168_1_20241209095032_c61fc16a58ed444ca552cbb045bc1051_master.jpeg",
          },
          {
            slug: "womens-watches",
            tên: "Đồng hồ nữ",
            ảnh: "https://donghoolevs.vn/wp-content/uploads/2022/10/screenshot_1666929057.png",
          },
        ];

        const list = document.getElementById("categoryList");
        list.innerHTML = "";
        categories.forEach((cat) => {
          const div = document.createElement("div");
          div.className = "category-item";
          div.dataset.slug = cat.slug;
          if (cat.slug === "") div.classList.add("active");
          div.innerHTML = `
      <img src="${cat.ảnh}" alt="${cat.tên}" />
      <span>${cat.tên}</span>
    `;
          list.appendChild(div);
        });

        // Bắt sự kiện chọn danh mục
        list.addEventListener("click", async (e) => {
          const item = e.target.closest(".category-item");
          if (item) {
            document
              .querySelectorAll(".category-item")
              .forEach((el) => el.classList.remove("active"));
            item.classList.add("active");
            currentCategory = item.dataset.slug;
            await filterAndSearchProducts();
          }
        });
      }

      async function fetchProducts() {
        try {
          const res = await fetch("https://dummyjson.com/products?limit=194");
          const data = await res.json();
          allProducts = data.products;
          currentFilteredProducts = allProducts;
          displayProducts(currentFilteredProducts);
        } catch (error) {
          console.error("Lỗi lấy sản phẩm:", error);
        }
      }

      function displayProducts(products) {
        const list = document.getElementById("productList");
        const noResults = document.getElementById("noResults");
        const btnLoadMore = document.getElementById("btnLoadMore");
        list.innerHTML = "";

        if (products.length === 0) {
          noResults.style.display = "block";
          btnLoadMore.style.display = "none";
          return;
        } else {
          noResults.style.display = "none";
        }

        const productsToDisplay = products.slice(0, productsToShow);
        productsToDisplay.forEach((product) => {
          const div = document.createElement("div");
          div.className = "product";
          div.innerHTML = `
            <a href="product.html?id=${product.id}" style="color: inherit; text-decoration:none;">
              <img src="${product.thumbnail}" alt="${product.title}" />
              <h4>${product.title}</h4>
            </a>
            <p>${product.price}$</p>
          `;
          list.appendChild(div);
        });

        btnLoadMore.style.display =
          productsToShow < products.length ? "inline-block" : "none";
      }

      async function filterAndSearchProducts() {
        const minPrice =
          parseFloat(document.getElementById("minPrice").value) || 0;
        const maxPrice =
          parseFloat(document.getElementById("maxPrice").value) || Infinity;
        const searchQuery = document
          .getElementById("searchInput")
          .value.toLowerCase();

        let filtered = [];

        if (currentCategory) {
          try {
            const res = await fetch(
              `https://dummyjson.com/products/category/${encodeURIComponent(
                currentCategory
              )}`
            );
            const data = await res.json();
            filtered = data.products;
          } catch (error) {
            console.error("Lỗi lọc theo danh mục:", error);
          }
        } else {
          filtered = allProducts;
        }

        filtered = filtered.filter(
          (p) =>
            p.price >= minPrice &&
            p.price <= maxPrice &&
            p.title.toLowerCase().includes(searchQuery)
        );

        filtered.sort((a, b) => a.price - b.price);

        currentFilteredProducts = filtered;
        productsToShow = 30;
        displayProducts(filtered);
      }

      document.addEventListener("DOMContentLoaded", () => {
        renderCategories();
        fetchProducts();

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

        document.getElementById("btnLoadMore").addEventListener("click", () => {
          productsToShow += 20;
          displayProducts(currentFilteredProducts);
        });

        document.getElementById("siteTitle").addEventListener("click", () => {
          location.reload();
        });

        document.getElementById("btnViewCart").addEventListener("click", () => {
          window.location.href = "cart.html";
        });
      });