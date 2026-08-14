import logo from "@/assets/tgo_logo_blue.png";
import { Globe, Sun } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function HeaderHomeNav() {
  return (
    <header className="bg-background/50 sticky top-0 z-10 mb-5 backdrop-blur-md">
      <div className="flex items-center justify-between pt-8 pb-4">
        <img className="w-37" src={logo} alt="티고ABC 로고" />
        <div className="text-primary flex items-center gap-2.5">
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
