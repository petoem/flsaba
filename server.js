var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');

var pretty = require('prettysize');
var mime = require('mime-types')

var app = http.createServer((req, res) => {
  res.setHeader('X-Powered-By', require('./package.json').name + ' v' + app.template.get('program_version'));
  var pathname = decodeURIComponent(url.parse(req.url).pathname);
  var directory = path.join(app.settings.get('dir'), pathname);
  fs.access(directory, fs.constants.F_OK | fs.constants.R_OK, (err) => {
    if(err){
      res.setHeader('Content-Type', 'text/html');
      res.statusCode = 404;
      res.end("Nothing Exists here.");
      return;
    }

    var stat = fs.statSync(directory);
    if(stat.isFile()){
      res.setHeader('Content-Type', mime.lookup(directory) || 'application/octet-stream');
      if(app.settings.get('forcedl')){
        res.setHeader('Content-disposition', 'attachment; filename=' + path.basename(directory));
      }
      if(typeof req.headers.range === 'undefined'){
        res.setHeader('Content-Length', stat.size);
        res.statusCode = 200;
        fs.createReadStream(directory).pipe(res);
      }else{
        var range = req.headers.range.replace(/bytes=/, "").split("-");
        var start = parseInt(range[0], 10);
        var end = range[1] ? parseInt(range[1], 10) : stat.size-1;
        var size = (end - start)+1;
        res.statusCode = 206;
        res.setHeader('Content-Range', 'bytes ' + start + '-' + end + '/' + stat.size);
        res.setHeader('Accept-Ranges', 'bytes');
        res.setHeader('Content-Length', size);
        fs.createReadStream(directory, {start: start, end: end}).pipe(res);
      }
      return; // for safety
    }

    if(stat.isDirectory()){
      var listing = [];
      listing.push("<p>" + pathname + '</p>');
      if(pathname !== '/'){
        listing.push('<p class="directory"><a href="../">..</a></p>');
      }
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.statusCode = 200;

      var dir = fs.readdirSync(directory).sort();
      dir.filter((elem) => {
        return fs.statSync(path.join(directory, elem)).isDirectory();
      }).forEach((elem, index, array) => {
        listing.push('<p class="directory"><a href="' +  path.join(pathname, elem) + "/" +'">' + elem + '</a></p>');
      });

      dir.filter((elem) => {
        return fs.statSync(path.join(directory, elem)).isFile();
      }).forEach((elem, index, array) => {
        listing.push('<p class="file"><a href="' + path.join(pathname, elem) + '">' + elem + '</a> <span class="pull-right">' + pretty(fs.statSync(path.join(directory, elem)).size) + '</span></p>');
      });

      listing.push('<p>' + dir.length + ((dir.length != 0) ? ' objects' : ' object') + '</p>');
      listing.push('<p id="footer">flsaba ' + app.template.get('program_version') + '<br><a href="https://github.com/petoem/flsaba">Source Code on Github</a></p>');

      app.template.set('directory_name', pathname);
      app.template.set('directory_listing', listing.join(require('os').EOL));

      var response = app.template.get('template_html');
      app.template.forEach((value, key, map) => {
        response = response.replace('{{#' + key + '}}', value);
      });
      res.end(response, {encoding:'utf8'});
    }
  });
});

app.on('error', function(err) {
  console.error(err);
});

app.settings = new Map();
app.template = new Map();

module.exports = app;
