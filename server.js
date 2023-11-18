const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const Customer = require('./models/CustomerModel');
const Order = require('./models/OrderModel');
const Product = require('./models/ProductModel');

mongoose.connect('mongodb://localhost:27017/test');
const db = mongoose.connection;

db.on('error', (err) => {
  console.log(err);
});

db.once('open', () => {
  console.log('DB connection established');
});

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// API endpoint to get all customer names
app.get('/customers', async (req, res) => {
  try {
    const customerNames = await Customer.find({}, 'CustomerName');
    const names = customerNames.map((customer) => customer.CustomerName);
    res.json(names);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Make a rest API by getting the data from imported tables.
//the result in the API should be as follows
//top 10 Customers with highest revenue (Sum of cost), Response data , Customer ID, Customer name, product id, product name, total qty ordered, total value of that product
// API endpoint to get top 10 customers by revenue
app.get('/topCustomers', async (req, res) => {
  try {
    const result = await Order.aggregate([
      {
        $unwind: '$lineItems',
      },
      {
        $lookup: {
          from: 'customers',
          localField: 'CustId',
          foreignField: '_id',
          as: 'customerDetails',
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: 'lineItems.prodId',
          foreignField: '_id',
          as: 'productDetails',
        },
      },
      {
        $group: {
          _id: '$CustId',
          // CustomerID: { $first: '$CustId' },
          CustomerName: { $first: '$customerDetails.CustomerName' },
          // ProductID: { $push: '$lineItems.prodId' },
          // ProductName: { $push: '$productDetails.ProductName' },
          TotalRevenue: {
            $sum: { $multiply: ['$lineItems.Cost', '$lineItems.prodCount'] },
          },
          Products: {
            $push: {
              ProductID: '$lineItems.prodId',
              ProductName: '$productDetails.ProductName',
              TotalQtyOrdered: '$lineItems.prodCount',
              TotalValue: '$lineItems.Cost',
            },
          },
        },
      },
      {
        $sort: { TotalValue: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
