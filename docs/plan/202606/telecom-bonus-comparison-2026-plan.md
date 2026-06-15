# 통신 3사(KT·SKT·LG유플러스) 성과급 비교 2026 기획

## 1. 배경 및 목적

- **계기**: 통신 3사는 매년 실적 발표 후 성과급(PS) 이슈가 반복적으로 뉴스화되며, "KT 성과급", "SKT 성과급", "LG유플러스 성과급" 검색 수요가 꾸준함. 현재 사이트에 통신 업종 비교 콘텐츠 없음
- **목적**:
  1. "통신사 성과급 비교", "KT SKT LG유플러스 성과급" 등 키워드 SEO 트래픽 확보
  2. `corporate-bonus-comparison-2026`, `finance-bonus-comparison`과 함께 "업종별 성과급 비교" 시리즈 완성
  3. 통신 3사 재직자/이직 준비자 + 통신주 투자자 트래픽 확보
- **타겟 사용자**: 통신 3사 재직자, 이직 준비자, 통신주 투자자

## 2. 콘텐츠 성격 및 데이터 신뢰성 원칙

- 통신 3사 PS(이익배분)는 매년 실적과 노사 합의에 따라 % 또는 기본급 배수로 발표되는 경우가 있으나, 연도별 변동이 크므로 "최근 추세 참고용"으로만 안내
- `semiconductor-bonus-comparison`과 동일하게 3사 동시 비교 + 사용자 입력 기준 시뮬레이션

## 3. 페이지 구조 (1페이지, 비교형 계산기)

| 유형 | 슬러그 | 설명 |
|---|---|---|
| 계산기(Tool) | `tools/telecom-bonus-comparison` | KT/SKT/LG유플러스 3사 동시 비교, 연봉 입력 → 성과급 추정 비교 |

레이아웃: `CompareToolShell` (3열 비교, 모바일에서는 탭/아코디언 전환)

## 4. 데이터 스키마 (`src/data/telecomBonusComparison2026.ts`)

```ts
export type TelecomCompanyId = "kt" | "skt" | "lguplus";
export type BonusInputMode = "salaryPercent" | "monthlyMultiple" | "fixedAmount";

export interface TelecomCompanyConfig {
  id: TelecomCompanyId;
  name: string;
  shortName: string;
  defaultMode: BonusInputMode;
  defaultSalaryPercent: number;
  defaultMonthlyMultiple: number;
  structureSummary: string;  // PS(이익배분) 구조 설명
  caution: string;
}

export const TELECOM_COMPANIES: TelecomCompanyConfig[] = [
  {
    id: "kt", name: "KT", shortName: "KT",
    defaultMode: "salaryPercent", defaultSalaryPercent: 13, defaultMonthlyMultiple: 1.3,
    structureSummary: "그룹 경영 실적과 평가 결과에 따른 PS(성과급) 구조로 알려져 있습니다.",
    caution: "직군(본사/계열사), 평가, 노사 합의에 따라 실제 금액이 달라질 수 있습니다.",
  },
  {
    id: "skt", name: "SK텔레콤", shortName: "SKT",
    defaultMode: "salaryPercent", defaultSalaryPercent: 15, defaultMonthlyMultiple: 1.5,
    structureSummary: "SK그룹 평가 기준에 따른 PS·격려금 구조로 알려져 있습니다.",
    caution: "그룹 공통 기준과 개인/조직 평가에 따라 실제 금액이 달라질 수 있습니다.",
  },
  {
    id: "lguplus", name: "LG유플러스", shortName: "LG유플러스",
    defaultMode: "salaryPercent", defaultSalaryPercent: 12, defaultMonthlyMultiple: 1.2,
    structureSummary: "LG그룹 공통 성과급 기준에 따른 구조로 알려져 있습니다.",
    caution: "그룹 공통 기준과 개인/조직 평가에 따라 실제 금액이 달라질 수 있습니다.",
  },
];

export const TELECOM_SIMPLE_TAX_RATE = 0.22;

export interface FaqItem { question: string; answer: string; }
export const TELECOM_BONUS_FAQ: FaqItem[] = [ /* 5개 이상 */ ];

export interface RelatedLink { href: string; label: string; description: string; }
export const TELECOM_RELATED_LINKS: RelatedLink[] = [
  { href: "/reports/corporate-bonus-comparison-2026/", label: "대기업 성과급 비교 리포트", description: "..." },
  { href: "/tools/finance-bonus-comparison/", label: "금융권 성과급 비교", description: "..." },
  { href: "/tools/bonus-after-tax-calculator/", label: "성과급 세후 계산기", description: "..." },
];
```

## 5. UI/IA 상세

1. CalculatorHero — "KT·SKT·LG유플러스 성과급 비교 계산기 2026"
2. InfoNotice — "사용자 입력 기준 시뮬레이션, 연도별 변동 큼" 고지
3. 입력 패널 — 연봉(공통 1회 입력) + 3사 성과급률(%) 개별 슬라이더 (기본값은 회사별 차등)
4. 결과 비교 카드 (3열 또는 모바일 아코디언)
   - 각 사: 성과급 추정액(세전/세후), 연봉 대비 비율
5. 3사 비교 바 차트
6. PS 구조 설명 섹션 — 3사 `structureSummary` 정리 표
7. 관련 링크 그리드
8. SeoContent — intro 5개 이상/800자 이상 (통신 3사 PS 제도 일반 설명, 연도별 변동성 강조), FAQ 5개 이상

## 6. SEO 키워드 매핑

| 1차 키워드 | 2차 키워드 |
|---|---|
| 통신사 성과급 비교 | KT 성과급, SKT 성과급, LG유플러스 성과급 |
| 통신 3사 성과급 | 통신사 PS 계산기 |

## 7. 구현 파일 목록

- `src/data/telecomBonusComparison2026.ts`
- `src/pages/tools/telecom-bonus-comparison.astro`
- `public/scripts/telecom-bonus-comparison.js`
- `src/styles/scss/pages/_telecom-bonus-comparison.scss` (prefix: `tbc-`)
- 등록: `tools.ts`, `app.scss`, `sitemap.xml`, `index.astro`

## 8. 구현 순서

1. 데이터 파일 작성 (3개사 config)
2. `CompareToolShell` 3열 비교 페이지 구현 (모바일 아코디언 처리)
3. 비교 차트(Chart.js bar, 3사) 구현
4. SeoContent 작성 + 등록 + `npm run build`

## 9. QA/리스크

- 3사 동시 비교 시 모바일 가로 스크롤/아코디언 가독성 확인 (`semiconductor-bonus-comparison` 모바일 패턴 참고)
- "PS 구조 설명"이 특정 회사를 우대/비방하는 톤이 되지 않도록 동일한 분량/형식 유지
- 연도별 변동성이 큰 항목이므로 "최근 추세" 표현에 구체적 연도/수치를 단정하지 않음
