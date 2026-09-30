import axios from "axios";
import authService from "./authService";

const API_URL = "http://localhost:5000/api/theatres";

const getAuthConfig = () => ({
    headers: {
        Authorization: `Bearer ${authService.getToken()}`
    }
});

// =======================
// PUBLIC ROUTES
// =======================

// Get All Theatres
const getTheatres = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

// Get Single Theatre
const getTheatre = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

// =======================
// ADMIN ROUTES
// =======================

// Add Theatre
const addTheatre = async (theatreData) => {
    const response = await axios.post(
        API_URL,
        theatreData,
        getAuthConfig()
    );

    return response.data;
};

// Update Theatre
const updateTheatre = async (id, theatreData) => {
    const response = await axios.put(
        `${API_URL}/${id}`,
        theatreData,
        getAuthConfig()
    );

    return response.data;
};

// Delete Theatre
const deleteTheatre = async (id) => {
    const response = await axios.delete(
        `${API_URL}/${id}`,
        getAuthConfig()
    );

    return response.data;
};

const theatreService = {
    getTheatres,
    getTheatre,
    addTheatre,
    updateTheatre,
    deleteTheatre
};

export default theatreService;