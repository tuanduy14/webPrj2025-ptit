console.log('ngu');

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');

    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Ngăn trình duyệt reload lại trang

        const username = form.username.value.trim();
        const password = form.password.value;

        // In ra console (hoặc bạn có thể gửi lên server tại đây)
        console.log("Username:", username);
        // console.log("Password:", password);

        // Demo: Hiển thị alert
        alert(`Đăng nhập với:\nUsername: ${username}`);

        // Sau này: gửi request login lên server ở đây
        // fetch('/api/login', { method: 'POST', body: JSON.stringify({ username, password }) })
    });
});