angular.module('starter.controllers')
.controller('CronologiaEntrateCtrl', function($scope, $rootScope, $filter, $http,$ionicPopup, $window, $ionicActionSheet, sharedProperties) {
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    if ($scope.entrate != null) {
      if ($scope.entrate.length == 0) {
        $scope.trovato = false
      }
    }else{
      $scope.trovato = false
    }
    if ($rootScope.eliminati != []) {
      for (var i = 0; i < $rootScope.eliminati.length; i++) {
        cancellaMovimento($rootScope.eliminati[i])
      }
    }
  });

$rootScope.eliminati = [];
$scope.id_utente = sharedProperties.getIdUtente();
var link = "http://moneytrack.altervista.org/select.php";
  $scope.entrate = null;

  $http.get(link,{
    params: {
      tabella: 'entrate',
      id_utente: $scope.id_utente
    }
  }).then(function(response){
    if (response.data.entrate != undefined) {
      $scope.entrate = response.data.entrate;
      getLongData();
      $scope.trovato = true
    }else{
      $scope.trovato = false
    }

    // console.log($scope.entrate);
  }).catch(function(error){
    console.log(error);
  });


function getLongData(){
  var d=[];
  var o=[];

    var dim=$scope.entrate.length;
    for (var i = 0; i < dim; i++) {
      d[i]=$scope.entrate[i].data.substring(0, 10);
      o[i]=$scope.entrate[i].data.substring(11, 16);
      var parts = d[i].split("-"),
      dateLong = new Date(+parts[0], parts[1]-1, +parts[2]);

      var data=dateLong.toString().substring(0,15);
      var ora=o[i];

      $scope.entrate[i].data=data;
      $scope.entrate[i].ora=ora;

    }

}

function cancellaMovimento(id){
  for (var i = 0; i < $scope.entrate.length; i++) {
    if ($scope.entrate[i].id_entrata == id) {
      $scope.entrate.splice(i, 1);
    }
  }
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
          cancellaMovimento(id)
          $rootScope.eliminati.push(id);

        });
         }
       },

     ]
   });

 };

})
