// "use strict";
// var map;

// function getFourSquareJSONObject(loc) {
//     var fourSquareClientId = "E2404DIZ15BU5UXSLE2OKXFMD3UTFLGNNMYJ2BKCSZ4HHHIA";
//     var fourSquareClientSecret = "HOFIWYGUB2YIYBFRN42S0KMZVVRYVR1KPVDZSGXAZUMZECUX";
//     var url = "https://api.foursquare.com/v2/venues/search?v=20161016&ll=" + loc.lat + "%2C%20" + loc.lng + "&query=" + loc.name + "&client_id=" + fourSquareClientId + "&client_secret=" + fourSquareClientSecret;
//     var fData = {
//         name: loc.name,
//         lat: loc.lat,
//         lng: loc.lng,
//         imgUrl: loc.imgUrl
//     };

//     $.getJSON(url)
//         .done(function(data) {
//             var res = data.response.venues[0]
//             fData.url = res.url;
//             fData.address = res.location.formattedAddress;
//             fData.phone = res.contact.formattedPhone;
//             console.log(fData);
//         })
//         .fail(function() {
//             alert("Error fetching foursquare api results");
//         });
//     return fData;
// }

// function populateInfoWindow(loc) {
//     var infoWindowTemplate = "<div class='locInfoWindow'>\
//                             <img src='" + loc.imgUrl + "'></img>\
//                             <div class='locPhone'>" + loc.phone + "</div>\
//                             <div class='locUrl'>" + loc.url + "</div>\
//                           </div>";
//     // <div class='locAddress'>" + loc.address[0] + ", " + loc.address[1] + ", " + loc.address[2] + "</div>\
//     return infoWindowTemplate;
// }

// var taggedLocations = [{
//         name: "Taj Mahal",
//         lat: 27.1750151,
//         lng: 78.0421552,
//         visible: ko.observable(true),
//         test: true,
//         imgUrl: "https://traveljee.com/wp-content/uploads/2013/10/taj_mahal_latest_photo.jpg"
//     },
//     {
//         name: "Red Fort",
//         lat: 28.6561592,
//         lng: 77.2410203,
//         visible: ko.observable(true),
//         test: true,
//         imgUrl: "http://www.transindiatravels.com/wp-content/uploads/red-fort1.jpg"
//     },
//     {
//         name: "Lotus Temple",
//         lat: 28.553492,
//         lng: 77.2588264,
//         visible: ko.observable(true),
//         test: true,
//         imgUrl: "http://2.bp.blogspot.com/-JYQ8x3mIAq4/UdRNXZb3rtI/AAAAAAAAATs/VpGaowkM4cw/s1600/Lotus-Temple-front+view.jpg"
//     },
//     {
//         name: "Chhitorgarh Fort",
//         lat: 24.8870028,
//         lng: 74.6447289,
//         visible: ko.observable(true),
//         test: true,
//         imgUrl: "http://today-freshnews.com/wp-content/uploads/2015/08/today-freshnews-latest-news-hot-news-daily-news-breaking-news.1aws.jpg"
//     },
//     {
//         name: "Gateway of India",
//         lat: 18.9219841,
//         lng: 72.8346543,
//         visible: ko.observable(true),
//         test: true,
//         imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Gateway_of_India_02.JPG/240px-Gateway_of_India_02.JPG"
//     },
//     {
//         name: "Rameshwaram Temple",
//         lat: 9.28820115,
//         lng: 79.31734085,
//         visible: ko.observable(true),
//         test: true,
//         imgUrl: "http://www.enticingtour.com/wp-content/uploads/2013/09/Brahadeshwara-Temple.jpg"
//     },
//     {
//         name: "Golden Temple",
//         lat: 31.6199803,
//         lng: 74.8764849,
//         visible: ko.observable(true),
//         test: true,
//         imgUrl: "http://famouswonders.com/wp-content/uploads/2009/03/golden-temple.jpg"
//     }
// ];

// function autoComplete() {
//     var autocompleteSet = [];
//     for (var i = 0; i < taggedLocations.length; i++) {
//         autocompleteSet[i] = taggedLocations[i].name;
//     }
//     $("#search").autocomplete({
//         source: autocompleteSet
//     });
// }

// function populateMarkers(map) {
//     var info = new google.maps.InfoWindow();
//     var marker;

//     for (var i = 0; i < taggedLocations.length; i++) {
//         marker = new google.maps.Marker({
//             position: new google.maps.LatLng(taggedLocations[i].lat, taggedLocations[i].lng),
//             map: map
//         });

//         google.maps.event.addListener(marker, 'click', (function(marker, i) {
//             return function() {
//                 info.setContent(taggedLocations[i][0]);
//                 info.open(map, marker);
//             }
//         })(marker, i));
//     }
// }

// var markerObject = function(loc) {
//     var vm = this;

//     vm.markerData = getFourSquareJSONObject(loc);

//     vm.isClicked = ko.observable(true);

//     vm.info = populateInfoWindow(vm.markerData);

//     vm.infoWindowContent = new google.maps.InfoWindow({
//         content: vm.info
//     });

//     vm.marker = new google.maps.Marker({
//         position: new google.maps.LatLng(vm.markerData.lat, vm.markerData.lng),
//         map: map
//     });

//     vm.bounce = function(loc) {
//         google.maps.event.trigger(vm.marker, 'click');
//     };

//     vm.showMarker = ko.computed(function() {
//         if (vm.isClicked()) {
//             vm.marker.setMap(map);
//         } else {
//             vm.map.setMap(null);
//         }
//         return true;
//     }, this);

//     vm.marker.addListener('click', function() {
//         vm.infoWindowContent.setContent(vm.info);
//         vm.infoWindowContent.open(mao, this);
//         vm.marker.setAnimation(google.maps.Animation.BOUNCE);
//     });
// }

// function ViewModel() {
//     var vm = this;
//     this.locations = ko.observableArray([]);
//     this.place = ko.observable("");

//     map = new google.maps.Map($('#map'), {
//         zoom: 4,
//         center: new google.maps.LatLng(23.363, 86.22)
//     });

//     for (var obj in taggedLocations) {
//         vm.locations.push(new markerObject(obj));
//     };

// }

// function init() {
//     ko.applyBindings(new ViewModel());
//     autoComplete();
// }