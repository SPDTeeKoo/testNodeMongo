const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  _id: Number,
  CustomerName: String,
  customerDescription: String,
  Address: String,
});

const Customer = mongoose.model('customers', customerSchema);

module.exports = Customer;
