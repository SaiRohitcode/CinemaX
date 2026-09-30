import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import movieService from "../services/movieService";
import theatreService from "../services/theatreService";
import screenService from "../services/screenService";
import showService from "../services/showService";
import "../css/admin.css";
import "../css/forms.css";

function EditShow() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [movies, setMovies] = useState([]);
    const [theatres, setTheatres] = useState([]);
    const [screens, setScreens] = useState([]);
    const [selectedScreen, setSelectedScreen] = useState(null);

    const [formData, setFormData] = useState({
        movie: "",
        theatre: "",
        screen: "",
        date: "",
        language: "",
        format: "2D",
        showTime: "",
        pricing: []
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const [movieData, theatreData, screenData, showData] =
                    await Promise.all([
                        movieService.getMovies(),
                        theatreService.getTheatres(),
                        screenService.getScreens(),
                        showService.getShow(id)
                    ]);

                setMovies(movieData.movies || movieData);
                setTheatres(theatreData.theatres || theatreData);
                setScreens(screenData.screens || screenData);

                const show = showData.show || showData;

                setFormData({
                    movie: show.movie?._id || show.movie || "",
                    theatre: show.theatre?._id || show.theatre || "",
                    screen: show.screen?._id || show.screen || "",
                    date: show.date
                        ? new Date(show.date).toISOString().split("T")[0]
                        : "",
                    language: show.language || "",
                    format: show.format || "2D",
                    showTime: show.showTime || "",
                    pricing: show.pricing || []
                });

                const screen = (screenData.screens || screenData).find(
                    s => s._id === (show.screen?._id || show.screen)
                );

                setSelectedScreen(screen || null);
            } catch (err) {
                alert(
                    err.response?.data?.message ||
                    "Unable to fetch show details."
                );
            }
        };

        loadData();
    }, [id]);

    const handleChange = e => {
        const { name, value } = e.target;

        if (name === "theatre") {
            setFormData({
                ...formData,
                theatre: value,
                screen: "",
                pricing: []
            });
            setSelectedScreen(null);
            return;
        }

        if (name === "screen") {
            const screen = screens.find(s => s._id === value);

            setSelectedScreen(screen || null);

            setFormData({
                ...formData,
                screen: value,
                pricing:
                    screen?.sections?.map(section => ({
                        section: section.name,
                        price: Number(section.price) || 0
                    })) || []
            });
            return;
        }

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handlePriceChange = (index, value) => {
        const pricing = [...formData.pricing];

        pricing[index] = {
            ...pricing[index],
            price: Number(value)
        };

        setFormData({
            ...formData,
            pricing
        });
    };

    const availableScreens = screens.filter(screen => {
        const theatreId =
            screen.theatre?._id || screen.theatre;

        return theatreId === formData.theatre;
    });

    const handleSubmit = async e => {
        e.preventDefault();

        try {
            await showService.updateShow(id, formData);
            navigate("/admin/shows");
        } catch (err) {
            alert(
                err.response?.data?.message ||
                "Unable to update show."
            );
        }
    };

    return (
        <AdminLayout>
            <div className="form-container">
                <h2 className="form-title">Edit Show</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Movie</label>
                        <select
                            name="movie"
                            value={formData.movie}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Movie</option>
                            {movies.map(movie => (
                                <option
                                    key={movie._id}
                                    value={movie._id}
                                >
                                    {movie.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Theatre</label>
                        <select
                            name="theatre"
                            value={formData.theatre}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Theatre</option>
                            {theatres.map(theatre => (
                                <option
                                    key={theatre._id}
                                    value={theatre._id}
                                >
                                    {theatre.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Screen</label>
                        <select
                            name="screen"
                            value={formData.screen}
                            onChange={handleChange}
                            required
                            disabled={!formData.theatre}
                        >
                            <option value="">
                                {formData.theatre
                                    ? "Select Screen"
                                    : "Select Theatre First"}
                            </option>

                            {availableScreens.map(screen => (
                                <option
                                    key={screen._id}
                                    value={screen._id}
                                >
                                    {screen.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Show Date</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Language</label>
                        <input
                            type="text"
                            name="language"
                            value={formData.language}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Format</label>
                        <select
                            name="format"
                            value={formData.format}
                            onChange={handleChange}
                            required
                        >
                            <option value="2D">2D</option>
                            <option value="3D">3D</option>
                            <option value="IMAX">IMAX</option>
                            <option value="4DX">4DX</option>
                            <option value="Dolby Atmos">
                                Dolby Atmos
                            </option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Show Time</label>
                        <input
                            type="time"
                            name="showTime"
                            value={formData.showTime}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {selectedScreen?.sections?.map((section, index) => (
                        <div
                            className="form-group"
                            key={section.name}
                        >
                            <label>
                                {section.name} Price (₹)
                            </label>

                            <input
                                type="number"
                                min="0"
                                value={
                                    formData.pricing[index]?.price ?? ""
                                }
                                onChange={e =>
                                    handlePriceChange(
                                        index,
                                        e.target.value
                                    )
                                }
                                required
                            />
                        </div>
                    ))}

                    <button
                        type="submit"
                        className="btn btn-primary"
                    >
                        Update Show
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}

export default EditShow;