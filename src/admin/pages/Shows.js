import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import showService from "../services/showService";
import "../css/admin.css";
import "../css/table.css";

function Shows() {
    const [shows, setShows] = useState([]);

    useEffect(() => {
        fetchShows();
    }, []);

    const fetchShows = async () => {
        try {
            const data = await showService.getShows();
            setShows(data.shows || data);
        } catch (err) {
            console.log(err);
            alert(
                err.response?.data?.message ||
                "Unable to fetch shows."
            );
        }
    };

    const handleDelete = async id => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this show?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await showService.deleteShow(id);
            fetchShows();
        } catch (err) {
            alert(
                err.response?.data?.message ||
                "Unable to delete show."
            );
        }
    };

    return (
        <AdminLayout>
            <div className="table-container">
                <div className="table-header">
                    <h2>Shows</h2>

                    <Link
                        to="/admin/shows/add"
                        className="btn btn-primary"
                    >
                        Add Show
                    </Link>
                </div>

                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Movie</th>
                            <th>Theatre</th>
                            <th>Screen</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Language</th>
                            <th>Format</th>
                            <th>Pricing</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {shows.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="9"
                                    style={{ textAlign: "center" }}
                                >
                                    No Shows Found
                                </td>
                            </tr>
                        ) : (
                            shows.map(show => (
                                <tr key={show._id}>
                                    <td>
                                        {show.movie?.title || "N/A"}
                                    </td>

                                    <td>
                                        {show.theatre?.name || "N/A"}
                                    </td>

                                    <td>
                                        {show.screen?.name || "N/A"}
                                    </td>

                                    <td>
                                        {show.date
                                            ? new Date(
                                                  show.date
                                              ).toLocaleDateString()
                                            : "N/A"}
                                    </td>

                                    <td>
                                        {show.showTime || "N/A"}
                                    </td>

                                    <td>
                                        {show.language || "N/A"}
                                    </td>

                                    <td>
                                        {show.format || "N/A"}
                                    </td>

                                    <td>
                                        {show.pricing?.length > 0 ? (
                                            show.pricing.map(item => (
                                                <div key={item.section}>
                                                    {item.section}: ₹
                                                    {item.price}
                                                </div>
                                            ))
                                        ) : (
                                            "N/A"
                                        )}
                                    </td>

                                    <td>
                                        <Link
                                            to={`/admin/shows/edit/${show._id}`}
                                            className="btn btn-secondary"
                                        >
                                            Edit
                                        </Link>

                                        <button
                                            className="btn btn-danger"
                                            onClick={() =>
                                                handleDelete(show._id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}

export default Shows;