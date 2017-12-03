// Tables service used to communicate Tables REST endpoints
(function () {
  'use strict';

  angular
    .module('tables')
    .factory('TablesService', TablesService);

  TablesService.$inject = ['$resource'];

  function TablesService($resource) {
    return $resource('api/tables/:tableId', {
      tableId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
