import { Input } from "@/components/ui/input";
import { useUpdateShop } from "@/hooks/mutations/shop/use-update-shop";
import { useShopData } from "@/hooks/queries/shop/use-shop-data";
import { shopSchema, type ShopFormValues } from "@/schemas/shop.schema";
import { useOpenAlertModal } from "@/store/modals/alert-modal";
import { Form } from "@/components/ui/form";
import { useSession } from "@/store/session";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import defaultShopImage from "@/assets/default-shop.png";
import { Label } from "@/components/ui/label";
import BottomButton from "@/components/layout/bottom-button";
import HeaderNav from "@/components/layout/header-nav";
import FormHint from "@/components/form/form-hint";
import type { Image } from "@/types";
import { XIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorRedirect from "@/components/error-redirect";
import { MEMBER_HOME_PATH } from "@/lib/route";
import ShopFormFields from "./components/shop-form-fields";
import {
  toastError,
  toastInfo,
  toastNoChange,
  toastSuccess,
} from "@/lib/toast";

export default function MemberShopPage() {
  const session = useSession();
  const openAlertModal = useOpenAlertModal();

  const [shopImage, setShopImage] = useState<Image | null>(null);
  const [isShopImageRemoved, setIsShopImageRemoved] = useState(false);

  const {
    data: shop,
    isLoading: isFetchShopLoading,
    isError: isFetchShopError,
  } = useShopData(session?.user.id);

  const { mutate: updateShop, isPending: isUpdateShopPending } = useUpdateShop({
    onSuccess: () => {
      toastSuccess("정보가 수정되었습니다.");
    },
    onError: () => {
      toastError("정보 수정에 실패했습니다.");
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

  const onSubmit = (values: ShopFormValues) => {
    if (!isDirty && !shopImage && !isShopImageRemoved) {
      // 이미지 변경 감지 해야함
      toastNoChange();
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

  if (isFetchShopError) return <ErrorRedirect to={MEMBER_HOME_PATH} />;

  return (
    <>
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
          <ShopFormFields
            isLoading={isFetchShopLoading}
            disabled={isUpdateShopPending}
          />

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
                {isFetchShopLoading ? (
                  <Skeleton className="aspect-square h-[90%] rounded-full" />
                ) : (
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
                )}
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
    </>
  );
}
