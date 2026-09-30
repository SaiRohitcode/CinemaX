import Sidebar from "./Sidebar";
import AdminNavbar from "./AdminNavbar";
import "../css/admin.css";

function AdminLayout({ children }) {

    return (

        <div className="dashboard-container">

            <Sidebar />

            <div className="dashboard-content">

                <AdminNavbar />

                {children}

            </div>

        </div>

    );

}

export default AdminLayout;