
let images = [];
let selected = new Set();

// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {

    console.log("DOM LOADED");

    // check login
    if (!localStorage.getItem("token")) {
        window.location.href = "login.html";
        return;
    }

    // ===== LẤY ELEMENT =====
    const uploadBtn = document.getElementById("uploadBtn");
    const deleteBtn = document.getElementById("deleteBtn");
    const searchInput = document.getElementById("search");
    const logoutBtn = document.getElementById("logoutBtn");

    console.log({ uploadBtn, deleteBtn, searchInput, logoutBtn });

    // ===== CHECK NULL =====
    if (!uploadBtn || !deleteBtn || !searchInput || !logoutBtn) {
        console.error("❌ HTML thiếu id hoặc sai id!");
        return;
    }

    // ===== BIND EVENT =====
    uploadBtn.addEventListener("click", upload);
    deleteBtn.addEventListener("click", deleteSelected);
    searchInput.addEventListener("input", searchImage);
    logoutBtn.addEventListener("click", logout);

    loadImages();
});

// ===== AUTH =====
function authHeader() {
    return {
        "Authorization": "Bearer " + localStorage.getItem("token")
    };
}

// ===== LOGOUT =====
function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

// ===== LOAD =====
async function loadImages() {
    const res = await fetch(API_URL + "/photo/", {
        headers: authHeader()
    });

    images = await res.json();
    render(images);
}

// ===== RENDER =====
function render(data) {
    const list = document.getElementById("list");
    list.innerHTML = "";

    data.forEach(img => {
        const div = document.createElement("div");
        div.className = "card-image";

        div.innerHTML = `
            <input type="checkbox" class="chk" data-id="${img.id}">
            <img src="${API_URL}/${img.image_url}">
            <div class="info">
                <h4>${img.title}</h4>
                <p>${img.description}</p>
                <button class="delete-btn" data-id="${img.id}">Xóa</button>
            </div>
        `;

        list.appendChild(div);
    });

    // bind delete
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", () => deleteOne(btn.dataset.id));
    });

    // bind checkbox
    document.querySelectorAll(".chk").forEach(chk => {
        chk.addEventListener("change", () => toggle(chk.dataset.id));
    });
}

// ===== SELECT =====
function toggle(id) {
    id = Number(id);
    if (selected.has(id)) selected.delete(id);
    else selected.add(id);
}

// ===== UPLOAD =====
async function upload() {
    const title = document.getElementById("title").value;
    const description = document.getElementById("desc").value;
    const fileInput = document.getElementById("file");

    if (!fileInput.files.length) {
        alert("Chọn ảnh!");
        return;
    }

    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);

    const res = await fetch(API_URL + "/photo/", {
        method: "POST",
        headers: authHeader(),
        body: formData
    });

    if (res.ok) {
        alert("Upload thành công!");
        loadImages();
    } else {
        alert("Upload lỗi!");
    }
}

// ===== DELETE ONE =====
async function deleteOne(id) {
    await fetch(API_URL + "/photo/" + id, {
        method: "DELETE",
        headers: authHeader()
    });

    loadImages();
}

// ===== DELETE MULTI =====
async function deleteSelected() {
    for (let id of selected) {
        await fetch(API_URL + "/photo/" + id, {
            method: "DELETE",
            headers: authHeader()
        });
    }

    selected.clear();
    loadImages();
}

// ===== SEARCH =====
function searchImage() {
    const key = document.getElementById("search").value.toLowerCase();

    const filtered = images.filter(img =>
        img.title.toLowerCase().includes(key) ||
        img.description.toLowerCase().includes(key)
    );

    render(filtered);
}