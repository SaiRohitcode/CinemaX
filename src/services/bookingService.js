import axios from "../api/axios";

const getAuthConfig = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    }
});

const createBooking = async (bookingData) => {
    const response = await axios.post(
        "/bookings",
        bookingData,
        getAuthConfig()
    );

    return response.data;
};

const getMyBookings = async () => {
    const response = await axios.get(
        "/bookings/my",
        getAuthConfig()
    );

    return response.data;
};

const getBookingById = async (id) => {
    const response = await axios.get(
        `/bookings/${id}`,
        getAuthConfig()
    );

    return response.data;
};

const cancelBooking = async (id) => {
    const response = await axios.put(
        `/bookings/${id}/cancel`,
        {},
        getAuthConfig()
    );

    return response.data;
};

const bookingService = {
    createBooking,
    getMyBookings,
    getBookingById,
    cancelBooking
};

export default bookingService;