angular.module('starter.controllers')
.controller('CronologiaEntrateCtrl', function($scope, $http,$ionicPopup, $window, $ionicActionSheet, sharedProperties) {

  $scope.id_utente = sharedProperties.getIdUtente();
var link = "http://moneytrack.altervista.org/select.php";
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
  var link = "http://moneytrack.altervista.org/select.php";
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

      $scope.entrate[i].data=data;
      $scope.entrate[i].ora=ora;

    }

  }).catch(function(error){
    console.log(error);
  });

}

$scope.showMenu = function(id) {

  catPopup = $ionicPopup.show({
     templateUrl: "/templates/categoriePopup.html",
     cssClass: 'categorie-popup',
     title: "",
     scope: $scope,
     buttons: [
      { text: 'Annulla' , type: 'button_close'},
      {
      text: 'Elimina', type: 'button_close',
      onTap: function() {

        var link = "http://moneytrack.altervista.org/delete.php";
        var fd = new FormData();
        fd.append("tabella", "entrate");
        fd.append("id_entrata", id);


        $http.post(link, fd, {
            headers: {'Content-Type': undefined },
            transformRequest: angular.identity
        }).success(function(data){
          console.log(data);

          $window.location.reload();
        });
         }
       },

     ]
   });

 };

})
