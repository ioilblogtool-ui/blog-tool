# 대학생 등록금·생활비 콘텐츠 클러스터 2026 — 설계 문서 (1차: 2페이지)

> 기획 원본: [`docs/plan/202607/university-student-content-cluster-2026-plan.md`](../../plan/202607/university-student-content-cluster-2026-plan.md)
> 작성일: 2026-07-15
> 범위: 1차 우선순위 2개(`/tools/`, `SimpleToolShell`) — `university-cost-calculator-2026`, `national-scholarship-calculator-2026`
> 2차·3차 5개 페이지는 1차 완료 후 별도 설계 문서에서 다룬다.

---

## 0. 공통 설계 원칙

### 0-1. 컴포넌트 재사용 (실제 코드 확인 완료)

두 페이지 모두 `SimpleToolShell`(`src/components/SimpleToolShell.astro`) 패턴을 따른다. `src/pages/tools/basic-pension-eligibility-calculator.astro`를 구조 참고 기준으로 삼는다(실제 코드 확인 완료).

| 컴포넌트 | 역할 | 슬롯/Props |
|---|---|---|
| `BaseLayout.astro` | `<head>`, SEO, JSON-LD | `title`, `description`, `ogImage`, `jsonLd` |
| `SiteHeader.astro` | 전역 헤더 | — |
| `SimpleToolShell.astro` | 계산기 전체 레이아웃 | `calculatorId`, `pageClass`, `resultFirst` / 슬롯: `hero`, `actions`, `aside`, 기본(결과), `seo` |
| `CalculatorHero.astro` | Hero | `eyebrow`, `title`, `description`, `badges` |
| `InfoNotice.astro` | 면책 배너 | `title`, `lines: string[]` |
| `ToolActionBar.astro` | 초기화·링크복사 버튼 | `resetId`, `copyId` |
| `SeoContent.astro` | SEO 텍스트+FAQ+관련링크 | `introTitle`, `intro: string[]`, `inputPoints?: string[]`, `criteria?: string[]`, `faq?: {question, answer}[]`, `related?: {href, label}[]` |

**⚠️ 실제 컴포넌트 확인 결과**: `SeoContent`의 FAQ 타입은 `{ question: string; answer: string }`이다(`CONTENT_GUIDE.md` 예시의 `{ q, a }` 표기와 다름 — 실제 코드 기준으로 통일). 이 설계 문서와 데이터 파일은 `{ question, answer }`로 작성한다.

### 0-2. 전역 공유 UI 키트 (재사용, 재정의 금지)

`src/styles/scss/_legacy.scss`의 `.panel`, `.panel-heading`, `.panel-heading__eyebrow`, `.form-grid`, `.field`, `.checkbox-option`, `.section-header`, `.action-bar`, `.button`, `.mode-chip`, `.toggle-grid`, `.calc-slider`, `.calc-slider-row` 클래스를 그대로 쓴다. 페이지 SCSS(`_<slug>.scss`)에는 KPI 그리드·프리셋 카드·차트 래퍼 등 페이지 고유 요소만 추가한다.

### 0-3. 데이터·계산 로직 재사용 원칙

- **등록금 기준값**: `src/data/universityTuition2026.ts`에서 정의하고, `university-cost-calculator-2026`이 import한다. 2차 `university-tuition-ranking-2026` 착수 시 동일 파일을 재사용하도록 지금부터 분리해둔다 (기획 문서 8장 원칙).
- **주거·생활비 기준값**: `src/data/universityHousingCost2026.ts`에서 정의. 2차 `dorm-vs-commute-cost-comparison-2026`이 재사용할 예정.
- **소득분위·지원금표**: `src/data/nationalScholarship2026.ts`에서 정의. `national-scholarship-calculator-2026` 전용이지만 파일을 분리해 향후 장학금 콘텐츠 확장에 대비한다.
- **TS(데이터 파일) ↔ JS(클라이언트 스크립트) 이중 구현 원칙**: 이 사이트 기존 관례대로, 계산 로직을 데이터 파일(TS, Astro SSR 초기값 렌더용)과 `public/scripts/*.js`(클라이언트 실시간 재계산용) 양쪽에 각각 구현한다. `public/scripts`는 빌드 없는 순수 JS라 TS 파일을 직접 import할 수 없기 때문이며, 두 구현이 수치상 어긋나지 않도록 QA에서 반드시 교차 확인한다.

### 0-4. 입력 UX 패턴 (`docs/CODE_SKILL.md` 기준 적용)

- 금액 입력(월 생활비, 월 주거비, 연간 장학금, 가구 월소득)에는 슬라이더 동기화 패턴 적용
- 프리셋 선택(등록금 빠른 설정, 거주 형태, 다자녀 여부, 재학 기간)은 `mode-chip` 라디오칩 패턴 적용
- 표시 모드 토글("총비용 보기" / "실부담금 보기")도 `mode-chip` 2종 토글로 구현 — `payoutMode` 토글과 동일 패턴 재사용

### 0-5. URL 상태 저장

`public/scripts/url-state.js`의 `readParam`, `readBool`, `writeParams` 재사용 — 두 계산기 모두 입력값을 URL 파라미터로 공유 가능하게 한다.

### 0-6. SEO 공통 규칙 (`docs/GOOGLE_SEO_RULES.md`, `CONTENT_GUIDE.md` 기준, 필수 준수)

- `SeoContent`의 `intro` **4단락 이상, 총 600자 이상**(이 클러스터는 800자 이상 목표) — 기획 문서 5-4·6-4에 초안 완성됨, 그대로 사용
- `faq` **5개 이상** — 이 클러스터는 8개로 상향 (기획 문서 5-6·6-6)
- `related` **3~5개**
- `<Fragment slot="seo">` 안에 `SeoContent` 배치 필수
- URL 트레일링 슬래시 필수, `sitemap.xml`에 `changefreq: monthly`로 등록 (`quarterly` 금지)
- 메타 타이틀 50자 이내 + 연도(2026) 포함, 디스크립션 80~120자 (`CLAUDE.md` 메타 공식)

### 0-7. 기획 문서 대비 조정 사항 (설계 단계에서 구체화)

- **등록금 입력값 단순화**: 기획 문서 5-2는 "대학 유형(국공립/사립)"과 "계열(5종)"을 별도 select로 뒀지만, 실제 공개 데이터는 "설립유형별 평균"과 "계열별 평균"이 서로 다른 집계 기준이라 두 값을 곱하거나 더해 "사립대 의학계열" 같은 조합 수치를 만들면 근거 없는 추정이 된다. **설계에서는 이를 단일 "연간 등록금" 자유 입력 필드 + 7종 프리셋 칩(전체평균/국공립/사립/인문사회/자연과학/공학/예체능/의학)으로 단순화**한다. 각 프리셋은 실제 보도된 값 그대로이며, 조합 수치를 만들지 않는다.
- **관점 토글 재정의**: 기획 문서 5-3의 "학생 관점 / 부모 관점" 토글은 애초 알바 수입 입력을 전제로 한 것인데, 알바 계산기를 만들지 않기로 하면서(기획 문서 1장) 학생이 버는 돈을 입력할 필드가 없어졌다. 두 관점이 사실상 같은 숫자가 되므로, **설계에서는 "총비용 보기(장학금 반영 전 그로스 비용) / 실부담금 보기(장학금 차감 후 순부담)" 토글로 재정의**한다 — 계산식은 기획 문서 그대로이고, 결과를 보여주는 프레임만 명확하게 조정.
- **가구원수 입력의 한계**: `national-scholarship-calculator-2026`에서 확보한 소득인정액 경곗값 표(기획 문서 3-7)는 가구원수별 세분화 없이 확인된 대표값이다. 가구원 수 입력은 결과 요약에 컨텍스트로 표시하되, 구간 산정 계산 자체에는 반영하지 않고 InfoNotice로 한계를 명확히 밝힌다 (아래 6-3 참고). **가구원수별 정확한 경곗값은 구현 착수 직전 kosaf.go.kr에서 재확인이 필요하며, 확인되면 이 조정 사항을 업데이트한다.**

---

## 1. 페이지 1 — `university-cost-calculator-2026` (1차, 클러스터 허브)

### 1-1. 파일 목록

| 역할 | 경로 |
|---|---|
| 데이터(공용, 등록금) | `src/data/universityTuition2026.ts` (신규, 2차 `university-tuition-ranking-2026`이 재사용) |
| 데이터(공용, 주거·생활비) | `src/data/universityHousingCost2026.ts` (신규, 2차 `dorm-vs-commute-cost-comparison-2026`이 재사용) |
| 데이터(페이지 전용) | `src/data/universityCostCalculator2026.ts` |
| 도구 등록 | `src/data/tools.ts` |
| 페이지 | `src/pages/tools/university-cost-calculator-2026.astro` |
| 스크립트 | `public/scripts/university-cost-calculator-2026.js` |
| 스타일 | `src/styles/scss/pages/_university-cost-calculator-2026.scss` |

### 1-2. URL 및 메타

```
슬러그: /tools/university-cost-calculator-2026/
타이틀(seoTitle): 대학 등록금 계산기 2026 | 4년 총비용 실부담금 바로 계산
디스크립션: 등록금·주거비·생활비·통학비를 입력하고 국가장학금을 빼면 대학 4년 실제 부담금과 부모 부담액을 바로 계산합니다. 학생·부모 관점 결과 제공.
```

### 1-3. 공용 데이터 파일 — `universityTuition2026.ts`

```ts
export type UniversityType = "NATIONAL" | "PRIVATE";
export type MajorField = "HUMANITIES" | "SCIENCE" | "ENGINEERING" | "ARTS" | "MEDICINE";

export interface TuitionPreset {
  id: string;
  label: string;
  annualTuition: number;
  group: "OVERALL" | "TYPE" | "FIELD";
}

// 2026학년도 4년제 대학 등록금 — 대학지성 In&Out·교수신문 교차 확인
export const TUITION_AVERAGE_2026 = 7_270_300;   // 전체 평균
export const TUITION_NATIONAL_2026 = 4_250_000;  // 국공립대 평균
export const TUITION_PRIVATE_2026 = 8_231_500;   // 사립대 평균

export const TUITION_PRESETS: TuitionPreset[] = [
  { id: "overall", label: "전체 평균", annualTuition: TUITION_AVERAGE_2026, group: "OVERALL" },
  { id: "national", label: "국공립대 평균", annualTuition: TUITION_NATIONAL_2026, group: "TYPE" },
  { id: "private", label: "사립대 평균", annualTuition: TUITION_PRIVATE_2026, group: "TYPE" },
  { id: "humanities", label: "인문사회 계열", annualTuition: 6_433_700, group: "FIELD" },
  { id: "science", label: "자연과학 계열", annualTuition: 7_323_300, group: "FIELD" },
  { id: "engineering", label: "공학 계열", annualTuition: 7_677_400, group: "FIELD" },
  { id: "arts", label: "예체능 계열", annualTuition: 8_338_100, group: "FIELD" },
  { id: "medicine", label: "의학 계열", annualTuition: 10_325_900, group: "FIELD" },
];

// 등록금 인상·동결 추이 (참고 카드용, 2차 university-tuition-ranking-2026도 재사용)
export const TUITION_TREND_2022_2026 = [
  { year: 2022, legalCapRate: 1.65, raisedSchools: 4 },
  { year: 2023, legalCapRate: 4.05, raisedSchools: 17 },
  { year: 2024, legalCapRate: 5.64, raisedSchools: 26 },
  { year: 2025, legalCapRate: 5.49, raisedSchools: 136 },
  { year: 2026, legalCapRate: 3.19, raisedSchools: 125 },
];

export const TUITION_META = {
  updatedAt: "2026학년도 기준 (2026-07 확인)",
  sourceNote: "대학지성 In&Out·교수신문 2026학년도 등록금 조사 결과",
  sourceUrls: [
    "https://www.unipress.co.kr/news/articleView.html?idxno=14468",
    "https://www.kyosu.net/news/articleView.html?idxno=205119",
  ],
};
```

### 1-4. 공용 데이터 파일 — `universityHousingCost2026.ts`

```ts
export type ResidenceType = "PARENTS" | "DORM" | "OFFCAMPUS";

export interface ResidencePreset {
  type: ResidenceType;
  label: string;
  monthlyHousingDefault: number;  // 월세+관리비 또는 기숙사비
  monthlyLivingDefault: number;   // 월세 제외 생활비 참고값
  note: string;
}

// 2026년 기준 — 서울 대학가 원룸 시세·기숙사 수용률/비용 조사 종합
export const RESIDENCE_PRESETS: ResidencePreset[] = [
  {
    type: "PARENTS", label: "부모님 집",
    monthlyHousingDefault: 0, monthlyLivingDefault: 400_000,
    note: "주거비 없음, 식비·용돈 등 생활비만 발생(참고값)",
  },
  {
    type: "DORM", label: "기숙사",
    monthlyHousingDefault: 325_000, monthlyLivingDefault: 500_000,
    note: "2인실 기준 평균 기숙사비 월 32만 5천원. 전국 수용률 22.6%(수도권 18.2%)로 신청 경쟁 있음",
  },
  {
    type: "OFFCAMPUS", label: "자취",
    monthlyHousingDefault: 704_000, monthlyLivingDefault: 1_150_000,
    note: "서울 대학가 원룸 평균 월세 62만 2천원+관리비 8만 2천원 기준(2026-01). 생활비는 월 100만~130만원대 참고치",
  },
];

export const HOUSING_META = {
  updatedAt: "2026년 1월 기준",
  sourceNote: "대학가 원룸 시세 보도, 4년제 대학 기숙사 수용 현황 조사 종합",
  sourceUrls: [
    "https://v.daum.net/v/20260224190250832",
    "https://www.edpl.co.kr/news/articleView.html?idxno=14982",
    "https://www.nextplay.kr/news/articleView.html?idxno=4945",
  ],
};
```

### 1-5. 페이지 전용 데이터 파일 — `universityCostCalculator2026.ts`

```ts
import { TUITION_PRESETS, TUITION_AVERAGE_2026, TUITION_TREND_2022_2026 } from "./universityTuition2026";
import { RESIDENCE_PRESETS, ResidenceType } from "./universityHousingCost2026";

export const UCC_META = {
  slug: "university-cost-calculator-2026",
  title: "대학 등록금 계산기 2026",
  seoTitle: "대학 등록금 계산기 2026 | 4년 총비용 실부담금 바로 계산",
  seoDescription:
    "등록금·주거비·생활비·통학비를 입력하고 국가장학금을 빼면 대학 4년 실제 부담금과 부모 부담액을 바로 계산합니다. 학생·부모 관점 결과 제공.",
  updatedAt: "2026-07-15",
  dataNote:
    "등록금·주거비 기본값은 2026학년도 대학알리미 공시·언론 보도 기준 평균값이며, 실제 학교·학과별 금액은 이보다 높거나 낮을 수 있습니다. 이 계산 결과는 예산 계획을 위한 참고 자료입니다.",
};

export type EnrollmentYears = 4 | 6;

export interface UccInput {
  annualTuition: number;
  residenceType: ResidenceType;
  monthlyHousing: number;
  monthlyLiving: number;
  monthlyCommute: number;
  annualScholarship: number;
  yearsEnrolled: EnrollmentYears;
}

export interface UccResult {
  tuitionTotal: number;
  livingTotal: number;
  aidTotal: number;
  grossTotal: number;   // 등록금+주거·생활비 (장학금 반영 전)
  netBurden: number;    // grossTotal - aidTotal (실부담금)
  monthlyAverage: number;
  aidCoverageRatio: number; // netBurden 대비 aidTotal 비율(%)
}

// public/scripts/university-cost-calculator-2026.js와 1:1 대응 로직 — 값 변경 시 양쪽 동기화 필수
export function calcUniversityCost(input: UccInput): UccResult {
  const tuitionTotal = input.annualTuition * input.yearsEnrolled;
  const monthlyTotal = input.monthlyHousing + input.monthlyLiving + input.monthlyCommute;
  const livingTotal = monthlyTotal * 12 * input.yearsEnrolled;
  const aidTotal = input.annualScholarship * input.yearsEnrolled;
  const grossTotal = tuitionTotal + livingTotal;
  const netBurden = Math.max(grossTotal - aidTotal, 0);
  const monthlyAverage = netBurden / (input.yearsEnrolled * 12);
  const aidCoverageRatio = grossTotal > 0 ? Math.min(Math.round((aidTotal / grossTotal) * 100), 100) : 0;
  return { tuitionTotal, livingTotal, aidTotal, grossTotal, netBurden, monthlyAverage, aidCoverageRatio };
}

export const UCC_DEFAULT_INPUT: UccInput = {
  annualTuition: TUITION_AVERAGE_2026,
  residenceType: "PARENTS",
  monthlyHousing: 0,
  monthlyLiving: 400_000,
  monthlyCommute: 100_000,
  annualScholarship: 0,
  yearsEnrolled: 4,
};

export { TUITION_PRESETS, RESIDENCE_PRESETS, TUITION_TREND_2022_2026 };

export const UCC_SEO_CONTENT = {
  introTitle: "대학 4년 실제 비용, 등록금만으론 안 보입니다",
  intro: [
    "대학 입학을 앞둔 예비 대학생과 학부모는 등록금 고지서를 받기 전부터 4년치 총비용이 얼마나 되는지 궁금해합니다. 2026학년도 4년제 대학 평균 등록금은 연 727만 300원으로 전년보다 2.1% 올랐고, 사립대는 823만 1,500원, 국공립대는 425만 원으로 두 배 가까이 차이가 납니다. 여기에 자취·기숙사비, 생활비, 통학비까지 더하면 등록금만 볼 때보다 실제 부담은 훨씬 커집니다.",
    "이 계산기는 등록금 + 주거비 + 생활비 + 통학비를 더한 뒤 국가장학금 등 지원금을 뺀 '4년 실부담금' 방식으로 계산합니다. 2026년 서울 대학가 원룸 평균 월세는 62만 2,000원, 기숙사 수용률은 전국 평균 22.6%에 불과해 거주 형태 선택이 총비용을 좌우하는 가장 큰 변수입니다. 계열별로도 의학 계열 평균 1,032만 5,900원부터 인문사회 643만 3,700원까지 등록금 차이가 크므로, 계열을 반영해야 실제에 가까운 숫자가 나옵니다.",
    "결과에서 '등록금 총액'보다 '주거·생활비 총액'이 더 큰 경우가 많다는 점에 주목해야 합니다. 수도권 자취를 선택하면 월세만으로 연간 700만 원 이상이 추가돼, 등록금이 저렴한 국공립대에 진학해도 총비용이 사립대 자택 통학보다 커질 수 있습니다. '총비용 보기'와 '실부담금 보기' 두 관점을 함께 보면 실제로 얼마를 준비해야 하는지 더 명확히 판단할 수 있습니다.",
    "이 계산기는 2026학년도 대학알리미·언론 보도 기준 평균값을 기본값으로 제공하며, 실제 등록금은 학교·학과별로 최대 수백만 원 차이가 날 수 있습니다(2026학년도 등록금 인상 대학 125개교, 동결 65개교). 정확한 등록금은 진학 예정 학교의 대학알리미 공시 자료를 확인하시고, 이 계산 결과는 예산 계획을 위한 참고 자료로 활용하세요.",
  ],
  inputPoints: [
    "등록금 프리셋(전체 평균/국공립/사립/계열별)을 클릭하면 실제 보도된 2026학년도 수치가 바로 입력됩니다.",
    "거주 형태(부모님 집/기숙사/자취)를 바꾸면 월 주거비·생활비 기본값이 자동으로 갱신됩니다.",
    "국가장학금 계산기에서 예상 지원금을 먼저 확인한 뒤 '연간 장학금' 입력값에 넣으면 실부담금까지 이어서 계산할 수 있습니다.",
  ],
  criteria: [
    "등록금 기본값은 2026학년도 대학알리미·언론 보도 평균치이며 개별 학교 수치가 아닙니다.",
    "주거비 기본값은 2026년 1월 서울 대학가 원룸 시세·전국 기숙사비 평균 기준입니다.",
    "실부담금 = (등록금+주거·생활비+통학비) 총액 − 장학금 총액이며, 알바 등 학생 본인 소득은 포함하지 않습니다.",
    "재학 기간은 4년/6년(약학 등)만 지원하며, 휴학·재수강 등 변수는 반영하지 않습니다.",
  ],
};

export const UCC_FAQ = [
  { question: "대학 4년 등록금은 평균 얼마나 드나요?", answer: "2026학년도 4년제 대학 평균은 연 727만 300원으로, 4년이면 약 2,900만 원 수준입니다. 사립대(823만 1,500원)와 국공립대(425만 원)는 4년 기준 약 1,600만 원 차이가 납니다." },
  { question: "국공립대와 사립대 등록금 차이는 얼마나 되나요?", answer: "2026학년도 기준 국공립대 평균은 425만 원, 사립대는 823만 1,500원으로 약 2배 차이입니다. 계열까지 고려하면 의학 계열 사립대는 1,000만 원을 넘는 경우도 있습니다." },
  { question: "자취하면 생활비가 얼마나 더 드나요?", answer: "2026년 서울 대학가 원룸 평균 월세는 62만 2,000원, 관리비 8만 2,000원으로 월세만 연 840만 원 이상입니다. 월세 제외 생활비도 월 100만~130만 원 선이 현실적이라 자취 시 등록금보다 주거·생활비 부담이 더 커질 수 있습니다." },
  { question: "기숙사에 들어가면 비용을 얼마나 아낄 수 있나요?", answer: "2인실 기준 평균 기숙사비는 월 32만 5,000원 선으로 자취 월세의 절반 수준입니다. 다만 전국 기숙사 수용률은 22.6%(수도권은 18.2%)에 불과해 신청 경쟁이 치열합니다." },
  { question: "등록금은 매년 오르나요?", answer: "2026학년도에는 190개 대학 중 125개교(65.8%)가 등록금을 인상했고 65개교는 동결했습니다. 법정 인상 상한은 2026학년도 3.19%로 최근 5년 중 가장 낮은 수준입니다." },
  { question: "국가장학금을 받으면 실부담금이 얼마나 줄어드나요?", answer: "소득분위 1~3구간은 연 최대 600만 원, 4~6구간은 440만 원까지 지원됩니다. 국가장학금 계산기로 예상 지원금을 먼저 확인한 뒤 이 계산기에 입력하면 실제 부담금을 정확히 볼 수 있습니다." },
  { question: "총비용 보기와 실부담금 보기는 뭐가 다른가요?", answer: "총비용 보기는 장학금을 반영하기 전 등록금+주거·생활비 합계이고, 실부담금 보기는 여기서 장학금을 뺀 뒤 실제로 준비해야 하는 금액입니다." },
  { question: "계열에 따라 등록금이 얼마나 차이 나나요?", answer: "2026학년도 기준 의학 계열 평균 1,032만 5,900원, 예체능 833만 8,100원, 공학 767만 7,400원, 자연과학 732만 3,300원, 인문사회 643만 3,700원으로 최대 400만 원 가까이 차이가 납니다." },
];

export const UCC_RELATED_LINKS = [
  { href: "/tools/national-scholarship-calculator-2026/", label: "국가장학금 계산기 2026", description: "소득분위별 예상 국가장학금 지원금을 계산해 이 계산기의 장학금 입력값으로 연결합니다." },
  { href: "/reports/single-household-living-cost-2026/", label: "1인 가구 생활비 리포트", description: "자취 시 생활비 항목별 평균을 더 자세히 확인합니다." },
  { href: "/reports/youth-savings-comparison-2026/", label: "청년저축 비교 리포트", description: "졸업 후 학자금 상환·목돈 마련에 쓸 수 있는 청년 금융상품을 비교합니다." },
];
```

### 1-6. 페이지 IA

```
Hero (eyebrow: "대학 등록금 계산", title: UCC_META.title)
InfoNotice (dataNote + "브라우저에서만 계산, 서버 전송 없음")
ToolActionBar (초기화/링크복사)

[aside] 등록금 프리셋 칩 8종 (mode-chip, TUITION_PRESETS)
[aside] 입력 폼
  - 등록금: 자유 입력(슬라이더) + 프리셋 칩으로 빠른 채움
  - 거주 형태: mode-chip 3종(부모님 집/기숙사/자취) → 월 주거비·생활비 기본값 자동 갱신
  - 월 주거비 / 월 생활비 / 월 통학비: 슬라이더+숫자 입력
  - 연간 장학금: 슬라이더+숫자 입력 (기본 0)
  - 재학 기간: mode-chip 2종(4년/6년)

[본문] 결과 섹션 1: KPI 그리드
  - 등록금 총액 / 주거·생활비 총액 / 장학금 총액(-) / 실부담금 / 월평균 필요액
[본문] 결과 섹션 2: 표시 모드 토글(mode-chip: "총비용 보기" / "실부담금 보기")
  - 총비용 보기: 등록금/주거비/생활비/통학비 스택 바 차트(Chart.js 가로 바)
  - 실부담금 보기: 장학금 차감 전후 비교 + aidCoverageRatio 도넛
[본문] 결과 섹션 3: 네이버 노출용 핵심 숫자 요약표 (설립유형별·계열별 등록금, 거주형태별 월비용 — 표 형태로 고정 노출)
[본문] 결과 섹션 4: 등록금 인상·동결 추이 카드(TUITION_TREND_2022_2026, 최근 5년)
[본문] 관련 CTA 그리드 (UCC_RELATED_LINKS)

SeoContent (introTitle/intro/inputPoints/criteria/faq 8개/related 3개)
```

### 1-7. 스크립트 구조 (`university-cost-calculator-2026.js`)

`basic-pension-eligibility-calculator.js`와 동일한 패턴 — JSON 데이터 주입 + 상태 객체 + `render()` 재계산:

```js
import { readParam, writeParams } from "./url-state.js";

const dataEl = document.getElementById("ucc-data"); // TUITION_PRESETS, RESIDENCE_PRESETS 등 JSON 주입
const { tuitionPresets, residencePresets, defaultInput } = JSON.parse(dataEl.textContent);

const state = { ...defaultInput };
let viewMode = "GROSS"; // "GROSS" | "NET"

// calcUniversityCost — universityCostCalculator2026.ts의 로직과 1:1 대응, 값 변경 시 양쪽 동기화 필수
function calcUniversityCost(input) {
  const tuitionTotal = input.annualTuition * input.yearsEnrolled;
  const monthlyTotal = input.monthlyHousing + input.monthlyLiving + input.monthlyCommute;
  const livingTotal = monthlyTotal * 12 * input.yearsEnrolled;
  const aidTotal = input.annualScholarship * input.yearsEnrolled;
  const grossTotal = tuitionTotal + livingTotal;
  const netBurden = Math.max(grossTotal - aidTotal, 0);
  const monthlyAverage = netBurden / (input.yearsEnrolled * 12);
  const aidCoverageRatio = grossTotal > 0 ? Math.min(Math.round((aidTotal / grossTotal) * 100), 100) : 0;
  return { tuitionTotal, livingTotal, aidTotal, grossTotal, netBurden, monthlyAverage, aidCoverageRatio };
}

function render() {
  const result = calcUniversityCost(state);
  // KPI 렌더, 표시 모드에 따라 스택 바 vs 도넛 전환, writeParams(state)로 URL 동기화
}
```

거주 형태 mode-chip 변경 시 `residencePresets`에서 해당 프리셋의 `monthlyHousingDefault`/`monthlyLivingDefault`를 입력 필드에 채우고 `render()` 재호출 — `senior-job-salary-calculator-2026`의 프리셋 클릭 패턴과 동일.

---

## 2. 페이지 2 — `national-scholarship-calculator-2026` (1차)

### 2-1. 파일 목록

| 역할 | 경로 |
|---|---|
| 데이터 | `src/data/nationalScholarship2026.ts` |
| 도구 등록 | `src/data/tools.ts` |
| 페이지 | `src/pages/tools/national-scholarship-calculator-2026.astro` |
| 스크립트 | `public/scripts/national-scholarship-calculator-2026.js` |
| 스타일 | `src/styles/scss/pages/_national-scholarship-calculator-2026.scss` |

### 2-2. URL 및 메타

```
슬러그: /tools/national-scholarship-calculator-2026/
타이틀: 국가장학금 계산기 2026 | 소득분위별 예상 지원금 바로 계산
디스크립션: 가구원 수·소득·재산을 입력하면 2026년 학자금 지원구간(1~10구간)과 예상 국가장학금 지원금을 바로 계산합니다. 다자녀 가구 혜택 비교 포함.
```

### 2-3. 데이터 파일 설계

```ts
export type MultiChildStatus = "NONE" | "SECOND" | "THIRD_OR_MORE";

export interface IncomeBracket {
  bracket: number;              // 1~10
  monthlyIncomeCap: number | null; // 10구간은 상한 없음(초과)
  medianIncomeRatio: string;    // "30%" 등, 표시용
}

// 2026년 학자금 지원구간 경곗값 — 한국장학재단 공식 확인
// ⚠️ 가구원수별 세분화 없이 확인된 대표값. 착수 직전 kosaf.go.kr에서 가구원수별 표 재확인 필요(0-7 참고)
export const NS_INCOME_BRACKETS: IncomeBracket[] = [
  { bracket: 1, monthlyIncomeCap: 1_948_421, medianIncomeRatio: "30%" },
  { bracket: 2, monthlyIncomeCap: 3_247_369, medianIncomeRatio: "50%" },
  { bracket: 3, monthlyIncomeCap: 4_546_317, medianIncomeRatio: "70%" },
  { bracket: 4, monthlyIncomeCap: 5_845_264, medianIncomeRatio: "90%" },
  { bracket: 5, monthlyIncomeCap: 6_494_738, medianIncomeRatio: "100%" },
  { bracket: 6, monthlyIncomeCap: 8_443_159, medianIncomeRatio: "130%" },
  { bracket: 7, monthlyIncomeCap: 9_742_107, medianIncomeRatio: "150%" },
  { bracket: 8, monthlyIncomeCap: 12_989_476, medianIncomeRatio: "200%" },
  { bracket: 9, monthlyIncomeCap: 19_484_214, medianIncomeRatio: "300%" },
  { bracket: 10, monthlyIncomeCap: null, medianIncomeRatio: "300% 초과" },
];

export interface ScholarshipAmountRow {
  minBracket: number;
  maxBracket: number;
  annualAmount: number; // 원 단위, 0이면 미지원
  label: string;
}

// 국가장학금 I유형 구간별 연간 지원금액 — 2차 소스 종합, 착수 직전 kosaf.go.kr 원본 재대조 필수(기획 문서 3-8 ⚠️)
export const NS_SCHOLARSHIP_AMOUNTS: ScholarshipAmountRow[] = [
  { minBracket: 1, maxBracket: 3, annualAmount: 6_000_000, label: "1~3구간" },
  { minBracket: 4, maxBracket: 6, annualAmount: 4_400_000, label: "4~6구간" },
  { minBracket: 7, maxBracket: 8, annualAmount: 3_600_000, label: "7~8구간" },
  { minBracket: 9, maxBracket: 9, annualAmount: 1_000_000, label: "9구간" },
  { minBracket: 10, maxBracket: 10, annualAmount: 0, label: "10구간(미지원)" },
];

// 다자녀 가구 특례 (2026년부터 확대 적용)
export const NS_MULTI_CHILD = {
  SECOND: { upToBracket3: 6_100_000, bracket4to8: 5_050_000 },
  THIRD_OR_MORE: { fullTuitionUpToBracket: 8 }, // 8구간까지 등록금 전액
};

export function findIncomeBracket(monthlyIncome: number): number {
  const found = NS_INCOME_BRACKETS.find(
    (b) => b.monthlyIncomeCap !== null && monthlyIncome <= b.monthlyIncomeCap
  );
  return found ? found.bracket : 10;
}

export interface NsInput {
  householdSize: number;        // 표시·컨텍스트용, 구간 산정에는 미반영(0-7 참고)
  householdMonthlyIncome: number;
  multiChildStatus: MultiChildStatus;
  annualTuition: number;
}

export interface NsResult {
  bracket: number;
  annualAmount: number;
  tuitionCoverageRatio: number; // 0~100(%)
}

// public/scripts/national-scholarship-calculator-2026.js와 1:1 대응 로직
export function calcNationalScholarship(input: NsInput): NsResult {
  const bracket = findIncomeBracket(input.householdMonthlyIncome);

  let annualAmount =
    NS_SCHOLARSHIP_AMOUNTS.find((r) => bracket >= r.minBracket && bracket <= r.maxBracket)?.annualAmount ?? 0;

  if (input.multiChildStatus === "THIRD_OR_MORE" && bracket <= NS_MULTI_CHILD.THIRD_OR_MORE.fullTuitionUpToBracket) {
    annualAmount = input.annualTuition; // 등록금 전액
  } else if (input.multiChildStatus === "SECOND") {
    if (bracket <= 3) annualAmount = NS_MULTI_CHILD.SECOND.upToBracket3;
    else if (bracket <= 8) annualAmount = NS_MULTI_CHILD.SECOND.bracket4to8;
  }

  const tuitionCoverageRatio =
    input.annualTuition > 0 ? Math.min(Math.round((annualAmount / input.annualTuition) * 100), 100) : 0;

  return { bracket, annualAmount, tuitionCoverageRatio };
}

export const NS_META = {
  slug: "national-scholarship-calculator-2026",
  title: "국가장학금 계산기 2026",
  seoTitle: "국가장학금 계산기 2026 | 소득분위별 예상 지원금 바로 계산",
  seoDescription:
    "가구원 수·소득·재산을 입력하면 2026년 학자금 지원구간(1~10구간)과 예상 국가장학금 지원금을 바로 계산합니다. 다자녀 가구 혜택 비교 포함.",
  updatedAt: "2026-07-15",
  dataNote:
    "실제 소득인정액은 금융재산·부채·형제자매 수 등을 반영해 한국장학재단이 산정합니다. 이 계산은 월 소득 기준의 단순 추정이며 실제 지원구간과 다를 수 있습니다. 정확한 구간은 한국장학재단 학자금 지원구간 산정 신청 후 확인하세요.",
};

export const NS_SEO_CONTENT = {
  introTitle: "국가장학금, 신청 전에 예상 구간부터 확인하세요",
  intro: [
    "국가장학금은 등록금 부담을 줄여주는 대표 제도지만, '내가 몇 구간에 해당하는지', '얼마를 받을 수 있는지'를 신청 전에 알기 어렵다는 게 가장 큰 불편함입니다. 2026년 1학기에만 108만 명이 2조 2,267억 원을 지원받았고, 2026년 전체로는 역대 최대인 약 150만 명, 5조 1,161억 원 규모로 확대됐습니다.",
    "학자금 지원구간은 가구원 수와 소득·재산을 반영한 '소득인정액'을 기준중위소득과 비교해 1~10구간으로 나뉩니다. 2026년 기준 월 소득인정액이 194만 8,421원 이하면 1구간(기준중위소득 30%), 649만 4,738원 이하면 5구간(기준중위소득 100%)입니다. 이 계산기는 입력한 가구 소득을 이 경곗값과 비교해 예상 구간을 산출하고, 구간별 지원금액표와 매칭해 연간 예상 지원금을 계산합니다.",
    "구간이 낮을수록(1~3구간) 지원금이 크다는 점이 핵심입니다. 1~3구간은 연 최대 600만 원, 4~6구간은 440만 원, 7~8구간은 360만 원, 9구간은 100만 원이 지원되며 10구간은 지원 대상에서 제외됩니다. 다자녀 가구는 셋째 이상 자녀부터 8구간까지 등록금 전액이 지원되므로, 형제자매 수가 많다면 예상보다 훨씬 많은 지원을 받을 수 있습니다.",
    "이 계산기는 월 소득만으로 구간을 추정하는 단순화된 계산이며, 실제 학자금 지원구간은 금융재산·부채·자동차 가액 등을 종합한 소득인정액으로 한국장학재단이 별도 산정합니다. 정확한 구간과 지원금은 한국장학재단 홈페이지에서 학자금 지원구간 산정 신청 후 확인해야 하며, 이 결과는 신청 전 대략적인 예상치로만 활용하세요.",
  ],
  inputPoints: [
    "가구 월 소득을 입력하면 2026년 학자금 지원구간 경곗값과 즉시 비교해 예상 구간을 보여줍니다.",
    "다자녀 여부를 선택하면 확대된 2026년 다자녀 특례(8구간까지 등록금 전액 등)가 자동 반영됩니다.",
    "예상 지원금을 대학 등록금 계산기의 '연간 장학금' 입력값에 그대로 이어서 넣을 수 있습니다.",
  ],
  criteria: [
    "소득인정액 경곗값은 2026년 한국장학재단 공식 발표 기준입니다.",
    "이 계산은 월 소득만 반영하며, 실제 산정에 포함되는 재산·부채·자동차 가액은 반영하지 않습니다.",
    "가구원 수는 결과 요약에 표시만 되며 구간 산정 계산 자체에는 반영하지 않습니다(한계 명시).",
    "구간별 지원금액표는 2차 소스 종합이라 실제 금액과 차이가 있을 수 있습니다.",
  ],
};

export const NS_FAQ = [
  { question: "국가장학금 소득분위는 어떻게 계산되나요?", answer: "부모(가구)의 소득과 재산을 합산한 '소득인정액'을 기준중위소득과 비교해 1~10구간으로 나눕니다. 2026년 기준 1구간은 월 194만 8,421원 이하, 5구간은 649만 4,738원 이하입니다." },
  { question: "신입생과 재학생 신청 방법이 다른가요?", answer: "신청 시기와 절차는 유사하지만 신입생은 입학 전 소득 자료가 확정되지 않아 가결정으로 우선 지원받고, 이후 재확정 절차를 거치는 경우가 많습니다. 정확한 절차는 한국장학재단 공지를 확인하세요." },
  { question: "다자녀 가구는 얼마나 더 받나요?", answer: "2026년부터 다자녀 가구는 첫째·둘째 1~3구간 610만 원, 4~8구간 505만 원까지 지원되며 셋째 이상 자녀는 8구간까지 등록금 전액이 지원됩니다." },
  { question: "국가장학금 I유형과 II유형은 뭐가 다른가요?", answer: "I유형은 소득구간에 따라 학생 개인에게 정액 지급되고, II유형은 대학이 등록금 인하·장학금 확충 노력과 연계해 추가로 지원하는 제도로 대학별 지급액이 다릅니다." },
  { question: "9구간, 10구간도 받을 수 있는 지원이 있나요?", answer: "9구간은 연 100만 원(학기당 50만 원)이 지원되며, 다자녀 가구는 8구간까지 확대 지원됩니다. 10구간은 국가장학금 I유형 지원 대상에서 제외됩니다." },
  { question: "2026년 국가장학금 규모는 얼마나 되나요?", answer: "2026년 전체 예산은 역대 최대인 약 5조 1,161억 원, 수혜 인원은 약 150만 명 규모로 확대됐습니다. 1학기에만 108만 명이 2조 2,267억 원을 지원받았습니다." },
  { question: "소득인정액에 재산도 포함되나요?", answer: "네, 부동산·금융재산·자동차 등을 소득으로 환산한 금액이 소득인정액에 포함됩니다. 이 계산기는 월 소득 위주의 단순 추정이라 실제 구간과 차이가 날 수 있습니다." },
  { question: "계산된 예상 지원금으로 등록금 실부담금도 알 수 있나요?", answer: "네, 이 페이지의 예상 지원금을 대학 등록금 계산기의 '연간 장학금' 입력값에 넣으면 4년 실부담금을 함께 확인할 수 있습니다." },
];

export const NS_RELATED_LINKS = [
  { href: "/tools/university-cost-calculator-2026/", label: "대학 등록금 계산기 2026", description: "예상 국가장학금을 반영한 대학 4년 실부담금을 계산합니다." },
  { href: "/reports/youth-savings-comparison-2026/", label: "청년저축 비교 리포트", description: "장학금 외에 활용할 수 있는 청년 금융상품을 비교합니다." },
  { href: "/reports/single-household-living-cost-2026/", label: "1인 가구 생활비 리포트", description: "자취 생활비 항목별 평균을 확인합니다." },
];
```

### 2-4. 페이지 IA

```
Hero (eyebrow: "국가장학금 계산", title: NS_META.title)
InfoNotice (dataNote — 소득인정액 단순 추정 한계 강조)
ToolActionBar (초기화/링크복사)

[aside] 입력 폼
  - 가구원 수: select 2~6인 이상 (표시용, 계산 미반영 — InfoNotice에 명시)
  - 가구 월 소득: 슬라이더+숫자 입력
  - 다자녀 여부: mode-chip 3종(없음/둘째/셋째 이상)
  - 대학 유형: mode-chip 2종(국공립/사립) → 연간 등록금 기본값 갱신
  - 연간 등록금: 자동 채움(대학 유형 기본값) 또는 직접 입력

[본문] 결과 섹션 1: KPI 그리드
  - 예상 지원구간 / 예상 지원금 / 등록금 대비 지원 비율
[본문] 결과 섹션 2: 소득구간 경곗값 표 (NS_INCOME_BRACKETS 전체 노출, 내 구간 하이라이트 — 네이버 스마트블록 대응)
[본문] 결과 섹션 3: 구간별 지원금액표 (NS_SCHOLARSHIP_AMOUNTS, 다자녀 특례 별도 카드)
[본문] 관련 CTA 그리드 (NS_RELATED_LINKS)

SeoContent (introTitle/intro/inputPoints/criteria/faq 8개/related 3개)
```

### 2-5. 스크립트 구조 (`national-scholarship-calculator-2026.js`)

```js
import { readParam, writeParams } from "./url-state.js";

const dataEl = document.getElementById("ns-data"); // NS_INCOME_BRACKETS, NS_SCHOLARSHIP_AMOUNTS, NS_MULTI_CHILD JSON 주입
const { incomeBrackets, scholarshipAmounts, multiChild } = JSON.parse(dataEl.textContent);

function findIncomeBracket(monthlyIncome) {
  const found = incomeBrackets.find((b) => b.monthlyIncomeCap !== null && monthlyIncome <= b.monthlyIncomeCap);
  return found ? found.bracket : 10;
}

// calcNationalScholarship — nationalScholarship2026.ts의 로직과 1:1 대응, 값 변경 시 양쪽 동기화 필수
function calcNationalScholarship(input) {
  const bracket = findIncomeBracket(input.householdMonthlyIncome);
  let annualAmount = scholarshipAmounts.find((r) => bracket >= r.minBracket && bracket <= r.maxBracket)?.annualAmount ?? 0;

  if (input.multiChildStatus === "THIRD_OR_MORE" && bracket <= multiChild.THIRD_OR_MORE.fullTuitionUpToBracket) {
    annualAmount = input.annualTuition;
  } else if (input.multiChildStatus === "SECOND") {
    if (bracket <= 3) annualAmount = multiChild.SECOND.upToBracket3;
    else if (bracket <= 8) annualAmount = multiChild.SECOND.bracket4to8;
  }

  const tuitionCoverageRatio = input.annualTuition > 0
    ? Math.min(Math.round((annualAmount / input.annualTuition) * 100), 100)
    : 0;
  return { bracket, annualAmount, tuitionCoverageRatio };
}
```

---

## 3. 클러스터 내부 링크 맵

### 3-1. 1차 페이지 간 상호 연결

```
university-cost-calculator-2026 (허브)
 └─→ national-scholarship-calculator-2026

national-scholarship-calculator-2026
 └─→ university-cost-calculator-2026 (예상 지원금을 이어서 입력하도록 유도)
```

### 3-2. 기존 사이트 콘텐츠와의 연결

| 클러스터 페이지 | 연결할 기존 페이지 | 연결 이유 |
|---|---|---|
| `university-cost-calculator-2026` | `/reports/single-household-living-cost-2026/` | 자취 생활비 항목별 상세 확인 |
| `university-cost-calculator-2026` | `/reports/youth-savings-comparison-2026/` | 학자금 마련·상환용 청년 금융상품 연결 |
| `national-scholarship-calculator-2026` | `/reports/single-household-living-cost-2026/`, `/reports/youth-savings-comparison-2026/` | 상동 |

### 3-3. 향후 2차 페이지 완성 시 추가할 링크 (지금은 페이지가 없으므로 비워둠)

- `university-cost-calculator-2026` → `dorm-vs-commute-cost-comparison-2026`, `university-tuition-ranking-2026`
- `national-scholarship-calculator-2026` → `student-loan-repayment-calculator-2026`(3차), `university-student-welfare-benefits-2026`(3차)

---

## 4. 등록 체크리스트 (1차 2페이지)

### 4-1. `tools.ts` (2건 추가)

```ts
{
  slug: "university-cost-calculator-2026",
  title: "대학 등록금 계산기 2026",
  description: "등록금·주거비·생활비·통학비 입력하고 장학금 빼면 대학 4년 실제 부담금 바로 계산.",
  order: 72,
  eyebrow: "대학 등록금",
  category: "support",
  badges: ["신규"],
  previewStats: [
    { label: "4년제 평균 등록금", value: "727만" },
    { label: "자취 월세 평균", value: "62만" },
  ],
},
{
  slug: "national-scholarship-calculator-2026",
  title: "국가장학금 계산기 2026",
  description: "가구 소득 입력하면 예상 학자금 지원구간과 국가장학금 지원금 바로 계산.",
  order: 72.1,
  eyebrow: "국가장학금",
  category: "support",
  badges: ["신규"],
  previewStats: [
    { label: "1~3구간 지원", value: "연 600만" },
    { label: "2026 수혜 인원", value: "150만명" },
  ],
},
```

### 4-2. `app.scss` (2건 import)

```scss
@use 'scss/pages/university-cost-calculator-2026';
@use 'scss/pages/national-scholarship-calculator-2026';
```

### 4-3. `sitemap.xml` (2건 추가)

```xml
<url><loc>https://bigyocalc.com/tools/university-cost-calculator-2026/</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
<url><loc>https://bigyocalc.com/tools/national-scholarship-calculator-2026/</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
```

---

## 5. 개발 순서 및 QA 체크리스트

### 5-1. 개발 순서

1. `universityTuition2026.ts`, `universityHousingCost2026.ts` 공용 데이터 파일 먼저 작성 (2차 페이지도 재사용할 자산)
2. `university-cost-calculator-2026` (허브) — 계산 로직, 페이지, 스크립트, 스타일
3. `nationalScholarship2026.ts` 착수 **직전** kosaf.go.kr 원본 페이지에서 지원금액표·가구원수별 경곗값 재검증 (0-7, 2-3의 ⚠️ 항목)
4. `national-scholarship-calculator-2026` — 계산 로직, 페이지, 스크립트, 스타일
5. 두 페이지 상호 `related` 링크 연결 확인

### 5-2. 공통 QA

- [ ] 두 페이지 전부 `SeoContent` intro 4단락·800자 이상, FAQ 8개, related 3개 이상 (발행 전 실측)
- [ ] `SeoContent`의 `faq` prop이 `{ question, answer }` 형태로 전달되는지 확인 (`{ q, a }` 아님)
- [ ] `TUITION_PRESETS`·`RESIDENCE_PRESETS`를 `university-cost-calculator-2026`과 향후 2차 페이지가 동일 참조하도록 export 구조 유지
- [ ] 국가장학금 지원금액표·가구원수별 경곗값은 구현 착수 전 kosaf.go.kr 원본 재대조 완료 여부 확인 — 미완료 시 InfoNotice의 한계 문구를 더 강하게 유지
- [ ] `university-cost-calculator-2026`에서 거주 형태 mode-chip 전환 시 월 주거비·생활비 입력값이 실제로 갱신되는지
- [ ] `national-scholarship-calculator-2026`에서 다자녀 특례(셋째 이상 8구간까지 전액) 토글 시 결과가 실제로 등록금 전액으로 바뀌는지
- [ ] 두 계산기 모두 URL 파라미터로 입력값 복원 가능한지 (`url-state.js`)
- [ ] 모바일에서 입력 폼이 첫 화면 가까이 오는지 (`CODE_SKILL.md` 반응형 기준)
- [ ] TS 데이터 파일의 계산 함수와 `public/scripts/*.js`의 계산 함수가 동일 입력에 동일 결과를 내는지 교차 확인
- [ ] `npm run build` 통과, 2개 라우트 전부 존재 확인

각 페이지 완료 후 실제 빌드·브라우저 확인까지 마치면 `docs/DEPLOY_CHECKLIST.md` 기준으로 배포 점검한다. 2차 3페이지(`dorm-vs-commute-cost-comparison-2026`, `university-tuition-ranking-2026`, `work-study-vs-part-time-comparison-2026`)는 1차 완료 후 별도 설계 문서에서 다룬다.
