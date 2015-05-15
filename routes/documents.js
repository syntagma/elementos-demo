/**
 * Created by leonardoferrari on 5/15/15.
 */
var express = require('express');
var router = express.Router();
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
});


router.get('/', function(req, res, next) {
    client.search({
        query: 'pepe'
    }).then(function (body) {
        var hits = body.hits.hits;
        res.send(hits);
    }, function (error) {
        console.trace(error.message);
    });
    //res.send('respond with a resource');
});


module.exports = router;





