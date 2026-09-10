import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const statuses = [
    "Pending",
    "Confirmed",
    "Preparing",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
  ];

  // ==========================================
  // FETCH ALL ORDERS
  // ==========================================

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/admin-login");
        return;
      }

      const response = await api.get("/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(response.data.orders || []);
    } catch (err) {
      console.error("Admin Orders Error:", err);

      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {
        setError(
          err.response?.data?.message ||
            "Admin access required."
        );
      } else {
        setError(
          err.response?.data?.message ||
            "Failed to load orders."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD ORDERS
  // ==========================================

  useEffect(() => {
    fetchOrders();
  }, []);

  // ==========================================
  // UPDATE ORDER STATUS
  // ==========================================

  const handleStatusChange = async (orderId, status) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/admin-login");
        return;
      }

      await api.put(
        `/orders/${orderId}/status`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Order status updated successfully.");

      fetchOrders();
    } catch (err) {
      console.error(
        "Update Order Status Error:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Failed to update order status."
      );
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="admin-orders-container">
        <div className="admin-orders-card">
          <div className="orders-loading">
            <div className="orders-loading-icon">
              🛒
            </div>

            <h2>Loading orders...</h2>

            <p>
              Please wait while orders are loading.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="admin-orders-container">
        <div className="admin-orders-card admin-orders-error">
          <h2>{error}</h2>

          <button
            type="button"
            className="primary-button"
            onClick={fetchOrders}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN PAGE
  // ==========================================

  return (
    <div className="admin-orders-container">

      {/* ======================================
          HEADER
      ======================================= */}

      <div className="admin-orders-header">
        <div>
          <p className="admin-label">
            ADMIN PANEL
          </p>

          <h1>Order Management</h1>

          <p>
            View and manage all customer orders.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() =>
            navigate("/admin/dashboard")
          }
        >
          ← Dashboard
        </button>
      </div>

      {/* ======================================
          ORDER COUNT
      ======================================= */}

      <div className="admin-order-count">
        Total Orders:{" "}
        <strong>{orders.length}</strong>
      </div>

      {/* ======================================
          EMPTY ORDERS
      ======================================= */}

      {orders.length === 0 ? (
        <div className="admin-empty">
          <div className="empty-cart-icon">
            🛒
          </div>

          <h2>No orders found</h2>

          <p>
            There are no customer orders yet.
          </p>
        </div>
      ) : (

        /* ====================================
           ORDERS
        ===================================== */

        <div className="admin-orders-list">

          {orders.map((order) => {

            const currentStatus =
              order.status || "Pending";

            return (
              <div
                className="admin-order-card"
                key={order._id}
              >

                {/* =================================
                    ORDER HEADER
                ================================== */}

                <div className="admin-order-header">

                  <div>
                    <p className="order-label">
                      ORDER ID
                    </p>

                    <h2>
                      #
                      {order._id
                        ?.slice(-8)
                        .toUpperCase()}
                    </h2>

                    <p>
                      {order.createdAt
                        ? new Date(
                            order.createdAt
                          ).toLocaleString()
                        : "Date unavailable"}
                    </p>
                  </div>

                  <div className="admin-order-status-box">

                    <label>
                      Status
                    </label>

                    <select
                      value={currentStatus}
                      onChange={(e) =>
                        handleStatusChange(
                          order._id,
                          e.target.value
                        )
                      }
                    >
                      {statuses.map(
                        (status) => (
                          <option
                            key={status}
                            value={status}
                          >
                            {status}
                          </option>
                        )
                      )}
                    </select>

                  </div>

                </div>

                {/* =================================
                    CUSTOMER INFORMATION
                ================================== */}

                <div className="admin-customer-info">

                  <h3>
                    Customer Information
                  </h3>

                  <div className="admin-info-grid">

                    <div>
                      <span>
                        Name
                      </span>

                      <strong>
                        {order.user?.name ||
                          "N/A"}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Email
                      </span>

                      <strong>
                        {order.user?.email ||
                          "N/A"}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Phone
                      </span>

                      <strong>
                        {order.phone ||
                          "N/A"}
                      </strong>
                    </div>

                  </div>

                </div>

                {/* =================================
                    DELIVERY ADDRESS
                ================================== */}

                <div className="admin-delivery-address">

                  <h3>
                    📍 Delivery Address
                  </h3>

                  <p>
                    {order.deliveryAddress ||
                      "Address unavailable"}
                  </p>

                </div>

                {/* =================================
                    ORDER ITEMS
                ================================== */}

                <div className="admin-order-items">

                  <h3>
                    Ordered Items
                  </h3>

                  {order.items?.map(
                    (item, index) => {

                      const itemName =
                        item.menuItem?.name ||
                        item.name ||
                        "Menu Item";

                      const itemPrice =
                        Number(
                          item.price || 0
                        );

                      const quantity =
                        Number(
                          item.quantity || 0
                        );

                      return (
                        <div
                          className="admin-order-item"
                          key={
                            item._id ||
                            index
                          }
                        >

                          <div className="admin-order-item-image">

                            {item.menuItem
                              ?.image ? (
                              <img
                                src={`http://localhost:5000${item.menuItem.image}`}
                                alt={itemName}
                              />
                            ) : (
                              <div className="admin-no-image">
                                🍴
                              </div>
                            )}

                          </div>

                          <div className="admin-order-item-info">

                            <strong>
                              {itemName}
                            </strong>

                            <span>
                              ₹{itemPrice} ×{" "}
                              {quantity}
                            </span>

                          </div>

                          <strong className="admin-order-item-total">
                            ₹
                            {itemPrice *
                              quantity}
                          </strong>

                        </div>
                      );
                    }
                  )}

                </div>

                {/* =================================
                    TOTAL
                ================================== */}

                <div className="admin-order-total">

                  <span>
                    Total Amount
                  </span>

                  <strong>
                    ₹{order.totalAmount}
                  </strong>

                </div>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}

export default AdminOrders;