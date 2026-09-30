import axios from "axios";

const API_URL = "http://localhost:5000/api/bookings";

const getAuthConfig = () => {

    const token = localStorage.getItem("adminToken");

    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

};

const getBookings = async () => {

    const response = await axios.get(
        API_URL,
        getAuthConfig()
    );

    return response.data;

};

const getBooking = async (id) => {

    const response = await axios.get(
        `${API_URL}/${id}`,
        getAuthConfig()
    );

    return response.data;

};

const cancelBooking = async (id) => {

    const response = await axios.put(
        `${API_URL}/${id}/cancel`,
        {},
        getAuthConfig()
    );

    return response.data;

};

const deleteBooking = async (id) => {

    const response = await axios.delete(
        `${API_URL}/${id}`,
        getAuthConfig()
    );

    return response.data;

};

const bookingService = {
    getBookings,
    getBooking,
    cancelBooking,
    deleteBooking
};

export default bookingService;