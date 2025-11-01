define([], function(){
  function rand(min,max){ return Math.random()*(max-min)+min; }
  function PipeManager(w,h,cfg,onPass){ this.w=w; this.h=h; this.cfg=Object.assign({},cfg); this.onPass=onPass; this.items=[]; this.spawnT=0; }
  PipeManager.prototype.update = function(dt, speed){
    this.spawnT += dt*1000; if(this.spawnT >= this.cfg.spawnInterval){ this.spawnT=0; this.spawn(); }
    for(var i=this.items.length-1;i>=0;i--){ var p=this.items[i]; p.x -= speed*dt; if(!p.passed && p.x + p.w < p.px){ p.passed=true; this.onPass && this.onPass(); }
      if(p.x + p.w < 0){ this.items.splice(i,1); }
    }
    // Slight difficulty scaling
    this.cfg.gap = Math.max(this.cfg.minGap, this.cfg.gap * this.cfg.difficultyStep);
  };
  PipeManager.prototype.spawn = function(){
    var gap = this.cfg.gap; var topH = rand(50, this.h - 200); var botY = topH + gap; var pipeW=60;
    this.items.push({ x:this.w+10, w:pipeW, top:{ y:0, h:topH }, bottom:{ y:botY, h:this.h-botY }, px:80, passed:false });
  };
  PipeManager.prototype.collides = function(aabb){
    for(var i=0;i<this.items.length;i++){ var p=this.items[i];
      var top = { x:p.x, y:p.top.y, w:p.w, h:p.top.h };
      var bot = { x:p.x, y:p.bottom.y, w:p.w, h:p.bottom.h };
      if(intersects(aabb, top) || intersects(aabb, bot)) return true;
    } return false;
  };
  PipeManager.prototype.draw = function(ctx){
    ctx.save();
    for(var i=0;i<this.items.length;i++){ 
      var p=this.items[i];
      var isGrave = i % 2 === 0;
      
      if (isGrave) {
        // Gravestone
        this.drawGravestone(ctx, p.x + p.w/2, p.top.h, true); // top
        this.drawGravestone(ctx, p.x + p.w/2, p.bottom.y, false); // bottom
      } else {
        // Upside down cross
        this.drawCross(ctx, p.x + p.w/2, p.top.h, true); // top
        this.drawCross(ctx, p.x + p.w/2, p.bottom.y, false); // bottom
      }
    }
    ctx.restore();
  };
  
  PipeManager.prototype.drawGravestone = function(ctx, x, y, isTop){
    var w = 50, h = isTop ? y : 800; // Extend to edge like Flappy Bird pipes
    ctx.save();
    ctx.translate(x, isTop ? 0 : y);
    
    // Stone base (tall pipe)
    ctx.fillStyle = "#3a3a42";
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 2;
    ctx.fillRect(-w/2, 0, w, h);
    ctx.strokeRect(-w/2, 0, w, h);
    
    // Rounded tombstone cap at the end
    var capY = h - 50;
    ctx.beginPath();
    ctx.moveTo(-w/2, capY);
    ctx.lineTo(-w/2, h - 15);
    ctx.arcTo(-w/2, h, 0, h, 15);
    ctx.arcTo(w/2, h, w/2, h - 15, 15);
    ctx.lineTo(w/2, capY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Multiple cracks along the tall pipe
    ctx.strokeStyle = "#2a2a2a";
    ctx.lineWidth = 1;
    for (var c = 0; c < Math.floor(h / 100); c++) {
      var crackY = c * 100 + 30;
      ctx.beginPath();
      ctx.moveTo(-w/3, crackY);
      ctx.lineTo(-w/4, crackY + 20);
      ctx.moveTo(w/4, crackY + 10);
      ctx.lineTo(w/3, crackY + 30);
      ctx.stroke();
    }
    
    // RIP text on cap
    ctx.fillStyle = "#8a7a7a";
    ctx.font = "bold 12px serif";
    ctx.textAlign = "center";
    ctx.fillText("R.I.P", 0, h - 25);
    
    // Blood drips on cap
    ctx.strokeStyle = "#8b0000";
    ctx.lineWidth = 2;
    var drips = [
      {x: -w/4, y: h - 20, len: 8},
      {x: w/4, y: h - 22, len: 12},
      {x: 0, y: h - 18, len: 6}
    ];
    for (var i = 0; i < drips.length; i++) {
      ctx.beginPath();
      ctx.moveTo(drips[i].x, drips[i].y);
      ctx.lineTo(drips[i].x, drips[i].y + drips[i].len);
      ctx.stroke();
      // Blood drop
      ctx.fillStyle = "#8b0000";
      ctx.beginPath();
      ctx.arc(drips[i].x, drips[i].y + drips[i].len, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  };
  
  PipeManager.prototype.drawCross = function(ctx, x, y, isTop){
    var w = 40, h = isTop ? y : 800; // Extend to edge like pipes
    ctx.save();
    ctx.translate(x, isTop ? 0 : y);
    if (!isTop) { ctx.rotate(Math.PI); }
    
    // Tall vertical beam (pipe-like)
    ctx.fillStyle = "#2a1a1a";
    ctx.strokeStyle = "#1a0a0a";
    ctx.lineWidth = 2;
    ctx.fillRect(-w/6, 0, w/3, h);
    ctx.strokeRect(-w/6, 0, w/3, h);
    
    // Horizontal beam at the end (creates cross shape at bottom/top)
    var crossY = h - 50;
    ctx.fillRect(-w/2, crossY, w, w/3);
    ctx.strokeRect(-w/2, crossY, w, w/3);
    
    // Blood splatter along the pipe
    ctx.fillStyle = "#8b0000";
    for (var s = 0; s < Math.floor(h / 80); s++) {
      for (var i = 0; i < 3; i++) {
        var bx = (Math.random() - 0.5) * w * 0.4;
        var by = s * 80 + Math.random() * 60;
        var br = Math.random() * 2 + 1;
        ctx.beginPath();
        ctx.arc(bx, by, br, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Dripping blood on cross beam
    ctx.strokeStyle = "#8b0000";
    ctx.lineWidth = 2;
    for (var d = 0; d < 3; d++) {
      var dx = (d - 1) * w/4;
      ctx.beginPath();
      ctx.moveTo(dx, crossY + w/3);
      ctx.lineTo(dx, crossY + w/3 + 15);
      ctx.stroke();
      ctx.fillStyle = "#8b0000";
      ctx.beginPath();
      ctx.arc(dx, crossY + w/3 + 15, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  };
  function intersects(a,b){ return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y; }
  return PipeManager;
});
