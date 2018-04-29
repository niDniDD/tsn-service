(function () {
  'use strict';

  angular
    .module('news')
    .controller('NewsListController', NewsListController);

  NewsListController.$inject = ['NewsService', '$state'];

  function NewsListController(NewsService, $state) {
    var vm = this;

    vm.news = NewsService.query();
    vm.viewDetail = function (id) {
      $state.go('news.view', {
        newsId: id
      });
    };
    vm.showWord = function(text){
      var textshow = text.substr(0,230);
      textshow += '...';
      return textshow;
    };
  }
}());
