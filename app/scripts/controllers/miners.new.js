'use strict';

/**
 * @ngdoc function
 * @name menoetiusApp.controller:MinersNewCtrl
 * @description
 * # MinersNewCtrl
 * Controller of the menoetiusApp
 */
angular.module('menoetiusApp')
  .controller('MinersNewCtrl', function($state, minersService, hostsService, accountsService) {
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
    _this.threads = 0;

    hostsService.query().$promise.then(function(hosts) {
      _this.hosts = hosts;

      if ($state.params.host) {
        _this.selected_host = getHostById(_this.hosts, $state.params.host);
        _this.selected_host_id = $state.params.host;
        _this.threads = parseInt(_this.selected_host.cpu_count);
      }
    });

    _this.update_threads = function() {
      _this.selected_host = getHostById(_this.hosts, _this.selected_host_id);

      _this.threads = _this.selected_host ? parseInt(_this.selected_host.cpu_count) : 0;
    };

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

      if (account.miner_webdollar) {
        _this.wallets.miner_webdollar = account.miner_webdollar;
      } else {
        _this.wallets.miner_webdollar = 'legacy';
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
        coin: _this.wallets.auto_deploy_coin,
        status: 'stopped',
        deployed: '2',
        threads: _this.threads,
        processor: _this.wallets.default_processor,
        host_id: _this.selected_host.id
      };

      switch (_this.wallets.auto_deploy_coin) {
        case 'webdollar':
          if (!_this.wallets.mining_pool_url_webdollar || !_this.wallets.wallet_webdollar) {
            window.toastr.warning('Please enter WebDollar information');
            return;
          }

          new_miner.mining_pool_url = _this.wallets.mining_pool_url_webdollar;
          new_miner.wallet = _this.wallets.wallet_webdollar;
          new_miner.password = _this.wallets.public_key_webdollar + '|' + _this.wallets.private_key_webdollar;
          new_miner.type = _this.wallets.miner_webdollar;
          break;

        case 'nerva':
          if (!_this.wallets.wallet_nerva) {
            window.toastr.warning('Please enter Nerva information');
            return;
          }

          new_miner.wallet = _this.wallets.wallet_nerva;
          break;

        case 'webchain':
          if (!_this.wallets.wallet_webchain || !_this.wallets.password_webchain || !_this.wallets.mining_pool_url_webchain) {
            window.toastr.warning('Please enter WebChain information');
            return;
          }

          new_miner.wallet = _this.wallets.wallet_webchain;
          new_miner.password = _this.wallets.password_webchain;
          new_miner.mining_pool_url = _this.wallets.mining_pool_url_webchain;
          break;

        case 'veruscoin':
          if (!_this.wallets.wallet_veruscoin || !_this.wallets.password_veruscoin || !_this.wallets.mining_pool_url_veruscoin) {
            window.toastr.warning('Please enter VerusCoin information');
            return;
          }

          new_miner.wallet = _this.wallets.wallet_veruscoin;
          new_miner.password = _this.wallets.password_veruscoin;
          new_miner.mining_pool_url = _this.wallets.mining_pool_url_veruscoin;
          break;

        case 'credits':
          if (!_this.wallets.wallet_credits || !_this.wallets.password_credits || !_this.wallets.mining_pool_url_credits) {
            window.toastr.warning('Please enter Credits information');
            return;
          }

          new_miner.wallet = _this.wallets.wallet_credits;
          new_miner.password = _this.wallets.password_credits;
          new_miner.mining_pool_url = _this.wallets.mining_pool_url_credits;
          break;

        case 'myriad':
          if (!_this.wallets.wallet_myriad || !_this.wallets.mining_pool_url_myriad) {
            window.toastr.warning('Please enter Myriad information');
            return;
          }

          new_miner.wallet = _this.wallets.wallet_myriad;
          new_miner.password = _this.wallets.password_myriad;
          new_miner.mining_pool_url = _this.wallets.mining_pool_url_myriad;
          break;

        case 'yenten':
          if (!_this.wallets.wallet_yenten || !_this.wallets.mining_pool_url_yenten) {
            window.toastr.warning('Please enter Yenten information');
            return;
          }

          new_miner.wallet = _this.wallets.wallet_yenten;
          new_miner.password = _this.wallets.password_yenten;
          new_miner.mining_pool_url = _this.wallets.mining_pool_url_yenten;
          break;

        case 'globalboost':
          if (!_this.wallets.wallet_globalboost || !_this.wallets.mining_pool_url_globalboost) {
            window.toastr.warning('Please enter GlobalBoost-Y information');
            return;
          }

          new_miner.wallet = _this.wallets.wallet_globalboost;
          new_miner.password = _this.wallets.password_globalboost;
          new_miner.mining_pool_url = _this.wallets.mining_pool_url_globalboost;
          break;

        case 'elicoin':
          if (!_this.wallets.wallet_elicoin || !_this.wallets.mining_pool_url_elicoin) {
            window.toastr.warning('Please enter Elicoin information');
            return;
          }

          new_miner.wallet = _this.wallets.wallet_elicoin;
          new_miner.password = _this.wallets.password_elicoin;
          new_miner.mining_pool_url = _this.wallets.mining_pool_url_elicoin;
          break;

        case 'xcash':
          if (!_this.wallets.wallet_xcash || !_this.wallets.mining_pool_url_xcash) {
            window.toastr.warning('Please enter X-Cash information');
            return;
          }

          new_miner.wallet = _this.wallets.wallet_xcash;
          new_miner.password = _this.wallets.password_xcash;
          new_miner.mining_pool_url = _this.wallets.mining_pool_url_xcash;
          break;
      }

      if (_this.selected_host.deployed !== '0') {
        window.toastr.error('Device is already deployed');
        return;
      }

      minersService.save({}, new_miner).$promise.then(function() {
        hostsService.update({
          id: _this.selected_host.id
        }, {
          deployed: '2'
        });

        window.toastr.success('Miner was deployed');

        $state.go('miners');
      });
    };
  });
