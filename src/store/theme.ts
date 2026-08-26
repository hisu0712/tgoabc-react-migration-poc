import type { Theme } from "@/type";
import { create } from "zustand";
import { combine, devtools, persist } from "zustand/middleware";

type State = {
  theme: Theme;
};

const initialState: State = {
  theme: "light",
};

const useThemeStore = create(
  devtools(
    persist(
      combine(initialState, (set) => ({
        actions: {
          setTheme: (theme: Theme) => {
            const htmlTag = document.documentElement;
            htmlTag.classList.remove("dark", "light");

            if (theme === "system") {
              const isDarkTheme = window.matchMedia(
                "(prefers-color-scheme: dark)",
              ).matches; // 시스템 테마 확인

              htmlTag.classList.add(isDarkTheme ? "dark" : "light");
            } else {
              htmlTag.classList.add(theme);
            }

            set({ theme });
          },
        },
      })),
      {
        name: "ThemeStore",
        // 스토어가 처음 생성될 때(앱 로드 시) localStorage에서 값을 읽어와서 initialState 대신 그걸로 복원
        // 저장소에 persist할 값만 골라서 새 객체로 반환하는 옵션(기본값: localStorage)
        partialize: (store) => ({ theme: store.theme }),
      },
    ),
    { name: "ThemeStore" },
  ),
);

export const useTheme = () => {
  const theme = useThemeStore((store) => store.theme);
  return theme;
};

export const useSetTheme = () => {
  const setTheme = useThemeStore((store) => store.actions.setTheme);
  return setTheme;
};
