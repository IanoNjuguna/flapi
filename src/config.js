define([], function(){
  return {
    canvas: { width: 360, height: 640 },
    physics: { gravity: 650, jumpImpulse: -320, maxFall: 550 }, // Lighter gravity for floatier feel
    pipes: { speed: 140, gap: 160, spawnInterval: 1700, minGap: 130, difficultyStep: 0.995 },
    visuals: { bgSpeed: [12, 24, 40] }
  };
});
