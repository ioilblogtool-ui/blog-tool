# 성과급 비교표(`/compare/bonus/`) 설계 문서

> 기획 문서: `docs/plan/202606/compare-menu.md`  
> 선행 설계: `docs/design/202606/compare-hub-design.md`  
> 작성일: 2026-06-01  
> 구현 대상: `/compare/bonus/` 성과급 비교표 하위 허브  
> 구현 목적: 성과급 관련 계산기와 업종별 비교 콘텐츠를 한 화면에서 탐색하게 만든다.

---

## 1. 문서 개요

| 항목 | 내용 |
| --- | --- |
| 페이지명 | 성과급 비교표 |
| URL | `/compare/bonus/` |
| 상위 페이지 | `/compare/` |
| 콘텐츠 유형 | comparison hub / calculator gateway |
| 주요 대상 | 삼성전자, SK하이닉스, 현대차, LG전자 등 대기업 성과급 검색 유입 사용자 |
| 핵심 목표 | 성과급 계산기 유입을 업종별 비교와 세후 실수령 계산으로 확장 |
| 1차 구현 범위 | 정적 허브 페이지, 카드/표/CTA 중심, 새 계산 로직 없음 |
| 1차 제외 범위 | 실시간 성과급 랭킹, 자동 데이터 수집, 개별 회사별 신규 계산식 추가 |

`/compare/bonus/`는 `/compare/`의 성과급 섹션을 독립시킨 하위 허브다. 사용자가 “삼성전자 성과급 계산기”, “하이닉스 성과급 계산기”, “성과급 세후”, “대기업 성과급 비교”처럼 들어왔을 때 다음 행동을 고르게 만든다.

---

## 2. 페이지 역할

### 2-1. `/compare/`와의 차이

| 페이지 | 역할 |
| --- | --- |
| `/compare/` | 전체 비교표 허브. 성과급, 지원금, 부동산, 투자, 연봉을 한 번에 보여준다. |
| `/compare/bonus/` | 성과급 전용 허브. 회사별 계산기, 업종별 비교 계산기, 세후 계산기를 집중 연결한다. |

### 2-2. 사용자가 기대하는 답

1. 내 회사 성과급 계산기가 있는가?
2. 같은 업종의 다른 회사와 비교할 수 있는가?
3. 세전 성과급이 실제 통장에 얼마 남는가?
4. 삼성전자와 SK하이닉스처럼 인기 비교를 바로 볼 수 있는가?
5. 아직 없는 회사는 어떤 기준으로 대략 비교하면 되는가?

---

## 3. SEO 전략

### 3-1. Meta

| 항목 | 내용 |
| --- | --- |
| Title | 성과급 비교표｜삼성전자·SK하이닉스·현대차·LG전자 성과급 계산기 |
| Description | 대기업 성과급 계산기와 업종별 성과급 비교표를 모았습니다. 삼성전자, SK하이닉스, 현대차, LG전자, 반도체, 자동차, 정유사, 금융권, 조선업 성과급을 세전·세후 기준으로 비교해보세요. |
| Canonical | `/compare/bonus/` |
| H1 | 성과급 비교표 |

사용자가 앞서 말한 원칙처럼 **두 번째 문장을 title에, 첫 번째 문장을 H1/본문에 쓰는 방식**을 따른다.

### 3-2. 주 타깃 키워드

- 성과급 비교표
- 대기업 성과급 계산기
- 성과급 비교 계산기
- 삼성전자 성과급 계산기
- SK하이닉스 성과급 계산기
- 성과급 세후 계산기
- 반도체 성과급 비교
- 자동차 성과급 비교
- 정유사 성과급 비교
- 금융권 성과급 비교
- 조선업 성과급 비교

### 3-3. 검색 의도별 매칭

| 검색 의도 | 페이지 내 대응 |
| --- | --- |
| 특정 회사 성과급 계산 | 회사별 계산기 카드 |
| 업종별 성과급 비교 | 업종별 비교 계산기 섹션 |
| 세후 실수령액 확인 | 세후 실수령액 계산기 CTA |
| 성과급 구조 이해 | 비교 기준 안내 섹션 |
| 다른 회사와 비교 | 인기 조합/추천 흐름 섹션 |

---

## 4. IA

```text
Hero
빠른 선택 CTA
인기 성과급 계산기
업종별 성과급 비교
회사별 성과급 계산기
세후 실수령액 계산 흐름
성과급 비교 기준
관련 리포트
FAQ
```

### 4-1. Hero

#### Eyebrow

```text
성과급 비교표
```

#### H1

```text
성과급 비교표
```

#### Description

```text
삼성전자, SK하이닉스, 현대차, LG전자처럼 많이 찾는 회사별 성과급 계산기와 반도체·자동차·정유사·금융권·조선업 업종별 성과급 비교를 한 화면에서 확인하세요.
```

#### Hero CTA

| CTA | 링크 | 우선순위 |
| --- | --- | --- |
| 대기업 성과급 계산하기 | `/tools/bonus-simulator/` | 1 |
| 세후 실수령액 계산하기 | `/tools/bonus-after-tax-calculator/` | 2 |
| 반도체 성과급 비교 | `/tools/semiconductor-bonus-comparison/` | 3 |

---

## 5. 콘텐츠 구성

## 5-1. 빠른 선택 CTA

사용자가 바로 목적지로 이동할 수 있게 상단에 4개 선택지를 둔다.

| 카드명 | 설명 | 링크 |
| --- | --- | --- |
| 내 성과급 먼저 계산 | 연봉과 성과급률로 대기업 성과급을 빠르게 추정 | `/tools/bonus-simulator/` |
| 세후 금액 확인 | 성과급에서 세금과 4대보험을 뺀 실수령액 추정 | `/tools/bonus-after-tax-calculator/` |
| 회사별 계산기 | 삼성전자, SK하이닉스, 현대차, LG전자 계산기 모음 | `#company` |
| 업종별 비교 | 반도체, 자동차, 정유사, 금융권, 조선업 비교 | `#industry` |

---

## 5-2. 인기 성과급 계산기

상단에는 검색 유입이 검증된 계산기를 먼저 배치한다.

| 우선순위 | 콘텐츠 | 링크 | 노출 문구 |
| --- | --- | --- | --- |
| 1 | 삼성전자 성과급 계산기 | `/tools/samsung-bonus/` | OPI·TAI·협의안 기준으로 삼성전자 성과급을 계산합니다. |
| 2 | SK하이닉스 성과급 계산기 | `/tools/sk-hynix-bonus/` | PS·PI 구조를 기준으로 하이닉스 성과급을 계산합니다. |
| 3 | 대기업 성과급 시뮬레이터 | `/tools/bonus-simulator/` | 회사별 성과급률을 같은 연봉 기준으로 비교합니다. |
| 4 | 성과급 세후 실수령액 계산기 | `/tools/bonus-after-tax-calculator/` | 세전 성과급이 실제 통장에 얼마 남는지 추정합니다. |
| 5 | 현대차 성과급 계산기 | `/tools/hyundai-bonus/` | 임단협 패키지와 성과급 체감액을 계산합니다. |
| 6 | LG전자 성과급 계산기 | `/tools/lg-bonus/` | 기본급과 성과급률을 기준으로 LG전자 성과급을 계산합니다. |

카드 필드:

- 배지: 인기, 계산기, 세후, 회사별
- 제목
- 설명
- 비교 기준 태그
- CTA

---

## 5-3. 업종별 성과급 비교

업종별 비교 계산기는 `/compare/bonus/`의 핵심 섹션이다. 기존 `/tools/` 페이지로 연결하되, 여기서는 “어떤 업종을 먼저 봐야 하는지”를 정리한다.

| 업종 | 콘텐츠 | 링크 | 비교 대상 |
| --- | --- | --- | --- |
| 반도체 | 반도체 성과급 비교 계산기 | `/tools/semiconductor-bonus-comparison/` | 삼성전자, SK하이닉스, DB하이텍 등 |
| 자동차 | 자동차 성과급 비교 계산기 | `/tools/auto-bonus-comparison/` | 현대차, 기아, 현대모비스 |
| 정유사 | 정유사 성과급 비교 계산기 | `/tools/oil-refinery-bonus-comparison/` | S-OIL, GS칼텍스, HD현대오일뱅크, SK이노베이션 |
| 금융권 | 금융권 성과급 비교 계산기 | `/tools/finance-bonus-comparison/` | 은행, 증권, 보험 |
| 조선업 | 조선업 성과급 비교 계산기 | `/tools/shipbuilding-bonus-comparison/` | HD현대중공업, 한화오션, 삼성중공업 |
| IT 플랫폼 | IT 플랫폼 성과급 비교 계산기 | `/tools/it-platform-bonus-comparison/` | 네이버, 카카오, 쿠팡 |

### 섹션 메시지

```text
회사별 계산기가 없더라도 업종별 비교 계산기를 먼저 보면 성과급 구조를 빠르게 파악할 수 있습니다. 같은 연봉, 같은 세전 금액, 같은 세후 기준으로 비교하는 것이 핵심입니다.
```

---

## 5-4. 회사별 성과급 계산기

회사명을 직접 검색한 사용자를 위한 섹션이다.

| 회사 | 계산기 | 링크 | 보조 CTA |
| --- | --- | --- | --- |
| 삼성전자 | 삼성전자 성과급 계산기 | `/tools/samsung-bonus/` | 반도체 비교 보기 |
| SK하이닉스 | SK하이닉스 성과급 계산기 | `/tools/sk-hynix-bonus/` | 반도체 비교 보기 |
| 현대차 | 현대차 성과급 계산기 | `/tools/hyundai-bonus/` | 자동차 비교 보기 |
| LG전자 | LG전자 성과급 계산기 | `/tools/lg-bonus/` | 대기업 비교 보기 |

추후 확장 후보:

- 기아 성과급 계산기
- 현대모비스 성과급 계산기
- 네이버 성과급 계산기
- 카카오 성과급 계산기
- S-OIL 성과급 계산기
- HD현대중공업 성과급 계산기

---

## 5-5. 세후 실수령액 계산 흐름

성과급 검색 유입은 “얼마 받나”에서 끝나지 않고 “통장에 얼마 꽂히나”로 이어진다. 따라서 별도 섹션으로 세후 계산 흐름을 안내한다.

### 흐름

```text
1. 회사별 또는 업종별 성과급 계산
2. 세전 성과급 확인
3. 성과급 세후 실수령액 계산기로 이동
4. 소득세, 지방소득세, 4대보험 추정 반영
5. 통장 입금액 기준으로 비교
```

### CTA

```text
세전 성과급을 확인했다면 세후 실수령액까지 계산해보세요.
```

링크: `/tools/bonus-after-tax-calculator/`

---

## 5-6. 성과급 비교 기준

사용자가 서로 다른 회사 성과급을 비교할 때 혼동하지 않도록 기준을 정리한다.

| 기준 | 설명 |
| --- | --- |
| 연봉 기준 | 같은 연봉을 넣고 비교해야 성과급률 차이를 볼 수 있다. |
| 기본급 기준 | 일부 회사는 월 기본급 또는 기준급의 몇 퍼센트로 지급한다. |
| 세전/세후 구분 | 세전 성과급과 실수령액은 크게 다를 수 있다. |
| 고정/변동 구분 | 협의금, 격려금, 상품권, 주식 보상은 성과급과 분리해서 봐야 한다. |
| 지급 시점 | 연 1회, 반기, 분기, 명절 지급 등 지급 시점이 다를 수 있다. |
| 공식/추정 구분 | 회사 공지, 노조 합의안, 기사, 계산 모델을 구분해서 표기해야 한다. |

고지 문구:

```text
성과급 비교표는 공개자료와 계산 모델을 바탕으로 정리한 참고용 콘텐츠입니다. 실제 지급액은 회사 공지, 사업부, 직급, 평가, 근속, 지급 시점, 개인 과세 조건에 따라 달라질 수 있습니다.
```

---

## 5-7. 관련 리포트

성과급 계산기만으로 끝나지 않게 리포트 탐색을 연결한다.

| 콘텐츠 | 링크 | 역할 |
| --- | --- | --- |
| 2026 대기업 성과급 비교 | `/reports/corporate-bonus-comparison-2026/` | 성과급 시장 흐름 해설 |
| 삼성 DS 성과급 계산 가이드 | `/reports/samsung-ds-bonus-calculation-guide/` | 삼성전자 검색 유입 보완 |
| SK하이닉스 성과급 2027 | `/reports/sk-hynix-bonus-2027/` | 하이닉스 후속 검색 대응 |
| 보험사 연봉·성과급 비교 | `/reports/insurance-salary-bonus-comparison-2026/` | 금융권 성과급 확장 |
| 건설사 연봉·성과급 비교 | `/reports/construction-salary-bonus-comparison-2026/` | 제조 외 업종 확장 |

---

## 6. 데이터 설계

1차 구현은 기존 `src/data/compareHub.ts`에 성과급 하위 허브 데이터를 추가하거나, 별도 파일 `src/data/compareBonus.ts`를 만든다.

권장: **별도 파일 생성**

```text
src/data/compareBonus.ts
```

이유:

- `/compare/` 전체 허브 데이터와 `/compare/bonus/` 상세 허브 데이터의 목적이 다르다.
- 성과급은 카드 수가 많고, 추후 회사별/업종별 확장이 많다.
- `/compare/welfare/`도 같은 패턴으로 별도 데이터 파일을 만들 수 있다.

### 6-1. 타입

```ts
export type BonusCompareGroupId = "quick" | "popular" | "industry" | "company" | "report";
export type BonusCompareItemType = "calculator" | "comparison" | "report" | "anchor";
export type BonusCompareBadgeTone = "default" | "popular" | "new" | "tax" | "industry";

export interface BonusCompareBadge {
  label: string;
  tone: BonusCompareBadgeTone;
}

export interface BonusCompareItem {
  id: string;
  title: string;
  description: string;
  href: string;
  type: BonusCompareItemType;
  groupId: BonusCompareGroupId;
  criteria: string[];
  badges: BonusCompareBadge[];
  ctaLabel: string;
  priority: number;
}

export interface BonusCompareGuide {
  title: string;
  description: string;
}

export interface BonusCompareFaq {
  question: string;
  answer: string;
}
```

### 6-2. 주요 상수

```ts
export const BONUS_COMPARE_POPULAR_ITEMS = [...]
export const BONUS_COMPARE_INDUSTRY_ITEMS = [...]
export const BONUS_COMPARE_COMPANY_ITEMS = [...]
export const BONUS_COMPARE_REPORT_ITEMS = [...]
export const BONUS_COMPARE_GUIDES = [...]
export const BONUS_COMPARE_FAQ = [...]
```

---

## 7. Astro 페이지 설계

파일:

```text
src/pages/compare/bonus/index.astro
```

### 7-1. import

```astro
---
import BaseLayout from "../../../layouts/BaseLayout.astro";
import SiteHeader from "../../../components/SiteHeader.astro";
import CalculatorHero from "../../../components/CalculatorHero.astro";
import InfoNotice from "../../../components/InfoNotice.astro";
import SeoContent from "../../../components/SeoContent.astro";
import {
  BONUS_COMPARE_POPULAR_ITEMS,
  BONUS_COMPARE_INDUSTRY_ITEMS,
  BONUS_COMPARE_COMPANY_ITEMS,
  BONUS_COMPARE_REPORT_ITEMS,
  BONUS_COMPARE_GUIDES,
  BONUS_COMPARE_FAQ,
} from "../../../data/compareBonus";
import { withBase } from "../../../utils/base";
---
```

### 7-2. BaseLayout

```astro
<BaseLayout
  title="성과급 비교표｜삼성전자·SK하이닉스·현대차·LG전자 성과급 계산기"
  description="대기업 성과급 계산기와 업종별 성과급 비교표를 모았습니다. 삼성전자, SK하이닉스, 현대차, LG전자, 반도체, 자동차, 정유사, 금융권, 조선업 성과급을 세전·세후 기준으로 비교해보세요."
>
```

### 7-3. 페이지 구조

```astro
<SiteHeader />
<main class="container page-shell compare-bonus-page">
  <CalculatorHero ... />
  <InfoNotice ... />
  <section id="quick">...</section>
  <section id="popular">...</section>
  <section id="industry">...</section>
  <section id="company">...</section>
  <section id="after-tax">...</section>
  <section id="criteria">...</section>
  <section id="reports">...</section>
  <SeoContent ... />
</main>
```

---

## 8. 스타일 설계

파일:

```text
src/styles/scss/pages/_compare-bonus.scss
```

`/compare/`에서 만든 카드 톤을 재사용하되, 성과급 페이지는 더 실무형 대시보드 느낌으로 간다.

### 8-1. prefix

- page class: `.compare-bonus-page`
- section prefix: `.compare-bonus-`

### 8-2. 색상 방향

성과급은 돈/보상 주제지만 과한 금색 팔레트는 피한다. 기본은 흰색, 진한 네이비, 초록 포인트, 얇은 회색 라인으로 구성한다.

```scss
.compare-bonus-page {
  --bonus-ink: #172033;
  --bonus-muted: #667085;
  --bonus-line: #d8e0ea;
  --bonus-soft: #f5f8fb;
  --bonus-green: #0f8a5f;
  --bonus-blue: #2f5acf;
  --bonus-warn: #9a5b00;
}
```

### 8-3. 레이아웃

```scss
.compare-bonus-section {
  display: grid;
  gap: 18px;
  margin-top: 30px;
}

.compare-bonus-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
}

.compare-bonus-card {
  display: grid;
  gap: 12px;
  min-width: 0;
  padding: 16px;
  border: 1px solid var(--bonus-line);
  border-radius: 8px;
  background: #fff;
}
```

### 8-4. 모바일

- 390px에서 가로 넘침 없음
- 카드 CTA는 모바일에서 full width
- 업종별 비교표는 모바일에서 카드형으로 전환하거나 `overflow-x` 허용
- 긴 회사명은 줄바꿈 허용

---

## 9. 내부 링크 전략

### 9-1. `/compare/`에서 연결

`/compare/` 성과급 섹션 상단 또는 성과급 카드 중 하나에 `/compare/bonus/` CTA를 추가한다.

권장 문구:

```text
성과급 비교표 전체 보기
```

### 9-2. 기존 성과급 계산기에서 연결

8단계 CTA 통합 전에는 구현하지 않아도 되지만, 설계상 아래 페이지 하단 CTA 후보에 포함한다.

| 기존 페이지 | 추가 CTA |
| --- | --- |
| `/tools/samsung-bonus/` | 삼성전자만 보지 말고 반도체·대기업 성과급 비교 보기 |
| `/tools/sk-hynix-bonus/` | SK하이닉스와 삼성전자 성과급 비교 보기 |
| `/tools/bonus-simulator/` | 업종별 성과급 비교표 보기 |
| `/tools/bonus-after-tax-calculator/` | 세전 성과급 계산기로 돌아가기 |
| `/tools/semiconductor-bonus-comparison/` | 전체 성과급 비교표 보기 |

### 9-3. sitemap

```xml
<url>
  <loc>https://bigyocalc.com/compare/bonus/</loc>
  <lastmod>2026-06-01</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.88</priority>
</url>
```

---

## 10. FAQ

### FAQ 후보

| 질문 | 답변 방향 |
| --- | --- |
| 성과급 비교표와 성과급 계산기는 무엇이 다른가요? | 비교표는 여러 회사/업종을 같은 기준으로 보는 페이지, 계산기는 내 입력값으로 결과를 추정하는 도구라고 설명 |
| 성과급은 세전 금액으로 비교해야 하나요? | 처음에는 세전 기준으로 구조를 보고, 최종 판단은 세후 실수령액 기준으로 보라고 안내 |
| 삼성전자와 SK하이닉스 성과급은 같은 방식으로 계산되나요? | 회사별 성과급 명칭과 지급 구조가 다르므로 같은 연봉·세후 기준으로 환산해 비교해야 한다고 안내 |
| 업종별 성과급 비교는 정확한 지급액인가요? | 공개자료와 계산 모델 기반 참고값이며 실제 지급액은 회사 공지와 개인 조건에 따라 달라진다고 고지 |
| 없는 회사는 어떻게 비교하나요? | 대기업 성과급 시뮬레이터 또는 업종별 비교 계산기를 먼저 사용하라고 안내 |

---

## 11. QA 체크리스트

- [ ] `/compare/bonus/`가 정상 빌드되는가?
- [ ] H1은 `성과급 비교표`로 노출되는가?
- [ ] title은 `성과급 비교표｜삼성전자·SK하이닉스·현대차·LG전자 성과급 계산기`로 설정되는가?
- [ ] 상단에서 대기업 성과급 시뮬레이터와 세후 계산기로 바로 이동할 수 있는가?
- [ ] 삼성전자, SK하이닉스, 현대차, LG전자 회사별 계산기 링크가 모두 정상인가?
- [ ] 반도체, 자동차, 정유사, 금융권, 조선업, IT 플랫폼 비교 계산기 링크가 모두 정상인가?
- [ ] 고지 문구에 추정/참고/실제 지급 조건 차이가 포함되어 있는가?
- [ ] 모바일 390px에서 카드와 CTA가 가로로 넘치지 않는가?
- [ ] `/compare/`에서 `/compare/bonus/`로 이동할 수 있는 CTA가 있는가?
- [ ] `src/styles/app.scss`에 스타일이 등록되는가?
- [ ] `public/sitemap.xml`에 URL이 등록되는가?
- [ ] `npm run build`가 성공하는가?

---

## 12. 구현 순서

1. `src/data/compareBonus.ts` 생성
2. `src/pages/compare/bonus/index.astro` 생성
3. `src/styles/scss/pages/_compare-bonus.scss` 생성
4. `src/styles/app.scss`에 `@use 'scss/pages/compare-bonus';` 추가
5. `public/sitemap.xml`에 `/compare/bonus/` 추가
6. `/compare/` 성과급 섹션에서 `/compare/bonus/` CTA 연결
7. `npm run build`
8. 로컬 브라우저에서 `/compare/bonus/` 확인

---

## 13. 다음 단계

이 문서를 기준으로 5번 단계에서 `/compare/bonus/`를 구현한다.

구현 시 핵심은 새 계산기를 만드는 것이 아니라, 이미 성과가 검증된 성과급 계산기들을 **검색 의도별로 재배열**하는 것이다. 특히 상단에는 `삼성전자 성과급 계산기`, `SK하이닉스 성과급 계산기`, `성과급 세후 실수령액 계산기`, `반도체 성과급 비교 계산기`를 강하게 노출한다.
