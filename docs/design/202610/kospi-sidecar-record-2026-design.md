# 코스피 사이드카 2026 리포트 갱신 — 설계 문서

> 기획 원문: [kospi-sidecar-record-2026.md](../../plan/202610/kospi-sidecar-record-2026.md)
> 작성일: 2026-10-27 (한국시간)
> 문서 상태: **갱신 설계 작성 완료 / 구현·검증·배포 미착수**
> 수치 기준: 기획서의 2026-10-27 재구성값(코스피 누적 53회 잠정). KRX 시장조치 공지 대조 전 배포 금지.

## 1. 개요와 결정

| 항목 | 결정 |
|---|---|
| slug / URL | `kospi-sidecar-record-2026` 유지 (canonical·URL 변경 없음) |
| 작업 범위 | 데이터 파일 갱신 + 섹션 3개 추가(누적 추이, 10월 기록, 집계 기준 안내) + 2026 서킷브레이커 기록 + Title/Description/H1 변경 + 하드코딩 문구 제거 |
| 레이아웃 | 기존 `BaseLayout` + `op-section` 구조 유지 |
| prefix | 기존 `KSR_` / `ksr-` 유지 |
| 클라이언트 JS | 추가하지 않음. 누적 추이는 정적 CSS 스택 막대(Chart.js 불필요) |
| Title | `코스피 사이드카 2026 \| 폭락·반등 때 왜 발동되나` |
| H1 (`KSR_META.title`) | `코스피 사이드카 2026, 폭락·반등 때 왜 발동되나` |
| Description | 기획서 변경안 |
| 숫자 노출 원칙 | Title·H1·OG 텍스트에는 누적 횟수를 넣지 않는다. 리드·KPI에만 최신 숫자 |
| 신규 OG | `public/og/reports/kospi-sidecar-record-2026.png` 신규 생성, 페이지에 `ogImage` 전달(현재 미지정 → 기본 OG 사용 중) |

## 2. 실제 구현 대조 (2026-10-27 저장소 확인)

| 위치 | 현재 | 변경 |
|---|---|---|
| `src/data/kospiSidecarRecord2026.ts` `KSR_META` | title/seoTitle "41회", updatedAt 2026-07-24 | 숫자 제거, updatedAt 발행일 |
| `KSR_CUMULATIVE_STATS` | 코스피 41·코스닥 25·합산 66·배율 1.58 | 3-2 값으로 교체, 코스닥 재조사 전 카드 상태 처리 |
| `KSR_HISTORICAL_COMPARISON` | 41 vs 26 등 | 계산 함수로 생성 |
| `KSR_CAUSE_CARDS` 기준금리 카드 | "7/16 2.50→2.75%" | 7월·8월 인상, 10/22 3.00% 동결 |
| `KSR_RECENT_RECORDS` | 7/23~7/24 3건 | 10월 기록으로 교체, 7월 기록은 추이 섹션에서 스냅샷으로 보존 |
| `KSR_FAQ` | 8개 | 2개 수정 + 2개 추가(총 10) |
| `KSR_RELATED_LINKS` | 4개 | 3개 교체·추가 (8장) |
| `kospi-sidecar-record-2026.astro` 216행 부근 | SeoContent intro에 "누적 41회…66회" 하드코딩 | `KSR_SEO_INTRO` 데이터로 이동, 수치는 계산값 조합 |
| `src/data/reports.ts` 1290행 | title/description 41회 | 변경 |
| `src/pages/reports/index.astro` 1344행 | eyebrow "2026년 증시 변동성" | 유지, tags에 `{ label: "서킷브레이커", mod: "asset" }` 추가 검토 |
| `src/data/kospiLeverageEtfCalculator.ts` 187행 | 라벨 "41회 리포트" | "코스피 사이드카 2026 리포트" (레버리지 개선과 같은 커밋 가능) |
| `public/sitemap.xml` 299행 | lastmod 2026-07-24 | 발행일 |

## 3. 데이터 설계

### 3-1. 신규·변경 타입

```ts
export type KsrBadge = "공식" | "참고" | "시뮬레이션" | "추정";

export type KsrSnapshot = {
  asOf: string;                     // YYYY-MM-DD
  market: "코스피" | "코스닥";
  total: number | null;
  sell: number | null;
  buy: number | null;
  status: "확정" | "잠정";          // 잠정 = 언론 "N번째" 보도로 재구성
  badge: KsrBadge;                  // 확정+KRX → 공식, 보도 인용 → 참고, 재구성 → 추정
  sourceId: string;
  note?: string;
};

export type KsrEvent = {
  date: string;
  time: string | null;
  market: "코스피" | "코스닥";
  kind: "매도 사이드카" | "매수 사이드카" | "서킷브레이커 1단계" | "서킷브레이커 2단계" | "서킷브레이커 3단계";
  ordinalNote: string | null;       // "올해 50번째(매도 26번째)"
  context: string | null;           // "시가 6,186.08(-3.10%)"
  status: "확정" | "확인 필요";
  sourceId: string;
};

export type KsrSource = { id: string; org: string; title: string; url: string; publishedAt: string; checkedAt: string };
```

기존 `CumulativeStat`, `RecentRecord`는 화면 모델로 대체하고 제거(사용처는 이 페이지뿐 — grep 확인).

### 3-2. 초기 데이터

`KSR_SNAPSHOTS` (코스피):

| asOf | total | sell | buy | status | badge | sourceId |
|---|---:|---:|---:|---|---|---|
| 2026-06-27 | 29 | 14 | 15 | 잠정 | 참고 | `newsspace-0627` |
| 2026-07-11 | 34 | null | null | 잠정 | 참고 | `newsspace-0711` |
| 2026-07-24 | 41 | 21 | 20 | 잠정 | 참고 | `mtn-0724` |
| 2026-10-13 | 50 | 26 | 24 | 잠정 | 참고 | `mt-1013` (매수 24는 50−26으로 도출 → note) |
| 2026-10-15 | 51 | 27 | 24 | 잠정 | 참고 | `genews-1015` |
| 2026-10-27 | 53 | 27 | 26 | 잠정 | 추정 | `mt-1027` (합계는 재구성) |

코스닥 스냅샷: 2026-07-24 25(매도 11·매수 14, 기존 값), 2026-10-15 매도 15번째만 확인. **코스닥 합계는 `null`로 두고 KPI 카드에 "재조사 중" 표시**. KRX 공지로 채우면 정상 카드.

`KSR_EVENTS_2026` (export — 코스피 급락 리포트가 import):

| date | time | market | kind | ordinalNote | status |
|---|---|---|---|---|---|
| 2026-07-29 | null | 코스피·코스닥 각 1건 | 서킷브레이커 1단계 | null | 확인 필요 |
| 2026-10-13 | 09:47 | 코스피 | 매도 사이드카 | 올해 50번째(매도 26번째) | 확정(보도) |
| 2026-10-15 | 09:07 | 코스피 | 매도 사이드카 | 매도 27번째 | 확정(보도) |
| 2026-10-15 | 09:12 | 코스닥 | 매도 사이드카 | 매도 15번째 | 확정(보도) |
| 2026-10-15 | 12:23 | 코스닥 | 서킷브레이커 1단계 | 올해 5번째·역대 15번째 | 확정(보도) |
| 2026-10-15 | 12:38 | 코스피 | 서킷브레이커 1단계 | 올해 10번째·역대 16번째 | 확정(보도) |
| 2026-10-27 | 10:13 | 코스피 | 매수 사이드카 | 매수 26번째 | 확정(보도) |
| (10/16~10/26) | null | 코스피 | 매수 사이드카 | 매수 25번째 | 확인 필요 |

- `확인 필요` 이벤트는 화면에 렌더링하지 않는다(데이터에만 보관). 7/29 CB는 KRX 확인 후 표시.
- `KSR_2008` 상수: `{ kospi: 26, kosdaq: 19, badge: "참고", sourceId: "…" }`. 원 출처를 KRX 자료로 확인하면 `공식`.

### 3-3. 계산 함수 (`src/data` 내 순수 함수 또는 `src/utils/kospiSidecarRecord2026.ts` 신규)

```ts
latestSnapshot(market)           // asOf 최댓값
ratioVs2008(total, base)         // total / base, 소수 둘째 자리 — 53/26 = 2.04
buyShare(s)                      // s.buy / s.total — 26/53 = 49.1%
monthlyIncrements(snapshots)     // 연속 스냅샷 차이: 6/27→7/11 +5, 7/11→7/24 +7, 7/24→10/13 +9, 10/13→10/15 +1, 10/15→10/27 +2
validateSnapshots()              // total = sell + buy(둘 다 있을 때), asOf 오름차순, total 비감소. 실패 시 throw
```

화면의 배율·비중 값은 `시뮬레이션` 배지.

### 3-4. 콘텐츠

- `KSR_META`: seoTitle/title/description 1장 값, `dataNote` "이 리포트의 누적 횟수는 2026년 10월 27일까지 보도된 한국거래소 집계를 바탕으로 재구성한 값입니다. 한국거래소 시장조치 공지와 대조해 확정 여부를 표시합니다."
- `KSR_COUNT_NOTE` (집계 기준 안내): "기사의 '올해 N번째'는 매체에 따라 전체 합계일 수도, 매도·매수 방향별 횟수일 수도 있습니다…" 3문장.
- `KSR_CAUSE_CARDS`: 기준금리 카드 교체 + "AI 투자 우려·중국 메모리 추격(10월)" 카드 추가(상세는 급락 리포트 링크). 기존 문장 톤(…는 분석이 있습니다) 유지.
- `KSR_SEO_INTRO`: 기획서 7장 4단락. 1단락(정의·조건), 2단락(누적 — 계산값 템플릿), 3단락(10월 기록), 4단락(볼 때 주의).
- `KSR_FAQ` 수정·추가:
  - "하루에 여러 번 발동될 수 있나요?" — **KRX 유가증권시장 업무규정(프로그램매매호가 효력정지) 원문 확인 후** 1일 1회 적용 범위·장 개시 5분/마감 40분 전 제외 규정을 반영해 재작성. 확인 전엔 기존 답변 유지.
  - "실시간 수치인가요?" — 기준일 10/27로 수정.
  - 신규 "매수 사이드카가 발동되면 바닥인가요?", "10월에 사이드카가 몇 번 발동됐나요?"(코스피 매도 2회·매수 1회 이상 + 확인 필요 1건 안내).
- `KSR_SOURCES`: 기획서 3-1 링크 + KRX 업무규정 링크.

## 4. 화면 구성 변경

| 순서 | 섹션 | 상태 | 비고 |
|---|---|---|---|
| 1 | Hero + 기준일 배지 + InfoNotice(dataNote) | 수정 | |
| 2 | 2026년 누적 발동 현황 KPI | 수정 | 코스피 합계(추정 배지)·매도·매수·서킷브레이커(코스피 10회) |
| 3 | **누적 추이 (신규)** | 추가 | 스냅샷 6개 가로 스택 막대(매도/매수), null 구간은 단색 + "방향 미공개" |
| 4 | **10월 발동 기록 (신규)** | 추가 | `KSR_EVENTS_2026` 중 10월·확정 건 표, 급락 리포트 링크 |
| 5 | 역대 비교 2008 vs 2026 | 수정 | 계산값, 주석 "횟수 비교일 뿐 위기 강도 비교가 아닙니다" 고정 |
| 6 | 사이드카란? / 발동 조건 | 유지 | KRX 규정 링크 추가 |
| 7 | 사이드카 vs 서킷브레이커 | 수정 | 하단에 "2026년 서킷브레이커 기록" 소표 |
| 8 | 배경 카드 | 수정 | |
| 9 | 확인할 5가지 / 피할 행동 | 유지 | |
| 10 | **집계 기준 안내 (신규)** | 추가 | `KSR_COUNT_NOTE` |
| 11 | 최근 발동 기록 | 삭제 | 4번으로 통합 |
| 12 | SeoContent | 수정 | intro 데이터화, FAQ 10, related 4 |

### 누적 추이 마크업 스케치

```astro
<section class="op-section ksr-trend">
  <h2>2026년 누적 발동 추이</h2>
  <ol class="ksr-trend__list">
    {snapshots.map((s) => (
      <li class="ksr-trend__row">
        <span class="ksr-trend__date">{fmtDate(s.asOf)}</span>
        <span class="ksr-trend__bar" style={`--total:${s.total};--max:${maxTotal}`}>
          {s.sell !== null && <span class="ksr-trend__sell" style={`--n:${s.sell}`}>매도 {s.sell}</span>}
          {s.buy !== null && <span class="ksr-trend__buy" style={`--n:${s.buy}`}>매수 {s.buy}</span>}
        </span>
        <strong>{s.total}회</strong>
        <span class={`badge badge--${badgeClass(s.badge)}`}>{s.badge}</span>
      </li>
    ))}
  </ol>
  <p class="ksr-trend__note">언론 보도의 한국거래소 집계를 시점별로 모은 값입니다.</p>
</section>
```

인라인 스타일은 CSS 변수 전달만 사용(폭 계산은 SCSS `calc(var(--n) / var(--max) * 100%)`). 기존 페이지 스타일이 인라인 변수를 쓰지 않는다면 `data-` 속성 + 미리 계산한 퍼센트 `style="width:xx%"`로 대체.

## 5. SCSS

- 기존 `_kospi-sidecar-record-2026.scss`에 `.ksr-trend`, `.ksr-oct`, `.ksr-count-note`, `.ksr-cb-records` 추가. 중첩 3단계 이내.
- 매수/매도 막대는 중립 2색(매수를 긍정색으로 쓰지 않음), 텍스트 라벨 병기.
- ≤480px: 추이 행을 날짜·합계 1줄 + 막대 1줄로 분리, 10월 기록 표는 카드형.

## 6. SEO·내부 링크·등록

- `BaseLayout`에 `ogImage="/og/reports/kospi-sidecar-record-2026.png"` 추가.
- JSON-LD Article `dateModified` = 새 updatedAt, `headline` 새 H1. FAQPage는 10개 반영.
- 내부 링크(`KSR_RELATED_LINKS`):

| 대상 | 위치 |
|---|---|
| `/reports/kospi-october-crash-2026/` | 10월 기록 섹션 하단 + related (페이지 파일 존재 시에만) |
| `/tools/kospi-leverage-etf-calculator/` | 배경 카드 "선물·ETF 연계 매매" 하단 + related |
| `/tools/dca-investment-calculator/` | related 유지 |
| `/reports/semiconductor-stocks-h1-2026/` | related 유지 |

`ai-stocks-h1-2026`, `etf-vs-direct-stock-10year-2026`는 related에서 제외(4개 제한).

등록 변경:

```ts
// src/data/reports.ts
title: "코스피 사이드카 2026 | 폭락·반등 때 왜 발동되나",
description: "2026년 코스피 사이드카 발동 횟수를 매수·매도별로 정리하고 10월 급락·반등 기록을 추가했습니다. 발동 조건, 서킷브레이커와 차이, 2008년 비교까지 확인하세요.",
badges: ["코스피", "사이드카", "서킷브레이커", "2026"],
```

```python
# generate-og-tools.py REPORTS (신규 항목)
{"slug": "kospi-sidecar-record-2026", "title": "코스피 사이드카 2026", "description": "폭락·반등 때 왜 발동되나 · 매수·매도 누적과 서킷브레이커 기록", "eyebrow": "자산 리포트", "stats": [("발동 조건", "선물 ±5% · 1분"), ("효력 정지", "프로그램매매 5분")]},
```

OG에 누적 횟수를 넣지 않아 갱신 때마다 재생성할 필요가 없게 한다.

## 7. 갱신 절차

1. KRX 시장조치(프로그램매매호가 효력정지) 공지에서 2026-01-02~최신 코스피·코스닥 발동일 전체 수집.
2. 스냅샷을 KRX 기준으로 재작성: `status: "확정"`, `badge: "공식"`. 보도 기반 행과 다르면 KRX 우선, 차이를 갱신 로그에 기록.
3. 이후 발동 시: `KSR_EVENTS_2026` 1행 + 최신 스냅샷 1행 + `updatedAt` + sitemap lastmod. Title·OG 수정 불필요.
4. 연말: 12월 마지막 거래일 기준 결산 스냅샷 추가.

## 8. 검증과 완료 기준

### 계산 검증

| 항목 | 기대값 (잠정 데이터) |
|---|---|
| 최신 코스피 합계 | 53 (추정 배지) |
| 2008 대비 배율 | 53 ÷ 26 = 2.04배 |
| 매수 비중 | 26 ÷ 53 = 49.1% |
| 스냅샷 검증 | 29=14+15, 41=21+20, 51=27+24, 53=27+26 통과 |
| 증가분 | +5, +7, +9, +1, +2 |

KRX 확정 후 값이 바뀌면 이 표를 갱신하고 같은 방식으로 재검증한다.

### 배포 게이트

- 최신 스냅샷이 `잠정`이면 KPI 옆 `추정` 배지와 "재구성값" 문구가 반드시 노출된다(자동). 가능하면 KRX 대조 후 `확정`으로 배포.
- 화면·데이터·reports.ts·astro 하드코딩 어디에도 "41회"가 최신값으로 남지 않음(`grep -rn "41회" src` → 스냅샷 데이터 행 외 0건).

### QA 체크리스트

- [ ] Title/H1/Description/OG에 숫자 없음, canonical 동일
- [ ] 누적 추이 막대 합계 = 표기 합계
- [ ] 10월 기록에 `확인 필요` 이벤트 미노출
- [ ] FAQ 10개 JSON-LD와 화면 일치
- [ ] 2008 비교 주석 노출, "더 위험" 류 표현 없음
- [ ] 레버리지 계산기 역링크 라벨 수정
- [ ] 320/375/768px 레이아웃

### 완료 조건

```bash
npm run check:all
npm run build
```

둘 다 성공해야 한다. **이 설계서 작성 시점에는 구현·실행하지 않았다.**
