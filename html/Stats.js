define([],function() {
  
  var LOG_INTERVAL = 5000;
  
  var Stats = function() {
    this.div = document.createElement("div");
    document.body.appendChild(this.div);
    
    this.lastLog = null;
    this.hz = null;
    this.count = 0;
    
  };
  
  Stats.prototype = {
    
    timestamp: function(ts) {
      this.div.innerHTML = ts;
      this.count++;
      
      
      var now = new Date().getTime();
      
      if (this.lastLog) {
        if (now-this.lastLog > LOG_INTERVAL) {
          
          var diff = now - ts;
          console.log("Current delay = " + diff);
          
          if (this.hz) {
            var expected = (LOG_INTERVAL / 1000) * this.hz;
            if (this.count != expected) {
              console.log("Received " + this.count + " in the last " + LOG_INTERVAL + " millis (was expecting " + expected + ")");
            } else {
              console.log("Received " + this.count + " in the last " + LOG_INTERVAL + " millis (as expected)");
            }
          } else {
            console.log("Received " + this.count + " in the last " + LOG_INTERVAL + " millis");
          }
          
          this.lastLog = now;
          this.count = 0;
        }
      } else {
        this.lastLog = now;
      }
      
      
    },
    
    hertz: function(hz) {
      this.hz = hz;
    }
      
  };
  
  return Stats;
  
});