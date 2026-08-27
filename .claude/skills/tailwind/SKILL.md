---
name: tailwind
description: 사용자가 준 이미지, CSS/SCSS, HTML/JSX, 텍스트 설명 등을 이 프로젝트 기준의 Tailwind 코드로 변환해서 채팅에 코드블록으로 준다. "/tailwind <이미지 또는 코드 또는 설명>" 형태로 호출한다. 파일은 수정하지 않는다.
---

# Tailwind

사용자가 이미지, CSS/SCSS 코드, HTML/JSX, 또는 텍스트 설명을 주면, 이 프로젝트 컨벤션에 맞는 **Tailwind 유틸리티 클래스 코드**로 변환해서 채팅에 **코드블록으로** 준다. **파일은 수정하지 않는다.**

## 프로젝트 전제

- Tailwind **v4** (`@import "tailwindcss"`), 설정은 `src/index.css` 의 `@theme` / CSS 변수 기반.
- 반응형은 `md:` 를 기본 브레이크포인트로 쓴다 (기존 페이지들이 그렇게 되어 있음).
- 색/토큰은 `src/index.css` 에 정의된 것을 **우선 사용**한다: `bg-background`, `text-foreground`, `bg-card`, `text-muted-foreground`, `text-primary`, `border-border`, `text-feature-1` 등. 다크모드는 `.dark` 클래스로 토큰이 스왑되므로, 하드코딩 색 대신 토큰을 쓰면 다크모드가 자동 대응된다.
- 토큰에 없는 값은 arbitrary value 로 쓴다: `h-[calc(100%+20px)]`, `bg-[linear-gradient(...)]`, `left-[var(--dataset-avgPos)]` 등.
- 클래스 정렬은 prettier-plugin-tailwindcss 기준(레이아웃 → 박스 → 타이포 → 색 → 상태) 순서를 따른다.

## 변환 규칙

1. **입력이 SCSS/CSS 인 경우**
   - 선택자별 스타일을 해당 요소의 `className` 유틸리티로 옮긴다.
   - `$변수`, `var(--gap-xs)` 같은 디자인 토큰은 근사값으로 매핑하고(예: `--gap-xs` ≈ 8px → `gap-2`), 추정한 값은 코드블록 아래에 "확인 필요"로 짧게 명시한다.
   - `&::before` / `&::after` 는 `before:` / `after:` variant 로 옮긴다. `content: ""` 는 `before:content-['']`.
   - `@include tablet` 등 미디어 믹스인은 `md:` 로 옮기되, 실제 브레이크포인트를 모르면 그 사실을 명시한다.
   - JS가 세팅하는 CSS 변수(`--dataset-*` 등)와 `data-*` 속성은 그대로 유지한다(로직 변경 금지).

2. **입력이 이미지/디자인 인 경우**
   - 레이아웃 구조(flex/grid), 간격, 타이포, 색을 관찰해서 마크업 + Tailwind 클래스로 재현한다.
   - 정확한 px 를 알 수 없는 부분은 Tailwind 스케일(`gap-2`, `text-sm`, `rounded-xl` 등)로 잡고 추정임을 밝힌다.

3. **입력이 HTML/JSX(기존 BEM 클래스 등) 인 경우**
   - 클래스명을 유틸리티로 치환한다. 이 프로젝트엔 해당 BEM 클래스용 CSS 가 없을 수 있으므로 그 점을 언급한다.
   - 반복되는 마크업(리스트 아이템 3개 등)은 전역 CSS 클래스(`@apply`)로 되돌리지 말고, 데이터 배열 + `.map()` 또는 작은 컴포넌트 추출을 우선 제안한다. 여러 페이지에서 재사용이 확실할 때만 `@utility` 를 대안으로 언급한다.

## CLAUDE.md 준수

- 요청한 범위만 변환한다. 관련 없는 코드/주석/포맷은 건드리지 않는다.
- 기존 프로젝트 코드 스타일과 구조를 우선한다.
- 요청하지 않은 기능/추상화/확장성 옵션을 임의로 추가하지 않는다.
- 더 단순한 방법이 있으면 단순한 쪽을 제안한다.

## 출력 형식

- **무조건 이 채팅에 코드블록으로** 변환 결과를 준다. 파일은 Edit/Write 하지 않는다.
- 추정/가정한 부분(토큰 값, 브레이크포인트, 프로젝트에 정의 없어 임시로 잡은 스타일, 가정한 색)이 있으면 코드블록 아래에 짧게 목록으로 덧붙인다.
