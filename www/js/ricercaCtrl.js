
angular.module('starter.controllers')
.controller('ricercaCtrl', function($scope, $rootScope, $http, ionicDatePicker, $ionicScrollDelegate, sharedProperties) {
  var link = "http://moneytrack.altervista.org/select.php";
  var link1 = "http://moneytrack.altervista.org/ricercaPerTipo.php";
  var link2 = "http://moneytrack.altervista.org/getCronologia.php";
  $scope.categorie = null;
  $scope.visibile="none";
  $scope.cat="Ricerca per categoria...";
  $scope.data="Ricerca per data...";
  var d=[];
  var o=[];

  $scope.id_utente = sharedProperties.getIdUtente();


  $http.get(link,{
    params: {
      tabella: 'tipi'
    }
  }).then(function(response){
    var a = response.data.tipi;
    $scope.categorie = [];
    var size = 3;

    while (a.length > 0)
    $scope.categorie.push(a.splice(0, size));



    // console.log($scope.categorie);
  }).catch(function(error){
    console.log(error);
  });

  $scope.carica=function(){
    if($scope.visibile=='block'){
      $scope.visibile='none';
    }

    $scope.movimenti = null;

    if($scope.cat=="Ricerca per categoria..."){



    $http.get(link2,{
      params: {
        id_utente:$scope.id_utente,
        anno:  $scope.data.getFullYear(),
        mese: $scope.data.getUTCMonth()+1,
        giorno: $scope.data.getUTCDate()


      }
    }).then(function(response){
      if (response.data.movimenti != undefined){
        $scope.movimenti = response.data.movimenti;
        var key = $rootScope.key;
        for (var i = 0; i < $scope.movimenti.length; i++) {
          var decrypted = CryptoJS.AES.decrypt($scope.movimenti[i].nome,key).toString(CryptoJS.enc.Utf8);
          $scope.movimenti[i].nome = decrypted;
        }
        for (var i = 0; i < $scope.movimenti.length; i++) {
          d[i]=$scope.movimenti[i].data.substring(0, 10);
          o[i]=$scope.movimenti[i].data.substring(11, 16);
          var parts = d[i].split("-"),
          dateLong = new Date(+parts[0], parts[1]-1, +parts[2]);

          var data=dateLong.toString().substring(0,15);
          var ora=o[i];

          $scope.movimenti[i].data=data+", "+ora;

        }
        $scope.trovato = true
      }else $scope.trovato = false


      console.log($scope.movimenti);
    }).catch(function(error){
      console.log(error);
    });
  }else if($scope.data=="Ricerca per data..."){

      $http.get(link1,{
        params: {
          id_utente:$scope.id_utente,
          id_tipo: $scope.id_tipo


        }
      }).then(function(response){
        if (response.data.movimenti != undefined){
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
          $scope.trovato = true


        }else $scope.trovato = false

        console.log($scope.movimenti);
      }).catch(function(error){
        console.log(error);
      });

  }else{
    $http.get(link1,{
      params: {
        id_utente:$scope.id_utente,
        id_tipo: $scope.id_tipo


      }
    }).then(function(response){
      if (response.data.movimenti != undefined) {
        $scope.movimenti = response.data.movimenti;
        var array= $scope.movimenti.filter(function(el){
          var dat=new Date(el.data);
          return dat.getUTCFullYear()==$scope.data.getUTCFullYear()&&
          dat.getUTCMonth()==$scope.data.getUTCMonth()&&
          dat.getUTCDate()==$scope.data.getUTCDate();
        });
        $scope.movimenti=array;
        for (var i = 0; i < $scope.movimenti.length; i++) {
          d[i]=$scope.movimenti[i].data.substring(0, 10);
          o[i]=$scope.movimenti[i].data.substring(11, 16);
          var parts = d[i].split("-"),
          dateLong = new Date(+parts[0], parts[1]-1, +parts[2]);

          var data=dateLong.toString().substring(0,15);
          var ora=o[i];

          $scope.movimenti[i].data=data+", "+ora;

        }
        $scope.trovato = true
      }else $scope.trovato = false


      console.log($scope.movimenti);
    }).catch(function(error){
      console.log(error);
    });

  }
  }



  var ipObj1 = {
     callback: function (val) {  //Mandatory
       if (typeof val === 'number') {
         //La data è un solo numero, quindi la ricerca va fatta su un solo giorno
         var da = new Date(val);
         da.setMinutes(da.getMinutes() - da.getTimezoneOffset());
         var dataScelta = da;
       }else{
       //la data è un periodo, la ricerca va fatta su più giorni
        var start = new Date(val['start']);
        start.setMinutes(start.getMinutes() - start.getTimezoneOffset());
        var end = new Date(val['end']);
        end.setMinutes(end.getMinutes() - end.getTimezoneOffset());
        var dateScelte = [start, end]
       }

       if (dateScelte) {
         for (var index=0;index<2; index++) {
           console.log(dateScelte[index].getUTCDate());
           console.log(dateScelte[index].getUTCMonth() + 1);
         }
       }else{
         console.log(dataScelta.getUTCDate());
         console.log(dataScelta.getUTCMonth() + 1);
       }


       $scope.data= da;

     },
     disabledDates: [],
     dateFormat: 'dd MMMM yyyy',
     mondayFirst: false,          //Optional
     closeOnSelect: false,       //Optional
     templateType: 'popup',
     selectMode: 'day'      //Optional
   };

   $scope.openDatePicker = function(){
     ionicDatePicker.openDatePicker(ipObj1);
   };

  $scope.setVisibile=function(){
    if($scope.visibile=='none'){
      $scope.visibile='block';
      $scope.movimenti=null;
    }else{
      $scope.visibile='none';

    }

  }


  $scope.selezionaCat=function(x,id_tipo){
    $scope.cat=x;
    $scope.id_tipo=id_tipo;
    if($scope.visibile=='block'){
      $scope.visibile='none';
      $ionicScrollDelegate.scrollTop();
    }
  }

  $scope.azzera=function(){
    $scope.cat="Ricerca per categoria...";
    $scope.data="Ricerca per data...";
    $scope.movimenti = null;
    $scope.trovato = null;
    $scope.visibile = 'none';
  }





})
