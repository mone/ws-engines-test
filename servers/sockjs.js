var Generator = require("../Generator").Generator;

exports.run = function(server,hertz,burst) {
  var sockjs = require('sockjs');
  
  var sjs = sockjs.createServer(/*{
    heartbeat_delay: 25000 
    disconnect_delay: 9000 
  }*/);
  sjs.on('connection', function(conn) {
    conn.write(hertz);
    
    var generator = new Generator(function(data) {
      //says it implements the Stream interface but does not tell if it ever returns false and/or what to do in such case.
      conn.write(data);
    },hertz,burst);

    conn.on('close', function() {
      generator.stop();
    });
  });

  
  
  sjs.installHandlers(server, {prefix:'/sockjs'});
  
};