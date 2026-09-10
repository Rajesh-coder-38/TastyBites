import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Cart() {
  const navigate = useNavigate();

  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    totalPrice,
  } = useCart();

  // =====================================================
  // EMPTY CART
  // =====================================================

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="cart-container">

        <h1>Your Cart</h1>

        <div className="empty-cart">

          <div className="empty-cart-icon">
            🛒
          </div>

          <h2>
            Your cart is empty
          </h2>

          <p>
            Add some delicious food to your cart.
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
  // CART
  // =====================================================

  return (
    <div className="cart-container">

      <h1>
        Your Cart
      </h1>

      <div className="cart-content">

        {/* =================================================
            CART ITEMS
        ================================================= */}

        <div className="cart-list">

          {cartItems.map((item) => (

            <div
              className="cart-item"
              key={item._id}
            >

              {/* =================================================
                  IMAGE
              ================================================= */}

              {item.image ? (

                <img
                  src={item.image}
                  alt={item.name}
                  onError={(e) => {
                    console.error(
                      "Cart image failed to load:",
                      item.image
                    );

                    e.currentTarget.style.display =
                      "none";
                  }}
                />

              ) : (

                <div className="cart-no-image">
                  🍴
                </div>

              )}


              {/* =================================================
                  DETAILS
              ================================================= */}

              <div className="cart-item-info">

                <h2>
                  {item.name}
                </h2>

                <p className="cart-item-price">
                  ₹{item.price}
                </p>


                {/* =================================================
                    QUANTITY
                ================================================= */}

                <div className="quantity-controls">

                  <button
                    type="button"
                    onClick={() =>
                      decreaseQuantity(item._id)
                    }
                  >
                    −
                  </button>

                  <span>
                    {item.quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      increaseQuantity(item._id)
                    }
                  >
                    +
                  </button>

                </div>


                {/* =================================================
                    REMOVE
                ================================================= */}

                <button
                  type="button"
                  className="remove-button"
                  onClick={() =>
                    removeFromCart(item._id)
                  }
                >
                  Remove
                </button>

              </div>


              {/* =================================================
                  ITEM TOTAL
              ================================================= */}

              <div className="cart-item-total">

                ₹
                {Number(item.price || 0) *
                  Number(item.quantity || 0)}

              </div>

            </div>

          ))}

        </div>


        {/* =================================================
            ORDER SUMMARY
        ================================================= */}

        <div className="cart-summary">

          <h2>
            Order Summary
          </h2>


          {/* ITEMS */}

          <div className="summary-row">

            <span>
              Items
            </span>

            <span>
              {cartItems.reduce(
                (total, item) =>
                  total +
                  Number(item.quantity || 0),
                0
              )}
            </span>

          </div>


          {/* SUBTOTAL */}

          <div className="summary-row">

            <span>
              Subtotal
            </span>

            <span>
              ₹{totalPrice}
            </span>

          </div>


          {/* DELIVERY */}

          <div className="summary-row">

            <span>
              Delivery
            </span>

            <span>
              FREE
            </span>

          </div>


          {/* TOTAL */}

          <div className="summary-total">

            <span>
              Total
            </span>

            <strong>
              ₹{totalPrice}
            </strong>

          </div>


          {/* =================================================
              CHECKOUT
          ================================================= */}

          <button
            type="button"
            className="checkout-button"
            onClick={() => {
              console.log(
                "Proceed to Checkout clicked"
              );

              navigate("/checkout");
            }}
          >
            Proceed to Checkout
          </button>


          {/* =================================================
              CLEAR CART
          ================================================= */}

          <button
            type="button"
            className="clear-cart-button"
            onClick={clearCart}
          >
            Clear Cart
          </button>


          {/* =================================================
              CONTINUE SHOPPING
          ================================================= */}

          <button
            type="button"
            className="continue-shopping-button"
            onClick={() =>
              navigate("/")
            }
          >
            ← Continue Shopping
          </button>

        </div>

      </div>

    </div>
  );
}

export default Cart;