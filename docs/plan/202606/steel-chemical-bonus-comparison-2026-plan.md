# 철강·화학 대기업 성과급 비교 2026 기획

## 1. 배경 및 목적

- **계기**: 포스코·LG화학·롯데케미칼·한화솔루션 등 철강·화학 업종은 업황(중국 공급과잉, 석유화학 다운사이클 등)에 따라 성과급 변동이 큰 업종으로, 관련 검색 수요가 존재. 현재 사이트에 철강/화학 업종 비교 콘텐츠 없음
- **목적**:
  1. "포스코 성과급", "LG화학 성과급", "롯데케미칼 성과급" 등 키워드 SEO 트래픽 확보
  2. 1순위 `posco-bonus-calculator`(단독)와 연계되는 업종 비교 콘텐츠로 허브-상세 구조 형성
  3. `corporate-bonus-comparison-2026`, `semiconductor-bonus-comparison`과 함께 "업종별 성과급" 시리즈 완성
- **타겟 사용자**: 철강·화학 업종 재직자/이직 준비자, 관련주 투자자

## 2. 콘텐츠 성격 및 데이터 신뢰성 원칙

- 철강·화학 업종은 최근 다운사이클(공급과잉, 수요 둔화) 영향을 받는 업황이므로, "최근 업황 부진으로 성과급 규모가 줄어드는 추세일 수 있다"는 점을 중립적으로 안내
- 4사(포스코·LG화학·롯데케미칼·한화솔루션) 비교 + 사용자 입력 기준 시뮬레이션

## 3. 페이지 구조 (1페이지, 비교형 계산기)

| 유형 | 슬러그 | 설명 |
|---|---|---|
| 계산기(Tool) | `tools/steel-chemical-bonus-comparison` | 포스코/LG화학/롯데케미칼/한화솔루션 4사 비교, 연봉 입력 → 성과급 추정 비교 |

레이아웃: `CompareToolShell` (4사 비교, 모바일 아코디언)

## 4. 데이터 스키마 (`src/data/steelChemicalBonusComparison2026.ts`)

```ts
export type SteelChemicalCompanyId = "posco" | "lgChem" | "lotteChem" | "hanwhaSolutions";
export type BonusInputMode = "salaryPercent" | "monthlyMultiple" | "fixedAmount";
export type SteelChemicalGroup = "steel" | "chemical";

export interface SteelChemicalCompanyConfig {
  id: SteelChemicalCompanyId;
  name: string;
  group: SteelChemicalGroup;
  defaultMode: BonusInputMode;
  defaultSalaryPercent: number;
  defaultMonthlyMultiple: number;
  structureSummary: string;
  cycleNote: string;       // 업황 사이클 관련 참고 설명
  caution: string;
  detailHref?: string;     // 포스코는 단독 계산기로 연결
}

export const STEEL_CHEMICAL_COMPANIES: SteelChemicalCompanyConfig[] = [
  {
    id: "posco", name: "포스코", group: "steel",
    defaultMode: "salaryPercent", defaultSalaryPercent: 15, defaultMonthlyMultiple: 1.5,
    structureSummary: "PI·PS 등 생산성/이익배분 기반 성과급 구조로 알려져 있습니다.",
    cycleNote: "글로벌 철강 공급과잉 국면에서는 성과급 규모가 줄어들 수 있는 것으로 알려져 있습니다 (참고용).",
    caution: "사업부, 평가, 노사 협의에 따라 달라질 수 있습니다.",
    detailHref: "/tools/posco-bonus-calculator/",
  },
  {
    id: "lgChem", name: "LG화학", group: "chemical",
    defaultMode: "salaryPercent", defaultSalaryPercent: 15, defaultMonthlyMultiple: 1.5,
    structureSummary: "LG그룹 공통 성과급 기준 + 사업부(배터리/석유화학) 실적 연동 구조로 알려져 있습니다.",
    cycleNote: "석유화학 업황 둔화 시 사업부별 성과급 차이가 커질 수 있는 것으로 알려져 있습니다 (참고용).",
    caution: "사업부(석유화학/배터리소재 등)별 차이가 클 수 있습니다.",
  },
  {
    id: "lotteChem", name: "롯데케미칼", group: "chemical",
    defaultMode: "salaryPercent", defaultSalaryPercent: 10, defaultMonthlyMultiple: 1,
    structureSummary: "그룹 성과급 기준과 석유화학 부문 실적에 연동된 구조로 알려져 있습니다.",
    cycleNote: "최근 석유화학 다운사이클 영향으로 성과급 지급 여부가 변동될 수 있는 것으로 알려져 있습니다 (참고용).",
    caution: "사업 실적에 따라 지급 여부·규모가 크게 달라질 수 있습니다.",
  },
  {
    id: "hanwhaSolutions", name: "한화솔루션", group: "chemical",
    defaultMode: "salaryPercent", defaultSalaryPercent: 12, defaultMonthlyMultiple: 1.2,
    structureSummary: "그룹 성과급 기준과 케미칼/에너지(태양광 등) 부문 실적에 연동된 구조로 알려져 있습니다.",
    cycleNote: "태양광/케미칼 부문별 업황 차이로 사업부 간 차이가 클 수 있는 것으로 알려져 있습니다 (참고용).",
    caution: "사업부(케미칼/큐셀 등)별 차이가 클 수 있습니다.",
  },
];

export const STEEL_CHEMICAL_SIMPLE_TAX_RATE = 0.22;
export const STEEL_CHEMICAL_GROUP_LABELS: Record<SteelChemicalGroup, string> = {
  steel: "철강",
  chemical: "화학",
};

export interface FaqItem { question: string; answer: string; }
export const STEEL_CHEMICAL_BONUS_FAQ: FaqItem[] = [ /* 5개 이상 */ ];

export interface RelatedLink { href: string; label: string; description: string; }
export const STEEL_CHEMICAL_RELATED_LINKS: RelatedLink[] = [
  { href: "/tools/posco-bonus-calculator/", label: "포스코 성과급 계산기", description: "..." },
  { href: "/reports/corporate-bonus-comparison-2026/", label: "대기업 성과급 비교 리포트", description: "..." },
  { href: "/tools/semiconductor-bonus-comparison/", label: "반도체 성과급 비교", description: "..." },
];
```

## 5. UI/IA 상세

1. CalculatorHero — "철강·화학 대기업 성과급 비교 계산기 2026 — 포스코·LG화학·롯데케미칼·한화솔루션"
2. InfoNotice — "업황 사이클에 따른 변동성, 사용자 입력 기준 시뮬레이션" 고지
3. 입력 패널 — 연봉(공통 1회 입력) + 4사 성과급률 슬라이더 + 그룹(철강/화학) 필터 토글
4. 결과 비교 카드 (4사, 모바일 아코디언) — 성과급 추정액(세전/세후), 연봉 대비 비율
5. 4사 비교 바 차트 (그룹별 색상 구분)
6. 업황 사이클 설명 섹션 — `cycleNote` 4사 정리
7. 포스코 단독 계산기 CTA (`detailHref`)
8. 관련 링크 그리드
9. SeoContent — intro 5개 이상/800자 이상, FAQ 5개 이상

## 6. SEO 키워드 매핑

| 1차 키워드 | 2차 키워드 |
|---|---|
| 철강 화학 성과급 비교 | LG화학 성과급, 롯데케미칼 성과급, 한화솔루션 성과급 |
| 포스코 성과급 | (단독 계산기로 내부 링크) |

## 7. 구현 파일 목록

- `src/data/steelChemicalBonusComparison2026.ts`
- `src/pages/tools/steel-chemical-bonus-comparison.astro`
- `public/scripts/steel-chemical-bonus-comparison.js`
- `src/styles/scss/pages/_steel-chemical-bonus-comparison.scss` (prefix: `scb-`)
- 등록: `tools.ts`, `app.scss`, `sitemap.xml`, `index.astro`

## 8. 구현 순서

1. 데이터 파일 작성 (4개사 config, 포스코 계산기와 데이터 정합성 확인)
2. `CompareToolShell` 4사 비교 페이지 구현 (그룹 필터 포함)
3. 비교 차트 구현 (그룹별 색상)
4. 업황 사이클 설명 섹션 작성
5. 포스코 단독 계산기와 상호 링크 연결
6. SeoContent 작성 + 등록 + `npm run build`

## 9. QA/리스크

- `posco-bonus-calculator`(1순위)와 기본값(성과급률 등) 불일치 시 사용자 혼란 → 두 페이지 기본값 동일하게 맞출 것
- "업황 부진" 관련 서술이 특정 기업의 실적을 단정적으로 평가하지 않도록 일반론 + "알려져 있다" 톤 유지
- 철강(1개사) vs 화학(3개사) 비중 불균형에 대해 그룹 필터 UI로 균형 잡기
