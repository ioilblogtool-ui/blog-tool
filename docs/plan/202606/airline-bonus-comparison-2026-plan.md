# 국내 항공사 5사 성과급 비교 계산기 2026 기획

> 기존 3사(대한항공·아시아나·LCC통합) 기획에서 제주항공·티웨이항공·진에어를 개별 추가해 5사 비교로 확장 (2026-06-16 업데이트)

## 1. 배경 및 목적

- **계기**: 코로나 이후 항공 업계 실적 회복으로 "대한항공 성과급", "제주항공 성과급", "항공사 보너스" 검색 수요 존재. LCC 개별 회사 키워드도 독립 검색량 확보 가능. 대한항공-아시아나 통합 이슈로 두 회사 보상 비교 수요도 높음
- **목적**:
  1. "대한항공 성과급", "아시아나 성과급", "제주항공 성과급", "티웨이 성과급", "진에어 성과급" 키워드 SEO 통합 확보
  2. 항공업 재직자(운항/객실/지상직)/이직 준비자/항공주 투자자 트래픽 확보
  3. 업종별 성과급 비교 시리즈(`semiconductor-bonus-comparison`, `shipbuilding-bonus-comparison`, `auto-bonus-comparison`, `telecom-bonus-comparison`)에 항공 추가
- **타겟 사용자**: 항공사 재직자, 이직 준비자, 항공업 관심층

## 2. 콘텐츠 성격 및 데이터 신뢰성 원칙

- 항공사는 직군별(조종사/객실승무원/일반직) 보상 구조 차이가 매우 크므로 **직군 선택 후 비교** 구조 유지
- 대한항공·아시아나 통합 이슈 → "통합 진행 상황에 따라 변동 가능" 고지 필수
- `telecom-bonus-comparison`과 동일하게 `SimpleToolShell` 기반 사용자 입력 시뮬레이션
- 모든 수치는 "추정·시뮬레이션" 레이블 명시

## 3. 페이지 구성

| 유형 | 슬러그 | 설명 |
|------|--------|------|
| 계산기(Tool) | `tools/airline-bonus-comparison` | 5사 동시 비교, 직군 선택 + 연봉 입력 → 성과급 세전·세후 비교 |

레이아웃: `SimpleToolShell` (aside에 직군 선택 + 5개 회사 패널, 메인에 KPI + 표 + 차트)

## 4. 비교 대상 5사 및 기본값

| 회사 | id | 기본 지급률 | 특이사항 |
|------|----|------------|---------|
| 대한항공 | `koreanair` | 연봉 대비 10% | 그룹 실적 기반 격려금, 직군별 편차 큼 |
| 아시아나항공 | `asianaair` | 연봉 대비 8% | 대한항공 통합 진행 중, 변동 가능 |
| 제주항공 | `jejuair` | 연봉 대비 5% | LCC 1위, 실적에 따라 변동 |
| 티웨이항공 | `twayair` | 연봉 대비 4% | LCC 2위권, 성과급 공개 정보 제한적 |
| 진에어 | `jinair` | 연봉 대비 5% | 한진그룹 계열 LCC, 대한항공 연동 |

> 기본값은 보도·업계 추정 기반이며 실제와 다를 수 있음

## 5. 직군 선택 구조

| id | label | 연봉 범위 참고 |
|----|-------|-------------|
| `pilot` | 조종사 | 직급·기종·항공사에 따라 차이가 매우 큽니다. (추정) |
| `cabinCrew` | 객실승무원 | 연차·직급에 따라 차이가 있습니다. (추정) |
| `ground` | 일반직(지상직) | 사무직 평균 수준으로 참고하세요. (추정) |

- 직군 선택은 **기준 연봉 입력 힌트**에만 영향 (직군별 평균 연봉 참고 문구 표시)
- 성과급률은 회사별로 직군과 무관하게 동일 입력값 적용 (직군별 지급률 공식 데이터 없음)
- 직군에 따른 특이사항(조종사는 비행수당 별도 등)을 InfoNotice에 명시

## 6. 데이터 스키마 (`src/data/airlineBonusComparison2026.ts`)

```ts
export type AirlineCompanyId = "koreanair" | "asianaair" | "jejuair" | "twayair" | "jinair";
export type AirlineJobType = "pilot" | "cabinCrew" | "ground";
export type BonusInputMode = "salaryPercent" | "monthlyMultiple" | "fixedAmount";
export type EvidenceBadge = "추정" | "시뮬레이션" | "사용자 입력 기준";

export interface AirlineCompanyConfig {
  id: AirlineCompanyId;
  name: string;
  shortName: string;
  defaultMode: BonusInputMode;
  defaultSalaryPercent: number;
  defaultMonthlyMultiple: number;
  defaultFixedAmount: number;
  structureSummary: string;
  caution: string;
  badges: EvidenceBadge[];
}

export const AIRLINE_COMPANIES: AirlineCompanyConfig[] = [
  {
    id: "koreanair", name: "대한항공", shortName: "대한항공",
    defaultMode: "salaryPercent", defaultSalaryPercent: 10, defaultMonthlyMultiple: 1.0, defaultFixedAmount: 0,
    structureSummary: "그룹 실적과 평가 기준에 따른 격려금·성과급 구조로 알려져 있습니다.",
    caution: "직군(운항/객실/일반직), 직급, 아시아나항공 통합 진행 상황에 따라 달라질 수 있습니다.",
    badges: ["추정", "시뮬레이션"],
  },
  {
    id: "asianaair", name: "아시아나항공", shortName: "아시아나",
    defaultMode: "salaryPercent", defaultSalaryPercent: 8, defaultMonthlyMultiple: 0.8, defaultFixedAmount: 0,
    structureSummary: "실적 회복 추세에 따른 성과급 지급 가능성이 있는 것으로 알려져 있습니다.",
    caution: "대한항공과의 통합 진행 상황에 따라 보상 체계가 변경될 수 있습니다.",
    badges: ["추정", "시뮬레이션"],
  },
  {
    id: "jejuair", name: "제주항공", shortName: "제주항공",
    defaultMode: "salaryPercent", defaultSalaryPercent: 5, defaultMonthlyMultiple: 0.5, defaultFixedAmount: 0,
    structureSummary: "국내 LCC 1위 사업자로 실적에 따라 성과급 지급 규모가 변동하는 구조로 알려져 있습니다.",
    caution: "연도별 실적 변동에 따라 성과급 지급 여부와 규모가 달라질 수 있습니다.",
    badges: ["추정", "시뮬레이션"],
  },
  {
    id: "twayair", name: "티웨이항공", shortName: "티웨이",
    defaultMode: "salaryPercent", defaultSalaryPercent: 4, defaultMonthlyMultiple: 0.4, defaultFixedAmount: 0,
    structureSummary: "LCC 2위권으로 성과급 관련 공개 정보가 제한적이며 실적에 따라 변동합니다.",
    caution: "성과급 관련 공식 공개 정보가 적어 추정 불확실성이 높습니다.",
    badges: ["추정", "시뮬레이션"],
  },
  {
    id: "jinair", name: "진에어", shortName: "진에어",
    defaultMode: "salaryPercent", defaultSalaryPercent: 5, defaultMonthlyMultiple: 0.5, defaultFixedAmount: 0,
    structureSummary: "한진그룹 계열 LCC로 대한항공 실적과 연동된 구조를 가진 것으로 알려져 있습니다.",
    caution: "그룹 공통 기준 및 LCC 사업 실적에 따라 달라질 수 있습니다.",
    badges: ["추정", "시뮬레이션"],
  },
];

export interface AirlineJobTypeConfig {
  id: AirlineJobType;
  label: string;
  salaryRangeNote: string;
  avgSalaryHint: string;
}

export const AIRLINE_JOB_TYPES: AirlineJobTypeConfig[] = [
  {
    id: "pilot", label: "조종사",
    salaryRangeNote: "직급·기종·항공사에 따라 차이가 매우 큽니다.",
    avgSalaryHint: "기장 기준 약 1억 5,000만~3억 원 이상 (직급·기종·항공사별 추정)",
  },
  {
    id: "cabinCrew", label: "객실승무원",
    salaryRangeNote: "연차·직급에 따라 차이가 있습니다.",
    avgSalaryHint: "약 4,000만~8,000만 원 (연차·직급별 추정)",
  },
  {
    id: "ground", label: "일반직(지상직)",
    salaryRangeNote: "사무직 평균 수준으로 참고하세요.",
    avgSalaryHint: "약 5,000만~1억 원 (직급별 추정)",
  },
];

export interface AirlineCompanyProfile {
  id: AirlineCompanyId;
  averageSalary: string;
  employeeCount: string;
  revenue: string;
  recentBonus: string;
}

export const AIRLINE_COMPANY_PROFILES: AirlineCompanyProfile[] = [
  { id: "koreanair",  averageSalary: "약 1억 원",       employeeCount: "약 19,000명", revenue: "약 16조 원 (2024)",  recentBonus: "비공개" },
  { id: "asianaair",  averageSalary: "약 8,000만 원",    employeeCount: "약 9,000명",  revenue: "약 7조 원 (2024)",   recentBonus: "비공개" },
  { id: "jejuair",    averageSalary: "약 6,000만 원",    employeeCount: "약 4,000명",  revenue: "약 1조 7,000억 원 (2024)", recentBonus: "비공개" },
  { id: "twayair",    averageSalary: "약 5,500만 원",    employeeCount: "약 3,000명",  revenue: "약 1조 원 (2024)",   recentBonus: "비공개" },
  { id: "jinair",     averageSalary: "약 5,500만 원",    employeeCount: "약 2,800명",  revenue: "약 9,000억 원 (2024)", recentBonus: "비공개" },
];

export const AIRLINE_PROFILE_NOTE =
  "평균연봉·직원수는 사업보고서 및 업계 추정 기반 참고 정보입니다. 매출은 2024년 연간 기준 추정값이며, 성과급 지급률은 각 사가 공식 공개한 경우에만 표기하고 비공개 항목은 '비공개'로 표시했습니다.";

export const AIRLINE_SIMPLE_TAX_RATE = 0.22;
```

## 7. UI/IA 상세

1. CalculatorHero — "항공사 5사 성과급 비교 계산기 2026 (대한항공·아시아나·제주항공·티웨이·진에어)"
2. InfoNotice — "직군별 차이 큼, 사용자 입력 기준 시뮬레이션, 대한항공-아시아나 통합 이슈 변동 가능, 조종사 비행수당 별도"
3. **aside 입력 패널**:
   - 공통: 직군 선택(조종사/객실승무원/일반직) + 연봉 입력 + 월급 입력 + 세율
   - 5사별: 성과급 방식(연봉%/월급배수/고정금액) + 지급률
4. **메인 결과**:
   - KPI 카드 4개: 최고 세후 성과급 / 5사 최대 차이 / 월평균 차이 / 최고 총보상
   - 5사 비교 결과 표 (회사·입력기준·세전·세후·월평균·총보상)
   - 가로 바 차트 (세전/세후 2개 데이터셋)
5. 직군별 보상 구조 설명 카드 (3개 직군)
6. 기업 현황 참고 표 (5사 평균연봉·직원수·매출)
7. 관련 계산기 그리드
8. SeoContent — intro 5개/800자 이상, FAQ 6개 이상

## 8. SEO 키워드 매핑

| 1차 키워드 | 2차 키워드 |
|-----------|-----------|
| 대한항공 성과급 | 대한항공 성과급 계산기, 대한항공 보너스 |
| 아시아나 성과급 | 아시아나항공 성과급, 아시아나 보너스 |
| 제주항공 성과급 | 제주항공 연봉, 제주항공 보너스 |
| 티웨이 성과급 | 티웨이항공 연봉 |
| 진에어 성과급 | 진에어 연봉, 한진그룹 LCC 성과급 |
| 항공사 성과급 비교 | LCC 성과급, 항공사 연봉 비교 2026 |

## 9. 구현 파일 목록

- `src/data/airlineBonusComparison2026.ts`
- `src/pages/tools/airline-bonus-comparison.astro`
- `public/scripts/airline-bonus-comparison.js`
- `src/styles/scss/pages/_airline-bonus-comparison.scss` (prefix: `alb-`)
- 등록: `tools.ts`, `app.scss`, `sitemap.xml`, `index.astro`

## 10. 구현 순서

1. 데이터 파일 작성 (5개사 config + 3개 직군 + profile)
2. `SimpleToolShell` 기반 페이지 구현 (레퍼런스: `telecom-bonus-comparison`)
3. 직군 선택 select → 연봉 힌트 문구 갱신 로직
4. 결과 KPI + 비교 표 + Chart.js 바 차트
5. 직군별 보상 구조 설명 섹션 + 기업 현황 참고 표
6. SeoContent + 등록 + `npm run build`

> 레퍼런스: `telecom-bonus-comparison` (5사 → 5사 동일 구조, prefix만 `alb-`로 변경)

## 11. QA/리스크

- 대한항공-아시아나 통합 이슈: 특정 완료 시점 단정 금지, "현재 진행 상황은 변동될 수 있음" 표현 사용
- 조종사는 비행수당·노선수당 등 성과급 외 변동 보상이 크므로 "현금 성과급만 비교" 명시
- LCC 3사(제주·티웨이·진에어) 데이터 불확실성 높음 → 추정 배지 + 안내 문구 필수
- 회사별 우열 단정 표현 지양 (중립 톤 유지)
