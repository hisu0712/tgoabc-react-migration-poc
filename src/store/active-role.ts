import type { UserType } from "@/types";
import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";
import { useSessionUserRoles } from "./session";

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
  // localStorage raw 저장값이 아닌 roles로 검증된 값 반환
  const activeRole = useActiveRoleStore((store) => store.activeRole);
  const roles = useSessionUserRoles();

  return activeRole && roles.includes(activeRole) ? activeRole : null;
};

export const useSetActiveRole = () => {
  return useActiveRoleStore((store) => store.actions.setActiveRole);
};

export const useClearActiveRole = () => {
  return useActiveRoleStore((store) => store.actions.clearActiveRole);
};
