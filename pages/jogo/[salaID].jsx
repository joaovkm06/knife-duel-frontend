"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import socket from "../../src/socket";
import GameCanvas from "../../components/gameCanvas";





function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function randomColor() {
  const colors = ["#0066ff", "#ff3333", "#ffaa00", "#22aa88"];
  return colors[Math.floor(Math.random() * colors.length)];
}

export default function SalaPage() {
  const router = useRouter();
  const pathname = usePathname();
  const salaID = pathname?.split("/").pop();

  const [room, setRoom] = useState(null);
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    if (!salaID) return;

    // pega salas atuais
    const rooms = socket.listRooms();
    const r = rooms.find((x) => x.id === salaID);

    if (!r) {
      alert("Sala não encontrada");
      router.push("/sala");
      return;
    }

    // seta sala inicial
    setRoom({ ...r });

    const myPlayer = {
      id: uid(),
      name: `J${Math.floor(Math.random() * 9000 + 1000)}`,
      color: randomColor(),
      x: r.players.length === 0 ? 120 : 680,
      y: 440,
      width: 40,
      height: 60,
      facing: r.players.length === 0 ? "right" : "left",
      health: 3,
    };

    // guarda player local
    setPlayer(myPlayer);

    // entra na sala
    socket.joinRoom(salaID, myPlayer);

    // se não tem turno, define
    if (!r.currentTurn) {
      socket.updateRoomState(salaID, { currentTurn: myPlayer.id });
    }

    // escuta updates em tempo real
    const unsub = socket.on("room_updated", ({ room: updated }) => {
      if (updated.id === salaID) {
        setRoom({ ...updated }); // força atualização
      }
    });

    return () => {
      socket.leaveRoom(salaID, myPlayer.id);
      unsub();
    };

  }, [salaID, router]);

  if (!room || !player) return <div>Carregando sala...</div>;

  return <GameCanvas room={room} localPlayer={player} />;
}
