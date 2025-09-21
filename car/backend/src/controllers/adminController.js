import Car from '../models/Car.js'; import Reservation from '../models/Reservation.js';
export const stats = async (req,res)=>{ const carCount = await Car.countDocuments(); const resCount = await Reservation.countDocuments(); res.json({carCount,resCount}); };
