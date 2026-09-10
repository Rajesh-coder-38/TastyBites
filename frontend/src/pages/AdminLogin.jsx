import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import api from "../services/api";

function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ==============================
  // HANDLE INPUT CHANGE
  // ==============================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==============================
  // ADMIN LOGIN
  // ==============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.email.trim()) {
      setError("Please enter admin email.");
      return;
    }

    if (!formData.password) {
      setError("Please enter password.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/auth/admin-login",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      const { token, user } =
        response.data;

      // Save token
      localStorage.setItem(
        "token",
        token
      );

      // Save user
      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      alert(
        "Admin login successful!"
      );

      navigate("/admin");

    } catch (err) {
      console.error(
        "Admin Login Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Invalid admin email or password."
      );

    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // PAGE
  // ==============================

  return (
    <div className="admin-login-page">

      <div className="admin-login-card">

        {/* HEADER */}

        <div className="admin-login-header">

          <p className="admin-label">
            ADMIN PANEL
          </p>

          <h1>
            Admin Login
          </h1>

          <p>
            Login to access the admin panel.
          </p>

        </div>


        {/* ERROR */}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}


        {/* FORM */}

        <form
          className="admin-login-form"
          onSubmit={handleSubmit}
        >

          {/* EMAIL */}

          <div className="form-group">

            <label htmlFor="email">
              Admin Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter admin email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />

          </div>


          {/* PASSWORD */}

          <div className="form-group">

            <label htmlFor="password">
              Password
            </label>

            <div className="password-input-wrapper">

              <input
                id="password"
                name="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
              />

              <button
                type="button"
                className="password-toggle-button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <Eye
                    size={20}
                    strokeWidth={2}
                  />
                ) : (
                  <EyeOff
                    size={20}
                    strokeWidth={2}
                  />
                )}
              </button>

            </div>

          </div>


          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login as Admin"}
          </button>

        </form>


        {/* BACK */}

        <Link
          to="/"
          className="admin-login-back"
        >
          ← Back to Home
        </Link>

      </div>

    </div>
  );
}

export default AdminLogin;