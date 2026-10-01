import "./BookingHistory.css";
import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import bookingService from "../../services/bookingService";

function BookingHistory(){
    const navigate=useNavigate();
    const [bookings,setBookings]=useState([]);
    const [loading,setLoading]=useState(true);

    useEffect(()=>{
        const fetchBookings=async()=>{
            try{
                const response=await bookingService.getMyBookings();
                setBookings(response.bookings||response||[]);
            }catch(error){
                console.error("Booking history error:",error);
                setBookings([]);
            }finally{
                setLoading(false);
            }
        };
        fetchBookings();
    },[]);

    if(loading){
        return(
            <div className="booking-history">
                <h1 className="history-title">Your Bookings</h1>
                <h2>Loading Bookings...</h2>
            </div>
        );
    }

    return(
        <div className="booking-history">
            <h1 className="history-title">Your Bookings</h1>
            {bookings.length===0?(
                <div className="empty-bookings">
                    <h2>No Bookings Yet</h2>
                    <p>Book your favourite movie and it will appear here.</p>
                    <button className="browse-btn" onClick={()=>navigate("/")}>
                        Browse Movies
                    </button>
                </div>
            ):(
                <div className="booking-container">
                    {bookings.map(booking=>{
                        const movie=booking.movie||{};
                        const theatre=booking.theatre||{};
                        const show=booking.show||{};

                        return(
                            <div className="booking-card" key={booking._id||booking.bookingId}>
                                <img
                                    src={movie.poster||""}
                                    alt={movie.title||"Movie"}
                                    className="booking-poster"
                                />
                                <div className="booking-info">
                                    <h2>{movie.title||"Movie"}</h2>
                                    <div className="history-booking-details">
                                        <p>
                                            <strong>Booking ID</strong>
                                            <span>{booking.bookingId||booking._id}</span>
                                        </p>
                                        <p>
                                            <strong>Theatre</strong>
                                            <span>{theatre.name||"N/A"}</span>
                                        </p>
                                        <p>
                                            <strong>Location</strong>
                                            <span>{theatre.city||"N/A"}</span>
                                        </p>
                                        <p>
                                            <strong>Date</strong>
                                            <span>{show.date?new Date(show.date).toLocaleDateString():"N/A"}</span>
                                        </p>
                                        <p>
                                            <strong>Show Time</strong>
                                            <span>{show.showTime||"N/A"}</span>
                                        </p>
                                        <p>
                                            <strong>Seats</strong>
                                            <span>{Array.isArray(booking.seats)?booking.seats.join(", "):booking.seats||"N/A"}</span>
                                        </p>
                                        <p>
                                            <strong>Amount Paid</strong>
                                            <span>₹{booking.totalPrice||0}</span>
                                        </p>
                                    </div>
                                    <button
                                        className="ticket-btn"
                                        onClick={()=>navigate(`/ticket/${booking._id}`)}
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