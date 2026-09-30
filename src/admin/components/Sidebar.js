import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../css/sidebar.css";

function Sidebar() {
    const navigate = useNavigate();
    const menuItems = [

        {
            name: "Dashboard",
            path: "/admin/dashboard"
        },

        {
            name: "Movies",
            path: "/admin/movies"
        },

        {
            name: "Theatres",
            path: "/admin/theatres"
        },

        {
            name: "Screens",
            path: "/admin/screens"
        },

        {
            name: "Shows",
            path: "/admin/shows"
        },

        {
            name: "Bookings",
            path: "/admin/bookings"
        },

        {
            name: "Users",
            path: "/admin/users"
        }

    ];
    const handleLogout = () => {

        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");

        navigate("/admin/login");

    };

    return (

        <aside className="sidebar">

            <div className="sidebar-header">

                <h2>
                    Cinema<span>X</span>
                </h2>

                <p>Admin Panel</p>

            </div>

            <nav className="sidebar-menu">

                {

                    menuItems.map((item) => (

                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                isActive
                                    ? "menu-item active"
                                    : "menu-item"
                            }
                        >

                            {item.name}

                        </NavLink>

                    ))

                }

            </nav>
            <button
                className="btn btn-danger"
                onClick={handleLogout}
            >
                Logout
            </button>

        </aside>

    );

}

export default Sidebar;