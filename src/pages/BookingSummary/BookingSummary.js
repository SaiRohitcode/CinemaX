import "./BookingSummary.css";
import { useLocation, useNavigate } from "react-router-dom";

function BookingSummary() {
    const navigate = useNavigate();
    const { state } = useLocation();

    if (!state) {
        return <h2>No Booking Details Found</h2>;
    }

    const {
        movie,
        theatre,
        show,
        language,
        showTime,
        selectedDate,
        day,
        selectedSeats = [],
        selectedSeatDetails = []
    } = state;

    const screen = show?.screen?.name || show?.screen || "N/A";
    const format = show?.format || "N/A";

    const convenienceFee = 40;
    const gst = 18;

    const subtotal = selectedSeatDetails.reduce(
        (total, seat) => total + Number(seat.price || 0),
        0
    );

    const totalPrice = subtotal + convenienceFee + gst;

    const proceedToPayment = () => {
        navigate("/payment", {
            state: {
                movie,
                theatre,
                show,
                screen,
                language,
                format,
                showTime,
                selectedDate,
                date: selectedDate,
                day,
                selectedSeats,
                selectedSeatDetails,
                convenienceFee,
                gst,
                subtotal,
                totalPrice
            }
        });
    };

    return (
        <div className="summary-page">
            <div className="summary-card">
                <h2>Booking Summary</h2>

                <div className="summary-row">
                    <span>Movie</span>
                    <span>{movie?.title || "N/A"}</span>
                </div>

                <div className="summary-row">
                    <span>Theatre</span>
                    <span>{theatre?.name || "N/A"}</span>
                </div>

                {theatre?.googleMapsLink && (
                    <div className="summary-row">
                        <span>Location</span>
                        <a
                            href={theatre.googleMapsLink}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            View on Google Maps
                        </a>
                    </div>
                )}

                <div className="summary-row">
                    <span>Screen</span>
                    <span>{screen}</span>
                </div>

                <div className="summary-row">
                    <span>Language</span>
                    <span>{language || show?.language || "N/A"}</span>
                </div>

                <div className="summary-row">
                    <span>Format</span>
                    <span>{format}</span>
                </div>

                <div className="summary-row">
                    <span>Date</span>
                    <span>
                        {day ? `${day}, ` : ""}
                        {selectedDate || "N/A"}
                    </span>
                </div>

                <div className="summary-row">
                    <span>Show Time</span>
                    <span>{showTime || show?.showTime || "N/A"}</span>
                </div>

                <div className="summary-row">
                    <span>Seats</span>
                    <span>{selectedSeats.join(", ") || "N/A"}</span>
                </div>

                <hr />

                {selectedSeatDetails.map(seat => (
                    <div
                        className="summary-row"
                        key={seat.seatId}
                    >
                        <span>
                            {seat.section}-{seat.row}{seat.number}
                        </span>
                        <span>₹{seat.price}</span>
                    </div>
                ))}

                <div className="summary-row">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                </div>

                <div className="summary-row">
                    <span>Convenience Fee</span>
                    <span>₹{convenienceFee}</span>
                </div>

                <div className="summary-row">
                    <span>GST</span>
                    <span>₹{gst}</span>
                </div>

                <hr />

                <div className="summary-total">
                    <span>Total</span>
                    <span>₹{totalPrice}</span>
                </div>

                <button
                    className="pay-btn"
                    onClick={proceedToPayment}
                >
                    Proceed to Payment
                </button>
            </div>
        </div>
    );
}

export default BookingSummary;