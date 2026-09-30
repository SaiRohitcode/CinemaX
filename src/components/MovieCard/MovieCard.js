import "./MovieCard.css";
import { Link } from "react-router-dom";

function MovieCard({
    id,
    title,
    rating,
    genre,
    poster
}) {

    return (

        <Link
            to={`/movie/${id}`}
            className="movie-link"
        >

            <div className="movie-card">

                <img
                    src={poster}
                    alt={title}
                    className="movie-poster"
                />

                <div className="movie-details">

                    <div className="movie-header">

                        <h3>{title}</h3>

                        <p>
                            ⭐ {rating}
                        </p>

                    </div>

                    <p className="movie-genre">

                        {
                            Array.isArray(genre)
                                ? genre.join(" • ")
                                : genre
                        }

                    </p>

                    <button className="book-now-btn">
                        Book Now
                    </button>

                </div>

            </div>

        </Link>

    );

}

export default MovieCard;