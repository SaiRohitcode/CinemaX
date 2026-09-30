import { useEffect, useState } from "react";

import AdminLayout from "../components/AdminLayout";
import bookingService from "../services/bookingService";

import "../css/admin.css";
import "../css/table.css";

function Bookings() {

    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {

        try {

            const data = await bookingService.getBookings();

            setBookings(data.bookings || data);

        } catch (err) {

            console.log(err);

            alert(
                err.response?.data?.message ||
                "Unable to fetch bookings."
            );

        }

    };

    const handleCancel = async (id) => {

        const confirmCancel = window.confirm(
            "Are you sure you want to cancel this booking?"
        );

        if (!confirmCancel) {
            return;
        }

        try {

            await bookingService.cancelBooking(id);

            fetchBookings();

        } catch (err) {

            alert(
                err.response?.data?.message ||
                "Unable to cancel booking."
            );

        }

    };

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this booking?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            await bookingService.deleteBooking(id);

            fetchBookings();

        } catch (err) {

            alert(
                err.response?.data?.message ||
                "Unable to delete booking."
            );

        }

    };

    return (

        <AdminLayout>

            <div className="table-container">

                <div className="table-header">

                    <h2>Bookings</h2>

                </div>

                <table className="admin-table">

                    <thead>

                        <tr>

                            <th>Booking ID</th>
                            <th>User</th>
                            <th>Movie</th>
                            <th>Theatre</th>
                            <th>Show</th>
                            <th>Seats</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Actions</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            bookings.length === 0 ?

                                (

                                    <tr>

                                        <td
                                            colSpan="9"
                                            style={{ textAlign: "center" }}
                                        >

                                            No Bookings Found

                                        </td>

                                    </tr>

                                )

                                :

                                (

                                    bookings.map((booking) => (

                                        <tr key={booking._id}>

                                            <td>{booking._id}</td>

                                            <td>
                                                {booking.user?.name || "N/A"}
                                            </td>

                                            <td>
                                                {booking.movie?.title || "N/A"}
                                            </td>

                                            <td>
                                                {booking.theatre?.name || "N/A"}
                                            </td>

                                            <td>

                                                {booking.show?.showDate}

                                                <br />

                                                {booking.show?.showTime}

                                            </td>

                                            <td>

                                                {

                                                    Array.isArray(booking.seats)

                                                        ? booking.seats.join(", ")

                                                        : booking.seats

                                                }

                                            </td>

                                            <td>

                                                ₹{booking.totalAmount}

                                            </td>

                                            <td>

                                                {booking.status}

                                            </td>

                                            <td>

                                                <button
                                                    className="btn btn-warning"
                                                    onClick={() => handleCancel(booking._id)}
                                                >
                                                    Cancel
                                                </button>

                                                <button
                                                    className="btn btn-danger"
                                                    onClick={() => handleDelete(booking._id)}
                                                >
                                                    Delete
                                                </button>

                                            </td>

                                        </tr>

                                    ))

                                )

                        }

                    </tbody>

                </table>

            </div>

        </AdminLayout>

    );

}

export default Bookings;