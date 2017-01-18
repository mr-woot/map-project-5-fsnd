"use strict";


function getFourSquareJSONObject(loc) {
    var fourSquareClientId = "E2404DIZ15BU5UXSLE2OKXFMD3UTFLGNNMYJ2BKCSZ4HHHIA";
    var fourSquareClientSecret = "HOFIWYGUB2YIYBFRN42S0KMZVVRYVR1KPVDZSGXAZUMZECUX";
    var url = "https://api.foursquare.com/v2/venues/search?v=20161016&ll=" + loc.lat + "%2C%20" + loc.lng + "&query="+loc.name+"&client_id=" + fourSquareClientId + "&client_secret=" + fourSquareClientSecret;
    var fData = {};
    $.getJSON(url)
        .done(function(data) {
            fData.url = data.response.venues[0];
            fData.address = data.response.venues[0]
        });
}

var infoWindowTemplate = "<div class='infoWindow'>\
                            <img src=''></img>\
                          </div>";



var taggedLocations = [{
        name: "Taj Mahal",
        lat: 27.1750151,
        lng: 78.0421552,
        imgUrl: "https://traveljee.com/wp-content/uploads/2013/10/taj_mahal_latest_photo.jpg"
    },
    {
        name: "Red Fort",
        lat: 28.6561592,
        lng: 77.2410203,
        imgUrl: "http://www.transindiatravels.com/wp-content/uploads/red-fort1.jpg"
    },
    {
        name: "Lotus Temple",
        lat: 28.553492,
        lng: 77.2588264,
        imgUrl: "http://2.bp.blogspot.com/-JYQ8x3mIAq4/UdRNXZb3rtI/AAAAAAAAATs/VpGaowkM4cw/s1600/Lotus-Temple-front+view.jpg"
    },
    {
        name: "Chhitorgarh Fort",
        lat: 24.8870028,
        lng: 74.6447289,
        imgUrl: "http://today-freshnews.com/wp-content/uploads/2015/08/today-freshnews-latest-news-hot-news-daily-news-breaking-news.1aws.jpg"
    },
    {
        name: "Gateway of India",
        lat: 18.9219841,
        lng: 72.8346543,
        imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Gateway_of_India_02.JPG/240px-Gateway_of_India_02.JPG"
    },
    {
        name: "Rameshwaram Temple",
        lat: 9.28820115,
        lng: 79.31734085,
        imgUrl: "http://www.enticingtour.com/wp-content/uploads/2013/09/Brahadeshwara-Temple.jpg"
    },
    {
        name: "Golden Temple",
        lat: 31.6199803,
        lng: 74.8764849,
        imgUrl: "http://famouswonders.com/wp-content/uploads/2009/03/golden-temple.jpg"
    }
];

function addBounce(map) {

}

function autoComplete() {
    var autocompleteSet = [];
    for (var i = 0; i < taggedLocations.length; i++) {
        autocompleteSet[i] = taggedLocations[i].name;
    }
    $("#search").autocomplete({
        source: autocompleteSet
    });
}

function populateMarkers(map) {
    var info = new google.maps.InfoWindow();
    var marker;

    for (var i = 0; i < taggedLocations.length; i++) {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(taggedLocations[i].lat, taggedLocations[i].lng),
            map: map
        });

        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                info.setContent(taggedLocations[i][0]);
                info.open(map, marker);
            }
        })(marker, i));
    }
}


function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: new google.maps.LatLng(23.363, 86.22)
    });
    populateMarkers(map);
    addBounce(map);
}

function init() {
    autoComplete();
}

init();