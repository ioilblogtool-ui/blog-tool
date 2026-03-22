#!/bin/bash
# =============================================================
# after-deploy.sh — 배포 후 SEO 자동화 + CSV 상태 업데이트
# 사용법: ./scripts/after-deploy.sh /tools/unemployment-benefit/
# deploy.sh 실행 후 3분 뒤에 실행하세요
# =============================================================

set -e

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'
BLUE='\033[0;34m'; GRAY='\033[0;90m'; NC='\033[0m'
ok()   { echo -e "${GREEN}✅ $1${NC}"; }
warn() { echo -e "${YELLOW}⚠️  $1${NC}"; }
err()  { echo -e "${RED}❌ $1${NC}"; exit 1; }
info() { echo -e "${BLUE}▶  $1${NC}"; }
dim()  { echo -e "${GRAY}   $1${NC}"; }

URL_PATH="${1:-}"
[ -z "$URL_PATH" ] && err "URL 경로가 없습니다. 예: ./scripts/after-deploy.sh /tools/unemployment-benefit/"

FULL_URL="https://bigyocalc.com${URL_PATH}"
DATE=$(date +%Y-%m-%d)
LOG_FILE="docs/deploy-log.csv"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
info "배포 후 SEO 자동화"
dim "대상 URL: $FULL_URL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ════════════════════════════════════════════════════════════
# STEP 1 — 라이브 확인
# ════════════════════════════════════════════════════════════
echo ""
info "STEP 1/4  라이브 사이트 확인"

HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$FULL_URL")
if [ "$HTTP_STATUS" = "200" ]; then
  ok "라이브 확인 완료 (HTTP $HTTP_STATUS)"
  LIVE_STATUS="✅ 확인"
else
  warn "HTTP $HTTP_STATUS — 배포가 아직 진행 중일 수 있습니다"
  LIVE_STATUS="⚠️ HTTP${HTTP_STATUS}"
  read -p "   계속 진행할까요? (y/N): " CONT
  [ "$CONT" != "y" ] && exit 0
fi

# ════════════════════════════════════════════════════════════
# STEP 2 — GSC Indexing API 색인 요청
# ════════════════════════════════════════════════════════════
echo ""
info "STEP 2/4  Google Search Console 색인 요청"

GSC_STATUS="⬜ 미실행"

# .env 파일에서 GSC_TOKEN 로드
if [ -f ".env" ] && grep -q "GSC_TOKEN" .env; then
  source .env

  if [ -n "$GSC_TOKEN" ]; then
    GSC_RESPONSE=$(curl -s -X POST \
      "https://indexing.googleapis.com/v3/urlNotifications:publish" \
      -H "Authorization: Bearer $GSC_TOKEN" \
      -H "Content-Type: application/json" \
      -d "{\"url\": \"${FULL_URL}\", \"type\": \"URL_UPDATED\"}" 2>/dev/null)

    if echo "$GSC_RESPONSE" | grep -q "urlNotificationMetadata"; then
      ok "GSC 색인 요청 완료"
      dim "$FULL_URL"
      GSC_STATUS="✅ 제출완료"
    else
      warn "GSC API 오류 — 수동 제출 필요"
      dim "응답: $GSC_RESPONSE"
      GSC_STATUS="⚠️ API오류"
    fi
  fi
else
  warn "GSC_TOKEN 없음 — 수동 제출 필요"
  echo -e "  ${BLUE}→ search.google.com/search-console${NC}"
  echo -e "  ${BLUE}  URL 검사 → ${FULL_URL} → 색인 생성 요청${NC}"
  GSC_STATUS="⬜ 수동필요"
fi

# ════════════════════════════════════════════════════════════
# STEP 3 — 네이버 서치어드바이저 안내 (API 미제공 → 수동)
# ════════════════════════════════════════════════════════════
echo ""
info "STEP 3/4  네이버 서치어드바이저"

echo -e "  ${YELLOW}네이버는 API를 제공하지 않아 수동 제출이 필요합니다:${NC}"
echo -e "  ${BLUE}1. searchadvisor.naver.com 접속${NC}"
echo -e "  ${BLUE}2. 웹 페이지 수집 요청 탭${NC}"
echo -e "  ${BLUE}3. ${FULL_URL} 입력 후 제출${NC}"
echo ""
read -p "   네이버 서치어드바이저 제출 완료했나요? (y/N): " NAVER_DONE
if [ "$NAVER_DONE" = "y" ]; then
  NAVER_STATUS="✅ 제출완료"
  ok "네이버 서치어드바이저 제출 완료"
else
  NAVER_STATUS="⬜ 예정"
  warn "나중에 제출하세요 — 로그에 '예정'으로 기록합니다"
fi

# ════════════════════════════════════════════════════════════
# STEP 4 — CSV 상태 업데이트
# ════════════════════════════════════════════════════════════
echo ""
info "STEP 4/4  배포 로그 업데이트"

if [ -f "$LOG_FILE" ]; then
  # URL_PATH 기준으로 가장 최근 행 찾아서 상태 업데이트
  # Python으로 CSV 정확하게 수정
  python3 - <<PYEOF
import csv, os, sys

log_file = "$LOG_FILE"
url_path = "$URL_PATH"
live_status = "$LIVE_STATUS"
gsc_status = "$GSC_STATUS"
naver_status = "$NAVER_STATUS"

rows = []
updated = False

with open(log_file, 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    headers = next(reader)
    rows = list(reader)

# URL경로 컬럼 인덱스 찾기
try:
    url_col = headers.index('URL경로')
    live_col = headers.index('라이브확인')
    gsc_col  = headers.index('GSC제출')
    naver_col = headers.index('네이버제출')
    cf_col   = headers.index('CF배포')
except ValueError as e:
    print(f"컬럼 인덱스 오류: {e}")
    sys.exit(0)

# 가장 최근 매칭 행 업데이트
for i in range(len(rows)-1, -1, -1):
    if len(rows[i]) > url_col and rows[i][url_col] == url_path:
        rows[i][cf_col]    = "✅ 완료"
        rows[i][live_col]  = live_status
        rows[i][gsc_col]   = gsc_status
        rows[i][naver_col] = naver_status
        updated = True
        print(f"로그 업데이트: 행 {i+2} ({url_path})")
        break

if not updated:
    print(f"해당 URL 행을 찾지 못했습니다: {url_path}")

with open(log_file, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(headers)
    writer.writerows(rows)
PYEOF

  ok "deploy-log.csv 업데이트 완료"

  # 로그 변경사항 커밋
  git add "$LOG_FILE"
  git commit -m "chore: after-deploy log update ${DATE} ${URL_PATH}" --quiet 2>/dev/null || true
  git push origin main --quiet 2>/dev/null || true
  dim "로그 변경사항 커밋 완료"
else
  warn "deploy-log.csv 없음 — deploy.sh를 먼저 실행했는지 확인하세요"
fi

# ── 완료 요약 ────────────────────────────────────────────────
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
ok "SEO 자동화 완료"
dim "라이브:   $LIVE_STATUS"
dim "GSC:      $GSC_STATUS"
dim "네이버:   $NAVER_STATUS"
echo ""
echo -e "${YELLOW}4주 후 할 일:${NC}"
echo -e "  ${BLUE}./scripts/update-metrics.sh ${URL_PATH}${NC}"
dim "GSC에서 유입수·순위 확인 후 deploy-log.csv에 자동 기록됩니다"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
