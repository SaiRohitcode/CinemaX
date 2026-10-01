import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Home from "./pages/Home/Home";
import MoviePage from "./pages/MoviePage/MoviePage";
import GenreMovie from "./pages/GenreMovies/GenreMovie";
import TheatrePage from "./pages/TheatrePage/TheatrePage";
import AgeRestriction from "./pages/AgeRestriction/AgeRestriction";
import LanguageSelection from "./pages/LanguageSelection/LanguageSelection";
import MovieDetails from "./pages/MovieDetails/MovieDetails";
import SeatSelection from "./pages/SeatSelection/SeatSelection";
import LocationModal from "./components/LocationModal/LocationModal";
import TheatreSelection from "./pages/TheatreSelection/TheatreSelection";
import Payment from "./pages/Payment/Payment";
import BookingConfirmation from "./pages/BookingConfirmation/BookingConfirmation";
import BookingHistory from "./pages/BookingHistory/BookingHistory";
import Profile from "./pages/Profile/Profile";
import Ticket from "./pages/Ticket/Ticket";
import MyBookings from "./pages/MyBookings/MyBookings";
import BookingSummary from "./pages/BookingSummary/BookingSummary";
import Dashboard from "./admin/pages/Dashboard";
import Movies from "./admin/pages/Movies";
import AddMovie from "./admin/pages/AddMovie";
import EditMovie from "./admin/pages/EditMovie";
import Theatres from "./admin/pages/Theatres";
import AddTheatre from "./admin/pages/AddTheatre";
import EditTheatre from "./admin/pages/EditTheatre";
import Screens from "./admin/pages/Screens";
import AddScreen from "./admin/pages/AddScreen";
import EditScreen from "./admin/pages/EditScreen";
import Shows from "./admin/pages/Shows";
import AddShow from "./admin/pages/AddShow";
import EditShow from "./admin/pages/EditShow";
import Bookings from "./admin/pages/Bookings";
import Users from "./admin/pages/Users";
import ProtectedAdminRoute from "./admin/components/ProtectedAdminRoute";

function App() {
    const [location, setLocation] = useState(null);
    const [showLocationModal, setShowLocationModal] = useState(false);

    useEffect(() => {
        const savedLocation = sessionStorage.getItem("location");
        if (savedLocation) {
            setLocation(JSON.parse(savedLocation));
        } else {
            setShowLocationModal(true);
        }
    }, []);

    return (
        <BrowserRouter>
            {showLocationModal && (
                <LocationModal
                    location={location}
                    onSave={(newLocation) => {
                        setLocation(newLocation);
                        setShowLocationModal(false);
                    }}
                    onClose={() => setShowLocationModal(false)}
                />
            )}
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/"
                    element={
                        <Home
                            location={location}
                            changeLocation={() => setShowLocationModal(true)}
                        />
                    }
                />
                <Route
                    path="/movies"
                    element={
                        <MoviePage
                            location={location}
                            changeLocation={() => setShowLocationModal(true)}
                        />
                    }
                />
                <Route
                    path="/genre/:genreName"
                    element={
                        <GenreMovie
                            location={location}
                            changeLocation={() => setShowLocationModal(true)}
                        />
                    }
                />
                <Route
                    path="/movie/:id"
                    element={
                        <MovieDetails
                            location={location}
                            changeLocation={() => setShowLocationModal(true)}
                        />
                    }
                />
                <Route path="/age-restriction/:id" element={<AgeRestriction />} />
                <Route path="/language/:id" element={<LanguageSelection />} />
                <Route
                    path="/theatres"
                    element={
                        <TheatrePage
                            location={location}
                            changeLocation={() => setShowLocationModal(true)}
                        />
                    }
                />
                <Route
                    path="/theatres/:id"
                    element={<TheatreSelection location={location} />}
                />
                <Route
                    path="/booking/:id"
                    element={
                        <SeatSelection
                            location={location}
                            changeLocation={() => setShowLocationModal(true)}
                        />
                    }
                />
                <Route path="/payment" element={<Payment />} />
                <Route path="/booking-summary" element={<BookingSummary />} />
                <Route path="/booking-confirmation" element={<BookingConfirmation />} />
                <Route path="/bookings" element={<MyBookings />} />
                <Route path="/booking-history" element={<BookingHistory />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/ticket/:bookingId" element={<Ticket />} />
                <Route path="/admin/login" element={<Navigate to="/login" replace />} />
                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedAdminRoute>
                            <Dashboard />
                        </ProtectedAdminRoute>
                    }
                />
                <Route
                    path="/admin/movies"
                    element={
                        <ProtectedAdminRoute>
                            <Movies />
                        </ProtectedAdminRoute>
                    }
                />
                <Route
                    path="/admin/movies/add"
                    element={
                        <ProtectedAdminRoute>
                            <AddMovie />
                        </ProtectedAdminRoute>
                    }
                />
                <Route
                    path="/admin/movies/edit/:id"
                    element={
                        <ProtectedAdminRoute>
                            <EditMovie />
                        </ProtectedAdminRoute>
                    }
                />
                <Route
                    path="/admin/theatres"
                    element={
                        <ProtectedAdminRoute>
                            <Theatres />
                        </ProtectedAdminRoute>
                    }
                />
                <Route
                    path="/admin/theatres/add"
                    element={
                        <ProtectedAdminRoute>
                            <AddTheatre />
                        </ProtectedAdminRoute>
                    }
                />
                <Route
                    path="/admin/theatres/edit/:id"
                    element={
                        <ProtectedAdminRoute>
                            <EditTheatre />
                        </ProtectedAdminRoute>
                    }
                />
                <Route
                    path="/admin/screens"
                    element={
                        <ProtectedAdminRoute>
                            <Screens />
                        </ProtectedAdminRoute>
                    }
                />
                <Route
                    path="/admin/screens/add"
                    element={
                        <ProtectedAdminRoute>
                            <AddScreen />
                        </ProtectedAdminRoute>
                    }
                />
                <Route
                    path="/admin/screens/edit/:id"
                    element={
                        <ProtectedAdminRoute>
                            <EditScreen />
                        </ProtectedAdminRoute>
                    }
                />
                <Route
                    path="/admin/shows"
                    element={
                        <ProtectedAdminRoute>
                            <Shows />
                        </ProtectedAdminRoute>
                    }
                />
                <Route
                    path="/admin/shows/add"
                    element={
                        <ProtectedAdminRoute>
                            <AddShow />
                        </ProtectedAdminRoute>
                    }
                />
                <Route
                    path="/admin/shows/edit/:id"
                    element={
                        <ProtectedAdminRoute>
                            <EditShow />
                        </ProtectedAdminRoute>
                    }
                />
                <Route
                    path="/admin/bookings"
                    element={
                        <ProtectedAdminRoute>
                            <Bookings />
                        </ProtectedAdminRoute>
                    }
                />
                <Route
                    path="/admin/users"
                    element={
                        <ProtectedAdminRoute>
                            <Users />
                        </ProtectedAdminRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;