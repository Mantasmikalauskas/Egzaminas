const express = require('express'); const router = express.Router(); const User = require('../models/User');
router.get('/', async (req,res)=>{ const users = await User.find({}, '-password'); res.json(users); });
router.delete('/:id', async (req,res)=>{ await User.findByIdAndDelete(req.params.id); res.json({ok:true}); });
router.put('/:id/block', async (req,res)=>{ const u = await User.findById(req.params.id); if(!u) return res.status(404).json({error:'Not found'}); u.blocked = !u.blocked; await u.save(); res.json({ok:true, blocked:u.blocked}); });
module.exports = router;
