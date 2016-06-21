/* global google, fetch, navigator */

var markers = [];
var server = 'https://zemljevid-slik-medja.c9users.io';

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
        uploadImage(image, currentPosition);
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
    
    markers.push(marker);
}

closeButton.addEventListener('click', function() {
    gallery.style.transform = 'translateY(100%)';
});

function uploadImage(image, location) {
    fetch(server + '/images', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            latitude: location.lat,
            longitude: location.lng,
            image: image
        })
    });
}

function updateImages() {
    fetch(server + '/images').then(function(res) {
        return res.json();
    }).then(replaceImages);
}

function replaceImages(images) {
    markers.forEach(function(marker) {
        marker.setMap(null);
    });
    
    markers = [];
    
    images.forEach(function(image) {
        var url = server + '/images/' + image.id;
        
        addImage(url, {
            lat: image.latitude,
            lng: image.longitude
        });
    });
}

updateImages();
setInterval(updateImages, 60 * 1000);