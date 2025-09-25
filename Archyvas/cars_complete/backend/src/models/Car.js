
import mongoose from 'mongoose';
const carSchema = new mongoose.Schema({
  licensePlate:{type:String,required:true,unique:true},
  make:String, model:String, year:Number, carClass:String, pricePerDay:Number,
  hasHook:{type:Boolean,default:false}, qty:{type:Number,default:0},
  status:{type:String,enum:['draft','published','hidden'],default:'published'},
  description:String, image:String
},{timestamps:true});
export default mongoose.model('Car',carSchema);
