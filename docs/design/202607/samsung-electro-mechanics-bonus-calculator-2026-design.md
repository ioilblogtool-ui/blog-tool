# 삼성전기 성과급 계산기 2026 — 설계 문서

> 기획 원본: `docs/plan/202607/samsung-electro-mechanics-bonus-calculator-2026-plan.md`

---

## 1. 페이지 기본 정보

| 항목 | 값 |
|------|----|
| 슬러그 | `samsung-electro-mechanics-bonus-calculator-2026` |
| URL | `/tools/samsung-electro-mechanics-bonus-calculator-2026/` |
| 레이아웃 | `SimpleToolShell.astro` |
| JS prefix | `semb-` |
| SCSS prefix | `.semb-` |
| SEO 타이틀 | `삼성전기 성과급 계산기 2026 \| 영업이익 10% 적용 시 1인당 얼마` |
| SEO 디스크립션 | `영업이익 규모와 재원 비율을 입력하면 삼성전기 성과급 1인당 예상 수령액을 바로 계산합니다. 직급별 배수 시뮬레이션, 세후 실수령액, SK하이닉스·삼성전자 DS 비교 포함.` |

---

## 2. 데이터 파일 설계

**파일**: `src/data/samsungElectroMechanicsBonus2026.ts`

```ts
export type SembScenarioRow = {
  operatingProfitLabel: string;  // "1.0조"
  operatingProfitHundredMillion: number;  // 10000
  perPersonAt10pct: number;      // 만원 단위
  perPersonAt12pct: number;
};

export type SembCompetitor = {
  company: string;
  method: string;
  rateLabel: string;
  badge: "공식" | "보도 기반" | "추정";
  note: string;
};

export type SembGradeMultiplier = {
  grade: string;   // "사원(CL1)"
  key: string;     // "cl1"
  multiplier: number;
};

export const SEMB_META = {
  seoTitle: "삼성전기 성과급 계산기 2026 | 영업이익 10% 적용 시 1인당 얼마",
  seoDescription: "영업이익 규모와 재원 비율을 입력하면 삼성전기 성과급 1인당 예상 수령액을 바로 계산합니다. 직급별 배수 시뮬레이션, 세후 실수령액, SK하이닉스·삼성전자 DS 비교 포함.",
  updatedAt: "2026-07-01",
  notice: "삼성전기 성과급 방식 전환은 현재 임직원 투표·의견수렴 단계입니다. 이 페이지의 수치는 보도·추정 기반이며 최종 지급액과 다를 수 있습니다.",
  defaultOperatingProfit: 15000,   // 억원 (1.5조)
  defaultRate: 10,                  // %
  defaultHeadcount: 12000,          // 명
  defaultSalary: 6000,              // 만원
  effectiveTaxRate: 0.33,           // 33% 고정
};

export const SEMB_GRADE_MULTIPLIERS: SembGradeMultiplier[] = [
  { grade: "사원 (CL1)", key: "cl1", multiplier: 0.85 },
  { grade: "대리 (CL2)", key: "cl2", multiplier: 1.00 },
  { grade: "과장 (CL3)", key: "cl3", multiplier: 1.20 },
  { grade: "차장 (CL4)", key: "cl4", multiplier: 1.45 },
  { grade: "부장 (CL4+)", key: "cl4p", multiplier: 1.70 },
];

export const SEMB_SCENARIOS: SembScenarioRow[] = [
  { operatingProfitLabel: "1.0조", operatingProfitHundredMillion: 10000, perPersonAt10pct: 833, perPersonAt12pct: 1000 },
  { operatingProfitLabel: "1.2조", operatingProfitHundredMillion: 12000, perPersonAt10pct: 1000, perPersonAt12pct: 1200 },
  { operatingProfitLabel: "1.5조", operatingProfitHundredMillion: 15000, perPersonAt10pct: 1250, perPersonAt12pct: 1500 },
  { operatingProfitLabel: "1.8조", operatingProfitHundredMillion: 18000, perPersonAt10pct: 1500, perPersonAt12pct: 1800 },
  { operatingProfitLabel: "2.0조", operatingProfitHundredMillion: 20000, perPersonAt10pct: 1667, perPersonAt12pct: 2000 },
];

export const SEMB_COMPETITORS: SembCompetitor[] = [
  { company: "SK하이닉스", method: "PS — 영업이익 N%", rateLabel: "10%", badge: "공식", note: "연 2회 지급, 영업이익 10% 재원" },
  { company: "삼성전자 DS", method: "특별경영성과급 N%", rateLabel: "10.5%", badge: "보도 기반", note: "2026년 보도 기준 추정" },
  { company: "삼성전기", method: "EVA → 영업이익 N% 전환 투표 중", rateLabel: "10% (안) / 노조 12% 요구", badge: "추정", note: "2027년 1월 지급분부터 적용 전망" },
  { company: "LG이노텍", method: "사업부 실적 연동", rateLabel: "비공개", badge: "추정", note: "공식 비공개" },
];

export const SEMB_FAQ = [
  { q: "삼성전기 성과급은 언제 지급되나요?", a: "기존 OPI는 연 2회(1월, 7월) 지급이었습니다. 새 방식 전환 시 지급 일정이 변경될 수 있으며, 현재 투표 단계에서는 2027년 1월 지급분부터 적용될 전망입니다." },
  { q: "영업이익 10%와 12%는 무슨 차이인가요?", a: "10%는 회사(노사협의회) 제안안이고, 12%는 노동조합 요구안입니다. 최종 합의에 따라 달라집니다. 삼성전자 DS는 10.5%로 보도된 바 있습니다." },
  { q: "OPI와 PS는 어떻게 다른가요?", a: "OPI(Opportunity Profit Index)는 경제적 부가가치(EVA) 기반으로 산정하는 삼성 계열사 고유 방식입니다. PS(Profit Sharing)는 영업이익의 N%를 직접 성과급 재원으로 배분하는 방식으로, 산식이 더 직관적입니다." },
  { q: "세율 33%는 어디서 나온 건가요?", a: "성과급 합산 과세 구간에서 소득세 25%, 지방소득세 2.5%, 4대보험 기여금 근사치를 합산한 실효세율 추정치입니다. 실제 세율은 연간 소득 합계에 따라 달라집니다." },
  { q: "직급 배수는 공식 수치인가요?", a: "아닙니다. 업계 관행 및 제보 기반 추정치입니다. 실제 지급 배수는 사업부·평가등급·회사 정책에 따라 달라집니다." },
  { q: "임직원 1.2만 명 기준은 어디서 왔나요?", a: "삼성전기 공시 자료 기준 국내 임직원 수 추정치입니다. 사업부별 분리 계산 시 실제 수령액과 차이가 있을 수 있습니다." },
];

export const SEMB_SEO_INTRO = `삼성전기는 2026년 기존 EVA 기반 OPI(Opportunity Profit Index) 방식에서 영업이익의 N%를 성과급 재원으로 직접 활용하는 방식으로 전환을 논의 중입니다. 노사협의회가 제안한 영업이익 10% 안과 노동조합의 12% 요구안이 맞서는 가운데, 가결 시 2027년 1월 지급분부터 새 방식이 적용될 전망입니다.`;

export const SEMB_SEO_CRITERIA = [
  "영업이익 1.5조 기준, 재원 비율 10% 적용 시 총 재원 약 1,500억원",
  "임직원 약 1.2만 명 기준 1인당 평균 세전 약 1,250만원 추정",
  "세후 실수령액은 실효세율 33% 적용 시 약 838만원",
  "직급 배수 적용 시 차장급(CL4) 기준 약 1,215만원 세후 추정",
  "SK하이닉스(10%), 삼성전자 DS(10.5%) 대비 동일·유사 재원 비율 수준",
  "모든 수치는 보도·추정 기반이며 최종 지급액과 다를 수 있음",
];
```

---

## 3. tools.ts 등록

```ts
{
  slug: "samsung-electro-mechanics-bonus-calculator-2026",
  title: "삼성전기 성과급 계산기 2026",
  description: "영업이익 10% 안 적용 시 직급별 예상 수령액 계산",
  order: /* 기존 samsung-bonus 근처 */,
  badges: ["NEW", "삼성전기", "성과급"],
  previewStats: [
    { label: "영업이익 1.5조 기준", value: "1,250만원" },
    { label: "세후 추정", value: "838만원" },
  ],
}
```

---

## 4. 화면 구성 (섹션 순서)

```
[Hero]
  eyebrow: "삼성전기 성과급"
  title: "2026 삼성전기 성과급 계산기"
  description: "영업이익 N% 방식 전환 시 내가 받을 성과급을 바로 계산하세요."

[InfoNotice] — 투표/의견수렴 단계 안내, 추정값 고지

[계산기 입력 섹션]
  ┌─ 영업이익 슬라이더 (5,000~30,000억, 1,000 단위)
  ├─ 재원 비율 슬라이더 (8~15%, 0.5% 단위)  ← 10%/12% 모두 커버
  ├─ 임직원 수 입력 (명)
  ├─ 내 연봉 입력 (만원)
  └─ 직급 선택 (select: CL1~CL4+)

[결과 KPI 카드 3개]
  ① 성과급 총 재원 (억원)
  ② 1인 평균 세전 (만원)
  ③ 내 예상 세후 (만원)

[세부 결과 행]
  - 1인 평균 세후
  - 내 예상 세전
  - 연봉 대비 성과급 비율 (%)

[시나리오 비교표]
  영업이익 × 비율(10% / 12%) → 1인 평균 세전 매트릭스
  현재 입력값 행 하이라이트

[경쟁사 비교 카드]
  SK하이닉스 / 삼성전자 DS / 삼성전기 / LG이노텍 — 4개 카드

[성과급 방식 설명 섹션]
  EVA(OPI) vs 영업이익 N% 방식 차이 2단 레이아웃

[FAQ 아코디언]

[관련 계산기 링크]

[SeoContent]
```

---

## 5. 계산 로직 (JS)

```js
// 입력
const operatingProfit = parseInt(input.operatingProfit);  // 억원
const rate = parseFloat(input.rate) / 100;                // 0.10
const headcount = parseInt(input.headcount);
const salary = parseInt(input.salary);                    // 만원
const multiplier = parseFloat(selected.multiplier);

// 계산
const totalFund = Math.round(operatingProfit * rate);         // 억원
const perPersonPreTax = Math.round((totalFund * 10_000_000) / headcount / 10_000); // 만원
const perPersonAfterTax = Math.round(perPersonPreTax * (1 - TAX_RATE));
const myPreTax = Math.round(perPersonPreTax * multiplier);
const myAfterTax = Math.round(myPreTax * (1 - TAX_RATE));
const salaryRatio = ((myAfterTax / salary) * 100).toFixed(1);

// 표시
renderKpi({ totalFund, perPersonPreTax, myAfterTax });
renderDetail({ perPersonAfterTax, myPreTax, salaryRatio });
highlightScenarioRow(operatingProfit);
```

**상수**
```js
const TAX_RATE = 0.33;
const SCENARIO_HEADCOUNT = 12000;  // 시나리오 표 고정값 (별도 주석 표시)
```

---

## 6. 슬라이더 UX

- 영업이익 슬라이더: 5,000억 ~ 30,000억, step 1,000, 좌우 레이블 "5,000억 / 3조"
- 재원 비율 슬라이더: 8% ~ 15%, step 0.5
  - 10% 위치에 "회사안" 마커, 12% 위치에 "노조안" 마커 표시
- 슬라이더 변경 시 KPI 즉시 갱신 (debounce 없음)

---

## 7. 시나리오 테이블 하이라이트

- 슬라이더로 영업이익 변경 시 가장 가까운 시나리오 행 `.semb-scenario-row--active` 클래스 토글
- 현재 비율이 10%이면 `perPersonAt10pct` 열 강조, 12%이면 `perPersonAt12pct` 열 강조

---

## 8. SCSS 구조 (`_samsung-electro-mechanics-bonus-calculator-2026.scss`)

```scss
.semb-page {
  --semb-ink:         #14213d;
  --semb-muted:       #5d6b82;
  --semb-line:        rgba(20,33,61,0.12);
  --semb-soft:        #f5f7fb;
  --semb-primary:     #1a56db;
  --semb-primary-bg:  #eff4ff;
  --semb-primary-dk:  #1447bf;
  --semb-teal:        #0891b2;
  --semb-teal-bg:     #e0f2fe;
  --semb-green:       #059669;
  --semb-green-bg:    #d1fae5;
  --semb-amber:       #d97706;
  --semb-amber-bg:    #fef3c7;
}

// KPI 카드 3개
.semb-kpi-grid { ... }
.semb-kpi-card { ... }
  .semb-kpi-card--highlight { border-color: --semb-primary; background: --semb-primary-bg; }

// 슬라이더 래퍼
.semb-slider-group { ... }
.semb-slider-markers { display:flex; justify-content:space-between; }
.semb-slider-marker--company { color: --semb-primary; }
.semb-slider-marker--union   { color: --semb-amber; }

// 시나리오 테이블
.semb-scenario-table { ... }
.semb-scenario-row--active { background: --semb-primary-bg; font-weight:700; }
.semb-scenario-col--active { color: --semb-primary-dk; }

// 경쟁사 카드
.semb-competitor-grid { grid-template-columns: repeat(auto-fill, minmax(220px,1fr)); }
.semb-competitor-card { ... }
  .semb-competitor-card--self { border-color: --semb-primary; }  // 삼성전기 카드 강조

// 배지
.semb-badge--official { background: #ccfbf1; color: #0f766e; }
.semb-badge--ref      { background: #eff4ff; color: #1a56db; }
.semb-badge--estimate { background: #fef3c7; color: #b45309; }

// EVA vs N% 비교
.semb-method-compare { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
```

---

## 9. Astro 페이지 구조

```astro
---
import SimpleToolShell from "../../layouts/SimpleToolShell.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import {
  SEMB_META, SEMB_GRADE_MULTIPLIERS, SEMB_SCENARIOS,
  SEMB_COMPETITORS, SEMB_FAQ, SEMB_SEO_INTRO, SEMB_SEO_CRITERIA,
} from "../../data/samsungElectroMechanicsBonus2026";
---

<SimpleToolShell title={SEMB_META.seoTitle} ...>
  <InfoNotice ... />

  <!-- 계산기 입력 -->
  <section class="semb-calc-section">
    <!-- 슬라이더 + select -->
  </section>

  <!-- KPI 카드 -->
  <div class="semb-kpi-grid">...</div>

  <!-- 세부 결과 -->
  <div class="semb-detail-rows">...</div>

  <!-- 시나리오 표 -->
  <section class="semb-scenario-section">...</section>

  <!-- 경쟁사 비교 -->
  <section class="semb-competitor-section">...</section>

  <!-- EVA vs N% 방식 설명 -->
  <section class="semb-method-section">...</section>

  <!-- FAQ -->
  <section class="semb-faq-section">...</section>

  <SeoContent ... />

  <!-- JSON 데이터 주입 -->
  <script id="semb-data" type="application/json"
    set:html={JSON.stringify({
      scenarios: SEMB_SCENARIOS,
      gradeMultipliers: SEMB_GRADE_MULTIPLIERS,
      defaults: {
        operatingProfit: SEMB_META.defaultOperatingProfit,
        rate: SEMB_META.defaultRate,
        headcount: SEMB_META.defaultHeadcount,
        salary: SEMB_META.defaultSalary,
      },
      taxRate: SEMB_META.effectiveTaxRate,
    })}
  />
  <script src="/scripts/samsung-electro-mechanics-bonus-calculator-2026.js" defer />
</SimpleToolShell>
```

---

## 10. tools.ts 등록 위치

`src/data/tools.ts`에서 기존 `samsung-bonus` 항목 근처에 삽입.

```ts
{
  slug: "samsung-electro-mechanics-bonus-calculator-2026",
  title: "삼성전기 성과급 계산기 2026",
  description: "영업이익 10% 안 적용 시 직급별 예상 수령액 계산. SK하이닉스·삼성전자 DS 비교 포함.",
  order: /* 기존 순서 참고 */,
  badges: ["NEW", "삼성전기", "성과급"],
  previewStats: [
    { label: "1.5조 기준 1인 평균", value: "1,250만원" },
    { label: "세후 추정", value: "838만원" },
  ],
}
```

---

## 11. 등록 체크포인트

- [ ] `src/data/samsungElectroMechanicsBonus2026.ts` 생성
- [ ] `src/data/tools.ts` 등록
- [ ] `src/pages/tools/samsung-electro-mechanics-bonus-calculator-2026.astro` 생성
- [ ] `public/scripts/samsung-electro-mechanics-bonus-calculator-2026.js` 생성
- [ ] `src/styles/scss/pages/_samsung-electro-mechanics-bonus-calculator-2026.scss` 생성
- [ ] `src/styles/app.scss` import 추가
- [ ] `public/sitemap.xml` URL 추가
- [ ] `npm run build` 통과 확인

---

## 12. QA 포인트

- [ ] 슬라이더 극단값 (5,000억 / 3조) 에서 KPI 정상 표시
- [ ] 재원 비율 10% / 12% 이동 시 시나리오 열 하이라이트 전환
- [ ] 직급 변경 시 "내 예상 세후" 즉시 갱신
- [ ] 임직원 수 0 입력 시 NaN 방지
- [ ] 모바일 슬라이더 터치 조작 정상 동작
- [ ] 경쟁사 카드 배지 색상 (공식/보도 기반/추정) 정확
- [ ] InfoNotice "추정값" 고지 노출 확인
