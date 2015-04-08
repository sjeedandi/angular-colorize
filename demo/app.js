angular.module('app', ['ng','ngColorize'])
  .controller('ngColorizeController', function ($scope, ngColorize, ngColorizeService) {
    
    
    $scope.options = ngColorize;

    var getStyleObject = function (value) {
      $scope.styleObject = {
        backgroundColor: ngColorizeService(value).rgba,
        color: ngColorizeService(value).contrast,
      }
    };

    $scope.range = {
      min: 0,
      max: 100,
      value: 25
    };

    $scope.$watch('range.value', getStyleObject);
    
    // getStyleObject($scope.range.value);

  });