import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import screenService from "../services/screenService";
import theatreService from "../services/theatreService";
import ScreenLayoutDesigner from "./ScreenLayoutDesigner";
import "../css/admin.css";
import "../css/forms.css";

function EditScreen() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [theatres, setTheatres] = useState([]);
    const [showDesigner, setShowDesigner] = useState(false);
    const [formData, setFormData] = useState({
        theatre: "",
        name: "",
        screenType: "2D",
        totalSeats: ""
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const theatreData = await theatreService.getTheatres();
                setTheatres(theatreData.theatres || theatreData);
            } catch (err) {
                alert(err.response?.data?.message || "Unable to fetch theatres.");
            }

            try {
                const screenData = await screenService.getScreen(id);
                const screen = screenData.screen || screenData;
                setFormData({
                    theatre: screen.theatre?._id || screen.theatre || "",
                    name: screen.name || "",
                    screenType: screen.screenType || "2D",
                    totalSeats: screen.totalSeats || ""
                });
            } catch (err) {
                alert(err.response?.data?.message || "Unable to fetch screen details.");
            }
        };

        loadData();
    }, [id]);

    const handleChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await screenService.updateScreen(id, formData);
            navigate("/admin/screens");
        } catch (err) {
            alert(err.response?.data?.message || "Unable to update screen.");
        }
    };

    if (showDesigner) {
        return (
            <AdminLayout>
                <ScreenLayoutDesigner
                    screenId={id}
                    onClose={() => setShowDesigner(false)}
                />
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="form-container">
                <h2 className="form-title">Edit Screen</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Select Theatre</label>
                        <select
                            name="theatre"
                            value={formData.theatre}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Theatre</option>
                            {theatres.map(theatre => (
                                <option key={theatre._id} value={theatre._id}>
                                    {theatre.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Screen Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Screen Type</label>
                        <select
                            name="screenType"
                            value={formData.screenType}
                            onChange={handleChange}
                        >
                            <option value="2D">2D</option>
                            <option value="3D">3D</option>
                            <option value="IMAX">IMAX</option>
                            <option value="4DX">4DX</option>
                            <option value="Dolby Atmos">Dolby Atmos</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Total Seats</label>
                        <input
                            type="number"
                            name="totalSeats"
                            value={formData.totalSeats}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary">
                        Update Screen
                    </button>

                    <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ marginLeft: "10px" }}
                        onClick={() => setShowDesigner(true)}
                    >
                        Design Layout
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}

export default EditScreen;