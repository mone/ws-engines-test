define([],function() {
  
  var Stats = function(logInterval) {
    this.div = document.createElement("div");
    document.body.appendChild(this.div);
    
    this.lastLog = null;
    this.hz = null;
    this.count = 0;
    this.expectingCount = 0;
    
    this.logInterval = logInterval;
    
  };
  
  Stats.prototype = {
    
    timestamp: function(ts,count) {
      this.div.innerHTML = ts;
      this.count++;
      
      if (this.expectingCount) {
        
        var diff = count - this.expectingCount;
        if (diff > 0) {
          console.log(diff + " lost messages");
        }
        
      }
      this.expectingCount = count+1;
      
      
      var now = new Date().getTime();
      
      if (this.lastLog) {
        if (now-this.lastLog > this.logInterval) {
          
          var diff = now - ts;
          console.log("Current delay = " + diff);
          
          if (this.hz) {
            var expected = (this.logInterval / 1000) * this.hz;
            if (this.count != expected) {
              console.log("Received " + this.count + " in the last " + this.logInterval + " millis (was expecting " + expected + ")");
            } else {
              console.log("Received " + this.count + " in the last " + this.logInterval + " millis (as expected)");
            }
          } else {
            console.log("Received " + this.count + " in the last " + this.logInterval + " millis");
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