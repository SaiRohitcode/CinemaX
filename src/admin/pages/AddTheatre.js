import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminLayout from "../components/AdminLayout";
import theatreService from "../services/theatreService";

import "../css/admin.css";
import "../css/forms.css";

function AddTheatre() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        state: "",
        city: "",
        address: "",
        googleMapsLink: "",
        facilities: "",
        rating: 0,
        isActive: true
    });

    const handleChange = (e) => {

        const { name, value, type, checked } = e.target;

        setFormData({
            ...formData,
            [name]:
                type === "checkbox"
                    ? checked
                    : value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const theatreData = {
                name: formData.name,
                state: formData.state,
                city: formData.city,
                address: formData.address,
                googleMapsLink: formData.googleMapsLink,

                facilities: formData.facilities
                    .split(",")
                    .map((facility) => facility.trim())
                    .filter((facility) => facility !== ""),

                rating: Number(formData.rating),

                isActive: formData.isActive
            };

            await theatreService.addTheatre(
                theatreData
            );

            alert("Theatre added successfully.");

            navigate("/admin/theatres");

        } catch (err) {

            console.error(err);

            alert(
                err.response?.data?.message ||
                "Unable to add theatre."
            );

        }

    };

    return (

        <AdminLayout>

            <div className="form-container">

                <h2 className="form-title">
                    Add Theatre
                </h2>

                <form onSubmit={handleSubmit}>

                    {/* Theatre Name */}

                    <div className="form-group">

                        <label>
                            Theatre Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            placeholder="e.g. PVR Cinemas"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* State */}

                    <div className="form-group">

                        <label>
                            State
                        </label>

                        <input
                            type="text"
                            name="state"
                            placeholder="e.g. Telangana"
                            value={formData.state}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* City */}

                    <div className="form-group">

                        <label>
                            City
                        </label>

                        <input
                            type="text"
                            name="city"
                            placeholder="e.g. Hyderabad"
                            value={formData.city}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* Address */}

                    <div className="form-group">

                        <label>
                            Address
                        </label>

                        <textarea
                            rows="3"
                            name="address"
                            placeholder="Enter complete theatre address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* Google Maps Link */}

                    <div className="form-group">

                        <label>
                            Google Maps Link
                        </label>

                        <input
                            type="url"
                            name="googleMapsLink"
                            placeholder="https://maps.google.com/..."
                            value={formData.googleMapsLink}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* Facilities */}

                    <div className="form-group">

                        <label>
                            Facilities
                        </label>

                        <input
                            type="text"
                            name="facilities"
                            placeholder="Parking, Food Court, Dolby Atmos"
                            value={formData.facilities}
                            onChange={handleChange}
                        />

                        <small>
                            Separate facilities with commas.
                        </small>

                    </div>


                    {/* Rating */}

                    <div className="form-group">

                        <label>
                            Rating
                        </label>

                        <input
                            type="number"
                            name="rating"
                            min="0"
                            max="5"
                            step="0.1"
                            placeholder="4.5"
                            value={formData.rating}
                            onChange={handleChange}
                        />

                    </div>


                    {/* Active Status */}

                    <div className="form-group">

                        <label>

                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                            />

                            {" "}
                            Theatre Active

                        </label>

                    </div>


                    {/* Submit */}

                    <button
                        type="submit"
                        className="btn btn-primary"
                    >
                        Add Theatre
                    </button>

                </form>

            </div>

        </AdminLayout>

    );

}

export default AddTheatre;