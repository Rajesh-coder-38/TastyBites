import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  let user = null;

  try {
    user = JSON.parse(
      localStorage.getItem("user") || "null"
    );
  } catch (error) {
    user = null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="navbar-icon">🍴</span>
          <span>TastyBites</span>
        </Link>

        {/* Navigation */}
        <div className="navbar-links">

          <Link to="/" className="navbar-link">
            Home
          </Link>

          {!token && (
            <>
              <Link
                to="/login"
                className="navbar-link"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="navbar-link"
              >
                Register
              </Link>
            </>
          )}

          {token && (
            <>
              <span className="welcome-user">
                Hi, {user?.name || "User"}
              </span>

              <button
                type="button"
                className="logout-button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}

          {user?.role === "Admin" ? (
            <Link
              to="/admin"
              className="navbar-link"
            >
              Admin
            </Link>
          ) : (
            <Link
              to="/admin-login"
              className="navbar-link"
            >
              Admin
            </Link>
          )}

        </div>
      </div>
    </nav>
  );
}

export default Navbar;