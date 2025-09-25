
import Car from '../models/Car.js';
export const listCars = async (req,res) => {
  const q = { };
  if(req.query.class) q.carClass = req.query.class;
  if(req.query.hook==='true') q.hasHook = true;
  const cars = await Car.find(q).sort({createdAt:-1});
  res.json(cars);
};
export const getCar = async (req,res) => {
  const c = await Car.findById(req.params.id);
  if(!c) return res.status(404).json({message:'Not found'});
  res.json(c);
};
export const createCar = async (req,res) => {
  const c = await Car.create(req.body);
  res.status(201).json(c);
};
export const updateCar = async (req,res) => {
  const c = await Car.findByIdAndUpdate(req.params.id, req.body, {new:true});
  res.json(c);
};
export const deleteCar = async (req,res) => {
  await Car.findByIdAndDelete(req.params.id);
  res.json({ok:true});
};
export const setHidden = async (req,res)=>{
  const c = await Car.findById(req.params.id);
  c.status = req.body.status || 'hidden';
  await c.save();
  res.json(c);
};
