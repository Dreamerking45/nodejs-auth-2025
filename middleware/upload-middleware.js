/*const multer = require('multer');
const path = require('path');

//SET OUR MULTER STORAGE
const storage = multer.diskStorage({
  destination : function(req, file, cb){
    cb(null, 'uploads/')
  },
  filename: function(req, file, cb){
    cb(null, 
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    )
  } 
});

//FILE FILTER FUNCTION
const checkFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')){
    cb(null, true)
  } else {
    cb(new Error('Not an image!, Please upload only images'))
  }
}
//MULTER MIDDLEWARE
module.exports = multer({
  storage : storage,
  fileFilter : checkFileFilter,
  limits : {
    fileSize : 5 *1024 *1024 //5MB FILE SIZE LIMIT
  }
})*/

const multer = require('multer');
const path = require('path');

//SET MULTER STORAGE
const storage = multer.diskStorage({
  destination : function(req, file, cb){
    cb(null, 'uploads/')
  },
  filename : function(req, file, cb){
    cb(null, 
      file.fieldname +'-'+ Date.now() + path.extname(file.originalname)
    );
  }
});

//SET FILTER FUNCTION
const checkFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('Image')){
    cb(null, true)
  }else{
    cb(new Error('Not an Image, please upload an Image'))
  }
}
//MULTER MIDDLEWARE
module.exports = multer({
  storage : storage,
  filefilter : checkFileFilter,
  limits : {
    fileSize : 5 *1024 *1024 //5MB FILE SIZE LIMIT
  }
})