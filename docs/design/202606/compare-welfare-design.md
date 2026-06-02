# 지원금 비교표(`/compare/welfare/`) 설계 문서

> 기획 문서: `docs/plan/202606/compare-menu.md`  
> 선행 설계: `docs/design/202606/compare-hub-design.md`  
> 작성일: 2026-06-01  
> 구현 대상: `/compare/welfare/` 지원금 비교표 하위 허브  
> 구현 목적: 청년·출산·복지 지원금 계산기와 리포트를 상황별로 묶어 탐색하게 만든다.

---

## 1. 문서 개요

| 항목 | 내용 |
| --- | --- |
| 페이지명 | 지원금 비교표 |
| URL | `/compare/welfare/` |
| 상위 페이지 | `/compare/` |
| 콘텐츠 유형 | comparison hub / policy gateway |
| 주요 대상 | 청년미래적금, 청년도약계좌, 복지급여, 출산지원금, 육아휴직 급여 검색 사용자 |
| 핵심 목표 | 지원금 관련 계산기·리포트를 “내 상황에서 먼저 볼 것” 기준으로 재배열 |
| 1차 구현 범위 | 정적 허브 페이지, 카드/표/CTA 중심, 새 계산 로직 없음 |
| 1차 제외 범위 | 실시간 정책 공고 수집, 지역별 전체 DB 자동 갱신, 개인별 신청 가능성 확정 판정 |

`/compare/welfare/`는 `/compare/`의 지원금 섹션을 독립시킨 하위 허브다. 사용자가 “청년미래적금”, “청년 적금 만기 수령액”, “복지급여 수급 자격”, “출산지원금”, “육아휴직 급여”처럼 들어왔을 때 자신의 상황에 맞는 계산기와 리포트로 빠르게 이동하게 만든다.

---

## 2. 페이지 역할

### 2-1. `/compare/`와의 차이

| 페이지 | 역할 |
| --- | --- |
| `/compare/` | 전체 비교표 허브. 성과급, 지원금, 부동산, 투자, 연봉을 한 번에 보여준다. |
| `/compare/welfare/` | 지원금 전용 허브. 청년, 출산·육아, 복지급여, 주거·정책금융 지원을 집중 연결한다. |

### 2-2. 사용자가 기대하는 답

1. 내가 받을 수 있는 지원금 계산기가 있는가?
2. 청년미래적금과 청년도약계좌 중 무엇을 먼저 봐야 하는가?
3. 출산 전후로 받을 수 있는 지원금과 비용은 어떻게 연결되는가?
4. 복지급여 수급 가능성은 어디서 확인하는가?
5. 리포트에서 제도 내용을 보고 계산기로 바로 넘어갈 수 있는가?

---

## 3. SEO 전략

### 3-1. Meta

| 항목 | 내용 |
| --- | --- |
| Title | 지원금 비교표｜청년미래적금·청년도약계좌·복지급여·출산지원금 계산기 |
| Description | 청년미래적금, 청년도약계좌, 복지급여, 출산지원금, 육아휴직 급여, 산후도우미 비용까지 지원금 계산기와 리포트를 한눈에 비교하세요. |
| Canonical | `/compare/welfare/` |
| H1 | 지원금 비교표 |

사용자가 앞서 정한 원칙처럼 **title은 구체 키워드 확장형**, **H1은 짧고 명확한 본문형**으로 둔다.

### 3-2. 주 타깃 키워드

- 지원금 비교표
- 청년 지원금 비교
- 청년미래적금 청년도약계좌 비교
- 청년 적금 만기 수령액 계산기
- 복지급여 수급 자격 계산기
- 정부 복지지원금 2026
- 출산지원금 계산기
- 출산지원금 지역별 비교
- 육아휴직 급여 계산기
- 산후도우미 비용 계산기

### 3-3. 검색 의도별 매칭

| 검색 의도 | 페이지 내 대응 |
| --- | --- |
| 청년 자산형성 상품 비교 | 청년 지원금 섹션 |
| 내가 복지급여 대상인지 확인 | 복지급여 계산기 CTA |
| 출산 전후 지원금 총액 확인 | 출산·육아 지원금 섹션 |
| 지역별 출산지원금 비교 | 관련 리포트 섹션 |
| 정책 내용을 먼저 이해 | 리포트 카드와 FAQ |

---

## 4. IA

```text
Hero
빠른 선택 CTA
청년 지원금 비교
출산·육아 지원금 비교
복지급여·정부지원금 확인
주거·정책금융 지원 연결
지원금 확인 순서
주의할 기준
관련 리포트
FAQ
```

---

## 5. Hero 설계

### Eyebrow

```text
지원금 비교표
```

### H1

```text
지원금 비교표
```

### Description

```text
청년미래적금, 청년도약계좌, 복지급여, 출산지원금, 육아휴직 급여처럼 조건이 다른 지원금을 상황별로 비교하고 관련 계산기와 리포트로 바로 이동하세요.
```

### Hero CTA

| CTA | 링크 | 우선순위 |
| --- | --- | --- |
| 청년 적금 만기 계산 | `/tools/youth-savings-maturity-calculator/` | 1 |
| 복지급여 자격 확인 | `/tools/welfare-benefit-eligibility/` | 2 |
| 출산지원금 계산 | `/tools/birth-support-total/` | 3 |

---

## 6. 콘텐츠 구성

## 6-1. 빠른 선택 CTA

상단에는 사용자의 현재 상황을 기준으로 4개 선택지를 둔다.

| 카드명 | 설명 | 링크 |
| --- | --- | --- |
| 청년 자산형성 비교 | 청년미래적금, 청년도약계좌, 일반 적금 만기 수령액 비교 | `/tools/youth-savings-maturity-calculator/` |
| 복지급여 가능성 확인 | 가구원 수, 소득, 재산 기준으로 복지급여 가능성 간이 확인 | `/tools/welfare-benefit-eligibility/` |
| 출산·육아 지원금 계산 | 출산 직후부터 2세까지 받을 수 있는 지원금 흐름 확인 | `/tools/birth-support-total/` |
| 산후·육아 비용 비교 | 산후도우미, 산후조리원, 임신·출산 비용을 함께 확인 | `/tools/postnatal-care-cost/` |

---

## 6-2. 청년 지원금 비교

청년미래적금 관련 콘텐츠가 최근 확장된 만큼 첫 번째 주요 섹션으로 둔다.

| 우선순위 | 콘텐츠 | 링크 | 노출 문구 |
| --- | --- | --- | --- |
| 1 | 청년 적금 만기 수령액 계산기 | `/tools/youth-savings-maturity-calculator/` | 청년미래적금, 청년도약계좌, 일반 적금을 월 납입액·금리·기여금 기준으로 비교합니다. |
| 2 | 청년미래적금 조건 정리 | `/reports/youth-future-savings-2026/` | 가입 조건, 납입 한도, 정부기여금, 비과세 여부를 먼저 확인합니다. |
| 3 | 청년미래적금 vs 청년도약계좌 비교 | `/reports/youth-savings-comparison-2026/` | 두 제도의 만기, 납입 조건, 정부기여금 차이를 비교합니다. |
| 4 | 월 적금 vs ETF 노후 계산기 | `/tools/savings-vs-etf-retirement/` | 지원금 상품 이후 장기 자산형성 대안을 비교합니다. |

카드 필드:

- 배지: 청년, 적금, 비과세, 비교
- 제목
- 설명
- 비교 기준 태그
- CTA

---

## 6-3. 출산·육아 지원금 비교

출산·육아 카테고리는 이미 계산기와 리포트가 많으므로 “받는 돈”과 “나가는 돈”을 함께 보여주는 구조가 좋다.

| 콘텐츠 | 링크 | 역할 |
| --- | --- | --- |
| 출산~2세 지원금 계산기 | `/tools/birth-support-total/` | 출산 직후부터 2세까지 받을 수 있는 총지원금 계산 |
| 출산지원금 총수령액 계산기 | `/tools/birth-support-money/` | 지역·조건별 출산지원금 계산 확장 |
| 육아휴직 급여 계산기 | `/tools/parental-leave-pay/` | 육아휴직 기간별 급여 확인 |
| 한 명만 육아휴직 총수령액 계산기 | `/tools/single-parental-leave-total/` | 한쪽 부모 기준 총수령액 확인 |
| 육아휴직+단축근무 계산기 | `/tools/parental-leave-short-work-calculator/` | 육아기 근무시간 단축까지 포함한 소득 흐름 확인 |
| 산후도우미 비용 계산기 | `/tools/postnatal-care-cost/` | 산후도우미 본인부담금과 지원금 영향 확인 |
| 임신·출산 비용 계산기 | `/tools/pregnancy-birth-cost/` | 임신부터 출산 전후 비용 흐름 확인 |
| 임신 주수별 검사 비용 계산기 | `/tools/pregnancy-checkup-cost/` | 임신 검사비를 주수별로 확인 |

### 섹션 메시지

```text
출산·육아 지원금은 받을 돈만 보면 부족합니다. 지원금, 휴직 급여, 산후도우미 비용, 임신·출산 비용을 같은 흐름에서 봐야 실제 가계 부담을 판단할 수 있습니다.
```

---

## 6-4. 복지급여·정부지원금 확인

복지급여는 개인 상황별 조건이 강하므로 계산기 CTA와 리포트 설명을 함께 둔다.

| 콘텐츠 | 링크 | 노출 문구 |
| --- | --- | --- |
| 복지급여 수급 자격 계산기 | `/tools/welfare-benefit-eligibility/` | 가구원 수, 소득, 재산을 입력해 급여별 가능성을 간이 확인합니다. |
| 2026 정부 복지지원금 완전 정복 | `/reports/2026-government-welfare-benefits/` | 청년, 저소득, 가족, 노인, 장애, 바우처 지원제도를 한 번에 훑어봅니다. |

주의 문구:

```text
복지급여는 계산 결과가 신청 가능성을 확정하지 않습니다. 실제 수급 여부는 주민센터, 복지로, 정부 공고와 개인별 심사 결과를 기준으로 확인해야 합니다.
```

---

## 6-5. 주거·정책금융 지원 연결

초기 `/compare/welfare/` 안에서는 주거 지원을 독립 페이지로 분리하지 않고, 관련 리포트/계산기로 연결한다. 추후 수요가 쌓이면 `/compare/real-estate/` 또는 별도 `/compare/housing-support/`로 분리할 수 있다.

| 콘텐츠 | 링크 | 역할 |
| --- | --- | --- |
| 2026 직장인 대출 비교 | `/reports/2026-salaried-loan-comparison/` | 정책금융과 대출 비교 흐름 연결 |
| 내집마련 자금 계산기 | `/tools/home-purchase-fund/` | 필요한 자기자본과 대출 규모 확인 |
| 신혼부부 전세 vs 매매 | `/tools/newlywed-rent-vs-buy/` | 신혼부부 주거 선택 비용 비교 |

---

## 6-6. 지원금 확인 순서

사용자가 지원금 콘텐츠에서 길을 잃지 않게 순서를 제공한다.

```text
1. 내 상황 선택: 청년, 출산·육아, 복지급여, 주거 지원
2. 조건 확인: 나이, 소득, 가구원 수, 거주지, 신청 기간
3. 예상 금액 계산: 월 납입액, 정부기여금, 급여, 지원금 총액
4. 중복 가능성 확인: 같은 목적의 지원금은 중복 제한이 있을 수 있음
5. 공식 공고 확인: 신청 전 정부 공고와 지자체 안내를 최종 확인
```

---

## 6-7. 비교 기준 안내

| 기준 | 설명 |
| --- | --- |
| 나이 기준 | 청년 지원금은 만 나이와 가입 시점 기준이 중요하다. |
| 소득 기준 | 개인소득, 가구소득, 중위소득 기준을 구분해야 한다. |
| 거주지 기준 | 출산지원금과 일부 복지제도는 지자체별 차이가 크다. |
| 신청 기간 | 예산 소진, 모집 회차, 신청 기간에 따라 받을 수 있는지가 달라진다. |
| 중복 수급 | 비슷한 목적의 지원금은 중복 제한이나 선택 조건이 있을 수 있다. |
| 만기·유지 조건 | 적금형 지원은 중도해지 시 기여금이나 비과세 혜택이 달라질 수 있다. |

고지 문구:

```text
지원금 비교표는 공개 공고와 계산 모델을 바탕으로 정리한 참고용 콘텐츠입니다. 실제 신청 가능 여부와 지급액은 정부 공고, 지자체 안내, 금융기관 상품설명서, 개인별 심사 결과를 기준으로 확인해야 합니다.
```

---

## 7. 데이터 설계

1차 구현은 별도 데이터 파일을 만든다.

```text
src/data/compareWelfare.ts
```

이유:

- 지원금은 청년, 출산·육아, 복지급여, 주거 지원처럼 하위 그룹이 많다.
- 정책성 콘텐츠는 FAQ와 고지 문구가 길어질 수 있다.
- `/compare/bonus/`와 같은 구조로 유지하면 하위 허브 확장이 쉽다.

### 7-1. 타입

```ts
export type WelfareCompareGroupId = "quick" | "youth" | "family" | "benefit" | "housing" | "report";
export type WelfareCompareItemType = "calculator" | "report" | "comparison" | "anchor";
export type WelfareCompareBadgeTone = "default" | "popular" | "new" | "official" | "youth" | "family";

export interface WelfareCompareBadge {
  label: string;
  tone: WelfareCompareBadgeTone;
}

export interface WelfareCompareItem {
  id: string;
  title: string;
  description: string;
  href: string;
  type: WelfareCompareItemType;
  groupId: WelfareCompareGroupId;
  criteria: string[];
  badges: WelfareCompareBadge[];
  ctaLabel: string;
  priority: number;
}

export interface WelfareCompareGuide {
  title: string;
  description: string;
}

export interface WelfareCompareFlowStep {
  title: string;
  description: string;
}

export interface WelfareCompareFaq {
  question: string;
  answer: string;
}
```

### 7-2. 주요 상수

```ts
export const WELFARE_COMPARE_QUICK_LINKS = [...]
export const WELFARE_COMPARE_YOUTH_ITEMS = [...]
export const WELFARE_COMPARE_FAMILY_ITEMS = [...]
export const WELFARE_COMPARE_BENEFIT_ITEMS = [...]
export const WELFARE_COMPARE_HOUSING_ITEMS = [...]
export const WELFARE_COMPARE_GUIDES = [...]
export const WELFARE_COMPARE_FLOW = [...]
export const WELFARE_COMPARE_FAQ = [...]
```

---

## 8. Astro 페이지 설계

파일:

```text
src/pages/compare/welfare/index.astro
```

### 8-1. import

```astro
---
import BaseLayout from "../../../layouts/BaseLayout.astro";
import SiteHeader from "../../../components/SiteHeader.astro";
import CalculatorHero from "../../../components/CalculatorHero.astro";
import InfoNotice from "../../../components/InfoNotice.astro";
import SeoContent from "../../../components/SeoContent.astro";
import {
  WELFARE_COMPARE_QUICK_LINKS,
  WELFARE_COMPARE_YOUTH_ITEMS,
  WELFARE_COMPARE_FAMILY_ITEMS,
  WELFARE_COMPARE_BENEFIT_ITEMS,
  WELFARE_COMPARE_HOUSING_ITEMS,
  WELFARE_COMPARE_GUIDES,
  WELFARE_COMPARE_FLOW,
  WELFARE_COMPARE_FAQ,
} from "../../../data/compareWelfare";
import { withBase } from "../../../utils/base";
---
```

### 8-2. BaseLayout

```astro
<BaseLayout
  title="지원금 비교표｜청년미래적금·청년도약계좌·복지급여·출산지원금 계산기"
  description="청년미래적금, 청년도약계좌, 복지급여, 출산지원금, 육아휴직 급여, 산후도우미 비용까지 지원금 계산기와 리포트를 한눈에 비교하세요."
>
```

### 8-3. 페이지 구조

```astro
<SiteHeader />
<main class="container page-shell compare-welfare-page">
  <CalculatorHero ... />
  <InfoNotice ... />
  <section id="quick">...</section>
  <section id="youth">...</section>
  <section id="family">...</section>
  <section id="benefit">...</section>
  <section id="housing">...</section>
  <section id="flow">...</section>
  <section id="criteria">...</section>
  <SeoContent ... />
</main>
```

---

## 9. 스타일 설계

파일:

```text
src/styles/scss/pages/_compare-welfare.scss
```

`/compare/bonus/`와 구조는 맞추되, 지원금 페이지는 정책·생활 정보 느낌이 나도록 초록/파랑 포인트를 사용한다. 단, 색상이 한 톤으로만 보이지 않도록 흰색 카드와 회색 라인을 중심으로 둔다.

### 9-1. prefix

- page class: `.compare-welfare-page`
- section prefix: `.compare-welfare-`

### 9-2. 색상 방향

```scss
.compare-welfare-page {
  --welfare-ink: #172033;
  --welfare-muted: #667085;
  --welfare-line: #d8e0ea;
  --welfare-soft: #f5f8fb;
  --welfare-green: #0f8a5f;
  --welfare-blue: #2f5acf;
  --welfare-warn: #9a5b00;
}
```

### 9-3. 레이아웃

```scss
.compare-welfare-section {
  display: grid;
  gap: 18px;
  margin-top: 30px;
}

.compare-welfare-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
}

.compare-welfare-card {
  display: grid;
  gap: 12px;
  min-width: 0;
  padding: 16px;
  border: 1px solid var(--welfare-line);
  border-radius: 8px;
  background: #fff;
}
```

### 9-4. 모바일

- 390px에서 가로 넘침 없음
- CTA 버튼은 모바일에서 full width
- 비교표는 모바일에서 `overflow-x: auto` 또는 카드형 목록으로 전환
- 긴 제도명은 줄바꿈 허용
- 표 안의 링크는 줄바꿈되어도 높이만 늘어나게 처리

---

## 10. 내부 링크 전략

### 10-1. `/compare/`에서 연결

`/compare/` 지원금 섹션 또는 상단 CTA에 `/compare/welfare/` 링크를 추가한다.

권장 문구:

```text
지원금 비교표 전체 보기
```

### 10-2. 기존 페이지에서 연결 후보

7단계 구현 후 8~9단계 CTA 통합에서 아래 페이지에 추가한다.

| 기존 페이지 | 추가 CTA |
| --- | --- |
| `/tools/youth-savings-maturity-calculator/` | 청년 지원금 비교표 보기 |
| `/reports/youth-future-savings-2026/` | 청년 적금 만기 수령액 계산하기 |
| `/reports/youth-savings-comparison-2026/` | 지원금 비교표 전체 보기 |
| `/tools/welfare-benefit-eligibility/` | 청년·출산·복지 지원금 비교 보기 |
| `/tools/birth-support-total/` | 출산·육아 지원금 비교표 보기 |
| `/tools/postnatal-care-cost/` | 출산지원금과 산후 비용 함께 보기 |

### 10-3. sitemap

```xml
<url>
  <loc>https://bigyocalc.com/compare/welfare/</loc>
  <lastmod>2026-06-01</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.88</priority>
</url>
```

---

## 11. FAQ

### FAQ 후보

| 질문 | 답변 방향 |
| --- | --- |
| 지원금 비교표와 복지급여 계산기는 무엇이 다른가요? | 비교표는 여러 제도와 계산기를 고르는 허브, 계산기는 개인 조건 입력 도구라고 설명 |
| 청년미래적금과 청년도약계좌는 같이 가입할 수 있나요? | 시점별 정책과 중복 제한 확인이 필요하므로 공식 공고를 확인하라고 안내 |
| 지원금 계산 결과가 실제 수급 가능성을 의미하나요? | 아니며 정부 공고, 지자체 안내, 심사 결과가 우선이라고 고지 |
| 출산지원금은 지역마다 다른가요? | 지자체별 차이가 있으므로 지역별 리포트와 공식 안내를 함께 보라고 안내 |
| 어떤 순서로 확인하면 좋나요? | 내 상황 선택 → 조건 확인 → 예상 금액 계산 → 중복 가능성 확인 → 공식 공고 확인 |

---

## 12. QA 체크리스트

- [ ] `/compare/welfare/`가 정상 빌드되는가?
- [ ] H1은 `지원금 비교표`로 노출되는가?
- [ ] title은 `지원금 비교표｜청년미래적금·청년도약계좌·복지급여·출산지원금 계산기`로 설정되는가?
- [ ] 청년 적금 만기 계산기, 복지급여 계산기, 출산지원금 계산기 CTA가 상단에 있는가?
- [ ] 청년 지원금 섹션에서 청년미래적금 관련 페이지가 모두 연결되는가?
- [ ] 출산·육아 섹션에서 출산지원금, 육아휴직, 산후도우미, 임신·출산 비용 계산기가 연결되는가?
- [ ] 복지급여 섹션에 복지급여 수급 자격 계산기와 정부 복지지원금 리포트가 연결되는가?
- [ ] 정책성 콘텐츠 고지 문구가 포함되어 있는가?
- [ ] 모바일 390px에서 카드와 CTA가 가로로 넘치지 않는가?
- [ ] `/compare/`에서 `/compare/welfare/`로 이동할 수 있는 CTA가 있는가?
- [ ] `src/styles/app.scss`에 스타일이 등록되는가?
- [ ] `public/sitemap.xml`에 URL이 등록되는가?
- [ ] `npm run build`가 성공하는가?

---

## 13. 구현 순서

1. `src/data/compareWelfare.ts` 생성
2. `src/pages/compare/welfare/index.astro` 생성
3. `src/styles/scss/pages/_compare-welfare.scss` 생성
4. `src/styles/app.scss`에 `@use 'scss/pages/compare-welfare';` 추가
5. `public/sitemap.xml`에 `/compare/welfare/` 추가
6. `/compare/` 지원금 섹션 또는 상단 CTA에서 `/compare/welfare/` 연결
7. `npm run build`
8. 로컬 브라우저에서 `/compare/welfare/` 확인

---

## 14. 다음 단계

이 문서를 기준으로 7번 단계에서 `/compare/welfare/`를 구현한다.

구현 시 핵심은 새 정책 데이터를 무리하게 만드는 것이 아니라, 이미 있는 청년·출산·복지 계산기와 리포트를 **사용자 상황별 의사결정 순서**로 재배열하는 것이다. 특히 상단에는 `청년 적금 만기 수령액 계산기`, `복지급여 수급 자격 계산기`, `출산~2세 지원금 계산기`, `산후도우미 비용 계산기`를 강하게 노출한다.
