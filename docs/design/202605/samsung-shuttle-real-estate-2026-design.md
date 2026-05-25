# 삼성전자 셔틀권 부동산 리포트 — 설계 문서

> 기획 원문: `docs/plan/202605/samsung-shuttle-real-estate-2026.md`
> 작성일: 2026-05-25
> 구현 기준: 이 문서만 보고 `/reports/` 리포트 페이지 구현에 착수할 수 있는 수준

---

## 1. 문서 개요

- 구현 대상: 삼성전자 셔틀버스 노선별 아파트 시세 정리 2026
- 슬러그: `samsung-shuttle-real-estate-2026`
- URL: `/reports/samsung-shuttle-real-estate-2026/`
- 콘텐츠 유형: 데이터형 리포트 (정적)
- 핵심 CTA: `/tools/samsung-bonus/`, `/tools/home-purchase-fund/`
- 주요 검색 의도: "삼성전자 셔틀버스 아파트", "삼성 통근 아파트", "삼성전자 기흥 평택 이사 어디"

---

## 2. 파일 구조

```
src/
  data/
    samsungShuttleRealEstate2026.ts
  pages/
    reports/
      samsung-shuttle-real-estate-2026.astro

public/
  og/
    reports/
      samsung-shuttle-real-estate-2026.png

src/styles/scss/pages/
  _samsung-shuttle-real-estate-2026.scss
```

추가 등록:
- `src/data/reports.ts`
- `src/styles/app.scss`
- `public/sitemap.xml`

---

## 3. 데이터 설계

### 3-1. 타입 정의

```ts
// src/data/samsungShuttleRealEstate2026.ts

export type DataBadge = "확인됨" | "추정" | "참고";

export interface ShuttleZone {
  id: string;
  name: string;           // "강남·서초권"
  areas: string[];        // ["강남역", "역삼역", "양재역", "서초"]
  targetCampus: string[]; // ["SDC 수원", "기흥", "화성", "평택"]
  commuteMin: number | null;      // 편도 소요 시간 (분), 추정
  commuteNote: string;    // "교통 상황에 따라 ±20~30분 차이"
  badge: DataBadge;
}

export interface ApartmentArea {
  zoneId: string;
  district: string;       // "강남구 역삼동"
  priceJeonseManwon: number | null;   // 30평 기준 전세 (만원)
  priceMeomaeManwon: number | null;   // 30평 기준 매매 (만원)
  pricePerPyeong: number | null;      // 3.3m² 당 매매 (만원)
  note: string;
  sourceDate: string;     // "2026년 1분기"
  badge: DataBadge;
}

export interface ShuttleFaq {
  question: string;
  answer: string;
}
```

### 3-2. 셔틀 권역 데이터 (조사 결과 기반)

```ts
export const SAMSUNG_SHUTTLE_ZONES: ShuttleZone[] = [
  {
    id: "gangnam",
    name: "강남·서초권",
    areas: ["강남역", "역삼역", "양재역", "서초역", "교대역"],
    targetCampus: ["SDC 수원", "기흥", "화성", "평택"],
    commuteMin: 60,
    commuteNote: "기흥 기준 약 60분, 평택 기준 90~120분. 교통 상황에 따라 변동.",
    badge: "추정",
  },
  {
    id: "pangyo",
    name: "판교·분당권",
    areas: ["판교역", "정자역", "미금역", "분당 시내"],
    targetCampus: ["SDC 수원", "기흥"],
    commuteMin: 40,
    commuteNote: "SDC 기준 약 30~50분 추정.",
    badge: "추정",
  },
  {
    id: "gwangyo",
    name: "광교·수지권",
    areas: ["광교역", "수지구청역", "죽전역", "상현역"],
    targetCampus: ["SDC 수원", "기흥"],
    commuteMin: 25,
    commuteNote: "SDC·기흥 최단 접근 권역. 약 20~35분 추정.",
    badge: "추정",
  },
  {
    id: "dongtan",
    name: "동탄권",
    areas: ["동탄역", "동탄 신도시 내"],
    targetCampus: ["화성", "평택"],
    commuteMin: 20,
    commuteNote: "화성캠퍼스 기준 약 20~30분. GTX-A 동탄역 이용 가능.",
    badge: "추정",
  },
  {
    id: "suwon",
    name: "수원 시내권",
    areas: ["수원역", "영통", "망포역", "매탄"],
    targetCampus: ["SDC 수원", "기흥"],
    commuteMin: 15,
    commuteNote: "SDC 직근 거리. 약 10~20분 추정.",
    badge: "추정",
  },
  {
    id: "pyeongtaek",
    name: "평택·동탄 남부권",
    areas: ["평택시 내", "고덕신도시", "브레인시티"],
    targetCampus: ["평택 P1·P2·P3"],
    commuteMin: 15,
    commuteNote: "평택캠퍼스 직근 거리. 약 10~20분.",
    badge: "추정",
  },
];
```

### 3-3. 아파트 시세 데이터 (국토부 실거래가 기반 수동 입력)

> **데이터 수집 방법**: `rt.molit.go.kr` 또는 `data.go.kr` API에서 법정동코드 + 계약년월로 조회.
> 또는 호갱노노·네이버부동산에서 2026년 1분기 실거래 평균 참고.
> 30평(전용 84m²) 기준 단가로 정규화.

```ts
export const APARTMENT_AREAS: ApartmentArea[] = [
  // 강남권
  {
    zoneId: "gangnam",
    district: "강남구 역삼·대치동",
    priceJeonseManwon: 80000,   // 8억 (추정)
    priceMeomaeManwon: 250000,  // 25억 (추정)
    pricePerPyeong: 8000,
    note: "삼성전자 강남 셔틀 주요 탑승 지역",
    sourceDate: "2026년 1분기",
    badge: "추정",
  },
  // 판교권
  {
    zoneId: "pangyo",
    district: "성남시 분당구 판교동",
    priceJeonseManwon: 65000,
    priceMeomaeManwon: 160000,
    pricePerPyeong: 5000,
    note: "판교 신도시. SDC·기흥 셔틀 모두 접근",
    sourceDate: "2026년 1분기",
    badge: "추정",
  },
  // 광교권
  {
    zoneId: "gwangyo",
    district: "수원시 영통구 이의동 (광교신도시)",
    priceJeonseManwon: 45000,
    priceMeomaeManwon: 100000,
    pricePerPyeong: 3100,
    note: "SDC·기흥 직근 권역. 광교역 트램 추가 개통 예정",
    sourceDate: "2026년 1분기",
    badge: "추정",
  },
  // 동탄권
  {
    zoneId: "dongtan",
    district: "화성시 동탄2신도시",
    priceJeonseManwon: 38000,
    priceMeomaeManwon: 80000,
    pricePerPyeong: 2500,
    note: "화성·평택 캠퍼스 접근. GTX-A 동탄역",
    sourceDate: "2026년 1분기",
    badge: "추정",
  },
  // 수원 시내
  {
    zoneId: "suwon",
    district: "수원시 영통·매탄동",
    priceJeonseManwon: 28000,
    priceMeomaeManwon: 60000,
    pricePerPyeong: 1900,
    note: "SDC 도보·셔틀 최근거리. 구축 위주",
    sourceDate: "2026년 1분기",
    badge: "추정",
  },
  // 평택
  {
    zoneId: "pyeongtaek",
    district: "평택시 고덕동 (고덕신도시)",
    priceJeonseManwon: 22000,
    priceMeomaeManwon: 45000,
    pricePerPyeong: 1400,
    note: "평택캠퍼스 P1·P2·P3 직근. 신도시 형성 중",
    sourceDate: "2026년 1분기",
    badge: "추정",
  },
];
```

### 3-4. META / FAQ / related

```ts
export const SAMSUNG_SHUTTLE_META = {
  title: "삼성전자 셔틀버스 노선별 아파트 시세 정리 2026",
  description: "수원·기흥·화성·평택 캠퍼스별 주요 셔틀 권역 아파트 전세·매매 시세를 정리했습니다.",
  updatedAt: "2026년 1분기",
  caution: "셔틀 정류장 지역은 재직자 커뮤니티 기반 추정이며, 노선은 사내 포털에서 확인 필요합니다. 아파트 시세는 국토부 실거래가 참고값입니다.",
};

export const SAMSUNG_SHUTTLE_FAQ: ShuttleFaq[] = [
  {
    question: "삼성전자 통근버스 정류장은 어디서 확인하나요?",
    answer: "삼성전자 통근버스는 사내 포털에서 확인하는 것이 정확합니다. 외부에 공개된 공식 노선 정보는 없으며, 재직자 커뮤니티(블라인드 등)에서 대략적인 권역을 파악할 수 있습니다. 입사 후 사내 교통앱을 통해 실시간 노선과 배차 정보를 이용할 수 있습니다.",
  },
  {
    question: "평택 발령 시 어디 사는 게 좋나요?",
    answer: "평택 P캠퍼스 기준으로 고덕신도시·브레인시티에서 10~20분 거리입니다. 동탄2신도시에서 셔틀을 이용하면 20~30분 수준이며 GTX-A 동탄역도 이용 가능합니다. 가격 대비 접근성은 동탄이 유리하고, 생활 인프라는 평택 고덕신도시가 빠르게 조성되고 있습니다.",
  },
  {
    question: "셔틀 정류장 근처 아파트가 더 비싼가요?",
    answer: "강남권은 셔틀 여부와 관계없이 지역 자체 시세가 높습니다. 판교·광교 권역에서는 셔틀 접근성이 시세에 간접적으로 반영되는 경향이 있습니다. 다만 '셔틀 프리미엄'보다 학군, 교통 편의, 신축 여부가 시세에 더 큰 영향을 미칩니다.",
  },
  {
    question: "삼성전자 셔틀버스는 외부인도 탈 수 있나요?",
    answer: "임직원 및 협력사 장기 출입증 소지자만 이용 가능합니다. 사원증 또는 출입증을 단말에 태그해야 탑승할 수 있으며 외부인 탑승은 불가합니다.",
  },
  {
    question: "삼성전자 성과급으로 아파트 매매가 가능한가요?",
    answer: "성과급 계산기에서 세후 예상 금액을 먼저 확인하고, 내집마련 자금 계산기에서 LTV 기준 최대 대출 가능액을 합산해 보세요. 고덕신도시·동탄·광교 30평 기준 매매가는 4억 5천~10억 사이로, 연봉과 성과급 수준에 따라 매수 가능 범위가 크게 달라집니다.",
  },
  {
    question: "셔틀 노선이 바뀌면 어떻게 되나요?",
    answer: "삼성전자는 캠퍼스 이전·확장 시 셔틀 노선을 조정할 수 있습니다. 평택캠퍼스 확장 이후 수도권에서 평택 방향 노선이 늘어난 것이 대표 사례입니다. 거주지를 결정하기 전에 현재 발령 캠퍼스 기준 노선을 사내 포털에서 반드시 확인하세요.",
  },
];

export const SAMSUNG_SHUTTLE_RELATED = [
  { href: "/tools/samsung-bonus/", label: "삼성전자 성과급 계산기" },
  { href: "/tools/home-purchase-fund/", label: "내집마련 자금 계산기" },
  { href: "/reports/sk-hynix-shuttle-real-estate-2026/", label: "SK하이닉스 셔틀권 부동산 정리" },
  { href: "/tools/salary/", label: "연봉 실수령액 계산기" },
];
```

---

## 4. 페이지 IA (섹션 순서)

```
1. CalculatorHero
2. InfoNotice (셔틀 정보 추정 + 시세 참고값 안내)
3. 캠퍼스 개요 카드 4개 (수원 SDC / 기흥 / 화성 / 평택)
4. 권역별 셔틀 + 시세 비교표
5. 권역별 카드 상세 (6개 권역)
6. 셔틀권 프리미엄 분석 섹션
7. 성과급 → 부동산 연결 CTA 블록
8. 관련 계산기 CTA 카드
9. SeoContent (intro 4단락 + FAQ 6개 + related 4개)
```

---

## 5. 화면 구성 상세

### 5-1. Hero

```
eyebrow: 삼성전자 직주근접 리포트
H1: 삼성전자 셔틀버스 노선별 아파트 시세 정리 2026
description: 수원·기흥·화성·평택 캠퍼스별 주요 셔틀 권역 아파트 전세·매매 시세를 정리했습니다.
             셔틀 접근성과 연봉 기준 부동산 부담을 함께 확인하세요.
```

### 5-2. InfoNotice

```
title: 데이터 기준 안내
lines:
  - 셔틀 정류장 지역은 재직자 커뮤니티 및 공개 채용공고 기반 추정값이며, 사내 포털에서 확인 필요합니다.
  - 아파트 시세는 국토부 실거래가 2026년 1분기 기준 30평(전용 84m²) 참고값입니다.
  - 소요 시간은 카카오맵 기준 평상시 추정이며, 교통 상황에 따라 ±20~30분 차이가 납니다.
```

### 5-3. 캠퍼스 요약 카드 (4개)

```
report-stat-card 형식
- SDC 수원: 영통구 삼성로. DX 부문 본사
- 기흥캠퍼스: 용인 기흥구. DS 반도체
- 화성캠퍼스: 화성시. DS 파운드리
- 평택캠퍼스: 평택시. DS NAND·DRAM (P1·P2·P3)
```

### 5-4. 권역별 셔틀 + 시세 비교표

| 권역 | 주요 지역 | 대상 캠퍼스 | 소요(분) | 전세 30평 | 매매 30평 |
|------|---------|-----------|---------|---------|---------|
| 강남·서초 | 강남역·역삼·양재 | SDC·기흥·화성·평택 | 60~120 | ~8억 | ~25억 |
| 판교·분당 | 판교역·정자역 | SDC·기흥 | 40~50 | ~6.5억 | ~16억 |
| 광교·수지 | 광교역·수지구청 | SDC·기흥 | 20~35 | ~4.5억 | ~10억 |
| 동탄 | 동탄역·동탄2 | 화성·평택 | 20~30 | ~3.8억 | ~8억 |
| 수원 시내 | 영통·망포 | SDC·기흥 | 10~20 | ~2.8억 | ~6억 |
| 평택·고덕 | 고덕신도시 | 평택 P캠퍼스 | 10~20 | ~2.2억 | ~4.5억 |

> 모바일: `.table-wrap` 가로 스크롤 처리

### 5-5. 성과급 → 부동산 CTA 블록

```html
<div class="sre-cta-box">
  <p>삼성전자 DS 사업부 성과급으로 어느 권역 아파트가 가능한지 계산해보세요</p>
  <a href="/tools/samsung-bonus/">성과급 계산기 →</a>
  <a href="/tools/home-purchase-fund/">내집마련 자금 계산기 →</a>
</div>
```

---

## 6. SeoContent props

```astro
<SeoContent
  introTitle="삼성전자 셔틀권 부동산 리포트를 보는 방법"
  intro={[
    // 단락1 — 맥락
    "삼성전자 임직원이 이사를 결정할 때 가장 먼저 확인하는 것은 '셔틀버스 타는 아파트'입니다. 수원 SDC, 기흥, 화성, 평택 캠퍼스 발령 여부에 따라 셔틀 탑승 가능 권역이 달라지고, 권역별 아파트 시세는 강남 25억부터 평택 고덕 4억 5천만원까지 5배 이상 차이가 납니다.",
    // 단락2 — 메커니즘
    "삼성전자 통근버스는 새벽 4시 30분부터 밤 11시 20분까지 340여 개 노선에 1,740여 대 차량이 운행됩니다. 정류장 지역은 사내 포털에서 확인하는 것이 정확하지만, 재직자 커뮤니티에서 파악한 주요 권역으로는 강남·서초, 판교·분당, 광교·수지, 동탄, 수원 시내, 평택 등이 있습니다.",
    // 단락3 — 해석 가이드
    "셔틀 소요 시간과 아파트 시세를 함께 보면 직주근접 비용이 보입니다. 기흥캠퍼스 기준으로 광교 30분·판교 40분·강남 60분 수준이며, 30평 매매가는 광교 10억·판교 16억·강남 25억으로 거리에 비례해 오릅니다. 셔틀 시간이 30분 길어질 때마다 매매가가 5억~7억 이상 높아지는 구조입니다.",
    // 단락4 — 한계
    "셔틀 정류장 위치는 회사 비공개 정보이며 캠퍼스 이전·확장 시 변경될 수 있습니다. 이 리포트의 권역 정보는 재직자 커뮤니티와 채용공고 기반 추정값이므로, 거주지를 최종 결정하기 전에 반드시 사내 포털에서 현행 노선을 확인하세요. 아파트 시세는 국토부 실거래가 참고값이며 시장 상황에 따라 변동됩니다.",
  ]}
  inputPoints={[
    "권역별 셔틀 소요 시간과 30평 기준 전세·매매 시세를 한 표에서 비교합니다.",
    "성과급 계산기와 연결해 사업부별 성과급으로 어느 권역 아파트가 가능한지 확인합니다.",
    "캠퍼스별 셔틀 범위와 미래 변화 포인트(평택 확장 등)를 함께 제공합니다.",
  ]}
  criteria={[
    "셔틀 권역은 재직자 커뮤니티 및 공개 채용공고 기반 추정값입니다.",
    "아파트 시세는 국토부 실거래가 2026년 1분기 기준 30평(전용 84m²) 참고값입니다.",
    "소요 시간은 카카오맵 기준 평상시 추정이며 실제와 다를 수 있습니다.",
  ]}
  faq={SAMSUNG_SHUTTLE_FAQ}
  related={SAMSUNG_SHUTTLE_RELATED}
/>
```

---

## 7. 스타일 설계

- SCSS 파일: `_samsung-shuttle-real-estate-2026.scss`
- 클래스 prefix: `sre-` (shuttle-real-estate)
- 톤: 부동산·직장 정보형, 신뢰감 있는 중립 컬러

주요 블록:
```scss
.sre-campus-grid       // 캠퍼스 카드 4개
.sre-zone-table        // 권역별 비교표
.sre-zone-cards        // 권역 카드 그리드
.sre-premium-section   // 셔틀권 프리미엄 분석
.sre-cta-box           // 성과급 → 부동산 CTA
```

---

## 8. SEO 설계

```
title: 삼성전자 셔틀버스 아파트 시세 정리 2026 | 캠퍼스별 직주근접 비용 비교
description: 수원·기흥·화성·평택 삼성전자 캠퍼스별 주요 셔틀 권역 아파트 전세·매매 시세를 정리했습니다.
canonical: https://bigyocalc.com/reports/samsung-shuttle-real-estate-2026/
```

H 구조:
- H1: 삼성전자 셔틀버스 노선별 아파트 시세 정리 2026
- H2: 캠퍼스 구조와 셔틀 권역 개요
- H2: 권역별 아파트 시세 비교
- H2: 강남·서초권 / 판교·분당권 / 광교·수지권 / 동탄권 / 수원 시내 / 평택권
- H2: 셔틀권 프리미엄 분석
- H2: 자주 묻는 질문

---

## 9. reports.ts 등록

```ts
{
  slug: "samsung-shuttle-real-estate-2026",
  title: "삼성전자 셔틀버스 노선별 아파트 시세 정리 2026",
  description: "캠퍼스별 셔틀 권역 아파트 전세·매매 시세와 직주근접 비용을 비교합니다.",
  category: "real-estate",
  tags: ["삼성전자", "셔틀버스", "부동산", "아파트"],
}
```

---

## 10. sitemap.xml 추가

```xml
<url>
  <loc>https://bigyocalc.com/reports/samsung-shuttle-real-estate-2026/</loc>
  <changefreq>quarterly</changefreq>
  <priority>0.7</priority>
</url>
```

---

## 11. 구현 순서

1. `samsungShuttleRealEstate2026.ts` 생성 — 타입, 데이터, meta, FAQ, related
2. `samsung-shuttle-real-estate-2026.astro` — Hero, InfoNotice, 캠퍼스 카드, 비교표, 카드, CTA, SeoContent
3. `_samsung-shuttle-real-estate-2026.scss` 작성 + `app.scss` import
4. `reports.ts` 등록
5. `sitemap.xml` 추가
6. `npm run build` 확인

---

## 12. QA 체크리스트

- [ ] 셔틀 정류장 지역을 확정 정보로 표현하지 않는다 (추정 배지)
- [ ] 아파트 시세에 기준 시점과 참고 배지가 표시된다
- [ ] InfoNotice에 데이터 한계가 안내되어 있다
- [ ] 비교표가 모바일에서 가로 스크롤된다
- [ ] 성과급 계산기·내집마련 계산기로 내부 링크 연결됨
- [ ] SeoContent intro 4단락 + FAQ 6개 + related 4개 충족
- [ ] 투자 권유 문구가 없다
- [ ] `npm run build` 성공
