import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router";

interface HeaderProps {
  className?: string;
  title?: string;
  backTo?: string;
  rightSlot?: ReactNode;
  bottomSlot?: ReactNode;
}

export default function HeaderNav({
  className,
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
    <header
      className={`bg-background/50 sticky top-0 z-10 mb-5 pt-8 backdrop-blur-md ${className}`}
    >
      <div className="relative flex h-17 items-center justify-center">
        <button
          type="button"
          onClick={handleBack}
          className="absolute top-1/2 left-0 z-10 flex -translate-x-1/4 -translate-y-1/2"
        >
          <ChevronLeft className="size-10" strokeWidth={1} />
        </button>

        {title && <h1 className="text-lg font-semibold">{title}</h1>}

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
