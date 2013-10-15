var Generator = require("../Generator").Generator;

exports.run = function(server,hertz,burst) {
  var io = require('socket.io').listen(server);
  /*
  io.set('heartbeat timeout',10000);
  io.set('heartbeat interval',9000);
  io.set('close timeout', 9000);
  */
  io.set("log level", 1);
  
  io.sockets.on('connection', function(socket) {
    
    socket.emit("hertz", {t:hertz});
    
    var generator = new Generator(function(data) {
      socket.emit("timestamp", {t:data});
    },hertz,burst);

    socket.on('disconnect', function(){
      generator.stop();
    });
  });
  
};