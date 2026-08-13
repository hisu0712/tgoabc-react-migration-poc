import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router";

interface HeaderProps {
  title: string;
  rightSlot?: ReactNode;
  backTo?: string;
}

export default function HeaderNav({ title, rightSlot, backTo }: HeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="sticky top-0 z-10 mb-5">
      <div className="bg-background relative h-17">
        <button
          type="button"
          onClick={handleBack}
          className="absolute top-1/2 left-0 z-10 flex -translate-y-1/2"
        >
          <ChevronLeft className="size-10" strokeWidth={1} />
        </button>

        <h1 className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-lg font-semibold">
          {title}
        </h1>

        {rightSlot && (
          <div className="absolute top-1/2 right-0 z-10 flex -translate-y-1/2">
            {rightSlot}
          </div>
        )}
      </div>
    </header>
  );
}
