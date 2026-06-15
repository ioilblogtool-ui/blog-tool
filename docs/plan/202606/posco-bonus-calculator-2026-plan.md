# 포스코 성과급 계산기 2026 기획

## 1. 배경 및 목적

- **계기**: "포스코 성과급", "포스코 성과급 계산기" 검색 수요가 존재하나 사이트 내에는 철강업 단독 계산기가 없음. 기존 `samsung-bonus`, `sk-hynix-bonus`, `lg-bonus`, `hyundai-bonus`와 동일한 "성과급 계산기" 패턴을 철강(포스코) 업종으로 확장
- **목적**:
  1. "포스코 성과급", "포스코 PI", "포스코 인센티브 계산" 등 키워드 SEO 트래픽 확보
  2. 기존 `semiconductor-bonus-comparison`, `corporate-bonus-comparison-2026` 등에서 포스코로 들어오는 내부 링크의 종착지(상세 계산기) 제공
  3. 포스코 직원/이직 준비자, 철강업 관심 투자자 대상 콘텐츠 확장
- **타겟 사용자**: 포스코그룹(포스코·포스코퓨처엠 등) 재직자, 입사 예정자, 성과급 시즌(보통 1~2월) 검색 유입층

## 2. 콘텐츠 성격 및 데이터 신뢰성 원칙

- 포스코의 성과급(PI: Productivity Incentive, PS: Profit Sharing 등)은 사업 실적·노사 합의에 따라 매년 달라지며 공식 지급률을 단정할 수 없음
- 따라서 `semiconductor-bonus-comparison`과 동일하게 **"사용자 입력 기준 시뮬레이션"** 원칙 적용:
  - 사용자가 본인 연봉(또는 월 기본급)과 예상 성과급률(%, 월 기본급 배수, 또는 직접 금액)을 입력
  - 결과는 "추정"/"시뮬레이션" 배지로 명확히 표기, 공식 발표 자료 아님을 InfoNotice에 고지

## 3. 페이지 구조 (1페이지, 단독 계산기)

| 유형 | 슬러그 | 설명 |
|---|---|---|
| 계산기(Tool) | `tools/posco-bonus-calculator` | 연봉/월급 입력 → PI·PS 성과급 추정 + 세후 환산 |

레이아웃: `SimpleToolShell` (samsung-bonus와 동일 구조)

## 4. 데이터 스키마 (`src/data/poscoBonusCalculator2026.ts`)

```ts
export type BonusInputMode = "salaryPercent" | "monthlyMultiple" | "fixedAmount";
export type TaxMode = "simple" | "manual";

export interface PoscoBonusTermGuide {
  term: string;          // "PI (생산성 격려금)", "PS (이익 배분)"
  meaning: string;
  payoutPeriod: string;  // 통상 지급 시기 (예: "익년 1~2월")
  caution: string;
}

export const POSCO_BONUS_DEFAULTS = {
  defaultMode: "salaryPercent" as BonusInputMode,
  defaultSalaryPercent: 15,      // 참고용 중간값, "추정" 명시
  defaultMonthlyMultiple: 1.5,
  defaultFixedAmount: 0,
};

export const POSCO_BONUS_TERMS: PoscoBonusTermGuide[] = [
  { term: "PI (생산성 격려금)", meaning: "회사/사업부 생산성 평가에 따른 성과급", payoutPeriod: "익년 초", caution: "사업 실적에 따라 지급 여부·규모가 달라질 수 있습니다." },
  { term: "PS (이익 배분제)", meaning: "연간 이익 목표 달성 시 배분되는 성과급", payoutPeriod: "익년 초", caution: "노사협의 결과에 따라 달라질 수 있습니다." },
];

export const POSCO_SIMPLE_TAX_RATE = 0.22; // 간이 추정 세율 (기존 bonusAfterTaxCalculator 참고)

export interface FaqItem { question: string; answer: string; }
export const POSCO_BONUS_FAQ: FaqItem[] = [ /* 5개 이상 */ ];

export interface RelatedLink { href: string; label: string; description: string; }
export const POSCO_RELATED_LINKS: RelatedLink[] = [
  { href: "/tools/semiconductor-bonus-comparison/", label: "반도체 성과급 비교", description: "..." },
  { href: "/tools/bonus-after-tax-calculator/", label: "성과급 세후 계산기", description: "..." },
  { href: "/reports/corporate-bonus-comparison-2026/", label: "대기업 성과급 비교 리포트", description: "..." },
];
```

## 5. UI/IA 상세

1. CalculatorHero — "포스코 성과급 계산기 2026 — PI·PS 세후 예상액"
2. InfoNotice — "공식 지급률이 아닌 사용자 입력 기준 시뮬레이션", "PI·PS는 매년 사업 실적에 따라 달라짐" 고지
3. 입력 패널 (aside)
   - 연봉 또는 월 기본급 입력
   - 입력 모드 탭: 성과급률(%) / 월급 배수 / 직접 금액
   - 세금 모드: 간이 추정(22%) / 직접 입력
4. 결과 카드 (KPI)
   - 성과급 추정액 (세전)
   - 세후 예상 수령액
   - 연봉 대비 비율(%)
   - 월급 환산 (성과급 ÷ 12, 체감 인상률 참고용)
5. 성과급률별 비교 표 — 10% / 15% / 20% / 25% / 30% 시나리오별 세전·세후 금액 자동 계산
6. PI/PS 용어 설명 섹션 (`POSCO_BONUS_TERMS`)
7. 관련 계산기 링크 그리드 (`POSCO_RELATED_LINKS`)
8. SeoContent — intro 5개 이상/800자 이상, FAQ 5개 이상

## 6. SEO 키워드 매핑

| 1차 키워드 | 2차 키워드 |
|---|---|
| 포스코 성과급 | 포스코 성과급 계산기, 포스코 PI PS, 포스코 인센티브 |

## 7. 구현 파일 목록

- `src/data/poscoBonusCalculator2026.ts`
- `src/pages/tools/posco-bonus-calculator.astro`
- `public/scripts/posco-bonus-calculator.js`
- `src/styles/scss/pages/_posco-bonus-calculator.scss` (prefix: `pbc-`)
- 등록: `src/data/tools.ts`, `src/styles/app.scss`, `public/sitemap.xml`, `src/pages/index.astro`(topicBySlug)

## 8. 구현 순서

1. 데이터 파일 작성 (`poscoBonusCalculator2026.ts`)
2. 페이지/스크립트/스타일 구현 (samsung-bonus 코드 구조 복사 후 포스코 용어로 치환)
3. SeoContent FAQ/소개 문단 작성 (800자/5문단 이상)
4. tools.ts/app.scss/sitemap.xml/index.astro 등록
5. `npm run build` 검증

## 9. QA/리스크

- 모든 금액은 "추정"/"시뮬레이션" 배지 필수, InfoNotice에 공식 자료 아님 명시
- 세율(22%) 간이 추정치임을 별도 고지 (`bonusAfterTaxCalculator` 톤 참고)
- 기존 성과급 계산기들과 UI/문구 일관성 유지
