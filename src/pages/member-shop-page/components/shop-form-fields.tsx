import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FieldSkeleton } from "@/components/form/field-skeleton";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import type { ShopFormValues } from "@/schemas/shop.schema";
import FormHint from "@/components/form/form-hint";
import { useKakaoPostcodePopup } from "react-daum-postcode";

export default function ShopFormFields({
  isLoading,
  disabled,
}: {
  isLoading: boolean;
  disabled: boolean;
}) {
  const openPostCode = useKakaoPostcodePopup();
  const { control, setValue, setFocus } = useFormContext<ShopFormValues>();

  const handleAddressSearch = () => {
    openPostCode({
      onComplete: (data) => {
        setValue("address", data.roadAddress, { shouldDirty: true });
        setFocus("address_detail");
      },
    });
  };

  return (
    <>
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel required>매장명</FormLabel>
            <FormControl>
              {isLoading ? (
                <FieldSkeleton />
              ) : (
                <Input
                  disabled={disabled}
                  placeholder="매장명을 입력해주세요"
                  {...field}
                />
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>매장 전화번호</FormLabel>
            <FormHint>고객앱에서 전화 문의 시 사용돼요.</FormHint>
            <FormControl>
              {isLoading ? (
                <FieldSkeleton />
              ) : (
                <Input
                  disabled={disabled}
                  placeholder="전화번호를 -없이 입력해주세요"
                  {...field}
                />
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex flex-col gap-0.5">
        <FormField
          control={control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>매장 주소</FormLabel>
              <FormHint>고객앱에서 매장 위치 안내에 사용돼요.</FormHint>
              <FormControl>
                {isLoading ? (
                  <FieldSkeleton />
                ) : (
                  <div className="relative">
                    <Input
                      disabled={disabled}
                      onClick={handleAddressSearch}
                      placeholder="주소 검색을 눌러주세요"
                      readOnly
                      className="read-only:bg-background! read-only:text-foreground! cursor-pointer"
                      {...field}
                    />
                    <Button
                      disabled={disabled}
                      type="button"
                      onClick={handleAddressSearch}
                      variant={"link"}
                      className="absolute top-1/2 right-0 h-full -translate-y-1/2 cursor-pointer"
                    >
                      주소 검색
                    </Button>
                  </div>
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="address_detail"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                {isLoading ? (
                  <FieldSkeleton />
                ) : (
                  <Input
                    disabled={disabled}
                    placeholder="상세주소를 입력해주세요"
                    {...field}
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
