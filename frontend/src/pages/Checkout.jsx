import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";
import api from "../services/api";

function Checkout() {
  const navigate = useNavigate();

  const {
    cartItems,
    totalPrice,
    clearCart,
  } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // =====================================================
  // HANDLE SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // =====================================================
    // CART VALIDATION
    // =====================================================

    if (!cartItems || cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    // =====================================================
    // NAME VALIDATION
    // =====================================================

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    // =====================================================
    // PHONE VALIDATION
    // =====================================================

    const phoneNumber = phone.trim();

    if (!phoneNumber) {
      setError("Please enter your phone number.");
      return;
    }

    // Only digits
    if (!/^[0-9]+$/.test(phoneNumber)) {
      setError(
        "Phone number can contain only numbers."
      );
      return;
    }

    // Exactly 10 digits
    if (phoneNumber.length !== 10) {
      setError(
        "Please enter a valid 10-digit phone number."
      );
      return;
    }

    // Indian mobile number validation
    if (!/^[6-9][0-9]{9}$/.test(phoneNumber)) {
      setError(
        "Please enter a valid Indian mobile number."
      );
      return;
    }

    // =====================================================
    // ADDRESS VALIDATION
    // =====================================================

    if (!address.trim()) {
      setError(
        "Please enter your delivery address."
      );
      return;
    }

    if (address.trim().length < 5) {
      setError(
        "Please enter a valid delivery address."
      );
      return;
    }

    // =====================================================
    // TOKEN CHECK
    // =====================================================

    const token = localStorage.getItem("token");

    if (!token) {
      setError(
        "Please login before placing your order."
      );

      return;
    }

    // =====================================================
    // CREATE ORDER
    // =====================================================

    try {
      setLoading(true);

      const orderItems = cartItems.map((item) => ({
        menuItem: item._id,
        quantity: item.quantity,
      }));

      const response = await api.post(
        "/orders",
        {
          items: orderItems,

          deliveryAddress: address.trim(),

          phone: phoneNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Order created:",
        response.data
      );

      // ===================================================
      // SUCCESS
      // ===================================================

      setSuccess(true);

      clearCart();

      // Go to home after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (err) {
      console.error(
        "Order creation error:",
        err
      );

      if (err.response) {
        setError(
          err.response.data?.message ||
            "Failed to place order."
        );
      } else {
        setError(
          "Unable to connect to server."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // EMPTY CART
  // =====================================================

  if (
    (!cartItems ||
      cartItems.length === 0) &&
    !success
  ) {
    return (
      <div className="checkout-container">

        <div className="checkout-card">

          <div className="empty-cart-icon">
            🛒
          </div>

          <h1>
            Your Cart is Empty
          </h1>

          <p>
            Please add some delicious food
            before checkout.
          </p>

          <button
            type="button"
            className="primary-button"
            onClick={() => navigate("/")}
          >
            Browse Menu
          </button>

        </div>

      </div>
    );
  }

  // =====================================================
  // CHECKOUT PAGE
  // =====================================================

  return (
    <div className="checkout-container">

      <div className="checkout-card">

        <h1>
          Checkout
        </h1>

        <p className="checkout-subtitle">
          Enter your delivery details
        </p>

        {/* =================================================
            SUCCESS MESSAGE
        ================================================= */}

        {success && (
          <div className="success-message">

            ✓ Order placed successfully!

            <br />

            Your order has been saved.

          </div>
        )}

        {!success && (
          <form
            onSubmit={handleSubmit}
            className="checkout-form"
          >

            {/* =============================================
                FULL NAME
            ============================================== */}

            <div className="form-group">

              <label htmlFor="name">
                Full Name
              </label>

              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                disabled={loading}
              />

            </div>

            {/* =============================================
                PHONE NUMBER
            ============================================== */}

            <div className="form-group">

              <label htmlFor="phone">
                Phone Number
              </label>

              <input
                id="phone"
                type="tel"
                inputMode="numeric"
                placeholder="Enter 10-digit phone number"
                value={phone}
                maxLength={10}
                onChange={(e) => {
                  // Remove everything except numbers
                  const value =
                    e.target.value.replace(
                      /[^0-9]/g,
                      ""
                    );

                  setPhone(value);

                  // Clear previous error
                  if (error) {
                    setError("");
                  }
                }}
                disabled={loading}
              />

            </div>

            {/* =============================================
                DELIVERY ADDRESS
            ============================================== */}

            <div className="form-group">

              <label htmlFor="address">
                Delivery Address
              </label>

              <textarea
                id="address"
                className="address-input"
                placeholder="Enter your complete delivery address"
                value={address}
                onChange={(e) =>
                  setAddress(e.target.value)
                }
                disabled={loading}
              />

            </div>

            {/* =============================================
                ERROR MESSAGE
            ============================================== */}

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {/* =============================================
                ORDER SUMMARY
            ============================================== */}

            <div className="checkout-summary">

              <h2>
                Order Summary
              </h2>

              {cartItems.map((item) => (
                <div
                  className="checkout-item"
                  key={item._id}
                >

                  <div>

                    <span>
                      {item.name}
                    </span>

                    <small>
                      {" "}× {item.quantity}
                    </small>

                  </div>

                  <strong>
                    ₹
                    {item.price *
                      item.quantity}
                  </strong>

                </div>
              ))}

              <div className="checkout-total">

                <span>
                  Total
                </span>

                <strong>
                  ₹{totalPrice}
                </strong>

              </div>

            </div>

            {/* =============================================
                PLACE ORDER
            ============================================== */}

            <button
              type="submit"
              className="checkout-button"
              disabled={loading}
            >

              {loading
                ? "Placing Order..."
                : "Place Order"}

            </button>

            {/* =============================================
                BACK TO CART
            ============================================== */}

            <button
              type="button"
              className="back-to-cart-button"
              onClick={() =>
                navigate("/cart")
              }
              disabled={loading}
            >
              ← Back to Cart
            </button>

          </form>
        )}

      </div>

    </div>
  );
}

export default Checkout;