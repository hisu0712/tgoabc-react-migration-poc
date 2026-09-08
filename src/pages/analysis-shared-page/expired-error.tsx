import ExpiredLinkImage from "@/assets/expired_link_joa.png";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export default function ExpiredError() {
  const navigate = useNavigate();

  return (
    <div className="bg-background fixed inset-0 flex flex-col items-center justify-center gap-10 px-6 text-center">
      <p className="flex flex-col text-xl font-bold">
        <span>앗! 받으셨던</span>
        <span>분석 결과가 만료되었어요</span>
      </p>
      <div className="w-[60%] md:w-[30%]">
        <img src={ExpiredLinkImage} alt="" />
      </div>
      <div>
        <Button
          onClick={() => navigate("/sign-in")}
          className="mb-4 h-auto cursor-pointer px-5 py-3 text-base"
        >
          티고ABC 시작하기
        </Button>
        <p className="text-muted-foreground flex flex-col text-sm">
          <span>티고ABC를 시작하면 분석 결과를</span>
          <span>언제든 다시 확인할 수 있어요.</span>
        </p>
      </div>
    </div>
  );
}
