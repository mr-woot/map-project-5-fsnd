// Note: Somehow Google Street View API throws error on GET Request, maybe I used a lot while testing.
// So, instead placed static url images.

var map;
var streetViewImage;
var streetViewUrl = 'https://maps.googleapis.com/maps/api/streetview?size=180x90&location=';
var autocompleteSet = [];

function autoComplete() {
    for (var i = 0; i < initLocations.length; i++) {
        autocompleteSet[i] = initLocations[i].name;
    }
    $('#search')
        .autocomplete({
            source: autocompleteSet,
            minLength: 0,
            select: function(e, ui) {
                console.log(e);
                console.log(ui.item.value);
            },
            change: function(e, ui) {
                console.log("changed");
            }
        })
        .focus(function() {
            // The following works only once.
            // $(this).trigger('keydown.autocomplete');
            // As suggested by digitalPBK, works multiple times
            $(this).autocomplete("search");
        });
}

function init() {
    var mapOptions = {
        zoom: 4,
        center: new google.maps.LatLng(23.363, 86.22)
    };

    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    populateMarkers(initLocations);

    setMarkersMap();
}

function setMarkersMap() {
    for (var i = 0; i < initLocations.length; i++) {
        if (initLocations[i].test === true) {
            initLocations[i].setMarker.setMap(map);
        } else {
            initLocations[i].setMarker.setMap(null);
        }
    }
}

var initLocations = [{
        id: 1,
        name: "Taj Mahal",
        lat: 27.1750151,
        lng: 78.0421552,
        visible: ko.observable(true),
        test: true,
        address: "Near Agra Fort (Fatehabad Road), Āgra 282001",
        mainUrl: "http://www.tajmahal.gov.in",
        imgUrl: "https://traveljee.com/wp-content/uploads/2013/10/taj_mahal_latest_photo.jpg"
    },
    {
        id: 2,
        name: "Red Fort",
        lat: 28.6561592,
        lng: 77.2410203,
        visible: ko.observable(true),
        test: true,
        address: "Mahatma Gandhi Marg, New Delhi 110006",
        mainUrl: "Not Available",
        imgUrl: "http://www.transindiatravels.com/wp-content/uploads/red-fort1.jpg"
    },
    {
        id: 3,
        name: "Lotus Temple",
        lat: 28.553492,
        lng: 77.2588264,
        visible: ko.observable(true),
        test: true,
        address: "Bahapur, Kalkaji, New Delhi 110019",
        mainUrl: "http://www.bahaihouseofworship.in",
        imgUrl: "http://2.bp.blogspot.com/-JYQ8x3mIAq4/UdRNXZb3rtI/AAAAAAAAATs/VpGaowkM4cw/s1600/Lotus-Temple-front+view.jpg"
    },
    {
        id: 4,
        name: "Chhitorgarh Fort",
        lat: 24.8870028,
        lng: 74.6447289,
        visible: ko.observable(true),
        test: true,
        address: "Fort Road, Chitrakot, Chhitorgarh, India",
        mainUrl: "Not Available",
        imgUrl: "http://today-freshnews.com/wp-content/uploads/2015/08/today-freshnews-latest-news-hot-news-daily-news-breaking-news.1aws.jpg"
    },
    {
        id: 5,
        name: "Gateway of India",
        lat: 18.9219841,
        lng: 72.8346543,
        visible: ko.observable(true),
        test: true,
        address: "Apollo Bandar, Off P J Ramchandani Marg (near the Taj Mahal Palace & Tower), Mumbai 400001",
        mainUrl: "Not Available",
        imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Gateway_of_India_02.JPG/240px-Gateway_of_India_02.JPG"
    },
    {
        id: 6,
        name: "Rameshwaram Temple",
        lat: 9.28820115,
        lng: 79.31734085,
        visible: ko.observable(true),
        test: true,
        address: "Rameshwaram, Tamil Nadu",
        mainUrl: "Not Available",
        imgUrl: "http://www.enticingtour.com/wp-content/uploads/2013/09/Brahadeshwara-Temple.jpg"
    },
    {
        id: 7,
        name: "Golden Temple",
        lat: 31.6199803,
        lng: 74.8764849,
        visible: ko.observable(true),
        test: true,
        address: "Golden Temple Rd (Nr Jallianwala Bagh), Amritsar 143001",
        mainUrl: "http://sgpc.net/golden-temple/index.asp",
        imgUrl: "http://famouswonders.com/wp-content/uploads/2009/03/golden-temple.jpg"
    }
];

function findStreetImage(loc) {
    streetViewImage = streetViewUrl + loc.lat + ',' + loc.lng + '&pitch=10';
}

function populateMarkers(loc) {
    var self = this;
    var marker;
    for (i = 0; i < loc.length; i++) {
        loc[i].setMarker = new google.maps.Marker({
            position: new google.maps.LatLng(loc[i].lat, loc[i].lng),
            map: map,
            animation: google.maps.Animation.DROP,
            name: loc[i].name
        });

        findStreetImage(loc[i]);

        loc[i].infoWindowContent = '<div class="infoWindow">' + '<div class="content">' +
            '<img src=' + loc[i].imgUrl + '></img>' +
            '<a href="' + loc[i].mainUrl + '" target="_blank">Website</a>' +
            '<b>Address:</b> <div class="locAddress">' + loc[i].address + '</div></div></div>';

        var infowindow = new google.maps.InfoWindow({
            content: loc[i].infoWindowContent
        });

        new google.maps.event.addListener(loc[i].setMarker, 'click', (function(marker, i) {
            return function() {
                if (marker.getAnimation() !== null) {
                    marker.setAnimation(null);
                } else {
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                    setTimeout(function() {
                        marker.setAnimation(null);
                    }, 5000);
                }
                infowindow.setContent(loc[i].infoWindowContent);
                infowindow.open(map, this);
            };
        })(loc[i].setMarker, i));

        var searchNav = $('#' + +i + +1);
        searchNav.click((function(marker, i) {
            return function() {
                infowindow.setContent(loc[i].infoWindowContent);
                infowindow.open(map, marker);
                map.setZoom(16);
                map.setCenter(marker.getPosition());
                loc[i].pictest = true;
            };
        })(loc[i].setMarker, i));
    }
}

function ViewModel() {
    this.place = ko.observable("");
    this.initLocations = ko.computed(function() {
        var self = this;
        var search = self.place().toLowerCase();
        return ko.utils.arrayFilter(initLocations, function(marker) {
            if (marker.name.toLowerCase().indexOf(search) >= 0) {
                marker.test = true;
                return marker.visible(true);
            } else {
                marker.test = false;
                setMarkersMap();
                return marker.visible(false);
            }
        });
    }, this);
};

ko.applyBindings(new ViewModel);
autoComplete();