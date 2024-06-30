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

exports.createUser = async (req, res) => {
  const emailExists = await User.emailChecker(req.body.email);
  if (!emailExists) {
    const newUser = {
      id: generateSecureRandomId(),
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      vegan: req.body.vegan,
      vegetarian: req.body.vegetarian,
      halal: req.body.halal,
      glutenFree: req.body.glutenFree,
      dairyFree: req.body.dairyFree,
      nutFree: req.body.nutFree
    };

    await User.create(newUser);
    res.status(201).json({ message: 'User created successfully', id: newUser.id });
  } else {
    res.status(401).json({ message: "User Already Created" });
  }
};

exports.updateUser = async (req, res) => {
  const id = req.params.id;
  const user = await User.getById(id);
  if (user === undefined) res.status(404).send('User not found');
  const updates = {
    name: req.body.name || user.name,
    email: req.body.email || user.email,
    password: req.body.password || user.password,
    vegan: req.body.vegan !== undefined ? req.body.vegan : user.vegan,
    vegetarian: req.body.vegetarian !== undefined ? req.body.vegetarian : user.vegetarian,
    halal: req.body.halal !== undefined ? req.body.halal : user.halal,
    glutenFree: req.body.glutenFree !== undefined ? req.body.glutenFree : user.glutenFree,
    dairyFree: req.body.dairyFree !== undefined ? req.body.dairyFree : user.dairyFree,
    nutFree: req.body.nutFree !== undefined ? req.body.nutFree : user.nutFree
  };

  const updatedUser = await User.update(id, updates);
  res.json(updatedUser);
};

//TODO
exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  const user = await User.getById(id);
  if (user === undefined) res.status(404).send('User not found');
  await User.deleteUser(id);
  res.json({ message: "User deleted" });
};