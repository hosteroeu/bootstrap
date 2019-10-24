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

    this.get_name = function(miner) {
      var name = 'node#' + miner.id;

      if (miner.name.indexOf('node-') === -1) {
        name = miner.name;
      }

      return name;
    };

    this.redeploy = function(node) {
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

    this.logs = function(node) {
      window.toastr.info('Getting logs for node ' + node.name);

      minersService.get({
        id: node.id,
        controller: 'logs'
      }).$promise.then(function(data) {
        if (data.ws) {
          var token = data.ws.split('token=');

          if (token && token.length > 1 && token[1]) {
            window.open('http://bootstrap.hostero.eu/#!/logs/' + token[1]);
          } else {
            window.toastr.error('Logs can not be retrieved at this time');
          }
        }
      });
    };

    this.remove = function(node) {
      if (window.confirm('Do you want to delete ' + node.name + '?')) {
        minersService.remove({
          id: node.id
        }).$promise.then(function() {
          window.toastr.success('Node has been deleted');

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
      }
    };

    $scope.$on('$destroy', function() {
      clearInterval(interval);
    });
  });
