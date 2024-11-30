const User = require('../models/userModel');
const cloudinary = require('cloudinary').v2;
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

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
    const userData = {
      FullName: newUser.fullName,
      DateOfBirth: newUser.dateOfBirth,
      ContactNumber: newUser.contactNumber,
      Email: newUser.email,
      Photo: newUser.photo,
      PreferredRole: newUser.preferredRole,
      PlayerInformation: newUser.playerInformation,
      BowlingType: newUser.bowlingType,
      SpecialSkills: newUser.specialSkills,
      JerseySize: newUser.jerseySize,
      MedicalConditions: newUser.medicalConditions,
      EmergencyContactName: newUser.emergencyContactName,
      EmergencyContactInfo: newUser.emergencyContactInfo,
      FavoriteCricketer: newUser.favoriteCricketer,
      Acknowledgement: newUser.acknowledgement,
      Date: newUser.date,
    };

    // Define the file path for the Excel file
    const filePath = path.join(__dirname, '../data/Users-MarmaForm2.xlsx');

    // Check if the Excel file exists
    if (!fs.existsSync(filePath)) {
      return res.status(400).json({ message: 'Excel file not found' });
    }

    // Read the existing Excel file
    const workbook = xlsx.readFile(filePath);

    // Get the first sheet (or modify as needed for other sheets)
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    // Convert the worksheet data to JSON
    const existingData = xlsx.utils.sheet_to_json(worksheet);

    // Add the new user data
    const updatedData = [...existingData, userData];

    // Convert the updated data back to a worksheet
    const updatedWorksheet = xlsx.utils.json_to_sheet(updatedData);

    // Replace the old worksheet with the updated one
    workbook.Sheets[workbook.SheetNames[0]] = updatedWorksheet;

    // Write the updated Excel file to the same path
    xlsx.writeFile(workbook, filePath);

    res.status(201).json({
      message: 'User created successfully and data exported to Excel',
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};


module.exports = {
  createUser,
};




// const User = require('../models/userModel');
// const cloudinary = require('cloudinary').v2;
// const xlsx = require('xlsx');
// const path = require('path');
// const fs = require('fs');


// // POST API to create a user
// const createUser = async (req, res) => {
//   try {
//     // Upload image to Cloudinary
//     const result = await cloudinary.uploader.upload(req.file.path);

//     // Save user mongmdata
//     const newUser = new User({
//       ...req.body,
//       photo: result.secure_url,
//     });
//     await newUser.save();

//     res.status(201).json({ message: 'User created successfully', user: newUser });
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating user', error });
//   }
// };

// // Export users to existing Excel file
// const exportUsersToExcel = async (req, res) => {
//   try {
//     // Fetch users from the database
//     const users = await User.find();

//     // Map user data into an array of objects suitable for Excel
//     const data = users.map((user) => ({
//       FullName: user.fullName,
//       DateOfBirth: user.dateOfBirth,
//       ContactNumber: user.contactNumber,
//       Email: user.email,
//       Photo: user.photo,
//       PreferredRole: user.preferredRole,
//       PlayerInformation: user.playerInformation,
//       BowlingType: user.bowlingType,
//       SpecialSkills: user.specialSkills,
//       JerseySize: user.jerseySize,
//       MedicalConditions: user.medicalConditions,
//       EmergencyContactName: user.emergencyContactName,
//       EmergencyContactInfo: user.emergencyContactInfo,
//       FavoriteCricketer: user.favoriteCricketer,
//       Acknowledgement: user.acknowledgement,
//       Date: user.date,
//     }));

//     // Define the file path for the existing Excel file
//     const filePath = path.join(__dirname, '../data/Users-MarmaForm2.xlsx');

//     // Check if the file exists
//     if (!fs.existsSync(filePath)) {
//       return res.status(400).json({ message: 'Excel file not found' });
//     }

//     // Read the existing Excel file
//     const workbook = xlsx.readFile(filePath);

//     // Get the first sheet (or modify as needed for other sheets)
//     const worksheet = workbook.Sheets[workbook.SheetNames[0]];

//     // Convert the worksheet data to JSON
//     const existingData = xlsx.utils.sheet_to_json(worksheet);

//     // Merge the new data with the existing data
//     const updatedData = [...existingData, ...data];

//     // Convert the updated data back to a worksheet
//     const updatedWorksheet = xlsx.utils.json_to_sheet(updatedData);

//     // Replace the old worksheet with the updated one
//     workbook.Sheets[workbook.SheetNames[0]] = updatedWorksheet;

//     // Write the updated Excel file to the same path
//     xlsx.writeFile(workbook, filePath);

//     // Send the file as a response to the client for download
//     res.download(filePath, 'Users-MarmaForm.xlsx', (err) => {
//       if (err) {
//         res.status(500).json({ message: 'Error sending file', error: err });
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Error exporting users to Excel', error });
//   }
// };




// module.exports = {
//     createUser,
//     exportUsersToExcel,
//   }