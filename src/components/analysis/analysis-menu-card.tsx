import { FileTextIcon } from "lucide-react";
import { Link } from "react-router";
import { LinkCard } from "../card";
import memuPersonal from "@/assets/menu_personal.webp";

export default function AnalysisMenuCard({ to }: { to: string }) {
  return (
    <div className="relative">
      <LinkCard to={to} variant={"feature2"} className="block pr-0 pb-0">
        <div>
          <div className="mb-2 text-xl font-semibold tracking-tight">
            <div>퍼스널 컬러 분석</div>
          </div>
          <div className="text-sm font-light opacity-80">
            나에게 어울리는 컬러를
            <br />
            한눈에 확인
          </div>
        </div>
        <div className="">
          <img
            className="ml-auto h-33"
            src={memuPersonal}
            alt="퍼스널컬러 분석 이미지"
          />
        </div>
      </LinkCard>
      <div className="absolute bottom-3.5 left-4">
        <Link
          to={"/analysis/preview"}
          className="flex cursor-pointer items-center gap-0.5 rounded-3xl bg-white/20 px-2.5 py-1.5"
        >
          <FileTextIcon className="size-4 text-white" strokeWidth={1.5} />
          <span className="text-sm text-white">미리보기</span>
        </Link>
      </div>
    </div>
  );
}
