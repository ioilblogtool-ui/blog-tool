# 축구혁신위원회 2026 설계 문서

> 작성일: 2026-07-06  
> 콘텐츠 유형: `/reports/` 스포츠 제도·해설 리포트  
> 구현 대상 URL: `/reports/soccer-innovation-committee-2026/`  
> 연결 기획 문서: `docs/plan/202607/soccer-innovation-committee-2026.md`  
> 핵심 안전장치: `축구혁신위원회`가 공식 명칭인지 발행 직전 확인하고, 공식 확인 전에는 `축구 혁신 논의` 또는 `한국 축구 개혁 논의체`로 완화한다.

---

## 1. 문서 개요

- 구현 대상: `축구혁신위원회란? 한국 축구 개혁 과제 7가지`
- 권장 slug: `soccer-innovation-committee-2026`
- URL: `/reports/soccer-innovation-committee-2026/`
- 카테고리: 스포츠 / 축구 / 제도 / 협회 운영
- 메인 훅:
  - `한국 축구 개혁은 감독 교체보다 시스템을 바꾸는 문제다`
  - `대표팀·K리그·유소년·예산·팬 소통을 한 번에 보는 개혁 체크리스트`
- 주요 출력:
  - 축구혁신위원회 뜻과 역할
  - 공식/보도/분석/확인 필요 배지
  - 한국 축구 개혁 과제 7가지
  - 이해관계자별 영향
  - 개혁 점수표
  - 기존 스포츠 리포트·계산기 CTA
  - FAQ 8개 이상

## 2. 구현 방향

이 페이지는 단순 뉴스 정리가 아니라 `제도 허브`로 구현한다. 발행 직후에는 네이버 이슈 키워드를 잡고, 시간이 지난 뒤에는 구글에서 `한국 축구 개혁`, `축구협회 개혁`, `감독 선임 절차`, `K리그 유소년 투자` 같은 롱테일을 받는 구조가 목표다.

### 사용자가 얻는 것

- 축구혁신위원회가 정확히 무엇인지 빠르게 이해한다.
- 한국 축구 개혁을 감정이 아니라 구조와 지표로 나눠 본다.
- 대표팀 감독 선임, 협회 예산, K리그, 유소년 육성이 어떻게 연결되는지 이해한다.
- 기존 월드컵 감독 연봉, K리그 연봉, 월드컵 포상금 콘텐츠로 이어서 읽는다.

### 피해야 할 방향

- 특정 인물 비난으로 보이는 문장
- 공식 확인 없는 위원 명단·권한·예산 단정
- 뉴스 기사 요약처럼 얇은 본문
- `축구혁신위원회 출범 확정`처럼 사실 확인 전 단정하는 제목
- 기존 월드컵 감독 연봉 페이지와 중복되는 감독 비용 중심 구성

## 3. SEO 설계

### SEO title

권장:

```text
축구혁신위원회란? 한국 축구 개혁 과제 7가지 | 대표팀·K리그·유소년
```

공식 명칭 확인 전 대체안:

```text
한국 축구 혁신위원회 논의 | 축구협회 개혁 과제 7가지
```

### Meta description

```text
축구혁신위원회가 왜 필요한지, 한국 축구 개혁 과제를 대표팀 운영·감독 선임·K리그·유소년·심판·예산 공개 기준으로 정리합니다. 월드컵 감독 연봉, K리그 연봉, 월드컵 포상금 콘텐츠와 함께 축구 구조를 숫자로 비교합니다.
```

### H1

```text
축구혁신위원회란? 한국 축구 개혁 과제 7가지
```

공식 명칭 확인 전 완화 H1:

```text
한국 축구 혁신위원회 논의와 개혁 과제 7가지
```

### H2 후보

- 축구혁신위원회는 무엇을 하는 조직인가
- 왜 감독 선임만의 문제가 아닌가
- 한국 축구 개혁 과제 7가지
- 대표팀·K리그·유소년에게 어떤 영향이 있나
- 공개성·실행 가능성으로 보는 개혁 점수표
- 돈으로 보는 축구 개혁: 예산 공개가 중요한 이유
- 해외 사례는 어떻게 참고해야 하나
- 앞으로 확인해야 할 체크리스트
- 축구혁신위원회 FAQ

### 키워드 배치

| 키워드 | 위치 |
|---|---|
| 축구혁신위원회 | title, H1, 첫 문단, FAQ |
| 축구혁신위원회 뜻 | 첫 H2, FAQ |
| 축구혁신위원회 역할 | 역할 카드, FAQ |
| 축구협회 혁신위원회 | 명칭 확인 안내, 방법론 |
| 한국 축구 개혁 | title, Hero, 개혁 과제 섹션 |
| 축구협회 개혁 | 본문 중간, 예산 섹션 |
| 대표팀 감독 선임 | 개혁 과제, 내부 CTA |
| K리그 유소년 투자 | K리그·유소년 섹션 |
| 대한축구협회 예산 | 돈으로 보는 축구 개혁, 파생 콘텐츠 |

## 4. 데이터 신뢰도 설계

### 배지 체계

```ts
export type EvidenceBadge = "공식" | "보도 기준" | "분석" | "확인 필요";
```

| 배지 | 의미 | UI 색상 톤 |
|---|---|---|
| 공식 | 공식 발표·공식 문서 확인 | 초록 계열 |
| 보도 기준 | 주요 언론 보도 기준 | 파랑 계열 |
| 분석 | 공개 자료 기반 자체 분류 | 보라/회색 계열 |
| 확인 필요 | 발행 전 최신 확인 필요 | 노랑/주황 계열 |

### 필수 안내 문구

상단 `InfoNotice` 또는 별도 notice panel:

```text
이 페이지는 축구혁신위원회와 한국 축구 개혁 과제를 구조적으로 정리한 해설 리포트입니다. 위원회 명칭, 출범일, 위원 명단, 권한 범위는 발행 시점의 공식 발표와 보도 기준으로 확인해야 하며, 공개되지 않은 내용은 추정하지 않습니다.
```

### 최신성 표시

Hero 하단 또는 notice에 표시:

```text
업데이트 기준: 2026년 7월 6일 · 공식 발표 확인 필요
```

공식 자료 확인 후:

```text
업데이트 기준: 2026년 7월 6일 · 공식 발표/보도 기준 반영
```

## 5. 페이지 IA

1. Hero
   - H1
   - subcopy
   - badges
   - 업데이트 기준일
2. 상단 빠른 답변 박스
   - 네이버용 한 줄 요약
   - 공식 명칭 확인 여부 안내
3. 내부 CTA 3개
   - 월드컵 감독 연봉 비교
   - K리그 구단 연봉 순위
   - 월드컵 포상금 계산기
4. 데이터 신뢰도 안내
   - 공식/보도/분석/확인 필요 배지 설명
5. 왜 지금 필요한가
   - 대표팀 운영
   - 감독 선임 불신
   - K리그 연결
   - 유소년 육성
   - 팬 신뢰
6. 개혁 과제 7가지
   - 카드 그리드
   - 각 카드에 배지, 핵심 문제, 확인할 지표
7. 이해관계자별 영향
   - 대표팀, K리그, 유소년, 지도자·심판, 팬
8. 개혁 점수표
   - 공개성, 실행 가능성, 팬 체감, 장기 효과, K리그 연계
9. 돈으로 보는 축구 개혁
   - 예산 공개·대표팀 운영비·유소년 투자·지도자 교육·심판 시스템
   - 중간 CTA 삽입
10. 해외 사례 참고
   - 일본, 독일, 잉글랜드
   - 수치 사용은 공식 확인 후
11. 발행 후 확인 체크리스트
12. 하단 관련 콘텐츠
13. SeoContent
   - intro 5문단
   - inputPoints
   - criteria
   - FAQ 8개
   - related 5~6개

## 6. 화면 섹션 설계

### 6.1 Hero

컴포넌트:

- `BaseLayout`
- `SiteHeader`
- `CalculatorHero`
- 리포트 전용 커스텀 섹션

권장 마크업 개념:

```astro
<BaseLayout title={SIC_META.seoTitle} description={SIC_META.seoDescription} jsonLd={jsonLd}>
  <SiteHeader />
  <main class="container page-shell report-page sic-page">
    <CalculatorHero
      eyebrow="한국 축구 개혁 리포트"
      title={SIC_META.h1}
      description={SIC_META.description}
    />
    ...
  </main>
</BaseLayout>
```

Hero badges:

- `축구혁신위원회`
- `한국 축구 개혁`
- `축구협회`
- `K리그`
- `유소년`

### 6.2 빠른 답변 박스

목적: 네이버 검색 유입 사용자가 바로 답을 얻도록 한다.

문구:

```text
한 줄 요약
축구혁신위원회는 한국 축구의 감독 선임, 협회 운영, 예산 공개, 유소년 육성, K리그 연계, 심판 신뢰, 팬 소통을 점검해야 하는 개혁 논의체로 볼 수 있습니다. 공식 명칭과 권한은 발행 시점의 공식 발표를 기준으로 확인해야 합니다.
```

UI:

- 밝은 배경 패널
- 왼쪽 작은 라벨 `빠른 답변`
- 오른쪽 본문 2~3문장
- `확인 필요` 배지 노출 가능

### 6.3 상단 CTA

Hero 아래 바로 배치한다. 뉴스성 이탈을 줄이고 기존 고성과 스포츠 페이지로 보낸다.

| 카드 제목 | 설명 | 링크 |
|---|---|---|
| 월드컵 감독 연봉 비교 | 대표팀 운영 비용을 감독 연봉 기준으로 봅니다. | `/reports/worldcup-manager-salary-comparison-2026/` |
| K리그 구단 연봉 순위 | 리그 투자와 대표팀 경쟁력 연결을 봅니다. | `/reports/kleague-salary-comparison-2026/` |
| 월드컵 포상금 계산기 | 성적별 협회 상금과 선수단 포상금을 계산합니다. | `/tools/worldcup-prize-money-calculator/` |

클래스 예시:

```text
sic-cta-grid
sic-cta-card
sic-cta-card__label
sic-cta-card__title
sic-cta-card__desc
```

### 6.4 KPI 카드

| 카드 | 값 | 설명 |
|---|---|---|
| 개혁 축 | 7개 | 감독 선임부터 팬 소통까지 |
| 이해관계자 | 5그룹 | 대표팀·K리그·유소년·지도자·팬 |
| 핵심 지표 | 공개성 | 기준과 예산이 공개되는지 |
| 장기 과제 | 4~8년 | 월드컵 1회 사이클 이상 필요 |

주의: 숫자는 `분석` 배지로 표시한다. 공식 지표처럼 보이지 않게 `체크리스트 기준` 문구를 붙인다.

### 6.5 개혁 과제 카드

7개 카드를 2~3열 그리드로 배치한다.

각 카드 구성:

- 번호
- 제목
- evidenceBadge
- 한 줄 설명
- 현재 문제
- 확인할 지표 2~3개
- 관련 이해관계자 태그

카드 예시:

```text
01 감독 선임 절차 공개
후보군 기준, 평가 항목, 회의록 공개 범위, 이해충돌 여부를 분리해서 봐야 합니다.
확인할 지표: 후보 평가 기준 / 회의록 공개 범위 / 기술위원회 권한
```

### 6.6 이해관계자별 영향

목적: 사용자가 자기 관심사에 따라 빠르게 읽을 수 있게 한다.

탭 또는 카드 그리드 중 택일:

- 1차 구현은 카드 그리드 권장
- 인터랙션은 나중에 select/tabs로 확장 가능

그룹:

- 대표팀
- K리그
- 유소년
- 지도자·심판
- 팬

각 카드:

- 관심사
- 기대 변화
- 연결되는 개혁 과제

### 6.7 개혁 점수표

목적: 비교계산소다운 `숫자형 해석` 제공.

표 컬럼:

| 개혁 과제 | 공개성 | 실행 가능성 | 팬 체감 | 장기 효과 | K리그 연계 | 상태 |
|---|---:|---:|---:|---:|---:|---|

점수 표시:

- 숫자 1~5
- 모바일에서는 카드형으로 변환
- `분석` 배지와 주의 문구 필수

주의 문구:

```text
점수표는 공식 평가가 아니라 공개 자료와 팬 체감도를 바탕으로 한 분석용 체크리스트입니다. 실제 제도 변화 여부는 공식 발표와 후속 실행 결과를 기준으로 봐야 합니다.
```

### 6.8 돈으로 보는 축구 개혁

비교계산소 정체성과 가장 잘 맞는 섹션이다. 공식 수치가 없으면 무리해서 금액을 넣지 않고 `공개 필요 항목`으로 둔다.

분류 카드:

- 대표팀 운영
- 국제대회 준비
- 유소년 육성
- 지도자 교육
- 심판·경기 운영
- 행정비

각 카드:

- 공개 여부
- 왜 중요한가
- 연결 콘텐츠

중간 CTA:

- `월드컵 감독 연봉 비교`
- `월드컵 포상금 계산기`

### 6.9 해외 사례 참고

첫 구현은 정량 비교보다 방향성 카드로 제한한다.

| 국가 | 참고 포인트 | 주의 |
---|---|---|
| 일본 | 장기 육성, J리그 연계 | 구체 예산은 확인 후 사용 |
| 독일 | 유소년·지도자 교육 | 2000년대 개혁 사례 과도 단순화 금지 |
| 잉글랜드 | 리그 상업성, 아카데미 | 협회·리그 구조 차이 설명 |

## 7. 데이터 모델 설계

파일:

```text
src/data/soccerInnovationCommittee2026.ts
```

### 타입

```ts
export type EvidenceBadge = "공식" | "보도 기준" | "분석" | "확인 필요";

export type StakeholderGroup =
  | "대표팀"
  | "K리그"
  | "유소년"
  | "지도자·심판"
  | "팬";

export interface ReformTask {
  id: string;
  title: string;
  shortLabel: string;
  summary: string;
  currentProblem: string;
  whatToCheck: string[];
  affectedGroups: StakeholderGroup[];
  disclosureScore: number;
  feasibilityScore: number;
  fanImpactScore: number;
  longTermScore: number;
  kleagueLinkScore: number;
  statusLabel: string;
  evidenceBadge: EvidenceBadge;
}

export interface StakeholderImpact {
  group: StakeholderGroup;
  concern: string;
  expectedChange: string;
  relatedTaskIds: string[];
}

export interface VerificationItem {
  label: string;
  status: EvidenceBadge;
  sourceLabel: string;
  sourceUrl?: string;
  note: string;
}

export interface RelatedLink {
  href: string;
  label: string;
  description?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}
```

### 필수 export

```ts
export const SIC_META = {
  slug: "soccer-innovation-committee-2026",
  title: "축구혁신위원회란? 한국 축구 개혁 과제 7가지",
  h1: "축구혁신위원회란? 한국 축구 개혁 과제 7가지",
  seoTitle: "축구혁신위원회란? 한국 축구 개혁 과제 7가지 | 대표팀·K리그·유소년",
  seoDescription:
    "축구혁신위원회가 왜 필요한지, 한국 축구 개혁 과제를 대표팀 운영·감독 선임·K리그·유소년·심판·예산 공개 기준으로 정리합니다.",
  description:
    "대표팀 성적, 감독 선임, K리그 경쟁력, 유소년 육성, 심판 신뢰, 협회 예산 공개까지 한국 축구가 실제로 바꿔야 할 항목을 구조적으로 정리합니다.",
  updatedAt: "2026-07-06",
  dataStatusLabel: "공식 확인 필요",
};

export const SIC_REFORM_TASKS: ReformTask[] = [];
export const SIC_STAKEHOLDER_IMPACTS: StakeholderImpact[] = [];
export const SIC_VERIFICATION_ITEMS: VerificationItem[] = [];
export const SIC_RELATED_LINKS: RelatedLink[] = [];
export const SIC_FAQ: FaqItem[] = [];
```

### 초기 개혁 과제 데이터

1. `manager-selection`
   - 감독 선임 절차 공개
2. `association-governance`
   - 협회 의사결정 투명성
3. `budget-disclosure`
   - 예산 공개와 배분
4. `youth-development`
   - 유소년·지도자 육성
5. `kleague-national-team-link`
   - K리그 경쟁력과 대표팀 연계
6. `referee-discipline-trust`
   - 심판·징계·규정 신뢰
7. `fan-communication`
   - 팬 커뮤니케이션

## 8. Astro 페이지 설계

파일:

```text
src/pages/reports/soccer-innovation-committee-2026.astro
```

### import

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import {
  SIC_META,
  SIC_REFORM_TASKS,
  SIC_STAKEHOLDER_IMPACTS,
  SIC_VERIFICATION_ITEMS,
  SIC_RELATED_LINKS,
  SIC_FAQ,
} from "../../data/soccerInnovationCommittee2026";
---
```

### JSON-LD

`Article` 또는 `Report`에 가까운 `Article` JSON-LD를 사용한다.

```ts
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: SIC_META.h1,
  description: SIC_META.seoDescription,
  inLanguage: "ko-KR",
  dateModified: SIC_META.updatedAt,
  mainEntityOfPage: `https://bigyocalc.com/reports/${SIC_META.slug}/`,
  publisher: {
    "@type": "Organization",
    name: "비교계산소",
    url: "https://bigyocalc.com",
  },
};
```

### 섹션 순서

```astro
<BaseLayout title={SIC_META.seoTitle} description={SIC_META.seoDescription} jsonLd={jsonLd}>
  <SiteHeader />
  <main class="container page-shell report-page sic-page">
    <!-- Hero -->
    <!-- Quick answer -->
    <!-- Top CTA -->
    <!-- Evidence notice -->
    <!-- Why now -->
    <!-- Reform task cards -->
    <!-- Stakeholder impacts -->
    <!-- Score table -->
    <!-- Money section -->
    <!-- Global examples -->
    <!-- Verification checklist -->
    <!-- Related links -->
    <!-- SeoContent -->
  </main>
</BaseLayout>
```

## 9. SCSS 설계

파일:

```text
src/styles/scss/pages/_soccer-innovation-committee-2026.scss
```

등록:

```scss
@use 'scss/pages/soccer-innovation-committee-2026';
```

권장 prefix:

```text
sic-
```

### 주요 클래스

```scss
.sic-page {}
.sic-quick-answer {}
.sic-badge-row {}
.sic-cta-grid {}
.sic-cta-card {}
.sic-kpi-grid {}
.sic-kpi-card {}
.sic-section {}
.sic-section__head {}
.sic-task-grid {}
.sic-task-card {}
.sic-task-card__meta {}
.sic-stakeholder-grid {}
.sic-stakeholder-card {}
.sic-score-table-wrap {}
.sic-score-table {}
.sic-score-pill {}
.sic-money-grid {}
.sic-money-card {}
.sic-example-grid {}
.sic-example-card {}
.sic-verification-list {}
.sic-related-grid {}
```

### 레이아웃 기준

- 전체 컨테이너: 기존 `container page-shell report-page` 사용
- 카드 radius: 기존 디자인과 맞춰 8px 이하
- nested card 금지
- 모바일 1열, 태블릿 2열, 데스크톱 3열
- 표는 모바일에서 `overflow-x: auto` 또는 카드형 변환
- CTA 카드는 첫 화면에서 3개가 너무 커지지 않도록 간결하게

### 색상 톤

- 기본 토큰 사용
- 정치/이슈 콘텐츠처럼 보이지 않게 과한 빨강 사용 금지
- `확인 필요`는 노랑/주황 계열의 작은 배지로만 사용
- `공식`은 초록, `보도 기준`은 파랑, `분석`은 회색/보라 톤

## 10. 내부 CTA 설계

### 상단 CTA

Hero 바로 아래:

1. `/reports/worldcup-manager-salary-comparison-2026/`
   - 앵커: `월드컵 감독 연봉 비교`
   - 설명: `대표팀 운영 비용을 감독 연봉 기준으로 봅니다.`
2. `/reports/kleague-salary-comparison-2026/`
   - 앵커: `K리그 구단 연봉 순위`
   - 설명: `리그 투자와 대표팀 경쟁력 연결을 봅니다.`
3. `/tools/worldcup-prize-money-calculator/`
   - 앵커: `월드컵 포상금 계산기`
   - 설명: `성적별 협회 상금과 선수단 포상금을 계산합니다.`

### 중간 CTA

`돈으로 보는 축구 개혁` 섹션 끝:

```text
대표팀 운영 비용을 숫자로 먼저 보고 싶다면 월드컵 감독 연봉 비교와 월드컵 포상금 계산기를 함께 확인하세요.
```

### K리그 CTA

`K리그 경쟁력과 대표팀 연계` 카드 또는 섹션 끝:

```text
K리그 구단별 연봉 총액과 선수 연봉 순위는 K리그1 구단순위·연봉순위 리포트에서 이어서 볼 수 있습니다.
```

### 하단 related

- `/reports/worldcup-manager-salary-comparison-2026/`
- `/reports/korea-worldcup-squad-salary-2026/`
- `/reports/worldcup-squad-salary-total-comparison-2026/`
- `/reports/kleague-salary-comparison-2026/`
- `/tools/worldcup-prize-money-calculator/`
- `/reports/korea-football-legends-salary-comparison-2026/`

## 11. SeoContent 설계

### introTitle

```text
축구혁신위원회와 한국 축구 개혁 과제를 함께 봐야 하는 이유
```

### intro 5문단

1. 대표팀 성적과 감독 선임 이슈가 반복될 때마다 축구협회 운영 구조에 대한 관심이 커진다는 맥락.
2. 한국 축구 개혁은 감독 선임, 예산 공개, 유소년 투자, K리그 연계, 심판 신뢰, 팬 소통으로 나눠 봐야 한다는 구조.
3. 비교계산소의 기존 스포츠 숫자 콘텐츠와 연결되는 이유.
4. 개혁 점수표를 읽는 방법.
5. 공식 명칭·권한·명단·일정은 발행 시점 공식 발표 기준으로 확인해야 한다는 한계.

### inputPoints

- 축구혁신위원회가 어떤 역할을 해야 하는지 한눈에 봅니다.
- 한국 축구 개혁 과제를 대표팀·K리그·유소년·예산·팬 소통으로 나눠 봅니다.
- 개혁 점수표로 공개성, 실행 가능성, 팬 체감, 장기 효과를 비교합니다.
- 월드컵 감독 연봉, K리그 연봉, 월드컵 포상금 콘텐츠로 이어서 확인합니다.

### criteria

- 공식 발표와 보도 기준을 분리합니다.
- 공개되지 않은 위원 명단이나 예산은 추정하지 않습니다.
- 점수표는 자체 분석이며 공식 평가가 아닙니다.
- 금액이 들어가는 경우 `공식`, `보도 기준`, `추정`, `확인 필요` 배지를 붙입니다.

### FAQ

최소 8개, visible 상태.

1. 축구혁신위원회는 공식 조직인가요?
2. 축구혁신위원회는 무엇을 바꾸나요?
3. 감독 선임 문제가 핵심인가요?
4. 축구협회 예산도 공개되나요?
5. K리그와 축구혁신위원회는 어떤 관련이 있나요?
6. 개혁 점수표는 공식 평가인가요?
7. 해외 사례는 어떻게 비교하나요?
8. 이 페이지는 특정 인물을 비판하는 글인가요?

## 12. 등록 파일 설계

### `src/data/reports.ts`

추가 항목:

```ts
{
  slug: "soccer-innovation-committee-2026",
  title: "축구혁신위원회란? 한국 축구 개혁 과제 7가지",
  description: "대표팀 운영, 감독 선임, K리그, 유소년, 심판, 예산 공개 기준으로 한국 축구 개혁 과제를 정리한 리포트입니다.",
  order: <스포츠 최신 영역에 맞춰 지정>,
  badges: ["신규", "축구", "개혁"],
}
```

### `src/pages/index.astro`

`reportMetaBySlug`:

```ts
"soccer-innovation-committee-2026": { category: "sports", isNew: true },
```

### `src/pages/reports/index.astro`

`reportMetaBySlug`:

```ts
"soccer-innovation-committee-2026": {
  eyebrow: "한국 축구 개혁",
  tags: ["축구혁신위원회", "축구협회", "K리그"],
  category: "sports",
  isNew: true,
},
```

### `public/sitemap.xml`

```xml
<url>
  <loc>https://bigyocalc.com/reports/soccer-innovation-committee-2026/</loc>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>
</url>
```

## 13. 모바일 설계

- Hero 문구는 2~3줄 안에 들어오도록 한다.
- 상단 CTA 3개는 모바일에서 세로 스택.
- 개혁 과제 카드는 1열.
- 점수표는 모바일에서 가로 스크롤 또는 카드형으로 보여준다.
- FAQ는 접힘이 아니라 visible 콘텐츠로 제공한다.
- 관련 링크는 카드 높이를 낮춰 스크롤 부담을 줄인다.

## 14. 네이버 노출·CTR 설계

- 제목 첫 15자 안에 `축구혁신위원회` 포함.
- 첫 문단에 `축구혁신위원회`, `축구협회`, `한국 축구 개혁`, `대표팀`, `K리그`, `유소년` 포함.
- 빠른 답변 박스를 상단에 배치.
- `정리`, `역할`, `개혁 과제`, `7가지`, `뭐가 바뀌나` 계열 문구를 제목·H2에 반영.
- 기존 네이버 데이터상 CTR이 강한 `월드컵 감독 연봉 비교`로 상단 CTA 연결.

## 15. 구글 색인·체류 설계

- 본문은 1,500~2,500자 이상으로 구성.
- `SeoContent` intro 5문단 이상.
- FAQ 8개 이상 visible.
- 공식 확인 없는 수치와 명단은 쓰지 않음.
- 내부 링크를 상단, 중간, 하단에 반복하되 앵커 텍스트를 다르게 사용.
- 얇은 뉴스 요약이 아니라 evergreen 구조 리포트로 작성.

## 16. 발행 전 확인 체크리스트

- [ ] `축구혁신위원회` 공식 명칭 여부 확인
- [ ] 출범 주체 확인
- [ ] 출범일 또는 발표일 확인
- [ ] 위원 명단 공개 여부 확인
- [ ] 위원회 권한 확인
- [ ] 대한축구협회 공식 발표 확인
- [ ] 문체부 또는 국회 관련 공식자료 확인
- [ ] 대표팀 감독 선임 관련 최신 상황 확인
- [ ] K리그·유소년·심판 관련 공식 제도 자료 확인
- [ ] 내부 CTA URL 정상 확인
- [ ] `reports.ts`, 홈, 리포트 허브, sitemap 등록
- [ ] `npm run build` 성공

## 17. 리스크 관리

- **명칭 리스크**: 공식 명칭이 다르면 H1과 title을 완화한다.
- **인물 리스크**: 특정 인물 비난처럼 보이는 문장을 피한다.
- **데이터 리스크**: 공식 확인 없는 예산·명단·권한을 수치화하지 않는다.
- **중복 리스크**: 월드컵 감독 연봉 페이지와 겹치지 않게 이 페이지는 제도 허브로 유지한다.
- **시의성 리스크**: 업데이트 기준일을 Hero 또는 notice에 표시한다.

## 18. 완료 기준

- 첫 화면에서 `축구혁신위원회가 무엇인지` 5초 안에 이해된다.
- 개혁 과제 7가지가 카드로 정리되어 있다.
- 공식/보도/분석/확인 필요 배지가 분리되어 있다.
- 개혁 점수표가 공식 평가가 아님을 명확히 표시한다.
- 기존 스포츠 콘텐츠 5개 이상으로 내부 링크가 연결되어 있다.
- FAQ 8개 이상이 visible 상태다.
- `SeoContent`가 5문단 이상으로 구성되어 있다.
- 빌드가 성공한다.
