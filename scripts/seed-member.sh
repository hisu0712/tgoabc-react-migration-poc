#!/usr/bin/env bash
# 원격 Supabase 프로젝트에 테스트용 회원(member) 계정을 생성하는 스크립트
#
# 사용 전: 터미널에 서비스 롤 키를 환경변수로 설정해야 함 (커밋/채팅에 붙여넣지 말 것)
#   export SUPABASE_SERVICE_ROLE_KEY="여기에_붙여넣기"
#
# 사용법:
#   ./scripts/seed-member.sh
#   ./scripts/seed-member.sh test2@example.com Test1234! 테스트회원2 01012345678 테스트매장2
#
# 참고: JSON body는 curl -d 인자로 바로 안 넘기고 임시파일에 써서 --data-binary @file로 넘깁니다.
# Git Bash(MSYS)가 네이티브 curl.exe에 한글 등 멀티바이트 문자를 커맨드라인 인자로 넘길 때
# 바이트가 깨지는 문제가 있어서, 파일을 거쳐 전달해 이를 피합니다.

set -euo pipefail

SUPABASE_URL="${SUPABASE_URL:-https://xexodjsipilbscjnwfqx.supabase.co}"

if [ -z "${SUPABASE_SERVICE_ROLE_KEY:-}" ]; then
  echo "SUPABASE_SERVICE_ROLE_KEY 환경변수가 설정되어 있지 않습니다." >&2
  echo "  export SUPABASE_SERVICE_ROLE_KEY=\"...\" 실행 후 다시 시도하세요." >&2
  exit 1
fi

EMAIL="${1:-test-member@example.com}"
PASSWORD="${2:-Test1234!}"
NAME="${3:-테스트회원}"
PHONE="${4:-01000000000}"
SHOP_NAME="${5:-테스트매장}"

TMPDIR_LOCAL=$(mktemp -d)
trap 'rm -rf "$TMPDIR_LOCAL"' EXIT

echo "1) auth 유저 생성: $EMAIL"
printf '{"email":"%s","password":"%s","email_confirm":true,"app_metadata":{"roles":["member"]}}' \
  "$EMAIL" "$PASSWORD" > "$TMPDIR_LOCAL/user.json"

USER_RESPONSE=$(curl -sS -X POST "$SUPABASE_URL/auth/v1/admin/users" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  --data-binary "@$TMPDIR_LOCAL/user.json")

echo "$USER_RESPONSE"

USER_ID=$(echo "$USER_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$USER_ID" ]; then
  echo "유저 생성에 실패한 것으로 보입니다. 위 응답을 확인하세요." >&2
  exit 1
fi

echo "생성된 유저 id: $USER_ID"

echo "2) member 테이블 insert"
printf '{"id":"%s","email":"%s","name":"%s","phone":"%s"}' \
  "$USER_ID" "$EMAIL" "$NAME" "$PHONE" > "$TMPDIR_LOCAL/member.json"

curl -sS -X POST "$SUPABASE_URL/rest/v1/member" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  --data-binary "@$TMPDIR_LOCAL/member.json"
echo

echo "3) shop 테이블 insert"
printf '{"member_id":"%s","name":"%s"}' "$USER_ID" "$SHOP_NAME" > "$TMPDIR_LOCAL/shop.json"

curl -sS -X POST "$SUPABASE_URL/rest/v1/shop" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  --data-binary "@$TMPDIR_LOCAL/shop.json"
echo

echo "완료. 로그인 계정: $EMAIL / $PASSWORD"
