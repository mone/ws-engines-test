var LOG_INTERVAL = 5000;

var Generator = function(hz,burst) {
  
  
  this.last = null;
  this.count = 0;
  this.interval = null;
  this.stopped = false;
  
  if (hz > 1000) {
    throw "Unsupported hz > 1000: use null to send as many events as possible";
  }
  
  this.hz = hz;
  if (!this.hz) {
    burst = burst || 1;
    process.maxTickDepth = burst;
  }
  
 
};



Generator.prototype = {
   
  setCallback: function(cb) {
    this.callback = cb;
    this.next();
  },
    
  next: function() {
    var t = this;
    if (!this.hz && !this.stopped) {
      process.nextTick(function() {
        t.write();
      });
    } else if (!this.interval) {
      var timeout = Math.floor(1000/this.hz);
      this.interval = setInterval(function() {
        t.write();
      },timeout);
    }
    
  },
  
  doWrite: function(timestamp) {
    var res = this.callback(timestamp);
    
    this.count++;
    return res;
  },
  
  write: function() {
    var now = new Date().getTime();
    if (!this.doWrite(now)) {
      //may be buffering events
    }
    
    if (this.lastLog) {
      if (now-this.lastLog > LOG_INTERVAL) {
        if (this.hz) {
          var expected = (LOG_INTERVAL / 1000) * this.hz;
          if (this.count != expected) {
            console.log("Sent " + this.count + " in the last " + LOG_INTERVAL + " millis (was expecting " + expected + ")");
          } else {
            console.log("Sent " + this.count + " in the last " + LOG_INTERVAL + " millis (as expected)");
          }
        } else {
          console.log("Sent " + this.count + " in the last " + LOG_INTERVAL + " millis");
        }
        
        this.lastLog = now;
        this.count = 0;
      }
    } else {
      this.lastLog = now;
    }
    
    this.next();
  },
  
  stop: function() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.stopped = true;
    
  }
    
};

exports.Generator = Generator;