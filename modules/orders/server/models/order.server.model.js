'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Order Schema
 */
var OrderSchema = new Schema({
  products: [{
    _id: {
      type: Schema.ObjectId,
      ref: 'Product'
    },
    size: String,
    type: String,
    qty: Number,
    price: Number
  }],
  table: Number,
  totalQty: Number,
  totalPrice: Number,
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Order', OrderSchema);
