(function () {
  'use strict';

  angular
    .module('tables')
    .controller('TablesListController', TablesListController);

  TablesListController.$inject = ['TablesService'];

  function TablesListController(TablesService) {
    var vm = this;

    vm.tables = TablesService.query();
  }
}());
