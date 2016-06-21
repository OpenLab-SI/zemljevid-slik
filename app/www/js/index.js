/* global google, fetch, navigator */

var isCentered = false;
var currentPosition;

var gallery = document.getElementById('gallery');
var cameraButton = document.getElementById('camera');
var closeButton = document.getElementById('close');

var map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 46.2427669, lng: 14.353608 },
    zoom: 16,
    disableDefaultUI: true
});

document.addEventListener('deviceready', function() {
    navigator.geolocation.watchPosition(function(current) {
        currentPosition = {
            lat: current.coords.latitude,
            lng: current.coords.longitude
        };
        
        if (!isCentered) {
            map.setCenter(currentPosition);
            isCentered = true;
        }
    });
});

window.addEventListener('resize', function() {
    var center = map.getCenter();
    google.maps.event.trigger(map, 'resize');
    map.setCenter(center);
});

cameraButton.addEventListener('click', function() {
    navigator.camera.getPicture(function(image) {
        var url = 'data:image/jpeg;base64,' + image;
        
        addImage(url, currentPosition);
    }, function () {}, {
        destinationType: 0
    });
});

function addImage(url, location) {
    var marker = new google.maps.Marker({
        animation: google.maps.Animation.DROP,
        position: location,
        map: map
    });
    
    marker.addListener('click', function() {
        gallery.style.backgroundImage = 'url(' + url + ')';
        gallery.style.transform = 'translateY(0)';
    });
}

closeButton.addEventListener('click', function() {
    gallery.style.transform = 'translateY(100%)';
});