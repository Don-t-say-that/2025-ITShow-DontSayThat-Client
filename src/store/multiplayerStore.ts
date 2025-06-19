import { create } from "zustand";

interface Player {
  id: string;
  x: number;
  y: number;
  imgUrl: string;
  nickName: string;
  message?: string;
}

interface MultiplayerStore {
  players: Record<string, Player>;
  myPlayerId: string | null;
  setMyPlayerId: (id: string) => void;
  updatePlayer: (player: Player) => void;
  removePlayer: (id: string) => void;
  setInitialPlayers: (players: Player[]) => void;
  updatePlayerMessage: (id: string, message: string) => void;
}

export const useMultiplayerStore = create<MultiplayerStore>((set) => ({
  players: {},
  myPlayerId: null,
  setMyPlayerId: (id) => set({ myPlayerId: id }),
  updatePlayer(data) {
    set((state) => {
      const players = { ...state.players };
      players[data.id] = { ...players[data.id], ...data };
      return { players };
    });
  },
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
  updatePlayerMessage: (id: string, message: string) => {
    set((state) => {
      const player = state.players[id];
      if (!player) return state;
      return {
        players: {
          ...state.players,
          [id]: { ...player, message },
        },
      };
    });

    setTimeout(() => {
      set((state) => {
        const player = state.players[id];
        if (!player) return state;
        return {
          players: {
            ...state.players,
            [id]: { ...player, message: "" },
          },
        };
      });
    }, 5000);
  },
}));
