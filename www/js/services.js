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
            floors: [
                { name: '1st floor', wmsLayer: 'einapls:adabyron_0' },
                { name: '2nd floor', wmsLayer: 'einapls:adabyron_1' },
                { name: '3rd floor', wmsLayer: 'einapls:adabyron_2' },
                { name: '4th floor', wmsLayer: 'einapls:adabyron_3' },
                { name: '5th floor', wmsLayer: 'einapls:adabyron_4' }
            ]
        },
        TORRES_QUEVEDO: {
            name: 'Torres-Quevedo',
            bounds: L.latLngBounds(
                L.latLng(41.6842, -0.8865),
                L.latLng(41.6830, -0.8883)
            ),
            min_zoom: 17,
            floors: [
                { name: '1st floor', wmsLayer: 'einapls:torres_0' },
                { name: '2nd floor', wmsLayer: 'einapls:torres_1' },
                { name: '3rd floor', wmsLayer: 'einapls:torres_2' },
                { name: '4th floor', wmsLayer: 'einapls:torres_3' }
            ]
        },
        BETANCOURT: {
            name: 'Betancourt',
            bounds: L.latLngBounds(
                L.latLng(41.6842, -0.88245),
                L.latLng(41.6830, -0.8855)
            ),
            min_zoom: 17,
            floors: [
                { name: '1st floor', wmsLayer: 'einapls:betan_0' },
                { name: '2nd floor', wmsLayer: 'einapls:betan_1' },
                { name: '3rd floor', wmsLayer: 'einapls:betan_2' },
                { name: '4th floor', wmsLayer: 'einapls:betan_3' }
            ]
        }
    }

    return {
        getName: function(building) { return buildingInfo[building].name; },
        getBounds: function(building) { return buildingInfo[building].bounds; },
        getMinZoom: function(building) { return buildingInfo[building].minZoom; },
        getLayers: function(building) {
            var info = buildingInfo[building];
            var layers = [];
            info.floors.forEach(function(item, i, floors) { // Important this callback to generate isolated scope
                var vectorSpaces = L.geoJson('', {
                    pointToLayer: function(feature, latlng) { return L.circleMarker(latlng, {
                        weight: 1,
                        radius: 8,
                        color: '#000',
                        fillColor: '#78ff00',
                        opacity: 1,
                        fillOpacity: 1
                    })},
                    onEachFeature: function(feature, layer) {
                        layer.bindPopup(
                            '<p><strong>SPACE&nbsp;</strong><br>' + 
                            '<strong>Type:&nbsp;</strong>' + 
                            feature.properties.tipoEspacio + 
                            '<br><strong>Occupation:&nbsp;</strong>' + 
                            feature.properties.ocupacion + '</p>'
                        );
                    }
                });
                $http.get('http://localhost:8888/espacios/PISO_0/ADA_BYRON').then(
                    function(response) { vectorSpaces.addData(response.data); },
                    function(err) { console.log('Something bad happened', err); }
                );
                layers.push({
                    name: item.name,
                    layers: new L.LayerGroup([
                        // Space markers
                        vectorSpaces,
                        // WMS
                        new L.tileLayer.wms('http://192.168.1.45:8080/geoserver/eina-pls/wms', {
                            layers: item.wmsLayer,
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
});
