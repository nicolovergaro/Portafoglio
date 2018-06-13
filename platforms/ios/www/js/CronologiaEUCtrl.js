angular.module('starter.controllers')
.controller('CronologiaEUCtrl', function($scope, $rootScope, $http,$ionicPopup,$window, sharedProperties) {
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    if ($scope.movimenti != null) {
      if ($scope.movimenti.length == 0) {
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
  var link = "http://moneytrack.altervista.org/getCronologia.php";
  $scope.movimenti = null;

  $http.get(link,{
    params: {
      id_utente: $scope.id_utente
    }
  }).then(function(response){
    if (response.data.movimenti != undefined) {
      $scope.movimenti = response.data.movimenti;
      var key = $rootScope.key;
      for (var i = 0; i < $scope.movimenti.length; i++) {
        var decrypted = CryptoJS.AES.decrypt($scope.movimenti[i].nome,key).toString(CryptoJS.enc.Utf8);
        $scope.movimenti[i].nome = decrypted;
      }
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

      for (var i = 0; i < $scope.movimenti.length; i++) {
        d[i]=$scope.movimenti[i].data.substring(0, 10);
        o[i]=$scope.movimenti[i].data.substring(11, 16);
        var parts = d[i].split("-"),
        dateLong = new Date(+parts[0], parts[1]-1, +parts[2]);

        var data=dateLong.toString().substring(0,15);
        var ora=o[i];

        $scope.movimenti[i].data=data;
        $scope.movimenti[i].ora=ora;
      }
  }

  function cancellaMovimento(id){
    for (var i = 0; i < $scope.movimenti.length; i++) {
      if ($scope.movimenti[i].id_entrata == id) {
        $scope.movimenti.splice(i, 1);
      }
    }
  }

  $scope.showMenu = function(id,tabella) {

    catPopup = $ionicPopup.show({
       templateUrl: "/templates/eliminaPopup.html",
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
          fd.append("tabella", tabella);
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
