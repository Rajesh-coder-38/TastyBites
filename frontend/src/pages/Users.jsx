import { useEffect, useState } from "react";
import api from "../services/api";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH USERS
  // ==========================================

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await api.get("/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(response.data.users || []);
    } catch (err) {
      console.error("Users Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD USERS
  // ==========================================

  useEffect(() => {
    fetchUsers();
  }, []);

  // ==========================================
  // DELETE USER
  // ==========================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await api.delete(`/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("User deleted successfully.");

      fetchUsers();
    } catch (err) {
      console.error("Delete User Error:", err);

      alert(
        err.response?.data?.message ||
          "Failed to delete user."
      );
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="users-page">

        <div className="users-status-card">

          <div className="users-status-icon">
            👥
          </div>

          <h2>Loading Users...</h2>

          <p>
            Please wait while we load the registered users.
          </p>

        </div>

      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="users-page">

        <div className="users-status-card">

          <div className="users-status-icon">
            ⚠️
          </div>

          <h2>Unable to Load Users</h2>

          <p>{error}</p>

          <button
            type="button"
            className="users-retry-button"
            onClick={fetchUsers}
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="users-page">

      {/* ======================================
          PAGE HEADER
      ======================================= */}

      <div className="users-page-header">

        <div className="users-page-heading">

          <p className="users-admin-label">
            ADMIN PANEL
          </p>

          <h1>User Management</h1>

          <p className="users-page-subtitle">
            View and manage all registered users.
          </p>

        </div>

        <div className="users-count-box">

          <strong>{users.length}</strong>

          <span>
            {users.length === 1 ? "User" : "Users"}
          </span>

        </div>

      </div>


      {/* ======================================
          EMPTY USERS
      ======================================= */}

      {users.length === 0 ? (

        <div className="users-empty-card">

          <div className="users-empty-icon">
            👥
          </div>

          <h2>No Users Found</h2>

          <p>
            There are no registered users yet.
          </p>

        </div>

      ) : (

        /* ====================================
           USERS TABLE
        ===================================== */

        <div className="users-table-card">

          {/* TABLE HEADER */}

          <div className="users-table-header">

            <div>

              <h2>
                Registered Users
              </h2>

              <p>
                All users registered in the system
              </p>

            </div>

            <div className="users-total">
              Total: {users.length}
            </div>

          </div>


          {/* TABLE */}

          <div className="users-table-scroll">

            <table className="users-table">

              <thead>

                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Registration Date</th>
                  <th>Action</th>
                </tr>

              </thead>


              <tbody>

                {users.map((user) => {

                  const isAdmin =
                    user.role?.toLowerCase() === "admin";

                  const firstLetter =
                    user.name
                      ? user.name.charAt(0).toUpperCase()
                      : "U";

                  return (
                    <tr key={user._id}>

                      {/* NAME */}

                      <td>

                        <div className="users-name">

                          <div className="users-avatar">
                            {firstLetter}
                          </div>

                          <span>
                            {user.name || "Unknown User"}
                          </span>

                        </div>

                      </td>


                      {/* EMAIL */}

                      <td>

                        <span className="users-email">
                          {user.email}
                        </span>

                      </td>


                      {/* ROLE */}

                      <td>

                        <span
                          className={
                            isAdmin
                              ? "users-role users-role-admin"
                              : "users-role users-role-user"
                          }
                        >
                          {isAdmin ? "Admin" : "User"}
                        </span>

                      </td>


                      {/* DATE */}

                      <td>

                        <span className="users-date">

                          {user.createdAt
                            ? new Date(
                                user.createdAt
                              ).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )
                            : "N/A"}

                        </span>

                      </td>


                      {/* ACTION */}

                      <td>

                        {isAdmin ? (

                          <span className="users-protected">
                            Protected
                          </span>

                        ) : (

                          <button
                            type="button"
                            className="users-delete-button"
                            onClick={() =>
                              handleDelete(user._id)
                            }
                          >
                            🗑 Delete
                          </button>

                        )}

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>

        </div>

      )}

    </div>
  );
}

export default Users;