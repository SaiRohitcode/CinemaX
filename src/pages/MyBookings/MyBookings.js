import "./MyBookings.css";
import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

function MyBookings(){
    const [bookings,setBookings]=useState([]);
    const [loading,setLoading]=useState(true);
    const navigate=useNavigate();

    useEffect(()=>{
        const fetchBookings=async()=>{
            try{
                const token=localStorage.getItem("token");
                const response=await api.get("/bookings/my",{
                    headers:{Authorization:`Bearer ${token}`}
                });
                setBookings(response.data.bookings||response.data||[]);
            }catch(error){
                console.error("Bookings error:",error);
                setBookings([]);
            }finally{
                setLoading(false);
            }
        };
        fetchBookings();
    },[]);

    if(loading){
        return(
            <div className="bookings-page">
                <h1>Loading Bookings...</h1>
            </div>
        );
    }

    return(
        <div className="bookings-page">
            <h1>My Bookings</h1>
            {bookings.length===0?(
                <div className="empty-bookings">
                    No bookings found.
                </div>
            ):(
                bookings.map((booking)=>(
                    <div className="booking-card" key={booking._id}>
                        <img
                            src={booking.movie?.poster}
                            alt={booking.movie?.title||"Movie"}
                            className="booking-poster"
                        />
                        <div className="movie-details">
                            <h2>{booking.movie?.title||"N/A"}</h2>
                            <p><strong>Theatre :</strong> {booking.theatre?.name||"N/A"}</p>
                            <p><strong>Screen :</strong> {booking.screen?.name||"N/A"}</p>
                            <p><strong>Language :</strong> {booking.show?.language||"N/A"}</p>
                            <p><strong>Format :</strong> {booking.show?.format||"N/A"}</p>
                            <p><strong>Date :</strong> {booking.show?.date?new Date(booking.show.date).toLocaleDateString():"N/A"}</p>
                            <p><strong>Show Time :</strong> {booking.show?.showTime||"N/A"}</p>
                            <p><strong>Seats :</strong> {booking.seats?.length>0?booking.seats.join(", "):"N/A"}</p>
                            <p><strong>Tickets :</strong> {booking.numberOfSeats||0}</p>
                            <p><strong>Ticket No :</strong> {booking.bookingId||"Not Available"}</p>
                            <p><strong>Status :</strong> {booking.bookingStatus||"Confirmed"}</p>
                            <p><strong>Booked On :</strong> {booking.createdAt?new Date(booking.createdAt).toLocaleString():"N/A"}</p>
                            <p className="price"><strong>Total Paid :</strong> ₹{booking.totalPrice||0}</p>
                        </div>
                        <button
                            className="ticket-btn"
                            onClick={()=>navigate(`/ticket/${booking._id}`)}
                        >
                            View Ticket
                        </button>
                    </div>
                ))
            )}
        </div>
    );
}

export default MyBookings;