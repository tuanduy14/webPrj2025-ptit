console.log('ngu');
const BE_URL = "http://localhost:5000"

const formLogin = document.getElementById('login-form');

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

formLogin.addEventListener('submit', (e) => {
    e.preventDefault(); // Ngăn trình duyệt reload lại trang

    const username = formLogin.username.value.trim();
    const password = formLogin.password.value;

    // In ra console (hoặc bạn có thể gửi lên server tại đây)
    console.log("Username:", username);
    // console.log("Password:", password);



    // Sau này: gửi request login lên server ở đây
    fetch(`${BE_URL}/user/login`, {
        method: 'POST', headers: {
            'Content-Type': 'application/json'
        }, body: JSON.stringify({ username, password })
    }).then(res => {
        if (!res.ok) {
            // Throw an error if HTTP status is not OK (200–299)
            return res.json().then(err => {
                throw new Error(err.message || `HTTP error ${res.status}`);
            });
        }
        return res.json();
    }).then(async (data) => {
        localStorage.setItem('user', JSON.stringify(data.user));
        // console.log('user', data.user);
        console.log('storage user: ', JSON.parse(localStorage.getItem('user')));
        let user = data.user

        let cartArr = [];

        if (Array.isArray(user.cart)) {
            for (const el of user.cart) {
                const product = await fetchProduct(el.productId);
                console.log(product);
                cartArr.push({ ...product, quantity: el.quantity });
            }
            localStorage.setItem('cart', JSON.stringify(cartArr))
            console.log('cart: ', cartArr)
        }

        alert("Đăng nhập thành công")
        window.location.href = '/';
    }).catch(e => {
        alert(e)
        console.log(e);
        throw new Error(e)
    })
});

