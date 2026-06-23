# 동탄·분당·수지·영통 대장 아파트 가격 비교 설계 문서

> 작성일: 2026-06-23  
> 대상 콘텐츠: `/reports/gyeonggi-south-leader-apartment-comparison-2026/`  
> 기획 문서: `docs/plan/202606/gyeonggi-south-leader-apartment-comparison-2026.md`  
> 콘텐츠 유형: 부동산 비교 리포트  
> 구현 목표: 경기 남부 대표 주거지 4곳의 대장 아파트 가격, 교통, 직주근접, 학군, 신축성, 리스크를 표와 카드로 비교하고, 내부 계산기 CTA로 이어지는 SEO형 리포트를 구현한다.

---

## 1. 설계 목표

### 1-1. 사용자 목표

사용자는 이 페이지에서 다음 답을 빠르게 얻어야 한다.

1. 동탄, 분당, 수지, 영통 중 84㎡ 기준 가격대가 어디가 높은가?
2. 각 지역의 대표 대장 단지는 무엇인가?
3. 지역별 가격을 밀어 올리는 핵심 요인은 무엇인가?
4. 교통, 직주근접, 학군, 신축성, 재건축 기대감은 어떻게 다른가?
5. 단기 급등, 가격 부담, 교통 편차 같은 리스크는 무엇인가?
6. 내 소득과 대출 여력으로 접근 가능한 가격대인지 계산하려면 어디로 가야 하는가?

### 1-2. 사이트 목표

이 리포트는 단순 정보 페이지가 아니라 내부 계산기 허브 역할도 해야 한다.

- 검색 유입: `동탄 분당 수지 영통 아파트 비교`, `경기 남부 대장 아파트`, `동탄 대장 아파트 가격`
- 체류 시간: 비교표, 점수표, 지역별 상세 카드, FAQ
- 내부 이동: 주택구입자금 계산기, 부부 월 현금흐름 계산기, 대출 관련 계산기, 전월세 비교 계산기
- 애드센스 품질: 출처 기준, 자체 비교 프레임, 리스크 고지, 투자 권유 회피

---

## 2. 페이지 정보 구조

### 2-1. 파일 구조

```text
src/
  data/
    gyeonggiSouthLeaderApartmentComparison2026.ts
    reports.ts
  pages/
    reports/
      gyeonggi-south-leader-apartment-comparison-2026.astro
  styles/
    app.scss
    scss/
      pages/
        _gyeonggi-south-leader-apartment-comparison-2026.scss
public/
  sitemap.xml
docs/
  plan/
    202606/
      gyeonggi-south-leader-apartment-comparison-2026.md
  design/
    202606/
      gyeonggi-south-leader-apartment-comparison-2026-design.md
```

### 2-2. URL

권장 URL:

```text
/reports/gyeonggi-south-leader-apartment-comparison-2026/
```

이유:

- 경기 남부 전체 비교 의도가 드러난다.
- `leader apartment`로 대장 아파트 의미를 표현한다.
- 연도 기반 리포트로 향후 2027 업데이트와 분리 가능하다.

### 2-3. 등록 위치

`src/data/reports.ts`에 신규 리포트 등록:

```ts
{
  slug: "gyeonggi-south-leader-apartment-comparison-2026",
  title: "동탄·분당·수지·영통 대장 아파트 가격 비교",
  description: "2026년 경기 남부 대표 주거지의 84㎡ 가격대, 교통, 직주근접, 학군, 신축성, 리스크를 비교합니다.",
  category: "real-estate",
  publishedAt: "2026-06-23",
  updatedAt: "2026-06-23",
  badges: ["경기 남부", "대장 아파트", "84㎡", "교통 비교"]
}
```

실제 `reports.ts` 타입에 맞춰 필드명은 조정한다.

---

## 3. 메타·SEO 설계

### 3-1. 메타 태그

| 항목 | 값 |
|---|---|
| title | 동탄·분당·수지·영통 대장 아파트 가격 비교｜2026 경기 남부 84㎡ 시세 순위 |
| description | 동탄, 분당, 수지, 영통의 대장 아파트 84㎡ 가격대와 GTX·신분당선·삼성전자·판교 접근성, 학군, 신축성, 재건축 기대, 리스크를 한 표로 비교합니다. |
| canonical | `https://bigyocalc.com/reports/gyeonggi-south-leader-apartment-comparison-2026/` |
| og:title | 2026 경기 남부 대장 아파트 84㎡ 시세 비교 |
| og:description | 동탄, 분당, 수지, 영통 중 어디가 더 비싸고 왜 비싼지 가격·교통·직주근접·학군·리스크 기준으로 비교합니다. |
| og:type | article |

### 3-2. H 태그 구조

```text
H1 동탄·분당·수지·영통 대장 아파트 가격 비교
  H2 2026 경기 남부 대장 아파트 한눈에 보기
  H2 동탄·분당·수지·영통 84㎡ 가격 비교표
  H2 지역별 대장 아파트와 가격을 만드는 이유
    H3 동탄: GTX-A와 반도체 벨트가 만든 신축 프리미엄
    H3 분당: 판교·강남 접근성과 재건축 기대
    H3 수지: 신분당선과 학군을 함께 보는 균형형
    H3 영통: 삼성전자 직주근접과 광교·수원 생활권
  H2 교통·직주근접·학군 점수 비교
  H2 신축 프리미엄과 재건축 기대감 비교
  H2 리스크 체크포인트
  H2 내 예산으로 어디까지 가능할까
  H2 자주 묻는 질문
```

### 3-3. 구조화 데이터

사용 권장:

- `Article`
- `FAQPage`
- `BreadcrumbList`

`FAQPage`는 실제 화면에 노출되는 FAQ와 동일한 문답만 JSON-LD에 넣는다.

---

## 4. 데이터 모델 설계

### 4-1. 핵심 타입

```ts
export type ApartmentRegionKey = "dongtan" | "bundang" | "suji" | "yeongtong";

export interface ApartmentScore {
  priceLevel: number;
  transport: number;
  jobAccess: number;
  schoolLife: number;
  newness: number;
  momentum: number;
  riskControl: number;
}

export interface ApartmentRegionComparison {
  key: ApartmentRegionKey;
  name: string;
  label: string;
  summary: string;
  representativeAreas: string[];
  leaderComplexes: string[];
  priceRange84: string;
  priceBasis: string;
  weeklyChange?: {
    value: string;
    label: string;
    sourceNote: string;
  };
  transport: string[];
  jobAccess: string[];
  schoolLife: string;
  newnessOrRedevelopment: string;
  mainRisk: string;
  whyExpensive: string[];
  buyerFit: string[];
  caution: string[];
  score: ApartmentScore;
}

export interface RelatedCalculatorLink {
  title: string;
  description: string;
  href: string;
  intent: string;
}

export interface ReportFaq {
  question: string;
  answer: string;
}
```

### 4-2. 메타 객체

```ts
export const GYEONGGI_SOUTH_APT_META = {
  slug: "gyeonggi-south-leader-apartment-comparison-2026",
  title: "동탄·분당·수지·영통 대장 아파트 가격 비교",
  seoTitle: "동탄·분당·수지·영통 대장 아파트 가격 비교｜2026 경기 남부 84㎡ 시세 순위",
  description:
    "동탄, 분당, 수지, 영통의 대장 아파트 84㎡ 가격대와 GTX·신분당선·삼성전자·판교 접근성, 학군, 신축성, 재건축 기대, 리스크를 한 표로 비교합니다.",
  publishedAt: "2026-06-23",
  updatedAt: "2026-06-23",
  url: "/reports/gyeonggi-south-leader-apartment-comparison-2026/"
} as const;
```

### 4-3. 지역 데이터 초안

```ts
export const GYEONGGI_SOUTH_APT_REGIONS: ApartmentRegionComparison[] = [
  {
    key: "dongtan",
    name: "동탄",
    label: "상승 탄력형",
    summary: "GTX-A, 동탄역, 반도체 벨트, 신축 대단지 선호가 겹친 지역입니다.",
    representativeAreas: ["동탄역", "동탄2신도시"],
    leaderComplexes: ["동탄역롯데캐슬", "동탄역시범우남퍼스트빌", "동탄역더샵센트럴시티"],
    priceRange84: "15억~20억대",
    priceBasis: "전용 84㎡ 최근 실거래가와 주요 매물가 범위 확인 필요",
    weeklyChange: {
      value: "2.22%",
      label: "최근 보도 기준 주간 상승률",
      sourceNote: "구현 전 한국부동산원 원문 기준 지역 단위 재확인"
    },
    transport: ["GTX-A", "SRT", "동탄역"],
    jobAccess: ["삼성전자", "화성·용인 반도체 벨트"],
    schoolLife: "보통~양호",
    newnessOrRedevelopment: "신축·준신축 대단지 강점",
    mainRisk: "단기 급등과 입지별 가격 편차",
    whyExpensive: ["GTX-A 후킹", "반도체 직주근접", "신축 프리미엄"],
    buyerFit: ["신축 선호", "동탄역 생활권", "반도체 출퇴근"],
    caution: ["단기 급등 후 추격 매수 부담", "역세권과 비역세권 가격 차이"],
    score: {
      priceLevel: 4,
      transport: 4.5,
      jobAccess: 4.5,
      schoolLife: 3.5,
      newness: 4.5,
      momentum: 5,
      riskControl: 2.5
    }
  }
];
```

### 4-4. 관련 링크 데이터

```ts
export const GYEONGGI_SOUTH_APT_RELATED_LINKS: RelatedCalculatorLink[] = [
  {
    title: "주택구입자금 계산기",
    description: "목표 아파트 가격을 넣고 필요한 현금과 대출 규모를 계산합니다.",
    href: "/tools/home-purchase-fund/",
    intent: "매수 가능 예산 계산"
  },
  {
    title: "부부 월 현금흐름 계산기",
    description: "연봉, 대출, 육아비, 생활비를 넣고 매달 얼마가 남는지 확인합니다.",
    href: "/tools/couple-monthly-cashflow-calculator/",
    intent: "월 부담 검증"
  },
  {
    title: "전월세 전환 계산기",
    description: "매수 대신 전세나 월세를 선택할 때의 체감 비용을 비교합니다.",
    href: "/tools/jeonwolse-conversion/",
    intent: "대체 선택지 비교"
  }
];
```

---

## 5. 페이지 컴포넌트 설계

### 5-1. 레이아웃 구성

Astro 페이지 구성:

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import SeoContent from "../../components/SeoContent.astro";
import {
  GYEONGGI_SOUTH_APT_META,
  GYEONGGI_SOUTH_APT_REGIONS,
  GYEONGGI_SOUTH_APT_RELATED_LINKS,
  GYEONGGI_SOUTH_APT_FAQ
} from "../../data/gyeonggiSouthLeaderApartmentComparison2026";
---

<BaseLayout
  title={GYEONGGI_SOUTH_APT_META.seoTitle}
  description={GYEONGGI_SOUTH_APT_META.description}
  canonicalPath={GYEONGGI_SOUTH_APT_META.url}
>
  <SiteHeader />
  <main class="gsla-page">
    ...
  </main>
</BaseLayout>
```

실제 `BaseLayout` props는 기존 코드 기준에 맞춘다.

### 5-2. 섹션 순서

```text
main.gsla-page
  section.gsla-hero
  section.gsla-summary
  section.gsla-primary-table
  section.gsla-region-details
  section.gsla-scoreboard
  section.gsla-risk
  section.gsla-budget-cta
  section.gsla-methodology
  section.gsla-related
  section.gsla-faq
```

### 5-3. Hero 섹션

구성:

- eyebrow: `2026 경기 남부 아파트 비교`
- H1: `동탄·분당·수지·영통 대장 아파트 가격 비교`
- lead: `84㎡ 가격대, 교통, 직주근접, 학군, 신축성, 리스크를 같은 기준으로 비교합니다.`
- hero stat 4개:
  - `분당`: 가격 레벨 상단
  - `동탄`: 최근 상승 탄력
  - `수지`: 신분당선·학군 균형
  - `영통`: 삼성전자 직주근접
- CTA:
  - `내 예산 계산하기` -> `/tools/home-purchase-fund/`
  - `월 현금흐름 보기` -> `/tools/couple-monthly-cashflow-calculator/`

### 5-4. Summary 카드

4개 지역 요약 카드:

```astro
{GYEONGGI_SOUTH_APT_REGIONS.map((region) => (
  <article class={`gsla-region-card gsla-region-card--${region.key}`}>
    <p class="gsla-region-card__label">{region.label}</p>
    <h2>{region.name}</h2>
    <p>{region.summary}</p>
    <dl>
      <div>
        <dt>84㎡ 가격대</dt>
        <dd>{region.priceRange84}</dd>
      </div>
      <div>
        <dt>핵심 리스크</dt>
        <dd>{region.mainRisk}</dd>
      </div>
    </dl>
  </article>
))}
```

### 5-5. 메인 비교표

컬럼:

1. 지역
2. 대표 단지
3. 84㎡ 최근 가격대
4. GTX/교통
5. 직주근접
6. 학군
7. 재건축/신축
8. 리스크

데스크톱:

- 일반 표
- 첫 번째 열 sticky 가능
- 가격대 열 강조

모바일:

- `overflow-x: auto` 표 유지
- 표 상단에 "좌우로 밀어 비교" 같은 안내 문구는 가능하나 과하게 설명하지 않는다.
- 최소 너비 `min-width: 860px`

### 5-6. 지역 상세 섹션

각 지역 카드 안에 포함:

- 대표 생활권
- 대표 단지
- 가격을 올리는 요인 3개
- 맞는 수요자
- 주의할 점

```astro
{region.whyExpensive.map((item) => <li>{item}</li>)}
{region.buyerFit.map((item) => <li>{item}</li>)}
{region.caution.map((item) => <li>{item}</li>)}
```

### 5-7. 점수표 섹션

점수 항목:

- 가격 레벨
- 교통
- 직주근접
- 학군·생활
- 신축성
- 상승 탄력
- 리스크 관리

표현:

- 숫자: `4.5 / 5`
- 막대: CSS width로 표현
- 색상: 단일 색상 남발 금지. 가격은 slate, 교통은 blue, 직주는 green, 리스크는 amber 계열 등으로 분산한다.

주의:

- 점수는 "매수 추천 점수"가 아니다.
- 섹션 상단에 `비교계산소 자체 평가 기준`이라고 명시한다.

### 5-8. 리스크 섹션

리스크 카드는 4개:

| 지역 | 리스크 |
|---|---|
| 동탄 | 단기 급등, 역세권·비역세권 가격 차이, 공급 변수 |
| 분당 | 가격 부담, 구축 관리비, 재건축 속도 |
| 수지 | 교통 편차, 지역별 가격 차이, 도로 정체 |
| 영통 | 입지별 격차, GTX 기대 현실화 시점, 동탄 대비 약한 후킹 |

각 카드에는 `매수 전 확인할 것` 리스트를 붙인다.

### 5-9. 예산 CTA 섹션

목적:

- 리포트에서 계산기로 이동시키는 핵심 구간
- 애드센스 관점에서도 페이지 고유성을 강화

구성:

```text
15억 아파트는 가격보다 월 현금흐름이 중요합니다.
같은 15억이라도 금리, 대출금, 관리비, 육아비에 따라 체감 부담은 완전히 달라집니다.
```

CTA 3개:

1. 주택구입자금 계산기
2. 부부 월 현금흐름 계산기
3. 전월세 전환 계산기

### 5-10. Methodology 섹션

필수 포함:

- 84㎡ 기준
- 실거래가와 매물가의 차이
- 주간 상승률의 행정구역 단위 한계
- 점수표가 자체 비교 지표라는 안내
- 투자 권유가 아니라 정보 제공 목적이라는 안내

---

## 6. 스타일 설계

### 6-1. 네임스페이스

모든 스타일은 `.gsla-page` 아래로 제한한다.

```scss
.gsla-page {
  --gsla-ink: #172033;
  --gsla-muted: #5b6475;
  --gsla-line: #d9e0ea;
  --gsla-panel: #ffffff;
  --gsla-soft: #f6f8fb;
  --gsla-blue: #2563eb;
  --gsla-green: #15803d;
  --gsla-amber: #b45309;
  --gsla-red: #b91c1c;
}
```

### 6-2. 색상 원칙

피해야 할 것:

- 한 가지 파란색 계열만 반복
- 과한 보라색 그라디언트
- 부동산 페이지에 맞지 않는 장식형 배경
- 카드 안에 카드 중첩

권장:

- 배경은 밝은 회색/흰색 중심
- 지역별 강조색은 약하게만 사용
- 가격, 리스크, 교통, 직주근접의 색상 역할을 분리

### 6-3. 카드 스타일

```scss
.gsla-region-card {
  border: 1px solid var(--gsla-line);
  border-radius: 8px;
  background: var(--gsla-panel);
  padding: 20px;
}
```

카드 반경은 8px 이하로 유지한다.

### 6-4. 표 스타일

```scss
.gsla-table-wrap {
  overflow-x: auto;
  border: 1px solid var(--gsla-line);
  border-radius: 8px;
}

.gsla-table {
  width: 100%;
  min-width: 860px;
  border-collapse: collapse;
}

.gsla-table th,
.gsla-table td {
  padding: 14px 16px;
  border-bottom: 1px solid var(--gsla-line);
  vertical-align: top;
}
```

### 6-5. 모바일

Breakpoint:

- `900px`: 2열 그리드 -> 1열
- `720px`: hero CTA 세로 정렬, 표 가로 스크롤
- `520px`: 카드 padding 축소, KPI 2열 또는 1열

모바일에서 지켜야 할 것:

- 표 텍스트가 버튼이나 CTA와 겹치지 않는다.
- 긴 단지명은 `word-break: keep-all; overflow-wrap: anywhere;` 조합으로 처리한다.
- CTA 버튼은 최소 높이 44px.
- 가로 스크롤 표 주변에 불필요한 설명 문구를 길게 넣지 않는다.

---

## 7. 접근성 설계

### 7-1. 표 접근성

- `<table>` 사용
- `<caption>` 제공
- `<th scope="col">`, `<th scope="row">` 적용
- 가격대와 점수는 텍스트로도 제공

### 7-2. CTA 접근성

- 링크 텍스트는 목적지가 드러나게 작성
- `자세히 보기` 단독 사용 지양
- 예: `부부 월 현금흐름 계산기로 월 부담 계산하기`

### 7-3. 색상 의존 방지

- 리스크는 빨간색만으로 표현하지 않는다.
- 텍스트 라벨 `리스크`, `주의`, `확인`을 함께 제공한다.

---

## 8. 콘텐츠 카피 설계

### 8-1. Hero 문구

```text
동탄·분당·수지·영통 대장 아파트 가격 비교

전용 84㎡ 기준 가격대, GTX·신분당선·수인분당선 교통, 삼성전자·판교·강남 직주근접, 학군, 신축성, 리스크를 같은 표로 비교합니다.
```

### 8-2. 비교표 상단 문구

```text
가격만 보면 분당이 가장 높은 레벨을 형성하지만, 최근 상승 탄력은 동탄이 강합니다. 수지는 신분당선과 학군의 균형, 영통은 삼성전자 직주근접과 수원·광교 생활권이 핵심입니다.
```

### 8-3. 데이터 안내 문구

```text
이 글의 가격대는 전용 84㎡ 기준 최근 실거래가와 주요 매물가를 함께 참고해 범위로 정리합니다. 같은 지역 안에서도 역세권, 동, 층, 향, 준공연도에 따라 실제 가격은 달라질 수 있습니다.
```

### 8-4. CTA 문구

```text
관심 지역을 골랐다면 이제 월 부담을 계산할 차례입니다. 같은 15억 아파트라도 대출금, 금리, 관리비, 육아비에 따라 매달 남는 돈은 완전히 달라집니다.
```

---

## 9. 내부 링크 전략

### 9-1. 필수 링크

| 위치 | 링크 | 목적 |
|---|---|---|
| Hero CTA | `/tools/home-purchase-fund/` | 매수 가능 예산 계산 |
| Hero CTA | `/tools/couple-monthly-cashflow-calculator/` | 월 현금흐름 계산 |
| 비교표 하단 | `/tools/jeonwolse-conversion/` | 매수 대신 전월세 비교 |
| 결론부 | `/reports/seoul-housing-2016-vs-2026/` 또는 실제 존재하는 10년 비교 리포트 | 10년 가격 비교 클러스터 |
| 리스크 섹션 | 대출 관련 계산기 | 금리 민감도 계산 |

### 9-2. 링크 검증

구현 전 반드시 실제 존재 경로를 확인한다.

```powershell
Test-Path src/pages/tools/home-purchase-fund.astro
Test-Path src/pages/tools/couple-monthly-cashflow-calculator.astro
Test-Path src/pages/tools/jeonwolse-conversion.astro
```

존재하지 않는 리포트 링크는 연결하지 않는다. `href="#"`는 사용하지 않는다.

---

## 10. 데이터 검증 루틴

### 10-1. 구현 전 확인

1. 한국부동산원 주간 아파트가격 동향 원문 확인
2. 사용자가 제시한 동탄 2.22%, 분당 0.49%, 영통 0.34%의 기준 단위 확인
3. 국토교통부 실거래가 공개시스템에서 대표 단지 전용 84㎡ 최근 거래 확인
4. 네이버부동산 또는 KB부동산에서 현재 매물가 범위 확인
5. 광교를 영통 행에 포함할지 별도 설명으로 둘지 결정
6. 행정구역 표기와 생활권 표기를 구분

### 10-2. 가격 데이터 표기 원칙

- 실거래가만 있으면 `최근 실거래 기준`
- 매물가를 섞으면 `실거래가와 주요 매물가 참고`
- 거래가 적으면 `거래량이 적어 범위 해석 필요`
- 오래된 거래만 있으면 기준월을 반드시 표시

### 10-3. 점수 데이터 표기 원칙

- 점수는 자체 비교 지표다.
- 점수는 매수 추천이나 투자 수익률 전망이 아니다.
- 점수표 아래에 산정 기준을 짧게 적는다.

---

## 11. FAQ 설계

FAQ는 최소 7개 권장.

```ts
export const GYEONGGI_SOUTH_APT_FAQ: ReportFaq[] = [
  {
    question: "동탄, 분당, 수지, 영통 중 어디가 가장 비싼가요?",
    answer:
      "전용 84㎡ 대장 단지 가격대만 보면 분당이 가장 높은 가격 레벨을 형성하는 경우가 많습니다. 다만 동탄역 인근 신축 대장 단지는 GTX-A와 반도체 수요가 반영되며 빠르게 분당과 비교되는 구간으로 올라왔습니다."
  },
  {
    question: "동탄은 왜 최근 상승세가 강한가요?",
    answer:
      "동탄은 GTX-A, SRT, 동탄역 생활권, 삼성전자와 반도체 벨트 수요, 신축 대단지 선호가 함께 작용합니다. 단기 상승률이 높을수록 실거래가와 매물가 차이, 대출 부담, 입주 물량을 함께 확인해야 합니다."
  }
];
```

FAQPage JSON-LD는 이 배열에서 자동 생성한다.

---

## 12. 위험 요소와 대응

### 12-1. 데이터 정확성 위험

위험:

- 보도 수치와 공식 통계 단위가 다를 수 있다.
- 동탄, 분당, 영통은 행정구역과 생활권 기준이 다를 수 있다.

대응:

- `한국부동산원 원문 기준 재확인` 코멘트를 데이터 업데이트 작업에 포함한다.
- 페이지 본문에는 "지역 단위가 통계 출처마다 다를 수 있다"는 안내를 넣는다.

### 12-2. 투자 권유 오해

위험:

- "대장", "상승", "저평가" 표현이 투자 권유처럼 보일 수 있다.

대응:

- `비교 정보 제공 목적` 고지.
- 리스크 섹션을 반드시 포함.
- "무조건", "확정", "지금 사야" 표현 금지.

### 12-3. 얇은 콘텐츠 위험

위험:

- 표 하나와 짧은 설명만 있으면 가치가 낮아 보일 수 있다.

대응:

- 메인 비교표
- 점수형 비교표
- 지역별 상세 해석
- 리스크 체크
- 예산 계산 CTA
- FAQ
- 데이터 기준 섹션

### 12-4. 모바일 가독성 위험

위험:

- 8열 표가 모바일에서 읽기 어렵다.

대응:

- 표는 가로 스크롤 처리.
- 요약 카드는 1열 카드로 제공.
- 지역별 상세 카드에서 표 내용을 다시 풀어준다.

---

## 13. 구현 체크리스트

### 13-1. 파일 생성

- [ ] `src/data/gyeonggiSouthLeaderApartmentComparison2026.ts`
- [ ] `src/pages/reports/gyeonggi-south-leader-apartment-comparison-2026.astro`
- [ ] `src/styles/scss/pages/_gyeonggi-south-leader-apartment-comparison-2026.scss`

### 13-2. 등록

- [ ] `src/data/reports.ts` 리포트 등록
- [ ] `src/styles/app.scss`에 `@use 'scss/pages/gyeonggi-south-leader-apartment-comparison-2026';`
- [ ] `public/sitemap.xml`에 URL 추가

### 13-3. 품질 검증

- [ ] `href="#"` 없음
- [ ] 미완성 신호 문구 없음
- [ ] 가격 기준일 표시
- [ ] 자체 점수 기준 표시
- [ ] 투자 권유 오해 방지 문구 포함
- [ ] 모바일 표 가독성 확인
- [ ] `npm run build` 성공

### 13-4. 스캔 명령

```powershell
rg -n '<애드센스 미완성 신호 패턴>' src docs public
npm run build
```

---

## 14. 배포 전 QA 시나리오

### 14-1. 콘텐츠 QA

1. H1과 title이 검색 의도에 맞는가?
2. 가격표가 84㎡ 기준이라는 점이 명확한가?
3. 동탄, 분당, 수지, 영통이 같은 기준으로 비교되는가?
4. 특정 지역을 과도하게 추천하지 않는가?
5. 리스크가 충분히 설명되는가?
6. 내부 계산기 CTA가 자연스럽게 이어지는가?

### 14-2. UI QA

1. 데스크톱에서 표가 잘리지 않는가?
2. 모바일에서 표가 가로 스크롤되는가?
3. 카드 안 텍스트가 넘치지 않는가?
4. CTA 버튼 텍스트가 줄바꿈되어도 깨지지 않는가?
5. 색상 대비가 충분한가?

### 14-3. 기술 QA

1. Astro build 성공
2. JSON-LD 문법 오류 없음
3. sitemap URL 중복 없음
4. reports 목록에서 노출 정상
5. 내부 링크 404 없음

---

## 15. 최종 구현 방향

이 페이지는 부동산 시세표처럼 보이면 안 된다. `비교계산소`의 강점은 사용자가 결정을 내릴 수 있게 숫자와 기준을 정리해주는 것이다.

따라서 구현 우선순위는 다음과 같다.

1. 첫 화면에서 네 지역의 포지션을 즉시 보여준다.
2. 84㎡ 가격 비교표로 검색 의도를 바로 충족한다.
3. 지역별 상세 해석으로 "왜 비싼지"를 설명한다.
4. 점수표로 비교계산소만의 고유 프레임을 만든다.
5. 리스크와 데이터 기준으로 신뢰도를 확보한다.
6. 마지막에는 주택구입자금과 부부 월 현금흐름 계산기로 연결한다.

이 구조로 만들면 검색 유입, 체류 시간, 내부 이동, 애드센스 품질을 동시에 챙길 수 있다.
