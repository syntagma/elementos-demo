var express = require('express');
var router = express.Router();
var documentsController = require("../controllers/documentsController");
var fs = require('fs');

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

router.post('/insert', function (req, res, next) {
    console.log("Inside Document Route .. insert");

    documentsController.post({ 
        files: req.files,
        nroPoliza: req.body.nroPoliza
    }, function (err, response) {
        if (err) {
            next(err);
        } else {
            res.send(response);
        }
    });
});

router.get('/download', function (req, res, next) {
    console.log("Inside Document Route .. download");
    documentsController.download(req.query, function (err, filename, mimetype, fullname) {
        if (err) {
            next(err);
        } else {
            res.setHeader('Content-disposition', 'attachment; filename=' + filename);
            res.setHeader('Content-type', mimetype);

            var filestream = fs.createReadStream(fullname);
            filestream.pipe(res);

        }
    });
});

module.exports = router;
