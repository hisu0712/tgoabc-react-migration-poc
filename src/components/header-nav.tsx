import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router";

interface HeaderProps {
  title: string;
  backTo?: string;
  rightSlot?: ReactNode;
  bottomSlot?: ReactNode;
}

export default function HeaderNav({
  title,
  backTo,
  rightSlot,
  bottomSlot,
}: HeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="bg-background/50 sticky top-0 z-10 mb-5 backdrop-blur-md">
      <div className="relative pt-8 pb-4">
        <button
          type="button"
          onClick={handleBack}
          className="absolute top-1/2 left-0 z-10 flex -translate-y-1/2"
        >
          <ChevronLeft className="size-10" strokeWidth={1} />
        </button>

        <h1 className="text-center text-lg font-semibold">{title}</h1>

        {rightSlot && (
          <div className="absolute top-1/2 right-0 z-10 flex -translate-y-1/2">
            {rightSlot}
          </div>
        )}
      </div>

      {bottomSlot && <>{bottomSlot}</>}
    </header>
  );
}
