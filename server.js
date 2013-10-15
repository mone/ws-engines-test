if (process.argv.length < 4) {
  console.error("Missing parameters");
  
  console.log("Usage:");
  console.log("node server.js port engine hertz [burst]");
  console.log("  port: to listen to");
  console.log("  engine: is one of 'sockjs', 'socket.io' or 'engine.io'");
  console.log("  hertz: is the number of update per second (1000 as max value) or 0 to send as many events as possible");
  console.log("  [burst]: if hertz is 0 burst tells how many events generate before giving the cpu to rest of the app (see process.maxTickDepth)");
  
  
  process.exit(1);
}

var engine = {
  "sockjs": true,
  "socket.io": true,
  "engine.io": true
};

var hertz = null;
var burst = null;
var port = null;

process.argv.forEach(function (val, index, array) {
  if (index <= 1) {
    return;
  } else if (index == 2) {
    port = val;
    if (isNaN(port) || port<1 || port>65535) {
      console.error("port must be a number between 1 and 65535 (lower ports may require root permissions)");
      process.exit(1);
    }
    
  } else if (index == 3) {
    if (!(val in engine)) {
      console.error("Wrong engine specified");
      process.exit(1);
    }
    engine = val;
  } else if (index == 4) {
    hertz = parseInt(val);
    if (isNaN(hertz) || hertz>1000 || hertz<0) {
      console.error("hertz must be a positive integer <=1000");
      process.exit(1);
    }
  } else if (index == 5) {
    burst = parseInt(val);
    if (isNaN(burst) || burst<0) {
      console.error("burst must be a positive integer");
      process.exit(1);
    }
    
  }
});



var app = require('express')();
var server = require('http').createServer(app);

require("./servers/"+engine+".js").run(server,hertz,burst);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/html/'+engine+'.html');
});
app.get('/require.js', function (req, res) {
  res.sendfile(__dirname + '/html/require.js');
});
app.get('/engine.io.js', function (req, res) {
  res.sendfile(__dirname + '/html/engine.io.js');
});
app.get('/Stats.js', function (req, res) {
  res.sendfile(__dirname + '/html/Stats.js');
});

server.listen(port);

