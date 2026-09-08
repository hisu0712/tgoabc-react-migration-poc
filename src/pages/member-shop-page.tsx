import GlobalLoader from "@/components/global-loader";
import { Input } from "@/components/ui/input";
import { useUpdateShop } from "@/hooks/mutations/shop/use-update-shop";
import { useShopData } from "@/hooks/queries/shop/use-shop-data";
import { shopSchema, type ShopFormValues } from "@/schemas/shop.schema";
import { useOpenAlertModal } from "@/store/modals/alert-modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSession } from "@/store/session";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import defaultShopImage from "@/assets/default-shop.png";
import { Label } from "@/components/ui/label";
import BottomButton from "@/components/layout/bottom-button";
import HeaderNav from "@/components/layout/header-nav";
import FormHint from "@/components/form/form-hint";
import type { Image } from "@/types";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useKakaoPostcodePopup } from "react-daum-postcode";

export default function MemberShopPage() {
  const session = useSession();
  const openAlertModal = useOpenAlertModal();
  const openPostCode = useKakaoPostcodePopup();

  const [shopImage, setShopImage] = useState<Image | null>(null);
  const [isShopImageRemoved, setIsShopImageRemoved] = useState(false);

  const { data: shop, isLoading: isFetchShopLoading } = useShopData(
    session?.user.id,
  );

  const { mutate: updateShop, isPending: isUpdateShopPending } = useUpdateShop({
    onSuccess: () => {
      toast.success("정보가 수정되었습니다.", { position: "top-center" });
    },
    onError: () => {
      toast.error("정보 수정에 실패했습니다.", { position: "top-center" });
    },
  });

  useEffect(() => {
    setShopImage((prev) => {
      if (prev) URL.revokeObjectURL(prev.previewUrl);
      return null;
    });
    setIsShopImageRemoved(false);
  }, [shop]);

  const shopFormValues = useMemo(
    () =>
      shop
        ? {
            name: shop.name,
            phone: shop.phone ?? undefined,
            address: shop.address ?? undefined,
            address_detail: shop.address_detail ?? undefined,
          }
        : undefined,
    [shop], // 객체 리렌더링: 폼 입력이 아닌 shop 변동일 시만
  );

  const form = useForm<ShopFormValues>({
    resolver: zodResolver(shopSchema),
    values: shopFormValues,
  });
  const {
    formState: { isDirty },
  } = form;

  if (isFetchShopLoading) return <GlobalLoader />;

  const onSubmit = (values: ShopFormValues) => {
    if (!isDirty && !shopImage && !isShopImageRemoved) {
      // 이미지 변경 감지 해야함
      toast.info("변경된 내용이 없습니다.", { position: "top-center" });
      return;
    }
    updateShop({
      memberId: session!.user.id,
      shopImageFile: shopImage?.file,
      removeShopImage: isShopImageRemoved,
      ...values,
    });
  };

  const handleSelectImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];

    if (shopImage) {
      URL.revokeObjectURL(shopImage.previewUrl);
    }

    setShopImage({
      file,
      previewUrl: URL.createObjectURL(file),
    });
    setIsShopImageRemoved(false);
  };

  const handleDeleteShopImageClick = () => {
    openAlertModal({
      title: "로고 삭제",
      description: "선택한 로고 이미지를 삭제하시겠습니까?",
      onPositive: () => {
        if (shopImage) {
          setShopImage(null);
          URL.revokeObjectURL(shopImage.previewUrl);
        }
        setIsShopImageRemoved(true);
      },
    });
  };

  const handleAddressSearch = () => {
    openPostCode({
      onComplete: (data) => {
        form.setValue("address", data.roadAddress, { shouldDirty: true });
        form.setFocus("address_detail");
      },
    });
  };

  return (
    <div>
      <HeaderNav title="매장 정보" />

      <div className="mb-5 font-semibold">
        <p>매장 정보를 입력해주세요</p>
        <p>고객 안내 및 홍보에 활용돼요</p>
      </div>

      <Form {...form}>
        <form
          id="shop-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-3"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>매장명</FormLabel>
                <FormControl>
                  <Input
                    disabled={isUpdateShopPending}
                    placeholder="매장명을 입력해주세요"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>매장 전화번호</FormLabel>
                <FormHint>고객앱에서 전화 문의 시 사용돼요.</FormHint>
                <FormControl>
                  <Input
                    disabled={isUpdateShopPending}
                    placeholder="전화번호를 -없이 입력해주세요"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-0.5">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>매장 주소</FormLabel>
                  <FormHint>고객앱에서 매장 위치 안내에 사용돼요.</FormHint>
                  <FormControl>
                    <div className="relative">
                      <Input
                        disabled={isUpdateShopPending}
                        onClick={handleAddressSearch}
                        placeholder="주소 검색을 눌러주세요"
                        readOnly
                        className="read-only:bg-background! read-only:text-foreground! cursor-pointer"
                        {...field}
                      />
                      <Button
                        disabled={isUpdateShopPending}
                        type="button"
                        onClick={handleAddressSearch}
                        variant={"link"}
                        className="absolute top-1/2 right-0 h-full -translate-y-1/2 cursor-pointer"
                      >
                        주소 검색
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address_detail"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isUpdateShopPending}
                      placeholder="상세주소를 입력해주세요"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-2">
            <Label>매장 로고</Label>
            <FormHint>
              매장앱과 고객앱에 노출되는 이미지예요. 매장을 대표하는 로고 이미지
              사용을 추천해요.
            </FormHint>
            <div className="border-muted-foreground/50 bg-muted relative h-35 rounded-xl border">
              <label
                htmlFor="shop-logo"
                className="flex h-full w-full cursor-pointer items-center justify-center"
              >
                <Input
                  id="shop-logo"
                  disabled={isUpdateShopPending}
                  onChange={handleSelectImage}
                  type="file"
                  accept="image/*"
                  className="hidden"
                />
                <img
                  className="aspect-square h-[90%] rounded-full object-cover"
                  src={
                    shopImage?.previewUrl ??
                    (isShopImageRemoved
                      ? defaultShopImage
                      : (shop?.logo_url ?? defaultShopImage))
                  }
                  alt="매장 이미지"
                />
              </label>
              {shopImage || (shop?.logo_url && !isShopImageRemoved) ? (
                <button
                  type="button"
                  onClick={handleDeleteShopImageClick}
                  className="bg-destructive/20 text-destructive absolute top-2 right-3 cursor-pointer rounded-full p-1"
                >
                  <XIcon className="size-4" strokeWidth={2} />
                </button>
              ) : null}
            </div>
          </div>
        </form>
      </Form>

      <BottomButton
        disabled={isUpdateShopPending}
        form="shop-form"
        type="submit"
      >
        저장
      </BottomButton>
    </div>
  );
}
