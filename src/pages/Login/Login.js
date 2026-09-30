import "./Login.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import api from "../../api/axios";

function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleLogin = async (e) => {

        e.preventDefault();

        if (!formData.email || !formData.password) {

            alert("Please fill all fields.");
            return;

        }

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(formData.email)) {

            alert("Enter a valid email.");
            return;

        }

        try {

            const response = await api.post(
                "/auth/login",
                formData
            );

            const token = response.data.token;
            const user = response.data.user;

            // =========================
            // ADMIN LOGIN
            // =========================

            if (user.isAdmin) {

                // Remove old customer login data
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                localStorage.removeItem("isLoggedIn");

                // Store admin login data
                localStorage.setItem(
                    "adminToken",
                    token
                );

                localStorage.setItem(
                    "admin",
                    JSON.stringify(user)
                );

                navigate("/admin/dashboard");

                return;
            }

            // =========================
            // CUSTOMER LOGIN
            // =========================

            // Remove old admin login data
            localStorage.removeItem("adminToken");
            localStorage.removeItem("admin");

            // Store customer login data
            localStorage.setItem(
                "token",
                token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            localStorage.setItem(
                "isLoggedIn",
                "true"
            );

            navigate("/");

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Login Failed"
            );

        }

    };

    return (

        <div className="login-page">

            <div className="login-card">

                <h1>
                    Cinema<span>X</span>
                </h1>

                <h2>
                    Welcome Back
                </h2>

                <p>
                    Login to continue booking your favourite movies.
                </p>

                <form onSubmit={handleLogin}>

                    <div className="input-group">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter Email"
                            value={formData.email}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="input-group">

                        <label>
                            Password
                        </label>

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
                                    setShowPassword(
                                        !showPassword
                                    )
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

                    <button
                        type="submit"
                        className="login-btn"
                    >
                        Login
                    </button>

                </form>

                <p className="bottom-text">

                    Don't have an account?

                    <Link to="/register">
                        Register
                    </Link>

                </p>

            </div>

        </div>

    );

}

export default Login;