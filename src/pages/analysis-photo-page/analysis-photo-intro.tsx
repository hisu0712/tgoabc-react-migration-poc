import loadingImage from "@/assets/loading_ippu.gif";

export default function AnalysisPhotoIntro() {
  return (
    <div className="from-background min-h-[100vh] bg-linear-to-b to-[#ffe9e9] px-7">
      <div className="flex flex-1 flex-col gap-[10vh] pt-[10vh]">
        <div className="text-center">
          <div className="mb-3 text-2xl font-bold" data-username="티고뷰티샵">
            곧 촬영을 시작합니다!
          </div>
          <div className="flex flex-col leading-tight font-medium">
            <span>얼굴을 가이드 영역에</span>
            <span>맞추면 자동으로 촬영돼요</span>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <img
            className="h-[35vh]"
            src={loadingImage}
            alt="촬영하는 이뿌 캐릭터 이미지"
          />
        </div>

        <div className="text-muted-foreground flex flex-col text-center text-sm leading-tight font-medium">
          <span>개인정보 보호를 위해</span>
          <span>촬영 사진은 매장에 저장되지 않아요</span>
        </div>
      </div>
    </div>
  );
}
