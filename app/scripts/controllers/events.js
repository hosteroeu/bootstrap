'use strict';

/**
 * @ngdoc function
 * @name atlasApp.controller:EventsCtrl
 * @description
 * # EventsCtrl
 * Controller of the atlasApp
 */
angular.module('atlasApp')
  .controller('EventsCtrl', function($scope, logsService) {
    logsService.query().$promise.then(function(data) {
      $scope.events = data;
    });
  });
