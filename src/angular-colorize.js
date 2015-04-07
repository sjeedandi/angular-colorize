(function () {
  'use strict';

  angular.module('sdColors', [])
    
    .provider('sdColors', function () {
      
      var options = {
        range: {
          min: 0,
          max: 100,
        },
        contrast: {
          light: '255,255,255',
          dark: '1,1,1',
          threshold: 0.42
        },
        colors: ['#428bca', '#5cb85c', '#f0ad4e', '#d9534f'],
        factor: 0.3,
        opacity: 1,
        format: 'rgba',
      };
      
      return {
        set: function (value) {
          angular.extend(options, value);
        },
        $get: function () {
          return options;
        }
      };
    })

    .service('sdColorsService', function (sdColors) {
      
      var options = sdColors;

      return function (value) {
        
        
        /**
         * @method factor
         * @return {Number}
         */
        var factor = function (value) {
          
          var f = value / 100;
          
          return f;
        
        };
        

        /**
         * Calculates background/color based on the remaining time untill the deadline
         * @method getColor
         * @param {Boolean} background Fill background of element
         * @param {Boolean} textColor Color text of element
         * return {Color}
         */
        var getColor =  function (value) {
          
          var a, b, p, color, obj,
          f = 1 - factor(value);
          
          switch(true) {
            case (f < 0.25):
              a = 0;
              b = 1;
              p =  f / 0.25;
              break;
            case (f >= 0.25 && f < 0.5):
              a = 1;
              b = 2;
              p = (f - 0.25) / 0.25;
              break;
            case (f >= 0.5 && f < 0.75):
              a = 2;
              b = 3;
              p = (f - 0.5) / 0.25;
              break;
            case (f >= 0.75 && f < 1):
              a = 3;
              b = 4;
              p = (f - 0.75) / 0.25;
              break;
            case (f >= 1):
              a = 4;
              b = 5;
              p = (f-1)/f;
              break;
            default:
              a = 5;
              b = 5;
              p = 1;
              break;
          }

          obj = mix(options.colors[a], options.colors[b], 1 - p);
          
          return {
            0: obj,
            rgba: 'rgba(' + obj.join(',') + ',' + options.opacity + ')',
            rgb:  'rgb(' + obj.join(',') + ')',
            contrast: 'rgb(' + contrast(obj, options.contrast) + ')'
          };

        };


        var contrast = function (color, options) {

          var light = options.light;
          var dark = options.dark;
          
          // Figure out which is actually light and dark!
          if (luma(dark) > luma(light)) {
              var t = light;
              light = dark;
              dark = t;
          }
          // Return contrasting color
          if (luma(color) < options.threshold) {
              return light;
          } else {
              return dark;
          }

        };


        var luma = function (rgb) {
            
          var r = rgb[0] / 255,
              g = rgb[1] / 255,
              b = rgb[2] / 255;
          
          r = (r <= 0.03928) ? r / 12.92 : Math.pow(((r + 0.055) / 1.055), 2.4);
          g = (g <= 0.03928) ? g / 12.92 : Math.pow(((g + 0.055) / 1.055), 2.4);
          b = (b <= 0.03928) ? b / 12.92 : Math.pow(((b + 0.055) / 1.055), 2.4);
          
          return 0.2126 * r + 0.7152 * g + 0.0722 * b;

        };


        /**
         * Mix two RGB colors
         * @method mix
         * @param  {Color} a [description]
         * @param  {Color} b [description]
         * @param  {Number} f Factor
         * @return {Color}
         */
        var mix = function (a, b, f) {
          
          var rgb = [];
          
          a = convert(a);
          b = convert(b);
          
          rgb.push( Math.ceil(( ( a.red   * f) + (b.red   * (1 - f)) )) );
          rgb.push( Math.ceil(( ( a.green * f) + (b.green * (1 - f)) )) );
          rgb.push( Math.ceil(( ( a.blue  * f) + (b.blue  * (1 - f)) )) );
          
          return rgb;  
        
        };
        

        /**
         * Convert hexColor to RGB
         * @method convert
         * @param  {Color} hex
         * @return {Color}
         */
        var convert = function (hex) {
          
          var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
          
          hex = hex.replace(shorthandRegex, function(m, r, g, b) {
              return r + r + g + g + b + b;
          });
          
          var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
          
          return result ? {
              red: parseInt(result[1], 16),
              green: parseInt(result[2], 16),
              blue: parseInt(result[3], 16)
          } : null;

        };

        return value ? getColor(value) : null;
      
      };

    });

})();