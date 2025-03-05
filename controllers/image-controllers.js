/*const Image = require('../models/image');
const fs = require('fs');
const { 
  uploadToCloudinary
 } = require('../helpers/cloudinaryHelper')

const uploadImageController = async(req, res) => {
  try{
    //CHECK IF FILE IS MISSING IN req OBJECT.
    if(!req.file){
      return res.status(400).json({
        success : false,
        message : 'file is required! please upload an image'
      })
    }

    //IF THE FILE IS NOT MISSING THEN WE UPLOAD THE EXISTING FILE TO CLOUDINARY.
    const { url, publicId } = await uploadToCloudinary(req.file.path);

    //STORE THE IMAGE URL AND PUBLIC ID ALONG WITH THE UPLOADER USER ID IN DATABASE
    const newlyUploadedImage = new Image({
      url,
      publicId,
      uploadedBy : req.userInfo.userId
    })
    await newlyUploadedImage.save();

    //DELETE THE FILE FROM LOCALSTORAGE
    //fs.unlinkSync(req.file.path);

    res.status(201).json({
      success : true,
      message : 'Image uploaded successfully',
      image : newlyUploadedImage
    })
  }catch(error){
    console.log(error);
    res.status(500).json({
      success : false,
      message : 'Something went wrong!, Please try again'
    })
  }
};

const fetchImagesController = async(req, res)=>{
  try{
    const images = await Image.find({});

    if (images) {
      res.status(200).json({
        success : true,
        data : images,
      });
    }
  }catch(error){
    console.log(error);
    res.status(500).json({
      success : false,
      message : 'Something went wrong!, Please try again'
    })
  }
}

module.exports = {
  uploadImageController,
  fetchImagesController,
};*/

const Image = require('../models/image')
const fs= require('fs');
const { 
  uploadToCloudinary
 } = require('../helpers/cloudinaryHelper');
const cloudinary = require('../config/cloudinary')

const uploadImageController = async(req, res) => {
  try{
      //CHECK IF IMAGE FILE IS IN req OBJECT
    if (!req.file) {
      res.status(400).json({
        success : false,
        message : 'Please upload a file !, file is required'
      })
    }

    //IF THE IMAGE FILE IS ALREADY IN req OBJECT
    const { url, publicId } = await uploadToCloudinary(req.file.path)

    //STORE THE IMAGE URL AND PUBLIC ID ALONG WITH THE UPLOADER USER ID IN DATABASE
    const newlyUploadedImage = new Image({
      url,
      publicId,
      uploadedBy : req.userInfo.userId
    });

    await newlyUploadedImage.save();

    //DELETE THE FILE FROM LOCALSTORAGE
    //fs.unlinkSync(req.file.path);
    res.status(201).json({
      success : true,
      message : 'Image uploaded successfully',
      image : newlyUploadedImage
    })
  }catch(error){
    console.log(error)
    res.status(500).json({
      success : false,
      message : 'Something went wrong !, please try again'
    })
  }
}

const fetchImagesController = async(req, res) => {
  try{
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const skip = (page - 1) * limit;

    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const totalImages = await Image.countDocuments();
    const totalPages = Math.ceil(totalImages / limit);
    const sortObj = {};
    sortObj[sortBy] = sortOrder
    const Images = await Image.find().sort(sortObj).skip(skip).limit(limit);

    if (Images) {
      res.status(200).json({
        success : true,
        message : 'Images fetched successfully',
        currentPage : page,
        totalPages : totalPages,
        totalImages : totalImages,
        data : Images,
      })
    }
  }catch(error){
    console.log(error)
    res.status(500).json({
      success : false,
      message : 'Something went wrong!, please try again'
    })
  }
}
const deleteImageController = async(req, res) => {
  try{
    const getCurrentIdOfImageToBeDeleted = req.params.id;
    const userId = req.userInfo.userId;

    const image = await Image.findById(getCurrentIdOfImageToBeDeleted);

    if(!image){
      return res.status(404).json({
        success : false,
        message : 'Image not found',
      })
    }

    //CHECK IF THIS IMAGE IS UPLOADED BY THE CURRENT USER WHO IS TRYING TO DELETE IT
    if(image.uploadedBy.toString() != userId){
      return res.status(403).json({
        success : false,
        message : 'You are not authorised to delete this image uploader admin rights required ',
      })
    }
    //DELETE IMAGE FIRST FROM CLOUDINARY STORAGE
    await cloudinary.uploader.destroy(image.publicId);

    //DELETE THIS IMAGE FROM MONGODB DATABASE
    await Image.findByIdAndDelete(getCurrentIdOfImageToBeDeleted);

    res.status(200).json({
      success : true,
      message : 'Image deleted successfully'
    })

  }catch(error){
    console.log(error)
    res.status(500).json({
      success : false,
      message : 'Something went wrong!, please try again'
    })
  }
}

module.exports = {
  uploadImageController,
  fetchImagesController,
  deleteImageController
}