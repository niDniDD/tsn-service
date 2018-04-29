(function () {
  'use strict';

  // News controller
  angular
    .module('news')
    .controller('NewsController', NewsController);

  NewsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'newsResolve', '$http'];

  function NewsController($scope, $state, $window, Authentication, news, $http) {
    var vm = this;

    vm.authentication = Authentication;
    vm.news = news;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.imageShow = imageShow;
    // vm.uploadImage = uploadImage;
    // vm.isLoad = true;
    // $scope.isCheckUpload = true;
    // $scope.isUpload(true);
    function imageShow() {
      var img = vm.news.image ? vm.news.image : 'https://www.metatube.com/assets/metatube/video/img/Upload.svg';
      return img;
    }
    $scope.uploadImage = function (img) {
      var image;
      var filesSelected = document.getElementById('dddd').files;
      if (filesSelected.length > 0) {
        var fileToLoad = filesSelected[0];
        var fileReader = new FileReader();
        fileReader.onload = function (fileLoadedEvent) {
          image = fileLoadedEvent.target.result;
          // console.log(image);
          $http.post('api/uploadimage', { data: image }).then(function successCallback(response) {
            console.log(response);
            vm.news.image = response.data.imageURL;
            // isUpload(true);
            // vm.isLoad = true;
          }, function errorCallback(response) {
            // alert();
            console.log(response);
          });
        };

        fileReader.readAsDataURL(fileToLoad);
      }
    };
    // Remove existing News
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.news.$remove($state.go('news.list'));
      }
    }

    // Save News
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.newsForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.news._id) {
        vm.news.$update(successCallback, errorCallback);
      } else {
        vm.news.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('news.view', {
          newsId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
