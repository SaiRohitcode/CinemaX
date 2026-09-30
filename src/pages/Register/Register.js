import "./Register.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import api from "../../api/axios";

function Register() {

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = async (e) => {

        e.preventDefault();

        const { name, email, mobile, password, confirmPassword } = formData;

        if (!name || !email || !mobile || !password || !confirmPassword) {
            alert("Please fill all fields.");
            return;
        }

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            alert("Enter a valid email.");
            return;
        }

        if (mobile.length !== 10) {
            alert("Enter a valid mobile number.");
            return;
        }

        if (password.length < 6) {
            alert("Password should contain at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {

            const response = await api.post(
                "/auth/register",
                {
                    name,
                    email,
                    mobile,
                    password
                }
            );
            console.log(response.data);
            navigate("/login");

        }
        catch (error) {

            alert(
                error.response?.data?.message ||
                "Registration Failed"
            );

        }

    };

    return (

        <div className="register-page">

            <div className="register-card">

                <h1>Cinema<span>X</span></h1>

                <h2>Create Account</h2>

                <p>Create your CinemaX account to start booking.</p>

                <form onSubmit={handleRegister}>

                    <div className="input-group">

                        <label>Full Name</label>

                        <input
                            type="text"
                            name="name"
                            placeholder="Enter Full Name"
                            value={formData.name}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="input-group">

                        <label>Email</label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter Email"
                            value={formData.email}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="input-group">

                        <label>Mobile Number</label>

                        <input
                            type="tel"
                            name="mobile"
                            placeholder="Enter Mobile Number"
                            value={formData.mobile}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="input-group">

                        <label>Password</label>

                        <div className="password-box">

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                name="password"
                                placeholder="Enter Password"
                                value={formData.password}
                                onChange={handleChange}
                            />

                            <span
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                            >
                                {
                                    showPassword
                                        ? <EyeOff size={20} />
                                        : <Eye size={20} />
                                }
                            </span>

                        </div>

                    </div>

                    <div className="input-group">

                        <label>Confirm Password</label>

                        <div className="password-box">

                            <input
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />

                            <span
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                            >
                                {
                                    showConfirmPassword
                                        ? <EyeOff size={20} />
                                        : <Eye size={20} />
                                }
                            </span>

                        </div>

                    </div>

                    <button
                        type="submit"
                        className="register-btn"
                    >
                        Register
                    </button>

                </form>

                <p className="bottom-text">

                    Already have an account?

                    <Link to="/login">
                        Login
                    </Link>

                </p>

            </div>

        </div>

    );

}

export default Register;