# 두산에너빌리티 성과급 계산기 2026 기획

## 1. 배경 및 목적

- **계기**: 원전(SMR)·에너지 테마 강세로 "두산에너빌리티 성과급" 관련 검색 유입 가능성. 현재 사이트에 에너지/원전 업종 성과급 콘텐츠 없음
- **목적**:
  1. "두산에너빌리티 성과급", "두산에너빌리티 보너스", "두산 원전 성과급" 키워드 SEO 트래픽 확보
  2. 원전·에너지 테마 투자자 + 재직자/이직 준비자 양쪽 트래픽 확보
  3. 기존 `corporate-bonus-comparison-2026`, `bonus-after-tax-calculator`와 상호 링크 형성
- **타겟 사용자**: 두산에너빌리티 재직자/이직 준비자, 원전·SMR 테마 투자 관심층

## 2. 콘텐츠 성격 및 데이터 신뢰성 원칙

- 다른 단독 계산기와 동일하게 "사용자 입력 기준 시뮬레이션" 원칙 적용
- 두산에너빌리티는 최근 원전 수주 확대로 실적 개선 기대감이 있으나, 이는 "참고용 배경 설명"으로만 다루고 성과급 수치 예측에 직접 반영하지 않음 (과장 광고성 표현 금지)

## 3. 페이지 구조 (1페이지, 단독 계산기)

| 유형 | 슬러그 | 설명 |
|---|---|---|
| 계산기(Tool) | `tools/doosan-enerbility-bonus-calculator` | 연봉/월급 입력 → 성과급 추정 + 세후 환산 |

레이아웃: `SimpleToolShell` (samsung-bonus와 동일 구조)

## 4. 데이터 스키마 (`src/data/doosanEnerbilityBonusCalculator2026.ts`)

```ts
export type BonusInputMode = "salaryPercent" | "monthlyMultiple" | "fixedAmount";

export const DOOSAN_BONUS_DEFAULTS = {
  defaultMode: "salaryPercent" as BonusInputMode,
  defaultSalaryPercent: 15,
  defaultMonthlyMultiple: 1.5,
  defaultFixedAmount: 0,
  structureSummary: "사업 부문(원전·에너지·건설 등) 실적과 그룹 평가 기준에 연동되는 성과급 구조로 알려져 있습니다.",
  caution: "사업부, 직급, 평가 결과, 노사 협의에 따라 실제 금액이 달라질 수 있습니다.",
  industryNote: "최근 원전(SMR) 관련 수주 확대가 보도되고 있으나, 이는 일반 동향 참고 정보이며 성과급 지급률을 보장하지 않습니다.",
};

export const DOOSAN_SIMPLE_TAX_RATE = 0.22;

export interface FaqItem { question: string; answer: string; }
export const DOOSAN_BONUS_FAQ: FaqItem[] = [ /* 5개 이상 */ ];

export interface RelatedLink { href: string; label: string; description: string; }
export const DOOSAN_RELATED_LINKS: RelatedLink[] = [
  { href: "/reports/corporate-bonus-comparison-2026/", label: "대기업 성과급 비교 리포트", description: "..." },
  { href: "/tools/bonus-after-tax-calculator/", label: "성과급 세후 계산기", description: "..." },
  { href: "/tools/semiconductor-bonus-comparison/", label: "반도체 성과급 비교", description: "..." },
];
```

## 5. UI/IA 상세

1. CalculatorHero — "두산에너빌리티 성과급 계산기 2026"
2. InfoNotice — "사용자 입력 기준 시뮬레이션, 공식 발표 자료 아님" + 사업 부문별 차이 고지
3. 입력 패널 — 연봉/월급, 입력 모드(성과급률/배수/직접입력), 세금 모드(간이/직접)
4. 결과 KPI — 성과급 추정액(세전/세후), 연봉 대비 비율, 월급 환산
5. 성과급률 시나리오 비교 표 (10/15/20/25/30%)
6. 업종 배경 설명 섹션 — 원전/에너지 사업 구조, `industryNote` (과장 없는 참고 정보)
7. 관련 링크 그리드
8. SeoContent — intro 5개 이상/800자 이상, FAQ 5개 이상

## 6. SEO 키워드 매핑

| 1차 키워드 | 2차 키워드 |
|---|---|
| 두산에너빌리티 성과급 | 두산에너빌리티 성과급 계산기, 두산 원전 성과급, 두산에너빌리티 보너스 |

## 7. 구현 파일 목록

- `src/data/doosanEnerbilityBonusCalculator2026.ts`
- `src/pages/tools/doosan-enerbility-bonus-calculator.astro`
- `public/scripts/doosan-enerbility-bonus-calculator.js`
- `src/styles/scss/pages/_doosan-enerbility-bonus-calculator.scss` (prefix: `dbc-`)
- 등록: `tools.ts`, `app.scss`, `sitemap.xml`, `index.astro`

## 8. 구현 순서

1. 데이터 파일 작성
2. 페이지/스크립트/스타일 구현 (포스코 계산기 코드 구조 재사용)
3. SeoContent 작성 (업종 배경 설명에 원전/에너지 관련 사실 위주로, 추정성 발언 배제)
4. 등록 + `npm run build`

## 9. QA/리스크

- 원전(SMR) 테마 관련 문구가 "투자 권유"로 읽히지 않도록 사실 위주 서술 + "참고용" 명시
- 다른 성과급 계산기와 톤/구조 일관성 유지
- 회사명 표기 일관성("두산에너빌리티" vs "두산에너빌리티(주)") 확인
