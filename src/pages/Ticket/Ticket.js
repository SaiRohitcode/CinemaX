import "./Ticket.css";
import { useEffect,useState } from "react";
import { useNavigate,useParams } from "react-router-dom";
import QRCode from "react-qr-code";
import api from "../../api/axios";

function Ticket(){
    const navigate=useNavigate();
    const {bookingId}=useParams();
    const [booking,setBooking]=useState(null);
    const [loading,setLoading]=useState(true);

    useEffect(()=>{
        const fetchTicket=async()=>{
            try{
                const token=localStorage.getItem("token");
                const response=await api.get(`/bookings/${bookingId}`,{
                    headers:{Authorization:`Bearer ${token}`}
                });
                setBooking(response.data.booking||response.data);
            }catch(error){
                console.error("Ticket error:",error);
                setBooking(null);
            }finally{
                setLoading(false);
            }
        };
        fetchTicket();
    },[bookingId]);

    if(loading){
        return(
            <div className="ticket-page">
                <div className="ticket-card">
                    <div className="ticket-header">
                        <h1>🎉 Booking Confirmed</h1>
                        <p>Enjoy your movie!</p>
                    </div>
                    <div className="ticket-loading">Loading Ticket...</div>
                </div>
            </div>
        );
    }

    if(!booking){
        return(
            <div className="ticket-page">
                <div className="ticket-card">
                    <div className="ticket-header">
                        <h1>Ticket Not Found</h1>
                        <p>Unable to load your booking.</p>
                    </div>
                    <button className="ticket-home-btn" onClick={()=>navigate("/bookings")}>
                        Back to My Bookings
                    </button>
                </div>
            </div>
        );
    }

    const movie=booking.movie||{};
    const theatre=booking.theatre||{};
    const screen=booking.screen||{};
    const show=booking.show||{};

    return(
        <div className="ticket-page">
            <div className="ticket-card">
                <div className="ticket-header">
                    <h1>🎉 Booking Confirmed</h1>
                    <p>Enjoy your movie!</p>
                </div>
                <div className="ticket-details">
                    <div className="ticket-row">
                        <span>BOOKING ID</span>
                        <strong>{booking.bookingId||booking._id}</strong>
                    </div>
                    <div className="ticket-row">
                        <span>MOVIE</span>
                        <strong>{movie.title||"N/A"}</strong>
                    </div>
                    <div className="ticket-row">
                        <span>THEATRE</span>
                        <strong>{theatre.name||"N/A"}</strong>
                    </div>
                    <div className="ticket-row">
                        <span>SCREEN</span>
                        <strong>{screen.name||"N/A"}</strong>
                    </div>
                    <div className="ticket-row">
                        <span>DATE</span>
                        <strong>{show.date?new Date(show.date).toLocaleDateString("en-GB"):"N/A"}</strong>
                    </div>
                    <div className="ticket-row">
                        <span>SHOW TIME</span>
                        <strong>{show.showTime||"N/A"}</strong>
                    </div>
                    <div className="ticket-row">
                        <span>LANGUAGE</span>
                        <strong>{show.language||"N/A"}</strong>
                    </div>
                    <div className="ticket-row">
                        <span>FORMAT</span>
                        <strong>{show.format||"N/A"}</strong>
                    </div>
                    <div className="ticket-row">
                        <span>SEATS</span>
                        <strong>{Array.isArray(booking.seats)?booking.seats.join(", "):"N/A"}</strong>
                    </div>
                    <div className="ticket-row">
                        <span>NO. OF SEATS</span>
                        <strong>{booking.numberOfSeats||0}</strong>
                    </div>
                    <div className="ticket-row total-row">
                        <span>TOTAL PAID</span>
                        <strong>₹{booking.totalPrice||0}</strong>
                    </div>
                    <div className="ticket-row">
                        <span>PAYMENT METHOD</span>
                        <strong>{booking.paymentMethod||"N/A"}</strong>
                    </div>
                    <div className="ticket-row">
                        <span>BOOKING STATUS</span>
                        <strong>{booking.bookingStatus||"Confirmed"}</strong>
                    </div>
                    <div className="ticket-row">
                        <span>PAYMENT STATUS</span>
                        <strong>{booking.paymentStatus||"Success"}</strong>
                    </div>
                    <div className="ticket-row">
                        <span>BOOKED ON</span>
                        <strong>{booking.createdAt?new Date(booking.createdAt).toLocaleString("en-GB"):"N/A"}</strong>
                    </div>
                    <div className="ticket-row">
                        <span>LOCATION</span>
                        {theatre.googleMapsLink?(
                            <a href={theatre.googleMapsLink} target="_blank" rel="noopener noreferrer">
                                View on Google Maps
                            </a>
                        ):(
                            <strong>N/A</strong>
                        )}
                    </div>
                </div>
                <div className="ticket-qr">
                    <QRCode
                        value={JSON.stringify({
                            bookingId:booking.bookingId||booking._id,
                            movie:movie.title,
                            theatre:theatre.name,
                            screen:screen.name,
                            date:show.date,
                            showTime:show.showTime,
                            language:show.language,
                            format:show.format,
                            seats:booking.seats,
                            numberOfSeats:booking.numberOfSeats,
                            totalPrice:booking.totalPrice,
                            paymentMethod:booking.paymentMethod
                        })}
                        size={120}
                    />
                    <p>Show this QR Code at the theatre entrance.</p>
                </div>
            </div>
            <button className="ticket-home-btn" onClick={()=>navigate("/bookings")}>
                Back to My Bookings
            </button>
        </div>
    );
}

export default Ticket;