import "./MovieDetails.css";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar/Navbar";
import movieService from "../../services/movieService";

function MovieDetails({ location, changeLocation }) {

    const { id } = useParams();
    const navigate = useNavigate();

    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchMovie = async () => {

            try {

                setLoading(true);
                setError("");

                const response = await movieService.getMovieById(id);

                const movieData = response.movie || response;

                if (!movieData) {
                    setError("Movie not found.");
                    return;
                }

                setMovie(movieData);

            } catch (error) {

                console.error("Error loading movie:", error);

                setError(
                    error.response?.data?.message ||
                    "Unable to load movie."
                );

            } finally {

                setLoading(false);

            }

        };

        fetchMovie();

    }, [id]);

    if (loading) {

        return (

            <>

                <Navbar
                    location={location}
                    changeLocation={changeLocation}
                />

                <div
                    style={{
                        textAlign: "center",
                        marginTop: "80px"
                    }}
                >

                    <h2>
                        Loading Movie...
                    </h2>

                </div>

            </>

        );

    }

    if (error || !movie) {

        return (

            <>

                <Navbar
                    location={location}
                    changeLocation={changeLocation}
                />

                <div
                    style={{
                        textAlign: "center",
                        marginTop: "80px"
                    }}
                >

                    <h2>
                        Movie Not Found
                    </h2>

                    <p>
                        {error}
                    </p>

                </div>

            </>

        );

    }

    return (

        <>

            <Navbar
                location={location}
                changeLocation={changeLocation}
            />

            <div className="movie-details-container">

                <div className="movie-details-card">

                    <div className="poster-section">

                        <img
                            src={movie.poster}
                            alt={movie.title}
                            className="details-poster"
                        />

                    </div>

                    <div className="details-section">

                        <h1>
                            {movie.title}
                        </h1>

                        <h3>
                            ⭐ {movie.rating || "N/A"}
                        </h3>

                        <p>

                            <strong>
                                Genre :
                            </strong>

                            {" "}

                            {
                                Array.isArray(movie.genre)
                                    ? movie.genre.join(" • ")
                                    : movie.genre
                            }

                        </p>

                        <p>

                            <strong>
                                Languages :
                            </strong>

                            {" "}

                            {
                                Array.isArray(movie.languages)
                                    ? movie.languages.join(", ")
                                    : movie.languages
                            }

                        </p>

                        <p>

                            <strong>
                                Formats :
                            </strong>

                            {" "}

                            {
                                Array.isArray(movie.formats)
                                    ? movie.formats.join(", ")
                                    : movie.formats
                            }

                        </p>

                        <p>

                            <strong>
                                Duration :
                            </strong>

                            {" "}

                            {movie.duration}

                        </p>

                        <p>

                            <strong>
                                Certificate :
                            </strong>

                            {" "}

                            {movie.certificate}

                        </p>

                        <p>

                            <strong>
                                Release Date :
                            </strong>

                            {" "}

                            {
                                movie.releaseDate
                                    ? new Date(
                                        movie.releaseDate
                                    ).toLocaleDateString()
                                    : "N/A"
                            }

                        </p>

                        <br />

                        <p>
                            {movie.description}
                        </p>

                        {
                            movie.trailer && (

                                <a
                                    href={movie.trailer}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="trailer-btn"
                                >
                                    Watch Trailer
                                </a>

                            )
                        }

                        <button
                            className="book-btn"
                            onClick={() =>
                                navigate(
                                    `/age-restriction/${movie._id}`,
                                    {
                                        state: {
                                            movie
                                        }
                                    }
                                )
                            }
                        >

                            Book Tickets

                        </button>

                    </div>

                </div>

            </div>

        </>

    );

}

export default MovieDetails;