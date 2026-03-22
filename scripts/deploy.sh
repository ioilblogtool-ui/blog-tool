#!/bin/bash
# =============================================================
# deploy.sh — 비교계산소 배포 자동화
# 사용법: ./scripts/deploy.sh "feat: 실업급여 계산기 추가" unemployment-benefit 계산기
# 인자:  $1 커밋 메시지  $2 slug (없으면 자동 감지)  $3 타입 (계산기/리포트/비교)
# =============================================================

set -e  # 오류 발생 시 즉시 중단

# ── 색상 출력 헬퍼 ────────────────────────────────────────────
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'
BLUE='\033[0;34m'; GRAY='\033[0;90m'; NC='\033[0m'
ok()   { echo -e "${GREEN}✅ $1${NC}"; }
warn() { echo -e "${YELLOW}⚠️  $1${NC}"; }
err()  { echo -e "${RED}❌ $1${NC}"; exit 1; }
info() { echo -e "${BLUE}▶  $1${NC}"; }
dim()  { echo -e "${GRAY}   $1${NC}"; }

# ── 인자 파싱 ────────────────────────────────────────────────
COMMIT_MSG="${1:-}"
SLUG="${2:-}"
CONTENT_TYPE="${3:-계산기}"  # 계산기 | 리포트 | 비교

[ -z "$COMMIT_MSG" ] && err "커밋 메시지가 없습니다. 예: ./scripts/deploy.sh \"feat: 실업급여 계산기 추가\" unemployment-benefit 계산기"

DATE=$(date +%Y-%m-%d)
DATETIME=$(date +"%Y-%m-%d %H:%M")
LOG_FILE="docs/deploy-log.csv"
mkdir -p docs

# ── slug 자동 감지 (인자 없을 때) ────────────────────────────
if [ -z "$SLUG" ]; then
  SLUG=$(git diff --name-only HEAD | grep "src/pages/tools/" | sed 's|src/pages/tools/||;s|\.astro||' | head -1)
  SLUG=${SLUG:-"unknown"}
  dim "slug 자동 감지: $SLUG"
fi

# URL 경로 결정
case "$CONTENT_TYPE" in
  리포트) URL_PATH="/reports/${SLUG}/" ;;
  비교)   URL_PATH="/compare/${SLUG}/" ;;
  *)      URL_PATH="/tools/${SLUG}/"   ;;
esac

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
info "비교계산소 배포 시작"
dim "커밋: $COMMIT_MSG"
dim "slug: $SLUG  |  타입: $CONTENT_TYPE  |  경로: $URL_PATH"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ════════════════════════════════════════════════════════════
# STEP 1 — 변경 파일 확인
# ════════════════════════════════════════════════════════════
echo ""
info "STEP 1/5  변경 파일 확인"
CHANGED_FILES=$(git diff --name-only HEAD)
STAGED_FILES=$(git diff --cached --name-only)
ALL_CHANGED="${CHANGED_FILES}\n${STAGED_FILES}"

if [ -z "$(git status --short)" ]; then
  warn "변경 사항이 없습니다. 중단합니다."
  exit 0
fi

git status --short
echo ""

# tools.ts 등록 확인
if echo "$ALL_CHANGED" | grep -q "src/pages/tools/"; then
  if ! echo "$ALL_CHANGED" | grep -q "src/data/tools.ts"; then
    warn "tools.ts 수정이 감지되지 않았습니다. 새 계산기라면 등록이 필요합니다."
    read -p "   계속 진행할까요? (y/N): " SKIP_TOOLS
    [ "$SKIP_TOOLS" != "y" ] && err "중단: tools.ts 먼저 확인하세요"
  else
    ok "tools.ts 수정 확인"
  fi
fi

# sitemap.xml 확인
if echo "$ALL_CHANGED" | grep -q "src/pages/"; then
  if ! echo "$ALL_CHANGED" | grep -q "public/sitemap.xml"; then
    warn "sitemap.xml 수정이 감지되지 않았습니다."
    read -p "   계속 진행할까요? (y/N): " SKIP_SITEMAP
    [ "$SKIP_SITEMAP" != "y" ] && err "중단: sitemap.xml 먼저 확인하세요"
  else
    ok "sitemap.xml 수정 확인"
  fi
fi

# ════════════════════════════════════════════════════════════
# STEP 2 — 빌드 검증
# ════════════════════════════════════════════════════════════
echo ""
info "STEP 2/5  npm run build"
BUILD_START=$(date +%s)

if npm run build > /tmp/build-output.txt 2>&1; then
  BUILD_END=$(date +%s)
  BUILD_SEC=$((BUILD_END - BUILD_START))
  ok "빌드 성공 (${BUILD_SEC}초)"
  BUILD_STATUS="✅ 성공"
else
  cat /tmp/build-output.txt
  err "빌드 실패 — 오류를 수정 후 다시 실행하세요"
fi

# ════════════════════════════════════════════════════════════
# STEP 3 — DEPLOY_CHECKLIST Claude 자동 점검
# ════════════════════════════════════════════════════════════
echo ""
info "STEP 3/5  DEPLOY_CHECKLIST 점검"

if command -v claude &> /dev/null; then
  dim "Claude Code로 체크리스트 자동 점검 중..."

  CHECKLIST_RESULT=$(claude --print "
비교계산소 DEPLOY_CHECKLIST.md 기준으로 다음 변경을 점검해줘.

변경 파일 목록:
$(git diff --name-only HEAD)

커밋 메시지: $COMMIT_MSG
콘텐츠 타입: $CONTENT_TYPE
slug: $SLUG

각 항목에 ✅/⚠️/➖ 표시.
마지막 줄에 'PASS' 또는 'FAIL' 한 단어로 최종 판정 출력.
중요 경고 있으면 ### WARNING 섹션에 정리.
" 2>/dev/null)

  echo "$CHECKLIST_RESULT"
  echo ""

  # FAIL 감지 시 중단
  if echo "$CHECKLIST_RESULT" | grep -q "^FAIL$"; then
    err "체크리스트 실패 — 위 경고 사항을 먼저 해결하세요"
  fi

  CHECKLIST_STATUS="✅ 통과"
  ok "체크리스트 통과"
else
  warn "Claude Code 미설치 — 체크리스트 수동 확인 필요"
  cat DEPLOY_CHECKLIST.md | head -50
  CHECKLIST_STATUS="⚠️ 수동확인"
fi

echo ""
read -p "$(echo -e "${YELLOW}위 내용 확인 완료? git push를 진행할까요? (y/N): ${NC}")" CONFIRM
[ "$CONFIRM" != "y" ] && { dim "사용자가 취소했습니다."; exit 0; }

# ════════════════════════════════════════════════════════════
# STEP 4 — git push
# ════════════════════════════════════════════════════════════
echo ""
info "STEP 4/5  git add → commit → push"

git add -A
git commit -m "$COMMIT_MSG"
COMMIT_HASH=$(git rev-parse --short HEAD)
git push origin main

ok "push 완료 (${COMMIT_HASH}) → Cloudflare 배포 시작됨"
dim "Cloudflare: https://dash.cloudflare.com/2880186367a08426232fac6a3c623f1b/workers-and-pages"

# ════════════════════════════════════════════════════════════
# STEP 5 — CSV 자동 기록
# ════════════════════════════════════════════════════════════
echo ""
info "STEP 5/5  배포 로그 기록"

# 헤더가 없으면 생성
if [ ! -f "$LOG_FILE" ]; then
  echo "날짜,시각,커밋해시,커밋메시지,slug,URL경로,콘텐츠타입,빌드,체크리스트,CF배포,GSC제출,네이버제출,라이브확인,4주후유입,구글순위,메모" > "$LOG_FILE"
  dim "deploy-log.csv 신규 생성"
fi

# 새 로그 행 추가
# CF배포·GSC·네이버는 after-deploy.sh 실행 시 자동 업데이트
NEW_ROW="${DATE},${DATETIME},${COMMIT_HASH},\"${COMMIT_MSG}\",${SLUG},${URL_PATH},${CONTENT_TYPE},${BUILD_STATUS},${CHECKLIST_STATUS},🔄 배포중,⬜ 예정,⬜ 예정,⬜ 확인전,,,push완료"
echo "$NEW_ROW" >> "$LOG_FILE"
ok "deploy-log.csv 기록 완료"

# 로그 파일도 커밋 (별도 커밋으로 분리)
git add "$LOG_FILE"
git commit -m "chore: deploy log ${DATE} ${SLUG}" --quiet
git push origin main --quiet
dim "로그 파일 자동 커밋 완료"

# ── 완료 요약 ────────────────────────────────────────────────
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
ok "배포 완료 요약"
dim "커밋:     $COMMIT_HASH — $COMMIT_MSG"
dim "URL:      https://bigyocalc.com${URL_PATH}"
dim "빌드:     $BUILD_STATUS"
dim "체크리스트: $CHECKLIST_STATUS"
dim "로그:     $LOG_FILE"
echo ""
echo -e "${YELLOW}다음 단계 (3분 후 실행):${NC}"
echo -e "  ${BLUE}./scripts/after-deploy.sh ${URL_PATH}${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
