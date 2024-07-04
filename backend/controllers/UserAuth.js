let {users} = require("../models/UserData");
let User = require("../models/userModel");
const crypto = require('crypto');
const { serialize } = require('cookie'); // Import serialize function from cookie package

exports.getCredentialId = (req, res) => {
  
  //TODO
  const id = req.params.id;
  const index = id - 1;

  if (typeof users[index] === 'undefined') {
    res.status(403).json()
  } 

  const retrievedEmail = users[index].email
  const retrievedPassword = users[index].password

  const email = req.body.email;
  const password = req.body.password;
  
  if (email !== retrievedEmail || password !== retrievedPassword) {
    res.status(403).json({ error: "Incorrect Email or password "})
  }

  const sessionID = crypto.randomBytes(12).toString('base64')
  .replace(/\+/g, '-')
  .replace(/\//g, '_')
  .replace(/=/g, '')
  .slice(0, 16);

  res.status(200).json({ sessionID: sessionID});

  
  
  //no return 403 wrong password
    //js random
  //yes return Hash(16) store it , put it into user. 
  //return with json
};

exports.getCookieByCredential = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const emailExists = await User.emailChecker(email);
  if (!emailExists) {
    res.status(403).json({ message: "Email does not exist" })
  }
  const user = await User.getByEmail(email);
  if (password !== user.password) {
    res.status(403).json({ message: "Email or Password is incorrect" })
  }

  const sessionID = crypto.randomBytes(12).toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
    .slice(0, 16);
  
  user.sessionID = sessionID;
  const id = user.id;
  const attributes = await User.saveSessionID(id, sessionID);

  res.cookie('sessionID', sessionID, {
    httpOnly: false,
    secure: false, // Set to true in production
    sameSite: 'strict', // Adjust as per your security requirements
    maxAge: 60 * 60 * 24 * 7, // 1 week (adjust as needed)
    path: '/', // Path where the cookie is valid
  });

  const dietJSON = {
    email: req.body.email || user.email,
    password: req.body.password || user.password,
    A: user.vegan,
    B: user.vegetarian,
    C: user.halal,
    D: user.glutenFree,
    E: user.dairyFree,
    F: user.nutFree
  }
  
  res.status(200).json({ sessionID: sessionID, diet: dietJSON });
};