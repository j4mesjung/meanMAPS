var addCtrl = angular.module('addCtrl', [
  'geolocation',
  'gservice'
]);

addCtrl.controller('addCtrl', function($scope, $http, $rootScope, geolocation, gservice){
  
  // initialize the variables
  $scope.formData = {};
  var coords = [];
  var lat = 0;
  var long = 0;
  
  // set initial coordinates to center of the US
  $scope.formData.latitude = 39.500;
  $scope.formData.longitude = -98.350;
  
  // Get User's actual coordinates based on HTML5 at window load
  geolocation.getLocation().then(function(data){

    // Set the latitude and longitude equal to the HTML5 coordinates
    coords = {lat:data.coords.latitude, long:data.coords.longitude};

    // Display coordinates in location textboxes rounded to three decimal points
    $scope.formData.longitude = coords.long.toFixed(3);
    $scope.formData.latitude = coords.lat.toFixed(3);

    // Display message confirming that the coordinates verified.
    $scope.formData.htmlverified = "Yep (Thanks for giving us real data!)";

    gservice.refresh($scope.formData.latitude, $scope.formData.longitude);

  });
  
  //Get coordinates based on mouse click.
  $rootScope.$on("clicked", function(){
    $scope.$apply(function(){
      $scope.formData.latitude = gservice.clickLat.toFixed(3);
      $scope.formData.longitude = gservice.clickLong.toFixed(3);
      $scope.formData.htmlverified = "Nope (Thanks for spamming my map...)";
    });
  });
  
  // creates the user
  $scope.createUser = function() {
    
    // retrieves the values from the form
    var userData = {
      username: $scope.formData.username,
      gender: $scope.formData.gender,
      age: $scope.formData.age,
      favlang: $scope.formData.favlang,
      location: [$scope.formData.longitude, $scope.formData.latitude],
      htmlverified: $scope.formData.htmlverified
    };
    
    $http.post('/users', userData)
      .success(function(data){
        console.log('user created!');
        // on success, reset the formdata
        $scope.formData.username = "";
        $scope.formData.gender = "";
        $scope.formData.age = "";
        $scope.formData.favlang = "";
      
        // Refresh the map with new data
        gservice.refresh($scope.formData.latitude, $scope.formData.longitude);
      })
      .error(function(data){
        console.log('Error: ' + data);
    });
  };
});