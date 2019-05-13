'use strict';

/**
 * @ngdoc function
 * @name menoetiusApp.controller:WalletsCtrl
 * @description
 * # WalletsCtrl
 * Controller of the menoetiusApp
 */
angular.module('menoetiusApp')
  .controller('WalletsCtrl', function($scope, $state, accountsService) {
    var account = JSON.parse(localStorage.getItem('account'));
    var _this = this;

    _this.state = $state;

    accountsService.get({
      id: account.id
    }).$promise.then(function(_account) {
      localStorage.setItem('account', JSON.stringify(_account));

      _this.wallets = _account;

      var webdollar_password = [];

      if (account.password_webdollar) {
        webdollar_password = _account.password_webdollar.split('|');
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

    _this.get_coin = function(internal_name) {
      var coins = $scope.global_coins;
      var coin;
      var docker_image_name;
      var docker_image_version;
      var url = 'https://hub.docker.com/r/morion4000/';

      for (var i=0; i<coins.length; i++) {
        if (coins[i].internal_name === internal_name) {
          coin = coins[i];
          break;
        }
      }

      if (coin && coin.docker_image) {
        try {
          docker_image_name = coin.docker_image.split('/')[1].split(':')[0];
          docker_image_version = coin.docker_image.split('/')[1].split(':')[1];
        } catch(e) {
          console.error(e);
        }

        url += docker_image_name;
      }

      coin.docker_url = url;

      return coin;
    };

    _this.update = function() {
      if (_this.wallets.public_key_webdollar && _this.wallets.private_key_webdollar) {
        _this.wallets.password_webdollar = _this.wallets.public_key_webdollar +
          '|' + _this.wallets.private_key_webdollar;
      }

      accountsService.update({
        id: account.id
      }, {
        wallet_webdollar: _this.wallets.wallet_webdollar,
        mining_pool_url_webdollar: _this.wallets.mining_pool_url_webdollar,
        password_webdollar: _this.wallets.password_webdollar,
        miner_webdollar: _this.wallets.miner_webdollar,
        wallet_nerva: _this.wallets.wallet_nerva,
        wallet_webchain: _this.wallets.wallet_webchain,
        password_webchain: _this.wallets.password_webchain,
        mining_pool_url_webchain: _this.wallets.mining_pool_url_webchain,
        wallet_veruscoin: _this.wallets.wallet_veruscoin,
        password_veruscoin: _this.wallets.password_veruscoin,
        mining_pool_url_veruscoin: _this.wallets.mining_pool_url_veruscoin,
        wallet_credits: _this.wallets.wallet_credits,
        password_credits: _this.wallets.password_credits,
        mining_pool_url_credits: _this.wallets.mining_pool_url_credits,
        wallet_myriad: _this.wallets.wallet_myriad,
        password_myriad: _this.wallets.password_myriad,
        mining_pool_url_myriad: _this.wallets.mining_pool_url_myriad,
        wallet_yenten: _this.wallets.wallet_yenten,
        password_yenten: _this.wallets.password_yenten,
        mining_pool_url_yenten: _this.wallets.mining_pool_url_yenten,
        wallet_globalboost: _this.wallets.wallet_globalboost,
        password_globalboost: _this.wallets.password_globalboost,
        mining_pool_url_globalboost: _this.wallets.mining_pool_url_globalboost,
        wallet_elicoin: _this.wallets.wallet_elicoin,
        password_elicoin: _this.wallets.password_elicoin,
        mining_pool_url_elicoin: _this.wallets.mining_pool_url_elicoin,
        wallet_xcash: _this.wallets.wallet_xcash,
        password_xcash: _this.wallets.password_xcash,
        mining_pool_url_xcash: _this.wallets.mining_pool_url_xcash,
      }).$promise.then(function() {
        window.toastr.success('Wallet was updated');
      });
    };
  });
