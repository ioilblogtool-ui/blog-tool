# 설계 문서
## 지자체 민생지원금 2026 완전 정리 (전국 종합판)

> 기획 원본: `docs/plan/202608/livelihood-grant-by-region-2026.md`
> 콘텐츠 유형: `/reports/` 정보성 리포트 (정적, 지역별 카드+bar 비교)
> 구현 대상 URL: `/reports/livelihood-grant-by-region-2026/`
> 핵심 안전장치: "4차 전국민 민생지원금"이 확정된 사실이 아니라는 점을 Hero 직후에서 바로 정정한다. 나주·고흥은 "추경 전제" 조건부임을, 함양군은 금액이 아직 없다는 점을 상태 배지로 명확히 구분한다.

---

## 0. 구현 개요

| 항목 | 값 |
|---|---|
| slug | `livelihood-grant-by-region-2026` |
| 페이지 경로 | `src/pages/reports/livelihood-grant-by-region-2026.astro` |
| 데이터 파일 | `src/data/livelihoodGrantByRegion2026.ts` |
| SCSS | `src/styles/scss/pages/_livelihood-grant-by-region-2026.scss` |
| SCSS prefix | `.lgr` |
| 스크립트 | 없음 (MVP는 정적 페이지, bar 폭은 Astro 서버 렌더링 시 계산) |
| 레이아웃 | `BaseLayout` 직접 구성 |
| 등록 카테고리 | `support` |
| 홈 노출 카테고리 라벨 | `복지·지원금` |
| 검증 명령어 | `npm run build` |

---

## 1. 제품 방향

### 1-1. 페이지 한 줄 정의

`"4차 전국민 민생지원금"은 아직 없다는 점을 정정하고, 2026년 자체 예산으로 전 주민 지원금을 지급했거나 추진 중인 지자체 19곳(진행중 5곳 + 지급완료 11곳)을 금액·상태·시기 기준으로 정리하는 리포트`

### 1-2. 사용자가 얻는 것

- "4차 민생지원금 전국 지급"이 사실이 아니라 지자체별 자체 지급이라는 점을 첫 화면에서 바로 확인
- 지금(2026-08) 신청 가능하거나 추석 전 지급 예정인 지역 5곳을 상태별로 구분해서 확인
- 이미 지급을 마친 11개 지역의 금액·시기를 한눈에 비교
- 우리 지역이 목록에 없다면 "아직 확정된 게 없다"는 점도 명확히 인지

### 1-3. 피해야 할 것

- "전국민 4차 지원금 확정" 같은 오해를 유발하는 제목·문구
- 나주·고흥의 "추경 전제" 조건을 빼고 "확정 지급"처럼 표현
- 함양군에 임의의 예상 금액을 만들어 넣기
- 목록에 없는 지역까지 포함된 것처럼 암시
- 보은군 60만원, 정읍시 30만원처럼 여러 차수가 합산/혼재된 금액을 단일 지급인 것처럼 단순화

---

## 2. 사실 검증 및 데이터 배지 설계

### 2-1. 진행 단계(stage) 정의

```ts
export type GrantStage = "applying" | "confirmed" | "conditional" | "inProgress" | "drafting" | "paid";
```

| stage | 라벨 | 의미 |
|---|---|---|
| `applying` | 신청중 | 이미 신청·접수가 시작된 상태 |
| `confirmed` | 추경 확정 | 추경이 의회를 통과해 시기·금액이 확정 |
| `conditional` | 추경 전제 | 발표는 됐지만 추경 통과가 조건 |
| `inProgress` | 추진중 | 추경·심의가 아직 남은 초기 추진 단계 |
| `drafting` | 조례 단계 | 조례 입법예고 등 법적 근거 마련 단계, 금액 미정 |
| `paid` | 지급완료 | 신청·지급이 이미 종료됨 |

### 2-2. 원문/교차 검증 완료 항목 (2026-08-07)

| 지역 | 확인 방법 |
|---|---|
| 속초시, 영동군, 함양군 | WebFetch 원문 직접 대조 |
| 나주시, 고흥군 | WebSearch 복수 언론사 교차 확인 |
| 영동군(1차), 보은군, 군위군, 괴산군, 의성군, 정읍시, 보성군, 남원시, 임실군, 단양군, 산청군 | WebFetch 또는 WebSearch로 지자체·언론 공식 발표 대조 |

전 항목이 검증됐으므로 이번 리포트는 `공식`/`확인 필요` 배지를 개별 항목마다 붙이기보다, **stage 배지로 진행 상태를 구분**하고 각 카드에 출처 링크를 직접 붙이는 방식을 사용한다 (기존 `gyeonggi-fiscal-crisis-2026`과 달리 출처 간 수치 충돌이 없어 별도 `확인 필요` 배지가 필요 없음).

---

## 3. 데이터 파일 설계

파일: `src/data/livelihoodGrantByRegion2026.ts`

### 3-1. 타입 정의

```ts
export type GrantStage = "applying" | "confirmed" | "conditional" | "inProgress" | "drafting" | "paid";

export interface GrantMeta {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  description: string;
  updatedAt: string;
  correctionNotice: string;
  dataNotice: string;
}

export interface GrantRegion {
  id: string;
  regionName: string;
  amountLabel: string;
  amountManwon: number | null;
  stage: GrantStage;
  stageLabel: string;
  timing: string;
  method: string;
  note?: string;
  sourceLabel: string;
  sourceUrl: string;
}

export interface KpiCardItem {
  label: string;
  value: string;
  note: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface RelatedLink {
  href: string;
  label: string;
}
```

### 3-2. 메타

```ts
export const LGR_META: GrantMeta = {
  slug: "livelihood-grant-by-region-2026",
  title: "지자체 민생지원금 2026 완전 정리",
  seoTitle: "지자체 민생지원금 2026 완전 정리 | 우리 지역도 받을 수 있을까",
  seoDescription:
    "영동군 80만원, 보은군 60만원부터 속초·나주·고흥 추석 전 지급까지 2026년 지자체별 자체 민생지원금 19곳을 금액·대상·신청기간 기준으로 정리했습니다.",
  description:
    "중앙정부의 전국민 4차 민생지원금은 아직 확정되지 않았습니다. 대신 일부 지자체가 자체 예산으로 전 주민 지원금을 지급했거나 추진 중입니다. 진행중 5곳과 지급완료 11곳을 정리했습니다.",
  updatedAt: "2026-08-07",
  correctionNotice:
    "2026-08-07 현재 중앙정부 차원의 전국민 대상 4차 민생지원금은 확정된 바 없습니다. 이 페이지가 다루는 것은 개별 지자체가 자체 예산(추경)으로 지급하는 지원금입니다.",
  dataNotice:
    "지역별 금액·시기는 각 지자체·언론 공식 발표를 기준으로 정리했으며, 추경 심의·조례 제정 결과에 따라 바뀔 수 있습니다. 신청 전 반드시 해당 지자체 공식 공고를 확인하세요.",
};
```

### 3-3. 진행중 5곳

```ts
export const LGR_IN_PROGRESS: GrantRegion[] = [
  {
    id: "sokcho",
    regionName: "강원 속초시",
    amountLabel: "1인당 20만원",
    amountManwon: 20,
    stage: "applying",
    stageLabel: "신청중",
    timing: "신청 7/20~9/11 · 사용기한 11/30",
    method: "무기명 선불카드 · 속초사랑상품권",
    sourceLabel: "서울신문",
    sourceUrl: "https://www.seoul.co.kr/news/society/2026/07/16/20260716500184",
  },
  {
    id: "yeongdong-2",
    regionName: "충북 영동군 (2차)",
    amountLabel: "1인당 30만원 · 1차 포함 누적 80만원",
    amountManwon: 30,
    stage: "confirmed",
    stageLabel: "추경 확정",
    timing: "추석 전 9월 지급 · 사용기한 12/31",
    method: "레인보우영동페이",
    note: "1차 50만원은 상반기 지급 완료. 2차 30만원은 3회 추경 의결로 확정.",
    sourceLabel: "뉴시스",
    sourceUrl: "https://www.newsis.com/view/NISX20260714_0003708487",
  },
  {
    id: "naju",
    regionName: "전남 나주시",
    amountLabel: "1인당 20만원",
    amountManwon: 20,
    stage: "conditional",
    stageLabel: "추경 전제",
    timing: "9월 제2회 추경 통과 시 9/14부터 신청 · 사용기한 11/30",
    method: "나주사랑상품권 (모바일 앱 충전 · 선불카드)",
    note: "총사업비 약 238억원. 추경이 시의회를 통과해야 지급이 시작됩니다.",
    sourceLabel: "뉴시스",
    sourceUrl: "https://www.newsis.com/view/NISX20260716_0003712472",
  },
  {
    id: "goheung",
    regionName: "전남 고흥군",
    amountLabel: "1인당 30만원",
    amountManwon: 30,
    stage: "inProgress",
    stageLabel: "추진중",
    timing: "추석(9/24) 전 목표",
    method: "고흥사랑상품권(지류)",
    note: "인구 약 5만9천명 기준 예산 약 180억원 추산. 추경·군의회 심의가 남아 있습니다.",
    sourceLabel: "더팩트",
    sourceUrl: "https://news.tf.co.kr/read/releasecopy/2339370.htm",
  },
  {
    id: "hamyang",
    regionName: "경남 함양군",
    amountLabel: "금액 미정",
    amountManwon: null,
    stage: "drafting",
    stageLabel: "조례 단계",
    timing: "조례 입법예고 7/15~8/4 종료",
    method: "미정",
    note: "민생안정지원금 지원 조례안 입법예고 단계로, 지급액·시기가 아직 정해지지 않았습니다.",
    sourceLabel: "국민참여입법센터",
    sourceUrl: "https://opinion.lawmaking.go.kr/gcom/sgLmPp/342529",
  },
];
```

### 3-4. 지급완료 11곳

```ts
export const LGR_COMPLETED: GrantRegion[] = [
  {
    id: "boeun",
    regionName: "충북 보은군",
    amountLabel: "1인당 60만원 (30만원×2회)",
    amountManwon: 60,
    stage: "paid",
    stageLabel: "지급완료",
    timing: "4월 마무리",
    method: "선불카드 · 지역화폐",
    note: "민생안정지원금 30만원 + 고유가 피해지원금 30만원, 2개 사업 합산액입니다.",
    sourceLabel: "충북일보",
    sourceUrl: "https://www.inews365.com/news/article.html?no=920884",
  },
  {
    id: "gunwi",
    regionName: "대구 군위군",
    amountLabel: "1인당 54만원",
    amountManwon: 54,
    stage: "paid",
    stageLabel: "지급완료",
    timing: "신청 2/20~3/23",
    method: "군위사랑상품권(지류)",
    sourceLabel: "군위군청",
    sourceUrl: "https://www.gunwi.go.kr/ko/page.do?board_code=&cmd=2&mnu_uid=666&not_ancmt_mgt_no=25575",
  },
  {
    id: "yeongdong-1",
    regionName: "충북 영동군 (1차)",
    amountLabel: "1인당 50만원",
    amountManwon: 50,
    stage: "paid",
    stageLabel: "지급완료",
    timing: "상반기",
    method: "레인보우영동페이",
    note: "2차 30만원은 진행중 목록을 참고하세요. 누적 80만원.",
    sourceLabel: "뉴시스",
    sourceUrl: "https://www.newsis.com/view/NISX20260714_0003708487",
  },
  {
    id: "goesan",
    regionName: "충북 괴산군",
    amountLabel: "1인당 50만원",
    amountManwon: 50,
    stage: "paid",
    stageLabel: "지급완료",
    timing: "신청 1/19~2/27 · 사용기한 5/31",
    method: "괴산사랑카드",
    note: "예산 총 180억원.",
    sourceLabel: "뉴스1",
    sourceUrl: "https://www.news1.kr/local/sejong-chungbuk/6001462",
  },
  {
    id: "uiseong",
    regionName: "경북 의성군",
    amountLabel: "일반세대 2인이상 60만원 (최대 200만원)",
    amountManwon: 60,
    stage: "paid",
    stageLabel: "지급완료",
    timing: "6월 20일 일괄 지급",
    method: "업종별 상이",
    note: "일반세대 1인 30만/2인이상 60만, 소상공인 최대 200만, 농업인 60~150만 등 업종별 차등. 총 312억원, 중복 지원 불가.",
    sourceLabel: "경북매일",
    sourceUrl: "https://www.kbmaeil.com/article/20260619500081",
  },
  {
    id: "jeongeup",
    regionName: "전북 정읍시",
    amountLabel: "1인당 30만원 (2차분)",
    amountManwon: 30,
    stage: "paid",
    stageLabel: "지급완료",
    timing: "신청 1/19~2/13 · 사용기한 5/31",
    method: "무기명 선불카드 · 정읍사랑상품권",
    note: "3차 고유가 피해 지원금이 별도로 추진 중이며 금액은 아직 미정입니다.",
    sourceLabel: "프레시안",
    sourceUrl: "https://www.pressian.com/pages/articles/2026011216530183077",
  },
  {
    id: "boseong",
    regionName: "전남 보성군",
    amountLabel: "1인당 30만원",
    amountManwon: 30,
    stage: "paid",
    stageLabel: "지급완료",
    timing: "신청 2/2~3/6",
    method: "보성사랑상품권",
    note: "가맹점 2,251개.",
    sourceLabel: "스포츠서울",
    sourceUrl: "https://www.sportsseoul.com/news/read/1581541",
  },
  {
    id: "namwon",
    regionName: "전북 남원시",
    amountLabel: "1인당 20만원",
    amountManwon: 20,
    stage: "paid",
    stageLabel: "지급완료",
    timing: "신청 2/2~2/27 · 사용기한 6/30",
    method: "무기명 선불카드",
    sourceLabel: "남원시청",
    sourceUrl: "https://www.namwon.go.kr/board/post/view.do?boardUid=ff8080818ea1b850018ea1e3e9ad0081",
  },
  {
    id: "imsil",
    regionName: "전북 임실군",
    amountLabel: "1인당 20만원",
    amountManwon: 20,
    stage: "paid",
    stageLabel: "지급완료",
    timing: "신청 1/12~2/6 · 사용기한 6/30",
    method: "무기명 선불카드",
    note: "총 51억원. 신청 2주 만에 지급률 94%.",
    sourceLabel: "문화일보",
    sourceUrl: "https://www.munhwa.com/article/11560024",
  },
  {
    id: "danyang",
    regionName: "충북 단양군",
    amountLabel: "1인당 20만원",
    amountManwon: 20,
    stage: "paid",
    stageLabel: "지급완료",
    timing: "신청 1/12~2/13",
    method: "단양사랑상품권(지류)",
    sourceLabel: "아시아투데이",
    sourceUrl: "https://www.asiatoday.co.kr/kn/view.php?key=20260105010001259",
  },
  {
    id: "sancheong",
    regionName: "경남 산청군",
    amountLabel: "1인당 20만원",
    amountManwon: 20,
    stage: "paid",
    stageLabel: "지급완료",
    timing: "신청 3/30~4/30 · 사용기한 9/30",
    method: "선불카드",
    sourceLabel: "잡포스트",
    sourceUrl: "https://www.job-post.co.kr/news/articleView.html?idxno=211118",
  },
];
```

### 3-5. KPI 카드

```ts
export const LGR_KPI_CARDS: KpiCardItem[] = [
  {
    label: "전국민 4차 지원금",
    value: "확정 아님",
    note: "2026-08-07 현재 중앙정부 차원의 전국민 대상 4차 지원금은 없습니다.",
  },
  {
    label: "누적 최고액",
    value: "80만원",
    note: "충북 영동군 · 1차 50만원 + 2차 30만원 합산 기준.",
  },
  {
    label: "지금 진행중인 지역",
    value: "5곳",
    note: "속초·영동(2차)·나주·고흥·함양 — 단계는 지역마다 다릅니다.",
  },
  {
    label: "이미 지급 완료된 지역",
    value: "11곳",
    note: "2026년 상반기~7월 기준으로 확인된 지역입니다.",
  },
];
```

### 3-6. FAQ

```ts
export const LGR_FAQ: FaqItem[] = [
  {
    q: "4차 민생지원금이 전국적으로 확정된 게 맞나요?",
    a: "아닙니다. 2026-08-07 현재 중앙정부 차원의 전국민 대상 4차 지원금은 확정되지 않았습니다. 이 페이지가 다루는 것은 일부 기초자치단체가 자체 예산으로 지급하는 지원금입니다.",
  },
  {
    q: "지금 신청 가능한 지역은 어디인가요?",
    a: "2026-08-07 기준 속초시가 신청을 받고 있습니다(9/11까지). 영동군 2차는 추석 전 지급이 확정됐고, 나주시·고흥군은 추경·심의를 앞두고 있어 아직 신청 시작 전입니다.",
  },
  {
    q: "나주시·고흥군은 확정된 건가요?",
    a: "아직 확정 단계는 아닙니다. 나주시는 9월 추경이 시의회를 통과해야 지급이 시작되고, 고흥군은 추경 편성과 군의회 심의가 남아 있습니다. 확정되면 이 페이지를 업데이트합니다.",
  },
  {
    q: "우리 지역이 목록에 없으면 지원금이 없는 건가요?",
    a: "이 페이지에 없다고 해서 앞으로도 없다는 뜻은 아닙니다. 다만 2026-08-07 기준으로 확인된 지자체만 정리했으며, 새로운 지역이 발표되면 추가할 예정입니다.",
  },
  {
    q: "보은군은 왜 60만원이 두 번 나오나요?",
    a: "보은군의 60만원은 단일 지급이 아니라 민생안정지원금 30만원과 고유가 피해지원금 30만원, 서로 다른 두 사업을 합산한 금액입니다.",
  },
  {
    q: "이 페이지 정보는 얼마나 최신인가요?",
    a: "2026-08-07 기준으로 각 지자체·언론 공식 발표를 확인해 정리했습니다. 추경 심의 결과나 조례 제정 여부에 따라 내용이 바뀔 수 있어 신청 전 해당 지자체 공식 공고를 다시 확인해야 합니다.",
  },
];
```

### 3-7. 관련 링크

```ts
export const LGR_RELATED_LINKS: RelatedLink[] = [
  { href: "/tools/welfare-benefit-eligibility/", label: "정부 지원금 대상 조회" },
  { href: "/reports/2026-government-welfare-benefits/", label: "2026 정부 복지 지원금 총정리" },
  { href: "/reports/birth-support-by-region-2026/", label: "2026 지역별 출산지원금 완전 비교" },
  { href: "/reports/seoul-gyeonggi-youth-allowance-comparison-2026/", label: "서울 vs 경기 청년수당 비교 2026" },
];
```

---

## 4. 페이지 IA 설계

### 4-1. 전체 구조

```text
[BaseLayout]
  [SiteHeader]
  <main class="container page-shell report-page lgr-page">
    [CalculatorHero]
    [InfoNotice]                  // 오해 정정 + 데이터 기준 안내 2문단
    .lgr-kpi-section               // KPI 카드 4개
    .lgr-progress-section          // 진행중 5곳 카드
    .lgr-completed-section         // 지급완료 11곳 bar rows
    .lgr-correction-section        // "왜 전국민 4차가 아닌가" 설명 카드
    [SeoContent]                   // FAQ + 관련 링크 + 서술형 인트로
  </main>
```

### 4-2. Hero

```astro
<CalculatorHero
  eyebrow="지자체 민생지원금"
  title={LGR_META.title}
  description="중앙정부의 전국민 4차 민생지원금은 아직 확정되지 않았습니다. 대신 일부 지자체가 자체 예산으로 전 주민 지원금을 지급했거나 추진 중입니다."
/>
```

### 4-3. InfoNotice

```astro
<InfoNotice
  title="오해 정정 및 데이터 기준"
  lines={[LGR_META.correctionNotice, LGR_META.dataNotice]}
/>
```

### 4-4. KPI 카드

```astro
<section class="content-section lgr-section" aria-labelledby="lgr-kpi-title">
  <div class="section-header section-header--compact">
    <p class="section-header__eyebrow">핵심 요약</p>
    <h2 id="lgr-kpi-title">"4차 전국민 지원금"이 아니라 지자체별 자체 지급입니다</h2>
  </div>
  <div class="lgr-kpi-grid">
    {LGR_KPI_CARDS.map((card) => (
      <article class="lgr-kpi-card">
        <p class="lgr-kpi-card__label">{card.label}</p>
        <strong class="lgr-kpi-card__value">{card.value}</strong>
        <p class="lgr-kpi-card__note">{card.note}</p>
      </article>
    ))}
  </div>
</section>
```

### 4-5. 진행중 5곳 카드

`stageClass` 헬퍼로 stage → 영문 modifier 매핑 (`applying`, `confirmed`, `conditional`, `inProgress`, `drafting`).

```astro
<section class="content-section lgr-section" aria-labelledby="lgr-progress-title">
  <div class="section-header section-header--compact">
    <p class="section-header__eyebrow">지금 새로 챙길 지역</p>
    <h2 id="lgr-progress-title">진행중인 지역 5곳</h2>
    <p>단계가 지역마다 다릅니다. "추경 전제"·"조례 단계"는 아직 확정이 아닙니다.</p>
  </div>
  <div class="lgr-progress-grid">
    {LGR_IN_PROGRESS.map((region) => (
      <article class={`lgr-progress-card lgr-progress-card--${stageClass(region.stage)}`}>
        <div class="lgr-progress-card__head">
          <span class="lgr-progress-card__region">{region.regionName}</span>
          <span class={`lgr-stage-badge lgr-stage-badge--${stageClass(region.stage)}`}>{region.stageLabel}</span>
        </div>
        <strong class="lgr-progress-card__amount">{region.amountLabel}</strong>
        <p class="lgr-progress-card__timing">{region.timing}</p>
        <p class="lgr-progress-card__method">{region.method}</p>
        {region.note && <p class="lgr-progress-card__note">{region.note}</p>}
        <a href={region.sourceUrl} target="_blank" rel="noopener noreferrer">{region.sourceLabel} →</a>
      </article>
    ))}
  </div>
</section>
```

### 4-6. 지급완료 11곳 bar rows

폭은 astro frontmatter에서 완료 목록 내 최댓값(보은군 60) 대비 계산. `amountManwon` 내림차순 정렬.

```astro
---
const completedSorted = [...LGR_COMPLETED].sort((a, b) => (b.amountManwon ?? 0) - (a.amountManwon ?? 0));
const completedMax = Math.max(...LGR_COMPLETED.map((r) => r.amountManwon ?? 0));
---
<section class="content-section lgr-section" aria-labelledby="lgr-completed-title">
  <div class="section-header section-header--compact">
    <p class="section-header__eyebrow">이미 지급 완료</p>
    <h2 id="lgr-completed-title">지급이 끝난 지역 11곳</h2>
    <p>2026년 상반기~7월 기준으로 확인된 지역입니다. 1인당 금액 기준으로 정렬했습니다.</p>
  </div>
  <div class="lgr-bar-rows">
    {completedSorted.map((region) => (
      <div class="lgr-bar-row">
        <span class="lgr-bar-row__label">{region.regionName}</span>
        <div class="lgr-bar-row__track">
          <div class="lgr-bar-row__fill" style={`width:${((region.amountManwon ?? 0) / completedMax) * 100}%`} />
        </div>
        <span class="lgr-bar-row__value">{region.amountLabel}</span>
      </div>
    ))}
  </div>
  <div class="lgr-completed-notes">
    {completedSorted.filter((r) => r.note).map((r) => (
      <p class="lgr-caution"><strong>{r.regionName}</strong> — {r.note}</p>
    ))}
  </div>
</section>
```

### 4-7. 오해 정정 섹션

```astro
<section class="content-section lgr-section lgr-correction-section" aria-labelledby="lgr-correction-title">
  <div class="section-header section-header--compact">
    <p class="section-header__eyebrow">정확히 알아두기</p>
    <h2 id="lgr-correction-title">왜 "전국민 4차 지원금"이 아닌가</h2>
  </div>
  <div class="lgr-correction-grid">
    <article class="lgr-correction-card">
      <h3>중앙정부 4차는 없다</h3>
      <p>2026-08-07 현재 정부 차원의 전국민 대상 4차 민생지원금 지급 계획은 확정되지 않았습니다.</p>
    </article>
    <article class="lgr-correction-card">
      <h3>지자체 자체 예산이 재원</h3>
      <p>속초·영동·나주·고흥 등은 각 지자체가 자체 추경을 편성해 지급하는 것으로, 국비가 아닌 지방비 사업입니다.</p>
    </article>
    <article class="lgr-correction-card">
      <h3>지역마다 조건이 다르다</h3>
      <p>기준일, 지급 방식(상품권·선불카드), 사용기한이 지역마다 다르므로 반드시 거주 지자체 공식 공고를 확인해야 합니다.</p>
    </article>
  </div>
</section>
```

---

## 5. SCSS 설계

파일: `src/styles/scss/pages/_livelihood-grant-by-region-2026.scss`

### 5-1. 기본 구조 및 그리드

```scss
.lgr-page {
  --lgr-ink: #172033;
  --lgr-muted: #627086;
  --lgr-line: rgba(23, 32, 51, 0.12);
  --lgr-soft: #f6f8fb;
  --lgr-blue: #1a56db;
  --lgr-green: #16a34a;
  --lgr-amber: #f59e0b;
  --lgr-slate: #64748b;
}

.lgr-section { margin-bottom: 2.5rem; }

.lgr-kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 0.9rem; }
.lgr-progress-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
.lgr-correction-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }

@media (min-width: 820px) {
  .lgr-progress-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .lgr-correction-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}

@media (min-width: 1100px) {
  .lgr-progress-grid { grid-template-columns: repeat(5, minmax(0, 1fr)); }
}
```

### 5-2. KPI 카드

```scss
.lgr-kpi-card {
  padding: 1.1rem;
  border: 1px solid var(--lgr-line);
  border-radius: 10px;
  background: #fff;

  &__label { margin: 0 0 0.3rem; color: var(--lgr-muted); font-size: 0.82rem; font-weight: 700; }
  &__value { color: var(--lgr-ink); font-size: 1.3rem; }
  &__note { margin: 0.3rem 0 0; color: var(--lgr-muted); font-size: 0.82rem; line-height: 1.55; }
}
```

### 5-3. 진행중 카드 + stage 배지

stage → modifier 매핑: `applying`, `confirmed`, `conditional`, `inProgress`, `drafting` (한글 라벨을 클래스명에 직접 쓰지 않는다).

```scss
.lgr-progress-card {
  padding: 1.1rem;
  border: 1px solid var(--lgr-line);
  border-top: 4px solid var(--lgr-slate);
  border-radius: 10px;
  background: #fff;

  &--applying { border-top-color: var(--lgr-green); }
  &--confirmed { border-top-color: var(--lgr-blue); }
  &--conditional { border-top-color: var(--lgr-amber); }
  &--inProgress { border-top-color: var(--lgr-amber); }
  &--drafting { border-top-color: var(--lgr-slate); }

  &__head { display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; margin-bottom: 0.6rem; }
  &__region { font-size: 0.84rem; font-weight: 800; color: var(--lgr-ink); }
  &__amount { display: block; font-size: 1.1rem; color: var(--lgr-ink); margin-bottom: 0.35rem; }
  &__timing, &__method { margin: 0 0 0.3rem; font-size: 0.82rem; color: var(--lgr-muted); }
  &__note { margin: 0.4rem 0; padding: 0.5rem 0.6rem; background: var(--lgr-soft); border-radius: 6px; font-size: 0.78rem; color: var(--lgr-muted); line-height: 1.6; }

  a { font-size: 0.78rem; color: var(--lgr-blue); text-decoration: none; &:hover { text-decoration: underline; } }
}

.lgr-stage-badge {
  display: inline-flex;
  padding: 0.16rem 0.55rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 800;
  color: #fff;
  white-space: nowrap;

  &--applying { background: var(--lgr-green); }
  &--confirmed { background: var(--lgr-blue); }
  &--conditional { background: var(--lgr-amber); }
  &--inProgress { background: var(--lgr-amber); }
  &--drafting { background: var(--lgr-slate); }
}
```

### 5-4. bar rows (지급완료)

```scss
.lgr-bar-rows { display: grid; gap: 0.55rem; }

.lgr-bar-row {
  display: grid;
  grid-template-columns: 9rem 1fr 13rem;
  align-items: center;
  gap: 0.75rem;
  padding: 0.55rem 0.9rem;
  border: 1px solid var(--lgr-line);
  border-radius: 8px;
  background: #fff;

  &__label { font-size: 0.84rem; font-weight: 700; color: var(--lgr-ink); }
  &__track { height: 9px; border-radius: 4px; background: #f3f4f6; overflow: hidden; }
  &__fill { height: 100%; border-radius: 4px; background: var(--lgr-blue); }
  &__value { font-size: 0.8rem; font-weight: 700; color: var(--lgr-ink); text-align: right; }
}

.lgr-completed-notes { margin-top: 0.8rem; display: grid; gap: 0.4rem; }
.lgr-caution { margin: 0; padding: 0.6rem 0.8rem; background: var(--lgr-soft); border-radius: 6px; font-size: 0.78rem; color: var(--lgr-muted); line-height: 1.65; }

@media (max-width: 640px) {
  .lgr-bar-row { grid-template-columns: 1fr; gap: 0.3rem; &__value { text-align: left; } }
}
```

### 5-5. 오해 정정 카드

```scss
.lgr-correction-card {
  padding: 1.1rem;
  border: 1px solid var(--lgr-line);
  border-radius: 10px;
  background: var(--lgr-soft);

  h3 { margin: 0 0 0.5rem; font-size: 0.96rem; color: var(--lgr-ink); }
  p { margin: 0; font-size: 0.84rem; color: var(--lgr-muted); line-height: 1.65; }
}
```

---

## 6. Astro 페이지 설계

파일: `src/pages/reports/livelihood-grant-by-region-2026.astro`

### 6-1. frontmatter 핵심

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import {
  LGR_META,
  LGR_KPI_CARDS,
  LGR_IN_PROGRESS,
  LGR_COMPLETED,
  LGR_FAQ,
  LGR_RELATED_LINKS,
} from "../../data/livelihoodGrantByRegion2026";

const faqItems = LGR_FAQ.map((item) => ({ question: item.q, answer: item.a }));
const related = LGR_RELATED_LINKS.map((item) => ({ href: item.href, label: item.label }));

const stageClass = (stage: string) => stage; // stage 값 자체가 이미 영문 camelCase 키

const completedSorted = [...LGR_COMPLETED].sort((a, b) => (b.amountManwon ?? 0) - (a.amountManwon ?? 0));
const completedMax = Math.max(...LGR_COMPLETED.map((r) => r.amountManwon ?? 0));

const siteUrl = (import.meta.env.SITE ?? "https://bigyocalc.com").replace(/\/$/, "");
const pageUrl = `${siteUrl}/reports/${LGR_META.slug}/`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": `${pageUrl}#article`,
      url: pageUrl,
      name: LGR_META.seoTitle,
      description: LGR_META.seoDescription,
      inLanguage: "ko-KR",
      datePublished: LGR_META.updatedAt,
      dateModified: LGR_META.updatedAt,
    },
    {
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      mainEntity: LGR_FAQ.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ],
};
---
```

> stage 값을 이미 영문 camelCase(`applying`/`confirmed`/`conditional`/`inProgress`/`drafting`/`paid`)로 저장하므로, 이전 리포트에서 썼던 `badgeClass("공식" → "official")` 같은 한→영 매핑 헬퍼가 필요 없다. `class={`lgr-stage-badge lgr-stage-badge--${region.stage}`}`로 바로 사용한다.

### 6-2. SeoContent

```astro
<SeoContent
  introTitle="지자체 민생지원금 2026, 전국민 4차와는 다릅니다"
  intro={[
    "온라인에 '4차 민생지원금 전국 지급', '전국민 30만원 추가' 같은 제목이 돌지만, 2026년 8월 7일 현재 중앙정부 차원의 전국민 대상 4차 지원금은 확정된 바 없습니다. 실제로는 일부 기초자치단체가 자체 예산(추경)으로 전 주민 대상 지원금을 지급했거나 추석 전 지급을 추진하는 상황입니다.",
    "지금(8월) 새로 챙겨볼 지역은 속초시(신청중), 영동군 2차(추경 확정), 나주시(추경 전제), 고흥군(추진중), 함양군(조례 단계) 5곳입니다. 단계가 지역마다 달라서, 신청이 실제로 가능한 곳과 아직 확정 전인 곳을 구분해서 봐야 합니다.",
    "2026년 상반기부터 7월까지는 영동군(누적 80만원), 보은군(60만원), 군위군(54만원)을 비롯해 11개 지역이 이미 지급을 마쳤습니다. 지역마다 기준일, 지급 방식(상품권·선불카드), 사용기한이 다르므로 이미 지급이 끝난 지역이라도 참고용으로만 확인하세요.",
    "이 페이지에 없는 지역이라고 해서 앞으로도 지원금이 없다는 뜻은 아닙니다. 2026년 8월 7일 기준으로 확인된 지자체만 정리했으며, 실제 신청 전에는 반드시 거주 지자체의 공식 공고를 다시 확인해야 합니다.",
  ]}
  criteria={[
    "발표 수치는 각 지자체·언론 공식 발표를 기준으로 합니다.",
    "진행 단계(신청중/확정/전제/추진중/조례단계)를 구분해 확정 여부를 명확히 표시합니다.",
    "여러 차수로 나뉜 지급(보은군, 정읍시 등)은 합산액과 구성을 함께 안내합니다.",
    "추경·조례 심의 결과가 나오면 업데이트가 필요합니다.",
  ]}
  faq={faqItems}
  related={related}
/>
```

---

## 7. 등록 설계

### 7-1. `src/data/reports.ts`

```ts
{
  slug: "livelihood-grant-by-region-2026",
  title: "지자체 민생지원금 2026 완전 정리 | 우리 지역도 받을 수 있을까",
  description: "영동군 80만원, 보은군 60만원부터 속초·나주·고흥 추석 전 지급까지 2026년 지자체별 자체 민생지원금 19곳을 금액·대상·신청기간 기준으로 정리했습니다.",
  order: <다음 순번>,
  badges: ["신규", "민생지원금", "지자체", "2026"],
}
```

### 7-2. `src/pages/index.astro`

```ts
"livelihood-grant-by-region-2026": { category: "support", isNew: true },
```

### 7-3. `src/pages/reports/index.astro`

```ts
"livelihood-grant-by-region-2026": {
  eyebrow: "지자체 민생지원금",
  tags: [
    { label: "민생지원금", mod: "asset" },
    { label: "지자체", mod: "asset" },
    { label: "2026", mod: "asset" },
  ],
  category: "support",
  isNew: true,
},
```

### 7-4. `src/styles/app.scss`

```scss
@use 'scss/pages/livelihood-grant-by-region-2026';
```

### 7-5. `public/sitemap.xml`

```xml
<url>
  <loc>https://bigyocalc.com/reports/livelihood-grant-by-region-2026/</loc>
  <lastmod>2026-08-07</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.75</priority>
</url>
```

> `changefreq: weekly` — 나주·고흥 추경 확정, 함양군 조례 통과 시 빠르게 업데이트해야 함.

---

## 8. 구현 순서

1. 데이터 파일 생성 (`livelihoodGrantByRegion2026.ts`) — 3장 전체 반영
2. Astro 페이지 생성 — Hero, InfoNotice, KPI, 진행중 카드, 완료 bar rows, 오해 정정, SeoContent
3. SCSS 생성 — `.lgr` prefix, stage 배지는 영문 camelCase 키 그대로 사용
4. 등록 파일 반영 — `reports.ts`, 홈 `reportMetaBySlug`, 리포트 허브 `reportMetaBySlug`, `app.scss`, `sitemap.xml`
5. `npm run build` 통과 확인 후 브라우저에서 bar 폭·배지 렌더링 확인

---

## 9. QA 체크리스트

### 콘텐츠 정확성

- [ ] Hero 직후에 "4차 전국민 지원금 아님"이 명확히 드러나는가?
- [ ] 나주·고흥이 "확정 지급"처럼 보이지 않고 조건부(추경 전제/추진중)로 표시되는가?
- [ ] 함양군에 임의의 예상 금액이 들어가 있지 않은가?
- [ ] 보은군·정읍시의 다차수 지급이 합산 구성과 함께 설명되는가?
- [ ] 모든 지역 카드/행에 출처 링크가 있는가?

### SEO

- [ ] title에 "민생지원금", "2026", 핵심 궁금증이 자연스럽게 포함되는가?
- [ ] description이 80~120자인가?
- [ ] FAQ가 화면에 보이고 JSON-LD와 같은 데이터에서 생성되는가?

### UI

- [ ] 진행중 카드 그리드가 데스크톱 5열 → 태블릿 3열 → 모바일 1열로 자연스럽게 쌓이는가?
- [ ] 완료 bar row가 320px 화면에서 라벨-바-값 순서로 깨지지 않는가?
- [ ] stage 배지 색상이 5개 상태를 시각적으로 구분하는가?

### 등록·검증

- [ ] `src/data/reports.ts` 등록
- [ ] `src/pages/index.astro`의 `reportMetaBySlug` 등록
- [ ] `src/pages/reports/index.astro`의 `reportMetaBySlug` 등록
- [ ] `src/styles/app.scss` 등록
- [ ] `public/sitemap.xml` 등록
- [ ] `npm run build` 통과

---

## 10. 최종 판단

이 리포트는 계산 로직이 없는 **정적 정리형 리포트**다. 핵심은 ①"4차 전국민 지원금"이라는 오해를 첫 화면에서 정정하는 것, ②진행 단계를 5단계 배지로 명확히 구분하는 것, ③다차수 지급(보은·영동·정읍)을 합산액과 구성 그대로 투명하게 보여주는 것이다. 나주·고흥·함양의 상태가 바뀌면 `LGR_META.updatedAt`과 해당 지역의 `stage`/`amountLabel`만 갱신하면 된다.
