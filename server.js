var helloRouter = require('./hello.router');
var testRouter = require('./test.router');

var restify = require('restify');
var server = restify.createServer();

helloRouter.applyRoutes(server);
testRouter.applyRoutes(server);

server.listen(5000, function () {
  console.log('%s listening at %s', server.name, server.url);
});