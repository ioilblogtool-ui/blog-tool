# 2026 대한민국 월드컵 대표팀 연봉 순위 리포트 설계 문서

> 작성일: 2026-06-12  
> 콘텐츠 유형: `/reports/` 인터랙티브 리포트  
> 구현 대상 URL: `/reports/korea-worldcup-squad-salary-2026/`  
> 핵심 원칙: 선수 연봉은 대부분 구단 공식 공개값이 아니므로 모든 금액 카드와 표에 `추정` 또는 `보도 기준` 배지를 붙인다.

---

## 1. 문서 개요

- 구현 대상: `2026 대한민국 월드컵 대표팀 연봉 순위`
- slug: `korea-worldcup-squad-salary-2026`
- URL: `/reports/korea-worldcup-squad-salary-2026/`
- 카테고리: 스포츠 / 연봉 / 월드컵
- 검색 의도:
  - `대한민국 월드컵 대표팀 연봉`
  - `국가대표 연봉 순위`
  - `손흥민 연봉 2026`
  - `김민재 연봉 2026`
  - `이강인 연봉 2026`
  - `월드컵 대표팀 몸값`
- 핵심 출력:
  - 대표팀 추정 연봉 TOP 10
  - 선수별 연봉 원화 환산
  - 월급, 일급, 시간당, 경기 90분 기준 금액
  - 포지션별 연봉 합계
  - 해외파/K리그 선수 연봉 격차
  - 체코전 승리 직후 주목 선수 카드
- 안전 장치:
  - `공식 연봉 아님`, `보도/샐러리 DB 기반 추정`, `환율 입력값에 따라 변동` 문구를 Hero 하단과 InfoNotice에 반복 노출
  - 선수 사생활, 추측성 이적 루머, 비검증 소문은 제외
  - 경기 결과는 발행 시점 기준으로만 표기하고 `2026년 6월 12일 기준` 날짜를 명시

이 페이지는 월드컵 첫 경기 승리 직후의 검색 수요를 받는 속보형 리포트다. 단순 뉴스 요약이 아니라 비교계산소의 장점인 숫자 환산과 체감 계산을 전면에 둔다. 사용자는 선수 연봉을 연간 금액으로만 보지 않고, 원화 기준 월급/일급/분급/90분 경기 기준으로 바꿔 보면서 체류할 수 있어야 한다.

---

## 2. 구현 파일 구조

```text
src/
  data/
    koreaWorldcupSquadSalary2026.ts
    reports.ts
  pages/
    reports/
      korea-worldcup-squad-salary-2026.astro
  styles/
    scss/
      pages/
        _korea-worldcup-squad-salary-2026.scss
    app.scss

public/
  scripts/
    korea-worldcup-squad-salary-2026.js
  sitemap.xml
```

추가 등록 필수:

- `src/data/reports.ts`: 리포트 목록 등록
- `src/styles/app.scss`: `@use 'scss/pages/korea-worldcup-squad-salary-2026';`
- `public/sitemap.xml`: `/reports/korea-worldcup-squad-salary-2026/` URL 추가
- 구현 후 `npm run build` 성공 확인

---

## 3. 콘텐츠 포지셔닝

### 3-1. 한 줄 가치 제안

`월드컵 대표팀 선수들의 추정 연봉을 원화, 월급, 일급, 90분 경기 기준으로 환산해 보는 리포트`

### 3-2. 페이지 톤

- 흥미는 살리되 숫자 출처의 한계를 명확히 말한다.
- “얼마 번다”보다 “보도 기준으로 환산하면 어느 정도인지”에 초점을 둔다.
- 사용자 facing 텍스트는 전부 한국어로 작성한다.
- `국대 몸값`, `연봉킹`, `경기 90분 가치` 같은 검색 친화 표현은 사용하되 자극적인 단정은 피한다.

### 3-3. 금지 표현

- `공식 연봉`
- `확정 연봉`
- `실수령액`
- `이 선수는 실제로 하루에 얼마를 번다`
- `승리 수당 확정`

권장 표현:

- `보도 기준 추정 연봉`
- `공개 샐러리 자료와 언론 보도 기준 환산`
- `세전 기준 단순 환산`
- `환율과 계약 구조에 따라 실제 수령액은 달라질 수 있음`

---

## 4. 데이터 기준

### 4-1. 기준일

- 페이지 기준일: `2026-06-12`
- 경기 맥락: 한국은 2026 월드컵 조별리그 첫 경기에서 체코를 2-1로 이긴 것으로 보도됨
- 스쿼드 기준: FIFA/KFA 최종 명단 또는 경기 엔트리 기준으로 구현 시 재확인

### 4-2. 출처 후보

연봉 데이터는 구현 직전에 다시 확인한다. 설계 단계의 후보 출처는 아래와 같다.

| 항목 | 출처 후보 | 데이터 배지 | 사용 방식 |
|---|---|---|---|
| 경기 결과 | The Guardian 경기 라이브, SB Nation 일정/결과 | 참고 | Hero와 맥락 문단에 사용 |
| 월드컵 일정/조 구성 | FIFA 공식 일정, FIFA 매치센터 | 공식 | 경기 일정, 조별리그 설명 |
| 최종 명단 | FIFA 공식 스쿼드, KFA 발표 | 공식 | 선수 목록 기준 |
| 손흥민 보수 | MLS 선수협/Guardian 보도 | 보도 기준 | 달러 연봉 원화 환산 |
| 김민재 보수 | 독일/바이에른 관련 매체 보도 | 보도 기준 | 유로 연봉 원화 환산 |
| 이강인 보수 | Capology 등 샐러리 DB, 프랑스/스페인 보도 | 추정 | 범위값 또는 추정값 |
| 황희찬 보수 | Capology 등 샐러리 DB, 영국 보도 | 추정 | 범위값 또는 추정값 |
| K리그 선수 보수 | K리그 연봉 공개 자료 또는 구단/언론 보도 | 공식/보도 기준 | 가능한 경우만 사용 |

참고 URL:

- `https://www.theguardian.com/football/live/2026/jun/12/fifa-world-cup-2026-live-south-korea-v-czechia-updates-kor-vs-cze-group-a-match-score-latest`
- `https://www.sbnation.com/soccer/1117513/world-cup-schedule-2026-how-to-watch-every-match-scores-and-more`
- `https://www.theguardian.com/football/2026/may/12/mls-2026-salary-release-takeaways`
- `https://www.fifa.com/`
- `https://www.kfa.or.kr/`

### 4-3. 데이터 등급

```ts
export type SalarySourceBadge = "공식" | "보도 기준" | "추정" | "확인 필요";
```

등급 적용:

- `공식`: FIFA/KFA 명단, K리그 공식 연봉 공개처럼 기관 공개값
- `보도 기준`: 신뢰 가능한 매체가 명시한 계약/연봉 보도
- `추정`: Capology 등 비공식 샐러리 DB 또는 여러 보도를 평균한 값
- `확인 필요`: 최신 이적/계약 변동으로 구현 당시 재검증이 필요한 값

---

## 5. 데이터 모델 설계

파일: `src/data/koreaWorldcupSquadSalary2026.ts`

```ts
export type CurrencyCode = "KRW" | "USD" | "EUR" | "GBP";
export type PlayerPosition = "GK" | "DF" | "MF" | "FW";
export type SalarySourceBadge = "공식" | "보도 기준" | "추정" | "확인 필요";

export interface ExchangeRatePreset {
  code: CurrencyCode;
  label: string;
  krwRate: number;
  sourceBadge: SalarySourceBadge;
  sourceLabel: string;
}

export interface SquadSalaryPlayer {
  id: string;
  nameKo: string;
  nameEn: string;
  position: PlayerPosition;
  club: string;
  league: string;
  age: number;
  salaryAmount: number;
  salaryCurrency: CurrencyCode;
  salaryRangeMin?: number;
  salaryRangeMax?: number;
  sourceBadge: SalarySourceBadge;
  sourceLabel: string;
  sourceUrl?: string;
  note?: string;
  isFeatured?: boolean;
}

export interface MatchContext {
  baseDate: string;
  tournament: string;
  matchLabel: string;
  scoreLabel: string;
  summary: string;
  sourceLabel: string;
  sourceUrl: string;
}

export interface PageFaqItem {
  q: string;
  a: string;
}
```

### 5-1. 필수 export

```ts
export const PAGE_META = {
  title: "2026 대한민국 월드컵 대표팀 연봉 순위",
  description: "손흥민, 김민재, 이강인 등 대한민국 월드컵 대표팀 선수들의 보도 기준 추정 연봉을 원화, 월급, 일급, 경기 90분 기준으로 환산합니다.",
  updatedAt: "2026-06-12",
};

export const MATCH_CONTEXT: MatchContext = {};
export const EXCHANGE_RATE_PRESETS: ExchangeRatePreset[] = [];
export const SQUAD_SALARY_PLAYERS: SquadSalaryPlayer[] = [];
export const PAGE_FAQ: PageFaqItem[] = [];
export const RELATED_LINKS = [];
```

### 5-2. 초기 데이터 입력 원칙

- TOP 10 위주로 시작하고 전체 26명은 데이터 신뢰도가 확보되는 선수만 확장한다.
- 연봉값이 불명확한 선수는 `salaryRangeMin`, `salaryRangeMax` 범위값을 우선 사용한다.
- 금액값이 없거나 확인이 약한 선수는 순위표 하단 `확인 필요` 섹션으로 분리한다.
- 이적설 보도만 있고 공식 이적 전인 선수는 현재 소속팀 기준으로 표기한다.

---

## 6. 계산 로직

### 6-1. 기본 환산

```text
원화 연봉 = 원 통화 연봉 * 선택 환율
월급 = 원화 연봉 / 12
일급 = 원화 연봉 / 365
시간당 = 원화 연봉 / 365 / 24
분당 = 원화 연봉 / 365 / 24 / 60
90분 기준 = 분당 * 90
```

주의:

- 세전 단순 환산으로만 표시한다.
- 세후, 보너스, 초상권, 광고 수입은 제외한다.
- 리그별 세율이 다르므로 `실수령액`이라는 단어는 쓰지 않는다.

### 6-2. 사용자가 조정할 수 있는 값

- USD 환율
- EUR 환율
- GBP 환율
- 보기 단위: `연봉`, `월급`, `일급`, `90분 기준`
- 정렬: `연봉 높은 순`, `포지션`, `소속 리그`, `출처 신뢰도`
- 금액 표시: `억원`, `만원`, `원`

### 6-3. 주요 KPI

1. 대표팀 추정 연봉 1위
2. TOP 10 추정 연봉 합계
3. 해외파 추정 연봉 합계
4. 포지션별 최고 연봉

각 KPI 카드에는 반드시 `추정` 또는 `보도 기준` 배지를 붙인다.

---

## 7. 페이지 IA

1. Hero
2. InfoNotice: 데이터 출처와 추정값 고지
3. 체코전 2-1 승리 맥락 카드
4. 환율/보기 단위 컨트롤
5. KPI 요약 카드 4개
6. 대표팀 추정 연봉 TOP 10 표
7. 선수별 체감 금액 카드
8. 포지션별 연봉 분포 차트
9. 해외파/K리그 비교
10. 데이터 신뢰도와 한계
11. FAQ
12. 관련 리포트/계산기
13. SeoContent

---

## 8. UI 설계

### 8-1. 레이아웃

- BaseLayout 직접 사용 또는 기존 리포트 레이아웃 패턴 재사용
- pageClass: `kwss-page`
- SCSS prefix: `kwss-`
- 모바일 우선:
  - Hero
  - 경기 맥락
  - 컨트롤
  - KPI
  - 선수 카드
  - 표는 모바일에서 카드형 또는 가로 스크롤

### 8-2. 주요 컴포넌트

#### 경기 맥락 카드

- 제목: `첫 경기 2-1 승리 이후 보는 대표팀 연봉`
- 내용:
  - `2026년 6월 12일 기준 보도에 따르면 한국은 체코전에서 2-1로 승리했습니다.`
  - `이 페이지는 경기 결과를 해설하기보다, 대표팀 선수들의 보도 기준 연봉을 숫자로 환산해 보는 리포트입니다.`

#### 환율 컨트롤

- USD, EUR, GBP 입력
- 기본값은 구현일 기준 환율로 입력하되 `참고` 배지 사용
- 리셋 버튼: `기본 환율로 되돌리기`
- 공유 버튼: URL state 반영

#### 연봉 순위 표

컬럼:

- 순위
- 선수
- 포지션
- 소속팀
- 추정 연봉
- 원화 환산
- 월급
- 90분 기준
- 출처 등급

모바일:

- 순위/선수/원화 환산을 상단에 둔 카드형
- 상세값은 2열 메타 그리드

#### 선수 체감 카드

- 손흥민, 김민재, 이강인, 황희찬 등 검색 수요가 큰 선수 우선
- 카드에는 `원화 연봉`, `월급`, `일급`, `90분 기준` 4개 수치 노출
- 출처 배지는 카드 우상단

#### 차트

- Chart.js bar chart
- `포지션별 추정 연봉 합계`
- `상위 선수 원화 환산 비교`
- 차트 미로드 fallback: 동일 데이터를 표로 제공

---

## 9. 클라이언트 JS 설계

파일: `public/scripts/korea-worldcup-squad-salary-2026.js`

패턴:

- IIFE 사용
- `data-*` 기반 DOM 참조
- 입력값은 숫자 범위 검증
- URLSearchParams로 환율과 보기 단위 유지
- `innerHTML` 대신 `textContent` 사용

핵심 함수:

```js
function normalizeRate(value, fallback) {}
function convertToKrw(amount, currency, rates) {}
function buildDerivedSalary(player, rates) {}
function formatKrw(value, unitMode) {}
function sortPlayers(players, sortMode, rates) {}
function renderKpis(players, rates) {}
function renderTable(players, rates, viewMode) {}
function renderFeaturedCards(players, rates) {}
function updateChart(players, rates) {}
function syncUrlState(state) {}
```

입력 제한:

- 환율 최소값: 100
- 환율 최대값: 3000
- 음수, NaN, 빈값은 기본값으로 복구

---

## 10. SEO 설계

### 10-1. Title

`2026 대한민국 월드컵 대표팀 연봉 순위 | 비교계산소`

### 10-2. Description

`손흥민, 김민재, 이강인 등 대한민국 월드컵 대표팀 선수들의 보도 기준 추정 연봉을 원화, 월급, 일급, 경기 90분 기준으로 환산해 비교합니다.`

### 10-3. H1

`2026 대한민국 월드컵 대표팀 연봉 순위`

### 10-4. H2 후보

- `대표팀 추정 연봉 TOP 10`
- `손흥민·김민재·이강인 연봉 체감 환산`
- `포지션별 연봉은 어떻게 다를까`
- `해외파와 K리그 선수 연봉 격차`
- `이 리포트의 데이터 기준과 한계`
- `자주 묻는 질문`

### 10-5. FAQ 후보

1. `대한민국 월드컵 대표팀 연봉은 공식 자료인가요?`
   - 아니요. 일부 선수의 보도/샐러리 DB 기준 추정값이며, 공식 계약서나 실수령액이 아닙니다.
2. `손흥민 연봉은 왜 달러로 계산하나요?`
   - 소속 리그와 보도 출처가 달러 기준으로 제시되는 경우가 있어 원화 환산 시 달러 환율을 사용합니다.
3. `김민재 연봉은 세전인가요?`
   - 이 페이지는 보도 기준 세전 총액을 단순 환산합니다. 독일 세금, 보너스, 초상권 수입은 반영하지 않습니다.
4. `이강인 연봉은 왜 추정으로 표시하나요?`
   - 구단 공식 공개값이 아닌 샐러리 DB와 언론 보도 기반 값이므로 추정 배지를 붙입니다.
5. `K리그 선수 연봉도 포함하나요?`
   - 공식 또는 신뢰 가능한 공개 자료가 확인되는 선수만 포함합니다. 확인이 어려운 선수는 별도 섹션으로 분리합니다.
6. `경기 90분 기준 금액은 실제 경기 수당인가요?`
   - 아닙니다. 연봉을 시간 단위로 나눈 체감용 단순 환산입니다.
7. `환율을 바꾸면 순위도 바뀌나요?`
   - 통화가 다른 선수들을 원화로 비교하기 때문에 환율 조정에 따라 일부 순위가 바뀔 수 있습니다.

### 10-6. 관련 링크 후보

- `/reports/`
- `/tools/`
- `/reports/salary-asset-2016-vs-2026/`
- `/reports/large-company-salary-growth-by-years-2026/`
- `/tools/bonus-after-tax-calculator/`

---

## 11. SeoContent 초안 방향

intro 4문단은 아래 흐름으로 작성한다.

1. 월드컵 첫 경기 승리 후 대표팀 선수 검색 수요가 커지는 맥락
2. 연봉 데이터가 공식 공개값이 아니라 보도/샐러리 DB 기반이라는 계산 원리
3. 원화, 월급, 일급, 90분 기준 환산값을 어떻게 읽어야 하는지
4. 세금, 보너스, 광고 수입, 환율 변동, 계약 구조를 반영하지 않는 한계

필수 포함 문구:

- `이 리포트는 선수의 실제 실수령액을 추정하지 않습니다.`
- `연봉이 공개되지 않은 선수는 보도 기준 추정값 또는 확인 필요로 분리합니다.`
- `경기 90분 기준 금액은 실제 출전 수당이 아니라 체감용 단순 환산입니다.`

---

## 12. 구현 순서

1. 구현 직전 최신 출처 재확인
2. `src/data/koreaWorldcupSquadSalary2026.ts` 작성
3. `/reports/korea-worldcup-squad-salary-2026.astro` 작성
4. `public/scripts/korea-worldcup-squad-salary-2026.js` 작성
5. `_korea-worldcup-squad-salary-2026.scss` 작성
6. `src/data/reports.ts`, `src/styles/app.scss`, `public/sitemap.xml` 등록
7. `npm run build`
8. 모바일/데스크톱 시각 확인
9. 필요 시 OG 이미지 생성

---

## 13. QA 체크리스트

- [ ] 모든 금액 카드에 `추정`, `보도 기준`, `공식`, `확인 필요` 배지가 있는가?
- [ ] `공식 연봉`, `확정 연봉`, `실수령액` 표현이 없는가?
- [ ] Hero 또는 InfoNotice에 `세전 단순 환산` 고지가 있는가?
- [ ] 환율 입력에 음수, 빈값, NaN 방어가 있는가?
- [ ] 표가 모바일에서 가로 overflow 또는 카드형으로 깨지지 않는가?
- [ ] Chart.js가 실패해도 표 데이터가 보이는가?
- [ ] FAQ가 6개 이상인가?
- [ ] 관련 링크가 3개 이상인가?
- [ ] `reports.ts`, `app.scss`, `sitemap.xml` 등록이 완료됐는가?
- [ ] `npm run build`가 성공하는가?

---

## 14. 확장 아이디어

- `체코전 승리 가치 계산기`: 승리 상금, 포상금, 광고 효과를 별도 추정 리포트로 분리
- `월드컵 새벽 경기 시간 손실 계산기`: 시청 시간과 다음날 피로 비용 계산
- `월드컵 치킨값 계산기`: 조별리그부터 결승까지 시청 시 배달비 총액 계산
- `손흥민 vs 김민재 vs 이강인 연봉 체감 비교`: 검색 수요가 큰 선수만 분리한 숏폼 리포트

---

## 15. 발행 리스크

- 스포츠 연봉 데이터는 정정 가능성이 크다. 발행 후에도 주요 선수 이적/계약 보도 변경 시 업데이트가 필요하다.
- 월드컵 기간에는 경기 결과와 명단 변경이 빠르다. `updatedAt`을 눈에 띄게 표기한다.
- 과도하게 선수 개인을 평가하는 문장은 피하고, 금액 환산과 데이터 한계 중심으로 작성한다.
- 소속팀/연봉이 보도와 다르면 신뢰도 문제가 생기므로 구현 직전 최신 출처 재검증을 필수로 둔다.
