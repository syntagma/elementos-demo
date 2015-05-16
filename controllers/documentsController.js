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
exports.search = function search (query, callback) {
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
                fields: ["title", "hightlight"],
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
            }).then(function (body) {
                var hits = body.hits.hits;
                callback(null, hits);
            }, function (error) {
                console.trace(error.message);
                callback(error);
            });
        }
    });
};



