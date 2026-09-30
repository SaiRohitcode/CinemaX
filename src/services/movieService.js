import axios from "../api/axios";

const getMovies = async () => {
    const response = await axios.get("/movies");
    return response.data;
};

const getMovieById = async (id) => {
    const response = await axios.get(`/movies/${id}`);
    return response.data;
};

const movieService = {
    getMovies,
    getMovieById
};

export default movieService;