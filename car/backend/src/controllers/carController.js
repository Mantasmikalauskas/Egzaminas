import Car from '../models/Car.js';
export const createCar=async(req,res)=>{ const car=await Car.create(req.body); res.status(201).json(car); };
export const updateCar=async(req,res)=>{ const car=await Car.findByIdAndUpdate(req.params.id,req.body,{new:true}); if(!car) return res.status(404).json({message:'Car not found'}); res.json(car); };
export const listCars=async(req,res)=>{ const q={}; if(req.query.status) q.status=req.query.status; const cars=await Car.find(q).sort({createdAt:-1}); res.json(cars); };
export const getCar=async(req,res)=>{ const car=await Car.findById(req.params.id); if(!car) return res.status(404).json({message:'Car not found'}); res.json(car); };
export const changeStatus=async(req,res)=>{ const {status}=req.body; if(!['draft','published','reserved'].includes(status)) return res.status(400).json({message:'Invalid'}); const car=await Car.findByIdAndUpdate(req.params.id,{status},{new:true}); if(!car) return res.status(404).json({message:'Car not found'}); res.json(car); };
