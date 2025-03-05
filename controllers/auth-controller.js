const Users = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

//register controller
const registerUser = async(req, res)=>{
  try{
    //EXTRACT USER INFORMATION FROM OUT REQUEST BODY
    const {username, email, password, role} = req.body

    //CHECK IF THE USER ALREADY EXISTS IN THE DATABASE
    const checkExistingUser = await Users.findOne({$or : [{username}, {email}]});

    if (checkExistingUser){
      return res.status(400).json({
        success : false,
        message : 'User already exists with either the same username or password please try different ones'
      })
    }
    //HASH USER PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash( password, salt)

    //CREATE A NEW USER AND SAVE IN YOUR DATABASE 
    const newlyCreatedUser = new Users({
      username,
      email,
      password : hashedPassword,
      role : role || 'user'
    })
    await newlyCreatedUser.save()

    if (newlyCreatedUser){
      res.status(201).json({
        success : true,
        message : 'User registered successfully'
      })
    } else {
      res.status(401).json({
        success : false,
        message : 'Unable to register user! please try again'
    })
    }
  
}catch(e){
  console.log(e)
  res.status(500).json({
    success : false,
    message : 'An Error occurred on registration!, Please try again later'
  })
}
}
//login controller
const loginUser = async(req, res)=>{
  try{
    const { username, password } = req.body

    //FIND OUT IF THE CURRENT USER EXISTS IN THE DATABASE
    const user = await Users.findOne({username});
    if (!user){
      return res.status(400).json({
        success : false,
        message : 'Invalid credentials!, the user does not exist'
      })
    }
    //IF THE CURRENT PASSWORD OF THE EXISTING USER IS CORRECT OR NOT
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if(!isPasswordMatch){
      return res.status(400).json({
        success : false,
        message : 'Invalid credentials, the password entered is incorrect'
      })
    }
    //CREATE USER TOKEN
    /*
    const accessToken = jwt.sign({
      userId : user._id,
      username : user.username,
      role : user.role
    }, process.env.JWT_SECRET_KEY, {
      expiresIn : '15m'
    })
    res.status(200).json({
      success : true,
      message : 'logged in successfully',
      accessToken
    })*/
   const accessToken = jwt.sign({
    userId : user._id,
    username : user.name,
    role : user.role
   },process.env.JWT_SECRET_KEY,{
    expiresIn : '30m'
   })
   res.status(200).json({
    success : true,
    message : 'logged in successfully',
    accessToken
   })

  }catch(e){
    console.log(e)
    res.status(500).json({
      success : false,
      message : 'An Error occurred on login!, Please try again later'
    })
  }
}
const changePassword = async(req, res) => {
  try{
    const userId = req.userInfo.userId;

    //EXTRACT OLD AND NEW PASSWORD
    const { oldPassword, newPassword } = req.body;

    //FIND THE CURRENT LOGGED IN USER
    const user = await Users.findById(userId);

    if(!user){
      return res.status(400).json({
        success : false,
        message : 'User not found',
      })
    }

    //CHECK IF THE OLD PASSWORD IS CORRECT
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password)
    if(!isPasswordMatch){
      return res.status(400).json({
        success : false,
        message : 'Old password is not correct! please try again.',
      });
    };
    //HASH THE NEW PASSWORD HERE
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);

    //UPDATE USER PASSOWRD
    user.password = newHashedPassword;
    await user.save();

    res.status(200).json({
      success : true,
      message : 'Password chnged successfully'
    })

  }catch(error){
    console.log(error)
    res.status(500).json({
      success : false,
      message : 'An error occured! Please try again',
    });
  }
}

module.exports = {
  registerUser,
  loginUser,
  changePassword
}