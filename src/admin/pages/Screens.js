import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import AdminLayout from "../components/AdminLayout";
import screenService from "../services/screenService";

import "../css/admin.css";
import "../css/table.css";

function Screens() {

    const [screens, setScreens] = useState([]);

    useEffect(() => {
        fetchScreens();
    }, []);

    const fetchScreens = async () => {

        try {

            const data = await screenService.getScreens();

            setScreens(data.screens || data);

        } catch (err) {

            console.log(err);

            alert(
                err.response?.data?.message ||
                "Unable to fetch screens."
            );

        }

    };

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this screen?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            await screenService.deleteScreen(id);

            fetchScreens();

        } catch (err) {

            alert(
                err.response?.data?.message ||
                "Unable to delete screen."
            );

        }

    };

    return (

        <AdminLayout>

            <div className="table-container">

                <div className="table-header">

                    <h2>Screens</h2>

                    <Link
                        to="/admin/screens/add"
                        className="btn btn-primary"
                    >
                        Add Screen
                    </Link>

                </div>

                <table className="admin-table">

                    <thead>

                        <tr>

                            <th>Screen Name</th>
                            <th>Theatre</th>
                            <th>Total Seats</th>
                            <th>Screen Type</th>
                            <th>Actions</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            screens.length === 0 ?

                                (

                                    <tr>

                                        <td
                                            colSpan="5"
                                            style={{ textAlign: "center" }}
                                        >

                                            No Screens Found

                                        </td>

                                    </tr>

                                )

                                :

                                (

                                    screens.map((screen) => (

                                        <tr key={screen._id}>

                                            <td>{screen.name}</td>

                                            <td>
                                                {screen.theatre?.name || "N/A"}
                                            </td>

                                            <td>{screen.totalSeats}</td>

                                            <td>{screen.screenType}</td>

                                            <td>

                                                <Link
                                                    to={`/admin/screens/edit/${screen._id}`}
                                                    className="btn btn-secondary"
                                                >
                                                    Edit
                                                </Link>

                                                <button
                                                    className="btn btn-danger"
                                                    onClick={() => handleDelete(screen._id)}
                                                >
                                                    Delete
                                                </button>

                                            </td>

                                        </tr>

                                    ))

                                )

                        }

                    </tbody>

                </table>

            </div>

        </AdminLayout>

    );

}

export default Screens;