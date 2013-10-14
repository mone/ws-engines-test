define([],function() {
  
  var Stats = function() {
    this.div = document.createElement("div");
    document.body.appendChild(this.div);
    
    
  };
  
  Stats.prototype = {
    
    timestamp: function(ts) {
      this.div.innerHTML = ts;
      
      
      
    },
    
    hertz: function(hz) {
      this.hz = hz;
    }
      
  };
  
  return Stats;
  
});