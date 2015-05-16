var express = require('express');
var router = express.Router();
var elasticsearch = require('elasticsearch');
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

module.exports = router;
