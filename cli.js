#!/usr/bin/env node

var program = require('commander');
var flsaba = require('./flsaba.js');

program
  .version('0.0.1')
  .option('-p, --port <n>', 'Port to listen on (default: 3000)', parseInt)
  .option('-d, --dir [value]', 'Directory to serve files from (default: current working Directory)')
  .parse(process.argv);

flsaba.set('port', program.port || 3000);
flsaba.set('flsabaDir', program.dir || process.cwd());

var server = flsaba.listen(flsaba.get('port'), function() {
  console.log('flSaba server listening on port ' + server.address().port);
  console.log('Directory: ' + flsaba.get('flsabaDir'));
});