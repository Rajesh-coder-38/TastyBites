function PasswordToggle({
  showPassword,
  onToggle,
}) {
  return (
    <button
      type="button"
      className="password-toggle-button"
      onClick={onToggle}
      aria-label={
        showPassword
          ? "Hide password"
          : "Show password"
      }
    >
      {showPassword ? (
        // ==============================
        // EYE OPEN
        // ==============================
        <svg
          className="password-eye-icon"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 12C2 12 5.5 5 12 5C18.5 5 22 12 22 12C22 12 18.5 19 12 19C5.5 19 2 12 2 12Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <circle
            cx="12"
            cy="12"
            r="3"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      ) : (
        // ==============================
        // EYE OFF
        // ==============================
        <svg
          className="password-eye-icon"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 3L21 21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />

          <path
            d="M10.58 10.58C10.21 10.95 10 11.46 10 12C10 13.1 10.9 14 12 14C12.54 14 13.05 13.79 13.42 13.42"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />

          <path
            d="M9.88 5.09C10.56 4.89 11.27 4.78 12 4.78C18.5 4.78 22 12 22 12C22 12 20.7 14.68 18.15 16.66"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d="M6.61 6.61C3.71 8.64 2 12 2 12C2 12 5.5 19.22 12 19.22C13.08 19.22 14.11 19.02 15.06 18.66"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}

export default PasswordToggle;