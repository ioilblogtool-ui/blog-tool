# 월드컵 우승/16강 진출 포상금 계산기 설계 문서

## 1. 문서 개요

### 1-1. 대상
- 기획 배경: 2026 월드컵 본선 진행 중(현재 조별리그, 6월 12일 체코전 2-1 승리) — "16강 가면 얼마 받아?", "우승하면 포상금 얼마?" 검색 수요가 급증하는 시점. 기존 `korea-worldcup-squad-salary-2026` 리포트(선수 연봉 비교)와 자연스럽게 연결되는 후속 콘텐츠.
- 구현 대상: 대한민국 대표팀의 월드컵 성적 단계(조별리그 탈락 ~ 우승)와 조별리그 전적을 선택하면 FIFA 협회 상금, 대한축구협회(KFA) 선수단 포상금(1인당/총액), 세후 추정 수령액을 단계별로 비교해주는 "재미형" 계산기
- 페이지 성격: `계산기형` — `SimpleToolShell` 기반, `resultFirst={true}`

### 1-2. 문서 역할
- 실제 구현 직전 수준까지 화면/데이터/계산식/구현 순서를 고정한다.
- Claude/Codex가 바로 `src/data/`, `src/pages/tools/`, `public/scripts/`, `src/styles/` 작업으로 이어갈 수 있게 한다.

### 1-3. 권장 slug
- `worldcup-prize-money-calculator`
- URL: `/tools/worldcup-prize-money-calculator/`
- 페이지 제목(가칭): `월드컵 포상금 계산기 | 16강·8강·우승 시 대표팀 포상금 얼마? 2026`

### 1-4. 권장 파일 구조
- `src/data/worldcupPrizeMoneyCalculator.ts`
- `src/pages/tools/worldcup-prize-money-calculator.astro`
- `public/scripts/worldcup-prize-money-calculator.js`
- `src/styles/scss/pages/_worldcup-prize-money-calculator.scss`
- `public/og/tools/worldcup-prize-money-calculator.png`

---

## 2. 구현 범위

### 2-1. MVP 범위
- 입력
  - 대표팀 최종 진출 단계 select: `조별리그 탈락 / 16강 / 8강 / 4강 / 준우승 / 우승` (6단계)
  - 조별리그 전적(승/무/패) — 슬라이더 또는 3개 select, 합계 3경기 고정 (기본값: 1승 0무 0패 — 6월 12일 체코전 결과 기준)
  - 환율(원/달러) — `koreaWorldcupSquadSalary2026.ts`의 `KWSS_EXCHANGE_RATES` 재사용, 기본 1,375원
  - 선수단 인원 수 — 기본 26명(고정, 참고용 안내만 노출, 입력 변경은 1차 제외)
- 핵심 출력
  - FIFA 협회 상금 (USD + 원화 환산, 대한축구협회 수령 총액)
  - KFA 선수단 포상금 1인당 추정액 (만원)
  - KFA 선수단 포상금 총액 (26인 기준, 억원)
  - 세후 추정 1인당 수령액 (기타소득세 가정 적용)
  - 한 줄 요약 카피: `"대표팀이 {단계}에 진출하면 선수 1인당 약 {N}만원의 포상금을 받을 것으로 추정됩니다"`
- 비교 출력
  - 단계별 누적 막대 그래프 (조별리그 탈락 → 우승까지 6단계, 현재 선택 단계 강조)
  - 이전 단계 대비 증가분 ("8강 진출 시 16강 대비 +1억원")
  - 손흥민 연봉(연/일급) 대비 비율 — `koreaWorldcupSquadSalary2026.ts` 데이터 연계 ("이 포상금은 손흥민 연봉의 약 N%")
- URL 파라미터로 선택 상태 공유
- SEO: `SeoContent`(소개 2문단 이상, 기준 설명, FAQ 5개, 관련 링크 3개 이상)

### 2-2. MVP 제외 범위
- 선수별 출전 경기수·기여도에 따른 차등 배분 (1차는 선수단 균등 배분 가정)
- 코칭스태프/지원 스태프 별도 포상금 트랙 (1차는 "선수단 26인" 기준만)
- 광고·CF·초상권 등 부가 수익 반영
- 8강 이상 단계의 KFA 공식 발표 수치 — 2026년 기준 공식 미발표이므로 2022년 카타르 월드컵 기준 + 단계별 증가 패턴을 적용한 **추정치**로 처리하고, 공식 발표 시 업데이트
- 동적 OG 이미지 — 1차는 고정 OG 1장

---

## 3. 페이지 목적

- "대표팀이 16강/8강/우승하면 선수들이 실제로 얼마를 받는지"를 숫자로 즉시 확인하게 한다.
- FIFA 협회 상금(국가 단위, 억 단위)과 KFA 선수단 포상금(선수 개인 단위, 천만~억 단위)을 한 화면에서 대비시켜 "협회가 받는 돈"과 "선수가 받는 돈"의 규모 차이를 체감하게 한다.
- `korea-worldcup-squad-salary-2026`(선수 연봉)과 연결해 "월드컵 포상금이 연봉에서 차지하는 비중"이라는 새로운 비교축을 제공한다.
- 조별리그 진행 중 실시간으로 바뀌는 "다음 단계 진출 시나리오"를 시뮬레이션하는 용도로 반복 방문을 유도한다.

---

## 4. 핵심 사용자 시나리오

### 4-1. "16강 가면 얼마 받아?" 실시간 관심형 사용자
- 조별리그 진행 중 검색 유입 → 기본값(현재 전적 1승 0무 0패, 16강 단계)으로 바로 결과 확인
- "8강", "우승"으로 단계를 바꿔가며 포상금 변화 체감
- 결과를 캡처/공유

### 4-2. 선수 연봉과 포상금을 비교하는 사용자
- 손흥민 연봉 대비 포상금 비율 확인 ("월드컵 포상금이 손흥민 연봉의 N%")
- `korea-worldcup-squad-salary-2026` 리포트로 이동해 다른 선수 연봉도 확인

### 4-3. FIFA 상금 규모 자체에 관심 있는 사용자
- 단계별 FIFA 협회 상금(USD/원화) 누적 그래프 확인
- 우승 시 총 상금 규모($50M)와 한국 대표팀이 받을 수 있는 최대 추정 금액 확인

---

## 5. 입력값 / 출력값 정의

### 5-1. 입력값

#### 필수 입력
- `finalStage`
  - `"GROUP_OUT" | "ROUND16" | "QUARTER" | "SEMI" | "FINAL" | "WINNER"`
  - 기본값: `"ROUND16"`
  - 라벨: `조별리그 탈락 / 16강 / 8강 / 4강 / 준우승 / 우승`
- `groupStageRecord`
  - `{ wins: number; draws: number }` — `losses = 3 - wins - draws`로 자동 계산, `wins + draws <= 3`
  - 기본값: `{ wins: 1, draws: 0 }` (2026-06-12 체코전 2-1 승리 기준)
  - UI: 승/무 각각 0~3 select 또는 스테퍼, 합계 초과 시 자동 보정
- `exchangeRate`
  - 단위: 원/달러, 기본값 1,375 (`KWSS_EXCHANGE_RATES`의 `USD.krwRate` 재사용)
  - 슬라이더 1,200~1,500 범위

#### 선택 입력 (1차는 고정값, UI 노출은 안내 텍스트로만)
- `squadSize = 26` (FIFA 월드컵 등록 엔트리 기준, 고정)

### 5-2. 출력값

#### 메인 출력 (결과 우선 카드, `resultFirst=true`)
- 한 줄 요약 카피: `"대표팀이 {stageLabel}에 진출하면 선수 1인당 약 {perPlayerM}만원의 포상금을 받을 것으로 추정됩니다"`
- FIFA 협회 상금 (USD, 원화 환산 — 억원 단위)
- KFA 선수단 포상금 1인당 (만원, 기본 포상금 + 경기 승/무 보너스 + 단계 진출 보너스 합산)
- KFA 선수단 포상금 총액 (26인 기준, 억원)
- 세후 추정 1인당 수령액 (만원)

#### 보조 출력
- 이전 단계 대비 증가분 (1인당 포상금 기준, "+N만원")
- 손흥민 연봉(연봉/일급) 대비 비율 (%)
- 경기 승/무 보너스 합계 (1인당, 만원)
- 단계 진출 보너스 (1인당, 만원)

#### 탐색 출력
- 단계별 누적 막대 그래프 (조별리그 탈락 → 우승, 1인당 포상금 기준, 현재 선택 단계 강조)
- 단계별 비교 표 (단계명 / FIFA 상금 / 1인당 포상금 / 세후 1인당)
- 관련 링크 (`korea-worldcup-squad-salary-2026`, `bonus-after-tax-calculator`, `salary-tier`)

---

## 6. 섹션 구조 (IA)

### 6-1. 전체 IA
1. `CalculatorHero`
2. `InfoNotice` (추정치·출처·세전/세후 고지)
3. 입력 영역 — 진출 단계 select + 조별리그 전적 + 환율 슬라이더
4. 결과 우선 카드 (`resultFirst`)
   - 핵심 요약 카드 (한 줄 카피 + FIFA 상금 + 1인당 포상금 + 세후 추정)
   - 포상금 구성 막대 그래프 (단계별 누적)
5. 포상금 구성 상세 카드 (기본 포상금 / 경기 보너스 / 단계 보너스 분해)
6. 손흥민 연봉 대비 비교 카드
7. 단계별 비교 표
8. `SeoContent` (소개, 기준 설명, FAQ, 관련 링크)

### 6-2. 모바일 우선 화면 순서
- Hero → InfoNotice → 입력(단계/전적/환율) → 핵심 요약 카드 → 막대 그래프 → 포상금 구성 상세 → 손흥민 비교 → 단계별 비교 표 → SEO

### 6-3. PC 레이아웃
- 입력 영역: 1행 3열 (진출 단계 / 조별리그 전적 / 환율)
- 결과 영역: `좌: 핵심 요약 카드`, `우: 막대 그래프` 2열
- 포상금 구성 상세: 3열 카드 (기본/경기보너스/단계보너스)
- 단계별 비교 표: PC 4열(단계/FIFA 상금/1인당 포상금/세후 1인당), 모바일은 카드형

### 6-4. 섹션별 역할

#### Hero
- eyebrow: `2026 월드컵 포상금`
- H1 예시: `월드컵 포상금 계산기 — 16강·8강·우승하면 선수는 얼마를 받을까`
- 설명: 대표팀 성적 단계를 고르면 FIFA 협회 상금과 선수단 포상금을 바로 보여준다는 점 안내

#### InfoNotice
- 필수 문구
  - FIFA 협회 상금은 2026 월드컵 공식 발표(총 상금 약 8.71억 달러) 기준이며, 단계별 금액은 보도 자료 기준 참고값
  - KFA 선수단 포상금은 2022 카타르 월드컵 기준(16강 1인당 1억원, 8강 시 2억원)을 참고했고, 4강 이상 단계는 공식 미발표로 단계별 증가 패턴을 적용한 **추정치**
  - 세후 추정액은 포상금을 기타소득(22% 원천징수)으로 가정한 단순 계산이며 실제 과세 방식과 다를 수 있음
  - 선수단 26인 균등 배분 가정이며, 실제로는 코칭스태프 포함 배분, 출전 기여도별 차등 등 다양한 변수가 있음

#### 입력 영역
- 진출 단계 select (6단계)
- 조별리그 전적: 승/무 각각 select(0~3), 패는 자동 표시
- 환율 슬라이더: 1,200~1,500원, 기본 1,375원
- 입력 변경 시 결과 영역 즉시 갱신

#### 핵심 요약 카드
- 큰 글씨 한 줄 카피
- 보조 수치: FIFA 협회 상금(원화 억 단위), 1인당 포상금(만원), 세후 1인당(만원)
- 이전 단계 대비 증가분 배지

#### 포상금 구성 막대 그래프
- 6단계(조별리그 탈락~우승) 1인당 포상금 누적 막대
- 현재 선택 단계 하이라이트, FIFA 협회 상금(국가 단위)은 보조 라인으로 별도 표시(스케일 차이 큼 → 우측 axis 또는 별도 카드)

#### 포상금 구성 상세 카드
- 기본 포상금(2,000만원, 고정)
- 경기 승/무 보너스 (`wins × 3,000만 + draws × 1,000만`)
- 단계 진출 보너스 (`STAGE_BONUS_TABLE[finalStage]`)
- 합계 = 위 3가지 합

#### 손흥민 연봉 대비 비교 카드
- `koreaWorldcupSquadSalary2026.ts`의 손흥민 연봉(USD) → 원화 환산(같은 환율 입력 재사용) → 연봉/365 = 일급
- "이번 포상금은 손흥민 연봉의 약 N%, 일급의 약 N배"

#### 단계별 비교 표
- 6단계 × (FIFA 협회 상금 / 1인당 포상금 / 세후 1인당)
- 현재 선택 단계 행 하이라이트

#### SeoContent
- intro 2~3문단: 기획 배경(월드컵 포상금에 대한 궁금증), 데이터 출처 요약(FIFA 공식 발표 + KFA 2022 기준 추정)
- criteria: FIFA 상금 기준, KFA 포상금 기준(2022 참고 + 추정 단계 명시), 세후 추정 기준, 예시 2개
- faq: 5개
- related: `korea-worldcup-squad-salary-2026`, `bonus-after-tax-calculator`, `salary-tier`

---

## 7. 컴포넌트 구조

### 7-1. 공용 컴포넌트
- `BaseLayout`, `SiteHeader`, `CalculatorHero`, `InfoNotice`, `SeoContent`
- `SimpleToolShell` (`resultFirst={true}`)
- `chart-config.js`의 막대 그래프 공통 옵션 재사용

### 7-2. 페이지 전용 블록 (prefix: `wpm-`)
- `wpm-input-row` — 진출 단계 / 조별리그 전적 / 환율 입력 1행
- `wpm-summary-card` — 핵심 요약 카드 (한 줄 카피 + 수치 + 증가분 배지)
- `wpm-stage-chart` — 단계별 누적 막대 그래프 캔버스
- `wpm-breakdown-grid` — 포상금 구성 상세 3카드
- `wpm-son-compare-card` — 손흥민 연봉 대비 비교 카드
- `wpm-stage-table` — 단계별 비교 표

### 7-3. Astro 페이지 구성 방식
- `.astro`에서 기본값(16강, 1승 0무, 환율 1,375)으로 1회 서버사이드 계산 후 초기 마크업 렌더
- `script[type="application/json"]`(`worldcupPrizeMoneyConfig`)로 `FIFA_PRIZE_TABLE`, `KFA_BONUS_TABLE`, `STAGE_ORDER`, `KWSS_EXCHANGE_RATES`(달러 항목), 손흥민 연봉 정보(`KWSS_PLAYERS`에서 `son-heung-min` 항목 축약) 전달
- `public/scripts/worldcup-prize-money-calculator.js`에서 입력 변경 → 계산 → 렌더 → URL 동기화
- 1차는 Astro 컴포넌트 분리 없이 페이지 내부 마크업으로 시작 (`couple-salary-rank-calculator` 패턴과 동일)

---

## 8. 상태 관리

### 8-1. 클라이언트 상태
```ts
type FinalStage = "GROUP_OUT" | "ROUND16" | "QUARTER" | "SEMI" | "FINAL" | "WINNER";

type ViewState = {
  finalStage: FinalStage;
  groupWins: number;   // 0~3
  groupDraws: number;  // 0~3, groupWins + groupDraws <= 3
  exchangeRate: number; // 원/달러
};
```

### 8-2. 초기값
- `finalStage = "ROUND16"`
- `groupWins = 1`
- `groupDraws = 0`
- `exchangeRate = 1375`

### 8-3. 동작 규칙
- `finalStage` 변경 시
  - `STAGE_ORDER`에서의 인덱스를 기준으로 FIFA 상금/단계 보너스를 즉시 재조회
  - "이전 단계 대비 증가분"은 `STAGE_ORDER[currentIndex - 1]`과의 차이로 계산 (조별리그 탈락이면 증가분 카드 숨김)
- `groupWins`/`groupDraws` 변경 시
  - `groupWins + groupDraws > 3`이면 `groupDraws = 3 - groupWins`로 자동 보정
  - 경기 보너스만 재계산 (단계 보너스는 영향 없음)
- `exchangeRate` 변경 시
  - FIFA 상금 원화 환산, 손흥민 비교 카드 모두 재계산
- URL 파라미터 동기화
  - `stage`(finalStage), `gw`(groupWins), `gd`(groupDraws), `fx`(exchangeRate)

예시:
```txt
/tools/worldcup-prize-money-calculator/?stage=ROUND16&gw=1&gd=0&fx=1375
```

---

## 9. 계산 로직

### 9-1. FIFA 협회 상금 (USD → 원화)
```ts
const fifaPrizeUsd = FIFA_PRIZE_TABLE[finalStage]; // USD
const fifaPrizeKrw = fifaPrizeUsd * exchangeRate;  // 원
```

### 9-2. KFA 선수단 포상금 1인당 (만원)
```ts
const baseBonus = KFA_BASE_BONUS_M; // 2,000(만원), 고정
const matchBonus = groupWins * KFA_WIN_BONUS_M + groupDraws * KFA_DRAW_BONUS_M; // 승 3,000 / 무 1,000
const stageBonus = KFA_STAGE_BONUS_M[finalStage]; // 단계별 누적 보너스(만원)

const perPlayerBonusM = baseBonus + matchBonus + stageBonus;
```
- `KFA_STAGE_BONUS_M["GROUP_OUT"] = 0`이며, 조별리그 탈락 시에도 `baseBonus + matchBonus`는 지급된다고 가정 (2022 기준 문구 "기본 포상금 2천만원에 경기마다 승리 시 3천만원..." 적용)

### 9-3. 선수단 총액 (26인 기준, 억원)
```ts
const squadTotalBonusM = perPlayerBonusM * SQUAD_SIZE; // 만원
const squadTotalBonusEok = squadTotalBonusM / 10000;   // 억원
```

### 9-4. 세후 추정 1인당 (기타소득세 단순 가정)
```ts
const OTHER_INCOME_TAX_RATE = 0.22; // 기타소득 22%(소득세 20% + 지방소득세 2%) 단순 가정
const perPlayerAfterTaxM = Math.round(perPlayerBonusM * (1 - OTHER_INCOME_TAX_RATE));
```
- InfoNotice/FAQ에 "실제로는 비과세·증여세 등 적용 방식이 다를 수 있는 단순 추정"임을 명시

### 9-5. 이전 단계 대비 증가분
```ts
const idx = STAGE_ORDER.indexOf(finalStage);
const prevStage = idx > 0 ? STAGE_ORDER[idx - 1] : null;
const deltaPerPlayerM = prevStage
  ? perPlayerBonusM - computePerPlayerBonus(prevStage, groupWins, groupDraws)
  : null;
```

### 9-6. 손흥민 연봉 대비 비율
```ts
// koreaWorldcupSquadSalary2026.ts의 son-heung-min: salaryAmount(USD) 11,200,000
const sonAnnualKrw = SON_SALARY_USD * exchangeRate;
const sonDailyKrw = sonAnnualKrw / 365;

const bonusVsSonAnnualPct = (perPlayerBonusM * 10000 / sonAnnualKrw) * 100;
const bonusVsSonDailyRatio = (perPlayerBonusM * 10000) / sonDailyKrw;
```

### 9-7. 단계별 비교 표 사전 계산
- `STAGE_ORDER` 6단계 각각에 대해 9-1~9-4 계산을 클라이언트 첫 렌더 시 일괄 계산해 표/그래프에 사용
- 단계 보너스(`KFA_STAGE_BONUS_M`)는 현재 `groupWins`/`groupDraws` 기준 경기 보너스를 더해 "해당 단계까지 진출했을 때의 1인당 총 포상금"으로 표시

---

## 10. 데이터 파일 구조

### 10-1. 메인 데이터 파일 구조
```ts
// src/data/worldcupPrizeMoneyCalculator.ts

export type FinalStage = "GROUP_OUT" | "ROUND16" | "QUARTER" | "SEMI" | "FINAL" | "WINNER";

export interface StageOption {
  code: FinalStage;
  label: string;       // "조별리그 탈락" 등
  shortLabel: string;   // "조별리그", "16강" 등 (그래프/표 라벨용)
}

export const WPM_META = {
  slug: "worldcup-prize-money-calculator",
  title: "월드컵 포상금 계산기",
  subtitle: "대표팀 성적 단계별 FIFA 협회 상금과 선수단 포상금을 비교합니다.",
  methodology:
    "FIFA 협회 상금은 2026 월드컵 공식 발표(총 상금 약 8.71억 달러) 기준이며, KFA 선수단 포상금은 2022 카타르 월드컵 기준(16강 1인당 1억원, 8강 2억원)을 참고한 추정치입니다. 4강 이상 단계는 공식 미발표로 단계별 증가 패턴을 적용한 추정값입니다.",
  caution:
    "실제 포상금 지급 기준, 세금, 선수단 배분 방식은 대한축구협회 공식 발표와 다를 수 있는 참고용 추정입니다.",
  updatedAt: "2026년 6월 기준",
};

export const STAGE_ORDER: StageOption[] = [
  { code: "GROUP_OUT", label: "조별리그 탈락", shortLabel: "조별리그" },
  { code: "ROUND16",   label: "16강",         shortLabel: "16강" },
  { code: "QUARTER",   label: "8강",          shortLabel: "8강" },
  { code: "SEMI",      label: "4강",          shortLabel: "4강" },
  { code: "FINAL",     label: "준우승",        shortLabel: "준우승" },
  { code: "WINNER",    label: "우승",          shortLabel: "우승" },
];

// FIFA 협회 상금 (단위: USD) — 2026 월드컵 공식 발표 기준(참가 준비금 250만 달러 포함)
export const FIFA_PRIZE_TABLE: Record<FinalStage, number> = {
  GROUP_OUT: 9_000_000,
  ROUND16:   17_500_000,
  QUARTER:   19_000_000,
  SEMI:      27_000_000, // 4위 기준
  FINAL:     33_000_000, // 준우승
  WINNER:    50_000_000,
};

// KFA 선수단 포상금 — 1인당 기본/경기 보너스 (단위: 만원), 2022 카타르 월드컵 기준
export const KFA_BASE_BONUS_M = 2000;  // 기본 포상금
export const KFA_WIN_BONUS_M = 3000;   // 경기 승리 시
export const KFA_DRAW_BONUS_M = 1000;  // 경기 무승부 시

// KFA 선수단 포상금 — 단계 진출 보너스 (1인당, 단위: 만원, 누적액)
// GROUP_OUT/ROUND16/QUARTER: 2022 카타르 월드컵 보도 기준
// SEMI/FINAL/WINNER: 공식 미발표, 단계별 증가 패턴을 적용한 추정치
export const KFA_STAGE_BONUS_M: Record<FinalStage, number> = {
  GROUP_OUT: 0,
  ROUND16:   10000, // 1억원
  QUARTER:   20000, // 2억원
  SEMI:      30000, // 추정: 3억원
  FINAL:     40000, // 추정: 4억원
  WINNER:    60000, // 추정: 6억원
};

export const SQUAD_SIZE = 26; // FIFA 월드컵 등록 엔트리 기준
export const OTHER_INCOME_TAX_RATE = 0.22; // 기타소득 단순 가정(소득세 20% + 지방소득세 2%)

// 손흥민 비교용 (koreaWorldcupSquadSalary2026.ts와 동일 출처/금액 — 갱신 시 두 파일 모두 확인)
export const SON_HEUNGMIN_SALARY_USD = 11_200_000;

export const WPM_FAQ: PageFaqItem[] = [
  // 5개 — 12장 참고
];

export const WPM_RELATED_LINKS = [
  { href: "/reports/korea-worldcup-squad-salary-2026/", label: "2026 대한민국 월드컵 대표팀 연봉 순위" },
  { href: "/tools/bonus-after-tax-calculator/", label: "성과급 세후 계산기" },
  { href: "/tools/salary-tier/", label: "연봉 티어 계산기" },
];
```

### 10-2. 데이터 운영 규칙
- `FIFA_PRIZE_TABLE`은 FIFA 공식 발표(2026 월드컵 총 상금 8.71억 달러) 보도 기준이며, 향후 공식 수치 변경 시 이 테이블만 갱신한다.
- `KFA_STAGE_BONUS_M`의 `SEMI`/`FINAL`/`WINNER` 값은 **추정치**임을 데이터 파일 주석 + InfoNotice + SeoContent에 모두 명시한다. 대한축구협회가 2026 대회 포상금을 공식 발표하면 해당 값을 우선 교체한다.
- `SON_HEUNGMIN_SALARY_USD`는 `koreaWorldcupSquadSalary2026.ts`의 `KWSS_PLAYERS`(`son-heung-min`)와 동일 출처/금액을 유지한다. 둘 중 하나가 갱신되면 다른 파일도 함께 확인한다 (중복 데이터지만, 두 페이지의 독립적 운영을 위해 분리 — 추후 공용 상수 모듈로 추출 검토 가능).
- 환율 프리셋은 `koreaWorldcupSquadSalary2026.ts`의 `KWSS_EXCHANGE_RATES`에서 `USD` 항목(`krwRate: 1375`)을 그대로 재사용(import)한다.

### 10-3. 등록 파일
- 메인 데이터: `src/data/worldcupPrizeMoneyCalculator.ts`
- 도구 등록: `src/data/tools.ts` (카테고리: `스포츠`)
- 사이트맵: `public/sitemap.xml`

---

## 11. 구현 순서

### 11-1. 1단계: 데이터 파일 작성
- `src/data/worldcupPrizeMoneyCalculator.ts` 생성
- `FIFA_PRIZE_TABLE`, `KFA_STAGE_BONUS_M`, `STAGE_ORDER`, `WPM_META`, `WPM_FAQ`, `WPM_RELATED_LINKS` 작성
- `koreaWorldcupSquadSalary2026.ts`에서 환율/손흥민 연봉 import

### 11-2. 2단계: 도구 페이지 생성
- `src/pages/tools/worldcup-prize-money-calculator.astro`
- `SimpleToolShell resultFirst={true}` 기반
- 섹션: Hero → InfoNotice → 입력 영역 → 결과 카드(요약/그래프) → 포상금 구성 상세 → 손흥민 비교 → 단계별 비교 표 → SeoContent

### 11-3. 3단계: 스크립트 구현
- `public/scripts/worldcup-prize-money-calculator.js`
- 담당 기능: 입력 동기화, 계산(9장 로직), 결과 렌더, 막대 그래프 렌더(Chart.js), URL 파라미터 동기화

### 11-4. 4단계: 스타일 작성
- `src/styles/scss/pages/_worldcup-prize-money-calculator.scss`
- `src/styles/app.scss`에 import 추가
- 확인 포인트: 입력 1행 3열 → 모바일 1열, 단계별 비교 표 → 모바일 카드 전환, 그래프 라벨 겹침

### 11-5. 5단계: 등록 및 SEO 마무리
- `src/data/tools.ts`에 등록 (카테고리: `스포츠`, `kbo-salary-calculator` 인접 순서)
- `public/sitemap.xml` 추가
- `SeoContent` (intro 2~3문단, criteria, faq 5개, related 3개)
- OG 이미지 생성 (`npm run og:generate`)

### 11-6. 6단계: 빌드/배포 점검
- `npm run build` 통과 확인
- `DEPLOY_CHECKLIST.md` 기준 점검

---

## 12. QA 체크포인트

### 12-1. 데이터
- [ ] `STAGE_ORDER` 6단계와 `FIFA_PRIZE_TABLE`/`KFA_STAGE_BONUS_M` 키가 모두 일치하는지 확인
- [ ] `groupWins + groupDraws <= 3` 제약이 UI/계산 양쪽에서 보정되는지 확인
- [ ] `SEMI`/`FINAL`/`WINNER` 단계의 "추정치" 라벨이 표/그래프/SeoContent에 모두 노출되는지 확인
- [ ] 환율 변경 시 FIFA 상금·손흥민 비교 카드가 함께 재계산되는지 확인

### 12-2. UI
- [ ] 진출 단계 변경 시 핵심 요약 카드·그래프·구성 상세·비교 표가 모두 갱신되는지 확인
- [ ] "조별리그 탈락" 선택 시 증가분 배지가 숨겨지는지 확인
- [ ] 단계별 비교 표에서 현재 선택 단계 행이 하이라이트되는지 확인
- [ ] 그래프 모바일에서 6단계 라벨 겹침 없음
- [ ] 세후 추정값이 세전값보다 항상 작은지 확인 (0 이하 방지)

### 12-3. SEO / 운영
- [ ] `tools.ts` 등록 및 `/tools/` 목록 노출 확인 (카테고리: 스포츠)
- [ ] `sitemap.xml` 반영
- [ ] `SeoContent` FAQ 5개 + JSON-LD
- [ ] InfoNotice에 "추정/참고" 문구 및 출처(FIFA 공식 발표, 2022 KFA 보도) 명시
- [ ] 관련 링크: `korea-worldcup-squad-salary-2026`, `bonus-after-tax-calculator`, `salary-tier` 3개
- [ ] `npm run build` 통과

---

## 13. 구현 메모

### 13-1. 페이지 포지션
- `korea-worldcup-squad-salary-2026`(선수 연봉 비교)의 후속/연계 콘텐츠로, "연봉"에서 "포상금"으로 화제를 확장한다.
- 조별리그~결승까지 대회 기간 내내 "현재 전적 기준 다음 단계 시나리오"로 반복 소비될 수 있는 시의성 콘텐츠.

### 13-2. 기존 페이지와의 관계
- `korea-worldcup-squad-salary-2026`: 손흥민 연봉 대비 비교 카드에서 "선수 연봉이 궁금하면" 형태로 연결
- `bonus-after-tax-calculator`: 세후 추정 카드에서 "내 보너스 세후 계산은?" 형태로 연결
- `salary-tier`: 1인당 포상금 규모를 일반 직장인 연봉과 비교하는 동선으로 연결 가능

### 13-3. 구현 우선순위
1. 데이터 파일(`worldcupPrizeMoneyCalculator.ts`) 작성 — 특히 `KFA_STAGE_BONUS_M`의 추정치 라벨링과 출처 문구 검수
2. 입력 + 핵심 요약 카드 + 단계별 누적 그래프 (메인 흐름)
3. 포상금 구성 상세 + 손흥민 비교 카드
4. 단계별 비교 표
5. SEO/등록/스타일 마무리

### 13-4. 확장 방향
- 대한축구협회 2026 공식 포상금 발표 시 `KFA_STAGE_BONUS_M`(SEMI/FINAL/WINNER) 갱신
- 코칭스태프 포함 배분 비율 옵션 추가
- 다른 종목(올림픽, 아시안게임 등) 포상금 비교로 확장한 별도 콘텐츠 시리즈 검토
- 대회 진행 중 실제 한국 대표팀의 조별리그 결과가 확정되면 `groupWins`/`groupDraws` 기본값을 실제 결과로 업데이트

---

## 부록: 참고 출처

- FIFA 2026 월드컵 총 상금 8.71억 달러, 단계별 상금(우승 5,000만/준우승 3,300만/3위 2,900만/4위 2,700만/8강 1,900만/16강 1,750만/32강 1,350만/조별리그 900만 달러): [The Big Lead](https://www.thebiglead.com/fifa-world-cup-prize-money-payout-breakdown-for-2026-tournament/), [Bleacher Report](https://bleacherreport.com/articles/25435805-world-cup-2026-prize-money-complete-purse-and-earnings-info-fifa-tournament)
- 2022 카타르 월드컵 KFA 선수단 포상금(기본 2천만원 + 승리 3천만원/무승부 1천만원, 16강 1억원, 8강 2억원): [MBC뉴스](https://imnews.imbc.com/news/2022/sports/article/6433016_35701.html), [헤럴드경제](https://biz.heraldcorp.com/article/3012746)
