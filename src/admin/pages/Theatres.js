import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import theatreService from "../services/theatreService";

import "../css/admin.css";
import "../css/table.css";

function Theatres() {

    const [theatres, setTheatres] = useState([]);

    useEffect(() => {
        fetchTheatres();
    }, []);

    const fetchTheatres = async () => {

        try {

            const data = await theatreService.getTheatres();

            setTheatres(data.theatres || data);

        } catch (err) {

            console.log(err);

        }

    };

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this theatre?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            await theatreService.deleteTheatre(id);

            fetchTheatres();

        } catch (err) {

            alert(
                err.response?.data?.message ||
                "Unable to delete theatre."
            );

        }

    };

    return (

        <AdminLayout>

            <div className="table-container">

                <div className="table-header">

                    <h2>Theatres</h2>

                    <Link
                        to="/admin/theatres/add"
                        className="btn btn-primary"
                    >
                        Add Theatre
                    </Link>

                </div>

                <table className="admin-table">

                    <thead>

                        <tr>

                            <th>Name</th>
                            <th>City</th>
                            <th>State</th>
                            <th>Screens</th>
                            <th>Actions</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            theatres.length === 0 ?

                                (

                                    <tr>

                                        <td
                                            colSpan="5"
                                            style={{ textAlign: "center" }}
                                        >

                                            No Theatres Found

                                        </td>

                                    </tr>

                                )

                                :

                                (

                                    theatres.map((theatre) => (

                                        <tr key={theatre._id}>

                                            <td>{theatre.name}</td>

                                            <td>{theatre.city}</td>

                                            <td>{theatre.state}</td>

                                            <td>{theatre.totalScreens}</td>

                                            <td>

                                                <Link
                                                    to={`/admin/theatres/edit/${theatre._id}`}
                                                    className="btn btn-secondary"
                                                >
                                                    Edit
                                                </Link>

                                                <button
                                                    className="btn btn-danger"
                                                    onClick={() => handleDelete(theatre._id)}
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

export default Theatres;