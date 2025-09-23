// node seed.js
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import Car from './src/models/Car.js';
import User from './src/models/User.js';

dotenv.config();

async function run(){
  await connectDB(process.env.MONGO_URI||'mongodb://127.0.0.1:27017/car_rental');
  await Car.deleteMany({});
  await Car.insertMany([{"licensePlate": "YOZ349", "make": "Toyota", "model": "Corolla", "year": 2018, "carClass": "EKONOMIN\u0116 KLAS\u0116", "pricePerDay": 30, "description": "Automobilio apra\u0161ymas", "image": ""}, {"licensePlate": "CDK313", "make": "Honda", "model": "Civic", "year": 2019, "carClass": "VIDUTIN\u0116 KLAS\u0116", "pricePerDay": 40, "description": "Automobilio apra\u0161ymas", "image": ""}, {"licensePlate": "TPC858", "make": "Suzuki", "model": "Jimny", "year": 2020, "carClass": "SUV", "pricePerDay": 55, "description": "Automobilio apra\u0161ymas", "image": ""}, {"licensePlate": "QRV421", "make": "Mercedes", "model": "S-Class", "year": 2021, "carClass": "LIMUZINAI", "pricePerDay": 150, "description": "Automobilio apra\u0161ymas", "image": ""}, {"licensePlate": "ZUT459", "make": "Ford", "model": "Transit", "year": 2017, "carClass": "KROVININIAI", "pricePerDay": 60, "description": "Automobilio apra\u0161ymas", "image": ""}, {"licensePlate": "NNH706", "make": "Nissan", "model": "Leaf", "year": 2021, "carClass": "EKONOMIN\u0116 KLAS\u0116", "pricePerDay": 35, "description": "Automobilio apra\u0161ymas", "image": ""}]);
  await User.deleteMany({});
  await User.create({name:'Admin',email:'admin@admin.lt',password:'admin',role:'admin'});
  console.log('seed done');
  process.exit();
}
run();
