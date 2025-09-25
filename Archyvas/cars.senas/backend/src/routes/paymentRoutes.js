
import express from 'express'; import { checkout } from '../controllers/paymentController.js'; const r=express.Router(); r.post('/checkout',checkout); export default r;
