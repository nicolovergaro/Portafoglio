
angular.module('starter.controllers')
.controller('LoginCtrl', function($scope, $http, $ionicPopup, $state, $ionicHistory, sharedProperties, utils) {
  $scope.loginData={};
  $scope.loginData.remember=true;

  //funzione per il login
  $scope.doLogin = function(){
    //ottiene l'id dell'utente dato username e password
    utils.getIdByUserAndPsw(
      $scope.loginData.username,
      utils.MD5($scope.loginData.password)
    ).success(function(data){
      var id = data.id_utente;

      if(id == -1){
        $ionicPopup.alert({
          title: 'Errore',
          template: 'Username o password errati'
        }).then(function(res) {
          $scope.loginData.username = $scope.loginData.password = "";
        });
      } else {
        //Salvo l'id nelle sharedProperties
        sharedProperties.setIdUtente(id);
        sharedProperties.setNome(data.nome);
        sharedProperties.setCognome(data.cognome);
        sharedProperties.setSaldo(data.saldo);

        if($scope.loginData.remember){
          localStorage.setItem("username", $scope.loginData.username);
          localStorage.setItem("password", $scope.loginData.password);
        }

        $state.go('app.profilo', {}, {reload: true});

      }
    });
  }

  if((localStorage.getItem("username") != undefined) && (localStorage.getItem("password") != undefined)){
    $scope.loginData.username = localStorage.getItem("username");
    $scope.loginData.password = localStorage.getItem("password");
    $scope.doLogin();
  }
});
