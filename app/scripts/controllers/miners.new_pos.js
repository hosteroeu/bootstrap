'use strict';

/**
 * @ngdoc function
 * @name menoetiusApp.controller:MinersNewPOSCtrl
 * @description
 * # MinersNewPOSCtrl
 * Controller of the menoetiusApp
 */
angular.module('menoetiusApp')
  .controller('MinersNewPOSCtrl', function($state, minersService, hostsService, accountsService) {
    var account = JSON.parse(localStorage.getItem('account'));
    var _this = this;
    var getHostById = function(hosts, id) {
      var host = null;

      for (var i = 0, l = hosts.length; i < l; i++) {
        if (parseInt(hosts[i].id) === parseInt(id)) {
          host = hosts[i];

          break;
        }
      }

      return host;
    };

    _this.selected_host = null;
    _this.selected_host_id = null;

    minersService.query().$promise.then(function(res) {
      var already_deployed = false;

      res.forEach(function(miner) {
        // Assume miners with threads -100 (POS only) are POS miners
        if (miner.threads === '-100') {
          already_deployed = true;
        }
      });

      if (already_deployed) {
        window.toastr.error('Only one WebDollar POS miner allowed per account');

        $state.go('miners');
      }
    });

    hostsService.query().$promise.then(function(hosts) {
      _this.hosts = hosts;

      if ($state.params.host) {
        _this.selected_host = getHostById(_this.hosts, $state.params.host);
        _this.selected_host_id = $state.params.host;
      }
    });

    accountsService.get({
      id: account.id
    }).$promise.then(function(account) {
      var webdollar_password = [];

      _this.wallets = account;

      if (account.password_webdollar) {
        webdollar_password = account.password_webdollar.split('|');
      }

      if (webdollar_password.length === 2) {
        _this.wallets.public_key_webdollar = webdollar_password[0];
        _this.wallets.private_key_webdollar = webdollar_password[1];
      }
    });

    _this.deploy = function() {
      if (!_this.selected_host) {
        window.toastr.warning('Please select a Device');
        return;
      }

      var name = 'miner-' + _this.selected_host.id;
      var new_miner = {
        name: name,
        coin: 'webdollar',
        status: 'stopped',
        deployed: '2',
        threads: -100,
        processor: _this.wallets.default_processor,
        host_id: _this.selected_host.id
      };

      if (!_this.wallets.mining_pool_url_webdollar || !_this.wallets.wallet_webdollar || !_this.wallets.public_key_webdollar || !_this.wallets.private_key_webdollar) {
        window.toastr.warning('Please enter WebDollar wallet');
        return;
      }

      new_miner.mining_pool_url = _this.wallets.mining_pool_url_webdollar;
      new_miner.wallet = _this.wallets.wallet_webdollar;
      new_miner.password = _this.wallets.public_key_webdollar + '|' + _this.wallets.private_key_webdollar;

      minersService.save({}, new_miner).$promise.then(function() {
        window.toastr.success('Miner was deployed');

        $state.go('miners');
      });
    };
  });
