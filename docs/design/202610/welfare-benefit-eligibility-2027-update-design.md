# 2027 기준 중위소득·복지급여 수급 자격 계산기 설계서

## 1. 문서 개요

| 항목 | 결정 |
|---|---|
| 작성일 | 2026-10-07 |
| 상태 | 기능 구현 반영·개별 검사 및 빌드 통과. 전체 check:all 기존 오류로 미통과. 배포 미실시 |
| 기획 원본 | [2027 갱신 기획서](../../plan/202610/welfare-benefit-eligibility-2027-update.md) |
| slug / URL | `welfare-benefit-eligibility` / `/tools/welfare-benefit-eligibility/` |
| 작업 유형 | 기존 계산기 갱신. 신규 공개 URL 없음 |
| 레이아웃 | `BaseLayout` + `SimpleToolShell` + 기존 공통 컴포넌트 |
| 핵심 기능 | 가구별 중위소득 비율, 네 급여 소득기준 비교, 원 단위 차액, 2026·2027 비교 |
| 입력 | 연도·가구원 수·입력액 종류·월 금액 |
| 제외 | 재산 환산·근로공제·차량 환산·부양의무자 판정·급여 지급액 계산 |
| 공개 데이터 범위 | 기획서에서 검증한 원자료만 계산에 사용. 미검증 셀은 계산 차단 |

`median-income-calculator`는 생성하지 않는다. 본 문서는 2026 기존 설계보다 이 페이지의 갱신 구현에 우선한다. 기존 생계·주거·교육·재산 상세 계산기 및 기타 2026 사업의 역할과 계산식은 이번 범위에서 변경하지 않는다.

참조한 프로젝트 기준: `AGENTS.md`, `AGENT.md`, `CONTENT_GUIDE.md`, `docs/ARCHITECTURE.md`, `docs/QUALITY_SCORE.md`, `docs/SECURITY.md`, `DEPLOY_CHECKLIST.md`, `docs/CODE_SKILL.md`, `docs/UI_ARCHITECTURE.md`, `docs/design-docs/README.md`. 실제 `package.json`은 Astro 5 의존성이며 문서의 Astro 4 설명을 그대로 전제하지 않는다. 이 작업으로 버전이나 의존성을 변경하지 않는다.

공식자료의 조사 결과·출처 URL·발표일·직접 대조하지 못한 항목은 기획서 3번을 기준으로 한다. 이번 설계 작성은 추가 원문 대조가 끝났다는 의미가 아니다.

## 2. 파일 구조와 변경 범위

| 파일 | 작업·책임 |
|---|---|
| `src/data/welfareThresholds.ts` | 생성. 연도별 원자료·출처·검증 여부·8인 이상 산식의 단일 출처 |
| `src/data/welfareBenefitEligibility.ts` | 갱신. 메타·입력 옵션·초기값·intro·FAQ·관련 링크·직렬화 설정. 기존 2026 export와 공제 상수 보존 |
| `src/pages/tools/welfare-benefit-eligibility.astro` | 갱신. 입력·SSG 기준표·결과 DOM·출처·공식 CTA |
| `public/scripts/welfare-benefit-eligibility.js` | 갱신. IIFE 유지, DOM·상태·URL·복사·오류 처리 |
| `public/scripts/welfare-benefit-eligibility-core.js` | 생성. DOM 없는 순수 함수 ES module. 입력 검증·기준 조회·비교·URL 파싱 |
| `src/styles/scss/pages/_welfare-benefit-eligibility.scss` | 갱신. `.wbe-page` 아래 비교 화면·접근성·반응형 |
| `src/data/tools.ts` | 기존 항목 메타·예시·배지 갱신 |
| `src/pages/index.astro`, `src/pages/tools/index.astro` | 기존 등록·복지 카테고리·별도 카피 존재 여부 확인 후 필요한 값만 수정 |
| `scripts/generate-og-tools.py` 및 해당 생성 설정 | 기존 생성 방식에 전용 도구 OG 항목 추가·수정 |
| `public/og/tools/welfare-benefit-eligibility.png` | 생성 또는 갱신. 1200×630 |
| `src/styles/app.scss` | 기존 `@use 'scss/pages/welfare-benefit-eligibility'` 유지, 중복 추가 금지 |
| `public/sitemap.xml` | 기존 URL 유지, 실제 콘텐츠 갱신 시 lastmod 수정 |
| `scripts/check-welfare-benefit-eligibility.mjs` | 생성 예정. 연도별 실제 데이터와 핵심 함수의 의미 있는 검증 |

OG 경로는 실제 프로젝트 생성 규약인 `/og/tools/<slug>.png`를 사용한다. 현재 페이지는 `/og/og-home.png`를 사용하므로 전용 이미지로 교체한다. 기획서의 `/og/welfare-benefit-eligibility.png` 파일 표기는 이 설계에서 경로를 구체화한 것이다.

공통 `ToolActionBar`, `SimpleToolShell`, `BaseLayout`의 API는 수정하지 않는다. 관련 없는 `package-lock.json` 및 기존 인벤토리 작업 내용을 덮어쓰지 않는다. 기존 상세 계산기 파일은 회귀 확인 대상이며 이번 변경 파일 목록에 포함하지 않는다.

## 3. 데이터 파일 설계

### 3.1 타입과 검증의 의미

```ts
export type CriteriaYear = 2026 | 2027;
export type BenefitKey = 'livelihood' | 'medical' | 'housing' | 'education';
export type MetricKey = 'median' | BenefitKey;
export type SourceBadge = '공식' | '참고' | '시뮬레이션' | '추정';
export type IncomeMode = 'recognized' | 'monthly';

export interface SourceRecord {
  id: string;
  organization: string;
  title: string;
  url: string;
  publishedAt: string | null;
  effectiveFrom: string | null;
  checkedAt: string;
  locator: string;
  verificationNote: string;
}

export interface AmountCell {
  amount: number | null;
  badge: SourceBadge;
  sourceId: string;
  verified: boolean;
  pendingReason?: string;
}

export type ExpansionRule =
  | { method: 'difference_7_6'; verified: boolean; sourceId: string }
  | { method: 'fixed_increment'; increment: number;
      verified: boolean; sourceId: string }
  | { method: 'unavailable'; verified: false; sourceId: string };

export interface YearCriteria {
  year: CriteriaYear;
  effectiveFrom: string;
  checkedAt: string;
  ratios: Record<BenefitKey, 32 | 40 | 48 | 50>;
  rows: Record<number, Record<MetricKey, AmountCell>>; // 1~7인 직접표
  expansion: Record<MetricKey, ExpansionRule>;
}

export const CRITERIA_BY_YEAR: Record<CriteriaYear, YearCriteria>;
export const WELFARE_SOURCES: Record<string, SourceRecord>;
```

`rows`는 1~7인 직접 기준표만 보유한다. 8인 이상 계산값은 저장하지 않고 함수에서 만든다. `verified`는 기획 조사에서 직접 확인한 값임을 뜻하며 정부의 수급자격 인증을 뜻하지 않는다. `amount:null` 또는 `verified:false`는 **계산 불가**다. 숫자가 0인 것과 다르다.

7인 미검증 생계·의료·교육 참고값 3,248,853 / 4,061,066 / 5,076,333원은 기획서에만 남긴다. 실행 데이터는 `amount:null, verified:false, badge:'참고'`로 두어 참고 계산값이 실서비스 판정에 유입되지 않게 한다. 고시 표 대조 후 실제 원자료를 입력하고 공식·verified=true로 변경한다.

### 3.2 실제 원자료 초기화 명세

튜플 순서는 `[median, livelihood, medical, housing, education]`, 단위는 정수 원/월이다. 다음 배열은 아래 셀 규칙으로 `rows`에 변환한다. null 셀을 임의 비율로 채우지 않는다.

```ts
const RAW_2026 = [
  [2564238,  820556, 1025695, 1230834, 1282119],
  [4199292, 1343773, 1679717, 2015660, 2099646],
  [5359036, 1714892, 2143614, 2572337, 2679518],
  [6494738, 2078316, 2597895, 3117474, 3247369],
  [7556719, 2418150, 3022688, 3627225, 3778360],
  [8555952, 2737905, 3422381, 4106857, 4277976],
  [9515150, null, null, null, null],
] as const;

const RAW_2027 = [
  [ 2736042,  875533, 1094417, 1313300, 1368021],
  [ 4480645, 1433806, 1792258, 2150710, 2240323],
  [ 5718091, 1829789, 2287236, 2744684, 2859046],
  [ 6929885, 2217563, 2771954, 3326345, 3464943],
  [ 8063019, 2580166, 3225208, 3870249, 4031510],
  [ 9129201, 2921344, 3651680, 4382016, 4564601],
  [10152665, null, null, 4873279, null],
] as const;
```

| 단위 | sourceId·검증 정책 |
|---|---|
| 두 연도 중위소득 1~7인 | `mohw-median-series`, 공식·verified=true |
| 2026 급여 1~6인 | `mohw-release-2027-comparison`, 공식·verified=true. 기존 2026 값과 원자료 대조 일치 |
| 2027 생계·의료·교육 1~6인 | `mohw-release-2027-comparison`, 공식·verified=true |
| 2027 주거 1~7인 | `molit-housing-2027`, 공식·verified=true |
| 2026 급여 7인 | 각 2026 고시를 직접 대조할 때까지 null·verified=false |
| 2027 생계·의료 7인 | `mohw-notice-2027`, 직접 고시 표 대조 전 null |
| 2027 교육 7인 | `moe-education-2027`, 첨부 직접 대조 전 null |

출처 레코드 URL·날짜·검증 메모는 기획서 3번 표를 옮긴다. 원자료 테이블에 sourceId를 붙이지 않고 문서 하단 출처만 붙이는 방식은 허용하지 않는다. 발표일이 확인되지 않은 정책표는 null로 두고 조회일 2026-10-07을 기록한다.

초기 가산 설정:

| 연도·metric | method | verified / 처리 |
|---|---|---|
| 2026 median | fixed_increment, 959198 | true. 7인 값을 기준으로 가산 |
| 2026 livelihood | fixed_increment, 306943 | true. 7인 기준액 미대조로 현재 실행은 차단 |
| 2026 medical/housing/education | unavailable | false. 각 고시 직접 대조 후 변경 |
| 2027 median | difference_7_6 | true |
| 2027 livelihood/medical | difference_7_6 | true. 7인 기준액 미대조로 실행은 차단 |
| 2027 housing | difference_7_6 | true |
| 2027 education | unavailable | false. 첨부 산식 직접 확인 후 변경 |

구현 담당자가 미확인 값을 추측할 필요가 없도록 위 상태에서의 **부분 결과 동작을 정상 요구사항**으로 정의한다. 공식자료 추가 대조가 끝나면 검증된 셀·규칙만 채워 기능 범위를 넓힌다. 공개 전 완전한 1~20인 네 급여 제공을 목표로 하되 미대조 숫자를 채우는 것은 완료 조건이 아니다.

### 3.3 2026 호환 export

`welfareBenefitEligibility.ts`의 `WBE_2026_THRESHOLDS: BenefitThreshold[]`는 **기존 1~6인 배열 길이·키·금액을 그대로** 유지한다. 새로운 데이터에서 확인된 2026년 1~6인 셀을 골라 `{householdSize, medianIncome, livelihood, medical, housing, education}`로 투영한다. null이 들어오면 빌드 시 오류를 내고 빈 배열·0원으로 대체하지 않는다.

`WBE_ASSET_DEDUCTION_BY_REGION`, `WBE_MONTHLY_CONVERSION_RATE`, `WBE_WORK_INCOME_DEDUCTION`은 기존 export·값을 유지한다. 새 기준 모듈에서 기존 페이지 모듈을 import하지 않으므로 순환 참조가 생기지 않는다.

회귀 소비자: `livelihoodBenefitIncomeRecognition.ts`, `housingBenefitIncomeRecognition.ts`, `educationBenefitEligibility2026.ts`, `basicLivelihoodRecipientAssetStandard.ts`, `gyeonggiYouthWorkerSupport2026.ts`, `youthRentSupportCalculator.ts`, `parent-welfare-diagnosis-calculator.astro`. 기존 2026 상수를 2027에 연결하지 않는다.

### 3.4 페이지 설정

```ts
export const WBE_COMPARE_DEFAULTS = {
  year: 2027,
  householdSize: 4,
  mode: 'recognized',
  amount: null,
} as const;

export const WBE_COMPARE_LIMITS = {
  householdMin: 1, householdMax: 20,
  amountMin: 0, amountMax: 1_000_000_000,
} as const;
```

사용자에게 보이는 입력·결과·오류·공유 문구는 모두 한국어로 작성한다.

메타·intro 4단락·FAQ 8개·관련 링크 5개는 기획서 7·8번에서 가져와 TS에 분리한다. 연도와 mode 옵션은 한국어 label을 포함한다. 신규 프리셋은 만들지 않는다. 초기 금액은 빈 값으로 시작해 예시 소득이 사용자 소득으로 오인되지 않게 한다.

## 4. 페이지 섹션과 Astro 구조

```astro
<BaseLayout title={WBE_META.seoTitle}
  description={WBE_META.seoDescription}
  ogImage="/og/tools/welfare-benefit-eligibility.png">
  <SiteHeader />
  <SimpleToolShell calculatorId="welfare-benefit-eligibility"
    pageClass="wbe-page" resultFirst={false}>
    <Fragment slot="hero">
      <CalculatorHero ... badges={["공식", "시뮬레이션"]} />
      <InfoNotice ... />
    </Fragment>
    <Fragment slot="actions">
      <ToolActionBar resetId="wbeResetBtn" copyId="wbeCopyBtn" />
    </Fragment>
    <Fragment slot="aside">
      <!-- 기준연도·가구원 수·입력 종류·월 금액 -->
      <!-- 금액 포함 공유 선택 및 오류·URL 복구 안내 -->
    </Fragment>
    <section aria-labelledby="wbe-results-title">...</section>
    <section aria-labelledby="wbe-position-title">...</section>
    <section aria-labelledby="wbe-years-title">...</section>
    <section aria-labelledby="wbe-thresholds-title">...</section>
    <section aria-labelledby="wbe-next-title">...</section>
    <section aria-labelledby="wbe-sources-title">...</section>
    <Fragment slot="seo"><SeoContent ... /></Fragment>
  </SimpleToolShell>
  <script id="wbe-data" type="application/json"
    set:html={JSON.stringify(config).replace(/</g, "\\u003c")} />
  <script type="module" src={withBase("/scripts/welfare-benefit-eligibility.js")} />
</BaseLayout>
```

위 스케치는 구조 명세이며 그대로 붙여 넣는 완성 코드가 아니다. `config={schemaVersion:2, defaults, limits, years, sources, benefitLabels, modeLabels}`. 실행에 불필요한 기존 재산 데이터·프리셋은 config에 넣지 않는다. `withBase`는 기존 페이지 방식으로 유지한다.

`SimpleToolShell`의 실제 DOM은 hero→actions→aside→main→seo다. 결과 먼저 옵션을 켜지 않고 입력 먼저 읽히게 한다. 새 섹션은 main slot 안에 둔다. 공통 쉘을 복제하지 않는다.

### 입력과 DOM 계약

| 요소 | 식별자 | HTML·동작 |
|---|---|---|
| 연도 | `wbeYear`, `data-wbe-input="year"` | select 2027·2026 |
| 가구원 | `wbeHousehold`, `data-wbe-input="householdSize"` | select 1~20. 화면 설명에 서비스 제공 범위 표시 |
| 입력 종류 | `name="wbeIncomeMode"`, `data-wbe-input="mode"` | fieldset/legend + radio recognized·monthly |
| 금액 | `wbeAmount`, `data-wbe-input="amount"` | type=text, inputmode=numeric, maxlength=14, autocomplete=off |
| 금액 label/hint/error | `wbeAmountLabel/Hint/Error` | 모드별 label 변경. aria-describedby로 hint와 error 연결 |
| 금액 공유 선택 | `wbeIncludeAmount` | 기본 unchecked. 일반 checkbox, 도움말 ‘공유 주소에 소득 금액이 포함됩니다’ |
| URL 안내 | `wbeUrlNotice` | 복구·구형 URL 안내, 초기 hidden |
| 요약 안내 | `wbeResultSummary` | 텍스트만 aria-live=polite, atomic=true |
| 수동 복사 영역 | `wbeShareFallback` | clipboard 실패 때 readonly input·label 노출 |

금액 입력 slider는 제공하지 않는다. 기획서의 빈 초기값·0원 구분·1원 경계 확인 목적상 넓은 금액 범위 slider보다 정확한 정수 입력이 적합하다. 계산 제출 버튼은 만들지 않는다.

### 결과 DOM

1. `wbeYearLabel`: 선택연도·가구원·입력 종류·적용일.
2. KPI 3개: `wbeMedianAmount`, `wbeInputAmount`, `wbeMedianRatio`. 배지 node 별도 생성. 월 금액 미입력 시 뒤 두 개는 ‘입력 전’.
3. 급여별 4개 행: `data-wbe-benefit="livelihood|medical|housing|education"` 안에 `data-wbe-field="threshold|badge|status|gap|note"` 고정 node.
4. 급여별 비교와 별도로 `wbeQualificationNotice` 항상 표시. 월소득 모드에서는 ‘소득인정액 산정 전 단순 금액 비교입니다’를 결과 위에도 표시.
5. `wbePosition`: 표와 같은 A·T 데이터로 4개 CSS 바. 계산 불가 행의 바는 hidden.
6. `wbeYearComparison`: 2026·2027 중위소득 및 급여 기준·차액·이하/초과. 특정 셀이 미검증이면 해당 칸만 ‘기준표 확인 필요’.
7. 기준표: JS 없어도 읽히는 2026·2027 1~7인 표를 Astro에서 렌더. null은 ‘기준표 확인 필요’, 원자료 배지·출처 각 표에 표시. 8인 이상 산식은 텍스트로 제공.

현재 페이지의 예상 생계급여 KPI, 가장 가까운 지원, 재산 분해, 프리셋, 대체 지원 추천 DOM과 해당 JS를 제거한다. ‘수급 가능’, ‘가능성 높음’, ±5% 경계 판단을 사용하지 않는다. 비교 결과는 이하·초과·기준과 같음으로 표현하며 자격 확정과 구분한다.

JS 비활성 또는 config 오류 시 인터랙션 영역에 ‘계산 기능을 사용할 수 없습니다. 아래 공식 기준표를 확인하세요’를 표시한다. 기준표·출처·intro·FAQ·관련 링크는 유지한다. 접근 불가능한 계산 폼을 그대로 작동하는 것처럼 남기지 않는다.

## 5. 계산 모듈과 상태

### 상태와 결과 타입

```ts
type AmountInput =
  | { kind: 'empty' }
  | { kind: 'invalid'; message: string }
  | { kind: 'valid'; value: number };

type ComparisonState = {
  year: 2026 | 2027;
  householdSize: number;
  mode: 'recognized' | 'monthly';
  amountRaw: string;
  amountInput: AmountInput;
  includeAmount: boolean;
};

type ResolvedThreshold =
  | { kind: 'available'; amount: number; badge: SourceBadge;
      sourceIds: string[]; derived: boolean }
  | { kind: 'unavailable'; reason: string; sourceIds: string[] };

type BenefitComparison = {
  benefit: BenefitKey;
  threshold: ResolvedThreshold;
  status: 'below' | 'equal' | 'above' | 'empty' | 'invalid' | 'unavailable';
  gap: number | null;
};
```

JS core에 JSDoc 타입을 적용한다. DOM script는 `import`로 core 함수를 가져온 뒤 IIFE 안에서 이벤트를 바인딩한다. 계산 함수는 DOM·window·clipboard를 참조하지 않는다.

### 함수 목록

| 함수 | 책임 |
|---|---|
| `parseAmount(raw, limits)` | empty/invalid/valid 구분 |
| `validateConfig(config)` | 스키마·정수·sourceId·연도·필수 셀 검증 |
| `resolveThreshold(yearCriteria, size, metric)` | 1~7 직접 조회 또는 8~20 가산. 검증 누락은 unavailable |
| `compareBenefit(amountInput, threshold, key)` | 반올림 없는 원 단위 비교와 gap |
| `calculateComparison(config, state)` | 중위 비율·4개 행·두 연도 비교를 한 결과 객체로 생성 |
| `parseUrlState(url, defaults, limits)` | v2·구형·잘못된 파라미터 처리, 안내 코드 반환 |
| `serializePublicState(state)` | 비민감 query: v/year/hh/mode |
| `buildShareUrl(baseUrl, state)` | 금액 포함 선택 시만 hash 추가 |
| `render(result, state)` | 고정 DOM의 textContent·hidden·class 갱신 |
| `syncPublicUrl(state)` | replaceState, 비민감 query만 유지 |

`validateConfig`는 계산 전 1회 실시한다. 금액 셀은 null 또는 0 이상의 safe integer, sourceId가 sources에 존재, verified=true면 amount!=null, 연도 allowlist, 1~7 row 존재를 확인한다. 8인 산식 수행 시 6·7인 셀과 규칙의 verified를 다시 확인한다. unavailable은 정상 데이터 상태이며 config 오류와 구분한다.

### 엄격한 숫자 파싱

앞뒤 공백을 제거한 뒤 빈 문자열이면 empty. `^\d+$` 또는 `^\d{1,3}(,\d{3})+$`만 허용한다. 쉼표를 제거해 Number로 변환하고 safe integer·0~10억 범위를 검사한다. 부호, 소수점, 지수 표기, ‘만원’, 중간 공백, 잘못된 쉼표는 invalid다. 기존처럼 비숫자 문자를 제거해 `3만원→3원`으로 계산하지 않는다.

유효 값은 blur에서 ko-KR 쉼표를 붙인다. empty·invalid는 원문 그대로 두어 오류를 확인할 수 있게 한다. `'0'`은 valid이며 빈 값으로 취급하지 않는다. 입력 중 caret를 옮기는 매 입력 포맷팅은 하지 않는다.

### 기준 조회·비교 핵심 로직

```js
// 전제: size 범위 검증 완료, getCell은 없는 값을 만들지 않는다.
function resolveThreshold(criteria, size, metric) {
  const seven = criteria.rows[7][metric];
  if (size <= 7) return resolveVerifiedCell(criteria.rows[size][metric]);
  const rule = criteria.expansion[metric];
  if (!rule.verified || !seven.verified || seven.amount === null) {
    return unavailable(metric);
  }
  let increment;
  if (rule.method === 'fixed_increment') increment = rule.increment;
  else if (rule.method === 'difference_7_6') {
    const six = criteria.rows[6][metric];
    if (!six.verified || six.amount === null) return unavailable(metric);
    increment = seven.amount - six.amount;
  } else return unavailable(metric);
  const amount = seven.amount + increment * (size - 7);
  if (!Number.isSafeInteger(amount) || amount < 0) return unavailable(metric);
  return { kind: 'available', amount, badge: '시뮬레이션',
    derived: true, sourceIds: collectSources(criteria, metric) };
}

// 기준액 T와 입력액 A는 반올림하지 않고 비교한다.
const gap = threshold.amount - amountInput.value;
const status = gap > 0 ? 'below' : gap === 0 ? 'equal' : 'above';
const ratioRaw = 100 * amountInput.value / median.amount;
const ratioDisplay = Math.round(ratioRaw);
```

실제 구현에서는 amountInput 유효성과 threshold available 여부를 선행 검사한다. 급여비율 32/40/48/50은 표기용이며 원자료 기준액을 재생성하지 않는다. 소득인정액 모드와 월소득 모드는 수식이 같고 설명만 달라진다. 근로 공제나 자산 가산을 수행하지 않는다.

### 이벤트 흐름

| 이벤트 | 처리 |
|---|---|
| 초기 로드 | config 검증 → URL 복원 → DOM 입력 동기화 → 계산·렌더 → URL 정리 → 이벤트 1회 등록 |
| 연도·가구원 change | 값 검증 → 현재 금액 유지 → 결과 즉시 재계산 → 비민감 URL 갱신 |
| mode change | 선택 모드 반영 → 금액·오류 초기화 → includeAmount=false → 라벨·결과 갱신 → URL 갱신 |
| amount input | raw 검증 → 결과 갱신. 새 수치를 URL·로그에 기록하지 않음 |
| amount blur | 유효 금액만 포맷 |
| 공유 checkbox change | includeAmount만 변경, 주소창에 금액을 쓰지 않음 |
| 초기화 | 2027·4인·recognized·빈 금액·공유 unchecked로 복원, 오류/복구 안내 해제 |
| 링크 복사 | 해당 시점 share URL 생성 → clipboard → 성공 안내. 실패하면 수동 복사 input 노출 |
| popstate | URL 다시 복원·검증·렌더. 사용자 탐색을 막지 않음 |

빈 값이나 invalid 시 비율·판정·차액·바를 숨기고 기준액만 유지한다. 유효한 직전 결과를 현 결과처럼 남기지 않는다. 최초 empty는 aria-invalid를 표시하지 않고 도움말만, 형식 오류는 aria-invalid=true·오류 문장을 표시한다.

## 6. 공유 URL과 기존 링크 호환

### v2 계약

기본 주소: `?v=2&year=2027&hh=4&mode=recognized`. 이름·주소·소득·재산 query는 생성하지 않는다. 일반 실시간 변경은 이 4개 파라미터만 기록하고 canonical은 기존 경로다.

금액 포함 공유를 사용자가 선택하고 금액이 valid일 때만 복사 URL에 `#amount=3000000`을 붙인다. fragment는 서버 요청 query에 금액을 싣지 않기 위한 선택이며 수신자·브라우저 기록에는 보인다. 분석 도구가 fragment를 수집하는지도 구현 시 확인하며 민감 금액 추적을 허용하지 않는다.

수신 URL에 유효 fragment가 있으면 해당 mode 금액으로 복원하고 ‘공유 주소에 포함된 금액입니다’ 안내를 표시한다. includeAmount는 수신 후에도 unchecked로 시작한다. 최초 복원 후 주소창 fragment는 replaceState로 제거한다. 발신자는 복사 버튼을 눌러도 현재 주소창에 금액을 추가하지 않는다. 빈 값·invalid 상태에서는 금액 공유 checkbox를 disabled로 하고 false로 초기화한다.

허용 목록·범위: v=2, year=2026/2027, hh=1~20 정수, mode=recognized/monthly, fragment amount=0~10억 정수. 중복된 소유 파라미터와 비허용 값이 하나라도 있으면 **전체 계산 입력을 초기값으로 복구하고 금액을 비운다**. ‘공유 주소의 입력값을 확인할 수 없어 기본 설정으로 열었습니다’ 표시. 잘못된 year에서 금액만 복원하지 않는다.

### 구형 URL

현재 스크립트는 `hh,region,house,child,single,special,earned,biz,prop,public,private,wd,hasset,gasset,fasset,debt,car,cartype,obligor,obligorLevel,crisis`를 query에 기록한다. v=2가 없고 이 키가 존재하면 구형으로 판별한다.

구형 링크에서 hh가 유효하면 그것만 복원, year=2026·mode=recognized·금액 빈 값으로 연다. 재산·근로소득을 합산해 새 금액으로 자동 변환하지 않는다. ‘이전 상세 계산 주소입니다. 소득·재산 입력은 복원하지 않습니다. 소득인정액을 다시 입력해 주세요’ 표시 후 새 비민감 URL로 정리한다. 유효하지 않은 hh는 초기값 4인으로 복구하고 안내한다. v=2에 구형 민감 키가 섞여 있어도 폐기하고 민감 키를 제거한다.

URL 정리 시 생성기는 allowlist로 새 URLSearchParams를 만든다. 예외적으로 `utm_source/medium/campaign/content/term`은 기존 값만 유지 가능하되 입력값으로 쓰지 않는다. 다른 미지원 파라미터는 제거하고 별도 로그에 남기지 않는다. 결과 복사문에도 재산·자동차·이전 URL 값이 포함되지 않게 한다.

## 7. 결과 표현·배지·접근성

| 조건 | 한국어 문구 |
|---|---|
| below | ‘기준 이하’ / ‘기준까지 {gap}원 남음’ |
| equal | ‘기준 이하’ / ‘기준과 같음 · 차이 0원’ |
| above | ‘기준 초과’ / ‘{abs(gap)}원 초과’ |
| empty | ‘월 금액을 입력하세요’ |
| invalid | ‘입력값을 확인하세요’ |
| unavailable | ‘공식 기준표 확인 후 안내 예정’ |
| recognized 전체 안내 | ‘소득기준 비교이며 최종 수급 여부는 신청 후 조사로 결정됩니다.’ |
| monthly 전체 안내 | ‘월 소득 단순 비교입니다. 공제·재산 환산을 반영하지 않아 수급자격을 판단할 수 없습니다.’ |

생계 행의 차액은 지급액이 아니다. 의료는 부양의무자 등, 교육은 학생 요건을 설명하되 이 페이지에서 조사 여부를 입력받아 자격으로 판정하지 않는다. 상세 페이지 링크에는 현재 2026 기준임을 명시한다.

배지는 공식·참고·시뮬레이션·추정만 허용한다. 직접 인용한 1~7인 원자료 셀=공식, 가산 기준액=시뮬레이션, 입력액 비교·비율·연도별 차이=시뮬레이션. 검증 상태 ‘확인 필요’, 연도, 분야, 이하/초과는 일반 문장·셀 텍스트이며 배지로 만들지 않는다. 결과 한 카드에 공식 금액과 자체 결과를 섞을 때 각각 별도로 표기한다.

바 공통 최대 축은 선택 가구 중위소득의 120%로 고정한다. 위치는 `Math.min(A / (M * 1.2), 1)`로 그리되 A 자체는 제한하지 않는다. 초과하면 오른쪽 끝 마커와 ‘표시 범위 120% 초과’ 텍스트를 노출한다. 표가 해석의 기준이며 바는 보조다. 미입력·invalid 때 바는 숨긴다. 표시 위치 계산값도 숫자·범위 검증 후 style에 넣는다.

radio는 네이티브 키보드 조작 유지, focus-visible 표시. 44px 이상 클릭 영역, aria-describedby 오류 연결. 요약 1개 live region으로 읽어주고 결과 카드 전체를 반복 낭독하지 않는다. 바는 표와 중복되므로 aria-hidden, 실제 숫자는 텍스트 표에 둔다. 모바일 카드에서도 급여명·기준·차액 라벨 관계를 유지한다.

## 8. SCSS·콘텐츠·등록 설계

`.wbe-page` 스코프와 `wbe-` prefix 유지. 주요 클래스: `wbe-input-panel`, `wbe-mode-options`, `wbe-kpi-grid`, `wbe-benefit-row`, `wbe-benefit-status`, `wbe-position-row`, `wbe-years-table-wrap`, `wbe-source-list`, `wbe-input-error`, `wbe-share-options`.

실제 `_tokens.scss`에 `:root`의 brand·warning·border 토큰이 존재한다. 문서의 과거 ‘CSS 변수 없음’ 설명 대신 실제 토큰을 활용하고 기존 공통 클래스와 일관되게 적용한다. 이번 페이지 변경의 breakpoint는 콘텐츠 가이드에 맞춰 768px·1024px로 정한다. 공통 쉘 breakpoint는 변경하지 않는다. 중첩 3단계 이하, !important 금지, 사용자 금액용 고정 최소 너비로 overflow를 만들지 않는다.

모바일: 1열 입력·3개 KPI 세로, 급여별 카드형. 768px부터 KPI 3열, 1024px부터 기존 쉘 2열. 동일 결과 DOM을 CSS grid로 정렬하고 별도 모바일 결과 복제본을 생성하지 않는다. 1~7인 및 연도 비교 표만 지역화된 overflow-x:auto 래퍼 허용. 전체 body 가로 스크롤 금지. prefers-reduced-motion 대응, 숫자 갱신 애니메이션 없음.

SEO: 기획서 Title·Description 및 intro 4단락·FAQ 8개·related 5개를 적용한다. FAQ는 기존 `SeoContent` API에 맞춰 `{q,a}`. H1 1개, H2→H3 순서, 출처·기준표·FAQ는 SSG 출력. JS config만 존재하고 본문이 비어 있는 구조 금지.

등록: `tools.ts`의 기존 slug 항목 title은 ‘2027 기준 중위소득·복지급여 자격 계산기’, description은 기획서 Description. badges는 `["공식","시뮬레이션"]`만 사용한다. 예시 통계는 ‘4인 기준 중위소득 6,929,885원’, ‘급여 기준 32·40·48·50%’, ‘비교 연도 2026·2027’로 바꾸되 자동 배지 생성에 쓰지 않는다. 홈·도구 목록의 별도 데이터가 있으면 연도·카테고리를 대조한다. reports.ts에 항목 추가하지 않는다. 기존 sitemap URL·app.scss import는 유지한다.

내부 링크는 기획서 8번 5개만 사용하며 금액 query를 붙이지 않는다. `/tools/education-benefit-eligibility-calculator-2026/`를 가상의 2027 URL로 바꾸지 않는다. 신뢰 안내·관련 링크는 TS 데이터, 외부 링크는 정적 허용 URL만 사용한다.

## 9. 구현 순서와 검증 계획

1. 기획서의 미대조 공식 고시 표를 확인하고 source 기록을 보완한다. 확인 못한 항목은 위 null/차단 정책 유지.
2. 새 공통 데이터 파일·2026 호환 투영을 작성한다. 기존 1~6인 값·export와 소비자 영향을 대조한다.
3. DOM 없는 core 함수를 작성하고 아래 정수·경계·차단·URL 검증을 실행한다.
4. Astro의 입력·결과·SSG 기준표·출처를 갱신하고 기존 상세 계산 UI를 제거한다.
5. DOM script·공유·오류·리셋·회귀 동작을 연결한다.
6. 페이지 스타일·SEO·메타·OG·목록·sitemap을 갱신한다.
7. `npm run check:all`, `npm run build`, preview 수동 확인을 실시한다. 실패한 상태로 커밋·push하지 않는다.

### 자동 검증의 실행 설계

별도 테스트 프레임워크는 추가하지 않는다. 프로젝트 TypeScript 의존성을 사용해 검증 script가 `welfareThresholds.ts`와 호환 모듈을 임시 디렉터리에 ES module JS로 변환하고 core를 import한다. Node assert로 아래 기대값을 확인한 후 임시 산출물을 정리한다. 파일을 TS 텍스트 정규식으로 추출해 가짜 데이터만 테스트하지 않는다. 컴파일 진단도 확인하고 실패 시 종료코드 1을 반환한다. 실행 명령은 `node scripts/check-welfare-benefit-eligibility.mjs`.

| 검증 | 독립 기대값 |
|---|---|
| 2027·4인·300만원 | M=6929885, 화면 43%, 생계 gap=-782437, 의료=-228046, 주거=326345, 교육=464943 |
| 2027·4인·215만원 | 생계 gap=67563, 2026 생계 gap=-71684 |
| 각 검증된 T의 T-1/T/T+1 | below/equal/above, gap=1/0/-1. 반올림된 %를 판정에 사용하지 않음 |
| 2027 생계 A=2217564 | 표시 32%, status=above, gap=-1 |
| A=0 / empty | 각각 valid·0% / empty·판정 없음 |
| 2027 median 7/8/9인 | 10152665 / 11176129 / 12199593 |
| 2027 housing 7/8/9인 | 4873279 / 5364542 / 5855805 |
| 2026 median 8인 | 10474348 |
| 미검증 7인·8인 급여 | unavailable, gap=null. 0원·4인·비율 곱셈 대체 없음 |
| 파싱 | 3,000,000·0·10억 valid, 3만원·1e6·1.5·-1·3,00·공백 내부·범위초과 invalid |
| 기존 2026 export | 6행·모든 기존 금액·키가 변경 전 값과 일치 |
| URL | valid v2·fragment, 중복 키, 잘못된 year/mode/hh/amount, 구형 URL·민감 키 제거 |
| 공유 | 기본 query에 금액 없음, valid+명시 선택 때만 hash 있음, invalid/empty는 없음 |
| 부분 검증 config | available 행만 계산, 존재하지 않는 sourceId는 config 오류 |

경계 테스트는 실제 원자료와 기획서 대표 예시를 기대값으로 사용한다. 같은 구현 함수를 호출해 기대값을 다시 만들어 비교하는 테스트는 쓰지 않는다.

### 수동 QA

- [ ] 320·375·768·1024px 이상 화면에서 입력→결과 순서·표 래퍼·긴 숫자를 확인했다.
- [ ] 금액 입력→오류→수정, 0원, 연도 변경, 7→8인, 모드 변경 시 금액 초기화를 확인했다.
- [ ] clipboard 성공·실패 수동 복사, 금액 포함 공유·수신·fragment 제거를 확인했다.
- [ ] 구형 공유 URL을 열어 2026 안내와 민감 파라미터 제거를 확인했다.
- [ ] 키보드만으로 radio·select·copy·reset 조작, 오류 및 결과 낭독을 확인했다.
- [ ] JS 비활성·config 오류에서도 기준표·FAQ·출처를 읽을 수 있다.
- [ ] 기존 생계·주거·교육·재산·경기 청년·청년월세·부모님 진단의 2026 기준액·제목이 유지된다.
- [ ] `/`, `/tools/`, 해당 페이지의 등록 카피·전용 OG·canonical·관련 링크를 확인했다.
- [ ] 광고·분석 코드에 입력금액·fragment를 별도 전송하는 이벤트가 추가되지 않았다.

## 10. 완료 조건과 남은 확인사항

설계 결정: 기존 URL 유지, 새 데이터 모듈·정수 비교, 2026 호환 보존, 미검증 행 차단, 상세 계산 제거·연결, URL v2 및 구형 링크 안내, 전용 OG·기존 목록 갱신.

구현 전 재확인 필요: 2026 급여별 7인 원자료·가산 규칙, 2027 생계·의료·교육 7인 고시 표, 교육 8인 이상 산식·부칙, 분석 도구의 공유 fragment 수집 여부. 확인 못한 수치를 출처 확인으로 간주하거나 비율로 대체하지 않는다.

상세 소득인정액·재산 계산기의 2027 세부 산식 갱신은 별도 작업이다. 해당 페이지들이 2026 기준인 동안에는 결과·관련 링크에서 연도를 명시한다. 본 페이지의 네 급여 비교가 최신이라고 상세 계산까지 최신이라고 주장하지 않는다.

**2026-10-07 구현 기록:** 기능 구현·핵심 검증·개별 타입 검사·전체 빌드는 수행했다. 아래 검증 결과와 남은 항목을 참조한다. 전체 check:all 미통과로 배포 준비 완료 상태가 아니며 커밋·push·배포·라이브 QA는 미실시다.

문서 파일: `docs/design/202610/welfare-benefit-eligibility-2027-update-design.md`


### 구현 반영 및 검증 기록 (2026-10-07)

- 기존 URL에서 연도·1~20인·소득인정액/월 소득 모드, 원 단위 비교, 네 급여 차액, 연도 비교표, 위치 막대, 정적 공식표·출처·FAQ를 구현했다.
- 2026 호환 export의 기존 6행과 공제 상수는 보존했다. 7인 생계·의료·교육 및 미확인 가산 결과는 차단한다.
- 개인정보 처리 보완: BaseLayout에 기본값 true인 recordSessions와 before-tracking 슬롯을 추가했다. 이 페이지는 세션 녹화와 광고 스크립트 로딩을 끈다. 금액·구형 소득/재산 query·금액 fragment를 외부 리소스 로딩 전에 제거하고 모듈에서 복원 후 임시 URL 변수를 삭제한다. 공통 레이아웃 무변경 원칙의 예외이며 민감한 금액을 처리하는 페이지에만 적용한다.
- 목차 fragment는 금액 공유 fragment와 구분해 입력을 보존한다. 월 소득 모드 변경 시 금액과 공유 선택을 초기화한다.
- 전용 OG 이미지와 등록 카피, 기존 sitemap lastmod를 갱신했다.

| 검증 | 실행 결과 |
|---|---|
| node scripts/check-welfare-benefit-eligibility.mjs | 통과: 대표 예시, 186개 T-1/T/T+1 경계값, 가산, 입력 검증, URL·공유, 2026 호환, SEO 분량 |
| 변경한 Astro·TS·JS 5개 파일의 제한된 tsconfig 검사 | 0 errors / 0 warnings / 0 hints |
| node scripts/check-category-mapping.mjs | 통과 |
| npm run check:all | 실패: 저장소 전체 397 errors / 2 warnings / 739 hints. 기존 홈 중복 키, 기존 페이지의 CalculatorHero badges·SeoContent prop 불일치, 기존 데이터 타입 오류 등. 해당 오류는 이번 변경 범위 밖이며 변경 파일 제한 검사에서는 재현되지 않음 |
| npm run build | 최종 통과: 423페이지. 샌드박스 realpath 오류 및 초기 빌드 임시 파일 충돌 후 권한 허용된 전체 빌드로 재검증 |
| 브라우저 화면 | 4인·300만원=43% 및 네 차액 일치. 생계 기준+1원은 표시 32%여도 초과. 1e6 오류, 0원, 8인 부분 차단, 모드 변경 초기화 확인 |
| 공유 | 기본 복사 금액 없음, 명시 선택 시 #amount 포함, 수신 복원 후 주소 제거 확인. 구형 소득·재산 URL은 2026·가구원만 복원 |
| 반응형 | 320·375px 입력 화면 확인. 320·375·768·1024px에서 문서 자체 가로 넘침 없음. 표는 별도 가로 스크롤 래퍼 사용 |
| 개인정보·SEO | 브라우저에서 Clarity 로딩 없음, 콘솔 오류 없음. 목차 이동 후 입력 유지 확인. 정적 표·FAQ·출처 제공 |

남은 검토: 전체 check:all 기존 오류 해소, clipboard 실패 경로 수동 확인, 스크린리더 낭독·키보드 전 구간·JS 비활성 화면의 추가 수동 QA, 상세 2026 소비자들의 전 화면 회귀 확인, 미확인 고시 원표·산식 재대조. 자동 비교 검증과 기본 브라우저 확인만으로 이 항목들을 완료 처리하지 않는다. 커밋·push·배포는 수행하지 않았다.
