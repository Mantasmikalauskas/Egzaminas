
import Reservation from '../models/Reservation.js'; import Car from '../models/Car.js';
const startOfDay = d => { const x = new Date(d); x.setHours(0,0,0,0); return x; };
export const createReservation = async (req,res,next) => {
  try {
    const { carId, startDate, endDate, quantity, extraInsurance, wash } = req.body;
    if(!carId||!startDate||!endDate) return res.status(400).json({message:'Missing fields'});
    const car = await Car.findById(carId);
    if(!car) return res.status(404).json({message:'Car not found'});
    const today = startOfDay(new Date()); const s = startOfDay(new Date(startDate)); const e = startOfDay(new Date(endDate));
    if(s < today) return res.status(400).json({message:'Start date must not be in the past'});
    if(e < s) return res.status(400).json({message:'End date must be same or after start date'});
    const overlapFilter = { car: carId, status: { $in: ['pending','reserved'] }, $or: [ { startDate: { $lte: e }, endDate: { $gte: s } } ] };
    if(car.qty && car.qty > 0){
      const overlaps = await Reservation.find(overlapFilter);
      const used = overlaps.reduce((acc,r)=>acc+(r.quantity||1),0);
      const want = parseInt(quantity||1,10);
      if(used + want > car.qty) return res.status(400).json({message:'Not enough quantity available for selected dates'});
    } else {
      const existing = await Reservation.findOne(overlapFilter);
      if(existing) return res.status(400).json({message:'Car not available for selected dates'});
    }
    const days = Math.ceil((e - s) / (1000*60*60*24)) + 1;
    let total = (car.pricePerDay || 0) * days * (quantity || 1);
    if(extraInsurance && !['KĖDUTĖS VAIKAMS','NARVAI AUGINTINIAMS','KITA PAPILDOMA ĮRANGA'].includes(car.carClass)){
      total += 5 * days * (quantity || 1);
    }
    if(wash && !['KĖDUTĖS VAIKAMS','NARVAI AUGINTINIAMS','KITA PAPILDOMA ĮRANGA'].includes(car.carClass)){
      total += 9;
    }
    const r = await Reservation.create({ user: req.user._id, car: car._id, startDate: s, endDate: e, quantity: quantity || 1, totalPrice: total, status: 'reserved' });
    res.status(201).json(r);
  } catch (err) {
    next(err);
  }
};
export const getMy = async (req,res,next) => { try { const items = await Reservation.find({ user: req.user._id }).populate('car'); res.json(items); } catch (err) { next(err); } };
export const getAll = async (req,res,next) => { try { const items = await Reservation.find().populate('car').populate('user','email name'); res.json(items); } catch (err) { next(err); } };
export const updateReservation = async (req,res,next) => { try { const r = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json(r); } catch (err) { next(err); } };
export const deleteReservation = async (req,res,next) => { try { await Reservation.findByIdAndDelete(req.params.id); res.json({ok:true}); } catch (err) { next(err); } };
