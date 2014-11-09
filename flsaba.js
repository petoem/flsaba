var express = require('express');
var path = require('path');
var fs = require('fs');
var filewalker = require('filewalker');
var pretty = require('prettysize');
var mime = require('mime');
var multer = require('multer');

var app = express();

app.use(multer({dest: './tmp/'}));

app.set('flsabaCssURL', Math.random().toString()); //generate random CSS URL
app.set('flsabaUploadURL', Math.random().toString()); //generate random Upload URL
app.set('flsabaDropZoneJS', fs.readFileSync('./lib/dropzone.min.js', {flags: 'r', encoding: 'utf-8'}) + ' ' + fs.readFileSync('./lib/upload.js', {flags: 'r', encoding: 'utf-8'}));

app.get('/'+ app.get('flsabaCssURL'), function(req, res, next){
    res.set('Content-Type', 'text/css');
    res.sendfile(app.get('flsabaCSSpath'));
});

app.post('/' + app.get('flsabaUploadURL') + '/:uploadDir', function(req, res, next){
    var uploadToDir = new Buffer(req.params.uploadDir, 'base64').toString('utf-8');
    var uploadFilename = req.files.uploadedFile.originalname;
    var tmpfilepath = './tmp/' + req.files.uploadedFile.name;

    var _path = path.join(app.get('flsabaDir'), uploadToDir);
    fs.exists(_path + uploadFilename, function (exist) {
        if(!exist){
            var source = fs.createReadStream(tmpfilepath);
            var dest = fs.createWriteStream(_path + uploadFilename);
            source.pipe(dest); // Copy to Destination
            source.on('end', function() {
                res.send('OK');
                fs.unlinkSync(tmpfilepath);
            });
            source.on('error', function(err) {
                console.log(err);
                fs.unlinkSync(tmpfilepath);
                res.status(500);
            });
        }else{
            res.status(500);
            res.send('Error: File Exists');
            fs.unlinkSync(tmpfilepath);
        }
    });
});

app.get('/:fdpath(*)', function(req, res, next){
    var _path = path.join(app.get('flsabaDir'), req.params.fdpath);
    var url = req.url;
    fs.exists(_path, function (exist) {
        if(exist){
            fs.stat(_path, function (err, stats) {
                if(stats.isFile()){
                    res.set('Content-Type', mime.lookup(_path));
                    if(app.get('flsabaForceDL')){res.download(_path);}else{res.sendfile(_path);};
                }else{
                    res.set('Content-Type', 'text/html');
                    res.write('<link rel="stylesheet" href="/' + app.get('flsabaCssURL') + '">');
                    res.write("<p>" + req.url + '</p>');
                    filewalker(_path, { recursive: false })
                    .on('file', function (p, s, a) {
                        res.write('<p class="file"><a href="' + p + '">' + p + '</a> <span class="pull-right">' + pretty(s.size) + '</span></p>');
                    })
                    .on('dir', function(p) {
                        res.write('<p class="directory"><a href="' +  p + "/" +'">' + p + '</a></p>');
                    })
                    .on('error', function(err) {
                        console.log("File error: " + err);
                    })
                    .on('done', function() {
                        res.write("<p>Files found: " + this.files + ' <a id="btnUpload" class="pull-right">Upload</a> <span id="progValue" class="pull-right"></span></p>');
                        res.write('<p id="footer">flSaba ' + require('./package.json').version + '<br><a href="https://github.com/petoem/flsaba">Source Code on Github</a></p>');
                        res.write('<progress value="" max="100" id="progressBar"></progress>');
                        var dropzoneJSCode = app.get('flsabaDropZoneJS').replace('#{uploadDIRPlaceHolder}', '/' + app.get('flsabaUploadURL') + '/' + new Buffer(url).toString('base64'));
                        res.write('<script type="text/javascript">' + dropzoneJSCode + '</script>');
                        res.end();
                    })
                    .walk();
                }
            });
        }else{
            res.set('Content-Type', 'text/html');
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
