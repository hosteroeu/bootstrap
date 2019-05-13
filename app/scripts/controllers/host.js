'use strict';

/**
 * @ngdoc function
 * @name atlasApp.controller:HostCtrl
 * @description
 * # HostCtrl
 * Controller of the atlasApp
 */
angular.module('atlasApp')
  .controller('HostCtrl', function($scope, $state, hostsService) {
    $scope.host = null;
    $scope.state = $state;

    hostsService.query({
      id: $state.params.host,
      controller: 'events'
    }).$promise.then(function(data) {
      $scope.events = data;
    });

    /*
    var socket;

    hostsService.get({
      id: $state.params.host,
      controller: 'stats'
    }).$promise.then(function(data) {
      socket = new WebSocket(data.ws);

      socket.onopen = function(event) {
        console.log(event);
      };

      socket.onmessage = function(event) {
        var data = JSON.parse(event.data);

        if (data.length) {
          var cpu_total_usage = (data[0].cpu.usage.system + data[0].cpu.usage.user) / data[0].cpu.usage.total * 100;
          var cpu_usage = cpu_total_usage / (data[0].cpu.usage.per_cpu_usage.length * 100) * 100;

          $scope.cpu_usage = cpu_usage.toFixed(2);
          $scope.$apply();
        }
      };
    });

    $scope.$on("$destroy", function() {
      socket.close();
    });
    */

    hostsService.get({
      id: $state.params.host
    }).$promise.then(function(res) {
      $scope.host = res;
    });

    $scope.getIframeSrc = function(panelId, host) {
      return 'https://charts.webdollarminingpool.com/dashboard-solo/db/hostero-hosts?orgId=1&from=now-1d&to=now&theme=light&panelId=' + panelId + '&var-host=' + host;
    };
  });
