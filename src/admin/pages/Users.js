import { useEffect, useState } from "react";

import AdminLayout from "../components/AdminLayout";
import userService from "../services/userService";

import "../css/admin.css";
import "../css/table.css";

function Users() {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {

        try {

            const data = await userService.getUsers();

            setUsers(data.users || data);

        } catch (err) {

            console.log(err);

            alert(
                err.response?.data?.message ||
                "Unable to fetch users."
            );

        }

    };

    const handleToggleStatus = async (id) => {

        try {

            await userService.toggleUserStatus(id);

            fetchUsers();

        } catch (err) {

            alert(
                err.response?.data?.message ||
                "Unable to update user."
            );

        }

    };

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            await userService.deleteUser(id);

            fetchUsers();

        } catch (err) {

            alert(
                err.response?.data?.message ||
                "Unable to delete user."
            );

        }

    };

    return (

        <AdminLayout>

            <div className="table-container">

                <div className="table-header">

                    <h2>Users</h2>

                </div>

                <table className="admin-table">

                    <thead>

                        <tr>

                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>Actions</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            users.length === 0 ?

                                (

                                    <tr>

                                        <td
                                            colSpan="5"
                                            style={{ textAlign: "center" }}
                                        >
                                            No Users Found
                                        </td>

                                    </tr>

                                )

                                :

                                (

                                    users.map((user) => (

                                        <tr key={user._id}>

                                            <td>{user.name}</td>

                                            <td>{user.email}</td>

                                            <td>{user.phone}</td>

                                            <td>

                                                {

                                                    user.isActive
                                                        ? "Active"
                                                        : "Blocked"

                                                }

                                            </td>

                                            <td>

                                                <button
                                                    className="btn btn-warning"
                                                    onClick={() => handleToggleStatus(user._id)}
                                                >

                                                    {

                                                        user.isActive
                                                            ? "Block"
                                                            : "Unblock"

                                                    }

                                                </button>

                                                <button
                                                    className="btn btn-danger"
                                                    onClick={() => handleDelete(user._id)}
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

export default Users;