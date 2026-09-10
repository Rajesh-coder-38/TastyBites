import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Home() {
  const [menuItems, setMenuItems] = useState([]);
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
  // FETCH MENU ITEMS
  // ==========================================

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/menu-items");

        setMenuItems(
          response.data.menuItems || []
        );
      } catch (err) {
        console.error("Home Menu Error:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load menu items."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  // ==========================================
  // EXPLORE MENU
  // ==========================================

  const handleExploreMenu = () => {
    const menuSection =
      document.getElementById("menu-section");

    if (menuSection) {
      menuSection.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  // ==========================================
  // HOME PAGE
  // ==========================================

  return (
    <div className="home-container">

      {/* ======================================
          HERO SECTION
      ======================================= */}

      <section className="hero-section">

        <p className="hero-small-title">
          WELCOME TO TASTYBITES
        </p>

        <h1 className="hero-title">
          Delicious Food,
          <br />
          Delivered With Love
          <span className="hero-heart"> ❤️</span>
        </h1>

        <p className="hero-description">
          Discover delicious meals prepared with
          fresh ingredients and delivered
          straight to your door.
        </p>

        <button
          type="button"
          className="explore-button"
          onClick={handleExploreMenu}
        >
          Explore Our Menu
        </button>

      </section>


      {/* ======================================
          MENU SECTION
      ======================================= */}

      <section
        className="menu-section"
        id="menu-section"
      >

        {/* HEADING */}

        <div className="section-heading">

          <h2>
            Explore Our Menu
          </h2>

          <span>
            Choose from our delicious food items.
          </span>

        </div>


        {/* ====================================
            LOADING
        ==================================== */}

        {loading && (

          <div className="menu-status">
            Loading menu items...
          </div>

        )}


        {/* ====================================
            ERROR
        ==================================== */}

        {!loading && error && (

          <div className="error-message">
            {error}
          </div>

        )}


        {/* ====================================
            NO MENU ITEMS
        ==================================== */}

        {!loading &&
          !error &&
          menuItems.length === 0 && (

            <div className="admin-empty">

              <div className="empty-cart-icon">
                🍴
              </div>

              <h2>
                No menu items available
              </h2>

              <p>
                Please check again later.
              </p>

            </div>

          )}


        {/* ====================================
            MENU GRID
        ==================================== */}

        {!loading &&
          !error &&
          menuItems.length > 0 && (

            <div className="menu-grid">

              {menuItems.map((item) => (

                <div
                  className="menu-card"
                  key={item._id}
                >

                  {/* FOOD IMAGE */}

                  <div className="menu-image-wrapper">

                    {item.image ? (

                      <img
                        src={getImageUrl(
                          item.image
                        )}
                        alt={item.name}
                      />

                    ) : (

                      <div className="no-image">
                        No Image
                      </div>

                    )}

                  </div>


                  {/* FOOD CONTENT */}

                  <div className="menu-card-content">

                    {/* NAME + PRICE */}

                    <div className="menu-card-top">

                      <h3>
                        {item.name}
                      </h3>

                      <span className="menu-price">
                        ₹{item.price}
                      </span>

                    </div>


                    {/* DESCRIPTION */}

                    <p className="menu-description">

                      {item.description ||
                        "No description available."}

                    </p>


                    {/* VIEW BUTTON */}

                    <div className="menu-card-bottom">

                      <Link
                        to={`/menu/${item._id}`}
                        className="view-button"
                      >
                        View
                      </Link>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

      </section>

    </div>
  );
}

export default Home;