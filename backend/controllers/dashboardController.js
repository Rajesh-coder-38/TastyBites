const MenuItem = require("../models/menuItem");
const User = require("../models/user");
const Order = require("../models/order");

const getDashboardStats = async (req, res) => {
  try {
    const totalMenuItems =
      await MenuItem.countDocuments();

    const totalUsers =
      await User.countDocuments({
        role: "User",
      });

    const totalOrders =
      await Order.countDocuments();

    res.status(200).json({
      message:
        "Dashboard statistics fetched successfully",

      stats: {
        totalMenuItems,
        totalUsers,
        totalOrders,
      },
    });
  } catch (error) {
    console.error(
      "Dashboard Stats Error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch dashboard statistics",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};