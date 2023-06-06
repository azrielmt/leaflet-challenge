const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var myMap = L.map("map", {
    center: [37, -95],
    zoom: 5
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmaps.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap)

d3.json(url).then(function(data) {

    // Function for the radius of the circles
    function mapRadius(Magnitude) {
        if (Magnitude === 0) {
            return 1;
        }
        return Magnitude * 5;
    }

    // Function for the style of the circles
    function mapStyles(feature) {
        return {
            color: "black",
            fillColor: mapColor(feature.geometry.coordinates[2]),
            radius: mapRadius(feature.properties.Magnitude),
            fillOpacity: 1,
            weight: 1,
            stroke: true,
        }
    }

    L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: mapStyles,
        onEachFeature: function(feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Quake Depth: " + feature.geometry.coordinates[2] + "<br>Location: " + feature.properties.place);
        }
    }).addTo(myMap);

        // Map circle colors
        function mapColor(circledepth) {
            if (circledepth <= 10) {
                return '#90EE90'
            } 
            else if (circledepth <= 30) {
                return '#FFD700'
            } 
            else if (circledepth <= 50) {
                return '#FFFF00'
            } 
            else if (circledepth <= 70) {
                return '#FFA500'
            } 
            else if (circledepth <= 90) {
                return '#ff4500'
            } 
            else {
                return '#880808'
            }
        }

    // Legend

    var legend = L.control( {position: "bottomright"});

    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend"),
      depth = [-10, 10, 30, 50, 70, 90];
    //   var labels = [-10, 10, 30, 50, 70, 90];  
      for (var i = 0; i < depth.length; i++) {
        div.innerHTML += '<i style="background:' + mapColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
      }
      return div;
    };
    legend.addTo(myMap);
});


// Inital code below, did not work for legend.

// var legend = L.control( {position: "bottomright"});

// legend.onAdd = function() {
//   var div = L.DomUtil.create("div", "info legend"),
//   depth = [-10, 10, 30, 50, 70, 90]; 
//     for (var i = 0; i < depth.length; i++) {
//         div.innerHTML +=
//             '<i style="background:' + mapColor[i] + '"></i> ' + depth[i] + '<br>';
//     }
//   return div;
// };
// legend.addTo(myMap);
// });