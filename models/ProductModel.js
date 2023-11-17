const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: String,
  productDescription: String,
  unitPrice: Number,
});

const Product = mongoose.model('products', productSchema);

module.exports = Product;
