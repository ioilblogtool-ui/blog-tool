# AI 투자 둔화 2026 — 한국 반도체·코스피 영향 리포트 설계 문서

> 기획 원문: [ai-capex-slowdown-korea-semiconductor-2026.md](../../plan/202610/ai-capex-slowdown-korea-semiconductor-2026.md)
> 작성일: 2026-10-27 (한국시간)
> 문서 상태: **설계 작성 완료 / 구현·검증·배포 미착수**
> 수치 기준: 기획서의 2026-10-27 확인값. 한은 국정감사 서면답변 원문, 3분기 GDP 속보 원문, 빅테크 capex IR 원자료는 구현 직전 확보한다.

## 1. 개요와 결정

| 항목 | 결정 |
|---|---|
| slug / URL | `ai-capex-slowdown-korea-semiconductor-2026` / `/reports/ai-capex-slowdown-korea-semiconductor-2026/` |
| 유형 / 카테고리 | report / asset |
| 레이아웃 | `BaseLayout` 직접 사용 |
| prefix | `ACS_` / `acs-` |
| 데이터 | `src/data/aiCapexSlowdownKoreaSemiconductor2026.ts` |
| 유틸 | `src/utils/aiCapexSlowdownKoreaSemiconductor2026.ts` (검증·시뮬레이션·화면 모델) |
| 클라이언트 JS | `public/scripts/ai-capex-slowdown-korea-semiconductor-2026.js` — 시나리오 탭 전환만(값은 빌드 시 계산) |
| 차트 | 없음. 정적 CSS 막대 + SVG 인라인 전달 경로 도식 |
| 삼성·마이크론 실적 | `src/data/samsungMicronEarnings2026.ts`의 `SME_RECORDS`·`SME_SOURCES`를 import해 재사용(이중 입력 금지) |
| 배지 | 공식 / 참고 / 시뮬레이션 / 추정 |
| Title | `AI 투자 둔화 2026 \| 한국 반도체·코스피 얼마나 타격받나` |
| Description | 기획서 문구 |
| OG | `public/og/reports/ai-capex-slowdown-korea-semiconductor-2026.png` |

### 원문 확보 상태에 따른 렌더링 분기 (핵심 결정)

| 데이터 | 원문 확보 시 | 미확보 시 |
|---|---|---|
| 한은 비관 시나리오 수출 감소(500억~1,000억 달러) | `공식`, 출처 = 한은 답변서 | `참고`, 출처 = 보도(헤럴드경제) + "한국은행 국정감사 서면답변 보도 인용" 주석 |
| 성장률 −0.4%p | `공식` | `참고`, "로이터 보도 인용(원문 미확인)" 주석 |
| 둔화 시나리오 성장률 −0.2%p(우리 선형 계산) | 한은이 하단값별 성장률을 제시했으면 그 값(`공식`), 아니면 `시뮬레이션`으로 노출 | **비노출**("원문 확인 후 제공") |
| 3분기 GDP 성장률 | 한은 보도자료 값 `공식` | "8월 전망(0.3%)을 크게 웃돔" 서술만, 수치 비노출 |

분기는 데이터 필드 `confirmed: boolean`으로 제어하고, 유틸이 배지·주석·노출 여부를 결정한다.

## 2. 파일 구조와 책임

| 파일 | 작업 | 책임 |
|---|---|---|
| `src/data/aiCapexSlowdownKoreaSemiconductor2026.ts` | 신규 | 메타·출처·지표·시나리오·capex 표·노출 비교·반대 근거·체크리스트·FAQ·intro·관련 링크 |
| `src/utils/aiCapexSlowdownKoreaSemiconductor2026.ts` | 신규 | `validateAcsData`, `shareOf`, `monthsOfExports`, `linearGdp`, `buildAcsView` |
| `src/pages/reports/ai-capex-slowdown-korea-semiconductor-2026.astro` | 신규 | 렌더링, JSON-LD, config 주입 |
| `public/scripts/ai-capex-slowdown-korea-semiconductor-2026.js` | 신규 | 시나리오 탭, URL `?sc=` |
| `src/styles/scss/pages/_ai-capex-slowdown-korea-semiconductor-2026.scss` | 신규 | `acs-` |
| 등록 5곳 + OG | 수정 | 8장 |

## 3. 데이터 설계

### 3-1. 타입

```ts
export type Badge = "공식" | "참고" | "시뮬레이션" | "추정";

export type AcsSource = { id: string; org: string; title: string; url: string | null;
  publishedAt: string; period: string; checkedAt: string; isPrimary: boolean };

export type AcsMetric = {
  id: string; label: string; value: number | null; unit: "억 달러" | "%" | "%p" | "조 원" | "개월";
  period: string; badge: Badge; sourceIds: string[];
  confirmed: boolean;               // 1차 원문으로 확인했는가
  derivedFrom?: string[];           // 시뮬레이션이면 입력 metric id
  note?: string;
};

export type AcsScenario = {
  id: "base" | "slow" | "bear";
  label: string;                    // 기준 / 둔화 / 비관
  definition: string;
  exportDeltaUsd100m: number;       // 억 달러 단위: 0 / -500 / -1000
  gdpDeltaPp: number | null;
  gdpConfirmed: boolean;
  assumptions: string[];            // "한국산 반도체 단가 10% 하락", "물량 증가세 둔화"
  badge: Badge;
  sourceIds: string[];
};

export type AcsCapexRow = { company: string; fiscalBasis: string;
  guidanceLowUsdBn: number | null; guidanceHighUsdBn: number | null;
  announcedAt: string | null; badge: Badge; sourceId: string; note?: string };

export type AcsExposure = { company: "삼성전자" | "SK하이닉스"; facts: { text: string; badge: Badge; sourceIds: string[] }[] };
```

**단위 규칙:** 수출 관련 금액은 모두 `억 달러`로 통일 저장(603.0, 1209.4, −500, −1000). capex만 `십억 달러(bn)` 단위로 필드명에 `UsdBn`을 붙여 구분한다.

### 3-2. 초기 데이터

`ACS_METRICS`:

| id | label | value | unit | badge | confirmed | sourceIds |
|---|---|---:|---|---|---|---|
| `exp-total-sep` | 9월 총수출 | 1209.4 | 억 달러 | 공식 | true | `motir-2026-09` |
| `exp-semi-sep` | 9월 반도체 수출 | 603.0 | 억 달러 | 공식 | true | `motir-2026-09` |
| `exp-semi-yoy-sep` | 9월 반도체 수출 증가율 | 263 | % | 공식 | true | `motir-2026-09` (매체 262.8% — 원문 표 소수점 확인) |
| `exp-total-ytd` | 1~9월 누적 수출 | 8145 | 억 달러 | 공식 | true | `motir-2026-09` |
| `semi-share-sep` | 반도체 수출 비중 | 계산 | % | 시뮬레이션 | — | derived: exp-semi-sep / exp-total-sep |
| `gdp-q3` | 3분기 실질 GDP(전기 대비) | null | % | 공식 | false | `bok-gdp-q3` (원문 확보 후 값) |
| `semi-gdp-contrib` | 반도체 성장 기여 | null(서술) | — | 참고 | false | `herald-1027` |
| `base-rate` | 기준금리 | 3.00 | % | 공식 | true | `bok-mpc-1022` |
| `kospi-top2-share` | 삼성전자+SK하이닉스 코스피 시총 비중 | null | % | 시뮬레이션 | false | `krx-mcap` (구현 시 KRX 시가총액으로 계산, 기준일 명시) |
| `bigtech-bond` | 빅테크 5사 1~9월 회사채 발행 | 2300 | 억 달러 | 공식 | false | `bok-ai-funding` (보도 인용 상태) |

`ACS_SCENARIOS`:

| id | exportDelta(억 달러) | gdpDeltaPp | gdpConfirmed | badge |
|---|---:|---:|---|---|
| base | 0 | 0 | true | 공식(한은 기본 전망 — 11월 경제전망 발표 시 기본 전망 수치 함께 기재) |
| slow | −500 | −0.2 | false | 시뮬레이션 (수출 감소는 한은 범위 하단, 성장률은 선형 계산) |
| bear | −1000 | −0.4 | false | 참고 → 원문 확인 시 공식 |

`ACS_CAPEX`: 아마존, 알파벳, 메타, 마이크로소프트 4행. 값은 **각사 3분기 실적 발표(10월 말~11월 초) 가이던스로 채운다.** 현재 기획서의 합계 7,200억~7,600억 달러는 `참고` 요약 문장으로만 사용하고 표 셀은 IR 원자료 확보 전 `null`("발표 확인 중"). 마이크로소프트는 `fiscalBasis: "회계연도(6월 결산)"` 주석.

`ACS_EXPOSURE`: 기존 `SME_RECORDS`에서 삼성 Q3 잠정 매출·영업이익(공식)을 가져오고, 사업 구조 서술(메모리·파운드리·MX 다각화 / 메모리 집중·HBM)은 각사 공식 사업보고서·IR 문장만 사용. SK하이닉스 Q3 실적(10/28 발표)은 발표 후 추가. "어디가 더 타격" 우열 문장 금지.

`ACS_COUNTER_EVIDENCE` (반대 근거, 균형 섹션):
1. 빅테크 2026 capex는 증가 가이던스(참고 → IR 확인 후 공식)
2. 한은 "HBM 생산으로 2027년 물량 증가세 확대" 전망(참고, 헤럴드경제 보도)
3. 한은 보고서 "AI발 금융위기 임박 아님, 다만 장기금리 상승기 취약성 누적"(공식 보고서 — 원문 링크 확보)

`ACS_CHECKLIST`: 빅테크 capex 가이던스, DRAM·NAND 고정거래가격, 월간 반도체 수출(매월 1일), 빅테크 회사채 스프레드, 외국인 반도체 수급.

`ACS_SOURCES`: `motir-2026-09`(isPrimary), `bok-gdp-q3`(isPrimary, url 확보 필요), `bok-mpc-1022`(isPrimary), `bok-ai-funding`(isPrimary, url 확보 필요), `bok-audit-answer`(isPrimary, url null — 국회 제출 자료), `herald-1027`, `indexbox-reuters`, `sedaily-bok`, `krx-mcap` + SME 출처 import.

### 3-3. 콘텐츠

- `ACS_SEO_INTRO`: 기획서 7장 4단락(각 150자 이상). 수치는 화면 모델 값 조합.
- `ACS_FAQ`: 6개. 5번(삼성 vs 하이닉스)은 사업 구조 차이 설명 + "단정할 수 없다", 6번(성과급)은 영업이익 연동 구조 설명 + 성과급 계산기 링크.
- `ACS_RELATED`: 4개(8장).

## 4. 계산·검증·화면 모델

### 4-1. 함수 계약

| 함수 | 산식·역할 |
|---|---|
| `validateAcsData()` | sourceId 존재, `confirmed=false`인 metric이 `공식` 배지로 렌더되지 않게 강제 변환, 시나리오 순서 base→slow→bear, 단위 필드 일관. 실패 시 throw |
| `shareOf(part, total)` | `part / total` — 603.0 / 1209.4 = 49.86% → 표시 49.9% |
| `monthsOfExports(delta, monthly)` | `abs(delta) / monthly` — 500/603.0 = 0.83개월, 1000/603.0 = 1.66개월 |
| `linearGdp(bearPp, bearDelta, delta)` | `bearPp × delta / bearDelta` — −0.4 × 500/1000 = −0.2 |
| `resolveBadge(metric)` | `confirmed=false` & 배지 공식 → 참고로 강등 + 주석 |
| `buildAcsView()` | KPI 4개, 시나리오 3개(값·배지·주석·노출 여부), 노출 비교, 반대 근거, 출처 표 |

### 4-2. 기대값

| 지표 | 기대값 | 배지 |
|---|---|---|
| 반도체 수출 비중(9월) | 49.9% | 시뮬레이션 |
| 비관 시나리오 감소액의 9월 반도체 수출 환산 | 1.66개월분 | 시뮬레이션 |
| 둔화 시나리오 환산 | 0.83개월분 | 시뮬레이션 |
| 둔화 시나리오 성장률(선형) | −0.2%p | 시뮬레이션, `gdpConfirmed=false`면 비노출 |

- 9월은 분기말 효과가 있으므로 환산 기준 문구 "2026년 9월 한 달 반도체 수출(603.0억 달러) 기준"을 반드시 붙인다. 1~9월 누적 반도체 수출 원값을 확보하면 월평균 기준 환산을 보조로 추가.

### 4-3. 화면 모델

```ts
type AcsView = {
  kpis: { label: string; value: string; badge: Badge; note?: string }[];
  scenarios: Record<"base" | "slow" | "bear", {
    label: string; exportText: string; monthsText: string | null;
    gdpText: string | null; badge: Badge; footnotes: string[] }>;
  defaultScenario: "bear";
};
```

기본 탭은 `bear`(핵심 질문에 직접 답). 탭 전환 시 JS는 `scenarios[id]` 문자열만 교체.

## 5. 페이지 섹션·Astro 구성

1. `CalculatorHero` eyebrow "반도체·거시 리포트", H1 "AI 투자가 줄면 한국 반도체와 코스피는 얼마나 흔들릴까"
2. `InfoNotice`: "한국은행 시나리오는 '둔화가 일어난다면'의 가정입니다", "우리가 추가 계산한 값은 시뮬레이션으로 표시합니다", "특정 종목 투자 권유가 아닙니다"
3. 의존도 KPI 4개 — 반도체 비중 49.9%, 9월 반도체 수출 603.0억 달러, 3분기 성장 기여(서술형 카드 "약 절반, 한은 설명"), 코스피 시총 비중(KRX 계산 후, 미확보 시 카드 숨김)
4. 전달 경로 도식 — 인라인 SVG 6단계(빅테크 capex → GPU·가속기 → HBM·DRAM 수요·가격 → 삼성·SK하이닉스 실적 → 수출·성장률 → 코스피·성과급). 모바일은 세로 배치(viewBox 두 벌 또는 CSS flex 카드로 대체)
5. 빅테크 capex 표 — `ACS_CAPEX`, null 셀 "발표 확인 중"
6. 한은 시나리오 탭(`role="tablist"`) — 수출 변화, 월 환산, 성장률, 가정 목록, 배지·각주
7. 기업별 노출 — 삼성(SME 재사용 수치) / SK하이닉스(10/28 발표 후) 2열 카드, 상세는 실적·HBM 리포트 링크
8. 반대 근거 3개 카드 — "그럼에도 아직 단정할 수 없는 이유"
9. 체크리스트 5개
10. 성과급 CTA — 반도체 성과급 비교 계산기
11. `SeoContent` intro 4·criteria(배지 기준 4줄)·FAQ 6·related 4
12. 출처 표(기관·자료명·URL·발표일·기준기간, 1차 자료 우선 정렬)

```astro
<section class="acs-section acs-scenario" aria-labelledby="acs-sc-title">
  <h2 id="acs-sc-title">한국은행 시나리오로 본 수출·성장률 영향</h2>
  <div role="tablist" class="acs-scenario__tabs">
    {(["base","slow","bear"] as const).map((id) => (
      <button type="button" role="tab" data-acs-sc={id}
        aria-selected={id === view.defaultScenario ? "true" : "false"}>{view.scenarios[id].label}</button>
    ))}
  </div>
  <dl class="acs-scenario__result">
    <dt>반도체 수출(기본 전망 대비)</dt><dd data-acs-out="exportText">{view.scenarios.bear.exportText}</dd>
    <dt>9월 반도체 수출 환산</dt><dd data-acs-out="monthsText">{view.scenarios.bear.monthsText}</dd>
    <dt>경제성장률</dt><dd data-acs-out="gdpText">{view.scenarios.bear.gdpText ?? "원문 확인 후 제공"}</dd>
  </dl>
  <ul class="acs-scenario__notes" data-acs-out="footnotes">…</ul>
</section>
<script id="acsConfig" type="application/json" set:html={JSON.stringify(view.scenarios)}></script>
```

## 6. JS·SCSS

- JS: 탭 클릭 → `[data-acs-out]` 교체, `aria-selected`, `writeParams({ sc })`, 로드 시 `readParam("sc","bear")`. 그 외 로직 없음.
- SCSS: `acs-` prefix, 중첩 3단계, 시나리오 막대 3색 중립 톤(비관=경고 톤 1개만), ≤480px KPI 2×2·노출 카드 1열·capex 표 카드형. SVG 텍스트 최소 12px.

## 7. 단일 출처·갱신

- 삼성·마이크론 수치: `SME_RECORDS` import. 삼성 확정실적(10/29) 반영은 SME 데이터에 새 revision으로 추가되면 본 페이지 자동 반영.
- SK하이닉스 Q3: 별도 리포트(`sk-hynix-earnings-ps-outlook-2026`) 갱신 여부와 별개로 본 페이지 `ACS_EXPOSURE`에 공식 수치 1행 추가.
- 갱신 트리거(기획서): 한은 11월 경제전망(기준 시나리오 수치 교체), 빅테크 실적(capex 표), 매월 1일 수출입 동향(KPI 월 교체 — 비중·환산 기준월 문구 함께 변경), 한은 원문 확보(`confirmed=true`).

## 8. SEO·내부 링크·등록

### 메타·JSON-LD

Article(headline=H1, dateModified=updatedAt) + FAQPage + BreadcrumbList.

### 내부 링크

| 대상 | 위치 |
|---|---|
| `/reports/samsung-micron-earnings-2026/` | 기업별 노출 섹션 |
| `/reports/hbm4-vs-hbm5-beneficiary-comparison/` | 전달 경로 도식 하단 |
| `/reports/semiconductor-stocks-forecast-2026-2028/` | 시나리오 섹션 하단 |
| `/tools/semiconductor-bonus-comparison/` | 성과급 CTA, FAQ 6 |

보조(본문 인라인): `/reports/ai-datacenter-infra-beneficiaries-2026/`, `/reports/kospi-october-crash-2026/`(페이지 존재 시).

**정정(구현 시 확인):** `samsung-micron-earnings-2026`는 `src/data/reports.ts`에 `SME_META.slug`로 등록돼 있다. 설계 당시 문자열 검색으로 놓친 것이며 별도 조치는 필요 없다.

### 등록 스케치

```ts
// src/data/reports.ts
{
  slug: "ai-capex-slowdown-korea-semiconductor-2026",
  title: "AI 투자 둔화 2026 | 한국 반도체·코스피 얼마나 타격받나",
  description: "미국 빅테크가 AI 데이터센터 투자를 줄이면 한국 반도체 수출과 성장률은 얼마나 줄까요? 한국은행 시나리오와 공식 수출 통계로 삼성전자·SK하이닉스 영향 경로를 정리했습니다.",
  order: /* 최댓값 다음 */,
  badges: ["신규", "반도체", "AI", "한국은행"],
},
// src/pages/reports/index.astro
"ai-capex-slowdown-korea-semiconductor-2026": {
  eyebrow: "반도체·거시 리포트",
  tags: [{ label: "AI 투자", mod: "asset" }, { label: "반도체 수출", mod: "asset" }, { label: "한국은행", mod: "asset" }],
  category: "asset",
  isNew: true,
},
// src/pages/index.astro
"ai-capex-slowdown-korea-semiconductor-2026": { category: "asset", isNew: true },
```

```python
{"slug": "ai-capex-slowdown-korea-semiconductor-2026", "title": "AI 투자 둔화와 한국 반도체", "description": "한국은행 시나리오와 수출 통계로 본 반도체·코스피 영향 경로", "eyebrow": "자산 리포트", "stats": [("반도체 수출 비중", "49.9% · 2026.9"), ("한은 비관 시나리오", "수출 500억~1,000억$↓")]},
```

sitemap `changefreq monthly`, `priority 0.7`.

## 9. 검증과 완료 기준

### 배포 게이트

- `ACS_CAPEX` 4행 중 최소 3행이 IR 원자료로 채워짐(아니면 capex 표 대신 `참고` 요약 문장만 노출하도록 유틸이 자동 전환 — 표가 비어 보이지 않게).
- `confirmed=false` metric이 `공식` 배지로 렌더되지 않음(유틸 강제 + 화면 확인).
- `gdpConfirmed=false`인 둔화 시나리오 성장률 비노출.

### QA 체크리스트

- [ ] 4-2 기대값 화면 일치(49.9%, 0.83/1.66개월, −0.2%p 노출 조건)
- [ ] 모든 수치에 배지, 보도 인용 수치에 출처 주석
- [ ] "AI 버블 확정", "반도체 고점", "폭락 불가피", 종목 매수·매도 권유 표현 없음
- [ ] 삼성 수치가 `samsung-micron-earnings-2026` 페이지와 동일
- [ ] 시나리오 탭·URL `?sc=` 복원, JS 없이 기본(비관) 내용 노출
- [ ] SVG 도식 모바일 가독성(320px)
- [ ] 내부 링크 4개 동작, FAQ 6·intro 4단락 기준

### 구현 순서

1. 원문 확보(한은 답변서·GDP 속보·AI 자금조달 보고서, 산업부 원문 표, 빅테크 IR, KRX 시총) → `confirmed` 갱신
2. 데이터·유틸·검증 → 3. Astro·SVG → 4. JS·SCSS → 5. 등록 5곳·OG → 6. 검증

### 완료 조건

```bash
npm run check:all
npm run build
```

둘 다 성공해야 한다. **이 설계서 작성 시점에는 구현·실행하지 않았다.**

## 구현 기록 · 2026-10-28

- 신규 파일: `src/data/aiCapexSlowdownKoreaSemiconductor2026.ts`, `src/utils/aiCapexSlowdownKoreaSemiconductor2026.ts`, `src/pages/reports/ai-capex-slowdown-korea-semiconductor-2026.astro`, `public/scripts/ai-capex-slowdown-korea-semiconductor-2026.js`, `src/styles/scss/pages/_ai-capex-slowdown-korea-semiconductor-2026.scss`, `public/og/reports/ai-capex-slowdown-korea-semiconductor-2026.png`
- 등록: `src/data/reports.ts`(order 95), 홈·리포트 허브 메타, `app.scss`, `sitemap.xml`, OG 스크립트
- 데이터 결정:
  - 3분기 GDP는 한국은행 보도자료 원문 대신 2026-10-27 보도(전기 대비 1.0%)로 반영, `confirmed=false` → 화면 배지 `참고`.
  - 한국은행 비관 시나리오(수출 −500억~−1,000억 달러, 단가 −10%, 성장률 약 −0.4%p)는 원문 미확보 → 비관 시나리오 배지 `참고`, 둔화 시나리오 성장률(−0.2%p, 선형 계산)은 비노출.
  - 빅테크 설비투자는 각사 IR이 아니라 집계 자료(datacentres.com 등) 기준 `참고`. 3분기 실적(10월 말) 발표 후 갱신 필요. 배포 게이트(IR 3행 이상)는 아직 충족하지 않음.
  - 삼성전자 출처(`samsung-kr`, `samsung-hbm4`, `samsung-hbm4e`)는 `SME_SOURCES`에서 가져와 단일 출처 유지.
  - 코스피 시총 비중 KPI는 KRX 원자료가 없어 "외국인 삼전닉스 순매도 약 14조 원(참고)"으로 대체.
- 검증: 49.9%, 0.83/1.66개월, 시나리오 탭 3개·배지·각주 전환, `?sc=` 복원, 375px 가로 스크롤 없음, 콘솔 오류 없음.
