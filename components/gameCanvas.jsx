import { useEffect, useRef } from "react";
import socket from "../src/socket";

export default function GameCanvas({ room, localPlayer }) {
  const canvasRef = useRef(null);

  function throwKnife() {
    if (room.currentTurn !== localPlayer.id) return; // só seu turno

    const knife = { x: localPlayer.x, y: localPlayer.y + 30, width: 20, height: 10, direction: localPlayer.facing };
    
    // anima faca
    const interval = setInterval(() => {
      if (knife.direction === "right") knife.x += 10;
      else knife.x -= 10;

      const hitPlayer = room.players.find(p => p.id !== localPlayer.id && checkCollision(knife, p));
      if (hitPlayer) {
        socket.updateRoomState(room.id, {
          players: room.players.map(p => p.id === hitPlayer.id ? { ...p, health: p.health - 1 } : p),
          currentTurn: hitPlayer.id // alterna turno
        });

        if (hitPlayer.health <= 1) alert(`${hitPlayer.name} perdeu!`);
        clearInterval(interval);
      }

      if (knife.x < 0 || knife.x > 800) clearInterval(interval);
    }, 30);
  }

  function checkCollision(knife, player) {
    return knife.x < player.x + player.width &&
           knife.x + knife.width > player.x &&
           knife.y < player.y + player.height &&
           knife.y + knife.height > player.y;
  }

  // draw loop
  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    function draw() {
      ctx.clearRect(0, 0, 800, 600);
      room.players.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.width, p.height);

        // barra de vida
        ctx.fillStyle = "red";
        ctx.fillRect(p.x, p.y - 10, 40 * (p.health / 3), 5);
      });
      requestAnimationFrame(draw);
    }
    draw();
  }, [room]);

  return (
    <div>
      <canvas ref={canvasRef} width={800} height={600} style={{ border: "1px solid #fff" }} />
      <button onClick={throwKnife}>Atirar</button>
    </div>
  );
}
