# 미국 빅테크 6개사 직급별 연봉 계산기 + 비교 리포트 설계 문서

## 1. 문서 개요

### 1-1. 대상
- 기획 배경: [`docs/plan/202606/us-bigtech-salary-by-level-2026-plan.md`](../../plan/202606/us-bigtech-salary-by-level-2026-plan.md) — 엔비디아·애플·아마존·마이크로소프트·테슬라·오라클 levels.fyi 기준 직급별 연봉을 원화로 환산해 비교
- 구현 대상:
  1. 통합 계산기 1개 (`tools/us-bigtech-salary-by-level-calculator`)
  2. 회사별 리포트 6개 (`reports/{company}-salary-by-level-2026`) — 동일 템플릿
  3. 허브 비교 리포트 1개 (`reports/us-bigtech-salary-comparison-2026`)
- 페이지 성격: 계산기는 `SimpleToolShell`(`resultFirst=true`), 리포트 7개는 인터랙티브 리포트 패턴(IPO 리포트류와 동일 구조)

### 1-2. 문서 역할
- 8개 페이지 전체를 한 번에 구현하지 않고 **데이터 → 애플 파일럿 → 계산기 → 나머지 5개사 → 허브** 순으로 단계적으로 진행할 수 있도록, 공통 스키마/계산식/IA를 먼저 고정한다.
- Claude/Codex가 바로 `src/data/`, `src/pages/tools|reports/`, `public/scripts/`, `src/styles/` 작업으로 이어갈 수 있게 한다.

### 1-3. 권장 slug 및 URL
| 페이지 | slug | URL |
|---|---|---|
| 계산기 | `us-bigtech-salary-by-level-calculator` | `/tools/us-bigtech-salary-by-level-calculator/` |
| 리포트(애플, 파일럿) | `apple-salary-by-level-2026` | `/reports/apple-salary-by-level-2026/` |
| 리포트(엔비디아) | `nvidia-salary-by-level-2026` | `/reports/nvidia-salary-by-level-2026/` |
| 리포트(아마존) | `amazon-salary-by-level-2026` | `/reports/amazon-salary-by-level-2026/` |
| 리포트(MS) | `microsoft-salary-by-level-2026` | `/reports/microsoft-salary-by-level-2026/` |
| 리포트(테슬라) | `tesla-salary-by-level-2026` | `/reports/tesla-salary-by-level-2026/` |
| 리포트(오라클) | `oracle-salary-by-level-2026` | `/reports/oracle-salary-by-level-2026/` |
| 허브 리포트 | `us-bigtech-salary-comparison-2026` | `/reports/us-bigtech-salary-comparison-2026/` |

### 1-4. 권장 파일 구조
```
src/data/usBigTechSalaryByLevel.ts          # 공통 스키마 + 6개사 데이터 + 환율/상수
src/pages/tools/us-bigtech-salary-by-level-calculator.astro
public/scripts/us-bigtech-salary-by-level-calculator.js
src/styles/scss/pages/_us-bigtech-salary-by-level-calculator.scss   # prefix: ubg-

src/pages/reports/apple-salary-by-level-2026.astro                  # 파일럿
src/pages/reports/nvidia-salary-by-level-2026.astro
src/pages/reports/amazon-salary-by-level-2026.astro
src/pages/reports/microsoft-salary-by-level-2026.astro
src/pages/reports/tesla-salary-by-level-2026.astro
src/pages/reports/oracle-salary-by-level-2026.astro
public/scripts/us-bigtech-salary-report.js                          # 6개 리포트 공유 스크립트
src/styles/scss/pages/_us-bigtech-salary-report.scss                # prefix: ubr-, 6개 리포트 공유

src/pages/reports/us-bigtech-salary-comparison-2026.astro
public/scripts/us-bigtech-salary-comparison-2026.js
src/styles/scss/pages/_us-bigtech-salary-comparison-2026.scss       # prefix: ubc-

public/og/tools/us-bigtech-salary-by-level-calculator.png
public/og/reports/{slug}.png  (7개)
```

---

## 2. 구현 범위

### 2-1. MVP 범위
- 6개사 × 5단계 tier(entry/mid/senior/staff/principal) 보상 데이터 (Base/Stock/Bonus/Total, USD + 원화 환산)
- 통합 계산기: 회사 선택 + tier 선택 + 환율 슬라이더 → 총보상 KPI, 구성 비율 차트, 월 환산액
- 회사별 리포트 6개: 레벨별 비교 테이블, 보상 구성 차트, 계산기/허브/타사 리포트 링크, FAQ
- 허브 리포트: tier 토글 + 6개사 비교 막대 차트, 회사별 전체 레벨 테이블(접기), 보상 구성(Base vs Stock 비중) 비교
- URL 파라미터 상태 공유 (계산기: `?company=&tier=&fx=`, 리포트: 별도 파라미터 불필요)
- 모든 수치에 "levels.fyi 2025~2026 기준 추정치", "환율 1,400원 가정" 고지

### 2-2. MVP 제외 범위
- 지역별(베이 에어리어 vs 기타 도시) 보상 차이 — 1차는 미국 전체 평균/중앙값 기준만
- distinguished tier — 표본 부족 회사(테슬라, 오라클, 아마존)는 1차 제외, principal까지 5단계만 사용
- 직무별(SWE/HW/PM 등) 세분화 — 1차는 Software Engineer 직군 기준 통일
- 실시간 levels.fyi API 연동 — 1차는 정적 데이터, 추후 수동 갱신
- 동적 OG 이미지 — 1차는 고정 OG 8장

---

## 3. 공통 데이터 스키마 (`src/data/usBigTechSalaryByLevel.ts`)

```ts
export type BigTechCompanyId =
  | "nvidia" | "apple" | "amazon" | "microsoft" | "tesla" | "oracle";

export type CompTier = "entry" | "mid" | "senior" | "staff" | "principal";

export type EvidenceBadge = "추정" | "levels.fyi 기준" | "표본 적음";

export interface BigTechLevelEntry {
  tier: CompTier;
  levelLabel: string;       // 회사 자체 레벨 표기 (예: "ICT4", "L6", "63", "P3", "IC-4")
  roleExample: string;      // 예시 직무 (예: "Senior Software Engineer")
  yearsExperience: string;  // 참고 연차 (예: "5~8년")
  baseUsd: number;
  stockUsd: number;         // 연 환산 RSU/스톡 보상
  bonusUsd: number;
  totalUsd: number;         // base+stock+bonus (검증: 합계 일치)
  badge: EvidenceBadge;
}

export interface BigTechCompanyConfig {
  id: BigTechCompanyId;
  name: string;             // "애플"
  nameEn: string;           // "Apple"
  shortName: string;        // "애플"
  industrySummary: string;  // 보상 구조 한줄 설명
  stockNote: string;        // RSU 베스팅 구조 설명
  levels: BigTechLevelEntry[]; // tier 5개 고정 순서: entry→mid→senior→staff→principal
  sourceNote: string;       // "levels.fyi 2025년 하반기~2026년 상반기 데이터 기준"
  caution: string;          // 회사별 주의사항
  detailHref: string;       // `/reports/{slug}/`
}

export const EXCHANGE_RATE_KRW = 1400; // 1 USD = 1,400원 (사이트 공통 기준)
export const EXCHANGE_RATE_RANGE = { min: 1200, max: 1600, step: 10 };

export const COMP_TIER_META: Record<CompTier, { label: string; shortLabel: string; yearsHint: string }> = {
  entry:     { label: "엔트리 (신입~2년)",   shortLabel: "엔트리",   yearsHint: "0~2년" },
  mid:       { label: "미드 (3~5년)",        shortLabel: "미드",     yearsHint: "3~5년" },
  senior:    { label: "시니어 (5~8년)",      shortLabel: "시니어",   yearsHint: "5~8년" },
  staff:     { label: "스태프 (8~12년)",     shortLabel: "스태프",   yearsHint: "8~12년" },
  principal: { label: "프린시플 (12년+)",    shortLabel: "프린시플", yearsHint: "12년+" },
};

export const BIGTECH_COMPANIES: BigTechCompanyConfig[] = [ /* 6개사, 4장 데이터 참고 */ ];

// 원화 환산 헬퍼 (계산기/리포트 공용)
export function usdToKrw(usd: number, rate: number = EXCHANGE_RATE_KRW): number {
  return Math.round(usd * rate);
}

export const UBG_FAQ = [ /* 계산기 FAQ 5개, 7장 참고 */ ];
export const UBG_RELATED_LINKS = [ /* 계산기 관련 링크, 7장 참고 */ ];
```

> 원화(`*Krw`) 필드는 데이터 파일에 고정 저장하지 않고, `usdToKrw()`로 런타임 계산한다(환율 슬라이더 대응). 단, 정적 리포트 페이지의 SSR 테이블은 `EXCHANGE_RATE_KRW`(1,400원) 고정값으로 1회 계산해 렌더링한다.

---

## 4. 6개사 데이터 (levels.fyi 2025~2026 기준 조사 결과)

> 모든 수치는 levels.fyi 공개 중앙값/구간 기준이며, 표본 수·시점에 따라 변동될 수 있는 **추정치**입니다. 구현 시 `npm run build` 전 levels.fyi 최신 페이지로 재확인 권장. Base/Stock/Bonus 세부 분해가 출처에 없는 레벨은 전체 비율을 참고해 추정 분해(`추정` 배지) 처리.

### 4-1. 애플 (Apple) — `apple`
- `industrySummary`: "ICT2~ICT6 레벨 체계, RSU 비중이 레벨이 올라갈수록 급격히 커지는 구조"
- `stockNote`: "RSU는 4년 베스팅(연 25%)이 기본이며, 입사 시점 주가 대비 현재 주가 변동에 따라 실제 수령액이 달라질 수 있습니다."

| tier | levelLabel | roleExample | yearsExperience | baseUsd | stockUsd | bonusUsd | totalUsd | badge |
|---|---|---|---|---|---|---|---|---|
| entry | ICT2 | Software Engineer | 0~2년 | 140,191 | 24,934 | 6,360 | 171,485 | levels.fyi 기준 |
| mid | ICT3 | Software Engineer II | 3~5년 | 166,944 | 47,735 | 9,198 | 223,877 | levels.fyi 기준 |
| senior | ICT4 | Senior Software Engineer | 5~8년 | 214,431 | 103,944 | 16,845 | 335,220 | levels.fyi 기준 |
| staff | ICT5 | Staff Software Engineer | 8~12년 | 250,000 | 205,000 | 21,000 | 476,000 | 추정 |
| principal | ICT6 | Principal/Sr. Staff Engineer | 12년+ | 305,143 | 450,714 | 39,857 | 795,714 | levels.fyi 기준 |

- `caution`: "ICT5 구간은 levels.fyi 표본 평균(약 47만 6천 달러)을 기준으로 Base/Stock/Bonus 비율을 ICT4~ICT6 추세에 맞춰 추정 분해했습니다."

### 4-2. 엔비디아 (NVIDIA) — `nvidia`
- `industrySummary`: "IC2~IC6 레벨, NSU(주가 연동 유닛) 비중이 매우 크며 IC3 이상은 사인온 보너스 외 정기 보너스가 거의 없음"
- `stockNote`: "NSU는 분기별 6.25%씩(4년) 베스팅되며, 최근 주가 급등기에는 levels.fyi 신규 등록 패키지의 NSU 평가액이 실제 입사 시점보다 높게 잡혀 있을 수 있습니다."

| tier | levelLabel | roleExample | yearsExperience | baseUsd | stockUsd | bonusUsd | totalUsd | badge |
|---|---|---|---|---|---|---|---|---|
| entry | IC2 | Software Engineer | 0~2년 | 150,000 | 60,000 | 10,000 | 220,000 | 추정 |
| mid | IC3 | Software Engineer | 3~5년 | 175,000 | 110,000 | 6,000 | 291,000 | 추정 |
| senior | IC4 | Senior Software Engineer | 5~8년 | 205,000 | 178,000 | 5,000 | 388,000 | levels.fyi 기준 |
| staff | IC5 | Staff Engineer | 8~12년 | 230,000 | 322,000 | 4,911 | 556,911 | levels.fyi 기준 |
| principal | IC6 | Principal Engineer | 12년+ | 260,000 | 376,000 | 3,917 | 639,917 | levels.fyi 기준 |

- `caution`: "IC2·IC3 구간은 levels.fyi 종합 중앙값($220K, ~$291K)을 기준으로 Base/Stock/Bonus 비율을 IC4 이상 추세 역산해 추정 분해했습니다. IC3 이상부터는 정기 보너스 비중이 매우 작습니다."

### 4-3. 아마존 (Amazon) — `amazon`
- `industrySummary`: "L4~L7+ 레벨, 입사 초기 1~2년은 사인온 보너스로 낮은 RSU를 보완하는 구조(이른바 '클리프')가 특징"
- `stockNote`: "RSU는 1년차 5%, 2년차 15%, 3·4년차 각 40%로 베스팅되어 입사 3년 차부터 총보상이 크게 점프합니다. 표의 Stock 값은 4년 평균 환산입니다."

| tier | levelLabel | roleExample | yearsExperience | baseUsd | stockUsd | bonusUsd | totalUsd | badge |
|---|---|---|---|---|---|---|---|---|
| entry | L4 (SDE I) | Software Development Engineer I | 0~2년 | 135,000 | 45,000 | 9,000 | 189,000 | levels.fyi 기준 |
| mid | L5 (SDE II) | Software Development Engineer II | 3~5년 | 165,000 | 100,000 | 7,000 | 272,000 | levels.fyi 기준 |
| senior | L6 (Senior SDE) | Senior SDE | 5~8년 | 185,000 | 210,000 | 12,000 | 407,000 | levels.fyi 기준 |
| staff | L7 (Principal SDE) | Principal SDE | 8~12년 | 225,000 | 390,000 | 19,000 | 634,000 | levels.fyi 기준 |
| principal | L7+ (Sr. Principal) | Senior Principal Engineer | 12년+ | 240,000 | 520,000 | 25,000 | 785,000 | 추정 |

- `caution`: "L7 이상(Senior Principal, L8)은 levels.fyi 표본이 적어 L7 대비 증가율을 다른 회사 staff→principal 비율에 맞춰 추정했습니다. 아마존은 L7을 staff와 principal 양쪽에 걸쳐 표시되는 경우가 많아 principal 행은 참고용입니다."

### 4-4. 마이크로소프트 (Microsoft) — `microsoft`
- `industrySummary`: "59~67+ 숫자 레벨 체계, 59-60(SDE), 61-62(SDE II), 63-64(Senior SDE), 65-67(Principal)"
- `stockNote`: "RSU는 5년 베스팅(연 20%)으로 다른 빅테크보다 분산되어 있어, 연간 환산 스톡 비중이 비교적 낮게 나타납니다."

| tier | levelLabel | roleExample | yearsExperience | baseUsd | stockUsd | bonusUsd | totalUsd | badge |
|---|---|---|---|---|---|---|---|---|
| entry | 59 | Software Engineer | 0~2년 | 120,000 | 38,000 | 8,000 | 166,000 | levels.fyi 기준 |
| mid | 61 | Software Engineer II | 3~5년 | 135,000 | 45,000 | 9,000 | 189,000 | levels.fyi 기준 |
| senior | 63 | Senior Software Engineer | 5~8년 | 155,000 | 65,000 | 13,000 | 233,000 | levels.fyi 기준 |
| staff | 64 | Senior Software Engineer II | 8~12년 | 168,000 | 85,000 | 19,000 | 272,000 | levels.fyi 기준 |
| principal | 65 | Principal Software Engineer | 12년+ | 180,000 | 120,000 | 21,000 | 321,000 | levels.fyi 기준 |

- `caution`: "마이크로소프트는 동일 레벨 내에서도 직군(코어 엔지니어링 vs 일반)별 보상 차이가 크고, 67(Partner) 이상은 별도 협상 영역이라 1차 비교에서 제외했습니다. 6개사 중 총보상 수준이 가장 낮게 나타나는 점에 유의하세요."

### 4-5. 테슬라 (Tesla) — `tesla`
- `industrySummary`: "P1~P6 레벨, RSU 대신 스톡옵션(주식 1주 대신 옵션 3주) 선택 가능, 빅테크 중 표본이 가장 적고 보상 구조가 비정형적"
- `stockNote`: "테슬라는 RSU 또는 스톡옵션(RSU 1주 = 옵션 3주) 중 선택 가능합니다. 표의 Stock 값은 RSU 기준 연 환산입니다."

| tier | levelLabel | roleExample | yearsExperience | baseUsd | stockUsd | bonusUsd | totalUsd | badge |
|---|---|---|---|---|---|---|---|---|
| entry | P1 | Associate Software Engineer | 0~2년 | 105,000 | 18,000 | 5,000 | 128,000 | levels.fyi 기준 |
| mid | P2 | Software Engineer | 3~5년 | 125,000 | 30,000 | 9,000 | 164,000 | levels.fyi 기준 |
| senior | P3 | Senior Software Engineer | 5~8년 | 150,000 | 45,000 | 12,000 | 207,000 | levels.fyi 기준 |
| staff | P4 | Staff Software Engineer | 8~12년 | 190,000 | 130,000 | 19,000 | 339,000 | levels.fyi 기준 |
| principal | P5/P6 | Principal/Sr. Staff Engineer | 12년+ | 230,000 | 240,000 | 30,000 | 500,000 | 표본 적음 |

- `caution`: "테슬라는 P5 이상 표본이 매우 적어(levels.fyi P6 보고치는 $767K로 P4 대비 급격한 점프) principal 행은 P4 대비 증가율을 다른 회사 staff→principal 평균 비율로 추정한 참고치입니다. 실제 분포는 매우 넓을 수 있습니다."

### 4-6. 오라클 (Oracle) — `oracle`
- `industrySummary`: "IC-2~IC-5+ 레벨(Member of Technical Staff 체계), 빅테크 중 Base 비중이 상대적으로 높고 Bonus는 거의 미미"
- `stockNote`: "RSU는 4년 베스팅이며 1년차 40%, 2년차 30%, 3년차 20%, 4년차 10%로 초반에 더 많이 베스팅되는 구조입니다(역가중)."

| tier | levelLabel | roleExample | yearsExperience | baseUsd | stockUsd | bonusUsd | totalUsd | badge |
|---|---|---|---|---|---|---|---|---|
| entry | IC-2 | Member of Technical Staff | 0~2년 | 129,000 | 47,000 | 600 | 176,600 | levels.fyi 기준 |
| mid | IC-3 | Senior MTS | 3~5년 | 160,000 | 62,400 | 100 | 222,500 | levels.fyi 기준 |
| senior | IC-4 | Principal MTS | 5~8년 | 196,000 | 91,200 | 1,200 | 288,400 | levels.fyi 기준 |
| staff | IC-5 | Senior Principal MTS | 8~12년 | 230,000 | 270,000 | 4,500 | 504,500 | levels.fyi 기준 |
| principal | IC-6 | Architect/Sr. Director (참고) | 12년+ | 260,000 | 380,000 | 6,000 | 646,000 | 추정 |

- `caution`: "오라클 IC-6 이상은 levels.fyi 공개 표본이 거의 없어 IC-5 대비 증가율을 다른 회사 staff→principal 평균 비율로 추정했습니다. IC-2~IC-5는 levels.fyi 2026년 3월 데이터 기준입니다."

---

## 5. 통합 계산기 (`tools/us-bigtech-salary-by-level-calculator`)

### 5-1. 페이지 목적
- "엔비디아 시니어면 연봉이 원화로 얼마야?"를 즉시 계산
- 환율 슬라이더로 "환율이 변하면 내 원화 연봉이 얼마나 바뀌는지" 체감
- Base/Stock/Bonus 구성 비율을 통해 "스톡 비중이 큰 회사"를 직관적으로 이해

### 5-2. 입력값
| 필드 | 타입 | 기본값 | 설명 |
|---|---|---|---|
| `company` | select (6개사) | `"apple"` | URL 파라미터 `company` |
| `tier` | select (entry~principal, 선택한 회사 기준 동적) | `"senior"` | URL 파라미터 `tier` |
| `exchangeRate` | range 슬라이더 1,200~1,600, step 10 | `1400` | URL 파라미터 `fx` |

- 회사를 바꾸면 `tier` select의 옵션 라벨(`levelLabel` + `roleExample`)이 해당 회사 데이터로 갱신되지만, tier 값(entry~principal) 자체는 유지된다.

### 5-3. 출력값
#### 메인 출력 (결과 우선 카드)
- 한 줄 요약: `"{회사명} {levelLabel}({tier 라벨}) 기준 총보상은 약 {totalKrw}원(연)으로 추정됩니다."`
- 총보상 KPI: USD 표시 + KRW 표시 (큰 글자)
- 월 환산 금액 (`totalKrw / 12`)
- Base / Stock / Bonus 구성 도넛 차트 + 범례(각 USD/KRW, %)

#### 보조 출력
- 환율별 비교 미니 테이블: 1,200 / 1,300 / 1,400 / 1,500 / 1,600원일 때 총보상(KRW) — 슬라이더 값 행 강조
- "다른 회사 동급(tier) 비교" 링크 카드: 6개사 중 선택한 tier에서의 총보상(KRW) 간단 바 차트 (허브 리포트의 미니 버전, 클릭 시 허브로 이동)
- 선택한 회사 리포트 링크 (`detailHref`)

### 5-4. 계산 로직
```js
function getEntry(companyId, tier) {
  const company = BIGTECH_COMPANIES.find(c => c.id === companyId);
  return company.levels.find(l => l.tier === tier);
}

function calculate(companyId, tier, fxRate) {
  const entry = getEntry(companyId, tier);
  return {
    baseKrw: usdToKrw(entry.baseUsd, fxRate),
    stockKrw: usdToKrw(entry.stockUsd, fxRate),
    bonusKrw: usdToKrw(entry.bonusUsd, fxRate),
    totalKrw: usdToKrw(entry.totalUsd, fxRate),
    monthlyKrw: usdToKrw(entry.totalUsd, fxRate) / 12,
    stockRatio: entry.stockUsd / entry.totalUsd,
    baseRatio: entry.baseUsd / entry.totalUsd,
    bonusRatio: entry.bonusUsd / entry.totalUsd,
  };
}
```
- 환율 비교 미니 테이블은 `[1200,1300,1400,1500,1600]`을 순회하며 `usdToKrw(entry.totalUsd, rate)` 계산
- "다른 회사 비교" 바 차트는 6개사의 `levels.find(l => l.tier === currentTier).totalUsd`를 `EXCHANGE_RATE_KRW`(슬라이더 값 반영 가능)로 환산해 정렬

### 5-5. 섹션 구조 (IA)
1. `CalculatorHero` — "미국 빅테크 연봉 계산기 — 직급별 원화 환산 2026"
2. `InfoNotice` — "levels.fyi 2025~2026년 공개 데이터 기준 추정치, 환율 1,400원 가정(직접 조정 가능), 지역·직군에 따라 실제 보상은 다를 수 있음"
3. 입력 영역 — 회사 select + tier select + 환율 슬라이더 (PC 1행 3열, 모바일 1열)
4. 결과 우선 카드 (`resultFirst`)
   - 핵심 요약 카드 (한 줄 카피 + 총보상 USD/KRW + 월 환산)
   - 보상 구성 도넛 차트
5. 환율별 비교 미니 테이블
6. 동급 레벨 6개사 비교 미니 바 차트 + "전체 비교 보기" → 허브 리포트 링크
7. 선택 회사 리포트 카드 (해당 회사 `detailHref`로 이동)
8. `SeoContent` (소개, 기준 설명, FAQ 5개, 관련 링크 3개)

### 5-6. URL 파라미터
- `?company=nvidia&tier=staff&fx=1400`
- 6개 회사 리포트 페이지의 "계산기로 보기" CTA에서 해당 회사의 대표 tier(예: senior)로 진입하는 딥링크로 사용

---

## 6. 회사별 리포트 공통 템플릿 (6개 페이지)

### 6-1. 템플릿 공유 방식
- 6개 `.astro` 페이지는 각자 `BIGTECH_COMPANIES`에서 자기 회사 `id`로 데이터를 가져와 동일한 마크업 구조를 렌더링 (공통 컴포넌트화는 1차 생략, 마크업 복붙 + 데이터만 다르게 — Astro 컨벤션상 페이지별 `.astro` 유지)
- 스타일은 `_us-bigtech-salary-report.scss` 1개를 6개 페이지가 공유 (`ubr-` prefix)
- 스크립트는 `us-bigtech-salary-report.js` 1개를 공유하되, 각 페이지의 `<script type="application/json" id="ubrConfig">`에 `companyId`를 주입해 분기

### 6-2. 섹션 구조 (IA) — 6개 리포트 공통
1. `CalculatorHero` — "{회사명} 연봉 레벨별 정리 2026 — ICT2~ICT6 원화 환산"
2. `InfoNotice` — "levels.fyi 기준 추정치, 환율 1,400원 가정, 조사 시점 명시"
3. KPI 그리드 (4개)
   - 최저 tier 총보상(KRW)
   - 최고 tier 총보상(KRW)
   - 평균 스톡 비중(%)
   - 환율 기준 ("1,400원 / 2026년 6월 기준")
4. 레벨별 비교 테이블 (PC 테이블 / 모바일 카드)
   - 컬럼: tier 라벨, `levelLabel`, `roleExample`, `yearsExperience`, Base(USD/KRW), Stock(USD/KRW), Bonus(USD/KRW), Total(USD/KRW), `badge`
5. 레벨별 보상 구성 누적 바 차트 (Stacked Bar: Base/Stock/Bonus, x축 = tier)
6. 보상 구조 설명 섹션 — `industrySummary`, `stockNote`, `caution` 텍스트 카드
7. CTA 그리드 (2개)
   - "내 연봉으로 직접 계산하기" → `/tools/us-bigtech-salary-by-level-calculator/?company={id}&tier=senior`
   - "6개사 한눈에 비교하기" → `/reports/us-bigtech-salary-comparison-2026/`
8. 다른 회사 리포트 링크 카드 그리드 (5개사, 작은 카드)
9. `SeoContent` — intro 2~3문단 + criteria + FAQ 5개 + 관련 링크 3개 (계산기, 허브, IT_TOP10 등)

### 6-3. 페이지별 차이점
- 타이틀/설명/`industrySummary`/`stockNote`/`caution`/데이터 테이블만 회사별로 다름
- FAQ는 공통 질문 3개(보상 구성, 환율 가정, levels.fyi 신뢰도) + 회사별 특화 질문 2개(예: "엔비디아는 왜 보너스가 적나요?", "테슬라 스톡옵션은 RSU와 뭐가 다른가요?")

---

## 7. 허브 비교 리포트 (`reports/us-bigtech-salary-comparison-2026`)

### 7-1. 페이지 목적
- "엔비디아 vs 애플 vs ... 같은 레벨이면 누가 제일 많이 받나"를 한 화면에서 비교
- 6개 회사 리포트 + 계산기로의 내부링크 허브 역할

### 7-2. 섹션 구조 (IA)
1. `CalculatorHero` — "미국 빅테크 6개사 연봉 비교 2026 — 엔비디아·애플·아마존·MS·테슬라·오라클"
2. `InfoNotice` — 추정치/환율 고지 (6개 리포트와 동일 문구)
3. KPI 그리드
   - 6개사 중 entry tier 최고/최저 총보상 회사
   - 6개사 중 principal tier 최고/최저 총보상 회사
   - 평균 스톡 비중 최고 회사
   - 환율 기준
4. **tier 토글 비교 차트** (핵심 섹션)
   - 탭/세그먼트 버튼: 엔트리 / 미드 / 시니어 / 스태프 / 프린시플 (5개)
   - 선택한 tier에서 6개사 총보상(KRW) 가로 바 차트, 내림차순 정렬
   - 바 위/옆에 `levelLabel` + `roleExample` 표기 (예: "애플 ICT4 · Senior SE")
5. 보상 구성 비교 (Stock 비중) — 6개사 × principal tier 기준 Stock 비율 가로 바 차트 (스톡 의존도 인사이트)
6. 회사별 전체 레벨 테이블 (접기/펼치기 아코디언, 6개)
7. 회사별 리포트 카드 그리드 (6개, `detailHref`로 이동)
8. 계산기 CTA — "직접 계산해보기" → `/tools/us-bigtech-salary-by-level-calculator/`
9. `SeoContent` — intro + criteria + FAQ 5개(예: "빅테크 중 연봉이 가장 높은 회사는?", "스톡 비중이 가장 큰 회사는?", "신입 기준으로는 어디가 가장 높나?") + 관련 링크 3개

### 7-3. tier 토글 비교 차트 — 상세
- 5개 tier 탭, 기본 선택: `"senior"`
- 데이터: `BIGTECH_COMPANIES.map(c => ({ name: c.shortName, entry: c.levels.find(l => l.tier === selectedTier) }))`
- 정렬: `totalUsd` 내림차순
- Chart.js 가로 바(`indexAxis: 'y'`), 각 바 클릭 시 해당 회사 리포트로 이동(옵션)
- 모바일: 가로 바 차트는 세로 스크롤 영역에 그대로 표시(6개 항목이면 라벨 겹침 위험 적음)

---

## 8. 컴포넌트/스타일 컨벤션

- 계산기: `SimpleToolShell`, `resultFirst={true}`, prefix `ubg-`
- 6개 리포트: 인터랙티브 리포트 레이아웃(`report-page` 클래스 + `SeoContent`), prefix `ubr-`
- 허브 리포트: 동일 리포트 레이아웃, prefix `ubc-`
- 공통: `KpiCard`/`SummaryCards`, `InfoNotice`, `ToolActionBar`(계산기만), `SeoContent`
- 차트: `chart-config.js`의 공통 옵션 사용, Stacked Bar / Doughnut / Horizontal Bar
- 통화 포맷: 기존 `formatWon` 패턴 재사용 (억/만 단위 한국어 표기), USD는 `$` + `toLocaleString("en-US")`

---

## 9. 데이터 운영 규칙

- `BIGTECH_COMPANIES`의 모든 `totalUsd`는 `baseUsd + stockUsd + bonusUsd`와 일치해야 한다 (빌드 시 또는 PR 시 수동 검증).
- `badge: "추정"` 또는 `"표본 적음"`인 레벨은 회사별 리포트의 `caution` 텍스트와 비교 테이블의 배지 컬럼에 반드시 노출한다.
- `EXCHANGE_RATE_KRW`(1,400원)는 사이트 내 다른 미국 주식/연봉 관련 계산기(`usStockExchangeProfitCalculator.ts` 등)와 동일 기준을 유지하도록 갱신 시 함께 확인한다.
- levels.fyi 데이터는 분기 단위로 변동성이 크므로, 데이터 파일 상단 주석에 "조사 시점(YYYY-MM)"을 명시하고 분기별 1회 재확인을 권장한다.

---

## 10. 등록 파일

- `src/data/tools.ts` — 계산기 등록 (카테고리: `연봉·이직`, order는 기존 `couple-salary-rank-calculator` 등 인접 항목 참고해 배치)
- `src/data/reports.ts` — 7개 리포트 등록 (카테고리: `salary` 또는 신규 `global-salary`, 허브는 `isNew: true`)
- `src/styles/app.scss` — 3개 SCSS 파일 `@use` 추가
- `public/sitemap.xml` — 8개 URL 추가
- `src/pages/index.astro` — `topicBySlug`(계산기), `reportMetaBySlug`(7개 리포트) 추가
- `src/pages/reports/index.astro` — 7개 리포트 카드 노출 확인

---

## 11. 구현 순서

### 11-1. 1단계: 데이터 파일
- `src/data/usBigTechSalaryByLevel.ts` 생성
- 4장 데이터로 `BIGTECH_COMPANIES` 6개사 작성, `EXCHANGE_RATE_KRW`/`usdToKrw`/`COMP_TIER_META` 작성
- `totalUsd = baseUsd + stockUsd + bonusUsd` 검증

### 11-2. 2단계: 애플 리포트 (파일럿)
- `src/pages/reports/apple-salary-by-level-2026.astro` — 6장 IA 기준으로 작성, 이때 6개 리포트 공유 컴포넌트 구조/클래스명 확정
- `public/scripts/us-bigtech-salary-report.js`, `_us-bigtech-salary-report.scss` 작성
- `npm run dev` 프리뷰로 레벨별 테이블 + 누적 바 차트 동작 확인

### 11-3. 3단계: 통합 계산기
- `src/pages/tools/us-bigtech-salary-by-level-calculator.astro`, `public/scripts/us-bigtech-salary-by-level-calculator.js`, `_us-bigtech-salary-by-level-calculator.scss`
- 애플 데이터로 회사/tier/환율 입력 → 결과 카드/도넛 차트/환율 비교 테이블 동작 확인
- URL 파라미터(`company`/`tier`/`fx`) 동기화 확인

### 11-4. 4단계: 나머지 5개사 리포트
- 엔비디아 → 아마존 → 마이크로소프트 → 테슬라 → 오라클 순으로 `.astro` 페이지 생성 (애플 템플릿 복제 + 데이터/문구만 교체)
- 각 페이지에서 계산기 딥링크(`?company={id}&tier=senior`), 다른 회사 링크, 허브 링크 채우기

### 11-5. 5단계: 허브 비교 리포트
- `src/pages/reports/us-bigtech-salary-comparison-2026.astro`, `public/scripts/us-bigtech-salary-comparison-2026.js`, `_us-bigtech-salary-comparison-2026.scss`
- tier 토글 + 6개사 바 차트, Stock 비중 비교, 아코디언 테이블 구현
- 6개 리포트의 "6개사 한눈에 비교하기" 링크가 허브로 정상 연결되는지 확인

### 11-6. 6단계: 등록 및 SEO 마무리
- `tools.ts`/`reports.ts`/`sitemap.xml`/`index.astro`/`reports/index.astro` 일괄 반영
- 8개 페이지 `SeoContent`(FAQ 5개, 관련 링크 3개) 작성
- `npm run og:generate`로 OG 이미지 8장 생성

### 11-7. 7단계: 빌드/배포 점검
- `npm run build` 통과 확인 (8페이지 추가 반영)
- `DEPLOY_CHECKLIST.md` 기준 점검

---

## 12. QA 체크포인트

### 12-1. 데이터
- [ ] 6개사 × 5 tier 모두 `totalUsd = baseUsd + stockUsd + bonusUsd` 일치
- [ ] `badge: "추정"`/`"표본 적음"` 레벨이 테이블/캡션/`caution`에 모두 노출
- [ ] `EXCHANGE_RATE_KRW`(1,400원) 변경 시 계산기·6개 리포트·허브 모두 일관되게 반영(리포트는 SSR 고정값, 계산기는 슬라이더)

### 12-2. 계산기 UI
- [ ] 회사 변경 시 tier select 라벨이 해당 회사 `levelLabel`/`roleExample`로 갱신
- [ ] 환율 슬라이더 변경 시 총보상 KRW/월 환산/환율 비교 테이블/도넛 차트 모두 재계산
- [ ] URL 파라미터(`company`/`tier`/`fx`)로 진입 시 초기 상태 정확히 복원
- [ ] 모바일에서 입력 3종(회사/tier/환율) 1열 정렬, 도넛 차트 라벨 겹침 없음

### 12-3. 리포트 UI (6개 + 허브)
- [ ] 레벨별 비교 테이블 모바일 카드 전환 정상
- [ ] 누적 바 차트(6개 리포트)·tier 토글 바 차트(허브) 라벨/범례 겹침 없음
- [ ] 6개 리포트 ↔ 계산기 ↔ 허브 ↔ 타사 리포트 상호 링크 누락 없음 (각 리포트 최소 3개 내부링크: 계산기, 허브, 다른 회사 1개 이상)
- [ ] 허브의 tier 토글 변경 시 차트/정렬 즉시 갱신

### 12-4. SEO/운영
- [ ] `tools.ts`/`reports.ts` 등록 및 `/tools/`, `/reports/` 목록 노출 확인
- [ ] `sitemap.xml` 8개 URL 반영
- [ ] 8개 페이지 `SeoContent` FAQ 5개 + JSON-LD
- [ ] `InfoNotice`에 "levels.fyi 추정치 + 조사 시점 + 환율 1,400원 가정" 문구 8개 페이지 공통 적용
- [ ] `npm run build` 8페이지 증가 확인

---

## 13. 구현 메모 및 확장 방향

### 13-1. 기존 페이지와의 관계
- `itSalaryTop10.ts`(국내 IT 연봉) — 향후 "글로벌 vs 국내 연봉" 비교 콘텐츠로 자연스럽게 연결 가능 (1차 범위 외, 관련 링크로만 언급 검토)
- `usStockExchangeProfitCalculator.ts` — 환율 가정(1,400원) 공유, "환율이 연봉에 미치는 영향" 메시지로 연결

### 13-2. 향후 데이터 갱신
- levels.fyi는 분기별로 중앙값이 변동 → `usBigTechSalaryByLevel.ts` 상단에 "최근 확인: 2026-06" 주석을 남기고, 분기 1회 재확인 루틴화
- `badge: "추정"`/`"표본 적음"` 항목은 실제 levels.fyi 표본이 늘어나면 우선 교체 대상

### 13-3. 확장 후보
- principal 상위 단계(Distinguished/Fellow/VP) 비교 — 표본 확보 시 6번째 tier 추가
- 지역별(베이 에어리어 vs 시애틀 vs 오스틴) 보상 차이 비교 모듈
- 한국 개발자가 미국 이직 시 세금(미국 federal+state tax)까지 반영한 "실수령" 추정 — `bonus-after-tax-calculator` 패턴 응용

---

## 부록: 참고 출처
- [Apple ICT6 Software Engineer Salary | Levels.fyi](https://www.levels.fyi/companies/apple/salaries/software-engineer/levels/ict6)
- [Apple ICT4 Software Engineer Salary | Levels.fyi](https://www.levels.fyi/companies/apple/salaries/software-engineer/levels/ict4)
- [Apple ICT3 Software Engineer Salary | Levels.fyi](https://www.levels.fyi/companies/apple/salaries/software-engineer/levels/ict3)
- [Apple ICT2 Software Engineer Salary | Levels.fyi](https://www.levels.fyi/companies/apple/salaries/software-engineer/levels/ict2)
- [Nvidia IC4/IC5/IC6 Software Engineer Salary | Levels.fyi](https://www.levels.fyi/companies/nvidia/salaries/software-engineer)
- [Amazon Software Engineer Salary | Levels.fyi](https://www.levels.fyi/companies/amazon/salaries/software-engineer)
- [Microsoft Software Engineer Salary | Levels.fyi](https://www.levels.fyi/companies/microsoft/salaries/software-engineer)
- [Tesla Software Engineer Salary | Levels.fyi](https://www.levels.fyi/companies/tesla/salaries/software-engineer)
- [Oracle IC-2~IC-5 Software Engineer Salary | Levels.fyi](https://www.levels.fyi/companies/oracle/salaries/software-engineer)
