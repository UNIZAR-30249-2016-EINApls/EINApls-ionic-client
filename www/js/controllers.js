angular.module('starter.controllers', ['starter.services'])

.controller('AppCtrl', function($scope, $timeout, $rootScope) {

    $scope.selectBuilding = function(buildingName) {
        $rootScope.$broadcast('SELECT_BUILDING', buildingName);
    }

})

.controller('MapCtrl', function($scope, $http, $ionicModal, $stateParams, $timeout, MapService) {

    /* --- MAP LOGIC --- */

    // Create map
    var control;
    var serverData = {}
    var map = new L.map('main-map', {
        zoomControl: false
    });
    map.options.minZoom = 17;
    map.options.maxZoom = 21;
    new L.Control.Zoom({ position: 'bottomright' }).addTo(map);
    map.attributionControl.setPrefix('');

    // Base layers
    var ign = new L.tileLayer.wms('http://www.ign.es/wms-inspire/ign-base', {
        layers: 'IGNBaseTodo',
        maxZoom: 200,
        minZoom: 19,
    }).addTo(map);
    var osm = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 1,
        maxZoom: 19, // OSM does not provide tiles for zooms beyond 19
    }).addTo(map);
    // var pnoa = new L.tileLayer.wms('http://www.idee.es/wms/PNOA/PNOA', {
        // layers: 'PNOA',
        // format: 'image/png'
    // }).addTo(map);

    // Custom layers
    // var ada1 = {
        // vect: L.geoJson("", { style: function (feature) {
            // return { weight: 1, color: "#008833", opacity: 0.50 }
        // }}),
        // interactive: L.geoJson("", { style: function (feature) {
            // return { weight: 1, color: "#ff0000", opacity: 1 }
        // }}),
        // cafe: L.marker([41.6836, -0.88865]).bindPopup('<strong>Capacidad: </strong>' + (serverData.coffeeCap || '-') + '<br><strong>Ocupacion:</strong>' + (serverData.coffeeOcu || '-')),
        // wms: new L.tileLayer.wms('http://192.168.1.45:8080/geoserver/eina-pls/wms', {
            // layers: 'einapls:adabyron_0',
            // format: 'image/png',
            // transparent: true,
            // crs: L.CRS.EPSG4326,
            // maxZoom: 21,
            // minZoom: 15,
        // })
    // }
    // $http.get("/data/AdaByron_1_ULT.json")
        // .success(function (data) { console.log(data); ada1.vect.addData(data); });
    // $http.get("/data/Cafeteria.json")
        // .success(function (data) { console.log(data); ada1.interactive.addData(data); });
    // // $http.get("http://localhost:8888/cafeteria")
        // // .success(function (data) { console.log(data);  });

    // // var floor1 = L.layerGroup([ada1.wms, ada1.vect, ada1.cafe, torres1]);

    // $http.get("/data/AdaByron_1_ULT.json")
        // .success(function (data) {
            // vect.addData(data);
            // // control.addOverlay(L.geoJson(data, { style: function (feature) {
                // // return { weight: 1, color: "#0088ff", opacity: 0.50 }
            // // }}), 'AdaByron 1');
            // // L.geoJson(data, { style: function (feature) {
                // // return { weight: 1, color: "#0088ff", opacity: 0.50 }
            // // }}).addTo(map);
        // });

    var currentLayers = [];
    var currentFloorIdx = 0;

    function loadBuilding(buildingName) {
        if (currentLayers.length > 0) map.removeLayer(currentLayers[currentFloorIdx].layers);
        currentLayers = MapService.getLayers(buildingName);
        map.setMaxBounds(MapService.getBounds(buildingName));
        $timeout(function() { map.fitBounds(MapService.getBounds(buildingName)); }, 500);
        currentFloorIdx = 0;
        showFloor(0);
    }

    function showFloor(idx) {
        map.removeLayer(currentLayers[currentFloorIdx].layers);
        map.addLayer(currentLayers[idx].layers);
        $scope.floorName = currentLayers[idx].name;
        currentFloorIdx = idx;
    }

    $scope.$on('SELECT_BUILDING', function(event, message) { loadBuilding(message); })
    $scope.showNextFloor = function() { showFloor(currentFloorIdx + 1); }
    $scope.showPrevFloor = function() { showFloor(currentFloorIdx - 1); }
    $scope.firstFloor = function() { return currentFloorIdx == 0; }
    $scope.lastFloor  = function() { return currentFloorIdx == currentLayers.length - 1; }

    loadBuilding('ADA_BYRON');

    /* --- MODAL --- */

    $ionicModal.fromTemplateUrl('my-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function() {
        $scope.modal.show();
    };
    $scope.closeModal = function() {
        $scope.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });

    map.on('click', function(event) {
        if ($scope.addingIssue) {
            $scope.newIssue = {};
            $scope.newIssue.lat = event.latlng.lat;
            $scope.newIssue.lon = event.latlng.lng;
            $scope.openModal();
            $scope.addingIssue = false;
        }
    })
    $scope.enableAddingIssueMode  = function() { $scope.addingIssue = true; }
    $scope.disableAddingIssueMode = function() { $scope.addingIssue = false; }
    $scope.saveIssue = function() {
        if (!$scope.newIssue.title || !$scope.newIssue.description) {
            window.alert('Please, fill all the fields');
        } else {
            console.log('Saving ', $scope.newIssue);
            $scope.closeModal();
        }
    }
    $scope.cancelIssue = function() { $scope.closeModal(); }

});
