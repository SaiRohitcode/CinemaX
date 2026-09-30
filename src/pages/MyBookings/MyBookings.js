import "./MyBookings.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

function MyBookings() {

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {

        const fetchBookings = async () => {

            try {

                const token = localStorage.getItem("token");

                const response = await api.get("/bookings", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setBookings(response.data);

            }

            catch (error) {

                console.log(error);

            }

            finally {

                setLoading(false);

            }

        };

        fetchBookings();

    }, []);

    if (loading) {

        return (

            <div className="bookings-page">

                <h1>Loading Bookings...</h1>

            </div>

        );

    }

    return (

        <div className="bookings-page">

            <h1>My Bookings</h1>

            {

                bookings.length === 0 ?

                    (

                        <div className="empty-bookings">

                            No bookings found.

                        </div>

                    )

                    :

                    (

                        bookings.map((booking) => (

                            <div
                                className="booking-card"
                                key={booking._id}
                            >

                                <img
                                    src={booking.moviePoster}
                                    alt={booking.movieName}
                                    className="booking-poster"
                                />

                                <div className="movie-details">

                                    <h2>{booking.movieName}</h2>

                                    <p>
                                        <strong>Theatre :</strong> {booking.theatre}
                                    </p>

                                    <p>
                                        <strong>Screen :</strong> {booking.screen}
                                    </p>

                                    <p>
                                        <strong>Language :</strong> {booking.language}
                                    </p>

                                    <p>
                                        <strong>Format :</strong> {booking.format}
                                    </p>

                                    <p>
                                        <strong>Date :</strong> {booking.date}
                                    </p>

                                    <p>
                                        <strong>Show Time :</strong> {booking.showTime}
                                    </p>

                                    <p>
                                        <strong>Seats :</strong>{" "}
                                        {
                                            booking.seats &&
                                            booking.seats.length > 0
                                                ? booking.seats.join(", ")
                                                : "N/A"
                                        }
                                    </p>

                                    <p>
                                        <strong>Tickets :</strong> {booking.numberOfSeats}
                                    </p>

                                    <p>
                                        <strong>Ticket No :</strong>{" "}
                                        {booking.bookingId || "Not Available"}
                                    </p>

                                    <p>
                                        <strong>Status :</strong>{" "}
                                        {booking.bookingStatus || "Confirmed"}
                                    </p>

                                    <p>
                                        <strong>Booked On :</strong>{" "}
                                        {
                                            booking.bookedAt
                                                ? new Date(booking.bookedAt).toLocaleString()
                                                : "N/A"
                                        }
                                    </p>

                                    <p className="price">
                                        <strong>Total Paid :</strong> ₹{booking.totalPrice}
                                    </p>

                                </div>

                                <button
                                    className="ticket-btn"
                                    onClick={() =>
                                        navigate(`/ticket/${booking.bookingId}`)
                                    }
                                >
                                    View Ticket
                                </button>

                            </div>

                        ))

                    )

            }

        </div>

    );

}

export default MyBookings;