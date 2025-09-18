import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { OrderStatus, OrderPriority, PropertyType } from "@/types/orders";

type FilterPreferences = {
  statuses: OrderStatus[];
  priorities: OrderPriority[];
  propertyTypes: PropertyType[];
  assignedTo: string[];
  clients: string[];
};

interface AppState {
  user?: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  setUser: (user: AppState["user"]) => void;
  filterPreferences: FilterPreferences;
  setFilterPreferences: (preferences: Partial<FilterPreferences>) => void;
  recentSearches: string[];
  pushRecentSearch: (search: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      filterPreferences: {
        statuses: [],
        priorities: [],
        propertyTypes: [],
        assignedTo: [],
        clients: [],
      },
      setUser: (user) => set({ user }),
      setFilterPreferences: (preferences) =>
        set((state) => ({
          filterPreferences: {
            ...state.filterPreferences,
            ...preferences,
          },
        })),
      recentSearches: [],
      pushRecentSearch: (search) =>
        set((state) => ({
          recentSearches: [search, ...state.recentSearches.filter((item) => item !== search)].slice(0, 10),
        })),
    }),
    {
      name: "roioperations-app-store",
      partialize: (state) => ({
        filterPreferences: state.filterPreferences,
        recentSearches: state.recentSearches,
      }),
    }
  )
);
