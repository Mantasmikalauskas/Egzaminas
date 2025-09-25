const express = require('express');
const router = express.Router();
const Car = require('../models/Car');

router.get('/', async (req,res)=>{
  try{
    const {classType, withHook, extraType} = req.query;
    const q = {};
    if(classType && classType !== 'VISI') q.class = classType;
    if(withHook === 'true') q.withHook = true;
    if(extraType) q.extraType = extraType;
    const list = await Car.find(q);
    res.json(list);
  }catch(e){ res.status(500).json({error:e.message}); }
});

router.get('/:id', async (req,res)=>{
  const c = await Car.findById(req.params.id);
  res.json(c);
});

router.post('/', async (req,res)=>{
  const c = new Car(req.body);
  await c.save();
  res.json(c);
});

router.put('/:id', async (req,res)=>{
  const c = await Car.findByIdAndUpdate(req.params.id, req.body, {new:true});
  res.json(c);
});

router.delete('/:id', async (req,res)=>{
  await Car.findByIdAndDelete(req.params.id);
  res.json({ok:true});
});

module.exports = router;
