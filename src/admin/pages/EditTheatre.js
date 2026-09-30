import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import theatreService from "../services/theatreService";
import "../css/admin.css";
import "../css/forms.css";

function EditTheatre() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        address: "",
        city: "",
        state: "",
        googleMapsLink: "",
        pincode: "",
        totalScreens: "",
        contactNumber: ""
    });

    useEffect(() => {
        const fetchTheatre = async () => {
            try {
                const data = await theatreService.getTheatre(id);
                const theatre = data.theatre || data;

                setFormData({
                    name: theatre.name || "",
                    address: theatre.address || "",
                    city: theatre.city || "",
                    state: theatre.state || "",
                    googleMapsLink: theatre.googleMapsLink || "",
                    pincode: theatre.pincode || "",
                    totalScreens: theatre.totalScreens || "",
                    contactNumber: theatre.contactNumber || ""
                });
            } catch (err) {
                alert(
                    err.response?.data?.message ||
                    "Unable to fetch theatre details."
                );
            }
        };

        fetchTheatre();
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
            await theatreService.updateTheatre(id, formData);
            navigate("/admin/theatres");
        } catch (err) {
            alert(
                err.response?.data?.message ||
                "Unable to update theatre."
            );
        }
    };

    return (
        <AdminLayout>
            <div className="form-container">
                <h2 className="form-title">Edit Theatre</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Theatre Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Address</label>
                        <textarea
                            rows="3"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Google Maps Link</label>
                        <input
                            type="url"
                            name="googleMapsLink"
                            value={formData.googleMapsLink}
                            onChange={handleChange}
                            placeholder="https://maps.google.com/..."
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>City</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>State</label>
                        <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Pincode</label>
                        <input
                            type="text"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Total Screens</label>
                        <input
                            type="number"
                            name="totalScreens"
                            value={formData.totalScreens}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Contact Number</label>
                        <input
                            type="text"
                            name="contactNumber"
                            value={formData.contactNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                    >
                        Update Theatre
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}

export default EditTheatre;