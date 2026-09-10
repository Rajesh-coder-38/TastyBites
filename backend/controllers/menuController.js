const mongoose = require("mongoose");
const MenuItem = require("../models/menuItem");
const cloudinary = require("../config/cloudinary");

// =====================================================
// GET ALL MENU ITEMS
// =====================================================

const getMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find().sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Menu items fetched successfully",
      menuItems,
    });
  } catch (error) {
    console.error("Get Menu Items Error:", error);

    return res.status(500).json({
      message: "Failed to fetch menu items",
      error: error.message,
    });
  }
};

// =====================================================
// GET SINGLE MENU ITEM
// =====================================================

const getMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Fetching menu item:", id);

    // Check whether the ID is a valid MongoDB ObjectId
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid menu item ID",
      });
    }

    const menuItem = await MenuItem.findById(id);

    if (!menuItem) {
      return res.status(404).json({
        message: "Menu item not found",
      });
    }

    return res.status(200).json({
      message: "Menu item fetched successfully",
      menuItem,
    });
  } catch (error) {
    console.error("Get Single Menu Item Error:", error);

    return res.status(500).json({
      message: "Failed to fetch menu item",
      error: error.message,
    });
  }
};

// =====================================================
// CREATE MENU ITEM
// =====================================================

const createMenuItem = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      availability,
      image,
    } = req.body;

    if (!name || !description || !category || price === undefined) {
      return res.status(400).json({
        message: "Name, description, category and price are required",
      });
    }

    const menuItem = await MenuItem.create({
      name,
      description,
      category,
      price,
      availability:
        availability === undefined ? true : availability,
      image: image || "",
    });

    return res.status(201).json({
      message: "Menu item created successfully",
      menuItem,
    });
  } catch (error) {
    console.error("Create Menu Item Error:", error);

    return res.status(500).json({
      message: "Failed to create menu item",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE MENU ITEM
// =====================================================

const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid menu item ID",
      });
    }

    const menuItem = await MenuItem.findById(id);

    if (!menuItem) {
      return res.status(404).json({
        message: "Menu item not found",
      });
    }

    const {
      name,
      description,
      category,
      price,
      availability,
      image,
    } = req.body;

    if (name !== undefined) {
      menuItem.name = name;
    }

    if (description !== undefined) {
      menuItem.description = description;
    }

    if (category !== undefined) {
      menuItem.category = category;
    }

    if (price !== undefined) {
      menuItem.price = price;
    }

    if (availability !== undefined) {
      menuItem.availability = availability;
    }

    if (image !== undefined) {
      menuItem.image = image;
    }

    const updatedMenuItem = await menuItem.save();

    return res.status(200).json({
      message: "Menu item updated successfully",
      menuItem: updatedMenuItem,
    });
  } catch (error) {
    console.error("Update Menu Item Error:", error);

    return res.status(500).json({
      message: "Failed to update menu item",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE MENU ITEM
// =====================================================

const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid menu item ID",
      });
    }

    const menuItem = await MenuItem.findById(id);

    if (!menuItem) {
      return res.status(404).json({
        message: "Menu item not found",
      });
    }

    await MenuItem.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    console.error("Delete Menu Item Error:", error);

    return res.status(500).json({
      message: "Failed to delete menu item",
      error: error.message,
    });
  }
};

// =====================================================
// SEARCH MENU ITEMS
// =====================================================

const searchMenuItems = async (req, res) => {
  try {
    const search = req.query.search?.trim() || "";

    if (!search) {
      const menuItems = await MenuItem.find().sort({
        createdAt: -1,
      });

      return res.status(200).json({
        message: "Menu items fetched successfully",
        menuItems,
      });
    }

    const menuItems = await MenuItem.find({
      $or: [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
        {
          category: {
            $regex: search,
            $options: "i",
          },
        },
      ],
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Menu search completed successfully",
      menuItems,
    });
  } catch (error) {
    console.error("Search Menu Items Error:", error);

    return res.status(500).json({
      message: "Failed to search menu items",
      error: error.message,
    });
  }
};

// =====================================================
// UPLOAD / UPDATE MENU IMAGE
// =====================================================

const uploadMenuImage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid menu item ID",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Please upload an image",
      });
    }

    const menuItem = await MenuItem.findById(id);

    if (!menuItem) {
      return res.status(404).json({
        message: "Menu item not found",
      });
    }

    // Multer/Cloudinary middleware normally provides the uploaded URL
    const imageUrl = req.file.path || req.file.secure_url;

    if (!imageUrl) {
      return res.status(500).json({
        message: "Image upload URL was not generated",
      });
    }

    menuItem.image = imageUrl;

    const updatedMenuItem = await menuItem.save();

    return res.status(200).json({
      message: "Menu image uploaded successfully",
      menuItem: updatedMenuItem,
    });
  } catch (error) {
    console.error("Upload Menu Image Error:", error);

    return res.status(500).json({
      message: "Failed to upload menu image",
      error: error.message,
    });
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  searchMenuItems,
  uploadMenuImage,
};