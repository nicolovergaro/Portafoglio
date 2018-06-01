angular.module('starter.controllers')
.controller('CronologiaEntrateCtrl', function($scope, $http, sharedProperties) {
  $scope.id_utente = sharedProperties.getIdUtente();
var link = "http://portafoglio.altervista.org/select.php";
  $scope.entrate = null;

  $http.get(link,{
    params: {
      tabella: 'entrate',
      id_utente: $scope.id_utente
    }
  }).then(function(response){
    $scope.entrate = response.data.entrate;
    getLongData();
    console.log($scope.entrate);
  }).catch(function(error){
    console.log(error);
  });


function getLongData(){
  var link = "http://portafoglio.altervista.org/select.php";
  $scope.entrate = null;

  var d=[];
  var o=[];

  $http.get(link,{
    params: {
      tabella: 'entrate',
      id_utente: $scope.id_utente
    }
  }).then(function(response){
    $scope.entrate = response.data.entrate;
    for (var i = 0; i < $scope.entrate.length; i++) {
      d[i]=$scope.entrate[i].data.substring(0, 10);
      o[i]=$scope.entrate[i].data.substring(11, 16);
      var parts = d[i].split("-"),
      dateLong = new Date(+parts[0], parts[1]-1, +parts[2]);

      var data=dateLong.toString().substring(0,15);
      var ora=o[i];

      $scope.entrate[i].data=data+", "+ora;

    }

  }).catch(function(error){
    console.log(error);
  });


}

})
