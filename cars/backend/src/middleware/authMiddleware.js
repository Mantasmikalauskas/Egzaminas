import jwt from 'jsonwebtoken';
import User from '../models/User.js';
export const protect = async (req,res,next)=>{
  const header = req.headers.authorization;
  if(!header || !header.startsWith('Bearer ')) return res.status(401).json({message:'No token'});
  try{
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret');
    const user = await User.findById(decoded.id).select('-password');
    if(!user) return res.status(401).json({message:'Not found'});
    req.user = user; next();
  }catch(err){ next(err); }
};
export const adminOnly = (req,res,next)=>{ if(!req.user) return res.status(401).json({message:'No user'}); if(req.user.role!=='admin') return res.status(403).json({message:'Admin only'}); next(); };
