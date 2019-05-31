'use strict';

/**
 * @ngdoc function
 * @name menoetiusApp.controller:NodesCtrl
 * @description
 * # NodesCtrl
 * Controller of the menoetiusApp
 */
angular.module('menoetiusApp')
  .controller('NodesCtrl', function($scope, $state, minersService, coinsService, hostsService, DTOptionsBuilder) {
    $scope.nodes = null;
    $scope.hosts = hostsService.query();
    $scope.filter = '';
    $scope.dt_options = DTOptionsBuilder.newOptions()
      .withDisplayLength(25)
      .withOption('retrieve', true);

    $scope.$watch('$viewContentLoaded', function() {
      setTimeout(function() {
        window.$('[data-toggle="tooltip"]').tooltip();
      }, 5000);
    });

    var getMiners = function() {
      minersService.query({
        mode: 'node'
      }).$promise.then(function(res) {
        $scope.nodes = res;
      });
    };

    var interval = setInterval(getMiners, 60 * 1000);

    getMiners();

    this.get_status_color = function(node) {
      var color = 'success';

      if (node.temporary) {
        color = '';
      }

      return color;
    };

    this.get_status_icon = function(node) {
      var icon;

      switch (node.status) {
        case 'started':
          icon = 'plug';
          break;

        case 'stopped':
          icon = 'power-off';
          break;
      }

      return icon;
    };

    this.redeploy = function(node) {
      /*
      var confirm = $mdDialog.confirm()
        .title('Do you want to re-deploy the miner?')
        .textContent('Re-deploying the miner takes several minutes and will delete the host and the miner.')
        .ariaLabel('Re-deploy')
        .targetEvent($event)
        .ok('Re-deploy')
        .cancel('Cancel');
      */

      minersService.remove({
        id: node.id
      });

      hostsService.remove({
        id: node.host_id
      });

      window.toastr.info('Re-deploying started... It will take several minutes');

      setTimeout(function() {
        if ($state.current.name === 'nodes') {
          $state.reload();
        } else {
          $state.go('nodes');
        }
      }, 2000);
    };

    this.remove = function(node) {
      /*
      var confirm = $mdDialog.confirm()
        .title('Do you want to remove the miner?')
        .textContent('The hosts will not be deleted. If you want to stop using the host, you need to delete it as well.')
        .ariaLabel('Remove')
        .targetEvent($event)
        .ok('Remove')
        .cancel('Cancel');
      */

      minersService.remove({
        id: node.id
      }).$promise.then(function() {
        if ($state.current.name === 'nodes') {
          $state.reload();
        } else {
          $state.go('nodes');
        }

        if (node.Host && node.Host.user_id === 'shared') {
          return;
        }

        hostsService.update({
            id: node.host_id
          }, {
            deployed: '0'
          }).$promise
          .then(console.log)
          .catch(console.error);
      });
    };

    $scope.$on('$destroy', function() {
      clearInterval(interval);
    });
  });
