import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const userSchema = new mongoose.Schema({ name:String, email:{type:String,unique:true,required:true}, password:{type:String,required:true}, role:{type:String,enum:['user','admin'],default:'user'}},{timestamps:true});
userSchema.pre('save', async function(next){ if(!this.isModified('password')) return next(); const s=await bcrypt.genSalt(10); this.password=await bcrypt.hash(this.password,s); next(); });
userSchema.methods.matchPassword = function(c){ return bcrypt.compare(c,this.password); };
export default mongoose.model('User', userSchema);
