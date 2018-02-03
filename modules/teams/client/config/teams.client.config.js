(function () {
  'use strict';

  angular
    .module('teams')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Teams',
      state: 'teams',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'teams', {
      title: 'List Teams',
      state: 'teams.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'teams', {
      title: 'Create Team',
      state: 'teams.create',
      roles: ['user']
    });
  }
}());
