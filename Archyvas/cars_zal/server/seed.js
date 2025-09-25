/**
 * Run: node seed.js
 * Clears users and cars, then imports seedData.json and creates admin user
 */
const mongoose = require('mongoose');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Car = require('./models/Car');

const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/carsdb';
mongoose.connect(MONGO).then(async ()=>{
  console.log('connected to mongo');
  const data = JSON.parse(fs.readFileSync(__dirname + '/seedData.json','utf8'));
  await User.deleteMany({});
  await Car.deleteMany({});
  const adminPass = await bcrypt.hash('admin',10);
  await new User({name:'Admin', email:'admin@admin.lt', password:adminPass, isAdmin:true}).save();
  const userPass = await bcrypt.hash('user',10);
  await new User({name:'User One', email:'user1@example.com', password:userPass}).save();
  await new User({name:'User Two', email:'user2@example.com', password:userPass}).save();
  await Car.insertMany(data.cars);
  console.log('seed finished');
  process.exit(0);
}).catch(e=>{console.error(e); process.exit(1);});
