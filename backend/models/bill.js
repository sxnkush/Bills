const mongoose = require("mongoose");

const billSchema = mongoose.Schema({
  firmName: {
    type: String,
    required: true,
  },
  issueDate: {
    type: Date,
    default: Date.now,
  },
  customerName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  gstin: {
    type: String,
    required: true,
  },
  contractId: {
    type: String,
    required: true,
  },
  contractDate: {
    type: Date,
    required: false,
  },
  itemsAdded: [
    {
      productName: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      total: {
        type: Number,
        required: true,
      },
    },
  ],
  contact: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24 * 30 * 6, 
  },
});

const Bill = mongoose.model("Bills", billSchema);

module.exports = Bill;
