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

const useSelectCustomerModalStore = create(
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
    { name: "selectCustomerModal" },
  ),
);

export const useOpenSelectCustomerModal = () => {
  const open = useSelectCustomerModalStore((store) => store.actions.open);
  return open;
};

export const useSelectCustomerModal = () => {
  const store = useSelectCustomerModalStore();
  return store as typeof store & State;
};
