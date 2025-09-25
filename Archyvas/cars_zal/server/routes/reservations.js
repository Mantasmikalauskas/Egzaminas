const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const Car = require('../models/Car');

router.post('/', async (req,res)=>{
  try{
    const {userId, carId, startDate, endDate, extraInsurance, wash, quantity} = req.body;
    const sd = new Date(startDate); const ed = new Date(endDate);
    const today = new Date(); today.setHours(0,0,0,0);
    if(sd < today) return res.status(400).json({error:'No past reservations allowed'});
    const days = Math.ceil((ed - sd) / (1000*60*60*24)) + 1;
    const car = await Car.findById(carId);
    if(!car) return res.status(400).json({error:'No car'});
    if(car.extraType){
      const overlapping = await Reservation.find({
        carId,
        $or:[
          { startDate: { $lte: ed, $gte: sd } },
          { endDate: { $lte: ed, $gte: sd } },
          { startDate: { $lte: sd }, endDate: { $gte: ed } }
        ]
      });
      const used = overlapping.reduce((s,r)=>s + (r.quantity||1),0);
      if((used + (quantity||1)) > car.extraQuantity) return res.status(400).json({error:'Not enough quantity'});
    }
    let total = (car.pricePerDay||0) * days;
    if(extraInsurance) total += 5 * days;
    if(wash) total += 9;
    const r = new Reservation({userId, carId, startDate:sd, endDate:ed, days, extraInsurance, wash, quantity: quantity||1, totalPrice: total});
    await r.save();
    res.json(r);
  }catch(e){ res.status(500).json({error:e.message}); }
});

router.get('/', async (req,res)=>{
  const {userId} = req.query;
  const q = {};
  if(userId) q.userId = userId;
  const list = await Reservation.find(q).populate('carId').populate('userId');
  res.json(list);
});

router.put('/payAll/:userId', async (req,res)=>{
  const userId = req.params.userId;
  await Reservation.updateMany({userId, paid:false}, {paid:true});
  res.json({ok:true});
});

router.put('/:id', async (req,res)=>{
  const upd = await Reservation.findByIdAndUpdate(req.params.id, req.body, {new:true});
  res.json(upd);
});

router.delete('/:id', async (req,res)=>{
  await Reservation.findByIdAndDelete(req.params.id);
  res.json({ok:true});
});

module.exports = router;
