angular.module('starter.services', [])

.service('MapService', function($http) {

    var buildingInfo = {
        ADA_BYRON: {
            name: 'Ada Byron',
            bounds: L.latLngBounds(
                L.latLng(41.6842, -0.8880),
                L.latLng(41.6830, -0.8895)
            ),
            min_zoom: 17,
            apiName: 'ADA_BYRON',
            floors: [
                { name: '1st floor', wmsLayer: 'einapls:adabyron_0', apiName: 'PISO_0' },
                { name: '2nd floor', wmsLayer: 'einapls:adabyron_1', apiName: 'PISO_1' },
                { name: '3rd floor', wmsLayer: 'einapls:adabyron_2', apiName: 'PISO_2' },
                { name: '4th floor', wmsLayer: 'einapls:adabyron_3', apiName: 'PISO_3' },
                { name: '5th floor', wmsLayer: 'einapls:adabyron_4', apiName: 'PISO_4' }
            ]
        },
        TORRES_QUEVEDO: {
            name: 'Torres-Quevedo',
            bounds: L.latLngBounds(
                L.latLng(41.6842, -0.8865),
                L.latLng(41.6830, -0.8883)
            ),
            min_zoom: 17,
            apiName: 'TORRES_QUEVEDO',
            floors: [
                { name: '1st floor', wmsLayer: 'einapls:torres_0', apiName: 'PISO_0' },
                { name: '2nd floor', wmsLayer: 'einapls:torres_1', apiName: 'PISO_1' },
                { name: '3rd floor', wmsLayer: 'einapls:torres_2', apiName: 'PISO_2' },
                { name: '4th floor', wmsLayer: 'einapls:torres_3', apiName: 'PISO_3' }
            ]
        },
        BETANCOURT: {
            name: 'Betancourt',
            bounds: L.latLngBounds(
                L.latLng(41.6842, -0.88245),
                L.latLng(41.6830, -0.8855)
            ),
            min_zoom: 17,
            apiName: 'BETANCOURT',
            floors: [
                { name: '1st floor', wmsLayer: 'einapls:betan_0', apiName: 'PISO_0' },
                { name: '2nd floor', wmsLayer: 'einapls:betan_1', apiName: 'PISO_1' },
                { name: '3rd floor', wmsLayer: 'einapls:betan_2', apiName: 'PISO_2' },
                { name: '4th floor', wmsLayer: 'einapls:betan_3', apiName: 'PISO_3' }
            ]
        }
    }

    return {
        getName: function(building) { return buildingInfo[building].name; },
        getBounds: function(building) { return buildingInfo[building].bounds; },
        getMinZoom: function(building) { return buildingInfo[building].minZoom; },
        getApiNames: function(building, floor) {
            return {
                floor: buildingInfo[building].floors[floor].apiName,
                building: buildingInfo[building].apiName
            }
        },
        getLayers: function(building) {
            var info = buildingInfo[building];
            var layers = [];
            info.floors.forEach(function(floor, i, floors) { // Important this callback to generate isolated scope
                var vectorLayer = L.geoJson('', {
                    pointToLayer: function(feature, latlng) {
                        var color;
                        if (feature.properties.tipoEspacio !== undefined)
                            color = '#78ff00';
                        else if (feature.properties.stock !== undefined)
                            color = '#0044ff';
                        else if (feature.properties.estadoIncidencia !== undefined) {
                            color = '#ff4400';
                        }
                        return L.circleMarker(latlng, {
                            weight: 1,
                            radius: 8,
                            color: '#000',
                            fillColor: color,
                            opacity: 1,
                            fillOpacity: 1
                        });
                    },
                    onEachFeature: function(feature, layer) {
                        if (feature.properties.tipoEspacio !== undefined) {
                            layer.on('click', function(evt) {
                                var space = evt.target.feature.properties;
                                $http.get('http://localhost:8888/places/' + space.id)
                                .then(function(response) {
                                    var space = response.data.features[0].properties;
                                    layer.bindPopup(
                                        '<h5>SPACE</h5><p>' +
                                        '<strong>Type:&nbsp;</strong>' +
                                        space.tipoEspacio +
                                        '<br><strong>Occupation:&nbsp;</strong>' +
                                        space.ocupacion +
                                        '<br><strong>Capacidad:&nbsp;</strong>' +
                                        space.capacidad + '</p>'
                                    );
                                }, function() {
                                    layer.bindPopup('Could not get server response')
                                });
                            })
                            layer.bindPopup('Loading...');
                        } else if (feature.properties.stock !== undefined) {
                            layer.on('click', function(evt) {
                                var machine = evt.target.feature.properties;
                                $http.get('http://localhost:8888/machines/' + machine.id)
                                .then(function(response) {
                                    var machine = response.data.features[0].properties;
                                    var popupText = 
                                        '<h5>VENDING MACHINE</h5><ul>';
                                    for (key in machine.stock) {
                                        if (machine.stock.hasOwnProperty(key)) {
                                            popupText += '<li>' + key + ':&nbsp;' +
                                                machine.stock[key] + '</li>';
                                        }
                                    }
                                    popupText += '</ul>';
                                    layer.bindPopup(popupText);
                                }, function() {
                                    layer.bindPopup('Could not get server response')
                                });
                            })
                            layer.bindPopup('Loading...');
                        } else if (feature.properties.estadoIncidencia !== undefined) {
                            layer.on('click', function(evt) {
                                var issue = evt.target.feature.properties;
                                $http.get('http://localhost:8888/issues/' + issue.id)
                                .then(function(response) {
                                    var issue = response.data.features[0].properties;
                                        layer.bindPopup(
                                            '<h5>ISSUE</h5><p>' +
                                            '<strong>Title:&nbsp;</strong>' +
                                            issue.titulo +
                                            '<br><strong>Description:&nbsp;</strong>' +
                                            issue.descripcion +
                                            '<br><strong>Media:&nbsp;</strong>' +
                                            issue.foto + '</p>'
                                        );
                                }, function() {
                                    layer.bindPopup('Could not get server response')
                                });
                            })
                            layer.bindPopup('Loading...');
                        }
                    }
                });
                $http.get('http://localhost:8888/' +
                          info.apiName + '/' + floor.apiName + '/places').then(
                    function(response) { vectorLayer.addData(response.data); },
                    function(err) { console.log('Couldn\'t load places', err); }
                );
                $http.get('http://localhost:8888/'
                          + info.apiName + '/' + floor.apiName + '/machines').then(
                    function(response) { vectorLayer.addData(response.data); },
                    function(err) { console.log('Couldn\'t load emachines', err); }
                );
                $http.get('http://localhost:8888/'
                          + info.apiName + '/' + floor.apiName + '/issues').then(
                    function(response) { console.log(response.data); vectorLayer.addData(response.data); },
                    function(err) { console.log('Couldn\'t load issues', err); }
                );
                layers.push({
                    name: floor.name,
                    layers: new L.LayerGroup([
                        // Space markers
                        vectorLayer,
                        // WMS
                        new L.tileLayer.wms('http://85.251.93.32:9080/geoserver/eina-pls/wms', {
                            layers: floor.wmsLayer,
                            format: 'image/png',
                            transparent: true,
                            crs: L.CRS.EPSG4326,
                            maxZoom: 21,
                            minZoom: 15,
                        })
                    ])
                });
            })
            return layers;
        }
    };
})

.service('IssueService', function($http, MapService) {
    return {
        createIssue: function(issue) {
            var apiNames = MapService.getApiNames(issue.building, issue.floor);
            var geoJson = {
                  type: 'FeatureCollection',
                features: [{
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [issue.lng, issue.lat]
                    },
                    properties: {
                        titulo: issue.title,
                        descripcion: issue.description,
                        estadoIncidencia: 'ACEPTADA',
                        foto: issue.media || '',
                        tipoPiso: apiNames.floor,
                        tipoEdificio: apiNames.building
                    }
                }]
            };
            return $http.post('http://localhost:8888/issues', JSON.stringify(geoJson));
        }
    }
});
