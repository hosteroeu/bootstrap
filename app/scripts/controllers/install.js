'use strict';

/**
 * @ngdoc function
 * @name atlasApp.controller:InstallCtrl
 * @description
 * # InstallCtrl
 * Controller of the atlasApp
 */
angular.module('atlasApp')
  .controller('InstallCtrl', function ($scope) {
    var account = JSON.parse(localStorage.getItem('account'));
    //var profile = JSON.parse(localStorage.getItem('profile'));
    $scope.account = account;
  });
