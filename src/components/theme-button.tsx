import { useSetTheme, useTheme } from "@/store/theme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { CheckIcon, SunIcon } from "lucide-react";
import type { Theme } from "@/types";

const THEMES: Theme[] = ["system", "dark", "light"];
const THEMES_LABELS: Record<Theme, string> = {
  system: "시스템",
  dark: "다크",
  light: "라이트",
};

export default function ThemeButton() {
  const currentTheme = useTheme();
  const setTheme = useSetTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <SunIcon className="size-7 cursor-pointer" strokeWidth={1.5} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-3">
        {THEMES.map((theme) => (
          <DropdownMenuItem
            key={theme}
            onClick={() => setTheme(theme)}
            className="flex cursor-pointer items-center justify-between"
          >
            {THEMES_LABELS[theme]}
            {currentTheme === theme && <CheckIcon className="size-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
