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

const useLinkCustomerModalStore = create(
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
    { name: "linkCustomerModal" },
  ),
);

export const useOpenLinkCustomerModal = () => {
  const open = useLinkCustomerModalStore((store) => store.actions.open);
  return open;
};

export const useLinkCustomerModal = () => {
  const store = useLinkCustomerModalStore();
  return store as typeof store & State;
};
