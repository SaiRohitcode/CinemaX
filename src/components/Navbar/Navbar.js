import "./Navbar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";

import ProfileMenu from "../ProfileMenu/ProfileMenu";

import movieService from "../../services/movieService";
import theatreService from "../../services/theatreService";

function Navbar({ location, changeLocation }) {

    const currentLocation = useLocation();
    const navigate = useNavigate();

    const genres = [
        "Action",
        "Drama",
        "Romance",
        "Sci-Fi",
        "Comedy",
        "Thriller"
    ];

    const [search, setSearch] = useState("");
    const [movies, setMovies] = useState([]);
    const [theatres, setTheatres] = useState([]);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {

        const fetchData = async () => {

            try {

                const movieResponse = await movieService.getMovies();
                const theatreResponse = await theatreService.getTheatres();

                setMovies(movieResponse.movies || movieResponse);
                setTheatres(theatreResponse.theatres || theatreResponse);

            } catch (error) {

                console.error("Error loading navbar data:", error);

            }

        };

        fetchData();

    }, []);

    const filteredMovies = movies.filter((movie) =>
        movie.title.toLowerCase().includes(search.toLowerCase())
    );

    const filteredTheatres = theatres.filter((theatre) =>
        theatre.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");

        setShowProfileMenu(false);

        navigate("/login");

    };

    return (

        <nav className="navbar">

            <div className="logo-section">

                <h1 className="logo">

                    Cinema
                    <span style={{ color: "#E50914" }}>
                        X
                    </span>

                </h1>

                <p className="tagline">
                    Experience Movies Beyond the Screen
                </p>

            </div>

            <ul className="nav-links">

                <li>

                    <Link
                        to="/"
                        className={
                            currentLocation.pathname === "/"
                                ? "nav-link active-link"
                                : "nav-link"
                        }
                    >
                        Home
                    </Link>

                </li>

                <li>

                    <Link
                        to="/movies"
                        className={
                            currentLocation.pathname === "/movies"
                                ? "nav-link active-link"
                                : "nav-link"
                        }
                    >
                        Movies
                    </Link>

                </li>

                <li className="genre-menu">

                    <span
                        className={
                            currentLocation.pathname.startsWith("/genre/")
                                ? "nav-link active-link"
                                : "nav-link"
                        }
                    >
                        Genre
                    </span>

                    <ul className="dropdown-menu">

                        {genres.map((genre) => (

                            <li key={genre}>

                                <Link
                                    to={`/genre/${genre.toLowerCase()}`}
                                    className="dropdown-link"
                                >
                                    {genre}
                                </Link>

                            </li>

                        ))}

                    </ul>

                </li>

                <li>

                    <Link
                        to="/theatres"
                        className={
                            currentLocation.pathname === "/theatres"
                                ? "nav-link active-link"
                                : "nav-link"
                        }
                    >
                        Theatres
                    </Link>

                </li>

            </ul>

            {location && (

                <div
                    className="location"
                    onClick={changeLocation}
                >

                    📍 {location.city} ▼

                </div>

            )}

            <div className="search">

                <input
                    type="text"
                    placeholder="Search movies or theatres..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {search && (

                    <div className="search-results">

                        {filteredMovies.map((movie) => (

                            <div
                                key={movie._id}
                                className="search-item"
                                onClick={() => {

                                    navigate(`/movie/${movie._id}`);
                                    setSearch("");

                                }}
                            >

                                🎬 {movie.title}

                            </div>

                        ))}

                        {filteredTheatres.map((theatre) => (

                            <div
                                key={theatre._id}
                                className="search-item"
                                onClick={() => {

                                    navigate("/theatres");
                                    setSearch("");

                                }}
                            >

                                🏢 {theatre.name}

                            </div>

                        ))}

                        {filteredMovies.length === 0 &&
                            filteredTheatres.length === 0 && (

                                <div className="search-item">

                                    No results found

                                </div>

                            )}

                    </div>

                )}

            </div>

            {!isLoggedIn ? (

                <Link to="/login">

                    <button className="login-btn">

                        Login

                    </button>

                </Link>

            ) : (

                <div className="profile-container">

                    <div
                        className="menu-icon"
                        onClick={() =>
                            setShowProfileMenu(!showProfileMenu)
                        }
                    >

                        <Menu size={28} />

                    </div>

                    {showProfileMenu && (

                        <ProfileMenu
                            user={user}
                            handleLogout={handleLogout}
                        />

                    )}

                </div>

            )}

        </nav>

    );

}

export default Navbar;