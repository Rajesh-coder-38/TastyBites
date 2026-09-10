import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function EditFood() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Starter",
    price: "",
    availability: true,
  });

  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH FOOD
  // ==========================================

  useEffect(() => {
    const fetchFood = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/menu-items/${id}`
        );

        const item = response.data.menuItem;

        if (!item) {
          setError("Food item not found.");
          return;
        }

        setFormData({
          name: item.name || "",
          description: item.description || "",
          category: item.category || "Starter",
          price: item.price ?? "",
          availability:
            item.availability !== undefined
              ? item.availability
              : true,
        });

        setCurrentImage(item.image || "");
      } catch (err) {
        console.error(
          "Fetch Food Error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to load food item."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFood();
  }, [id]);

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // IMAGE CHANGE
  // ==========================================

  const handleImageChange = (e) => {
    const selectedImage = e.target.files?.[0];

    if (!selectedImage) {
      return;
    }

    // Check file type
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

      setImage(null);
      return;
    }

    // Check file size - 5 MB
    if (selectedImage.size > 5 * 1024 * 1024) {
      setError(
        "Image size must be less than 5 MB."
      );

      setImage(null);
      return;
    }

    setError("");
    setImage(selectedImage);
  };

  // ==========================================
  // UPDATE FOOD
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // ------------------------------------------
    // VALIDATION
    // ------------------------------------------

    if (!formData.name.trim()) {
      setError("Please enter food name.");
      return;
    }

    if (!formData.description.trim()) {
      setError(
        "Please enter food description."
      );
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

    // ------------------------------------------
    // TOKEN
    // ------------------------------------------

    const token = localStorage.getItem("token");

    if (!token) {
      setError(
        "Please login as admin first."
      );
      return;
    }

    try {
      setSaving(true);

      // ========================================
      // STEP 1
      // UPDATE FOOD INFORMATION
      // ========================================

      const updateResponse = await api.put(
        `/menu-items/${id}`,
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

      console.log(
        "Food Updated:",
        updateResponse.data
      );

      // ========================================
      // STEP 2
      // UPLOAD NEW IMAGE
      // ========================================

      if (image) {
        console.log(
          "Uploading new image:",
          image.name
        );

        const imageData = new FormData();

        imageData.append(
          "image",
          image
        );

        const imageResponse = await api.post(
          `/menu-items/${id}/image`,
          imageData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(
          "Image Upload Response:",
          imageResponse.data
        );

        // Update current image immediately
        if (
          imageResponse.data?.menuItem?.image
        ) {
          setCurrentImage(
            imageResponse.data.menuItem.image
          );
        }
      }

      // ========================================
      // SUCCESS
      // ========================================

      alert(
        image
          ? "Food and image updated successfully!"
          : "Food updated successfully!"
      );

      navigate("/admin");
    } catch (err) {
      console.error(
        "Update Food Error:",
        err
      );

      console.error(
        "Server Response:",
        err.response?.data
      );

      setError(
        err.response?.data?.message ||
          "Failed to update food."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="add-food-container">
        <div className="add-food-card">

          <div className="add-food-header">

            <p className="admin-label">
              ADMIN PANEL
            </p>

            <h1>
              Loading Food...
            </h1>

            <p>
              Please wait while the food details
              are loading.
            </p>

          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="add-food-container">

      <div className="add-food-card">

        {/* HEADER */}

        <div className="add-food-header">

          <p className="admin-label">
            ADMIN PANEL
          </p>

          <h1>
            Edit Food
          </h1>

          <p>
            Update the food item information.
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
          className="add-food-form"
          onSubmit={handleSubmit}
        >

          {/* FOOD NAME */}

          <div className="form-group">

            <label htmlFor="name">
              Food Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              placeholder="e.g. Chicken Biryani"
              value={formData.name}
              onChange={handleChange}
            />

          </div>


          {/* DESCRIPTION */}

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
            />

          </div>


          {/* CATEGORY */}

          <div className="form-group">

            <label htmlFor="category">
              Category
            </label>

            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
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


          {/* PRICE */}

          <div className="form-group">

            <label htmlFor="price">
              Price (₹)
            </label>

            <input
              id="price"
              name="price"
              type="number"
              min="0"
              placeholder="299"
              value={formData.price}
              onChange={handleChange}
            />

          </div>


          {/* AVAILABILITY */}

          <div className="form-group">

            <label htmlFor="availability">
              Availability
            </label>

            <select
              id="availability"
              name="availability"
              value={String(
                formData.availability
              )}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  availability:
                    e.target.value === "true",
                }))
              }
            >

              <option value="true">
                Available
              </option>

              <option value="false">
                Unavailable
              </option>

            </select>

          </div>


          {/* CURRENT IMAGE */}

          {currentImage && (
            <div className="edit-current-image">

              <label>
                Current Food Image
              </label>

              <img
                src={
                  currentImage.startsWith(
                    "http"
                  )
                    ? currentImage
                    : `https://tasty-bites-rg3x.vercel.app${currentImage}`
                }
                alt={formData.name}
                onError={(e) => {
                  console.error(
                    "Current image failed:",
                    currentImage
                  );

                  e.currentTarget.style.display =
                    "none";
                }}
              />

            </div>
          )}


          {/* NEW IMAGE */}

          <div className="form-group">

            <label htmlFor="image">
              Update Food Image
            </label>

            <input
              id="image"
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
            />

            {image && (
              <p className="selected-file">
                New image: {image.name}
              </p>
            )}

            <small>
              JPG, JPEG, PNG or WEBP — Maximum 5 MB
            </small>

          </div>


          {/* BUTTONS */}

          <div className="add-food-actions">

            <button
              type="submit"
              className="admin-add-button"
              disabled={saving}
            >
              {saving
                ? "Updating Food..."
                : "Update Food"}
            </button>

            <button
              type="button"
              className="admin-back-button"
              onClick={() =>
                navigate("/admin")
              }
              disabled={saving}
            >
              ← Back to Admin
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default EditFood;