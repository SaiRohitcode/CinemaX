import axios from "../api/axios";

const getShows = async () => {
    const response = await axios.get("/shows");
    return response.data;
};

const getShowById = async (id) => {
    const response = await axios.get(`/shows/${id}`);
    return response.data;
};

const getShowsByMovie = async (movieId) => {
    const response = await axios.get(`/shows/movie/${movieId}`);
    return response.data;
};

const getShowSeats = async (showId) => {
    const response = await axios.get(`/shows/${showId}/seats`);
    return response.data;
};

const showService = {
    getShows,
    getShowById,
    getShowsByMovie,
    getShowSeats
};

export default showService;