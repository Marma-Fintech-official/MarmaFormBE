const User = require('../models/userModel');
const cloudinary = require('cloudinary').v2;
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');
const { appendToSheet } = require('../utils/googleSheets'); // Import the function

// POST API to create a user
const createUser = async (req, res) => {
  try {
    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({
        message: 'User with this email already exists. Please use a different email.',
      });
    }

    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Save the new user to MongoDB
    const newUser = new User({
      ...req.body,
      photo: result.secure_url,
    });
    await newUser.save();

    // Prepare user data for Excel export
    const userData = [
      newUser.fullName,
      newUser.dateOfBirth,
      newUser.contactNumber,
      newUser.email,
      newUser.photo,
      newUser.preferredRole,
      newUser.playerInformation,
      newUser.bowlingType,
      newUser.specialSkills,
      newUser.jerseySize,
      newUser.medicalConditions,
      newUser.emergencyContactName,
      newUser.emergencyContactInfo,
      newUser.favoriteCricketer,
      newUser.acknowledgement,
      newUser.date,
    ];

      // Define the Google Sheets ID and range (Sheet1, starting from row 2)
      const spreadsheetId = '10pCKmNWIzLU1giavbbF_Tewr-_ccbK8eM4132URvWms'; // Replace with your actual sheet ID
      const range = 'Sheet1!A2:P';

       // Append user data to the Google Sheet
    await appendToSheet(spreadsheetId, range, userData);

    res.status(201).json({
      message: 'User created successfully and data exported to Google Sheets',
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};


module.exports = {
  createUser,
};




