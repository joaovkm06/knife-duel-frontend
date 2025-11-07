// components/player.jsx
"use client";
import React from "react";

export default function Player({ ctx, player }) {
  if (!ctx || !player) return null;

  const { x, y, width = 40, height = 60, color = "#00aaff", name } = player;

  // desenha corpo
  ctx.fillStyle = color;
  ctx.fillRect(x - width / 2, y - height, width, height);

  // cabeça
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(x, y - height - 10, 10, 0, Math.PI * 2);
  ctx.fill();

  // nome acima
  ctx.fillStyle = "#000";
  ctx.font = "12px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(name || "Player", x, y - height - 18);

  return null;
}
