angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.showModal = function(msg) {
    window.alert(msg);
  }

})

.controller('MapCtrl', function($scope, $http, $stateParams) {

    /* --- VALUES --- */

    var MIN_ZOOM = 1;
    var MAX_ZOOM = 200;
    var INIT_ZOOM = 18;

    var INIT_LAT = 41.68337;
    var INIT_LON = -0.8883134;

    /* --- MAP LOGIC --- */

    // Create map
    var control;
    var map = new L.map('main-map', { zoomControl: false, crs: L.CRS.EPSG3857 });
    new L.Control.Zoom({ position: 'bottomright' }).addTo(map);
    map.attributionControl.setPrefix('');

    // Base layer
    var osm = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: MIN_ZOOM,
        maxZoom: MAX_ZOOM
    }).addTo(map);
    // var ign = new L.tileLayer.wms('http://www.ign.es/wms-inspire/ign-base', {
        // layers: 'IGNBaseTodo'
    // }).addTo(map);
    // var pnoa = new L.tileLayer.wms('http://www.idee.es/wms/PNOA/PNOA', {
        // layers: 'PNOA',
        // format: 'image/png'
    // }).addTo(map);

    // Custom layers
    var ada1 = {
            vect: L.geoJson("", { style: function (feature) {
                return { weight: 1, color: "#0088ff", opacity: 0.50 }
            }}),
            wms: new L.tileLayer.wms('http://62.101.185.123:9080/geoserver/wms', {
                layers: 'proyecto:adabyron_1_mer3',
                format: 'image/png',
                transparent: true
            })
        }
        $http.get("/data/AdaByron_1_ULT.json")
            .success(function (data) { ada1.vect.addData(data); });

        var ada2 = {
            vect: L.geoJson("", { style: function (feature) {
                return { weight: 1, color: "#0088ff", opacity: 0.50 }
            }}),
            wms: new L.tileLayer.wms('http://62.101.185.123:9080/geoserver/wms', {
                layers: 'proyecto:adabyron_2_mer3',
                format: 'image/png',
                transparent: true
            })
        }
        $http.get("/data/AdaByron_2_ULT.json")
            .success(function (data) { ada2.vect.addData(data); });

        var ada3 = {
            vect: L.geoJson("", { style: function (feature) {
                return { weight: 1, color: "#0088ff", opacity: 0.50 }
            }}),
            wms: new L.tileLayer.wms('http://62.101.185.123:9080/geoserver/wms', {
                layers: 'proyecto:adabyron_3_mer3',
                format: 'image/png',
                transparent: true
            })
        }
        $http.get("/data/AdaByron_3_ULT.json")
            .success(function (data) { ada3.vect.addData(data); });

        var ada4 = {
            vect: L.geoJson("", { style: function (feature) {
                return { weight: 1, color: "#0088ff", opacity: 0.50 }
            }}),
            wms: new L.tileLayer.wms('http://62.101.185.123:9080/geoserver/wms', {
                layers: 'proyecto:adabyron_4_mer3',
                format: 'image/png',
                transparent: true
            })
        }
        $http.get("/data/AdaByron_4_ULT.json")
            .success(function (data) { ada4.vect.addData(data); });

        var ada5 = {
            vect: L.geoJson("", { style: function (feature) {
                return { weight: 1, color: "#0088ff", opacity: 0.50 }
            }}),
            wms: new L.tileLayer.wms('http://62.101.185.123:9080/geoserver/wms', {
                layers: 'proyecto:adabyron_5_mer3',
                format: 'image/png',
                transparent: true
            })
        }
        $http.get("/data/AdaByron_5_ULT.json")
            .success(function (data) { ada5.vect.addData(data); });

        var torres1 = new L.tileLayer.wms('http://62.101.185.123:9080/geoserver/wms', {
            layers: 'proyecto:torres_1_mer3',
            format: 'image/png',
            transparent: true
        })

        var torres2 = new L.tileLayer.wms('http://62.101.185.123:9080/geoserver/wms', {
            layers: 'proyecto:torres_2_mer3',
            format: 'image/png',
            transparent: true
        })

        var torres3 = new L.tileLayer.wms('http://62.101.185.123:9080/geoserver/wms', {
            layers: 'proyecto:torres_3_mer3',
            format: 'image/png',
            transparent: true
        })

        var torres4 = new L.tileLayer.wms('http://62.101.185.123:9080/geoserver/wms', {
            layers: 'proyecto:torres_4_mer3',
            format: 'image/png',
            transparent: true
        })

        var torres5 = new L.tileLayer.wms('http://62.101.185.123:9080/geoserver/wms', {
            layers: 'proyecto:torres_5_mer3',
            format: 'image/png',
            transparent: true
        })

        var floor1 = L.layerGroup([ada1.wms, ada1.vect, torres1]);
        var floor2 = L.layerGroup([ada2.wms, ada2.vect, torres2]);
        var floor3 = L.layerGroup([ada3.wms, ada3.vect, torres3]);
        var floor4 = L.layerGroup([ada4.wms, ada4.vect, torres4]);
        var floor5 = L.layerGroup([ada5.wms, ada5.vect, torres5]);

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


        var baseLayers = {
            'Planta 0': floor1,
            'Planta 1': floor2,
            'Planta 2': floor3,
            'Planta 3': floor4,
            'Planta 4': floor5
        };

        map.setView([INIT_LAT, INIT_LON], INIT_ZOOM);
        control = L.control.layers(baseLayers);
        control.addTo(map);
    baseLayers['Planta 0'].addTo(map);

    $scope.showAlert = function(msg) { window.alert(msg); };

});
