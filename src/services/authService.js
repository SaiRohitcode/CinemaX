import axios from "../api/axios";

const registerUser = async (userData) => {
    const response = await axios.post("/auth/register", userData);
    return response.data;
};

const loginUser = async (userData) => {
    const response = await axios.post("/auth/login", userData);

    if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
};

const getProfile = async () => {
    const token = localStorage.getItem("token");

    const response = await axios.get("/auth/profile", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data;
};

const updateProfile = async (profileData) => {
    const token = localStorage.getItem("token");

    const response = await axios.put(
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

const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};

const authService = {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    logoutUser
};

export default authService;