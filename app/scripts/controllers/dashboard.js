'use strict';

/**
 * @ngdoc function
 * @name atlasApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the atlasApp
 */
angular.module('atlasApp')
  .controller('DashboardCtrl', function($scope, accountsService, hostsService, minersService, logsService) {
    var account = JSON.parse(localStorage.getItem('account'));

    $scope.logs = [];
    $scope.show_wmp_chart = false;

    logsService.query().$promise.then(function(res) {
      res.forEach(function(log) {
        var extra_message = JSON.parse(log.extra_message) || {};
        var extra_message_curated = [];

        Object.keys(extra_message).forEach(function(key) {
          if (key !== 'id' && key !== 'status' && key !== 'deployed' && key !== 'miners') {
            return;
          }

          extra_message_curated.push(key + '=' + extra_message[key]);
        });

        log.extra_message_curated = extra_message_curated;

        $scope.logs.push(log);
      });
    });

    $scope.getIframeSrc = function(panelId, from) {
      if (!from) {
        from = 'now-1d';
      }

      return 'https://charts.webdollarminingpool.com/dashboard-solo/db/hostero-hosts?orgId=1&from=' + from + '&to=now&theme=light&panelId=' + panelId + '&var-account=' + account.name;
    };

    $scope.getIframeSrcAlt = function(panelId, from) {
      if (!from) {
        from = 'now-1d';
      }

      return 'https://charts.webdollarminingpool.com/dashboard-solo/db/hostero-miners-power?orgId=1&from=' + from + '&to=now&theme=light&panelId=' + panelId + '&var-account=' + account.name;
    };

    $scope.getIframeSrcAlt2 = function(panelId, address, from) {
      if (!from) {
        from = 'now-1d';
      }

      return 'https://charts.webdollarminingpool.com/dashboard-solo/db/wmp-miner-hash?orgId=1&from=' + from + '&to=now&panelId=' + panelId + '&theme=light&var-address=' + encodeURIComponent(address);
    };
  });
