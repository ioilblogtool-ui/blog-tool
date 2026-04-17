# 해외여행 총비용 계산기 — 설계 문서

> 기획 원문: `docs/plan/202604/overseas-travel-cost.md`
> 작성일: 2026-04-15
> 구현 기준: Claude/Codex가 이 문서를 보고 바로 구현에 착수할 수 있는 수준
> 참고 계산기: `fire-calculator`, `ai-stack-cost-calculator` (입력 → 결과 패턴)

---

## 1. 문서 개요

- **슬러그**: `overseas-travel-cost`
- **URL**: `/tools/overseas-travel-cost/`
- **콘텐츠 유형**: 인터랙티브 계산기 (`/tools/` 계열)
- **레이아웃**: `BaseLayout` + `SimpleToolShell`
  - `pageClass="otc-page"` 로 전용 스타일 범위 분리
  - 입력이 많으므로 모바일에서 입력 → 결과 순서로 스크롤
  - PC에서 `resultFirst={false}` (왼쪽 입력, 오른쪽 결과)

---

## 2. 파일 구조

```
src/
  data/
    overseasTravelCost.ts       ← 프리셋, 지역 평균 시세, FAQ 데이터
  pages/
    tools/
      overseas-travel-cost.astro

public/
  og/
    tools/
      overseas-travel-cost.png
  scripts/
    overseas-travel-cost.js

src/styles/scss/pages/
  _overseas-travel-cost.scss    (prefix: otc-)
```

---

## 3. 데이터 파일 설계 (`overseasTravelCost.ts`)

### 3-1. 타입 정의

```ts
export type TravelRegion = "japan" | "southeast-asia" | "europe" | "americas" | "taiwan-hongkong";

export type FlightClass = "lcc" | "economy" | "premium" | "business";
export type HotelTier = "guesthouse" | "3star" | "4star" | "5star";
export type EmergencyRate = 0.05 | 0.10 | 0.15;

export type TravelPreset = {
  id: string;
  label: string;                    // "일본 3박4일"
  region: TravelRegion;
  nights: number;
  days: number;
  persons: number;
  flightPerPerson: number;          // 원화 기준
  hotelPerNight: number;            // 1박 1실 기준 (원화)
  mealPerPersonPerDay: number;
  transportPerPersonPerDay: number;
  activityPerPersonPerDay: number;
  insurancePerPerson: number;
  shopping: number;
  flightClass: FlightClass;
  hotelTier: HotelTier;
  emergencyRate: EmergencyRate;
  description: string;
};

export type RegionalGuide = {
  region: TravelRegion;
  label: string;
  avgFlightKRW: string;             // "60만~90만원"
  avgHotelPerNightKRW: string;      // "8만~15만원"
  avgMealPerDayKRW: string;         // "3만~5만원"
  characteristics: string;
  note: string;
};
```

### 3-2. 프리셋 데이터 (4종)

```ts
export const TRAVEL_PRESETS: TravelPreset[] = [
  {
    id: "japan-3n4d",
    label: "일본 3박4일",
    region: "japan",
    nights: 3, days: 4, persons: 2,
    flightPerPerson: 350000,        // 이코노미 기준 편도×2
    hotelPerNight: 120000,          // 3성급 도쿄/오사카
    mealPerPersonPerDay: 40000,
    transportPerPersonPerDay: 15000,
    activityPerPersonPerDay: 20000,
    insurancePerPerson: 12000,
    shopping: 200000,
    flightClass: "economy",
    hotelTier: "3star",
    emergencyRate: 0.10,
    description: "가장 대중적인 일본 단기 여행 조합",
  },
  {
    id: "sea-4n5d",
    label: "동남아 4박5일",
    region: "southeast-asia",
    nights: 4, days: 5, persons: 2,
    flightPerPerson: 320000,
    hotelPerNight: 80000,           // 방콕/다낭 3성급
    mealPerPersonPerDay: 20000,
    transportPerPersonPerDay: 10000,
    activityPerPersonPerDay: 15000,
    insurancePerPerson: 15000,
    shopping: 150000,
    flightClass: "economy",
    hotelTier: "3star",
    emergencyRate: 0.10,
    description: "가성비 우수 동남아 여행 조합",
  },
  {
    id: "europe-6n8d",
    label: "유럽 6박8일",
    region: "europe",
    nights: 6, days: 8, persons: 2,
    flightPerPerson: 1400000,
    hotelPerNight: 220000,
    mealPerPersonPerDay: 70000,
    transportPerPersonPerDay: 30000,
    activityPerPersonPerDay: 40000,
    insurancePerPerson: 35000,
    shopping: 300000,
    flightClass: "economy",
    hotelTier: "3star",
    emergencyRate: 0.10,
    description: "항공+숙박 비중이 큰 장기 유럽 여행",
  },
  {
    id: "americas-5n7d",
    label: "미주 5박7일",
    region: "americas",
    nights: 5, days: 7, persons: 2,
    flightPerPerson: 1700000,
    hotelPerNight: 250000,
    mealPerPersonPerDay: 80000,
    transportPerPersonPerDay: 35000,
    activityPerPersonPerDay: 50000,
    insurancePerPerson: 40000,
    shopping: 400000,
    flightClass: "economy",
    hotelTier: "3star",
    emergencyRate: 0.10,
    description: "총액이 크고 항공 비중이 절반 이상",
  },
];
```

### 3-3. 지역별 평균 시세 가이드

```ts
export const REGIONAL_GUIDES: RegionalGuide[] = [
  {
    region: "japan",
    label: "일본",
    avgFlightKRW: "30만~80만원",
    avgHotelPerNightKRW: "8만~20만원",
    avgMealPerDayKRW: "3만~6만원",
    characteristics: "근거리·단기 여행 최적. 엔화 환율에 따라 체감 비용 변동 큼",
    note: "성수기(벚꽃·단풍) 항공·숙박 2배 이상 가능",
  },
  {
    region: "southeast-asia",
    label: "동남아",
    avgFlightKRW: "25만~60만원",
    avgHotelPerNightKRW: "5만~15만원",
    avgMealPerDayKRW: "1만~3만원",
    characteristics: "식비·교통비 저렴. 장기 체류 시 가성비 우수",
    note: "고급 리조트 선택 시 숙박비가 급등",
  },
  {
    region: "europe",
    label: "유럽",
    avgFlightKRW: "100만~200만원",
    avgHotelPerNightKRW: "15만~40만원",
    avgMealPerDayKRW: "5만~10만원",
    characteristics: "항공·숙박 비중 높음. 도시패스 활용으로 관광비 절감 가능",
    note: "유로화 환율·유류할증료 변동 주의",
  },
  {
    region: "americas",
    label: "미주",
    avgFlightKRW: "130만~250만원",
    avgHotelPerNightKRW: "18만~45만원",
    avgMealPerDayKRW: "6만~12만원",
    characteristics: "항공 비중 40~50%. 팁 문화로 실제 식비 높아짐",
    note: "달러 환율 변동 시 총액 차이 클 수 있음",
  },
];
```

### 3-4. 항목 레이블 맵

```ts
export const COST_LABELS: Record<string, string> = {
  flight: "항공",
  hotel: "숙박",
  meal: "식비",
  transport: "현지교통",
  activity: "관광/입장료",
  insurance: "여행자보험",
  shopping: "쇼핑",
  emergency: "비상금",
};
```

### 3-5. FAQ 데이터

```ts
export const TRAVEL_COST_FAQ = [
  {
    q: "해외여행 총비용은 어떤 항목까지 포함해야 하나요?",
    a: "항공권, 숙박, 식비, 현지교통, 관광/입장료, 여행자보험, 쇼핑, 비상금까지 포함해야 현실적인 총예산이 됩니다. 특히 비상금은 예상치 못한 지출(의료, 지연, 추가 식비)을 위해 총액의 10% 이상을 남겨두는 것을 권장합니다.",
  },
  {
    q: "숙박일수와 여행일수는 왜 따로 입력하나요?",
    a: "여행일수는 식비·교통비·관광비 계산 기준이고, 숙박일수(박 수)는 호텔 비용 계산 기준입니다. 예를 들어 3박4일이면 여행일수 4일, 숙박일수 3박입니다.",
  },
  {
    q: "2인 여행이면 숙박비는 어떻게 계산되나요?",
    a: "1~2인은 기본 1실로 계산됩니다. 3인 이상은 2실로 자동 계산되며, 직접 조정도 가능합니다.",
  },
  {
    q: "여행자보험은 꼭 포함해야 하나요?",
    a: "필수는 아니지만 1~2만원 수준으로 의료비·분실·결항 보상을 받을 수 있어 포함을 권장합니다. 유럽·미주 여행은 의료비 부담이 크므로 특히 중요합니다.",
  },
  {
    q: "비상금은 왜 10%를 권장하나요?",
    a: "여행 중 예상치 못한 지출(교통 지연, 추가 식사, 간단한 의료)이 총 예산의 5~15%가량 발생하는 경우가 많습니다. 10%가 현실적인 중간값입니다.",
  },
  {
    q: "일본·동남아·유럽 중 어디가 더 저렴한가요?",
    a: "식비·현지교통 기준으로는 동남아 < 일본 < 유럽 순입니다. 단, 항공비가 전체 비용에서 차지하는 비중이 크므로 항공 프로모션 유무가 최종 총액에 큰 영향을 줍니다.",
  },
  {
    q: "환율이 바뀌면 총비용도 많이 달라지나요?",
    a: "현지통화 기준 비용이 같아도 환율에 따라 원화 부담이 크게 달라집니다. 엔화·달러·유로 모두 10% 변동만으로도 수십만원 차이가 날 수 있습니다.",
  },
  {
    q: "계산 결과를 어떻게 활용하면 좋나요?",
    a: "이 계산기의 결과는 참고용 추정치입니다. 성수기·도시·예약 시점에 따라 실제 금액은 달라질 수 있습니다. 예산 계획 및 항목별 우선순위를 잡는 용도로 활용하세요.",
  },
];
```

---

## 4. `.astro` 페이지 설계

### 4-1. 파일: `src/pages/tools/overseas-travel-cost.astro`

```astro
---
import BaseLayout from "@layouts/BaseLayout.astro";
import SimpleToolShell from "@layouts/SimpleToolShell.astro";
import CalculatorHero from "@components/CalculatorHero.astro";
import ToolActionBar from "@components/ToolActionBar.astro";
import SeoContent from "@components/SeoContent.astro";
import InfoNotice from "@components/InfoNotice.astro";
import { withBase } from "@utils/withBase";
import { TRAVEL_PRESETS, REGIONAL_GUIDES, TRAVEL_COST_FAQ } from "@data/overseasTravelCost";
---

<BaseLayout
  title="해외여행 총비용 계산기 | 항공·숙박·식비·보험까지 한 번에 계산"
  description="여행지, 인원수, 숙박일수, 항공권 등급, 식비, 관광비, 보험 여부를 입력하면 해외여행 총예산을 자동 계산합니다. 일본·동남아·유럽 프리셋과 1인당/전체 금액, 예산 초과 여부까지 한 번에 확인하세요."
  pageClass="otc-page"
  slug="overseas-travel-cost"
>
  <CalculatorHero
    title="해외여행 총비용 계산기"
    description="항공·숙박·식비·교통·관광·보험·비상금까지 포함한 현실적인 여행 총예산을 계산합니다."
  />

  <!-- 빠른 프리셋 칩 -->
  <div class="otc-preset-row">
    <span class="otc-preset-label">빠른 예시</span>
    {TRAVEL_PRESETS.map(p => (
      <button class="otc-preset-chip" data-preset={p.id}>{p.label}</button>
    ))}
  </div>

  <SimpleToolShell>
    <!-- 왼쪽: 입력 패널 -->
    <div slot="input">
      <ToolActionBar />

      <!-- 섹션 A: 기본 여행 정보 -->
      <div class="otc-section">
        <h3 class="otc-section-title">기본 여행 정보</h3>
        <div class="otc-field-grid">
          <label class="field">
            <span>여행 지역</span>
            <select id="otcRegion">
              <option value="japan">일본</option>
              <option value="southeast-asia">동남아</option>
              <option value="europe">유럽</option>
              <option value="americas">미주</option>
              <option value="taiwan-hongkong">대만/홍콩</option>
            </select>
          </label>
          <label class="field">
            <span>인원수 (명)</span>
            <input type="number" id="otcPersons" min="1" max="20" value="2" />
          </label>
          <label class="field">
            <span>여행일수 (일)</span>
            <input type="number" id="otcDays" min="1" max="30" value="4" />
          </label>
          <label class="field">
            <span>숙박일수 (박)</span>
            <input type="number" id="otcNights" min="1" max="30" value="3" />
          </label>
        </div>
      </div>

      <!-- 섹션 B: 항공 & 숙박 -->
      <div class="otc-section">
        <h3 class="otc-section-title">항공 & 숙박</h3>
        <div class="otc-field-grid">
          <!-- 항공권 등급 라디오칩 -->
          <div class="field field--full">
            <span>항공권 등급</span>
            <div class="toggle-grid otc-flight-chips">
              <label class="mode-chip">
                <input type="radio" name="otcFlightClass" value="lcc" />
                <span>저가항공</span>
              </label>
              <label class="mode-chip">
                <input type="radio" name="otcFlightClass" value="economy" checked />
                <span>이코노미</span>
              </label>
              <label class="mode-chip">
                <input type="radio" name="otcFlightClass" value="premium" />
                <span>프리미엄</span>
              </label>
              <label class="mode-chip">
                <input type="radio" name="otcFlightClass" value="business" />
                <span>비즈니스</span>
              </label>
            </div>
          </div>
          <label class="field">
            <span>1인 항공권 (원화)</span>
            <input type="number" id="otcFlightPerPerson" value="350000" step="10000" />
          </label>

          <!-- 숙박 등급 라디오칩 -->
          <div class="field field--full">
            <span>숙박 등급</span>
            <div class="toggle-grid otc-hotel-chips">
              <label class="mode-chip">
                <input type="radio" name="otcHotelTier" value="guesthouse" />
                <span>게스트하우스</span>
              </label>
              <label class="mode-chip">
                <input type="radio" name="otcHotelTier" value="3star" checked />
                <span>3성급</span>
              </label>
              <label class="mode-chip">
                <input type="radio" name="otcHotelTier" value="4star" />
                <span>4성급</span>
              </label>
              <label class="mode-chip">
                <input type="radio" name="otcHotelTier" value="5star" />
                <span>5성급</span>
              </label>
            </div>
          </div>
          <label class="field">
            <span>1박 숙박비 (원화)</span>
            <input type="number" id="otcHotelPerNight" value="120000" step="10000" />
          </label>
          <label class="field">
            <span>객실 수</span>
            <input type="number" id="otcRooms" min="1" max="10" value="1" />
          </label>
        </div>
      </div>

      <!-- 섹션 C: 현지 경비 (1인 1일 기준) -->
      <div class="otc-section">
        <h3 class="otc-section-title">현지 경비 <small>(1인 1일 기준)</small></h3>
        <div class="otc-field-grid">
          <label class="field">
            <span>식비 (원)</span>
            <input type="number" id="otcMeal" value="40000" step="5000" />
          </label>
          <label class="field">
            <span>현지교통비 (원)</span>
            <input type="number" id="otcTransport" value="15000" step="5000" />
          </label>
          <label class="field">
            <span>관광/입장료 (원)</span>
            <input type="number" id="otcActivity" value="20000" step="5000" />
          </label>
        </div>
      </div>

      <!-- 섹션 D: 기타 옵션 -->
      <div class="otc-section">
        <h3 class="otc-section-title">기타 옵션</h3>
        <div class="otc-field-grid">
          <label class="field otc-toggle-field">
            <span>여행자보험 포함</span>
            <input type="checkbox" id="otcInsurance" checked />
          </label>
          <label class="field" id="otcInsuranceField">
            <span>1인 보험료 (원)</span>
            <input type="number" id="otcInsurancePerPerson" value="12000" step="1000" />
          </label>
          <label class="field">
            <span>쇼핑 예산 (원, 전체)</span>
            <input type="number" id="otcShopping" value="200000" step="10000" />
          </label>
          <div class="field field--full">
            <span>비상금 비율</span>
            <div class="toggle-grid">
              <label class="mode-chip">
                <input type="radio" name="otcEmergencyRate" value="0.05" />
                <span>5%</span>
              </label>
              <label class="mode-chip">
                <input type="radio" name="otcEmergencyRate" value="0.10" checked />
                <span>10%</span>
              </label>
              <label class="mode-chip">
                <input type="radio" name="otcEmergencyRate" value="0.15" />
                <span>15%</span>
              </label>
            </div>
          </div>
          <label class="field">
            <span>내 여행 총예산 (원)</span>
            <input type="number" id="otcBudget" value="3000000" step="100000" />
          </label>
        </div>
      </div>
    </div>

    <!-- 오른쪽: 결과 패널 -->
    <div slot="result">
      <!-- 핵심 요약 카드 3개 -->
      <div class="otc-summary-cards">
        <div class="otc-kpi-card otc-kpi-card--total">
          <div class="otc-kpi-label">예상 총비용</div>
          <div class="otc-kpi-value" id="otcTotalCost">—</div>
        </div>
        <div class="otc-kpi-card">
          <div class="otc-kpi-label">1인당 비용</div>
          <div class="otc-kpi-value" id="otcPerPerson">—</div>
        </div>
        <div class="otc-kpi-card">
          <div class="otc-kpi-label">비상금 권장액</div>
          <div class="otc-kpi-value" id="otcEmergency">—</div>
        </div>
      </div>

      <!-- 예산 게이지 -->
      <div class="otc-gauge-wrap">
        <div class="otc-gauge-header">
          <span>예산 대비</span>
          <span id="otcBudgetStatus" class="otc-budget-status">—</span>
        </div>
        <div class="otc-gauge-bar">
          <div class="otc-gauge-fill" id="otcGaugeFill"></div>
        </div>
        <div class="otc-gauge-labels">
          <span>내 예산 <strong id="otcBudgetDisplay">—</strong></span>
          <span id="otcBudgetDiff" class="otc-budget-diff">—</span>
        </div>
        <p class="otc-gauge-message" id="otcGaugeMessage"></p>
      </div>

      <!-- 항목별 도넛 차트 -->
      <div class="otc-chart-section">
        <h4 class="otc-result-subtitle">비용 구성</h4>
        <div class="otc-donut-wrap">
          <canvas id="otc-donut-chart"></canvas>
        </div>
      </div>

      <!-- 항목별 상세 표 -->
      <div class="otc-breakdown-section">
        <h4 class="otc-result-subtitle">항목별 상세</h4>
        <table class="otc-breakdown-table">
          <tbody id="otcBreakdownBody">
            <!-- JS로 렌더 -->
          </tbody>
          <tfoot>
            <tr class="otc-breakdown-total">
              <td>총비용</td>
              <td id="otcBreakdownTotal">—</td>
            </tr>
          </tfoot>
        </table>
        <p class="otc-insight" id="otcInsight"></p>
      </div>

      <!-- 지역별 평균 시세 가이드 -->
      <details class="otc-guide-section">
        <summary>지역별 평균 시세 참고</summary>
        <table class="otc-guide-table">
          <thead>
            <tr>
              <th>지역</th><th>평균 항공비</th><th>1박 숙박비</th><th>1일 식비</th>
            </tr>
          </thead>
          <tbody>
            {REGIONAL_GUIDES.map(g => (
              <tr>
                <td>{g.label}</td>
                <td>{g.avgFlightKRW}</td>
                <td>{g.avgHotelPerNightKRW}</td>
                <td>{g.avgMealPerDayKRW}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p class="otc-guide-note">
          위 값은 2인 기준 참고용 평균입니다. 성수기·예약 시점·도시에 따라 실제 금액은 크게 달라질 수 있습니다.
          <span class="otc-update-date">최종 업데이트: 2026년 4월</span>
        </p>
      </details>

      <!-- 여행 비용 절감 팁 -->
      <details class="otc-tips-section">
        <summary>여행 비용 절감 팁</summary>
        <ul class="otc-tips-list">
          <li>비수기·평일 출발로 항공비 줄이기</li>
          <li>중심가보다 한 정거장 외곽 숙소 선택</li>
          <li>1일 식비는 현지 물가 기준으로 현실적으로 설정</li>
          <li>지하철·버스 등 대중교통 패스 활용</li>
          <li>도시패스·무료 관광지로 입장료 절감</li>
          <li>여행자보험·eSIM은 출발 전 미리 비교 가입</li>
          <li>총 예산의 10%는 비상금으로 확보</li>
        </ul>
      </details>

      <InfoNotice>
        계산 결과는 참고용 추정치입니다. 성수기·비수기, 도시, 예약 시점에 따라 실제 금액은 달라질 수 있으며, 환율·유류할증료·세금은 변동 가능합니다.
      </InfoNotice>
    </div>
  </SimpleToolShell>

  <SeoContent
    faqs={TRAVEL_COST_FAQ}
    seoText={`
      해외여행 비용은 항공권만 보면 안 됩니다. 숙박·식비·현지교통·관광·보험·비상금까지 포함해야 현실적인 총예산이 됩니다.
      이 계산기는 여행지 프리셋(일본·동남아·유럽·미주)을 선택하는 즉시 항목별 기본값이 자동 입력되어
      처음 써보는 사용자도 바로 총비용을 확인할 수 있습니다.
      인원수와 숙박일수를 조정하면 1인당 비용과 예산 초과 여부를 실시간으로 비교할 수 있어
      일정 변경이나 등급 조정 시 반복 활용하기 좋습니다.
    `}
  />
</BaseLayout>

<!-- Chart.js CDN 먼저, 모듈 스크립트 나중에 -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"></script>
<script type="module" src={withBase("/scripts/overseas-travel-cost.js")}></script>
```

---

## 5. JavaScript 설계 (`overseas-travel-cost.js`)

### 5-1. 전체 구조

```js
import { formatKRW, buildDefaultOptions } from "./chart-config.js";

// ─── 상수 ───────────────────────────────────────────
const PRESETS = { /* 인라인 또는 JSON import */ };
const EMERGENCY_RATES = { "0.05": 0.05, "0.10": 0.10, "0.15": 0.15 };

// ─── DOM 바인딩 ──────────────────────────────────────
const $ = id => document.getElementById(id);

// ─── 상태 ────────────────────────────────────────────
let donutChart = null;

// ─── 계산 함수 ────────────────────────────────────────
function calcRooms(persons) { return persons <= 2 ? 1 : 2; }

function calculate(state) {
  const { persons, days, nights, flightPerPerson, hotelPerNight, rooms,
          meal, transport, activity, insurance, insurancePP,
          shopping, emergencyRate } = state;

  const flight    = flightPerPerson * persons;
  const hotel     = hotelPerNight * nights * rooms;
  const mealCost  = meal * days * persons;
  const transCost = transport * days * persons;
  const actCost   = activity * days * persons;
  const insCost   = insurance ? insurancePP * persons : 0;
  const shopCost  = shopping;

  const subtotal   = flight + hotel + mealCost + transCost + actCost + insCost + shopCost;
  const emergency  = Math.round(subtotal * emergencyRate);
  const total      = subtotal + emergency;
  const perPerson  = Math.round(total / persons);

  return { flight, hotel, mealCost, transCost, actCost, insCost, shopCost,
           subtotal, emergency, total, perPerson };
}

// ─── 렌더 함수 ───────────────────────────────────────
function render() {
  const state = readState();
  const result = calculate(state);
  renderSummary(result, state.budget);
  renderGauge(result.total, state.budget);
  renderBreakdown(result);
  renderDonut(result);
  updateURL(state);
}

// ─── 예산 게이지 ──────────────────────────────────────
function renderGauge(total, budget) {
  if (!budget) return;
  const ratio = Math.min(total / budget, 1.5);        // 최대 150%까지 표시
  const pct   = Math.min(ratio * 100, 100);
  const diff  = budget - total;
  const fill  = $("otcGaugeFill");

  fill.style.width = pct + "%";
  fill.className    = "otc-gauge-fill";
  if (ratio > 1)        fill.classList.add("otc-gauge-fill--over");
  else if (ratio > 0.9) fill.classList.add("otc-gauge-fill--warn");

  $("otcBudgetDiff").textContent = diff >= 0
    ? `${formatKRW(diff)} 여유`
    : `${formatKRW(Math.abs(diff))} 초과`;

  const statusEl = $("otcBudgetStatus");
  const msgEl    = $("otcGaugeMessage");
  if (diff > total * 0.1) {
    statusEl.textContent = "여유";
    statusEl.className   = "otc-budget-status otc-budget-status--ok";
    msgEl.textContent    = `예산보다 ${formatKRW(diff)} 여유 있어요.`;
  } else if (diff >= 0) {
    statusEl.textContent = "적정";
    statusEl.className   = "otc-budget-status otc-budget-status--warn";
    msgEl.textContent    = "예산과 거의 비슷합니다. 여유자금을 확인하세요.";
  } else {
    statusEl.textContent = "초과";
    statusEl.className   = "otc-budget-status otc-budget-status--over";
    msgEl.textContent    = `예산을 ${formatKRW(Math.abs(diff))} 초과했어요. 숙박 또는 항공 옵션을 조정해보세요.`;
  }
}

// ─── 도넛 차트 ────────────────────────────────────────
function renderDonut(result) {
  const labels = ["항공","숙박","식비","현지교통","관광/입장료","여행자보험","쇼핑","비상금"];
  const data   = [result.flight, result.hotel, result.mealCost, result.transCost,
                  result.actCost, result.insCost, result.shopCost, result.emergency];

  const colors = ["#0F6E56","#1D9E75","#534AB7","#BA7517",
                  "#3B82F6","#8B5CF6","#EC4899","#94A3B8"];

  const ctx = document.getElementById("otc-donut-chart");
  if (!ctx) return;

  if (donutChart) {
    donutChart.data.datasets[0].data = data;
    donutChart.update("none");
    return;
  }

  donutChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels,
      datasets: [{ data, backgroundColor: colors, borderWidth: 2, borderColor: "#fff" }],
    },
    options: {
      ...buildDefaultOptions(),
      cutout: "60%",
      plugins: {
        legend: { position: "bottom", labels: { font: { size: 11 }, padding: 8 } },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.label}: ${(ctx.raw as number).toLocaleString()}원`,
          },
        },
      },
    },
  });
}

// ─── 프리셋 ──────────────────────────────────────────
function applyPreset(presetId) {
  const p = PRESETS[presetId];
  if (!p) return;
  // 각 input에 값 세팅 후 render()
}

// ─── 초기화 ──────────────────────────────────────────
function init() {
  // 이벤트 리스너 등록
  // URL 파라미터 복원
  // 초기 render()
}

document.addEventListener("DOMContentLoaded", init);
```

### 5-2. 주요 함수 목록

| 함수 | 역할 |
|------|------|
| `readState()` | 모든 input에서 값을 읽어 state 객체 반환 |
| `calculate(state)` | 항목별 비용 계산, 결과 객체 반환 |
| `renderSummary(result, budget)` | 총비용·1인당·비상금 KPI 카드 업데이트 |
| `renderGauge(total, budget)` | 예산 게이지 바 + 상태 메시지 렌더 |
| `renderBreakdown(result)` | 항목별 상세 테이블 `<tbody>` 렌더 |
| `renderDonut(result)` | Chart.js 도넛 차트 초기화 또는 업데이트 |
| `renderInsight(result)` | "가장 큰 비중 항목" 문구 렌더 |
| `applyPreset(id)` | 프리셋 버튼 클릭 시 input 일괄 세팅 |
| `syncRooms(persons)` | 인원수 변경 시 객실 수 자동 조정 |
| `updateURL(state)` | URL 파라미터로 상태 직렬화 |
| `restoreFromURL()` | 페이지 진입 시 URL 파라미터 복원 |
| `render()` | 위 함수들을 순서대로 호출하는 진입점 |

### 5-3. 방어 로직

- `persons`, `days`, `nights`, `rooms` 최솟값 1 강제
- 모든 숫자 input은 `parseInt` / `parseFloat` + `|| 0` 처리
- 보험 toggle off 시 `otcInsuranceField` hide + 계산에서 0 처리
- 프리셋 클릭 후 직접 수정 시 프리셋 chip 비활성화(선택 해제)

### 5-4. 디바운스

입력값 변경 → `render()` 는 즉시 호출 (debounce 불필요, 계산이 단순).
URL 직렬화만 `debounce(updateURL, 300)` 적용.

---

## 6. SCSS 설계 (`_overseas-travel-cost.scss`)

prefix: `otc-`

```scss
// ─── 프리셋 칩 행 ────────────────────────────────────
.otc-preset-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 12px 0 20px;
}

.otc-preset-label {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin-right: 4px;
}

.otc-preset-chip {
  padding: 6px 14px;
  border-radius: var(--radius-chip);
  border: 1px solid var(--color-brand-primary);
  background: #fff;
  color: var(--color-brand-primary);
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;

  &:hover,
  &.is-active {
    background: var(--color-brand-primary);
    color: #fff;
  }
}

// ─── 입력 섹션 ───────────────────────────────────────
.otc-section {
  margin-bottom: 20px;

  & + & {
    padding-top: 16px;
    border-top: 1px solid var(--color-border, #eee);
  }
}

.otc-section-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: 12px;

  small { font-weight: 400; font-size: 0.8rem; }
}

.otc-field-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.field--full { grid-column: 1 / -1; }

.otc-toggle-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

// ─── 요약 KPI 카드 ───────────────────────────────────
.otc-summary-cards {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
  margin-bottom: 20px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.otc-kpi-card {
  background: var(--color-surface, #f9fafb);
  border-radius: var(--radius-card);
  padding: 14px 12px;
  text-align: center;
  border: 1px solid var(--color-border, #eee);

  &--total {
    background: var(--color-brand-tint);
    border-color: var(--color-brand-primary);
  }
}

.otc-kpi-label {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin-bottom: 4px;
}

.otc-kpi-value {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-brand-primary);
}

// ─── 예산 게이지 ──────────────────────────────────────
.otc-gauge-wrap {
  background: var(--color-surface, #f9fafb);
  border-radius: var(--radius-card);
  padding: 16px;
  margin-bottom: 20px;
  border: 1px solid var(--color-border, #eee);
}

.otc-gauge-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 0.85rem;
}

.otc-budget-status {
  font-weight: 700;
  padding: 2px 10px;
  border-radius: var(--radius-chip);
  font-size: 0.8rem;

  &--ok   { background: #dcfce7; color: #166534; }
  &--warn { background: #fef9c3; color: #854d0e; }
  &--over { background: #fee2e2; color: #991b1b; }
}

.otc-gauge-bar {
  height: 10px;
  background: var(--color-border, #e5e7eb);
  border-radius: 99px;
  overflow: hidden;
  margin-bottom: 8px;
}

.otc-gauge-fill {
  height: 100%;
  background: var(--color-brand-primary);
  border-radius: 99px;
  transition: width 0.4s ease;

  &--warn { background: #eab308; }
  &--over { background: #ef4444; }
}

.otc-gauge-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: var(--color-text-secondary);
}

.otc-budget-diff { font-weight: 600; }

.otc-gauge-message {
  margin-top: 8px;
  font-size: 0.82rem;
  color: var(--color-text-secondary);
}

// ─── 도넛 차트 ────────────────────────────────────────
.otc-donut-wrap {
  position: relative;
  height: 220px;
  margin-bottom: 16px;
}

// ─── 항목별 표 ───────────────────────────────────────
.otc-breakdown-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
  margin-bottom: 8px;

  td {
    padding: 7px 4px;
    border-bottom: 1px solid var(--color-border, #eee);

    &:last-child { text-align: right; font-weight: 500; }
  }
}

.otc-breakdown-total td {
  font-weight: 700;
  font-size: 1rem;
  border-top: 2px solid var(--color-text-primary, #111);
  border-bottom: none;
  padding-top: 10px;
}

.otc-insight {
  font-size: 0.82rem;
  color: var(--color-text-muted);
  margin-top: 6px;
}

// ─── 가이드 / 팁 섹션 ────────────────────────────────
.otc-guide-section,
.otc-tips-section {
  margin-bottom: 16px;
  border: 1px solid var(--color-border, #eee);
  border-radius: var(--radius-card);
  overflow: hidden;

  summary {
    padding: 12px 16px;
    cursor: pointer;
    font-size: 0.88rem;
    font-weight: 600;
    background: var(--color-surface, #f9fafb);
    list-style: none;

    &::-webkit-details-marker { display: none; }
    &::before { content: "▶ "; font-size: 0.7em; }
  }

  &[open] summary::before { content: "▼ "; }
}

.otc-guide-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;
  padding: 12px;

  th, td {
    padding: 8px 12px;
    border-bottom: 1px solid var(--color-border, #eee);
    text-align: left;
  }

  th { font-weight: 600; background: var(--color-surface, #f9fafb); }
}

.otc-guide-note {
  font-size: 0.78rem;
  color: var(--color-text-muted);
  padding: 8px 12px 12px;
}

.otc-update-date {
  display: block;
  margin-top: 4px;
  font-size: 0.75rem;
}

.otc-tips-list {
  padding: 12px 12px 12px 28px;
  font-size: 0.85rem;
  line-height: 1.8;
  color: var(--color-text-secondary);
}

.otc-result-subtitle {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: var(--color-text-secondary);
}
```

---

## 7. `tools.ts` 등록

```ts
{
  slug: "overseas-travel-cost",
  title: "해외여행 총비용 계산기",
  description: "항공·숙박·식비·교통·관광·보험·비상금까지 포함한 현실적인 여행 총예산을 계산합니다.",
  category: "여행",
  order: 60,
  badges: ["신규"],
  previewStats: [
    { label: "일본 3박4일", value: "약 140만원~" },
    { label: "동남아 4박5일", value: "약 100만원~" },
    { label: "유럽 6박8일", value: "약 400만원~" },
  ],
},
```

---

## 8. `sitemap.xml` 추가

```xml
<url>
  <loc>https://bigyocalc.com/tools/overseas-travel-cost/</loc>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

---

## 9. 화면 구성 요약

### 모바일 순서 (1열)

```
[프리셋 칩 행]
[입력: 기본 여행 정보]
[입력: 항공 & 숙박]
[입력: 현지 경비]
[입력: 기타 옵션]
─────────────────────
[KPI 카드 3종: 총비용 / 1인당 / 비상금]
[예산 게이지]
[도넛 차트]
[항목별 상세 표]
[지역별 평균 시세 (접기/펼치기)]
[절감 팁 (접기/펼치기)]
[InfoNotice]
[SeoContent + FAQ]
```

### PC (2컬럼)

```
왼쪽: 입력 패널 (고정 폭 400px 내외)
오른쪽: 결과 패널 (KPI → 게이지 → 도넛 → 표 → 가이드)
```

---

## 10. 구현 순서

1. `src/data/overseasTravelCost.ts` 작성 (프리셋 4종 + 지역가이드 4종 + FAQ)
2. `src/styles/scss/pages/_overseas-travel-cost.scss` 작성 후 `app.scss` import
3. `src/pages/tools/overseas-travel-cost.astro` 작성
4. `public/scripts/overseas-travel-cost.js` 작성
5. `src/data/tools.ts` 에 항목 추가
6. `public/sitemap.xml` 에 URL 추가
7. `npm run build` 빌드 통과 확인
8. 모바일·PC 레이아웃 점검
9. 프리셋 4종 클릭 → 결과 정상 출력 확인
10. 예산 게이지 3가지 상태(여유/적정/초과) 확인

---

## 11. QA 포인트

| 체크 항목 | 기준 |
|----------|------|
| 프리셋 클릭 | 모든 input에 값 반영되고 즉시 계산됨 |
| 인원수 변경 | 객실 수 자동 조정 (1~2명→1실, 3명 이상→2실) |
| 보험 toggle off | 보험료 입력 숨김, 계산에서 0원 처리 |
| 예산 0 입력 | 게이지 영역 hidden 처리 |
| 예산 초과 시 | 게이지 빨강, 메시지 "초과" 표시 |
| 도넛 차트 | 0원 항목은 legend에서 제외 또는 투명 처리 |
| URL 공유 | 파라미터 복원 후 계산 결과 동일 출력 |
| 모바일 | 입력 필드 터치 편의성 확인 (font-size 16px 이상으로 iOS zoom 방지) |
| 빌드 | `npm run build` 경고 없이 통과 |

---

## 12. 주의사항

- 계산 결과는 항상 "참고용 추정치"로 명시
- 지역 평균값은 "이 값은 참고용입니다" 문구 필수
- 입력값 NaN/음수/0 방어 철저히
- iOS Safari에서 `input[type=number]` 확대 방지: `font-size: 16px` 이상 유지
- Chart.js CDN은 `<script type="module">` 보다 반드시 먼저 로드
