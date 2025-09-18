import { create } from "zustand";

interface CommandPaletteState {
  open: boolean;
  setOpen: (open: boolean) => void;
  query: string;
  setQuery: (query: string) => void;
}

export const useCommandPalette = create<CommandPaletteState>((set) => ({
  open: false,
  query: "",
  setOpen: (open) => set({ open }),
  setQuery: (query) => set({ query }),
}));
