const API_URL = "http://127.0.0.1:8000";

function getToken() {
    return localStorage.getItem("token");
}

function authHeader() {
    return {
        "Authorization": "Bearer " + getToken(),
        "Content-Type": "application/json"
    };
}