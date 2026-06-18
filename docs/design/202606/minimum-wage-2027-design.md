# 2027 최저임금 계산기 설계 문서

> 기획 원본: `docs/plan/202606/minimum-wage-2027-plan.md`  
> 작성일: 2026-06-18  
> 레이아웃: `SimpleToolShell`  
> 슬러그: `minimum-wage-2027`  
> prefix: `mw27-`

---

## 1. 파일 구조

```
src/data/minimumWage2027.ts
src/pages/tools/minimum-wage-2027.astro
public/scripts/minimum-wage-2027.js
src/styles/scss/pages/_minimum-wage-2027.scss
```

등록 위치:
- `src/data/tools.ts` — order: 2.5 (minimum-wage-2026 다음)
- `public/sitemap.xml` — URL 추가

---

## 2. 데이터 파일 (`src/data/minimumWage2027.ts`)

```ts
// 2027 발표 전: 2026 시급을 기본값으로, 발표 후 MW27_CURRENT만 교체
export const MW27_CURRENT = {
  year: 2027,
  hourly: 10030,          // ← 7월 발표 후 이 값만 교체
  prevHourly: 10030,      // 2026 시급
  announced: false,       // 발표 전: false, 발표 후: true
  announcedDate: "",      // 발표 후 "2026-07-XX" 입력
};

export const MW27_HISTORY = [
  { year: 2020, hourly: 8590,  changeRate: 2.9 },
  { year: 2021, hourly: 8720,  changeRate: 1.5 },
  { year: 2022, hourly: 9160,  changeRate: 5.0 },
  { year: 2023, hourly: 9620,  changeRate: 5.0 },
  { year: 2024, hourly: 9860,  changeRate: 2.5 },
  { year: 2025, hourly: 10030, changeRate: 1.7 },
  { year: 2026, hourly: 10030, changeRate: 0.0 }, // 확정 후 업데이트
  { year: 2027, hourly: 10030, changeRate: 0.0 }, // 발표 후 업데이트
];

// 글로벌 최저임금 데이터 (달러 환산, PPP 환산, 빅맥 가격)
// 업데이트 주기: 연 1회
export const MW27_GLOBAL = [
  { country: "호주",   flag: "🇦🇺", hourlyUSD: 15.8, hourlyPPP: 12.1, bigmacUSD: 7.50 },
  { country: "영국",   flag: "🇬🇧", hourlyUSD: 15.4, hourlyPPP: 11.8, bigmacUSD: 5.90 },
  { country: "프랑스", flag: "🇫🇷", hourlyUSD: 12.9, hourlyPPP: 10.4, bigmacUSD: 6.20 },
  { country: "독일",   flag: "🇩🇪", hourlyUSD: 13.9, hourlyPPP: 10.9, bigmacUSD: 6.00 },
  { country: "캐나다", flag: "🇨🇦", hourlyUSD: 12.5, hourlyPPP: 10.2, bigmacUSD: 7.00 },
  { country: "일본",   flag: "🇯🇵", hourlyUSD: 6.8,  hourlyPPP: 8.9,  bigmacUSD: 4.00 },
  { country: "미국",   flag: "🇺🇸", hourlyUSD: 7.25, hourlyPPP: 7.25, bigmacUSD: 5.80 },
  { country: "한국",   flag: "🇰🇷", hourlyUSD: 7.3,  hourlyPPP: 9.1,  bigmacUSD: 5.20 },
  { country: "스페인", flag: "🇪🇸", hourlyUSD: 9.5,  hourlyPPP: 8.8,  bigmacUSD: 5.50 },
  { country: "폴란드", flag: "🇵🇱", hourlyUSD: 5.8,  hourlyPPP: 8.2,  bigmacUSD: 3.80 },
];

// 빅맥 외 비교 품목 (한국 기준 가격)
export const MW27_ITEMS = {
  bigmac:    { label: "빅맥",          priceKRW: 5700  },
  americano: { label: "아메리카노",     priceKRW: 4500  },
  subway:    { label: "지하철 1회",     priceKRW: 1500  },
  gs25:      { label: "편의점 도시락",  priceKRW: 4500  },
};

export const MW27_META = {
  slug: "minimum-wage-2027",
  title: "2027 최저임금 계산기 | 세후 월급 + 세계 최저임금 순위 비교",
  description: "2027년 최저임금 시급으로 세후 월급 바로 계산. OECD 국가별 최저임금 순위와 빅맥으로 보는 구매력 비교 포함.",
  updatedAt: "2026-07-01",  // 발표 후 업데이트
  caution: "글로벌 데이터는 OECD·이코노미스트 빅맥지수 기준 추정값입니다. 환율에 따라 달라질 수 있습니다.",
};

export const MW27_FAQ = [
  {
    q: "2027 최저임금은 언제 발표되나요?",
    a: "최저임금위원회가 매년 6~7월 심의를 거쳐 8월 5일 이전 고시합니다. 2027년 적용 최저임금은 2026년 7월 중 발표 예정입니다.",
  },
  {
    q: "주휴수당은 어떤 경우에 받나요?",
    a: "1주 소정근로시간이 15시간 이상인 근로자에게 유급 주휴일(8시간)이 주어집니다. 주 5일 8시간 기준 월급 계산 시 주휴수당이 포함되어 기본시급보다 약 20% 높게 책정됩니다.",
  },
  {
    q: "한국 최저임금은 세계 몇 위인가요?",
    a: "달러 환산 기준으로 OECD 중하위권이지만, 물가를 반영한 PPP 기준으로는 중위권(약 15위 내외)입니다. 일본보다는 높고 서유럽 주요국보다는 낮습니다.",
  },
  {
    q: "빅맥 지수로 보는 구매력이란?",
    a: "시간당 최저임금으로 빅맥을 몇 개 살 수 있는지 계산한 값입니다. 한국은 약 1.4개로 호주(2.1개), 영국(2.6개)보다 낮습니다. 단순 시급 비교보다 실질 구매력을 직관적으로 보여줍니다.",
  },
  {
    q: "최저임금 위반 시 어떻게 되나요?",
    a: "최저임금법 위반 시 3년 이하 징역 또는 2천만원 이하 벌금에 처해집니다. 고용노동부 고객상담센터(1350)에 신고 가능합니다.",
  },
];

export const MW27_DEFAULTS = {
  hoursPerDay: 8,
  daysPerWeek: 5,
  includeWeeklyHoliday: true,
  compareMode: "ppp" as "usd" | "ppp",
  compareItem: "bigmac" as keyof typeof MW27_ITEMS,
};
```

---

## 3. 화면 구성 (`minimum-wage-2027.astro`)

### Aside (입력)

```
[발표 전 배너] — announced: false 일 때만 표시
"2027년 최저임금은 7월 발표 예정입니다. 현재 2026년 시급(10,030원)으로 계산 중입니다."

[섹션1] 시급 설정
  - 시급 입력 (data-mw27="hourly")
  - 하루 근무시간 (data-mw27="hoursPerDay")
  - 주 근무일수 (data-mw27="daysPerWeek")
  - 주휴수당 포함 토글 (data-mw27-bool="includeWeeklyHoliday")

[섹션2] 글로벌 비교 설정
  - 비교 기준: PPP / 달러 환산 탭
  - 비교 품목: 빅맥 / 아메리카노 / 지하철 / 편의점 도시락 버튼
```

### 결과 영역

```
[KPI 카드 3개]
  - 세전 월급
  - 세후 실수령 (4대보험 + 소득세 공제)
  - 연봉 환산

[인상률 배지] — announced: true 일 때
  "전년 대비 +X.X% 인상 (XXX원 → XXX원)"

[글로벌 순위 섹션]
  제목: "한국 최저임금, OECD에서 몇 위?"
  - 가로 막대 차트 (국가별 PPP/USD 기준)
  - 한국 강조 표시

[빅맥 구매력 섹션]
  제목: "1시간 일하면 XX 몇 개 살 수 있나?"
  - 품목 전환 버튼 (빅맥/아메리카노/지하철/도시락)
  - 나라별 구매 가능 개수 가로 막대 차트
  - 한국 강조 표시

[인상 히스토리 섹션]
  제목: "최저임금 인상 추이 (2020~2027)"
  - 꺾은선 차트 (시급 + 인상률)

[SeoContent + FAQ]
```

---

## 4. 계산 로직 (`public/scripts/minimum-wage-2027.js`)

### 실수령 계산

```js
// 주휴수당 포함 월 소정근로시간
function calcMonthlyHours(hoursPerDay, daysPerWeek, includeWeeklyHoliday) {
  const weeklyHours = hoursPerDay * daysPerWeek;
  const weeklyHolidayHours = includeWeeklyHoliday && weeklyHours >= 15
    ? hoursPerDay  // 주 1일치
    : 0;
  const totalWeeklyHours = weeklyHours + weeklyHolidayHours;
  return (totalWeeklyHours * 365) / 12 / 7;
}

// 세전 월급
function calcMonthlyGross(hourly, monthlyHours) {
  return Math.round(hourly * monthlyHours);
}

// 4대보험 공제 (근로자 부담)
// 국민연금 4.5%, 건강보험 3.545%, 장기요양 0.4591%, 고용보험 0.9%
const DEDUCTION_RATE = 0.04500 + 0.03545 + 0.004591 + 0.009;

// 근로소득세 (간이세액표 근사값 — 월 200만원 이하 구간)
function calcIncomeTax(monthly) {
  if (monthly <= 1060000) return 0;
  if (monthly <= 1500000) return Math.round((monthly - 1060000) * 0.06);
  if (monthly <= 3000000) return Math.round(26400 + (monthly - 1500000) * 0.15);
  return Math.round(26400 + 225000 + (monthly - 3000000) * 0.24);
}

function calcNetMonthly(gross) {
  const insurance = Math.round(gross * DEDUCTION_RATE);
  const incomeTax = calcIncomeTax(gross);
  const localTax = Math.round(incomeTax * 0.1);
  return { gross, insurance, incomeTax, localTax, net: gross - insurance - incomeTax - localTax };
}
```

### 글로벌 비교 계산

```js
// 구매력: 시급 / 품목가격
function calcPurchasePower(hourlyKRW, itemPriceKRW) {
  return hourlyKRW / itemPriceKRW;
}

// 국가별 구매력 (USD 환산)
function calcGlobalPurchasePower(globalData, itemUSDPrice, mode) {
  return globalData.map(c => ({
    ...c,
    hourly: mode === 'ppp' ? c.hourlyPPP : c.hourlyUSD,
    power: (mode === 'ppp' ? c.hourlyPPP : c.hourlyUSD) / itemUSDPrice,
  })).sort((a, b) => b.hourly - a.hourly);
}
```

### 차트

```js
// Chart 1: OECD 순위 가로 막대 (국가별 시급)
// Chart 2: 빅맥 구매력 가로 막대 (구매 개수)
// Chart 3: 히스토리 꺾은선 (시급 + 인상률 이중축)
```

---

## 5. SCSS (`_minimum-wage-2027.scss`)

prefix: `mw27-`

### 주요 클래스

```scss
.mw27-page {
  .mw27-announce-banner    // 발표 전 안내 배너 (노란색)
  .mw27-section            // 입력 섹션
  .mw27-field              // 입력 필드 행
  .mw27-input-row          // input + 단위
  .mw27-toggle-label       // 주휴수당 토글
  .mw27-mode-tabs          // PPP/USD 전환 탭
  .mw27-item-btns          // 비교 품목 버튼 그룹

  .mw27-kpi-grid           // KPI 카드 3열
  .mw27-kpi-card           // KPI 카드
  .mw27-raise-badge        // 인상률 배지 (green)
  
  .mw27-global-section     // 글로벌 비교 영역
  .mw27-chart-wrap         // 차트 컨테이너 (height: 320px OECD, 280px 빅맥)
  .mw27-history-chart-wrap // 히스토리 차트 (height: 220px)
  
  .mw27-korea-highlight    // 한국 강조 레이블
  .mw27-net-breakdown      // 세후 공제 내역 테이블
}
```

---

## 6. URL 상태 동기화

```
?hourly=10030&hpd=8&dpw=5&wh=1&mode=ppp&item=bigmac
```

| 파라미터 | 의미 | 기본값 |
|---------|------|--------|
| hourly | 시급 | MW27_CURRENT.hourly |
| hpd | 하루 근무시간 | 8 |
| dpw | 주 근무일 | 5 |
| wh | 주휴수당 포함 | 1 |
| mode | 비교 기준 ppp/usd | ppp |
| item | 비교 품목 | bigmac |

---

## 7. tools.ts 등록

```ts
{
  slug: "minimum-wage-2027",
  title: "2027 최저임금 계산기",
  description: "2027 최저임금 세후 월급 계산 + OECD 국가별 순위 비교",
  category: "급여",
  order: 2.5,
  badges: ["2027", "NEW"],
  previewStats: [
    { label: "2027 시급", value: "발표예정" },
    { label: "OECD 순위", value: "약 15위" },
  ],
},
```

---

## 8. QA 포인트

- [ ] 주휴수당 OFF 시 월 소정근로시간 재계산 확인
- [ ] 세후 실수령이 세전보다 크지 않은지 확인
- [ ] 글로벌 차트에서 한국 강조 표시 동작 확인
- [ ] PPP ↔ USD 전환 시 차트 즉시 업데이트
- [ ] 비교 품목 전환 시 차트 제목·데이터 즉시 반영
- [ ] 발표 전 배너 (announced: false) 표시 확인
- [ ] URL 파라미터 복원 확인
- [ ] 모바일 가로 막대 차트 레이블 잘림 없는지 확인

---

## 9. 구현 후 업데이트 절차 (7월 발표 시)

1. `minimumWage2027.ts`에서 `MW27_CURRENT` 수치 교체
   - `hourly`: 새 시급
   - `announced`: true
   - `announcedDate`: 발표일
2. `MW27_HISTORY` 2027행 `changeRate` 업데이트
3. `MW27_META.updatedAt` 날짜 업데이트
4. 빌드 후 배포 — 계산기 자동 반영
