import { Navigate } from "react-router-dom";

function ProtectedAdminRoute({ children }) {

    const adminToken = localStorage.getItem("adminToken");
    const admin = JSON.parse(
        localStorage.getItem("admin")
    );

    if (!adminToken || !admin || !admin.isAdmin) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }

    return children;
}

export default ProtectedAdminRoute;