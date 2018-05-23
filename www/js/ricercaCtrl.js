
angular.module('starter.controllers')
.controller('ricercaCtrl', function($scope, $http, ionicDatePicker) {
  var link = "http://portafoglio.altervista.org/select.php";
  var link1 = "http://portafoglio.altervista.org/ricercaPerTipo.php";
  var link2 = "http://portafoglio.altervista.org/getCronologia.php";
  $scope.categorie = null;
  $scope.visibile="none";
  $scope.cat="Ricerca per categoria...";
  $scope.data="Ricerca per data...";
  var d=[];
  var o=[];

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



    console.log($scope.categorie);
  }).catch(function(error){
    console.log(error);
  });



  // $scope.caricaPerTipo=function(){
  //   if($scope.visibile=='block'){
  //     $scope.visibile='none';
  //   }
  //
  //   $scope.movimenti = null;
  //
  //   $http.get(link1,{
  //     params: {
  //       id_utente:1,
  //       id_tipo: $scope.id_tipo
  //
  //
  //     }
  //   }).then(function(response){
  //     $scope.movimenti = response.data.movimenti;
  //     for (var i = 0; i < $scope.movimenti.length; i++) {
  //       d[i]=$scope.movimenti[i].data.substring(0, 10);
  //       o[i]=$scope.movimenti[i].data.substring(11, 16);
  //       var parts = d[i].split("-"),
  //       dateLong = new Date(+parts[0], parts[1]-1, +parts[2]);
  //
  //       var data=dateLong.toString().substring(0,15);
  //       var ora=o[i];
  //
  //       $scope.movimenti[i].data=data+", "+ora;
  //
  //     }
  //
  //     console.log($scope.movimenti);
  //   }).catch(function(error){
  //     console.log(error);
  //   });
  // }

  $scope.caricaPerData=function(){
    if($scope.visibile=='block'){
      $scope.visibile='none';
    }

    $scope.movimenti = null;

    if($scope.cat=="Ricerca per categoria..."){



    $http.get(link2,{
      params: {
        id_utente:1,
        anno:  $scope.data.getUTCFullYear(),
        mese: $scope.data.getUTCMonth()+1,
        giorno: $scope.data.getUTCDate()


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

      console.log($scope.movimenti);
    }).catch(function(error){
      console.log(error);
    });
  }else if($scope.data=="Ricerca per data..."){

      $http.get(link1,{
        params: {
          id_utente:1,
          id_tipo: $scope.id_tipo


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

        console.log($scope.movimenti);
      }).catch(function(error){
        console.log(error);
      });

  }else{
    $http.get(link1,{
      params: {
        id_utente:1,
        id_tipo: $scope.id_tipo


      }
    }).then(function(response){
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

      console.log($scope.movimenti);
    }).catch(function(error){
      console.log(error);
    });

  }
  }



  var ipObj1 = {
     callback: function (val) {  //Mandatory
       var da=new Date(val);
       da.setMinutes(da.getMinutes() - da.getTimezoneOffset());
       $scope.data= da;
       console.log(da.getUTCDate());
       console.log(da.getUTCMonth() + 1);
     },
     disabledDates: [],
     dateFormat: 'dd MMMM yyyy',
     //inputDate: new Date(),      //Optional
     mondayFirst: false,          //Optional
     closeOnSelect: false,       //Optional
     templateType: 'popup'       //Optional
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

    }
  }

  $scope.azzera=function(){
    $scope.cat="Ricerca per categoria...";
    $scope.data="Ricerca per data...";
    $scope.movimenti = null;
  }





})
