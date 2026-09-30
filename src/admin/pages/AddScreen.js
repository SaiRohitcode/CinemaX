import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import screenService from "../services/screenService";
import theatreService from "../services/theatreService";
import "../css/admin.css";
import "../css/forms.css";

function AddScreen() {
    const navigate = useNavigate();

    const [theatres, setTheatres] = useState([]);
    const [formData, setFormData] = useState({
        theatre: "",
        name: "",
        screenType: "2D"
    });

    const [sections, setSections] = useState([
        { name: "", rows: 1, seatsPerRow: 1, price: 0 }
    ]);

    useEffect(() => {
        theatreService.getTheatres()
            .then(data => setTheatres(data.theatres || data))
            .catch(() => alert("Unable to fetch theatres."));
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSectionChange = (index, e) => {
        const updated = [...sections];
        updated[index][e.target.name] = e.target.value;
        setSections(updated);
    };

    const addSection = () => {
        setSections([
            ...sections,
            { name: "", rows: 1, seatsPerRow: 1, price: 0 }
        ]);
    };

    const removeSection = (index) => {
        setSections(sections.filter((_, i) => i !== index));
    };

    const totalSeats = sections.reduce(
        (total, section) =>
            total +
            Number(section.rows) * Number(section.seatsPerRow),
        0
    );

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await screenService.addScreen({
                ...formData,
                sections: sections.map(section => ({
                    name: section.name,
                    rows: Number(section.rows),
                    seatsPerRow: Number(section.seatsPerRow),
                    price: Number(section.price)
                })),
                totalSeats
            });

            navigate("/admin/screens");

        } catch (err) {
            alert(
                err.response?.data?.message ||
                "Unable to add screen."
            );
        }
    };

    return (
        <AdminLayout>
            <div className="form-container">

                <h2 className="form-title">Add Screen</h2>

                <form onSubmit={handleSubmit}>

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
                        <label>Screen Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Screen 1"
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

                    <h3>Seat Sections</h3>

                    {sections.map((section, index) => (
                        <div className="section-box" key={index}>

                            <div className="form-group">
                                <label>Seat Type</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={section.name}
                                    onChange={(e) =>
                                        handleSectionChange(index, e)
                                    }
                                    placeholder="Balcony / Lounge / Recliner"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Rows</label>
                                <input
                                    type="number"
                                    name="rows"
                                    min="1"
                                    value={section.rows}
                                    onChange={(e) =>
                                        handleSectionChange(index, e)
                                    }
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Seats Per Row</label>
                                <input
                                    type="number"
                                    name="seatsPerRow"
                                    min="1"
                                    value={section.seatsPerRow}
                                    onChange={(e) =>
                                        handleSectionChange(index, e)
                                    }
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Price</label>
                                <input
                                    type="number"
                                    name="price"
                                    min="0"
                                    value={section.price}
                                    onChange={(e) =>
                                        handleSectionChange(index, e)
                                    }
                                    required
                                />
                            </div>

                            {sections.length > 1 && (
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => removeSection(index)}
                                >
                                    Remove
                                </button>
                            )}

                        </div>
                    ))}

                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={addSection}
                    >
                        + Add Section
                    </button>

                    <p>
                        <strong>Total Seats:</strong> {totalSeats}
                    </p>

                    <button
                        type="submit"
                        className="btn btn-primary"
                    >
                        Add Screen
                    </button>

                </form>

            </div>
        </AdminLayout>
    );
}

export default AddScreen;