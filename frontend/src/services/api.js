import axios from "axios";

// =====================================================
// AXIOS API INSTANCE
// =====================================================

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// =====================================================
// ADD TOKEN TO EVERY REQUEST
// =====================================================

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    console.error(
      "API Error:",
      error.response?.data ||
        error.message
    );

    if (
      error.response?.status === 401
    ) {
      console.log(
        "Authentication failed:",
        error.response.data
      );
    }

    return Promise.reject(error);
  }
);

// =====================================================
// EXPORT
// =====================================================

export default api;