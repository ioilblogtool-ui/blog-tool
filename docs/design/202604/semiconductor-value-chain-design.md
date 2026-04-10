# 반도체 밸류체인 리포트 설계 문서

> 기획 원문: `docs/plan/202604/semiconductor-value-chain-plan-v1.md`
> 작성일: 2026-04-09
> 구현 기준: Claude/Codex가 이 문서를 보고 바로 구현에 착수할 수 있는 수준으로 고정

---

## 1. 문서 개요

### 1-1. 대상

- 기획 문서: `docs/plan/202604/semiconductor-value-chain-plan-v1.md`
- 구현 대상: `엔비디아는 왜 공장이 없을까? 반도체 산업 구조 한눈에 보기`
- 참고 리포트:
  - `semiconductor-etf-2026` (연계 리포트, 내부 링크 양방향)
  - `us-rich-top10-patterns` (클릭 → 상세 패널 연동 패턴)

### 1-2. 문서 역할

- 기획 문서를 현재 비교계산소 `/reports/` 구조에 맞게 실제 구현 직전 수준으로 재구성한 설계 문서다.
- 화면 구조, 데이터 스키마, 인터랙션 상태, SCSS prefix, QA 기준을 고정한다.
- 이후 구현자는 이 문서를 기준으로 `src/data/`, `src/pages/reports/`, `public/scripts/`, `src/styles/` 작업을 진행한다.

### 1-3. 페이지 성격

- **독립형 산업 이해 콘텐츠**: ETF 리포트 보조가 아닌 독립 SEO 착지 페이지
- **핵심 흐름**: `산업 구조 파악 → 단계별 기업 탐색 → 미국·한국 강점 비교 → 오해 해소 → 관련 계산기·리포트 연결`
- **인터랙션 핵심**: 플로우맵 단계 클릭 → 설명 패널 / 기업 클릭 → 기업 상세 패널
- **SEO 포지셔닝**: 질문형 타이틀로 고클릭율 노림. 정보 탐색 + 비교 검색 동시 커버

### 1-4. 권장 slug

- `semiconductor-value-chain`
- URL: `/reports/semiconductor-value-chain/`

### 1-5. 권장 파일 구조

```
src/
  data/
    semiconductorValueChain.ts       ← 단계 + 기업 + 메타 통합 데이터 파일
  pages/
    reports/
      semiconductor-value-chain.astro

public/
  scripts/
    semiconductor-value-chain.js    ← 플로우맵 인터랙션

src/styles/scss/pages/
  _semiconductor-value-chain.scss   ← 페이지 전용 스타일 (prefix: vc-)
```

> **기획 문서의 subdirectory 구조(`data/value-chain/`)와 다르게** flat 단일 파일로 통합한다.
> 기존 프로젝트 패턴이 flat이며, 컴포넌트 분리도 현재 패턴에 따라 인라인 섹션으로 처리한다.

---

## 2. 현재 프로젝트 기준 정리

### 2-1. 기존 리포트 공통 구조

1. `CalculatorHero`
2. `InfoNotice`
3. 상단 요약 카드
4. 핵심 인터랙티브 섹션
5. 비교 / 해설 섹션
6. FAQ
7. 관련 계산기·리포트 CTA
8. `SeoContent`

### 2-2. 현재 구현 패턴

- 메타 등록: `src/data/reports.ts`
- 허브 노출: `src/pages/reports/index.astro`
- 페이지 데이터: `src/data/<topic>.ts`
- 페이지 마크업: `src/pages/reports/<slug>.astro`
- 클라이언트 인터랙션: `public/scripts/<slug>.js`
- 페이지 전용 스타일: `src/styles/scss/pages/_<slug>.scss`
- 사이트맵: `public/sitemap.xml`

### 2-3. 이번 리포트 특이점

- **플로우맵이 핵심 인터랙티브**: 6단계 가로 흐름, 단계/기업 클릭 → 패널 토글
- **기업 상세 패널**: 클릭 대상(단계 또는 기업)에 따라 다른 내용을 동일 패널 영역에 렌더링
- **국가 필터**: 전체 / 미국만 / 한국만 토글 → 반대 국가 기업 dimming
- 이 두 인터랙션은 모두 `public/scripts/semiconductor-value-chain.js` 한 파일이 처리한다

---

## 3. 구현 범위

### 3-1. MVP 범위

- 밸류체인 6단계 플로우맵 (정적 마크업 + JS 인터랙션)
- 단계 헤더 클릭 → 단계 설명 패널 오픈/닫기
- 기업 뱃지 클릭 → 기업 상세 패널 오픈/닫기
- 국가 필터 토글 (전체/미국/한국)
- 미국·한국 강점 CSS bar row 시각화
- 오해 3가지 카드 섹션
- 기업 20개 데이터 + 상세 패널

### 3-2. MVP 제외 범위

- 기획 문서의 "강점 오버레이" 하이라이트 애니메이션 (복잡도 대비 효과 낮음)
- 기업 간 연결선(relatedCompanies) 시각화
- 차트 라이브러리 (Chart.js) — CSS bar row로 대체
- 실시간 시총 API 연동
- "더 알아보기" 외부 링크 (1차에서는 미포함)

---

## 4. 페이지 목적

- 반도체 산업 구조를 처음 접하는 사용자가 "설계 → 장비 → 전공정 → 메모리 → 후공정 → 테스트" 6단계 흐름과 각 단계에서 활동하는 미국·한국 핵심 기업을 한 페이지에서 파악하게 한다.
- "ETF를 사기 전에 이 회사가 반도체 어느 단계에 있는지"를 이해하게 해 ETF 리포트로 자연스럽게 연결한다.

---

## 5. 핵심 사용자 시나리오

### 5-1. 반도체 산업 입문자

- `반도체 밸류체인`, `엔비디아 공장 없는 이유`, `팹리스 뜻` 검색 후 유입
- 플로우맵에서 6단계를 왼쪽부터 훑으며 각 단계 클릭
- 단계 설명 패널에서 오해 교정 문구 확인

### 5-2. ETF 투자자

- `semiconductor-etf-2026` 리포트에서 유입
- 관심 기업(NVIDIA·SK하이닉스 등)을 클릭해 역할·실적·포함 ETF 확인
- 국가 필터로 "미국만" 또는 "한국만" 필터링

### 5-3. 일반 검색 유입

- `TSMC 삼성전자 차이`, `ASML 왜 중요한가` 검색으로 직접 유입
- 해당 기업 카드를 클릭해 상세 패널 확인 후 이탈 또는 ETF 리포트로 이동

---

## 6. 데이터 구조 (`src/data/semiconductorValueChain.ts`)

### 6-1. 타입 정의

```ts
export type StepId = "design" | "equip" | "foundry" | "memory" | "packaging" | "test";
export type CompanyCountry = "US" | "KR" | "TW" | "NL";

export interface StepMyth {
  claim: string; // "엔비디아는 GPU를 만드는 회사다"
  fact: string;  // "사실 엔비디아는 설계만 한다."
}

export interface ValueChainStep {
  id: StepId;
  num: string;          // "1단계"
  name: string;         // "설계 (팹리스)"
  nameEn: string;       // "Fabless Design"
  shortDesc: string;    // 플로우맵 카드용 한 줄
  fullDesc: string;     // 단계 클릭 시 패널 본문
  myth: StepMyth;
  usStrength: number;   // 0~5
  krStrength: number;   // 0~5
  companyIds: string[];
}

export interface CompanyRevenue {
  value: string;        // "215.9B USD" 또는 "KRW 97.1T"
  period: string;       // "FY2026"
  growth?: string;      // "+114% YoY" (선택)
}

export interface CompanyOperating {
  value: string;
  margin?: string;      // "62%"
}

export interface ValueChainCompany {
  id: string;           // "nvda"
  name: string;
  ticker: string;
  country: CompanyCountry;
  flag: string;         // "🇺🇸"
  stepId: StepId;
  marketCapDisplay: string;       // "$4.4T"
  marketCapUsd: number;           // 정렬용 raw 값
  revenue?: CompanyRevenue;
  operatingIncome?: CompanyOperating;
  employees?: string;             // "42,000+"
  hq: string;
  segment: string;                // "GPU / AI 가속기"
  roleDesc: string;               // 역할 2~3줄
  whyItMatters: string;           // 왜 중요한가 1~2줄
  etfs: string[];                 // ["SOXX", "SMH"]
}

export interface ValueChainMeta {
  updatedAt: string;
  dataNote: string;
  disclaimer: string;
}

export interface ValueChainReport {
  meta: ValueChainMeta;
  steps: ValueChainStep[];
  companies: ValueChainCompany[];
}
```

### 6-2. 단계 데이터 (`steps`)

| id | num | name | usStrength | krStrength | companyIds |
|----|-----|------|-----------|-----------|------------|
| design | 1단계 | 설계 (팹리스) | 5 | 0 | nvda, qcom, brcm, amd |
| equip | 2단계 | 장비·소재 | 5 | 3 | asml, lrcx, klac, amat, wonik |
| foundry | 3단계 | 전공정 (파운드리) | 1 | 4 | tsmc, samsung |
| memory | 4단계 | 메모리 | 2 | 5 | skhynix, samsung, micron |
| packaging | 5단계 | 후공정·패키징 | 2 | 4 | hms, amkor, speta |
| test | 6단계 | 테스트·검사 | 1 | 5 | isc, lino, okins |

> `samsung`은 foundry와 memory 두 단계에 동시 등장. 같은 companyId를 두 steps에 참조.

### 6-3. 기업 데이터 (`companies`) — 전체 20개

**설계 (4개)**

| id | name | country | marketCapDisplay | revenue | opIncome | employees | hq |
|----|------|---------|-----------------|---------|----------|-----------|-----|
| nvda | NVIDIA | US | $4.4T | 215.9B USD (FY2026) | 134.1B USD (62%) | 42,000+ | Santa Clara, CA |
| qcom | Qualcomm | US | $163B | 38.7B USD | 10.1B USD | 51,000 | San Diego, CA |
| brcm | Broadcom | US | $1.7T | 51.6B USD | 12.4B USD | 40,000 | San Jose, CA |
| amd | AMD | US | $378B | 25.8B USD | 1.7B USD | 26,000 | Santa Clara, CA |

**장비·소재 (5개)**

| id | name | country | marketCapDisplay | revenue | employees | hq |
|----|------|---------|-----------------|---------|-----------|-----|
| asml | ASML | NL | $558B | €32.7B (2025) | 42,000 | Veldhoven, NL |
| lrcx | Lam Research | US | ~$82B | 18.4B USD (FY2025) | 18,000 | Fremont, CA |
| klac | KLA | US | $91B | 10.8B USD | 16,000 | Milpitas, CA |
| amat | Applied Materials | US | $121B | 27.2B USD | 34,000 | Santa Clara, CA |
| wonik | 원익IPS | KR | ~$1.2B | KRW 0.8T | 1,800 | 수원 |

**전공정 (2개)**

| id | name | country | marketCapDisplay | revenue | employees | hq |
|----|------|---------|-----------------|---------|-----------|-----|
| tsmc | TSMC | TW | $1.9T | NT$3,809B (2025) | 79,000 | Hsinchu, Taiwan |
| samsung | Samsung Electronics | KR | ~$163B | KRW 333.6T (2025) | 270,000 | 수원/서울 |

**메모리 (3개)** *(samsung은 foundry와 공유)*

| id | name | country | marketCapDisplay | revenue | opIncome | employees | hq |
|----|------|---------|-----------------|---------|----------|-----------|-----|
| skhynix | SK hynix | KR | ~$53B | KRW 97.1T (2025) | KRW 47.2T | 46,863 | 이천 |
| samsung | Samsung Electronics | KR | — | — | — | — | — |
| micron | Micron | US | $105B | 38.8B USD | 9.0B USD | 48,000 | Boise, ID |

**후공정·패키징 (3개)**

| id | name | country | marketCapDisplay | revenue | employees | hq |
|----|------|---------|-----------------|---------|-----------|-----|
| hms | 한미반도체 | KR | ~$4.5B | KRW 0.7T | 900 | 부천 |
| amkor | Amkor Technology | US | $5B | 7.1B USD | 35,000 | Tempe, AZ |
| speta | 이수페타시스 | KR | ~$1.2B | KRW 0.5T | 1,200 | 안산 |

**테스트·검사 (3개)**

| id | name | country | marketCapDisplay | revenue | employees | hq |
|----|------|---------|-----------------|---------|-----------|-----|
| isc | ISC | KR | ~$0.8B | KRW 0.25T | 400 | 성남 |
| lino | 리노공업 | KR | ~$1.8B | KRW 0.4T | 600 | 대구 |
| okins | 오킨스전자 | KR | ~$0.4B | KRW 0.15T | 300 | 평택 |

### 6-4. 데이터 설계 원칙

- 수치는 고정 데이터로 보관. 실시간 연동 없음.
- `samsung`은 `stepId`가 두 단계에 걸치므로 `steps[foundry].companyIds`와 `steps[memory].companyIds` 양쪽에 포함. 단일 company 객체는 1개만 유지.
- 강점 수치 `usStrength` / `krStrength`는 0~5 정수. CSS bar 렌더링 시 `width: ${val * 20}%` 공식 사용.
- `marketCapUsd`는 정렬·비교용 raw 값 (number), `marketCapDisplay`는 화면 표시용 string.

---

## 7. 페이지 구조 (IA)

### 7-1. 전체 섹션 순서

```
① Hero
② InfoNotice
③ 플로우맵 (핵심 인터랙티브)
   ├── 국가 필터 버튼 (전체/미국/한국)
   ├── 6단계 가로 플로우 카드
   └── 상세 패널 (단계 클릭 or 기업 클릭 시 하단 슬라이드)
④ 미국 vs 한국 강점 지도 (CSS bar row)
⑤ 오해 3가지 카드
⑥ 관련 리포트·계산기 CTA
⑦ SeoContent (introTitle + FAQ)
```

### 7-2. 모바일 우선 순서

- Hero
- InfoNotice
- 플로우맵 (가로 스크롤 허용, 6단계 min-width 고정)
- 단계 필터 탭 (플로우맵 대안으로 세로 스택도 고려)
- 상세 패널 (선택된 단계/기업 바로 아래 삽입)
- 강점 지도
- 오해 카드
- CTA
- SeoContent

### 7-3. PC 레이아웃

- 플로우맵: 6열 가로 배치, 각 단계 컬럼 min-width 140px
- 상세 패널: 플로우맵 카드 하단 전체폭으로 슬라이드 노출
- 강점 지도: 좌측 단계명 + 우측 bar 2개 (미국/한국) — 전체폭
- 오해 카드: 3열 그리드
- CTA: 2~3열 버튼 그룹

---

## 8. 섹션별 구현 상세

### 8-1. Hero

```
eyebrow: 반도체 산업 구조 리포트
H1: 반도체 하나 만들기까지,
    이 회사들이 다 연결되어 있다
서브카피: 엔비디아·TSMC·삼성전자·ASML·SK하이닉스·한미반도체.
          서로 어떤 관계인지, 어느 단계에 서 있는지 한눈에 봅니다.
메타 정보: 기준일 | 수록 기업 20개 | 읽는 시간 약 5분
```

### 8-2. InfoNotice

필수 문구:
- 수치는 공개 자료·IR 기준 참고용 데이터이며 투자 권유가 아님
- 시총은 기준일 추산값이며 실시간이 아님
- 기준일: `2026-04-09`

### 8-3. 플로우맵 섹션 (핵심)

#### 국가 필터

```html
<div id="vcFilterRow">
  <button data-filter="all"  class="is-active">전체</button>
  <button data-filter="US">미국 기업만</button>
  <button data-filter="KR">한국 기업만</button>
</div>
```

필터 적용 시: 해당 국가 이외 기업 뱃지에 `.is-dimmed` 클래스 부여. opacity 낮춤.

#### 6단계 플로우 카드

```
[1단계 설계] → [2단계 장비] → [3단계 전공정] → [4단계 메모리] → [5단계 후공정] → [6단계 테스트]
```

각 단계 컬럼:
```html
<div class="vc-step-col" data-step-id="design">
  <button class="vc-step-header" data-step="design">
    <span class="vc-step-num">1단계</span>
    <span class="vc-step-name">설계 (팹리스)</span>
    <span class="vc-step-short">공장 없이 칩 설계만</span>
  </button>
  <ul class="vc-company-list">
    <li>
      <button class="vc-company-btn" data-company-id="nvda" data-country="US">
        🇺🇸 NVIDIA
        <span class="vc-mktcap">$4.4T</span>
      </button>
    </li>
    ...
  </ul>
</div>
<!-- 단계 간 화살표 -->
<div class="vc-arrow" aria-hidden="true">→</div>
```

#### 상세 패널

플로우맵 아래에 단일 패널 영역. 단계 클릭/기업 클릭 시 내용이 교체되어 표시됨.

```html
<div id="vcDetailPanel" class="vc-detail-panel is-hidden">
  <button id="vcDetailClose" class="vc-close-btn" aria-label="닫기">✕</button>
  <div id="vcDetailContent">
    <!-- JS가 innerHTML로 교체 -->
  </div>
</div>
```

**단계 클릭 시 패널 내용**:
```
[단계명] · [단계 영문명]
────────────────────────
[fullDesc 본문]
────────────────────────
자주 하는 오해
  "claim"
  → fact
────────────────────────
미국 강도: ●●●●●
한국 강도: ●●○○○
```

**기업 클릭 시 패널 내용**:
```
[국기] [기업명]  [단계 뱃지]  [시총]
────────────────────────
시가총액 | 최근 매출 | 영업이익
직원 수  | 본사
────────────────────────
[segment] — [roleDesc]
────────────────────────
왜 중요한가
[whyItMatters]
────────────────────────
포함 ETF: [SOXX] [SMH] ...
```

### 8-4. 미국 vs 한국 강점 지도

CSS bar row. 각 단계별 미국 강도와 한국 강도를 나란히 표시.

```
단계명         미국  ████████░░  한국  ██░░░░░░░░
설계 (팹리스)  미국  ██████████  한국  —
장비·소재      미국  ████████░░  한국  ██████░░░░
전공정         미국  ██░░░░░░░░  한국  ████████░░
메모리         미국  ████░░░░░░  한국  ██████████
후공정·패키징  미국  ████░░░░░░  한국  ████████░░
테스트·검사    미국  ██░░░░░░░░  한국  ██████████
```

bar 너비: `width: ${strength * 20}%` (0~5 → 0~100%)

핵심 인사이트 문구 3개 (카드 형태로 하단에 배치):
1. 미국이 압도하는 영역: 칩 설계(팹리스) — 세계 상위 팹리스 8개 중 8개가 미국
2. 한국이 압도하는 영역: 메모리(HBM 50%+), 테스트 소켓(ISC·리노공업)
3. 아무도 대체 못 하는 기업: ASML(EUV 독점), TSMC(파운드리 60%+, 대만)

### 8-5. 오해 3가지 카드

카드 3개 그리드 (PC 3열, 모바일 1열).

| 오해 | 사실 |
|------|------|
| 엔비디아는 반도체를 만드는 회사다 | 설계만. TSMC가 제조. H100 제조 원가 60%+가 TSMC |
| TSMC와 삼성전자는 같은 종류의 회사다 | TSMC는 위탁생산만. 삼성은 파운드리+메모리+모바일 동시 |
| 장비·패키징은 단순 지원 역할이다 | ASML 없이 3nm 불가. HBM 적층 없이 AI GPU 성능 불가 |

각 카드 구성:
```
오해 N
"..."
→ [fact 설명]
```

### 8-6. CTA

계산기 2개:
- `적립식 투자 수익 계산기` → `/tools/dca-investment-calculator/`
- `FIRE 은퇴 계산기` → `/tools/fire-calculator/`

리포트 2개:
- `미국·한국 반도체 ETF 비교 2026` → `/reports/semiconductor-etf-2026/`
- `글로벌 반도체 시총 TOP 10 기업` → `/reports/semiconductor-etf-2026/` (섹션 앵커)

---

## 9. 인터랙션 설계 (`public/scripts/semiconductor-value-chain.js`)

### 9-1. 데이터 주입 방식

```astro
<!-- .astro 파일에서 JSON 직렬화 후 주입 -->
<script type="application/json" id="vc-data">
  {JSON.stringify({ steps, companies })}
</script>
```

JS에서:
```js
const { steps, companies } = JSON.parse(
  document.getElementById('vc-data').textContent
);
```

### 9-2. 상태 관리

```js
let activeStepId = null;      // 현재 열린 단계 ID (string | null)
let activeCompanyId = null;   // 현재 열린 기업 ID (string | null)
let activeFilter = 'all';     // 'all' | 'US' | 'KR'
```

### 9-3. 이벤트 처리 흐름

```
단계 헤더 클릭
  ├── 같은 단계 재클릭 → 패널 닫기 (activeStepId = null)
  └── 다른 단계 클릭 → activeStepId 갱신, 패널 내용 교체, 패널 열기

기업 버튼 클릭
  ├── 같은 기업 재클릭 → 패널 닫기 (activeCompanyId = null)
  └── 다른 기업 클릭 → activeCompanyId 갱신, 패널 내용 교체, 패널 열기

닫기 버튼 클릭
  → activeStepId = null, activeCompanyId = null, 패널 닫기

국가 필터 클릭
  → activeFilter 갱신
  → 모든 .vc-company-btn에서 country 확인
  → 필터와 불일치하면 .is-dimmed 추가, 일치하면 제거
  → all이면 모든 .is-dimmed 제거
```

### 9-4. 패널 내용 렌더링

패널 열기 시 `innerHTML`로 교체. XSS 없음 (data는 내부 JSON).

**단계 패널 HTML 템플릿**:
```js
function renderStepPanel(step) {
  const strengthBar = (val) =>
    '●'.repeat(val) + '○'.repeat(5 - val);
  return `
    <div class="vc-panel-step">
      <div class="vc-panel-header">
        <span class="vc-panel-num">${step.num}</span>
        <h3>${step.name}</h3>
        <span class="vc-panel-en">${step.nameEn}</span>
      </div>
      <p class="vc-panel-desc">${step.fullDesc}</p>
      <div class="vc-panel-myth">
        <p class="vc-panel-myth__claim">"${step.myth.claim}"</p>
        <p class="vc-panel-myth__fact">→ ${step.myth.fact}</p>
      </div>
      <div class="vc-panel-strength">
        <p>미국 강도 <span>${strengthBar(step.usStrength)}</span></p>
        <p>한국 강도 <span>${strengthBar(step.krStrength)}</span></p>
      </div>
    </div>
  `;
}
```

**기업 패널 HTML 템플릿**:
```js
function renderCompanyPanel(company) {
  const etfBadges = company.etfs
    .map(e => `<span class="vc-etf-badge">${e}</span>`)
    .join('');
  return `
    <div class="vc-panel-company">
      <div class="vc-panel-header">
        <span class="vc-panel-flag">${company.flag}</span>
        <h3>${company.name}</h3>
        <span class="vc-panel-ticker">${company.ticker}</span>
        <span class="vc-panel-mktcap">${company.marketCapDisplay}</span>
      </div>
      <p class="vc-panel-segment">${company.segment}</p>
      <dl class="vc-panel-dl">
        ${company.revenue ? `<div><dt>최근 매출</dt><dd>${company.revenue.value} (${company.revenue.period})</dd></div>` : ''}
        ${company.operatingIncome ? `<div><dt>영업이익</dt><dd>${company.operatingIncome.value}${company.operatingIncome.margin ? ` / 마진 ${company.operatingIncome.margin}` : ''}</dd></div>` : ''}
        ${company.employees ? `<div><dt>직원 수</dt><dd>${company.employees}</dd></div>` : ''}
        <div><dt>본사</dt><dd>${company.hq}</dd></div>
      </dl>
      <p class="vc-panel-role">${company.roleDesc}</p>
      <div class="vc-panel-why">
        <p class="vc-panel-why__label">왜 중요한가</p>
        <p>${company.whyItMatters}</p>
      </div>
      <div class="vc-panel-etfs">포함 ETF ${etfBadges}</div>
    </div>
  `;
}
```

### 9-5. JS 미동작 시 폴백

- 첫 번째 단계(설계)는 기본적으로 패널이 열린 상태로 렌더링하지 않음
- 모든 단계 설명은 `SeoContent` FAQ 섹션에서 텍스트로 노출 → JS 없이도 핵심 내용 접근 가능

---

## 10. 스타일 가이드 (`_semiconductor-value-chain.scss`)

### 10-1. CSS prefix

`vc-` 사용 (Value Chain)

### 10-2. 색상 방향

| 요소 | 색상 |
|------|------|
| 미국 기업 뱃지 | 딥 블루 (`#1e40af` / `#dbeafe`) |
| 한국 기업 뱃지 | 딥 그린 (`#166534` / `#dcfce7`) |
| 대만 기업 뱃지 | 오렌지 (`#9a3412` / `#ffedd5`) |
| 네덜란드 기업 뱃지 | 딥 퍼플 (`#5b21b6` / `#ede9fe`) |
| 미국 강도 bar | 블루 (`#3b82f6`) |
| 한국 강도 bar | 그린 (`#22c55e`) |
| 오해 카드 accent | 앰버 (`#d97706`) |
| 단계 헤더 active | 네이비 배경 (`#1e3a8a`) + 화이트 텍스트 |
| 기업 dimmed | `opacity: 0.3` |

### 10-3. 플로우맵 레이아웃

```scss
.vc-flow-wrap {
  overflow-x: auto;  // 모바일 가로 스크롤
}

.vc-flow-grid {
  display: flex;
  align-items: flex-start;
  gap: 0;
  min-width: 860px;  // 6단계 * 140px
}

.vc-step-col {
  flex: 1;
  min-width: 140px;
}

.vc-arrow {
  flex-shrink: 0;
  width: 24px;
  // 화살표 스타일
}
```

### 10-4. 반응형 포인트

- 768px 이하
  - 플로우맵: 가로 스크롤 (`overflow-x: auto`, `min-width: 860px`)
  - 강점 지도: 1열, label → bar 세로 스택
  - 오해 카드: 1열 세로 스택
- 1024px 이상
  - 플로우맵: 6열 균등 배치
  - 오해 카드: 3열 그리드
  - 패널: 플로우맵 하단 전체폭

---

## 11. SEO 설계

### 11-1. 메타 초안

```
seoTitle: 엔비디아는 왜 공장이 없을까? 반도체 산업 구조 한눈에 보기
seoDescription: 반도체 밸류체인 설계→장비→전공정→메모리→후공정→테스트 전 단계를 한눈에 보여줍니다. NVIDIA·TSMC·삼성전자·SK하이닉스·ASML·한미반도체 등 미국·한국 핵심 기업의 역할과 위치를 인터랙티브로 이해하세요.
canonical: https://bigyocalc.com/reports/semiconductor-value-chain/
ogType: article
```

### 11-2. FAQ (SeoContent용, 5개)

1. 팹리스란 무엇인가요?
2. TSMC와 삼성전자는 어떻게 다른가요?
3. ASML이 왜 중요한가요?
4. 한국이 강한 반도체 분야는 어디인가요?
5. 미국이 강한 반도체 분야는 어디인가요?

---

## 12. 구현 체크리스트

### 12-1. 데이터

- [ ] `src/data/semiconductorValueChain.ts` 생성
  - [ ] 6개 단계 데이터 + myth 문구 입력
  - [ ] 20개 기업 데이터 입력 (samsung 중복 처리 주의)
  - [ ] 메타 정보 (updatedAt, disclaimer)

### 12-2. 페이지

- [ ] `src/pages/reports/semiconductor-value-chain.astro` 생성
  - [ ] Hero 섹션
  - [ ] InfoNotice
  - [ ] 플로우맵 마크업 (6단계 컬럼 + 화살표 + 패널 컨테이너)
  - [ ] 국가 필터 버튼 (`data-filter` 속성)
  - [ ] 기업 버튼 (`data-company-id`, `data-country` 속성)
  - [ ] 강점 지도 bar row (Astro에서 `width` 인라인 스타일 계산)
  - [ ] 오해 3가지 카드
  - [ ] CTA 버튼 그룹
  - [ ] `SeoContent` (FAQ 포함)
  - [ ] JSON 데이터 주입 스크립트 블록

### 12-3. 스크립트

- [ ] `public/scripts/semiconductor-value-chain.js` 생성
  - [ ] JSON 데이터 파싱
  - [ ] 단계 클릭 핸들러 (토글)
  - [ ] 기업 클릭 핸들러 (토글)
  - [ ] 패널 닫기 핸들러
  - [ ] 국가 필터 핸들러
  - [ ] `renderStepPanel()` 함수
  - [ ] `renderCompanyPanel()` 함수

### 12-4. 스타일

- [ ] `src/styles/scss/pages/_semiconductor-value-chain.scss` 생성 (`vc-` prefix)
- [ ] `src/styles/app.scss`에 import 추가
- [ ] 플로우맵 가로 스크롤 처리
- [ ] dimmed 상태 스타일
- [ ] 패널 is-hidden / 슬라이드 표시 처리
- [ ] 국가 배지 4종 색상 (US/KR/TW/NL)

### 12-5. 사이트 반영

- [ ] `src/data/reports.ts` 등록 (order: 19)
- [ ] `public/sitemap.xml` 추가
- [ ] `src/pages/reports/semiconductor-etf-2026.astro`의 CTA에 이 리포트 링크 추가 (양방향 연결)
- [ ] `npm run build` 빌드 오류 없음 확인

---

## 13. QA 기준

### 13-1. 데이터 QA

- 각 단계의 `companyIds`가 실제 기업 `id`와 일치하는가?
- `samsung`이 foundry와 memory 두 단계에 모두 렌더링되는가?
- 강점 bar 수치(0~5)가 강점 지도 bar 너비와 일치하는가?

### 13-2. 인터랙션 QA

- 단계 클릭 → 패널 오픈: 내용이 올바르게 교체되는가?
- 기업 클릭 → 패널 오픈: 해당 기업 정보가 표시되는가?
- 동일 항목 재클릭 → 패널 닫히는가?
- 국가 필터 "미국만" → 한국 기업이 dimmed 되는가?
- 닫기 버튼 클릭 → 패널 숨김 처리가 되는가?
- JS 없이도 모든 단계 설명을 FAQ로 읽을 수 있는가?

### 13-3. UI QA

- 모바일에서 플로우맵이 가로 스크롤로 자연스럽게 작동하는가?
- 기업 패널이 모바일에서 화면을 벗어나지 않는가?
- 오해 카드 3개가 PC에서 3열, 모바일에서 1열로 쌓이는가?

### 13-4. SEO QA

- H1이 "반도체 하나 만들기까지"로 렌더링되는가?
- FAQ 5개가 SeoContent에서 visible 상태로 노출되는가?
- canonical URL이 `/reports/semiconductor-value-chain/`으로 맞는가?
- `<title>`이 기획 문서의 A안 타이틀과 일치하는가?

---

## 14. 개발 메모

- **samsung 중복 처리**: Astro 페이지에서 `steps.foundry.companyIds`와 `steps.memory.companyIds` 양쪽에 `samsung`이 포함되므로, 플로우맵 렌더링 시 두 단계 컬럼에서 각각 samsung 버튼이 나타남. 동일 company 객체 참조이므로 데이터는 중복 없음.
- **패널 innerHTML 방식**: 별도 Astro 컴포넌트가 아닌 JS 템플릿 함수로 처리. 단순하고 유지보수가 쉬움. XSS 위험 없음 (내부 JSON만 처리).
- **강점 bar 계산**: Astro 빌드 시 `style={`width:${step.usStrength * 20}%`}` 인라인으로 처리. JS 없이도 렌더링 가능.
- **플로우맵 화살표**: `→` 텍스트 또는 CSS로 처리. SVG 불필요.
- **ETF 리포트 연결**: `semiconductor-etf-2026.astro`의 CTA 섹션에 이 리포트 링크를 추가해 양방향 내부 링크를 구성한다.
