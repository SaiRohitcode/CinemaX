import axios from "axios";
import authService from "./authService";

const API_URL = "http://localhost:5000/api/users";

const getAuthConfig = () => ({
    headers: {
        Authorization: `Bearer ${authService.getToken()}`
    }
});

const getUsers = async () => {
    const response = await axios.get(
        API_URL,
        getAuthConfig()
    );
    return response.data;
};

const getUser = async (id) => {
    const response = await axios.get(
        `${API_URL}/${id}`,
        getAuthConfig()
    );
    return response.data;
};

const toggleUserStatus = async (id) => {
    const response = await axios.put(
        `${API_URL}/${id}/status`,
        {},
        getAuthConfig()
    );
    return response.data;
};

const deleteUser = async (id) => {
    const response = await axios.delete(
        `${API_URL}/${id}`,
        getAuthConfig()
    );
    return response.data;
};

const userService = {
    getUsers,
    getUser,
    toggleUserStatus,
    deleteUser
};

export default userService;