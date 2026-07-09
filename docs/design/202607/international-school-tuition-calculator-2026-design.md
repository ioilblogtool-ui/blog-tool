# 국제학교 학비 계산기 2026 — 설계 문서 (상세판)

> 기획 원본: [`docs/plan/202607/international-school-content-cluster-2026-plan.md`](../../plan/202607/international-school-content-cluster-2026-plan.md)
> 작성일: 2026-07-08
> 유형: 계산기 (`/tools/`) — 실시간 입력 반영, URL 파라미터 상태 보존
> 클러스터 1번 페이지 (메인 계산기)

---

## 0. 이 문서의 팩트체크 결과 (계획서 2번 원칙 이행) ★ 가장 중요

계획서 2번 "구현 전 필수 팩트체크"에 따라, 설계 착수 전 학교 공식 홈페이지·admissions 자료를 웹검색으로 조사했다. **아래 수치는 각 학교 공식 페이지 기준(2026-07-08 확인)이며, 학교마다 KRW/USD 혼합 납부 구조가 달라 계산 로직 설계에 직접 반영했다.**

### 0-1. 제주권 4개교

| 학교 | 학비 구조 (연간) | 기숙사 | 초기비용 | 확인 필요 항목 |
|---|---|---|---|---|
| **NLCS Jeju** | USD 25,500~35,500 (학년별, KRW+USD 혼합 납부이나 정확한 분담비율은 Fee Policy PDF 확인 필요) | 기숙 시 +USD 9,000/년 | 입학금 $300 + 지원비 $300, 예치금 $2,000 | KRW/USD 정확한 분담 비율 |
| **Branksome Hall Asia** | KRW 41,547,200~50,823,200 (통학, 학년별) / 기숙 시 미화 환산 약 $50,000 상당(통학 $33,000 대비 약 $17,000 추가 — 근사치) | 기숙 옵션 있음 | 예치금 KRW 3,000,000 | 학년별 정확한 통학/기숙 개별 금액 |
| **KIS Jeju** | 고등 기준 KRW 38,000,000~42,000,000/년 | 기숙사비 학기별 별도 청구(금액 미확인) | 예치금 KRW 3,000,000, 입학 첫해 추가 KRW 5,000,000~12,000,000 | 초·중등 학비, 기숙사비 정확한 금액 |
| **SJA Jeju** | 유치·초등 KRW 24,130,000+USD 8,990 / 중등 KRW 25,470,000+USD 9,490 | 확인 필요 (기숙 운영 여부 미확인) | 지원비 KRW 400,000 | 고등 학비, 기숙사 운영 여부·비용 |

### 0-2. 서울·경기·송도권 3개교

| 학교 | 학비 구조 (연간) | 확인 필요 항목 |
|---|---|---|
| **Chadwick International (송도)** | Village(유치~초등) KRW 27,360,000+USD 15,530 / Middle KRW 29,440,000+USD 16,670 / Upper KRW 32,220,000+USD 18,270 | 2026/27 확정 요율은 2026년 1월 공개 예정(학교 공지) — 최신 재확인 필요 |
| **Seoul Foreign School (SFS)** | 초등 KRW 17,500,000+USD 7,000 / 고등 KRW 26,160,000+USD 13,090 | 중등 학비 |
| **Dulwich College Seoul** | Nursery~Reception KRW 40,700,000 / Y1-6 KRW 41,000,000 / Y7-9 KRW 42,400,000 / Y10-11 KRW 43,600,000 / Y12-13 KRW 44,800,000 (전액 원화, USD 분담 없음) | 없음 — 가장 명확한 데이터 |

### 0-3. 법·제도 팩트 (외국인학교 입학자격) — ⚠️ 재검증 권고

웹검색 결과, 내국인의 외국인학교 입학 요건은 **"출생 이후 해외 체류 합산 3년(1,095일) 이상 또는 6학기 이수"**로 다수 자료에서 확인됨 (연속 체류 불필요, 부모 동반 불필요, 한국 체류일은 입출국일 중 하루 제외하고 계산). **다만 이 수치의 출처가 브런치·나무위키 등 2차 자료 중심이라, 구현 전 반드시 교육부 「외국인학교 및 외국인유학생을 위한 학교의 설립·운영에 관한 규정」 원문 또는 각 학교 공식 입학 요강으로 재확인 필요.**

### 0-4. 이 데이터를 다루는 원칙

- 모든 학비 수치는 `sourceUrl` + `asOfDate`(2026-07-08) 필드로 데이터 파일에 기록, 페이지에도 노출
- "확인 필요"로 남은 항목(중등 학비 등)은 **범위를 추정해서 채우지 않는다** — UI에 "학교 공식 확인" 링크로 대체
- 환율은 실시간 연동이 아니므로 편집 가능한 입력값으로 제공 (기본값 1,380원/달러, "예시 기준, 실제 납부일 환율과 다를 수 있음" 명시)
- 자녀 다자녀 할인은 학교마다 조건이 다르므로(Branksome: 3자녀 15%/4자녀 30%, Dulwich: 3자녀 이상 5%/인, 나머지 미확인) **계산기는 할인 미적용 원금만 계산**하고, 학교별 실제 할인 정책은 텍스트 note로만 안내

---

## 1. 파일 목록

| 역할 | 경로 |
|---|---|
| 데이터 | `src/data/internationalSchoolTuitionCalculator2026.ts` |
| 도구 등록 | `src/data/tools.ts` |
| 홈 카테고리 등록 | `src/pages/index.astro` (해당 없음 — 계산기는 `tools.ts` order로 목록 노출, 별도 카테고리 맵 불필요. 단, `life` 카테고리를 쓰는 리포트 클러스터와 연결되므로 관련 리포트 등록 시 `category: "life"` 사용) |
| 도구 라이브러리 등록 | `src/pages/tools/index.astro` (필터/카테고리 매핑 확인) |
| 페이지 | `src/pages/tools/international-school-tuition-calculator-2026.astro` |
| 스크립트 | `public/scripts/international-school-tuition-calculator-2026.js` |
| 스타일 | `src/styles/scss/pages/_international-school-tuition-calculator-2026.scss` |
| 앱 CSS import | `src/styles/app.scss` |
| 사이트맵 | `public/sitemap.xml` |

**클래스 프리픽스:** `ist-` (International School Tuition)

---

## 2. URL 및 메타 (CLAUDE.md 타이틀 공식 적용)

```
슬러그: /tools/international-school-tuition-calculator-2026/
타이틀(seoTitle): 국제학교 학비 계산기 2026 | 연간 비용 바로 계산
디스크립션: 지역·학교·학년·자녀 수 입력하면 국제학교 연간 학비와 월 부담액, 재학 기간 총비용까지 바로 계산. 제주·서울·송도 7개교 데이터 포함.
```

---

## 3. 데이터 파일 설계

**`src/data/internationalSchoolTuitionCalculator2026.ts`**

```ts
// ── 타입 ──────────────────────────────────────────

export type SchoolRegion = "jeju" | "seoul_songdo";

export type TuitionTier = {
  tierKey: string;         // "early" | "elementary" | "middle" | "high" 등 학교별 자유 정의
  tierLabel: string;       // "유치부~초등(PK-G5)" 등 학교 실제 학년 구간 표기
  krwPortion: number;      // 원화 부분 (연간, 원)
  usdPortion: number;      // 달러 부분 (연간, USD) — 0이면 전액 원화
  isEstimatedSplit?: boolean; // true면 "KRW/USD 분담 비율 근사치" 배지 노출 (NLCS 등)
  boardingSurchargeKrw?: number; // 기숙 선택 시 추가되는 원화 (add-on 방식)
  boardingSurchargeUsd?: number; // 기숙 선택 시 추가되는 달러
  suggestedYears: number;  // 이 구간에 보통 몇 년 재학하는지 (12년 누적 계산용 프리셋)
};

export type InternationalSchoolProfile = {
  id: string;
  name: string;              // "NLCS Jeju"
  nameKo: string;            // "엔엘씨에스 제주" — 검색용 한글 표기
  country: "KR";             // 확장 대비 필드 (동남아 확장 시 "SG" 등 추가)
  region: SchoolRegion;
  regionLabel: string;       // "제주" | "서울·경기·송도"
  boardingAvailable: boolean;
  boardingNote?: string;     // 기숙 운영 관련 확인 필요 사항
  tuitionTiers: TuitionTier[];
  applicationFeeKrw: number;
  firstYearExtraKrw: number; // 입학금·예치금·등록비 등 최초 1회성 비용 합산 (원화 환산)
  firstYearExtraNote: string; // 구성 내역 설명
  multiChildNote: string;    // 학교별 다자녀 할인 정책 (자유 텍스트, 계산에는 미반영)
  sourceUrl: string;
  asOfDate: string;          // "2026-07-08 확인"
  dataNote?: string;         // 데이터 한계 설명 (확인 필요 항목 등)
};

export type FaqItem = { question: string; answer: string };
export type RelatedLink = { href: string; label: string };

// ── 데이터 ────────────────────────────────────────

export const IST_META = {
  slug: "international-school-tuition-calculator-2026",
  title: "국제학교 학비 계산기",
  seoTitle: "국제학교 학비 계산기 2026 | 연간 비용 바로 계산",
  seoDescription:
    "지역·학교·학년·자녀 수 입력하면 국제학교 연간 학비와 월 부담액, 재학 기간 총비용까지 바로 계산. 제주·서울·송도 7개교 데이터 포함.",
  description: "지역과 학교, 학년, 자녀 수를 입력하면 국제학교 연간 학비와 월 부담액, 소득 대비 비율까지 바로 계산합니다.",
  updatedAt: "2026-07-08",
  defaultExchangeRate: 1380,
  dataNote:
    "학비는 각 학교 공식 홈페이지 2026-07-08 확인 기준이며, 학교마다 학비를 매년 개정합니다. 실제 납부 금액은 각 학교 입학처에서 반드시 재확인하세요. 이 계산 결과는 입학 가능 여부와 무관한 재정 계획 참고용입니다.",
};

export const IST_SCHOOLS: InternationalSchoolProfile[] = [
  {
    id: "nlcs-jeju",
    name: "NLCS Jeju",
    nameKo: "엔엘씨에스 제주",
    country: "KR",
    region: "jeju",
    regionLabel: "제주",
    boardingAvailable: true,
    tuitionTiers: [
      {
        tierKey: "elementary",
        tierLabel: "초등",
        krwPortion: 0,
        usdPortion: 25500,
        isEstimatedSplit: true,
        boardingSurchargeUsd: 9000,
        suggestedYears: 6,
      },
      {
        tierKey: "secondary",
        tierLabel: "중·고등",
        krwPortion: 0,
        usdPortion: 35500,
        isEstimatedSplit: true,
        boardingSurchargeUsd: 9000,
        suggestedYears: 6,
      },
    ],
    applicationFeeKrw: 780_000, // $300 지원비 + $300 입학비 환산 근사치 (환율 1,300원 기준 예시 — 실제 계산은 사용자 환율 입력 반영해 재계산 권장)
    firstYearExtraKrw: 2_600_000, // 예치금 $2,000 환산 근사치
    firstYearExtraNote: "지원비·입학비 각 $300, 예치금 $2,000 (전액 달러 표시, 원화 환산은 계산기 환율 입력값 적용)",
    multiChildNote: "다자녀 할인 정책 공식 확인 필요",
    sourceUrl: "https://www.nlcsjeju.co.kr/admissions/fees/",
    asOfDate: "2026-07-08",
    dataNote: "KRW/USD 정확한 분담 비율은 학교 Fee Policy PDF 확인 필요 — 이 데이터는 달러 환산 총액 기준 근사치",
  },
  {
    id: "branksome-hall-asia",
    name: "Branksome Hall Asia",
    nameKo: "브랭섬홀 아시아",
    country: "KR",
    region: "jeju",
    regionLabel: "제주",
    boardingAvailable: true,
    tuitionTiers: [
      {
        tierKey: "all_grades",
        tierLabel: "전 학년 (통학 기준, 학년별 상이)",
        krwPortion: 41_547_200,
        usdPortion: 0,
        boardingSurchargeUsd: 17000, // 통학 $33,000 대비 기숙 $50,000 근사 차액
        suggestedYears: 12,
      },
    ],
    applicationFeeKrw: 0,
    firstYearExtraKrw: 3_000_000,
    firstYearExtraNote: "신규 입학 예치금 3,000,000원 (첫 학비에서 차감)",
    multiChildNote: "3번째 자녀 학비 15% 할인, 4번째 이후 자녀 30% 할인 (학교 공식 정책)",
    sourceUrl: "https://www.branksome.asia/admissions/tuition-fees",
    asOfDate: "2026-07-08",
    dataNote: "학년별 학비는 KRW 41,547,200~50,823,200 범위 — 이 데이터는 하한값을 대표값으로 사용, 상급 학년일수록 실제 학비가 더 높을 수 있음",
  },
  {
    id: "kis-jeju",
    name: "KIS Jeju",
    nameKo: "한국국제학교 제주",
    country: "KR",
    region: "jeju",
    regionLabel: "제주",
    boardingAvailable: true,
    boardingNote: "기숙사비는 학기별 별도 청구 — 정확한 금액 확인 필요",
    tuitionTiers: [
      {
        tierKey: "high",
        tierLabel: "고등 (참고 대표값 — 초·중등은 이보다 낮을 수 있음)",
        krwPortion: 40_000_000,
        usdPortion: 0,
        suggestedYears: 12,
      },
    ],
    applicationFeeKrw: 0,
    firstYearExtraKrw: 8_500_000, // 3,000,000(예치금) + 자본비·등록비·교복·버스비 5~12M 범위의 중간값 근사
    firstYearExtraNote: "예치금 3,000,000원 + 자본비·등록비·교복·버스비 등 첫해 추가 5,000,000~12,000,000원 (범위, 중간값 적용)",
    multiChildNote: "다자녀 할인 정책 공식 확인 필요",
    sourceUrl: "https://kis.ac/tuition-and-fees/",
    asOfDate: "2026-07-08",
    dataNote: "초·중등 학비 미확인 — 고등 학비를 대표값으로 사용하므로 저학년 자녀는 실제보다 높게 계산될 수 있음",
  },
  {
    id: "sja-jeju",
    name: "SJA Jeju",
    nameKo: "세인트존스베리아카데미 제주",
    country: "KR",
    region: "jeju",
    regionLabel: "제주",
    boardingAvailable: false,
    boardingNote: "기숙사 운영 여부 확인 필요",
    tuitionTiers: [
      {
        tierKey: "early_elementary",
        tierLabel: "유치~초등",
        krwPortion: 24_130_000,
        usdPortion: 8990,
        suggestedYears: 8,
      },
      {
        tierKey: "middle",
        tierLabel: "중등",
        krwPortion: 25_470_000,
        usdPortion: 9490,
        suggestedYears: 3,
      },
    ],
    applicationFeeKrw: 400_000,
    firstYearExtraKrw: 400_000,
    firstYearExtraNote: "지원비 400,000원 (환불 불가) — 예치금·입학금 별도 확인 필요",
    multiChildNote: "다자녀 할인 정책 공식 확인 필요",
    sourceUrl: "https://www.sjajeju.kr/admissions/tuition-fees",
    asOfDate: "2026-07-08",
    dataNote: "고등학교 학비 미확인 — 중등 학비로 대체 계산 시 실제보다 낮게 나올 수 있음",
  },
  {
    id: "chadwick-songdo",
    name: "Chadwick International",
    nameKo: "채드윅 송도",
    country: "KR",
    region: "seoul_songdo",
    regionLabel: "서울·경기·송도",
    boardingAvailable: false,
    tuitionTiers: [
      { tierKey: "village", tierLabel: "Village School (유치~초등)", krwPortion: 27_360_000, usdPortion: 15530, suggestedYears: 8 },
      { tierKey: "middle", tierLabel: "Middle School (중등)", krwPortion: 29_440_000, usdPortion: 16670, suggestedYears: 3 },
      { tierKey: "upper", tierLabel: "Upper School (고등)", krwPortion: 32_220_000, usdPortion: 18270, suggestedYears: 4 },
    ],
    applicationFeeKrw: 0,
    firstYearExtraKrw: 3_000_000,
    firstYearExtraNote: "입학·재등록 예치금 3,000,000원 (연간 학비에 포함 처리)",
    multiChildNote: "다자녀 할인 정책 공식 확인 필요",
    sourceUrl: "https://www.chadwickinternational.org/admission/tuition-and-fees",
    asOfDate: "2026-07-08",
    dataNote: "2026/27학년도 확정 요율은 2026년 1월 공개 예정 — 최신 수치 재확인 권장",
  },
  {
    id: "sfs-seoul",
    name: "Seoul Foreign School",
    nameKo: "서울외국인학교",
    country: "KR",
    region: "seoul_songdo",
    regionLabel: "서울·경기·송도",
    boardingAvailable: false,
    tuitionTiers: [
      { tierKey: "elementary", tierLabel: "초등 (참고 대표값)", krwPortion: 17_500_000, usdPortion: 7000, suggestedYears: 6 },
      { tierKey: "high", tierLabel: "고등", krwPortion: 26_160_000, usdPortion: 13090, suggestedYears: 3 },
    ],
    applicationFeeKrw: 1_000_000, // 지원비 400,000 + 등록비 600,000
    firstYearExtraKrw: 5_500_000, // 신입생 입학금 (재학생 예치금 6,500,000과 별도)
    firstYearExtraNote: "지원비 400,000원 + 등록비 600,000원 + 신입생 입학금 5,500,000원 (재학생 재등록 예치금은 6,500,000원으로 별도)",
    multiChildNote: "다자녀 할인 정책 공식 확인 필요",
    sourceUrl: "https://www.seoulforeign.org/admissions/tuition-and-fees",
    asOfDate: "2026-07-08",
    dataNote: "중등 학비 미확인 — 초등 대표값 사용 시 중등 자녀는 실제와 다를 수 있음",
  },
  {
    id: "dulwich-seoul",
    name: "Dulwich College Seoul",
    nameKo: "덜위치 칼리지 서울",
    country: "KR",
    region: "seoul_songdo",
    regionLabel: "서울·경기·송도",
    boardingAvailable: false,
    tuitionTiers: [
      { tierKey: "nursery_reception", tierLabel: "Nursery~Reception (유치)", krwPortion: 40_700_000, usdPortion: 0, suggestedYears: 2 },
      { tierKey: "y1_6", tierLabel: "Year 1-6 (초등)", krwPortion: 41_000_000, usdPortion: 0, suggestedYears: 6 },
      { tierKey: "y7_9", tierLabel: "Year 7-9 (중등)", krwPortion: 42_400_000, usdPortion: 0, suggestedYears: 3 },
      { tierKey: "y10_11", tierLabel: "Year 10-11 (고등 전반)", krwPortion: 43_600_000, usdPortion: 0, suggestedYears: 2 },
      { tierKey: "y12_13", tierLabel: "Year 12-13 (고등 후반)", krwPortion: 44_800_000, usdPortion: 0, suggestedYears: 2 },
    ],
    applicationFeeKrw: 400_000,
    firstYearExtraKrw: 7_000_000, // 자본비 4,000,000 + 배치 예치금 3,000,000
    firstYearExtraNote: "지원비 400,000원 + 자본비 4,000,000원(신규) + 배치 예치금 3,000,000원. 버스비는 별도(왕복 4,720,000원/편도 3,780,000원)",
    multiChildNote: "연납 시 5% 할인, 3자녀 이상 전일제 재학 시 1인당 5% 할인 (학교 공식 정책)",
    sourceUrl: "https://seoul.dulwich.org/admissions/apply/fees",
    asOfDate: "2026-07-08",
    dataNote: "전액 원화 표시 — 이 7개교 중 유일하게 달러 분담분이 없는 학교",
  },
];

export const IST_FAQ: FaqItem[] = [
  {
    question: "국제학교 학비는 원화로만 내나요, 달러로도 내야 하나요?",
    answer:
      "학교마다 다릅니다. Dulwich College Seoul은 전액 원화로 청구하지만, NLCS Jeju·Chadwick·SJA Jeju 등 대부분의 학교는 학비를 원화 부분과 달러 부분으로 나눠 청구합니다. 이 계산기는 학교별 원화·달러 분담 비율을 반영해 환율 입력값으로 원화 총액을 계산합니다.",
  },
  {
    question: "제주 국제학교와 서울 국제학교 중 어디가 더 저렴한가요?",
    answer:
      "학년과 기숙 여부에 따라 달라집니다. 통학 기준으로는 서울권 학교(SFS 초등 기준 약 2,700만 원대)가 제주 일부 학교보다 낮은 경우가 있지만, 제주는 기숙 비용이 추가되면 총비용이 서울권보다 높아지는 경우가 많습니다. 학교와 학년을 선택해 직접 비교하는 것이 정확합니다.",
  },
  {
    question: "자녀를 2명 이상 보내면 학비 할인을 받을 수 있나요?",
    answer:
      "일부 학교는 다자녀 할인 정책이 있습니다. 예를 들어 Branksome Hall Asia는 3번째 자녀 15%, 4번째 이후 자녀 30% 할인을 제공하고, Dulwich College Seoul은 3자녀 이상 전일제 재학 시 1인당 5% 할인을 제공합니다. 이 계산기는 할인 미적용 기준 금액을 계산하며, 실제 할인은 학교 공식 안내를 확인해야 합니다.",
  },
  {
    question: "이 계산 결과로 국제학교 입학이 가능한지 알 수 있나요?",
    answer:
      "아니요. 이 계산기는 학비를 감당할 수 있는지에 대한 재정 참고용 계산이며, 실제 입학 자격(외국인학교의 경우 내국인은 해외 체류 3년 이상 등 별도 요건)과는 무관합니다. 입학 자격은 관련 리포트에서 별도로 확인하세요.",
  },
  {
    question: "환율이 바뀌면 학비도 달라지나요?",
    answer:
      "네. 학비의 달러 분담분은 실제 납부 시점의 환율로 청구되므로, 환율이 오르면 원화 환산 학비도 올라갑니다. 이 계산기의 환율은 편집 가능한 예시 기본값이며, 실제 납부액은 학교가 고지하는 청구 시점 환율을 따릅니다.",
  },
  {
    question: "이 계산기에 나오지 않는 학교도 있나요?",
    answer:
      "네. 우선 검색 수요가 높은 제주·서울·송도권 7개교만 우선 반영했습니다. Dwight School Seoul, YISS, KIS Pangyo 등은 추후 추가할 예정입니다.",
  },
];

export const IST_RELATED_LINKS: RelatedLink[] = [
  { href: "/reports/international-school-overview-2026/", label: "국내 국제학교 총정리" },
  { href: "/reports/jeju-international-school-comparison-2026/", label: "제주 국제학교 4곳 비교" },
  { href: "/reports/seoul-international-school-comparison-2026/", label: "서울·경기 국제학교 비교" },
  { href: "/reports/international-school-vs-foreign-school-2026/", label: "국제학교 vs 외국인학교 차이" },
];
```

---

## 4. 계산 로직 상세

### 4-1. 입력값

| 입력 ID | 종류 | 설명 |
|---|---|---|
| `ist-select-region` | select | 제주 / 서울·경기·송도 (선택 시 학교 select 옵션 갱신) |
| `ist-select-school` | select | 선택된 지역의 학교 목록 (region 종속) |
| `ist-select-grade` | select | 선택된 학교의 `tuitionTiers` 목록 (school 종속) |
| `ist-toggle-boarding` | checkbox | 기숙 선택 (해당 학교 `boardingAvailable`일 때만 노출) |
| `ist-input-children` | number | 자녀 수 (기본 1, 최대 4) |
| `ist-input-income` | number | 가구 연소득 (만원 단위, 소득 대비 비율 계산용, 선택 입력) |
| `ist-input-fxrate` | number | 환율 (기본값 1,380원/달러, 수정 가능) |
| `ist-input-years` | number | 예상 재학 기간(년) — 학년 선택 시 해당 tier의 `suggestedYears`로 자동 채움, 수정 가능 |

### 4-2. 계산 함수 (TS 의사코드)

```ts
function calculate(input: {
  school: InternationalSchoolProfile;
  tier: TuitionTier;
  boarding: boolean;
  children: number;
  incomeManwon: number;
  fxRate: number;
  years: number;
}) {
  const boardingKrw = input.boarding ? (input.tier.boardingSurchargeKrw ?? 0) : 0;
  const boardingUsd = input.boarding ? (input.tier.boardingSurchargeUsd ?? 0) : 0;

  const annualKrw = Math.round(
    input.tier.krwPortion +
    input.tier.usdPortion * input.fxRate +
    boardingKrw +
    boardingUsd * input.fxRate
  );

  const monthlyKrw = Math.round(annualKrw / 12);

  const firstYearTotalKrw = annualKrw + input.school.applicationFeeKrw + input.school.firstYearExtraKrw;

  const allChildrenAnnualKrw = annualKrw * input.children; // 할인 미반영, note로 안내

  const incomeRatioPct = input.incomeManwon > 0
    ? Math.round(((annualKrw / 10000) / input.incomeManwon) * 1000) / 10 // 소수 1자리
    : null;

  const totalOverYearsKrw = annualKrw * input.years; // 학비 인상률 미반영, "현재 학비 기준 단순 누적"으로 라벨링

  return { annualKrw, monthlyKrw, firstYearTotalKrw, allChildrenAnnualKrw, incomeRatioPct, totalOverYearsKrw };
}
```

### 4-3. 핵심 설계 결정 (왜 이렇게 계산하는가)

- **"12년 누적" 대신 "예상 재학 기간(년) 입력"으로 대체**: 학교마다 학제(영국식 Year, 미국식 Grade, 한국 나이 기준)가 달라 "12년"을 하나로 고정하면 학교별로 왜곡이 커진다. 대신 선택한 학년(tier)의 `suggestedYears`를 기본값으로 채우고 사용자가 직접 조정하게 해 투명성을 확보한다.
- **다자녀 할인 미반영**: 학교별 할인 조건이 파편적이라(일부는 3번째 자녀부터, 일부는 확인 불가) 잘못된 할인율을 적용하는 것보다 원금을 그대로 계산하고 `multiChildNote`로 안내하는 편이 안전하다.
- **환율 입력을 사용자가 직접 조정**: 실시간 환율 API 연동은 이 사이트의 정적 리포트 운영 방식과 맞지 않고(다른 클러스터에서도 고정 `FX_RATE_KRW_PER_USD` 상수 + 수정 가능 입력 패턴을 사용), 대신 InfoNotice로 "예시 기준" 안내를 명확히 한다.
- **"확인 필요" 학교/학년은 대표값으로 근사 계산하되, `dataNote`를 결과 카드 옆에 항상 노출**해 실제보다 낮거나 높게 나올 수 있음을 그 자리에서 바로 안내한다.

---

## 5. 페이지 IA (섹션 순서)

```
CalculatorHero
 └─ eyebrow: 국제학교 학비
 └─ title: 국제학교 학비 계산기
 └─ description: 지역·학교·학년·자녀 수를 입력하면 연간 학비와 월 부담액을 바로 계산합니다

InfoNotice ("학비는 학교 공식 페이지 2026-07-08 기준 + 매년 개정됨 + 입학 자격과 무관한 재정 참고용" 안내)

SimpleToolShell
 ├─ aside: 입력 영역 (지역 → 학교 → 학년 → 기숙 여부 → 자녀 수 → 소득 → 환율 → 재학기간)
 └─ main:
     ① 결과 KPI 카드 4개 (연간 총비용 / 월 환산 / 소득 대비 비율 / 재학기간 총비용)
     ② 첫해 추가비용 상세 (지원비·예치금·자본비 등)
     ③ 선택 학교 데이터 출처·확인일자 배지 + dataNote 경고 배지(해당 시)
     ④ 지역별 대표 학교 미니 비교 테이블 (제주 4교 / 서울·송도 3교 탭 전환)
     ⑤ 관련 리포트 CTA (제주 비교, 서울 비교, 외국인학교 차이)

SeoContent (intro 4단락 이상, criteria, FAQ 6개, related 4개)
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
| `SimpleToolShell.astro` | 계산기 골격 (aside=입력, main=결과) |
| `SeoContent.astro` | FAQ + 관련 링크 |

### 페이지 전용 마크업 (`ist-` 프리픽스)

| 블록 클래스 | 설명 |
|---|---|
| `.ist-page` | 루트 스코프 |
| `.ist-input-group` | aside 내 입력 필드 묶음 |
| `.ist-field` | 개별 입력 필드(label + input/select) |
| `.ist-kpi-grid` | 결과 KPI 카드 4개 |
| `.ist-kpi-card` / `.ist-kpi-card--highlight` | KPI 카드, 강조 1개(연간 총비용) |
| `.ist-extra-cost-list` | 첫해 추가비용 상세 리스트 |
| `.ist-source-badge` | 데이터 출처·확인일자 배지 |
| `.ist-data-warning` | `dataNote` 존재 시 노출되는 경고 배지 |
| `.ist-region-tab-row` / `[data-region-tab]` | 지역별 미니 비교 테이블 탭 |
| `.ist-mini-compare-table` | 지역별 대표 학교 비교 테이블 |

---

## 7. SCSS 설계

**파일:** `src/styles/scss/pages/_international-school-tuition-calculator-2026.scss`

```scss
.ist-page {
  --ist-line: #d8e0ea;
  --ist-accent: #1a56db;
  --ist-warning-bg: #fff7ed;
  --ist-warning-border: #fb923c;

  .ist-field {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    margin-bottom: 1rem;

    label { font-size: 0.85rem; font-weight: 600; }
    select, input[type="number"] {
      border: 1px solid var(--ist-line);
      border-radius: 8px;
      padding: 0.55rem 0.7rem;
      font-size: 0.95rem;
    }
  }

  .ist-toggle-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .ist-kpi-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;

    @media (min-width: 768px) {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  .ist-kpi-card {
    border: 1px solid var(--ist-line);
    border-radius: 12px;
    padding: 1rem;

    &--highlight {
      border-color: var(--ist-accent);
      background: rgba(26, 86, 219, 0.04);
    }

    p { margin: 0; }
    &__label { font-size: 0.8rem; color: #6b7280; }
    &__value { font-size: 1.4rem; font-weight: 700; }
  }

  .ist-data-warning {
    margin-top: 0.5rem;
    padding: 0.6rem 0.8rem;
    background: var(--ist-warning-bg);
    border: 1px solid var(--ist-warning-border);
    border-radius: 8px;
    font-size: 0.82rem;
  }

  .ist-source-badge {
    display: inline-flex;
    gap: 0.3rem;
    font-size: 0.78rem;
    color: #6b7280;

    a { color: var(--ist-accent); }
  }

  .ist-region-tab-row {
    display: flex;
    gap: 0.5rem;
    margin: 1rem 0 0.75rem;
  }

  .ist-tab-btn {
    border: 1px solid var(--ist-line);
    border-radius: 999px;
    padding: 0.4rem 0.9rem;
    background: transparent;
    font-size: 0.85rem;
    cursor: pointer;

    &.is-active {
      background: var(--ist-accent);
      border-color: var(--ist-accent);
      color: #fff;
    }
  }

  .ist-mini-compare-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.88rem;

    th, td {
      border-bottom: 1px solid var(--ist-line);
      padding: 0.55rem 0.7rem;
      text-align: left;
    }
  }

  [data-region-row].is-hidden { display: none; }

  @media (max-width: 640px) {
    .table-wrap { overflow-x: auto; }
  }
}
```

---

## 8. Astro 페이지 구조

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SimpleToolShell from "../../components/SimpleToolShell.astro";
import SeoContent from "../../components/SeoContent.astro";
import {
  IST_META,
  IST_SCHOOLS,
  IST_FAQ,
  IST_RELATED_LINKS,
} from "../../data/internationalSchoolTuitionCalculator2026";

const normalizedBase = import.meta.env.BASE_URL.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;
const withBase = (path: string) => `${normalizedBase}${path.replace(/^\//, "")}`;

const siteUrl = (import.meta.env.SITE ?? "https://bigyocalc.com").replace(/\/$/, "");
const pageUrl = `${siteUrl}/tools/${IST_META.slug}/`;

const faqItems = IST_FAQ.map((f) => ({ question: f.question, answer: f.answer }));

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": pageUrl,
    url: pageUrl,
    name: IST_META.seoTitle,
    description: IST_META.seoDescription,
    applicationCategory: "FinanceApplication",
    inLanguage: "ko-KR",
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: IST_FAQ.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  },
];

const schoolDataScript = {
  schools: IST_SCHOOLS,
  defaultExchangeRate: IST_META.defaultExchangeRate,
};
---

<BaseLayout title={IST_META.seoTitle} description={IST_META.seoDescription} jsonLd={jsonLd}>
  <SiteHeader />

  <SimpleToolShell calculatorId="international-school-tuition-calculator-2026" pageClass="ist-page">
    <Fragment slot="hero">
      <CalculatorHero
        eyebrow="국제학교 학비"
        title={IST_META.title}
        description={IST_META.description}
      />
      <InfoNotice
        title="계산 전 꼭 확인하세요"
        lines={[IST_META.dataNote, "이 계산 결과는 학비 감당 가능 여부를 위한 참고용이며, 입학 자격과는 무관합니다."]}
      />
    </Fragment>

    <Fragment slot="aside">
      <div class="ist-input-group">
        <div class="ist-field">
          <label for="ist-select-region">지역</label>
          <select id="ist-select-region">
            <option value="jeju">제주</option>
            <option value="seoul_songdo">서울·경기·송도</option>
          </select>
        </div>

        <div class="ist-field">
          <label for="ist-select-school">학교</label>
          <select id="ist-select-school"></select>
        </div>

        <div class="ist-field">
          <label for="ist-select-grade">학년 구간</label>
          <select id="ist-select-grade"></select>
        </div>

        <div class="ist-field ist-toggle-row">
          <input type="checkbox" id="ist-toggle-boarding" />
          <label for="ist-toggle-boarding">기숙 선택</label>
        </div>

        <div class="ist-field">
          <label for="ist-input-children">자녀 수</label>
          <input type="number" id="ist-input-children" min="1" max="4" value="1" />
        </div>

        <div class="ist-field">
          <label for="ist-input-income">가구 연소득 (만원, 선택)</label>
          <input type="number" id="ist-input-income" min="0" step="100" placeholder="예: 15000" />
        </div>

        <div class="ist-field">
          <label for="ist-input-fxrate">환율 (원/달러)</label>
          <input type="number" id="ist-input-fxrate" min="1000" max="2000" value={IST_META.defaultExchangeRate} />
        </div>

        <div class="ist-field">
          <label for="ist-input-years">예상 재학 기간 (년)</label>
          <input type="number" id="ist-input-years" min="1" max="15" value="12" />
        </div>
      </div>
    </Fragment>

    <div class="ist-kpi-grid">
      <div class="ist-kpi-card ist-kpi-card--highlight">
        <p class="ist-kpi-card__label">연간 총비용</p>
        <p class="ist-kpi-card__value" id="ist-kpi-annual">-</p>
      </div>
      <div class="ist-kpi-card">
        <p class="ist-kpi-card__label">월 환산 비용</p>
        <p class="ist-kpi-card__value" id="ist-kpi-monthly">-</p>
      </div>
      <div class="ist-kpi-card">
        <p class="ist-kpi-card__label">소득 대비 비율</p>
        <p class="ist-kpi-card__value" id="ist-kpi-ratio">-</p>
      </div>
      <div class="ist-kpi-card">
        <p class="ist-kpi-card__label">재학기간 총비용</p>
        <p class="ist-kpi-card__value" id="ist-kpi-total-years">-</p>
      </div>
    </div>

    <section class="content-section">
      <h2>첫해 추가비용</h2>
      <p id="ist-first-year-total">-</p>
      <p class="ist-extra-cost-note" id="ist-first-year-note"></p>
    </section>

    <section class="content-section">
      <div class="ist-source-badge">
        출처: <a id="ist-source-link" href="#" target="_blank" rel="noopener noreferrer">학교 공식 페이지</a>
        <span id="ist-source-date"></span>
      </div>
      <div class="ist-data-warning is-hidden" id="ist-data-warning"></div>
      <p id="ist-multichild-note" class="ist-extra-cost-note"></p>
    </section>

    <section class="content-section">
      <h2>지역별 대표 학교 한눈에 보기</h2>
      <div class="ist-region-tab-row" id="istMiniCompareTabs">
        <button type="button" class="ist-tab-btn is-active" data-region-tab="jeju">제주</button>
        <button type="button" class="ist-tab-btn" data-region-tab="seoul_songdo">서울·경기·송도</button>
      </div>
      <div class="table-wrap">
        <table class="ist-mini-compare-table">
          <thead>
            <tr><th>학교</th><th>대표 학년 학비</th><th>기숙 가능</th></tr>
          </thead>
          <tbody>
            {IST_SCHOOLS.map((school) => (
              <tr data-region-row={school.region}>
                <td>{school.name}</td>
                <td>{school.tuitionTiers[0].krwPortion > 0
                  ? `${(school.tuitionTiers[0].krwPortion / 10000).toLocaleString("ko-KR")}만원~`
                  : `$${school.tuitionTiers[0].usdPortion.toLocaleString("en-US")}~`}</td>
                <td>{school.boardingAvailable ? "가능" : "확인 필요"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>

    <Fragment slot="seo">
      <SeoContent
        introTitle="국제학교 학비 계산기 이용 가이드"
        intro={[
          "국제학교 학비는 유치원부터 고등학교까지 매년 수천만 원이 들어가는 대표적인 고정 교육비 지출입니다. 자녀 입학을 고민하는 학부모라면 학비뿐 아니라 입학금·예치금 같은 첫해 추가비용, 기숙 여부에 따른 차이까지 미리 계산해봐야 실제 가계 계획을 세울 수 있습니다.",
          "이 계산기는 학교별로 다른 원화·달러 혼합 납부 구조를 반영합니다. 대부분의 국제학교는 학비를 원화 부분과 달러 부분으로 나눠 청구하기 때문에, 환율이 오르면 원화 환산 학비도 함께 오릅니다. 환율 입력값을 조정하면서 환율 변동이 실제 부담에 미치는 영향을 확인할 수 있습니다.",
          "결과값 중 소득 대비 비율은 가구 연소득 대비 학비 부담이 어느 정도인지 가늠하는 참고 지표입니다. 비율이 높다고 해서 입학이 불가능한 것은 아니며, 반대로 낮다고 해서 입학 자격이 생기는 것도 아닙니다 — 재정 여력과 입학 자격은 서로 다른 기준입니다.",
          "학비 데이터 중 일부(초·중등 학비, 기숙사 정확한 금액 등)는 학교가 공식적으로 세분화해 공개하지 않아 대표값으로 근사 계산됩니다. 이런 항목은 결과 화면에 경고 배지로 표시되니, 실제 지원 전에는 반드시 학교 공식 입학처에서 최신 학비를 재확인하세요.",
        ]}
        criteria={[
          `학비는 각 학교 공식 홈페이지 ${IST_META.updatedAt} 확인 기준입니다.`,
          "학교마다 원화·달러 분담 비율이 다르며, 환율은 사용자가 직접 입력한 예시값을 사용합니다.",
          "다자녀 할인은 학교별 정책이 상이해 계산에 반영하지 않고 텍스트로 안내합니다.",
          "이 계산 결과는 재정 계획 참고용이며 입학 자격 판단과는 무관합니다.",
        ]}
        faq={faqItems}
        related={IST_RELATED_LINKS}
      />
    </Fragment>
  </SimpleToolShell>

  <script id="ist-data" type="application/json" set:html={JSON.stringify(schoolDataScript)}></script>
  <script type="module" src={withBase("/scripts/international-school-tuition-calculator-2026.js")}></script>
</BaseLayout>
```

**참고**: `SimpleToolShell`은 `hero`/`actions`/`aside`/기본 슬롯/`seo` 슬롯 구조다. 위 코드는 실제 구현 시 `aside`에 입력, 기본 슬롯에 결과 영역을 넣는 구조를 그대로 따른다 — 다만 이 프로젝트의 기존 계산기(`samsung-electro-mechanics-bonus-calculator-2026` 등)는 `SimpleToolShell`을 쓰지 않고 `<main class="container page-shell">`을 직접 구성하는 경우도 많으므로, 구현 단계에서 최근 계산기 페이지 1~2개를 다시 확인하고 실제 채택 패턴에 맞춘다.

---

## 9. `public/scripts/international-school-tuition-calculator-2026.js` 설계

```js
(function () {
  const dataEl = document.getElementById("ist-data");
  if (!dataEl) return;
  const { schools, defaultExchangeRate } = JSON.parse(dataEl.textContent);

  const els = {
    region: document.getElementById("ist-select-region"),
    school: document.getElementById("ist-select-school"),
    grade: document.getElementById("ist-select-grade"),
    boardingToggle: document.getElementById("ist-toggle-boarding"),
    boardingRow: document.querySelector(".ist-toggle-row"),
    children: document.getElementById("ist-input-children"),
    income: document.getElementById("ist-input-income"),
    fxRate: document.getElementById("ist-input-fxrate"),
    years: document.getElementById("ist-input-years"),
    kpiAnnual: document.getElementById("ist-kpi-annual"),
    kpiMonthly: document.getElementById("ist-kpi-monthly"),
    kpiRatio: document.getElementById("ist-kpi-ratio"),
    kpiTotalYears: document.getElementById("ist-kpi-total-years"),
    firstYearTotal: document.getElementById("ist-first-year-total"),
    firstYearNote: document.getElementById("ist-first-year-note"),
    sourceLink: document.getElementById("ist-source-link"),
    sourceDate: document.getElementById("ist-source-date"),
    dataWarning: document.getElementById("ist-data-warning"),
    multiChildNote: document.getElementById("ist-multichild-note"),
  };

  function fmtKrw(n) {
    if (n >= 100_000_000) return (n / 100_000_000).toFixed(2) + "억원";
    if (n >= 10_000) return Math.round(n / 10_000).toLocaleString("ko-KR") + "만원";
    return n.toLocaleString("ko-KR") + "원";
  }

  function populateSchools() {
    const region = els.region.value;
    const filtered = schools.filter((s) => s.region === region);
    els.school.innerHTML = filtered.map((s) => `<option value="${s.id}">${s.name}</option>`).join("");
    populateGrades();
  }

  function currentSchool() {
    return schools.find((s) => s.id === els.school.value);
  }

  function populateGrades() {
    const school = currentSchool();
    if (!school) return;
    els.grade.innerHTML = school.tuitionTiers
      .map((t) => `<option value="${t.tierKey}">${t.tierLabel}</option>`)
      .join("");

    els.boardingRow.classList.toggle("is-hidden", !school.boardingAvailable);
    if (!school.boardingAvailable) els.boardingToggle.checked = false;

    syncYearsDefault();
    calc();
  }

  function currentTier() {
    const school = currentSchool();
    if (!school) return null;
    return school.tuitionTiers.find((t) => t.tierKey === els.grade.value) ?? school.tuitionTiers[0];
  }

  function syncYearsDefault() {
    const tier = currentTier();
    if (tier) els.years.value = tier.suggestedYears;
  }

  function calc() {
    const school = currentSchool();
    const tier = currentTier();
    if (!school || !tier) return;

    const fxRate = parseFloat(els.fxRate.value) || defaultExchangeRate;
    const children = parseInt(els.children.value, 10) || 1;
    const incomeManwon = parseFloat(els.income.value) || 0;
    const years = parseInt(els.years.value, 10) || tier.suggestedYears;
    const boarding = els.boardingToggle.checked;

    const boardingKrw = boarding ? (tier.boardingSurchargeKrw || 0) : 0;
    const boardingUsd = boarding ? (tier.boardingSurchargeUsd || 0) : 0;

    const annualKrw = Math.round(tier.krwPortion + tier.usdPortion * fxRate + boardingKrw + boardingUsd * fxRate);
    const monthlyKrw = Math.round(annualKrw / 12);
    const firstYearTotalKrw = annualKrw + school.applicationFeeKrw + school.firstYearExtraKrw;
    const allChildrenKrw = annualKrw * children;
    const incomeRatio = incomeManwon > 0 ? (((annualKrw / 10000) / incomeManwon) * 100).toFixed(1) : null;
    const totalOverYearsKrw = annualKrw * years;

    els.kpiAnnual.textContent = fmtKrw(annualKrw) + (children > 1 ? ` (자녀 ${children}명: ${fmtKrw(allChildrenKrw)})` : "");
    els.kpiMonthly.textContent = fmtKrw(monthlyKrw);
    els.kpiRatio.textContent = incomeRatio !== null ? `${incomeRatio}%` : "소득 입력 시 표시";
    els.kpiTotalYears.textContent = `${years}년간 ${fmtKrw(totalOverYearsKrw)} (학비 인상 미반영)`;

    els.firstYearTotal.textContent = fmtKrw(firstYearTotalKrw);
    els.firstYearNote.textContent = school.firstYearExtraNote;

    els.sourceLink.href = school.sourceUrl;
    els.sourceDate.textContent = `(${school.asOfDate} 확인)`;

    if (school.dataNote) {
      els.dataWarning.textContent = "⚠ " + school.dataNote;
      els.dataWarning.classList.remove("is-hidden");
    } else {
      els.dataWarning.classList.add("is-hidden");
    }

    els.multiChildNote.textContent = "다자녀 안내: " + school.multiChildNote;
  }

  els.region.addEventListener("change", populateSchools);
  els.school.addEventListener("change", populateGrades);
  [els.grade, els.boardingToggle, els.children, els.income, els.fxRate, els.years].forEach((el) => {
    el.addEventListener("input", calc);
  });

  // 미니 비교 테이블 탭
  const miniTabs = document.getElementById("istMiniCompareTabs");
  if (miniTabs) {
    miniTabs.addEventListener("click", (event) => {
      const btn = event.target.closest("[data-region-tab]");
      if (!btn) return;
      const region = btn.getAttribute("data-region-tab");
      miniTabs.querySelectorAll(".ist-tab-btn").forEach((b) => b.classList.toggle("is-active", b === btn));
      document.querySelectorAll("[data-region-row]").forEach((row) => {
        row.classList.toggle("is-hidden", row.getAttribute("data-region-row") !== region);
      });
    });
  }

  populateSchools();
})();
```

**URL 파라미터 상태 보존**: `CONTENT_GUIDE.md` 4-D 원칙에 따라 구현 단계에서 `url-state.js` 공용 유틸을 사용해 `region`/`school`/`grade`/`children`/`income`/`fxRate`/`years`/`boarding` 값을 URL 쿼리에 반영 — 이 설계 문서는 계산 로직에 집중하고, URL 직렬화는 기존 유틸 패턴을 그대로 재사용한다.

---

## 10. tools.ts 등록

```ts
{
  slug: "international-school-tuition-calculator-2026",
  title: "국제학교 학비 계산기 2026 | 연간 비용 바로 계산",
  description: "지역·학교·학년·자녀 수 입력하면 국제학교 연간 학비와 월 부담액, 재학 기간 총비용까지 바로 계산. 제주·서울·송도 7개교 데이터 포함.",
  order: 0,
  eyebrow: "국제학교 학비",
  category: "parenting", // tools.ts에서 diaper-cost·formula-cost 등 육아 계산기 8개+가 이미 쓰는 확립된 카테고리 — 신규 카테고리 만들지 않음
  badges: ["신규"],
  previewStats: [
    { label: "제주 4개교", value: "학비 비교" },
    { label: "서울·송도 3개교", value: "학비 비교" },
  ],
},
```

> **참고**: `tools.ts`의 `category`는 `reports.ts`/`index.astro`의 `HomeReportCategory`와 다른 별도 문자열 필드다. `tools.ts` 전체를 grep한 결과 `parenting`이 육아 관련 계산기(기저귀·분유 비용 등)에 이미 일관되게 쓰이고 있어 그대로 재사용한다 — `"육아·출산"`, `"육아·양육"` 같은 한글 변형도 일부 남아있지만(레거시), 신규 페이지는 `parenting`으로 통일한다.

---

## 11. app.scss import

```scss
@use 'scss/pages/international-school-tuition-calculator-2026';
```

---

## 12. sitemap.xml

```xml
<url>
  <loc>https://bigyocalc.com/tools/international-school-tuition-calculator-2026/</loc>
  <lastmod>2026-07-08</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
```

---

## 13. 내부 CTA 전체 목록

| 위치 | 문구 | href |
|---|---|---|
| SeoContent related | 국내 국제학교 총정리 | `/reports/international-school-overview-2026/` |
| SeoContent related | 제주 국제학교 4곳 비교 | `/reports/jeju-international-school-comparison-2026/` |
| SeoContent related | 서울·경기 국제학교 비교 | `/reports/seoul-international-school-comparison-2026/` |
| SeoContent related | 국제학교 vs 외국인학교 차이 | `/reports/international-school-vs-foreign-school-2026/` |

---

## 14. 데이터 정확성 / QA 포인트

- [ ] **구현 직전 재검증**: 이 문서의 학비 수치는 2026-07-08 웹검색 기준 — 실제 구현 시점에 각 학교 공식 페이지에서 재확인 (특히 Chadwick은 2026년 1월 확정 요율 공개 예정이라고 명시되어 있어 구현 시점에 따라 수치가 바뀌어 있을 수 있음)
- [ ] `isEstimatedSplit: true`(NLCS)·`dataNote` 있는 학교(NLCS, Branksome, KIS Jeju, SJA, SFS)는 결과 화면에 경고 배지가 실제로 노출되는지 확인
- [ ] 지역 변경 시 학교 select, 학교 변경 시 학년 select가 올바르게 다시 채워지는지 확인 (dependent select 3단 체인)
- [ ] 기숙 토글이 `boardingAvailable: false`인 학교(Chadwick, SFS, Dulwich, SJA)에서 숨겨지는지 확인
- [ ] 자녀 2명 이상 선택 시 "할인 미반영" 문구가 KPI 카드 옆에 항상 같이 보이는지 확인 (할인 적용된 것으로 오인되지 않게)
- [ ] 환율 입력값을 극단으로 바꿔봤을 때(예: 1,000원 vs 2,000원) 연간 총비용이 합리적으로 변하는지 확인
- [ ] 소득 미입력 시 "소득 대비 비율" 카드가 오류 없이 "소득 입력 시 표시"로 안전하게 처리되는지 확인
- [ ] `CONTENT_GUIDE.md` 기준 SeoContent intro 4단락·600자 이상, FAQ 6개 충족 확인
- [ ] `npm run build` 통과, 라우트 존재 확인
- [ ] 모바일에서 입력 필드 8개가 세로로 자연스럽게 쌓이는지, 미니 비교 테이블이 가로 스크롤되는지 확인

---

## 15. 향후 갱신 계획

학비는 학교별로 매년(보통 1~3월) 갱신 발표된다. 분기~반기 단위로 `IST_SCHOOLS`의 수치·`asOfDate`를 재확인해 갱신하고, 사이트맵 `lastmod`도 함께 업데이트한다. 계획서에서 명시한 확장 후보 학교(Dwight School Seoul, YISS, KIS Pangyo, GSIS, SIS)는 이 데이터 구조에 동일한 `InternationalSchoolProfile` 형태로 추가하면 되므로 스키마 변경 없이 확장 가능하다.
