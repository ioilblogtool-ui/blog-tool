# 항공사 성과급 비교 2026 기획

## 1. 배경 및 목적

- **계기**: 코로나 이후 항공 업계 실적 회복으로 "대한항공 성과급", "항공사 보너스" 등 검색 수요 존재. 현재 사이트에 항공/운송 업종 성과급 콘텐츠 없음 (`overseas-travel-cost` 등 여행 콘텐츠는 있으나 항공사 보상 콘텐츠는 부재)
- **목적**:
  1. "대한항공 성과급", "항공사 성과급 비교", "아시아나 합병 성과급" 등 키워드 SEO 트래픽 확보
  2. 항공업 재직자/이직 준비자 + 항공주 투자자 트래픽 확보
  3. 업종별 성과급 비교 시리즈(`semiconductor-bonus-comparison`, `shipbuilding-bonus-comparison`, `auto-bonus-comparison`)에 항공 추가
- **타겟 사용자**: 항공사 재직자(운항/객실/지상직 등), 이직 준비자, 항공주 투자자

## 2. 콘텐츠 성격 및 데이터 신뢰성 원칙

- 항공사는 직군별(조종사/객실승무원/일반직) 보상 구조 차이가 매우 크므로, 단일 "성과급률" 대신 **직군 선택 후 비교**하는 구조 권장
- 대한항공·아시아나항공 합병 이슈로 두 회사 비교 시 "합병 진행 상황에 따라 변동 가능" 고지 필요
- `semiconductor-bonus-comparison`과 동일하게 사용자 입력 기준 시뮬레이션

## 3. 페이지 구조 (1페이지, 비교형 계산기)

| 유형 | 슬러그 | 설명 |
|---|---|---|
| 계산기(Tool) | `tools/airline-bonus-comparison` | 대한항공/아시아나/저비용항공사(LCC 통합) 비교, 직군 선택 + 연봉 입력 → 성과급 추정 비교 |

레이아웃: `CompareToolShell`

## 4. 데이터 스키마 (`src/data/airlineBonusComparison2026.ts`)

```ts
export type AirlineCompanyId = "koreanAir" | "asianaAir" | "lcc";
export type AirlineJobType = "pilot" | "cabinCrew" | "ground";
export type BonusInputMode = "salaryPercent" | "monthlyMultiple" | "fixedAmount";

export interface AirlineCompanyConfig {
  id: AirlineCompanyId;
  name: string;          // "대한항공" / "아시아나항공" / "저비용항공사(LCC)"
  defaultMode: BonusInputMode;
  defaultSalaryPercent: number;
  defaultMonthlyMultiple: number;
  structureSummary: string;
  caution: string;
}

export interface AirlineJobTypeConfig {
  id: AirlineJobType;
  label: string;          // "조종사" / "객실승무원" / "일반직(지상직)"
  salaryRangeNote: string; // 연봉 범위 참고 문구 (추정)
}

export const AIRLINE_COMPANIES: AirlineCompanyConfig[] = [
  {
    id: "koreanAir", name: "대한항공",
    defaultMode: "salaryPercent", defaultSalaryPercent: 10, defaultMonthlyMultiple: 1,
    structureSummary: "실적과 그룹 기준에 따른 격려금/성과급 구조로 알려져 있습니다.",
    caution: "직군(운항/객실/일반직), 직급, 합병 진행 상황에 따라 달라질 수 있습니다.",
  },
  {
    id: "asianaAir", name: "아시아나항공",
    defaultMode: "salaryPercent", defaultSalaryPercent: 8, defaultMonthlyMultiple: 0.8,
    structureSummary: "실적 회복 추세에 따른 성과급 지급 가능성이 있는 것으로 알려져 있습니다.",
    caution: "대한항공과의 통합 진행 상황에 따라 보상 체계가 변경될 수 있습니다.",
  },
  {
    id: "lcc", name: "저비용항공사(LCC 평균)",
    defaultMode: "salaryPercent", defaultSalaryPercent: 5, defaultMonthlyMultiple: 0.5,
    structureSummary: "회사별 실적에 따라 성과급 지급 여부와 규모 차이가 큰 것으로 알려져 있습니다.",
    caution: "회사(제주항공/티웨이/진에어 등)별 차이가 크므로 평균값은 참고용입니다.",
  },
];

export const AIRLINE_JOB_TYPES: AirlineJobTypeConfig[] = [
  { id: "pilot", label: "조종사", salaryRangeNote: "직급/기종/항공사에 따라 차이가 매우 큽니다." },
  { id: "cabinCrew", label: "객실승무원", salaryRangeNote: "연차/직급에 따라 차이가 있습니다." },
  { id: "ground", label: "일반직(지상직)", salaryRangeNote: "사무직 평균 수준으로 참고하세요." },
];

export const AIRLINE_SIMPLE_TAX_RATE = 0.22;

export interface FaqItem { question: string; answer: string; }
export const AIRLINE_BONUS_FAQ: FaqItem[] = [ /* 5개 이상 */ ];

export interface RelatedLink { href: string; label: string; description: string; }
export const AIRLINE_RELATED_LINKS: RelatedLink[] = [
  { href: "/reports/corporate-bonus-comparison-2026/", label: "대기업 성과급 비교 리포트", description: "..." },
  { href: "/tools/overseas-travel-cost/", label: "해외여행 비용 계산기", description: "..." },
  { href: "/tools/bonus-after-tax-calculator/", label: "성과급 세후 계산기", description: "..." },
];
```

## 5. UI/IA 상세

1. CalculatorHero — "항공사 성과급 비교 계산기 2026 — 대한항공·아시아나·LCC"
2. InfoNotice — "직군별 차이 큼, 사용자 입력 기준 시뮬레이션, 대한항공-아시아나 통합 이슈로 변동 가능" 고지
3. 입력 패널 — 직군 선택(조종사/객실승무원/일반직) + 연봉 입력 + 회사별 성과급률 슬라이더 3개
4. 결과 비교 카드 (3사) — 성과급 추정액(세전/세후), 연봉 대비 비율
5. 3사 비교 바 차트
6. 직군별 보상 구조 설명 섹션 (`AIRLINE_JOB_TYPES`)
7. 대한항공-아시아나 통합 관련 안내 박스 (InfoNotice 재사용, "통합 진행에 따라 변동 가능")
8. 관련 링크 그리드
9. SeoContent — intro 5개 이상/800자 이상, FAQ 5개 이상

## 6. SEO 키워드 매핑

| 1차 키워드 | 2차 키워드 |
|---|---|
| 대한항공 성과급 | 대한항공 성과급 계산기, 항공사 보너스 |
| 항공사 성과급 비교 | 아시아나 성과급, 저비용항공사 성과급 |

## 7. 구현 파일 목록

- `src/data/airlineBonusComparison2026.ts`
- `src/pages/tools/airline-bonus-comparison.astro`
- `public/scripts/airline-bonus-comparison.js`
- `src/styles/scss/pages/_airline-bonus-comparison.scss` (prefix: `abc-`)
- 등록: `tools.ts`, `app.scss`, `sitemap.xml`, `index.astro`

## 8. 구현 순서

1. 데이터 파일 작성 (3개사 + 3개 직군 config)
2. `CompareToolShell` 페이지 구현 — 직군 선택 셀렉트 + 3사 비교
3. 비교 차트 구현
4. 통합 이슈 안내 InfoNotice 추가
5. SeoContent 작성 + 등록 + `npm run build`

## 9. QA/리스크

- 대한항공-아시아나 통합은 시점에 따라 상황이 달라질 수 있어 "현재 진행 상황은 변동될 수 있음"으로 모호하게 표현 (특정 날짜/완료 시점 단정 금지)
- 직군별 연봉 차이가 매우 커서 "평균"으로 단순화 시 오해 소지 → 직군 선택 UI로 분리해 책임 범위 명확화
- LCC는 회사별 차이가 크므로 "평균값" 한계를 InfoNotice에 명확히 고지
