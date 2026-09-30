import "./BookingConfirmation.css";
import { useLocation, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";

function BookingConfirmation() {
    const navigate = useNavigate();
    const { state } = useLocation();

    if (!state || !state.booking) {
        return (
            <div className="confirmation-page">
                <h2>No Booking Found</h2>
            </div>
        );
    }

    const { booking } = state;

    const printTicket = () => {
        window.print();
    };

    const downloadTicket = () => {
        const printWindow = window.open("", "_blank");

        if (!printWindow) {
            alert("Please allow pop-ups to download the ticket.");
            return;
        }

        const ticket = document.querySelector(".ticket");

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Ticket - ${booking.bookingId}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background: #fff;
                        color: #222;
                        padding: 30px;
                    }
                    .ticket {
                        max-width: 650px;
                        margin: auto;
                        padding: 30px;
                        border: 1px solid #ccc;
                        border-radius: 10px;
                    }
                    .ticket-header {
                        text-align: center;
                        margin-bottom: 25px;
                    }
                    .ticket-row {
                        display: flex;
                        justify-content: space-between;
                        gap: 20px;
                        padding: 8px 0;
                        border-bottom: 1px solid #eee;
                    }
                    .ticket-row span {
                        color: #666;
                    }
                    .ticket-row strong {
                        text-align: right;
                    }
                    .qr-section {
                        text-align: center;
                        margin-top: 25px;
                    }
                    .qr-box {
                        display: inline-block;
                    }
                    .ticket-footer {
                        margin-top: 20px;
                    }
                    a {
                        color: #0066cc;
                    }
                </style>
            </head>
            <body>
                ${ticket?.outerHTML || ""}
            </body>
            </html>
        `);

        printWindow.document.close();

        printWindow.onload = () => {
            printWindow.print();
            printWindow.close();
        };
    };

    return (
        <div className="confirmation-page">
            <div className="ticket">
                <div className="ticket-header">
                    <h1>🎉 Booking Confirmed</h1>
                    <p>Enjoy your movie!</p>
                </div>

                <div className="ticket-body">
                    <div className="ticket-row">
                        <span>Booking ID</span>
                        <strong>{booking.bookingId}</strong>
                    </div>

                    <div className="ticket-row">
                        <span>Movie</span>
                        <strong>{booking.movie?.title || "N/A"}</strong>
                    </div>

                    <div className="ticket-row">
                        <span>Theatre</span>
                        <strong>{booking.theatre?.name || "N/A"}</strong>
                    </div>

                    {booking.theatre?.googleMapsLink && (
                        <div className="ticket-row">
                            <span>Location</span>
                            <a
                                href={booking.theatre.googleMapsLink}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                View on Google Maps
                            </a>
                        </div>
                    )}

                    <div className="ticket-row">
                        <span>Screen</span>
                        <strong>
                            {booking.screen?.name || "N/A"}
                        </strong>
                    </div>

                    <div className="ticket-row">
                        <span>Date</span>
                        <strong>
                            {booking.show?.date
                                ? new Date(
                                      booking.show.date
                                  ).toLocaleDateString()
                                : "-"}
                        </strong>
                    </div>

                    <div className="ticket-row">
                        <span>Show Time</span>
                        <strong>
                            {booking.show?.showTime || "-"}
                        </strong>
                    </div>

                    <div className="ticket-row">
                        <span>Language</span>
                        <strong>
                            {booking.show?.language || "-"}
                        </strong>
                    </div>

                    <div className="ticket-row">
                        <span>Format</span>
                        <strong>
                            {booking.show?.format || "-"}
                        </strong>
                    </div>

                    <div className="ticket-row">
                        <span>Seats</span>
                        <strong>
                            {booking.seats?.join(", ") || "-"}
                        </strong>
                    </div>

                    <div className="ticket-row">
                        <span>No. of Seats</span>
                        <strong>
                            {booking.numberOfSeats ||
                                booking.seats?.length ||
                                0}
                        </strong>
                    </div>

                    <div className="ticket-row">
                        <span>Ticket Price</span>
                        <strong>
                            ₹{booking.ticketPrice || 0}
                        </strong>
                    </div>

                    <div className="ticket-row">
                        <span>Convenience Fee</span>
                        <strong>
                            ₹{booking.convenienceFee || 0}
                        </strong>
                    </div>

                    <div className="ticket-row">
                        <span>GST</span>
                        <strong>
                            ₹{booking.gst || 0}
                        </strong>
                    </div>

                    <div className="ticket-row">
                        <span>Total Paid</span>
                        <strong>
                            ₹{booking.totalPrice || 0}
                        </strong>
                    </div>

                    <div className="ticket-row">
                        <span>Payment Method</span>
                        <strong>
                            {booking.paymentMethod || "-"}
                        </strong>
                    </div>

                    <div className="ticket-row">
                        <span>Booking Status</span>
                        <strong>
                            {booking.bookingStatus || "-"}
                        </strong>
                    </div>

                    <div className="ticket-row">
                        <span>Payment Status</span>
                        <strong>
                            {booking.paymentStatus || "-"}
                        </strong>
                    </div>
                </div>

                <div className="qr-section">
                    <div className="qr-box">
                        <QRCode
                            value={JSON.stringify({
                                bookingId: booking.bookingId,
                                movie: booking.movie?.title,
                                theatre: booking.theatre?.name,
                                screen: booking.screen?.name,
                                date: booking.show?.date,
                                showTime: booking.show?.showTime,
                                seats: booking.seats,
                                totalAmount: booking.totalPrice,
                                paymentMethod:
                                    booking.paymentMethod
                            })}
                            size={150}
                        />
                    </div>

                    <p>
                        Show this QR Code at the theatre entrance.
                    </p>
                </div>

                <div className="ticket-footer">
                    <div className="ticket-row">
                        <span>Booked On</span>
                        <strong>
                            {booking.createdAt
                                ? new Date(
                                      booking.createdAt
                                  ).toLocaleString()
                                : "-"}
                        </strong>
                    </div>
                </div>
            </div>

            <div className="confirmation-buttons">
                <button
                    className="home-btn"
                    onClick={downloadTicket}
                >
                    Download Ticket
                </button>

                <button
                    className="home-btn"
                    onClick={printTicket}
                >
                    Print Ticket
                </button>

                <button
                    className="home-btn"
                    onClick={() => navigate("/bookings")}
                >
                    View My Bookings
                </button>

                <button
                    className="home-btn"
                    onClick={() => navigate("/")}
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
}

export default BookingConfirmation;