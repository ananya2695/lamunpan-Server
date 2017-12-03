'use strict';

/**
 * Module dependencies
 */
var tablesPolicy = require('../policies/tables.server.policy'),
  tables = require('../controllers/tables.server.controller');

module.exports = function(app) {
  // Tables Routes
  app.route('/api/tables')//.all(tablesPolicy.isAllowed)
    .get(tables.list)
    .post(tables.create);

  app.route('/api/tables/:tableId').all(tablesPolicy.isAllowed)
    .get(tables.read)
    .put(tables.update)
    .delete(tables.delete);

  // Finish by binding the Table middleware
  app.param('tableId', tables.tableByID);
};
