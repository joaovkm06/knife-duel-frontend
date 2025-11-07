class LocalSocket {
  constructor() {
    this.rooms = [];
    this.listeners = {};
    this.playerRooms = new Map();
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }

  _setRooms(rooms) {
    this.rooms = rooms;
  }

  // ✅ Criar sala sempre com players e notificar quem está na busca
  createRoom(room) {
    const newRoom = {
      ...room,
      players: []
    };

    const rooms = [...this.rooms, newRoom];
    this._setRooms(rooms);

    this.emit("room_created", { room: newRoom });
    this.emit("rooms_changed", rooms); // 👈 necessário para aparecer na busca
  }

  listRooms() {
    return [...this.rooms];
  }

  updateRoom(roomId, patch) {
    const rooms = [...this.rooms];
    const idx = rooms.findIndex(r => r.id === roomId);
    if (idx === -1) return;

    Object.assign(rooms[idx], patch);
    this._setRooms(rooms);

    this.emit("room_updated", { roomId, room: rooms[idx] });
    this.emit("rooms_changed", rooms); // 👈 atualiza lobby também
  }

  updateRoomState(roomId, patch) {
    this.updateRoom(roomId, patch);
  }

  joinRoom(roomId, player) {
    const rooms = [...this.rooms];
    const idx = rooms.findIndex(r => r.id === roomId);
    if (idx === -1) return;

    rooms[idx].players = rooms[idx].players || [];
    rooms[idx].players.push(player);

    this.playerRooms.set(player.id, roomId);
    this._setRooms(rooms);

    this.emit("player_joined", { roomId, player });
    this.emit("room_updated", { roomId, room: rooms[idx] });
    this.emit("rooms_changed", rooms); // 👈 aparece na lista com players atualizados
  }

  leaveRoom(roomId, playerId) {
    const rooms = [...this.rooms];
    const idx = rooms.findIndex(r => r.id === roomId);
    if (idx === -1) return;

    rooms[idx].players = rooms[idx].players.filter(p => p.id !== playerId);

    this.playerRooms.delete(playerId);
    this._setRooms(rooms);

    this.emit("player_left", { roomId, playerId });
    this.emit("room_updated", { roomId, room: rooms[idx] });
    this.emit("rooms_changed", rooms); // 👈 remove player da lista
  }
}

const socket = new LocalSocket();
export default socket;
