const express = require('express');
const authMiddleware = require('../middleware/auth-middleware');
const adminMiddleware = require('../middleware/admin-middleware')
const uploadMiddleware = require('../middleware/upload-middleware'); 
const { 
  uploadImageController,
  fetchImagesController,
  deleteImageController,
 }= require('../controllers/image-controllers')

const router = express.Router();

//UPLOAD THE IMAGE
router.post(
  '/upload',
   authMiddleware,
   adminMiddleware,
   uploadMiddleware.single('image'),
   uploadImageController
  );
  
//GET ALL THE IMAGES
router.get(
  '/get',
  authMiddleware,
  fetchImagesController,
)

//DELETE IMAGE ROUTES
router.delete('/:id', authMiddleware, adminMiddleware, deleteImageController)

module.exports = router