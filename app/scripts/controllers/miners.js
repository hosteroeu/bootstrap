'use strict';

/**
 * @ngdoc function
 * @name menoetiusApp.controller:MinersCtrl
 * @description
 * # MinersCtrl
 * Controller of the menoetiusApp
 */
angular.module('menoetiusApp')
  .controller('MinersCtrl', function($scope, $state, minersService, coinsService, hostsService, DTOptionsBuilder) {
    $scope.miners = null;
    $scope.hosts = hostsService.query();
    $scope.miners_stopped = [];
    $scope.miners_running = [];
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
      minersService.query().$promise.then(function(res) {
        // TODO: Link miner to coin in DB (build relation)
        coinsService.query().$promise.then(function(coins) {
          var yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);

          $scope.miners = [];

          res.forEach(function(miner) {
            var updated = Date.parse(miner.updated_at);

            if (miner.status === 'stopped' && updated < yesterday.getTime()) {
              return;
            }

            miner.reward_24h_eur = 0;

            // TODO: Use benchmarks instead of actual miner power?
            if (miner.power) {
              var reward = 0;
              var coin;

              coins.forEach(function(_coin) {
                if (_coin.internal_name === miner.coin) {
                  coin = _coin;
                }
              });

              // DOMINANCE = USER_HASHES / GLOBAL_HASHES / * 100
              // REWARD_PER_DAY = BLOCK_REWARD * 3600 * 24 / BLOCK_TIME * DOMINANCE / 100
              var dominance = miner.power / coin.network_hashrate / 100;
              var reward_coins = coin.block_reward * 3600 * 24 / coin.block_time * dominance * 100;

              reward = coin.price_eur * reward_coins;

              if (coin.hybrid) {
                reward = reward * coin.hybrid_percentage_pow / 100;
              }

              miner.reward_24h_eur = reward.toFixed(2);
            }

            $scope.miners.push(miner);
          });

          $scope.miners.forEach(function(miner) {
            if (miner.status === 'stopped') {
              $scope.miners_stopped.push(miner);
            } else {
              $scope.miners_running.push(miner);
            }
          });
        });
      });
    };

    var interval = setInterval(getMiners, 60 * 1000);

    getMiners();

    this.get_status_color = function(miner) {
      var color = 'success';

      if (miner.temporary) {
        color = '';
      }

      return color;
    };

    this.get_status_icon = function(miner) {
      var icon;

      switch (miner.status) {
        case 'started':
          icon = 'plug';
          break;

        case 'stopped':
          icon = 'power-off';
          break;
      }

      return icon;
    };

    this.open_url = function(instance) {
      var account = JSON.parse(localStorage.getItem('account'));

      window.open('//' + instance.name + '.' + account.name + '.wordpress.hoste.ro');
    };

    this.delete_all = function() {
      /*
      var confirm = $mdDialog.confirm()
        .title('Do you want to re-deploy all the miners?')
        .textContent('Re-deploying the miners takes several minutes and will delete all your hosts and miners.')
        .ariaLabel('Redeploy')
        .targetEvent($event)
        .ok('Re-deploy')
        .cancel('Cancel');
      */

      $scope.miners.forEach(function(miner) {
        if (!miner.temporary) {
          minersService.remove({
            id: miner.id
          });
        }
      });

      setTimeout(function() {
        window.toastr.info('Deleting all the miners...');
        $state.reload();
      }, 2000);
    };

    this.redeploy = function(miner) {
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
        id: miner.id
      });

      hostsService.remove({
        id: miner.host_id
      });

      window.toastr.info('Re-deploying started... It will take several minutes');

      setTimeout(function() {
        if ($state.current.name === 'miners') {
          $state.reload();
        } else {
          $state.go('miners');
        }
      }, 2000);
    };

    this.remove = function(miner) {
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
        id: miner.id
      }).$promise.then(function() {
        if ($state.current.name === 'miners') {
          $state.reload();
        } else {
          $state.go('miners');
        }

        if (miner.Host && miner.Host.user_id === 'shared') {
          return;
        }

        hostsService.update({
            id: miner.host_id
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
