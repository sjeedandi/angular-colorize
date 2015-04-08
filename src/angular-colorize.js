(function () {
  'use strict';

  angular.module('ngColorize', [])
    
    .provider('ngColorize', function () {
      
      var options = {
        range: {
          min: 0,
          max: 100,
        },
        contrast: {
          light: '255,255,255',
          dark: '10,10,10',
          threshold: 0.52
        },
        colors: ['#f5f5f5', '#428bca', '#5cb85c', '#f0ad4e', '#d9534f', '#000000'], // '#C5FC8F','#5CCDE4', '#F8D164', '#DC3033', '#092F74',
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

    .service('ngColorizeService', function (ngColorize) {
      
      var options = ngColorize;

      return function (value) {
        
        
        /**
         * @method factor
         * @return {Number}
         */
        var factor = function (value, range) {
          
          var f = value / range;
          
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
          
          // Get the range 
          var range = options.range.max - options.range.min,  
          // Get the number of divisions
          divisions = options.colors.length - 1,
          // Get the length of one step
          step  = range / divisions,
          // Calculate the factor
          f = 1 - factor(value, range),
          // The ratio between the colors a and b 
          p =  1 - ((value % step) * divisions) / 100,
          // The index of the first color
          index = Math.floor(value/step),
          // The start color
          a = options.colors[index],
          // The end color (or last color when the first color is the last)
          b = options.colors[index+1] || options.colors[index],
          // Mix the colors
          obj = mix(a,b, p);
          
          return {
            0: obj,
            rgba: 'rgba(' + obj.join(',') + ',' + options.opacity + ')',
            rgb:  'rgb(' + obj.join(',') + ')',
            contrast: 'rgb(' + contrast(obj, options.contrast) + ')'
          };

        };


        /**
         * @method contrast
         * @param  {Color} color
         * @param  {Object} options
         * @return {Color}
         */
        var contrast = function (color, options) {

          var light = options.light;
          var dark = options.dark;
          
          // Figure out which is actually light and dark!
          if (luma(dark) > luma(light)) {
              var tmp = light;
              light = dark;
              dark = tmp;
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
         * @return {Color} rgb
         */
        var convert = function (hex) {
          
          var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
          
          hex = hex.replace(shorthandRegex, function (m, r, g, b) {
            return r + r + g + g + b + b;
          });
          
          var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
          
          return result ? {
            red: parseInt(result[1], 16),
            green: parseInt(result[2], 16),
            blue: parseInt(result[3], 16)
          } : null;

        };

        return value ? getColor(parseInt(value)) : null;
      
      };

    });

})();