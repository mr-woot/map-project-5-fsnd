// initMap globals
var map,
    centerLoc = { lat: 28.7041, lng: 77.1025 },
    markers = [],
    infoWindow = new google.maps.InfoWindow();

// initial locations array
var initLocations = [{
        name: "Taj Mahal",
        lat: 27.1750151,
        lng: 78.0421552,
    },
    {
        name: "Red Fort",
        lat: 28.6561592,
        lng: 77.2410203,
    },
    {
        name: "Lotus Temple",
        lat: 28.553492,
        lng: 77.2588264,
    },
    {
        name: "Chhitorgarh Fort",
        lat: 24.8870028,
        lng: 74.6447289,
    },
    {
        name: "Gateway of India",
        lat: 18.9219841,
        lng: 72.8346543,
    },
    {
        name: "Rameshwaram Temple",
        lat: 9.28820115,
        lng: 79.31734085,
    },
    {
        name: "Golden Temple",
        lat: 31.6199803,
        lng: 74.8764849,
    }
];

// foursquare secrets
// Note: where can this credentials be stored while moving this app to production.
var clientId = "E2404DIZ15BU5UXSLE2OKXFMD3UTFLGNNMYJ2BKCSZ4HHHIA";
var clientSecret = "HOFIWYGUB2YIYBFRN42S0KMZVVRYVR1KPVDZSGXAZUMZECUX";

// location model
var Location = function(data) {
    this.name = ko.observable(data.name);
    this.lat = ko.observable(data.lat);
    this.lng = ko.observable(data.lng);
    this.address = ko.observable(data.address);
    this.phone = ko.observable(data.phone);
    this.url = ko.observable(data.url);
    this.visibility = ko.observable(true);
};

var ViewModel = function() {
    var vm = this;

    // push into locationList from initLocations
    this.locationsList = ko.observableArray([]);
    initLocations.forEach(function(loc) {
        vm.locationsList.push(new Location(loc));
    });

    // centered map area
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: centerLoc
    });

    vm.locationsList().forEach(function(loc) {
        // set markers with animation DROP
        var marker = new google.maps.Marker({
            map: map,
            position: { lat: loc.lat(), lng: loc.lng() },
            title: loc.name(),
            animation: google.maps.Animation.DROP
        });
        markers.push(marker);
        loc.marker = marker;

        // street view api fetch
        var streetViewImage = 'https://maps.googleapis.com/maps/api/streetview?size=200x150&location=' + loc.lat() + ',' + loc.lng();

        // foursquare api fetch
        var url = "https://api.foursquare.com/v2/venues/search?v=20161016&ll=" + loc.lat() + "%2C%20" + loc.lng() + "&query=" + loc.name() + "&client_id=E2404DIZ15BU5UXSLE2OKXFMD3UTFLGNNMYJ2BKCSZ4HHHIA&client_secret=HOFIWYGUB2YIYBFRN42S0KMZVVRYVR1KPVDZSGXAZUMZECUX";
        var res;
        var infoWindowContent;
        $.getJSON(url, function(data) {
                res = data.response.venues[0];
                // console.log(data);
            })
            .done(function() {
                if (res.location.formattedAddress === undefined || res.location.formattedAddress === "") {
                    loc.address = "Address not available.";
                } else {
                    loc.address = res.location.formattedAddress[0] + ", " + res.location.formattedAddress[1] + ", " + res.location.formattedAddress[2];
                }
                if (res.url === undefined || res.url === "") {
                    loc.url = "URL doesn't exists.";
                } else {
                    loc.url = res.url;
                }
                if (res.contact.formattedPhone === undefined || res.contact.formattedPhone === "") {
                    loc.phone = "Contact Phone not available.";
                } else {
                    loc.phone = res.contact.formattedPhone;
                }
                infoWindowContent = '<div class="infoWindow">' + '<div class="content">' +
                    '<img src=' + streetViewImage + '></img>' +
                    '<div class="locName">' + loc.name() + '</div>' +
                    '<a href="' + loc.url + '" target="_blank">' + loc.url + '</a>' +
                    '<b>Phone:</b> <div class="locPhone">' + loc.phone + '</div>' +
                    '<b>Address:</b> <div class="locAddress">' + loc.address + '</div></div></div>';
            })
            .fail(function(err) {
                alert("Error fetching location info.");
            });
        loc.marker.addListener('click', function() {
            if (marker.getAnimation() !== null) {
                marker.setAnimation(null);
            } else {
                marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function() {
                    marker.setAnimation(null);
                }, 2000);
            }
            infoWindow.setContent(infoWindowContent);
            infoWindow.open(map, marker);

        });
    });

    // filter search query
    this.query = ko.observable("");
    this.filterResults = ko.computed(function() {
        var query = vm.query().toLowerCase();
        if (!search) {
            vm.locationsList().forEach(function(loc) {
                loc.visibility(true);
                loc.marker.setMap(map);
            });
        } else {
            vm.locationsList().forEach(function(loc) {
                if (loc.name().toLowerCase().indexOf(query) >= 0) {
                    loc.visibility(true);
                    loc.marker.setMap(map);
                } else {
                    loc.visibility(false);
                    loc.marker.setMap(null);
                }
            });
        }
    }, this);

    // opens info window when clicked
    this.clickInfoContent = function(loc) {
        infoWindow.close();
        google.maps.event.trigger(loc.marker, 'click');
    }
};

ko.applyBindings(new ViewModel());