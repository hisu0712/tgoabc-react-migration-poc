import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/form/password-input";
import { useFormContext } from "react-hook-form";

type PasswordFieldsValues = { newPassword: string; rePassword: string };

export default function PasswordFields({ disabled }: { disabled: boolean }) {
  const { control } = useFormContext<PasswordFieldsValues>();

  return (
    <>
      <FormField
        control={control}
        name="newPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel required>신규 비밀번호</FormLabel>
            <FormControl>
              <PasswordInput
                disabled={disabled}
                placeholder="새로운 비밀번호 입력"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="rePassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel required>비밀번호 확인</FormLabel>
            <FormControl>
              <PasswordInput
                disabled={disabled}
                placeholder="비밀번호 재입력"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
