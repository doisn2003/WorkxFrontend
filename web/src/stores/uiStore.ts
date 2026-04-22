import { create } from 'zustand';

interface UiState {
  isRightPanelOpen: boolean;
  toggleRightPanel: () => void;
  setRightPanelOpen: (open: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  isRightPanelOpen: true,
  toggleRightPanel: () => set((s) => ({ isRightPanelOpen: !s.isRightPanelOpen })),
  setRightPanelOpen: (open: boolean) => set({ isRightPanelOpen: open }),
}));
