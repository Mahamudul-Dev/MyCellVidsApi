const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const Admin = require("../models/Admin");

const JWT_SECRET_KEY = "secret123";


module.exports.createAdmin = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    // Check if an admin with the same email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ message: 'Admin with this email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new admin in the database
    const newAdmin = await Admin.create({
      userName,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ email: newAdmin.email, id: newAdmin._id }, JWT_SECRET_KEY);
    return res.status(201).json({ message: 'Admin created successfully', admin: newAdmin, token });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

module.exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the admin by email
    const admin = await Admin.findOne({ email });

    // If the admin is not found
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    // If the password is invalid
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ adminId: admin._id }, JWT_SECRET_KEY, { expiresIn: '1h' });

    // Return the token to the client
    return res.status(200).json({ message: 'Login successful', admin, token });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

module.exports.getAdmin = async (req, res) => {
  try {
    const admins = await Admin.findOne({});
    return res.status(200).json({ message: 'Admins fetched successfully', admins: admins });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

module.exports.updatedAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;
    const { userName, email, password } = req.body;

    // Check if the admin with the given ID exists
    const adminToUpdate = await Admin.findById({ _id: adminId });

    if (!adminToUpdate) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Hash the new password if provided
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Update admin's details
    adminToUpdate.userName = userName || adminToUpdate.userName;
    adminToUpdate.email = email || adminToUpdate.email;
    adminToUpdate.password = hashedPassword || adminToUpdate.password;

    await adminToUpdate.save();

    return res.status(200).json({ message: 'Admin updated successfully', admin: adminToUpdate });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}



