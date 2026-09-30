import { useEffect, useState } from "react";
import "./MovieSection.css";
import MovieCard from "../MovieCard/MovieCard";
import movieService from "../../services/movieService";

function MovieSection() {

    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {

        try {

            const response = await movieService.getMovies();

            setMovies(response.movies || response);

        } catch (err) {

            console.error(err);

            setError("Unable to load movies.");

        } finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (

            <section className="movie-section">

                <h2 className="section-title">
                    Loading Movies...
                </h2>

            </section>

        );

    }

    if (error) {

        return (

            <section className="movie-section">

                <h2 className="section-title">
                    {error}
                </h2>

            </section>

        );

    }

    const nowShowing = movies.filter(
        movie => movie.isActive && !movie.comingSoon
    );

    const comingSoon = movies.filter(
        movie => movie.comingSoon
    );

    const topRated = [...movies]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 8);

    const renderMovies = (movieList) => (

        <div className="movie-grid">

            {

                movieList.length > 0 ?

                    movieList.map(movie => (

                        <MovieCard

                            key={movie._id}

                            id={movie._id}

                            title={movie.title}

                            rating={movie.rating}

                            genre={movie.genre}

                            poster={movie.poster}

                        />

                    ))

                    :

                    <h3>No Movies Available</h3>

            }

        </div>

    );

    return (

        <>

            <section className="movie-section">

                <h2 className="section-title">

                    Now Showing

                </h2>

                {renderMovies(nowShowing)}

            </section>

            <section className="movie-section">

                <h2 className="section-title">

                    Coming Soon

                </h2>

                {renderMovies(comingSoon)}

            </section>

            <section className="movie-section">

                <h2 className="section-title">

                    ⭐ Top Rated Movies

                </h2>

                {renderMovies(topRated)}

            </section>

        </>

    );

}

export default MovieSection;