import logoBlue from "@/assets/logo_blue.png";

export default function GlobalLoader() {
  return (
    <div
      role="status"
      aria-label="로딩 중"
      className="bg-background fixed inset-0 flex items-center justify-center"
    >
      <img
        src={logoBlue}
        alt=""
        className="h-11 w-auto animate-pulse [animation-duration:1.2s]"
      />
    </div>
  );
}
