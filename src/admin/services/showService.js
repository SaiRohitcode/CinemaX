import axios from "axios";
import authService from "./authService";

const API_URL = "http://localhost:5000/api/shows";

const getAuthConfig = () => ({
    headers: {
        Authorization: `Bearer ${authService.getToken()}`
    }
});

// =======================
// PUBLIC ROUTES
// =======================

// Get All Shows
const getShows = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

// Get Single Show
const getShow = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

// Get Shows By Movie
const getShowsByMovie = async (movieId) => {
    const response = await axios.get(
        `${API_URL}/movie/${movieId}`
    );
    return response.data;
};

// =======================
// ADMIN ROUTES
// =======================

// Create Show
const addShow = async (showData) => {
    const response = await axios.post(
        API_URL,
        showData,
        getAuthConfig()
    );

    return response.data;
};

// Update Show
const updateShow = async (id, showData) => {
    const response = await axios.put(
        `${API_URL}/${id}`,
        showData,
        getAuthConfig()
    );

    return response.data;
};

// Delete Show
const deleteShow = async (id) => {
    const response = await axios.delete(
        `${API_URL}/${id}`,
        getAuthConfig()
    );

    return response.data;
};

const showService = {
    getShows,
    getShow,
    getShowsByMovie,
    addShow,
    updateShow,
    deleteShow
};

export default showService;