import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalMenuItems: 0,
    totalUsers: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH DASHBOARD STATS
  // =====================================================

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/admin-login");
        return;
      }

      const response = await api.get(
        "/dashboard/stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStats({
        totalMenuItems:
          response.data.stats?.totalMenuItems || 0,

        totalUsers:
          response.data.stats?.totalUsers || 0,
      });
    } catch (err) {
      console.error(
        "Dashboard Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD DASHBOARD
  // =====================================================

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="dashboard-container">

        <div className="dashboard-loading">

          <div className="dashboard-loading-icon">
            📊
          </div>

          <h2>
            Loading Dashboard...
          </h2>

          <p>
            Please wait while statistics are loading.
          </p>

        </div>

      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="dashboard-container">

        <div className="dashboard-error">

          <h2>
            {error}
          </h2>

          <button
            type="button"
            className="primary-button"
            onClick={fetchDashboardStats}
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }

  // =====================================================
  // DASHBOARD
  // =====================================================

  return (
    <div className="dashboard-container">

      {/* =================================================
          HEADER
      ================================================== */}

      <div className="dashboard-header">

        <div>

          <p className="admin-label">
            ADMIN PANEL
          </p>

          <h1>
            Dashboard
          </h1>

          <p>
            Overview of your TastyBites system.
          </p>

        </div>

      </div>


      {/* =================================================
          STATISTICS
      ================================================== */}

      <div className="dashboard-stats">

        {/* =================================================
            TOTAL MENU ITEMS
        ================================================== */}

        <div className="dashboard-stat-card">

          <div className="dashboard-stat-icon">
            🍴
          </div>

          <div>

            <p>
              Total Menu Items
            </p>

            <h2>
              {stats.totalMenuItems}
            </h2>

          </div>

        </div>


        {/* =================================================
            TOTAL USERS
        ================================================== */}

        <div className="dashboard-stat-card">

          <div className="dashboard-stat-icon">
            👥
          </div>

          <div>

            <p>
              Total Users
            </p>

            <h2>
              {stats.totalUsers}
            </h2>

          </div>

        </div>


        {/* =================================================
            TOTAL ORDERS
        ================================================== */}

        <div className="dashboard-stat-card">

          <div className="dashboard-stat-icon">
            🛒
          </div>

          <div>

            <p>
              Total Orders
            </p>

            <h2>
              0
            </h2>

          </div>

        </div>

      </div>


      {/* =================================================
          QUICK ACTIONS
      ================================================== */}

      <div className="dashboard-actions">

        <h2>
          Quick Actions
        </h2>


        <div className="dashboard-action-buttons">

          {/* MANAGE MENU */}

          <button
            type="button"
            className="admin-add-button"
            onClick={() =>
              navigate("/admin")
            }
          >
            🍴 Manage Menu
          </button>


          {/* ADD FOOD */}

          <button
            type="button"
            className="admin-add-button"
            onClick={() =>
              navigate("/admin/add-food")
            }
          >
            + Add Food
          </button>


          {/* MANAGE USERS */}

          <button
            type="button"
            className="admin-add-button"
            onClick={() =>
              navigate("/admin/users")
            }
          >
            👥 Manage Users
          </button>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;