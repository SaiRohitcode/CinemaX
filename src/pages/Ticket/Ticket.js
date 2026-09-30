import "./Ticket.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import QRCode from "react-qr-code";
import api from "../../api/axios";

function Ticket() {

    const navigate = useNavigate();
    const { bookingId } = useParams();

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchTicket = async () => {

            try {

                const token = localStorage.getItem("token");

                const response = await api.get("/bookings", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const ticket = response.data.find(
                    (b) =>
                        b.bookingId === bookingId ||
                        b._id === bookingId
                );

                setBooking(ticket);

            }

            catch (error) {

                console.log(error);

            }

            finally {

                setLoading(false);

            }

        };

        fetchTicket();

    }, [bookingId]);

    if (loading) {

        return (
            <div className="ticket-page">
                <h1>Loading Ticket...</h1>
            </div>
        );

    }

    if (!booking) {

        return (
            <div className="ticket-page">

                <h1>Ticket Not Found</h1>

                <button
                    className="ticket-home-btn"
                    onClick={() => navigate("/bookings")}
                >
                    Back to My Bookings
                </button>

            </div>
        );

    }

    return (

        <div className="ticket-page">

            <div className="ticket-card">

                <div className="ticket-header">

                    <h1>CinemaX</h1>

                    <p>Your Movie Ticket</p>

                </div>

                <div className="ticket-content">

                    <img
                        src={booking.moviePoster}
                        alt={booking.movieName}
                        className="ticket-poster"
                    />

                    <div className="ticket-info">

                        <div className="ticket-row">
                            <span>Movie</span>
                            <strong>{booking.movieName}</strong>
                        </div>

                        <div className="ticket-row">
                            <span>Theatre</span>
                            <strong>{booking.theatre}</strong>
                        </div>

                        <div className="ticket-row">
                            <span>Screen</span>
                            <strong>{booking.screen}</strong>
                        </div>

                        <div className="ticket-row">
                            <span>Language</span>
                            <strong>{booking.language}</strong>
                        </div>

                        <div className="ticket-row">
                            <span>Format</span>
                            <strong>{booking.format}</strong>
                        </div>

                        <div className="ticket-row">
                            <span>Date</span>
                            <strong>{booking.day}, {booking.date}</strong>
                        </div>

                        <div className="ticket-row">
                            <span>Show Time</span>
                            <strong>{booking.showTime}</strong>
                        </div>

                        <div className="ticket-row">
                            <span>Seats</span>
                            <strong>
                                {booking.seats && booking.seats.join(", ")}
                            </strong>
                        </div>

                        <div className="ticket-row">
                            <span>Tickets</span>
                            <strong>{booking.numberOfSeats}</strong>
                        </div>

                        <div className="ticket-row">
                            <span>Status</span>
                            <strong>{booking.bookingStatus}</strong>
                        </div>

                        <div className="ticket-row">
                            <span>Booking ID</span>
                            <strong>{booking.bookingId}</strong>
                        </div>

                        <div className="ticket-row">
                            <span>Booked On</span>
                            <strong>
                                {booking.bookedAt
                                    ? new Date(booking.bookedAt).toLocaleString()
                                    : "N/A"}
                            </strong>
                        </div>

                        <div className="ticket-row">
                            <span>Total Paid</span>
                            <strong>₹{booking.totalPrice}</strong>
                        </div>

                    </div>

                </div>

                <div className="ticket-qr">

                    <QRCode
                        value={JSON.stringify({
                            bookingId: booking.bookingId,
                            movie: booking.movieName,
                            theatre: booking.theatre,
                            screen: booking.screen,
                            language: booking.language,
                            format: booking.format,
                            date: booking.date,
                            showTime: booking.showTime,
                            seats: booking.seats,
                            amount: booking.totalPrice
                        })}
                        size={170}
                    />

                    <p>
                        Show this QR code at the theatre entrance.
                    </p>

                </div>

            </div>

            <button
                className="ticket-home-btn"
                onClick={() => navigate("/bookings")}
            >
                Back to My Bookings
            </button>

        </div>

    );

}

export default Ticket;