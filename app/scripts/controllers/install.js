'use strict';

/**
 * @ngdoc function
 * @name menoetiusApp.controller:InstallCtrl
 * @description
 * # InstallCtrl
 * Controller of the menoetiusApp
 */
angular.module('menoetiusApp')
  .controller('InstallCtrl', function ($scope) {
    var account = JSON.parse(localStorage.getItem('account'));
    //var profile = JSON.parse(localStorage.getItem('profile'));
    $scope.account = account;
  });
