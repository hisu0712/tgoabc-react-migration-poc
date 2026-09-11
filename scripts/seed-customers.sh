#!/usr/bin/env bash
# 지정한 회원(member) 이메일에 테스트 고객 N명을 프로젝트의 실제 등록 로직 그대로
# 추가하는 스크립트. src/api/customer.ts의 createCustomer()와 동일하게
# create-customer-auth 엣지 함수 호출 한 번으로 끝남 (auth 유저 생성 +
# customer insert + member_customer_mapping insert까지 함수 안에서 처리).
# 함수가 Authorization 헤더의 토큰 주인을 member_id로 쓰기 때문에, 서비스 롤이
# 아니라 "회원 본인 세션"으로 호출해야 함 -> magiclink로 비밀번호 없이 발급.
#
# 사용 전: 터미널에 서비스 롤 키를 환경변수로 설정해야 함 (커밋/채팅에 붙여넣지 말 것)
#   export SUPABASE_SERVICE_ROLE_KEY="여기에_붙여넣기"
#
# 사용법:
#   ./scripts/seed-customers.sh <회원 이메일> [고객 수(기본 1)]
#   ./scripts/seed-customers.sh test@test.com 1

set -euo pipefail

SUPABASE_URL="${SUPABASE_URL:-https://xexodjsipilbscjnwfqx.supabase.co}"
SUPABASE_ANON_KEY="${SUPABASE_ANON_KEY:-sb_publishable_DIUEeUvuHVnJ4HpdqHq_3A_Y0yzdvFJ}"

if [ -z "${SUPABASE_SERVICE_ROLE_KEY:-}" ]; then
  echo "SUPABASE_SERVICE_ROLE_KEY 환경변수가 설정되어 있지 않습니다." >&2
  echo "  export SUPABASE_SERVICE_ROLE_KEY=\"...\" 실행 후 다시 시도하세요." >&2
  exit 1
fi

MEMBER_EMAIL="${1:?사용법: $0 <회원 이메일> [고객 수]}"
COUNT="${2:-1}"

TMPDIR_LOCAL=$(mktemp -d)
trap 'rm -rf "$TMPDIR_LOCAL"' EXIT

ADMIN_HEADERS=(
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY"
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY"
  -H "Content-Type: application/json"
)

echo "0) member 조회: $MEMBER_EMAIL"
MEMBER_RESPONSE=$(curl -sS -G "$SUPABASE_URL/rest/v1/member" \
  "${ADMIN_HEADERS[@]}" \
  --data-urlencode "select=id" \
  --data-urlencode "email=eq.$MEMBER_EMAIL")

MEMBER_ID=$(echo "$MEMBER_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$MEMBER_ID" ]; then
  echo "해당 이메일의 member를 찾지 못했습니다: $MEMBER_RESPONSE" >&2
  exit 1
fi

echo "member id: $MEMBER_ID"

echo "0-1) $MEMBER_EMAIL 본인 세션 발급 (magiclink, 비밀번호 불필요)"
printf '{"type":"magiclink","email":"%s"}' "$MEMBER_EMAIL" > "$TMPDIR_LOCAL/link.json"

LINK_RESPONSE=$(curl -sS -X POST "$SUPABASE_URL/auth/v1/admin/generate_link" \
  "${ADMIN_HEADERS[@]}" \
  --data-binary "@$TMPDIR_LOCAL/link.json")

HASHED_TOKEN=$(echo "$LINK_RESPONSE" | grep -o '"hashed_token":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$HASHED_TOKEN" ]; then
  echo "magiclink 발급 실패: $LINK_RESPONSE" >&2
  exit 1
fi

printf '{"type":"magiclink","token_hash":"%s"}' "$HASHED_TOKEN" > "$TMPDIR_LOCAL/verify.json"

VERIFY_RESPONSE=$(curl -sS -X POST "$SUPABASE_URL/auth/v1/verify" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  --data-binary "@$TMPDIR_LOCAL/verify.json")

MEMBER_ACCESS_TOKEN=$(echo "$VERIFY_RESPONSE" | grep -o '"access_token":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$MEMBER_ACCESS_TOKEN" ]; then
  echo "회원 세션 발급 실패: $VERIFY_RESPONSE" >&2
  exit 1
fi

echo "회원 세션 발급 완료"

GENDERS=("M" "F")
TIMESTAMP=$(date +%s)

for i in $(seq 1 "$COUNT"); do
  NAME="홍길동$i"
  GENDER="${GENDERS[$((i % 2))]}"
  DAY=$(printf '%02d' "$((i % 28 + 1))")
  BIRTH_DATE="1990-01-$DAY"
  EMAIL="cust-${TIMESTAMP}-${i}@example.com"

  echo "$i) create-customer-auth 엣지 함수 호출: $EMAIL"

  # customer.ts의 createCustomer()가 하는 것과 동일하게, 배포된 엣지 함수를 그대로 호출
  # (customer insert + member_customer_mapping insert까지 함수 안에서 처리됨)
  printf '{"email":"%s","name":"%s","birthDate":"%s","gender":"%s"}' \
    "$EMAIL" "$NAME" "$BIRTH_DATE" "$GENDER" > "$TMPDIR_LOCAL/auth-req.json"

  AUTH_RESPONSE=$(curl -sS -X POST "$SUPABASE_URL/functions/v1/create-customer-auth" \
    -H "apikey: $SUPABASE_ANON_KEY" \
    -H "Authorization: Bearer $MEMBER_ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    --data-binary "@$TMPDIR_LOCAL/auth-req.json")

  CUSTOMER_ID=$(echo "$AUTH_RESPONSE" | grep -o '"customerId":"[^"]*"' | head -1 | cut -d'"' -f4)

  if [ -z "$CUSTOMER_ID" ]; then
    echo "  create-customer-auth 실패: $AUTH_RESPONSE" >&2
    continue
  fi

  echo "  -> customer 생성 + 매핑 완료: $NAME ($EMAIL, id: $CUSTOMER_ID)"
done

echo "완료. $MEMBER_EMAIL 에게 고객 $COUNT 명 추가함 (create-customer-auth 엣지 함수 그대로 사용)."
