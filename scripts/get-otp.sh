#!/usr/bin/env bash
# 이메일 발송이 막혀있을 때, 실제 메일 없이 로그인/회원가입용 OTP 코드를 바로 받아오는 스크립트.
# admin generate_link API가 OTP를 생성/저장하는 것까지는 이메일 발송 성공 여부와 무관하게
# 항상 정상 동작하기 때문에, 그 값을 응답에서 바로 꺼내오는 방식입니다.
#
# 사용 전: 터미널에 서비스 롤 키를 환경변수로 설정해야 함 (커밋/채팅에 붙여넣지 말 것)
#   export SUPABASE_SERVICE_ROLE_KEY="여기에_붙여넣기"
#
# 사용법:
#   ./scripts/get-otp.sh <이메일>
#   ./scripts/get-otp.sh vbnm0712@naver.com

set -euo pipefail

SUPABASE_URL="${SUPABASE_URL:-https://xexodjsipilbscjnwfqx.supabase.co}"

if [ -z "${SUPABASE_SERVICE_ROLE_KEY:-}" ]; then
  echo "SUPABASE_SERVICE_ROLE_KEY 환경변수가 설정되어 있지 않습니다." >&2
  echo "  export SUPABASE_SERVICE_ROLE_KEY=\"...\" 실행 후 다시 시도하세요." >&2
  exit 1
fi

EMAIL="${1:?사용법: $0 <이메일>}"

TMPDIR_LOCAL=$(mktemp -d)
trap 'rm -rf "$TMPDIR_LOCAL"' EXIT

printf '{"type":"magiclink","email":"%s"}' "$EMAIL" > "$TMPDIR_LOCAL/link.json"

LINK_RESPONSE=$(curl -sS -X POST "$SUPABASE_URL/auth/v1/admin/generate_link" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  --data-binary "@$TMPDIR_LOCAL/link.json")

EMAIL_OTP=$(echo "$LINK_RESPONSE" | grep -o '"email_otp":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$EMAIL_OTP" ]; then
  echo "OTP 발급 실패: $LINK_RESPONSE" >&2
  exit 1
fi

echo "$EMAIL 의 OTP: $EMAIL_OTP"
