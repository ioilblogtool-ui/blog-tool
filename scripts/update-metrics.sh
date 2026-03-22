#!/bin/bash
# =============================================================
# update-metrics.sh — 4주 후 GSC 성과 지표 CSV 자동 기록
# 사용법: ./scripts/update-metrics.sh /tools/unemployment-benefit/
# =============================================================

set -e

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; GRAY='\033[0;90m'; NC='\033[0m'
ok()   { echo -e "${GREEN}✅ $1${NC}"; }
info() { echo -e "${BLUE}▶  $1${NC}"; }
dim()  { echo -e "${GRAY}   $1${NC}"; }

URL_PATH="${1:-}"
[ -z "$URL_PATH" ] && { echo "사용법: ./scripts/update-metrics.sh /tools/slug/"; exit 1; }

FULL_URL="https://bigyocalc.com${URL_PATH}"
LOG_FILE="docs/deploy-log.csv"
DATE=$(date +%Y-%m-%d)

echo ""
info "4주 성과 지표 업데이트: $FULL_URL"

# GSC Search Console API로 지표 조회
CLICKS=""
POSITION=""

if [ -f ".env" ] && grep -q "GSC_TOKEN" .env; then
  source .env
  START_DATE=$(date -d "28 days ago" +%Y-%m-%d 2>/dev/null || date -v-28d +%Y-%m-%d)

  GSC_DATA=$(curl -s -X POST \
    "https://searchconsole.googleapis.com/webmasters/v3/sites/https%3A%2F%2Fbigyocalc.com/searchAnalytics/query" \
    -H "Authorization: Bearer $GSC_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"startDate\": \"${START_DATE}\",
      \"endDate\": \"${DATE}\",
      \"dimensions\": [\"page\"],
      \"dimensionFilterGroups\": [{
        \"filters\": [{
          \"dimension\": \"page\",
          \"operator\": \"equals\",
          \"expression\": \"${FULL_URL}\"
        }]
      }]
    }" 2>/dev/null)

  CLICKS=$(echo "$GSC_DATA" | python3 -c "
import json,sys
d=json.load(sys.stdin)
rows=d.get('rows',[])
print(int(rows[0]['clicks']) if rows else '0')
" 2>/dev/null || echo "0")

  POSITION=$(echo "$GSC_DATA" | python3 -c "
import json,sys
d=json.load(sys.stdin)
rows=d.get('rows',[])
print(round(rows[0]['position'],1) if rows else '-')
" 2>/dev/null || echo "-")

  ok "GSC 데이터 조회 완료 (클릭: ${CLICKS}, 평균순위: ${POSITION})"
else
  echo -e "${YELLOW}GSC_TOKEN 없음 — 수동으로 입력하세요${NC}"
  read -p "   최근 30일 클릭수 (GSC에서 확인): " CLICKS
  read -p "   구글 평균 순위 (GSC에서 확인): " POSITION
fi

# CSV 업데이트
if [ -f "$LOG_FILE" ]; then
  python3 - <<PYEOF
import csv

log_file = "$LOG_FILE"
url_path = "$URL_PATH"
clicks   = "$CLICKS"
position = "$POSITION"

rows = []
with open(log_file, 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    headers = next(reader)
    rows = list(reader)

try:
    url_col     = headers.index('URL경로')
    clicks_col  = headers.index('4주후유입')
    rank_col    = headers.index('구글순위')
except ValueError:
    print("컬럼 없음 — CSV 헤더 확인 필요")
    exit()

for i in range(len(rows)-1, -1, -1):
    if len(rows[i]) > url_col and rows[i][url_col] == url_path:
        rows[i][clicks_col] = clicks
        rows[i][rank_col]   = position
        print(f"지표 업데이트 완료: 클릭 {clicks}, 순위 {position}")
        break

with open(log_file, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(headers)
    writer.writerows(rows)
PYEOF

  git add "$LOG_FILE"
  git commit -m "chore: metrics update ${DATE} ${URL_PATH}" --quiet
  git push origin main --quiet
  ok "deploy-log.csv 지표 업데이트 + 커밋 완료"
fi
