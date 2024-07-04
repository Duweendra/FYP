// src/controllers/userController.js
import bcrypt from 'bcrypt'
import User from '../models/User.js'
import jwt from "jsonwebtoken";
import Scan from '../models/Scans.js';
import upload from '../config/multer.js';
import multer from 'multer';
import path from 'path';

const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRECT || 'wateveris');
    const { password: _, ...userDetails } = user.toObject();
    res.status(201).json({ 'accessToken': token, 'userinfo': userDetails });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const createScan = async (req, res) => {
  
  const { pid, note, prediction, probability } = req.body;
  const imagePath = req.file ? req.file.path : null;

  try {
    const scan = new Scan({ pid, note, prediction, probability, image: imagePath });
    await scan.save();

    res.status(201).json({ message: 'Scan saved successfully!' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }

};



const getScan = async (req, res) => {
  try {
    const scans = await Scan.find();
    res.json(scans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRECT || 'wateveris');

    // Password is correct, return user details (without the password)
    const { password: _, ...userDetails } = user.toObject();
    res.status(200).json({ 'accessToken': token, 'userinfo': userDetails });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export { getUsers, createUser, loginUser, getScan, createScan };