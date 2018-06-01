
angular.module('starter.controllers')
.controller('CronologiaCtrl', function($scope, $http) {
  var link = "http://portafoglio.altervista.org/select.php";
  $scope.entrate = null;

  $http.get(link,{
    params: {
      tabella: 'entrate'
    }
  }).then(function(response){
    $scope.entrate = response.data.entrate;
    console.log($scope.entrate);
  }).catch(function(error){
    console.log(error);
  });
})
