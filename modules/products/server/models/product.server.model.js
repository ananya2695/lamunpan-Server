'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Product Schema
 */
var ProductSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Product name',
    trim: true
  },
  detail: {
    type: String,
    default: ''
  },
  size: {
    type: [{
      size: String,
      price: Number
    }]
  },
  type: {
    type: [{
      name: String,
      price: Number
    }]
  },
  pic: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Product', ProductSchema);
