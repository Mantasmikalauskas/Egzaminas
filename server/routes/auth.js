const express = require('express'); const router = express.Router();
const User = require('../models/User'); const bcrypt = require('bcryptjs'); const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'devsecret';

router.post('/register', async (req,res)=>{ try{ const {name,email,password} = req.body; const hashed = await bcrypt.hash(password,10); const u = new User({name,email,password:hashed}); await u.save(); res.json({ok:true}); }catch(e){ res.status(400).json({error:e.message}); }});

router.post('/login', async (req,res)=>{ try{ const {email,password} = req.body; const u = await User.findOne({email}); if(!u) return res.status(400).json({error:'Invalid'}); if(u.blocked) return res.status(403).json({error:'Blocked'}); const match = await bcrypt.compare(password,u.password); if(!match) return res.status(400).json({error:'Invalid'}); const token = jwt.sign({id:u._id,isAdmin:u.isAdmin}, SECRET, {expiresIn:'7d'}); res.json({token, user:{id:u._id,name:u.name,email:u.email,isAdmin:u.isAdmin}}); }catch(e){ res.status(500).json({error:e.message}); }});

module.exports = router;
