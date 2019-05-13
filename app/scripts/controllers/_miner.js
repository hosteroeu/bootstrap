'use strict';

/**
 * @ngdoc function
 * @name menoetiusApp.controller:MinerCtrl
 * @description
 * # MinerCtrl
 * Controller of the menoetiusApp
 */
angular.module('menoetiusApp')
  .controller('MinerCtrl', function($scope, $state, minersService) {
    $scope.miner = null;

    function set_token() {
      minersService.get({
        id: $state.params.miner,
        controller: 'logs'
      }).$promise.then(function(data) {
        if (data.ws) {
          var token = data.ws.split('token=');
          $scope.logs_token = token[1];
        }
      });
    }

    minersService.get({
      id: $state.params.miner
    }).$promise.then(function(res) {
      $scope.miner = res;
    });

    $scope.state = $state;

    set_token();

    // The token expires, need to get it again
    setInterval(function() {
      set_token();
    }, 60 * 1000);

    minersService.query({
      id: $state.params.miner,
      controller: 'events'
    }).$promise.then(function(data) {
      $scope.events = data;
    });

    /*
    var socket;

    minersService.get({
      id: $state.params.miner,
      controller: 'stats'
    }).$promise.then(function(data) {
      socket = new WebSocket(data.ws);

      socket.onopen = function(event) {
        console.log(event);
      };

      socket.onmessage = function(event) {
        var data = JSON.parse(event.data);

        if (data.length) {
          var cpu_usage = (data[0].cpu.usage.system + data[0].cpu.usage.user) / data[0].cpu.usage.total * 100;

          $scope.cpu_usage = cpu_usage.toFixed(2);
          $scope.$apply();
        }
      };
    });

    $scope.$on("$destroy", function() {
      socket.close();
    });
    */

    $scope.getIframeSrc = function(panelId, address) {
      return 'https://charts.webdollarminingpool.com/dashboard-solo/db/wmp-miner-hash?orgId=1&from=now-1d&to=now&panelId=' + panelId + '&theme=light&var-address=' + encodeURIComponent(address);
    };

    $scope.getIframeSrcAlt = function(panelId, miner) {
      return 'https://charts.webdollarminingpool.com/dashboard-solo/db/hostero-miners-power?orgId=1&from=now-1d&to=now&panelId=' + panelId + '&theme=light&var-miner=' + miner;
    };

    $scope.getHref = function(address) {
      return 'https://www.webdscan.io/address/' + encodeURIComponent(address);
    };
  });
