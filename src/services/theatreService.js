import axios from "../api/axios";

const getTheatres = async () => {
    const response = await axios.get("/theatres");
    return response.data;
};

const getTheatreById = async (id) => {
    const response = await axios.get(`/theatres/${id}`);
    return response.data;
};

const theatreService = {
    getTheatres,
    getTheatreById
};

export default theatreService;