# angular-colorize
AngularJS module to blend colors.

####Demo
http://sjeedandi.github.io/angular-colorize

####Installation

    $ bower install angular-colorize --save-dev


####Usage

    // js
    
    var app = module('app',['ngColorize']);
    
    app.controller('appController', ['$scope', 'ngColorizeService', function ($scope, ngColorizeService) {
      $scope.styleObject = {
        backgroundColor: ngColorizeService(45).rgba
      };
    }]);
    
    // html
    
    <div ng-controller="appController">
        <div ng-style="styleObject">
            <h1>Colorized Background</h1>
        </div>
    </div>
  
  
####Configuration
  
    app.config(['ngColorizeProvider', function (ngColorizeProvider) {
      ngColorizeProvider.set(options);
    }]);


####Options
    
    var options = {
        
        // The range
        range: {
          min: 0,
          max: 100,
        },
        
        // The colors you want to use and the threshold
        contrast: {
          light: '255,255,255',
          dark: '10,10,10',
          threshold: 0.52
        },
        
        // Array with colors to use
        colors: ['#f5f5f5', '#428bca', '#5cb85c', '#f0ad4e', '#d9534f', '#000000'],
        
        opacity: 1,
        
        // factor: 0.3
        // format: 'rgba',
      };

