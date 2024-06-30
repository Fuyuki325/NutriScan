let {users} = require("../models/UserData");
const crypto = require('crypto');

//New Add
const User = require('../models/userModel');

exports.getAllUsers = async (req, res) => {
  res.json(await User.getAll());
};

exports.getUserById = async (req, res) => {
  const user = await User.getById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

function generateSecureRandomId(length = 16) {
  const userId = crypto.randomBytes(12) // Generate 12 random bytes
    .toString('base64') // Convert bytes to base64 string
    .replace(/\+/g, '-') // Replace '+' with '-'
    .replace(/\//g, '_') // Replace '/' with '_'
    .replace(/=/g, '') // Remove trailing '=' padding
    .slice(0, 16); // Take the first 16 characters
  return userId;
}