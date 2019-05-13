var static = require('node-static'),
  file = new static.Server('./dist'),
  port = process.env.PORT || 9000;

require('http').createServer(function(request, response) {
  request.addListener('end', function() {
    console.log(request.method, request.url);
    file.serve(request, response);
  }).resume();
}).listen(port);
