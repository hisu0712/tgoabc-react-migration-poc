import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PhoneInput } from "@/components/form/phone-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldSkeleton } from "@/components/form/field-skeleton";
import { useFormContext } from "react-hook-form";
import type { MemberFormValues } from "@/schemas/member.schema";
import { useNavigate } from "react-router";
import type { MemberEntity } from "@/types";

const MASKED_PASSWORD = "••••••••";

export default function MemberFormFields({
  member,
  isLoading,
  disabled,
}: {
  member?: MemberEntity;
  isLoading: boolean;
  disabled: boolean;
}) {
  const navigate = useNavigate();
  const { control } = useFormContext<MemberFormValues>();

  return (
    <>
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel required>이름</FormLabel>
            <FormControl>
              {isLoading ? (
                <FieldSkeleton />
              ) : (
                <Input disabled={disabled} placeholder="이름 입력" {...field} />
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid gap-1">
        <Label>이메일</Label>
        {isLoading ? (
          <FieldSkeleton />
        ) : (
          <Input readOnly value={member?.email} />
        )}
      </div>

      <FormField
        control={control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel required>휴대전화</FormLabel>
            <FormControl>
              {isLoading ? (
                <FieldSkeleton />
              ) : (
                <PhoneInput disabled={disabled} {...field} />
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid gap-1">
        <Label>비밀번호</Label>
        {isLoading ? (
          <FieldSkeleton />
        ) : (
          <div className="relative">
            <Input readOnly type="password" value={MASKED_PASSWORD} />
            <Button
              disabled={disabled}
              type="button"
              variant={"link"}
              className="absolute top-1/2 right-0 h-full -translate-y-1/2 cursor-pointer"
              onClick={() => navigate("/reset-password")}
            >
              변경하기
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
