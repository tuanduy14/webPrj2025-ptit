console.log('ngu');
const BE_URL = "http://localhost:5000"
const formRegister = document.getElementById('register-form');

formRegister.addEventListener('submit', (e) => {
    e.preventDefault(); // Ngăn trình duyệt reload lại trang

    const username = formRegister.username.value.trim();
    const password = formRegister.password.value;
    const rePassword = formRegister.rePassword.value;

    if (rePassword != password) {
      alert('Nhập lại mật khẩu không đúng')
      return
    }

    // In ra console (hoặc bạn có thể gửi lên server tại đây)
    console.log("Username:", username);
    // console.log("Password:", password);



    // Sau này: gửi request login lên server ở đây
    fetch(`${BE_URL}/user/register`, {
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
    }).then(data => {
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('user', data.user);
        alert("Đăng ký thành công")
        window.location.href = '/';
    }).catch(e => {
        alert(e)
        console.log(e);
        throw new Error(e)
    })
});


