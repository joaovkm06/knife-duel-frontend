import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import socket from '../../src/socket';

export default function CriarSala() {
  const router = useRouter();
  const [roomName, setRoomName] = useState('');
  const [usePassword, setUsePassword] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Quando a sala for criada, redireciona
    const off = socket.on('room_created', ({ room }) => {
      if (!room?.id) return;
      router.push(`/jogo/${room.id}`);
    });

    return () => off();
  }, [router]);

  function submit(e) {
    e.preventDefault();

    const roomId = Math.random().toString(36).substr(2, 9);

    socket.createRoom({
      id: roomId,
      name: roomName || 'Sala sem nome',
      password: usePassword ? password : null,
      players: [],
      started: false,
      currentTurn: null
    });

    router.push(`/jogo/${roomId}`);
  }

  return (
    <div style={{ textAlign: 'center', marginTop: 50 }}>
      <h2>Criar Sala</h2>

      <form onSubmit={submit}>
        <input
          placeholder='Nome da sala'
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <br /><br />

        <label>
          <input
            type='checkbox'
            checked={usePassword}
            onChange={() => setUsePassword(!usePassword)}
          /> Sala com senha
        </label>
        <br /><br />

        {usePassword && (
          <input
            type='password'
            placeholder='Senha'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        )}
        <br /><br />

        <button type='submit'>Criar Sala</button>
      </form>

      <br />

      <button onClick={() => router.push('/')}>Voltar</button>
    </div>
  );
}