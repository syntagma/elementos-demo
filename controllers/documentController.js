var express = require('express');
var router = express.Router();
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
});

const INDEX = "test";

client.indices.exists(
    {"index": INDEX}
    ,
    function (err, response) {
        if (!response) {
            client.indices.create( {"index": INDEX}, function(err, response) {
                console.trace(response);
            })
        } else {
            console.log("Index exists");
        }
    }
);


/**
 * VER: https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#api-search
 * VER: http://www.elasticsearch.cn/tutorials/2011/07/18/attachment-type-in-action.html
 */
router.get('/search', function (req, res, next) {
    client.ping({
        // ping usually has a 3000ms timeout
        requestTimeout: Infinity,

        // undocumented params are appended to the query string
        hello: "elasticsearch!"
    }, function (error) {
        if (error) {
            console.trace('elasticsearch cluster is down!');
            next(error);
        } else {
            client.search({
                type: "attachment",
                index: INDEX,
                fields: ["title", "hightlight"],
                body: {
                    query: {
                        query_string: {
                            query: req.query.query
                        }
                    },
                    highlight: {
                        fields: {
                            file: {}
                        }
                    }
                }
            }).then(function (body) {
                var hits = body.hits.hits;
                res.send(hits);
            }, function (error) {
                console.trace(error.message);
                next(error);
            });
        }
    });
});

router.post('/insert', function (req, res, next) {
    client.create({
        index: INDEX,
        type: 'attachment',
        body: {
            title: filename,    //TODO: obtener el filename de req
            file: base64EncodedFile //TODO: codificar el archivo en Base64
        }
    }).then(function (body) {
        res.send(body);
    }, function (error) {
        console.trace(error.message);
        next(error);
    });
});

router.get('/download', function (req, res, next) {
    //TODO: Validar id (que exista por lo menos)
    client.get({
        index: INDEX,
        type: 'attachment',
        id: req.query.id,
        fields: ["file"]
    }).then(function (body) {
        //TODO: rescatar el archivo (que viene en base64) descodificarlo (hace falta?) y devolverlo como attach en el response
        file = body.file;
        res.send(file);
    }, function (error) {
        console.trace(error.message);
        next(error);
    });
});

module.exports = router;
