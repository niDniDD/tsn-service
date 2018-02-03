(function () {
  'use strict';

  angular
    .module('downloads')
    .controller('DownloadsListController', DownloadsListController);

  DownloadsListController.$inject = ['DownloadsService'];

  function DownloadsListController(DownloadsService) {
    var vm = this;

    vm.downloads = DownloadsService.query();
  }
}());
