# 설계 문서
## 2026 부동산 세제개편안 8·3 발표 총정리

> **[미채택 — 2026-08-05] 구현 후 롤백됨.** 이 설계대로 구현했으나, 기존 `real-estate-tax-reform-2026`과 내용이 70% 이상 중복된다고 판단해 신규 페이지를 삭제하고 기존 페이지로 통합했다. §12에서 이미 이 리스크를 지적했으나 실제 구현·비교 후에야 중복도가 예상보다 크다는 것이 드러났다 — 다음에는 §3 차별화 표만으로 판단하지 말고 실제 데이터 초안을 나란히 놓고 겹치는 비율을 먼저 가늠해볼 것.
>
> 기획 원본: `docs/plan/202608/real-estate-tax-reform-announcement-2026-plan.md`
> 신규 구현 페이지: `/reports/real-estate-tax-reform-announcement-2026/`
> 설계 목적: 2026-08-03 발표된 부동산 세제개편안(종부세 기본공제·세율·공정시장가액비율, 장기보유특별공제 거주 중심 개편, 다주택 양도세 한시 완화)을 배경→조항별 상세→유형별 영향→시장 전망 순서로 읽는 서사형 총정리 리포트로 정리하고, 기존 비교표 리포트·계산기로 연결한다.
> 착수 범위: 이번 착수는 이 리포트 1개만 진행한다. 신규 계산기는 만들지 않는다(기획서 §0, 기존 계산기 재사용).
> 역할 분리: 기존 `/reports/real-estate-tax-reform-2026/`(비교표+계산기 연동)과 콘텐츠가 겹치지 않도록, 이 페이지는 기사형 총정리 스타일을 유지한다(기획서 §3).

---

## 0. 구현 개요

| 항목 | 값 |
|---|---|
| slug | `real-estate-tax-reform-announcement-2026` |
| 페이지 경로 | `src/pages/reports/real-estate-tax-reform-announcement-2026.astro` |
| 데이터 파일 | `src/data/realEstateTaxReformAnnouncement2026.ts` |
| SCSS | `src/styles/scss/pages/_real-estate-tax-reform-announcement-2026.scss` |
| SCSS prefix | `.rtra` |
| 데이터 export prefix | `RTRA_*` (기존 `realEstateTaxReform2026.ts`의 `RTR_*`와 이름 충돌 방지) |
| 스크립트 | 없음. MVP는 정적 리포트(선택 인터랙션 없음) |
| 콘텐츠 유형 | `/reports/` 시의성 정책 리포트, 서사형 총정리 (`REPORT_CONTENT_GUIDE.md` 기준) |
| 홈 카테고리 | `estate` (부동산) |
| 주요 CTA | `/reports/real-estate-tax-reform-2026/`(비교표), `/tools/apartment-holding-tax/`, `/tools/capital-gains-tax-calculator/`, `/reports/multi-house-tax-2026/` |
| 등록 필요 | `src/data/reports.ts`, `src/pages/index.astro`(`reportMetaBySlug`), `public/sitemap.xml`, `src/styles/app.scss` |
| 빌드 확인 | 구현 후 `npm run build` 필수 |
| 착수 전 필수 확인 | 기획서 §2-1의 PwC 삼일회계법인 출처 원문 대조. 접속 불가 시 재정경제부 문답자료·뉴시스로 대체 |
| 개인화 제거 확인 | 원안(사용자 제공 노트)의 특정 개인 지칭·평형·매수 계획 언급을 전부 §3-6 유형별 카드로 대체(기획서 §2-2) |
| 갱신 트리거 | 국회 제출·통과·시행 단계 진행 시 이 페이지 데이터 갱신 (§11 참고) — 새 slug 만들지 않음 |

---

## 1. 제품 방향

### 1-1. 페이지 한 줄 정의

`2026-08-03 발표된 부동산 세제개편안 전체를 배경부터 시장 전망까지 한 번에 읽는 총정리 리포트. 비교표·계산기가 필요하면 기존 real-estate-tax-reform-2026과 계산기로 연결한다.`

### 1-2. 사용자가 얻는 것

- "8월 3일 발표에서 정확히 뭐가 바뀌었는지"를 처음부터 끝까지 읽고 이해
- 종부세·양도세 각 조항이 왜 바뀌는지, 어떤 문제의식에서 나왔는지 맥락 파악
- 자신의 유형(실거주 1주택·비거주 1주택·다주택자 등)에서 무엇을 확인해야 하는지 체크리스트로 확인
- 단기·중장기 시장에 어떤 영향이 예상되는지 균형 잡힌 전망 확인
- 확인 후 실제 숫자가 궁금하면 비교표 리포트·계산기로 바로 이동

### 1-3. 피해야 할 것 (기획서 §2-2, §2-3 그대로 적용)

- "확정된 세법", "반드시 이렇게 시행된다" 등 국회 통과 전임을 흐리는 단정 표현
- 특정 개인을 지칭하는 표현(닉네임, 특정 평형, 특정 매수 계획 언급) — 반드시 유형별 일반화 시나리오로 전환
- 시장 전망을 한쪽으로만 단정("갭투자가 반드시 늘어난다", "무조건 매도해야 한다")
- 기존 `real-estate-tax-reform-2026`과 동일한 비교표를 그대로 복제하는 것 — 이 페이지는 서사형 상세 설명과 시장 전망에 집중하고, 수치 비교는 §4-9 CTA로 유도

---

## 2. SEO 설계

### 2-1. 메타

```ts
export const RTRA_META = {
  slug: "real-estate-tax-reform-announcement-2026",
  title: "2026 부동산 세제개편안 총정리",
  description:
    "정부가 2026년 8월 3일 발표한 부동산 세제개편안을 배경부터 시장 전망까지 정리했습니다. 종부세 기본공제·세율, 양도세 장기보유특별공제·다주택 완화까지 유형별 영향을 확인하세요.",
  seoTitle: "2026 부동산 세제개편안 총정리 | 종부세·양도세 뭐가 달라지나",
  seoDescription:
    "정부가 2026년 8월 3일 발표한 부동산 세제개편안을 한 번에 정리했습니다. 종부세 기본공제·공정시장가액비율, 양도세 장기보유특별공제·다주택 중과 완화까지 유형별 영향과 시장 전망을 확인하세요.",
  updatedAt: "2026-08-05",
  policyStatus: "GOVERNMENT_ANNOUNCED" as const,
  policyStatusLabel: "정부 세제개편안 발표",
  nextMilestone:
    "종합부동산세법·소득세법 등 관련 세법 개정안이 국회에 제출되어 심의·의결 절차를 거칠 예정 (법안별 시행 시기 상이)",
  dataNote:
    "이 페이지는 2026년 8월 3일 정부가 발표한 세제개편안(정부안)을 뉴시스·재정경제부 문답자료·이데일리·KDI·연합뉴스 등 공식·언론 보도를 바탕으로 정리한 총정리 자료입니다. 아직 국회를 통과한 확정 법률이 아니므로, 심의 과정에서 세율·공제금액·시행일이 바뀔 수 있습니다.",
};
```

CLAUDE.md 정보성 리포트 타이틀 공식(`{주제} {연도} 완전 정리 | {핵심 궁금증}`)을 적용한다. 기존 `real-estate-tax-reform-2026`의 타이틀("2026 부동산 세제개편안 발표 | 종부세·장특공제 확정 내용")과 겹치지 않도록 "총정리"와 "뭐가 달라지나"라는 표현을 사용해 정보 탐색형 검색을 겨냥한다(기획서 §3).

### 2-2. H1 및 Hero

```astro
<CalculatorHero
  eyebrow="부동산 세금 총정리"
  title={RTRA_META.title}
  description="정부가 8월 3일 발표한 부동산 세제개편안을 배경부터 시장 전망까지 한 번에 정리했습니다. 아직 국회 통과 전 정부안입니다."
  badges={["정부 세제개편안 발표", "8월 3일 발표", "종부세·양도세", "총정리"]}
/>
```

### 2-3. H2 구조 (검색 의도·읽기 순서)

1. `8월 3일, 정부가 부동산 세제개편안을 발표했습니다`
2. `한눈에 보는 핵심 변화`
3. `종합부동산세, 무엇이 바뀌나`
4. `양도소득세, '보유'에서 '거주'로`
5. `다주택자 양도세, 2027~2028년 한시 완화`
6. `나는 어디에 해당하나 — 유형별 영향`
7. `시장에는 어떤 영향이 예상되나`
8. `앞으로 어떻게 진행되나 — 시행 절차`
9. `숫자로 직접 확인하고 싶다면`
10. `2026 부동산 세제개편안 FAQ`

### 2-4. 키워드 매핑

| 키워드 | 노출 위치 |
|---|---|
| 2026 부동산 세제개편안 총정리 | title, H1, 첫 H2, FAQ |
| 8월 3일 세제개편 | Hero description, 첫 섹션 |
| 종부세 기본공제 14억 | 종부세 상세 섹션, 유형별 영향, FAQ |
| 장기보유특별공제 거주 | 양도세 상세 섹션, FAQ |
| 다주택 양도세 완화 | 다주택 섹션, 유형별 영향, FAQ |
| 실거주 1주택 세금 | 유형별 영향 섹션, FAQ |
| 부동산 세제개편 전망 | 시장 전망 섹션 |

---

## 3. 데이터 파일 설계

파일: `src/data/realEstateTaxReformAnnouncement2026.ts`

### 3-1. 상수 구조

```ts
export const RTRA_META = { ... };                          // §2-1
export const RTRA_TIMELINE: TimelineStep[] = [ ... ];       // §3-2 (기존 타입 재사용)
export const RTRA_SUMMARY_TABLE: SummaryRow[] = [ ... ];    // §3-3
export const RTRA_TAX_DETAILS: DetailCard[] = [ ... ];      // §3-4
export const RTRA_TRANSFER_DETAILS: DetailCard[] = [ ... ]; // §3-4 (동일 타입 재사용)
export const RTRA_MULTI_HOUSE_RELIEF: ReliefRow[] = [ ... ];// §3-5
export const RTRA_IMPACT_CARDS: ImpactCard[] = [ ... ];     // §3-6
export const RTRA_MARKET_OUTLOOK: OutlookGroup[] = [ ... ]; // §3-7
export const RTRA_FAQ: FaqItem[] = [ ... ];                 // §7
export const RTRA_RELATED_LINKS: RelatedLink[] = [ ... ];   // §8-1
export const RTRA_SOURCE_TABLE: SourceTableRow[] = [ ... ]; // §3-8
```

### 3-2. 타임라인 타입 (`realEstateTaxReform2026.ts`의 `PolicyStatus`/`TimelineStep`과 동일 구조, 별도 export)

```ts
export type PolicyStatus =
  | "RUMOR"
  | "GOVERNMENT_REVIEW"
  | "GOVERNMENT_ANNOUNCED"
  | "BILL_SUBMITTED"
  | "ASSEMBLY_PASSED"
  | "EFFECTIVE";

export type TimelineStep = {
  status: PolicyStatus;
  label: string;
  dateLabel: string;
  isCurrent: boolean;
  isDone: boolean;
};

export const RTRA_TIMELINE: TimelineStep[] = [
  { status: "GOVERNMENT_REVIEW", label: "정부·전문가 의견수렴", dateLabel: "2026년 7월", isCurrent: false, isDone: true },
  { status: "GOVERNMENT_REVIEW", label: "대통령 주재 종합토론회", dateLabel: "2026년 7월 23일", isCurrent: false, isDone: true },
  { status: "GOVERNMENT_ANNOUNCED", label: "정부 세제개편안 발표", dateLabel: "2026년 8월 3일", isCurrent: true, isDone: true },
  { status: "BILL_SUBMITTED", label: "관련 세법 개정안 국회 제출", dateLabel: "일정 미정", isCurrent: false, isDone: false },
  { status: "ASSEMBLY_PASSED", label: "국회 심의·의결", dateLabel: "일정 미정", isCurrent: false, isDone: false },
  { status: "EFFECTIVE", label: "시행", dateLabel: "2027~2029년 항목별 단계 시행 거론", isCurrent: false, isDone: false },
];
```

### 3-3. 한눈에 보는 핵심 변화표 (기획서 §4-1)

```ts
export type SummaryRow = {
  id: string;
  category: string;
  before: string;
  after: string;
  impact: string;
};

export const RTRA_SUMMARY_TABLE: SummaryRow[] = [
  { id: "tax-base", category: "종부세 기준", before: "주택 수에 따라 세율 차등", after: "주택가액(합산 공시가격) 중심으로 일원화", impact: "저가 다주택자는 일부 유리" },
  { id: "one-house-deduction", category: "1주택 종부세 공제", before: "공시가격 12억 원", after: "실거주 14억, 비거주 9억", impact: "실거주 1주택 우대" },
  { id: "fair-market-ratio", category: "종부세 공정시장가액비율", before: "60%", after: "일반 70%, 3주택+·일부 조정지역 80%", impact: "고가·다주택 보유세 증가" },
  { id: "tax-rate", category: "종부세 세율 (6~12억 구간)", before: "1.0%", after: "1.3%", impact: "초고가 주택 부담 증가" },
  { id: "long-term-deduction", category: "양도세 장기보유공제", before: "보유+거주 각 연4%, 최대 80%", after: "거주 중심 연8%, 최대 80% (공제한도 신설)", impact: "실거주 안 하면 불리" },
  { id: "multi-house-surcharge", category: "다주택 양도세", before: "기본세율 +20~30%p", after: "2027~2028년 한시 완화(+5~15%p)", impact: "다주택자 매도 기회" },
  { id: "long-residence-deduction", category: "10년 실거주 1주택 기본공제", before: "연 250만 원", after: "최대 2,500만 원", impact: "장기 실거주자 혜택 확대" },
];
```

### 3-4. 조항별 상세 카드 (종부세 / 양도세 공용 타입)

```ts
export type DetailCard = {
  id: string;
  title: string;
  body: string;
  sourceLabel: string;
  sourceUrl: string;
};

export const RTRA_TAX_DETAILS: DetailCard[] = [
  {
    id: "tax-base-detail",
    title: "주택 수 기준 사실상 폐지",
    body: "지금까지는 같은 가격의 주택을 보유해도 1주택인지 2·3주택인지에 따라 세율이 달랐습니다. 개편안은 주택 수보다 보유 주택의 합산 공시가격과 실제 거주 여부를 기준으로 삼습니다. 정부는 이를 '주택 수 기준에서 가액 기준으로 과세체계를 정상화하는 것'으로 설명합니다.",
    sourceLabel: "뉴시스 · 2026 세제개편안 발표 (2026-08-03)",
    sourceUrl: "https://www.newsis.com/view/NISX20260803_0003733454",
  },
  {
    id: "one-house-deduction-detail",
    title: "1세대 1주택 종부세 기본공제 — 실거주 14억 vs 비거주 9억",
    body: "실제 거주하는 1주택은 기본공제가 12억 원에서 14억 원으로 늘어나지만, 전세를 주거나 비워둔 비거주 1주택은 오히려 9억 원으로 줄어듭니다. 공시가격 14억 원은 지역과 공시가격 현실화율에 따라 다르지만 시세로 20억 원 안팎에 해당할 수 있습니다. 실무적으로는 실제 입주일과 전입신고일을 명확히 관리하는 것이 중요해집니다.",
    sourceLabel: "이데일리 · 세제개편안 보도 (2026-08-04)",
    sourceUrl: "https://www.edaily.co.kr/News/Read?mediaCodeNo=257&newsId=06172966645544040",
  },
  {
    id: "fair-market-ratio-detail",
    title: "공정시장가액비율 인상 — 60% → 70~80%",
    body: "종부세 계산 시 공시가격 전체가 아니라 일정 비율(공정시장가액비율)만 과세표준에 반영합니다. 일반 주택은 70%, 3주택 이상 또는 일부 조정대상지역 보유자는 최대 80%가 적용됩니다. 비율이 오르면 공시가격이 그대로여도 과세표준과 종부세가 늘어납니다.",
    sourceLabel: "뉴시스 · 2026 세제개편안 발표 (2026-08-03)",
    sourceUrl: "https://www.newsis.com/view/NISX20260803_0003733454",
  },
  {
    id: "tax-rate-detail",
    title: "고가주택 종부세율 인상",
    body: "과세표준 6억~12억 원 구간 세율이 1.0%에서 1.3%로 오릅니다. 정부 설명상 대략 시가 20억 원 안팎부터 종부세 과세 대상이 될 수 있고, 시가 32억 원 수준부터 이번 세율 인상의 영향을 받을 수 있습니다. 반면 30억 원 이하 실거주 1주택자는 기본공제 확대 효과로 부담이 제한될 수 있습니다.",
    sourceLabel: "뉴시스 · 2026 세제개편안 발표 (2026-08-03)",
    sourceUrl: "https://www.newsis.com/view/NISX20260803_0003733454",
  },
];

export const RTRA_TRANSFER_DETAILS: DetailCard[] = [
  {
    id: "long-term-deduction-detail",
    title: "장기보유특별공제 — 보유 중심에서 거주 중심으로",
    body: "지금까지는 실거주 없이 오래 보유하기만 해도 공제를 받을 수 있어 전세를 준 장기보유 고가주택도 상당한 공제를 받는 경우가 있었습니다. 개편안은 단순 보유기간 공제(연 4%)를 축소·폐지하는 방향이고, 실제 거주기간 공제는 연 8%·최대 80%로 확대합니다. 소득세법 개정이 필요한 사안이라 국회 심의를 거쳐야 확정됩니다.",
    sourceLabel: "재정경제부 · 2026년 세제개편안 문답자료 (2026-08-03)",
    sourceUrl: "https://mofe.go.kr/com/cmm/fms/FileDown.do?atchFileId=ATCH_000000000032335&fileSn=8",
  },
  {
    id: "deduction-cap-detail",
    title: "공제금액 한도 신설 — 2028년 20억, 2029년 10억",
    body: "지금까지는 장기보유특별공제 금액에 별도 절대 한도가 없어 초고가 주택일수록 공제금액이 커질 수 있었습니다. 개편안은 공제금액 상한을 2028년 최대 20억 원, 2029년 이후 최대 10억 원으로 설정합니다. 수십억 원의 양도차익이 나는 초고가 주택은 실거주 기간이 길어도 공제금액이 제한될 수 있습니다.",
    sourceLabel: "다음(언론사 종합) · 2026 세제개편안 양도세 정리 (2026-08-03)",
    sourceUrl: "https://v.daum.net/v/11aes1tW5L",
  },
  {
    id: "long-residence-deduction-detail",
    title: "10년 실거주 1주택 기본공제 확대 — 250만 원 → 최대 2,500만 원",
    body: "1세대 1주택, 10년 이상 실제 거주, 양도가액 30억 원 이하 조건을 모두 충족하면 양도소득 기본공제가 연 250만 원에서 최대 2,500만 원으로 늘어납니다. 다만 이는 양도차익 전체를 비과세한다는 뜻이 아니라, 과세대상 양도소득에서 차감하는 기본공제 금액입니다.",
    sourceLabel: "KDI 경제정보센터 · 2026 세제개편안 (2026-08-04)",
    sourceUrl: "https://eiec.kdi.re.kr/policy/callDownload.do?dtime=20260804151021&filenum=3&num=285041",
  },
];
```

> `RTRA_TAX_DETAILS`·`RTRA_TRANSFER_DETAILS`는 이미 `real-estate-tax-reform-2026.ts`의 `RTR_REVIEW_ITEMS`에 등록된 것과 같은 사실을 다루지만, 표 형태가 아니라 문단형 해설 카드로 재구성한다(기획서 §3 차별화). 출처 URL은 기존 리포트에 등록된 것을 그대로 재사용해 사실 불일치가 생기지 않게 한다.

### 3-5. 다주택 양도세 중과 한시 완화표

```ts
export type ReliefRow = {
  period: string;
  twoHouseRate: string;
  threePlusRate: string;
  note: string;
};

export const RTRA_MULTI_HOUSE_RELIEF: ReliefRow[] = [
  { period: "현재 (2026-05-09 재시행)", twoHouseRate: "+20%p", threePlusRate: "+30%p", note: "조정대상지역 기준" },
  { period: "2027년 (한시 완화)", twoHouseRate: "+5%p", threePlusRate: "+10%p", note: "개편안 — 국회 통과 필요" },
  { period: "2028년 (한시 완화)", twoHouseRate: "+10%p", threePlusRate: "+15%p", note: "개편안 — 국회 통과 필요" },
  { period: "2029년 이후 (원상복귀 예정)", twoHouseRate: "+20%p", threePlusRate: "+30%p", note: "개편안 — 국회 통과 필요" },
];

export const RTRA_MULTI_HOUSE_NOTE =
  "정부는 보유세를 강화하면서 다주택자가 주택을 처분할 수 있도록 2027~2028년 2년간 양도세 중과를 한시적으로 낮추는 방안을 함께 발표했습니다. 2026년 5월 9일부터 이미 중과가 재시행된 상태이며, 이 개편안이 국회를 통과하면 2027년부터 중과 폭이 다시 낮아지는 구조입니다.";
```

### 3-6. 유형별 영향 카드 (기획서 §4-2, 개인화 제거·일반화)

```ts
export type ImpactDirection = "영향 제한 가능" | "부담 증가 가능" | "기준에 따라 다름" | "매도 기회 확인";

export type ImpactCard = {
  id: string;
  title: string;
  direction: ImpactDirection;
  summary: string;
  checkPoint: string;
};

export const RTRA_IMPACT_CARDS: ImpactCard[] = [
  {
    id: "resident-one-house-buyer",
    title: "실거주 목적으로 1주택을 매수·보유 예정인 경우",
    direction: "영향 제한 가능",
    summary: "종부세 기본공제가 12억 원에서 14억 원으로 확대돼 대체로 불리하지 않습니다. 10년 이상 실거주하면 종부세·양도세 양쪽에서 우대를 받을 수 있습니다.",
    checkPoint: "실제 입주일·전입신고일을 매매계약서, 전입세대확인서, 관리비·전기 사용내역으로 증빙할 수 있게 관리하세요.",
  },
  {
    id: "mid-size-apartment-resident",
    title: "수도권 중형 평형 구축 아파트에 실거주 중인 경우",
    direction: "영향 제한 가능",
    summary: "공시가격이 14억 원 미만이면 종부세 영향이 거의 없을 수 있습니다. 다만 지역·연식에 따라 공시가격이 이미 높은 경우는 별도 확인이 필요합니다.",
    checkPoint: "본인 아파트의 2026년 공시가격을 먼저 확인하고 14억 원 기준과 비교하세요.",
  },
  {
    id: "non-resident-one-house",
    title: "전세를 주거나 비워둔 1주택자",
    direction: "부담 증가 가능",
    summary: "종부세 기본공제가 9억 원으로 줄고, 장기보유특별공제도 거주기간 공제를 받기 어려워집니다. 같은 1주택자라도 실거주 여부에 따라 세 부담이 크게 갈릴 수 있습니다.",
    checkPoint: "매도 전 실거주 전환 여부와 남은 보유·거주 기간을 함께 계산해보세요.",
  },
  {
    id: "additional-investment",
    title: "추가 주택 투자를 고려 중인 경우",
    direction: "기준에 따라 다름",
    summary: "주택 수 중과는 완화되지만 합산 공시가격과 실거주 여부가 더 중요해집니다. '몇 채냐'보다 전체 보유 주택의 합산가액을 먼저 계산해야 합니다.",
    checkPoint: "추가 매수 전 전체 보유 주택의 합산 공시가격이 종부세 공제 기준을 넘는지 확인하세요.",
  },
  {
    id: "local-low-price-multi-house",
    title: "지방 저가주택 다주택 보유·추가 매수 고려자",
    direction: "기준에 따라 다름",
    summary: "종부세는 주택 수 대신 합산가액 기준이 되면서 유리해질 수 있지만, 취득세·양도세는 별도 기준이 적용되므로 세목별로 나눠 확인해야 합니다.",
    checkPoint: "종부세만 보고 판단하지 말고 취득세 중과 여부와 향후 양도세 중과 완화 구간을 함께 검토하세요.",
  },
  {
    id: "multi-house-seller",
    title: "매도를 고려 중인 다주택자",
    direction: "매도 기회 확인",
    summary: "2027~2028년 2년간 다주택 양도세 중과가 한시 완화됩니다. 2029년부터는 원래 중과세율로 복귀할 예정이므로 매도 시점을 이 구간에 맞출지 검토할 수 있습니다.",
    checkPoint: "현재 기준 양도세와 2027~2028년 완화 적용 시 양도세를 미리 계산해 시점을 비교하세요.",
  },
];
```

> 원안(사용자 제공 노트)의 "승스님 기준" 개인 상담(특정 평형·매수 계획)은 이 6개 카드로 완전히 대체한다. 페이지 어디에도 특정 개인을 지칭하는 문구를 넣지 않는다(기획서 §2-2).

### 3-7. 시장 전망 (기획서 §4-3)

```ts
export type OutlookGroup = {
  id: "short-term" | "mid-long-term";
  title: string;
  items: string[];
};

export const RTRA_MARKET_OUTLOOK: OutlookGroup[] = [
  {
    id: "short-term",
    title: "단기 전망",
    items: [
      "다주택자의 매도 대기 가능성",
      "2027년 중과 완화를 기다리며 2026년 매물을 거둬들일 가능성",
      "실거주 가능한 '똘똘한 한 채' 선호 유지",
      "전세를 낀 고가 주택 투자 수요 감소 가능성",
    ],
  },
  {
    id: "mid-long-term",
    title: "중장기 전망",
    items: [
      "고가·비거주 주택 보유 부담 증가",
      "지방 저가 다주택 투자 수요가 일부 살아날 가능성",
      "장기보유보다 장기실거주 가치 상승",
      "양도세 완화와 보유세 강화가 서로 충돌해 매물 유도 효과가 제한적일 수 있음",
    ],
  },
];

export const RTRA_MARKET_DEBATE =
  "전문가와 시민단체 사이에서는 상반된 우려가 동시에 나옵니다. 한쪽에서는 저가 다주택자의 보유세 부담이 줄어 지방 갭투자가 늘 수 있다고 우려하고, 다른 한쪽에서는 실거주 1주택자에 대한 혜택이 과도하다고 비판합니다. 이 리포트는 어느 한쪽 해석을 단정하지 않고 두 시각을 함께 소개합니다.";
```

### 3-8. FAQ / 관련 링크 / 출처

```ts
export type FaqItem = { question: string; answer: string };
export type RelatedLink = { label: string; href: string; desc: string };
export type SourceTableRow = { date: string; source: string; content: string; nature: string; url: string };
```

내용은 §7, §8 참고. `RTRA_SOURCE_TABLE`은 `real-estate-tax-reform-2026.ts`의 `RTR_SOURCE_TABLE`에 이미 등록된 8/3 관련 6개 행(뉴시스, 재정경제부 문답자료, 이데일리, KDI, 다음, 연합뉴스)을 그대로 복사해 재사용하고, PwC 항목은 원문 대조 완료 후에만 추가한다(§0 착수 전 필수 확인).

---

## 4. 페이지 IA 설계

### 4-1. 전체 섹션 순서

```text
[BaseLayout]
  [SiteHeader]
  <main class="container page-shell report-page rtra-page">
    [CalculatorHero]
    [InfoNotice]                    // GOVERNMENT_ANNOUNCED 고지 + dataNote
    .rtra-status-section            // 상태 배지 + 타임라인
    .rtra-summary-section           // 한눈에 보는 핵심 변화표 (§3-3)
    .rtra-tax-detail-section        // 종부세 조항별 상세 카드 (§3-4)
    .rtra-transfer-detail-section   // 양도세 조항별 상세 카드 (§3-4)
    .rtra-multi-house-section       // 다주택 양도세 한시 완화표 (§3-5)
    .rtra-impact-section            // 유형별 영향 카드 (§3-6)
    .rtra-market-outlook-section    // 시장 전망 (§3-7)
    .rtra-cta-section               // 숫자로 직접 확인 CTA
    [SeoContent]                    // FAQ + 관련 리포트/계산기
  </main>
```

### 4-2. 첫 화면 설계

```astro
<InfoNotice
  title="정부 발표 안내"
  lines={[
    RTRA_META.dataNote,
    `현재 단계: ${RTRA_META.policyStatusLabel} · ${RTRA_META.nextMilestone}`,
  ]}
/>

<section class="content-section rtra-status-section" aria-labelledby="rtra-status-title">
  <div class="rtra-status-card">
    <span class="rtra-status-badge" data-status={RTRA_META.policyStatus}>
      {RTRA_META.policyStatusLabel}
    </span>
    <h2 id="rtra-status-title">8월 3일, 정부가 부동산 세제개편안을 발표했습니다</h2>
    <p>{RTRA_META.nextMilestone}. 이 페이지는 국회를 통과한 확정 법률이 아니라 8월 3일 발표된 정부안을 배경부터 시장 전망까지 정리한 총정리 자료입니다.</p>
  </div>
  <ol class="rtra-timeline">
    {RTRA_TIMELINE.map((step) => (
      <li class:list={["rtra-timeline-step", step.isCurrent && "rtra-timeline-step--current", step.isDone && "rtra-timeline-step--done"]}>
        <span class="rtra-timeline-dot" aria-hidden="true"></span>
        <strong>{step.label}</strong>
        <span>{step.dateLabel}</span>
      </li>
    ))}
  </ol>
</section>
```

### 4-3. 핵심 변화표 섹션

```astro
<section class="content-section rtra-summary-section" aria-labelledby="rtra-summary-title">
  <div class="rtra-section-heading">
    <p>7줄 요약</p>
    <h2 id="rtra-summary-title">한눈에 보는 핵심 변화</h2>
  </div>
  <div class="table-wrap rtra-table-wrap">
    <table class="rtra-summary-table">
      <caption class="sr-only">2026 부동산 세제개편안 핵심 변화표</caption>
      <thead>
        <tr><th>구분</th><th>현재</th><th>개편안</th><th>영향</th></tr>
      </thead>
      <tbody>
        {RTRA_SUMMARY_TABLE.map((row) => (
          <tr>
            <td><strong>{row.category}</strong></td>
            <td>{row.before}</td>
            <td>{row.after}</td>
            <td>{row.impact}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</section>
```

### 4-4. 조항별 상세 섹션 (종부세)

```astro
<section class="content-section rtra-tax-detail-section" aria-labelledby="rtra-tax-detail-title">
  <div class="rtra-section-heading">
    <p>종합부동산세</p>
    <h2 id="rtra-tax-detail-title">종합부동산세, 무엇이 바뀌나</h2>
  </div>
  <div class="rtra-detail-grid">
    {RTRA_TAX_DETAILS.map((item) => (
      <article class="rtra-detail-card">
        <h3>{item.title}</h3>
        <p>{item.body}</p>
        <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">{item.sourceLabel}</a>
      </article>
    ))}
  </div>
</section>
```

### 4-5. 조항별 상세 섹션 (양도세) — 같은 마크업 패턴, 클래스만 `rtra-transfer-detail-section`

```astro
<section class="content-section rtra-transfer-detail-section" aria-labelledby="rtra-transfer-detail-title">
  <div class="rtra-section-heading">
    <p>양도소득세</p>
    <h2 id="rtra-transfer-detail-title">양도소득세, '보유'에서 '거주'로</h2>
  </div>
  <div class="rtra-detail-grid">
    {RTRA_TRANSFER_DETAILS.map((item) => (
      <article class="rtra-detail-card">
        <h3>{item.title}</h3>
        <p>{item.body}</p>
        <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">{item.sourceLabel}</a>
      </article>
    ))}
  </div>
</section>
```

### 4-6. 다주택 한시 완화 섹션

```astro
<section class="content-section rtra-multi-house-section" aria-labelledby="rtra-multi-house-title">
  <div class="rtra-section-heading">
    <p>다주택자</p>
    <h2 id="rtra-multi-house-title">다주택자 양도세, 2027~2028년 한시 완화</h2>
  </div>
  <div class="table-wrap rtra-table-wrap">
    <table class="rtra-relief-table">
      <caption class="sr-only">다주택 양도세 중과 한시 완화 일정표</caption>
      <thead>
        <tr><th>시기</th><th>2주택 중과</th><th>3주택 이상 중과</th><th>비고</th></tr>
      </thead>
      <tbody>
        {RTRA_MULTI_HOUSE_RELIEF.map((row) => (
          <tr>
            <td><strong>{row.period}</strong></td>
            <td>{row.twoHouseRate}</td>
            <td>{row.threePlusRate}</td>
            <td>{row.note}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  <p class="rtra-table-note">{RTRA_MULTI_HOUSE_NOTE}</p>
</section>
```

### 4-7. 유형별 영향 섹션

```astro
<section class="content-section rtra-impact-section" aria-labelledby="rtra-impact-title">
  <div class="rtra-section-heading">
    <p>나는 어디에 해당하나</p>
    <h2 id="rtra-impact-title">유형별 실질 영향</h2>
    <span>일반적인 방향을 안내하는 참고 자료이며, 개인별 판단은 세무 전문가 상담을 권장합니다.</span>
  </div>
  <div class="rtra-impact-grid">
    {RTRA_IMPACT_CARDS.map((card) => (
      <article class="rtra-impact-card" data-direction={card.direction}>
        <span class="rtra-impact-direction">{card.direction}</span>
        <h3>{card.title}</h3>
        <p>{card.summary}</p>
        <small>{card.checkPoint}</small>
      </article>
    ))}
  </div>
</section>
```

`data-direction` 배지 색만 다르게 하고, 카드 문구는 "~할 수 있음" 어미를 유지한다. 특정 인물을 지칭하는 표현은 절대 넣지 않는다(§1-3).

### 4-8. 시장 전망 섹션

```astro
<section class="content-section rtra-market-outlook-section" aria-labelledby="rtra-market-outlook-title">
  <div class="rtra-section-heading">
    <p>전망</p>
    <h2 id="rtra-market-outlook-title">시장에는 어떤 영향이 예상되나</h2>
  </div>
  <div class="rtra-outlook-grid">
    {RTRA_MARKET_OUTLOOK.map((group) => (
      <article class="rtra-outlook-card">
        <h3>{group.title}</h3>
        <ul>
          {group.items.map((item) => <li>{item}</li>)}
        </ul>
      </article>
    ))}
  </div>
  <p class="rtra-table-note">{RTRA_MARKET_DEBATE}</p>
</section>
```

### 4-9. 계산기 연결 CTA 섹션

```astro
<section class="content-section rtra-cta-section" aria-labelledby="rtra-cta-title">
  <div class="rtra-section-heading">
    <p>숫자로 직접 확인</p>
    <h2 id="rtra-cta-title">내 상황은 숫자로 직접 확인해보세요</h2>
    <span>이 페이지는 총정리이며, 정확한 세액은 아래 계산기·비교표로 확인하세요.</span>
  </div>
  <div class="rtra-cta-grid">
    <a class="rtra-cta-card" href="/reports/real-estate-tax-reform-2026/">
      <strong>현행 vs 정부 발표안 비교표</strong>
      <p>항목별 수치를 표로 비교하고 공정시장가액비율 시뮬레이션을 확인합니다.</p>
    </a>
    <a class="rtra-cta-card" href="/tools/apartment-holding-tax/">
      <strong>아파트 보유세 계산기</strong>
      <p>공시가격을 입력해 재산세·종부세를 직접 계산합니다.</p>
    </a>
    <a class="rtra-cta-card" href="/tools/capital-gains-tax-calculator/">
      <strong>양도소득세 계산기</strong>
      <p>장기보유특별공제를 반영한 양도세를 계산합니다.</p>
    </a>
  </div>
</section>
```

### 4-10. SeoContent 연결

```astro
<SeoContent
  introTitle="2026 부동산 세제개편안, 8월 3일 발표된 전체 내용"
  intro={[
    "정부가 2026년 8월 3일 부동산 세제개편안을 발표했습니다. 대출·공급 대책보다는 종합부동산세와 양도소득세를 대대적으로 손보는 세금 정책이며, 핵심은 주택 수보다 주택가액과 실제 거주 여부를 중심으로 과세하는 것입니다.",
    "이는 아직 국회를 통과하지 않은 정부안입니다. 관련 세법 개정안이 국회에 제출돼 심의·의결 절차를 거쳐야 하며, 이 과정에서 세율·공제금액·시행일이 달라질 수 있습니다.",
  ]}
  inputPoints={[
    "발표 배경부터 종부세·양도세 조항별 상세, 유형별 영향, 시장 전망까지 한 번에 읽을 수 있습니다.",
    "정확한 세액은 비교표 리포트와 계산기로 바로 이동해 확인할 수 있습니다.",
  ]}
  criteria={[
    "이 페이지는 2026년 8월 3일 발표된 정부 세제개편안(정부안) 기준으로 작성했습니다.",
    "종부세·양도세 개편 모두 관련 세법 개정이 필요해 국회 심의·의결을 거쳐야 확정됩니다.",
  ]}
  faq={RTRA_FAQ}
  related={RTRA_RELATED_LINKS.map((link) => ({ href: link.href, label: link.label }))}
/>
```

---

## 5. SCSS 설계

파일: `src/styles/scss/pages/_real-estate-tax-reform-announcement-2026.scss`, 전부 `.rtra-` prefix.

### 5-1. 추가 클래스 목록

```scss
.rtra-status-section
.rtra-status-card
.rtra-status-badge
.rtra-timeline
.rtra-timeline-step
.rtra-timeline-step--current
.rtra-timeline-step--done
.rtra-timeline-dot
.rtra-summary-section
.rtra-table-wrap
.rtra-summary-table
.rtra-detail-grid
.rtra-detail-card
.rtra-relief-table
.rtra-impact-grid
.rtra-impact-card
.rtra-impact-direction
.rtra-outlook-grid
.rtra-outlook-card
.rtra-cta-grid
.rtra-cta-card
.rtra-table-note
```

`.rtra-status-section`, `.rtra-timeline*`, `.rtra-table-wrap`, `.rtra-table-note`는 `_real-estate-tax-reform-2026.scss`와 동일한 톤·규칙을 그대로 복사해 재사용한다(디자인 일관성 유지, `docs/UI_ARCHITECTURE.md` 기준).

### 5-2. 상태 배지 (기존 리포트와 동일 톤)

```scss
.rtra-status-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  background: #dcfce7;
  color: #15803d;
  font-weight: 600;
  font-size: 13px;
}
```

### 5-3. 유형별 영향 배지

```scss
.rtra-impact-card {
  border: 1px solid #dde3f0;
  border-radius: 8px;
  padding: 16px;

  &[data-direction="영향 제한 가능"] .rtra-impact-direction { color: #16a34a; }
  &[data-direction="부담 증가 가능"] .rtra-impact-direction { color: #dc2626; }
  &[data-direction="기준에 따라 다름"] .rtra-impact-direction { color: #5b6472; }
  &[data-direction="매도 기회 확인"] .rtra-impact-direction { color: #1a56db; }
}
```

### 5-4. 그리드 규칙

```scss
.rtra-detail-grid,
.rtra-impact-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.rtra-outlook-grid,
.rtra-cta-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

@media (max-width: 820px) {
  .rtra-detail-grid,
  .rtra-impact-grid,
  .rtra-outlook-grid,
  .rtra-cta-grid {
    grid-template-columns: 1fr;
  }
}
```

### 5-5. 표 모바일 처리

```scss
.rtra-table-wrap {
  overflow-x: auto;
}

.rtra-summary-table,
.rtra-relief-table {
  min-width: 640px;
}
```

---

## 6. 접근성 및 구조화 데이터

### 6-1. HTML 구조

- 각 `section`은 `aria-labelledby`
- 표에 `caption`(시각적으로는 `sr-only`) 포함
- 타임라인 `<ol>`로 순서 있는 목록 처리
- 외부 출처 링크는 `target="_blank" rel="noopener noreferrer"`

### 6-2. JSON-LD

`real-estate-tax-reform-2026.astro` 패턴을 그대로 따른다: `Article` + `FAQPage` + `BreadcrumbList`.

```ts
{
  "@context": "https://schema.org",
  "@type": "Article",
  headline: RTRA_META.title,
  description: RTRA_META.description,
  dateModified: RTRA_META.updatedAt,
  mainEntityOfPage: reportUrl,
  author: { "@type": "Organization", name: "비교계산소" },
}
```

### 6-3. FAQPage

`RTRA_FAQ` 배열을 화면과 JSON-LD가 공유하는 단일 출처로 유지한다.

---

## 7. FAQ 데이터 설계

```ts
export const RTRA_FAQ: FaqItem[] = [
  {
    question: "2026 부동산 세제개편안은 확정된 건가요?",
    answer:
      "정부는 2026년 8월 3일 세제개편안을 발표했습니다. 다만 이는 정부 발표안일 뿐 아직 국회를 통과한 확정 법률이 아닙니다. 종합부동산세법·소득세법 등 관련 세법 개정안이 국회에 제출돼 심의·의결을 거쳐야 합니다.",
  },
  {
    question: "이 페이지와 기존 비교표 리포트는 뭐가 다른가요?",
    answer:
      "이 페이지는 발표 배경부터 조항별 상세, 유형별 영향, 시장 전망까지 순서대로 읽는 총정리 리포트입니다. 항목별 수치를 표로 비교하고 계산기와 바로 연동되는 화면은 '현행 vs 정부 발표안' 비교표 리포트(`/reports/real-estate-tax-reform-2026/`)에서 확인할 수 있습니다.",
  },
  {
    question: "나는 실거주 1주택자인데 세금이 오르나요?",
    answer:
      "종부세 기본공제가 12억 원에서 14억 원으로 확대돼 대체로 유리해집니다. 다만 공시가격 14억 원을 넘는 초고가 1주택은 세율 인상(6억~12억 구간 1.0%→1.3%)의 영향을 받을 수 있습니다.",
  },
  {
    question: "전세를 준 1주택자는 왜 불리해지나요?",
    answer:
      "비거주 1주택자는 종부세 기본공제가 오히려 9억 원으로 축소됩니다. 실제 거주하지 않으면 장기보유특별공제도 거주기간 공제를 받기 어려워, 같은 1주택자라도 실거주 여부에 따라 세 부담이 크게 달라질 수 있습니다.",
  },
  {
    question: "다주택자는 지금 팔아야 하나요, 기다려야 하나요?",
    answer:
      "2027~2028년 2년간 다주택 양도세 중과가 한시적으로 완화될 예정입니다. 다만 이는 아직 국회 통과 전 개편안이고, 개인의 자금 계획과 시장 상황에 따라 판단이 달라지므로 일률적으로 답하기는 어렵습니다. 현재 기준 양도세와 완화 적용 시 양도세를 먼저 계산해보는 것을 권장합니다.",
  },
  {
    question: "이 개편안은 언제 국회를 통과하나요?",
    answer:
      "아직 확정되지 않았습니다. 종부세 공정시장가액비율처럼 시행령 개정으로 처리 가능한 항목은 상대적으로 빠르게 진행될 수 있지만, 장기보유특별공제나 종부세 세율 변경처럼 법률 개정이 필요한 항목은 국회 심의를 거쳐야 합니다.",
  },
];
```

---

## 8. 내부 링크 및 CTA 설계

### 8-1. 관련 링크 데이터

```ts
export const RTRA_RELATED_LINKS: RelatedLink[] = [
  {
    label: "2026 부동산 세제개편안 발표 (비교표)",
    href: "/reports/real-estate-tax-reform-2026/",
    desc: "현행 vs 정부 발표안을 항목별 표로 비교하고 공정시장가액비율 시뮬레이션을 확인합니다.",
  },
  {
    label: "2026 다주택자 세금 완전 분석",
    href: "/reports/multi-house-tax-2026/",
    desc: "취득세·종부세·양도세·임대소득세 구조를 단계별로 정리한 심층 리포트입니다.",
  },
  {
    label: "아파트 보유세 계산기",
    href: "/tools/apartment-holding-tax/",
    desc: "공시가격을 입력해 재산세·종부세를 직접 계산합니다.",
  },
  {
    label: "양도소득세 계산기",
    href: "/tools/capital-gains-tax-calculator/",
    desc: "장기보유특별공제를 반영한 양도세를 계산합니다.",
  },
];
```

### 8-2. CTA 배치

| 위치 | CTA | 목적 |
|---|---|---|
| 조항별 상세 섹션마다 | 출처 링크 (뉴시스·재정경제부 등) | 신뢰도 확보 |
| 유형별 영향 섹션 직후 | 시장 전망으로 스크롤 유도 | 체류 시간 |
| 시장 전망 섹션 직후 | `rtra-cta-section` 비교표·계산기 3종 | 계산기·비교표 전환 |
| SeoContent related | 관련 리포트 2개 + 계산기 2개 | 회유율 |

---

## 9. 구현 순서

### 9-1. 착수 전 필수 확인 (기획서 §2-1)

1. PwC 삼일회계법인 세무 뉴스플래시(`pwc.com/kr/.../260803_kr.pdf`) 원문 접속·인용 수치 대조
2. 접속 불가 또는 수치 불일치 시 재정경제부 문답자료·뉴시스 기사로 대체하고 `RTRA_SOURCE_TABLE`에서 PwC 항목 제외
3. 원안(사용자 제공 노트)의 개인화 문구가 §3-6 카드 어디에도 섞여 있지 않은지 재확인

### 9-2. 데이터 파일 작성

파일: `src/data/realEstateTaxReformAnnouncement2026.ts` (신규)

1. 타입 정의 (`PolicyStatus`, `TimelineStep`, `SummaryRow`, `DetailCard`, `ReliefRow`, `ImpactDirection`, `ImpactCard`, `OutlookGroup`, `FaqItem`, `RelatedLink`, `SourceTableRow`)
2. `RTRA_META` (§2-1)
3. `RTRA_TIMELINE` 6단계 (§3-2)
4. `RTRA_SUMMARY_TABLE` 7행 (§3-3)
5. `RTRA_TAX_DETAILS` 4개, `RTRA_TRANSFER_DETAILS` 3개 (§3-4)
6. `RTRA_MULTI_HOUSE_RELIEF` 4행 + `RTRA_MULTI_HOUSE_NOTE` (§3-5)
7. `RTRA_IMPACT_CARDS` 6개 (§3-6)
8. `RTRA_MARKET_OUTLOOK` 2그룹 + `RTRA_MARKET_DEBATE` (§3-7)
9. `RTRA_FAQ` 6개 (§7)
10. `RTRA_RELATED_LINKS` 4개 (§8-1)
11. `RTRA_SOURCE_TABLE` — `realEstateTaxReform2026.ts`의 8/3 관련 출처 6건 복사 (§3-8)

### 9-3. Astro 페이지 작성

파일: `src/pages/reports/real-estate-tax-reform-announcement-2026.astro` (신규)

1. `real-estate-tax-reform-2026.astro`를 템플릿으로 복사해 시작
2. import 교체 (§3-1 데이터)
3. JSON-LD 3종 구성 (§6-2)
4. Hero (§2-2)
5. InfoNotice + 상태·타임라인 (§4-2)
6. `rtra-summary-section` (§4-3)
7. `rtra-tax-detail-section` (§4-4)
8. `rtra-transfer-detail-section` (§4-5)
9. `rtra-multi-house-section` (§4-6)
10. `rtra-impact-section` (§4-7)
11. `rtra-market-outlook-section` (§4-8)
12. `rtra-cta-section` (§4-9)
13. `SeoContent` (§4-10)

### 9-4. SCSS 작성

파일: `src/styles/scss/pages/_real-estate-tax-reform-announcement-2026.scss` (신규)

1. §5-1 클래스 뼈대 작성 (타임라인·테이블 톤은 기존 리포트 SCSS 복사)
2. 상태 배지 (§5-2)
3. 유형별 영향 배지 (§5-3)
4. 그리드 규칙 (§5-4)
5. 표 가로 스크롤 (§5-5)
6. `src/styles/app.scss`에 `@use 'scss/pages/real-estate-tax-reform-announcement-2026';` 추가

### 9-5. 등록 파일 반영

- `src/data/reports.ts` — 신규 항목 추가 (title/description은 §2-1 `seoTitle`/`description` 기준, `order`는 현재 최대값 다음 순번, `badges: ["세금", "부동산", "2026", "총정리"]` 등)
- `src/pages/index.astro`의 `reportMetaBySlug`에 `"real-estate-tax-reform-announcement-2026": { category: "estate", isNew: true }` 추가 — **누락 시 홈에서 "기타"로 표시되므로 필수**
- `public/sitemap.xml`에 `/reports/real-estate-tax-reform-announcement-2026/` 추가
- `src/pages/reports/index.astro`에서 정상 노출 확인
- `real-estate-tax-reform-2026.ts`의 `RTR_RELATED_LINKS`에도 이 신규 리포트를 상호 등록 (기획서 §7)

---

## 10. QA 체크리스트

### 콘텐츠

- [ ] 첫 화면(Hero + InfoNotice)에서 "국회 통과 전 정부안"이 바로 보이는가?
- [ ] 조항별 상세 카드마다 출처 링크가 걸려 있는가?
- [ ] 유형별 영향 카드에 특정 개인을 지칭하는 표현(닉네임, 특정 평형, 특정 매수 계획)이 전혀 없는가? (§1-3 재확인)
- [ ] 시장 전망 섹션이 한쪽 방향으로만 단정하지 않고 단기/중장기, 찬반 시각을 함께 담았는가?
- [ ] 기존 `real-estate-tax-reform-2026` 비교표와 내용이 중복되지 않고 서사형 해설로 차별화됐는가? (기획서 §3)
- [ ] FAQ가 화면에 실제로 보이는가(숨김 아님)?

### SEO

- [ ] title에 "2026 부동산 세제개편안 총정리"가 포함되는가?
- [ ] meta description이 80~120자 내외인가?
- [ ] 기존 `real-estate-tax-reform-2026`과 title/description이 겹치지 않는가?
- [ ] FAQPage JSON-LD와 화면 FAQ가 동일 데이터에서 나오는가?
- [ ] 내부 링크(비교표 리포트 + 계산기 2개 + 다주택 리포트)가 모두 연결되는가?

### UI

- [ ] 320px 모바일에서 타임라인·상세 카드·유형별 카드가 세로로 자연스럽게 전환되는가?
- [ ] 표가 모바일에서 가로 스크롤로 읽히는가?
- [ ] 유형별 영향 배지가 방향별로 색상 구분되는가?
- [ ] 외부 출처 링크가 새 창으로 열리고 `rel="noopener noreferrer"`가 걸려 있는가?

### 빌드

- [ ] `npm run build` 성공
- [ ] `dist/reports/real-estate-tax-reform-announcement-2026/index.html` 생성 확인
- [ ] 홈 리포트 섹션에서 "부동산(estate)" 카테고리로 정상 노출("기타" 아님) 확인
- [ ] sitemap에 트레일링 슬래시 포함해 정확히 반영 (`docs/GOOGLE_SEO_RULES.md` 기준)

---

## 11. 향후 확장 — 국회 심의 단계 갱신 계획

새 slug를 만들지 않고 **같은 페이지를 갱신**한다(기존 부동산 리포트와 동일 원칙).

갱신 대상:

1. 국회 제출 시 `RTRA_META.policyStatus` → `"BILL_SUBMITTED"`, `RTRA_TIMELINE` 갱신
2. 국회 통과 시 확정 수치·시행일을 §3-3~§3-6 데이터에 반영
3. `RTRA_META.updatedAt`, sitemap `lastmod` 갱신
4. `real-estate-tax-reform-2026.ts`도 같은 시점에 함께 갱신해 두 페이지 간 사실 불일치가 생기지 않게 확인

---

## 12. 최종 판단

이 리포트는 완전 신규 페이지지만 구현 난이도는 낮다 — 정적 리포트이며 클라이언트 스크립트가 필요 없고, 기존 `real-estate-tax-reform-2026.astro` 구조와 이미 검증된 출처·수치를 그대로 재사용할 수 있다. 핵심 리스크는 두 가지다.

1. **콘텐츠 중복**: 같은 8/3 발표를 다루는 두 번째 페이지이므로, §3 차별화(서사형 총정리 vs 비교표+계산기)를 구현 단계에서 그대로 지키지 않으면 검색엔진에 중복 콘텐츠로 인식될 위험이 있다. 두 페이지의 title/description, 섹션 구성, 상호 링크를 반드시 다르게 유지한다.
2. **개인화 콘텐츠 유입**: 원안(사용자 제공 노트)에 개인화된 상담 내용이 포함돼 있었다. 구현 시 원안 표현이 다시 섞여 들어가지 않도록 §3-6 유형별 카드를 그대로 따른다.

두 리스크를 관리하면, 기존 비교표 리포트·계산기와 상호 링크되어 "2026 부동산 세제개편안" 검색 클러스터 전체의 체류 시간과 회유율을 높이는 효과를 기대할 수 있다.
