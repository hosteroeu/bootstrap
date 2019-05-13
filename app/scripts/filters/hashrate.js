'use strict';

/**
 * @ngdoc function
 * @name menoetiusApp.filter:hashrate
 * @description
 * # Hashrate
 * Filter of the menoetiusApp
 */
angular.module('menoetiusApp')
  .filter('hashrate', function() {
    return function(input) {
      var output;

      switch (input.toString().length) {
        case 4:
        case 5:
        case 6:
          output = (parseInt(input) / 1000).toFixed(2) + ' KH/s';
          break;

        case 7:
        case 8:
        case 9:
          output = (parseInt(input) / 1000 / 1000).toFixed(2) + ' MH/s';
          break;

        default:
          //console.log(parseInt(input), input.toString().length);

          if (parseInt(input) === 0) {
            output = '-';
          } else {
            output = parseInt(input) + ' H/s';
          }

          break;
      }

      return output;
    };
  });
