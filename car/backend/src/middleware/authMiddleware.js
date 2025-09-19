import jwt from 'jsonwebtoken';
import User from '../models/User.js';
export const protect = async (req,res,next)=>{ const h=req.headers.authorization; if(!h||!h.startsWith('Bearer ')) return res.status(401).json({message:'No token'}); try{ const token=h.split(' ')[1]; const dec=jwt.verify(token, process.env.JWT_SECRET||'supersecret'); const user=await User.findById(dec.id).select('-password'); if(!user) return res.status(401).json({message:'User not found'}); req.user=user; next(); }catch(e){ next(e); } };
export const adminOnly = (req,res,next)=>{ if(!req.user) return res.status(401).json({message:'Not auth'}); if(req.user.role!=='admin') return res.status(403).json({message:'Admin only'}); next(); };
