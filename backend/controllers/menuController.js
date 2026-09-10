const MenuItem = require("../models/menuItem");
const cloudinary = require("../config/cloudinary");

// =====================================================
// GET ALL MENU ITEMS
// =====================================================

const getMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      message: "Menu items fetched successfully",
      menuItems,
    });
  } catch (error) {
    console.error("Get Menu Items Error:", error);

    res.status(500).json({
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
    const menuItem = await MenuItem.findById(
      req.params.id
    );

    if (!menuItem) {
      return res.status(404).json({
        message: "Menu item not found",
      });
    }

    res.status(200).json({
      message: "Menu item fetched successfully",
      menuItem,
    });
  } catch (error) {
    console.error(
      "Get Single Menu Item Error:",
      error
    );

    res.status(500).json({
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
    } = req.body;

    // -----------------------------------------------
    // VALIDATION
    // -----------------------------------------------

    if (
      !name ||
      !description ||
      !category ||
      price === undefined
    ) {
      return res.status(400).json({
        message:
          "Name, description, category and price are required",
      });
    }

    if (Number(price) < 0) {
      return res.status(400).json({
        message: "Price cannot be negative",
      });
    }

    // -----------------------------------------------
    // CREATE MENU ITEM
    // -----------------------------------------------

    const menuItem = await MenuItem.create({
      name: name.trim(),

      description: description.trim(),

      category,

      price: Number(price),

      availability:
        availability !== undefined
          ? availability
          : true,

      image: "",
    });

    console.log(
      "Menu item created:",
      menuItem._id
    );

    res.status(201).json({
      message: "Menu item created successfully",
      menuItem,
    });
  } catch (error) {
    console.error(
      "Create Menu Item Error:",
      error
    );

    res.status(500).json({
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
    const menuItem =
      await MenuItem.findById(req.params.id);

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

    // -----------------------------------------------
    // UPDATE FIELDS
    // -----------------------------------------------

    if (name !== undefined) {
      menuItem.name = name.trim();
    }

    if (description !== undefined) {
      menuItem.description =
        description.trim();
    }

    if (category !== undefined) {
      menuItem.category = category;
    }

    if (price !== undefined) {
      if (Number(price) < 0) {
        return res.status(400).json({
          message: "Price cannot be negative",
        });
      }

      menuItem.price = Number(price);
    }

    if (availability !== undefined) {
      menuItem.availability = availability;
    }

    if (image !== undefined) {
      menuItem.image = image;
    }

    const updatedMenuItem =
      await menuItem.save();

    res.status(200).json({
      message:
        "Menu item updated successfully",
      menuItem: updatedMenuItem,
    });
  } catch (error) {
    console.error(
      "Update Menu Item Error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to update menu item",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE MENU ITEM
// =====================================================

const deleteMenuItem = async (req, res) => {
  try {
    const menuItem =
      await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        message: "Menu item not found",
      });
    }

    await menuItem.deleteOne();

    res.status(200).json({
      message:
        "Menu item deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Menu Item Error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to delete menu item",
      error: error.message,
    });
  }
};

// =====================================================
// SEARCH MENU ITEMS
// =====================================================

const searchMenuItems = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({
        message: "Search name is required",
      });
    }

    const menuItems = await MenuItem.find({
      name: {
        $regex: name,
        $options: "i",
      },
    });

    res.status(200).json({
      message: "Menu search successful",
      menuItems,
    });
  } catch (error) {
    console.error(
      "Search Menu Error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to search menu items",
      error: error.message,
    });
  }
};

// =====================================================
// FILTER BY CATEGORY
// =====================================================

const filterByCategory = async (req, res) => {
  try {
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({
        message: "Category is required",
      });
    }

    const menuItems = await MenuItem.find({
      category: {
        $regex: category,
        $options: "i",
      },
    });

    res.status(200).json({
      message:
        "Menu filtered successfully",
      menuItems,
    });
  } catch (error) {
    console.error(
      "Filter Menu Error:",
      error
    );

    res.status(500).json({
      message: "Failed to filter menu",
      error: error.message,
    });
  }
};

// =====================================================
// UPLOAD MENU IMAGE TO CLOUDINARY
// =====================================================

const uploadMenuImage = async (req, res) => {
  try {
    console.log("");
    console.log(
      "========================================"
    );
    console.log(
      "IMAGE UPLOAD REQUEST RECEIVED"
    );
    console.log(
      "========================================"
    );

    // -----------------------------------------------
    // CHECK FILE
    // -----------------------------------------------

    if (!req.file) {
      console.log("NO FILE RECEIVED");

      return res.status(400).json({
        message: "Please upload an image",
      });
    }

    console.log(
      "File name:",
      req.file.originalname
    );

    console.log(
      "File type:",
      req.file.mimetype
    );

    console.log(
      "File size:",
      req.file.size,
      "bytes"
    );

    // -----------------------------------------------
    // FIND MENU ITEM
    // -----------------------------------------------

    const menuItem =
      await MenuItem.findById(req.params.id);

    if (!menuItem) {
      console.log(
        "MENU ITEM NOT FOUND:",
        req.params.id
      );

      return res.status(404).json({
        message: "Menu item not found",
      });
    }

    console.log(
      "Menu item found:",
      menuItem.name
    );

    console.log(
      "Menu item ID:",
      menuItem._id.toString()
    );

    // -----------------------------------------------
    // CHECK CLOUDINARY CONFIGURATION
    // -----------------------------------------------

    console.log("");
    console.log(
      "Checking Cloudinary configuration..."
    );

    console.log(
      "Cloudinary cloud name:",
      process.env.CLOUDINARY_CLOUD_NAME
    );

    console.log(
      "Cloudinary API key exists:",
      !!process.env.CLOUDINARY_API_KEY
    );

    console.log(
      "Cloudinary API secret exists:",
      !!process.env.CLOUDINARY_API_SECRET
    );

    // -----------------------------------------------
    // UPLOAD TO CLOUDINARY
    // -----------------------------------------------

    console.log("");
    console.log(
      "Starting Cloudinary upload..."
    );

    const uploadResult =
      await new Promise(
        (resolve, reject) => {
          const uploadStream =
            cloudinary.uploader.upload_stream(
              {
                folder:
                  "tastybites/menu",

                resource_type: "image",
              },

              (error, result) => {
                if (error) {
                  console.error("");
                  console.error(
                    "CLOUDINARY ERROR:"
                  );
                  console.error(error);

                  reject(error);
                  return;
                }

                console.log("");
                console.log(
                  "CLOUDINARY UPLOAD SUCCESS"
                );

                console.log(
                  "Public ID:",
                  result.public_id
                );

                console.log(
                  "Secure URL:",
                  result.secure_url
                );

                resolve(result);
              }
            );

          uploadStream.end(
            req.file.buffer
          );
        }
      );

    // -----------------------------------------------
    // CHECK CLOUDINARY RESULT
    // -----------------------------------------------

    if (
      !uploadResult ||
      !uploadResult.secure_url
    ) {
      console.error(
        "Cloudinary did not return a secure URL"
      );

      return res.status(500).json({
        message:
          "Cloudinary upload failed",
      });
    }

    // -----------------------------------------------
    // SAVE CLOUDINARY URL IN MONGODB
    // -----------------------------------------------

    menuItem.image =
      uploadResult.secure_url;

    const updatedMenuItem =
      await menuItem.save();

    console.log("");
    console.log(
      "IMAGE URL SAVED TO MONGODB"
    );

    console.log(
      "Saved image URL:",
      updatedMenuItem.image
    );

    console.log(
      "========================================"
    );
    console.log(
      "IMAGE UPLOAD COMPLETED SUCCESSFULLY"
    );
    console.log(
      "========================================"
    );
    console.log("");

    // -----------------------------------------------
    // RESPONSE
    // -----------------------------------------------

    return res.status(200).json({
      message:
        "Menu image uploaded successfully",

      menuItem: updatedMenuItem,
    });
  } catch (error) {
    console.error("");
    console.error(
      "========================================"
    );

    console.error(
      "CLOUDINARY UPLOAD ERROR"
    );

    console.error(
      "Error message:",
      error.message
    );

    console.error(
      "Full error:",
      error
    );

    console.error(
      "========================================"
    );

    return res.status(500).json({
      message:
        "Failed to upload menu image",

      error: error.message,
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  searchMenuItems,
  filterByCategory,
  uploadMenuImage,
};