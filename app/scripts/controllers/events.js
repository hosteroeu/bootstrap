'use strict';

/**
 * @ngdoc function
 * @name menoetiusApp.controller:EventsCtrl
 * @description
 * # EventsCtrl
 * Controller of the menoetiusApp
 */
angular.module('menoetiusApp')
  .controller('EventsCtrl', function($scope, logsService) {
    logsService.query().$promise.then(function(data) {
      $scope.events = data;
    });
  });
