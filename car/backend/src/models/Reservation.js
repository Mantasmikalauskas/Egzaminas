import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
  car:{type:mongoose.Schema.Types.ObjectId,ref:'Car',required:true},
  startDate:Date, endDate:Date, totalPrice:Number, status:{type:String,enum:['pending','reserved','cancelled'],default:'pending'}
},{timestamps:true});
export default mongoose.model('Reservation', schema);
