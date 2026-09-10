import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

function MenuDetails() {
  const { id } = useParams();

  const [menuItem, setMenuItem] = useState(null);
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

    return `https://tasty-bites-rg3x.vercel.app${image}`;
  };

  // ==========================================
  // FETCH MENU ITEM
  // ==========================================

  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/menu-items/${id}`
        );

        setMenuItem(
          response.data.menuItem || null
        );
      } catch (err) {
        console.error(
          "Menu Details Error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to load menu item."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItem();
  }, [id]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div
        style={{
          minHeight: "70vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "40px",
        }}
      >
        <div>
          <h2>Loading...</h2>
          <p>
            Please wait while the food details are loading.
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
      <div
        style={{
          maxWidth: "900px",
          margin: "60px auto",
          padding: "30px 20px",
          textAlign: "center",
        }}
      >
        <h2>{error}</h2>

        <Link
          to="/"
          style={{
            display: "inline-block",
            marginTop: "20px",
            padding: "12px 20px",
            border: "1px solid #d8dfeb",
            borderRadius: "8px",
            background: "#ffffff",
            color: "#102a5c",
            textDecoration: "none",
            fontWeight: "600",
          }}
        >
          ← Back to Menu
        </Link>
      </div>
    );
  }

  // ==========================================
  // NOT FOUND
  // ==========================================

  if (!menuItem) {
    return (
      <div
        style={{
          maxWidth: "900px",
          margin: "60px auto",
          padding: "30px 20px",
          textAlign: "center",
        }}
      >
        <h2>Menu item not found.</h2>

        <Link
          to="/"
          style={{
            display: "inline-block",
            marginTop: "20px",
            padding: "12px 20px",
            border: "1px solid #d8dfeb",
            borderRadius: "8px",
            background: "#ffffff",
            color: "#102a5c",
            textDecoration: "none",
            fontWeight: "600",
          }}
        >
          ← Back to Menu
        </Link>
      </div>
    );
  }

  // ==========================================
  // MENU DETAILS
  // ==========================================

  return (
    <div
      style={{
        width: "100%",
        minHeight: "calc(100vh - 80px)",
        boxSizing: "border-box",
        padding: "45px 20px 60px",
        background: "#f6f7fb",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        {/* =====================================
            IMAGE
        ====================================== */}

        <div
          style={{
            width: "100%",
            maxWidth: "580px",
            height: "370px",
            margin: "0 auto 25px",
            borderRadius: "14px",
            overflow: "hidden",
            background: "#eeeeee",
          }}
        >
          {menuItem.image ? (
            <img
              src={getImageUrl(menuItem.image)}
              alt={menuItem.name}
              style={{
                width: "100%",
                height: "100%",
                display: "block",
                objectFit: "cover",
              }}
              onError={(e) => {
                console.error(
                  "Food image failed:",
                  menuItem.image
                );

                e.currentTarget.style.display =
                  "none";
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#777",
              }}
            >
              No Image Available
            </div>
          )}
        </div>

        {/* =====================================
            CONTENT
        ====================================== */}

        <div
          style={{
            width: "100%",
            maxWidth: "580px",
            margin: "0 auto",
          }}
        >
          {/* NAME */}

          <h1
            style={{
              margin: "0 0 15px",
              padding: "0",
              fontSize: "36px",
              lineHeight: "1.2",
              fontWeight: "700",
              color: "#102a5c",
            }}
          >
            {menuItem.name}
          </h1>

          {/* PRICE */}

          <div
            style={{
              marginBottom: "30px",
              fontSize: "30px",
              lineHeight: "1.2",
              fontWeight: "700",
              color: "#ff5147",
            }}
          >
            ₹{menuItem.price}
          </div>

          {/* CATEGORY */}

          <p
            style={{
              margin: "14px 0",
              fontSize: "16px",
              lineHeight: "1.7",
              color: "#50627a",
            }}
          >
            <strong
              style={{
                color: "#102a5c",
              }}
            >
              Category:
            </strong>{" "}
            {menuItem.category}
          </p>

          {/* DESCRIPTION TITLE */}

          <p
            style={{
              margin: "14px 0 5px",
              fontSize: "16px",
              lineHeight: "1.7",
              color: "#50627a",
            }}
          >
            <strong
              style={{
                color: "#102a5c",
              }}
            >
              Description:
            </strong>
          </p>

          {/* DESCRIPTION */}

          <p
            style={{
              margin: "0 0 14px",
              fontSize: "16px",
              lineHeight: "1.7",
              color: "#50627a",
            }}
          >
            {menuItem.description ||
              "No description available."}
          </p>

          {/* AVAILABILITY */}

          <p
            style={{
              margin: "14px 0",
              fontSize: "16px",
              lineHeight: "1.7",
              color: "#50627a",
            }}
          >
            <strong
              style={{
                color: "#102a5c",
              }}
            >
              Availability:
            </strong>{" "}

            {menuItem.availability ? (
              <span
                style={{
                  color: "#00a65a",
                  fontWeight: "600",
                }}
              >
                Available
              </span>
            ) : (
              <span
                style={{
                  color: "#ff5147",
                  fontWeight: "600",
                }}
              >
                Currently Unavailable
              </span>
            )}
          </p>

          {/* BACK BUTTON */}

          <Link
            to="/"
            style={{
              display: "inline-block",
              marginTop: "25px",
              padding: "12px 20px",
              border: "1px solid #d8dfeb",
              borderRadius: "8px",
              background: "#ffffff",
              color: "#102a5c",
              textDecoration: "none",
              fontWeight: "600",
              boxSizing: "border-box",
            }}
          >
            ← Back to Menu
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MenuDetails;