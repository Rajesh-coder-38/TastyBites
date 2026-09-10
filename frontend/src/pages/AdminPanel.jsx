import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

function AdminPanel() {
  const navigate = useNavigate();

  const [menuItems, setMenuItems] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // IMAGE URL
  // ==========================================

  const getImageUrl = (image) => {
    if (!image) {
      return "";
    }

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    return `http://localhost:5000${image}`;
  };

  // ==========================================
  // FETCH MENU
  // ==========================================

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/menu-items"
      );

      setMenuItems(
        response.data.menuItems || []
      );
    } catch (err) {
      console.error(
        "Admin Menu Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load menu items."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD MENU
  // ==========================================

  useEffect(() => {
    fetchMenuItems();
  }, []);

  // ==========================================
  // DELETE FOOD
  // ==========================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this food?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token =
        localStorage.getItem("token");

      if (!token) {
        alert(
          "Please login as admin first."
        );

        navigate("/admin-login");

        return;
      }

      await api.delete(
        `/menu-items/${id}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      alert(
        "Food deleted successfully."
      );

      fetchMenuItems();

    } catch (err) {
      console.error(
        "Delete Food Error:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Failed to delete food."
      );
    }
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredItems = menuItems.filter(
    (item) => {

      const searchText =
        search.trim().toLowerCase();

      // Empty search = show all items
      if (!searchText) {
        return true;
      }

      // "all item" / "all items" = show all items
      if (
        searchText === "all item" ||
        searchText === "all items"
      ) {
        return true;
      }

      // Search by name, description or category
      return (
        item.name
          ?.toLowerCase()
          .includes(searchText) ||

        item.description
          ?.toLowerCase()
          .includes(searchText) ||

        item.category
          ?.toLowerCase()
          .includes(searchText)
      );
    }
  );

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="admin-panel-container">

        <div className="admin-panel-card">

          <div className="orders-loading">

            <div className="orders-loading-icon">
              🍴
            </div>

            <h2>
              Loading menu...
            </h2>

            <p>
              Please wait while menu items are loading.
            </p>

          </div>

        </div>

      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="admin-panel-container">

      {/* ======================================
          HEADER
      ======================================= */}

      <div className="admin-panel-header">

        <div>

          <p className="admin-label">
            ADMIN PANEL
          </p>

          <h1>
            Menu Management
          </h1>

          <p>
            Add, edit and manage your food items.
          </p>

        </div>


        {/* ====================================
            ADMIN NAVIGATION
        ===================================== */}

        <div className="admin-panel-header-actions">

          {/* DASHBOARD */}

          <button
            type="button"
            className="admin-add-button"
            onClick={() =>
              navigate("/admin/dashboard")
            }
          >
            📊 Dashboard
          </button>


          {/* USERS */}

          <button
            type="button"
            className="admin-add-button"
            onClick={() =>
              navigate("/admin/users")
            }
          >
            👥 Users
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

        </div>

      </div>


      {/* ======================================
          SEARCH
      ======================================= */}

      <div className="admin-search">

        <input
          type="text"
          placeholder="Search menu item..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>


      {/* ======================================
          ERROR
      ======================================= */}

      {error && (
        <div className="error-message">

          <div>
            {error}
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={fetchMenuItems}
          >
            Try Again
          </button>

        </div>
      )}


      {/* ======================================
          FOOD COUNT
      ======================================= */}

      <div className="admin-menu-count">

        Showing{" "}

        <strong>
          {filteredItems.length}
        </strong>{" "}

        of{" "}

        <strong>
          {menuItems.length}
        </strong>{" "}

        food item
        {menuItems.length !== 1
          ? "s"
          : ""}

      </div>


      {/* ======================================
          EMPTY SEARCH RESULT
      ======================================= */}

      {filteredItems.length === 0 ? (

        <div className="admin-empty">

          <div className="empty-cart-icon">
            🍴
          </div>

          <h2>
            No food items found
          </h2>

          <p>
            Try a different search.
          </p>

        </div>

      ) : (

        /* ====================================
           FOOD GRID
        ===================================== */

        <div className="admin-menu-grid">

          {filteredItems.map((item) => (

            <div
              className="admin-food-card"
              key={item._id}
            >

              {/* =================================
                  FOOD IMAGE
              ================================== */}

              <div className="admin-food-image">

                {item.image ? (

                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    onError={(e) => {

                      console.error(
                        "Admin image failed:",
                        item.image
                      );

                      e.currentTarget.style.display =
                        "none";

                    }}
                  />

                ) : (

                  <div className="admin-no-image">
                    🍴
                  </div>

                )}

              </div>


              {/* =================================
                  FOOD CONTENT
              ================================== */}

              <div className="admin-food-content">

                {/* NAME + PRICE */}

                <div className="admin-food-top">

                  <h2>
                    {item.name}
                  </h2>

                  <span className="admin-food-price">
                    ₹{item.price}
                  </span>

                </div>


                {/* DESCRIPTION */}

                <p className="admin-food-description">

                  {item.description ||
                    "No description available."}

                </p>


                {/* CATEGORY + AVAILABILITY */}

                <div className="admin-food-details">

                  <span>
                    Category:{" "}
                    {item.category}
                  </span>

                  <span
                    className={
                      item.availability
                        ? "available"
                        : "unavailable"
                    }
                  >

                    {item.availability
                      ? "● Available"
                      : "● Unavailable"}

                  </span>

                </div>


                {/* ACTION BUTTONS */}

                <div className="admin-food-actions">

                  {/* EDIT */}

                  <button
                    type="button"
                    className="admin-edit-button"
                    onClick={() =>
                      navigate(
                        `/admin/edit-food/${item._id}`
                      )
                    }
                  >
                    Edit
                  </button>


                  {/* DELETE */}

                  <button
                    type="button"
                    className="admin-delete-button"
                    onClick={() =>
                      handleDelete(
                        item._id
                      )
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default AdminPanel;