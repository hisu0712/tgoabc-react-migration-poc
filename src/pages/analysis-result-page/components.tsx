export function AxisBar({
  name,
  axis_1,
  axis_2,
  value,
  min,
  max,
  avg,
  background,
}: {
  name: string;
  axis_1: string;
  axis_2: string;
  value: number;
  min: number;
  max: number;
  avg: number;
  background: string;
}) {
  return (
    <div className="bl_skinAxis" data-point-pos data-avg-pos="20">
      <div className="relative mb-2 h-4.5 rounded-2xl" style={{ background }}>
        <div
          style={{
            left: `${Math.round(((avg - min) / (max - min)) * 100)}%`,
          }}
          className="absolute bottom-[calc(100%+8px)] -translate-x-1/2 rounded-sm bg-white px-1.5 py-0.5 leading-none whitespace-nowrap text-[#DC8E5E] shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
        >
          <span></span>
          <span className="text-xs font-medium">여름 라이트 평균</span>
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-x-[7px] border-t-[6px] border-x-transparent border-t-white"></span>
        </div>
        <span
          style={{
            left: `clamp(3%, ${Math.round(((value - min) / (max - min)) * 100)}%, 97%)`,
          }}
          className={`absolute top-1/2 size-3 aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#DC8E5E] bg-white`}
        ></span>
      </div>

      <div className="text-muted-foreground flex justify-between font-medium">
        <span>{axis_1}</span>
        <span>{axis_2}</span>
      </div>
    </div>
  );
}

export function GuideLabel({
  className,
  children,
}: React.ComponentProps<"div">) {
  return (
    <div
      className={`${className ?? ""} inline-block border border-[#DC8E5E]/20 bg-[#FFF3E8] px-3 text-center text-sm font-medium break-keep text-[#DC8E5E]`}
    >
      {children}
    </div>
  );
}
