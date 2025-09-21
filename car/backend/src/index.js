import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import 'express-async-errors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import carRoutes from './routes/cars.js';
import reservationRoutes from './routes/reservations.js';
import adminRoutes from './routes/admin.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/ping', (req, res)=>res.json({ok:true}));
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/mern_car_rental')
  .then(()=> app.listen(PORT, ()=> console.log('Server running on', PORT)))
  .catch(err => { console.error(err); process.exit(1); });

export default app;
