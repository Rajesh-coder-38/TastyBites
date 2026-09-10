const express = require("express");

const {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  searchMenuItems,
  uploadMenuImage,
} = require("../controllers/menuController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();


// =====================================================
// PUBLIC ROUTES
// =====================================================

// Get all menu items
router.get("/", getMenuItems);

// Search menu items
router.get("/search", searchMenuItems);

// Get single menu item
router.get("/:id", getMenuItem);


// =====================================================
// ADMIN ROUTES
// =====================================================

// Create menu item
router.post(
  "/",
  protect,
  adminOnly,
  createMenuItem
);

// Update menu item
router.put(
  "/:id",
  protect,
  adminOnly,
  updateMenuItem
);

// Delete menu item
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteMenuItem
);

// Upload / Update menu image
router.post(
  "/:id/image",
  protect,
  adminOnly,
  upload.single("image"),
  uploadMenuImage
);


module.exports = router;