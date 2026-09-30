import axios from "axios";

const API_URL = "http://localhost:5000/api/screens";

const getAuthConfig = () => {

    const token = localStorage.getItem("adminToken");

    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

};

const getScreens = async () => {

    const response = await axios.get(
        API_URL,
        getAuthConfig()
    );

    return response.data;

};

const getScreen = async (id) => {

    const response = await axios.get(
        `${API_URL}/${id}`,
        getAuthConfig()
    );

    return response.data;

};

const addScreen = async (screenData) => {

    const response = await axios.post(
        API_URL,
        screenData,
        getAuthConfig()
    );

    return response.data;

};

const updateScreen = async (id, screenData) => {

    const response = await axios.put(
        `${API_URL}/${id}`,
        screenData,
        getAuthConfig()
    );

    return response.data;

};

const deleteScreen = async (id) => {

    const response = await axios.delete(
        `${API_URL}/${id}`,
        getAuthConfig()
    );

    return response.data;

};

const screenService = {
    getScreens,
    getScreen,
    addScreen,
    updateScreen,
    deleteScreen
};

export default screenService;