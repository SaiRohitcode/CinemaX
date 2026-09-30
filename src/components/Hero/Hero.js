import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import movieService from "../../services/movieService";

import "./Hero.css";

function Hero() {

    const [heroMovies, setHeroMovies] = useState([]);
    const [current, setCurrent] = useState(0);

    useEffect(() => {

        fetchHeroMovies();

    }, []);

    useEffect(() => {

        if (heroMovies.length <= 1) return;

        const interval = setInterval(() => {

            setCurrent((prev) => (prev + 1) % heroMovies.length);

        }, 5000);

        return () => clearInterval(interval);

    }, [heroMovies]);

    const fetchHeroMovies = async () => {

        try {

            const data = await movieService.getMovies();

            const movies = data.movies || data;

            const banners = movies.filter(
                (movie) => movie.heroBanner && movie.isActive
            );

            setHeroMovies(banners);

        } catch (err) {

            console.log(err);

        }

    };

    if (heroMovies.length === 0) {

        return null;

    }

    const movie = heroMovies[current];

    return (

        <section className="hero">

            <div className="hero-content">

                <p className="featured">
                    Featured Movie
                </p>

                <h1 className="movie-title">

                    {movie.heroTitle || movie.title}

                </h1>

                <p className="movie-info">

                    ⭐ {movie.rating}

                    {" • "}

                    {Array.isArray(movie.genre)
                        ? movie.genre.join(" • ")
                        : movie.genre}

                </p>

                <p className="movie-description">

                    {movie.heroDescription || movie.description}

                </p>

                <div className="hero-buttons">

                    <Link to={`/movie/${movie._id}`}>

                        <button className="book-btn">

                            Book Tickets

                        </button>

                    </Link>

                    {

                        movie.trailer && (

                            <button
                                className="trailer-btn"
                                onClick={() => window.open(movie.trailer, "_blank")}
                            >

                                Watch Trailer

                            </button>

                        )

                    }

                </div>

            </div>

            <div className="hero-image">

                <img
                    src={movie.heroImage || movie.poster}
                    alt={movie.title}
                />

            </div>

        </section>

    );

}

export default Hero;