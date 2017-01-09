"use strict";

// Locations Set for Markers
var locationsSet = [{
        name: "Taj Mahal",
        lattitude: 27.1750151,
        longitude: 78.0421552
    },
    {
        name: "Red Fort",
        lattitude: 28.6561592,
        longitude: 77.2410203
    },
    {
        name: "Lotus Temple",
        lattitude: 28.553492,
        longitude: 77.2588264
    },
    {
        name: "Chhitorgarh Fort",
        lattitude: 24.8870028,
        longitude: 74.6447289
    },
    {
        name: "Gateway of India",
        lattitude: 18.9219841,
        longitude: 72.8346543
    },
    {
        name: "Rameshwaram Temple",
        lattitude: 9.28820115,
        longitude: 79.31734085
    },
    {
        name: "Golden Temple",
        lattitude: 31.6199803,
        longitude: 74.8764849
    }
];

var map;
var clientId;
var clientSecret;

var Location = function(data) {
    var that = this;
    this.name = data.name;
    this.lat = data.lattitude;
    this.long = data.longitude;
    this.url = "";
    this.street = "";
    this.city = "";

    this.visible = ko.observable(true);

    var foursquareurl = 'https://api.foursquare.com/v2/venues/search?ll=' + this.lat + ',' + this.long + '&client_id=' + clientId + '&client_secret=' + clientSecret + '&v=20160118' + '&query=' + this.name;

    $.getJSON(foursquareurl).done(function(data) {
        var results = data.response.venues[0];
        that.url = results.url;
        if (typeof that.url === 'undefined') {
            that.url = "";
        }
        that.street = results.location.formattedAddress[0];
        that.city = results.location.formattedAddress[1];
    }).fail(function() {
        alert("Error with Four Square API");
    });

    this.contentString = '<div class="info-window-content"><div class="title"><b>' + data.name + "</b></div>" +
        '<div class="content"><a href="' + that.url + '">' + that.url + "</a></div>" +
        '<div class="content">' + that.street + "</div>" +
        '<div class="content">' + that.city + "</div></div>";

    this.infoWindow = new google.maps.InfoWindow({ content: that.contentString });

    this.marker = new google.maps.Marker({
        position: new google.maps.LatLng(data.lattitude, data.longitude),
        map: map,
        title: data.name
    });

    this.showMarker = ko.computed(function() {
        if (this.visible() === true) {
            this.marker.setMap(map);
        } else {
            this.marker.setMap(null);
        }
        return true;
    }, this);

    this.marker.addListener('click', function() {
        that.contentString = '<div class="info-window-content"><div class="title"><b>' + data.name + "</b></div>" +
            '<div class="content"><a href="' + that.url + '">' + that.url + "</a></div>" +
            '<div class="content">' + that.street + "</div>" +
            '<div class="content">' + that.city + "</div></div>";

        that.infoWindow.setContent(that.contentString);

        that.infoWindow.open(map, this);

        that.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            that.marker.setAnimation(null);
        }, 2000);
    });

    this.bounce = function(place) {
        google.maps.event.trigger(that.marker, 'click');
    };
};

function AppViewModel() {
    var that = this;

    this.searchQuery = ko.observable("");

    this.locationList = ko.observableArray([]);

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: { lat: 28.655812, lng: 77.129754 }
    });

    // Foursquare API settings
    clientId = "E2404DIZ15BU5UXSLE2OKXFMD3UTFLGNNMYJ2BKCSZ4HHHIA";
    clientSecret = "HOFIWYGUB2YIYBFRN42S0KMZVVRYVR1KPVDZSGXAZUMZECUX";

    locationsSet.forEach(function(locationItem) {
        that.locationList.push(new Location(locationItem));
    });

    this.filteredList = ko.computed(function() {
        var filter = that.searchQuery().toLowerCase();
        if (!filter) {
            that.locationList().forEach(function(locationItem) {
                locationItem.visible(true);
            });
            return that.locationList();
        } else {
            return ko.utils.arrayFilter(that.locationList(), function(locationItem) {
                var string = locationItem.name.toLowerCase();
                var result = (string.search(filter) >= 0);
                locationItem.visible(result);
                return result;
            });
        }
    }, that);

    this.mapElem = document.getElementById('map');
    this.mapElem.style.height = window.innerHeight - 50;
}

function initMap() {
    ko.applyBindings(new AppViewModel());
};

function ifError() {
    alert("Voila, Failed to load places.");
};