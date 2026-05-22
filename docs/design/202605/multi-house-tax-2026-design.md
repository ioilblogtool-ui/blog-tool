# 2026 다주택자 세금 완전 분석 설계 문서

> 기획 원문: `docs/plan/202605/multi-house-tax-2026.md`  
> 작성일: 2026-05-21  
> 콘텐츠 유형: `/reports/` 리포트  
> 구현 기준: 다주택자 세금을 취득·보유·임대·양도·증여 단계로 나누고, 2026년 기준 확인이 필요한 정책 항목을 배지와 체크리스트로 분리한다.

---

## 1. 문서 개요

- 구현 대상: `2026 다주택자 세금 완전 분석`
- slug: `multi-house-tax-2026`
- URL: `/reports/multi-house-tax-2026/`
- 카테고리: 부동산
- 핵심 검색 의도: `다주택자 세금 2026`, `2주택자 세금`, `3주택자 세금`, `다주택자 양도세 중과`, `종부세 합산배제`
- 핵심 출력: 취득세·종부세·양도세·임대소득세 단계별 쟁점, 케이스 스터디, 정책 상태 배지, 보유세 계산기 CTA
- 안전 장치: 세법은 개인별 상황과 기준일에 따라 달라지므로 `예시`, `추정`, `확인 필요`, `한시` 배지를 반복 노출한다.

---

## 2. 구현 파일 구조

```text
src/
  data/
    multiHouseTax2026.ts
  pages/
    reports/
      multi-house-tax-2026.astro

src/styles/scss/pages/
  _multi-house-tax-2026.scss
```

선택 스크립트:

```text
public/
  scripts/
    multi-house-tax-2026.js
```

스크립트는 케이스 스터디 탭, 세금 단계 필터, CTA 쿼리 연결이 필요할 때만 둔다.

추가 등록 필수:

- `src/data/reports.ts`
- `src/styles/app.scss`에 `@use 'scss/pages/multi-house-tax-2026';`
- `public/sitemap.xml`

선택 등록:

- `src/pages/index.astro` 부동산 신규 리포트 노출
- `src/pages/reports/index.astro` 부동산 리포트 강조
- `public/og/reports/multi-house-tax-2026.png` 또는 OG 이미지 생성 대상 추가

---

## 3. 레이아웃 방향

- 리포트 페이지 패턴을 따른다.
- SCSS prefix: `mht-`
- pageClass: `mht-page`
- 세금 항목이 많기 때문에 첫 화면에는 `전체 지형도`, `핵심 체크 4개`, `보유세 계산기 CTA`만 보여준다.
- 본문은 `전체 지도 → 세목별 기준 → 케이스 스터디 → 전략 비교 → FAQ` 순서로 읽히게 한다.
- 표가 많으므로 모바일에서는 표를 카드형 또는 가로 스크롤로 전환한다.

권장 메인 구조:

```astro
<BaseLayout
  title="2026 다주택자 세금 완전 분석"
  description="2026년 다주택자 세금을 취득세, 종합부동산세, 양도소득세, 임대소득세로 나눠 분석합니다."
  ogImage="/og/reports/multi-house-tax-2026.png"
>
  <main class="container page-shell report-page mht-page" data-report="multi-house-tax-2026">
    ...
  </main>
</BaseLayout>
```

---

## 4. 페이지 IA

1. Hero
2. 기준일·세무 유의 안내
3. 다주택자 세금 전체 지형도
4. 상단 핵심 체크 카드
5. 취득세 중과 2026 최신 기준
6. 종부세 합산배제 요건
7. 장기임대등록 제도 변화
8. 양도세 중과 한시 배제 현황
9. 임대소득 분리과세 vs 종합과세
10. 지역별 조정대상지역 현황표
11. 서울 2주택자 케이스 스터디
12. 수도권+지방 3주택자 케이스 스터디
13. 증여 vs 매도 세금 비교
14. 법인 전환 득실
15. 전문가 절세 전략 TOP5
16. 2026 세법 개정 예고 사항
17. 보유세 계산기 및 세무상담 CTA
18. FAQ

---

## 5. 데이터 모델

파일: `src/data/multiHouseTax2026.ts`

```ts
export type TaxStage = 'acquisition' | 'holding' | 'rental' | 'transfer' | 'gift';
export type PolicyStatus = 'confirmed' | 'temporary' | 'proposed' | 'checkRequired';
export type RegionStatus = 'regulated' | 'nonRegulated' | 'checkRequired';
export type RiskTone = 'neutral' | 'caution' | 'danger';

export interface MultiHouseTaxStageSummary {
  stage: TaxStage;
  label: string;
  mainTaxes: string[];
  keyVariables: string[];
  multiHouseIssue: string;
  checkPoint: string;
  relatedCta?: {
    label: string;
    href: string;
  };
}

export interface PolicyWatchItem {
  id: string;
  title: string;
  status: PolicyStatus;
  effectiveDateLabel: string;
  summary: string;
  impact: string;
  sourceLabel: string;
  sourceUrl?: string;
}

export interface MultiHouseTaxCaseHouse {
  id: string;
  locationLabel: string;
  isRegulatedArea: boolean;
  officialPrice: number;
  acquisitionPrice: number;
  marketPrice: number;
  holdingYears: number;
  rentalIncomeAnnual: number;
  isRegisteredRental: boolean;
  note: string;
}

export interface MultiHouseTaxCase {
  id: string;
  label: string;
  description: string;
  houses: MultiHouseTaxCaseHouse[];
  highlights: string[];
  scenarioNotes: string[];
  warnings: string[];
}

export interface ComparisonRow {
  label: string;
  leftTitle: string;
  leftValue: string;
  rightTitle: string;
  rightValue: string;
  note: string;
}

export interface RegulatedAreaRow {
  region: string;
  status: RegionStatus;
  effectiveDateLabel: string;
  acquisitionTaxImpact: string;
  transferTaxImpact: string;
  note: string;
}

export interface FaqItem {
  q: string;
  a: string;
}
```

---

## 6. 데이터 구성

### 6-1. 세금 단계 요약

```ts
export const multiHouseTaxStages: MultiHouseTaxStageSummary[] = [
  {
    stage: 'acquisition',
    label: '취득',
    mainTaxes: ['취득세', '지방교육세', '농어촌특별세'],
    keyVariables: ['주택 수', '조정대상지역 여부', '취득 원인'],
    multiHouseIssue: '주택 수와 지역에 따라 취득세 중과 여부가 달라질 수 있습니다.',
    checkPoint: '일시적 2주택 예외와 증여 취득세를 별도로 확인합니다.',
  },
  {
    stage: 'holding',
    label: '보유',
    mainTaxes: ['재산세', '종합부동산세', '농어촌특별세'],
    keyVariables: ['공시가격', '주택 수', '합산배제 여부'],
    multiHouseIssue: '인별 공시가격 합계와 합산배제 요건이 핵심입니다.',
    checkPoint: '보유세는 아파트 보유세 계산기로 개별 추정합니다.',
    relatedCta: {
      label: '내 공시가격으로 보유세 계산하기',
      href: '/tools/apartment-holding-tax/',
    },
  },
];
```

### 6-2. 정책 상태 데이터

```ts
export const policyWatchItems: PolicyWatchItem[] = [
  {
    id: 'transfer-tax-surcharge-temporary-exclusion',
    title: '다주택자 양도세 중과 한시 배제',
    status: 'temporary',
    effectiveDateLabel: '2026년 적용 기한 최신 확인 필요',
    summary: '조정대상지역 다주택자 양도세 중과 배제는 적용 기한과 보유기간 요건 확인이 필요합니다.',
    impact: '매도 시점과 주택 소재지에 따라 세액 차이가 커질 수 있습니다.',
    sourceLabel: '국세청 양도소득세 안내 확인 필요',
  },
];
```

### 6-3. 케이스 스터디

```ts
export const multiHouseTaxCases: MultiHouseTaxCase[] = [
  {
    id: 'seoul-two-homes',
    label: '서울 2주택자',
    description: '거주 1주택과 임대 1주택을 보유한 서울 2주택자 예시입니다.',
    houses: [
      {
        id: 'home-a',
        locationLabel: '서울 거주 주택',
        isRegulatedArea: true,
        officialPrice: 1_200_000_000,
        acquisitionPrice: 900_000_000,
        marketPrice: 1_700_000_000,
        holdingYears: 8,
        rentalIncomeAnnual: 0,
        isRegisteredRental: false,
        note: '거주 주택',
      },
      {
        id: 'home-b',
        locationLabel: '서울 임대 주택',
        isRegulatedArea: true,
        officialPrice: 800_000_000,
        acquisitionPrice: 650_000_000,
        marketPrice: 1_100_000_000,
        holdingYears: 5,
        rentalIncomeAnnual: 18_000_000,
        isRegisteredRental: false,
        note: '월세 수입 발생',
      },
    ],
    highlights: ['공시가격 합산', '임대소득 과세', '매도 순서'],
    scenarioNotes: [
      '양도세는 취득가액, 필요경비, 보유기간, 조정대상지역 여부에 따라 달라집니다.',
    ],
    warnings: ['예시이며 실제 세액을 보장하지 않습니다.'],
  },
];
```

---

## 7. 화면 컴포넌트 설계

### 7-1. Hero

```text
2026 다주택자 세금 완전 분석
취득세, 종부세, 양도세, 임대소득세를 주택 수와 지역, 보유기간별로 나눠 확인하세요.
```

Hero 배지:

- `2026 기준`
- `취득·보유·임대·양도`
- `다주택자`
- `확인 필요`

### 7-2. 기준일 안내

```text
이 리포트는 2026년 기준 다주택자 세금 구조를 설명하기 위한 자료입니다. 실제 세액은 양도일, 취득일, 주택 수 산정, 조정대상지역 지정 여부, 임대등록 요건, 개인 소득에 따라 달라질 수 있습니다.
```

### 7-3. 세금 전체 지형도

카드 5개:

| 단계 | 카드 내용 |
| --- | --- |
| 취득 | 취득세 중과 |
| 보유 | 재산세·종부세 |
| 임대 | 임대소득세 |
| 양도 | 양도세 중과·한시 배제 |
| 이전 | 증여세·부담부증여 |

### 7-4. 상단 핵심 체크 카드

| 카드 | 내용 |
| --- | --- |
| 주택 수 | 2주택·3주택 이상 판단 |
| 지역 | 조정대상지역 여부 |
| 기간 | 보유기간·양도일 |
| 등록 | 임대사업자·합산배제 요건 |

### 7-5. 정책 상태 배지

| 상태 | 라벨 | 용도 |
| --- | --- | --- |
| `confirmed` | 확정 | 공식 법령·고시 기준 |
| `temporary` | 한시 | 적용 기한이 있는 제도 |
| `proposed` | 개정 가능 | 입법예고·정책 검토 |
| `checkRequired` | 확인 필요 | 개인별 요건 차이 |

---

## 8. 섹션별 구현 상세

### 8-1. 취득세 중과

- 주택 수, 조정대상지역, 취득 원인을 표로 구분한다.
- 세율 수치는 구현 전 최신 기준 확인 후 데이터에 입력한다.
- 일시적 2주택 예외는 본문 박스로 분리한다.

### 8-2. 종부세 합산배제

체크리스트 UI:

- 임대사업자 등록 여부
- 임대개시일
- 공시가격 기준
- 임대기간
- 임대료 증가율
- 신고기간 준수
- 사후요건 위반 시 추징 가능성

CTA:

```text
내 공시가격으로 보유세 계산하기
```

### 8-3. 양도세 중과 한시 배제

- `한시` 배지를 사용한다.
- 적용 기한은 데이터 필드로 관리한다.
- 종료 이후 리스크를 별도 카드로 제공한다.

### 8-4. 임대소득 분리과세 vs 종합과세

비교표:

| 항목 | 분리과세 | 종합과세 |
| --- | --- | --- |
| 기준 | 수입금액 2천만 원 이하 선택 가능 | 다른 종합소득과 합산 |
| 장점 | 다른 소득과 분리 | 비용·공제 반영 가능 |
| 주의 | 단순 세율만 보면 안 됨 | 누진세율 구간 영향 |

### 8-5. 조정대상지역 현황표

최신 공고 확인이 필요한 영역이므로 기준일을 명확히 표시한다.

```text
지역 지정·해제는 세금뿐 아니라 대출·청약 규제에도 영향을 줄 수 있습니다. 표의 지역 정보는 기준일 이후 변경될 수 있습니다.
```

### 8-6. 케이스 스터디

구현 방식:

- 탭 또는 segmented control로 `서울 2주택자`, `수도권+지방 3주택자` 전환
- 각 케이스에 `주택 구성`, `핵심 쟁점`, `선택지별 체크포인트`를 제공
- 실제 세액 단정 대신 위험 구간과 확인 항목 중심으로 표현

### 8-7. 증여 vs 매도

비교 프레임:

| 항목 | 매도 | 증여 |
| --- | --- | --- |
| 주요 세금 | 양도소득세 | 증여세·취득세 |
| 기준 가격 | 양도가액·취득가액 | 시가 |
| 추가 쟁점 | 필요경비·보유기간 | 부담부증여·자금출처 |
| 적합한 경우 | 현금화 필요 | 가족 이전 목적 |

### 8-8. 법인 전환

장점과 리스크를 나란히 배치한다.

- 장점: 소득 분산 가능성, 사업 구조화
- 리스크: 법인 취득세, 법인세, 배당 과세, 청산 비용, 대출 제한

---

## 9. 인터랙션 설계

파일: `public/scripts/multi-house-tax-2026.js`

필수는 아니며, 다음 기능이 필요할 때 추가한다.

### 기능 후보

- 세금 단계 필터
- 케이스 스터디 탭 전환
- 조정대상지역 표 검색
- 보유세 계산기 CTA에 케이스 공시가격 쿼리 연결

### CTA 쿼리 예시

```text
/tools/apartment-holding-tax/?officialPrice=1200000000&homeCount=two
```

---

## 10. SEO 메타

```ts
const seo = {
  title: '다주택자 세금 2026 - 취득세·종부세·양도세·임대소득세 완전 정리',
  description:
    '2026년 다주택자 세금을 취득세, 종합부동산세, 양도소득세, 임대소득세로 나눠 분석합니다. 2주택·3주택 이상 보유자의 조정대상지역, 합산배제, 양도세 중과 한시 배제, 분리과세와 종합과세 차이를 케이스별로 확인하세요.',
  canonical: '/reports/multi-house-tax-2026/',
};
```

구조화 데이터:

- `Article`
- `FAQPage`
- `BreadcrumbList`

---

## 11. FAQ

필수 FAQ:

- 2026년에 다주택자 양도세 중과는 적용되나요?
- 2주택자도 종부세가 나오나요?
- 임대소득이 2천만 원 이하이면 무조건 분리과세가 유리한가요?
- 임대사업자 등록을 하면 다주택자 세금이 줄어드나요?
- 자녀에게 증여하는 것이 매도보다 유리한가요?

답변 원칙:

- 단정형 세무 조언 금지
- `조건에 따라`, `양도일 기준`, `최신 기준 확인 필요` 표현 사용
- CTA는 FAQ 직후 배치

---

## 12. 내부 링크 및 CTA

| 위치 | CTA | 링크 |
| --- | --- | --- |
| Hero 하단 | 내 공시가격으로 보유세 계산하기 | `/tools/apartment-holding-tax/` |
| 종부세 섹션 | 종부세 대상 여부 계산하기 | `/tools/apartment-holding-tax/` |
| 양도·증여 섹션 | 주택 매수 자금 계산하기 | `/tools/home-purchase-fund/` |
| 지역 섹션 | 전세 vs 월세 계산하기 | `/tools/jeonse-vs-wolse-calculator/` |
| 하단 | 세무상담 전 체크리스트 보기 | 제휴 CTA |

---

## 13. 스타일 설계

파일: `src/styles/scss/pages/_multi-house-tax-2026.scss`

주요 클래스:

```scss
.mht-page {}
.mht-hero {}
.mht-notice {}
.mht-stage-map {}
.mht-stage-card {}
.mht-policy-badge {}
.mht-tax-table {}
.mht-checklist {}
.mht-case-tabs {}
.mht-case-card {}
.mht-comparison-grid {}
.mht-risk-panel {}
.mht-cta-band {}
.mht-faq {}
```

디자인 기준:

- 부동산 세금 리포트이므로 정보 신뢰성과 스캔성을 우선한다.
- 정책 상태 배지는 색상과 텍스트를 함께 사용한다.
- 표 내부 긴 문장은 줄바꿈을 허용한다.
- 모바일에서는 세금 단계 지도를 1열 카드로 전환한다.
- CTA는 계산기 연결이 자연스럽게 느껴지도록 섹션 내용 직후 배치한다.

---

## 14. 접근성 및 모바일

- 정책 배지는 색상만으로 의미를 전달하지 않는다.
- 케이스 탭은 키보드 이동과 `aria-selected`를 지원한다.
- 표에는 `<caption>` 또는 시각적으로 숨긴 설명을 제공한다.
- 모바일에서 표는 가로 스크롤 영역에 `aria-label`을 제공한다.
- CTA 버튼은 44px 이상 터치 영역을 확보한다.

---

## 15. 공식 데이터 업데이트 체크리스트

구현 직전 최신 공식 기준을 확인한다.

- [ ] 2026 취득세 중과 기준
- [ ] 조정대상지역·투기과열지구 최신 목록
- [ ] 종부세 공제금액과 세율표
- [ ] 종부세 합산배제 요건과 신고기간
- [ ] 임대주택 등록 제도와 장기·단기 임대 요건
- [ ] 다주택자 양도세 중과 한시 배제 기한
- [ ] 양도세 중과 세율과 장기보유특별공제 적용 여부
- [ ] 주택임대소득 분리과세·종합과세 기준
- [ ] 지방 저가주택 주택 수 제외 요건
- [ ] 일시적 2주택 특례
- [ ] 증여 취득세율과 부담부증여 과세 기준
- [ ] 법인 주택 보유 관련 세율·규제

---

## 16. 테스트 체크리스트

- [ ] 리포트가 `/reports/multi-house-tax-2026/`로 빌드되는지 확인
- [ ] 세금 단계 지도에서 취득·보유·임대·양도·증여가 모두 노출되는지 확인
- [ ] 정책 배지 `확정`, `한시`, `개정 가능`, `확인 필요` 스타일이 구분되는지 확인
- [ ] 케이스 스터디가 서울 2주택자와 수도권+지방 3주택자를 모두 표시하는지 확인
- [ ] 조정대상지역 표에 기준일이 표시되는지 확인
- [ ] 양도세 중과 한시 배제에 적용 기한 확인 문구가 있는지 확인
- [ ] 임대소득 분리과세 vs 종합과세 비교가 단정적으로 보이지 않는지 확인
- [ ] 보유세 계산기 CTA가 `/tools/apartment-holding-tax/`로 연결되는지 확인
- [ ] 모바일에서 긴 표가 깨지지 않는지 확인
- [ ] 특정 절세 전략을 확정 추천하는 표현이 없는지 확인
- [ ] `npm run build` 성공 확인
