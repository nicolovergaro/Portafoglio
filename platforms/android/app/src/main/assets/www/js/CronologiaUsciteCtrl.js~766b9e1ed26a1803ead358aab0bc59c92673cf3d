angular.module('starter.controllers')
.controller('CronologiaUsciteCtrl', function($scope, $http, sharedProperties) {
$scope.id_utente = sharedProperties.getIdUtente();
  var link = "http://portafoglio.altervista.org/select.php";
  $scope.uscite = null;

  $http.get(link,{
    params: {
      tabella: 'uscite',
      id_utente: $scope.id_utente
    }
  }).then(function(response){
    $scope.uscite = response.data.uscite;
    getLongData();
  }).catch(function(error){
    console.log(error);
  });

  function getLongData(){
    var link = "http://portafoglio.altervista.org/select.php";
    $scope.uscite = null;

    var d=[];
    var o=[];

    $http.get(link,{
      params: {
        tabella: 'uscite',
        id_utente: $scope.id_utente
      }
    }).then(function(response){
      $scope.uscite = response.data.uscite;
      for (var i = 0; i < $scope.uscite.length; i++) {
        d[i]=$scope.uscite[i].data.substring(0, 10);
        o[i]=$scope.uscite[i].data.substring(11, 16);
        var parts = d[i].split("-"),
        dateLong = new Date(+parts[0], parts[1]-1, +parts[2]);

        var data=dateLong.toString().substring(0,15);
        var ora=o[i];

        $scope.uscite[i].data=data+", "+ora;

      }

    }).catch(function(error){
      console.log(error);
    });


  }


})
