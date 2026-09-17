import { cn } from "@/lib/utils";
import ThemeButton from "./theme-button";
import { Logo } from "../logo";

export default function HeaderHomeNav({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "bg-background/50 text-primary sticky top-0 z-10 mb-5 pt-5 backdrop-blur-md",
        className,
      )}
    >
      <div className="flex h-17 items-center justify-between">
        <Logo className="w-33" />
        <div className="flex items-center gap-2.5">
          <ThemeButton />
        </div>
      </div>
    </header>
  );
}
