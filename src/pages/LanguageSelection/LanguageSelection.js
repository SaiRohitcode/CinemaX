import "./LanguageSelection.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

function LanguageSelection() {

    const navigate = useNavigate();
    const { state } = useLocation();

    const [selectedLanguage, setSelectedLanguage] = useState("");

    if (!state || !state.movie) {
        return (
            <div className="language-page">
                <h2>No Movie Selected</h2>
            </div>
        );
    }

    const { movie } = state;

    const languages = Array.isArray(movie.languages) ? movie.languages : [movie.languages];

    const continueBooking = () => {

        navigate(`/theatres/${movie._id}`, {
            state: {
                movie,
                language: selectedLanguage
            }
        });
    };

    return (

        <div className="language-page">

            <div className="language-card">

                <img
                    src={movie.poster}
                    alt={movie.title}
                    className="language-poster"
                />

                <h1>{movie.title}</h1>

                <h3>Select Language</h3>

                <div className="language-list">

                    {
                        languages.map(language => (

                            <button
                                key={language}
                                className={
                                    selectedLanguage === language
                                        ? "language-btn active"
                                        : "language-btn"
                                }
                                onClick={() => setSelectedLanguage(language)}
                            >
                                {language}
                            </button>

                        ))
                    }

                </div>

                <button
                    className="continue-btn"
                    disabled={!selectedLanguage}
                    onClick={continueBooking}
                >
                    Continue
                </button>

            </div>

        </div>

    );

}

export default LanguageSelection;