'use strict';

/**
 * @ngdoc overview
 * @name menoetiusApp
 * @description
 * # menoetiusApp
 *
 * Main module of the application.
 */
angular
  .module('menoetiusApp', [
    'ngAnimate',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ui.router',
    'auth0.lock',
    'angular-jwt',
    'angular.filter',
    'angular-loading-bar',
    'ansiToHtml',
    'yaru22.angular-timeago',
    'datatables',
    'ngclipboard'
  ])
  .config(function($stateProvider, $urlRouterProvider, $sceDelegateProvider, $httpProvider, lockProvider, jwtOptionsProvider, cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;

    window.Raven.config('https://d9a8c0f13550478997ffd66aad57b277@sentry.io/1395940').install();

    lockProvider.init({
      clientID: 'E6Zeo9d6DEXfEeFyvBPeYw3tYdtYNVDP',
      domain: 'morion4000.auth0.com',
      options: {
        closable: false,
        languageDictionary: {
          title: 'Hostero Bootstrap'
        },
        theme: {
          logo: '/images/hostero_logo_black_square.png',
          primaryColor: '#28313B'
        }
      }
    });

    jwtOptionsProvider.config({
      tokenGetter: function() {
        return localStorage.getItem('token');
      },
      whiteListedDomains: ['localhost', 'api.hostero.eu', 'dashboard.hostero.eu', 'bootstrap.hostero.eu'],
      unauthenticatedRedirectPath: '/login'
    });

    $httpProvider.interceptors.push('jwtInterceptor');

    $urlRouterProvider.otherwise('/');

    $sceDelegateProvider.resourceUrlWhitelist([
      'self',
      'https://charts.webdollarminingpool.com/**'
    ]);

    $stateProvider
      .state('dashboard', {
        url: '/',
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardCtrl',
        controllerAs: 'dashboardCtrl',
        data: {
          requiresLogin: true
        }
      })
      .state('settings', {
        url: '/settings',
        templateUrl: 'views/settings.html',
        controller: 'SettingsCtrl',
        controllerAs: 'settingsCtrl',
        data: {
          requiresLogin: true
        }
      })
      .state('events', {
        url: '/events',
        templateUrl: 'views/events.html',
        controller: 'EventsCtrl',
        controllerAs: 'eventsCtrl',
        data: {
          requiresLogin: true
        }
      })
      .state('settings.auto_deploy', {
        url: '/auto_deploy',
        parent: 'settings',
        templateUrl: 'views/settings.auto_deploy.html'
      })
      .state('settings.dual_mining', {
        url: '/dual_mining',
        parent: 'settings',
        templateUrl: 'views/settings.dual_mining.html'
      })
      .state('nodes', {
        url: '/nodes',
        templateUrl: 'views/nodes.html',
        controller: 'NodesCtrl',
        controllerAs: 'nodesCtrl',
        data: {
          requiresLogin: true
        }
      })
      .state('new_node', {
        url: '/new_node/:host',
        templateUrl: 'views/nodes.new.html',
        controller: 'NodesNewCtrl',
        controllerAs: 'ctrl',
        data: {
          requiresLogin: true
        }
      })
      .state('node', {
        url: '/nodes/:node',
        templateUrl: 'views/node.html',
        controller: 'NodeCtrl',
        controllerAs: 'nodeCtrl',
        data: {
          requiresLogin: true
        }
      })
      .state('node.charts', {
        url: '/charts',
        parent: 'node',
        templateUrl: 'views/node.charts.html'
      })
      .state('node.logs', {
        url: '/logs',
        parent: 'node',
        templateUrl: 'views/node.logs.html'
      })
      .state('miner.events', {
        url: '/events',
        parent: 'miner',
        templateUrl: 'views/events.html'
      })
      .state('logs', {
        url: '/logs/:token',
        templateUrl: 'views/logs.html',
        controller: 'LogsCtrl',
        controllerAs: 'logsCtrl',
        data: {
          requiresLogin: false
        }
      })
      .state('install', {
        url: '/install',
        templateUrl: 'views/install_new.html',
        controller: 'InstallCtrl',
        controllerAs: 'installCtrl',
        data: {
          requiresLogin: false
        }
      })
      .state('hosts', {
        url: '/hosts',
        templateUrl: 'views/hosts.html',
        controller: 'HostsCtrl',
        controllerAs: 'hostsCtrl',
        data: {
          requiresLogin: true
        }
      })
      .state('host', {
        url: '/hosts/:host',
        templateUrl: 'views/host.html',
        controller: 'HostCtrl',
        controllerAs: 'hostCtrl',
        data: {
          requiresLogin: true
        }
      })
      .state('host.charts', {
        url: '/charts',
        templateUrl: 'views/host.charts.html'
      })
      .state('host.events', {
        url: '/events',
        templateUrl: 'views/events.html'
      })
      .state('account', {
        url: '/account',
        templateUrl: 'views/account.html',
        controller: 'AccountCtrl',
        controllerAs: 'accountCtrl',
        data: {
          requiresLogin: true
        }
      })
      .state('wallets', {
        url: '/wallets',
        templateUrl: 'views/wallets.html',
        controller: 'WalletsCtrl',
        controllerAs: 'ctrl',
        data: {
          requiresLogin: true
        }
      })
      .state('wallets.wallet', {
        parent: 'wallets',
        url: '/:wallet'
      })
      .state('wallets.miner', {
        parent: 'wallets.wallet',
        url: '/miner'
      })
      .state('billing', {
        url: '/billing',
        templateUrl: 'views/billing.html',
        controller: 'BillingCtrl',
        controllerAs: 'billingCtrl',
        data: {
          requiresLogin: true
        }
      })
      .state('billing.history', {
        parent: 'billing',
        url: '/history'
      })
      .state('billing.webdollar', {
        parent: 'billing',
        url: '/webdollar'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'loginCtrl'
      });
  })
  .run(function($rootScope, $state, $location, authService, authManager, lock, jwtHelper, DTDefaultOptions, accountsService) {
    lock.interceptHash();

    $rootScope.authService = authService;

    DTDefaultOptions.setLoadingTemplate('<p><center><img src="images/loading.gif"></center></p>');

    authService.registerAuthenticationListener();

    // Use the authManager from angular-jwt to check for
    // the user's authentication state when the page is
    // refreshed and maintain authentication
    authManager.checkAuthOnRefresh();

    // When a location change is detected
    $rootScope.$on('$locationChangeStart', function() {
      var token = localStorage.getItem('token');
      var location = $location.path();

      // allow http only on logs page
      if (window.location.hostname === 'bootstrap.hostero.eu' &&
        window.location.protocol === 'http:' &&
        location.indexOf('logs') === -1) {
        window.stop();
        window.location.href = 'https://bootstrap.hostero.eu';
        return;
      }

      if (window.gtag) {
        window.gtag('config', 'UA-128907941-2', {
          'page_path': location
        });
      }

      if (token) {
        if (!jwtHelper.isTokenExpired(token)) {
          authManager.authenticate();

          var account;

          try {
            account = JSON.parse(localStorage.getItem('account'));
          } catch (e) {
            console.error(e);
          }

          if (account) {
            accountsService.get({
              id: account.id
            }).$promise.then(function(_account) {
              localStorage.setItem('account', JSON.stringify(_account));

              $rootScope.global_account = _account;
            });
          }
        } else {
          localStorage.removeItem('token');

          $location.path('/login');
        }
      } else {
        if (location !== '/install' && location.indexOf('/logs/') === -1) {
          $location.path('/login');
        }
      }
    });

    // Listen for 401 unauthorized requests and redirect
    // the user to the login page
    authManager.redirectWhenUnauthenticated();
  });
