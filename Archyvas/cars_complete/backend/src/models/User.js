
import mongoose from 'mongoose'; import bcrypt from 'bcryptjs';
const schema=new mongoose.Schema({ name:String, email:{type:String,required:true,unique:true}, password:{type:String,required:true}, role:{type:String,enum:['user','admin'],default:'user'}, blocked:{type:Boolean,default:false} },{timestamps:true});
schema.pre('save',async function(next){ if(!this.isModified('password')) return next(); const s=await bcrypt.genSalt(10); this.password=await bcrypt.hash(this.password,s); next(); });
schema.methods.matchPassword=function(candidate){ return bcrypt.compare(candidate,this.password); };
export default mongoose.model('User',schema);
