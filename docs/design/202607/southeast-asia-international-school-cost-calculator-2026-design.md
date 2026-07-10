# 동남아 국제학교 비용 계산기 2026 — 설계 문서 (상세판)

> 기획 원본: [`docs/plan/202607/southeast-asia-international-school-content-plan.md`](../../plan/202607/southeast-asia-international-school-content-plan.md)
> 작성일: 2026-07-09
> 유형: 계산기 (`/tools/`) — 실시간 입력 반영, URL 파라미터 상태 보존
> 클러스터 1번 페이지 (메인 계산기)

---

## 0. ⚠️ 데이터 신뢰도 현황 (2026-07-09 리서치 완료 — v1 스코프 전체 복원)

최초 조사는 세션 한도로 중단되어 대부분 도시가 비어 있었지만, **후속 리서치(3차)로 6개 도시(쿠알라룸푸르·조호바루·방콕·치앙마이·호치민·하노이) 전체의 학교·생활비·환율 데이터를 확보**했다. 그 결과 [계획서](../../plan/202607/southeast-asia-international-school-content-plan.md)가 원래 전제했던 **3개국 각 2개 도시 풀 스코프로 v1 launch를 복원**한다 — 이전 리비전에서 권고했던 "각국 1개 도시로 축소" 결정은 철회한다.

### 0-1. 데이터 신뢰도 3단계 분류

| 등급 | 의미 |
|---|---|
| `official_confirmed` | 학교 공식 페이지·PDF 원문을 실제로 열어 숫자를 대조 확인함 |
| `search_snippet` | 검색 결과 요약 또는 3자 집계 사이트(aggregator) 기반, 원문 직접 대조는 아직 안 함 |
| (제외) | 서로 다른 출처의 숫자가 일치하지 않거나, 공식 데이터 자체를 확인할 수 없어 데이터셋에서 뺀 항목 |

### 0-2. 국가·도시별 최종 데이터 현황

| 국가 | 도시 | 학교 데이터 | 생활비 | 환율 | 상태 |
|---|---|---|---|---|---|
| 말레이시아 | 쿠알라룸푸르 | 5개교(`search_snippet`) | 확보 (주거비 등급별 포함) | **MYR 1 = 368.4원 확정** | **launch 가능** |
| 말레이시아 | 조호바루 | 3개교 — Marlborough·R.E.A.L·Crescendo-HELP **전부 `official_confirmed`** | **미확보 (유일한 잔여 블로커)** | 동일 | 학교 데이터는 완비, 생활비만 보강 필요 |
| 태국 | 방콕 | 7개교 — ISB·Harrow·Shrewsbury·KIS(`search_snippet`) + Bangkok Patana·Bangkok Prep(`official_confirmed`), NIST는 여전히 제외 | 확보 (주거비 등급별 포함) | **THB 1 = 44.95원 확정** | **launch 가능** |
| 태국 | 치앙마이 | 4개교 — PTIS·CMIS(`official_confirmed`, PTIS는 2024-25 구버전 주의) + Grace·American Pacific(`search_snippet`) | 확보 | 동일 | **launch 가능** |
| 베트남 | 호치민 | 4개교 — AIS만 `official_confirmed`, BIS·ISHCMC·Renaissance는 `search_snippet`. AISVN은 **폐교 확인**(2026-01 해산) | 확보 | **VND 1 = 0.05715원 확정** | **launch 가능** |
| 베트남 | 하노이 | 5개교 — BIS·BVIS·Concordia `official_confirmed`, UNIS·HIS `search_snippet` | 확보 | 동일 | **launch 가능** |

**남은 블로커는 조호바루 생활비 1건뿐.** 나머지 5개 도시는 학교·생활비·환율이 모두 갖춰져 계산기가 정상 동작한다. 조호바루는 학교 데이터만으로 리포트 비교표는 구성하되, 계산기에서 조호바루를 선택했을 때는 "생활비 데이터 준비 중, 학비만 표시"로 동작한다(4-2번 `dataCompleteness` 로직이 이미 이 경우를 처리하도록 설계되어 있다).

의료보험비는 6개 도시 전부 Numbeo에 항목이 없어 미확보 상태다 — 이는 생활비의 부분 항목 누락이라 launch를 막는 수준은 아니며, SeoContent에 "의료보험은 생활비 계산에 포함되지 않았다"는 안내로 처리한다.

### 0-3. 제외된 학교 최종 확정

- **NIST International School(방콕)**: 재검증 시도했으나 공식 사이트가 JS 렌더링이라 정적 조회로 수치를 못 얻었고, 검색 결과끼리도 여전히 서로 다른 수치(45만~113만 THB 범위)를 제시해 신뢰 불가 — 계속 제외.
- **"British International School Johor Bahru"**: 두 차례 조사에서 모두 실존 자체를 확인하지 못함(공식 홈페이지·독립 법인 미발견, 블로그 인용 수치도 다른 JB 학교 대비 비정상적으로 높음) — 데이터셋에 포함하지 않음.
- (참고) Bangkok Patana School, Marlborough College Malaysia, R.E.A.L Schools JB는 이전 리비전에서 "출처 불일치"로 제외했으나 **이번 재검증으로 공식 원문 확보 — 데이터셋에 정식 반영**.

---

## 1. 파일 목록

| 역할 | 경로 |
|---|---|
| 데이터 | `src/data/southeastAsiaInternationalSchoolCostCalculator2026.ts` |
| 도구 등록 | `src/data/tools.ts` |
| 도구 라이브러리 등록 | `src/pages/tools/index.astro` |
| 페이지 | `src/pages/tools/southeast-asia-international-school-cost-calculator-2026.astro` |
| 스크립트 | `public/scripts/southeast-asia-international-school-cost-calculator-2026.js` |
| 스타일 | `src/styles/scss/pages/_southeast-asia-international-school-cost-calculator-2026.scss` |
| 앱 CSS import | `src/styles/app.scss` |
| 사이트맵 | `public/sitemap.xml` |

**클래스 프리픽스:** `sac-` (Southeast Asia Cost)

---

## 2. URL 및 메타 (CLAUDE.md 타이틀 공식 적용)

```
슬러그: /tools/southeast-asia-international-school-cost-calculator-2026/
타이틀(seoTitle): 동남아 국제학교 비용 계산기 2026 | 학비·생활비 총비용 바로 계산
디스크립션: 국가·도시·학년·자녀 수 입력하면 동남아 국제학교 연간 학비와 가족 생활비를 합산해 바로 계산. 한국 국제학교 대비 절감액 비교 포함.
```

---

## 3. 데이터 파일 설계

**`src/data/southeastAsiaInternationalSchoolCostCalculator2026.ts`**

```ts
// ── 타입 ──────────────────────────────────────────

export type SeaCountry = "MY" | "TH" | "VN";

export type SeaCity =
  | "kuala_lumpur"
  | "johor_bahru"
  | "bangkok"
  | "chiang_mai"
  | "ho_chi_minh"
  | "hanoi";

export type SchoolTier = "budget" | "mid" | "premium";

// 이 클러스터에서 신설 — 데이터 신뢰도를 UI에도 노출해 "확실한 정보"와
// "검색 요약이라 재확인 필요한 정보"를 사용자에게도 구분해 보여준다.
export type DataConfidence = "official_confirmed" | "search_snippet";
// "unverified_conflicting" 등급은 타입에 아예 포함하지 않는다 —
// 이 등급 학교는 데이터셋에서 제외하고 실었다가 나중에 실수로 노출되는 사고를 원천 차단.

export type SeaCurrency = "MYR" | "THB" | "VND";

export type SeaTuitionTier = {
  tierKey: string;          // "early" | "elementary" | "middle" | "high" 등, 학교별 자유 정의
  tierLabel: string;        // "Year 1" 처럼 학교 실제 학년 표기 그대로 사용 (국내 클러스터와 동일 원칙)
  annualLocal: number;      // 연간 학비, 현지 통화 기준
};

export type SeaSchoolProfile = {
  id: string;
  name: string;
  nameKo: string;             // 검색용 한글 표기
  country: SeaCountry;
  city: SeaCity;
  cityLabel: string;          // "쿠알라룸팔" 오타 방지용 상수 재사용, "쿠알라룸푸르" 등
  tier: SchoolTier;
  curriculum: string;         // "영국식(IGCSE/A-Level)" 등
  currency: SeaCurrency;
  tuitionTiers: SeaTuitionTier[];
  sourceUrl: string;
  asOfDate: string;
  dataConfidence: DataConfidence;
  dataNote?: string;          // 데이터 한계 설명 (구간 겹침, 미확보 학년 등)
  closed?: boolean;           // true면 UI에서 "폐교" 배지 노출, 계산 대상에서 제외 (AISVN 사례 대비 필드)
};

export type SeaLivingCost = {
  city: SeaCity;
  cityLabel: string;
  currency: SeaCurrency;
  monthlyFamilyExclRentLocal: number | null;   // 가족(4인 기준) 월 생활비, 주거비 제외 — null이면 "확인 필요"
  monthlyRentLocal: {
    budget: number | null;
    mid: number | null;
    premium: number | null;
  };
  sourceUrl: string | null;
  asOfDate: string | null;
  dataConfidence: DataConfidence | null;
  note?: string;
};

export type SeaFxRate = {
  currency: SeaCurrency;
  krwPerUnit: number | null;   // null이면 "확인 필요" — 계산기는 이 경우 원화 환산 결과를 낼 수 없음
  asOfDate: string | null;
  sourceUrl: string | null;
};

export type FaqItem = { question: string; answer: string };
export type RelatedLink = { href: string; label: string; description: string };

// ── 메타 ──────────────────────────────────────────

export const SAC_META = {
  slug: "southeast-asia-international-school-cost-calculator-2026",
  title: "동남아 국제학교 비용 계산기",
  seoTitle: "동남아 국제학교 비용 계산기 2026 | 학비·생활비 총비용 바로 계산",
  seoDescription:
    "국가·도시·학년·자녀 수 입력하면 동남아 국제학교 연간 학비와 가족 생활비를 합산해 바로 계산. 한국 국제학교 대비 절감액 비교 포함.",
  description: "국가와 도시, 학년, 자녀 수, 부모 동반 여부를 입력하면 국제학교 연간 학비와 가족 생활비를 합산한 총비용을 바로 계산합니다.",
  updatedAt: "2026-07-09",
  dataNote:
    "학비는 학교 공식 페이지 또는 검색 결과 기준 2026-07-09 확인이며, 국가·도시별로 데이터 확인 수준이 다릅니다. 조호바루는 생활비 데이터가 아직 없어 학비만 표시됩니다. 실제 이주 전 반드시 현지 학교·부동산 정보를 재확인하세요.",
} as const;

// ── 학교 데이터 (v1 launch: 6개 도시 전체 — 쿠알라룸푸르·조호바루·방콕·치앙마이·호치민·하노이) ──────

export const SAC_SCHOOLS: SeaSchoolProfile[] = [
  // ===== 말레이시아 · 쿠알라룸푸르 =====
  {
    id: "gis-kl",
    name: "Garden International School",
    nameKo: "가든 인터내셔널 스쿨",
    country: "MY",
    city: "kuala_lumpur",
    cityLabel: "쿠알라룸푸르",
    tier: "premium",
    curriculum: "영국식 (IGCSE / A-Level)",
    currency: "MYR",
    tuitionTiers: [
      { tierKey: "early", tierLabel: "Year 1", annualLocal: 81_510 },
      { tierKey: "elementary_low", tierLabel: "Year 3-4", annualLocal: 93_150 },
      { tierKey: "elementary_high", tierLabel: "Year 5-6", annualLocal: 97_410 },
      { tierKey: "middle_low", tierLabel: "Year 7-8", annualLocal: 109_110 },
      { tierKey: "middle_high", tierLabel: "Year 9", annualLocal: 114_300 },
      { tierKey: "high_low", tierLabel: "Year 10-11", annualLocal: 116_880 },
      { tierKey: "high_high", tierLabel: "Year 12-13", annualLocal: 118_560 },
    ],
    sourceUrl: "https://www.gardenschool.edu.my/admissions/school-fees/",
    asOfDate: "2026-07-09",
    dataConfidence: "search_snippet",
    dataNote: "2025/26학년도 기준 검색 요약 — 2025년 7월부터 연 수업료 RM60,000 초과분에 6% 서비스세(SST)가 부과될 수 있어 세금 포함 여부 재확인 필요.",
  },
  {
    id: "mkis-kl",
    name: "Mont'Kiara International School",
    nameKo: "몬키아라 인터내셔널 스쿨",
    country: "MY",
    city: "kuala_lumpur",
    cityLabel: "쿠알라룸푸르",
    tier: "mid",
    curriculum: "미국식",
    currency: "MYR",
    tuitionTiers: [
      { tierKey: "early_prek3", tierLabel: "PreK3", annualLocal: 35_110 },
      { tierKey: "early_prek4", tierLabel: "PreK4", annualLocal: 41_690 },
      { tierKey: "early_kg", tierLabel: "Kindergarten", annualLocal: 83_290 },
      { tierKey: "elementary", tierLabel: "Grade 1-5", annualLocal: 102_120 },
      { tierKey: "middle", tierLabel: "Grade 6-8", annualLocal: 114_110 },
    ],
    sourceUrl: "https://www.mkis.edu.my/school-fees-2025---2026",
    asOfDate: "2026-07-09",
    dataConfidence: "search_snippet",
    dataNote: "고등학년(Grade 9-12) 학비 미확보 — 구현 전 재조사 필요. Kindergarten 구간에서 학비가 크게 뛰는 것으로 보이나 원문 대조 전이라 확정할 수 없음.",
  },
  {
    id: "alice-smith-kl",
    name: "The Alice Smith School",
    nameKo: "앨리스 스미스 스쿨",
    country: "MY",
    city: "kuala_lumpur",
    cityLabel: "쿠알라룸푸르",
    tier: "premium",
    curriculum: "영국식 (IGCSE / A-Level)",
    currency: "MYR",
    tuitionTiers: [
      { tierKey: "early", tierLabel: "Age 3~", annualLocal: 53_730 },
      { tierKey: "middle", tierLabel: "Year 7-9", annualLocal: 108_360 },
      { tierKey: "high", tierLabel: "Year 10-13", annualLocal: 117_360 },
    ],
    sourceUrl: "https://www.alice-smith.edu.my/join/tuition-and-fees",
    asOfDate: "2026-07-09",
    dataConfidence: "search_snippet",
    dataNote: "초등(Elementary) 구간 정확한 학년별 수치 미확보 — 검색 요약에는 '약 75,000+ MYR'로만 표기되어 이 데이터셋에서는 제외.",
  },
  {
    id: "nexus-kl",
    name: "Nexus International School Malaysia",
    nameKo: "넥서스 인터내셔널 스쿨 말레이시아",
    country: "MY",
    city: "kuala_lumpur",
    cityLabel: "쿠알라룸푸르",
    tier: "premium",
    curriculum: "IB",
    currency: "MYR",
    tuitionTiers: [
      { tierKey: "early_nursery", tierLabel: "Nursery", annualLocal: 46_050 },
      { tierKey: "early_reception", tierLabel: "Reception", annualLocal: 48_960 },
      { tierKey: "elementary_low", tierLabel: "Year 1-2", annualLocal: 59_460 },
      { tierKey: "elementary_high", tierLabel: "Year 5-6", annualLocal: 73_440 },
      { tierKey: "middle_low", tierLabel: "Year 7", annualLocal: 82_950 },
      { tierKey: "middle_high", tierLabel: "Year 8-9", annualLocal: 84_120 },
      { tierKey: "high_low", tierLabel: "Year 10-11", annualLocal: 96_420 },
      { tierKey: "high_high", tierLabel: "Year 12-13", annualLocal: 104_490 },
    ],
    sourceUrl: "https://www.nexus.edu.my/admissions/school-fees/",
    asOfDate: "2026-07-09",
    dataConfidence: "search_snippet",
  },
  {
    id: "sri-kdu-kl",
    name: "Sri KDU Kota Damansara (International)",
    nameKo: "스리 KDU 코타 다만사라",
    country: "MY",
    city: "kuala_lumpur",
    cityLabel: "쿠알라룸푸르",
    tier: "budget",
    curriculum: "영국식 / IB 혼합",
    currency: "MYR",
    tuitionTiers: [
      { tierKey: "elementary_low", tierLabel: "Year 1", annualLocal: 39_720 },
      { tierKey: "elementary_high", tierLabel: "Year 6", annualLocal: 56_780 },
    ],
    sourceUrl: "https://srikdu.edu.my/kota-damansara-international/fee-structure/",
    asOfDate: "2026-07-09",
    dataConfidence: "search_snippet",
    dataNote: "유치부·중등·고등 학비 미확보. 이 5개교 중 가장 저렴한 축이라 '저가형' 등급 대표로 실었으나, 학년 커버리지가 좁아 구현 전 보강 필요.",
  },

  // ===== 말레이시아 · 조호바루 (3개교 전부 공식 확인) =====
  {
    id: "marlborough-jb",
    name: "Marlborough College Malaysia",
    nameKo: "말버러 칼리지 말레이시아",
    country: "MY",
    city: "johor_bahru",
    cityLabel: "조호바루",
    tier: "premium",
    curriculum: "영국식 / IB",
    currency: "MYR",
    tuitionTiers: [
      { tierKey: "nursery", tierLabel: "Nursery", annualLocal: 63_000 },
      { tierKey: "pre_prep", tierLabel: "Pre-Prep (Reception-Year 3)", annualLocal: 119_400 },
      { tierKey: "prep_low", tierLabel: "Prep (Year 4-6)", annualLocal: 125_400 },
      { tierKey: "prep_high", tierLabel: "Prep (Year 7-8)", annualLocal: 141_300 },
      { tierKey: "senior_y9", tierLabel: "Senior (Year 9)", annualLocal: 141_300 },
      { tierKey: "senior_y10_11", tierLabel: "Senior (Year 10-11)", annualLocal: 153_600 },
      { tierKey: "senior_y12_13", tierLabel: "Senior (Year 12-13, Sixth Form)", annualLocal: 166_800 },
    ],
    sourceUrl: "https://www.marlboroughcollegemalaysia.org/admissions/fees/",
    asOfDate: "2026-07-09",
    dataConfidence: "official_confirmed",
    dataNote: "Day(통학) 기준 2026/27학년도 공식 페이지 원문 확인, 6% 서비스세(SST) 별도. Day Boarding·Full Boarding 옵션은 이보다 높음(원문 참고, 이 데이터셋에는 통학 기준만 반영).",
  },
  {
    id: "real-schools-jb",
    name: "R.E.A.L Schools Johor Bahru (International)",
    nameKo: "R.E.A.L 스쿨 조호바루",
    country: "MY",
    city: "johor_bahru",
    cityLabel: "조호바루",
    tier: "budget",
    curriculum: "Cambridge / 영국식 (국제부 트랙)",
    currency: "MYR",
    tuitionTiers: [
      { tierKey: "early", tierLabel: "Early Years", annualLocal: 13_760 },
      { tierKey: "y1_2", tierLabel: "Year 1-2", annualLocal: 22_540 },
      { tierKey: "y3_6", tierLabel: "Year 3-6", annualLocal: 24_270 },
      { tierKey: "y7", tierLabel: "Year 7", annualLocal: 26_110 },
      { tierKey: "y8", tierLabel: "Year 8", annualLocal: 26_900 },
      { tierKey: "y9", tierLabel: "Year 9", annualLocal: 27_260 },
      { tierKey: "y10_11", tierLabel: "Year 10-11", annualLocal: 30_210 },
    ],
    sourceUrl: "https://realschools.edu.my/johor-bahru-campus/fees-structure-jb/",
    asOfDate: "2026-07-09",
    dataConfidence: "official_confirmed",
    dataNote: "2026/27학년도 공식 페이지 원문 확인. 이 학교는 국제부(영국 커리큘럼)와 말레이시아 국가교육과정 트랙을 병행 운영 — 이 데이터는 국제부 기준만 사용(국가과정 트랙은 이보다 저렴하나 국제학교 비교 취지에 맞지 않아 제외). 조호바루 3개교 중 가장 저렴.",
  },
  {
    id: "crescendo-help-jb",
    name: "Crescendo-HELP International School (CHIS)",
    nameKo: "크레센도-헬프 인터내셔널 스쿨",
    country: "MY",
    city: "johor_bahru",
    cityLabel: "조호바루",
    tier: "mid",
    curriculum: "영국식 (IPC / Cambridge)",
    currency: "MYR",
    tuitionTiers: [
      { tierKey: "y1_2", tierLabel: "Year 1-2", annualLocal: 29_700 },
      { tierKey: "y10_11", tierLabel: "Year 10-11", annualLocal: 42_030 },
    ],
    sourceUrl: "https://chis.edu.my/school-fees/",
    asOfDate: "2026-07-09",
    dataConfidence: "official_confirmed",
    dataNote: "2025/26학년도 공식 페이지 원문 확인. Year 1-2·Year 10-11 양끝 학년만 확보 — 중간 학년 보간 필요. 5% 장학 할인(bursary)은 미반영.",
  },

  // ===== 태국 · 방콕 =====
  {
    id: "isb-bangkok",
    name: "International School Bangkok (ISB)",
    nameKo: "인터내셔널 스쿨 방콕",
    country: "TH",
    city: "bangkok",
    cityLabel: "방콕",
    tier: "premium",
    curriculum: "미국식 (AP)",
    currency: "THB",
    tuitionTiers: [
      { tierKey: "early", tierLabel: "Pre-K", annualLocal: 640_000 },
      { tierKey: "elementary", tierLabel: "Elementary", annualLocal: 985_000 },
      { tierKey: "middle", tierLabel: "Middle School", annualLocal: 1_104_000 },
      { tierKey: "high", tierLabel: "High School", annualLocal: 1_162_000 },
    ],
    sourceUrl: "https://www.isb.ac.th/admissions/fees",
    asOfDate: "2026-07-09",
    dataConfidence: "search_snippet",
    dataNote: "2025/26학년도 공식 PDF 링크(resources.finalsite.net)는 확보했으나 이번 세션에서 PDF 원문 직접 대조는 못함 — 방콕 5개교 중 가장 구체적이고 학교 간 차별화된 수치라 신뢰도는 상대적으로 높은 편.",
  },
  {
    id: "harrow-bangkok",
    name: "Harrow International School Bangkok",
    nameKo: "해로우 인터내셔널 스쿨 방콕",
    country: "TH",
    city: "bangkok",
    cityLabel: "방콕",
    tier: "premium",
    curriculum: "영국식 (A-Level / IGCSE)",
    currency: "THB",
    tuitionTiers: [
      { tierKey: "all_grades", tierLabel: "전 학년 범위 (학년별 세부 미확보)", annualLocal: 614_600 },
    ],
    sourceUrl: "https://www.harrowschool.ac.th/admissions/tuition-fees",
    asOfDate: "2026-07-09",
    dataConfidence: "search_snippet",
    dataNote: "학비 범위는 THB 614,600~1,037,100 — 학년별 세부 breakdown 미확보로 하한값만 대표로 기재. 계산기에는 이 학교를 '범위 안내'로만 노출하고 학년 선택형 계산에는 포함하지 않는 것을 권장.",
  },
  {
    id: "shrewsbury-city-bangkok",
    name: "Shrewsbury International School (City Campus)",
    nameKo: "슈루즈베리 인터내셔널 스쿨 (시티캠퍼스)",
    country: "TH",
    city: "bangkok",
    cityLabel: "방콕",
    tier: "mid",
    curriculum: "영국식 (A-Level)",
    currency: "THB",
    tuitionTiers: [
      { tierKey: "early_nursery", tierLabel: "Nursery", annualLocal: 669_600 },
      { tierKey: "early_ey1", tierLabel: "EY1", annualLocal: 691_800 },
      { tierKey: "early_ey2", tierLabel: "EY2", annualLocal: 728_700 },
      { tierKey: "elementary_low", tierLabel: "Year 1-2", annualLocal: 818_700 },
      { tierKey: "elementary_mid", tierLabel: "Year 3-4", annualLocal: 878_100 },
      { tierKey: "elementary_high", tierLabel: "Year 5-6", annualLocal: 908_400 },
    ],
    sourceUrl: "https://www.shrewsbury.ac.th/admissions/fees/overview/",
    asOfDate: "2026-07-09",
    dataConfidence: "search_snippet",
    dataNote: "중등·고등 학비 미확보(원문에서 Riverside 캠퍼스와 수치가 섞여 있어 City Campus 단독 수치만 이번에 확보).",
  },
  {
    id: "kis-bangkok",
    name: "KIS International School",
    nameKo: "KIS 인터내셔널 스쿨 방콕",
    country: "TH",
    city: "bangkok",
    cityLabel: "방콕",
    tier: "mid",
    curriculum: "IB",
    currency: "THB",
    tuitionTiers: [
      { tierKey: "early_prep", tierLabel: "EY Prep (반일)", annualLocal: 440_100 },
      { tierKey: "early_ey1", tierLabel: "EY1", annualLocal: 596_500 },
      { tierKey: "early_ey2", tierLabel: "EY2", annualLocal: 631_600 },
      { tierKey: "elementary", tierLabel: "EY3-Grade5", annualLocal: 725_500 },
      { tierKey: "middle", tierLabel: "Grade 6-10", annualLocal: 859_700 },
      { tierKey: "high_g11", tierLabel: "Grade 11", annualLocal: 944_600 },
      { tierKey: "high_g12", tierLabel: "Grade 12", annualLocal: 882_600 },
    ],
    sourceUrl: "https://www.kis.ac.th/join/tuition-fees",
    asOfDate: "2026-07-09",
    dataConfidence: "search_snippet",
    dataNote: "Grade 12 학비가 Grade 11보다 낮게 조사됨(944,600 → 882,600) — IB DP 2년차 특수 요금 구조일 가능성이 있으나 원문 대조 전이라 확정 못함, 구현 전 재확인 필요.",
  },
  {
    id: "patana-bangkok",
    name: "Bangkok Patana School",
    nameKo: "방콕 파타나 스쿨",
    country: "TH",
    city: "bangkok",
    cityLabel: "방콕",
    tier: "premium",
    curriculum: "영국식 (IGCSE / IB)",
    currency: "THB",
    tuitionTiers: [
      { tierKey: "nursery", tierLabel: "Nursery", annualLocal: 515_000 },
      { tierKey: "fs1", tierLabel: "FS1", annualLocal: 577_000 },
      { tierKey: "fs2", tierLabel: "FS2", annualLocal: 640_000 },
      { tierKey: "y1_2", tierLabel: "Year 1-2", annualLocal: 749_000 },
      { tierKey: "y3", tierLabel: "Year 3", annualLocal: 790_000 },
      { tierKey: "y4_5", tierLabel: "Year 4-5", annualLocal: 796_000 },
      { tierKey: "y6", tierLabel: "Year 6", annualLocal: 811_000 },
      { tierKey: "y7_9", tierLabel: "Year 7-9", annualLocal: 842_000 },
      { tierKey: "y10", tierLabel: "Year 10", annualLocal: 957_000 },
      { tierKey: "y11", tierLabel: "Year 11 (3개 학기만 과금)", annualLocal: 707_000 },
      { tierKey: "y12", tierLabel: "Year 12", annualLocal: 1_014_000 },
      { tierKey: "y13", tierLabel: "Year 13 (3개 학기만 과금)", annualLocal: 749_000 },
    ],
    sourceUrl: "https://www.patana.ac.th/wp-content/uploads/2026/04/Fee-announcement-2026-7.pdf",
    asOfDate: "2026-07-09",
    dataConfidence: "official_confirmed",
    dataNote: "2026/27학년도 공식 PDF 원문 확인(재검증 성공 — 이전 리비전에서 NIST와 수치가 동일해 보였던 문제는 아그리게이터의 데이터 오염이었던 것으로 판단). Year11·13이 다른 학년보다 낮은 것은 시험 학기 특수 과금 구조로, 오타가 아님.",
  },
  {
    id: "bangkok-prep",
    name: "Bangkok Preparatory International School",
    nameKo: "방콕 프렙 인터내셔널 스쿨",
    country: "TH",
    city: "bangkok",
    cityLabel: "방콕",
    tier: "mid",
    curriculum: "영국식 (EYFS → IGCSE → A-Level / BTEC)",
    currency: "THB",
    tuitionTiers: [
      { tierKey: "pre_nursery", tierLabel: "Pre-Nursery", annualLocal: 384_800 },
      { tierKey: "nursery", tierLabel: "Nursery", annualLocal: 595_600 },
      { tierKey: "reception", tierLabel: "Reception", annualLocal: 629_800 },
      { tierKey: "y1_2", tierLabel: "Year 1-2", annualLocal: 706_400 },
      { tierKey: "y3_4", tierLabel: "Year 3-4", annualLocal: 733_100 },
      { tierKey: "y5_6", tierLabel: "Year 5-6", annualLocal: 749_500 },
      { tierKey: "y7_9", tierLabel: "Year 7-9", annualLocal: 790_800 },
      { tierKey: "y10_11", tierLabel: "Year 10-11", annualLocal: 846_500 },
      { tierKey: "y12", tierLabel: "Year 12", annualLocal: 862_200 },
      { tierKey: "y13", tierLabel: "Year 13", annualLocal: 771_200 },
    ],
    sourceUrl: "https://www.bangkokprep.ac.th/admissions/tuition-fees",
    asOfDate: "2026-07-09",
    dataConfidence: "official_confirmed",
    dataNote: "2026/27학년도 공식 페이지 원문 확인. 방콕 7개교 중 중간~저가 구간을 대표.",
  },
  {
    id: "wells-bangkok",
    name: "Wells International School",
    nameKo: "웰스 인터내셔널 스쿨",
    country: "TH",
    city: "bangkok",
    cityLabel: "방콕",
    tier: "budget",
    curriculum: "확인 필요",
    currency: "THB",
    tuitionTiers: [
      { tierKey: "nursery", tierLabel: "Nursery", annualLocal: 246_000 },
      { tierKey: "g11_12", tierLabel: "Grade 11-12", annualLocal: 546_000 },
    ],
    sourceUrl: "https://wells.ac.th/wp-content/uploads/2025/03/Tuition%20fee%20for%20school%20Year%202025-2026.pdf",
    asOfDate: "2026-07-09",
    dataConfidence: "search_snippet",
    dataNote: "공식 PDF 직접 열람 실패(접속 오류) — 검색엔진이 인용한 학기당 금액(THB 123,000~273,000)을 2배해 연간으로 추정한 값. 구현 전 재확인 필요. 방콕 7개교 중 가장 저렴한 축으로 추정되나 확정 아님. 캠퍼스 개발비(1회성 THB 70,000~130,000)·보증금(THB 35,000) 별도.",
  },

  // ===== 태국 · 치앙마이 =====
  {
    id: "ptis-chiangmai",
    name: "Prem Tinsulanonda International School (PTIS)",
    nameKo: "프렘 틴술라논다 인터내셔널 스쿨",
    country: "TH",
    city: "chiang_mai",
    cityLabel: "치앙마이",
    tier: "mid",
    curriculum: "IB",
    currency: "THB",
    tuitionTiers: [
      { tierKey: "ey1_3", tierLabel: "EY1-EY3", annualLocal: 380_000 },
      { tierKey: "g1", tierLabel: "Grade 1", annualLocal: 392_000 },
      { tierKey: "g2_3", tierLabel: "Grade 2-3", annualLocal: 444_000 },
      { tierKey: "g4_5", tierLabel: "Grade 4-5", annualLocal: 550_000 },
      { tierKey: "g6_7", tierLabel: "Grade 6-7", annualLocal: 660_000 },
      { tierKey: "g8", tierLabel: "Grade 8", annualLocal: 696_000 },
      { tierKey: "g9_12", tierLabel: "Grade 9-12", annualLocal: 736_000 },
    ],
    sourceUrl: "https://ptis.ac.th/wp-content/uploads/2024/11/Prem-Tuition-Fee-2024-2025.pdf",
    asOfDate: "2026-07-09",
    dataConfidence: "official_confirmed",
    dataNote: "⚠ 공식 PDF는 2024-2025학년도 기준 — 2026-27 최신본을 찾지 못함. 국제학교 학비는 통상 연 5~8% 인상되므로 실제 2026-27학년도 학비는 이보다 10~15% 높을 수 있음. 참고용으로만 사용, 구현 전 최신 PDF 재조사 필요.",
  },
  {
    id: "cmis-chiangmai",
    name: "Chiang Mai International School (CMIS)",
    nameKo: "치앙마이 인터내셔널 스쿨",
    country: "TH",
    city: "chiang_mai",
    cityLabel: "치앙마이",
    tier: "mid",
    curriculum: "확인 필요 (미국식 추정)",
    currency: "THB",
    tuitionTiers: [
      { tierKey: "preschool", tierLabel: "Preschool 3-4", annualLocal: 341_700 },
      { tierKey: "kg_g5", tierLabel: "KG-Grade 5", annualLocal: 426_800 },
      { tierKey: "g6_8", tierLabel: "Grade 6-8", annualLocal: 463_400 },
      { tierKey: "g9_12", tierLabel: "Grade 9-12", annualLocal: 580_200 },
    ],
    sourceUrl: "https://cmis.ac.th/admissions/tuition_fees",
    asOfDate: "2026-07-09",
    dataConfidence: "official_confirmed",
    dataNote: "2026-2027학년도 공식 페이지 원문 확인.",
  },
  {
    id: "grace-chiangmai",
    name: "Grace International School",
    nameKo: "그레이스 인터내셔널 스쿨",
    country: "TH",
    city: "chiang_mai",
    cityLabel: "치앙마이",
    tier: "budget",
    curriculum: "확인 필요",
    currency: "THB",
    tuitionTiers: [
      { tierKey: "k_g5", tierLabel: "K-Grade 5", annualLocal: 294_500 },
      { tierKey: "g6_8", tierLabel: "Grade 6-8", annualLocal: 322_000 },
      { tierKey: "g9_11", tierLabel: "Grade 9-11", annualLocal: 348_000 },
      { tierKey: "g12", tierLabel: "Grade 12", annualLocal: 361_000 },
    ],
    sourceUrl: "https://gisthailand.org/admissions/tuition-and-fees/",
    asOfDate: "2026-07-09",
    dataConfidence: "search_snippet",
    dataNote: "3자 아그리게이터(doris.school) 경유 확보, 공식 사이트 원문 직접 대조는 안 됨. 치앙마이 4개교 중 가장 저렴.",
  },
  {
    id: "apis-chiangmai",
    name: "American Pacific International School",
    nameKo: "아메리칸 퍼시픽 인터내셔널 스쿨",
    country: "TH",
    city: "chiang_mai",
    cityLabel: "치앙마이",
    tier: "budget",
    curriculum: "확인 필요",
    currency: "THB",
    tuitionTiers: [
      { tierKey: "pre_nursery", tierLabel: "Pre-Nursery (Primary)", annualLocal: 114_550 },
      { tierKey: "g6", tierLabel: "Grade 6 (Primary)", annualLocal: 383_400 },
      { tierKey: "g10", tierLabel: "Grade 10 (Main Campus)", annualLocal: 394_800 },
      { tierKey: "g11", tierLabel: "Grade 11 (Main Campus)", annualLocal: 414_200 },
    ],
    sourceUrl: "https://www.international-schools-database.com/",
    asOfDate: "2026-07-09",
    dataConfidence: "search_snippet",
    dataNote: "3자 아그리게이터 경유 확보, 공식 사이트 원문 직접 대조는 안 됨. Primary 캠퍼스와 Main 캠퍼스 학비 체계가 분리되어 있어 학년 간 비교에 주의 필요.",
  },

  // ===== 베트남 · 호치민 =====
  {
    id: "ais-hcmc",
    name: "Australian International School Vietnam (AIS Saigon)",
    nameKo: "호주 국제학교 사이공",
    country: "VN",
    city: "ho_chi_minh",
    cityLabel: "호치민",
    tier: "premium",
    curriculum: "Cambridge / 영국식",
    currency: "VND",
    tuitionTiers: [
      { tierKey: "early", tierLabel: "Kindergarten", annualLocal: 296_000_000 },
      { tierKey: "elementary", tierLabel: "Primary (초등)", annualLocal: 566_000_000 },
      { tierKey: "middle", tierLabel: "Year 7-9 (중등)", annualLocal: 711_000_000 },
      { tierKey: "high", tierLabel: "Year 10-13 (고등)", annualLocal: 861_000_000 },
    ],
    sourceUrl: "https://www.aisvietnam.com/sites/school77/files/2025-05/AIS_Fees_Schedule_2025-2026_(04.2025).pdf",
    asOfDate: "2026-07-09",
    dataConfidence: "official_confirmed",
    dataNote: "이 클러스터 전체에서 유일하게 학교 공식 Fee Schedule PDF 원문을 직접 확인한 데이터 — 다른 학교 데이터와 신뢰도 차이가 크다는 점을 UI에서도 배지로 구분해 노출.",
  },
  {
    id: "bis-hcmc",
    name: "British International School HCMC (Nord Anglia)",
    nameKo: "브리티시 인터내셔널 스쿨 호치민",
    country: "VN",
    city: "ho_chi_minh",
    cityLabel: "호치민",
    tier: "premium",
    curriculum: "영국식 (IGCSE / A-Level)",
    currency: "VND",
    tuitionTiers: [
      { tierKey: "early", tierLabel: "EY1", annualLocal: 322_000_000 },
      { tierKey: "high", tierLabel: "Year 13", annualLocal: 956_000_000 },
    ],
    sourceUrl: "https://www.nordangliaeducation.com/bis-hcmc/admissions/tuition-fees",
    asOfDate: "2026-07-09",
    dataConfidence: "search_snippet",
    dataNote: "EY1과 Year13 두 지점만 확보, 중간 학년 데이터 미확보 — 초·중등 계산 시 두 값 사이 보간(linear interpolation) 또는 별도 조사 필요.",
  },
  {
    id: "ishcmc",
    name: "International School Ho Chi Minh City (ISHCMC)",
    nameKo: "국제학교 호치민",
    country: "VN",
    city: "ho_chi_minh",
    cityLabel: "호치민",
    tier: "premium",
    curriculum: "IB",
    currency: "VND",
    tuitionTiers: [
      { tierKey: "early", tierLabel: "Early Explorers", annualLocal: 279_000_000 },
      { tierKey: "high", tierLabel: "Grade 12", annualLocal: 959_000_000 },
    ],
    sourceUrl: "https://www.ishcmc.com/admissions/tuition-fees/",
    asOfDate: "2026-07-09",
    dataConfidence: "search_snippet",
    dataNote: "BIS HCMC와 동일하게 양끝 학년만 확보 — 중간 학년 보간 필요.",
  },
  {
    id: "renaissance-saigon",
    name: "Renaissance International School Saigon",
    nameKo: "르네상스 인터내셔널 스쿨 사이공",
    country: "VN",
    city: "ho_chi_minh",
    cityLabel: "호치민",
    tier: "mid",
    curriculum: "IB",
    currency: "VND",
    tuitionTiers: [
      { tierKey: "early", tierLabel: "EY1", annualLocal: 190_000_000 },
      { tierKey: "high", tierLabel: "Year 12-13", annualLocal: 806_000_000 },
    ],
    sourceUrl: "https://renaissance.edu.vn/fees/",
    asOfDate: "2026-07-09",
    dataConfidence: "search_snippet",
    dataNote: "양끝 학년만 확보 — 중간 학년 보간 필요. 호치민 4개교 중 상대적으로 학비가 낮아 '중간형' 등급 대표.",
  },

  // ===== 베트남 · 하노이 =====
  {
    id: "bis-hanoi",
    name: "British International School Hanoi (BIS Hanoi)",
    nameKo: "브리티시 인터내셔널 스쿨 하노이",
    country: "VN",
    city: "hanoi",
    cityLabel: "하노이",
    tier: "premium",
    curriculum: "영국식 (National Curriculum for England)",
    currency: "VND",
    tuitionTiers: [
      { tierKey: "early", tierLabel: "F1-F3 (유아)", annualLocal: 343_100_000 },
      { tierKey: "y1_2", tierLabel: "Year 1-2", annualLocal: 657_600_000 },
      { tierKey: "y3_6", tierLabel: "Year 3-6", annualLocal: 715_500_000 },
      { tierKey: "y7_9", tierLabel: "Year 7-9", annualLocal: 846_800_000 },
      { tierKey: "y10_11", tierLabel: "Year 10-11", annualLocal: 893_200_000 },
      { tierKey: "y12_13", tierLabel: "Year 12-13", annualLocal: 970_200_000 },
    ],
    sourceUrl: "https://www.nordangliaeducation.com/bis-hanoi/admissions/tuition-fees",
    asOfDate: "2026-07-09",
    dataConfidence: "official_confirmed",
    dataNote: "2026-27학년도 공식 페이지 원문 확인 — 독립된 두 차례 조사에서 동일 수치로 교차검증됨.",
  },
  {
    id: "bvis-hanoi",
    name: "British Vietnamese International School Hanoi (BVIS Hanoi)",
    nameKo: "브리티시 베트나미즈 인터내셔널 스쿨 하노이",
    country: "VN",
    city: "hanoi",
    cityLabel: "하노이",
    tier: "premium",
    curriculum: "영국식",
    currency: "VND",
    tuitionTiers: [
      { tierKey: "early", tierLabel: "F1 (유아)", annualLocal: 251_700_000 },
      { tierKey: "high", tierLabel: "Year 13", annualLocal: 636_000_000 },
    ],
    sourceUrl: "https://www.nordangliaeducation.com/bvis-hanoi/admissions/tuition-fees",
    asOfDate: "2026-07-09",
    dataConfidence: "official_confirmed",
    dataNote: "2025-26학년도 공식 페이지 원문 확인. 양끝 학년만 확보 — 중간 학년 보간 필요. 등록비·보증금 별도.",
  },
  {
    id: "concordia-hanoi",
    name: "Concordia International School Hanoi",
    nameKo: "콘코디아 인터내셔널 스쿨 하노이",
    country: "VN",
    city: "hanoi",
    cityLabel: "하노이",
    tier: "premium",
    curriculum: "IB",
    currency: "VND",
    tuitionTiers: [
      { tierKey: "early", tierLabel: "Preschool", annualLocal: 558_034_000 },
      { tierKey: "high", tierLabel: "Grade 12", annualLocal: 1_038_822_000 },
    ],
    sourceUrl: "https://www.concordiahanoi.org/admissions/admissions-faqs",
    asOfDate: "2026-07-09",
    dataConfidence: "official_confirmed",
    dataNote: "2026-27학년도 공식 페이지 원문 확인. 양끝 학년만 확보 — 중간 학년 보간 필요. 하노이 5개교 중 최고가.",
  },
  {
    id: "unis-hanoi",
    name: "United Nations International School of Hanoi (UNIS Hanoi)",
    nameKo: "유엔 인터내셔널 스쿨 하노이",
    country: "VN",
    city: "hanoi",
    cityLabel: "하노이",
    tier: "premium",
    curriculum: "IB",
    currency: "VND",
    tuitionTiers: [
      { tierKey: "kg1_2", tierLabel: "KG1-2", annualLocal: 459_200_000 },
      { tierKey: "kg3", tierLabel: "KG3", annualLocal: 707_500_000 },
      { tierKey: "g1_5", tierLabel: "Grade 1-5", annualLocal: 876_600_000 },
      { tierKey: "g6_8", tierLabel: "Grade 6-8", annualLocal: 926_000_000 },
      { tierKey: "g9_10", tierLabel: "Grade 9-10", annualLocal: 987_000_000 },
      { tierKey: "g11_12", tierLabel: "Grade 11-12", annualLocal: 1_048_600_000 },
    ],
    sourceUrl: "https://www.international-schools-database.com/in/hanoi/united-nations-international-school-hanoi/fees",
    asOfDate: "2026-07-09",
    dataConfidence: "search_snippet",
    dataNote: "공식 페이지(unishanoi.org) 학비표는 이미지/PDF로 되어 있어 텍스트 추출 실패 — 3자 집계 사이트 수치 사용. 등록 예치금 $1,500·입학금 $1,750·지원료 $600은 공식 페이지에서 별도 확인됨.",
  },
  {
    id: "his-hanoi",
    name: "Hanoi International School (HIS)",
    nameKo: "하노이 인터내셔널 스쿨",
    country: "VN",
    city: "hanoi",
    cityLabel: "하노이",
    tier: "mid",
    curriculum: "미국식",
    currency: "VND",
    tuitionTiers: [
      { tierKey: "prek_k", tierLabel: "PreK/K", annualLocal: 418_400_000 },
      { tierKey: "g11_12", tierLabel: "Grade 11-12", annualLocal: 767_000_000 },
    ],
    sourceUrl: "https://www.hisvietnam.com/admissions/tuition-and-fees",
    asOfDate: "2026-07-09",
    dataConfidence: "search_snippet",
    dataNote: "2025-26학년도, 공식 페이지 학비표가 PDF 링크라 직접 대조 실패 — 검색 스니펫(3자 재인용) 기반. 하노이 5개교 중 상대적으로 저렴.",
  },
];

// 데이터셋에서 의도적으로 제외한 학교 — 실수로 다시 추가되지 않도록 문서화
export const SAC_EXCLUDED_SCHOOLS_NOTE = [
  "NIST International School(방콕): 공식 사이트가 JS 렌더링이라 정적 조회로 수치를 확인하지 못했고, 검색 결과끼리도 여전히 서로 다른 수치(45만~113만 THB 범위)를 제시해 신뢰 불가 — 계속 제외.",
  "\"British International School Johor Bahru\": 두 차례 조사에서 모두 실존 자체를 확인하지 못함(공식 홈페이지·독립 법인 미발견) — 데이터셋에 포함하지 않음.",
  "American International School Vietnam(AISVN, 호치민): 재정 스캔들로 2026-01-12 호치민시가 공식 해산 결정 — 폐교. 데이터에 포함하지 않으며, 베트남 리포트의 '학교 선택 리스크' 섹션에 실제 사례로 인용.",
] as const;

// ── 생활비 데이터 (6개 도시 중 5곳 확보, 조호바루만 잔여 블로커) ──

export const SAC_LIVING_COSTS: SeaLivingCost[] = [
  {
    city: "kuala_lumpur",
    cityLabel: "쿠알라룸푸르",
    currency: "MYR",
    monthlyFamilyExclRentLocal: 9_042,
    monthlyRentLocal: { budget: 2_492, mid: 3_717, premium: 4_943 }, // 3BR 기준: budget=외곽, premium=시내중심, mid=평균
    sourceUrl: "https://www.numbeo.com/cost-of-living/in/Kuala-Lumpur",
    asOfDate: "2026-07-09",
    dataConfidence: "search_snippet",
    note: "Numbeo 원본 MYR 표 직접 확인 완료. 3베드룸 콘도 기준(외곽 RM2,000~4,000, 시내중심 RM3,000~8,000) 범위의 평균값을 등급별로 매핑. 의료보험 비용은 Numbeo에 항목이 없어 미포함.",
  },
  {
    city: "johor_bahru",
    cityLabel: "조호바루",
    currency: "MYR",
    monthlyFamilyExclRentLocal: null,
    monthlyRentLocal: { budget: null, mid: null, premium: null },
    sourceUrl: null,
    asOfDate: null,
    dataConfidence: null,
    note: "이번 클러스터의 유일한 잔여 블로커 — 조호바루 생활비는 아직 조사되지 않음. 계산기에서 조호바루 선택 시 학비만 표시(dataCompleteness: tuition_only).",
  },
  {
    city: "bangkok",
    cityLabel: "방콕",
    currency: "THB",
    monthlyFamilyExclRentLocal: 86_839,
    monthlyRentLocal: { budget: 24_539, mid: 47_426, premium: 70_313 }, // 3BR 기준: budget=외곽, premium=시내중심, mid=평균
    sourceUrl: "https://www.numbeo.com/cost-of-living/in/Bangkok",
    asOfDate: "2026-07-09",
    dataConfidence: "search_snippet",
    note: "Numbeo 원본 THB 표 직접 확인 완료. 의료보험(외국인 사보험) 비용은 Numbeo에 항목이 없어 별도 조사 필요 — 미포함.",
  },
  {
    city: "chiang_mai",
    cityLabel: "치앙마이",
    currency: "THB",
    monthlyFamilyExclRentLocal: 66_555,
    monthlyRentLocal: { budget: 17_292, mid: 23_459, premium: 29_625 },
    sourceUrl: "https://www.numbeo.com/cost-of-living/in/Chiang-Mai",
    asOfDate: "2026-07-09",
    dataConfidence: "search_snippet",
    note: "Numbeo 원본 THB 표 직접 확인 완료.",
  },
  {
    city: "ho_chi_minh",
    cityLabel: "호치민",
    currency: "VND",
    monthlyFamilyExclRentLocal: 44_683_886,
    monthlyRentLocal: { budget: 18_156_250, mid: 24_992_125, premium: 31_828_000 },
    sourceUrl: "https://www.numbeo.com/cost-of-living/in/Ho-Chi-Minh-City",
    asOfDate: "2026-07-09",
    dataConfidence: "search_snippet",
    note: "Numbeo 원본 VND 표 직접 확인 완료. 의료보험 비용은 미포함.",
  },
  {
    city: "hanoi",
    cityLabel: "하노이",
    currency: "VND",
    monthlyFamilyExclRentLocal: 42_301_224,
    monthlyRentLocal: { budget: 14_056_461, mid: 18_145_427, premium: 22_234_392 },
    sourceUrl: "https://www.numbeo.com/cost-of-living/in/Hanoi",
    asOfDate: "2026-07-09",
    dataConfidence: "search_snippet",
    note: "Numbeo 원본 VND 표 직접 확인 완료(두 독립 조사에서 3베드룸 시내중심 임대료가 22,234,392로 정확히 교차검증됨). 의료보험 비용은 미포함.",
  },
];

// ── 환율 (3개 통화 전부 확정) ──────────────────────────

export const SAC_FX_RATES: SeaFxRate[] = [
  {
    currency: "MYR",
    krwPerUnit: 368.4,
    asOfDate: "2026-07-09",
    sourceUrl: "https://wise.com/us/currency-converter/myr-to-krw-rate",
  },
  {
    currency: "THB",
    krwPerUnit: 44.95,
    asOfDate: "2026-07-09",
    sourceUrl: "https://wise.com/us/currency-converter/thb-to-krw-rate",
  },
  {
    currency: "VND",
    krwPerUnit: 0.05715,
    asOfDate: "2026-07-09",
    sourceUrl: "https://wise.com/us/currency-converter/vnd-to-krw-rate",
  },
];

export const SAC_FAQ: FaqItem[] = [
  {
    question: "동남아 국제학교가 한국보다 정말 저렴한가요?",
    answer:
      "학비만 비교하면 대체로 저렴한 편이지만, 부모가 동반해 거주하면 주거비·생활비가 추가로 들어갑니다. 이 계산기는 학비와 생활비를 합산한 총비용을 계산해 실제 체감 비용을 보여줍니다. 다만 이 페이지 시점 기준 생활비 데이터는 일부만 반영되어 있으니, 결과의 '생활비 포함 여부' 표시를 꼭 확인하세요.",
  },
  {
    question: "이 계산기의 학비 데이터는 얼마나 정확한가요?",
    answer:
      "학교마다 확인 수준이 다릅니다. 학교 공식 자료로 직접 대조한 곳도 있고, 검색 결과 요약만 확보해 재확인이 더 필요한 곳도 있습니다. 각 학교 카드에 표시되는 데이터 신뢰도 배지('공식 확인' / '검색 요약, 재확인 권장')를 함께 확인하세요.",
  },
  {
    question: "자녀 2명을 함께 보내면 비용이 얼마나 늘어나나요?",
    answer:
      "학비는 자녀 수만큼 단순 곱해 계산합니다. 다자녀 할인은 학교별로 정책이 다르고 이번 조사에서 확인되지 않아 계산에 반영하지 않았습니다.",
  },
  {
    question: "부모가 동반하지 않고 기숙사에 보내면 비용이 얼마나 줄어드나요?",
    answer:
      "이 계산기는 부모 동반 여부에 따라 생활비 포함 여부를 다르게 계산합니다. 다만 동남아 국제학교의 기숙사 운영 여부와 기숙사비는 학교별로 이번 조사에서 별도 확인하지 않았으므로, 기숙 옵션이 있는 학교인지는 각 학교 공식 페이지에서 확인이 필요합니다.",
  },
  {
    question: "왜 조호바루는 총비용이 아니라 학비만 나오나요?",
    answer:
      "조호바루는 국제학교 학비 데이터는 확보했지만 생활비 데이터를 아직 조사하지 못했습니다. 데이터가 준비되는 대로 다른 도시와 동일하게 총비용을 계산할 수 있도록 업데이트할 예정입니다.",
  },
];

export const SAC_RELATED_LINKS: RelatedLink[] = [
  { href: "/reports/korea-vs-southeast-asia-international-school-2026/", label: "한국 vs 동남아 국제학교 비교", description: "한국과 동남아 3개국의 1년 총비용을 비교합니다." },
  { href: "/reports/malaysia-international-school-guide-2026/", label: "말레이시아 국제학교 총정리", description: "쿠알라룸푸르 국제학교 학비와 생활비를 정리합니다." },
  { href: "/reports/thailand-international-school-guide-2026/", label: "태국 국제학교 총정리", description: "방콕 국제학교 학비와 생활비를 정리합니다." },
  { href: "/reports/vietnam-international-school-guide-2026/", label: "베트남 국제학교 총정리", description: "호치민 국제학교 학비와 생활비를 정리합니다." },
  { href: "/tools/international-school-tuition-calculator-2026/", label: "국내 국제학교 학비 계산기", description: "한국 국제학교 학비를 계산합니다." },
];
```

---

## 4. 계산 로직 상세

### 4-1. 입력값

| 입력 ID | 종류 | 설명 |
|---|---|---|
| `sac-select-country` | select | 말레이시아 / 태국 / 베트남 (선택 시 도시 select 갱신) |
| `sac-select-city` | select | 선택 국가의 도시 목록(country 종속) — v1은 국가당 도시 1개뿐이라 사실상 자동 선택되지만, UI는 도시 확장을 전제로 select 형태 유지 |
| `sac-select-school` | select | 선택 도시의 학교 목록(city 종속) |
| `sac-select-grade` | select | 선택 학교의 `tuitionTiers` 목록(school 종속) |
| `sac-input-children` | number | 자녀 수 (기본 1, 최대 3) |
| `sac-select-companion` | radio | 엄마 동반 / 가족 전체 동반 / 미동반(생활비 미포함) |
| `sac-input-income` | number | 가구 연소득(만원, 선택 입력 — 필요 월소득 대비 비율 계산용) |

**환율은 국내 계산기처럼 사용자가 직접 수정하는 입력 필드로 노출하지 않는다** — SEA는 3개 통화(MYR/THB/VND)가 섞여 있어 매번 3개 환율을 각각 입력받는 UX는 번거롭다. 대신 `SAC_FX_RATES`의 값을 자동 적용하고, 값이 `null`인 통화(THB, VND — v1 시점)는 "환율 확인 중, 원화 환산 준비 중" 배지로 대체한다. 환율 값이 준비되면 각 학교 카드에 "OO년 O월 기준 환율 적용" 배지로 자동 노출.

### 4-2. 계산 함수 (TS 의사코드)

```ts
type CalcInput = {
  school: SeaSchoolProfile;
  tier: SeaTuitionTier;
  children: number;
  companion: "mother_only" | "whole_family" | "none";
  incomeManwon: number;
  livingCost: SeaLivingCost;
  fxRate: SeaFxRate;
};

type CalcResult = {
  annualTuitionLocal: number;
  annualTuitionKrw: number | null;         // fxRate.krwPerUnit이 null이면 원화 환산 불가
  annualLivingCostLocal: number | null;    // companion === "none"이면 0, 데이터 없으면 null
  annualLivingCostKrw: number | null;
  annualTotalKrw: number | null;           // 학비+생활비 모두 원화 환산 가능할 때만 값 존재
  monthlyTotalKrw: number | null;
  incomeRatioPct: number | null;
  fiveYearTotalKrw: number | null;
  dataCompleteness: "full" | "tuition_only" | "unavailable"; // UI가 이 값으로 표시 모드를 분기
};

function calculate(input: CalcInput): CalcResult {
  const annualTuitionLocal = input.tier.annualLocal * input.children;
  const annualTuitionKrw = input.fxRate.krwPerUnit
    ? Math.round(annualTuitionLocal * input.fxRate.krwPerUnit)
    : null;

  let annualLivingCostLocal: number | null = null;
  if (input.companion === "none") {
    annualLivingCostLocal = 0;
  } else if (input.livingCost.monthlyFamilyExclRentLocal != null) {
    // 거주형태(주거비)는 v1 시점 대부분 null → 있으면 더하고 없으면 null 유지
    const rent = input.livingCost.monthlyRentLocal.mid; // tier 매칭은 구현 시 school.tier로 세분화
    const monthly = input.livingCost.monthlyFamilyExclRentLocal + (rent ?? 0);
    annualLivingCostLocal = monthly * 12;
  }

  const annualLivingCostKrw =
    annualLivingCostLocal != null && input.fxRate.krwPerUnit
      ? Math.round(annualLivingCostLocal * input.fxRate.krwPerUnit)
      : input.companion === "none" ? 0 : null;

  const annualTotalKrw =
    annualTuitionKrw != null && annualLivingCostKrw != null
      ? annualTuitionKrw + annualLivingCostKrw
      : null;

  const dataCompleteness: CalcResult["dataCompleteness"] =
    annualTotalKrw != null ? "full" : annualTuitionKrw != null ? "tuition_only" : "unavailable";

  const monthlyTotalKrw = annualTotalKrw != null ? Math.round(annualTotalKrw / 12) : null;
  const incomeRatioPct =
    annualTotalKrw != null && input.incomeManwon > 0
      ? Math.round(((annualTotalKrw / 10000) / input.incomeManwon) * 1000) / 10
      : null;
  const fiveYearTotalKrw = annualTotalKrw != null ? annualTotalKrw * 5 : null;

  return {
    annualTuitionLocal, annualTuitionKrw, annualLivingCostLocal, annualLivingCostKrw,
    annualTotalKrw, monthlyTotalKrw, incomeRatioPct, fiveYearTotalKrw, dataCompleteness,
  };
}
```

### 4-3. 핵심 설계 결정 (왜 이렇게 계산하는가)

- **`dataCompleteness` 3단계 분기**: 환율·생활비 데이터가 국가마다 다른 시점에 채워질 것이므로, 계산기가 "일부 데이터만 있어도 최대한 보여주되 절대 없는 값을 만들어내지 않는" 방식으로 동작해야 한다. `full`(총비용 계산 가능) / `tuition_only`(학비만, 환율은 있지만 생활비 없음) / `unavailable`(환율조차 없음, 원문 통화로만 표시)로 UI 메시지를 분기한다.
- **환율을 사용자 입력값으로 받지 않음**: 국내 계산기는 USD 단일 통화라 입력 필드 하나로 충분했지만, SEA는 3통화라 매번 입력받으면 UX가 나빠진다. 대신 데이터 파일의 고정값을 쓰고 "OO 기준" 배지로 투명성을 확보한다 — 이는 국내 계산기 대비 이 계산기만의 차별화된 설계 결정이다.
- **생활비의 주거비 부분(`monthlyRentLocal`)은 학교 등급(`tier`)과 매칭**: 프리미엄 학교에 보내는 가족은 통상 더 좋은 주거지에 살 가능성이 높다는 가정 — 근거 없는 가정이므로 구현 시 SeoContent에 "주거비는 선택한 학교 등급을 참고해 추정한 것으로, 실제 거주 지역에 따라 크게 달라질 수 있다"는 안내를 반드시 포함한다.
- **다자녀 할인 미반영**: 국내 계산기와 동일한 이유(학교별 정책 파편적) — 여기에 더해 이번 조사에서는 SEA 학교의 다자녀 할인 정책 자체를 조사하지 못했으므로 더더욱 반영하지 않는다.
- **동반 유형(companion) 3분기**: "엄마 동반"과 "가족 전체 동반"을 구분한 이유는 실제로 생활비 규모가 크게 다르기 때문(원안 브레인스토밍의 핵심 인사이트) — 다만 이번 데이터셋은 가족 단위 생활비만 확보했으므로, v1 구현 시 "엄마 동반"은 가족 전체 생활비의 약 60~70%로 근사할지, 아니면 이 옵션 자체를 데이터 확보 후로 미룰지는 **구현 착수 시 재검토 항목**으로 남긴다 — 이 설계 문서에서 임의 비율을 확정하지 않는다.

---

## 5. 페이지 IA (섹션 순서)

```
CalculatorHero
 └─ eyebrow: 동남아 국제학교
 └─ title: 동남아 국제학교 비용 계산기
 └─ description: 국가·도시·학년·자녀 수를 입력하면 학비와 생활비를 합산한 총비용을 계산합니다

InfoNotice (데이터 신뢰도 안내 — "학교별로 확인 수준이 다르며, 생활비 데이터는 일부 도시만 반영되어 있습니다" 등)

SimpleToolShell
 ├─ aside: 입력 영역 (국가 → 도시 → 학교 → 학년 → 자녀 수 → 동반 유형 → 소득)
 └─ main:
     ① 결과 KPI 카드 4개 (연간 학비 / 연간 생활비(또는 "준비 중") / 연간 총비용(또는 "학비만 표시") / 5년 누적)
     ② 데이터 신뢰도 배지 (학교별 sourceUrl·asOfDate·confidence 노출)
     ③ 한국 국제학교 대비 비교 미니 카드 (국내 계산기 데이터 참조 — 국내 계산기와 동일한 대표 학년 매칭)
     ④ 국가별 대표 학교 미니 비교 테이블 (탭 전환: 말레이시아 / 태국 / 베트남)
     ⑤ 관련 리포트 CTA

SeoContent (intro 4단락 이상, criteria, FAQ 5개, related 5개)
```

---

## 6. 컴포넌트 구조

### 기존 공유 컴포넌트

| 컴포넌트 | 용도 |
|---|---|
| `BaseLayout.astro` | `<head>`, SEO, JSON-LD |
| `SiteHeader.astro` | 전역 헤더 |
| `CalculatorHero.astro` | Hero |
| `InfoNotice.astro` | 면책 배너 |
| `SimpleToolShell.astro` | 계산기 골격 |
| `SeoContent.astro` | FAQ + 관련 링크 |

### 페이지 전용 마크업 (`sac-` 프리픽스)

| 블록 클래스 | 설명 |
|---|---|
| `.sac-page` | 루트 스코프 |
| `.sac-field` | 개별 입력 필드 |
| `.sac-kpi-grid` / `.sac-kpi-card` | 결과 KPI 카드 |
| `.sac-kpi-card--pending` | `dataCompleteness !== "full"`일 때 카드에 적용되는 변형 — 값 대신 "준비 중" 안내 표시 |
| `.sac-confidence-badge` | `data-confidence="official"` / `data-confidence="snippet"` 속성으로 색상 분기 (UI_ARCHITECTURE.md의 `data-badge` 패턴 재사용) |
| `.sac-kr-compare-card` | 한국 대비 비교 미니 카드 |
| `.sac-country-tab-row` / `[data-country-tab]` | 국가별 미니 비교 테이블 탭 |
| `.sac-mini-compare-table` | 국가별 대표 학교 비교 테이블 |

---

## 7. SCSS 설계

**파일:** `src/styles/scss/pages/_southeast-asia-international-school-cost-calculator-2026.scss`

```scss
.sac-page {
  --sac-line: #d8e0ea;
  --sac-accent: var(--color-brand-primary, #0f6e56);

  .sac-field {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    margin-bottom: 1rem;

    label { font-size: 0.85rem; font-weight: 600; }
    select, input[type="number"] {
      border: 1px solid var(--sac-line);
      border-radius: var(--radius-btn, 8px);
      padding: 0.55rem 0.7rem;
      font-size: 0.95rem;
    }
  }

  .sac-kpi-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;

    @media (min-width: 768px) {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  .sac-kpi-card {
    border: 1px solid var(--sac-line);
    border-radius: var(--radius-card, 12px);
    padding: 1rem;

    &--highlight {
      border-color: var(--sac-accent);
      background: var(--color-brand-tint, rgba(15, 110, 86, 0.06));
    }

    &--pending {
      border-style: dashed;
      color: #6b7280;
    }

    p { margin: 0; }
    &__label { font-size: 0.8rem; color: #6b7280; }
    &__value { font-size: 1.4rem; font-weight: 700; }
  }

  .sac-confidence-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    border-radius: var(--radius-chip, 20px);
    padding: 0.2rem 0.6rem;
    font-size: 0.75rem;

    &[data-confidence="official"] {
      background: var(--color-brand-tint);
      color: var(--color-brand-primary);
    }
    &[data-confidence="snippet"] {
      background: var(--color-warning-tint);
      color: var(--color-warning);
    }
  }

  .sac-kr-compare-card {
    border: 1px solid var(--sac-line);
    border-left: 4px solid var(--color-accent, #534ab7);
    border-radius: var(--radius-card, 12px);
    padding: 1rem 1.25rem;
  }

  .sac-country-tab-row {
    display: flex;
    gap: 0.5rem;
    margin: 1rem 0 0.75rem;
  }

  .sac-tab-btn {
    border: 1px solid var(--sac-line);
    border-radius: var(--radius-chip, 20px);
    padding: 0.4rem 0.9rem;
    background: transparent;
    font-size: 0.85rem;
    cursor: pointer;

    &.is-active {
      background: var(--sac-accent);
      border-color: var(--sac-accent);
      color: #fff;
    }
  }

  .sac-mini-compare-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.88rem;

    th, td {
      border-bottom: 1px solid var(--sac-line);
      padding: 0.55rem 0.7rem;
      text-align: left;
    }
  }

  [data-country-row].is-hidden { display: none; }

  @media (max-width: 640px) {
    .table-wrap { overflow-x: auto; }
  }
}
```

---

## 8. Astro 페이지 구조 (핵심 스니펫)

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SimpleToolShell from "../../components/SimpleToolShell.astro";
import SeoContent from "../../components/SeoContent.astro";
import {
  SAC_META, SAC_SCHOOLS, SAC_LIVING_COSTS, SAC_FX_RATES, SAC_FAQ, SAC_RELATED_LINKS,
} from "../../data/southeastAsiaInternationalSchoolCostCalculator2026";

const normalizedBase = import.meta.env.BASE_URL.endsWith("/") ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
const withBase = (path: string) => `${normalizedBase}${path.replace(/^\//, "")}`;
const siteUrl = (import.meta.env.SITE ?? "https://bigyocalc.com").replace(/\/$/, "");
const pageUrl = `${siteUrl}/tools/${SAC_META.slug}/`;
const faqItems = SAC_FAQ.map((f) => ({ question: f.question, answer: f.answer }));

const jsonLd = [
  { "@context": "https://schema.org", "@type": "WebApplication", "@id": pageUrl, url: pageUrl,
    name: SAC_META.seoTitle, description: SAC_META.seoDescription,
    applicationCategory: "FinanceApplication", inLanguage: "ko-KR" },
  { "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: SAC_FAQ.map((f) => ({ "@type": "Question", name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer } })) },
];

const calcDataScript = { schools: SAC_SCHOOLS, livingCosts: SAC_LIVING_COSTS, fxRates: SAC_FX_RATES };
---

<BaseLayout title={SAC_META.seoTitle} description={SAC_META.seoDescription} jsonLd={jsonLd}>
  <SiteHeader />

  <SimpleToolShell calculatorId="southeast-asia-international-school-cost-calculator-2026" pageClass="sac-page">
    <Fragment slot="hero">
      <CalculatorHero eyebrow="동남아 국제학교" title={SAC_META.title} description={SAC_META.description} />
      <InfoNotice
        title="계산 전 꼭 확인하세요"
        lines={[SAC_META.dataNote, "생활비 데이터가 없는 도시는 학비만 표시되며, 결과 카드에 표시 상태를 안내합니다."]}
      />
    </Fragment>

    <Fragment slot="aside">
      <div class="sac-input-group">
        <div class="sac-field">
          <label for="sac-select-country">국가</label>
          <select id="sac-select-country">
            <option value="MY">말레이시아</option>
            <option value="TH">태국</option>
            <option value="VN">베트남</option>
          </select>
        </div>
        <div class="sac-field">
          <label for="sac-select-city">도시</label>
          <select id="sac-select-city"></select>
        </div>
        <div class="sac-field">
          <label for="sac-select-school">학교</label>
          <select id="sac-select-school"></select>
        </div>
        <div class="sac-field">
          <label for="sac-select-grade">학년 구간</label>
          <select id="sac-select-grade"></select>
        </div>
        <div class="sac-field">
          <label for="sac-input-children">자녀 수</label>
          <input type="number" id="sac-input-children" min="1" max="3" value="1" />
        </div>
        <div class="sac-field">
          <label>동반 형태</label>
          <div class="toggle-grid">
            <label class="mode-chip"><input type="radio" name="sacCompanion" value="whole_family" checked /><span>가족 전체 동반</span></label>
            <label class="mode-chip"><input type="radio" name="sacCompanion" value="mother_only" /><span>엄마 동반</span></label>
            <label class="mode-chip"><input type="radio" name="sacCompanion" value="none" /><span>미동반(기숙)</span></label>
          </div>
        </div>
        <div class="sac-field">
          <label for="sac-input-income">가구 연소득 (만원, 선택)</label>
          <input type="number" id="sac-input-income" min="0" step="100" placeholder="예: 15000" />
        </div>
      </div>
    </Fragment>

    <div class="sac-kpi-grid">
      <div class="sac-kpi-card sac-kpi-card--highlight">
        <p class="sac-kpi-card__label">연간 학비</p>
        <p class="sac-kpi-card__value" id="sac-kpi-tuition">-</p>
      </div>
      <div class="sac-kpi-card" id="sacKpiLivingCard">
        <p class="sac-kpi-card__label">연간 생활비</p>
        <p class="sac-kpi-card__value" id="sac-kpi-living">-</p>
      </div>
      <div class="sac-kpi-card" id="sacKpiTotalCard">
        <p class="sac-kpi-card__label">연간 총비용</p>
        <p class="sac-kpi-card__value" id="sac-kpi-total">-</p>
      </div>
      <div class="sac-kpi-card">
        <p class="sac-kpi-card__label">5년 누적</p>
        <p class="sac-kpi-card__value" id="sac-kpi-5year">-</p>
      </div>
    </div>

    <section class="content-section">
      <span class="sac-confidence-badge" id="sacConfidenceBadge" data-confidence="snippet">-</span>
      <p id="sacSourceLine"></p>
      <p id="sacDataNote" class="sac-extra-note"></p>
    </section>

    <section class="content-section">
      <h2>한국 국제학교와 비교하면</h2>
      <div class="sac-kr-compare-card" id="sacKrCompareCard">
        <p>계산 결과를 입력하면 한국 국제학교 대표 학비와 비교해 보여드립니다.</p>
      </div>
    </section>

    <section class="content-section">
      <h2>국가별 대표 학교 한눈에 보기</h2>
      <div class="sac-country-tab-row" id="sacMiniCompareTabs">
        <button type="button" class="sac-tab-btn is-active" data-country-tab="MY">말레이시아</button>
        <button type="button" class="sac-tab-btn" data-country-tab="TH">태국</button>
        <button type="button" class="sac-tab-btn" data-country-tab="VN">베트남</button>
      </div>
      <div class="table-wrap">
        <table class="sac-mini-compare-table">
          <thead><tr><th>학교</th><th>도시</th><th>대표 학년 학비</th><th>데이터 상태</th></tr></thead>
          <tbody>
            {SAC_SCHOOLS.map((school) => (
              <tr data-country-row={school.country}>
                <td>{school.name}</td>
                <td>{school.cityLabel}</td>
                <td>{school.tuitionTiers[0].annualLocal.toLocaleString("en-US")} {school.currency}~</td>
                <td>{school.dataConfidence === "official_confirmed" ? "공식 확인" : "검색 요약"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>

    <Fragment slot="seo">
      <SeoContent
        introTitle="동남아 국제학교 비용 계산기 이용 가이드"
        intro={[
          "동남아 국제학교는 한국 국제학교보다 학비가 저렴하다고 알려져 있지만, 실제로는 부모 동반 여부와 거주 형태에 따라 총비용이 크게 달라집니다. 이 계산기는 학비뿐 아니라 생활비까지 합산해 실제 체감 비용을 보여줍니다.",
          "국가·도시별로 데이터 확인 수준이 다릅니다. 일부 학교는 공식 페이지 원문으로 확인했지만, 대부분은 검색 결과 요약을 기반으로 하고 있어 실제 지원 전 반드시 학교 공식 입학처에서 재확인이 필요합니다.",
          "생활비 데이터는 아직 일부 도시만 반영되어 있습니다. 데이터가 없는 도시를 선택하면 학비만 계산되며, 결과 화면에 어떤 값이 포함/미포함되었는지 명확히 표시됩니다.",
          "이 계산 결과는 재정 계획 참고용이며, 각국 장기체류·교육 비자 자격과는 무관합니다. 비자 요건은 반드시 해당국 이민청 공식 자료에서 확인하세요.",
        ]}
        criteria={[
          `학비·생활비는 학교 공식 페이지 또는 검색 결과 기준 ${SAC_META.updatedAt} 확인입니다.`,
          "학교별 데이터 신뢰도가 다르며, 각 학교 카드의 신뢰도 배지로 구분해 표시합니다.",
          "생활비 데이터가 없는 도시는 학비만 계산되며 총비용은 표시되지 않습니다.",
          "이 계산 결과는 재정 계획 참고용이며 비자·이민 자격 판단과는 무관합니다.",
        ]}
        faq={faqItems}
        related={SAC_RELATED_LINKS}
      />
    </Fragment>
  </SimpleToolShell>

  <script id="sac-data" type="application/json" set:html={JSON.stringify(calcDataScript)}></script>
  <script type="module" src={withBase("/scripts/southeast-asia-international-school-cost-calculator-2026.js")}></script>
</BaseLayout>
```

---

## 9. `public/scripts/southeast-asia-international-school-cost-calculator-2026.js` 설계 (핵심 로직)

```js
(function () {
  const dataEl = document.getElementById("sac-data");
  if (!dataEl) return;
  const { schools, livingCosts, fxRates } = JSON.parse(dataEl.textContent);

  const els = {
    country: document.getElementById("sac-select-country"),
    city: document.getElementById("sac-select-city"),
    school: document.getElementById("sac-select-school"),
    grade: document.getElementById("sac-select-grade"),
    children: document.getElementById("sac-input-children"),
    income: document.getElementById("sac-input-income"),
    kpiTuition: document.getElementById("sac-kpi-tuition"),
    kpiLiving: document.getElementById("sac-kpi-living"),
    kpiTotal: document.getElementById("sac-kpi-total"),
    kpi5year: document.getElementById("sac-kpi-5year"),
    confidenceBadge: document.getElementById("sacConfidenceBadge"),
    sourceLine: document.getElementById("sacSourceLine"),
    dataNote: document.getElementById("sacDataNote"),
    krCompareCard: document.getElementById("sacKrCompareCard"),
  };

  function companion() {
    return document.querySelector('input[name="sacCompanion"]:checked')?.value || "whole_family";
  }

  function fmtLocal(n, currency) {
    return `${n.toLocaleString("en-US")} ${currency}`;
  }
  function fmtKrw(n) {
    if (n >= 100_000_000) return (n / 100_000_000).toFixed(2) + "억원";
    if (n >= 10_000) return Math.round(n / 10_000).toLocaleString("ko-KR") + "만원";
    return n.toLocaleString("ko-KR") + "원";
  }

  function populateCities() {
    const country = els.country.value;
    const cities = [...new Set(schools.filter((s) => s.country === country).map((s) => s.city))];
    els.city.innerHTML = cities.map((c) => {
      const label = schools.find((s) => s.city === c).cityLabel;
      return `<option value="${c}">${label}</option>`;
    }).join("");
    populateSchools();
  }

  function populateSchools() {
    const city = els.city.value;
    const filtered = schools.filter((s) => s.city === city);
    els.school.innerHTML = filtered.map((s) => `<option value="${s.id}">${s.name}</option>`).join("");
    populateGrades();
  }

  function currentSchool() { return schools.find((s) => s.id === els.school.value); }

  function populateGrades() {
    const school = currentSchool();
    if (!school) return;
    els.grade.innerHTML = school.tuitionTiers.map((t) => `<option value="${t.tierKey}">${t.tierLabel}</option>`).join("");
    calc();
  }

  function currentTier() {
    const school = currentSchool();
    if (!school) return null;
    return school.tuitionTiers.find((t) => t.tierKey === els.grade.value) ?? school.tuitionTiers[0];
  }

  function calc() {
    const school = currentSchool();
    const tier = currentTier();
    if (!school || !tier) return;

    const children = parseInt(els.children.value, 10) || 1;
    const incomeManwon = parseFloat(els.income.value) || 0;
    const comp = companion();

    const fx = fxRates.find((f) => f.currency === school.currency);
    const living = livingCosts.find((l) => l.city === school.city);

    const annualTuitionLocal = tier.annualLocal * children;
    const annualTuitionKrw = fx?.krwPerUnit ? Math.round(annualTuitionLocal * fx.krwPerUnit) : null;

    let annualLivingLocal = null;
    if (comp === "none") {
      annualLivingLocal = 0;
    } else if (living?.monthlyFamilyExclRentLocal != null) {
      const rent = living.monthlyRentLocal?.mid ?? 0;
      annualLivingLocal = (living.monthlyFamilyExclRentLocal + rent) * 12;
    }

    const annualLivingKrw = annualLivingLocal != null && fx?.krwPerUnit
      ? Math.round(annualLivingLocal * fx.krwPerUnit)
      : (comp === "none" ? 0 : null);

    const annualTotalKrw = (annualTuitionKrw != null && annualLivingKrw != null)
      ? annualTuitionKrw + annualLivingKrw : null;

    // 렌더링
    els.kpiTuition.textContent = annualTuitionKrw != null
      ? fmtKrw(annualTuitionKrw) : `${fmtLocal(annualTuitionLocal, school.currency)} (환율 확인 중)`;

    els.kpiLiving.textContent = comp === "none" ? "0원 (미동반)"
      : annualLivingKrw != null ? fmtKrw(annualLivingKrw) : "생활비 데이터 준비 중";

    els.kpiTotal.textContent = annualTotalKrw != null ? fmtKrw(annualTotalKrw) : "데이터 준비 중 (학비만 참고)";
    els.kpi5year.textContent = annualTotalKrw != null ? fmtKrw(annualTotalKrw * 5) : "-";

    els.confidenceBadge.setAttribute("data-confidence", school.dataConfidence === "official_confirmed" ? "official" : "snippet");
    els.confidenceBadge.textContent = school.dataConfidence === "official_confirmed" ? "공식 페이지 확인" : "검색 요약, 재확인 권장";
    els.sourceLine.innerHTML = `출처: <a href="${school.sourceUrl}" target="_blank" rel="noopener noreferrer">학교 공식 페이지</a> (${school.asOfDate} 확인)`;
    els.dataNote.textContent = school.dataNote ?? "";
  }

  els.country.addEventListener("change", populateCities);
  els.city.addEventListener("change", populateSchools);
  els.school.addEventListener("change", populateGrades);
  [els.grade, els.children, els.income].forEach((el) => el.addEventListener("input", calc));
  document.querySelectorAll('input[name="sacCompanion"]').forEach((r) => r.addEventListener("change", calc));

  const miniTabs = document.getElementById("sacMiniCompareTabs");
  if (miniTabs) {
    miniTabs.addEventListener("click", (event) => {
      const btn = event.target.closest("[data-country-tab]");
      if (!btn) return;
      const country = btn.getAttribute("data-country-tab");
      miniTabs.querySelectorAll(".sac-tab-btn").forEach((b) => b.classList.toggle("is-active", b === btn));
      document.querySelectorAll("[data-country-row]").forEach((row) => {
        row.classList.toggle("is-hidden", row.getAttribute("data-country-row") !== country);
      });
    });
  }

  populateCities();
})();
```

**URL 파라미터 상태 보존**: 국내 계산기와 동일하게 `country`/`city`/`school`/`grade`/`children`/`companion`/`income`을 URL 쿼리에 반영 — 구현 단계에서 `url-state.js` 공용 유틸 재사용.

---

## 10. tools.ts 등록

```ts
{
  slug: "southeast-asia-international-school-cost-calculator-2026",
  title: "동남아 국제학교 비용 계산기 2026 | 학비·생활비 총비용 바로 계산",
  description: "국가·도시·학년·자녀 수 입력하면 동남아 국제학교 연간 학비와 가족 생활비를 합산해 바로 계산. 한국 국제학교 대비 절감액 비교 포함.",
  order: 0,
  eyebrow: "동남아 국제학교",
  category: "parenting", // 국내 국제학교 계산기와 동일 카테고리 유지
  badges: ["신규"],
  previewStats: [
    { label: "3개국 6개 도시", value: "쿠알라룸푸르·조호바루·방콕·치앙마이·호치민·하노이" },
  ],
},
```

---

## 11. app.scss import / sitemap.xml

```scss
@use 'scss/pages/southeast-asia-international-school-cost-calculator-2026';
```

```xml
<url>
  <loc>https://bigyocalc.com/tools/southeast-asia-international-school-cost-calculator-2026/</loc>
  <lastmod>2026-07-09</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
```

---

## 12. 내부 CTA 전체 목록

| 위치 | 문구 | href |
|---|---|---|
| SeoContent related | 한국 vs 동남아 국제학교 비교 | `/reports/korea-vs-southeast-asia-international-school-2026/` |
| SeoContent related | 말레이시아 국제학교 총정리 | `/reports/malaysia-international-school-guide-2026/` |
| SeoContent related | 태국 국제학교 총정리 | `/reports/thailand-international-school-guide-2026/` |
| SeoContent related | 베트남 국제학교 총정리 | `/reports/vietnam-international-school-guide-2026/` |
| SeoContent related | 국내 국제학교 학비 계산기 | `/tools/international-school-tuition-calculator-2026/` |

---

## 13. 데이터 정확성 / QA 포인트

- [ ] `SAC_EXCLUDED_SCHOOLS_NOTE`의 학교(NIST, "British International School Johor Bahru")가 실수로 `SAC_SCHOOLS`에 다시 들어가지 않았는지 확인
- [ ] AISVN 폐교 사실이 베트남 리포트에 실제로 인용되는지 확인 (그냥 누락시키지 말 것 — 학부모에게 유용한 리스크 정보)
- [ ] `dataConfidence`가 `search_snippet`인 학교는 실제 게시 전 공식 페이지 원문 재대조 (특히 KIS Bangkok의 Grade 12 < Grade 11 학비 역전 현상, Wells Bangkok의 학기당→연간 추정치)
- [ ] PTIS(치앙마이)는 2024-25학년도 구버전 PDF임을 UI에서도 명확히 표시 — 최신 PDF 재조사 후 갱신
- [ ] BIS HCMC·ISHCMC·Renaissance·BVIS Hanoi·Concordia Hanoi처럼 양끝 학년만 있는 학교는 중간 학년 선택 시 UI가 어떻게 동작할지 결정(보간 대 미제공) 후 구현
- [ ] 조호바루를 선택했을 때 `dataCompleteness: "tuition_only"`로 정상 분기되는지, "생활비 준비 중" 안내가 명확히 뜨는지 확인
- [ ] 국가→도시→학교→학년 4단 dependent select가 순서대로 올바르게 갱신되는지 확인 (특히 국가당 도시 2개로 늘어난 select 갱신)
- [ ] `npm run build` 통과
- [ ] `CONTENT_GUIDE.md` SeoContent intro 4단락·FAQ 5개 기준 충족
- [ ] 모바일에서 입력 필드가 세로로 자연스럽게 쌓이는지, 미니 비교 테이블이 가로 스크롤되는지 확인

---

## 14. 향후 갱신 계획

1. **1순위**: 조호바루 생활비 조사 → 6개 도시 전체 `dataCompleteness: "full"` 달성 (유일한 잔여 블로커)
2. **2순위**: `search_snippet` 등급 학교(특히 방콕 Wells, 하노이 UNIS·HIS)를 공식 페이지 원문 재조사로 `official_confirmed`로 승격
3. **3순위**: NIST International School 공식 데이터 확보 시도 재개, "British International School Johor Bahru" 실존 여부 최종 확인
4. **4순위**: 의료보험 비용(6개 도시 전부 미확보)을 보험사 견적 조사로 보강해 생활비 정확도 향상
5. 학비는 학교별로 매년(보통 1~4월) 갱신 발표된다 — 국내 클러스터와 동일하게 분기~반기 단위로 `asOfDate` 재확인 및 갱신, 특히 PTIS(치앙마이)는 최우선 갱신 대상
