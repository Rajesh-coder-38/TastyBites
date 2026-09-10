const Order = require("../models/order");
const MenuItem = require("../models/menuItem");

// ===============================
// CREATE ORDER
// ===============================
const createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, phone } = req.body;

    // ===============================
    // CHECK REQUIRED FIELDS
    // ===============================
    if (
      !items ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !deliveryAddress ||
      !phone
    ) {
      return res.status(400).json({
        message:
          "Items, delivery address and phone are required",
      });
    }

    // ===============================
    // PHONE VALIDATION
    // ===============================

    const phoneString = String(phone).trim();

    // Only exactly 10 digits are allowed
    if (!/^[0-9]{10}$/.test(phoneString)) {
      return res.status(400).json({
        message:
          "Please enter a valid 10-digit phone number",
      });
    }

    // ===============================
    // DELIVERY ADDRESS VALIDATION
    // ===============================

    const addressString =
      String(deliveryAddress).trim();

    if (addressString.length < 5) {
      return res.status(400).json({
        message:
          "Please enter a valid delivery address",
      });
    }

    // ===============================
    // GET LOGGED-IN USER ID
    // ===============================

    const userId =
      req.user?._id ||
      req.user?.id ||
      req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message:
          "User not found in authentication token",
      });
    }

    // ===============================
    // CALCULATE ORDER TOTAL
    // ===============================

    let totalAmount = 0;

    const orderItems = [];

    // ===============================
    // CHECK EVERY MENU ITEM
    // ===============================

    for (const item of items) {
      const menuItem = await MenuItem.findById(
        item.menuItem
      );

      if (!menuItem) {
        return res.status(404).json({
          message:
            `Menu item not found: ${item.menuItem}`,
        });
      }

      // ===============================
      // CHECK AVAILABILITY
      // ===============================

      if (menuItem.availability === false) {
        return res.status(400).json({
          message:
            `${menuItem.name} is currently unavailable`,
        });
      }

      // ===============================
      // CHECK QUANTITY
      // ===============================

      const quantity = Number(item.quantity);

      if (
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        return res.status(400).json({
          message:
            "Quantity must be a positive whole number",
        });
      }

      // ===============================
      // CALCULATE TOTAL
      // ===============================

      totalAmount +=
        menuItem.price * quantity;

      // ===============================
      // ADD ITEM
      // ===============================

      orderItems.push({
        menuItem: menuItem._id,
        quantity: quantity,
        price: menuItem.price,
      });
    }

    // ===============================
    // CREATE ORDER
    // ===============================

    const order = await Order.create({
      user: userId,
      items: orderItems,
      totalAmount: totalAmount,
      deliveryAddress: addressString,
      phone: phoneString,
    });

    // ===============================
    // POPULATE ORDER
    // ===============================

    const populatedOrder =
      await Order.findById(order._id)
        .populate(
          "user",
          "name email"
        )
        .populate(
          "items.menuItem",
          "name price image"
        );

    // ===============================
    // RESPONSE
    // ===============================

    res.status(201).json({
      message:
        "Order created successfully",
      order: populatedOrder,
    });

  } catch (error) {
    console.error(
      "Create Order Error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to create order",
      error: error.message,
    });
  }
};

// ===============================
// GET MY ORDERS
// ===============================
const getMyOrders = async (req, res) => {
  try {
    const userId =
      req.user?._id ||
      req.user?.id ||
      req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message:
          "User not found in authentication token",
      });
    }

    const orders = await Order.find({
      user: userId,
    })
      .populate(
        "items.menuItem",
        "name price image"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      message:
        "Orders fetched successfully",
      orders: orders,
    });

  } catch (error) {
    res.status(500).json({
      message:
        "Failed to fetch orders",
      error: error.message,
    });
  }
};

// ===============================
// GET SINGLE ORDER
// ===============================
const getOrderById = async (req, res) => {
  try {
    const userId =
      req.user?._id ||
      req.user?.id ||
      req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message:
          "User not found in authentication token",
      });
    }

    const order =
      await Order.findById(req.params.id)
        .populate(
          "user",
          "name email"
        )
        .populate(
          "items.menuItem",
          "name price image"
        );

    if (!order) {
      return res.status(404).json({
        message:
          "Order not found",
      });
    }

    // ===============================
    // CUSTOMER / ADMIN ACCESS
    // ===============================

    if (
      order.user._id.toString() !==
        userId.toString() &&
      req.user.role !== "Admin"
    ) {
      return res.status(403).json({
        message:
          "Not authorized to view this order",
      });
    }

    res.status(200).json({
      message:
        "Order fetched successfully",
      order: order,
    });

  } catch (error) {
    res.status(500).json({
      message:
        "Failed to fetch order",
      error: error.message,
    });
  }
};

// ===============================
// GET ALL ORDERS - ADMIN
// ===============================
const getAllOrders = async (req, res) => {
  try {
    const orders =
      await Order.find()
        .populate(
          "user",
          "name email"
        )
        .populate(
          "items.menuItem",
          "name price image"
        )
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      message:
        "All orders fetched successfully",
      orders: orders,
    });

  } catch (error) {
    res.status(500).json({
      message:
        "Failed to fetch orders",
      error: error.message,
    });
  }
};

// ===============================
// UPDATE ORDER STATUS - ADMIN
// ===============================
const updateOrderStatus = async (
  req,
  res
) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Preparing",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message:
          "Invalid order status",
      });
    }

    const order =
      await Order.findById(
        req.params.id
      );

    if (!order) {
      return res.status(404).json({
        message:
          "Order not found",
      });
    }

    order.status = status;

    const updatedOrder =
      await order.save();

    res.status(200).json({
      message:
        "Order status updated successfully",
      order: updatedOrder,
    });

  } catch (error) {
    res.status(500).json({
      message:
        "Failed to update order status",
      error: error.message,
    });
  }
};

// ===============================
// CANCEL MY ORDER
// ===============================
const cancelOrder = async (
  req,
  res
) => {
  try {
    const userId =
      req.user?._id ||
      req.user?.id ||
      req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message:
          "User not found in authentication token",
      });
    }

    const order =
      await Order.findById(
        req.params.id
      );

    if (!order) {
      return res.status(404).json({
        message:
          "Order not found",
      });
    }

    if (
      order.user.toString() !==
      userId.toString()
    ) {
      return res.status(403).json({
        message:
          "Not authorized to cancel this order",
      });
    }

    if (
      order.status !== "Pending" &&
      order.status !== "Confirmed"
    ) {
      return res.status(400).json({
        message:
          "This order cannot be cancelled now",
      });
    }

    order.status = "Cancelled";

    const updatedOrder =
      await order.save();

    res.status(200).json({
      message:
        "Order cancelled successfully",
      order: updatedOrder,
    });

  } catch (error) {
    res.status(500).json({
      message:
        "Failed to cancel order",
      error: error.message,
    });
  }
};

// ===============================
// EXPORT
// ===============================
module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
};