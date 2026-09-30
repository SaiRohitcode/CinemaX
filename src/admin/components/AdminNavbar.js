
import "../css/admin.css";

function AdminNavbar() {

    

    const admin = JSON.parse(localStorage.getItem("admin")) || {};


    return (

        <header className="admin-navbar">

            <div className="admin-navbar-left">

                <h2>Dashboard</h2>

            </div>

            <div className="admin-navbar-right">

                <span className="admin-user">

                    Welcome, {admin.name || "Admin"}

                </span>

            </div>

        </header>

    );

}

export default AdminNavbar;