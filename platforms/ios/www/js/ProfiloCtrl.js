
angular.module('starter.controllers')
.controller('ProfiloCtrl', function($scope, $ionicLoading, $state, $ionicHistory, $http, sharedProperties, $ionicModal, ionicDatePicker, ionicTimePicker) {
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    viewData.enableBack = false;
  });

  //animazione loading
  $ionicLoading.show({
        template: '<style> ion-spinner svg {stroke:white;} '+
        'div{text-align:center; font-size:20px}</style>'+
        '<div>' +
        '<span>Caricamento</span><br><br>'+
        '<ion-spinner icon="lines"></ion-spinner></div>'
      })


  $scope.tabAttivo = 1;
  $scope.movimenti = undefined

  $scope.id_utente = sharedProperties.getIdUtente();
  var entrateTot = 0;
  var usciteTot = 0;
  var categorie = [];
  $scope.statisticheMovimenti = [];

  // Load the Visualization API and the corechart package.
  google.charts.load('current', {'packages':['corechart']});

  // console.log(sharedProperties.getIdUtente());

  var d = new Date();
  d.setHours(0,0,0,0);
  var month = d.getMonth()+1;
  var anno = d.getFullYear();

  $scope.utente = {
    id_utente: $scope.id_utente,
    nome: sharedProperties.getNome(),
    cognome: sharedProperties.getCognome(),
    saldo: sharedProperties.getSaldo()
  }

getMovimenti(month,"","");

  function getMovimenti(mese,settimana,giorno){
    var link = "http://portafoglio.altervista.org/getCronologia.php";
    $scope.movimenti = null;

    $http.get(link,{
      params: {
        id_utente: $scope.id_utente,
        anno: anno,
        mese: mese,
        giorno:giorno
      }
    }).success(function(data){
      $ionicLoading.hide()
      if (data.movimenti != undefined){
        $scope.movimentiPresenti = true
        $scope.movimenti = data.movimenti;
        $scope.selezionaPeriodo($scope.tabAttivo);
      }else{
        $scope.movimentiPresenti = false
      }

      // console.log($scope.movimenti);
    }).catch(function(error){
      console.log(error);
    });
  }

  function drawMovimentiChart() {
    // Create the data table.
    var data = new google.visualization.arrayToDataTable($scope.datiMovimenti);

    // Set chart options
    var options = {
      animation: {duration: '500',startup:true},
      chartArea:{left:80,width:'100%'},
      width: '100%',
      legend: { position: 'bottom' },
      vAxis: {format: 'currency'}
    };

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.AreaChart(document.getElementById('movimenti_chart_div'));
    chart.draw(data, options);
  }

  function drawCategorieChart() {
    // Create the data table.
    var data = new google.visualization.arrayToDataTable($scope.datiCategorie);

    // Set chart options
    var options = {
      animation: {duration: '500',startup:true},
      chartArea:{width:'100%'},
      width: '110%',
      pieHole: 0.4,
    };

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(document.getElementById('categorie_chart_div'));
    chart.draw(data, options);
  }




  $scope.selezionaPeriodo=function(tab){


    $scope.movimentiPresenti = false
    $scope.tabAttivo = tab;
    entrateTot = 0;
    usciteTot = 0;
    categorie = [['Categoria','Importo']];

    if ($scope.movimenti != undefined) {
      setUpGraficoMovimenti();
      setUpGraficoCategorie();
    }

  }

  function setUpGraficoMovimenti() {
    var tab = $scope.tabAttivo;
    $scope.datiMovimenti = [['Giorno', 'Entrate', 'Uscite']];
    $scope.datiCategorie = [['Categoria', 'Importo']];

    if (tab==3) {
      for (var i = 1; i < 32; i++) {
        var entryMovimento = creaVettoreGiornoMese(i);
        $scope.datiMovimenti.push(entryMovimento);
      }
    }else if(tab==2){
      for (var i = 0; i < 7; i++) {
        var entryMovimento = creaVettoreGiornoSettimana(i);
        $scope.datiMovimenti.push(entryMovimento);
      }

    }else{
      $scope.datiMovimenti = [['Ora', 'Entrate', 'Uscite']];
      $scope.movimentiPresenti = false
      for (var i = 0; i < 25; i++) {
        var entryMovimento = creaVettoreGiorno(i);
        $scope.datiMovimenti.push(entryMovimento);
      }

    }

    // Set a callback to run when the Google Visualization API is loaded.
    if ($scope.utente != null && $scope.movimentiPresenti) {
    google.charts.setOnLoadCallback(drawMovimentiChart);
  }
  }

  function setUpGraficoCategorie(){

    //SANTU STACKOVERFLOW
    var sum = {},result;
    for (var i = 0,c; c=categorie[i]; ++i) {
      if (undefined === sum[c[0]]) {
        sum[c[0]] = c;
      }else{
        sum[c[0]][1] += c[1];
      }
    }
    result = Object.keys(sum).map(function(val) { return sum[val]});
    // console.log(result);

    $scope.datiCategorie = result;


if ($scope.utente != null && $scope.movimentiPresenti) {
    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(drawCategorieChart);
  }

  }


  //*************************//
  //FUNZIONI PER CREARE LE entryMovimento PER IL GRAFICO
  //*************************//
  function creaVettoreGiornoMese(giorno){

    var movimenti = $scope.movimenti
    var entrate = 0;
    var uscite = 0;

    for (var i = 0; i < movimenti.length; i++) {
      if (getDayOfMonth(movimenti[i].data)==giorno) {
        if (movimenti[i].importo > 0) {
          entrate += parseFloat(movimenti[i].importo);
        }else{
          uscite += parseFloat(movimenti[i].importo);
          categorie.push([movimenti[i].tipo,-parseFloat(movimenti[i].importo)]);
        }
      }
    }



    entrateTot += entrate;
    usciteTot += uscite;


    //non sono presenti else per settare a false perchè
    // appena trovo che entrate + uscite
    //è diverso da 0 vuol dire che sono presenti movimenti
    //setto a false appena cambio il tab
    if(entrateTot != 0 || usciteTot != 0){
      $scope.movimentiPresenti = true
    }


    $scope.statisticheMovimenti = [{nome:"Entrate",importo:entrateTot},{nome:"Uscite",importo:usciteTot},{nome:"Bilancio",importo:entrateTot+usciteTot}];

    // console.log(String(giorno),entrate,uscite);

    var vett = [String(giorno),entrate,uscite]
    // if (vett == []) $scope.movimentiPresenti = false
    // else $scope.movimentiPresenti = true

    return vett;
  }

  function creaVettoreGiornoSettimana(giorno){

    var curr = d; // get current date
    var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    var last = first + 6; // last day is the first day + 6
    firstday = new Date(curr.setDate(first));
    lastday = new Date(curr.setDate(curr.getDate()+6));

    // console.log("first" , firstday);
    // console.log("last" , lastday);
    // var currentDate = new Date($scope.movimenti[5].data);
    // console.log("current" , currentDate);

    var giorni = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    var movimenti = $scope.movimenti
    // console.log(movimenti);
    var entrate = 0;
    var uscite = 0;

    for (var i = 0; i < movimenti.length; i++) {
      if ((new Date((movimenti[i].data).replace(/-/g, "/")) >= firstday
            && new Date((movimenti[i].data).replace(/-/g, "/")) <= lastday)) {
        if (getDayOfWeek(movimenti[i].data.replace(/-/g, "/"))==giorni[giorno]) {
          if (movimenti[i].importo > 0) {
            entrate += parseFloat(movimenti[i].importo);
          }else{
            uscite += parseFloat(movimenti[i].importo);
            categorie.push([movimenti[i].tipo,-parseFloat(movimenti[i].importo)]);
          }
        }
      }
    }

    entrateTot += entrate;
    usciteTot += uscite;

    if(entrateTot != 0 || usciteTot != 0){
      $scope.movimentiPresenti = true
    }

    $scope.statisticheMovimenti = [{nome:"Entrate",importo:entrateTot},{nome:"Uscite",importo:usciteTot},{nome:"Bilancio",importo:entrateTot+usciteTot}];


    // console.log(String(giorni[giorno]),entrate,uscite);

    var vett = [String(giorni[giorno]),entrate,uscite]
    // if (vett == []) $scope.movimentiPresenti = false
    // else $scope.movimentiPresenti = true
    return vett;
  }

  function creaVettoreGiorno(ora){

    var start = new Date();
    start.setHours(0,0,0,0);

    var end = new Date();
    end.setHours(23,59,59,999);
    // console.log("start", start);
    // console.log("end" , end);
    var movimenti = $scope.movimenti
    var entrate = 0;
    var uscite = 0;
    // console.log(getHourOfDay(movimenti[2].data));

    // console.log(start, end);

    for (var i = 0; i < movimenti.length; i++) {
      // console.log (new Date((movimenti[i].data).replace(/-/g, "/")));

      if ((new Date((movimenti[i].data).replace(/-/g, "/")) >= start
            && new Date((movimenti[i].data).replace(/-/g, "/")) <= end)) {
        if (getHourOfDay(movimenti[i].data)==ora) {
          if (movimenti[i].importo > 0) {
            entrate += parseFloat(movimenti[i].importo);
          }else{
            uscite += parseFloat(movimenti[i].importo);
            categorie.push([movimenti[i].tipo,-parseFloat(movimenti[i].importo)]);
          }
        }
      }
    }

    entrateTot += entrate;
    usciteTot += uscite;

    // console.log(String(ora),entrate,uscite);

    if(entrateTot != 0 || usciteTot != 0){
      $scope.movimentiPresenti = true
    }

    $scope.statisticheMovimenti = [{nome:"Entrate",importo:entrateTot},{nome:"Uscite",importo:usciteTot},{nome:"Bilancio",importo:entrateTot+usciteTot}];

    var vett = [String(ora),entrate,uscite]
    // if (vett == []) $scope.movimentiPresenti = false
    // else $scope.movimentiPresenti = true
    return vett;
  }

  //Dalla data ottengo il giorno es. 2017-11-22 10:39:00 mi ritorna 22
  function getDayOfMonth(data){
    return data.split("-")[2].substring(0,2);
  }

  //Dalla data ottengo il giorno della settimana es. 2017-11-22 10:39:00 mi ritorna Wed
  function getDayOfWeek(date) {
    var dayOfWeek = new Date(date).getDay();
    return isNaN(dayOfWeek) ? null : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayOfWeek];
  }

  //Dalla data ottengo l'ora del giorno es. 2017-11-22 10:39:00 mi ritorna 10
  function getHourOfDay(data){
    return data.split("-")[2].substring(2,5);
  }

  //PARTE PER IL MODAL
  // $scope.tabTipoAttivo = 1
  // var data = new Date();
  // // $scope.data = String(giorno + "/" + mese + "/" + anno);
  // $scope.data = data;
  // // $scope.ora = String(orario);
  // $scope.ora = data
  // $scope.cat = "Categoria"
  // $scope.totale = 0;
  // $scope.nome = "";
  $scope.dataSet = false
  $scope.modal = {};

  //Creo date picker
    var ipObj1 = {
       callback: function (val) {  //Mandatory
         var da=new Date(val);
         da.setMinutes(da.getMinutes() - da.getTimezoneOffset());
         $scope.modal.data= da;
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

     //Apro date picker
     $scope.openDatePicker = function(){
       ionicDatePicker.openDatePicker(ipObj1);
     };

       //creo time picker
     var ipObj2 = {
        callback: function (val) {      //Mandatory
          if (typeof (val) === 'undefined') {
            console.log('Time not selected');
          } else {
            var selectedTime = new Date(val*1000);
            selectedTime.setMinutes(selectedTime.getUTCMinutes());
            selectedTime.setHours(selectedTime.getUTCHours());
            $scope.dataSet = true;
            $scope.modal.ora = selectedTime;
            console.log($scope.modal.ora);
          }
        },
        // inputTime: 50400,   //Optional
        format: 12,         //Optional
        step: 1,           //Optional
        setLabel: 'Set'    //Optional
      };

      //Apro time picker
      $scope.openTimePicker = function(){
        ionicTimePicker.openTimePicker(ipObj2);
      };

    //Funzione per ottenere i tipi
     function getTipi(){
       var link = "http://portafoglio.altervista.org/select.php";
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
   };




     $scope.showModal = function() {
       $ionicModal.fromTemplateUrl('templates/addmovimenti.html', {
         scope: $scope
       }).then(function(modal) {
         if ($scope.categorie == undefined) {
            getTipi();
         }
         $scope.modalView = modal;
         var data = new Date();
         $scope.modal.data = data;
         $scope.modal.tabTipoAttivo = 1;
         $scope.modal.ora = data;
         $scope.modal.cat = "Categoria"
         $scope.modal.nome = "";
         $scope.modalView.show();
       });
     };

      $scope.closeModal = function() {
        $scope.modalView.hide();
        $scope.modal.totale = 0;
      };


     $scope.selezionaTipo=function(tab){
       $scope.modal.tabTipoAttivo = tab;
     }

     $scope.creaMovimento=function(){
       var tabella = 'entrate';
       var importo = parseFloat($scope.modal.totale);
       if($scope.modal.tabTipoAttivo == 2){
         importo  *= -1;
         tabella = 'uscite';
       };

       var data = $scope.modal.data;
       var ora = $scope.modal.ora;
       var giorno = data.getUTCDate();
       var mese = data.getUTCMonth()+1;
       var anno = data.getUTCFullYear();
       var oraDB = ora.getHours() + ":" + ora.getMinutes();

       var dataDB = anno+"-"+mese+"-"+giorno + " " + oraDB + ":00";
       // console.log(dataDB);
       var nome = $scope.modal.nome;
       // console.log(nome);
       var id_tipo = 2;
       var id_utente = $scope.id_utente;
       // console.log(importo);
       insertMovimento(tabella,dataDB,importo,nome,id_tipo,id_utente);

       // var sql = "INSERT INTO " + tabella + "VALUES (NULL, "+", '"+dataDB +
       //  "', " + importo + ", '" + nome + "', " + id_tipo + ", " + id_utente+")";
       //
       //  console.log(sql);
     }

     //Funzione per ottenere i tipi
      function insertMovimento(tabella,data,importo,nome,id_tipo,id_utente){
        var link = "http://portafoglio.altervista.org/insert.php";
        var fd = new FormData();
        fd.append("tabella", tabella);
        fd.append("data", data)
        fd.append("importo", importo);
        fd.append("nome", nome);
        fd.append("id_tipo", id_tipo);
        fd.append("id_utente", id_utente);

        $http.post(link, fd, {
            headers: {'Content-Type': undefined },
            transformRequest: angular.identity
        }).success(function(data){
          console.log(data);
        });

        $scope.closeModal();
        $ionicHistory.clearCache();
        $state.go('app.profilo', {}, {reload: true});
    };

});
