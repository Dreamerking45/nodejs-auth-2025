
const mongoose = require('mongoose');

const connectToDB = async() =>{
  try{
    await mongoose.connect(process.env.MONGO_URL)
    console.log('mongoDB database connected successfully')
  }catch(error){
    console.error('failed to connect to mongoDB database')
    process.exit(1)
  }
}
module.exports = connectToDB