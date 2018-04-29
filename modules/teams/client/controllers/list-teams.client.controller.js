(function () {
  'use strict';

  angular
    .module('teams')
    .controller('TeamsListController', TeamsListController);

  TeamsListController.$inject = ['TeamsService', '$state'];

  function TeamsListController(TeamsService, $state) {
    var vm = this;

    vm.teams = TeamsService.query();
    vm.viewDetail = function (id) {
      $state.go('teams.edit', {
        teamId: id
      });
    };
  }
}());
