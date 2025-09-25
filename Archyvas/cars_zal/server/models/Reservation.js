const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  carId: {type: mongoose.Schema.Types.ObjectId, ref:'Car'},
  startDate: Date,
  endDate: Date,
  days: Number,
  extraInsurance: {type:Boolean, default:false},
  wash: {type:Boolean, default:false},
  quantity: {type:Number, default:1},
  totalPrice: Number,
  paid: {type:Boolean, default:false},
  createdAt: {type:Date, default:Date.now}
});
module.exports = mongoose.model('Reservation', schema);
