angular.module('starter.controllers')
.controller('CronologiaEUCtrl', function($scope, $http, sharedProperties) {
  $scope.id_utente = sharedProperties.getIdUtente();
  var link = "http://portafoglio.altervista.org/getCronologia.php";
  $scope.movimenti = null;

  $http.get(link,{
    params: {
      id_utente: $scope.id_utente


    }
  }).then(function(response){
    $scope.movimenti = response.data.movimenti;
    getLongData();
    console.log($scope.movimenti);
  }).catch(function(error){
    console.log(error);
  });

  function getLongData(){
    var link = "http://portafoglio.altervista.org/getCronologia.php";
    $scope.movimenti = null;

    var d=[];
    var o=[];

    $http.get(link,{
      params: {
        id_utente:$scope.id_utente

      }


    }).then(function(response){
      $scope.movimenti = response.data.movimenti;
      for (var i = 0; i < $scope.movimenti.length; i++) {
        d[i]=$scope.movimenti[i].data.substring(0, 10);
        o[i]=$scope.movimenti[i].data.substring(11, 16);
        var parts = d[i].split("-"),
        dateLong = new Date(+parts[0], parts[1]-1, +parts[2]);

        var data=dateLong.toString().substring(0,15);
        var ora=o[i];

        $scope.movimenti[i].data=data+", "+ora;

      }

    }).catch(function(error){
      console.log(error);
    });


  }

})
