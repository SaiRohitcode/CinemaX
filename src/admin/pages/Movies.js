import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import movieService from "../services/movieService";

import "../css/admin.css";
import "../css/table.css";

function Movies() {

    const [movies, setMovies] = useState([]);

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {

        try {

            const data = await movieService.getMovies();

            setMovies(data.movies || data);

        } catch (err) {

            console.log(err);

        }

    };

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this movie?")) return;

        try {

            await movieService.deleteMovie(id);

            fetchMovies();

        } catch (err) {

            alert(
                err.response?.data?.message ||
                "Unable to delete movie."
            );

        }

    };

    return (

        <div className="dashboard-container">

            <Sidebar />

            <div className="dashboard-content">

                <div className="table-container">

                    <div className="table-header">

                        <h2>Movies</h2>

                        <Link
                            to="/admin/movies/add"
                            className="btn btn-primary"
                        >
                            Add Movie
                        </Link>

                    </div>

                    <div className="table-responsive">

                        <table className="admin-table">

                            <thead>

                                <tr>

                                    <th>Poster</th>
                                    <th>Title</th>
                                    <th>Languages</th>
                                    <th>Genre</th>
                                    <th>Duration</th>
                                    <th>Hero Banner</th>
                                    <th>Coming Soon</th>
                                    <th>Status</th>
                                    <th>Actions</th>

                                </tr>

                            </thead>

                            <tbody>

                                {

                                    movies.length > 0 ? (

                                        movies.map((movie) => (

                                            <tr key={movie._id}>

                                                <td>

                                                    <img
                                                        src={movie.poster}
                                                        alt={movie.title}
                                                        width="70"
                                                        style={{
                                                            borderRadius: "8px"
                                                        }}
                                                    />

                                                </td>

                                                <td>

                                                    <strong>{movie.title}</strong>

                                                    {

                                                        movie.heroBanner && (

                                                            <div
                                                                style={{
                                                                    color: "#ff9800",
                                                                    fontSize: "12px",
                                                                    marginTop: "5px"
                                                                }}
                                                            >

                                                                {movie.heroTitle}

                                                            </div>

                                                        )

                                                    }

                                                </td>

                                                <td>

                                                    {

                                                        Array.isArray(movie.languages)
                                                            ? movie.languages.join(", ")
                                                            : movie.languages

                                                    }

                                                </td>

                                                <td>

                                                    {

                                                        Array.isArray(movie.genre)
                                                            ? movie.genre.join(", ")
                                                            : movie.genre

                                                    }

                                                </td>

                                                <td>{movie.duration}</td>

                                                <td
                                                    style={{
                                                        textAlign: "center"
                                                    }}
                                                >

                                                    {

                                                        movie.heroBanner
                                                            ? "✅"
                                                            : "❌"

                                                    }

                                                </td>

                                                <td
                                                    style={{
                                                        textAlign: "center"
                                                    }}
                                                >

                                                    {

                                                        movie.comingSoon
                                                            ? "✅"
                                                            : "❌"

                                                    }

                                                </td>

                                                <td>

                                                    <span
                                                        className={
                                                            movie.isActive
                                                                ? "status-active"
                                                                : "status-inactive"
                                                        }
                                                    >

                                                        {

                                                            movie.isActive
                                                                ? "Active"
                                                                : "Inactive"

                                                        }

                                                    </span>

                                                </td>

                                                <td>

                                                    <Link
                                                        to={`/admin/movies/edit/${movie._id}`}
                                                        className="btn btn-secondary"
                                                    >
                                                        Edit
                                                    </Link>

                                                    <button
                                                        className="btn btn-danger"
                                                        onClick={() => handleDelete(movie._id)}
                                                    >
                                                        Delete
                                                    </button>

                                                </td>

                                            </tr>

                                        ))

                                    ) : (

                                        <tr>

                                            <td
                                                colSpan="9"
                                                style={{
                                                    textAlign: "center",
                                                    padding: "30px"
                                                }}
                                            >

                                                No Movies Found

                                            </td>

                                        </tr>

                                    )

                                }

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Movies;