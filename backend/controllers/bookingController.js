const Booking=require("../models/Booking");
const Show=require("../models/Show");
const Screen=require("../models/Screen");

const createBooking=async(req,res)=>{
    try{
        const {show,seats,paymentMethod}=req.body;
        const showData=await Show.findById(show);
        if(!showData)return res.status(404).json({success:false,message:"Show not found"});
        const screen=await Screen.findById(showData.screen);
        if(!screen)return res.status(404).json({success:false,message:"Screen not found"});
        const bookings=await Booking.find({show,bookingStatus:"Confirmed"});
        const bookedSeats=bookings.flatMap(booking=>booking.seats);
        const alreadyBooked=seats.filter(seat=>bookedSeats.includes(seat));
        if(alreadyBooked.length>0){
            return res.status(400).json({success:false,message:"Some seats are already booked.",seats:alreadyBooked});
        }
        let ticketPrice=0;
        seats.forEach(seatId=>{
            const seat=screen.seats.find(s=>s.seatId===seatId);
            if(seat)ticketPrice+=seat.price;
        });
        const convenienceFee=40;
        const gst=Math.round(ticketPrice*0.18);
        const totalPrice=ticketPrice+convenienceFee+gst;
        const bookingId="CX"+Date.now();
        const booking=await Booking.create({
            user:req.user._id,
            show,
            movie:showData.movie,
            theatre:showData.theatre,
            screen:showData.screen,
            seats,
            numberOfSeats:seats.length,
            ticketPrice,
            convenienceFee,
            gst,
            totalPrice,
            paymentMethod,
            paymentStatus:"Success",
            bookingId
        });
        const populatedBooking=await Booking.findById(booking._id)
            .populate("movie")
            .populate("theatre")
            .populate("screen")
            .populate("show");
        res.status(201).json({success:true,booking:populatedBooking});
    }catch(error){
        console.error(error);
        res.status(500).json({success:false,message:error.message});
    }
};

const getMyBookings=async(req,res)=>{
    try{
        const bookings=await Booking.find({user:req.user._id})
            .populate("movie")
            .populate("theatre")
            .populate("screen")
            .populate("show")
            .sort({createdAt:-1});
        res.json({success:true,bookings});
    }catch(error){
        res.status(500).json({success:false,message:error.message});
    }
};

const getBookingById=async(req,res)=>{
    try{
        const booking=await Booking.findOne({
            _id:req.params.id,
            user:req.user._id
        })
            .populate("movie")
            .populate("theatre")
            .populate("screen")
            .populate("show");
        if(!booking){
            return res.status(404).json({success:false,message:"Booking not found"});
        }
        res.json({success:true,booking});
    }catch(error){
        res.status(500).json({success:false,message:error.message});
    }
};

const cancelBooking=async(req,res)=>{
    try{
        const booking=await Booking.findOne({
            _id:req.params.id,
            user:req.user._id
        });
        if(!booking){
            return res.status(404).json({success:false,message:"Booking not found"});
        }
        booking.bookingStatus="Cancelled";
        await booking.save();
        res.json({success:true,message:"Booking cancelled"});
    }catch(error){
        res.status(500).json({success:false,message:error.message});
    }
};

module.exports={createBooking,getMyBookings,getBookingById,cancelBooking};