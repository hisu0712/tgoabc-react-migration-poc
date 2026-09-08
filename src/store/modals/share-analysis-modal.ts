import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";

type OpenState = {
  isOpen: true;
  analysisId: string;
};

type CloseState = {
  isOpen: false;
};

type State = OpenState | CloseState;

const initialState = {
  isOpen: false,
} as State;

const useShareAnalysisModalStore = create(
  devtools(
    combine(initialState, (set) => ({
      actions: {
        open: (analysisId: string) => {
          set({ isOpen: true, analysisId });
        },
        close: () => {
          set({ isOpen: false });
        },
      },
    })),
    { name: "shareAnalysisModal" },
  ),
);

export const useOpenShareAnalysisModal = () => {
  const open = useShareAnalysisModalStore((store) => store.actions.open);
  return open;
};

export const useShareAnalysisModal = () => {
  const store = useShareAnalysisModalStore();
  return store as typeof store & State;
};
