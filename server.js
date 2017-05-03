#!/usr/bin/env node
'use strict';

var https = require('https');
var http = require('http');
var path = require('path');
var port = process.argv[2] || 8034;
var insecurePort = process.argv[3] || 4008;
var fs = require('fs');
var checkip = require('check-ip-address');
var server;
var insecureServer;
var options;
var certsPath = path.join(__dirname, 'certs');

// SSL Certificates
options = {
  key: fs.readFileSync(path.join(certsPath, 'key.pem'))
  // This certificate should be a bundle containing your server certificate and any intermediates
  // cat certs/cert.pem certs/chain.pem > certs/server-bundle.pem
, cert: fs.readFileSync(path.join(certsPath, 'ee03b71b0476caf6.crt'))
  // ca only needs to be specified for peer-certificates
, ca: [ fs.readFileSync(path.join(certsPath, 'gd_bundle-ca1.crt')),fs.readFileSync(path.join(certsPath, 'gd-bundle-ca2.crt')),fs.readFileSync(path.join(certsPath, 'gd-bundle-ca3.crt')) ]
, requestCert: false
, rejectUnauthorized: true

};

options.agent = new https.Agent(options);

// Serve an Express App securely with HTTPS
server = https.createServer(options);
checkip.getExternalIp().then(function (ip) {

var host = ip || 'local.helloworld3000.com';

  function listen(app) {
    server.on('request', app);
    server.listen(port, function () {
      port = server.address().port;
      console.log('Listening on https://127.0.0.1:' + port);
      console.log('Listening on https://local.helloworld3000.com:' + port);
      if (ip) {
        console.log('Listening on https://' + ip + ':' + port);
      }
    });
  }

  var publicDir = path.join(__dirname, 'public');
  var app = require('./app').create(server, host, port, publicDir);
  listen(app);
});