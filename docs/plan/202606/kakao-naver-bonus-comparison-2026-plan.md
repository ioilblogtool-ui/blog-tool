# 카카오·네이버 성과급 비교 계산기 2026 기획

## 1. 배경 및 목적

- **계기**: 기존 `it-platform-bonus-comparison`은 IT 플랫폼 전반(배달/이커머스 포함 추정)을 다루는데, 국내 양대 플랫폼인 카카오·네이버를 정면으로 비교하는 콘텐츠는 별도로 없음. "카카오 성과급", "네이버 성과급" 검색은 매년 1~2월 정기적으로 발생
- **목적**:
  1. "카카오 성과급", "네이버 성과급", "카카오 네이버 연봉 비교" 키워드 SEO 트래픽 확보
  2. IT 업계 종사자/이직 준비자의 "양대 플랫폼 보상 비교" 수요 충족
  3. 기존 `it-salary-top10`, `it-platform-bonus-comparison`과 상호 링크
- **타겟 사용자**: 카카오/네이버 재직자, IT 업계 이직 준비자, 플랫폼 기업 보상 구조 관심층

## 2. 콘텐츠 성격 및 데이터 신뢰성 원칙

- 카카오/네이버 모두 "성과급" 외에 "스톡옵션/RSU", "디데이 보너스(네이버 스톡그랜트)" 등 비정형 보상이 섞여 있어 단순 %로만 표현하기 어려움
- `semiconductor-bonus-comparison`과 동일하게 **사용자 입력 기준 시뮬레이션**으로 진행하되, "현금성 성과급"과 "스톡 기반 보상"을 구분해 설명하는 섹션을 별도로 둠

## 3. 페이지 구조 (1페이지, 비교형 계산기)

| 유형 | 슬러그 | 설명 |
|---|---|---|
| 계산기(Tool) | `tools/kakao-naver-bonus-comparison` | 두 회사 동시 비교, 연봉 입력 → 성과급(현금) + 스톡 보상 추정 비교 |

레이아웃: `CompareToolShell` (좌우 카드 비교)

## 4. 데이터 스키마 (`src/data/kakaoNaverBonusComparison2026.ts`)

```ts
export type PlatformCompanyId = "kakao" | "naver";
export type BonusInputMode = "salaryPercent" | "monthlyMultiple" | "fixedAmount";

export interface PlatformCompanyConfig {
  id: PlatformCompanyId;
  name: string;
  defaultMode: BonusInputMode;
  defaultSalaryPercent: number;
  defaultMonthlyMultiple: number;
  cashBonusNote: string;     // 현금 성과급 구조 설명
  stockBonusNote: string;    // 스톡옵션/RSU/스톡그랜트 설명 (정성적)
  caution: string;
}

export const PLATFORM_COMPANIES: PlatformCompanyConfig[] = [
  {
    id: "kakao", name: "카카오",
    defaultMode: "salaryPercent", defaultSalaryPercent: 15, defaultMonthlyMultiple: 1.5,
    cashBonusNote: "사업부/계열사별 성과에 따른 현금 성과급 구조로 알려져 있습니다.",
    stockBonusNote: "직군·연차별로 스톡옵션이 부여되는 경우가 있으나 대상/규모는 개별 계약에 따라 다릅니다.",
    caution: "계열사(카카오, 카카오뱅크, 카카오페이 등)별로 보상 구조가 다를 수 있습니다.",
  },
  {
    id: "naver", name: "네이버",
    defaultMode: "salaryPercent", defaultSalaryPercent: 15, defaultMonthlyMultiple: 1.5,
    cashBonusNote: "사업 성과 및 개인 평가에 따른 현금 성과급(인센티브) 구조로 알려져 있습니다.",
    stockBonusNote: "스톡그랜트(주식 보상) 프로그램을 운영한 사례가 있으나 대상/규모는 시기별로 다릅니다.",
    caution: "본사/계열사(네이버웹툰, 네이버클라우드 등)별로 보상 구조가 다를 수 있습니다.",
  },
];

export const PLATFORM_SIMPLE_TAX_RATE = 0.22;

export interface FaqItem { question: string; answer: string; }
export const PLATFORM_BONUS_FAQ: FaqItem[] = [ /* 5개 이상 */ ];

export interface RelatedLink { href: string; label: string; description: string; }
export const PLATFORM_RELATED_LINKS: RelatedLink[] = [
  { href: "/tools/it-platform-bonus-comparison/", label: "IT 플랫폼 성과급 비교", description: "..." },
  { href: "/reports/it-salary-top10/", label: "국내 IT 연봉 TOP10", description: "..." },
  { href: "/tools/bonus-after-tax-calculator/", label: "성과급 세후 계산기", description: "..." },
];
```

## 5. UI/IA 상세

1. CalculatorHero — "카카오 vs 네이버 성과급 비교 계산기 2026"
2. InfoNotice — "사용자 입력 기준 시뮬레이션, 계열사별 차이 존재" 고지
3. 입력 패널 — 연봉(공통 입력 1회) + 회사별 성과급률(%) 개별 슬라이더 2개
4. 결과 비교 카드 (2열, CompareToolShell)
   - 카카오: 현금 성과급 추정(세전/세후), 연봉 대비 비율
   - 네이버: 동일 항목
   - 차이 KPI: "두 회사 성과급 차이 = X만원"
5. 비교 바 차트 — 카카오 vs 네이버 성과급 추정액
6. 스톡 보상 설명 섹션 — `cashBonusNote`/`stockBonusNote` 정성 비교 (수치화하지 않음)
7. 관련 링크 그리드
8. SeoContent — intro 5개 이상/800자 이상 (카카오/네이버 보상 구조 차이, 계열사 이슈 포함), FAQ 5개 이상

## 6. SEO 키워드 매핑

| 1차 키워드 | 2차 키워드 |
|---|---|
| 카카오 성과급 | 카카오 성과급 계산기, 카카오 보너스 |
| 네이버 성과급 | 네이버 성과급 계산기, 네이버 스톡그랜트 |
| 카카오 네이버 연봉 비교 | IT 플랫폼 성과급 비교 |

## 7. 구현 파일 목록

- `src/data/kakaoNaverBonusComparison2026.ts`
- `src/pages/tools/kakao-naver-bonus-comparison.astro`
- `public/scripts/kakao-naver-bonus-comparison.js`
- `src/styles/scss/pages/_kakao-naver-bonus-comparison.scss` (prefix: `knb-`)
- 등록: `tools.ts`, `app.scss`, `sitemap.xml`, `index.astro`

## 8. 구현 순서

1. 데이터 파일 작성 (2개사 config)
2. `CompareToolShell` 기반 페이지 구현 — 공통 연봉 입력 + 회사별 슬라이더
3. 비교 차트(Chart.js bar) 구현
4. 스톡 보상 설명 섹션 (정성적 텍스트, 수치 비교 없음)
5. SeoContent 작성 + 등록 + `npm run build`

## 9. QA/리스크

- "스톡옵션/RSU" 관련 내용은 추정 수치화하지 않고 정성적 설명으로 한정 (오인 방지)
- 계열사별 차이를 명확히 고지해 "카카오/네이버 = 단일 보상 체계"로 오해되지 않도록 함
- 두 회사 비교 시 어느 한쪽을 우위로 단정하는 표현 지양 (중립적 비교 톤 유지)
