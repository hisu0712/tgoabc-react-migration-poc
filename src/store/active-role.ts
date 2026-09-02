import type { UserType } from "@/type";
import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";

const ACTIVE_ROLE_STORAGE_KEY = "activeRole";

function getStoredActiveRole(): UserType | null {
  const stored = localStorage.getItem(ACTIVE_ROLE_STORAGE_KEY);
  if (stored === "member" || stored === "customer") return stored;
  return null;
}

type State = {
  activeRole: UserType | null;
};

const initialState: State = {
  activeRole: getStoredActiveRole(),
};

const useActiveRoleStore = create(
  devtools(
    combine(initialState, (set) => ({
      actions: {
        setActiveRole: (role: UserType) => {
          localStorage.setItem(ACTIVE_ROLE_STORAGE_KEY, role);
          set({ activeRole: role });
        },
        clearActiveRole: () => {
          localStorage.removeItem(ACTIVE_ROLE_STORAGE_KEY);
          set({ activeRole: null });
        },
      },
    })),
    { name: "activeRoleStore" },
  ),
);

export const useActiveRole = () => {
  return useActiveRoleStore((store) => store.activeRole);
};

export const useSetActiveRole = () => {
  return useActiveRoleStore((store) => store.actions.setActiveRole);
};

export const useClearActiveRole = () => {
  return useActiveRoleStore((store) => store.actions.clearActiveRole);
};
