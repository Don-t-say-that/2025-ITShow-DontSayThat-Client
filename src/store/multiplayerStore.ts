import { create } from 'zustand';

interface Player {
  id: string;
  x: number;
  y: number;
  imgUrl: string;
}

interface MultiplayerStore {
  players: Record<string, Player>;
  myPlayerId: string | null;
  setMyPlayerId: (id: string) => void;
  updatePlayer: (player: Player) => void;
  removePlayer: (id: string) => void;
  setInitialPlayers: (players: Player[]) => void;
}

export const useMultiplayerStore = create<MultiplayerStore>((set) => ({
  players: {},
  myPlayerId: null,
  setMyPlayerId: (id) => set({ myPlayerId: id }),
  updatePlayer: (player) =>
    set((state) => ({
      players: {
        ...state.players,
        [player.id]: player,
      },
    })),
  removePlayer: (id) =>
    set((state) => {
      const newPlayers = { ...state.players };
      delete newPlayers[id];
      return { players: newPlayers };
    }),
  setInitialPlayers: (players) => {
    const playerMap: Record<string, Player> = {};
    players.forEach((p) => {
      playerMap[p.id] = p;
    });
    set({ players: playerMap });
  },
}));
