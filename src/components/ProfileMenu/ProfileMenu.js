import "./ProfileMenu.css";
import { Link } from "react-router-dom";
import { Pencil } from "lucide-react";

function ProfileMenu({ user, handleLogout }) {
    return (
        <div className="profile-popup">

            <div className="profile-header">

                <div className="profile-avatar">
                    {user?.name?.charAt(0).toUpperCase()}
                </div>

                <div className="profile-details">

                    <div className="profile-name">
                        {user?.name}
                    </div>

                    <div className="profile-email">
                        {user?.email}
                    </div>

                </div>

                <Link
                    to="/profile"
                    className="edit-profile"
                >
                    <Pencil size={18}/>
                    <span>Edit</span>
                </Link>

            </div>

            <div className="profile-divider"></div>

            <Link
                to="/bookings"
                className="profile-item"
            >
                🎟 My Bookings
            </Link>

            <Link
                to="/booking-history"
                className="profile-item"
            >
                📜 Booking History
            </Link>

            <button
                className="logout-btn"
                onClick={handleLogout}
            >
                🚪 Logout
            </button>

        </div>
    );
}

export default ProfileMenu;