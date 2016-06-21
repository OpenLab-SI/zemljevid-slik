var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var db = require('./database');

var app = express();
var client = path.resolve('../app/platforms/browser/www');

app.use(express.static(client));
app.use(bodyParser.json({ limit: '20mb' }));

app.get('/images', function(req, res) {
    db.query('SELECT id, latitude, longitude FROM images', function(error, images) {
        if (error) {
            res.status(500).end();
        } else {
            res.json(images);
        }
    });
});

app.get('/images/:id', function(req, res) {
    var id = req.params.id;
    
    db.query('SELECT image FROM images WHERE id = ?', [ id ], function(error, images) {
        if (error) {
            res.status(500).end();
        } else if (images.length == 0) {
            res.status(404).end();
        } else {
            var image = images[0].image;
            
            res.header('Content-Type', 'image/jpeg');
            res.send(image);
        }
    });
});

app.post('/images', function(req, res) {
    var upload = [
        req.body.latitude, 
        req.body.longitude,
        new Buffer(req.body.image, 'base64')
    ];
    
    db.query('INSERT INTO images (latitude, longitude, image) VALUES (?)', [ upload ], function(error) {
        if (error) {
            res.status(500).end();
        } else {
            res.status(200).end();
        }
    });
});

app.listen(process.env.PORT);