const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const User = require("./models/user");

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");
    const existingAdmin = await User.findOne({
      email: "admin@tastybites.com",
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit();
    }
    const hashedPassword = await bcrypt.hash("Admin@123", 10);
    const admin = await User.create({
      name: "Admin",
      email: "admin@tastybites.com",
      password: hashedPassword,
      role: "Admin",
    });

    console.log("Admin created successfully");
    console.log("Email:", admin.email);
    console.log("Role:", admin.role);

    process.exit();
  } catch (error) {
    console.error("Error creating admin:", error.message);
    process.exit(1);
  }
};

createAdmin();