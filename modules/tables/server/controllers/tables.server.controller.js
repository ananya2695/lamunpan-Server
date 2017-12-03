'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Table = mongoose.model('Table'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Table
 */
exports.create = function(req, res) {
  var table = new Table(req.body);
  table.user = req.user;

  table.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(table);
    }
  });
};

/**
 * Show the current Table
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var table = req.table ? req.table.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  table.isCurrentUserOwner = req.user && table.user && table.user._id.toString() === req.user._id.toString();

  res.jsonp(table);
};

/**
 * Update a Table
 */
exports.update = function(req, res) {
  var table = req.table;

  table = _.extend(table, req.body);

  table.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(table);
    }
  });
};

/**
 * Delete an Table
 */
exports.delete = function(req, res) {
  var table = req.table;

  table.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(table);
    }
  });
};

/**
 * List of Tables
 */
exports.list = function(req, res) {
  Table.find().sort('-created').populate('user', 'displayName').exec(function(err, tables) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(tables);
    }
  });
};

/**
 * Table middleware
 */
exports.tableByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Table is invalid'
    });
  }

  Table.findById(id).populate('user', 'displayName').exec(function (err, table) {
    if (err) {
      return next(err);
    } else if (!table) {
      return res.status(404).send({
        message: 'No Table with that identifier has been found'
      });
    }
    req.table = table;
    next();
  });
};
