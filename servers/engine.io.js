var Generator = require("../Generator").Generator;

exports.run = function(server,logInterval,hertz,burst) {
  var engine = require('engine.io');
  eio = engine.attach(server);

  eio.on('connection', function (socket) {
    socket.send(logInterval);
    socket.send(hertz);

    var generator = new Generator(function(data) {
      //says it implements the Stream interface but does not tell if it ever returns false and/or what to do in such case.
      socket.send(data);
    },logInterval,hertz,burst);
    
    socket.on('close', function () { 
      generator.stop();
    });
  });
  
};