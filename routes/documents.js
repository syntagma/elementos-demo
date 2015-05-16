var express = require('express');
var router = express.Router();
var elasticsearch = require('elasticsearch');
var fs = require('fs');
var path = require('path');
var mime = require('mime');

var client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
});
var documentsController = require("../controllers/documentsController");

const INDEX = "test";



/**
 * VER: https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#api-search
 * VER: http://www.elasticsearch.cn/tutorials/2011/07/18/attachment-type-in-action.html
 */
router.get('/search', function (req, res, next) {
    console.log("Inside Document Route .. Search");
    documentsController.search(req.query.query, function (err, response) {
        if (err) {
            next(err);
        } else {
            res.send(response);
        }
    });
});

router.post('/insert', function(req, res, next) {
    var filename = req.files.archivo.originalname;
    var base64data = new Buffer(req.files.archivo.buffer).toString('base64');
    client.create({
      index: INDEX,
      type: 'attachment',      
      body: {
        title: filename,
        file: base64data
      }
    }).then(function (body) {
        res.redirect("/uploadSuccess.html");
    }, function (error) {
        console.trace(error);
        next(error);
    });    
});

router.get('/download', function(req, res, next) {
    //TODO: Validar id (que exista por lo menos)
    client.get({
        index: INDEX,
        type: 'attachment',
        id: req.query.id,
        fields: ['title', '_source']
    }).then(function (body) {
        var filename = body._source.title || "Sin_Nombre";
        var base64data = body._source.file;
        var buffer = new Buffer(base64data, 'base64');

        var fullname = path.join('/tmp', filename);
        fs.writeFile(fullname, buffer, function(err) {
            if (err) return next(err);

            var mimetype = mime.lookup(filename);

            res.setHeader('Content-disposition', 'attachment; filename=' + filename);
            res.setHeader('Content-type', mimetype);

            var filestream = fs.createReadStream(fullname);
            filestream.pipe(res);
        });
    }, function (error) {
        console.trace(error.message);
        next(error);
    });
});

module.exports = router;
