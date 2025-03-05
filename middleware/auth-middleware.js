  /*const jwt = require('jsonwebtoken')

  const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log(authHeader);

  const token = authHeader && authHeader.split(" ")[1];

  if (!token){
    return res.status(401).json({
      success : false,
      messsage : 'Access denied. No token provided. Please login to continue'
    })
  }
  //decode this token
  try{
    const decodedTokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(decodedTokenInfo)

    req.userInfo = decodedTokenInfo;
    next();
  }catch(error){
    return res.status(500).json({
      success : false,
      messsage : 'Access denied. No token provided. Please login to continue'
    })
  }
}

module.exports = authMiddleware;*/
const jwt = require('jsonwebtoken');
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success : false,
      message : "Access denied, no token provided, please login to continue",
    })
  }
  //decode this token
  try{
    const decodedTokenInfo = jwt.verify(token,process.env.JWT_SECRET_KEY)
    console.log(decodedTokenInfo);

    req.userInfo = decodedTokenInfo;
    
    next();
  }catch(error){
    res.status(500).json({
      success : false,
      message : "Access denied, no token provided, please log in to continue"
    })
  }
}
module.exports = authMiddleware