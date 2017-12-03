(function () {
  'use strict';

  // Tables controller
  angular
    .module('tables')
    .controller('TablesController', TablesController);

  TablesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'tableResolve'];

  function TablesController ($scope, $state, $window, Authentication, table) {
    var vm = this;

    vm.authentication = Authentication;
    vm.table = table;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Table
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.table.$remove($state.go('tables.list'));
      }
    }

    // Save Table
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.tableForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.table._id) {
        vm.table.$update(successCallback, errorCallback);
      } else {
        vm.table.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('tables.view', {
          tableId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
