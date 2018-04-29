(function () {
  'use strict';

  angular
    .module('downloads')
    .controller('DownloadsListController', DownloadsListController);

  DownloadsListController.$inject = ['DownloadsService','$state'];

  function DownloadsListController(DownloadsService, $state) {
    var vm = this;

    vm.downloads = DownloadsService.query();
    vm.viewDetail = function(id){
      $state.go('downloads.edit', {
        downloadId: id
      });
    };
  }
}());
