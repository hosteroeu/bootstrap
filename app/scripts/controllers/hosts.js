'use strict';

/**
 * @ngdoc function
 * @name menoetiusApp.controller:HostsCtrl
 * @description
 * # HostsCtrl
 * Controller of the menoetiusApp
 */
angular.module('menoetiusApp')
  .controller('HostsCtrl', function($scope, $state, hostsService, minersService, DTOptionsBuilder) {
    $scope.miners = minersService.query();
    $scope.hosts = null;
    $scope.filter = '';
    $scope.dt_options = DTOptionsBuilder.newOptions()
      .withDisplayLength(25)
      .withOption('retrieve', true);

    var getHosts = function () {
      hostsService.query().$promise.then(function(res) {
        var yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        $scope.hosts = [];

        res.forEach(function(host) {
          var updated = Date.parse(host.updated_at);

          if (host.status === 'stopped' && updated < yesterday.getTime()) {
            return;
          }

          if (host.user_id === 'shared') {
            return;
          }

          $scope.hosts.push(host);
        });
      });
    };

    var interval = setInterval(getHosts, 60 * 1000);

    getHosts();

    this.get_status_icon = function(status) {
      switch (status) {
        case 'started':
          return 'cloud';

        case 'stopped':
          return 'cloud_off';
      }
    };

    this.redeploy_all = function() {
      if (window.confirm('Do you want to redeploy all devices?')) {
        $scope.hosts.forEach(function(host) {
          hostsService.remove({
            id: host.id
          });
        });

        $scope.miners.forEach(function(miner) {
          minersService.remove({
            id: miner.id
          });
        });

        setTimeout(function() {
          window.toastr.info('Deleting all the devices and miners...');
          $state.reload();
        }, 2000);
      }
    };

    this.redeploy = function(host) {
      if (window.confirm('Do you want to redeploy ' + host.name + '?')) {
        hostsService.remove({
            id: host.id
          }).$promise
          .then(function() {
            window.toastr.success('Device redeployed. It will appear shortly in your account');

            if ($state.current.name === 'hosts') {
              $state.reload();
            } else {
              $state.go('hosts');
            }
          })
          .catch(console.error);
      }
    };

    $scope.$on('$destroy', function() {
      clearInterval(interval);
    });
  });
