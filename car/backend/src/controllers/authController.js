import User from '../models/User.js'; import jwt from 'jsonwebtoken';
function genToken(u){ return jwt.sign({id:u._id,role:u.role}, process.env.JWT_SECRET||'supersecret',{expiresIn:'7d'}); }
export const registerUser=async(req,res)=>{ const {name,email,password}=req.body; if(await User.findOne({email})) return res.status(400).json({message:'Email used'}); const user=await User.create({name,email,password}); res.status(201).json({user:{id:user._id,name:user.name,email:user.email,role:user.role}, token:genToken(user)}); };
export const loginUser=async(req,res)=>{ const {email,password}=req.body; const user=await User.findOne({email}); if(!user) return res.status(401).json({message:'Invalid'}); const ok=await user.matchPassword(password); if(!ok) return res.status(401).json({message:'Invalid'}); res.json({user:{id:user._id,name:user.name,email:user.email,role:user.role}, token:genToken(user)}); };
export const getProfile=async(req,res)=>{ res.json({user:req.user}); };
