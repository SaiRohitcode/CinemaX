import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";

import "../css/admin.css";
import "../css/forms.css";

function EditMovie() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [movie, setMovie] = useState({
        title: "",
        description: "",
        genre: "",
        languages: "",
        formats: "",
        duration: "",
        releaseDate: "",
        rating: "",
        poster: "",
        trailer: "",
        certificate: "",
        comingSoon: false,
        isActive: true,
        heroBanner: false,
        heroTitle: "",
        heroDescription: "",
        heroImage: ""
    });

    useEffect(() => {

        const fetchMovie = async () => {

            try {

                const res = await axios.get(
                    `http://localhost:5000/api/movies/${id}`
                );

                const data = res.data.movie || res.data;

                setMovie({
                    ...data,
                    genre: Array.isArray(data.genre)
                        ? data.genre.join(", ")
                        : data.genre,

                    languages: Array.isArray(data.languages)
                        ? data.languages.join(", ")
                        : data.languages,

                    formats: Array.isArray(data.formats)
                        ? data.formats.join(", ")
                        : data.formats
                });

            } catch (err) {

                alert("Failed to Load Movie");

            }

        };

        fetchMovie();

    }, [id]);

    const handleChange = (e) => {

        const { name, value, type, checked } = e.target;

        setMovie({
            ...movie,
            [name]: type === "checkbox" ? checked : value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const data = {
                ...movie,
                genre: movie.genre.split(",").map(item => item.trim()),
                languages: movie.languages.split(",").map(item => item.trim()),
                formats: movie.formats.split(",").map(item => item.trim())
            };

            await axios.put(
                `http://localhost:5000/api/movies/${id}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("adminToken")}`
                    }
                }
            );

            alert("Movie Updated Successfully");

            navigate("/admin/movies");

        } catch (err) {

            alert(
                err.response?.data?.message ||
                "Update Failed"
            );

        }

    };

    return (

        <div className="dashboard-container">

            <Sidebar />

            <div className="dashboard-content">

                <div className="form-container">

                    <h2 className="form-title">
                        Edit Movie
                    </h2>

                    <form className="form" onSubmit={handleSubmit}>

                        <div className="form-group">
                            <label>Movie Title</label>
                            <input
                                type="text"
                                name="title"
                                value={movie.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Genre</label>
                            <input
                                type="text"
                                name="genre"
                                value={movie.genre}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Description</label>
                            <textarea
                                name="description"
                                value={movie.description}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Languages</label>
                            <input
                                type="text"
                                name="languages"
                                value={movie.languages}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Formats</label>
                            <input
                                type="text"
                                name="formats"
                                value={movie.formats}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Duration</label>
                            <input
                                type="text"
                                name="duration"
                                value={movie.duration}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Release Date</label>
                            <input
                                type="date"
                                name="releaseDate"
                                value={movie.releaseDate?.substring(0, 10)}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Rating</label>
                            <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="10"
                                name="rating"
                                value={movie.rating}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Certificate</label>
                            <select
                                name="certificate"
                                value={movie.certificate}
                                onChange={handleChange}
                            >
                                <option value="">Select</option>
                                <option value="U">U</option>
                                <option value="UA">UA</option>
                                <option value="A">A</option>
                            </select>
                        </div>

                        <div className="form-group full-width">
                            <label>Poster URL</label>
                            <input
                                type="text"
                                name="poster"
                                value={movie.poster}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Trailer URL</label>
                            <input
                                type="text"
                                name="trailer"
                                value={movie.trailer}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>

                                <input
                                    type="checkbox"
                                    name="comingSoon"
                                    checked={movie.comingSoon}
                                    onChange={handleChange}
                                />

                                {" "}Coming Soon

                            </label>
                        </div>

                        <div className="form-group">
                            <label>

                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={movie.isActive}
                                    onChange={handleChange}
                                />

                                {" "}Active Movie

                            </label>
                        </div>

                        <hr />

                        <h3>Hero Banner Settings</h3>

                        <div className="form-group">
                            <label>

                                <input
                                    type="checkbox"
                                    name="heroBanner"
                                    checked={movie.heroBanner}
                                    onChange={handleChange}
                                />

                                {" "}Show in Hero Banner

                            </label>
                        </div>

                        <div className="form-group">
                            <label>Hero Title</label>
                            <input
                                type="text"
                                name="heroTitle"
                                value={movie.heroTitle}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Hero Description</label>
                            <textarea
                                rows="3"
                                name="heroDescription"
                                value={movie.heroDescription}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Hero Banner Image URL</label>
                            <input
                                type="text"
                                name="heroImage"
                                value={movie.heroImage}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-actions">

                            <button
                                type="submit"
                                className="btn btn-success"
                            >
                                Update Movie
                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>

    );

}

export default EditMovie;