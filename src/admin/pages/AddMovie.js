import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import movieService from "../services/movieService";
import "../css/admin.css";
import "../css/forms.css";

function AddMovie() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        genre: "",
        languages: "",
        formats: "",
        duration: "",
        releaseDate: "",
        availableFrom: "",
        availableUntil: "",
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

    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleSubmit = async e => {
        e.preventDefault();

        if (formData.availableUntil < formData.availableFrom) {
            alert("Available Until date must be after Available From date.");
            return;
        }

        try {
            const movieData = {
                ...formData,
                genre: formData.genre.split(",").map(item => item.trim()),
                languages: formData.languages.split(",").map(item => item.trim()),
                formats: formData.formats.split(",").map(item => item.trim())
            };

            await movieService.addMovie(movieData);
            alert("Movie Added Successfully");
            navigate("/admin/movies");
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Unable to add movie.");
        }
    };

    return (
        <div className="dashboard-container">
            <Sidebar />
            <div className="dashboard-content">
                <div className="form-container">
                    <h2 className="form-title">Add Movie</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Movie Title</label>
                            <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Genre (Comma Separated)</label>
                            <input type="text" name="genre" placeholder="Action, Thriller" value={formData.genre} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Languages (Comma Separated)</label>
                            <input type="text" name="languages" placeholder="Telugu, Hindi" value={formData.languages} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Formats (Comma Separated)</label>
                            <input type="text" name="formats" placeholder="2D, IMAX" value={formData.formats} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Duration</label>
                            <input type="text" name="duration" placeholder="2h 45m" value={formData.duration} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Release Date</label>
                            <input type="date" name="releaseDate" value={formData.releaseDate} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Available From</label>
                            <input type="date" name="availableFrom" value={formData.availableFrom} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Available Until</label>
                            <input type="date" name="availableUntil" value={formData.availableUntil} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Rating</label>
                            <input type="number" step="0.1" min="0" max="10" name="rating" value={formData.rating} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Certificate</label>
                            <input type="text" name="certificate" placeholder="U/A" value={formData.certificate} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Poster URL</label>
                            <input type="text" name="poster" value={formData.poster} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Trailer URL</label>
                            <input type="text" name="trailer" value={formData.trailer} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea rows="5" name="description" value={formData.description} onChange={handleChange} required />
                        </div>
                        <hr />
                        <h3>Hero Banner Settings</h3>
                        <div className="form-group">
                            <label>
                                <input type="checkbox" name="heroBanner" checked={formData.heroBanner} onChange={handleChange} />
                                {" "}Show in Hero Banner
                            </label>
                        </div>
                        <div className="form-group">
                            <label>Hero Title</label>
                            <input type="text" name="heroTitle" value={formData.heroTitle} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Hero Description</label>
                            <textarea rows="3" name="heroDescription" value={formData.heroDescription} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Hero Banner Image URL</label>
                            <input type="text" name="heroImage" value={formData.heroImage} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>
                                <input type="checkbox" name="comingSoon" checked={formData.comingSoon} onChange={handleChange} />
                                {" "}Coming Soon
                            </label>
                        </div>
                        <div className="form-group">
                            <label>
                                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
                                {" "}Active Movie
                            </label>
                        </div>
                        <button type="submit" className="btn btn-primary">Add Movie</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddMovie;