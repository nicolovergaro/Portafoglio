// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','ionic-datepicker','ionic-timepicker'])


.run(function($ionicPlatform, $rootScope, $state) {
  $ionicPlatform.ready(function() {



    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      // cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.overlaysWebView(false);
      statusBar.hide();
      StatusBar.styleDefault();
    }
  });


console.log(localStorage.getItem("username"), localStorage.getItem("password"));

// // console.log(sharedProperties.getIdUtente());
//   if (localStorage.getItem("id_utente") == null) {
//     console.log("login")
      // $state.go('app.login')
    // }else {
    //   console.log("profilo")
    //   $state.go('app.profilo')
    // }

})

.service('sharedProperties', function($location, $state) {
        var id_utente, nome, cognome, saldo;

        return {
            getIdUtente: function () {
                if(id_utente == undefined)
                // $state.go('app.login');
                  $location.path('app/login');
                else
                  return id_utente;
            },
            getNome: function () {
                return nome;
            },
            getCognome: function () {
                return cognome;
            },
            getSaldo: function () {
                return saldo;
            },
            setIdUtente: function(value) {
                id_utente = value;
            },
            setNome: function(value) {
                nome = value;
            },
            setCognome: function(value) {
                cognome = value;
            },
            setSaldo: function(value) {
                saldo = value;
            }
        };
    })

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider


  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      }
    }
  })




    .state('app.profilo', {
        url: '/profilo',
        views: {
          'menuContent': {
            templateUrl: 'templates/profilo.html',
            controller: 'ProfiloCtrl'
          }
        }
      })

      .state('app.tabs', {
        url: '/tabs',
        views: {
          'menuContent': {
            templateUrl: 'templates/tabs.html'

          }
        }
      })



    .state('app.tabs.cronologiaEntrate', {
      url: '/cronologiaEntrate',
      views: {
        'tabs-cronologiaEntrate': {
          templateUrl: 'templates/cronologiaEntrate.html',
          controller: 'CronologiaEntrateCtrl'
        }
      }
    })

    .state('app.tabs.cronologiaUscite', {
        url: '/cronologiaUscite',
        views: {
          'tabs-cronologiaUscite': {
            templateUrl: 'templates/cronologiaUscite.html',
            controller: 'CronologiaUsciteCtrl'
          }
        }
      })


      .state('app.tabs.cronologiaEU', {
        url: '/cronologiaEU',
        views: {
          'tabs-cronologiaEU': {
            templateUrl: 'templates/cronologiaEU.html',
            controller: 'CronologiaEUCtrl'
          }
        }
      })

      .state('app.tabs.ricerca', {
        url: '/ricerca',
        views: {
          'tabs-ricerca': {
            templateUrl: 'templates/ricerca.html',
            controller: 'ricercaCtrl'
          }
        }
      });



  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/login');
});
