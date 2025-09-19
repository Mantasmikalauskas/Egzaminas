import mongoose from 'mongoose';
const carSchema = new mongoose.Schema({ make:String, model:String, year:Number, seats:Number, pricePerDay:Number, status:{type:String,enum:['draft','published','reserved'],default:'draft'}, description:String, images:[String] },{timestamps:true});
export default mongoose.model('Car', carSchema);
