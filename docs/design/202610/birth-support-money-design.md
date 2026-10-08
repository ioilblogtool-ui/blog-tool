# 2027 출산지원금 계산기 설계서 (`birth-support-money` 개선)

> 작성일: 2026-10-07
> 기획 원문: [docs/plan/202610/birth-support-money.md](../../plan/202610/birth-support-money.md)
> 이전 설계: [docs/design/202605/birth-support-money-design.md](../202605/birth-support-money-design.md) (참고만, 이 문서가 우선)
> 문서 상태: 설계 작성 완료 / 정책 상태: **재확인 필요**
> 구현·테스트·빌드·커밋·배포는 수행하지 않았다. 정책 수치는 기획서 3번의 2026-10-07 공식자료 조사를 기준으로 하며, 이 설계 작업에서 정책을 새로 검증하지 않았다.

## 1. 문서 개요

| 항목 | 결정 |
|---|---|
| slug / URL | `birth-support-money` / `/tools/birth-support-money/` 유지 |
| 콘텐츠 유형 | 계산기, `TimelineToolShell` 유지 |
| 핵심 질문 | 2027년에 아이를 낳으면 정부에서 얼마를 받을 수 있나? |
| 체계 분기 | 출생일 `≤ 2027-06-30` → 현행(첫만남이용권·부모급여·아동수당), `≥ 2027-07-01` → 개편안(아이맞이지원금·아동기본수당) 적용 예정 |
| 중앙/지자체 | 중앙정부 예상 지원금과 지자체 추가 지원금을 분리 계산·표시 |
| 배지 | `공식` / `참고` / `시뮬레이션` / `추정` 4종만 |
| 신규 의존성 | 없음. Chart.js CDN·`url-state.js`·`chart-config.js` 기존 그대로 |
| 범위 밖 | `birth-support-total` 301 통합(기획 10-2, 별도 승인), `baby-government-support` 오류 수정, 시군구 전체 지자체 데이터, 다태아 계산 |

### 1-1. 관련 문서와 역할 분담

같은 날 작성된 [2027 출산·육아 지원제도 변경 리포트 기획](../../plan/202610/childbirth-benefits-changes-2027.md)·[설계](./childbirth-benefits-changes-2027-design.md)는 이 계산기를 주 CTA로 사용한다.

| 페이지 | 담당 검색 의도 | 상호 연결 |
|---|---|---|
| `/tools/birth-support-money/` (이 문서) | 2027 출산지원금 · 우리 집 예상 금액 | 리포트 존재 확인 시 `related`에 추가 |
| `/reports/childbirth-benefits-changes-2027/` (미생성) | 2027 부모급여·아동수당 · 무엇이 바뀌나 | 이 계산기 구현·검증 후 리포트 CTA 문구를 “2027 출산지원금 계산기로 확인”으로 변경 가능 |

리포트 설계는 계산기의 2027 기능이 검증되기 전까지 “기존 제도 기준” 문구를 쓰도록 되어 있다. 이 계산기 배포 후 리포트 작업자에게 문구 전환 조건 충족 여부를 알린다.

### 1-2. 현재 코드에서 확인한 사실

| 위치 | 현재 상태 | 설계 처리 |
|---|---|---|
| `src/data/birthSupportMoney.ts` | `DataBadge`에 `확인 필요` 포함, 정책 4개 고정, 지역 5개(금액 확인 1곳) | 타입·배지 교체, 현행/개편안 분리, sources·verified 추가 |
| `public/scripts/birth-support-money.js` | 계산·렌더 한 파일. 아동수당 월 10만원 일괄, 양육 방식·다태아 계산 미반영, 출생일 기본값 오늘, `innerHTML`로 표 렌더 | 순수 계산 모듈 분리, 체계 분기, 빈 출생일 상태, DOM API 렌더 |
| `src/pages/tools/birth-support-money.astro` | `ogImage`가 `birth-support-total.png`, `jsonLd` FAQPage 직접 생성, 계산 버튼 존재 | OG 교체, FAQ 스키마 유지, 버튼 제거 |
| `src/components/SeoContent.astro` | props `introTitle·intro·inputPoints·criteria·faq·related`, FAQ 타입 `{question, answer}`, **FAQ 구조화 데이터 미출력** | 컴포넌트 수정 없음. FAQPage는 페이지 `jsonLd`에서만 생성 |
| `src/layouts/BaseLayout.astro` | props `title·description·ogImage·jsonLd·recordSessions·loadAds` | 실제 props만 사용 |
| `TimelineToolShell.astro` | slots `hero·actions·aside·(default)·timeline·seo` | 기존 slot 배치 유지 |
| `public/scripts/url-state.js` | `readParam`·`readBool`·`writeParams` (replaceState) | 재사용. v2 파라미터 계약 추가 |
| `src/styles/app.scss` | `@use "scss/pages/birth-support-money";` 존재 | 변경 없음 |
| `scripts/generate-og-tools.py` | `birth-support-total` 항목만 있고 `birth-support-money` 없음 | 항목 추가 |

---

## 2. 파일 구조와 변경 범위

| 파일 | 구분 | 책임 |
|---|---|---|
| `src/data/birthSupportMoney.ts` | 수정(전면) | 정책 원자료·출처·검증 여부·지역·시나리오 기대값·메타·intro·FAQ·링크 |
| `public/scripts/birth-support-money-core.js` | **신규** | DOM 없는 순수 계산 함수(체계 판정·월별 행·합계·비교·배지·URL 파싱) |
| `public/scripts/birth-support-money.js` | 수정(전면) | 입력 읽기·상태·렌더·차트·URL 동기화·이벤트 |
| `src/pages/tools/birth-support-money.astro` | 수정 | 마크업·메타·정적 시나리오 표·SeoContent |
| `src/styles/scss/pages/_birth-support-money.scss` | 수정 | 배너·비교 카드·배지 4종·빈 상태·오류 |
| `scripts/check-birth-support-money.mjs` | **신규** | 시나리오·경계값·URL·배지·콘텐츠 길이·금지 표현 자동 검증 |
| `src/data/tools.ts` | 수정 | 기존 항목 title·description만 갱신 |
| `src/pages/tools/index.astro` | 수정 | 요약 문구(270행) 갱신 |
| `public/sitemap.xml` | 수정 | 기존 `<url>`에 `lastmod` 갱신만 |
| `scripts/generate-og-tools.py` | 수정 | `birth-support-money` 항목 추가 |
| `public/og/tools/birth-support-money.png` | 신규 | 1200×630 |
| `docs/sheets/page_inventory_2026-10-07.csv` | 수정(구현 후) | 기획·설계 경로, 최종수정일 |

변경하지 않는 것: `src/pages/index.astro`의 `topicBySlug`(`육아휴직·출산` 유지), `src/styles/app.scss`, `SeoContent.astro`, `BaseLayout.astro`, `birth-support-total` 관련 파일 전체.

---

## 3. 데이터 파일 설계 (`src/data/birthSupportMoney.ts`)

### 3-1. 타입

```ts
export type DataBadge = '공식' | '참고' | '시뮬레이션' | '추정';
export type SystemId = 'current' | 'reform2027';
export type BirthOrder = 1 | 2 | 3;                       // 3 = 셋째 이상
export type RegionTier = 'capital' | 'nonCapital' | 'depopPreferred' | 'depopSpecial';
export type PreferredChoice = 'no' | 'yes' | 'unknown';   // 개편안 우대지역 여부
export type CareMode = 'home' | 'daycare' | 'switch12';    // switch12 = 12개월부터 어린이집
export type PeriodMonths = 12 | 24 | 156;

export interface PolicySource {
  id: string;
  org: string;            // '보건복지부' 등
  title: string;
  url: string;
  publishedAt: string;    // YYYY-MM-DD
  checkedAt: string;      // 2026-10-07
}

export interface MoneyCell {
  amount: number;         // 원, 정수
  badge: DataBadge;       // 원자료 성격: 대부분 '공식', 보육료는 '참고'
  verified: boolean;      // 원문 직접 대조 여부
  sourceId: string;
  note?: string;
}

export interface BsmConfig {
  schemaVersion: 2;
  checkedAt: '2026-10-07';
  reformCutoff: '2027-07-01';
  birthDateRange: { min: '2026-01-01'; max: '2028-12-31' };
  sources: Record<string, PolicySource>;
  current: {
    firstMeeting: Record<BirthOrder, MoneyCell>;                 // 200만/300만/300만
    parentBenefit: { age0: MoneyCell; age1: MoneyCell };        // 100만/50만
    daycareFee: { age0: MoneyCell; age1: MoneyCell };           // 54만/47.5만, badge '참고'
    childAllowance: Record<RegionTier, MoneyCell>;              // 10만/10.5만/11만/12만
  };
  reform2027: {
    welcomeGrant: Record<BirthOrder, MoneyCell>;                // 1,000/1,200/1,500만
    welcomeGrantPreferredAddon: MoneyCell;                      // 500만
    welcomeGrantInstallments: { months: number[]; verified: false }; // [0,3,6,9]
    childBasicAllowance: MoneyCell;                             // 20만
    childBasicAllowancePreferredAddon: MoneyCell;               // 10만 (30만-20만)
    homeCareAddon: MoneyCell & { untilMonth: 23 };              // 30만, 0~23개월
  };
  longTermMonths: 156;                                          // 만 13세 미만
  pending: PendingCheck[];                                      // 기획 3-4의 10개
}

export interface PendingCheck {
  id: number;             // 1~10
  label: string;          // '우대지역 범위' 등
  status: string;         // 조사 상태 문장
  uiImpact: string;       // 미확정 시 화면 처리
}
```

- 금액은 원 단위 정수로 저장하고 런타임에서 비율·곱셈으로 원자료를 재생성하지 않는다.
- `verified:false` 셀도 금액은 공식 발표값이면 저장하되, 그 셀이 들어간 합계의 배지 결정에 사용한다(5-5).
- 우대지역 아동기본수당은 발표값 “월 30만원”을 `20만 + 가산 10만`으로 분해 저장하고 `note`에 원문 표현을 기록한다.

### 3-2. 초기 원자료 명세

| 키 | 금액(원) | badge | verified | sourceId | 비고 |
|---|---:|---|---|---|---|
| current.firstMeeting.1 | 2,000,000 | 공식 | true | `korea-2024-infant-support` | 바우처 |
| current.firstMeeting.2 / .3 | 3,000,000 | 공식 | true | 동일 | 둘째 이상 |
| current.parentBenefit.age0 / age1 | 1,000,000 / 500,000 | 공식 | true | `korea-parent-benefit` | 현금 |
| current.daycareFee.age0 / age1 | 540,000 / 475,000 | 참고 | false | `project-bgs-daycare` | 프로젝트 기존 값, 2027 단가 미고시 |
| current.childAllowance.capital | 100,000 | 공식 | true | `mohw-2026-child-allowance` | |
| current.childAllowance.nonCapital | 105,000 | 공식 | true | 동일 | |
| current.childAllowance.depopPreferred | 110,000 | 공식 | true | 동일 | |
| current.childAllowance.depopSpecial | 120,000 | 공식 | true | 동일 | 상품권 수령 시 +1만원은 미반영(문장 안내) |
| reform2027.welcomeGrant.1 / .2 / .3 | 10,000,000 / 12,000,000 / 15,000,000 | 공식 | true | `mohw-2026-08-28` | 예산안 |
| reform2027.welcomeGrantPreferredAddon | 5,000,000 | 공식 | true | 동일 | |
| reform2027.welcomeGrantInstallments | months `[0,3,6,9]` 균등 | - | false | 동일 | “분기별 4회”만 확인 |
| reform2027.childBasicAllowance | 200,000 | 공식 | true | 동일 | 현금 10만+상품권 10만 |
| reform2027.childBasicAllowancePreferredAddon | 100,000 | 공식 | true | 동일 | 현금·상품권 비율 미확인 |
| reform2027.homeCareAddon | 300,000 | 공식 | true | 동일 | 지급 수단·전환 요건 미확인 |

`sources`에는 기획서 3-1 표의 6개 자료(복지부 2026-08-28 보도자료, 정책브리핑 3건, 복지부 아동수당 확대 보도자료, 부모급여 차액 지급 안내)와 프로젝트 내부 참고값 1건을 등록한다.

### 3-3. 지자체 데이터

`BSM_LOCAL_RULES`는 중앙정부 계산에서 분리한다.

```ts
export interface LocalSupportRule {
  regionCode: string;       // 기존 값 유지: seoul-gangnam 등
  label: string;            // '서울특별시 강동구'
  birthOrder: BirthOrder;
  amount: number | null;    // null = 미반영(0원 아님)
  paymentType: '현금' | '바우처' | '지역화폐';
  badge: '공식' | '참고';   // '확인 필요' 제거
  sourceUrl: string;
  checkedAt: string;
  note: string;
}
```

- `local-example`(인구감소지역 예시)은 실제 지자체가 아니므로 선택지에서 제거하고, 해당 안내는 지역별 리포트 링크 문장으로 대체한다.
- 금액이 있는 규칙은 강동구 2건뿐이다. 구현 직전에 강동구 원문을 재확인하고 확인 실패 시 `amount:null`로 내린다.

### 3-4. 시나리오 기대값 (`BSM_SCENARIOS`)

기획 5-3 표를 데이터로 옮겨 정적 표 렌더와 자동 검증에 함께 쓴다. 단위 원.

| id | 입력 | 체계 | 출생 직후 | 첫 1년 | 두 돌까지 | 합계 배지 |
|---|---|---|---:|---:|---:|---|
| s1 | 2027-06-30, 1, capital, -, home | current | 2,000,000 | 15,200,000 | 22,400,000 | 추정 |
| s1b | 2027-06-30, 1, nonCapital, -, home | current | 2,000,000 | 15,260,000 | 22,520,000 | 추정 |
| s2 | 2027-07-01, 1, capital, no, daycare | reform2027 | 10,000,000 | 12,400,000 | 14,800,000 | 시뮬레이션 |
| s3 | 2027-07-01, 2, capital, no, daycare | reform2027 | 12,000,000 | 14,400,000 | 16,800,000 | 시뮬레이션 |
| s4 | 2027-07-01, 3, nonCapital, yes, daycare | reform2027 | 20,000,000 | 23,600,000 | 27,200,000 | 시뮬레이션 |
| s4b | 2027-07-01, 3, nonCapital, yes, home | reform2027 | 20,000,000 | 27,200,000 | 34,400,000 | 시뮬레이션 |
| s5 | 2027-07-01, 1, capital, no, home | reform2027 | 10,000,000 | 16,000,000 | 22,000,000 | 시뮬레이션 |
| s6 | 2027-07-01, 1, capital, no, switch12 | reform2027 | 10,000,000 | 16,000,000 | 18,400,000 | 추정 |
| s6b | 2027-06-30, 1, capital, -, switch12 | current | 2,000,000 | 15,200,000 | 16,700,000 | 추정 |

추가 검증값(장기 참고, 156개월, 수도권·첫째·가정보육): 현행 35,600,000 / 개편안 48,400,000 / 차이 12,800,000(복지부 보도자료 예시 1,280만원과 일치).

> “출생 직후”는 체계 무관하게 출생 시 지원 **총액**(첫만남이용권 또는 아이맞이지원금 총액+우대 가산)이다. 개편안의 0개월차 실제 지급분(1회차 1/4)은 타임라인에만 표시한다.

### 3-5. 콘텐츠 데이터

| export | 내용 |
|---|---|
| `BSM_META` | title, description, h1, heroDescription, updatedAt `'2026-10-07'`, policyStatus 문장 |
| `BSM_NOTICE_LINES` | InfoNotice 4줄(5-1) |
| `BSM_INTRO` | 기획 7-1의 4단락 그대로(각 221~239자) |
| `BSM_CRITERIA` | 4줄 이내(8-2) |
| `BSM_FAQ` | 기획 7-2의 8개 `{question, answer}` |
| `BSM_RELATED_LINKS` | 기획 8번 4개 + 조건부 리포트 1개(8-3) |
| `BSM_REFERENCE_LINKS` | 정부24 행복출산, 복지로, 복지부 2026-08-28 보도자료 |
| `BSM_PENDING_CHECKS` | 기획 3-4의 10개 항목(페이지 하단 “확정 전 확인할 사항” 목록 렌더) |

`BSM_CONFIG`(3-1) + `BSM_LOCAL_RULES` + `BSM_SCENARIOS`를 `<script type="application/json" id="birthSupportMoneyConfig">`로 직렬화한다. 기존 id 유지.

---

## 4. 페이지 섹션과 Astro 구조

### 4-1. 메타

```astro
<BaseLayout
  title="출산지원금 계산기 2027 | 부모급여·아동수당 총액 바로 계산"
  description="출생일·출생순위·거주지역을 입력하면 2027 출산지원금과 부모급여·아동수당 예상 총액을 바로 계산. 첫 1년·두 돌까지 합계와 7월 출생아부터 적용 예정인 개편안 비교 포함."
  ogImage="/og/tools/birth-support-money.png"
  jsonLd={{ WebApplication + mainEntity FAQPage(BSM_FAQ) }}
>
```

`jsonLd.name`은 `2027 출산지원금 계산기`, `description`은 BaseLayout description과 동일. FAQPage는 이 jsonLd에서만 생성한다(SeoContent는 스키마 미출력).

### 4-2. 섹션 배치 (TimelineToolShell slot 기준)

| 순서 | slot | 요소 | id / class |
|---|---|---|---|
| 1 | hero | `CalculatorHero` eyebrow `2027 출산지원금`, title `2027 출산지원금 계산기`, description(기획 4-2) | - |
| 2 | actions | `ToolActionBar` | `bsm-reset-btn`, `bsm-copy-link-btn` 유지 |
| 3 | aside | 입력 패널 | `bsm-input-panel` |
| 4 | default | 적용 예정 제도 배너 | `#bsm-system-banner` |
| 5 | default | 빈 상태/오류 안내 | `#bsm-empty-state`, `#bsm-input-error` |
| 6 | default | `SummaryCards` 4개 | 4-4 |
| 7 | default | 항목별 분해 | `#bsm-breakdown` |
| 8 | default | 6월생 vs 7월생 비교 카드 | `#bsm-compare-system` |
| 9 | default | 일반지역 vs 우대지역 카드 | `#bsm-compare-preferred` |
| 10 | default | `InfoNotice` | 5-1 |
| 11 | timeline | 월별 타임라인 차트+표 | `#bsm-timeline-chart`, `#bsm-timeline-head`, `#bsm-timeline-table-body` |
| 12 | timeline | 지자체 추가 지원 패널 | `#bsm-local-panel` |
| 13 | timeline | 대표 시나리오 표(정적 SSG) | `.bsm-scenario-table` |
| 14 | timeline | 확정 전 확인할 사항(정적) | `.bsm-pending-list` |
| 15 | timeline | 신청 체크리스트 + 공식 확인 링크 | `#bsm-checklist`, `.bsm-reference-grid` |
| 16 | seo | `SeoContent` | 8번 |

기존 `.bsm-related-section`(페이지 내 별도 관련 링크 블록)은 SeoContent `related`와 중복이므로 제거한다. `#bsm-calc-btn`은 제거한다(실시간 반영 원칙).

정적 시나리오 표(13)는 JS 없이도 핵심 숫자를 HTML로 제공해 빈 출생일 상태와 SEO 본문을 보완한다. 표 머리에 “아래 금액은 예시 조건의 예상치입니다” 문장과 각 행 배지를 둔다.

### 4-3. 입력 DOM 계약

| 라벨 | 요소 | id | 값 | 기본 |
|---|---|---|---|---|
| 출생일 또는 출산예정일 | `input[type=date]` | `bsm-birth-date` | `YYYY-MM-DD`, `min=2026-01-01`, `max=2028-12-31` | 빈 값 |
| 출생순위 | `select` | `bsm-birth-order` | `1`·`2`·`3`(셋째 이상) | `1` |
| 거주 지역 유형 | `select` | `bsm-region-tier` | `capital`·`nonCapital`·`depopPreferred`·`depopSpecial` | `capital` |
| 2027 개편안 우대지역 | `select` | `bsm-preferred` | `no`·`yes`·`unknown` | `no` |
| 양육 방식 | `select` | `bsm-care-mode` | `home`(가정보육)·`daycare`(어린이집 이용)·`switch12`(12개월부터 어린이집) | `home` |
| 타임라인 기간 | `select` | `bsm-period` | `12`·`24`·`156`(장기 참고, 만 13세 미만) | `24` |
| 지자체 지원 지역(선택) | `select` | `bsm-local-region` | `none` + 규칙 보유 지역 | `none` |

- 각 입력 아래 `<small>` 도움말: 우대지역 “행정안전부 지방우대지수 기준 우대지역 명단은 아직 공개되지 않았습니다. 모르면 ‘모름’을 선택하세요.”, 지역 유형 “현행 아동수당 금액에 쓰입니다.”
- 출생일이 현행 체계일 때 `bsm-preferred`는 `disabled` 대신 보조 문장 “7월 1일 이후 출생에만 적용”을 표시한다(비교 카드에서 계속 쓰이므로 값은 유지).
- 다태아 입력(`bsm-multiple-birth`)은 제거한다. 입력 패널 하단 문장: “쌍둥이 이상은 아이마다 지원이 계산되며 출생순위 산정 기준은 확인이 필요합니다. 이 계산기는 아이 1명 기준입니다.”
- 오류 연결: 출생일 오류 시 `aria-invalid="true"`, `aria-describedby="bsm-input-error"`.

### 4-4. 결과 DOM 계약

| 블록 | id | 내용 |
|---|---|---|
| 배너 | `bsm-system-banner` | `data-system="current|reform2027"`. 제목·한 줄 설명·상태 문장 |
| KPI 1 | `bsm-r-birth-support` | 출생 직후 지원금 총액 + 보조 `bsm-r-birth-support-sub`(예: “1년간 4회 분할 예정”) |
| KPI 2 | `bsm-r-monthly` | “0~11개월 월 X / 12~23개월 월 Y” |
| KPI 3 | `bsm-r-12m` | 첫 1년 예상 총지원금 (주요 카드) |
| KPI 4 | `bsm-r-24m` | 두 돌까지 예상 총지원금 |
| KPI 배지 | `bsm-r-*-badge` | 각 KPI 우상단 배지 |
| 우대 모름 보조 | `bsm-r-preferred-hint` | “우대지역이면 첫 1년 +X, 두 돌 +Y” |
| 분해 | `bsm-breakdown` | 체계별 항목 카드(5-3) |
| 체계 비교 | `bsm-compare-system` | 같은 조건 반대 체계의 첫 1년·두 돌·차이 |
| 우대 비교 | `bsm-compare-preferred` | 개편안일 때만 표시, 일반/우대/차이 |
| 장기 참고 | `bsm-r-long` | 기간 156일 때만 표시, 추정 배지 |
| 지자체 | `bsm-local-total`, `bsm-local-note`, `bsm-grand-total` | 5-4 |
| 상태 문장 | `bsm-result-note` | `aria-live="polite"` |

결과 컨테이너 전체에 `aria-live="polite"`를 두지 않고 `bsm-result-note` 한 곳에서 요약 문장(“2027년 7월 1일 출생 · 첫째 · 일반지역 · 가정보육 기준, 두 돌까지 약 2,200만원 예상”)만 읽게 한다.

---

## 5. 결과 표현 규칙

### 5-1. InfoNotice

1. 2027년 7월 1일 이후 출생아 대상 아이맞이지원금·아동기본수당은 2027년 정부 예산안·제도개편안 발표 기준이며 국회 심의와 법 개정 과정에서 달라질 수 있습니다.
2. 2027년 6월 30일까지 출생아는 현행 첫만남이용권·부모급여·아동수당이 유지되는 것으로 안내됐습니다.
3. 중앙정부 현금성 지원 중심 계산이며 보육료 바우처 자체와 지자체 출산지원금은 중앙정부 합계에 넣지 않습니다.
4. 자료 조사일 2026년 10월 7일. 신청 전 복지로·정부24·주소지 행정복지센터에서 최신 기준을 확인하세요.

### 5-2. 배너 문구

| 체계 | 제목 | 설명 |
|---|---|---|
| current | 현행 첫만남이용권·부모급여·아동수당 체계 | 2027년 6월 30일 이전 출생아는 현행 제도가 유지될 예정입니다. |
| reform2027 | 아이맞이지원금·아동기본수당 체계 적용 예정 | 2027년 7월 1일 이후 출생아부터 적용 예정인 예산안 기준입니다. |

금지 표현(코드·데이터 전체): `무조건 지급`, `확정 시행`, `2027년생 전체 적용`, `7월에 낳으면`, `이득`, `받을 수 있습니다`(결과 문장 한정). 자동 검증 대상(9-2).

### 5-3. 항목별 분해 카드

| 체계 | 카드 | 표시 | 배지 |
|---|---|---|---|
| current | 첫만남이용권 | 금액 + “국민행복카드 바우처” | 공식 |
| current | 부모급여 합계 | 기간 합계 + 양육 방식이 daycare/switch12면 “어린이집 이용 월은 보육료 차액만 현금” | 시뮬레이션 또는 추정 |
| current | 아동수당 합계 | 기간 합계 + 지역 유형 월액 | 시뮬레이션 |
| reform2027 | 아이맞이지원금 | 기본액 + “현금 · 1년간 4회 분할 예정” | 공식 |
| reform2027 | 우대지역 추가 | 500만원(우대 yes일 때) / 숨김(no) / “우대지역이면 +500만원”(unknown) | 공식 |
| reform2027 | 아동기본수당 합계 | 기간 합계 + “현금 10만+지역사랑상품권 10만”(기본지역만 비율 표시) | 시뮬레이션 |
| reform2027 | 가정보육 추가 합계 | 해당 월 수 × 30만원 | 시뮬레이션 또는 추정(switch12) |

### 5-4. 지자체 영역

- `bsm-local-region = none`: “지자체 출산지원금은 지역마다 금액·거주요건·신청기한이 달라 중앙정부 예상액과 따로 확인하세요.” + `/reports/birth-support-by-region-2026/` 링크. `bsm-grand-total` 숨김.
- 규칙 금액 null: “이 지역 금액은 아직 반영하지 않았습니다.” `bsm-grand-total` 숨김.
- 규칙 금액 있음: 지자체 금액(규칙 badge) 표시, `bsm-grand-total` = 중앙 두 돌 합계 + 지자체, 배지 **추정**, 문장 “개편안과 지자체 지원의 중복 가능 여부는 확인이 필요합니다.”(개편안 체계일 때).

### 5-5. 배지 결정 규칙 (`resolveTotalBadge`)

우선순위대로 첫 해당 규칙을 적용한다.

| # | 조건 | 합계 배지 |
|---|---|---|
| 1 | 기간 156(장기 참고) 값 | 추정 |
| 2 | 반대 체계와의 차이(비교 카드의 ± 값) | 추정 |
| 3 | 지자체 포함 전체 합계 | 추정 |
| 4 | current이고 출생일 ≥ 2027-01-01 (경과규정 #2 의존) | 추정 |
| 5 | current이고 care ≠ home (보육료 참고값 사용) | 추정 |
| 6 | reform2027이고 care = switch12 (전환 처리 미확정 #6) | 추정 |
| 7 | 그 외 합계 | 시뮬레이션 |

- 단일 원자료 금액(첫만남이용권, 아이맞이지원금 기본액, 월 단가)은 `공식`, 보육료 단가는 `참고`.
- 타임라인 표의 개편안 회차 행(0·3·6·9개월 아이맞이지원금 셀)은 `추정`.
- 2026년 출생아(current, 출생일 < 2027-01-01, home)는 규칙 7로 시뮬레이션이며 결과 문장에 “2027년 이후 지급분도 현행 기준 유지 가정”을 붙인다.

### 5-6. 비교 카드 문장

- 체계 비교: “같은 조건에서 2027년 6월 30일 출생이면(또는 7월 1일 출생이면) 첫 1년 X, 두 돌까지 Y로 예상됩니다. 기간에 따라 유불리가 달라집니다.” 차이는 `+`/`−`와 함께 표시하고 색만으로 구분하지 않는다.
- 카드 하단 고정 문장: “출산 시기는 건강과 의료 판단이 우선입니다. 이 비교는 제도 차이를 이해하기 위한 참고용입니다.”
- 현행 체계 결과의 반대 계산에서 우대 `unknown`이면 기본지역 값으로 비교하고 “우대지역이면 +X”를 덧붙인다.
- 우대 비교: “우대지역이면 첫 1년 +X(아이맞이지원금 +500만원, 아동기본수당 월 +10만원), 두 돌까지 +Y.” 우대 `yes`/`unknown`/`no` 모두 계산해 보여준다(개편안일 때).

---

## 6. 계산 모듈 (`public/scripts/birth-support-money-core.js`)

ES 모듈, DOM·`window` 접근 금지. Node 검증 스크립트와 브라우저가 같은 파일을 import한다(`welfare-benefit-eligibility-core.js` 패턴).

### 6-1. 상태와 결과 타입

```js
/** @typedef {{ birthDate: string|null, order: 1|2|3, tier: RegionTier,
 *   preferred: 'no'|'yes'|'unknown', care: 'home'|'daycare'|'switch12',
 *   period: 12|24|156, local: string }} BsmState */

/** @typedef {{ month: number, items: Record<string, number>, total: number,
 *   estimatedCells: string[] }} MonthRow */

/** @typedef {{ system: 'current'|'reform2027', rows: MonthRow[],
 *   birthSupport: number, monthly: { m0to11: number, m12to23: number },
 *   total12: number, total24: number, totalPeriod: number,
 *   byItem: Record<string, number>, badges: Record<string, DataBadge> }} BsmResult */
```

### 6-2. 함수 목록

| 함수 | 입력 → 출력 | 비고 |
|---|---|---|
| `validateConfig(config)` | throw on error | schemaVersion 2, 모든 MoneyCell 정수·sourceId 존재, 배지 4종, cutoff 형식 |
| `parseBirthDate(raw, range)` | `{status:'empty'|'invalid'|'outOfRange'|'valid', value}` | `/^\d{4}-\d{2}-\d{2}$/` + 실제 달력 날짜 검사(2027-02-30 거절). `Date` 시간대 변환 없이 문자열 처리 |
| `resolveSystem(isoDate, cutoff)` | `'current'|'reform2027'` | `isoDate >= cutoff` 문자열 비교 |
| `isHomeCareMonth(care, month)` | boolean | home: 0~23 true, daycare: false, switch12: month < 12 |
| `buildCurrentRows(config, state, months)` | `MonthRow[]` | 6-3 |
| `buildReformRows(config, state, months, preferred)` | `MonthRow[]` | 6-3, `preferred`는 boolean |
| `calculate(config, state)` | `BsmResult` (+ `preferredVariant` when unknown) | 체계 판정 후 위 함수 호출, unknown이면 기본/우대 둘 다 계산 |
| `calculateOpposite(config, state)` | `BsmResult` | 출생일만 반대 체계 대표일(현행→2027-07-01, 개편안→2027-06-30)로 바꿔 계산. 기간 24 고정 |
| `resolveTotalBadge(context)` | `DataBadge` | 5-5 |
| `sumRange(rows, from, to)` | number | 0-based, to 포함 안 함 |
| `parseUrlState(searchParams)` | `{state, notices[]}` | 7번 |
| `serializeState(state)` | `Record<string,string>` | 7번 |

### 6-3. 월별 계산 규칙

`month`는 아이 개월 수(0 = 출생~1개월 미만). 달력 월·일할·신청 지연은 반영하지 않는다(문장 안내: “출생 후 60일 이내 신청 기준”).

현행(`current`):

```text
firstMeeting   = month==0 ? firstMeeting[order] : 0
pbFull         = month<12 ? parentBenefit.age0 : month<24 ? parentBenefit.age1 : 0
pbCash         = isHomeCareMonth(care, month) || month>=24
                   ? pbFull
                   : max(0, pbFull - (month<12 ? daycareFee.age0 : daycareFee.age1))
childAllowance = childAllowance[tier]            // 0~155개월 모두 대상 (2030년 13세 미만 확대 일정상 2026~2028년생은 전 구간 포함)
```

개편안(`reform2027`):

```text
grantTotal     = welcomeGrant[order] + (preferred ? welcomeGrantPreferredAddon : 0)
welcomeGrant   = installments.months.includes(month) ? grantTotal / 4 : 0   // 4로 나누어떨어짐(250만/300만/375만/…)
basicAllowance = childBasicAllowance + (preferred ? childBasicAllowancePreferredAddon : 0)
homeCare       = month<=23 && isHomeCareMonth(care, month) ? homeCareAddon : 0
```

- 개편안 `grantTotal / 4`는 375만원(1,500만/4)처럼 원 단위 정수로 떨어지는지 `validateConfig`에서 `% 4 === 0` 확인. 실패 시 마지막 회차에 나머지를 더한다.
- 현행 `month >= 24`에서 부모급여 0이므로 `pbCash` 분기 결과 0.
- `estimatedCells`: 개편안 welcomeGrant 셀, 현행 어린이집 월 pbCash 셀, switch12의 homeCare 셀.

### 6-4. 핵심 의사코드

```js
export function calculate(config, state) {
  const system = resolveSystem(state.birthDate, config.reformCutoff);
  const months = Math.max(state.period, 24);          // KPI용 24개월은 항상 계산
  const build = (pref) => system === 'current'
    ? buildCurrentRows(config, state, months)
    : buildReformRows(config, state, months, pref);
  const base = summarize(system, build(state.preferred === 'yes'), state, config);
  if (system === 'reform2027' && state.preferred === 'unknown') {
    base.preferredVariant = summarize(system, build(true), state, config);
  }
  return base;
}
```

`summarize`는 `birthSupport`(current: firstMeeting[order], reform: grantTotal), `monthly`(month 0과 12의 출생지원 제외 월액), `total12 = sumRange(rows,0,12)`, `total24 = sumRange(rows,0,24)`, `totalPeriod = sumRange(rows,0,period)`, `byItem`, `badges`를 채운다.

### 6-5. 경계값과 기대 동작

| 조건 | 기대 |
|---|---|
| `2027-06-30` | current |
| `2027-07-01` | reform2027 |
| `2026-01-01` / `2028-12-31` | 유효(각 current / reform2027) |
| `2025-12-31`, `2029-01-01` | outOfRange 오류 문장, 결과 숨김 |
| 빈 값 | empty: 결과 숨김 + “출생일 또는 출산예정일을 입력하세요”, 정적 시나리오 표는 계속 보임 |
| `2027-02-30`, `abc` | invalid 오류 |
| order 3 + current | 첫만남 3,000,000 |
| reform + preferred unknown | KPI 기본값, 힌트 = 우대값 − 기본값 (첫째 기준 12개월 +6,200,000, 24개월 +7,400,000) |
| reform + switch12 | 0~11개월 homeCare 300,000, 12~23개월 0 |
| current + daycare month 0 | pbCash 460,000 |
| current + daycare month 12 | pbCash 25,000 |
| period 12 | 타임라인 12행, KPI 두 돌 값은 계속 표시 |
| period 156 | 장기 카드 표시, 추정 배지 |

---

## 7. URL 상태

### 7-1. v2 계약

| 키 | 값 | 기본 | 비허용 시 |
|---|---|---|---|
| `v` | `2` | - | - |
| `bd` | `YYYY-MM-DD` | 생략(빈 값) | 빈 값 + 안내 |
| `order` | `1|2|3` | `1` | 기본 |
| `tier` | 4종 | `capital` | 기본 |
| `pref` | `no|yes|unknown` | `no` | 기본 |
| `care` | `home|daycare|switch12` | `home` | 기본 |
| `period` | `12|24|156` | `24` | 기본 |
| `local` | `none` 또는 규칙 regionCode | `none` | 기본 |

- allowlist 외 값은 기본으로 복구하고 `notices`에 “공유 링크의 일부 값이 올바르지 않아 기본값으로 바꿨습니다.”를 남긴다.
- 빈 출생일이면 `bd`를 URL에서 삭제한다. 현재 `writeParams`는 set만 하므로 `url-state.js`에 손대지 않고 페이지 스크립트에서 `URLSearchParams`·`history.replaceState`로 `bd`를 지운다(또는 `writeParams` 후 별도 delete).
- 개인정보(이름 등)는 받지 않는다. 출생일은 공유 링크에 포함되므로 복사 버튼 옆 보조 문장 “링크에 입력한 출생일이 포함됩니다.”를 둔다.

### 7-2. 구형 URL 호환

| 구형 키 | 처리 |
|---|---|
| `birthDate` | `bd`가 없을 때 `bd`로 사용 |
| `order` | 동일 |
| `region` | 규칙 존재 시 `local`로, 아니면 `none`. `tier`는 기본값 |
| `childcare=home|daycare` | `care`로 |
| `months=12|24` | `period`로, `95` → `24` + 안내 “95개월 기간은 장기 참고(만 13세 미만)로 바뀌었습니다.” |
| `multiple` | 무시 |

구형 키는 읽은 뒤 첫 `serializeState`에서 v2 키로 교체한다.

---

## 8. 콘텐츠·SEO 연결

### 8-1. 본문

- `SeoContent.introTitle`: `2027 출산지원금 계산 결과를 읽는 방법`
- `intro`: 기획 7-1의 4단락(`BSM_INTRO`)
- `inputPoints`(3개): ① 출생일만 넣으면 6월 30일 이전·7월 1일 이후 적용 예정 제도를 자동 구분합니다. ② 출생순위·지역·양육 방식에 따라 첫 1년과 두 돌까지 예상액을 비교합니다. ③ 우대지역 여부를 모르면 두 경우를 함께 보여줍니다.
- `faq`: `BSM_FAQ` 8개
- H2 배치: 비교 카드 `6월 30일 출생과 7월 1일 출생 비교`, 우대 카드 `일반지역과 우대지역 차이`, 타임라인 `월별 예상 지원 흐름`, 지자체 `지자체 출산지원금은 따로 확인하세요`, 시나리오 `조건별 예상 지원금 예시`, 확인 목록 `확정 전 확인할 사항`. h1 → h2 → h3 순서 유지.

### 8-2. criteria (4줄)

1. 현행: 첫만남이용권 첫째 200만·둘째 이상 300만원, 부모급여 0세 월 100만·1세 월 50만원, 아동수당 2026년 지역별 월 10만~12만원(공식).
2. 개편안: 아이맞이지원금 1,000만·1,200만·1,500만원(우대 +500만원), 아동기본수당 월 20만원(우대 30만원), 0~1세 가정보육 월 30만원 추가(2027 예산안 발표 기준).
3. 어린이집 이용 월의 현행 부모급여는 2026년 보육료 단가(참고)를 뺀 차액만 현금으로 계산합니다.
4. 합계는 시뮬레이션, 경과규정·분할 시점·보육 전환 처리 등 가정이 들어간 값은 추정으로 표시합니다.

### 8-3. related

| 순서 | href | label | 조건 |
|---|---|---|---|
| 1 | `/tools/pregnancy-birth-cost/` | 임신 출산 비용 계산기 | 고정 |
| 2 | `/tools/postnatal-care-cost/` | 산후도우미 비용 계산기 | 고정 |
| 3 | `/tools/parental-leave-short-work-calculator/` | 육아휴직 + 육아기 단축근무 계산기 | 고정 |
| 4 | `/reports/birth-support-by-region-2026/` | 2026 지역별 출산지원금 비교 | 고정 |
| 5 | `/reports/childbirth-benefits-changes-2027/` | 2027 부모급여·아동수당 변경 정리 | **구현 시점에 `src/pages/reports/childbirth-benefits-changes-2027.astro`가 존재할 때만** |

`/tools/birth-support-total/`, `/tools/baby-government-support/`는 넣지 않는다(기획 8번).

### 8-4. 등록 문구

- `tools.ts` `birth-support-money`: title `2027 출산지원금 계산기`, description은 메타 Description과 동일. order·category·badges 유지(badges의 `지자체`는 `2027`로 교체 검토).
- `tools/index.astro` 270행: `"출생일로 2027년 6월 이전·7월 이후 적용 제도를 나눠 예상 지원금을 계산합니다."`
- OG(`generate-og-tools.py`): title `2027 출산지원금 계산기`, eyebrow `육아휴직·출산`, stats `("7월 출생부터", "개편안 적용 예정"), ("첫째 두 돌까지", "약 2,200만원")`. stats는 시나리오 s5 값이며 이미지에 “예상” 표기.

---

## 9. 렌더·스타일·검증

### 9-1. 렌더 구현 규칙

- 모든 동적 텍스트는 `textContent`. 표·카드는 `document.createElement`로 만들고 `innerHTML` 템플릿 문자열을 쓰지 않는다(기존 `renderTimelineTable`·`renderChecklist` 교체).
- 차트: 체계가 바뀌면 `timelineChart.destroy()` 후 재생성. 데이터셋 — current: 첫만남이용권·부모급여·아동수당, reform: 아이맞이지원금·아동기본수당·가정보육 추가(우대 가산은 각 항목에 포함). 지자체는 차트에서 제외. 156개월은 막대 대신 월이 많으므로 `maxTicksLimit` 13(연 단위 라벨).
- 차트 fallback: `window.Chart` 없으면 차트 래퍼 숨기고 표만 표시.
- 표 머리글은 체계별로 `#bsm-timeline-head`를 다시 그린다. 156개월 표는 12개월 단위 요약 행(“만 N세”)으로 접고 `details`로 월별 펼침.
- 금액 표기: KPI는 `formatKoreanAmount`(만원 단위), 표는 `formatWon`. 375만원 회차 같은 값이 `375만원`으로 나오는지 확인.

### 9-2. SCSS (`_birth-support-money.scss`)

| 클래스 | 용도 |
|---|---|
| `.bsm-system-banner`, `--current`, `--reform` | 배너. 색 + 아이콘 텍스트(현행/개편 예정)로 구분 |
| `.bsm-badge--official`, `--reference`, `--simulation`, `--estimate` | 배지 4종. 기존 `--check` 삭제 |
| `.bsm-compare-card`, `.bsm-compare-card__delta` | 비교 카드, 차이 값은 `+`/`−` 텍스트 포함 |
| `.bsm-empty-state`, `.bsm-input-error` | 빈 상태·오류 |
| `.bsm-scenario-table`, `.bsm-pending-list` | 정적 표·목록, 표는 `.table-wrap` 가로 스크롤 |

- prefix `bsm-` 유지, `!important` 금지, 중첩 3단계 이내, 브레이크포인트 `768px`·`1024px`(CONTENT_GUIDE 기준).
- KPI 숫자는 320px에서 `font-size` 축소 + `word-break: keep-all`, 단위는 작은 글씨.
- 비교 카드: 모바일 1열, 768px 이상 2열.

### 9-3. 자동 검증 (`scripts/check-birth-support-money.mjs`)

`check-welfare-benefit-eligibility.mjs`와 같은 방식(TS transpile → 임시 mjs import → core import).

1. `validateConfig(BSM_CONFIG)` 통과.
2. `BSM_SCENARIOS` 9개: `calculate` 결과의 birthSupport·total12·total24·배지가 기대값과 일치.
3. 장기 참고: 현행 35,600,000 / 개편안 48,400,000 / 차이 12,800,000.
4. 6-5 경계값 표 전 항목.
5. `parseUrlState`: v2 정상값, 비허용값 복구, 구형 URL(`months=95`, `childcare=daycare`, `region=seoul-gangdong`) 변환.
6. 배지 문자열 전수 검사: 데이터·core·페이지 스크립트에 4종 외 배지 리터럴(`확인 필요` 등) 없음.
7. 콘텐츠: `BSM_INTRO` 4단락 이상·각 150자 이상·합계 600자 이상, FAQ 8개·답변 2문장 이상, related 4~5개.
8. 금지 표현(5-2) 미포함: 데이터 파일·astro·js.
9. Title 50자 이하, Description 80~120자.

`package.json`에는 스크립트를 추가하지 않고 `node scripts/check-birth-support-money.mjs`로 직접 실행한다(기존 check 스크립트와 동일 운용).

### 9-4. 수동 QA

- 320·375·768·1280px: 입력 → 배너 → KPI → 비교 카드 순서, 가로 스크롤 없음(표 제외).
- 출생일 6/30 ↔ 7/1 전환 시 배너·KPI·분해·차트 데이터셋·표 머리글이 모두 바뀌고 이전 값이 남지 않음.
- 우대 `unknown` 힌트, `switch12` 표 값, 지자체 강동구 선택 시 전체 합계·추정 배지.
- 키보드만으로 입력·복사·초기화 가능, 오류 시 스크린리더가 오류 문장 읽음.
- 공유 링크 복사 → 새 탭에서 동일 결과. 구형 링크(`?birthDate=2026-05-01&months=95`) 정상 복구.
- 콘솔 오류 없음, Chart.js 툴팁 한국어.

---

## 10. 구현 순서와 완료 조건

### 10-1. 구현 전 게이트

1. 기획 3-4의 10개 항목을 원문(복지부 보도자료 첨부 HWPX/PDF, 국회 예산 의결, 아동수당법 개정·부칙, 사업지침)으로 재확인한다.
2. 변경이 있으면 기획서 3번과 이 설계서 3-2·3-4 표를 먼저 고친 뒤 구현한다. 금액이 바뀌면 시나리오 기대값을 새로 계산해 표에 기록한다.
3. 2027년 보육료 단가 고시가 나왔으면 `daycareFee`를 교체하고 badge를 `공식`으로 올린다.
4. 리포트 `childbirth-benefits-changes-2027` 생성 여부를 확인해 related 5번 포함 여부를 정한다.

### 10-2. 구현 순서

1. `birthSupportMoney.ts` 타입·원자료·시나리오·콘텐츠 작성.
2. `birth-support-money-core.js` 작성 → `check-birth-support-money.mjs`로 시나리오·경계값 먼저 통과.
3. `birth-support-money.js` 렌더·URL·차트 교체.
4. `birth-support-money.astro` 마크업·메타·정적 표·SeoContent 교체.
5. SCSS 수정.
6. `tools.ts`, `tools/index.astro`, sitemap lastmod, OG 생성.
7. `node scripts/check-birth-support-money.mjs`, `npm run check:all`, `npm run build`.
8. `npm run preview`로 9-4 수동 QA.
9. `DEPLOY_CHECKLIST.md`·`QUALITY_SCORE.md` 점검 → 사용자 승인 후 커밋·push.

### 10-3. 완료 조건 (현재 모두 미실시)

- [ ] 구현 전 게이트 1~4를 수행하고 결과를 이 문서 하단에 기록했다.
- [ ] slug·canonical·sitemap URL을 유지하고 신규 라우트를 만들지 않았다.
- [ ] 시나리오 9개·장기 참고 3개 값·경계값 전 항목이 자동 검증을 통과했다.
- [ ] 배지 4종 외 문자열이 코드·데이터에 없다.
- [ ] 지자체 금액이 중앙정부 KPI에 섞이지 않는다.
- [ ] 금지 표현이 없다.
- [ ] intro·FAQ·related 기준을 충족했다.
- [ ] 320~1280px 레이아웃·키보드 접근성·콘솔 오류 없음을 확인했다.
- [ ] `npm run check:all`과 `npm run build`가 성공했다. 실패 상태로 커밋·push하지 않는다.
- [ ] 배포 후 라이브 URL에서 6/30·7/1 결과를 재확인했다.
- [ ] 배포 후 리포트 작업(`childbirth-benefits-changes-2027`)에 CTA 문구 전환 가능 여부를 전달했다.

### 10-4. 후속 작업 (이 설계 범위 밖)

- `birth-support-total` → `birth-support-money` 링크 교체·301 통합(기획 10-2, 사용자 승인 필요).
- `baby-government-support` 데이터 오류 수정(별도 세션 제안됨).
- `single-parental-leave-total` 2027 개편 안내 반영 검토.

설계·구현·테스트·배포는 실행하지 않았다. `main` push는 즉시 프로덕션 배포다.

---

## 11. 구현 반영 및 검증 기록 (2026-10-07)

### 11-1. 구현 전 게이트 결과

| # | 항목 | 결과 |
|---|---|---|
| 1 | 10개 재확인 항목 원문 재대조 | 2026-10-07 재검색 기준 국회 예산 의결·개편안 관련 법 개정·우대지역 명단·지급 지침 발표 없음. 기획 3-4 상태 유지. 보도자료 첨부 HWPX/PDF의 “변경될 수 있음” 각주는 여전히 직접 열람하지 못함 |
| 2 | 수치 변경 | 없음. 시나리오 기대값 그대로 사용 |
| 3 | 2027 보육료 단가 | 미고시. `daycareFee` 참고값 유지 |
| 4 | 리포트 존재 | `src/pages/reports/childbirth-benefits-changes-2027.astro` 존재(커밋 f30a3d8) → related 5번 포함 |
| 추가 | 강동구 지자체 금액 | 200만·300만원을 구청 원문으로 재확인하지 못함(과거 구청 보도자료는 20만~100만원). 설계 3-3에 따라 `amount:null`로 내림 → 현재 금액 반영 지자체 0곳, 전체 합계 카드는 표시되지 않음 |

### 11-2. 변경 파일

`src/data/birthSupportMoney.ts`(전면), `public/scripts/birth-support-money-core.js`(신규), `public/scripts/birth-support-money.js`(전면), `src/pages/tools/birth-support-money.astro`(전면), `src/styles/scss/pages/_birth-support-money.scss`, `scripts/check-birth-support-money.mjs`(신규), `src/data/tools.ts`, `src/pages/tools/index.astro`, `public/sitemap.xml`(lastmod), `scripts/generate-og-tools.py`(항목 추가), `docs/sheets/page_inventory_2026-10-07.csv`.

설계와 다르게 처리한 점:
- KPI는 `SummaryCards`가 배지·보조 문장을 지원하지 않아 같은 클래스(`metrics metrics--four`, `metric-card summary-card`)로 페이지에 직접 마크업했다.
- **OG 이미지 미생성**: 이 환경의 Python에 Pillow가 없어 `generate-og-tools.py`를 실행하지 못했다. 생성 항목은 추가해 두었고, 페이지 `ogImage`는 기존 `/og/tools/birth-support-total.png`를 유지했다. Pillow 설치 후 이 항목만 생성하고 `ogImage`를 `/og/tools/birth-support-money.png`로 바꿔야 한다.
- 출생일이 비어 있어도 나머지 입력값은 URL에 기록된다(`bd`만 제외).

### 11-3. 검증 결과

| 검증 | 결과 |
|---|---|
| `node scripts/check-birth-support-money.mjs` | 통과(16개 그룹: 설정, 시나리오 9개, 장기 참고 1,280만원, 경계값, URL v2·구형, 배지·금지 표현, 콘텐츠·메타 길이·related 파일 존재) |
| `npx astro check` | 이 페이지 관련 오류 0건(경고 2건 수정). 전체는 다른 페이지의 기존 오류 397건으로 미통과(복지급여 작업 기록과 동일) |
| `node scripts/check-category-mapping.mjs` | 누락 없음 |
| `npm run build` | 성공(425페이지), `dist/tools/birth-support-money/index.html` 생성 |
| 브라우저(`astro preview`) | 2027-07-01 첫째·가정보육·우대 모름: 1,000만/월 50만/1,600만/2,200만원, 우대 힌트 +620만·+740만원 / 6-30 전환: 배너·KPI(200만/1,520만/2,240만원, 추정)·차트 데이터셋·표 머리글 교체 확인 / 구형 URL(`months=95`, `childcare=daycare`, `region=seoul-gangdong`) 변환·안내 / 빈 출생일 상태 / 375px 가로 넘침 없음 / 콘솔 오류 없음 |

### 11-4. 남은 작업

- [ ] OG 이미지 생성 후 `ogImage` 교체
- [ ] 320px·768px·키보드 탐색 수동 점검
- [ ] `DEPLOY_CHECKLIST.md` 점검 후 사용자 승인으로 커밋·push(현재 미실시)
- [ ] 배포 후 리포트 `childbirth-benefits-changes-2027`의 `CBC_CTA.supports2027Proposal`·문구 전환 여부 전달
- [ ] 10-4 후속 작업(`birth-support-total` 통합, `baby-government-support` 수정)
