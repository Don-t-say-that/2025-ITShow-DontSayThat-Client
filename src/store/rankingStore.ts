import { create } from "zustand";

interface RankingItem {
    id: number;
    score: number;
    createdAt: string;
    user: {
        name: string;
    };
    rank?: number;
}

interface GameResultStore {
    ranking: RankingItem[];
    setRanking: (data: RankingItem[]) => void;
}

export const useGameResultStore = create<GameResultStore>((set) => ({
    ranking: [],
    setRanking: (data) => set({ ranking: data }),
}));