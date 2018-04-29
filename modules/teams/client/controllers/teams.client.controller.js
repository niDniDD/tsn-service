(function () {
  'use strict';

  // Teams controller
  angular
    .module('teams')
    .controller('TeamsController', TeamsController);

  TeamsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'teamResolve', '$http'];

  function TeamsController($scope, $state, $window, Authentication, team, $http) {
    var vm = this;
    vm.authentication = Authentication;
    vm.team = team;
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
      var img = vm.team.image ? vm.team.image : 'https://www.metatube.com/assets/metatube/video/img/Upload.svg';
      return img;
    }
    // Remove existing Team
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.team.$remove($state.go('teams.list'));
      }
    }

    $scope.fileNameChanged = function (ele) {
      var files = ele.files;
      var l = files.length;
      var namesArr = [];

      for (var i = 0; i < l; i++) {
        namesArr.push(files[i].name);
      }
      vm.team.image = namesArr[0];
      console.log('ssss');
      // isUpload(false);
      // vm.isLoad = false;
    };

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
            vm.team.image = response.data.imageURL;
            // isUpload(true);
            // vm.isLoad = true;
          }, function errorCallback(response) {
            console.log(response);
          });
        };

        fileReader.readAsDataURL(fileToLoad);
      }
    };
    // Save Team
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.teamForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.team._id) {
        vm.team.$update(successCallback, errorCallback);
      } else {
        vm.team.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('teams.view', {
          teamId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
