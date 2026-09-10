const User = require("../models/user");

// ===============================
// GET ALL USERS - ADMIN
// ===============================
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

// ===============================
// DELETE USER - ADMIN
// ===============================
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Get logged-in admin ID safely
    const adminId = req.user?._id || req.user?.id || req.user?.userId;

    // Check authentication
    if (!adminId) {
      return res.status(401).json({
        message: "Admin user not found in authentication token",
      });
    }

    // Prevent admin from deleting himself
    if (user._id.toString() === adminId.toString()) {
      return res.status(400).json({
        message: "Admin cannot delete himself",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);

    res.status(500).json({
      message: "Failed to delete user",
      error: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
};