import GlobalLoader from "@/components/global-loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdateShop } from "@/hooks/mutations/shop/use-update-shop";
import { useShopData } from "@/hooks/queries/use-shop-data";
import { shopSchema, type ShopFormValues } from "@/schemas/shop.schema";
import { useOpenAlertModal } from "@/store/alert";
import { useSession } from "@/store/session";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useRef, useState, type ChangeEvent } from "react";
import { useForm, type FieldErrors } from "react-hook-form";
import { Navigate, useParams } from "react-router";
import { toast } from "sonner";

type Image = { file: File; previewUrl: string };

export default function MemberShopPage() {
  const { userId } = useParams();
  const session = useSession();
  const openAlertModal = useOpenAlertModal();

  const [logoImage, setLogoImage] = useState<Image | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const shopFormValues = useMemo(
    // 이 객체가 다시 리렌더링 되는것은 폼 입력이 아닌 shop 변동일 시만
    () =>
      shop
        ? {
            name: shop.name,
            phone: shop.phone ?? undefined,
            address: shop.address ?? undefined,
            address_detail: shop.address_detail ?? undefined,
          }
        : undefined,
    [shop],
  );

  const {
    register,
    handleSubmit,
    formState: { isDirty },
  } = useForm<ShopFormValues>({
    // formState.isDirty 구독을 첫 렌더링 시 실행 -> 이후 입력값 onChange 일때 리렌더링 방지를 위해 useMemo 사용
    resolver: zodResolver(shopSchema),
    values: shopFormValues,
  });

  if (isFetchShopLoading) return <GlobalLoader />;
  if (!userId) return <Navigate to={"/"} />;

  const onSubmit = (values: ShopFormValues) => {
    if (!isDirty) {
      toast.info("변경된 내용이 없습니다.", { position: "top-center" });
      return;
    }
    updateShop({ userId, ...values });
  };
  const onInvalid = (errors: FieldErrors<ShopFormValues>) => {
    const firstError = Object.values(errors)[0];
    if (firstError?.message) {
      toast.error(firstError.message, { position: "top-center" });
    }
  };

  const handleSelectImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];

    if (logoImage) {
      URL.revokeObjectURL(logoImage.previewUrl);
    }

    setLogoImage({
      file,
      previewUrl: URL.createObjectURL(file),
    });
  };

  const handleDeleteLogoClick = () => {
    openAlertModal({
      title: "로고 삭제",
      description: "선택한 로고 이미지를 삭제하시겠습니까?",
      onPositive: () => {},
    });
  };

  return (
    <div>
      <h1>매장 정보</h1>

      <p>매장 정보를 입력해주세요</p>
      <p>고객 안내 및 홍보에 활용돼요</p>

      <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
        <ul>
          <li>
            <div>매장명</div>
            <Input
              disabled={isUpdateShopPending}
              placeholder="매장명을 입력해주세요"
              {...register("name")}
            />
          </li>
          <li>
            <div>매장 전화번호</div>
            <p>고객앱에서 전화 문의 시 사용돼요.</p>
            <Input
              disabled={isUpdateShopPending}
              placeholder="매장 전화번호를 -없이 입력해주세요"
              {...register("phone")}
            />
          </li>
          <li>
            <div>매장 주소</div>
            <p>고객앱에서 매장 위치 안내에 사용돼요.</p>
            <Input
              disabled={isUpdateShopPending}
              placeholder="도로명 주소를 입력해주세요"
              {...register("address")}
            />
            <p>주소 검색</p>
            <Input
              disabled={isUpdateShopPending}
              placeholder="상세주소를 입력해주세요"
              {...register("address_detail")}
            />
          </li>
          <li>
            <div>매장 로고</div>
            <p>
              매장앱과 고객앱에 노출되는 이미지예요.매장을 대표하는 로고 이미지
              사용을 추천해요.
            </p>
            <div
              onClick={() => {
                if (fileInputRef.current) fileInputRef.current.click();
              }}
              className="bl_form_imgUpload has_img js_msgImg"
            >
              <Input
                disabled={isUpdateShopPending}
                ref={fileInputRef}
                onChange={handleSelectImage}
                type="file"
                accept="image/*"
                className="hidden"
              />

              <img src={logoImage?.previewUrl || ""} alt="매장 이미지" />
              <div
                onClick={handleDeleteLogoClick}
                className="bl_form_imgDelete"
              >
                x
              </div>
            </div>
          </li>
        </ul>

        <Button disabled={isUpdateShopPending} type="submit">
          저장하기
        </Button>
      </form>
    </div>
  );
}
