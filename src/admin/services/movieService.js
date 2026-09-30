import axios from "axios";
import authService from "./authService";

const API_URL = "http://localhost:5000/api/movies";

const getAuthConfig = () => ({
    headers: {
        Authorization: `Bearer ${authService.getToken()}`
    }
});

// =======================
// PUBLIC ROUTES
// =======================

// Get All Movies
const getMovies = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

// Get Single Movie
const getMovie = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

// =======================
// ADMIN ROUTES
// =======================

// Add Movie
const addMovie = async (movieData) => {
    const response = await axios.post(
        API_URL,
        movieData,
        getAuthConfig()
    );

    return response.data;
};

// Update Movie
const updateMovie = async (id, movieData) => {
    const response = await axios.put(
        `${API_URL}/${id}`,
        movieData,
        getAuthConfig()
    );

    return response.data;
};

// Delete Movie
const deleteMovie = async (id) => {
    const response = await axios.delete(
        `${API_URL}/${id}`,
        getAuthConfig()
    );

    return response.data;
};

const movieService = {
    getMovies,
    getMovie,
    addMovie,
    updateMovie,
    deleteMovie
};

export default movieService;