const express = require('express');
const router = express.Router();
//const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { createUser} = require('../controller/userController');
const { upload } = require('../utils/multer')


// Routes
router.post('/users', upload.single('photo'), createUser);
//router.get('/users/export', exportUsersToExcel);

module.exports = router;
