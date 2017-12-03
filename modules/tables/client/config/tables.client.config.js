(function () {
  'use strict';

  angular
    .module('tables')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Tables',
      state: 'tables',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'tables', {
      title: 'List Tables',
      state: 'tables.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'tables', {
      title: 'Create Table',
      state: 'tables.create',
      roles: ['user']
    });
  }
}());
