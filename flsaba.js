var express = require('express');
var path = require('path');
var fs = require('fs');
var filewalker = require('filewalker');

var app = express();


app.get('/:fdpath(*)', function(req, res, next){
  var _path = path.join(app.get('flsabaDir'), req.params.fdpath);
    fs.exists(_path, function (exist) {
        if(exist){
            fs.stat(_path, function (err, stats) {
                if(stats.isFile()){
                    res.download(_path);
                }else{
                    filewalker(_path, { recursive: false })
                    .on('file', function (p, s, a) {
                        res.write('<a href="' + p + '">' + p + '</a><br>');
                    })
                    .on('dir', function(p) {
                        res.write('<a href="' +  p + "/" +'">' + p + '</a><br>');
                    })
                    .on('error', function(err) {
                        console.log("File error: " + err);
                    })
                    .on('done', function() {
                        res.write("<p>Files found: " + this.files + '</p>');
                        res.end();
                    })
                    .walk();
                }
            });
        }else{
            res.status(404);
            res.send("Nothing Exists here.");
        }
    });
});

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.send(JSON.stringify({
            message: err.message,
            error: err
        }));
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
});


module.exports = app;
