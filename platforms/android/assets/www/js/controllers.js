angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicSideMenuDelegate, $state, sharedProperties) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.$ionicSideMenuDelegate = $ionicSideMenuDelegate;
  $scope.menu = {};

  $scope.getNome = function() {
    return sharedProperties.getNome();
  }

  $scope.getCognome = function() {
    return sharedProperties.getCognome();
  }

  $scope.getSaldo = function() {
    return sharedProperties.getSaldo();
  }

  $scope.getIdUtente = function() {
    return sharedProperties.getIdUtente();
  }

  $scope.logout = function() {
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    $state.go('app.login', {}, {reload: true});
  }


});
