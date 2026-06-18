# 자동차 보험료 계산기 + 보험사 비교 설계 문서

> 기획 원본: `docs/plan/202606/car-insurance-premium-plan.md`  
> 작성일: 2026-06-18  
> 레이아웃: `SimpleToolShell`  
> 슬러그: `car-insurance-premium`  
> prefix: `cip-`

---

## 1. 파일 구조

```
src/data/carInsurancePremium.ts
src/pages/tools/car-insurance-premium.astro
public/scripts/car-insurance-premium.js
src/styles/scss/pages/_car-insurance-premium.scss
```

등록 위치:
- `src/data/tools.ts` — order: 70.4 (자동차 카테고리 마지막)
- `public/sitemap.xml`

---

## 2. 데이터 파일 (`src/data/carInsurancePremium.ts`)

```ts
// 기본 보험료 추정 계수 (실제 보험사 공시 기반 근사값)
// 기준: 차량가 3,000만원, 만 35세, 무사고, 자차 포함, 부부 한정
export const CIP_BASE_PREMIUM = 850000; // 연 85만원 기준

// 연령별 보정 계수
export const CIP_AGE_FACTOR: Record<string, number> = {
  "20-24": 2.20,
  "25-29": 1.55,
  "30-34": 1.20,
  "35-39": 1.00,
  "40-49": 0.92,
  "50-59": 0.95,
  "60+":   1.10,
};

// 경력별 보정
export const CIP_CAREER_FACTOR: Record<string, number> = {
  "0-1":  1.40,
  "2-3":  1.20,
  "4-5":  1.10,
  "6-9":  1.00,
  "10+":  0.93,
};

// 사고이력 할증
export const CIP_ACCIDENT_FACTOR: Record<string, number> = {
  none: 1.00,
  one:  1.30,
  two:  1.65,
};

// 차량가격 보정 (자차 보험료 연동)
export const CIP_PRICE_FACTOR: Record<string, number> = {
  "1000": 0.72,
  "2000": 0.88,
  "3000": 1.00,
  "4000": 1.14,
  "5000": 1.28,
  "6000": 1.42,
  "8000": 1.60,
};

// 차량 연식 보정 (자차 보험료)
export const CIP_AGE_CAR_FACTOR: Record<string, number> = {
  "new":    1.15, // 신차
  "1-3":    1.00,
  "4-6":    0.87,
  "7-10":   0.72,
  "11+":    0.60,
};

// 운전자 범위 할증/할인
export const CIP_DRIVER_FACTOR: Record<string, number> = {
  self:   0.88,
  couple: 1.00,
  family: 1.15,
  anyone: 1.35,
};

// 담보 범위
export const CIP_COVERAGE_FACTOR: Record<string, number> = {
  basic:  0.55, // 대인+대물만
  full:   1.00, // 자차 포함
};

// 할인 항목 정의
export const CIP_DISCOUNTS = [
  {
    id: "blackbox",
    label: "블랙박스 장착",
    icon: "📷",
    rate: 0.05,
    desc: "전·후방 블랙박스 장착 시 (대부분 보험사 제공)",
    category: "device",
  },
  {
    id: "mileage_low",
    label: "연간 주행거리 5,000km 이하",
    icon: "🚗",
    rate: 0.30,
    desc: "마일리지 특약 — 연 5,000km 이하 시 최대 30% 할인",
    category: "mileage",
  },
  {
    id: "mileage_mid",
    label: "연간 주행거리 10,000km 이하",
    icon: "🚗",
    rate: 0.15,
    desc: "마일리지 특약 — 연 10,000km 이하 시 최대 15% 할인",
    category: "mileage",
  },
  {
    id: "night_limit",
    label: "심야 운전 제한 특약",
    icon: "🌙",
    rate: 0.05,
    desc: "자정~새벽 5시 미운전 서약 시 (일부 보험사)",
    category: "habit",
  },
  {
    id: "public_transit",
    label: "대중교통 이용자",
    icon: "🚇",
    rate: 0.07,
    desc: "대중교통 정기권 소지자 할인 (일부 보험사)",
    category: "habit",
  },
  {
    id: "direct",
    label: "다이렉트(인터넷) 가입",
    icon: "💻",
    rate: 0.15,
    desc: "설계사 수수료 절감분 반영, 대부분 다이렉트가 저렴",
    category: "contract",
  },
  {
    id: "long_term",
    label: "동일 보험사 3년 이상 유지",
    icon: "⭐",
    rate: 0.04,
    desc: "우수 회원 할인 (일부 보험사)",
    category: "contract",
  },
  {
    id: "child_infant",
    label: "영유아 자녀 있음 (만 6세 이하)",
    icon: "👶",
    rate: 0.06,
    desc: "영유아 자녀 보유 시 할인 (삼성화재·DB손보·KB손보 등)",
    category: "family",
    highlight: true,
  },
  {
    id: "child_multi",
    label: "자녀 2명 이상 (다자녀)",
    icon: "👨‍👩‍👧‍👦",
    rate: 0.08,
    desc: "다자녀 가구 할인 — 자녀 수에 따라 추가 할인",
    category: "family",
    highlight: true,
  },
  {
    id: "birth",
    label: "당해연도 출산",
    icon: "🍼",
    rate: 0.05,
    desc: "출산 축하 할인 (일부 보험사, 가입 시 증빙 필요)",
    category: "family",
    highlight: true,
  },
  {
    id: "pregnant",
    label: "임산부",
    icon: "🤰",
    rate: 0.04,
    desc: "임신 중 가입 시 할인 (일부 보험사)",
    category: "family",
    highlight: true,
  },
  {
    id: "safety_device",
    label: "첨단 안전장치 (AEB·차선이탈경고 등)",
    icon: "🛡️",
    rate: 0.03,
    desc: "자동긴급제동·차선이탈경고·전방충돌경고 등 장착 차량",
    category: "device",
  },
] as const;

// 보험사 비교 데이터
export const CIP_INSURERS = [
  {
    name: "삼성화재",
    logo: "삼성",
    share: 27,
    directUrl: "https://direct.samsungfire.com",
    strengths: ["긴급출동 전국망 1위", "브랜드 신뢰도 최고", "합리적 보상 처리"],
    bestFor: ["긴급출동 중요한 분", "장거리 운전자", "보상 안정성 우선"],
    childDiscount: true,
    mileageDiscount: true,
    directDiscount: true,
    highlight: false,
  },
  {
    name: "DB손해보험",
    logo: "DB",
    share: 20,
    directUrl: "https://www.directdb.co.kr",
    strengths: ["다이렉트 가격 경쟁력", "앱 편의성 우수", "보상 처리 신속"],
    bestFor: ["보험료 절약 우선", "앱으로 편하게 관리", "다이렉트 가입자"],
    childDiscount: true,
    mileageDiscount: true,
    directDiscount: true,
    highlight: false,
  },
  {
    name: "KB손해보험",
    logo: "KB",
    share: 13,
    directUrl: "https://direct.kbinsure.co.kr",
    strengths: ["자녀·다자녀 할인 체계적", "KB금융그룹 연계", "가족 특화 상품"],
    bestFor: ["영유아·자녀 있는 가족", "다자녀 가구", "KB금융 고객"],
    childDiscount: true,
    mileageDiscount: true,
    directDiscount: true,
    highlight: true, // 자녀 있을 때 강조
  },
  {
    name: "현대해상",
    logo: "현대",
    share: 16,
    directUrl: "https://direct.hi.co.kr",
    strengths: ["Hi-Car 앱 마일리지 정확도 높음", "운전자 특화 분석", "중간 가격대"],
    bestFor: ["마일리지 할인 극대화", "Hi-Car 앱 활용", "운전 습관 분석 원하는 분"],
    childDiscount: true,
    mileageDiscount: true,
    directDiscount: true,
    highlight: false,
  },
  {
    name: "메리츠화재",
    logo: "메리츠",
    share: 11,
    directUrl: "https://direct.meritzfire.com",
    strengths: ["보상 처리 속도 업계 최상위", "다이렉트 가격 저렴", "고객 만족도 높음"],
    bestFor: ["사고 시 빠른 보상 원하는 분", "보험료 저렴하게 원하는 분"],
    childDiscount: true,
    mileageDiscount: true,
    directDiscount: true,
    highlight: false,
  },
  {
    name: "한화손해보험",
    logo: "한화",
    share: 7,
    directUrl: "https://direct.hwgi.com",
    strengths: ["보험료 저렴한 편", "중소형차 유리", "한화그룹 연계"],
    bestFor: ["중소형·경차 운전자", "보험료 최저 우선"],
    childDiscount: false,
    mileageDiscount: true,
    directDiscount: true,
    highlight: false,
  },
  {
    name: "롯데손해보험",
    logo: "롯데",
    share: 4,
    directUrl: "https://direct.lottegfg.com",
    strengths: ["롯데포인트 적립", "롯데카드 할인 연계", "롯데그룹 멤버십"],
    bestFor: ["롯데카드·롯데포인트 활용자", "롯데 멤버십 고객"],
    childDiscount: false,
    mileageDiscount: true,
    directDiscount: true,
    highlight: false,
  },
];

export const CIP_META = {
  slug: "car-insurance-premium",
  title: "자동차 보험료 계산기 2026 | 할인 항목 체크 + 보험사 비교",
  description: "차량·나이·사고이력 입력하면 예상 보험료 즉시 계산. 블랙박스·마일리지·영유아 자녀 할인까지 놓친 항목 자동 체크. 주요 보험사 특징 비교 포함.",
  updatedAt: "2026-06-18",
  caution: "실제 보험료는 차종·지역·보험사 심사 기준에 따라 크게 다를 수 있습니다. 정확한 견적은 보험사 다이렉트에서 확인하세요.",
};

export const CIP_DEFAULTS = {
  carPrice: 3000,      // 만원
  carAge: "1-3",       // 연식
  driverAge: 35,       // 운전자 나이
  career: "10+",       // 운전 경력
  accident: "none",    // 사고이력
  driverScope: "couple", // 운전자 범위
  coverage: "full",    // 담보 범위
};

export const CIP_FAQ = [
  {
    question: "자동차 보험료가 갱신 때마다 오르는 이유는?",
    answer: "무사고라도 물가 상승·보험사 손해율·보험료 기준 변경으로 인상될 수 있습니다. 반면 무사고 경력이 쌓이면 할인폭도 커집니다. 매년 다이렉트 비교 견적을 받아보는 것이 절약의 기본입니다.",
  },
  {
    question: "아기(영유아)가 있으면 자동차 보험이 정말 저렴해지나요?",
    answer: "삼성화재, DB손보, KB손보 등 주요 보험사에서 만 6세 이하 자녀 보유 시 5~7% 할인을 제공합니다. 다자녀(2명 이상)라면 추가 7~10% 할인이 적용돼 합산 최대 15% 이상 절약 가능합니다. 가입 시 자녀 정보를 반드시 입력하세요.",
  },
  {
    question: "마일리지 할인을 받으려면 어떻게 해야 하나요?",
    answer: "가입 시 마일리지 특약을 선택하고, 보험사 앱에 OBD 단말기 또는 차량 사진으로 주행거리를 인증합니다. 연 5,000km 이하 시 최대 30%, 10,000km 이하 시 약 15% 할인됩니다. 현대해상 Hi-Car 앱의 마일리지 인증 정확도가 높다는 평이 많습니다.",
  },
  {
    question: "다이렉트와 설계사 통해 가입할 때 보험료 차이가 얼마나 나나요?",
    answer: "동일 조건 기준 다이렉트가 10~20% 저렴한 경우가 많습니다. 설계사 수수료가 보험료에 포함되기 때문입니다. 단, 사고 시 설계사가 보상 과정을 도와주는 장점이 있으므로 첫 가입자나 사고 경험이 없는 분은 고려해볼 수 있습니다.",
  },
  {
    question: "블랙박스 할인은 모든 보험사에서 받을 수 있나요?",
    answer: "대부분의 주요 보험사(삼성화재·DB손보·KB손보·현대해상·메리츠 등)에서 전·후방 블랙박스 장착 시 3~5% 할인을 적용합니다. 가입 시 블랙박스 보유 여부를 체크하면 자동 반영됩니다. 블랙박스가 없다면 5~10만원짜리 제품 하나로 매년 수만원을 절약할 수 있습니다.",
  },
];
```

---

## 3. 화면 구성 (`car-insurance-premium.astro`)

### Aside (입력)

```
[섹션1] 차량 정보
  - 차량 가격대 (select: 1,000만원 단위)
  - 차량 연식 (select: 신차/1-3년/4-6년/7-10년/11년+)
  - 담보 범위 (select: 대인+대물 / 자차 포함)

[섹션2] 운전자 정보
  - 운전자 나이 (number)
  - 운전 경력 (select)
  - 사고 이력 (select: 무사고/1건/2건이상)
  - 운전자 범위 (select: 본인/부부/가족/누구나)

[섹션3] 할인 항목 체크 (자녀 섹션 상단 배치)
  [가족·자녀 할인] 👶 — highlight 배경
    □ 영유아 자녀 있음 (만 6세 이하)
    □ 다자녀 (2명 이상)
    □ 당해연도 출산
    □ 임산부
  [운전 습관·환경]
    □ 블랙박스 장착
    □ 연 5,000km 이하 (마일리지)
    □ 연 10,000km 이하 (마일리지)
    □ 심야 운전 제한 특약
    □ 대중교통 이용자
    □ 첨단 안전장치 장착
  [계약 방식]
    □ 다이렉트(인터넷) 가입
    □ 동일 보험사 3년 이상 유지
```

### 결과 영역

```
[KPI 3개]
  할인 전 예상 보험료 | 적용 가능 할인율 | 할인 후 예상 보험료

[절약 금액 강조 배너]
  "할인 항목 적용 시 연 XX만원 절약 가능"

[적용 할인 항목 리스트]
  ✅ 블랙박스 (-5%) = -XX,XXX원
  ✅ 영유아 자녀 (-6%) = -XX,XXX원
  ...

[보험사 추천 TOP3]
  내 조건 기반으로 3개 자동 강조
  - 자녀 있으면 KB손보 첫 번째
  - 마일리지 낮으면 현대해상 포함

[전체 보험사 비교표]
  가로 스크롤 테이블 (모바일 대응)
  | 보험사 | 점유율 | 자녀할인 | 마일리지 | 다이렉트 | 강점 |
```

---

## 4. 계산 로직 (`public/scripts/car-insurance-premium.js`)

```js
function estimatePremium(s) {
  let base = CIP_BASE_PREMIUM;

  // 차량가 보정
  const priceKey = Object.keys(CIP_PRICE_FACTOR)
    .sort((a, b) => +b - +a)
    .find(k => s.carPrice >= +k) || "1000";
  base *= CIP_PRICE_FACTOR[priceKey];

  // 연식 보정
  base *= CIP_AGE_CAR_FACTOR[s.carAge];

  // 담보 보정
  base *= CIP_COVERAGE_FACTOR[s.coverage];

  // 운전자 나이 보정
  const ageBand = getAgeBand(s.driverAge); // "20-24" 등
  base *= CIP_AGE_FACTOR[ageBand];

  // 경력 보정
  base *= CIP_CAREER_FACTOR[s.career];

  // 사고이력 할증
  base *= CIP_ACCIDENT_FACTOR[s.accident];

  // 운전자 범위
  base *= CIP_DRIVER_FACTOR[s.driverScope];

  return Math.round(base / 10000) * 10000; // 만원 단위 반올림
}

function calcDiscounts(basePremium, checkedIds, discounts) {
  // 마일리지는 low/mid 중 하나만 적용 (높은 쪽 우선)
  let totalRate = 0;
  const applied = [];
  discounts.forEach(d => {
    if (!checkedIds.includes(d.id)) return;
    // mileage 중복 방지
    if (d.id === 'mileage_mid' && checkedIds.includes('mileage_low')) return;
    totalRate += d.rate;
    applied.push({ ...d, amount: Math.round(basePremium * d.rate) });
  });
  const discountTotal = Math.round(basePremium * Math.min(totalRate, 0.65)); // 최대 65% 할인 캡
  return { applied, discountTotal, finalPremium: basePremium - discountTotal };
}

// 보험사 추천 로직
function recommendInsurers(checkedIds, hasChild) {
  return CIP_INSURERS.map(ins => {
    let score = ins.share; // 기본 점유율 기반
    if (hasChild && ins.childDiscount) score += 20;
    if (checkedIds.includes('mileage_low') && ins.mileageDiscount) score += 10;
    if (checkedIds.includes('direct') && ins.directDiscount) score += 5;
    return { ...ins, score };
  }).sort((a, b) => b.score - a.score).slice(0, 3);
}
```

---

## 5. SCSS (`_car-insurance-premium.scss`)

prefix: `cip-`

### 주요 클래스

```scss
.cip-page {
  .cip-section              // 입력 섹션
  .cip-field                // 입력 필드
  .cip-input-row            // input + 단위
  .cip-select               // select 스타일

  // 할인 체크리스트
  .cip-discount-group       // 카테고리 묶음
  .cip-discount-group--family // 👶 가족 섹션 (연두 배경 강조)
  .cip-discount-item        // 체크박스 행
  .cip-discount-item__rate  // 할인율 배지
  .cip-discount-item--highlight // 자녀 항목 강조

  // 결과
  .cip-kpi-grid             // KPI 3열
  .cip-kpi-card
  .cip-saving-banner        // 절약 금액 강조 (녹색)
  .cip-applied-list         // 적용된 할인 항목 리스트
  .cip-applied-item

  // 보험사 추천
  .cip-recommend-grid       // Top 3 추천 카드 3열
  .cip-recommend-card       // 보험사 추천 카드
  .cip-recommend-card--top  // 1위 강조
  .cip-insurer-table-wrap   // 전체 비교표 (overflow-x: auto)
  .cip-insurer-table
}
```

---

## 6. URL 상태 동기화

```
?cp=3000&ca=1-3&cov=full&da=35&dc=10%2B&acc=none&ds=couple&disc=blackbox,child_infant,direct
```

| 파라미터 | 의미 |
|---------|------|
| cp | carPrice |
| ca | carAge |
| cov | coverage |
| da | driverAge |
| dc | career |
| acc | accident |
| ds | driverScope |
| disc | 체크된 할인 항목 (콤마 구분) |

---

## 7. tools.ts 등록

```ts
{
  slug: "car-insurance-premium",
  title: "자동차 보험료 계산기",
  description: "예상 보험료 계산 + 블랙박스·마일리지·자녀 할인 체크 + 보험사 비교",
  category: "자동차",
  order: 70.4,
  badges: ["NEW", "할인체크"],
  previewStats: [
    { label: "최대 할인", value: "최대 65%" },
    { label: "비교 보험사", value: "7개사" },
  ],
},
```

---

## 8. QA 포인트

- [ ] 마일리지 5,000 + 10,000 동시 체크 시 높은 쪽만 적용되는지
- [ ] 할인 총합 65% 캡 적용 확인
- [ ] 자녀 체크 시 보험사 추천 순서 변경 확인 (KB손보 상위)
- [ ] 담보 "대인+대물만" 선택 시 보험료 대폭 감소 확인
- [ ] 사고 2건 이상 시 보험료 할증 확인
- [ ] 모바일 보험사 비교표 가로 스크롤 동작 확인
- [ ] URL 파라미터 복원 시 체크박스 상태 복원 확인
- [ ] "다이렉트" 체크 시 직접 가입 링크 안내 문구 표시
