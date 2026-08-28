// TS에게 skin-analysis라는 태그가 실제로 존재하고(브라우저에 등록될 거고),
// 이 태그는 id, image-src 같은 props를 받을 수 있음을 미리 알려줌
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      /** personal-analysis.iife.js가 등록하는 스킨톤 분석 커스텀 엘리먼트 */
      "skin-analysis": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & { "image-src"?: string };
    }
  }
}

export {};
