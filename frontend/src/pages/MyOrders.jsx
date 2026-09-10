import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // IMAGE URL
  // ==========================================

  const getImageUrl = (image) => {
    if (!image) {
      return "";
    }

    // Cloudinary / complete URL
    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    // Local backend image
    if (image.startsWith("/")) {
      return `https://tasty-bites-rg3x.vercel.app${image}`;
    }

    return `https://tasty-bites-rg3x.vercel.app/${image}`;
  };

  // ==========================================
  // FETCH MY ORDERS
  // ==========================================

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/orders/my-orders");

      console.log("MY ORDERS RESPONSE:", response.data);

      setOrders(response.data.orders || []);
    } catch (err) {
      console.error("My Orders Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load your orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ==========================================
  // CANCEL ORDER
  // ==========================================

  const handleCancelOrder = async (orderId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmCancel) {
      return;
    }

    try {
      await api.put(`/orders/${orderId}/cancel`);

      alert("Order cancelled successfully.");

      fetchOrders();
    } catch (err) {
      console.error("Cancel Order Error:", err);

      alert(
        err.response?.data?.message ||
          "Failed to cancel order."
      );
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="orders-container">
        <div className="orders-loading">
          <div className="orders-loading-icon">
            🍴
          </div>

          <h2>Loading your orders...</h2>

          <p>Please wait a moment.</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="orders-container">
        <div className="orders-error">
          <div className="orders-error-icon">
            ⚠️
          </div>

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
    <div className="orders-container">

      {/* PAGE HEADER */}

      <div className="orders-header">

        <p className="orders-small-title">
          ORDER HISTORY
        </p>

        <h1>My Orders</h1>

        <p>
          View and manage all your orders.
        </p>

      </div>

      {/* EMPTY ORDERS */}

      {orders.length === 0 ? (

        <div className="empty-orders">

          <div className="empty-orders-icon">
            🛒
          </div>

          <h2>No orders yet</h2>

          <p>
            You haven't placed any orders yet.
          </p>

          <Link
            to="/"
            className="primary-button"
          >
            Browse Menu
          </Link>

        </div>

      ) : (

        <div className="orders-list">

          {orders.map((order) => {

            const orderStatus =
              order.status || "Pending";

            const statusClass = orderStatus
              .toLowerCase()
              .replace(/\s+/g, "-");

            return (

              <div
                className="order-card"
                key={order._id}
              >

                {/* ORDER HEADER */}

                <div className="order-header">

                  <div className="order-heading-info">

                    <span className="order-label">
                      ORDER
                    </span>

                    <h2>
                      #
                      {order._id
                        ?.slice(-6)
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

                  <span
                    className={`order-status ${statusClass}`}
                  >
                    {orderStatus}
                  </span>

                </div>


                {/* ORDER ITEMS */}

                <div className="order-items">

                  {order.items?.map(
                    (item, index) => {

                      const food =
                        item.menuItem;

                      const imageUrl =
                        getImageUrl(
                          food?.image
                        );

                      console.log(
                        "ORDER ITEM:",
                        food
                      );

                      console.log(
                        "ORDER IMAGE URL:",
                        imageUrl
                      );

                      return (

                        <div
                          className="order-item"
                          key={
                            item._id || index
                          }
                        >

                          {/* IMAGE */}

                          <div className="order-item-image">

                            {imageUrl ? (

                              <img
                                src={imageUrl}
                                alt={
                                  food?.name ||
                                  item.name ||
                                  "Food"
                                }
                                onError={(e) => {
                                  console.error(
                                    "ORDER IMAGE FAILED:",
                                    imageUrl
                                  );

                                  e.currentTarget.style.display =
                                    "none";

                                  e.currentTarget.parentElement.innerHTML =
                                    '<div class="order-no-image">🍴</div>';
                                }}
                              />

                            ) : (

                              <div className="order-no-image">
                                🍴
                              </div>

                            )}

                          </div>


                          {/* FOOD INFO */}

                          <div className="order-item-info">

                            <h3>
                              {food?.name ||
                                item.name ||
                                "Menu Item"}
                            </h3>

                            <div className="order-item-meta">

                              <span>
                                Quantity:{" "}
                                <strong>
                                  {item.quantity}
                                </strong>
                              </span>

                              <span>
                                Price:{" "}
                                <strong>
                                  ₹{item.price}
                                </strong>
                              </span>

                            </div>

                          </div>


                          {/* ITEM TOTAL */}

                          <div className="order-item-total">

                            ₹
                            {Number(
                              item.price || 0
                            ) *
                              Number(
                                item.quantity || 0
                              )}

                          </div>

                        </div>

                      );
                    }
                  )}

                </div>


                {/* ORDER SUMMARY */}

                <div className="order-summary">

                  <div className="order-summary-row">

                    <span>
                      Total Amount
                    </span>

                    <strong>
                      ₹{order.totalAmount}
                    </strong>

                  </div>

                  <div className="order-summary-row">

                    <span>
                      Phone
                    </span>

                    <strong>
                      {order.phone || "N/A"}
                    </strong>

                  </div>

                </div>


                {/* DELIVERY ADDRESS */}

                <div className="order-address">

                  <div className="address-title">
                    📍 Delivery Address
                  </div>

                  <p>
                    {order.deliveryAddress ||
                      "Address unavailable"}
                  </p>

                </div>


                {/* CANCEL */}

                {orderStatus.toLowerCase() !==
                  "cancelled" && (

                  <div className="order-actions">

                    <button
                      type="button"
                      className="cancel-order-button"
                      onClick={() =>
                        handleCancelOrder(
                          order._id
                        )
                      }
                    >
                      Cancel Order
                    </button>

                  </div>

                )}

              </div>

            );
          })}

        </div>

      )}

    </div>
  );
}

export default MyOrders;