import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function SearchInput({
  onSearch,
  placeholder,
  debounceMs = 300, // 0.3초마다 자동 검색
  className,
}: {
  onSearch: (keyword: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
}) {
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(keyword);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [keyword]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSearch(keyword);
  };

  return (
    <div className="relative">
      <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
      <form onSubmit={handleSubmit}>
        <Input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder={placeholder}
          className={cn("bg-card h-12 pl-9", className)}
        />
      </form>
    </div>
  );
}
