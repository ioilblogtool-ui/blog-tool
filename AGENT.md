# AGENT.md — 비교계산소 에이전트 가이드

> Claude Code 에이전트가 이 저장소에서 작업을 시작할 때 **가장 먼저** 읽는 파일입니다.
> 전체 맥락을 30초 안에 파악하고, 세부 기준은 아래 링크된 문서로 이동합니다.

---

## 1. 프로젝트 한 줄 요약

**비교계산소** (bigyocalc.com) — 연봉·육아·부동산·투자 계산기를 한국어로 제공하는 Astro SSG 사이트.
`main` 브랜치 push = 즉시 프로덕션 배포.

---

## 2. 핵심 명령어

```bash
npm run dev        # 로컬 dev 서버
npm run build      # 빌드 (커밋 전 필수)
npm run preview    # 빌드 결과 미리보기
npm run og:generate # OG 이미지 일괄 생성
```

---

## 3. 문서 지도 (TOC)

| 문서 | 역할 | 언제 열어야 하나 |
|---|---|---|
| `CLAUDE.md` | 프로젝트 규칙 허브 | 세션 시작 시 자동 로드 |
| `AGENT.md` ← 지금 여기 | 에이전트 빠른 참조 | 세션 시작 직후 |
| `docs/ARCHITECTURE.md` | 코드 구조 전체 지도 | 새 파일 추가·수정 전 |
| `docs/QUALITY_SCORE.md` | 품질 루브릭 | PR·배포 직전 |
| `docs/SECURITY.md` | 보안 규칙 | API키·외부링크·민감데이터 처리 시 |
| `CONTENT_GUIDE.md` | 콘텐츠·UX·SEO 기준 | 새 페이지 기획·구현 시 |
| `DEPLOY_CHECKLIST.md` | 배포 체크리스트 | 배포 직전 |
| `docs/plan-docs/` | 기획 문서 인덱스 | 새 기능 기획 시 |
| `docs/design-docs/` | 설계 문서 인덱스 | 구현 전 설계 확인 시 |
| `docs/references/` | 외부 레퍼런스 | 라이브러리·API 사용 시 |
| `docs/exec-plans/` | 실행 계획 | 다음 작업 우선순위 결정 시 |

---

## 4. 작업 유형별 빠른 결정 트리

```
새 계산기 추가?
  └─ docs/plan-docs/ → docs/design-docs/ → CONTENT_GUIDE.md → 구현 → 배포

새 리포트 추가?
  └─ docs/ARCHITECTURE.md (reports 패턴) → docs/design-docs/ → 구현

UI/스타일 수정?
  └─ docs/UI_ARCHITECTURE.md → docs/QUALITY_SCORE.md

계산 로직 수정?
  └─ docs/CODE_SKILL.md → docs/QUALITY_SCORE.md

배포 전 점검?
  └─ DEPLOY_CHECKLIST.md → docs/QUALITY_SCORE.md

보안·API키 관련?
  └─ docs/SECURITY.md (먼저)
```

---

## 5. 절대 하지 말 것 (hard rules)

- `main` 브랜치에 빌드 에러 상태로 push 금지
- 사용자 facing 텍스트를 영어로 작성 금지 (한국어 전용)
- `추정` / `시뮬레이션` 배지 없이 추정값을 공식 데이터처럼 제시 금지
- `.env`, API 키, 개인정보를 코드에 하드코딩 금지
- `--no-verify` 플래그로 git hook 우회 금지

---

## 5-1. 신규 페이지 등록 필수 체크포인트 ⚠️

> 새 계산기·리포트를 구현할 때 아래 파일 등록을 **빠짐없이** 완료해야 한다.
> 누락 시 메인/리포트 페이지에서 "기타" 표시 또는 목록에서 제외된다.

### 계산기 (tools/) 신규 추가 시

| 순서 | 파일 | 등록 내용 |
|---|---|---|
| 1 | `src/data/tools.ts` | `{ slug, title, order, badges }` 항목 추가 |
| 2 | `src/pages/index.astro` → `topicBySlug` | `"<slug>": "<카테고리>"` 추가 |
| 3 | `src/styles/app.scss` | `@use 'scss/pages/<slug>'` 추가 |
| 4 | `public/sitemap.xml` | `<url>` 블록 추가 |

**`topicBySlug` 카테고리 목록:**
`"연봉·이직"` / `"성과급 비교"` / `"육아휴직·출산"` / `"육아·양육"` / `"복지·지원금"` / `"부동산·내집마련"` / `"투자·재테크"` / `"세금·연말정산"` / `"대출·금융"` / `"보험·의료비"` / `"결혼·웨딩"` / `"여행·생활"` / `"AI·생산성"` / `"스포츠"` / `"자동차"` / `"암호화폐"` / `"생활·유틸리티"`

### 리포트 (reports/) 신규 추가 시

| 순서 | 파일 | 등록 내용 |
|---|---|---|
| 1 | `src/data/reports.ts` | `{ slug, title, description, order, badges }` 항목 추가 |
| 2 | `src/pages/index.astro` → `reportMetaBySlug` | `"<slug>": { category, isNew }` 추가 |
| 3 | `src/pages/reports/index.astro` → `reportMetaBySlug` | `"<slug>": { eyebrow, tags, category, isNew }` 추가 |
| 4 | `src/styles/app.scss` | `@use 'scss/pages/<slug>'` 추가 |
| 5 | `public/sitemap.xml` | `<url>` 블록 추가 |

**`category` 값 목록 (reports/index.astro 필터 기준):**
`"salary"` / `"bonus"` / `"estate"` / `"asset"` / `"life"` / `"culture"` / `"support"` / `"insurance"` / `"tax"` / `"politics"` / `"crypto"` / `"sports"`

### 구현 완료 후 검증 명령어

```bash
npm run check:all
```

> `astro check`(타입·임포트 오류) + `check:mapping`(카테고리 누락)을 순서대로 실행.
> 둘 다 통과해야 커밋. 풀 빌드는 push 후 CI가 처리한다.

카테고리 누락만 빠르게 보려면:

```bash
npm run check:mapping        # 검사만
npm run fix:mapping          # 자동 수정
```

---

## 6. 파일 네이밍 컨벤션

| 종류 | 패턴 | 예시 |
|---|---|---|
| 계산기 페이지 | `src/pages/tools/<slug>.astro` | `fire-calculator.astro` |
| 리포트 페이지 | `src/pages/reports/<slug>.astro` | `salary-asset-2016-vs-2026.astro` |
| 클라이언트 JS | `public/scripts/<slug>.js` | `fire-calculator.js` |
| SCSS | `src/styles/scss/pages/_<slug>.scss` | `_fire-calculator.scss` |
| 데이터 TS | `src/data/<camelCase>.ts` | `fireCalculator.ts` |
| 기획 문서 | `docs/plan/YYYYMM/<slug>.md` | `docs/plan/202604/ai-stack-cost-calculator.md` |
| 설계 문서 | `docs/design/YYYYMM/<slug>-design.md` | `docs/design/202604/ai-stack-cost-calculator-design.md` |

---

## 7. 데이터 배지 기준

| 배지 | 의미 | 예시 |
|---|---|---|
| `공식` | 정부·공공기관·기업 공개 수치 | 보험료율 9.5% |
| `시뮬레이션` | 가정 기반 추정값 | 납입 총액 6,800만원 |
| `참고` | 외부 출처 인용 (정확도 제한) | OECD 소득대체율 |
| `추정` | 편집팀 자체 추산 | 체감 비용 변화 |
