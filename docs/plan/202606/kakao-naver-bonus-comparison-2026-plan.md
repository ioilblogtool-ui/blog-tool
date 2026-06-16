# 국내 빅테크 5사 성과급 비교 계산기 2026 기획

> 기존 카카오·네이버 2사 기획에서 토스·라인·쿠팡을 추가해 5사 비교로 확장 (2026-06-16 업데이트)

## 1. 배경 및 목적

- **계기**: 카카오·네이버 외에 토스(비바리퍼블리카)·라인플러스·쿠팡이 국내 IT 업계 보상 비교 검색의 주요 대상으로 부상. "토스 성과급", "쿠팡 성과급", "라인 연봉" 등 독립 키워드 검색량 확보 가능
- **목적**:
  1. 국내 주요 빅테크 5사 성과급을 동일 연봉 기준으로 비교하는 단일 계산기 페이지 제공
  2. "카카오 성과급", "네이버 성과급", "토스 성과급", "쿠팡 성과급", "라인 연봉" 키워드 SEO 트래픽 통합 확보
  3. 기존 `it-platform-bonus-comparison`, `it-salary-top10`과 상호 링크
- **타겟 사용자**: 국내 빅테크 재직자·이직 준비자, IT 업계 보상 구조 관심층

## 2. 콘텐츠 성격 및 데이터 신뢰성 원칙

- 5개사 모두 성과급 외에 스톡옵션/RSU 등 비정형 보상이 혼재 → **현금성 성과급 시뮬레이션**에 집중하고, 스톡 보상은 정성적 설명 섹션으로 별도 분리
- 통신 3사 비교(`telecom-bonus-comparison`) 구조를 레퍼런스로 삼아 `SimpleToolShell` + aside 패널 방식 적용
- 모든 수치는 "추정·시뮬레이션" 레이블 명시

## 3. 페이지 구성

| 유형 | 슬러그 | 설명 |
|------|--------|------|
| 계산기(Tool) | `tools/it-bigtech-bonus-comparison` | 5사 동시 비교, 연봉 입력 → 회사별 성과급 세전·세후 비교 |

레이아웃: `SimpleToolShell` (aside에 5개 회사 패널, 메인에 결과 KPI + 표 + 차트)

## 4. 비교 대상 5사 및 기본값

| 회사 | id | 기본 지급률 | 특이사항 |
|------|----|------------|---------|
| 카카오 | `kakao` | 연봉 대비 15% | 계열사(카카오뱅크·페이 등)별 편차 큼 |
| 네이버 | `naver` | 연봉 대비 15% | 스톡그랜트 병행, 본사/계열사 차이 |
| 토스(비바리퍼블리카) | `toss` | 연봉 대비 20% | 연봉 자체 고수준, 스톡옵션 비중 높음 |
| 라인플러스 | `line` | 연봉 대비 12% | 일본 본사 연동, 국내법인 기준 |
| 쿠팡 | `coupang` | 연봉 대비 10% | 미국 상장사, RSU 비중 큼, 직군별 편차 큼 |

> 기본값은 보도·업계 추정 기반이며 실제와 다를 수 있음

## 5. 데이터 스키마 (`src/data/itBigtechBonusComparison2026.ts`)

```ts
export type BigtechCompanyId = "kakao" | "naver" | "toss" | "line" | "coupang";
export type BonusInputMode = "salaryPercent" | "monthlyMultiple" | "fixedAmount";
export type EvidenceBadge = "추정" | "시뮬레이션" | "사용자 입력 기준";

export interface BigtechCompanyConfig {
  id: BigtechCompanyId;
  name: string;
  shortName: string;
  defaultMode: BonusInputMode;
  defaultSalaryPercent: number;
  defaultMonthlyMultiple: number;
  defaultFixedAmount: number;
  structureSummary: string;   // 현금 성과급 구조 설명
  stockNote: string;          // 스톡옵션/RSU 정성 설명
  caution: string;
  badges: EvidenceBadge[];
}

export const BIGTECH_COMPANIES: BigtechCompanyConfig[] = [
  {
    id: "kakao", name: "카카오", shortName: "카카오",
    defaultMode: "salaryPercent", defaultSalaryPercent: 15, defaultMonthlyMultiple: 1.5, defaultFixedAmount: 0,
    structureSummary: "사업부·계열사별 성과에 따른 현금 성과급(PS) 구조로 알려져 있습니다.",
    stockNote: "직군·연차에 따라 스톡옵션이 부여되는 경우가 있으나 대상·규모는 개별 계약에 따라 다릅니다.",
    caution: "카카오뱅크·카카오페이 등 계열사별로 보상 구조가 다를 수 있습니다.",
    badges: ["추정", "시뮬레이션"],
  },
  {
    id: "naver", name: "네이버", shortName: "네이버",
    defaultMode: "salaryPercent", defaultSalaryPercent: 15, defaultMonthlyMultiple: 1.5, defaultFixedAmount: 0,
    structureSummary: "사업 성과 및 개인 평가에 따른 현금 성과급(인센티브) 구조로 알려져 있습니다.",
    stockNote: "스톡그랜트(주식 보상) 프로그램을 운영한 사례가 있으며 대상·규모는 시기별로 다릅니다.",
    caution: "네이버웹툰·네이버클라우드 등 계열사별로 보상 구조가 다를 수 있습니다.",
    badges: ["추정", "시뮬레이션"],
  },
  {
    id: "toss", name: "토스(비바리퍼블리카)", shortName: "토스",
    defaultMode: "salaryPercent", defaultSalaryPercent: 20, defaultMonthlyMultiple: 2.0, defaultFixedAmount: 0,
    structureSummary: "연봉 자체가 업계 상위 수준이며 성과 기반 현금 보너스 구조로 알려져 있습니다.",
    stockNote: "초기 입사자 중심으로 스톡옵션이 부여된 사례가 많으며, 최근에는 RSU 방식도 병행하는 것으로 알려져 있습니다.",
    caution: "비상장사로 스톡옵션 행사 가능 시기·가치는 불확실하며, 직군·연차별 편차가 큽니다.",
    badges: ["추정", "시뮬레이션"],
  },
  {
    id: "line", name: "라인플러스", shortName: "라인",
    defaultMode: "salaryPercent", defaultSalaryPercent: 12, defaultMonthlyMultiple: 1.2, defaultFixedAmount: 0,
    structureSummary: "일본 본사(LY Corporation) 실적 연동 구조이며, 국내법인(라인플러스) 기준 현금 성과급이 지급됩니다.",
    stockNote: "일본 본사 주식 기반 보상(RSU)이 부여되는 경우가 있으며 환율 변동에 따라 실수령액이 달라질 수 있습니다.",
    caution: "본사 실적과 환율 영향을 받으므로 연도별 편차가 클 수 있습니다.",
    badges: ["추정", "시뮬레이션"],
  },
  {
    id: "coupang", name: "쿠팡", shortName: "쿠팡",
    defaultMode: "salaryPercent", defaultSalaryPercent: 10, defaultMonthlyMultiple: 1.0, defaultFixedAmount: 0,
    structureSummary: "미국 상장사(NYSE: CPNG)로 현금 성과급보다 RSU(양도제한조건부주식) 비중이 높은 구조입니다.",
    stockNote: "입사 시 RSU 부여가 일반적이며 Vesting 스케줄(보통 4년)에 따라 주식이 지급됩니다. 주가 변동에 따라 실수령 가치가 달라집니다.",
    caution: "직군(개발/물류/운영)별로 보상 구조 차이가 매우 크며, 현금 성과급만으로 비교하면 실질 보상을 과소평가할 수 있습니다.",
    badges: ["추정", "시뮬레이션"],
  },
];

export const BIGTECH_SIMPLE_TAX_RATE = 0.22;

export interface BigtechCompanyProfile {
  id: BigtechCompanyId;
  averageSalary: string;
  employeeCount: string;
  stockType: string;       // 스톡 보상 유형
  recentBonus: string;
}

export const BIGTECH_COMPANY_PROFILES: BigtechCompanyProfile[] = [
  { id: "kakao",   averageSalary: "약 1억 1,000만 원", employeeCount: "약 3,800명", stockType: "스톡옵션",      recentBonus: "비공개" },
  { id: "naver",   averageSalary: "약 1억 3,000만 원", employeeCount: "약 4,500명", stockType: "스톡그랜트",    recentBonus: "비공개" },
  { id: "toss",    averageSalary: "약 1억 5,000만 원 이상", employeeCount: "약 2,000명", stockType: "스톡옵션/RSU", recentBonus: "비공개" },
  { id: "line",    averageSalary: "약 1억 원",          employeeCount: "약 1,000명", stockType: "본사 RSU(엔화)", recentBonus: "비공개" },
  { id: "coupang", averageSalary: "약 1억 원 이상",     employeeCount: "약 5,000명(본사)", stockType: "RSU(USD)", recentBonus: "비공개" },
];
```

## 6. UI/IA 상세

1. CalculatorHero — "국내 빅테크 5사 성과급 비교 계산기 2026 (카카오·네이버·토스·라인·쿠팡)"
2. InfoNotice — "사용자 입력 기준 시뮬레이션, 계열사·직군별 차이 존재, 스톡 보상 미포함"
3. **aside** — 공통 연봉 입력 + 5개 회사 패널 (각 패널: 입력 모드 선택 + 지급률/개월수/고정금액)
4. **메인 결과 영역**
   - KPI 카드 3개: 세후 최고 성과급 / 5사 간 최대 차이 / 총보상 최고
   - 비교 결과 표 (회사별 세전·세후·월환산·총보상)
   - 가로 바 차트 (세전/세후 2개 데이터셋)
5. 스톡 보상 설명 섹션 — 5사 스톡 유형 정성 비교 (수치화 없음)
6. 기업 현황 참고 표 — 평균연봉·직원수·스톡 유형
7. 관련 계산기 그리드
8. SeoContent — intro 5개/800자 이상, FAQ 5개 이상

## 7. SEO 키워드 매핑

| 1차 키워드 | 2차 키워드 |
|-----------|-----------|
| 카카오 성과급 | 카카오 성과급 계산기, 카카오 연봉 |
| 네이버 성과급 | 네이버 성과급 계산기, 네이버 스톡그랜트 |
| 토스 성과급 | 토스 연봉, 비바리퍼블리카 성과급 |
| 쿠팡 성과급 | 쿠팡 RSU, 쿠팡 연봉 |
| 라인 연봉 | 라인플러스 성과급, 라인 RSU |
| 빅테크 성과급 비교 | IT 플랫폼 성과급 비교 2026 |

## 8. 구현 파일 목록

- `src/data/itBigtechBonusComparison2026.ts`
- `src/pages/tools/it-bigtech-bonus-comparison.astro`
- `public/scripts/it-bigtech-bonus-comparison.js`
- `src/styles/scss/pages/_it-bigtech-bonus-comparison.scss` (prefix: `ibb-`)
- 등록: `tools.ts`, `app.scss`, `sitemap.xml`, `index.astro`

## 9. 구현 순서

1. 데이터 파일 작성 (5개사 config + profile)
2. `SimpleToolShell` 기반 페이지 구현 — aside에 5개 회사 패널
3. 결과 KPI + 비교 표 구현
4. Chart.js 가로 바 차트 구현
5. 스톡 보상 설명 섹션 + 기업 현황 참고 표
6. SeoContent 작성 + 등록 + `npm run build`

> 레퍼런스: `telecom-bonus-comparison` 구조와 동일하게 진행

## 10. QA/리스크

- 스톡옵션/RSU 수치화 금지 → 정성 설명으로 한정
- 쿠팡은 현금 성과급 비중이 낮으므로 현금만 비교하면 과소평가 가능성 → 안내 문구 필수
- 계열사 편차 고지 (카카오, 네이버)
- 토스는 비상장이므로 스톡옵션 행사 가능성 불확실 → 명시
- 라인은 엔화 환율 영향 → 명시
