
angular.module('starter.controllers')
.controller('RegistrazioneCtrl', function($scope, $http, $ionicPopup, $state, sharedProperties, utils) {
  $scope.data={};
  $scope.bad = false;
  var called = false;

  $scope.checkUsername = function(){
    utils.checkUsername($scope.data.username).success(function(data){
      $scope.data.bad = !(data.number==0);
    });
  }

  $scope.registra = function(){
    if(!called)
      called = true;
    else
      return;

    if($scope.data.password != $scope.data.password1){
      var alertPopup = $ionicPopup.alert({
        title: 'Errore',
        template: 'Le password non corrispondono'
      });

      return;
    }

    if($scope.data.username == "" || $scope.data.password == "" ||
    $scope.data.nome == "" || $scope.data.cognome == "" ||
    $scope.data.saldo == "" || $scope.data.email == ""){

      var alertPopup = $ionicPopup.alert({
        title: 'Errore',
        template: 'Compilare tutti i campi'
      });

      return;
    }

    utils.addNewUser(
      $scope.data.username,
      utils.MD5($scope.data.password),
      $scope.data.nome,
      $scope.data.cognome,
      $scope.data.email,
      $scope.data.saldo,
      document.getElementById('photo').files[0]
    ).success(function(data){

      var id = data.id_utente;

      sharedProperties.setIdUtente(data.id_utente);
      sharedProperties.setNome(data.nome);
      sharedProperties.setCognome(data.cognome);
      sharedProperties.setSaldo(data.saldo);
      localStorage.setItem("username", data.username);
      localStorage.setItem("password", $scope.data.password);

      $state.go('app.profilo', {}, {reload: true});
    });
  }
});
