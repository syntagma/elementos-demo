var elasticsearch = require('elasticsearch');
var fs = require('fs');
var path = require('path');
var mime = require('mime');

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
            client.indices.create({"index": INDEX}, function (err, response) {
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
exports.search = function search(query, callback) {
    console.log("Inside Document Controller .. Search");
    client.ping({
        // ping usually has a 3000ms timeout
        requestTimeout: Infinity,

        // undocumented params are appended to the query string
        hello: "elasticsearch!"
    }, function (error) {
        console.log("Inside Document Controller .. Ping");
        if (error) {
            console.trace('elasticsearch cluster is down!');
            next(error);
        } else {
            client.search({
                    type: "attachment",
                    index: INDEX,
                    fields: ["title", "tresdedos", "hightlight"],
                    body: {
                        query: {
                            query_string: {
                                query: query
                            }
                        },
                        highlight: {
                            fields: {
                                file: {}
                            }
                        }
                    }
                },
                function (err, response) {
                    if (err) {
                        console.trace(error.message);
                        callback(err);
                        return;
                    }
                    console.log("response: ");
                    console.dir(response);
                    callback(err, response.hits.hits);
                });
            /*).then(function (body) {
             var hits = body.hits.hits;
             callback(null, hits);
             }, function (error) {
             console.trace(error.message);
             callback(error);
             });  */
        }
    });
};

exports.post = function post(files, callback) {
    console.log("Inside Document Controller .. Post");
    var filename = files.archivo.originalname;
    var base64data = new Buffer(files.archivo.buffer).toString('base64');
    client.create({
            index: INDEX,
            type: 'attachment',
            id: filename,
            body: {
                title: filename,
                file: base64data,
                tresdedos: "pruebita"
            }
        }
        , function (err, response) {
            if (err) {
                console.dir(err);
                callback(err);
                return;
            }
            console.log("response: ");
            console.dir(response);
            callback(err, response);
        });
};

exports.download = function download(params, callback) {
    console.log("Inside Document Controller .. Download");
    //TODO: Validar id (que exista por lo menos)
    client.get({
        index: INDEX,
        type: 'attachment',
        id: params.id,
        fields: ['title', '_source']
    }, function (err, response) {
        if (err) {
            console.dir(err);
            callback(err);
            return;
        }
        var filename = response._source.title || "Sin_Nombre";
        var base64data = response._source.file;
        var buffer = new Buffer(base64data, 'base64');

        var fullname = path.join('/tmp', filename);
        fs.writeFile(fullname, buffer, function (err) {
            if (err) return next(err);

            var mimetype = mime.lookup(filename);
            callback(err, filename, mimetype, fullname);

        });

    });
    /*.then(function (body) {
     }, function (error) {
     console.trace(error.message);
     next(error);
     });  */
};

