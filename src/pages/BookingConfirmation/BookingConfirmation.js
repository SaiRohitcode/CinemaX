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
                    body{
                        font-family:Arial,sans-serif;
                        background:#fff;
                        color:#222;
                        padding:30px;
                    }
                    .ticket{
                        max-width:750px;
                        margin:auto;
                        padding:25px;
                        border:1px solid #ccc;
                        border-radius:10px;
                    }
                    .ticket-header{
                        text-align:center;
                        margin-bottom:20px;
                    }
                    .ticket-body{
                        display:grid;
                        grid-template-columns:1fr 1fr;
                        gap:0 20px;
                    }
                    .ticket-row{
                        display:flex;
                        justify-content:space-between;
                        gap:20px;
                        padding:7px 0;
                        border-bottom:1px solid #eee;
                    }
                    .ticket-row span{
                        color:#666;
                    }
                    .ticket-row strong{
                        text-align:right;
                    }
                    .qr-section{
                        text-align:center;
                        margin-top:20px;
                    }
                    .qr-box{
                        display:inline-block;
                    }
                    .qr-box svg{
                        width:100px!important;
                        height:100px!important;
                    }
                    .ticket-footer{
                        margin-top:15px;
                    }
                    .confirmation-buttons{
                        display:none;
                    }
                    a{
                        color:#0066cc;
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
                    <div className="ticket-row">
                        <span>Screen</span>
                        <strong>{booking.screen?.name || "N/A"}</strong>
                    </div>
                    <div className="ticket-row">
                        <span>Date</span>
                        <strong>
                            {booking.show?.date
                                ? new Date(booking.show.date).toLocaleDateString()
                                : "-"}
                        </strong>
                    </div>
                    <div className="ticket-row">
                        <span>Show Time</span>
                        <strong>{booking.show?.showTime || "-"}</strong>
                    </div>
                    <div className="ticket-row">
                        <span>Language</span>
                        <strong>{booking.show?.language || "-"}</strong>
                    </div>
                    <div className="ticket-row">
                        <span>Format</span>
                        <strong>{booking.show?.format || "-"}</strong>
                    </div>
                    <div className="ticket-row">
                        <span>Seats</span>
                        <strong>{booking.seats?.join(", ") || "-"}</strong>
                    </div>
                    <div className="ticket-row">
                        <span>No. of Seats</span>
                        <strong>
                            {booking.numberOfSeats || booking.seats?.length || 0}
                        </strong>
                    </div>
                    <div className="ticket-row total-row">
                        <span>Total Paid</span>
                        <strong>₹{booking.totalPrice || 0}</strong>
                    </div>
                    <div className="ticket-row">
                        <span>Payment Method</span>
                        <strong>{booking.paymentMethod || "-"}</strong>
                    </div>
                    <div className="ticket-row">
                        <span>Booking Status</span>
                        <strong>{booking.bookingStatus || "-"}</strong>
                    </div>
                    <div className="ticket-row">
                        <span>Payment Status</span>
                        <strong>{booking.paymentStatus || "-"}</strong>
                    </div>
                    <div className="ticket-row">
                        <span>Booked On</span>
                        <strong>
                            {booking.createdAt
                                ? new Date(booking.createdAt).toLocaleString()
                                : "-"}
                        </strong>
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
                                paymentMethod: booking.paymentMethod
                            })}
                            size={100}
                        />
                    </div>
                    <p>Show this QR Code at the theatre entrance.</p>
                </div>

                <div className="confirmation-buttons">
                    <button
                        className="download-btn"
                        onClick={downloadTicket}
                    >
                        Download Ticket
                    </button>
                    <button
                        className="print-btn"
                        onClick={printTicket}
                    >
                        Print Ticket
                    </button>
                    <button
                        className="bookings-btn"
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
        </div>
    );
}

export default BookingConfirmation;