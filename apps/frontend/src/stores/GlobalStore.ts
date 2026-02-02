import { create } from "zustand";

interface GlobalStore {
  isDrawerOpen: boolean;
  toggleDrawer: () => void;
}

export const useGlobalStore = create<GlobalStore>((set) => ({
  isDrawerOpen: false,
  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
}));
