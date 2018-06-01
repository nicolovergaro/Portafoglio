
angular.module('starter.controllers')
.controller('EntrateCtrl', function($scope, sharedProperties, $http) {
  $scope.id_utente=sharedProperties.getIdUtente();
  //Funzione
  $scope.inserisci = function(){

    var link1 = "http://portafoglio.altervista.org/update.php";
    var link2= "http://portafoglio.altervista.org/select.php";
    $scope.entrate=null;
    $scope.importo = 0;
    $http.get(link2,{
        params: {
          tabella:'utenti',
          id_utente: $scope.id_utente
        }
        }).then(function(response){
          var saldo = response.data.utenti.saldo;
          var nuovo_saldo = saldo + $scope.importo;
          console.log('nuovo_saldo',$scope.importo);
          console.log('saldo',response.data);
            $http.get(link1,{
              params: {
                tabella: 'entrate',
                importo:  nuovo_saldo
              }
            }).then(function(response){
              console.log(response.data);
          })

        })
    }

    //alert
      $scope.showPopup = function() {
        if($scope.nome == "" || $scope.importo == "" ||
        $scope.id_tipo == ""){
        $ionicPopup.alert({
          title: 'Errore',
          template: 'Compilare tutti i campi !'
        }).then(function(res) {
          console.log('controllo campi');
        });
      }
      else{
        $ionicPopup.alert({
          title: 'Successo',
          template: 'Entrata inserita correttamente !'
        }).then(function(res) {
          console.log('controllo campi');
        });
      }
    };

    //ritorna id_Tipo
    $scope.ritornaID=function(){
      var link="http://portafoglio.altervista.org/select.php";
      $http.get(link,{
        params:{
          tabella:'tipi'
        }
      }).then(function(response){
        $scope.entrate=response.data.tipi;
        console.log('tipi', $scope.entrate);
      }).catch(function(error){
        console.log(error);
      })
    }

    $scope.ritornaID();
  });
