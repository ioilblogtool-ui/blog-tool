# SK하이닉스 셔틀권 부동산 리포트 — 설계 문서

> 기획 원문: `docs/plan/202605/sk-hynix-shuttle-real-estate-2026.md`
> 작성일: 2026-05-25
> 구현 기준: 이 문서만 보고 `/reports/` 리포트 페이지 구현에 착수할 수 있는 수준

---

## 1. 문서 개요

- 구현 대상: SK하이닉스 셔틀버스 노선별 아파트 시세 정리 2026
- 슬러그: `sk-hynix-shuttle-real-estate-2026`
- URL: `/reports/sk-hynix-shuttle-real-estate-2026/`
- 콘텐츠 유형: 데이터형 리포트 (정적)
- 핵심 CTA: `/tools/sk-hynix-bonus/`, `/tools/home-purchase-fund/`
- 주요 검색 의도: "하이닉스 셔틀버스 아파트", "SK하이닉스 이천 발령 어디 살아요", "하이닉스 이천 셔틀 판교 분당"

---

## 2. 파일 구조

```
src/
  data/
    skHynixShuttleRealEstate2026.ts
  pages/
    reports/
      sk-hynix-shuttle-real-estate-2026.astro

public/
  og/
    reports/
      sk-hynix-shuttle-real-estate-2026.png

src/styles/scss/pages/
  _sk-hynix-shuttle-real-estate-2026.scss
```

추가 등록:
- `src/data/reports.ts`
- `src/styles/app.scss`
- `public/sitemap.xml`

---

## 3. 데이터 설계

### 3-1. 타입 정의

```ts
// src/data/skHynixShuttleRealEstate2026.ts

export type DataBadge = "확인됨" | "추정" | "참고";

export interface HynixShuttleZone {
  id: string;
  name: string;
  areas: string[];
  targetCampus: string[];
  commuteMin: number | null;
  commuteNote: string;
  badge: DataBadge;
}

export interface ApartmentArea {
  zoneId: string;
  district: string;
  priceJeonseManwon: number | null;
  priceMeomaeManwon: number | null;
  pricePerPyeong: number | null;
  note: string;
  sourceDate: string;
  badge: DataBadge;
}

export interface HynixShuttleFaq {
  question: string;
  answer: string;
}
```

### 3-2. 셔틀 권역 데이터

```ts
export const SK_HYNIX_SHUTTLE_ZONES: HynixShuttleZone[] = [
  {
    id: "gangnam",
    name: "강남·양재권",
    // 공개 확인 정보: 역삼역 2번출구, 강남역 1번출구, 우성아파트 앞 사거리
    areas: ["강남역 1번출구", "역삼역 2번출구", "양재역", "서초 우성아파트 앞"],
    targetCampus: ["이천 본사"],
    commuteMin: 80,
    commuteNote: "이천 본사 기준 약 80~100분 추정. 경부선 버스전용차선 경유.",
    badge: "확인됨", // 블라인드 및 커뮤니티 다수 확인
  },
  {
    id: "pangyo_bundang",
    name: "판교·분당권",
    // 판교 현백(현대백화점) 기준 약 40분 확인됨
    areas: ["판교역", "현대백화점 판교점", "정자역", "미금역", "수내역"],
    targetCampus: ["이천 본사", "판교 사무소"],
    commuteMin: 40,
    commuteNote: "판교 현백 기준 약 40분, 정자역 약 50분. 판교 사무소는 현지 출퇴근.",
    badge: "확인됨",
  },
  {
    id: "gwangju_gonjiam",
    name: "광주·곤지암권",
    areas: ["경기 광주시", "곤지암읍"],
    targetCampus: ["이천 본사"],
    commuteMin: 25,
    commuteNote: "이천 본사 기준 약 20~30분. 수도권 최근거리 외곽 거점.",
    badge: "추정",
  },
  {
    id: "icheon_local",
    name: "이천 현지",
    areas: ["이천시 부발읍", "이천시내", "증포동"],
    targetCampus: ["이천 본사 (M10·M14·M16·M17)"],
    commuteMin: 10,
    commuteNote: "본사 직근 5~15분. 생활 인프라와 자녀 교육 여건은 별도 확인 필요.",
    badge: "확인됨",
  },
  {
    id: "cheongju",
    name: "청주 M15권",
    areas: ["청주시 흥덕구", "오창읍", "청주시내"],
    targetCampus: ["청주 M15"],
    commuteMin: 15,
    commuteNote: "청주 M15 기준 10~20분. 수도권 발령자는 청주 왕복 통근이 현실적으로 어려움.",
    badge: "추정",
  },
];
```

### 3-3. 아파트 시세 데이터

> **데이터 수집 방법**: `rt.molit.go.kr` 실거래가 시스템 또는 `data.go.kr` API.
> 법정동코드 + 계약년월(202601~202603)로 조회.
> 30평(전용 84m²) 기준 실거래 평균 사용.

```ts
export const APARTMENT_AREAS: ApartmentArea[] = [
  // 강남·양재권
  {
    zoneId: "gangnam",
    district: "서초구 반포·방배동, 강남구 역삼동",
    priceJeonseManwon: 75000,
    priceMeomaeManwon: 230000,
    pricePerPyeong: 7200,
    note: "이천 셔틀 강남권. 탑승 시간 80~100분으로 가장 길다.",
    sourceDate: "2026년 1분기",
    badge: "추정",
  },
  // 판교
  {
    zoneId: "pangyo_bundang",
    district: "성남시 분당구 판교동·백현동",
    priceJeonseManwon: 62000,
    priceMeomaeManwon: 155000,
    pricePerPyeong: 4800,
    note: "이천 셔틀 약 40분. 판교 사무소 발령 시 현지 통근 가능.",
    sourceDate: "2026년 1분기",
    badge: "추정",
  },
  // 분당 구축
  {
    zoneId: "pangyo_bundang",
    district: "성남시 분당구 정자·수내·이매동",
    priceJeonseManwon: 45000,
    priceMeomaeManwon: 100000,
    pricePerPyeong: 3100,
    note: "판교보다 저렴한 분당 구축. 이천·판교 모두 접근 가능한 중간 거점.",
    sourceDate: "2026년 1분기",
    badge: "추정",
  },
  // 광주·곤지암
  {
    zoneId: "gwangju_gonjiam",
    district: "경기 광주시 곤지암읍·초월읍",
    priceJeonseManwon: 20000,
    priceMeomaeManwon: 35000,
    pricePerPyeong: 1100,
    note: "이천 30분 권역. 신혼·초기 거주 선택지. 생활 인프라 수원·판교 대비 부족.",
    sourceDate: "2026년 1분기",
    badge: "추정",
  },
  // 이천 현지
  {
    zoneId: "icheon_local",
    district: "경기 이천시 부발읍·증포동",
    priceJeonseManwon: 15000,
    priceMeomaeManwon: 28000,
    pricePerPyeong: 880,
    note: "본사 직근 최저가. 생활·교육 인프라 수도권 대비 제한적.",
    sourceDate: "2026년 1분기",
    badge: "추정",
  },
  // 청주 M15
  {
    zoneId: "cheongju",
    district: "충북 청주시 흥덕구 오창읍",
    priceJeonseManwon: 18000,
    priceMeomaeManwon: 32000,
    pricePerPyeong: 1000,
    note: "청주 M15 발령 기준. 오창지구 신축 단지 증가 중.",
    sourceDate: "2026년 1분기",
    badge: "추정",
  },
];
```

### 3-4. META / FAQ / related

```ts
export const SK_HYNIX_SHUTTLE_META = {
  title: "SK하이닉스 셔틀버스 노선별 아파트 시세 정리 2026",
  description: "이천 본사·청주·판교 캠퍼스별 주요 셔틀 권역 아파트 전세·매매 시세를 정리했습니다.",
  updatedAt: "2026년 1분기",
  caution: "셔틀 정류장 지역은 재직자 커뮤니티 기반 추정이며, 노선은 HAPPYROAD 앱 또는 사내 포털에서 확인 필요합니다. 아파트 시세는 국토부 실거래가 참고값입니다.",
};

export const SK_HYNIX_SHUTTLE_FAQ: HynixShuttleFaq[] = [
  {
    question: "이천 발령 나면 꼭 이천에 살아야 하나요?",
    answer: "이천에 살 필요는 없습니다. 강남역·판교역에서 셔틀버스가 운행되어 판교·분당 거주가 현실적인 선택지입니다. 다만 강남권은 편도 80~100분으로 피로도가 높고, 판교·분당은 40~50분으로 상대적으로 부담이 적습니다. 이천 현지 거주는 출퇴근 시간을 최소화하지만 생활 인프라와 자녀 교육 여건을 별도로 확인해야 합니다.",
  },
  {
    question: "SK하이닉스 셔틀버스 노선은 어디서 확인하나요?",
    answer: "SK하이닉스 셔틀버스 노선은 HAPPYROAD 앱(skhappyexpress.com)에서 재직자가 확인할 수 있습니다. 주요 강남권 정류장으로는 강남역 1번출구, 역삼역 2번출구, 우성아파트 앞 사거리 등이 공개 커뮤니티에서 언급됩니다. 정확한 현행 노선은 사내 포털에서 확인하는 것이 정확합니다.",
  },
  {
    question: "판교 발령과 이천 발령의 주거 선택이 어떻게 다른가요?",
    answer: "판교 사무소 발령은 판교·분당 현지 거주가 가능하며 이천 셔틀을 탈 필요가 없습니다. 이천 본사 발령은 셔틀 이용 시 판교·분당이 현실적인 중간 거점이 됩니다. 두 캠퍼스 간 이동이 잦다면 판교와 이천 모두 접근 가능한 분당 권역이 유리합니다.",
  },
  {
    question: "강남에서 이천까지 셔틀로 얼마나 걸리나요?",
    answer: "경부선 버스전용차선을 이용하는 판교·양재 노선 기준으로 판교 현백에서 약 40분, 양재역에서 약 50~55분이 소요됩니다. 강남역에서는 약 80~100분 수준으로 추정됩니다. 교통 상황에 따라 30분 이상 차이가 날 수 있습니다.",
  },
  {
    question: "SK하이닉스 PS 성과급으로 이천 아파트를 살 수 있나요?",
    answer: "SK하이닉스 PS 성과급은 업황에 따라 연봉의 50~300% 이상까지 범위가 넓습니다. 이천 시내 30평 기준 매매가 약 2억 8천만원, LTV 70% 적용 시 최대 대출 약 2억원 수준입니다. SK하이닉스 성과급 계산기에서 세후 예상 금액을 먼저 확인하고 내집마련 자금 계산기로 총 필요 현금을 계산해보세요.",
  },
  {
    question: "용인 반도체 클러스터 착공 이후 어느 지역이 주목받나요?",
    answer: "SK하이닉스 용인 반도체 클러스터(처인구)는 2030년대 가동이 예상됩니다. 현재 단계에서 용인 처인구 인근 거주지를 투자 목적으로 선택하기에는 시기가 이릅니다. 가동 시점 확정 이후 셔틀 권역을 파악하고 결정하는 것이 안전합니다.",
  },
];

export const SK_HYNIX_SHUTTLE_RELATED = [
  { href: "/tools/sk-hynix-bonus/", label: "SK하이닉스 성과급 계산기" },
  { href: "/tools/home-purchase-fund/", label: "내집마련 자금 계산기" },
  { href: "/reports/samsung-shuttle-real-estate-2026/", label: "삼성전자 셔틀권 부동산 정리" },
  { href: "/tools/salary/", label: "연봉 실수령액 계산기" },
];
```

---

## 4. 페이지 IA

```
1. CalculatorHero
2. InfoNotice (셔틀 추정 + 시세 참고 + 이천 특성 안내)
3. 핵심 메시지 카드 3개 (이천 셔틀 의존도 / 권역별 소요 시간 / 시세 범위)
4. 권역별 셔틀 + 시세 비교표
5. 권역별 카드 상세 (5개 권역)
6. 이천 현지 vs 판교 셔틀 장단점 비교표
7. PS 성과급 → 부동산 연결 CTA 블록
8. 용인 클러스터 안내 섹션 (투자 권유 없이 정보만)
9. 관련 계산기 CTA 카드
10. SeoContent (intro 4단락 + FAQ 6개 + related 4개)
```

---

## 5. 화면 구성 상세

### 5-1. Hero

```
eyebrow: SK하이닉스 직주근접 리포트
H1: SK하이닉스 셔틀버스 노선별 아파트 시세 정리 2026
description: 이천 본사·청주·판교 캠퍼스별 주요 셔틀 권역 아파트 전세·매매 시세를 정리했습니다.
             이천 발령 후 어디 살지, PS 성과급으로 어느 아파트까지 가능한지 확인하세요.
```

### 5-2. InfoNotice

```
title: 데이터 기준 안내
lines:
  - 셔틀 정류장 지역은 재직자 커뮤니티 기반 추정이며, 정확한 노선은 HAPPYROAD 앱 또는 사내 포털에서 확인하세요.
  - 아파트 시세는 국토부 실거래가 2026년 1분기 기준 30평(전용 84m²) 참고값입니다.
  - 소요 시간은 카카오맵 기준 평상시 추정이며 교통 상황에 따라 ±20~30분 차이가 납니다.
```

### 5-3. 권역별 비교표

| 권역 | 주요 정류장 지역 | 소요(분) | 전세 30평 | 매매 30평 | 특징 |
|------|--------------|---------|---------|---------|------|
| 강남·양재 | 강남역·역삼역·우성아파트 | 80~100 | ~7.5억 | ~23억 | 피로도 높음 |
| 판교 | 판교역·현대백화점 판교 | 40 | ~6.2억 | ~15.5억 | 최적 중간 거점 |
| 분당 구축 | 정자역·수내역 | 50 | ~4.5억 | ~10억 | 판교보다 저렴 |
| 광주·곤지암 | 곤지암읍·초월읍 | 25 | ~2억 | ~3.5억 | 이천 최근거리 외곽 |
| 이천 현지 | 부발읍·이천시내 | 10 | ~1.5억 | ~2.8억 | 최단 거리·인프라 제한 |
| 청주 M15 | 오창읍·흥덕구 | 15 | ~1.8억 | ~3.2억 | M15 전용 |

> 모바일: `.table-wrap` 가로 스크롤 처리

### 5-4. 이천 vs 판교 비교표

| 항목 | 이천 현지 거주 | 판교·분당 + 셔틀 |
|------|-------------|---------------|
| 출퇴근 시간 | 10~15분 | 40~60분 |
| 30평 전세 | ~1.5억 | ~4.5~6.2억 |
| 생활 인프라 | 제한적 | 풍부 |
| 자녀 교육 | 수도권 대비 부족 | 유리 |
| 서울 접근성 | 불편 | 편리 |

### 5-5. 성과급 → 부동산 CTA 블록

```html
<div class="skhre-cta-box">
  <p>SK하이닉스 PS로 이천·판교 아파트 살 수 있는지 계산해보세요</p>
  <a href="/tools/sk-hynix-bonus/">SK하이닉스 성과급 계산기 →</a>
  <a href="/tools/home-purchase-fund/">내집마련 자금 계산기 →</a>
</div>
```

---

## 6. SeoContent props

```astro
<SeoContent
  introTitle="SK하이닉스 셔틀권 부동산 리포트를 보는 방법"
  intro={[
    // 단락1 — 맥락
    "SK하이닉스 이천 본사 발령을 받으면 가장 먼저 떠오르는 질문이 '어디 살아야 하나'입니다. 이천은 서울에서 대중교통으로 1시간 30분~2시간이 걸리는 거리라 회사 셔틀버스가 사실상 유일한 현실적 통근 수단입니다. 강남역에서 이천까지 셔틀로 80~100분, 판교에서 40분 수준입니다.",
    // 단락2 — 메커니즘
    "SK하이닉스 셔틀버스는 강남역 1번출구, 역삼역 2번출구, 우성아파트 앞 사거리 등의 정류장이 재직자 커뮤니티에서 확인됩니다. 판교·양재 노선은 경부선 버스전용차선으로 운행해 판교 현백 기준 약 40분, 양재역 기준 50~55분이 소요됩니다. 정확한 노선은 HAPPYROAD 앱에서 재직자가 직접 확인할 수 있습니다.",
    // 단락3 — 해석 가이드
    "셔틀 소요 시간과 아파트 시세를 같이 보면 직주근접 비용 트레이드오프가 보입니다. 이천 현지 30평 전세는 1억 5천만원 수준이지만 생활 인프라가 제한적이고, 판교는 6억 2천만원이지만 셔틀로 40분에 양질의 생활권을 누릴 수 있습니다. 광주·곤지암은 약 2억 전세에 25분 거리로 초기 거주지로 선택하는 경우가 많습니다.",
    // 단락4 — 한계
    "셔틀 노선은 회사 비공개 정보이며 이 리포트의 정류장 지역은 재직자 커뮤니티 기반 추정값입니다. 거주지를 최종 결정하기 전 반드시 HAPPYROAD 앱 또는 사내 포털에서 현행 노선을 확인하세요. 아파트 시세는 국토부 실거래가 2026년 1분기 참고값으로 시장 상황에 따라 변동됩니다. SK하이닉스 PS 성과급은 업황에 따라 매년 크게 달라지므로 성과급만 보고 주거 계획을 세우지 않도록 주의가 필요합니다.",
  ]}
  inputPoints={[
    "권역별 셔틀 소요 시간과 30평 기준 전세·매매 시세를 한 표에서 비교합니다.",
    "이천 현지 거주 vs 판교·분당 셔틀 통근의 장단점을 비용·시간·인프라 기준으로 비교합니다.",
    "PS 성과급 계산기와 연결해 세후 목돈으로 가능한 아파트 범위를 확인합니다.",
  ]}
  criteria={[
    "셔틀 권역은 재직자 커뮤니티 및 공개 확인 정류장 기반 추정값입니다.",
    "아파트 시세는 국토부 실거래가 2026년 1분기 기준 30평(전용 84m²) 참고값입니다.",
    "소요 시간은 카카오맵 기준 평상시 추정이며 실제와 다를 수 있습니다.",
  ]}
  faq={SK_HYNIX_SHUTTLE_FAQ}
  related={SK_HYNIX_SHUTTLE_RELATED}
/>
```

---

## 7. 스타일 설계

- SCSS 파일: `_sk-hynix-shuttle-real-estate-2026.scss`
- 클래스 prefix: `skhre-` (sk-hynix-real-estate)
- 톤: 부동산·직장 정보형, 중립 컬러. 삼성 리포트와 시각적 일관성 유지

주요 블록:
```scss
.skhre-campus-cards     // 캠퍼스 카드
.skhre-zone-table       // 권역 비교표
.skhre-zone-cards       // 권역 카드
.skhre-compare-table    // 이천 vs 판교 비교표
.skhre-cluster-notice   // 용인 클러스터 안내
.skhre-cta-box          // 성과급 → 부동산 CTA
```

---

## 8. SEO 설계

```
title: SK하이닉스 셔틀버스 아파트 시세 정리 2026 | 이천·판교·분당 직주근접 비교
description: SK하이닉스 이천 본사·청주·판교 캠퍼스별 주요 셔틀 권역 아파트 전세·매매 시세를 정리했습니다.
canonical: https://bigyocalc.com/reports/sk-hynix-shuttle-real-estate-2026/
```

H 구조:
- H1: SK하이닉스 셔틀버스 노선별 아파트 시세 정리 2026
- H2: 캠퍼스 구조와 셔틀 권역 개요
- H2: 권역별 아파트 시세 비교
- H2: 이천 현지 거주 vs 판교 셔틀 비교
- H2: 성과급으로 계산하는 아파트 예산
- H2: 자주 묻는 질문

---

## 9. reports.ts 등록

```ts
{
  slug: "sk-hynix-shuttle-real-estate-2026",
  title: "SK하이닉스 셔틀버스 노선별 아파트 시세 정리 2026",
  description: "이천 발령 후 어디 살지, 캠퍼스별 셔틀 권역 아파트 전세·매매 시세를 비교합니다.",
  category: "real-estate",
  tags: ["SK하이닉스", "셔틀버스", "부동산", "이천", "아파트"],
}
```

---

## 10. sitemap.xml 추가

```xml
<url>
  <loc>https://bigyocalc.com/reports/sk-hynix-shuttle-real-estate-2026/</loc>
  <changefreq>quarterly</changefreq>
  <priority>0.7</priority>
</url>
```

---

## 11. 구현 순서

1. `skHynixShuttleRealEstate2026.ts` 생성 — 타입, 데이터, meta, FAQ, related
2. `sk-hynix-shuttle-real-estate-2026.astro` — Hero, InfoNotice, 요약 카드, 비교표, 이천 vs 판교 표, CTA, SeoContent
3. `_sk-hynix-shuttle-real-estate-2026.scss` 작성 + `app.scss` import
4. `reports.ts` 등록
5. `sitemap.xml` 추가
6. 삼성전자 리포트에서 SK하이닉스 리포트로 내부 링크 확인
7. `npm run build` 확인

---

## 12. 삼성 리포트와의 상호 링크

삼성전자 리포트 `SAMSUNG_SHUTTLE_RELATED`에:
```ts
{ href: "/reports/sk-hynix-shuttle-real-estate-2026/", label: "SK하이닉스 셔틀권 부동산 정리" }
```

SK하이닉스 리포트 `SK_HYNIX_SHUTTLE_RELATED`에:
```ts
{ href: "/reports/samsung-shuttle-real-estate-2026/", label: "삼성전자 셔틀권 부동산 정리" }
```
→ 양방향 내부 링크 필수

---

## 13. QA 체크리스트

- [ ] 셔틀 정류장 지역을 확정 정보로 표현하지 않는다 (추정 배지)
- [ ] 강남역·역삼역·우성아파트 정류장은 "확인됨" 배지 사용 가능
- [ ] 아파트 시세에 기준 시점과 참고 배지가 표시된다
- [ ] 이천 vs 판교 비교표가 균형 있게 서술되어 있다 (이천 비하 없음)
- [ ] 용인 클러스터 섹션에 투자 권유 문구가 없다
- [ ] 성과급 계산기·내집마련 계산기로 내부 링크 연결됨
- [ ] 삼성전자 리포트와 상호 내부 링크 연결됨
- [ ] SeoContent intro 4단락 + FAQ 6개 + related 4개 충족
- [ ] `npm run build` 성공
