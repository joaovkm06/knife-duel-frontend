// pages/sala/buscar.jsx
"use client";
import  { useEffect, useState } from "react";
import socket from "../../src/socket";
import { useRouter } from "next/navigation";



function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export default function BuscarPartida() {
  const [rooms, setRooms] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Carregar salas já existentes
    setRooms(socket.listRooms().filter(r => !r.started));

    // Quando uma sala for criada
    const unsubCreate = socket.on("room_created", ({ room }) => {
      setRooms(prev => [...prev, room].filter(r => !r.started));
    });

    // Quando uma sala for atualizada (player entrou/saiu, começou jogo etc)
    const unsubUpdate = socket.on("room_updated", ({ room }) => {
      setRooms(prev =>
        prev.map(r => (r.id === room.id ? room : r)).filter(r => !r.started)
      );
    });

    return () => {
      unsubCreate();
      unsubUpdate();
    };
  }, []);

  function handleEnter(room) {
    if (room.started) {
      alert("Essa sala já começou. Tente outra.");
      return;
    }

    if (room.password) {
      const pw = prompt("Sala com senha. Digite a senha:");
      if (pw !== room.password) {
        alert("Senha incorreta");
        return;
      }
    }

    const playerId = uid();
    const playerName = `J${Math.floor(Math.random() * 9000 + 1000)}`;
    const player = {
      id: playerId,
      name: playerName,
      color: ["#0066ff", "#ff3333", "#ffaa00", "#22aa88"][Math.floor(Math.random() * 4)],
      x: room.players.length === 0 ? 120 : 680,
      y: 440,
      width: 40,
      height: 60,
    };

    socket.joinRoom(room.id, player);

    router.push(`/jogo/${room.id}`);
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Buscar Partida</h2>

      {rooms.length === 0 && <p>Nenhuma sala disponível</p>}

      <ul>
        {rooms.map((r) => (
          <li key={r.id} style={{ marginBottom: 8 }}>
            <strong>{r.name}</strong> — players: {r.players.length} {r.password ? "🔒" : ""}
            <button style={{ marginLeft: 8 }} onClick={() => handleEnter(r)}>
              Entrar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
