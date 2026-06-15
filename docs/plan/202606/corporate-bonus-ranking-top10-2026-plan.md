# 2026 대기업 성과급 순위 TOP10 허브 리포트 기획

## 1. 배경 및 목적

- **계기**: 사이트 내에 회사별/업종별 성과급 계산기가 다수 존재(`samsung-bonus`, `sk-hynix-bonus`, `lg-bonus`, `hyundai-bonus`, 본 배치에서 추가될 `posco-bonus-calculator`, `hanwha-bonus-calculator`, `doosan-enerbility-bonus-calculator`, `kakao-naver-bonus-comparison`, `telecom-bonus-comparison`, `airline-bonus-comparison`, `game-industry-bonus-comparison`, `steel-chemical-bonus-comparison`)하지만, 이를 한 화면에서 비교/탐색할 수 있는 허브가 없음. `us-bigtech-salary-comparison-2026` 허브와 동일한 역할을 국내 대기업 성과급 콘텐츠에 적용
- **목적**:
  1. "대기업 성과급 순위", "성과급 많이 주는 회사", "2026 성과급 비교" 등 포괄적 키워드 SEO 트래픽 확보
  2. 기존 12개 이상 성과급 계산기/비교 콘텐츠로의 내부 링크 허브 역할 → 페이지뷰/체류시간 개선
  3. 기존 `corporate-bonus-comparison-2026`(실적 발표 추적형)과 차별화 — 본 리포트는 "동일 입력값(연봉) 기준 시뮬레이션 순위"에 초점
- **타겟 사용자**: "내 회사 성과급이 다른 대기업과 비교해 어느 정도인지" 궁금한 일반 직장인, 이직 준비자

## 2. 콘텐츠 성격 및 데이터 신뢰성 원칙

- 모든 수치는 각 계산기의 **기본 성과급률(`defaultSalaryPercent`)을 동일 연봉(예: 6,000만원) 기준으로 시뮬레이션**한 값 — "실제 비교"가 아닌 "시뮬레이션 기준 비교"임을 최상단에 강하게 고지
- 순위는 "성과급률(%) 기준" 순위이며, 실제 지급 여부/금액과 무관함을 반복 고지 (InfoNotice + 각 카드 캡션)
- 기존 12개 콘텐츠의 `defaultSalaryPercent`/`defaultMonthlyMultiple` 값을 한 데이터 파일에서 재사용(import) — 중복 데이터 방지

## 3. 페이지 구조 (1페이지, 허브 리포트)

| 유형 | 슬러그 | 설명 |
|---|---|---|
| 허브 리포트 | `reports/corporate-bonus-ranking-top10-2026` | 동일 연봉 기준 회사별 성과급률 순위 + 전체 계산기 허브 |

레이아웃: 리포트 페이지 (us-bigtech-salary-comparison-2026 패턴 — KPI + 탭/차트 + 카드 그리드)

## 4. 데이터 스키마 (`src/data/corporateBonusRankingTop10_2026.ts`)

```ts
export type BonusRankingIndustry =
  | "semiconductor" | "auto" | "steel" | "chemical" | "shipbuilding"
  | "defense" | "platform" | "telecom" | "airline" | "game" | "finance" | "construction";

export interface BonusRankingEntry {
  id: string;               // "samsung", "skHynix", "posco", "kakao" 등
  name: string;
  industry: BonusRankingIndustry;
  defaultSalaryPercent: number; // 각 계산기 데이터 파일에서 import
  calculatorHref: string;       // 해당 계산기/비교 페이지 경로
  note: string;                  // 1줄 설명
}

export const BASE_SALARY_FOR_RANKING = 60_000_000; // 6,000만원 기준 시뮬레이션

// 기존 데이터 파일에서 defaultSalaryPercent re-export하여 구성
export const BONUS_RANKING_ENTRIES: BonusRankingEntry[] = [
  // semiconductor: samsung, skHynix (semiconductorBonusComparison.ts)
  // auto: hyundai (hyundaiCompensation.ts / autoBonusComparison.ts)
  // steel/chemical: posco, lgChem, lotteChem, hanwhaSolutions (steelChemicalBonusComparison2026.ts)
  // shipbuilding/defense: hanwhaOcean, hanwhaAerospace (hanwhaBonusCalculator2026.ts)
  // energy: doosanEnerbility (doosanEnerbilityBonusCalculator2026.ts)
  // platform: kakao, naver (kakaoNaverBonusComparison2026.ts)
  // telecom: kt, skt, lguplus (telecomBonusComparison2026.ts)
  // airline: koreanAir, asianaAir, lcc (airlineBonusComparison2026.ts)
  // game: nexon, netmarble, ncsoft, krafton (gameIndustryBonusComparison2026.ts)
];

export const BONUS_RANKING_INDUSTRY_LABELS: Record<BonusRankingIndustry, string> = {
  semiconductor: "반도체", auto: "자동차", steel: "철강", chemical: "화학",
  shipbuilding: "조선", defense: "방산", platform: "IT 플랫폼", telecom: "통신",
  airline: "항공", game: "게임", finance: "금융", construction: "건설",
};

export interface FaqItem { question: string; answer: string; }
export const BONUS_RANKING_FAQ: FaqItem[] = [ /* 5개 이상 */ ];

export interface RelatedLink { href: string; label: string; description: string; }
export const BONUS_RANKING_RELATED_LINKS: RelatedLink[] = [ /* 12개 계산기 전체 링크 */ ];
```

## 5. UI/IA 상세

1. CalculatorHero — "2026 대기업 성과급 순위 — 같은 연봉이면 어디가 더 받을까"
2. InfoNotice — "6,000만원 연봉 기준 각 계산기 기본 성과급률(%)로 환산한 시뮬레이션 순위, 실제 지급액과 무관" 강하게 고지 (CONTENT_GUIDE 추정 표기 기준 준수)
3. KPI 그리드 — 시뮬레이션 기준 최고/최저 성과급률 기업, 업종 평균, 전체 비교 대상 수(N개사)
4. **업종 필터 탭** — 전체/반도체/자동차/철강화학/조선방산/플랫폼/통신/항공/게임 등으로 막대 그래프 필터링
5. TOP 10 순위 막대 차트 (성과급률 기준, 내림차순)
6. 전체 기업 테이블 — 회사명, 업종, 성과급률(%), 6,000만원 기준 추정액, 상세 계산기 링크
7. 업종별 평균 비교 차트 (선택)
8. 카테고리 카드 그리드 — 12개 계산기/비교 페이지 전체로 연결 (단독 6개 + 비교 6개)
9. SeoContent — intro 5개 이상/800자 이상 (시뮬레이션 기준 설명, 업종별 특징 요약), FAQ 5개 이상

## 6. SEO 키워드 매핑

| 1차 키워드 | 2차 키워드 |
|---|---|
| 대기업 성과급 순위 | 성과급 많이 주는 회사, 2026 성과급 비교, 성과급 순위 계산기 |

## 7. 구현 파일 목록

- `src/data/corporateBonusRankingTop10_2026.ts`
- `src/pages/reports/corporate-bonus-ranking-top10-2026.astro`
- `public/scripts/corporate-bonus-ranking-top10-2026.js`
- `src/styles/scss/pages/_corporate-bonus-ranking-top10-2026.scss` (prefix: `cbr-`)
- 등록: `reports.ts`, `app.scss`, `sitemap.xml`, `index.astro`, `reports/index.astro`

## 8. 구현 순서 (전제: 1~8번 계산기/비교 콘텐츠 선행 구현 필요)

1. **선행 조건**: 1~8 항목(포스코, 한화, 두산, 카카오/네이버, 통신3사, 항공, 게임, 철강화학)이 먼저 구현되어 각 데이터 파일의 `defaultSalaryPercent` 값이 확정되어야 함
2. 기존 + 신규 12개 데이터 파일에서 `defaultSalaryPercent`를 모아 `corporateBonusRankingTop10_2026.ts` 작성
3. 업종 필터 탭 + TOP10 차트 + 전체 테이블 구현 (us-bigtech-salary-comparison-2026 탭/차트 패턴 재사용)
4. 카드 그리드(12개 계산기 링크) 구현
5. SeoContent 작성 + 등록 + `npm run build`
6. 12개 계산기 ↔ 허브 양방향 내부 링크 점검 (각 계산기 페이지에 허브 링크 추가)

## 9. QA/리스크

- **가장 중요한 리스크**: "순위"라는 표현이 실제 기업 성과급 순위로 오인될 수 있음 → 모든 노출 지점(히어로, KPI, 차트 타이틀, 테이블 헤더)에 "시뮬레이션 기준" 명시 필수
- 12개 데이터 파일 의존 → 선행 콘텐츠(1~8) 미구현 시 이 문서는 설계 단계까지만 진행, 실제 구현은 선행 콘텐츠 완료 후
- 업종 분류가 모호한 회사(예: 한화는 조선+방산) 처리 기준 명확화 — `industry` 필드는 단일 값이므로 대표 업종 하나만 선택
- 향후 신규 계산기 추가 시 이 허브에도 항목을 추가해야 함을 `docs/design/`에 운영 가이드로 남길 것
