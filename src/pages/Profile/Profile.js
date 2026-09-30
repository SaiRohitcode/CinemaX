import "./Profile.css";
import { useState } from "react";
import api from "../../api/axios";

function Profile() {

    const storedUser = JSON.parse(localStorage.getItem("user"));

    const [formData, setFormData] = useState({
        name: storedUser?.name || "",
        email: storedUser?.email || "",
        mobile: storedUser?.mobile || "",
        gender: storedUser?.gender || "",
        dob: storedUser?.dob || "",
        city: storedUser?.city || "",
        state: storedUser?.state || ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await api.put(
                "/auth/profile",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            alert("Profile updated successfully.");

        }
        catch (error) {

            alert(
                error.response?.data?.message ||
                "Unable to update profile."
            );

        }

    };

    return (

        <div className="profile-page">

            <div className="profile-card">

                <div className="avatar">
                    {formData.name.charAt(0).toUpperCase()}
                </div>

                <h2>Edit Profile</h2>

                <div className="profile-grid">

                    <div className="input-group">
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            readOnly
                        />
                    </div>

                    <div className="input-group">
                        <label>Mobile</label>
                        <input
                            type="text"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-group">
                        <label>Gender</label>

                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                        >
                            <option value="">Select</option>
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                        </select>

                    </div>

                    <div className="input-group">
                        <label>Date of Birth</label>

                        <input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="input-group">
                        <label>State</label>

                        <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="input-group">
                        <label>City</label>

                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                        />

                    </div>

                </div>

                <button
                    className="save-btn"
                    onClick={handleSave}
                >
                    Save Changes
                </button>

            </div>

        </div>

    );

}

export default Profile;