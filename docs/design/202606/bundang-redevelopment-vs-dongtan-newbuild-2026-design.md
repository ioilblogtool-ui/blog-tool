# 분당 재건축 vs 동탄 신축 비교 리포트 2026 설계 문서

> 기획 원문: `docs/plan/202606/bundang-redevelopment-vs-dongtan-newbuild-2026.md`
> 작성일: 2026-06-23
> 콘텐츠 유형: `/reports/` 인터랙티브 비교 리포트
> 핵심 원칙: "분당이 낫다 / 동탄이 낫다"는 결론을 내리지 않는다. 우선순위(실거주·투자·학군·교통)별로 항목별 비교를 보여주고, 재건축 사업 단계·가격은 모두 "현재 기준", "추정", "확정 아님" 배지를 단다. 최근 삼성·SK하이닉스 셔틀 리포트에서 적용한 "권역 평균 추정 + 실거래가 기준 개별 단지 예시" 패턴을 재사용한다.

---

## 1. 문서 개요

- 구현 대상: `분당 재건축 vs 동탄 신축 비교 리포트 2026`
- slug: `bundang-redevelopment-vs-dongtan-newbuild-2026`
- URL: `/reports/bundang-redevelopment-vs-dongtan-newbuild-2026/`
- 카테고리: 부동산·내집마련
- 핵심 검색 의도: `분당 재건축 vs 동탄 신축`, `분당 재건축 시범단지`, `동탄 신축 아파트`, `15억 아파트 비교`, `1기 신도시 재건축`
- 핵심 출력: 7개 항목 비교 프레임, 우선순위별 해석 문구, 예산 슬라이더 기준 매수 가능 단지 예시, 분당 재건축 진행 타임라인, 동탄 입주 물량
- 안전 문구: 재건축 사업 단계와 분담금은 확정값이 아니라 현재 진행 상황 기준 정리이며, 가격은 특정 시점 실거래 예시이지 권역 전체 평균이 아니다.

---

## 2. 구현 파일 구조

```text
src/
  data/
    bundangRedevelopmentVsDongtan2026.ts
  pages/
    reports/
      bundang-redevelopment-vs-dongtan-newbuild-2026.astro

public/
  scripts/
    bundang-redevelopment-vs-dongtan-newbuild-2026.js

src/styles/scss/pages/
  _bundang-redevelopment-vs-dongtan-newbuild-2026.scss
```

필수 등록:

- `src/data/reports.ts`
- `src/styles/app.scss`에 `@use 'scss/pages/bundang-redevelopment-vs-dongtan-newbuild-2026';`
- `public/sitemap.xml`
- `src/pages/index.astro`의 `reportMetaBySlug`에 `estate` 카테고리로 등록

선택 등록:

- `/tools/home-purchase-fund/`, `/tools/income-home-affordability/` 결과 페이지 하단 CTA 추가
- OG 이미지 생성 대상: `public/og/reports/bundang-redevelopment-vs-dongtan-newbuild-2026.png`

---

## 3. 데이터 모델

파일: `src/data/bundangRedevelopmentVsDongtan2026.ts`

### 3-1. 기본 타입

```ts
export type ComparisonPriority = "live" | "invest" | "school" | "transit";
export type DataConfidence = "공식 발표" | "보도 기준" | "추정" | "확정 전";

export interface ComparisonFrameRow {
  id: string;
  labelKo: string;
  bundangValue: string;
  dongtanValue: string;
  confidence: DataConfidence;
  note?: string;
  relatedPriority?: ComparisonPriority[]; // 이 항목이 강조되는 우선순위 탭
}

export interface PriorityTabConfig {
  id: ComparisonPriority;
  label: string;
  bundangSummary: string;
  dongtanSummary: string;
  interpretation: string;
}

export interface BundangStageItem {
  zoneName: string; // 시범단지 / 양지마을 / 샛별마을 / 목련마을
  complexes: string[];
  stage: string; // 선도지구 지정 / 특별정비구역 지정 / 사업시행자 선정 등
  stageDate: string;
  nextStep: string;
  confidence: DataConfidence;
}

export interface DongtanSupplyItem {
  complexName: string;
  area: string;
  units: number;
  moveInLabel: string; // "2026년 3월 입주 예정" 등
  confidence: DataConfidence;
}

export interface RealExample {
  region: "bundang" | "dongtan";
  complex: string;
  location: string;
  sizeLabel: string;
  priceEokMin: number;
  priceEokMax: number;
  tradeLabel: string;
  sourceLabel: string;
}

export interface ComparisonFaq {
  question: string;
  answer: string;
}
```

### 3-2. 필수 export

```ts
export const BRD_META = {
  slug: "bundang-redevelopment-vs-dongtan-newbuild-2026",
  title: "분당 재건축 vs 동탄 신축, 15억이면 어디가 나을까",
  seoTitle: "분당 재건축 vs 동탄 신축 비교 2026 - 15억이면 어디가 나을까",
  seoDescription:
    "분당 재건축 시범단지와 동탄 신축 아파트를 학군, 교통, 투자 포인트, 리스크 기준으로 비교합니다. 내 상황에 맞는 선택 기준을 확인하세요.",
  dataAsOf: "2026-06",
  updatedAt: "2026-06-23",
  dataNote:
    "분당 재건축 사업 단계와 분담금은 확정값이 아니라 진행 상황 기준 정리이며, 가격은 국토교통부 실거래가 공개시스템 기준 특정 시점 예시입니다. 이 리포트는 두 지역 중 우열을 가리는 자료가 아닙니다.",
};

export const BRD_COMPARISON_FRAME: ComparisonFrameRow[] = [];
export const BRD_PRIORITY_TABS: PriorityTabConfig[] = [];
export const BRD_BUNDANG_STAGES: BundangStageItem[] = [];
export const BRD_DONGTAN_SUPPLY: DongtanSupplyItem[] = [];
export const BRD_REAL_EXAMPLES: RealExample[] = [];
export const BRD_FAQ: ComparisonFaq[] = [];
export const BRD_RELATED_LINKS: { href: string; label: string }[] = [];
```

### 3-3. 비교 프레임 데이터 (기획 문서 섹션 3 반영)

```ts
export const BRD_COMPARISON_FRAME: ComparisonFrameRow[] = [
  {
    id: "satisfaction",
    labelKo: "현재 주거 만족도",
    bundangValue: "단지 노후도에 따라 편차 있음 (배관·주차 불편 vs 넓은 녹지·생활 인프라)",
    dongtanValue: "높음 (신축 커뮤니티·주차·단열)",
    confidence: "추정",
    relatedPriority: ["live"],
  },
  {
    id: "stage",
    labelKo: "재건축/개발 진행 단계",
    bundangValue: "선도지구 지정(2024.11) → 특별정비구역 지정(2026.1, 샛별마을·시범우성·목련마을) → 사업시행자 선정 진행 중",
    dongtanValue: "입주 진행 중 (2026년 화성시 2개 단지 1,765세대 추가 입주)",
    confidence: "보도 기준",
    note: "분당은 착공·완공이 아니라 정비구역 지정 단계. 시범단지 이주 목표는 2029년.",
    relatedPriority: ["live", "invest"],
  },
  {
    id: "school",
    labelKo: "학군",
    bundangValue: "전통적으로 강한 권역으로 형성",
    dongtanValue: "신도시 학군 조성 중, 단지·블록별 편차 큼",
    confidence: "확정 전",
    note: "정량 지표(진학률 등) 미확인. 우열 단정 표현 사용하지 않음.",
    relatedPriority: ["school"],
  },
  {
    id: "transit",
    labelKo: "강남 접근성",
    bundangValue: "신분당선으로 환승 없이 강남역 도달",
    dongtanValue: "GTX-A 개통으로 수서까지 약 20분대 단축",
    confidence: "공식 발표",
    note: "GTX-A는 일반 지하철과 배차간격·요금 구조가 다름.",
    relatedPriority: ["transit"],
  },
  {
    id: "volatility",
    labelKo: "가격 변동성",
    bundangValue: "선도지구 지정 이후 단지별 격차 확대 (서현시범우성 16.1억 vs 양지마을1단지금호 23.75억, 84㎡ 기준)",
    dongtanValue: "GTX-A 개통 전후 단기 급등 (예: 메타폴리스 84㎡ 분양가 4억대 → 9억대)",
    confidence: "보도 기준",
    note: "분당은 같은 선도지구 안에서도 단지(우성·현대·금호 등)에 따라 84㎡ 기준 7억 이상 차이가 확인된다.",
    relatedPriority: ["invest"],
  },
  {
    id: "investPoint",
    labelKo: "투자 포인트",
    bundangValue: "토지 가치 + 재건축 사업성 (용적률 상향, 통합 재건축 인센티브)",
    dongtanValue: "직주근접 신축 희소성 + GTX 노선 추가 호재",
    confidence: "추정",
    relatedPriority: ["invest"],
  },
  {
    id: "risk",
    labelKo: "핵심 리스크",
    bundangValue: "재건축 속도 지연, 분담금 미확정, 이주·재정착 기간 거주 불편",
    dongtanValue: "단기 급등 후 조정 가능성, GTX 운임·배차 변수, 상권 성숙도 시간 소요",
    confidence: "추정",
    relatedPriority: ["live", "invest", "transit"],
  },
];
```

### 3-4. 우선순위 탭 데이터

```ts
export const BRD_PRIORITY_TABS: PriorityTabConfig[] = [
  {
    id: "live",
    label: "실거주 우선",
    bundangSummary: "생활 인프라는 완성되어 있지만 이주·재정착까지 거주 불편이 발생할 수 있습니다.",
    dongtanSummary: "신축 편의성은 높지만 상권·생활 인프라가 아직 성숙하는 중인 구역도 있습니다.",
    interpretation: "지금 당장 안정적인 거주를 원한다면 분당의 기존 인프라가, 새 시설 위주의 생활을 원한다면 동탄 신축이 부합합니다.",
  },
  {
    id: "invest",
    label: "투자 우선",
    bundangSummary: "재건축 사업성에 기댄 장기 투자 성격이 강하고, 분담금 규모가 수익을 좌우합니다.",
    dongtanSummary: "이미 GTX-A 개통 호재가 가격에 상당 부분 반영된 상태로, 추가 상승 여력은 신중히 봐야 합니다.",
    interpretation: "분당은 사업 진행 속도와 분담금이, 동탄은 추가 호재(노선 연장 등) 여부가 핵심 변수입니다.",
  },
  {
    id: "school",
    label: "학군 우선",
    bundangSummary: "전통적으로 학원가·학군이 잘 형성되어 있다는 평가가 많습니다.",
    dongtanSummary: "신도시 특성상 학군이 만들어지는 중이며 블록별 차이가 있습니다.",
    interpretation: "이미 형성된 학군을 원하면 분당, 신도시 성장과 함께할 수 있다면 동탄도 고려할 수 있습니다.",
  },
  {
    id: "transit",
    label: "교통 우선",
    bundangSummary: "신분당선으로 환승 없이 강남 출퇴근이 가능합니다.",
    dongtanSummary: "GTX-A로 서울 접근성이 크게 개선됐지만 배차간격과 요금 구조를 함께 봐야 합니다.",
    interpretation: "매일 강남 출퇴근이라면 신분당선의 환승 없는 안정성과 GTX-A의 속도를 직접 비교해보는 것이 좋습니다.",
  },
];
```

### 3-5. 분당 재건축 진행 현황

```ts
export const BRD_BUNDANG_STAGES: BundangStageItem[] = [
  {
    zoneName: "시범단지",
    complexes: ["우성", "현대", "장안타운 건영3차"],
    stage: "특별정비구역 지정(시범우성) · 현대-우성 예비사업자 지정",
    stageDate: "2026-01-19 (특별정비구역) / 2026-05-30 (예비사업자)",
    nextStep: "사업시행자 정식 선정 → 이주(목표 2029년)",
    confidence: "보도 기준",
  },
  {
    zoneName: "양지마을",
    complexes: ["1단지 금호", "2단지 청구", "3·5단지 금호한양", "5단지 한양", "6단지 금호청구·한양"],
    stage: "사업시행자 투표로 대신자산신탁 선정",
    stageDate: "2026-06",
    nextStep: "소유주 설명회·동의서 징구 → 정식 사업시행자 지정(이르면 7월)",
    confidence: "보도 기준",
  },
  {
    zoneName: "샛별마을",
    complexes: ["동성", "라이프", "우방", "삼부", "현대"],
    stage: "특별정비구역 지정",
    stageDate: "2026-01-19",
    nextStep: "사업시행자 선정 절차 진행",
    confidence: "보도 기준",
  },
  {
    zoneName: "목련마을",
    complexes: ["빌라단지"],
    stage: "특별정비구역 지정",
    stageDate: "2026-01-19",
    nextStep: "사업시행자 선정 절차 진행",
    confidence: "보도 기준",
  },
];
```

### 3-6. 동탄 신축 입주 물량

```ts
export const BRD_DONGTAN_SUPPLY: DongtanSupplyItem[] = [
  {
    complexName: "동탄신도시 금강펜테리움6차센트럴파크",
    area: "화성시 신동",
    units: 1103,
    moveInLabel: "2026년 2월 입주 예정",
    confidence: "보도 기준",
  },
  {
    complexName: "동탄신도시 금강펜테리움7차센트럴파크",
    area: "화성시 신동",
    units: 662,
    moveInLabel: "2026년 7월 입주 예정",
    confidence: "보도 기준",
  },
  {
    complexName: "힐스테이트 동탄역 센트릭",
    area: "화성시 오산동 동탄2신도시",
    units: 0, // 구현 직전 정확한 세대수 재확인 (분양 당시 자료 기준 별도 단지, 화성시 1,765세대 집계와는 별도)
    moveInLabel: "2026년 입주 예정 (분양 당시 안내 기준)",
    confidence: "보도 기준",
  },
];
```

> 보강 결과: 화성시 2026년 입주 1,765세대는 금강펜테리움6차(1,103세대, 2026.2) + 7차(662세대, 2026.7) 두 단지로 확인됨(1,103+662=1,765 정확히 일치). 힐스테이트동탄역센트릭은 별도 단지로, 정확한 세대수와 최종 입주월은 구현 직전 분양 공고 원문으로 재확인한다.

### 3-7. 실거래가 기준 예시 (삼성·SK하이닉스 셔틀 리포트 패턴 재사용)

```ts
export const BRD_REAL_EXAMPLES: RealExample[] = [
  {
    region: "bundang",
    complex: "서현시범우성",
    location: "성남시 분당구 서현동 (시범단지)",
    sizeLabel: "전용 84㎡",
    priceEokMin: 16.1,
    priceEokMax: 16.1,
    tradeLabel: "2025년 3월 실거래",
    sourceLabel: "국토교통부 실거래가 공개시스템 기준 보도",
  },
  {
    region: "bundang",
    complex: "서현시범현대",
    location: "성남시 분당구 서현동 (시범단지)",
    sizeLabel: "전용 84㎡",
    priceEokMin: 19.9,
    priceEokMax: 19.9,
    tradeLabel: "2025년 10월 실거래",
    sourceLabel: "국토교통부 실거래가 공개시스템 기준 보도",
  },
  {
    region: "bundang",
    complex: "양지마을1단지금호",
    location: "성남시 분당구 수내동 (양지마을)",
    sizeLabel: "전용 84.9㎡",
    priceEokMin: 23.75,
    priceEokMax: 23.75,
    tradeLabel: "2026년 3월 실거래",
    sourceLabel: "국토교통부 실거래가 공개시스템 기준 보도",
  },
  {
    region: "bundang",
    complex: "샛별마을(라이프)",
    location: "성남시 분당구 분당동 (샛별마을)",
    sizeLabel: "전용 85㎡",
    priceEokMin: 16.0,
    priceEokMax: 16.0,
    tradeLabel: "2025년 실거래",
    sourceLabel: "국토교통부 실거래가 공개시스템 기준",
  },
  {
    region: "dongtan",
    complex: "힐스테이트 동탄역 센트릭",
    location: "화성시 오산동 동탄2신도시",
    sizeLabel: "전용 84㎡ (분양가 기준)",
    priceEokMin: 9.65,
    priceEokMax: 10.05,
    tradeLabel: "2022년 9월 분양가 (2026년 입주 예정 — 분양가이며 실거래가 아님)",
    sourceLabel: "분양 공고 기준, 입주 시점 실거래가는 별도 확인 필요",
  },
  {
    region: "dongtan",
    complex: "동탄2신도시 메타폴리스",
    location: "화성시 동탄2신도시",
    sizeLabel: "전용 84㎡",
    priceEokMin: 9,
    priceEokMax: 9,
    tradeLabel: "2024~2025년 실거래 (2017년 분양가 4억대 → 약 2배 이상 상승)",
    sourceLabel: "보도 기준, GTX-A 개통 전후 비교 사례",
  },
];
```

> 보강 결과: 분당 측 예시를 1건(샛별마을)에서 **4건(시범단지 2건 + 양지마을 1건 + 샛별마을 1건)**으로 확충했다. 시범단지 안에서도 우성(16.1억)과 현대(19.9억)의 가격 차이가 크고, 양지마을1단지금호(23.75억)는 분당 안에서도 최상위 가격대라는 점이 드러나 — 분당 권역 내 단지별 격차가 크다는 본문 서술(섹션 3 satisfaction/risk 행)을 더 구체적으로 뒷받침한다. 동탄은 분양가(힐스테이트동탄역센트릭)와 실거래가(메타폴리스)를 `tradeLabel`에서 명확히 구분해 혼동을 막았다.

---

## 4. 페이지 IA

1. Hero — "분당 재건축 vs 동탄 신축, 15억이면 어디가 나을까?"
2. InfoNotice — 재건축 사업 단계·분담금 미확정, 가격은 특정 시점 예시 고지, 우열 비교 자료 아님 고지
3. 핵심 비교 프레임 테이블 (7개 항목)
4. 우선순위 선택 탭 (실거주/투자/학군/교통) — 선택 시 비교 프레임 관련 행 강조 + 해석 카드 갱신
5. 예산 슬라이더 (9억~20억, 기본 15억) — 분당/동탄 각각 매칭되는 실거래 예시 카드
6. 분당 재건축 진행 현황 타임라인 (시범단지/양지마을/샛별마을/목련마을)
7. 동탄 신축 입주 물량 카드
8. 리스크 비교 카드 (분당 리스크 vs 동탄 리스크 병렬)
9. 데이터 기준과 한계
10. FAQ
11. 관련 리포트/계산기 링크
12. SeoContent

---

## 5. UI 설계

### 5-1. 레이아웃

- 일반 리포트 페이지 패턴(`<main class="container page-shell report-page brd-page">`), `SimpleToolShell` 미사용.
- SCSS prefix: `brd-`
- 분당은 차분한 그레이·그린 계열, 동탄은 블루 계열로 시각 구분해 두 지역을 대칭적으로 배치 (메시-호날두 리포트에서 적용한 대칭 구도 원칙 재사용).

### 5-2. Hero

```astro
<CalculatorHero
  eyebrow="부동산 비교 리포트"
  title="분당 재건축 vs 동탄 신축, 15억이면 어디가 나을까?"
  description="분당 재건축 시범단지와 동탄 신축 아파트를 학군, 교통, 투자 포인트, 리스크 기준으로 비교합니다. 우선순위를 선택하면 내 상황에 맞는 비교 포인트를 볼 수 있습니다."
/>
```

### 5-3. InfoNotice

- `이 리포트는 분당과 동탄 중 어디가 더 낫다고 결론 내리는 자료가 아니라, 항목별 비교 자료입니다.`
- `분당 재건축 사업 단계와 분담금은 확정값이 아니며, 사업 진행에 따라 계속 바뀔 수 있습니다.`
- `가격은 국토교통부 실거래가 공개시스템 기준 특정 시점 예시이며, 권역 전체 평균이 아닙니다.`

### 5-4. 비교 프레임 테이블

| 컬럼 | 내용 |
|---|---|
| 항목 | `labelKo` |
| 분당 재건축 | `bundangValue` |
| 동탄 신축 | `dongtanValue` |
| 근거 수준 | `confidence` 배지 (공식 발표/보도 기준/추정/확정 전 — 각각 다른 색상) |

우선순위 탭 선택 시 `relatedPriority`에 해당 탭이 포함된 행에 `is-highlighted` 클래스 부여.

### 5-5. 우선순위 탭 + 해석 카드

```text
[실거주 우선] [투자 우선] [학군 우선] [교통 우선]

선택: 투자 우선
┌─────────────────────┐ ┌─────────────────────┐
│ 분당 재건축           │ │ 동탄 신축             │
│ 재건축 사업성에 기댄... │ │ GTX-A 개통 호재가...   │
└─────────────────────┘ └─────────────────────┘
해석: 분당은 사업 진행 속도와 분담금이, 동탄은 추가 호재 여부가 핵심 변수입니다.
```

### 5-6. 예산 슬라이더

- 슬라이더 9억~20억, 기본값 15억, 1억 단위
- 슬라이더 값 ±2억 범위 안에 있는 `BRD_REAL_EXAMPLES`를 분당/동탄 각각 카드로 표시
- 매칭되는 예시가 없으면 "이 예산대에서 확인된 실거래 예시가 아직 없습니다. 가까운 예시를 참고하세요" + 가장 가까운 가격대 예시 표시

### 5-7. 분당 재건축 타임라인

세로 타임라인 또는 카드 그리드로 `BRD_BUNDANG_STAGES` 표시:

```text
[시범단지] 우성·현대·장안타운건영3차
특별정비구역 지정(2026.1.19) → 예비사업자 지정(2026.5.30) → 사업시행자 선정 → 이주(목표 2029)
```

### 5-8. 리스크 비교 카드

2열 병렬 카드(분당 리스크 / 동탄 리스크), 각 카드 3개 bullet 이내로 간결하게.

---

## 6. 계산 로직

### 6-1. 우선순위 탭 전환

```text
1. 탭 클릭 → activePriority 갱신
2. BRD_COMPARISON_FRAME 순회 → relatedPriority.includes(activePriority)인 행에 강조 클래스
3. BRD_PRIORITY_TABS에서 activePriority에 해당하는 해석 카드 텍스트 렌더
4. URL 파라미터 priority= 갱신
```

### 6-2. 예산 슬라이더 매칭

```text
1. 슬라이더 값(budgetEok) 변경
2. BRD_REAL_EXAMPLES를 region별로 필터
3. 각 region에서 |priceEokMin~priceEokMax 중간값 - budgetEok| 최솟값인 예시 선택
4. 차이가 3억 이상이면 "가장 가까운 예시" 라벨과 함께 표시, 3억 미만이면 일반 표시
5. URL 파라미터 budget= 갱신
```

### 6-3. 보정 규칙

- 슬라이더 값은 9~20 범위로 clamp
- `BRD_REAL_EXAMPLES`는 분당 4건(시범우성·시범현대·양지마을1단지금호·샛별마을라이프), 동탄 2건(힐스테이트동탄역센트릭 분양가·메타폴리스 실거래)이 확보되어 있어 슬라이더 전 구간(9~20억)에서 분당 쪽은 비교적 촘촘하게 매칭 가능. 동탄은 9억대 중심으로 매칭 범위가 좁으므로, 슬라이더가 13억 이상일 때는 "동탄은 해당 예산대 실거래 예시가 아직 부족합니다" 안내와 가장 가까운 예시를 함께 표시

---

## 7. 클라이언트 스크립트 설계

파일: `public/scripts/bundang-redevelopment-vs-dongtan-newbuild-2026.js`

### 7-1. 주요 함수

```js
function setPriority(priorityId) {}
function renderPriorityCards(priorityId) {}
function highlightFrameRows(priorityId) {}
function findClosestExample(region, budgetEok) {}
function renderBudgetExamples(budgetEok) {}
function readBudgetFromSlider() {}
function syncUrlState(state) {}
function restoreFromUrl() {}
function init() {}
```

### 7-2. 상태값 / URL 파라미터

| 파라미터 | 의미 | 기본값 |
|---|---|---|
| `priority` | live/invest/school/transit | live |
| `budget` | 9~20 (억) | 15 |

---

## 8. SEO 설계

### 8-1. Title / Description

```text
title: 분당 재건축 vs 동탄 신축 비교 2026 - 15억이면 어디가 나을까
description: 분당 재건축 시범단지와 동탄 신축 아파트를 학군, 교통, 투자 포인트, 리스크 기준으로 비교합니다. 내 상황에 맞는 선택 기준을 확인하세요.
```

### 8-2. H1 / H2

- H1: `분당 재건축 vs 동탄 신축, 15억이면 어디가 나을까?`
- H2 후보: `분당 재건축은 지금 어디까지 왔나`, `동탄 신축은 얼마나 올랐고 얼마나 남았나`, `15억이면 분당·동탄 어디서 어떤 집을 살 수 있을까`, `우선순위에 따라 답이 달라집니다`, `자주 묻는 질문`

---

## 9. FAQ 설계 (기획 문서 섹션 8 기반)

```ts
export const BRD_FAQ: ComparisonFaq[] = [
  {
    question: "분당 재건축은 지금 사도 안전한가요?",
    answer:
      "선도지구·특별정비구역 지정은 사업이 본격적으로 시작됐다는 의미지만, 사업시행자 선정, 이주, 착공까지는 다단계 절차가 남아있습니다. '안전하다'고 단정하기보다, 진행 단계와 분담금 미확정 리스크를 함께 보고 판단해야 합니다.",
  },
  {
    question: "동탄은 너무 늦게 들어가는 거 아닌가요?",
    answer:
      "GTX-A 개통 전 매수자 대비 가격 차이는 분명히 존재합니다. 다만 2026년에도 신규 입주 물량이 남아있어, 어떤 단지·시점에 들어가는지에 따라 상황이 다릅니다.",
  },
  {
    question: "분당과 동탄 중 학군은 어디가 좋나요?",
    answer:
      "정량적으로 비교하기 어려운 영역입니다. 분당은 전통적으로 학군이 잘 형성된 권역으로 평가받고, 동탄은 신도시 특성상 학군이 만들어지는 중이며 블록별 차이가 있습니다.",
  },
  {
    question: "신분당선과 GTX-A 중 어느 교통이 더 나은가요?",
    answer:
      "신분당선은 환승 없이 강남역까지 도달할 수 있는 안정적인 노선입니다. GTX-A는 더 빠르지만 배차간격과 요금 구조가 일반 지하철과 다르다는 점을 함께 고려해야 합니다.",
  },
  {
    question: "15억으로 분당, 동탄 각각 어떤 단지를 살 수 있나요?",
    answer:
      "본문의 예산 슬라이더에서 확인할 수 있습니다. 다만 제시되는 단지는 국토교통부 실거래가 공개시스템 기준 일부 예시이며, 권역 내 모든 단지를 대표하지는 않습니다.",
  },
  {
    question: "재건축 분담금은 얼마나 나올까요?",
    answer:
      "사업시행 인가 전까지는 분담금이 확정되지 않습니다. 유사한 1기 신도시 재건축 사례를 참고할 수는 있지만, 정확한 금액은 해당 단지 조합·사업시행자의 공식 발표를 통해 확인해야 합니다.",
  },
  {
    question: "투자 목적이면 어디가 나을까요?",
    answer:
      "분당은 토지 가치와 재건축 사업성에 기반한 투자이고, 동탄은 직주근접 신축 희소성과 교통 호재에 기반한 투자입니다. 두 방식의 성격이 달라 우열을 단정하기 어렵습니다.",
  },
];
```

---

## 10. 관련 링크 / CTA

```ts
export const BRD_RELATED_LINKS = [
  { href: "/tools/home-purchase-fund/", label: "내집마련 자금 계산기" },
  { href: "/tools/income-home-affordability/", label: "소득 대비 집값 부담 계산기" },
  { href: "/reports/seoul-housing-affordability-map-2026/", label: "내 연봉으로 서울 어디 살 수 있나" },
  { href: "/reports/seoul-mortgage-refinancing-2026/", label: "대환대출 갈아타기 손익 비교" },
];
```

---

## 11. 스타일 설계

SCSS 파일: `src/styles/scss/pages/_bundang-redevelopment-vs-dongtan-newbuild-2026.scss`

```scss
.brd-page {
  --brd-bundang: #0f766e;   // 그린 계열
  --brd-dongtan: #1d4ed8;   // 블루 계열
}
.brd-frame-table {}
.brd-frame-table tr.is-highlighted {}
.brd-confidence-badge {}
.brd-priority-tabs {}
.brd-priority-card--bundang {}
.brd-priority-card--dongtan {}
.brd-budget-slider {}
.brd-example-card {}
.brd-stage-timeline {}
.brd-stage-item {}
.brd-supply-card {}
.brd-risk-grid {}
```

반응형: 비교 프레임 테이블은 `overflow-x: auto`, 모바일에서 우선순위 탭은 가로 스크롤, 예시 카드와 리스크 카드는 1열로 전환.

---

## 12. 구현 체크리스트

- [x] 분당 시범단지(우성·현대)·양지마을 실거래가 확보 완료 (16.1억/19.9억/23.75억, 2025~2026년 거래)
- [x] 동탄 2026년 입주 단지 확인 완료 (금강펜테리움6차 1,103세대·7차 662세대 = 1,765세대 일치)
- [ ] `src/data/bundangRedevelopmentVsDongtan2026.ts` 생성
- [ ] 힐스테이트동탄역센트릭 정확한 세대수·최종 입주월은 구현 직전 분양 공고 원문으로 재확인
- [ ] **분당 재건축 진행 단계 최신 보도로 재검증** (사업시행자 선정 등은 빠르게 갱신될 수 있음)
- [ ] `src/pages/reports/bundang-redevelopment-vs-dongtan-newbuild-2026.astro` 생성
- [ ] `public/scripts/bundang-redevelopment-vs-dongtan-newbuild-2026.js` 생성
- [ ] `src/styles/scss/pages/_bundang-redevelopment-vs-dongtan-newbuild-2026.scss` 생성
- [ ] `src/data/reports.ts`, `src/styles/app.scss`, `public/sitemap.xml` 등록
- [ ] `src/pages/index.astro` reportMetaBySlug에 `estate` 카테고리 등록
- [ ] 내집마련 자금 계산기 등 관련 페이지에 상호 CTA 추가
- [ ] `npm run build` 성공
- [ ] 모바일/데스크톱 시각 확인, 우선순위 탭·예산 슬라이더 동작 확인

---

## 13. QA 포인트

- [ ] 우열을 단정하는 표현이 본문/타이틀/FAQ 어디에도 없는가?
- [ ] 분당·동탄 카드 분량과 배치가 대칭적인가?
- [ ] 재건축 사업 단계에 "확정", "완료" 같은 과장 표현이 없는가?
- [ ] 분양가와 실거래가가 명확히 구분되어 표시되는가? (힐스테이트동탄역센트릭은 분양가, 메타폴리스는 실거래가)
- [ ] 예산 슬라이더가 9~20억 범위에서 정상 동작하는가?
- [ ] 우선순위 탭 전환 시 비교 프레임 강조 행이 올바르게 바뀌는가?
- [ ] FAQ가 6개 이상이고 관련 링크가 4개 이상인가?

---

## 14. 후속 확장

- `/reports/suwon-yeongtong-vs-dongtan-2026/` — 수지·영통까지 확장한 후속편
- `/reports/1st-new-town-redevelopment-guide-2026/` — 평촌·산본·중동·일산 포함 1기 신도시 전체 가이드
- 분당 재건축 사업 단계는 분기별로 갱신 필요 — 운영 캘린더에 정기 체크 항목으로 등록 권장
