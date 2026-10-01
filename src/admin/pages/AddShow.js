import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import movieService from "../services/movieService";
import theatreService from "../services/theatreService";
import screenService from "../services/screenService";
import showService from "../services/showService";
import "../css/admin.css";
import "../css/forms.css";

function AddShow() {
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [theatres, setTheatres] = useState([]);
    const [screens, setScreens] = useState([]);
    const [selectedScreen, setSelectedScreen] = useState(null);
    const [selectedTimes, setSelectedTimes] = useState([]);
    const [newTime, setNewTime] = useState("");

    const [formData, setFormData] = useState({
        movie: "",
        theatre: "",
        screen: "",
        startDate: "",
        endDate: "",
        language: "",
        format: "2D",
        pricing: []
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const [movieData, theatreData, screenData] = await Promise.all([
                    movieService.getMovies(),
                    theatreService.getTheatres(),
                    screenService.getScreens()
                ]);
                setMovies(movieData.movies || movieData);
                setTheatres(theatreData.theatres || theatreData);
                setScreens(screenData.screens || screenData);
            } catch (err) {
                alert(err.response?.data?.message || "Unable to fetch required data.");
            }
        };
        loadData();
    }, []);

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
                pricing: screen?.sections?.map(section => ({
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

    const addShowTime = () => {
        if (!newTime) {
            alert("Select a show time.");
            return;
        }

        if (selectedTimes.includes(newTime)) {
            alert("This show time is already added.");
            return;
        }

        setSelectedTimes([...selectedTimes, newTime]);
        setNewTime("");
    };

    const removeShowTime = time => {
        setSelectedTimes(selectedTimes.filter(item => item !== time));
    };

    const availableScreens = screens.filter(screen => {
        const theatreId = screen.theatre?._id || screen.theatre;
        return theatreId === formData.theatre;
    });

    const handleSubmit = async e => {
        e.preventDefault();

        if (formData.endDate < formData.startDate) {
            alert("End date must be after Start date.");
            return;
        }

        if (selectedTimes.length === 0) {
            alert("Add at least one show time.");
            return;
        }

        try {
            await showService.addShow({
                ...formData,
                showTimes: selectedTimes
            });

            alert("Shows added successfully.");
            navigate("/admin/shows");
        } catch (err) {
            alert(err.response?.data?.message || "Unable to add shows.");
        }
    };

    return (
        <AdminLayout>
            <div className="form-container">
                <h2 className="form-title">Add Shows</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Movie</label>
                        <select name="movie" value={formData.movie} onChange={handleChange} required>
                            <option value="">Select Movie</option>
                            {movies.map(movie => (
                                <option key={movie._id} value={movie._id}>
                                    {movie.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Theatre</label>
                        <select name="theatre" value={formData.theatre} onChange={handleChange} required>
                            <option value="">Select Theatre</option>
                            {theatres.map(theatre => (
                                <option key={theatre._id} value={theatre._id}>
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
                                {formData.theatre ? "Select Screen" : "Select Theatre First"}
                            </option>
                            {availableScreens.map(screen => (
                                <option key={screen._id} value={screen._id}>
                                    {screen.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Start Date</label>
                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>End Date</label>
                        <input
                            type="date"
                            name="endDate"
                            value={formData.endDate}
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
                            placeholder="Telugu"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Show Time</label>
                        <div style={{ display: "flex", gap: "10px" }}>
                            <input
                                type="time"
                                value={newTime}
                                onChange={e => setNewTime(e.target.value)}
                            />
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={addShowTime}
                            >
                                Add Time
                            </button>
                        </div>
                    </div>

                    {selectedTimes.length > 0 && (
                        <div className="form-group">
                            <label>Selected Show Times</label>
                            {selectedTimes.map(time => (
                                <div
                                    key={time}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        marginBottom: "8px"
                                    }}
                                >
                                    <span>{time}</span>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => removeShowTime(time)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <button type="submit" className="btn btn-primary">
                        Add Shows
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}

export default AddShow;