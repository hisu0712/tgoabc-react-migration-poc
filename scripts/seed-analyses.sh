#!/usr/bin/env bash
# 지정한 고객(customer) 이메일에 테스트 퍼스널컬러 분석(analysis) 기록 N건을
# public/face.png를 원본/결과 이미지로 써서 추가하는 스크립트.
# 실제 분석 모듈은 안 돌리고, personalType을 8종류로 순환시켜 임의의 result JSON을 채워 넣음
# (리스트 페이지의 필터/뱃지/정렬 테스트용).
#
# 순서:
#   1) customer 테이블에서 이메일로 customer id 조회
#   2) face.png를 Storage(uploads 버킷)의 {customerId}/analysis/{analysisId}/original.png 에 업로드
#      (원본/결과 이미지 구분이 테스트에 중요하지 않아 같은 파일을 재사용, 업로드는 1회만)
#   3) analysis 테이블에 insert (member_id는 비워둠 -> 고객 앱에서 직접 진행한 케이스로 시딩)
#
# 사용 전: 터미널에 서비스 롤 키를 환경변수로 설정해야 함 (커밋/채팅에 붙여넣지 말 것)
#   export SUPABASE_SERVICE_ROLE_KEY="여기에_붙여넣기"
#
# 사용법:
#   ./scripts/seed-analyses.sh <고객 이메일> [분석 수(기본 1)]
#   ./scripts/seed-analyses.sh cust-1234-1@example.com 5

set -euo pipefail

SUPABASE_URL="${SUPABASE_URL:-https://xexodjsipilbscjnwfqx.supabase.co}"
BUCKET_NAME="uploads"

if [ -z "${SUPABASE_SERVICE_ROLE_KEY:-}" ]; then
  echo "SUPABASE_SERVICE_ROLE_KEY 환경변수가 설정되어 있지 않습니다." >&2
  echo "  export SUPABASE_SERVICE_ROLE_KEY=\"...\" 실행 후 다시 시도하세요." >&2
  exit 1
fi

CUSTOMER_EMAIL="${1:?사용법: $0 <고객 이메일> [분석 수]}"
COUNT="${2:-1}"

FACE_IMAGE="$(dirname "$0")/../public/face.png"
if [ ! -f "$FACE_IMAGE" ]; then
  echo "public/face.png를 찾을 수 없습니다: $FACE_IMAGE" >&2
  exit 1
fi

TMPDIR_LOCAL=$(mktemp -d)
trap 'rm -rf "$TMPDIR_LOCAL"' EXIT

ADMIN_HEADERS=(
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY"
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY"
)

echo "0) customer 조회: $CUSTOMER_EMAIL"
CUSTOMER_RESPONSE=$(curl -sS -G "$SUPABASE_URL/rest/v1/customer" \
  "${ADMIN_HEADERS[@]}" \
  --data-urlencode "select=id" \
  --data-urlencode "email=eq.$CUSTOMER_EMAIL")

CUSTOMER_ID=$(echo "$CUSTOMER_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$CUSTOMER_ID" ]; then
  echo "해당 이메일의 customer를 찾지 못했습니다: $CUSTOMER_RESPONSE" >&2
  exit 1
fi

echo "customer id: $CUSTOMER_ID"

PERSONAL_TYPES=(
  springBright springLight summerLight summerMute
  autumnMute autumnDark winterBright winterDark
)
SKIN_TONES=("cool" "warm" "neutral")

gen_uuid() {
  local hex
  hex=$(openssl rand -hex 16)
  echo "${hex:0:8}-${hex:8:4}-${hex:12:4}-${hex:16:4}-${hex:20:12}"
}

for i in $(seq 1 "$COUNT"); do
  ANALYSIS_ID=$(gen_uuid)
  PERSONAL_TYPE="${PERSONAL_TYPES[$((i % 8))]}"
  SKIN_TONE="${SKIN_TONES[$((i % 3))]}"
  CREATED_AT=$(date -u -d "-$i days" +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null \
    || date -u -v-"${i}"d +"%Y-%m-%dT%H:%M:%SZ")

  echo "$i) 이미지 업로드 ($PERSONAL_TYPE)"
  IMAGE_PATH="$CUSTOMER_ID/analysis/$ANALYSIS_ID/original.png"

  curl -sS -X POST "$SUPABASE_URL/storage/v1/object/$BUCKET_NAME/$IMAGE_PATH" \
    "${ADMIN_HEADERS[@]}" \
    -H "Content-Type: image/png" \
    --data-binary "@$FACE_IMAGE" > /dev/null

  IMAGE_URL="$SUPABASE_URL/storage/v1/object/public/$BUCKET_NAME/$IMAGE_PATH"

  cat > "$TMPDIR_LOCAL/analysis.json" <<JSON
{
  "id": "$ANALYSIS_ID",
  "customer_id": "$CUSTOMER_ID",
  "member_id": null,
  "original_image_url": "$IMAGE_URL",
  "result_image_url": "$IMAGE_URL",
  "result": {
    "personalType": "$PERSONAL_TYPE",
    "axis": {
      "hue": { "value": 45.2, "min": 22.5, "max": 71.2 },
      "lightness": { "value": 70.1, "min": 30.4, "max": 90 },
      "chroma": { "value": 24.3, "min": 14.2, "max": 37.1 }
    },
    "cheek": { "avgRgb": "#d2b0a7" },
    "hair": { "avgRgb": "#141514" },
    "pupil": { "avgRgb": "#2f2a2b" },
    "skin": { "skinCode": ["19", "21", "23"], "skinTone": "$SKIN_TONE" }
  },
  "created_at": "$CREATED_AT"
}
JSON

  INSERT_RESPONSE=$(curl -sS -X POST "$SUPABASE_URL/rest/v1/analysis" \
    "${ADMIN_HEADERS[@]}" \
    -H "Content-Type: application/json" \
    -H "Prefer: return=representation" \
    --data-binary "@$TMPDIR_LOCAL/analysis.json")

  if ! echo "$INSERT_RESPONSE" | grep -q '"id"'; then
    echo "  analysis insert 실패: $INSERT_RESPONSE" >&2
    continue
  fi

  echo "  -> analysis 생성 완료: $ANALYSIS_ID ($PERSONAL_TYPE, $CREATED_AT)"
done

echo "완료. $CUSTOMER_EMAIL 에게 분석 기록 $COUNT 건 추가함."
