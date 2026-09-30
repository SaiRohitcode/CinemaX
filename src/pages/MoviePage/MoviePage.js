import React, { useEffect, useState } from "react";
import "./MoviePage.css";

import Navbar from "../../components/Navbar/Navbar";
import MovieCard from "../../components/MovieCard/MovieCard";
import movieService from "../../services/movieService";

function MoviePage({ location, changeLocation }) {

    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchMovies = async () => {

            try {

                const response = await movieService.getMovies();

                setMovies(response.movies || response);

            } catch (error) {

                console.error("Error fetching movies:", error);

            } finally {

                setLoading(false);

            }

        };

        fetchMovies();

    }, []);

    if (loading) {

        return <h2 style={{ textAlign: "center" }}>Loading Movies...</h2>;

    }

    return (

        <>

            <Navbar
                location={location}
                changeLocation={changeLocation}
            />

            <div className="movie-page">

                <h1 className="movie-page-title">
                    All Movies
                </h1>

                <div className="movie-page-grid">

                    {movies.map((movie) => (

                        <MovieCard
                            key={movie._id}
                            id={movie._id}
                            title={movie.title}
                            rating={movie.rating}
                            genre={movie.genre}
                            poster={movie.poster}
                        />

                    ))}

                </div>

            </div>

        </>

    );

}

export default MoviePage;