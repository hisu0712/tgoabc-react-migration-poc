import { formatPhoneInput, toPhoneDigits } from "@/lib/format";
import { Input } from "../ui/input";

export function PhoneInput({
  value,
  onChange,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <Input
      placeholder="휴대전화 번호를 -없이 입력해주세요"
      maxLength={13}
      value={formatPhoneInput(typeof value === "string" ? value : "")} // 화면 상에서만 변환
      onChange={(e) => {
        e.target.value = toPhoneDigits(e.target.value); // 화면에서 온 값을 폼에 저장하기 전에 정제
        onChange?.(e);
      }}
      {...props}
    />
  );
}
