# 고3·수험생 비용 콘텐츠 클러스터 2026 — 설계 문서 (1차: 2페이지)

> 기획 원본: [`docs/plan/202607/highschool-exam-cost-content-cluster-2026-plan.md`](../../plan/202607/highschool-exam-cost-content-cluster-2026-plan.md)
> 작성일: 2026-07-15
> 범위: 1차 우선순위 2개(`/tools/`, `SimpleToolShell`) — `retake-exam-cost-calculator-2026`, `college-application-fee-calculator-2026`
> 2차 2개(`retake-vs-college-tuition-2026`, `high-school-private-education-cost-2026`)는 1차 완료 후 별도 설계 문서에서 다룬다.

---

## 0. 공통 설계 원칙

### 0-1. 착수 전 데이터 재확인 완료 (2026-07-15)

기획 문서에서 "2020년 데이터라 낡음, 재확인 필요"로 남겨뒀던 전형료를 이번 설계 단계에서 추가 검색했다.

| 항목 | 확인값 |
|---|---|
| 2026학년도 사립대 중심 전형료 인상률 | 약 9.0% (기숙사비도 4.1% 동반 상승) |
| 대학별 전형료 실제 범위 | 전형·시험 유형에 따라 2만~12만 원대 |
| 2020년 전국 평균(기준값) | 4만 7,806원 |
| 2024학년도 1인당 평균 최고 대학(중앙대) | 10만 5,242원 |

출처: [뉴스1 - "전형료만 100만원" 등록금·기숙사비 동반 인상](https://www.news1.kr/economy/trend/6065494), [한국경제 - 원서 한장당 10만원](https://www.hankyung.com/article/2024091385651), [한국대학신문 - 입학전형료 수입](https://news.unn.net/news/articleView.html?idxno=234286)

**⚠️ 여전히 단일 확정 평균치는 없다.** 2020년 평균(4.78만 원)에 2026학년도 인상률(9.0%)을 단순 반영하면 약 5.2만 원이지만, 이는 근사 추정이지 공식 통계가 아니다. **설계 결론: 저가/평균/고가 3단계 프리셋으로 제시하고 "평균" 프리셋에는 반드시 추정 근거를 라벨링한다** — 시니어 일자리·대학생 클러스터에서 적용한 "확정 안 된 수치는 단정하지 않고 범위/시나리오로 제시" 원칙을 그대로 따른다.

### 0-2. 컴포넌트·재사용 원칙

두 페이지 모두 계산기(`/tools/`, `SimpleToolShell`) — 대학생 클러스터의 `university-cost-calculator-2026` 등과 동일한 파일 구조·컴포넌트 패턴을 그대로 따른다(`SimpleToolShell`/`CalculatorHero`/`InfoNotice`/`ToolActionBar`/`SeoContent`, `mode-chip`/`calc-slider` 입력 패턴, `url-state.js` 상태 저장, TS↔JS 계산 로직 이중 구현).

신규 데이터 재사용 관계는 아직 없다(이 클러스터의 첫 페이지들이라). 다만 2차 `retake-vs-college-tuition-2026`이 이 페이지의 계산 로직과 대학생 클러스터의 `universityTuition2026.ts`를 함께 재사용할 예정이므로, `retake-exam-cost-calculator-2026`의 계산 함수를 다른 파일에서도 import할 수 있게 순수 함수로 분리해둔다.

### 0-3. 대학생 클러스터와의 연결

이미 배포된 대학생 클러스터(`university-cost-calculator-2026` 등)로 CTA를 연결해 "재수 여부를 고민하는 수험생"과 "대학 진학이 확정된 학생" 두 퍼널이 자연스럽게 이어지게 한다.

---

## 1. 페이지 1 — `retake-exam-cost-calculator-2026` (1차 최우선)

### 1-1. 파일 목록

| 역할 | 경로 |
|---|---|
| 데이터 | `src/data/retakeExamCostCalculator2026.ts` |
| 도구 등록 | `src/data/tools.ts` |
| 페이지 | `src/pages/tools/retake-exam-cost-calculator-2026.astro` |
| 스크립트 | `public/scripts/retake-exam-cost-calculator-2026.js` |
| 스타일 | `src/styles/scss/pages/_retake-exam-cost-calculator-2026.scss` |

### 1-2. URL 및 메타

```
슬러그: /tools/retake-exam-cost-calculator-2026/
타이틀: 재수 비용 계산기 2026 | 학원비·생활비 1년 총액 바로 계산
디스크립션: 재수 유형(통학 종합반/기숙학원)과 기간을 입력하면 학원비·특강비를 합산한 1년 총비용을 바로 계산합니다. 대학 등록금과 비교도 가능합니다.
```

### 1-3. 설계 조정 — 기숙학원은 별도 생활비 필드를 두지 않는다

기획 문서 초안은 기숙학원에 "생활비·급식비"를 별도 입력받는 구조였지만, 실제로 확인한 기숙학원 가격(월 300만~400만 원대, 전국 평균 350만 원)은 **숙식이 포함된 통합가**로 보도된다. 별도 생활비 필드를 추가하면 이중 계산이 된다. **설계에서는 통학형·기숙형 모두 "월 수강료(기본값만 다름) + 부대비용(특강·교재·단체복·모의고사 등, 항목별 분리 없이 합계 한 필드)" 2축 구조로 단순화**한다.

### 1-4. 데이터 파일 설계

```ts
export type RetakeType = "COMMUTE" | "BOARDING";

export interface RetakePreset {
  type: RetakeType;
  label: string;
  monthlyTuitionDefault: number;
  extraFeeDefault: number; // 특강·교재비·단체복·모의고사 등 부대비용(기간 총액)
  note: string;
}

// 2026-01 기준 조사 종합
export const RETAKE_PRESETS: RetakePreset[] = [
  {
    type: "COMMUTE",
    label: "통학 종합반(재종반)",
    monthlyTuitionDefault: 2_000_000,
    extraFeeDefault: 10_000_000,
    note: "서울 재종반 월 수강료 200만원대. 교재비·특강비 포함 시 월 300만원 수준(10개월 기준 총 3,000만원대)",
  },
  {
    type: "BOARDING",
    label: "기숙학원",
    monthlyTuitionDefault: 3_500_000,
    extraFeeDefault: 5_000_000,
    note: "전국 평균 월 350만원(2026-01 기준, 숙식 포함 통합가). 선택 특강·모의고사·단체복 등은 별도 청구, 지방생 서울 기숙학원은 월 400만원 초과",
  },
];

export interface RetakeInput {
  type: RetakeType;
  monthlyTuition: number;
  months: number; // 기본 10개월(2~11월)
  extraFee: number;
}

export interface RetakeResult {
  tuitionTotal: number;
  extraTotal: number;
  grandTotal: number;
  monthlyAverage: number;
}

// public/scripts/retake-exam-cost-calculator-2026.js와 1:1 대응 로직 — 값 변경 시 양쪽 동기화 필수
// 2차 retake-vs-college-tuition-2026이 그대로 import해서 재사용할 순수 함수
export function calcRetakeCost(input: RetakeInput): RetakeResult {
  const tuitionTotal = input.monthlyTuition * input.months;
  const extraTotal = input.extraFee;
  const grandTotal = tuitionTotal + extraTotal;
  const monthlyAverage = input.months > 0 ? grandTotal / input.months : 0;
  return { tuitionTotal, extraTotal, grandTotal, monthlyAverage };
}

export const RETAKE_DEFAULT_INPUT: RetakeInput = {
  type: "COMMUTE",
  monthlyTuition: 2_000_000,
  months: 10,
  extraFee: 10_000_000,
};

export const RETAKE_META = {
  slug: "retake-exam-cost-calculator-2026",
  title: "재수 비용 계산기 2026",
  seoTitle: "재수 비용 계산기 2026 | 학원비·생활비 1년 총액 바로 계산",
  seoDescription:
    "재수 유형(통학 종합반/기숙학원)과 기간을 입력하면 학원비·특강비를 합산한 1년 총비용을 바로 계산합니다. 대학 등록금과 비교도 가능합니다.",
  updatedAt: "2026-07-15",
  dataNote:
    "학원비 기본값은 2026년 1월 기준 조사된 통학 재종반·기숙학원 시세를 참고한 값이며, 학원·지역·선택 프로그램에 따라 실제 금액은 크게 달라질 수 있습니다. 이 계산 결과는 예산 계획을 위한 참고 자료입니다.",
};
```

### 1-5. 페이지 IA

```
Hero + InfoNotice (dataNote)
ToolActionBar

[aside] 재수 유형 mode-chip 2종(통학 종합반/기숙학원) → 월 수강료·부대비용 기본값 자동 갱신
[aside] 월 수강료(슬라이더), 재수 기간(월, 기본 10개월), 부대비용(슬라이더)

[본문] 결과 KPI: 학원비 총액 / 부대비용 총액 / 1년 총비용 / 월평균
[본문] 유형별 비용 구조 참고표(RETAKE_PRESETS 그대로 노출 — 통학 vs 기숙 나란히 비교)
[본문] CTA — "이 비용, 대학 등록금과 비교하면?" → `university-cost-calculator-2026`, `college-application-fee-calculator-2026`

SeoContent (intro 4단락/faq 6개/related 3개)
```

### 1-6. FAQ (6개)

1. **재수학원 기숙형과 통학형 중 뭐가 더 비싼가요?** — 기숙학원이 더 비쌉니다. 통학 재종반은 10개월 기준 약 3,000만 원대인 반면, 기숙학원은 전국 평균 월 350만 원 기준으로도 10개월이면 4,000만 원 안팎입니다.
2. **재수 1년에 진짜 4,000만 원까지 드나요?** — 기숙학원을 선택하고 특강·모의고사 등 부대비용을 더하면 4,000만 원 안팎이 될 수 있습니다. 통학형은 이보다 낮은 3,000만 원대가 일반적입니다.
3. **기숙학원비에 숙식비가 포함돼 있나요?** — 네, 기숙학원의 월 비용은 보통 수업료와 숙식비가 통합된 가격입니다. 선택 특강, 모의고사, 단체복 등만 별도로 청구됩니다.
4. **지방에서 서울로 재수학원 다니면 얼마나 더 드나요?** — 지방 학생이 서울 기숙학원을 선택하면 월 비용이 400만 원을 넘는 경우가 많아 지역 기숙학원보다 부담이 커집니다.
5. **독학재수(독학기숙학원)도 이 계산기에 포함되나요?** — 독학기숙학원은 상대적으로 저렴한 편(월 230만 원대~)이라 기숙학원 유형의 월 수강료를 직접 낮춰 입력하면 근사할 수 있지만, 정확한 산정은 아닙니다.
6. **재수 비용과 대학 4년 등록금 중 뭐가 더 큰가요?** — 재수 1년 비용(3,000만~4,000만 원대)이 국공립대 4년 등록금(약 1,700만 원)보다 큰 경우가 많고, 사립대 4년 등록금(약 3,300만 원)과는 비슷하거나 더 클 수 있습니다. 대학 등록금 계산기에서 직접 비교해보세요.

---

## 2. 페이지 2 — `college-application-fee-calculator-2026` (1차)

### 2-1. 파일 목록

| 역할 | 경로 |
|---|---|
| 데이터 | `src/data/collegeApplicationFeeCalculator2026.ts` |
| 도구 등록 | `src/data/tools.ts` |
| 페이지 | `src/pages/tools/college-application-fee-calculator-2026.astro` |
| 스크립트 | `public/scripts/college-application-fee-calculator-2026.js` |
| 스타일 | `src/styles/scss/pages/_college-application-fee-calculator-2026.scss` |

### 2-2. URL 및 메타

```
슬러그: /tools/college-application-fee-calculator-2026/
타이틀: 대입 원서비 계산기 2026 | 수시·정시 전형료 총액 바로 계산
디스크립션: 수시·정시 지원 개수와 대학별 전형료 구간을 입력하면 원서비 총액을 바로 계산합니다. 최대 수시 6개·정시 3개 기준.
```

### 2-3. 데이터 파일 설계

```ts
export type FeeTier = "LOW" | "AVERAGE" | "HIGH";

export interface FeeTierPreset {
  tier: FeeTier;
  label: string;
  feePerApplication: number;
  note: string;
}

// 0-1 확인값 종합 — 단일 확정 평균 없어 3단계 프리셋으로 제시
export const FEE_TIER_PRESETS: FeeTierPreset[] = [
  { tier: "LOW", label: "저가", feePerApplication: 30_000, note: "국공립대·서류전형 위주는 2만~3만원대가 일반적" },
  { tier: "AVERAGE", label: "평균(추정)", feePerApplication: 52_000, note: "2020년 전국 평균 4만 7,806원에 2026학년도 사립대 중심 인상률(약 9.0%) 반영 추정치" },
  { tier: "HIGH", label: "고가", feePerApplication: 105_000, note: "2024학년도 중앙대 1인당 평균 10만 5,242원 등 주요 사립대·실기 전형 사례" },
];

export const MAX_SUSI_COUNT = 6;
export const MAX_JEONGSI_COUNT = 3;

export interface AppFeeInput {
  susiCount: number;
  susiFee: number; // 프리셋 선택 또는 자유 입력
  jeongsiCount: number;
  jeongsiFee: number;
}

export interface AppFeeResult {
  susiTotal: number;
  jeongsiTotal: number;
  grandTotal: number;
}

// public/scripts/college-application-fee-calculator-2026.js와 1:1 대응
export function calcApplicationFee(input: AppFeeInput): AppFeeResult {
  const susiTotal = input.susiFee * input.susiCount;
  const jeongsiTotal = input.jeongsiFee * input.jeongsiCount;
  return { susiTotal, jeongsiTotal, grandTotal: susiTotal + jeongsiTotal };
}

export const APP_FEE_DEFAULT_INPUT: AppFeeInput = {
  susiCount: 6,
  susiFee: 52_000,
  jeongsiCount: 3,
  jeongsiFee: 52_000,
};

export const APP_FEE_META = {
  slug: "college-application-fee-calculator-2026",
  title: "대입 원서비 계산기 2026",
  seoTitle: "대입 원서비 계산기 2026 | 수시·정시 전형료 총액 바로 계산",
  seoDescription:
    "수시·정시 지원 개수와 대학별 전형료 구간을 입력하면 원서비 총액을 바로 계산합니다. 최대 수시 6개·정시 3개 기준.",
  updatedAt: "2026-07-15",
  dataNote:
    "전형료는 2020년 전국 평균(4만 7,806원)에 2026학년도 사립대 중심 인상률(약 9.0%)을 반영한 추정치이며, 대학·전형 유형별로 2만~12만원대까지 편차가 큽니다. 정확한 금액은 각 대학 모집요강에서 확인하세요.",
};
```

### 2-4. 페이지 IA

```
Hero + InfoNotice (dataNote — 추정치 편차 경고 강조)
ToolActionBar

[aside] 수시 지원 개수(슬라이더 0~6) + 전형료 구간 mode-chip 3종(저가/평균/고가) + 자유 입력
[aside] 정시 지원 개수(슬라이더 0~3) + 전형료 구간 mode-chip 3종 + 자유 입력

[본문] 결과 KPI: 수시 원서비 총액 / 정시 원서비 총액 / 원서비 총합
[본문] 전형료 구간표(FEE_TIER_PRESETS 그대로 노출, 근거 명시)
[본문] 2026학년도 대입 일정 카드(수시 9월 8~12일, 정시 12월 29~31일)
[본문] CTA → `retake-exam-cost-calculator-2026`, `university-cost-calculator-2026`

SeoContent (intro 4단락/faq 5개/related 3개)
```

### 2-5. FAQ (5개)

1. **수시는 몇 개까지 지원할 수 있나요?** — 최대 6개입니다. 수시 원서를 6개 모두 접수하면 전형료 총합이 가장 커집니다.
2. **정시는 몇 개까지 지원할 수 있나요?** — 가/나/다군 기준 최대 3개입니다.
3. **전형료가 가장 비싼 대학은 얼마나 하나요?** — 2024학년도 기준 중앙대가 1인당 평균 10만 5,242원으로 가장 높았습니다. 실기 전형은 12만 원대까지도 나옵니다.
4. **왜 전형료가 저가/평균/고가로 나뉘어 있나요?** — 국공립대 서류전형은 2만~3만 원대, 사립대·실기 포함 전형은 10만 원 이상까지 편차가 커서 단일 평균 대신 3단계로 제시합니다.
5. **수시 6개를 전부 최상위권 대학에 넣으면 얼마나 드나요?** — 고가 구간(10만 원대)으로 6개를 지원하면 60만 원 안팎까지 나올 수 있습니다. 실제로 최고가 대학 위주로 지원한 사례에서 46만 원대가 보도된 바 있습니다.

---

## 3. 클러스터 내부 링크 맵

### 3-1. 1차 페이지 간 상호 연결

```
retake-exam-cost-calculator-2026 ←→ college-application-fee-calculator-2026
```

### 3-2. 대학생 클러스터와의 연결 (양방향)

| 이 클러스터 페이지 | 연결할 대학생 클러스터 페이지 | 연결 이유 |
|---|---|---|
| `retake-exam-cost-calculator-2026` | `/tools/university-cost-calculator-2026/` | 재수 비용과 대학 4년 실부담금 비교 유도 |
| `college-application-fee-calculator-2026` | `/tools/university-cost-calculator-2026/` | 원서비 확인 후 자연스럽게 등록금 계산으로 이어짐 |

### 3-3. 기존 사이트 콘텐츠와의 연결

| 이 클러스터 페이지 | 연결할 기존 페이지 | 연결 이유 |
|---|---|---|
| `retake-exam-cost-calculator-2026` | `/tools/child-tutoring-cost-calculator/` | 사교육비 계산기와 같은 학부모 타깃, 재수 결정 전 참고 |

**2차 배포 후 반드시 처리**: `retake-vs-college-tuition-2026` 완성 시 두 1차 페이지의 related 링크에 추가한다.

---

## 4. 등록 체크리스트

### 4-1. `tools.ts` (2건 추가)

```ts
{
  slug: "retake-exam-cost-calculator-2026",
  title: "재수 비용 계산기 2026",
  description: "재수 유형·기간 입력하면 학원비·부대비용 합산한 1년 총비용 바로 계산.",
  order: 72.4,
  eyebrow: "재수 비용",
  category: "support",
  badges: ["신규"],
  previewStats: [
    { label: "기숙학원 평균", value: "월 350만" },
    { label: "통학 재종반", value: "월 200만~" },
  ],
},
{
  slug: "college-application-fee-calculator-2026",
  title: "대입 원서비 계산기 2026",
  description: "수시·정시 지원 개수와 전형료 구간 입력하면 원서비 총액 바로 계산.",
  order: 72.5,
  eyebrow: "대입 원서비",
  category: "support",
  badges: ["신규"],
  previewStats: [
    { label: "수시 최대", value: "6개" },
    { label: "정시 최대", value: "3개" },
  ],
},
```

### 4-2. `src/pages/index.astro`, `src/pages/tools/index.astro`의 slug→카테고리 맵 (각 2건 추가) ★ 필수

> **주의**: 대학생 클러스터 배포 때 이 두 파일의 독립적인 `topicBySlug`/카테고리 맵에 슬러그를 등록하지 않아 "기타"로 표시되는 버그가 실제로 발생했다(1차 최종 점검에서 발견·수정). 이번에도 반드시 두 파일 모두에 등록한다.

```ts
// src/pages/tools/index.astro의 topicBySlug, src/pages/index.astro의 topicBySlug 둘 다
"retake-exam-cost-calculator-2026": "복지·지원금",
"college-application-fee-calculator-2026": "복지·지원금",
```

### 4-3. `app.scss` (2건 import)

```scss
@use 'scss/pages/retake-exam-cost-calculator-2026';
@use 'scss/pages/college-application-fee-calculator-2026';
```

### 4-4. `sitemap.xml` (2건 추가)

```xml
<url><loc>https://bigyocalc.com/tools/retake-exam-cost-calculator-2026/</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
<url><loc>https://bigyocalc.com/tools/college-application-fee-calculator-2026/</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
```

---

## 5. 개발 순서 및 QA 체크리스트

### 5-1. 개발 순서

1. `retake-exam-cost-calculator-2026` — 계산 로직을 순수 함수로 분리(2차 재사용 대비)
2. `college-application-fee-calculator-2026`
3. 두 페이지 상호 링크 + 대학생 클러스터(`university-cost-calculator-2026`) 링크 연결

### 5-2. 공통 QA

- [ ] 두 페이지 전부 `SeoContent` intro 4단락·800자 이상, FAQ 5개 이상, related 3개 이상
- [ ] **`src/pages/index.astro`, `src/pages/tools/index.astro` 양쪽 `topicBySlug`에 두 슬러그 모두 등록 확인** (기타 표시 버그 재발 방지, 4-2 참고)
- [ ] `retake-exam-cost-calculator-2026`에서 재수 유형 전환 시 월 수강료·부대비용 기본값이 실제로 갱신되는지
- [ ] 기숙학원 유형에서 별도 생활비 필드 없이 통합가로만 계산되는지(1-3 설계 조정 반영 확인)
- [ ] `college-application-fee-calculator-2026`에서 수시 6개/정시 3개 상한이 슬라이더에 반영되는지
- [ ] 두 계산기 모두 URL 파라미터로 입력값 복원 가능한지
- [ ] `npm run build` 통과, 2개 라우트 전부 존재 확인

배포 전 `DEPLOY_CHECKLIST.md` 기준 최종 점검(특히 카테고리 매핑 항목). 2차 페이지(`retake-vs-college-tuition-2026`, `high-school-private-education-cost-2026`)는 1차 완료 후 별도 설계 문서에서 다룬다.
