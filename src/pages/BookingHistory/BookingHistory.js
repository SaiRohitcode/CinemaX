import "./BookingHistory.css";
import { useNavigate } from "react-router-dom";


function BookingHistory() {

    const navigate = useNavigate();

    let bookings = [];

    try {
        bookings =
            JSON.parse(localStorage.getItem("bookings")) || [];
    } catch {
        bookings = [];
    }

    return (

        <div className="booking-history">

            <h1 className="history-title">
                 Your Bookings
            </h1>

            {bookings.length === 0 ? (

                <div className="empty-bookings">

                    <h2>No Bookings Yet</h2>

                    <p>
                        Book your favourite movie and it will appear here.
                    </p>

                    <button
                        className="browse-btn"
                        onClick={() => navigate("/")}
                    >
                        Browse Movies
                    </button>

                </div>

            ) : (

                <div className="booking-container">

                    {bookings.map((booking) => {

                        const movie = movies.find(
                            (m) => m.id === booking.movieId
                        );

                        if (!movie) return null;

                        return (

                            <div
                                className="booking-card"
                                key={booking.bookingId}
                            >

                                <img
                                    src={movie.poster}
                                    alt={movie.title}
                                    className="booking-poster"
                                />

                                <div className="booking-info">

                                    <h2>{movie.title}</h2>

                                    <div className="history-booking-details">

                                        <p>
                                            <strong>Booking ID</strong>
                                            <span>{booking.bookingId}</span>
                                        </p>

                                        <p>
                                            <strong>Theatre</strong>
                                            <span>{booking.theatre}</span>
                                        </p>

                                        <p>
                                            <strong>Location</strong>
                                            <span>{booking.city}</span>
                                        </p>

                                        <p>
                                            <strong>Date</strong>
                                            <span>{booking.date}</span>
                                        </p>

                                        <p>
                                            <strong>Show Time</strong>
                                            <span>{booking.showTime}</span>
                                        </p>

                                        <p>
                                            <strong>Seats</strong>
                                            <span>{booking.seats.join(", ")}</span>
                                        </p>

                                        <p>
                                            <strong>Amount Paid</strong>
                                            <span>₹{booking.totalPrice}</span>
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

                            </div>

                        );

                    })}

                </div>

            )}

        </div>

    );

}

export default BookingHistory;