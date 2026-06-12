# 손흥민·김민재·이강인 vs 역대 레전드 연봉 비교 리포트 설계 문서

> 작성일: 2026-06-12
> 콘텐츠 유형: `/reports/` 인터랙티브 리포트
> 구현 대상 URL: `/reports/korea-football-legends-salary-comparison-2026/`
> 핵심 원칙: 현재 선수와 역대 레전드의 연봉은 시대·환율·리그 수준이 전혀 다르므로, 단순 비교가 아니라 "당시 기준 vs 현재가치 환산" 형태로 제시하고 전 항목에 `추정`/`보도 기준` 배지를 붙인다.

---

## 1. 문서 개요

- 구현 대상: `손흥민·김민재·이강인 연봉과 역대 한국 축구 레전드 연봉 비교`
- slug: `korea-football-legends-salary-comparison-2026`
- URL: `/reports/korea-football-legends-salary-comparison-2026/`
- 카테고리: 스포츠 / 연봉 / 역대 비교
- 관련 리포트: `/reports/korea-worldcup-squad-salary-2026/` (현재 대표팀 전체 연봉 순위) — 이 리포트는 그 중 핵심 3인 + 레전드 비교에 집중하는 파생/심화 콘텐츠
- 검색 의도:
  - `손흥민 연봉`
  - `김민재 연봉`
  - `이강인 연봉`
  - `박지성 연봉`
  - `차범근 연봉`
  - `안정환 연봉`
  - `이영표 연봉`
  - `이천수 연봉`
  - `기성용 연봉`
  - `한국 축구선수 연봉 역대`
  - `역대 한국 축구 레전드 연봉 비교`
- 핵심 출력:
  - 현재 스타 3인(손흥민·김민재·이강인) 추정 연봉 카드
  - 역대 레전드 6인(박지성·차범근·이영표·안정환·이천수·기성용) 전성기 추정 연봉 카드
  - 전성기 연봉을 현재 시점 화폐가치로 환산한 값 (물가 환산)
  - 선수 선택 시 상세 프로필(소속, 전성기 시즌, 연봉, 환산값, 커리어 한줄 요약)
  - 세대별(1990년대~2020년대) 연봉 변화 흐름
- 안전 장치:
  - `공식 연봉 아님`, `보도/추정 기준`, `물가 환산은 통계청 소비자물가지수 기반 단순 환산` 문구를 Hero와 InfoNotice에 반복 노출
  - 은퇴 선수의 연봉은 "전성기 기준" 추정치임을 명시하고, 현역 선수와 1:1 절대비교가 아니라는 점을 본문에서 반복
  - 선수 개인 평가·논란성 일화는 다루지 않고 연봉/커리어 사실 위주로 작성

이 페이지는 `/reports/korea-worldcup-squad-salary-2026/`에서 다룬 "현재 대표팀 연봉" 트래픽을 "그럼 역대 레전드는 얼마나 받았을까"라는 자연스러운 다음 질문으로 연결한다. 단순 나열이 아니라 손흥민·김민재·이강인이라는 익숙한 기준점과 박지성·차범근 등 향수를 자극하는 레전드를 교차 비교해 체류 시간을 늘리는 것이 목표다.

---

## 2. 구현 파일 구조

```text
src/
  data/
    koreaFootballLegendsSalaryComparison2026.ts
    reports.ts
  pages/
    reports/
      korea-football-legends-salary-comparison-2026.astro
  styles/
    scss/
      pages/
        _korea-football-legends-salary-comparison-2026.scss
    app.scss

public/
  scripts/
    korea-football-legends-salary-comparison-2026.js
  sitemap.xml
```

추가 등록 필수:

- `src/data/reports.ts`: 리포트 목록 등록
- `src/styles/app.scss`: `@use 'scss/pages/korea-football-legends-salary-comparison-2026';`
- `public/sitemap.xml`: `/reports/korea-football-legends-salary-comparison-2026/` URL 추가
- `/reports/korea-worldcup-squad-salary-2026.astro`와 상호 링크 (양방향 `related[]` 추가)
- 구현 후 `npm run build` 성공 확인

---

## 3. 콘텐츠 포지셔닝

### 3-1. 한 줄 가치 제안

`손흥민·김민재·이강인의 추정 연봉을 박지성·차범근·안정환 등 역대 레전드의 전성기 연봉과 현재가치로 비교해 보는 리포트`

### 3-2. 페이지 톤

- "지금이 더 많이 받는다"가 아니라 "시대별 한국 축구 선수 몸값이 어떻게 변했는가"에 초점
- 향수(레전드)와 현재 관심(월드컵 대표팀)을 동시에 자극
- 물가/환율 환산의 한계를 솔직하게 설명
- 전부 한국어 작성

### 3-3. 금지 표현

- `공식 연봉`
- `확정 연봉`
- `실수령액`
- `OOO가 OOO보다 더 잘했다`류의 우열 평가
- 단정적 `역대 최고 연봉`

권장 표현:

- `보도/추정 기준 연봉`
- `전성기 기준 추정 연봉`
- `현재가치 환산(소비자물가지수 기준 단순 환산)`
- `시대·리그·환율 차이로 직접 비교에는 한계가 있음`

---

## 4. 대상 선수 및 데이터 기준

### 4-1. 현재 스타 (3인)

| 선수 | 소속(2026 기준) | 비고 |
|---|---|---|
| 손흥민 | LAFC (MLS) | `/reports/korea-worldcup-squad-salary-2026/`와 데이터 정합성 유지 — 동일 추정값 재사용 |
| 김민재 | 바이에른 뮌헨 (분데스리가) | 동일 |
| 이강인 | PSG (리그1) | 동일 |

> 위 3인의 연봉 추정값은 `koreaWorldcupSquadSalary2026.ts`의 `SQUAD_SALARY_PLAYERS`에서 손흥민/김민재/이강인 항목을 참조하거나 동일한 출처 기준으로 재산정한다. 두 리포트 간 숫자가 어긋나면 신뢰도 문제가 생기므로 구현 시 반드시 출처를 통일한다.

### 4-2. 역대 레전드 (6인)

| 선수 | 전성기 추정 구간 | 전성기 소속 | 비고 |
|---|---|---|---|
| 박지성 | 2005~2011 | 맨체스터 유나이티드 (프리미어리그) | 검색량 최상위 레전드 |
| 차범근 | 1979~1989 | 분데스리가 (프랑크푸르트/레버쿠젠) | 한국인 최초 유럽 진출 레전드, 가장 오래된 데이터 — 추정 난이도 최고 |
| 이영표 | 2005~2008 | 토트넘/PSV | 박지성과 동시대 |
| 안정환 | 2000~2006 | 페루자/뒤스부르크 등 | 국내+유럽 혼합 커리어 |
| 이천수 | 2002~2008 | 레알 소시에다드/울산 등 | 2002 월드컵 스타 |
| 기성용 | 2010~2018 | 셀틱/스완지/뉴캐슬 | 손흥민 이전 EPL 주전 미드필더 |

> "기성룡"은 "기성용"의 오기로 판단해 기성용으로 진행한다. 구현 직전 출처 검색 시 "기성용 연봉"으로 검색한다.

### 4-3. 데이터 등급

```ts
export type SalarySourceBadge = "공식" | "보도 기준" | "추정" | "확인 필요";
```

- `공식`: 구단/리그 공식 발표 (해외 빅클럽은 거의 없음 — 대부분 보도 기준 또는 추정)
- `보도 기준`: 신뢰 가능한 매체가 명시한 계약 보도 (당시 스포츠지, 외신)
- `추정`: 여러 보도를 종합하거나 환율/물가 환산을 적용한 값
- `확인 필요`: 1980~90년대 데이터처럼 출처가 희소해 재검증이 필요한 값

### 4-4. 출처 후보

| 항목 | 출처 후보 |
|---|---|
| 손흥민/김민재/이강인 현재 연봉 | `koreaWorldcupSquadSalary2026.ts` 기존 값, Capology, Guardian/외신 보도 |
| 박지성 전성기 연봉 | 당시 영국 스포츠지(BBC, Daily Mail) 보도, 국내 스포츠지 보도 |
| 차범근 전성기 연봉 | 분데스리가 역사 자료, 국내 언론 회고 기사 (가장 불확실 — `확인 필요` 비중 높음) |
| 이영표 전성기 연봉 | 토트넘/PSV 관련 당시 보도 |
| 안정환 전성기 연봉 | 이탈리아/독일 리그 당시 보도, 국내 언론 |
| 이천수 전성기 연봉 | 레알 소시에다드 계약 보도, K리그 복귀 후 연봉 |
| 기성용 전성기 연봉 | 셀틱/스완지/뉴캐슬 당시 영국 매체 보도 |
| 물가 환산 지수 | 통계청 소비자물가지수(CPI) 또는 한국은행 경제통계시스템 |
| 환율 환산 | 각 연도 기준 평균 환율 (한국은행 ECOS) |

> 1980~90년대 데이터는 정확한 연봉 보도가 거의 없으므로, 확보 불가 시 "정확한 연봉 보도가 희소함"을 명시하고 `확인 필요` 배지와 함께 가능한 범위값(range)으로만 제시한다. 데이터를 끝까지 확보하지 못하면 해당 선수는 "커리어 하이라이트 중심" 카드로 전환하고 연봉은 비공개 처리한다.

---

## 5. 데이터 모델 설계

파일: `src/data/koreaFootballLegendsSalaryComparison2026.ts`

```ts
export type SalarySourceBadge = "공식" | "보도 기준" | "추정" | "확인 필요";
export type PlayerEra = "current" | "legend";
export type PlayerPosition = "GK" | "DF" | "MF" | "FW";

export interface LegendSalaryRecord {
  id: string;
  nameKo: string;
  nameEn?: string;
  era: PlayerEra;
  position: PlayerPosition;
  peakPeriodLabel: string;       // 예: "2005~2011" 또는 "2026 기준"
  peakClub: string;
  peakLeague: string;
  annualSalaryKrwMin?: number;   // 전성기 기준 연봉 추정 (원, 만원 단위)
  annualSalaryKrwMax?: number;
  presentValueKrwMin?: number;   // 현재가치 환산 (물가 환산 적용)
  presentValueKrwMax?: number;
  sourceBadge: SalarySourceBadge;
  sourceLabel: string;
  sourceUrl?: string;
  careerSummary: string;         // 한 줄 커리어 요약
  highlights: string[];          // 주요 커리어 하이라이트 (대표 기록/우승 등)
  note?: string;
  isFeatured?: boolean;          // 현재 스타 3인 + 박지성 등 최우선 노출 대상
}

export interface InflationPreset {
  fromYear: number;
  toYear: number;
  multiplier: number;            // 물가 환산 배수
  sourceLabel: string;
  sourceUrl?: string;
}

export interface PageFaqItem {
  question: string;
  answer: string;
}
```

### 5-1. 필수 export

```ts
export const PAGE_META = {
  slug: "korea-football-legends-salary-comparison-2026",
  title: "손흥민·김민재·이강인 연봉 vs 역대 레전드 연봉 비교",
  seoTitle: "손흥민 김민재 이강인 연봉 vs 박지성 차범근 안정환 연봉 비교 2026",
  seoDescription:
    "손흥민, 김민재, 이강인의 추정 연봉을 박지성, 차범근, 이영표, 안정환, 이천수, 기성용 등 역대 레전드의 전성기 연봉·현재가치 환산과 비교합니다.",
  description:
    "현재 대표팀 핵심 3인과 한국 축구 역대 레전드 6인의 연봉을 전성기 기준, 현재가치 환산 기준으로 비교한 리포트입니다.",
  updatedAt: "2026-06-12",
  dataNote:
    "연봉은 언론 보도 및 추정 기준이며, 일부 1980~90년대 데이터는 출처가 희소해 확인 필요 상태로 표기됩니다. 현재가치 환산은 소비자물가지수 기준 단순 환산이며 실제 구매력과 차이가 있을 수 있습니다.",
};

export const LEGENDS_SALARY_RECORDS: LegendSalaryRecord[] = [];
export const INFLATION_PRESETS: InflationPreset[] = [];
export const PAGE_FAQ: PageFaqItem[] = [];
export const RELATED_LINKS: { href: string; label: string }[] = [];
```

### 5-2. 초기 데이터 입력 원칙

- `era: "current"` 3건(손흥민/김민재/이강인) + `era: "legend"` 6건(박지성/차범근/이영표/안정환/이천수/기성용) = 총 9건으로 시작
- `isFeatured: true`는 손흥민·김민재·이강인·박지성·차범근 5명 우선 (검색량 상위)
- 차범근처럼 정확한 금액 확보가 어려운 경우 `annualSalaryKrwMin/Max`를 범위값으로 넓게 잡고 `sourceBadge: "확인 필요"`, `note`에 "정확한 연봉 보도가 희소하여 추정 범위로 표시"를 명시
- `presentValueKrwMin/Max`는 `INFLATION_PRESETS`의 해당 연도 구간 multiplier를 곱해 산출 (클라이언트에서 계산하지 않고 데이터에 사전 계산값을 넣거나, 스크립트에서 계산 — 6-1 참조)

---

## 6. 계산 로직

### 6-1. 현재가치 환산

```text
현재가치 연봉 = 전성기 연봉 * 해당 연도 물가 환산 배수
```

- `INFLATION_PRESETS`에 선수별 전성기 연도 구간에 맞는 배수를 미리 정의 (예: 1985년 기준 배수, 2007년 기준 배수 등)
- 클라이언트 스크립트에서 선수 데이터의 `peakPeriodLabel` 시작 연도를 기준으로 해당 배수를 찾아 곱한다
- 배수 산출 출처(통계청 CPI 등)를 INFLATION_PRESETS에 명시

### 6-2. 사용자가 조정할 수 있는 값

- 비교 모드: `전성기 연봉 기준` vs `현재가치 환산 기준` (토글)
- 정렬: `연봉 높은 순`, `세대순(연도순)`, `포지션`
- 금액 표시: `억원`, `만원`

### 6-3. 주요 KPI

1. 현재 3인 중 최고 추정 연봉
2. 레전드 6인 중 전성기 최고 추정 연봉
3. 레전드 6인 중 현재가치 환산 최고
4. 세대 간 연봉 격차(현재 3인 평균 vs 레전드 6인 현재가치 평균)

각 KPI 카드에 `추정`/`현재가치 환산` 배지 필수.

---

## 7. 페이지 IA

1. Hero — "손흥민·김민재·이강인, 그리고 박지성·차범근까지 — 한국 축구 연봉은 어떻게 변했을까"
2. InfoNotice — 추정/보도 기준, 현재가치 환산의 한계 고지
3. Overview 카드 — 현재 스타 3인 요약 (`/reports/korea-worldcup-squad-salary-2026/`와 일관된 숫자)
4. Overview 카드 — 레전드 6인 요약 (전성기 연봉 + 현재가치 환산)
5. 비교 모드 토글 (전성기 기준 / 현재가치 환산 기준)
6. 선수 선택 탭/셀렉트 — 9인 중 선택 시 상세 프로필 카드
7. 선택 상세 카드 — 소속, 전성기 시즌, 연봉, 현재가치 환산, 커리어 하이라이트, 출처 배지
8. 세대별 연봉 변화 흐름 (1980년대 → 2020년대, Chart.js 라인/바 차트)
9. 데이터 신뢰도와 한계 (특히 차범근 등 고연대 데이터)
10. FAQ
11. 관련 리포트/계산기 (`/reports/korea-worldcup-squad-salary-2026/`, `/reports/kleague-salary-comparison-2026/` 등)
12. SeoContent

---

## 8. UI 설계

### 8-1. 레이아웃

- BaseLayout 직접 사용, 기존 리포트 레이아웃 패턴 재사용
- pageClass: `kfls-page`
- SCSS prefix: `kfls-`
- 모바일 우선: Hero → InfoNotice → Overview 카드(2열→1열) → 토글 → 선택 탭(가로 스크롤) → 상세 카드 → 차트 → FAQ

### 8-2. 주요 컴포넌트

#### Overview 카드 (현재 3인 / 레전드 6인)

- 2개 그룹으로 분리된 카드 그리드
- 카드: 이름, 소속(전성기/현재), 추정 연봉, 출처 배지
- 레전드 카드에는 "현재가치로 환산하면 약 X" 보조 텍스트 추가

#### 비교 모드 토글

- `전성기 연봉 기준` / `현재가치 환산 기준` 2개 버튼
- 토글 시 Overview 카드와 차트의 금액 표시가 함께 전환

#### 선수 선택 탭

- 9개 탭 (또는 모바일에서는 select), `is-active` 클래스로 선택 표시
- 현재 3인은 파란 계열, 레전드 6인은 다른 색상으로 구분 (디자인 토큰의 accent 색상 활용)

#### 선택 상세 카드

- 이름, 포지션, 전성기/현재 소속, 전성기 추정 연봉, 현재가치 환산, 커리어 하이라이트 리스트(3~5개), 출처 배지 + 링크

#### 세대별 흐름 차트

- Chart.js bar 또는 line chart
- X축: 선수(세대순), Y축: 현재가치 환산 연봉
- 차트 미로드 시 동일 데이터 표 fallback

---

## 9. 클라이언트 JS 설계

파일: `public/scripts/korea-football-legends-salary-comparison-2026.js`

패턴:

- IIFE 사용
- `data-*` 기반 DOM 참조
- `innerHTML` 대신 `textContent` 사용
- URLSearchParams로 선택된 선수/비교 모드 유지

핵심 함수:

```js
function formatKrw(value, unitMode) {}
function getInflationMultiplier(peakPeriodLabel, presets) {}
function computePresentValue(record, presets) {}
function renderOverviewCards(records, mode) {}
function renderPlayerTabs(records, selectedId) {}
function renderDetailCard(record, mode) {}
function renderGenerationChart(records, mode) {}
function selectPlayer(id) {}
function setCompareMode(mode) {}
function syncUrlState(state) {}
function init() {}
```

---

## 10. SEO 설계

### 10-1. Title

`손흥민·김민재·이강인 연봉 vs 역대 레전드 연봉 비교 | 비교계산소`

### 10-2. Description

`손흥민, 김민재, 이강인의 추정 연봉을 박지성, 차범근, 이영표, 안정환, 이천수, 기성용 등 역대 한국 축구 레전드의 전성기 연봉, 현재가치 환산과 비교합니다.`

### 10-3. H1

`손흥민·김민재·이강인 연봉, 역대 레전드와 비교하면?`

### 10-4. H2 후보

- `현재 대표팀 핵심 3인 추정 연봉`
- `박지성·차범근·안정환 등 역대 레전드 전성기 연봉`
- `전성기 연봉을 지금 가치로 환산하면`
- `세대별 한국 축구선수 연봉은 어떻게 변했나`
- `이 리포트의 데이터 기준과 한계`
- `자주 묻는 질문`

### 10-5. FAQ 후보

1. `손흥민·김민재·이강인 연봉은 공식 자료인가요?`
   - 아니요. 보도 및 샐러리 DB 기준 추정값이며 공식 계약서 기준이 아닙니다.
2. `차범근 선수의 연봉은 왜 확인 필요로 표시되나요?`
   - 1980년대 분데스리가 연봉 보도 자체가 희소해 정확한 금액을 특정하기 어렵습니다. 가능한 범위로만 추정해 표시합니다.
3. `현재가치 환산은 어떻게 계산하나요?`
   - 통계청 소비자물가지수 등을 활용한 단순 환산으로, 실제 구매력이나 당시 리그 환경 차이를 모두 반영하지는 못합니다.
4. `지금 선수와 레전드 선수 중 누가 더 많이 받았나요?`
   - 이 리포트는 우열을 가리기 위한 자료가 아닙니다. 시대·리그·환율 차이를 감안해 참고용으로만 봐주세요.
5. `기성용 선수도 포함되나요?`
   - 네, 셀틱·스완지·뉴캐슬 시절 전성기 기준 추정 연봉을 포함합니다.
6. `K리그로 복귀한 이후 연봉은 반영되나요?`
   - 이 리포트는 해외 진출 전성기 기준 연봉을 우선 다루며, K리그 복귀 후 연봉은 참고로만 언급합니다.
7. `손흥민·김민재·이강인 연봉은 다른 리포트와 다른가요?`
   - `/reports/korea-worldcup-squad-salary-2026/`와 동일한 출처 기준을 사용해 일관성을 유지합니다.

### 10-6. 관련 링크 후보

- `/reports/korea-worldcup-squad-salary-2026/`
- `/reports/kleague-salary-comparison-2026/`
- `/reports/`
- `/tools/`
- `/reports/salary-asset-2016-vs-2026/`

---

## 11. SeoContent 초안 방향

intro 4문단 흐름:

1. 손흥민·김민재·이강인 등 현재 대표팀 연봉에 대한 관심이 "그럼 옛날 레전드는 얼마였을까"라는 질문으로 이어지는 맥락
2. 전성기 연봉과 현재가치 환산을 함께 보는 이유와 계산 방식
3. 박지성·차범근부터 이강인까지 세대별로 한국 축구선수 연봉이 어떻게 변해왔는지 개괄
4. 데이터 출처의 한계 — 특히 1980~90년대 데이터의 희소성과 직접 비교의 어려움

필수 포함 문구:

- `이 리포트는 선수 간 우열을 가리기 위한 자료가 아닙니다.`
- `1980~90년대 선수의 연봉은 보도 자체가 희소해 확인 필요로 표기됩니다.`
- `현재가치 환산은 소비자물가지수 기준 단순 환산이며 실제 구매력과 차이가 있을 수 있습니다.`

---

## 12. 구현 순서

1. 구현 직전 손흥민/김민재/이강인 연봉 — `koreaWorldcupSquadSalary2026.ts`와 출처 정합성 확인 (해당 리포트가 먼저 구현된 경우 재사용)
2. 레전드 6인 연봉/커리어 데이터 리서치 (차범근은 범위/확인필요 처리 가능성 높음을 감안)
3. `src/data/koreaFootballLegendsSalaryComparison2026.ts` 작성
4. `/reports/korea-football-legends-salary-comparison-2026.astro` 작성
5. `public/scripts/korea-football-legends-salary-comparison-2026.js` 작성
6. `_korea-football-legends-salary-comparison-2026.scss` 작성
7. `src/data/reports.ts`, `src/styles/app.scss`, `public/sitemap.xml` 등록
8. `korea-worldcup-squad-salary-2026` 리포트와 상호 링크 추가 (이미 존재하는 경우)
9. `npm run build`
10. 모바일/데스크톱 시각 확인

---

## 13. QA 체크리스트

- [ ] 현재 3인 + 레전드 6인 = 9건 데이터가 모두 포함됐는가?
- [ ] 모든 금액 카드에 `추정`/`보도 기준`/`확인 필요` 배지가 있는가?
- [ ] `공식 연봉`, `확정 연봉`, `실수령액`, 우열 평가 표현이 없는가?
- [ ] 현재가치 환산 출처(통계청 CPI 등)가 명시됐는가?
- [ ] 차범근 등 데이터 희소 선수에 "확인 필요" + 보충 설명이 있는가?
- [ ] 손흥민/김민재/이강인 연봉이 `korea-worldcup-squad-salary-2026`과 일치하는가?
- [ ] 탭/카드가 모바일에서 가로 overflow 없이 보이는가?
- [ ] Chart.js 실패 시 표 fallback이 있는가?
- [ ] FAQ가 6개 이상인가?
- [ ] 관련 링크가 3개 이상이고 양방향 링크가 걸렸는가?
- [ ] `reports.ts`, `app.scss`, `sitemap.xml` 등록이 완료됐는가?
- [ ] `npm run build`가 성공하는가?

---

## 14. 발행 리스크

- 1980~90년대 선수(차범근 등)의 연봉 데이터를 충분히 확보하지 못할 경우, 해당 선수는 "커리어 하이라이트 중심 + 연봉 비공개"로 축소 운영하는 대안을 준비한다.
- 현재가치 환산 수치가 과도하게 커 보이면 "단순 환산" 고지를 더 강조한다.
- 은퇴 선수 유가족/소속사 등의 항의 가능성을 고려해 추측성 표현을 배제하고 출처를 명확히 남긴다.
- `korea-worldcup-squad-salary-2026`이 먼저 발행된 상태라면 숫자 불일치가 없는지 발행 전 재확인 필수.
