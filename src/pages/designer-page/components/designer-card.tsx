import { Card } from "@/components/card";
import { ChevronRightIcon } from "lucide-react";

export default function DesignerCard({
  name,
  phone,
  ...props
}: {
  name: string;
  phone: string;
} & React.ComponentProps<"div">) {
  return (
    <Card className="flex items-center justify-between gap-2 cursor-pointer" {...props}>
      <div className="flex items-center gap-2">
        <div className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-full text-sm leading-none font-medium">
          {[...name.trim()][0] ?? "?"}
        </div>
        <div className="flex gap-0.5 text-lg">
          <span>{name}</span>
          <span>({phone.slice(-4)})</span>
        </div>
      </div>
      <ChevronRightIcon className="size-7" strokeWidth={1.2} />
    </Card>
  );
}
