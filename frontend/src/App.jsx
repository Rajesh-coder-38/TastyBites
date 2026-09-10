import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MenuDetails from "./pages/MenuDetails";

import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import AddFood from "./pages/AddFood";
import EditFood from "./pages/EditFood";
import Users from "./pages/Users";

import "./App.css";

function App() {
  return (
    <>
      {/* ================================
          NAVBAR
      ================================= */}

      <Navbar />

      {/* ================================
          ROUTES
      ================================= */}

      <Routes>

        {/* HOME */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* USER LOGIN */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* USER REGISTER */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* MENU DETAILS */}
        <Route
          path="/menu/:id"
          element={<MenuDetails />}
        />

        {/* ADMIN LOGIN */}
        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />

        {/* ADMIN DASHBOARD */}
        <Route
          path="/admin/dashboard"
          element={<Dashboard />}
        />

        {/* ADMIN MENU MANAGEMENT */}
        <Route
          path="/admin"
          element={<AdminPanel />}
        />

        {/* ADD FOOD */}
        <Route
          path="/admin/add-food"
          element={<AddFood />}
        />

        {/* EDIT FOOD */}
        <Route
          path="/admin/edit-food/:id"
          element={<EditFood />}
        />

        {/* USER MANAGEMENT */}
        <Route
          path="/admin/users"
          element={<Users />}
        />

      </Routes>
    </>
  );
}

export default App;