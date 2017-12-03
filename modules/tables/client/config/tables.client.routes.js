(function () {
  'use strict';

  angular
    .module('tables')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('tables', {
        abstract: true,
        url: '/tables',
        template: '<ui-view/>'
      })
      .state('tables.list', {
        url: '',
        templateUrl: 'modules/tables/client/views/list-tables.client.view.html',
        controller: 'TablesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Tables List'
        }
      })
      .state('tables.create', {
        url: '/create',
        templateUrl: 'modules/tables/client/views/form-table.client.view.html',
        controller: 'TablesController',
        controllerAs: 'vm',
        resolve: {
          tableResolve: newTable
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Tables Create'
        }
      })
      .state('tables.edit', {
        url: '/:tableId/edit',
        templateUrl: 'modules/tables/client/views/form-table.client.view.html',
        controller: 'TablesController',
        controllerAs: 'vm',
        resolve: {
          tableResolve: getTable
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Table {{ tableResolve.name }}'
        }
      })
      .state('tables.view', {
        url: '/:tableId',
        templateUrl: 'modules/tables/client/views/view-table.client.view.html',
        controller: 'TablesController',
        controllerAs: 'vm',
        resolve: {
          tableResolve: getTable
        },
        data: {
          pageTitle: 'Table {{ tableResolve.name }}'
        }
      });
  }

  getTable.$inject = ['$stateParams', 'TablesService'];

  function getTable($stateParams, TablesService) {
    return TablesService.get({
      tableId: $stateParams.tableId
    }).$promise;
  }

  newTable.$inject = ['TablesService'];

  function newTable(TablesService) {
    return new TablesService();
  }
}());
