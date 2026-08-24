import { Globe, Sun } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { cn } from "@/lib/utils";
import logoBlue from "@/assets/logo_blue.png";

export default function HeaderHomeNav({
  className,
  logoSrc = logoBlue,
}: {
  className?: string;
  logoSrc?: string;
}) {
  return (
    <header
      className={cn(
        "bg-background/50 text-primary sticky top-0 z-10 mb-5 backdrop-blur-md",
        className,
      )}
    >
      <div className="flex items-center justify-between pt-8 pb-4">
        <img className="w-37" src={logoSrc} alt="티고ABC 로고" />
        <div className="flex items-center gap-2.5">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Sun className="size-7" strokeWidth={1.5} />
            </DropdownMenuTrigger>
            <DropdownMenuContent></DropdownMenuContent>
          </DropdownMenu>
          <Globe className="size-6.5" strokeWidth={1.5} />
        </div>
      </div>
    </header>
  );
}
