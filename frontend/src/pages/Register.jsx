import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import api from "../services/api";
import "../App.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [message, setMessage] = useState("");
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
  // REGISTER
  // ==============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    // Password match check
    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    setLoading(true);

    try {
      // Do not send confirmPassword
      // to backend

      const {
        confirmPassword,
        ...registrationData
      } = formData;

      const response = await api.post(
        "/auth/register",
        registrationData
      );

      setMessage(
        response.data.message ||
          "Account created successfully!"
      );

      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } catch (err) {
      console.error(
        "Registration Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Registration failed. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // PAGE
  // ==============================

  return (
    <div className="auth-page">

      <div className="auth-card">

        {/* LOGO */}

        <div className="brand">

          <div className="brand-icon">
            🍴
          </div>

          <h1>
            TastyBites
          </h1>

        </div>


        {/* HEADING */}

        <h2>
          Create your account
        </h2>

        <p className="auth-subtitle">
          Join TastyBites and enjoy delicious food.
        </p>


        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="auth-form"
        >

          {/* FULL NAME */}

          <div className="form-group">

            <label htmlFor="name">
              Full Name
            </label>

            <input
              id="name"
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />

          </div>


          {/* EMAIL */}

          <div className="form-group">

            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
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
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
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


          {/* CONFIRM PASSWORD */}

          <div className="form-group">

            <label htmlFor="confirmPassword">
              Confirm Password
            </label>

            <div className="password-input-wrapper">

              <input
                id="confirmPassword"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                className="password-toggle-button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirmPassword ? (
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


          {/* REGISTER BUTTON */}

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>


        {/* SUCCESS MESSAGE */}

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}


        {/* ERROR MESSAGE */}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}


        {/* LOGIN */}

        <div className="auth-footer">

          <span>
            Already have an account?
          </span>

          <button
            type="button"
            className="login-button"
            onClick={() =>
              navigate("/login")
            }
          >
            Sign in
          </button>

        </div>

      </div>

    </div>
  );
}

export default Register;