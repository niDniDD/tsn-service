'use strict';

angular.module('users').controller('ChangeProfilePictureController', ['$scope', '$timeout', '$window', 'Authentication', 'FileUploader', '$http',
  function ($scope, $timeout, $window, Authentication, FileUploader, $http) {
    $scope.user = Authentication.user;
    $scope.imageURL = $scope.user.profileImageURL;

    // Create file uploader instance
    $scope.uploader = new FileUploader({
      url: 'api/users/picture',
      alias: 'newProfilePicture'
    });

    // Set file uploader image filter
    $scope.uploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    // Called after the user selected a new picture file
    $scope.uploader.onAfterAddingFile = function (fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            $scope.imageURL = fileReaderEvent.target.result;
          }, 0);
        };
      }
    };

    // Called after the user has successfully uploaded a new picture
    $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
      // Show success message
      $scope.success = true;

      // Populate user object
      $scope.user = Authentication.user = response;

      // Clear upload buttons
      $scope.cancelUpload();
    };

    // Called after the user has failed to uploaded a new picture
    $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
      // Clear upload buttons
      $scope.cancelUpload();

      // Show error message
      $scope.error = response.message;
    };

    // Change user profile picture
    function uploadImage() {
      return new Promise(function (resolve, reject) {
        var image;
        var filesSelected = document.getElementById('dddd').files;
        console.log(filesSelected);
        if (filesSelected.length > 0) {
          var fileToLoad = filesSelected[0];
          var fileReader = new FileReader();
          fileReader.onload = function (fileLoadedEvent) {
            image = fileLoadedEvent.target.result;
            console.log(image);
            $http.post('api/uploadimage', { data: image }).then(function successCallback(response) {
              console.log(response);
              resolve(response.data.imageURL);
              // isUpload(true);
              // vm.isLoad = true;
            }, function errorCallback(response) {
              reject(response);
            });
          };

          fileReader.readAsDataURL(fileToLoad);
        }
      });
    }
    $scope.uploadProfilePicture = function () {
      // Clear messages
      uploadImage().then(function (data) {
        $scope.success = $scope.error = null;
        $scope.user.profileImageURL = data;
        $scope.oldImageURL = data;
        $scope.uploader.uploadAll();
      }, function (err) {
        console.log(err);
      });

      // Start upload
      // $scope.uploader.uploadAll();
    };

    // Cancel the upload process
    $scope.cancelUpload = function () {
      $scope.uploader.clearQueue();
      $scope.imageURL = $scope.oldImageURL;
    };
  }
]);
