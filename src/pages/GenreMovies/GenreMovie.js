import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import MovieCard from "../../components/MovieCard/MovieCard";
import Navbar from "../../components/Navbar/Navbar";
import movieService from "../../services/movieService";

import "./GenreMovie.css";

function GenreMovies({ location, changeLocation }) {

    const { genreName } = useParams();

    const [movies, setMovies] = useState([]);

    useEffect(() => {

        const fetchMovies = async () => {

            try {

                const response = await movieService.getMovies();

                setMovies(response.movies || response);

            } catch (error) {

                console.error(error);

            }

        };

        fetchMovies();

    }, []);

    const filteredMovies = movies.filter((movie) => {

        if (Array.isArray(movie.genre)) {

            return movie.genre.some((g) =>
                g.toLowerCase() === genreName.toLowerCase()
            );

        }

        return movie.genre
            ?.toLowerCase()
            .includes(genreName.toLowerCase());

    });

    return (
        <>
            <Navbar
                location={location}
                changeLocation={changeLocation}
            />

            <div className="background-class">

                <h1>{genreName.toUpperCase()} Movies</h1>

                <div className="movie-grid">

                    {filteredMovies.map((movie) => (

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

export default GenreMovies;