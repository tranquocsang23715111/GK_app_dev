async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const res = await fetch(API_URL + "/auth/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (res.ok) {
        localStorage.setItem("token", data.access_token);
        window.location.href = "gallery.html";
    } else {
        alert("Sai tài khoản hoặc mật khẩu");
    }
}

async function register() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const confirm = document.getElementById("confirm").value;

    if (password !== confirm) {
        alert("Mật khẩu không khớp");
        return;
    }

    const res = await fetch(API_URL + "/auth/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ username, password })
    });

    if (res.ok) {
        alert("Đăng kí thành công");
        window.location.href = "login.html";
    } else {
        alert("Đăng kí thất bại");
    }
}