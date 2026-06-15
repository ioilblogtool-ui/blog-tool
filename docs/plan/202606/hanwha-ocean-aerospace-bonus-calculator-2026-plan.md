# 한화오션·한화에어로스페이스 성과급 계산기 2026 기획

## 1. 배경 및 목적

- **계기**: 조선(한화오션)·방산(한화에어로스페이스) 업황 호조로 "한화오션 성과급", "한화에어로스페이스 성과급" 검색 유입 가능성 상승. 기존 `shipbuildingBonusComparison.ts`에 한화오션이 포함되어 있을 수 있으나, 단독 상세 계산기는 부재
- **목적**:
  1. "한화오션 성과급", "한화에어로스페이스 성과급", "한화오션 보너스" 키워드 SEO 트래픽 확보
  2. 조선·방산 호황 테마(주가, 수주 증가) 관심층을 성과급 콘텐츠로 연결
  3. `shipbuilding-bonus-comparison` 비교 콘텐츠에서 상세 페이지로 연결되는 허브-상세 구조 완성
- **타겟 사용자**: 한화오션/한화에어로스페이스 재직자·이직 준비자, 조선·방산 업종 투자자

## 2. 콘텐츠 성격 및 데이터 신뢰성 원칙

- 두 회사를 한 페이지에서 탭으로 전환하는 구조 (단일 회사 페이지 2개 대신 효율적으로 묶음)
- 성과급(PS, 격려금 등)은 비공개·가변적 → "사용자 입력 기준 시뮬레이션" 원칙, `semiconductor-bonus-comparison`과 동일한 톤

## 3. 페이지 구조 (1페이지, 탭형 단독 계산기)

| 유형 | 슬러그 | 설명 |
|---|---|---|
| 계산기(Tool) | `tools/hanwha-bonus-calculator` | 한화오션/한화에어로스페이스 탭 선택 → 성과급 추정 + 세후 환산 |

레이아웃: `SimpleToolShell` + 탭(2개 회사) — 탭 전환 시 기본 입력값(`defaultSalaryPercent` 등)만 교체

## 4. 데이터 스키마 (`src/data/hanwhaBonusCalculator2026.ts`)

```ts
export type HanwhaCompanyId = "hanwhaOcean" | "hanwhaAerospace";
export type BonusInputMode = "salaryPercent" | "monthlyMultiple" | "fixedAmount";

export interface HanwhaCompanyConfig {
  id: HanwhaCompanyId;
  name: string;            // "한화오션" / "한화에어로스페이스"
  industryTag: string;     // "조선" / "방산"
  defaultMode: BonusInputMode;
  defaultSalaryPercent: number;
  defaultMonthlyMultiple: number;
  structureSummary: string; // "수주·실적 기반 PS 성과급 구조로 알려져 있습니다."
  caution: string;
  recentTrendNote: string;  // "최근 수주 증가/실적 개선 추세" 등 참고 문구 (추정 명시)
}

export const HANWHA_COMPANIES: HanwhaCompanyConfig[] = [
  {
    id: "hanwhaOcean", name: "한화오션", industryTag: "조선",
    defaultMode: "salaryPercent", defaultSalaryPercent: 15, defaultMonthlyMultiple: 1.5,
    structureSummary: "조선 업황·수주 실적에 연동되는 PS 성과급 구조로 알려져 있습니다.",
    caution: "사업부, 직급, 평가 결과에 따라 실제 금액이 달라질 수 있습니다.",
    recentTrendNote: "최근 수주 호조로 업계 성과급 기대감이 높아진 추세로 보입니다 (참고용).",
  },
  {
    id: "hanwhaAerospace", name: "한화에어로스페이스", industryTag: "방산",
    defaultMode: "salaryPercent", defaultSalaryPercent: 20, defaultMonthlyMultiple: 2,
    structureSummary: "방산 수출 실적·이익 목표 달성에 따른 PS 성과급 구조로 알려져 있습니다.",
    caution: "사업부, 직급, 평가 결과에 따라 실제 금액이 달라질 수 있습니다.",
    recentTrendNote: "방산 수출 확대에 따라 실적 개선 기대감이 반영될 수 있습니다 (참고용).",
  },
];

export const HANWHA_SIMPLE_TAX_RATE = 0.22;
export interface FaqItem { question: string; answer: string; }
export const HANWHA_BONUS_FAQ: FaqItem[] = [ /* 5개 이상, 두 회사 모두 포함 */ ];
```

## 5. UI/IA 상세

1. CalculatorHero — "한화오션·한화에어로스페이스 성과급 계산기 2026"
2. 회사 탭 (2개) — 선택 시 입력 기본값/설명 전환
3. InfoNotice — "사용자 입력 기준 시뮬레이션, 공식 발표 자료 아님" + 업종 특성(조선/방산 수주 사이클) 설명
4. 입력 패널 — 연봉/월급, 입력 모드(성과급률/배수/직접입력), 세금 모드
5. 결과 KPI — 성과급 추정액(세전/세후), 연봉 대비 비율, 월급 환산
6. 성과급률 시나리오 비교 표 (10/15/20/25/30%)
7. 업종 특이사항 섹션 — `recentTrendNote`, `structureSummary` (조선 vs 방산 사이클 차이 설명)
8. 관련 링크 — `/tools/shipbuilding-bonus-comparison/`, `/reports/corporate-bonus-comparison-2026/`, `/tools/bonus-after-tax-calculator/`
9. SeoContent — intro 5개 이상/800자 이상 (두 회사 업종 차이 설명 포함), FAQ 5개 이상

## 6. SEO 키워드 매핑

| 1차 키워드 | 2차 키워드 |
|---|---|
| 한화오션 성과급 | 한화오션 성과급 계산기, 한화오션 보너스 |
| 한화에어로스페이스 성과급 | 한화에어로스페이스 성과급 계산기, 한화 방산 보너스 |

## 7. 구현 파일 목록

- `src/data/hanwhaBonusCalculator2026.ts`
- `src/pages/tools/hanwha-bonus-calculator.astro`
- `public/scripts/hanwha-bonus-calculator.js`
- `src/styles/scss/pages/_hanwha-bonus-calculator.scss` (prefix: `hbc-`)
- 등록: `tools.ts`, `app.scss`, `sitemap.xml`, `index.astro`

## 8. 구현 순서

1. 데이터 파일 작성 (2개사 config)
2. 페이지 구현 — 탭 전환 시 입력 기본값/문구 갱신 (vanilla JS, `data-tab` 속성)
3. 계산 로직 (성과급 계산기 공통 로직 재사용)
4. SeoContent FAQ/소개 작성
5. 등록 + `npm run build`

## 9. QA/리스크

- 탭 전환 시 입력값 초기화 vs 유지 정책 명확히 (전환 시 기본값으로 리셋 권장, 사용자 혼란 방지)
- 조선/방산 업종 특성 설명이 과도한 "호재성" 표현으로 흐르지 않도록 "참고용" 명시
- 두 회사 모두 동일한 톤의 면책 문구 적용
