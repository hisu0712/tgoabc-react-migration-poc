import FormHint from "@/components/form-hint";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GENDER_FORM_VALUES } from "@/lib/constants";
import { formatBirthDateInput } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { CustomerFormValues } from "@/schemas/customer.schema";
import type { DesignerEntity } from "@/type";
import { Scissors } from "lucide-react";
import { useFormContext } from "react-hook-form";

export default function CustomerFormFields({
  disabled,
  designers,
  emailReadOnly,
}: {
  disabled?: boolean;
  designers?: DesignerEntity[];
  emailReadOnly?: boolean;
}) {
  const { control } = useFormContext<CustomerFormValues>();

  return (
    <>
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>이름</FormLabel>
            <FormControl>
              <Input
                disabled={disabled}
                placeholder="이름을 입력해주세요."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>이메일</FormLabel>
            {!emailReadOnly && (
              <FormHint>
                고객 정보 식별을 위해 이메일을 정확히 입력해주세요.
              </FormHint>
            )}
            <FormControl>
              <Input
                readOnly={emailReadOnly}
                disabled={disabled}
                placeholder="abc@example.com"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="birthDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>생년월일</FormLabel>
            <FormControl>
              <Input
                inputMode="numeric"
                maxLength={10}
                disabled={disabled}
                placeholder="YYYY-MM-DD"
                value={field.value}
                onChange={(e) =>
                  field.onChange(formatBirthDateInput(e.target.value))
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="gender"
        render={({ field }) => (
          <FormItem>
            <FormLabel>성별</FormLabel>
            <FormControl>
              <div role="radiogroup" className="grid grid-cols-2 gap-2">
                {GENDER_FORM_VALUES.map((option) => (
                  <Button
                    disabled={disabled}
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={field.value === option.value}
                    onClick={() => field.onChange(option.value)}
                    variant={"outline"}
                    className={cn(
                      field.value === option.value &&
                        "border-primary text-primary bg-primary/10",
                    )}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {!!designers?.length && (
        <FormField
          control={control}
          name="designerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>담당 디자이너</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <div className="flex items-center gap-2">
                      <Scissors className="size-4" strokeWidth={1.5} />
                      <SelectValue placeholder="디자이너 없음" />
                    </div>
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="none">디자이너 없음</SelectItem>
                    {designers?.map((designer) => (
                      <SelectItem key={designer.id} value={String(designer.id)}>
                        {designer.name} 디자이너
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
}
