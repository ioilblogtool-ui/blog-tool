# 게임업계 성과급 비교 2026 기획

## 1. 배경 및 목적

- **계기**: 넥슨·넷마블·엔씨소프트·크래프톤 등 게임업계는 신작 성과에 따라 성과급 규모가 크게 달라지는 업종으로, "넥슨 성과급", "크래프톤 성과급" 등 검색 수요가 주기적으로 발생. 현재 사이트에 게임업계 콘텐츠 없음
- **목적**:
  1. "게임회사 성과급", "넥슨 성과급", "크래프톤 성과급", "엔씨소프트 성과급" 키워드 SEO 트래픽 확보
  2. 게임업계 재직자/이직 준비자(개발자·기획·아트) 트래픽 확보
  3. `it-salary-top10`, `it-platform-bonus-comparison`과 "IT/콘텐츠 업계 보상" 클러스터 형성
- **타겟 사용자**: 게임업계 재직자/이직 준비자, 게임주 투자자

## 2. 콘텐츠 성격 및 데이터 신뢰성 원칙

- 게임업계는 신작 성공 여부에 따라 성과급이 0%~기본급 수백% 까지 극단적으로 차이날 수 있음 → "최근 신작 흥행 여부에 따라 변동성이 매우 크다"는 점을 핵심 메시지로 강조
- 4사(넥슨·넷마블·엔씨소프트·크래프톤) 비교 + 사용자 입력 기준 시뮬레이션, `semiconductor-bonus-comparison` 패턴

## 3. 페이지 구조 (1페이지, 비교형 계산기)

| 유형 | 슬러그 | 설명 |
|---|---|---|
| 계산기(Tool) | `tools/game-industry-bonus-comparison` | 넥슨/넷마블/엔씨소프트/크래프톤 4사 비교, 연봉 입력 → 성과급 추정 비교 |

레이아웃: `CompareToolShell` (4사 비교, 모바일 아코디언)

## 4. 데이터 스키마 (`src/data/gameIndustryBonusComparison2026.ts`)

```ts
export type GameCompanyId = "nexon" | "netmarble" | "ncsoft" | "krafton";
export type BonusInputMode = "salaryPercent" | "monthlyMultiple" | "fixedAmount";

export interface GameCompanyConfig {
  id: GameCompanyId;
  name: string;
  defaultMode: BonusInputMode;
  defaultSalaryPercent: number;
  defaultMonthlyMultiple: number;
  structureSummary: string;
  volatilityNote: string;  // "신작 성과에 따른 변동성" 설명
  caution: string;
}

export const GAME_COMPANIES: GameCompanyConfig[] = [
  {
    id: "nexon", name: "넥슨",
    defaultMode: "salaryPercent", defaultSalaryPercent: 20, defaultMonthlyMultiple: 2,
    structureSummary: "주요 IP(던전앤파이터 등) 실적에 연동된 성과급 구조로 알려져 있습니다.",
    volatilityNote: "기존 IP 매출 안정성이 높아 상대적으로 예측 가능성이 있는 편으로 평가됩니다 (참고용).",
    caution: "직군, 스튜디오, 연도별 실적에 따라 달라질 수 있습니다.",
  },
  {
    id: "netmarble", name: "넷마블",
    defaultMode: "salaryPercent", defaultSalaryPercent: 10, defaultMonthlyMultiple: 1,
    structureSummary: "신작 출시 성과와 그룹 실적에 따른 성과급 구조로 알려져 있습니다.",
    volatilityNote: "신작 흥행 여부에 따라 연도별 변동이 큰 편으로 알려져 있습니다 (참고용).",
    caution: "직군, 스튜디오, 연도별 실적에 따라 달라질 수 있습니다.",
  },
  {
    id: "ncsoft", name: "엔씨소프트",
    defaultMode: "salaryPercent", defaultSalaryPercent: 10, defaultMonthlyMultiple: 1,
    structureSummary: "리니지 시리즈 등 핵심 IP 실적과 신작 성과에 연동된 구조로 알려져 있습니다.",
    volatilityNote: "최근 신작 성과에 따라 성과급 규모가 변동될 수 있는 것으로 알려져 있습니다 (참고용).",
    caution: "직군, 스튜디오, 연도별 실적에 따라 달라질 수 있습니다.",
  },
  {
    id: "krafton", name: "크래프톤",
    defaultMode: "salaryPercent", defaultSalaryPercent: 25, defaultMonthlyMultiple: 2.5,
    structureSummary: "PUBG 등 글로벌 IP 실적에 연동된 성과급 구조로 알려져 있으며 업계 내 상대적으로 높은 편으로 언급되기도 합니다.",
    volatilityNote: "글로벌 매출 비중이 커 환율·해외 시장 상황에 따른 변동성이 있습니다 (참고용).",
    caution: "직군, 스튜디오, 연도별 실적에 따라 달라질 수 있습니다.",
  },
];

export const GAME_SIMPLE_TAX_RATE = 0.22;

export interface FaqItem { question: string; answer: string; }
export const GAME_BONUS_FAQ: FaqItem[] = [ /* 5개 이상 */ ];

export interface RelatedLink { href: string; label: string; description: string; }
export const GAME_RELATED_LINKS: RelatedLink[] = [
  { href: "/reports/it-salary-top10/", label: "국내 IT 연봉 TOP10", description: "..." },
  { href: "/tools/it-platform-bonus-comparison/", label: "IT 플랫폼 성과급 비교", description: "..." },
  { href: "/tools/bonus-after-tax-calculator/", label: "성과급 세후 계산기", description: "..." },
];
```

## 5. UI/IA 상세

1. CalculatorHero — "게임업계 성과급 비교 계산기 2026 — 넥슨·넷마블·엔씨소프트·크래프톤"
2. InfoNotice — "신작 흥행 여부에 따라 변동성이 매우 크다"는 점 강조 + 사용자 입력 기준 시뮬레이션 고지
3. 입력 패널 — 연봉(공통 1회 입력) + 4사 성과급률 슬라이더
4. 결과 비교 카드 (4사, 모바일 아코디언) — 성과급 추정액(세전/세후), 연봉 대비 비율
5. 4사 비교 바 차트
6. 변동성 설명 섹션 — `volatilityNote` 4사 비교 (신작 의존도 정성 비교)
7. 관련 링크 그리드
8. SeoContent — intro 5개 이상/800자 이상 (게임업계 성과급의 변동성 특성, 4사 비교 포인트), FAQ 5개 이상

## 6. SEO 키워드 매핑

| 1차 키워드 | 2차 키워드 |
|---|---|
| 게임회사 성과급 | 넥슨 성과급, 넷마블 성과급, 엔씨소프트 성과급, 크래프톤 성과급 |
| 게임업계 성과급 비교 | 게임회사 보너스 계산기 |

## 7. 구현 파일 목록

- `src/data/gameIndustryBonusComparison2026.ts`
- `src/pages/tools/game-industry-bonus-comparison.astro`
- `public/scripts/game-industry-bonus-comparison.js`
- `src/styles/scss/pages/_game-industry-bonus-comparison.scss` (prefix: `gbc-`)
- 등록: `tools.ts`, `app.scss`, `sitemap.xml`, `index.astro`

## 8. 구현 순서

1. 데이터 파일 작성 (4개사 config)
2. `CompareToolShell` 4사 비교 페이지 구현 (모바일 아코디언)
3. 비교 차트 구현
4. 변동성 설명 섹션 작성
5. SeoContent 작성 + 등록 + `npm run build`

## 9. QA/리스크

- 크래프톤의 "상대적으로 높은 편" 같은 표현은 출처 불명확한 단정이 되지 않도록 "알려져 있다", "언급되기도 한다" 등 헤지 표현 유지
- 4사 비교에서 특정 회사를 "좋다/나쁘다"로 평가하지 않고 변동성/구조 차이로만 서술
- 신작 출시 일정 등 시점성 정보는 본문에 직접 언급하지 않음(콘텐츠 노화 방지)
