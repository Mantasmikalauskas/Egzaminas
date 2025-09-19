import Car from '../models/Car.js'; import Reservation from '../models/Reservation.js';
export const adminStats=async(req,res)=>{ const carCount=await Car.countDocuments(); const resvCount=await Reservation.countDocuments(); res.json({carCount,resvCount}); };
