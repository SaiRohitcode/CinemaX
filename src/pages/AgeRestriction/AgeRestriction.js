import "./AgeRestriction.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

function AgeRestriction() {

    const navigate = useNavigate();
    const { state } = useLocation();
    const [accepted, setAccepted] = useState(false);

    if (!state || !state.movie) {
        return (
            <div className="age-page">
                <h2>No Movie Selected</h2>
            </div>
        );
    }

    const { movie } = state;

    const continueBooking = () => {

        navigate(`/language/${movie._id}`, {
            state: {
                movie
            }
        });

    };

    return (

        <div
            className="age-page"
            style={{
                backgroundImage: `linear-gradient(rgba(11,15,25,.92),rgba(11,15,25,.92)), url(${movie.banner || movie.poster})`
            }}
        >

            <div className="age-card">

                <div className="poster-section">

                    <img
                        src={movie.poster}
                        alt={movie.title}
                        className="movie-poster"
                    />

                </div>

                <div className="movie-info">

                    <h1>{movie.title}</h1>

                    <div className="movie-meta">

                        <span className="certificate">
                            {movie.certificate}
                        </span>

                        <span className="rating">
                            ⭐ {movie.rating}/10
                        </span>

                    </div>

                    <p className="duration">
                        ⏱ {movie.duration}
                    </p>

                    <p>
                        <strong>Genre:</strong>{" "}
                        {Array.isArray(movie.genre)
                            ? movie.genre.join(" • ")
                            : movie.genre}
                    </p>

                    <p>
                        <strong>Languages:</strong>{" "}
                        {
                            Array.isArray(movie.languages)
                                ? movie.languages.join(" • ")
                                : movie.language
                        }
                    </p>

                    <p>
                        <strong>Formats:</strong>{" "}
                        {
                            Array.isArray(movie.formats)
                                ? movie.formats.join(" • ")
                                : movie.formats
                        }
                    </p>

                    <div className="warning-box">

                        <h2>⚠ Age Restriction</h2>

                        <p>

                            This movie is certified
                            <strong> {movie.certificate}</strong>.

                        </p>

                        <p>

                            Please ensure you satisfy the age
                            requirements before continuing.

                        </p>

                    </div>

                    <label className="checkbox">

                        <input
                            type="checkbox"
                            checked={accepted}
                            onChange={(e) =>
                                setAccepted(e.target.checked)
                            }
                        />

                        I understand the age restriction and wish to continue.

                    </label>

                    <button
                        className="continue-btn"
                        disabled={!accepted}
                        onClick={continueBooking}
                    >
                        Continue Booking
                    </button>

                </div>

            </div>

        </div>

    );

}

export default AgeRestriction;