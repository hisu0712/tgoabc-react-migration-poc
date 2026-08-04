import { Button } from "@/components/ui/button";
import { replace, useNavigate } from "react-router";

export default function SignUpCompletePage() {
  const navigate = useNavigate();

  return (
    <div>
      <p>회원가입 완료!</p>
      {/* 매장명 티고뷰티샵 대신 조회해서 */}
      <p>티고뷰티샵 님 반갑습니다</p>
      <p>티고ABC의 소중한 회원이 되어주셔서 감사합니다</p>

      <Button onClick={() => navigate("/", { replace: true })}>다음</Button>
    </div>
  );
}
