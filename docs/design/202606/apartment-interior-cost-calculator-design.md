# 구축 아파트 인테리어 견적 계산기 — 설계 문서

> 작성일: 2026-06-19
> 콘텐츠 유형: `/tools/` 계산기
> 구현 기준: 평수 × 시공 항목 체크박스 → 최소/보통/고급 3구간 견적 즉시 출력

---

## 1. 문서 개요

- 구현 대상: `구축 아파트 인테리어 견적 계산기`
- slug: `apartment-interior-cost-calculator`
- URL: `/tools/apartment-interior-cost-calculator/`
- 카테고리: 부동산·주거
- 핵심 검색 의도: "24평 인테리어 비용", "구축 아파트 올수리 비용", "아파트 인테리어 견적 계산기", "32평 도배 마루 비용"
- 핵심 출력: 최소/보통/고급 3구간 총 견적 + 항목별 비용 분해표 + 평당 환산
- 핵심 CTA: 아파트 취득세 계산기, 서울 아파트 가격 리포트 내부링크

---

## 2. 구현 파일 구조

```text
src/
  data/
    apartmentInteriorCost.ts       ← 단가표, 평수계수, 항목 메타, FAQ, 관련링크
  pages/
    tools/
      apartment-interior-cost-calculator.astro

public/
  scripts/
    apartment-interior-cost-calculator.js

src/styles/scss/pages/
  _apartment-interior-cost-calculator.scss
```

추가 등록 필수:
- `src/data/tools.ts` — tools 배열에 항목 추가
- `src/styles/app.scss` — `@use 'scss/pages/apartment-interior-cost-calculator';`
- `public/sitemap.xml` — URL 추가

---

## 3. 레이아웃 방향

- `SimpleToolShell` 기반. 입력 패널(상단), 결과(하단) 순 배치.
- `resultFirst={false}` — 모바일: 입력 먼저.
- SCSS prefix: `aic-`

```astro
<SimpleToolShell
  calculatorId="apartment-interior-cost-calculator"
  pageClass="aic-page"
  resultFirst={false}
>
```

---

## 4. 데이터 모델

```ts
// src/data/apartmentInteriorCost.ts

export type InteriorGrade = 'min' | 'mid' | 'high';

export type InteriorItemKey =
  | 'sash'         // 샷시 교체
  | 'expansion'    // 베란다 확장
  | 'wallpaper'    // 도배
  | 'floor'        // 마루
  | 'bath_master'  // 욕실(안방)
  | 'bath_common'  // 욕실(공용)
  | 'kitchen'      // 주방
  | 'lighting'     // 조명
  | 'door'         // 중문
  | 'entrance'     // 현관 타일

export type WallpaperType = 'hap' | 'silk';           // 합지 / 실크
export type FloorType = 'strong' | 'hard' | 'wood';  // 강화마루 / 강마루 / 원목
export type KitchenType = 'sink' | 'sink_tile' | 'sink_tile_builtin'; // 싱크대 / +타일 / +빌트인

export type ItemSubOption = WallpaperType | FloorType | KitchenType | null;

export interface InteriorItemMeta {
  key: InteriorItemKey;
  label: string;
  icon: string;           // 이모지 or 텍스트 아이콘
  hasSubOption: boolean;
  subOptions?: { value: string; label: string }[];
  defaultSubOption?: string;
}

// 24평 기준 단가 (원)
export interface UnitPrice {
  min: number;
  mid: number;
  high: number;
}

export const UNIT_PRICES: Record<InteriorItemKey, Record<string, UnitPrice>> = {
  sash: {
    default: { min: 3_000_000, mid: 5_000_000, high: 8_500_000 },
  },
  expansion: {
    default: { min: 1_500_000, mid: 2_200_000, high: 3_500_000 },
  },
  wallpaper: {
    hap:  { min:   700_000, mid: 1_200_000, high: 2_000_000 },
    silk: { min: 1_000_000, mid: 1_600_000, high: 2_800_000 },
  },
  floor: {
    strong: { min:   800_000, mid: 1_400_000, high: 2_200_000 },
    hard:   { min: 1_200_000, mid: 2_000_000, high: 3_200_000 },
    wood:   { min: 2_500_000, mid: 3_800_000, high: 6_000_000 },
  },
  bath_master: {
    default: { min: 1_400_000, mid: 2_600_000, high: 4_500_000 },
  },
  bath_common: {
    default: { min: 1_400_000, mid: 2_600_000, high: 4_500_000 },
  },
  kitchen: {
    sink:              { min: 1_600_000, mid: 3_000_000, high: 5_500_000 },
    sink_tile:         { min: 2_000_000, mid: 3_800_000, high: 7_000_000 },
    sink_tile_builtin: { min: 3_000_000, mid: 5_500_000, high: 10_000_000 },
  },
  lighting: {
    default: { min: 350_000, mid: 700_000, high: 1_400_000 },
  },
  door: {
    default: { min: 600_000, mid: 1_200_000, high: 2_200_000 },
  },
  entrance: {
    default: { min: 250_000, mid: 450_000, high: 800_000 },
  },
};

// 평수별 계수 (24평 = 1.0 기준)
export const AREA_MULTIPLIERS: { pyeong: number; multiplier: number }[] = [
  { pyeong: 10, multiplier: 0.55 },
  { pyeong: 15, multiplier: 0.70 },
  { pyeong: 20, multiplier: 0.85 },
  { pyeong: 24, multiplier: 1.00 },
  { pyeong: 30, multiplier: 1.20 },
  { pyeong: 34, multiplier: 1.35 },
  { pyeong: 40, multiplier: 1.55 },
  { pyeong: 45, multiplier: 1.70 },
  { pyeong: 50, multiplier: 1.85 },
  { pyeong: 60, multiplier: 2.10 },
];

export const INTERIOR_ITEMS: InteriorItemMeta[] = [
  { key: 'sash',        label: '샷시 교체',    icon: '🪟', hasSubOption: false },
  { key: 'expansion',   label: '베란다 확장',   icon: '🏗️', hasSubOption: false },
  { key: 'wallpaper',   label: '도배',          icon: '🖌️', hasSubOption: true,
    subOptions: [{ value: 'hap', label: '합지' }, { value: 'silk', label: '실크' }],
    defaultSubOption: 'silk' },
  { key: 'floor',       label: '마루',          icon: '🪵', hasSubOption: true,
    subOptions: [
      { value: 'strong', label: '강화마루' },
      { value: 'hard',   label: '강마루' },
      { value: 'wood',   label: '원목마루' },
    ],
    defaultSubOption: 'hard' },
  { key: 'bath_master', label: '욕실 (안방)',   icon: '🚿', hasSubOption: false },
  { key: 'bath_common', label: '욕실 (공용)',   icon: '🚿', hasSubOption: false },
  { key: 'kitchen',     label: '주방',          icon: '🍳', hasSubOption: true,
    subOptions: [
      { value: 'sink',              label: '싱크대만' },
      { value: 'sink_tile',         label: '싱크대 + 타일' },
      { value: 'sink_tile_builtin', label: '싱크대 + 타일 + 빌트인' },
    ],
    defaultSubOption: 'sink_tile' },
  { key: 'lighting',    label: '조명 전체',     icon: '💡', hasSubOption: false },
  { key: 'door',        label: '중문',          icon: '🚪', hasSubOption: false },
  { key: 'entrance',    label: '현관 타일',     icon: '🔲', hasSubOption: false },
];
```

---

## 5. 계산 로직

```js
// public/scripts/apartment-interior-cost-calculator.js

// 1. 평수 → 계수 보간
function getAreaMultiplier(pyeong) {
  const table = AREA_MULTIPLIERS; // 데이터 파일에서 인라인으로 복사
  if (pyeong <= table[0].pyeong) return table[0].multiplier;
  if (pyeong >= table[table.length - 1].pyeong) return table[table.length - 1].multiplier;
  for (let i = 0; i < table.length - 1; i++) {
    const a = table[i], b = table[i + 1];
    if (pyeong >= a.pyeong && pyeong <= b.pyeong) {
      const ratio = (pyeong - a.pyeong) / (b.pyeong - a.pyeong);
      return a.multiplier + ratio * (b.multiplier - a.multiplier);
    }
  }
}

// 2. 항목별 단가 조회
function getUnitPrice(itemKey, subOption) {
  const prices = UNIT_PRICES[itemKey];
  const key = subOption && prices[subOption] ? subOption : 'default';
  return prices[key]; // { min, mid, high }
}

// 3. 항목 단일 견적
function calcItem(itemKey, subOption, pyeong) {
  const unit = getUnitPrice(itemKey, subOption);
  const mult = getAreaMultiplier(pyeong);
  return {
    min:  Math.round(unit.min  * mult / 10000) * 10000,
    mid:  Math.round(unit.mid  * mult / 10000) * 10000,
    high: Math.round(unit.high * mult / 10000) * 10000,
  };
}

// 4. 전체 합산
function calcTotal(selectedItems, subOptions, pyeong) {
  let total = { min: 0, mid: 0, high: 0 };
  selectedItems.forEach(key => {
    const r = calcItem(key, subOptions[key] ?? null, pyeong);
    total.min  += r.min;
    total.mid  += r.mid;
    total.high += r.high;
  });
  return total;
}

// 5. 평당 환산
function perPyeong(total, pyeong) {
  return {
    min:  Math.round(total.min  / pyeong / 10000) * 10000,
    mid:  Math.round(total.mid  / pyeong / 10000) * 10000,
    high: Math.round(total.high / pyeong / 10000) * 10000,
  };
}
```

---

## 6. 화면 구성 (Astro 컴포넌트 배치)

```
[CalculatorHero]
  title: "구축 아파트 인테리어 비용 계산기"
  subtitle: "평수와 시공 항목을 선택하면 최소·보통·고급 견적을 바로 계산합니다"

[SimpleToolShell]
  ├── [입력 패널] .aic-input-panel
  │     ├── 평수 선택 슬라이더 .aic-pyeong-slider
  │     │     범위: 10~60평, step: 1, 기본값: 24
  │     │     라벨: "XX평 (전용 약 YY㎡)"
  │     │
  │     └── 시공 항목 체크박스 그리드 .aic-items-grid
  │           10개 항목 × 2열 배치
  │           체크 시 → 세부 옵션 드롭다운 인라인 표시 .aic-suboption
  │           기본 선택: 도배(실크), 마루(강마루), 조명 3개 pre-checked
  │
  └── [결과 영역]
        ├── KPI 카드 3개 .aic-grade-cards
        │     min: "최소 견적  X,XXX만 원" (그린)
        │     mid: "보통 견적  X,XXX만 원" (블루) ← 강조
        │     high: "고급 견적 X,XXX만 원" (골드)
        │     부제: "평당 약 XXX만 원"
        │
        ├── 항목별 비용 분해표 .aic-breakdown-table
        │     컬럼: 항목 | 최소 | 보통 | 고급
        │     선택된 항목만 행 표시
        │     합계 행 강조
        │
        └── [InfoNotice]
              "견적은 지역·자재·업체·시공 시기에 따라 20~40% 차이날 수 있습니다.
               본 계산기는 참고용 추정치입니다."

[평수별 참고 비교표 (정보 섹션)] .aic-reference-table
  20평 / 24평 / 32평 / 34평 / 40평 올수리 예상 범위 (항목 고정: 샷시+도배+마루+욕실2+주방+조명)

[TrustPanel]
  출처: 오늘의집·집꾸미기 후기 집계, 한국소비자원 인테리어 비용 실태조사

[SeoContent]
  intro: 5단락
  faq: 5개

[관련 링크]
  - 아파트 취득세 계산기
  - 서울 아파트 가격 리포트
  - 전월세 전환 계산기
```

---

## 7. DOM 구조 및 JS 이벤트

```html
<!-- 평수 슬라이더 -->
<input id="aic-pyeong" type="range" min="10" max="60" value="24" step="1" />
<span id="aic-pyeong-display">24평</span>

<!-- 항목 체크박스 -->
<label class="aic-item-label">
  <input type="checkbox" class="aic-item-check" data-key="sash" />
  <span>🪟 샷시 교체</span>
</label>

<!-- 세부 옵션 (체크 시 표시) -->
<div class="aic-suboption" data-for="floor" style="display:none">
  <select class="aic-suboption-select" data-key="floor">
    <option value="strong">강화마루</option>
    <option value="hard" selected>강마루</option>
    <option value="wood">원목마루</option>
  </select>
</div>

<!-- 결과 카드 -->
<div class="aic-grade-card aic-grade-min">
  <span class="aic-grade-label">최소</span>
  <strong class="aic-result-min">0만 원</strong>
  <span class="aic-per-pyeong-min">평당 0만 원</span>
</div>
```

```js
// 이벤트 흐름
pyeongSlider.addEventListener('input', () => {
  updateDisplay();
  recalculate();
});

document.querySelectorAll('.aic-item-check').forEach(cb => {
  cb.addEventListener('change', (e) => {
    const key = e.target.dataset.key;
    toggleSubOption(key, e.target.checked);
    recalculate();
  });
});

document.querySelectorAll('.aic-suboption-select').forEach(sel => {
  sel.addEventListener('change', recalculate);
});

function recalculate() {
  const pyeong = parseInt(pyeongSlider.value);
  const selected = [...document.querySelectorAll('.aic-item-check:checked')]
    .map(el => el.dataset.key);
  const subOptions = {};
  document.querySelectorAll('.aic-suboption-select').forEach(sel => {
    subOptions[sel.dataset.key] = sel.value;
  });

  const total = calcTotal(selected, subOptions, pyeong);
  const perP  = perPyeong(total, pyeong);

  updateResultCards(total, perP);
  updateBreakdownTable(selected, subOptions, pyeong);
  updateShareUrl();
}
```

---

## 8. URL 파라미터 (공유 링크)

```
?pyeong=24&items=sash,floor,bath_master,bath_common,kitchen,lighting&floor=hard&wallpaper=silk&kitchen=sink_tile
```

| 파라미터 | 설명 |
|---------|------|
| `pyeong` | 평수 (10~60) |
| `items` | 선택된 항목 키 콤마 구분 |
| `wallpaper` | hap / silk |
| `floor` | strong / hard / wood |
| `kitchen` | sink / sink_tile / sink_tile_builtin |

복원 시: URL 파싱 → 슬라이더·체크박스·드롭다운 세팅 → recalculate()

---

## 9. SCSS 구조

```scss
// _apartment-interior-cost-calculator.scss
// prefix: aic-

$aic-green: #1a6b3a;
$aic-green-light: #e8f5ee;
$aic-blue: #1a56db;
$aic-blue-light: #eff6ff;
$aic-gold: #b45309;
$aic-gold-light: #fef9c3;
$aic-border: #e5e7eb;
$aic-text: #1f2937;
$aic-text-sub: #6b7280;

.aic-page { ... }

// 평수 슬라이더
.aic-pyeong-section { ... }
.aic-pyeong-value { font-size: 1.5rem; font-weight: 700; color: $aic-blue; }

// 항목 체크박스 그리드
.aic-items-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  @media (max-width: 480px) { grid-template-columns: 1fr; }
}
.aic-item-label {
  display: flex; align-items: center; gap: 8px;
  padding: 12px; border: 1px solid $aic-border; border-radius: 8px;
  cursor: pointer;
  &:has(input:checked) { border-color: $aic-blue; background: $aic-blue-light; }
}
.aic-suboption {
  padding: 8px 12px;
  background: #f9fafb; border-radius: 6px;
  margin-top: 4px;
}

// 결과 카드 3개
.aic-grade-cards {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
  @media (max-width: 600px) { grid-template-columns: 1fr; }
}
.aic-grade-card {
  padding: 20px; border-radius: 12px; text-align: center;
  &.aic-grade-min  { background: $aic-green-light; border: 2px solid $aic-green; }
  &.aic-grade-mid  { background: $aic-blue-light;  border: 2px solid $aic-blue; transform: scale(1.02); }
  &.aic-grade-high { background: $aic-gold-light;  border: 2px solid $aic-gold; }
}
.aic-grade-label { font-size: 0.8rem; font-weight: 600; text-transform: uppercase; }
.aic-grade-amount { font-size: 1.6rem; font-weight: 800; display: block; margin: 8px 0; }
.aic-per-pyeong  { font-size: 0.8rem; color: $aic-text-sub; }

// 항목별 분해 테이블
.aic-breakdown-table {
  width: 100%; border-collapse: collapse;
  th, td { padding: 10px 12px; border-bottom: 1px solid $aic-border; font-size: 0.9rem; }
  th { background: #f9fafb; font-weight: 600; }
  tr.aic-total-row td { font-weight: 700; background: #f3f4f6; }
  .aic-col-min  { color: $aic-green; }
  .aic-col-mid  { color: $aic-blue;  font-weight: 700; }
  .aic-col-high { color: $aic-gold;  }
}

// 평수별 참고표
.aic-reference-table { ... }
```

---

## 10. tools.ts 등록 항목

```ts
{
  slug: "apartment-interior-cost-calculator",
  title: "구축 아파트 인테리어 비용 계산기 2026 | 24평 올수리 견적 바로 계산",
  description: "평수와 시공 항목(샷시·도배·마루·욕실·주방)을 선택하면 최소·보통·고급 3구간 인테리어 견적을 즉시 계산합니다. 2026년 시세 기준.",
  order: 145,        // 부동산 카테고리 마지막 순번에 삽입
  badges: ["인테리어", "견적", "올수리", "부동산"],
  category: "부동산·주거",
}
```

---

## 11. SeoContent 콘텐츠

### intro 5단락

1. **비용 범위 소개**: 구축 아파트 24평 올수리 기준 최소 800만 원~고급 3,000만 원대. 어떤 항목을 선택하느냐, 자재 등급을 어떻게 잡느냐에 따라 견적이 최대 3배 이상 달라진다.

2. **비용 격차의 3대 원인**: 샷시(브랜드 창호 vs 일반 창호), 욕실(도기·타일 등급), 마루(강화마루 vs 원목마루). 이 3가지가 전체 비용에서 차지하는 비중이 60% 이상이다.

3. **업체 견적과 실제 비용 차이**: 인테리어 업체 최초 견적은 대부분 기본 자재 기준. 시공 후 추가 공사(단열재, 방수 보강, 전기 분전반 교체 등)와 자재 업그레이드로 최종 금액이 20~40% 늘어나는 경우가 흔하다.

4. **우선순위 결정법**: 입주 후 교체가 어렵거나 비용이 크게 늘어나는 항목을 먼저 시공하는 게 합리적. 샷시, 욕실 방수, 마루 철거 범위는 입주 전에 처리하는 편이 낫다. 도배·조명은 나중에도 부분 교체 가능.

5. **2026년 시세 변화 포인트**: 인건비 상승과 자재비 증가로 2024년 대비 욕실·주방 시공 비용이 10~15% 올랐다. 특히 타일 시공 인건비와 위생도기 가격이 주된 원인이다. 견적 받을 때는 2~3개 업체 비교 필수.

### FAQ 5개

1. **24평 구축 아파트 올수리 비용은 보통 얼마인가요?**
   샷시·도배·마루·욕실 2개·주방·조명 포함 기준으로 최소 1,200만 원~보통 2,000만 원·고급 3,500만 원대입니다. 자재 등급과 업체에 따라 차이가 큽니다.

2. **비용이 가장 많이 드는 항목은 무엇인가요?**
   일반적으로 샷시(창호), 욕실 전체 철거·재시공, 주방(싱크대+타일+빌트인) 순으로 비용이 높습니다. 이 3개 항목이 전체 예산의 60~70%를 차지합니다.

3. **베란다 확장은 꼭 해야 하나요?**
   필수는 아닙니다. 거실을 넓히는 효과가 크지만 단열 성능 저하 우려가 있고, 불법 시공 여부 확인이 필요합니다. 지역별 허가 기준이 다르므로 구청 문의 후 진행하세요.

4. **마루는 강화마루와 강마루 중 어느 쪽이 나은가요?**
   강화마루는 비용이 낮지만 내구성이 약하고 물에 약합니다. 강마루는 비용이 약간 높지만 내구성과 질감이 좋아 가장 많이 선택됩니다. 원목마루는 고급감이 높지만 유지 관리가 필요합니다.

5. **견적서 받을 때 반드시 확인해야 할 항목은?**
   철거비 포함 여부, 폐기물 처리비, 부자재 포함 기준(이음새·몰딩·코킹), 추가 공사 단가 기준, 하자보증 기간 6가지를 반드시 확인하세요. 최초 견적에 이 항목들이 빠지면 실제 비용이 크게 늘어납니다.

---

## 12. 관련 링크 연결

```ts
export const AIC_RELATED_LINKS = [
  { href: "/tools/real-estate-acquisition-tax/", label: "아파트 취득세 계산기", desc: "구입가 기준 취득세 즉시 계산" },
  { href: "/reports/seoul-84-apartment-prices/", label: "서울 국평 아파트 가격 리포트", desc: "강남·마포·성동 84㎡ 평균가 비교" },
  { href: "/tools/jeonwolse-conversion/", label: "전월세 전환 계산기", desc: "전세→월세, 월세→전세 환산" },
  { href: "/tools/apartment-holding-tax/", label: "아파트 보유세 계산기", desc: "재산세+종부세 연간 보유세 계산" },
];
```

---

## 13. 구현 순서

1. `src/data/apartmentInteriorCost.ts` 생성 (단가표, 항목 메타, FAQ, 관련링크)
2. `src/styles/scss/pages/_apartment-interior-cost-calculator.scss` 생성
3. `src/styles/app.scss`에 `@use` 추가
4. `src/pages/tools/apartment-interior-cost-calculator.astro` 생성
5. `public/scripts/apartment-interior-cost-calculator.js` 생성 (계산 로직 + DOM + URL 파라미터)
6. `src/data/tools.ts` 등록
7. `public/sitemap.xml` URL 추가
8. `npm run build` 빌드 확인
9. 커밋·배포

---

## 14. QA 포인트

| 체크 항목 | 기준 |
|---------|------|
| 항목 0개 선택 시 | 결과 카드 "0만 원" 표시, 에러 없음 |
| 전체 항목 선택 시 | 합산 정상 계산 |
| 평수 극단값 (10평/60평) | 계수 테이블 경계값 처리 |
| 세부 옵션 변경 시 | 실시간 재계산 |
| URL 파라미터 복원 | 체크박스·드롭다운·슬라이더 정확히 복원 |
| 모바일 (375px) | 카드 1열, 체크박스 그리드 1열, 테이블 스크롤 |
| 분해표 행 순서 | 선택된 항목만 표시, 합계 행 마지막 |
| 숫자 포맷 | 만원 단위 콤마 표기 (예: 1,200만 원) |
