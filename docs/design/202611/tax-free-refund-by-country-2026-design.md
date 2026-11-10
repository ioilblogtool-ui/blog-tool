# 해외 택스프리 나라별 정리 + 환급액 계산기 — 설계 문서

> 기획 원문: [tax-free-refund-by-country-2026.md](../../plan/202611/tax-free-refund-by-country-2026.md)
> 작성일: 2026-11-10 (한국시간)
> 문서 상태: **설계 작성 완료 / 구현·검증·배포 미착수**
> 기획서 `확인 필요` 항목은 이 설계서 3장에서 재확인 결과로 갱신했다. 남은 미확정 항목은 3-2에 정리했고, 구현 1단계에서 해소하거나 화면에 `확인 필요`로 노출한다.

## 1. 개요와 구현 결정

| 항목 | P1 리포트 | P2 계산기 |
|---|---|---|
| slug / URL | `tax-free-refund-by-country-2026` / `/reports/tax-free-refund-by-country-2026/` | `tax-free-refund-calculator` / `/tools/tax-free-refund-calculator/` |
| Title | `해외 택스프리 2026 완전 정리 \| 나라별 최소금액·환급률` | `택스프리 환급액 계산기 2026 \| 나라별 실제 환급액 바로 계산` |
| Description | 기획서 문구 | 기획서 문구 |
| 레이아웃 | 리포트 기본 구조 (`travel-card-vs-exchange-2026.astro` 패턴: `BaseLayout` + `CalculatorHero` + `InfoNotice` + `DesignTrustPanel` + `SeoContent`) | `SimpleToolShell` (`pageClass="tfr-page"`, `resultFirst={true}`) |
| prefix | `TFRR_` / `tfrr-` | `TFR_` / `tfr-` / DOM id `tfr*` |
| 카테고리 | `reports/index.astro` `category: "life"`, `index.astro` `{ category: "life", isNew: true }` | `tools.ts category: "travel"`, `index.astro` `"여행·생활"`, `tools/index.astro` `"여행·생활비"` + 소개 문구 |
| 데이터 | **공통** `src/data/taxFreeRefund2026.ts` (국가표·환율·FAQ를 두 페이지가 같이 씀) | 같음 |
| JS | 없음 (정적. 국가 카드 필터만 필요하면 인라인 최소 스크립트) | `public/scripts/tax-free-refund-calculator.js` (module, `url-state.js`의 `readParam`/`writeParams`/`deleteParams`) |
| 차트 | 없음 (표 중심) | 없음. 10개국 비교는 가로 막대형 CSS 바(Chart.js 불필요) |
| 배지 | 국가표 `공식 확인` / `확인 필요`, 실환급률 `추정` | 결과 `최대 환급액(계산식)`, 수수료 반영값 `추정` |
| OG | `public/og/reports/tax-free-refund-by-country-2026.png` (`scripts/generate-og.mjs`) | `public/og/tools/tax-free-refund-calculator.png` (`scripts/generate-og-tools.py` TOOLS) |

### 코드 확인으로 정리한 사항

- `url-state.js`에 `deleteParams`가 이미 있다(주식 손실 복구율 계산기 구현 때 추가). 새 헬퍼 불필요.
- `travelExchangeCalculator.ts`의 `defaultRate`는 2026년 5월 기준이고 AUD가 없다. **재사용하지 않고** 새 데이터 파일에 기준일과 함께 환율을 둔다(구현일 기준 매매기준율로 갱신).
- 여행 리포트 `travel-card-vs-exchange-2026.astro`는 데이터 파일에서 상수를 import해 SSR로 표를 그린다. P1도 같은 방식.
- `tools.ts` order 25.5·25.55·25.6·25.7은 사용 중. P2는 `order: 25.05` (환전 계산기 25 바로 뒤, 구현 시 중복 재확인).
- `reports.ts` order 최대값 95. P1은 `order: 96`.

## 2. 파일 구조와 책임

| 파일 | 작업 | 책임 |
|---|---|---|
| `src/data/taxFreeRefund2026.ts` | 신규 | 국가표, 환율, 일본 변경 비교표, 절차, 주의사항, 두 페이지 META·FAQ·intro·관련 링크 |
| `src/pages/reports/tax-free-refund-by-country-2026.astro` | 신규 | P1 마크업, JSON-LD(Article + FAQPage) |
| `src/pages/tools/tax-free-refund-calculator.astro` | 신규 | P2 마크업, SSR 기본 결과(일본 33,000엔), JSON-LD(WebApplication + FAQPage), config 주입 |
| `public/scripts/tax-free-refund-calculator.js` | 신규 | 입력 파싱, 계산, 렌더, URL 상태 |
| `src/styles/scss/pages/_tax-free-refund-by-country-2026.scss` | 신규 | `tfrr-` |
| `src/styles/scss/pages/_tax-free-refund-calculator.scss` | 신규 | `tfr-` |
| `src/styles/app.scss` | 수정 | `@use` 2개 |
| `src/data/tools.ts` / `src/data/reports.ts` | 수정 | 등록 |
| `src/pages/index.astro` / `src/pages/tools/index.astro` / `src/pages/reports/index.astro` | 수정 | 카테고리·소개 매핑 |
| `public/sitemap.xml` | 수정 | URL 2건 |
| `src/data/travelCardVsExchange2026.ts` | 수정 | `TCVE_RELATED_LINKS`에 P1·P2 역링크 |
| `scripts/generate-og.mjs`, `scripts/generate-og-tools.py` | 수정 | OG 항목 |

## 3. 데이터 재확인 결과 (2026-11-10)

### 3-1. 국가표 확정안

`minBasis`: `pre-tax`(세전 기준) / `tax-incl`(세금 포함) / `none`(최소금액 없음). `status`: `verified`(공식 또는 다수 일치) / `check`(구현 1단계에서 공식 출처 확인 필요).

| code | 국가 | 통화 | 부가세 | 최소금액 | minBasis | 환급 장소·조건 | status |
|---|---|---|---:|---|---|---|---|
| JP | 일본 | JPY | 10% (식품·무알코올 음료 8%) | 5,000엔 (동일 매장·당일, 세전) | pre-tax | **2026-11-01 구매분부터** 세금 포함가로 결제 → 출국일 공항·항만에서 체크인 전 면세 키오스크 또는 Visit Japan Web(주요 7개 공항)로 세관 확인 → 매장·환급사업자가 환급. 구매일로부터 90일 내. 소모품 50만엔 상한·전용 포장 폐지. 일반물품·소모품 구분 폐지 | verified (관광청) |
| FR | 프랑스 | EUR | 20% | 100.01유로 (동일 매장·당일) | tax-incl | EU 최종 출국 시 세관 전자 확인(PABLO) | check (공식) |
| IT | 이탈리아 | EUR | 22% | 70.01유로 (동일 매장, 2024-02부터 154.94유로 → 70유로로 인하) | tax-incl | EU 최종 출국 시 세관. 2026-07부터 세관 확인 절차 간소화 보도 | check (세관청 재확인. 인하 사실은 다수 일치) |
| ES | 스페인 | EUR | 21% | 없음 (2018 폐지) | none | EU 최종 출국 시 세관(DIVA) | check (공식) |
| DE | 독일 | EUR | 19% | 50.01유로 | tax-incl | EU 최종 출국 시 세관 | check (공식) |
| GB | 영국 | GBP | 20% | — | — | **관광객 부가세 환급 제도 없음**(2021 폐지). 계산 비활성 | verified |
| SG | 싱가포르 | SGD | 9% | 100싱가포르달러 (GST 포함, 동일 매장 같은 날 영수증 최대 3장 합산) | tax-incl | 창이·셀레타 공항 eTRS | verified (IRAS·ICA) |
| TH | 태국 | THB | 7% | 매장당 하루 2,000바트 + 여행 전체 합계 5,000바트 | tax-incl | 출국일 체크인 전 세관 도장. 1개 1만바트 이상 고가품은 출국심사 후 재확인 | check (환급률·수수료 출처 상충) |
| TW | 대만 | TWD | 5% | 2,000대만달러 (동일 매장·당일) | tax-incl | 매장 소액 즉시 환급(48,000대만달러 이하, 지정 매장) 또는 공항 | check (2019 개정 이후 변동 여부) |
| AU | 호주 | AUD | 10% (GST) | 300호주달러 (동일 사업자번호 합산), 출국 전 60일 내 구매 | tax-incl | 공항 TRS 창구에서 물품·여권·탑승권 제시. 앱 사전 입력 가능 | verified (공항·다수 일치. ABF 페이지 최종 확인) |

### 3-2. 남은 미확정 항목 (구현 1단계)

| 항목 | 처리 |
|---|---|
| EU 4개국 최소금액 공식 출처 | 각국 세관·재무부 페이지 확인. 못 찾으면 `check` 배지 유지 |
| 일본 환급 방식(카드·현금)과 수수료 | 관광청은 "매장마다 다름"이라고만 안내. **"환급 방법·수수료는 매장 안내 확인"** 고정 문구, 실환급률 범위 미제공 |
| 태국 환급률 (7% 전액 vs 수수료 차감) | 국세청(rd.go.th) VRT 조건 페이지 확인. 미확인 시 `typicalRefundRate: null` |
| 대만 수수료 | 재정부 고시 확인. 미확인 시 null |
| 대행사 실환급률 (EU·싱가포르) | Global Blue·Planet 공개 환급 계산기·표에서 구간값 수집. **출처 URL을 데이터에 저장**. 수집 실패 국가는 null |

`typicalRefundRate`가 null인 국가는 "최대 환급액"만 보여주고 "대행사 수수료가 빠지면 실제 금액은 더 적습니다"를 표시한다. 근거 없는 추정 수치를 만들지 않는다.

### 3-3. 출처 URL (데이터 `sources`에 저장)

- 일본: <https://www.mlit.go.jp/kankocho/tax-free/page01%5F000001%5F00028.html>, <https://www.mlit.go.jp/kankocho/tax-free/page01_000001_00056.html>
- 싱가포르: <https://www.iras.gov.sg/IRASHome/GST/Consumers/Tourist-Refund-Scheme/>, <https://ica.gov.sg/enter-depart/for-visitors/tourist-refund-scheme>
- 이탈리아 인하: <https://www.ggi.com/news/indirect-taxes/reduction-in-the-italian-threshold-for-tax-free-shopping>
- 태국: <https://vrtmap.rd.go.th/gps/en/Conditions.aspx>
- 대만: <https://law-out.mof.gov.tw/EngLawContent.aspx?id=10367&lan=E>
- 호주: <https://www.ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/gst/in-detail/rules-for-specific-transactions/international-transactions/gst-free-sales-to-travellers-departing-australia/tourist-refund-scheme>

## 4. 데이터 설계 (`src/data/taxFreeRefund2026.ts`)

```ts
export type TfrMinBasis = "pre-tax" | "tax-incl" | "none";
export type TfrStatus = "verified" | "check";

export interface TfrCountry {
  code: "JP" | "FR" | "IT" | "ES" | "DE" | "GB" | "SG" | "TH" | "TW" | "AU";
  name: string;            // "일본"
  flag: string;            // "🇯🇵"
  currency: "JPY" | "EUR" | "GBP" | "SGD" | "THB" | "TWD" | "AUD";
  currencyLabel: string;   // "엔"
  available: boolean;      // GB만 false
  vatRate: number;         // 0.10
  reducedRate?: number;    // JP 0.08
  minPurchase: number | null;
  minBasis: TfrMinBasis;
  tripTotalMin?: number;   // TH 5000
  maxOnsite?: number;      // TW 48000 (매장 즉시 환급 상한, 안내용)
  typicalRefundRate: [number, number] | null;  // 구매금액 대비, 추정. 출처 없으면 null
  refundPlace: string;
  notes: string[];
  status: TfrStatus;
  sources: { label: string; url: string }[];
  asOf: string;            // "2026-11"
}

export const TFR_FX = {
  asOf: "구현일 YYYY-MM-DD 매매기준율",
  rates: { JPY: 0, EUR: 0, GBP: 0, SGD: 0, THB: 0, TWD: 0, AUD: 0 },  // 원/1단위, 구현 시 채움
};

export const TFR_DEFAULT_INPUT = { country: "JP", amount: 33_000, rateType: "standard", fx: null, feePct: null };
export const TFR_COMPARE_KRW = 1_000_000;   // "100만원어치 사면" 비교 기준

export const TFR_JAPAN_CHANGE = [            // P1 상단·P2 일본 선택 시 공통
  { item: "결제", before: "매장에서 소비세 빼고 결제", after: "소비세 포함 가격으로 결제" },
  { item: "환급", before: "구매 시점에 면세", after: "출국일 세관 확인 후 매장·환급사업자가 환급" },
  { item: "기한", before: "—", after: "구매일로부터 90일 안에 출국 시 세관 확인" },
  { item: "소모품", before: "50만엔 상한·전용 포장", after: "상한·전용 포장 폐지, 일반물품과 구분 없음" },
  { item: "적용", before: "2026-10-31 구매분까지", after: "2026-11-01 구매분부터" },
];
```

- `TFRR_META`, `TFR_META`: slug, eyebrow, h1, seoTitle, seoDescription, updatedAt.
- `TFRR_FAQ` (기획서 8개), `TFR_FAQ` (6개: 일본 계산법, 세전·세후 기준 차이, 왜 부가세율보다 적게 받나, 여러 매장 합산, 영국, 입국 면세한도와 차이).
- `TFRR_SEO_INTRO` 4단락, `TFR_SEO_INTRO` 3단락(각 150자 이상).
- `TFR_RELATED_LINKS`: 기획서 8장 5개 + 상호 링크.

## 5. 계산 계약 (P2)

### 5-1. 순수 함수

```js
function calcRefund(country, amount, rateType, feePct) {
  const r = rateType === "reduced" && country.reducedRate ? country.reducedRate : country.vatRate;
  const preTax = amount / (1 + r);
  const vat = amount - preTax;                          // = 최대 환급액
  const basisAmount = country.minBasis === "pre-tax" ? preTax : amount;
  const meetsMin = country.minBasis === "none" || basisAmount >= country.minPurchase - 1e-6;
  const requiredInclusive = country.minBasis === "pre-tax"
    ? country.minPurchase * (1 + r) : country.minPurchase ?? 0;
  const shortfall = meetsMin ? 0 : requiredInclusive - amount;   // 세금 포함 결제액 기준으로 안내

  const range = country.typicalRefundRate
    ? country.typicalRefundRate.map((p) => amount * p) : null;
  const custom = feePct != null ? vat * (1 - feePct / 100) : null;   // 수수료 = 부가세 대비 %
  return { r, preTax, vat, maxRate: r / (1 + r), meetsMin, shortfall, range, custom };
}
const toKrw = (v, fx) => v * fx;
```

- 부족분은 사용자가 결제하는 **세금 포함 금액**으로 안내한다(일본도 "5,500엔 이상 결제"로 이해하기 쉬움).
- 일본 세전 기준 계산에서 부동소수 오차는 `1e-6` 허용 (예: 5,400 ÷ 1.08이 정확히 5,000이 아닐 수 있음 → T3).
- 비교 막대(10개국): 각국에서 `TFR_COMPARE_KRW`를 현지통화로 환산한 금액을 `calcRefund`에 넣어 최대 환급액(원)을 구한다. 영국은 0원 + "제도 없음".

### 5-2. 표시

| 함수 | 규칙 |
|---|---|
| `fmtLocal(v, cur)` | JPY·TWD·THB 정수 반올림, EUR·GBP·SGD·AUD 소수 2자리 |
| `fmtKrw(v)` | 10원 단위 반올림 + "원" (환율 추정이므로) |
| `fmtPct(v)` | 소수 2자리 |

### 5-3. 입력 검증

| 조건 | 처리 |
|---|---|
| amount ≤ 0 / 빈 값 | 필드 오류, 직전 결과 유지 |
| GB 선택 | 금액 입력 비활성, 결과 카드에 "영국은 2021년부터 관광객 부가세 환급이 없습니다" |
| rateType reduced인데 JP 아님 | 세율 선택 UI 숨기고 standard로 고정 |
| fx ≤ 0 | 기본 환율 복원 + 안내 |
| feePct < 0 또는 > 100 | 필드 오류 |
| 결과 NaN/Infinity | "—" 치환 |

## 6. 상태와 URL (P2)

| 상태 | 파라미터 | 비고 |
|---|---|---|
| country | `c` | `JP` 등, 기본값이면 생략 |
| amount | `a` | 현지통화 |
| rateType | `rt` | `reduced`일 때만 |
| fx | `fx` | 사용자가 바꿨을 때만 |
| feePct | `fee` | 입력했을 때만 |

- 국가 변경 시 `amount`를 해당 국가 대표 금액으로 바꾼다(JP 33,000 / EUR권 200 / SG 200 / TH 5,000 / TW 3,000 / AU 400). 사용자가 금액을 직접 입력한 뒤 국가를 바꾸면 금액 유지 여부를 고민하지 않도록 **항상 대표 금액으로 초기화**하고 단위 라벨을 갱신한다.
- 초기화: `deleteParams(["c","a","rt","fx","fee"])`.

## 7. 화면 구성

### 7-1. P1 리포트

1. `CalculatorHero` eyebrow "해외여행 쇼핑", h1 "나라별 택스프리, 얼마 사면 얼마 돌려받나", 한 줄 결론 + `InfoNotice`(기준일, 제도 변경 가능, 환급률 추정)
2. **일본 변경 박스** `.tfrr-japan`: `TFR_JAPAN_CHANGE` 표 + 주의 3줄(체크인 전에 처리, 영수증 물품 전부 제시해야 함, 초기 대기 혼잡 예상)
3. 국가표 `.tfrr-matrix`: 국가 / 부가세 / 최소금액(현지 + 원화 환산) / 최대 환급률 / 환급 장소 / 상태 배지. ≤640px에서 국가별 카드로 전환
4. 공통 절차 4단계 (아이콘 없는 번호 스텝)
5. 지역별 주의사항: EU(최종 출국국에서 세관 확인), 영국, 싱가포르(영수증 3장 합산), 태국(합계 5,000바트, 고가품 재확인), 대만(매장 즉시 환급), 호주(사업자번호 합산·60일)
6. 카드 vs 현금 환급 비교 → 환전 계산기 링크
7. "택스프리 환급 ≠ 입국 면세한도(US$800)" 안내 박스
8. P2 CTA 카드 → `SeoContent`(intro, FAQ 8, related)

### 7-2. P2 계산기

1. hero + `InfoNotice`(최대 환급액은 계산식, 실제는 수수료로 더 적음 / 환율 기준일 / 제도 기준일)
2. actions: `ToolActionBar resetId="tfrResetBtn" copyId="tfrCopyLinkBtn"`
3. aside(입력): 국가 칩 10개 `[data-tfr-country]`, 금액 `#tfrAmount`(통화 라벨 `#tfrCurrencyLabel`), 일본 세율 토글 `[data-tfr-rate]`, 고급 설정 `<details>`: 환율 `#tfrFx`(기준일 표시), 수수료 `#tfrFee`
4. 결과:
   - 핵심 카드: 최대 환급액(원, 큰 숫자) + 현지통화 + 최대 환급률. `typicalRefundRate` 있으면 "실제 예상 ○○~○○원 `추정`"
   - 최소금액 카드: 충족(초록) / 미충족 "○○엔(약 ○○원) 더 사면 환급 대상"
   - 분해표: 결제액 → 세전 금액 → 포함 부가세 → 수수료(입력 시) → 환급액
   - 국가 안내 카드: 해당 국가 `refundPlace`, `notes`, 상태 배지, 일본이면 변경 요약 3줄
   - 10개국 비교 막대: "100만원어치 사면 최대 환급액"
5. `SeoContent` + P1 CTA

### 7-3. SCSS

- 각 페이지 스코프(`.tfrr-page`, `.tfr-page`), 중첩 3단계 이내, 기존 여행 리포트 팔레트.
- 국가 칩: 모바일 2줄 가로 스크롤 금지 → `flex-wrap`.
- 비교 막대: `width: calc(var(--v) * 100%)` 인라인 변수, 라벨은 막대 밖.
- 320/375/768px 가로 스크롤 없음.

## 8. SEO·등록

- P1 JSON-LD: `Article`(headline, dateModified, mainEntityOfPage) + `FAQPage`.
- P2 JSON-LD: `WebApplication`(applicationCategory "TravelApplication") + `mainEntity: FAQPage`.

```ts
// tools.ts
{ slug: "tax-free-refund-calculator", title: "택스프리 환급액 계산기",
  description: "여행 국가와 구매금액으로 최대 택스프리 환급액과 최소금액 충족 여부를 원화로 계산합니다.",
  order: 25.05, eyebrow: "여행 쇼핑", category: "travel", iframeReady: true,
  badges: ["신규", "여행", "택스프리"],
  previewStats: [{ label: "일본 33,000엔", value: "3,000엔 환급" }, { label: "대상 국가", value: "10개국" }] },
// reports.ts
{ slug: "tax-free-refund-by-country-2026", title: "해외 택스프리 2026 나라별 완전 정리",
  description: "일본 환급 방식 변경부터 유럽·동남아·호주까지 10개국 택스프리 최소금액과 환급 방법을 비교합니다.",
  order: 96, badges: ["신규", "여행", "택스프리", "2026"] },
```

- `reports/index.astro`: `{ eyebrow: "해외여행 쇼핑", tags: [택스프리, 여행, 2026], category: "life", isNew: true }`
- sitemap 2건(`changefreq monthly`, priority 0.7), 트레일링 슬래시 포함.

## 9. 검증 사례

| # | 입력 | 기대 결과 |
|---|---|---|
| T1 | JP, 33,000엔, 표준 | 세전 30,000엔, 최대 환급 3,000엔, 9.09%, 충족 |
| T2 | JP, 5,400엔, 표준 | 세전 4,909엔 → 미충족, 부족 100엔(5,500엔 결제 필요) |
| T3 | JP, 5,400엔, 경감 8% | 세전 5,000엔 → 충족, 환급 400엔 |
| T4 | FR, 240유로 | 환급 40.00유로, 16.67%, 충족 |
| T5 | FR, 90유로 | 미충족, 부족 10.01유로 |
| T6 | IT, 122유로 | 환급 22.00유로, 18.03%, 충족 |
| T7 | IT, 70유로 | 미충족, 부족 0.01유로 |
| T8 | ES, 10유로 | 최소금액 없음 → 충족, 환급 1.74유로 |
| T9 | DE, 119유로 | 환급 19.00유로, 15.97% |
| T10 | GB | 계산 비활성, 제도 없음 안내 |
| T11 | SG, 109싱가포르달러 | 환급 9.00, 8.26%, 충족 |
| T12 | TH, 2,140바트 | 환급 140바트, 매장 기준 충족 + "여행 합계 5,000바트 이상" 안내 |
| T13 | TW, 2,100대만달러 | 환급 100대만달러, 4.76% |
| T14 | AU, 330호주달러 | 환급 30.00, 9.09% |
| T15 | FR 240유로 + fee 30% | 수수료 반영 28.00유로 `추정` |
| T16 | URL `?c=IT&a=122` 진입 | T6 복원, 이탈리아 칩 선택 |

## 10. 구현 순서와 완료 조건

1. 3-2 미확정 항목 확인 → 데이터 `status`·`typicalRefundRate`·환율 확정
2. 데이터 파일 → 3. P2 Astro + JS + SCSS → 4. P1 Astro + SCSS → 5. 등록(tools/reports/index 3곳/sitemap/app.scss) + 역링크 + OG 2건 → 6. 검증(T1~T16, 모바일 3폭, 콘솔 오류)

QA 체크:

- [ ] `확인 필요` 국가가 화면에 배지로 표시되거나 공식 확인 후 해제됐는가
- [ ] "면세로 사서 되팔기" 등 부적절 표현 없음, 특정 대행사 추천 없음
- [ ] 환율·제도 기준일이 두 페이지에 표시되는가
- [ ] P1↔P2, 여행카드 리포트 역링크 동작

```bash
npm run check:all
npm run build
```

둘 다 성공하고 `dist/reports/tax-free-refund-by-country-2026/index.html`, `dist/tools/tax-free-refund-calculator/index.html`이 생성돼야 한다. **이 설계서 작성 시점에는 구현·실행하지 않았다.**

## 구현 기록 · 2026-11-10

- 신규 파일: `src/data/taxFreeRefund2026.ts`, `src/pages/tools/tax-free-refund-calculator.astro`, `src/pages/reports/tax-free-refund-by-country-2026.astro`, `public/scripts/tax-free-refund-calculator.js`, SCSS 파셜 2개, OG 2건(`public/og/tools/tax-free-refund-calculator.png`, `public/og/reports/tax-free-refund-by-country-2026.png`)
- 수정 파일: `src/data/tools.ts`(order 25.05), `src/data/reports.ts`(order 96), `src/pages/index.astro`, `src/pages/tools/index.astro`, `src/pages/reports/index.astro`, `src/styles/app.scss`, `public/sitemap.xml`, `src/data/travelCardVsExchange2026.ts`(역링크 2개), `scripts/generate-og-tools.py`(TOOLS·REPORTS 항목)
- 3-2 처리 결과:
  - 프랑스(100.01유로, 2020 인하)·독일(50.01유로, 2020-01)은 세관·상공회의소 자료로 확인해 `verified`.
  - 이탈리아·스페인·태국·대만은 `check` 유지(화면에 `확인 필요` 배지).
  - **모든 국가 `typicalRefundRate: null`** — 대행사 공개 환급표를 확인하지 못해 실환급 범위를 넣지 않았다. 대신 수수료 직접 입력(고급 설정)만 제공.
  - 환율: 2026-11-10 매매기준율(JPY 846.25/100엔, EUR 1,501.61, SGD 1,047.08, THB 40.09, AUD 925.80). TWD는 고시값을 찾지 못해 43원 참고값.
- 설계 대비 변경:
  - 최소금액 미충족 시 핵심 카드에 "아직 최소금액에 못 미쳐 지금은 환급 대상이 아닙니다" 문구 추가(최대 환급액만 보이면 받을 수 있다고 오해할 수 있음).
  - 공통 리포트 표 `min-width: 720px` 때문에 모바일에서 일본 비교표·10개국 표가 잘려, 두 표에서 해제하고 10개국 표는 640px 이하에서 카드형으로 전환.
  - Python이 없는 환경이라 OG는 `generate-og-tools.py` 레이아웃을 SVG로 옮겨 sharp로 생성(스크립트에도 항목은 추가해 둠).
  - `generate-og-tools.py` 다음 실행 시 같은 slug PNG를 Pillow로 다시 만든다(디자인 동일 계열).
- 검증: `npm run check:all` 오류 0(기존 경고 2건), 매핑 누락 없음. `npm run build` 성공, dist 2개 경로 생성. 빌드 미리보기에서 T1~T16 기대값 일치, 콘솔 오류 없음, 375px 두 페이지 가로 스크롤 없음.
- 미완료: 데스크톱 폭 화면 확인(브라우저 창이 숨겨져 측정 불가), 커밋·배포.
