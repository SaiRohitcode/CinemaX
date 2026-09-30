import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api"
});

// ================= USER =================

// Register
export const registerUser = async (userData) => {
    const response = await API.post("/auth/register", userData);
    return response.data;
};

// Login
export const loginUser = async (userData) => {
    const response = await API.post("/auth/login", userData);

    if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
};

// Get Profile
export const getProfile = async () => {

    const token = localStorage.getItem("token");

    const response = await API.get("/auth/profile", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data;
};

// Update Profile
export const updateProfile = async (profileData) => {

    const token = localStorage.getItem("token");

    const response = await API.put(
        "/auth/profile",
        profileData,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};

// Logout
export const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};

// ================= ADMIN =================

// Admin Login
export const adminLogin = async (loginData) => {

    const response = await API.post("/admin/login", loginData);

    if (response.data.token) {
        localStorage.setItem("adminToken", response.data.token);
        localStorage.setItem("admin", JSON.stringify(response.data.admin));
    }

    return response.data;
};

// Admin Logout
export const adminLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
};

export const getToken = () => {
    return localStorage.getItem("adminToken");
};

const authService = {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    logoutUser,
    adminLogin,
    adminLogout,
    getToken
};

export default authService;