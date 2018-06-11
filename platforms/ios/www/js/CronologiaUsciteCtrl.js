angular.module('starter.controllers')
.controller('CronologiaUsciteCtrl', function($scope, $http,$ionicPopup,$window, $rootScope, sharedProperties) {
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    if ($rootScope.eliminati != []) {
      for (var i = 0; i < $rootScope.eliminati.length; i++) {
        cancellaMovimento($rootScope.eliminati[i])
      }
    }
  });
$rootScope.eliminati = [];
$scope.id_utente = sharedProperties.getIdUtente();
  var link = "http://moneytrack.altervista.org/select.php";
  $scope.uscite = null;

  $http.get(link,{
    params: {
      tabella: 'uscite',
      id_utente: $scope.id_utente
    }
  }).then(function(response){
    if (response.data.uscite != undefined) {
      $scope.uscite = response.data.uscite;
      getLongData();
      $scope.trovato = true
    }else{
      $scope.trovato = false
    }
  }).catch(function(error){
    console.log(error);
  });

  function getLongData(){

    var d=[];
    var o=[];

      for (var i = 0; i < $scope.uscite.length; i++) {
        d[i]=$scope.uscite[i].data.substring(0, 10);
        o[i]=$scope.uscite[i].data.substring(11, 16);
        var parts = d[i].split("-"),
        dateLong = new Date(+parts[0], parts[1]-1, +parts[2]);

        var data=dateLong.toString().substring(0,15);
        var ora=o[i];

        $scope.uscite[i].data=data;
        $scope.uscite[i].ora=ora;
      }

  }

  function cancellaMovimento(id){
    for (var i = 0; i < $scope.uscite.length; i++) {
      if ($scope.uscite[i].id_uscita == id) {
        $scope.uscite.splice(i, 1);
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
          fd.append("tabella", "uscite");
          fd.append("id_uscita", id);


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
