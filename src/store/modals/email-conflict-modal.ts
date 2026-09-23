import { create } from "zustand";
import { devtools, combine } from "zustand/middleware";

type OpenState = {
  isOpen: true;
  customerId: string;
  newEmail: string;
};

type CloseState = {
  isOpen: false;
};

type State = OpenState | CloseState;

const initialState = {
  isOpen: false,
} as State;

const useEmailConflictModalStore = create(
  devtools(
    combine(initialState, (set) => ({
      actions: {
        open: (params: Omit<OpenState, "isOpen">) => {
          set({ ...params, isOpen: true });
        },
        close: () => {
          set({ isOpen: false });
        },
      },
    })),
    { name: "EmailConflictModalStore" },
  ),
);

export const useOpenEmailConflictModal = () => {
  const open = useEmailConflictModalStore((store) => store.actions.open);
  return open;
};

export const useEmailConflictModal = () => {
  const store = useEmailConflictModalStore();
  return store as typeof store & State;
};
