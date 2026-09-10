import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AddFood() {
  const navigate = useNavigate();

  // =====================================================
  // FORM DATA
  // =====================================================

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Starter",
    price: "",
    availability: true,
  });

  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // IMAGE CHANGE
  // =====================================================

  const handleImageChange = (e) => {
    const selectedImage = e.target.files?.[0];

    if (!selectedImage) {
      setImage(null);
      return;
    }

    // Allowed image types

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(selectedImage.type)) {
      setError(
        "Only JPG, JPEG, PNG and WEBP images are allowed."
      );

      e.target.value = "";
      setImage(null);

      return;
    }

    // Maximum image size = 5 MB

    if (selectedImage.size > 5 * 1024 * 1024) {
      setError(
        "Image size must be less than 5 MB."
      );

      e.target.value = "";
      setImage(null);

      return;
    }

    setError("");
    setImage(selectedImage);
  };

  // =====================================================
  // SUBMIT FORM
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // ===================================================
    // VALIDATION
    // ===================================================

    if (!formData.name.trim()) {
      setError("Please enter food name.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Please enter food description.");
      return;
    }

    if (!formData.category) {
      setError("Please select category.");
      return;
    }

    if (
      formData.price === "" ||
      Number(formData.price) < 0
    ) {
      setError("Please enter a valid price.");
      return;
    }

    // ===================================================
    // GET ADMIN TOKEN
    // ===================================================

    const token = localStorage.getItem("token");

    if (!token) {
      setError(
        "Please login as admin first."
      );

      navigate("/admin-login");

      return;
    }

    try {
      setLoading(true);

      // =================================================
      // STEP 1
      // CREATE FOOD ITEM
      // =================================================

      const response = await api.post(
        "/menu-items",
        {
          name: formData.name.trim(),

          description:
            formData.description.trim(),

          category: formData.category,

          price: Number(formData.price),

          availability:
            formData.availability,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // =================================================
      // GET CREATED FOOD
      // =================================================

      const createdFood =
        response.data.menuItem;

      if (!createdFood?._id) {
        throw new Error(
          "Food was created but ID was not returned."
        );
      }

      // =================================================
      // STEP 2
      // UPLOAD IMAGE TO CLOUDINARY
      // =================================================

      if (image) {
        const imageData = new FormData();

        imageData.append(
          "image",
          image
        );

        await api.post(
          `/menu-items/${createdFood._id}/image`,
          imageData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      // =================================================
      // SUCCESS
      // =================================================

      alert(
        image
          ? "Food added successfully with image!"
          : "Food added successfully!"
      );

      // Go back to Admin Panel

      navigate("/admin");

    } catch (err) {
      console.error(
        "Add Food Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to add food."
      );

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="add-food-container">

      <div className="add-food-card">

        {/* =================================================
            HEADER
        ================================================== */}

        <div className="add-food-header">

          <p className="admin-label">
            ADMIN PANEL
          </p>

          <h1>
            Add Food
          </h1>

          <p>
            Add a new food item to your menu.
          </p>

        </div>


        {/* =================================================
            ERROR MESSAGE
        ================================================== */}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}


        {/* =================================================
            FORM
        ================================================== */}

        <form
          onSubmit={handleSubmit}
          className="add-food-form"
        >

          {/* =================================================
              FOOD NAME
          ================================================== */}

          <div className="form-group">

            <label htmlFor="name">
              Food Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter food name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
            />

          </div>


          {/* =================================================
              DESCRIPTION
          ================================================== */}

          <div className="form-group">

            <label htmlFor="description">
              Description
            </label>

            <textarea
              id="description"
              name="description"
              placeholder="Enter food description"
              value={formData.description}
              onChange={handleChange}
              disabled={loading}
            />

          </div>


          {/* =================================================
              CATEGORY
          ================================================== */}

          <div className="form-group">

            <label htmlFor="category">
              Category
            </label>

            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={loading}
            >

              <option value="Starter">
                Starter
              </option>

              <option value="Main Course">
                Main Course
              </option>

              <option value="Dessert">
                Dessert
              </option>

              <option value="Beverage">
                Beverage
              </option>

            </select>

          </div>


          {/* =================================================
              PRICE
          ================================================== */}

          <div className="form-group">

            <label htmlFor="price">
              Price (₹)
            </label>

            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              placeholder="299"
              value={formData.price}
              onChange={handleChange}
              disabled={loading}
            />

          </div>


          {/* =================================================
              AVAILABILITY
          ================================================== */}

          <div className="form-group">

            <label htmlFor="availability">
              Availability
            </label>

            <select
              id="availability"
              value={
                formData.availability
                  ? "true"
                  : "false"
              }
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  availability:
                    e.target.value === "true",
                }))
              }
              disabled={loading}
            >

              <option value="true">
                Available
              </option>

              <option value="false">
                Unavailable
              </option>

            </select>

          </div>


          {/* =================================================
              FOOD IMAGE
          ================================================== */}

          <div className="form-group">

            <label htmlFor="image">
              Food Image
            </label>

            <input
              id="image"
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              disabled={loading}
            />

            {/* SELECTED FILE */}

            {image && (
              <p className="selected-file">
                Selected: {image.name}
              </p>
            )}

            <small>
              JPG, JPEG, PNG or WEBP — Maximum 5 MB
            </small>

          </div>


          {/* =================================================
              BUTTONS
          ================================================== */}

          <div className="add-food-actions">

            {/* ADD FOOD */}

            <button
              type="submit"
              className="admin-add-button"
              disabled={loading}
            >
              {loading
                ? "Uploading..."
                : "Add Food"}
            </button>


            {/* BACK */}

            <button
              type="button"
              className="admin-back-button"
              onClick={() =>
                navigate("/admin")
              }
              disabled={loading}
            >
              ← Back to Admin
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddFood;