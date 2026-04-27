# 퇴직연금 DC·DB·IRP 수익 비교 2026 구현 설계 문서

> 기획 문서: `docs/plan/202604/retirement-pension-dc-db-irp-2026.md`
> 작성일: 2026-04-21
> 구현 기준: 이 문서만 보고 `/reports/retirement-pension-dc-db-irp-2026/` 리포트 페이지 구현을 시작할 수 있는 수준
> 참고 리포트: `pension-irp-comparison-2026`, `national-pension-generational-comparison-2026`, `salary-asset-2016-vs-2026`

---

## 1. 문서 개요

### 1-1. 대상

- slug: `retirement-pension-dc-db-irp-2026`
- URL: `/reports/retirement-pension-dc-db-irp-2026/`
- 콘텐츠 유형: 리포트 (`/reports/`)
- 카테고리: 투자·연금·은퇴
- 목적: DB형, DC형, IRP를 구조·수익률·세금·수수료·수령 전략 관점에서 비교하는 데이터형 리포트

### 1-2. 페이지 정의

> 직장인이 퇴직연금 DB형, DC형, IRP의 차이를 2026년 기준으로 빠르게 이해하고, 본인의 근속연수·임금상승률·투자성향·퇴직 가능성에 따라 어떤 선택지가 더 맞는지 판단하도록 돕는 비교 리포트.

### 1-3. 구현 원칙

- 제도 설명보다 `선택 판단`을 먼저 보여준다.
- 수익률은 공식 데이터처럼 단정하지 않고 기준 기간과 출처를 명시한다.
- 세액공제·과세·수수료는 최신 기준을 반영하되, 세무 자문이 아니라 `일반 정보`임을 표시한다.
- DB/DC/IRP 중 하나를 무조건 추천하지 않는다. 사용자 조건별로 유리한 구조가 달라진다는 메시지를 유지한다.
- 본문 하단에서 `IRP 연금 계산기`, `연금저축 vs IRP 비교`, `국민연금 계산기`로 자연스럽게 연결한다.

---

## 2. 기준 자료 메모

구현 시 본문이나 데이터 파일에 다음 출처 메모를 남긴다.

| 항목 | 기준 |
| --- | --- |
| 연금계좌 세액공제 | 국세청 안내 기준. 총급여 5,500만 원 이하 공제율 15%, 초과 12%. 지방소득세 포함 체감 공제율은 16.5%, 13.2%로 표시 가능 |
| 세액공제 한도 | 연금저축 600만 원, 퇴직연금 포함 합산 900만 원 |
| 퇴직연금계좌 범위 | DC형, IRP, 중소기업퇴직연금 등. DC형 사용자부담금은 세액공제 대상 납입액에서 제외 |
| ISA 전환 추가한도 | ISA 만기잔액을 연금계좌에 납입한 해에 전환금액 10%, 300만 원 한도 추가 |
| 근로자퇴직급여 보장법 2026 개정 | 2026-07-01 시행 일부개정. 퇴직급여 체불 법정형 상향, 중소기업퇴직연금기금 대상 확대 등 |
| 비교공시 | 통합연금포털의 퇴직연금 비교공시에서 제도별 DB/DC/IRP, 상품별, 기간별 수익률·수수료를 비교한다는 안내 |

출처 URL:

- 국세청 연금계좌 세액공제 안내: `https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=7875&mi=2238`
- 국가법령정보센터 근로자퇴직급여 보장법 개정이유: `https://www.law.go.kr/LSW/lsRvsRsnListP.do?chrClsCd=010102&lsId=009883`
- 연합뉴스, 금감원 퇴직연금 비교공시 정비 보도: `https://www.yna.co.kr/view/AKR20250911087300002`

---

## 3. 파일 구조

```text
src/
  data/
    reports.ts
    retirementPensionDcDbIrp2026.ts
  pages/
    reports/
      retirement-pension-dc-db-irp-2026.astro

src/styles/scss/pages/
  _retirement-pension-dc-db-irp-2026.scss

public/
  og/
    reports/
      retirement-pension-dc-db-irp-2026.png
```

### 3-1. 추가 반영 파일

- `src/data/reports.ts`
- `src/pages/reports/index.astro` 필요 시 노출 순서/태그 확인
- `src/pages/index.astro` 필요 시 홈 노출 반영
- `src/styles/app.scss`
- `public/sitemap.xml`

---

## 4. 데이터 파일 설계 (`retirementPensionDcDbIrp2026.ts`)

### 4-1. 타입 정의

```ts
export type PensionPlanId = "db" | "dc" | "irp";

export type PensionPlanSummary = {
  id: PensionPlanId;
  name: string;
  shortName: string;
  oneLine: string;
  bestFor: string[];
  watchPoints: string[];
};

export type PensionComparisonRow = {
  label: string;
  db: string;
  dc: string;
  irp: string;
  note?: string;
};

export type ReturnComparisonItem = {
  id: string;
  label: string;
  planId: PensionPlanId;
  productType: "principal-guaranteed" | "non-principal-guaranteed" | "mixed";
  period: "1y" | "3y" | "5y" | "10y";
  valueLabel: string;
  sourceLabel: string;
  sourceUrl?: string;
};

export type TaxCreditExample = {
  id: string;
  incomeLabel: string;
  contribution: number;
  creditRate: number;
  expectedCredit: number;
  note: string;
};

export type ScenarioRecommendation = {
  id: string;
  title: string;
  userProfile: string;
  likelyFit: PensionPlanId[];
  reason: string;
  caution: string;
};

export type FaqItem = {
  q: string;
  a: string;
};
```

### 4-2. 핵심 요약 데이터

```ts
export const RETIREMENT_PENSION_SUMMARIES: PensionPlanSummary[] = [
  {
    id: "db",
    name: "확정급여형 퇴직연금",
    shortName: "DB형",
    oneLine: "퇴직급여 산식이 먼저 정해지고 회사가 운용 책임을 지는 구조",
    bestFor: ["임금상승률이 높은 직장인", "장기근속 가능성이 큰 사용자", "운용 관리를 직접 하고 싶지 않은 사용자"],
    watchPoints: ["개인이 직접 운용성과를 가져가는 구조가 아님", "회사 제도 선택권이 제한될 수 있음"],
  },
  {
    id: "dc",
    name: "확정기여형 퇴직연금",
    shortName: "DC형",
    oneLine: "회사가 정해진 부담금을 넣고 근로자가 직접 운용하는 구조",
    bestFor: ["투자 경험이 있는 직장인", "이직 가능성이 높은 사용자", "장기 복리 운용을 원하는 사용자"],
    watchPoints: ["운용 손익이 본인에게 귀속", "방치하면 원리금보장형에 머물 수 있음"],
  },
  {
    id: "irp",
    name: "개인형 퇴직연금",
    shortName: "IRP",
    oneLine: "퇴직금 이전, 추가 납입, 세액공제, 연금 수령을 개인 계좌에서 관리하는 구조",
    bestFor: ["퇴직금 통합 관리가 필요한 사용자", "세액공제를 활용하려는 직장인", "은퇴 전후 연금 수령 전략이 필요한 사용자"],
    watchPoints: ["중도인출 제약", "상품·수수료·위험자산 비중 확인 필요"],
  },
];
```

### 4-3. 비교 테이블 데이터

```ts
export const RETIREMENT_PENSION_COMPARISON_ROWS: PensionComparisonRow[] = [
  {
    label: "운용 책임",
    db: "회사",
    dc: "근로자",
    irp: "개인",
  },
  {
    label: "퇴직급여 결정 방식",
    db: "퇴직급여 산식 중심",
    dc: "부담금 + 운용성과",
    irp: "이전금 + 추가납입 + 운용성과",
  },
  {
    label: "개인 운용성과 반영",
    db: "낮음",
    dc: "높음",
    irp: "높음",
  },
  {
    label: "세액공제 활용",
    db: "일반적으로 해당 없음",
    dc: "근로자 추가납입분은 검토 가능",
    irp: "핵심 활용 영역",
    note: "사용자부담금은 세액공제 대상 납입액에서 제외한다.",
  },
  {
    label: "이직·퇴직 후 연결성",
    db: "IRP 이전 필요",
    dc: "IRP 이전 가능",
    irp: "통합 관리 가능",
  },
  {
    label: "가장 중요한 판단 기준",
    db: "임금상승률·근속연수",
    dc: "운용능력·위험감수",
    irp: "세액공제·수령전략·수수료",
  },
];
```

### 4-4. 세액공제 예시 데이터

```ts
export const RETIREMENT_PENSION_TAX_EXAMPLES: TaxCreditExample[] = [
  {
    id: "low-income-300",
    incomeLabel: "총급여 5,500만 원 이하",
    contribution: 3000000,
    creditRate: 0.165,
    expectedCredit: 495000,
    note: "소득세 15%와 지방소득세 1.5%를 합산한 체감 기준",
  },
  {
    id: "low-income-900",
    incomeLabel: "총급여 5,500만 원 이하",
    contribution: 9000000,
    creditRate: 0.165,
    expectedCredit: 1485000,
    note: "연금저축과 IRP 합산 세액공제 한도 900만 원을 모두 채운 경우",
  },
  {
    id: "high-income-900",
    incomeLabel: "총급여 5,500만 원 초과",
    contribution: 9000000,
    creditRate: 0.132,
    expectedCredit: 1188000,
    note: "소득세 12%와 지방소득세 1.2%를 합산한 체감 기준",
  },
];
```

### 4-5. 상황별 추천 데이터

```ts
export const RETIREMENT_PENSION_SCENARIOS: ScenarioRecommendation[] = [
  {
    id: "long-tenure-rising-wage",
    title: "대기업 장기근속·임금상승 기대형",
    userProfile: "근속 가능성이 높고 임금상승률이 예금 수익률보다 높을 가능성이 큰 직장인",
    likelyFit: ["db"],
    reason: "DB형은 퇴직급여 산식이 임금과 근속연수에 민감하므로 임금상승이 큰 직군에서 유리할 수 있다.",
    caution: "회사 제도 선택권과 전환 가능 여부를 먼저 확인해야 한다.",
  },
  {
    id: "mobile-investor",
    title: "이직 가능성이 높은 투자형 직장인",
    userProfile: "업종 이동 가능성이 있고 ETF·TDF 운용에 익숙한 사용자",
    likelyFit: ["dc", "irp"],
    reason: "DC형과 IRP는 개인 운용성과가 직접 반영되고 이직 후 계좌 연결성이 좋다.",
    caution: "위험자산 비중과 수수료를 주기적으로 점검해야 한다.",
  },
  {
    id: "tax-saving-focused",
    title: "연말정산 환급 중시형",
    userProfile: "퇴직연금보다 우선 연금계좌 세액공제 한도를 채우고 싶은 직장인",
    likelyFit: ["irp"],
    reason: "IRP 추가납입은 연금저축과 합산 900만 원 한도 안에서 세액공제 전략의 핵심 축이 된다.",
    caution: "세액공제만 보고 과도하게 납입하면 중도인출 제약이 부담이 될 수 있다.",
  },
];
```

### 4-6. FAQ 데이터

최소 6개 구성:

- DB형이 무조건 안정적인가요?
- DC형으로 바꾸면 무조건 수익률이 좋아지나요?
- IRP는 퇴직할 때만 필요한가요?
- IRP 세액공제 한도는 얼마인가요?
- 퇴직금을 일시금으로 받는 것과 연금으로 받는 것은 무엇이 다른가요?
- 수익률과 수수료 중 무엇을 더 봐야 하나요?
- 통합연금포털 수익률은 개인 수익률과 같은가요?

---

## 5. 페이지 레이아웃

### 5-1. 기본 구조

- `BaseLayout`
- `SiteHeader`
- 리포트 전용 hero
- 본문 섹션
- 관련 계산기 CTA
- FAQ
- `SeoContent` 또는 본문 하단 SEO 설명 영역

### 5-2. 권장 pageClass

- `rp26-page`

### 5-3. 섹션 id

```text
#summary
#structure
#policy-update
#return-comparison
#dc-strategy
#tax-credit
#scenario
#withdrawal-tax
#fee-check
#cases
#faq
```

---

## 6. 본문 섹션 설계

## 6-1. Hero

- eyebrow: `퇴직연금 비교 리포트`
- title: `퇴직연금 DB·DC·IRP, 2026년 기준 무엇이 유리할까`
- description: `구조 차이, 수익률 비교, 세액공제, 수수료, 퇴직 후 수령 전략까지 한 번에 정리합니다.`
- primary CTA: `IRP 예상 수령액 계산하기` -> `/tools/irp-pension-calculator/`
- secondary CTA: `연금저축 vs IRP 비교 보기` -> `/reports/pension-irp-comparison-2026/`

Hero 안에는 3개 요약 카드 배치:

1. `DB형`: 임금상승·장기근속 중심
2. `DC형`: 개인 운용성과 중심
3. `IRP`: 세액공제·퇴직금 통합관리 중심

## 6-2. 30초 결론

목적: 검색 유입자가 스크롤 없이 핵심 판단을 얻도록 한다.

구성:

- `임금상승률이 높고 오래 다닐 가능성이 크면 DB형이 유리할 수 있음`
- `투자 운용을 직접 할 수 있고 이직 가능성이 높으면 DC형을 검토`
- `퇴직금 이전·추가납입·세액공제를 함께 보려면 IRP가 핵심`
- `수익률만 보지 말고 수수료, 위험자산 비중, 중도인출 제약을 함께 확인`

## 6-3. DB·DC·IRP 구조 비교

`RETIREMENT_PENSION_COMPARISON_ROWS`를 표로 출력한다.

모바일:

- 표가 너무 길면 가로 스크롤 허용
- 첫 열 `항목`은 sticky 처리 가능
- 대안: 카드형 비교로 전환

## 6-4. 2026년 제도·공시 업데이트

카드 4개:

1. `연금계좌 세액공제 한도`: 연금저축 600만 원, 퇴직연금 포함 합산 900만 원
2. `퇴직연금계좌 범위`: DC형, IRP 등. 사용자부담금 제외 주석 필수
3. `근로자퇴직급여 보장법 개정`: 2026-07-01 시행 개정사항은 별도 박스로 표시
4. `통합연금포털 비교공시`: 수익률·수수료·상품 구분을 비교하도록 안내

박스 하단 문구:

`세법·노동법 기준은 개정될 수 있으므로 실제 신고·수령 전에는 국세청, 고용노동부, 금융회사 안내를 확인해야 합니다.`

## 6-5. DB형 평균 수익률과 해석

목적: DB형은 개인이 직접 운용성과를 가져가는 구조가 아니라는 점을 분명히 한다.

권장 구성:

- 기간별 수익률 차트 영역
- `회사 운용성과`와 `개인 퇴직급여 산식`의 차이 설명
- 물가상승률과 비교하는 보조선

주의 문구:

`DB형 수익률은 회사가 부담금을 운용한 성과를 보여주는 지표이며, DC·IRP처럼 개인 계좌 수익률과 바로 같지 않습니다.`

## 6-6. DC형 운용 방식 비교

카드 또는 막대 차트:

- 원리금보장형
- TDF·밸런스형
- ETF 중심
- 혼합형

각 카드 항목:

- 기대수익률 방향
- 변동성
- 추천 대상
- 방치 리스크

핵심 메시지:

`DC형은 제도 자체보다 운용 방식이 결과를 크게 가른다.`

## 6-7. IRP 세액공제 시뮬레이션

`RETIREMENT_PENSION_TAX_EXAMPLES` 출력.

표 항목:

- 총급여 구간
- 납입액
- 공제율
- 예상 세액공제
- 설명

표 상단 안내:

`국세청 기준 공제율은 15% 또는 12%이며, 일반 사용자에게는 지방소득세를 포함한 16.5% 또는 13.2% 체감 금액을 함께 보여준다.`

CTA:

- `/tools/irp-pension-calculator/`
- `/reports/pension-irp-comparison-2026/`

## 6-8. 직장인 유형별 선택 매트릭스

`RETIREMENT_PENSION_SCENARIOS`를 카드 그리드로 출력한다.

카드 구조:

- 사용자 유형
- 유리할 수 있는 제도
- 이유
- 확인할 점

추천 조합:

- `DB 유지 + IRP 추가납입`
- `DC 운용 + IRP 통합관리`
- `연금저축 600 + IRP 300`
- `DB/DC는 회사 제도 기준, IRP는 개인 절세·수령 전략 기준`

## 6-9. 중간정산·중도인출 손실 분석

목적: 퇴직연금은 단기 유동성 계좌가 아니라는 점을 강조한다.

구성:

- `지금 인출하는 1,000만 원` 예시 박스
- 복리 손실 예시: 20년, 연 4% 가정 시 미래가치 비교
- 세액공제 받은 금액의 추징 가능성, 기타소득세 가능성 등은 일반 설명으로 제한

반드시 `시뮬레이션` 배지 사용.

## 6-10. 퇴직 후 일시금 vs 연금 수령

비교표:

| 항목 | 일시금 수령 | IRP 이전 후 연금 수령 |
| --- | --- | --- |
| 현금 유동성 | 높음 | 낮음~중간 |
| 과세 시점 | 즉시 | 과세이연 가능 |
| 은퇴 현금흐름 | 직접 관리 필요 | 분할 수령 가능 |
| 적합한 경우 | 대출상환·주택자금 등 명확한 목적 | 생활비 흐름과 절세를 함께 보는 경우 |

CTA:

`IRP 연금 계산기에서 월 수령액을 계산해보세요.`

## 6-11. 수익률보다 수수료를 함께 봐야 하는 이유

구성:

- 수익률 1위만 따라가면 안 되는 이유
- 수수료율 차이가 장기 누적수익에 미치는 영향
- 통합연금포털에서 확인할 항목 체크리스트

체크리스트:

- [ ] 제도 구분이 DB/DC/IRP 중 무엇인지 확인
- [ ] 기간이 1년인지 3년·5년인지 확인
- [ ] 원리금보장형인지 원리금비보장형인지 확인
- [ ] 대면·비대면 가입 수수료 차이 확인
- [ ] 내 계좌의 실제 상품 수익률과 비교

## 6-12. 실제 케이스 3개

### 케이스 1. 장기근속 40대 과장

- 임금상승 가능성 높음
- 퇴직 가능성 낮음
- 투자 관리 선호 낮음
- 해석: `DB 유지 + IRP 추가납입`이 기본 검토안

### 케이스 2. 이직 많은 30대 개발자

- 이직 가능성 높음
- ETF/TDF 이해도 있음
- 퇴직금 통합관리 필요
- 해석: `DC + IRP` 구조 검토

### 케이스 3. 연말정산 환급을 키우려는 40대 직장인

- 세액공제 한도 활용이 목적
- 장기 납입 가능
- 중도인출 가능성 낮음
- 해석: `연금저축 600 + IRP 300` 조합 설명으로 연결

## 6-13. FAQ

아코디언 또는 단순 Q&A 리스트.

권장 FAQ:

1. DB형과 DC형 중 어떤 것이 더 안전한가요?
2. DC형은 ETF로만 운용하는 게 좋은가요?
3. IRP는 퇴직 후에만 만들 수 있나요?
4. IRP 세액공제는 900만 원 전액을 돌려받는다는 뜻인가요?
5. 퇴직금을 일시금으로 받으면 손해인가요?
6. 통합연금포털 수익률은 제 계좌 수익률과 같은가요?
7. DB형에서 DC형으로 전환하면 다시 돌아갈 수 있나요?

## 6-14. CTA 영역

메인 CTA:

- title: `내 IRP 월 수령액을 바로 계산해보세요`
- href: `/tools/irp-pension-calculator/`

보조 CTA:

- `/reports/pension-irp-comparison-2026/`
- `/tools/national-pension-calculator/`
- `/tools/retirement-fund-depletion/`

---

## 7. 추천 컴포넌트 구조

초기 구현은 단일 Astro 파일 안의 섹션으로 시작한다. 반복이 커지면 컴포넌트 분리.

```text
RetirementPensionHero
RetirementPensionSummaryCards
RetirementPensionComparisonTable
RetirementPensionPolicyUpdate
RetirementPensionReturnChart
RetirementPensionTaxExamples
RetirementPensionScenarioGrid
RetirementPensionWithdrawalGuide
RetirementPensionFeeChecklist
RetirementPensionCaseCards
RetirementPensionFaq
RetirementPensionCta
```

---

## 8. 스타일 설계 (`_retirement-pension-dc-db-irp-2026.scss`)

### 8-1. prefix

- `rp26-`

### 8-2. 시각 방향

- 금융 리포트형 UI
- 과도한 장식보다 표, 카드, 배지, 차트의 가독성 우선
- DB/DC/IRP를 색으로 구분하되 전체 페이지가 한 가지 색으로 보이지 않게 한다.

권장 토큰:

```scss
.rp26-page {
  --rp26-db: #2f6f9f;
  --rp26-dc: #2f8f6f;
  --rp26-irp: #8a5a9f;
  --rp26-warning: #b7791f;
}
```

### 8-3. 주요 스타일 포인트

- 비교표는 모바일 가로 스크롤 허용
- 요약 카드 3개는 desktop 3열, mobile 1열
- CTA 카드와 일반 설명 카드는 시각 위계를 다르게 둔다.
- `공식`, `시뮬레이션`, `참고` 배지는 일관된 스타일 사용
- 긴 숫자와 금액은 줄바꿈으로 레이아웃이 깨지지 않게 `font-variant-numeric: tabular-nums` 권장

### 8-4. 금지

- 세금 환급액을 `확정 환급`처럼 보이게 하는 강조 금지
- 수익률 표에서 특정 금융사를 추천하는 듯한 표현 금지
- `무조건`, `보장`, `최고` 표현 금지

---

## 9. SEO 설계

### 9-1. 메타

```text
title: "퇴직연금 DC·DB·IRP 비교 2026 | 수익률·세액공제·수수료·수령 전략"
description: "퇴직연금 DB형, DC형, IRP의 구조 차이와 2026년 세액공제 한도, 수익률 비교, 수수료, 퇴직 후 일시금·연금 수령 전략을 한 번에 정리합니다."
```

### 9-2. 주요 키워드

- 퇴직연금 DC DB IRP 비교
- DB형 DC형 차이
- IRP 세액공제 2026
- 퇴직연금 수익률 비교
- 퇴직금 일시금 연금 수령 세금
- 퇴직연금 수수료 비교

### 9-3. 구조화 데이터

- `Article`
- `FAQPage`
- 필요 시 `BreadcrumbList`

---

## 10. 관련 링크 설계

### 10-1. 내부 링크 우선순위

1. `/tools/irp-pension-calculator/`
2. `/reports/pension-irp-comparison-2026/`
3. `/tools/national-pension-calculator/`
4. `/tools/retirement-fund-depletion/`
5. `/tools/compound-interest-calculator/`

### 10-2. 외부 참고 링크

본문 하단 또는 출처 영역에만 배치한다.

- 국세청 연금계좌 세액공제
- 국가법령정보센터 근로자퇴직급여 보장법
- 통합연금포털 또는 금감원 관련 공시 안내

---

## 11. QA 체크리스트

### 콘텐츠

- [ ] DB/DC/IRP 정의가 서로 혼동되지 않는다.
- [ ] DB형 수익률이 개인 수익률처럼 오해되지 않도록 설명한다.
- [ ] IRP 세액공제는 900만 원 환급이 아니라 900만 원 납입한도 기준 공제임을 명시한다.
- [ ] 공제율 15%/12%와 지방세 포함 16.5%/13.2%를 구분한다.
- [ ] 사용자부담금과 근로자 추가납입분을 구분한다.
- [ ] 수익률·세금·미래가치 예시는 `시뮬레이션` 또는 `참고` 배지를 사용한다.

### UI

- [ ] 비교표 모바일 가독성 확인
- [ ] 카드 안 긴 한국어 문구 줄바꿈 확인
- [ ] CTA 링크 정상 이동
- [ ] FAQ 아코디언 사용 시 키보드 접근성 확인
- [ ] 배지 색상 대비 확인

### 등록

- [ ] `src/data/reports.ts` 등록
- [ ] `src/styles/app.scss` `@use` 추가
- [ ] `public/sitemap.xml` URL 추가
- [ ] OG 이미지 생성 또는 플레이스홀더 확인
- [ ] `npm run build` 통과

---

## 12. 구현 우선순위

### P0

- Hero
- 30초 결론
- DB/DC/IRP 구조 비교표
- 2026 세액공제·제도 업데이트 박스
- 상황별 추천 매트릭스
- CTA
- FAQ

### P1

- 수익률 비교 차트
- DC 운용 방식 비교
- 수수료 체크리스트
- 일시금 vs 연금 수령 비교

### P2

- 통합연금포털 데이터를 수동 갱신 가능한 데이터 구조
- 기간별 수익률 토글
- 세액공제 간단 계산 인터랙션
- 사용자 상황 체크리스트 기반 추천 하이라이트

---

## 13. 최종 구현 메모

이 페이지의 핵심은 `퇴직연금 종류 설명`이 아니라 `선택 판단의 프레임`이다. 첫 화면에서 DB·DC·IRP의 차이를 즉시 보여주고, 본문에서는 수익률·세액공제·수수료·수령 방식을 차례로 검증하게 만든다. 특히 DB형은 회사 운용 구조, DC형은 개인 운용 구조, IRP는 개인 계좌·세액공제·퇴직금 통합관리 구조라는 축을 끝까지 유지해야 한다.

수익률 데이터는 시간이 지나면 낡기 쉽다. 따라서 구체 수치가 들어가는 테이블은 데이터 파일로 분리하고, 기준일과 출처 라벨을 필수 필드로 둔다. 구현 초기에는 수익률 순위보다 `어떤 항목을 비교해야 하는가`를 보여주는 리포트 구조를 우선 완성한다.
