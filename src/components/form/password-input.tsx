import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

export function PasswordInput({
  className,
  type: _type, // type 무시
  ...props
}: React.ComponentProps<"input">) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        placeholder="새로운 비밀번호 입력"
        className={className}
        {...props}
      />
      <button
        type="button"
        className="absolute top-1/2 right-3 h-full -translate-y-1/2 cursor-pointer"
        onClick={() => setShowPassword((prev) => !prev)}
      >
        {showPassword ? (
          <Eye className="text-muted-foreground size-5" strokeWidth={1.3} />
        ) : (
          <EyeOff className="text-muted-foreground size-5" strokeWidth={1.3} />
        )}
      </button>
    </div>
  );
}
