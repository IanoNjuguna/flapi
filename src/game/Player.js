define([], function(){
  function Player(x,y,phys){ this.x=x; this.y=y; this.vy=0; this.phys=phys; this.r=18; }
  Player.prototype.flap = function(){ this.vy = this.phys.jumpImpulse; };
  Player.prototype.update = function(dt, canvasH){
    this.vy += this.phys.gravity * dt; if(this.vy>this.phys.maxFall) this.vy=this.phys.maxFall; this.y += this.vy*dt;
    if(this.y < this.r){ this.y=this.r; this.vy=0; }
    if(this.y > canvasH - this.r){ this.y = canvasH - this.r; this.vy=0; }
  };
  Player.prototype.getAABB = function(){ return { x:this.x-this.r, y:this.y-this.r, w:this.r*2, h:this.r*2 }; };
  Player.prototype.draw = function(ctx){
    // Jack o' Lantern pumpkin
    ctx.save(); ctx.translate(this.x, this.y);
    var t = Date.now() * 0.003;
    var bob = Math.sin(t * 2) * 2; // Subtle bobbing
    
    // Glow aura
    ctx.shadowBlur = 20;
    ctx.shadowColor = "rgba(255, 140, 66, 0.6)";
    
    // Pumpkin body
    ctx.fillStyle = "#FF8C42";
    ctx.strokeStyle = "#d97028";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, bob, this.r * 1.1, this.r, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    // Pumpkin ridges
    ctx.strokeStyle = "#d97028";
    ctx.lineWidth = 1.5;
    for (var i = -2; i <= 2; i++) {
      ctx.beginPath();
      ctx.moveTo(i * this.r * 0.3, bob - this.r * 0.8);
      ctx.quadraticCurveTo(i * this.r * 0.35, bob, i * this.r * 0.3, bob + this.r * 0.8);
      ctx.stroke();
    }
    
    // Stem on top
    ctx.fillStyle = "#4a5c2a";
    ctx.strokeStyle = "#2a3a1a";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-this.r * 0.15, bob - this.r * 0.9);
    ctx.lineTo(-this.r * 0.1, bob - this.r * 1.2);
    ctx.lineTo(this.r * 0.1, bob - this.r * 1.2);
    ctx.lineTo(this.r * 0.15, bob - this.r * 0.9);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Glowing triangular eyes
    ctx.shadowBlur = 15;
    ctx.shadowColor = "rgba(255, 200, 0, 0.9)";
    ctx.fillStyle = "#ffcc00";
    
    // Left eye
    ctx.beginPath();
    ctx.moveTo(-this.r * 0.5, bob - this.r * 0.25);
    ctx.lineTo(-this.r * 0.25, bob - this.r * 0.5);
    ctx.lineTo(-this.r * 0.15, bob - this.r * 0.25);
    ctx.closePath();
    ctx.fill();
    
    // Right eye
    ctx.beginPath();
    ctx.moveTo(this.r * 0.15, bob - this.r * 0.25);
    ctx.lineTo(this.r * 0.25, bob - this.r * 0.5);
    ctx.lineTo(this.r * 0.5, bob - this.r * 0.25);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Triangular nose
    ctx.fillStyle = "#ffcc00";
    ctx.beginPath();
    ctx.moveTo(-this.r * 0.1, bob);
    ctx.lineTo(0, bob - this.r * 0.2);
    ctx.lineTo(this.r * 0.1, bob);
    ctx.closePath();
    ctx.fill();
    
    // Spooky jagged grin
    ctx.shadowBlur = 12;
    ctx.shadowColor = "rgba(255, 200, 0, 0.9)";
    ctx.fillStyle = "#ffcc00";
    ctx.strokeStyle = "#d97028";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-this.r * 0.6, bob + this.r * 0.2);
    // Jagged teeth
    ctx.lineTo(-this.r * 0.5, bob + this.r * 0.35);
    ctx.lineTo(-this.r * 0.4, bob + this.r * 0.2);
    ctx.lineTo(-this.r * 0.25, bob + this.r * 0.4);
    ctx.lineTo(-this.r * 0.1, bob + this.r * 0.2);
    ctx.lineTo(0, bob + this.r * 0.45);
    ctx.lineTo(this.r * 0.1, bob + this.r * 0.2);
    ctx.lineTo(this.r * 0.25, bob + this.r * 0.4);
    ctx.lineTo(this.r * 0.4, bob + this.r * 0.2);
    ctx.lineTo(this.r * 0.5, bob + this.r * 0.35);
    ctx.lineTo(this.r * 0.6, bob + this.r * 0.2);
    // Bottom of mouth
    ctx.quadraticCurveTo(this.r * 0.5, bob + this.r * 0.6, 0, bob + this.r * 0.65);
    ctx.quadraticCurveTo(-this.r * 0.5, bob + this.r * 0.6, -this.r * 0.6, bob + this.r * 0.2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    ctx.restore();
  };
  return Player;
});
