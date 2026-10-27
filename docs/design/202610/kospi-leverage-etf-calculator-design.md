# 코스피 레버리지 ETF 계산기 개선 — 급락·반등 시나리오 설계

> 기획 원문: [kospi-leverage-etf-calculator.md](../../plan/202610/kospi-leverage-etf-calculator.md)
> 작성일: 2026-10-27 (한국시간)
> 문서 상태: **개선 설계 작성 완료 / 구현·검증·배포 미착수**
> 계산 기대값은 기획서 5-3(Node.js 검산)과 동일. 규제 타임라인 상태는 구현 직전 금융위 자료로 재확인.

## 1. 개요와 결정

| 항목 | 결정 |
|---|---|
| slug / URL | `kospi-leverage-etf-calculator` 유지 |
| 작업 범위 | 시나리오 2개 추가(급락→반등, ±N% 반복) + 경로 직접 설정 패널 + 원금 회복 비교표 + 메커니즘 예시 1개 + FAQ 3개 + 규제 타임라인 갱신 + Title/Description |
| 계산 엔진 | 기존 `calculateLeverage(inputs, scenario)` 재사용. 신규 시나리오는 `dailyIndexReturns` 배열을 **런타임 생성**해 같은 함수에 전달 |
| 보수 처리 | 기존 그대로: 보수 전 수익률 − `연보수 × 거래일/252` (단순 차감), 일간 레버리지 수익률 하한 `max(m·r, −1)` |
| 기본 시나리오 | 기존 `sideways` 유지(기존 URL·previewStats 회귀 방지). 신규 시나리오는 칩 첫 줄에 배치하고 Hero 리드에서 유도 |
| 차트 | 추가하지 않음(기존 페이지도 표 기반) |
| prefix | 기존 `KLC_` / `klc-` / id `klc-*` |
| Title | `코스피 레버리지 ETF 계산기 2026 \| 급락 후 반등해도 손실?` |
| Description | 기획서 변경안 |
| OG | 기존 `/og/tools/kospi-leverage-etf-calculator.png` — Title 변경 반영해 재생성 |

## 2. 실제 구현 대조 (2026-10-27 저장소 확인)

| 위치 | 현재 | 변경 |
|---|---|---|
| `KLC_SCENARIOS` | 4개 정적 배열(`sideways`, `uptrend`, `volatileUp2026`, `downtrend`) | 정적 4개 유지 + 빌더형 2개(`crashRebound`, `alternating`) 메타 추가 |
| `KlcScenario.id` 타입 | 4개 유니온 | 6개로 확장, `builder?: "crashRebound" \| "alternating"` 필드 |
| 페이지 config | `SCENARIOS`, `DEFAULT_SCENARIO_ID` | `PATH_DEFAULTS`, `PATH_LIMITS`, `RECOVERY_DROPS` 추가 |
| JS `getScenario(id)` | 정적 배열 조회 | 빌더형이면 `buildPath(state)`로 `dailyIndexReturns` 생성한 객체 반환 |
| JS `renderPathTable` | 모든 일차 행 출력 | 행 > 20이면 앞 5·뒤 5 + 접힘 토글, 구간(하락/반등) 라벨 열 추가 |
| `recoveryNote` | ETF 자체 필요 상승률 1문장 | 유지 + "지수 기준 필요 상승률(같은 기간 균등 반등 가정)" 1문장 추가 |
| `writeParams` | principal, multiple, scenario, fee | 빌더형일 때만 `drop`, `dd`, `reb`, `rd`, `amp`, `n` 추가 |
| `KLC_MECHANISM` | 100→110→100 | 유지 + `KLC_MECHANISM_CRASH`(100→80→100) 추가 |
| `KLC_REGULATION_TIMELINE` | 7/31·8/19·11월 모두 "예정" | 상태 갱신(3-4) |
| `KLC_FAQ` | 8개 | 11개 |
| `KLC_RELATED_LINKS` | 3개, 사이드카 라벨 "41회" | 4개(8장) |
| `KLC_META.seoTitle/seoDescription/updatedAt` | 07-30 | 변경 |
| `src/data/tools.ts` 73행 | description·previewStats | description 갱신, previewStats 2번째를 `{ label: "-20%→+25% 반등", value: "레버리지 -10%" }`로 교체 검토(1번째 "-5.36%p"는 유지) |

## 3. 데이터 설계 (`src/data/kospiLeverageEtfCalculator.ts`)

### 3-1. 타입 확장

```ts
export type KlcScenarioId = "sideways" | "uptrend" | "volatileUp2026" | "downtrend" | "crashRebound" | "alternating";

export type KlcScenario = {
  id: KlcScenarioId;
  label: string;
  narrative: string;
  dailyIndexReturns: number[];              // 빌더형은 [] (런타임 생성)
  builder?: "crashRebound" | "alternating";
};

export type KlcPathDefaults = {
  dropPct: number;        // 20
  dropDays: number;       // 1
  reboundMode: "auto" | "manual";
  reboundPct: number;     // auto면 무시
  reboundDays: number;    // 1
  altAmpPct: number;      // 10
  altCycles: number;      // 2  (= 4거래일)
};

export type KlcPathLimits = {
  dropPct: [number, number];      // [0.1, 95]
  days: [number, number];         // [1, 60]
  reboundPct: [number, number];   // [0, 500]
  altAmpPct: [number, number];    // [1, 30]
  altCycles: [number, number];    // [1, 20]
};

export type KlcRecoveryRow = {
  dropPct: number;
  days: 1 | 10;
  leverageValue: number;          // 원금 1 기준
  etfRecoveryNeeded: number;
  indexRecoveryNeeded: number;
};
```

### 3-2. 신규 시나리오 메타

```ts
{ id: "crashRebound", label: "급락 후 반등", builder: "crashRebound", dailyIndexReturns: [],
  narrative: "코스피200이 크게 떨어졌다가 다시 올라 원점으로 돌아옵니다. 지수는 본전이어도 레버리지 ETF는 손실이 남을 수 있습니다." },
{ id: "alternating", label: "같은 폭 오르내림", builder: "alternating", dailyIndexReturns: [],
  narrative: "같은 폭으로 오르고 내리기를 반복합니다. 반복할수록 일반 지수와 레버리지의 차이가 커집니다." },
```

배치: 시나리오 그리드에서 `crashRebound`를 첫 칸, `alternating`을 `sideways` 다음. 데이터 배열 순서는 기존 첫 요소 `sideways`(기본값) 유지 → 표시 순서는 `KLC_SCENARIO_ORDER` 배열로 분리.

### 3-3. 비교표 설정

```ts
export const KLC_RECOVERY_DROPS = [10, 20, 30];          // %
export const KLC_RECOVERY_SPLITS = [1, 10] as const;     // 거래일
```

비교표 값은 하드코딩하지 않고 빌드 시 계산해 SSR 렌더(배율 2·보수 0 고정, 표 캡션에 명시). 사용자가 배율을 바꿔도 비교표는 2배 기준 유지(캡션 "2배·보수 0% 기준").

### 3-4. 규제 타임라인

| 항목 | 현재 status | 변경 원칙 |
|---|---|---|
| 7/16 신규상장 잠정 중단·광고 금지 | 완료 | 유지 |
| 7/31 현금 3천만원 예탁 | 예정 | 금융위·거래소 후속 자료로 시행 확인 시 `완료`(문구 "시행") |
| 8/19 괴리율 기준 3%→2% | 예정 | 동일 |
| 11월 매매단위 1주→20주 | 예정 | 시행일 확정 자료 확인 후 날짜 명시, 미확인이면 "2026년 11월 추진(시행일 확인 중)" |

타입 `status`에 `"확인 중"` 추가. 확인 못 한 항목은 `"확인 중"`으로 두고 FAQ "현금 3천만원…" 답변 시제도 맞춘다. 출처 주석의 확인일을 갱신.

### 3-5. 메커니즘 예시 추가

```ts
export const KLC_MECHANISM_CRASH = {
  title: "지수가 -20% 후 +25%로 원점이면, 2배 레버리지는?",
  steps: [
    { day: "시작", indexValue: "100", indexReturnLabel: "-", leverageValue: "100", leverageReturnLabel: "-" },
    { day: "급락", indexValue: "80", indexReturnLabel: "-20%", leverageValue: "60", leverageReturnLabel: "-40%" },
    { day: "반등", indexValue: "100", indexReturnLabel: "+25%", leverageValue: "90", leverageReturnLabel: "+50%" },
  ],
  conclusion: "지수는 원점이지만 레버리지는 90에 머뭅니다. 하락한 뒤에는 더 작아진 금액에 2배가 적용되기 때문입니다. 이 예시는 각 변동이 하루에 일어났다고 가정한 값입니다.",
};
```

### 3-6. FAQ 추가 (`{ question, answer }`)

1. 코스피가 -20% 떨어졌다가 +25% 오르면 레버리지 ETF는 본전인가요? — 하루씩이면 -10%, 10일 분할이면 약 -0.99% (보수 제외 시뮬레이션) 2~3문장.
2. 레버리지 ETF가 반토막 나면 지수가 몇 % 올라야 회복되나요? — ETF는 +100% 필요, 지수는 경로에 따라 다름(하루 반등 가정 시 +50%) 설명.
3. 급락이 하루에 오는 것과 며칠에 걸쳐 오는 것은 차이가 있나요? — 비교표 -20% 1일 0.6000 vs 10일 0.6367 인용, "분할이면 안전"이 아님 명시.

기존 "현금 3천만원…" FAQ는 3-4 결과에 맞춰 시제 수정.

## 4. JS 설계 (`public/scripts/kospi-leverage-etf-calculator.js`)

### 4-1. 경로 빌더

```js
function splitDaily(totalReturn, days) {
  return Array(days).fill(Math.pow(1 + totalReturn, 1 / days) - 1);
}

function buildPath(builder, s) {
  if (builder === "crashRebound") {
    const drop = -s.dropPct / 100;
    const rebound = s.reboundMode === "auto" ? 1 / (1 + drop) - 1 : s.reboundPct / 100;
    return {
      returns: [...splitDaily(drop, s.dropDays), ...splitDaily(rebound, s.reboundDays)],
      segments: [{ label: "하락", days: s.dropDays }, { label: "반등", days: s.reboundDays }],
      reboundApplied: rebound,
    };
  }
  if (builder === "alternating") {
    const a = s.altAmpPct / 100;
    const returns = [];
    for (let i = 0; i < s.altCycles; i++) returns.push(a, -a);
    return { returns, segments: [{ label: "반복", days: returns.length }] };
  }
  return null;
}
```

`getScenario(id)`는 빌더형이면 `{ ...meta, dailyIndexReturns: built.returns, segments }` 반환. 이후 `calculateLeverage`·`renderPathTable` 변경 없이 동작.

### 4-2. 지수 기준 회복 필요 상승률

```js
// 레버리지 누적 가치 L에서 원금 1로 돌아가기 위해, d일 균등 반등을 가정할 때 필요한 지수 총 상승률 T
function indexRecoveryNeeded(L, multiple, days) {
  if (L >= 1) return 0;
  if (L <= 0) return null;
  const target = 1 / L;
  const lev = (T) => Math.pow(1 + multiple * (Math.pow(1 + T, 1 / days) - 1), days);
  let lo = 0, hi = 10;                       // 0% ~ 1000%
  if (lev(hi) < target) return null;         // 범위 초과
  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2;
    if (lev(mid) >= target) hi = mid; else lo = mid;
    if (hi - lo < 1e-9) break;
  }
  return hi;
}
```

- 결과 화면 `recoveryNote` 아래 `[data-result="indexRecoveryNote"]`: "코스피200 기준으로는 {days}거래일에 걸쳐 고르게 오른다고 가정할 때 약 {T}% 상승이 필요합니다." `days`는 빌더형이면 하락 기간, 정적 시나리오면 1(하루 가정)로 표기 분기.
- 보수는 이 역산에 반영하지 않음(문구에 "운용보수 제외" 명시).

### 4-3. 입력 패널

`klc-path-panel`(빌더형 선택 시에만 `hidden` 해제):

| 필드 | id | 비고 |
|---|---|---|
| 하락률(%) | `klc-drop` | 기본 20 |
| 하락 기간(거래일) | `klc-drop-days` | 기본 1 |
| 반등 방식 | `klc-rebound-mode` (라디오: 원점 회복 / 직접 입력) | auto면 반등률 필드 비활성 + 계산값 표시("+25.00%") |
| 반등률(%) | `klc-rebound` | |
| 반등 기간(거래일) | `klc-rebound-days` | 기본 1 |
| 반복 폭(%) | `klc-alt-amp` | alternating만 |
| 반복 횟수 | `klc-alt-cycles` | alternating만 |

빠른 칩: `-10% → 원점`, `-20% → 원점`, `-30% → 원점`, `10일 분할로 보기`(하락·반등 기간 10 세팅).

### 4-4. 검증·경계

| 조건 | 처리 |
|---|---|
| 하루 하락률 × 배율 ≥ 100% (일별 분할 후 기준) | 결과 카드 "-", 경고 `[data-result="wipeoutWarning"]` "하루 변동이 커서 상품 가치가 0이 되는 구간입니다(실제 상품은 거래소 조치 등으로 다를 수 있음)" |
| 기간 0·소수·60 초과 | 1~60 정수로 보정 후 필드 반영 |
| dropPct ≥ 100 | 95로 보정 |
| 배율 1 | 지수와 동일(회귀 확인용) |
| 일수 합계 > 252 | 발생 불가(60+60), 보수 차감 계산은 그대로 |

### 4-5. URL 상태

- 빌더형일 때만 `drop`, `dd`, `rm`(auto/manual), `reb`, `rd`, `amp`, `n` 기록. 정적 시나리오로 바꾸면 해당 키를 제거한다.
- 현재 `url-state.js`의 `writeParams(map)`은 `params.set(key, String(value))`만 해서 키를 지울 수 없다(2026-10-27 확인). `url-state.js`에 `deleteParams(keys)` export를 **추가**한다(기존 함수 시그니처 불변, 다른 계산기 영향 없음):

```js
export function deleteParams(keys) {
  const params = new URLSearchParams(window.location.search);
  keys.forEach((k) => params.delete(k));
  const qs = params.toString();
  history.replaceState(null, "", qs ? `${window.location.pathname}?${qs}` : window.location.pathname);
}
```
- 기존 URL(`?scenario=sideways&principal=1000…`) 결과 동일 유지.

### 4-6. 경로 표

- 열: 구분(하락/반등/반복) | 일차 | 코스피200 누적 | 레버리지 누적.
- 행 > 20: 앞 5행·뒤 5행 + `<button data-klc-path-toggle>전체 {n}일 보기</button>`.

## 5. 페이지 마크업 변경 (`kospi-leverage-etf-calculator.astro`)

1. Hero description: "코스피200이 -20% 떨어졌다가 +25% 올라 원점이 돼도, 2배 레버리지는 -10%일 수 있습니다. 투자금과 시장 흐름을 넣어 직접 확인해보세요."
2. 시나리오 그리드: `KLC_SCENARIO_ORDER` 순 렌더.
3. 그리드 아래 `klc-path-panel` 추가.
4. 결과 패널: `indexRecoveryNote`, `wipeoutWarning` 노드 추가.
5. **원금 회복 비교표 섹션(신규)** — `<section class="klc-recovery">` 경로 표 위에 배치, SSR 계산.

```astro
<table class="klc-recovery__table">
  <caption>2배 레버리지·운용보수 0% 기준 시뮬레이션</caption>
  <thead><tr><th>코스피200 하락</th><th>하락 기간</th><th>레버리지 가치</th><th>레버리지 회복 필요</th><th>코스피200 회복 필요</th></tr></thead>
  <tbody>{recoveryRows.map((r) => (<tr>…</tr>))}</tbody>
</table>
<p>같은 하락이라도 일반 코스피200은 -10% → +11.11%, -20% → +25.00%, -30% → +42.86%만 오르면 회복됩니다.</p>
```

`recoveryRows`는 frontmatter에서 TS로 계산(JS와 같은 산식 — 빌드 계산 함수는 `src/utils/kospiLeverageEtfCalculator.ts` 신규 파일에 두고, 클라이언트 JS는 별도 구현이므로 8장 기대값으로 양쪽 일치 검증).

6. 메커니즘 섹션: 기존 표 아래 `KLC_MECHANISM_CRASH` 표 추가.
7. 규제 섹션: status 배지 `완료/예정/확인 중`.
8. `SeoContent` intro: 기획서 7장 4단락으로 교체(기존 intro와 비교해 문장 재사용 가능 부분 유지), FAQ 11, related 4.

## 6. SCSS

- 기존 `_kospi-leverage-etf-calculator.scss`에 `.klc-path-panel`, `.klc-recovery`, `.klc-warning` 추가.
- 비교표 ≤480px: 하락폭(-10/-20/-30) 그룹별 카드로 전환(`tbody` 행 2개씩 묶음 → `data-group` 속성 기준 스타일), 가로 스크롤 없음.
- 경고 박스 색은 기존 InfoNotice 경고 톤 재사용.

## 7. SEO·등록

- `KLC_META.seoTitle`·`seoDescription` 변경, `updatedAt` 배포일. JSON-LD는 기존 구성 유지(FAQ 자동 반영).
- `tools.ts` description: "급락 후 반등, 등락 반복 등 시장 흐름을 직접 설정해 코스피200과 2배 레버리지 ETF 손익, 원금 회복 필요 상승률을 비교합니다."
- `topicBySlug` 변경 없음. sitemap lastmod 갱신. OG 재생성(TOOLS 배열 항목 문구 갱신).

## 8. 내부 링크

| 대상 | 위치 |
|---|---|
| `/reports/kospi-october-crash-2026/` | Hero 아래 맥락 박스 "2026년 10월 실제 코스피 흐름 보기" (페이지 존재 시) |
| `/tools/stock-loss-recovery-calculator/` | 원금 회복 비교표 하단 "일반 주식 손실 복구 계산" (페이지 존재 시) |
| `/reports/kospi-sidecar-record-2026/` | related, 라벨 "코스피 사이드카 2026 리포트" |
| `/tools/dca-investment-calculator/` | related 유지 |

`etf-distribution-tax-calculator`는 related에서 제외(4개 제한) — 본문 FAQ "세금" 언급 시 인라인 링크로 유지 검토.

## 9. 검증 사례와 완료 기준

### 9-1. 시나리오 결과 (배율 2, 보수 0%로 설정 후 확인)

| # | 설정 | 지수 누적 | 레버리지(보수 전) | 단순 2배 | 차이 |
|---|---|---:|---:|---:|---:|
| C1 | alternating amp 10, n 1 | −1.00% | −4.00% | −2.00% | −2.00%p |
| C2 | alternating amp 10, n 2 | −1.99% | −7.84% | −3.98% | −3.86%p |
| C3 | crashRebound drop 20/1일, auto/1일 | 0.00% | −10.00% | 0.00% | −10.00%p |
| C4 | crashRebound drop 20/10일, auto/10일 | 0.00% | −0.99% | 0.00% | −0.99%p |
| C5 | drop 30/1일, auto/1일 | 0.00% | −25.71% | 0.00% | −25.71%p |
| C6 | drop 30/10일, auto/10일 | 0.00% | −2.52% | 0.00% | −2.52%p |
| C7 | drop 10/1일, auto/1일 | 0.00% | −2.22% | 0.00% | −2.22%p |
| C8 | sideways (기존) | 0.00% | −5.36% | 0.00% | −5.36%p (회귀 기준) |
| C9 | uptrend (기존) | +21.90% | +48.02% | +43.80% | +4.22%p |
| C10 | drop 60/1일 | — | — | — | wipeout 경고 |
| C11 | 배율 1, drop 20/1일 auto | 0.00% | 0.00% | 0.00% | 0 |

auto 반등률 표시: drop 10 → +11.11%, 20 → +25.00%, 30 → +42.86%.

### 9-2. 원금 회복 비교표 (SSR)

| 하락 | 기간 | 레버리지 가치 | 레버리지 회복 필요 | 지수 회복 필요 |
|---|---|---:|---:|---:|
| −10% | 1일 | 0.8000 | +25.00% | +12.50% |
| −10% | 10일 | 0.8091 | +23.60% | +11.24% |
| −20% | 1일 | 0.6000 | +66.67% | +33.33% |
| −20% | 10일 | 0.6367 | +57.05% | +25.64% |
| −30% | 1일 | 0.4000 | +150.00% | +75.00% |
| −30% | 10일 | 0.4836 | +106.79% | +44.75% |

C3 상태에서 `indexRecoveryNote`: 레버리지 −10% → ETF +11.11% 필요, 지수(1일 가정) +5.56% 필요.

### 9-3. QA 체크리스트

- [ ] C1~C11, 비교표 값 일치(소수 둘째 자리)
- [ ] 기존 4개 시나리오·기존 URL 결과 불변, `previewStats` −5.36%p 유지
- [ ] 빌더형 ↔ 정적 시나리오 전환 시 패널 표시/숨김, URL 키 정리
- [ ] 경로 표 접힘 동작(20행 초과)
- [ ] 규제 타임라인 상태·FAQ 시제 일치, 출처 확인일 갱신
- [ ] "반등장엔 레버리지" 등 권유 문구 없음
- [ ] 320/375/768px 가로 스크롤 없음

### 9-4. 구현 순서

1. 데이터 파일 타입·메타·FAQ·타임라인 → 2. `src/utils/kospiLeverageEtfCalculator.ts`(SSR 비교표) → 3. Astro 마크업 → 4. JS 빌더·역산·URL·표 접힘 → 5. SCSS → 6. tools.ts·sitemap·OG → 7. 검증

### 완료 조건

```bash
npm run check:all
npm run build
```

둘 다 성공해야 한다. **이 설계서 작성 시점에는 구현·실행하지 않았다.**

## 구현 기록 · 2026-10-27

- 변경 파일: `src/data/kospiLeverageEtfCalculator.ts`, `src/utils/kospiLeverageEtfCalculator.ts`(신규), `src/pages/tools/kospi-leverage-etf-calculator.astro`, `public/scripts/kospi-leverage-etf-calculator.js`, `src/styles/scss/pages/_kospi-leverage-etf-calculator.scss`, `src/data/tools.ts`, `scripts/generate-og-tools.py`, `public/og/tools/kospi-leverage-etf-calculator.png`(신규)
- 설계 대비 변경·추가:
  - `deleteParams`는 손실 복구 계산기 작업에서 이미 추가됨. 운영 4시간 캐시 문제 때문에 `url-state.js?v=20261027`로 import하고 페이지 스크립트 태그에도 버전 쿼리를 붙임.
  - 기존 버그 수정: URL의 `principal`을 만원 단위로 쓰고 원 단위로 읽어 공유 링크가 0원으로 열리던 문제.
  - 분할 경로의 부동소수 오차로 "-0.00%"가 보이던 표시를 반올림 후 부호 판단으로 수정.
  - 기존에 `ogImage`로 지정만 되고 파일이 없던 OG 이미지를 새로 생성.
  - 규제 타임라인: 7/31 예탁금 3천만원 조기 시행, 8/19 대용증권 불인정·괴리율 2%를 `완료`로, 11월 매매단위 확대는 `확인 중`으로 표기(언론 보도 기준, 금융위 후속 공식 자료는 재확인 권장).
- 검증: C1~C11, 원금 회복 비교표 6행이 9-1·9-2 기대값과 일치(C9 차이는 +4.23%p로 설계서 4.22는 반올림 오기). 기존 sideways −5.36% 유지, 375px 가로 스크롤 없음, 60일 경로 접힘·펼침, URL 복원 확인.
