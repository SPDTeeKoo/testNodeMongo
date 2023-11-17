const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  _id: Number,
  CustId: Number,
  invoiceDate: Date,
  lineItems: [
    {
      prodId: Number,
      prodCount: Number,
      Cost: Number,
    },
  ],
  orderStatus: String,
  statusDate: Date,
});

const Order = mongoose.model('orders', orderSchema);

module.exports = Order;
