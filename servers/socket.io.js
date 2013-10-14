exports.run = function(server,generator,hertz) {
  var io = require('socket.io').listen(server);
  /*
  io.set('heartbeat timeout',10000);
  io.set('heartbeat interval',9000);
  io.set('close timeout', 9000);
  */
  io.set("log level", 1);
  
  io.sockets.on('connection', function(socket) {
    
    socket.emit("hertz", {t:hertz});
    
    generator.setCallback(function(data) {
      socket.emit("timestamp", {t:data});
    });

    socket.on('disconnect', function(){
      g.stop();
    });
  });
  
};