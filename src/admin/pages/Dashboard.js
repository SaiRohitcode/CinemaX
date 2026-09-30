import { useCallback, useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import movieService from "../services/movieService";
import theatreService from "../services/theatreService";
import screenService from "../services/screenService";
import showService from "../services/showService";
import bookingService from "../services/bookingService";
import userService from "../services/userService";

import "../css/admin.css";
import "../css/dashboard.css";

function Dashboard() {

    const [stats, setStats] = useState({
        movies: 0,
        theatres: 0,
        screens: 0,
        shows: 0,
        bookings: 0,
        users: 0
    });

    const [loading, setLoading] = useState(true);

    const getCount = (data, key) => {

        if (Array.isArray(data)) {
            return data.length;
        }

        if (data && Array.isArray(data[key])) {
            return data[key].length;
        }

        return 0;
    };

    const loadDashboard = useCallback(async () => {

        try {

            setLoading(true);

            const [
                movies,
                theatres,
                screens,
                shows,
                bookings,
                users
            ] = await Promise.all([

                movieService.getMovies(),

                theatreService.getTheatres(),

                screenService.getScreens(),

                showService.getShows(),

                bookingService.getBookings(),

                userService.getUsers()

            ]);

            console.log("Movies:", movies);
            console.log("Theatres:", theatres);
            console.log("Screens:", screens);
            console.log("Shows:", shows);
            console.log("Bookings:", bookings);
            console.log("Users:", users);

            setStats({

                movies: getCount(
                    movies,
                    "movies"
                ),

                theatres: getCount(
                    theatres,
                    "theatres"
                ),

                screens: getCount(
                    screens,
                    "screens"
                ),

                shows: getCount(
                    shows,
                    "shows"
                ),

                bookings: getCount(
                    bookings,
                    "bookings"
                ),

                users: getCount(
                    users,
                    "users"
                )

            });

        } catch (err) {

            console.error(
                "Dashboard Error:",
                err
            );

        } finally {

            setLoading(false);

        }

    }, []);

    useEffect(() => {

        loadDashboard();

    }, [loadDashboard]);

    return (

        <div className="dashboard-container">

            <Sidebar />

            <div className="dashboard-content">

                <div className="dashboard-header">

                    <div>

                        <h1 className="dashboard-title">
                            Dashboard
                        </h1>

                        <p className="dashboard-subtitle">
                            Overview of CinemaX
                        </p>

                    </div>

                    <button
                        className="btn btn-primary"
                        onClick={loadDashboard}
                    >
                        Refresh
                    </button>

                </div>

                <div className="stats-grid">

                    {/* Movies */}

                    <div className="stat-card">

                        <h3>
                            Movies
                        </h3>

                        <h2>

                            {
                                loading
                                    ? "..."
                                    : stats.movies
                            }

                        </h2>

                    </div>


                    {/* Theatres */}

                    <div className="stat-card">

                        <h3>
                            Theatres
                        </h3>

                        <h2>

                            {
                                loading
                                    ? "..."
                                    : stats.theatres
                            }

                        </h2>

                    </div>


                    {/* Screens */}

                    <div className="stat-card">

                        <h3>
                            Screens
                        </h3>

                        <h2>

                            {
                                loading
                                    ? "..."
                                    : stats.screens
                            }

                        </h2>

                    </div>


                    {/* Shows */}

                    <div className="stat-card">

                        <h3>
                            Shows
                        </h3>

                        <h2>

                            {
                                loading
                                    ? "..."
                                    : stats.shows
                            }

                        </h2>

                    </div>


                    {/* Bookings */}

                    <div className="stat-card">

                        <h3>
                            Bookings
                        </h3>

                        <h2>

                            {
                                loading
                                    ? "..."
                                    : stats.bookings
                            }

                        </h2>

                    </div>


                    {/* Users */}

                    <div className="stat-card">

                        <h3>
                            Users
                        </h3>

                        <h2>

                            {
                                loading
                                    ? "..."
                                    : stats.users
                            }

                        </h2>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Dashboard;