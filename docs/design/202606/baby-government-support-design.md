# 육아 정부지원금 통합 계산기 설계 문서

> 기획 원본: `docs/plan/202606/baby-government-support-total-plan.md`  
> 작성일: 2026-06-18  
> slug: `baby-government-support` / prefix: `bgs-`

---

## 1. 파일 구성

| 파일 | 경로 |
|------|------|
| 데이터 | `src/data/babyGovernmentSupport.ts` |
| 페이지 | `src/pages/tools/baby-government-support.astro` |
| 스크립트 | `public/scripts/baby-government-support.js` |
| 스타일 | `src/styles/scss/pages/_baby-government-support.scss` |
| tools.ts 등록 | `src/data/tools.ts` |
| sitemap | `public/sitemap.xml` |
| app.scss | `src/styles/app.scss` |

---

## 2. 데이터 파일: `src/data/babyGovernmentSupport.ts`

```typescript
// 부모급여 (0세: 100만, 1세: 50만)
export const BGS_PARENTAL_BENEFIT = {
  age0: 1000000,
  age1: 500000,
};

// 아동수당 (0~7세, 월 10만)
export const BGS_CHILD_ALLOWANCE = {
  monthly: 100000,
  maxAgeYear: 7, // 만 8세 미만
};

// 첫만남이용권 (출생순위별 1회성)
export const BGS_FIRST_MEETING = {
  first: 2000000,
  second: 3000000,
  thirdPlus: 3000000,
};

// 보육료 지원 (어린이집 이용 시 월별)
export const BGS_DAYCARE_SUBSIDY: Record<string, number> = {
  age0: 540000,
  age1: 475000,
  age2: 394000,
  age3to5: 280000,
};

// 유아학비 지원 (유치원 이용 시 월별)
export const BGS_KINDERGARTEN_SUBSIDY: Record<string, number> = {
  age3to5: 280000,
};

// 가정양육수당 (어린이집 미이용 시 월별)
export const BGS_HOME_CARE_ALLOWANCE: Record<string, number> = {
  age0: 200000,
  age1: 150000,
  age2: 100000,
};

// 임신·출산 진료비 (국민행복카드, 1회성)
export const BGS_PREGNANCY_MEDICAL = {
  single: 1000000,
  multiple: 1400000,
};

// 지자체 출산장려금 (광역시도 × 출생순위)
export const BGS_LOCAL_SUBSIDY: Record<string, [number, number, number]> = {
  // [첫째, 둘째, 셋째+] 단위: 만원
  서울: [200, 300, 500],
  경기: [100, 300, 500],
  인천: [100, 300, 500],
  부산: [100, 200, 300],
  대구: [100, 200, 300],
  광주: [100, 200, 300],
  대전: [100, 200, 300],
  울산: [100, 200, 400],
  세종: [200, 400, 600],
  강원: [200, 300, 500],
  충북: [100, 200, 400],
  충남: [100, 300, 500],
  전북: [100, 300, 500],
  전남: [300, 500, 1000],
  경북: [100, 200, 500],
  경남: [100, 200, 500],
  제주: [100, 200, 300],
};

// 나이 구분 키 헬퍼
export type AgeKey = 'age0' | 'age1' | 'age2' | 'age3to5' | 'age6to7' | 'age8plus';

export const BGS_AGE_OPTIONS = [
  { value: 'age0', label: '0세 (0~11개월)' },
  { value: 'age1', label: '1세 (12~23개월)' },
  { value: 'age2', label: '2세 (24~35개월)' },
  { value: 'age3to5', label: '3~5세' },
  { value: 'age6to7', label: '6~7세' },
  { value: 'age8plus', label: '8세 이상' },
];

// 나이별 월 지원금 타임라인 (가정양육 기준, 아동수당 포함)
export const BGS_TIMELINE_HOME = [
  { label: '0세', monthly: 1200000 },  // 부모급여100 + 아동수당10 + 가정양육20
  { label: '1세', monthly: 750000 },   // 부모급여50 + 아동수당10 + 가정양육15
  { label: '2세', monthly: 200000 },   // 아동수당10 + 가정양육10
  { label: '3~5세', monthly: 100000 }, // 아동수당10
  { label: '6~7세', monthly: 100000 }, // 아동수당10
  { label: '8세+', monthly: 0 },
];

// 나이별 월 지원금 타임라인 (어린이집 기준)
export const BGS_TIMELINE_DAYCARE = [
  { label: '0세', monthly: 1640000 },  // 부모급여100 + 아동수당10 + 보육료54
  { label: '1세', monthly: 1075000 },  // 부모급여50 + 아동수당10 + 보육료47.5
  { label: '2세', monthly: 594000 },   // 아동수당10 + 보육료39.4
  { label: '3~5세', monthly: 380000 }, // 아동수당10 + 보육료28
  { label: '6~7세', monthly: 100000 }, // 아동수당10
  { label: '8세+', monthly: 0 },
];

export const BGS_FAQ = [
  {
    question: '부모급여와 보육료 지원을 동시에 받을 수 있나요?',
    answer: '0~1세 아이가 어린이집을 이용하면 부모급여 대신 보육료 지원을 받습니다. 동시 수령은 불가하며, 어린이집을 다니는 경우 보육료가 자동 적용됩니다. 가정에서 돌보는 경우에는 부모급여를 현금으로 받습니다.',
  },
  {
    question: '아동수당은 언제까지 받을 수 있나요?',
    answer: '만 8세 미만(0~7세)까지 매월 10만 원을 받습니다. 출생 후 60일 이내에 읍·면·동 주민센터 또는 복지로 사이트에서 신청해야 소급 지급이 가능합니다.',
  },
  {
    question: '첫만남이용권은 현금인가요?',
    answer: '첫만남이용권은 국민행복카드 바우처로 지급됩니다. 출생 후 1년 이내에 사용 가능하며 유흥·사치업종 등 일부 업종은 사용 제한이 있습니다. 첫째는 200만 원, 둘째부터는 300만 원입니다.',
  },
  {
    question: '지자체 출산장려금은 어떻게 신청하나요?',
    answer: '거주 지역 읍·면·동 주민센터에 출생신고와 함께 또는 별도로 신청합니다. 지자체마다 신청 기한(보통 출생 후 60일~1년)이 다르므로 빠르게 확인하는 것이 좋습니다. 광역 외에 시·군·구에서 추가 지원금을 주는 지역도 있습니다.',
  },
  {
    question: '다둥이(3명 이상)는 추가 혜택이 있나요?',
    answer: '3자녀 이상 다자녀 가정은 공공시설 이용료 할인, 전기요금 월 최대 16,000원 할인, 국가장학금 우선 지원, 7인승 이상 자동차 취득세 면제 등의 추가 혜택이 있습니다. 지자체에 따라 추가 출산장려금도 제공됩니다.',
  },
  {
    question: '보육료와 유아학비 지원의 차이는 무엇인가요?',
    answer: '보육료 지원은 어린이집(보건복지부 소관)을 이용할 때 적용되고, 유아학비는 유치원(교육부 소관)을 이용할 때 적용됩니다. 3~5세 기준 지원 금액은 월 28만 원으로 동일하지만 지원 체계가 다릅니다. 두 기관을 동시에 다닐 수는 없습니다.',
  },
];

export const BGS_SEO = {
  introTitle: '육아 정부지원금, 아이 정보만 입력하면 전부 계산됩니다',
  intro: [
    '아이를 낳으면 정부에서 주는 돈이 많다고 하는데, 정작 얼마나 받는지 한눈에 보기 어렵습니다. 부모급여, 아동수당, 첫만남이용권, 보육료, 지자체 출산장려금까지 제각각 흩어져 있기 때문입니다.',
    '이 계산기는 자녀 수·나이·거주 지역·보육 형태를 입력하면 받을 수 있는 모든 정부 지원금을 합산해 월별·연간·1회성으로 구분해 보여줍니다. 내가 놓치고 있는 지원금이 있는지도 바로 확인할 수 있습니다.',
    '2026년 기준 0세 아이 한 명을 어린이집 없이 가정에서 돌보는 경우 월 최대 110만 원(부모급여 100만 + 아동수당 10만)을 받을 수 있으며, 출생 직후 1회성 지원까지 합치면 500만 원 이상이 됩니다.',
  ],
  inputPoints: [
    '자녀 수와 각 자녀의 나이를 선택하세요 (최대 4명)',
    '거주 지역을 선택하면 지자체 출산장려금이 자동 반영됩니다',
    '보육 형태(가정양육/어린이집/유치원)에 따라 보육료 지원 금액이 달라집니다',
    '소득 구간은 산모·신생아 건강관리 서비스 조건 판별에만 사용됩니다',
  ],
  criteria: [
    '부모급여: 2024년 1월부터 시행. 0세 월 100만 원, 1세 월 50만 원',
    '아동수당: 만 8세 미만(0~7세) 월 10만 원, 소득 기준 없음',
    '첫만남이용권: 출생 후 1회성 바우처. 첫째 200만, 둘째+ 300만',
    '보육료 지원: 어린이집 이용 시 0세 54만, 1세 47.5만, 2세 39.4만, 3~5세 28만',
    '가정양육수당: 어린이집 미이용 시 0세 20만, 1세 15만, 2세 10만',
    '지자체 출산장려금: 광역시도별 상이, 시·군·구에서 추가 지원하는 경우도 있음',
  ],
};
```

---

## 3. 페이지: `src/pages/tools/baby-government-support.astro`

```astro
---
import SimpleToolShell from '../../layouts/SimpleToolShell.astro';
import SeoContent from '../../components/SeoContent.astro';
import { BGS_AGE_OPTIONS, BGS_LOCAL_SUBSIDY, BGS_SEO, BGS_FAQ } from '../../data/babyGovernmentSupport';

const config = {
  localSubsidy: BGS_LOCAL_SUBSIDY,
  ageOptions: BGS_AGE_OPTIONS,
};

const regions = Object.keys(BGS_LOCAL_SUBSIDY);
---

<SimpleToolShell
  calculatorId="baby-government-support"
  pageClass="bgs-page"
  title="육아 정부지원금 계산기 2026 | 부모급여·아동수당·보육료 월 합계 계산"
  description="자녀 수·나이·지역 입력하면 부모급여·아동수당·보육료·출산장려금까지 월별 지원금 총합 바로 계산. 지자체별 출산장려금 자동 반영."
>
  <!-- Aside: 입력 영역 -->
  <div slot="aside">
    <script id="bgsConfig" type="application/json" set:html={JSON.stringify(config)} />

    <!-- 자녀 수 -->
    <div class="bgs-section">
      <label class="bgs-label">자녀 수</label>
      <div class="bgs-child-count-btns">
        {[1,2,3,4].map(n => (
          <button class={`bgs-count-btn${n===1?' is-active':''}`} data-count={n}>{n}명{n===4?'+':''}</button>
        ))}
      </div>
    </div>

    <!-- 자녀별 나이 (동적) -->
    <div id="bgsChildrenInputs" class="bgs-section">
      <!-- JS가 동적으로 렌더링 -->
    </div>

    <!-- 거주 지역 -->
    <div class="bgs-section">
      <label class="bgs-label" for="bgsRegion">거주 지역</label>
      <select id="bgsRegion" class="bgs-select">
        {regions.map(r => <option value={r}>{r}</option>)}
      </select>
    </div>

    <!-- 보육 형태 -->
    <div class="bgs-section">
      <label class="bgs-label">보육 형태</label>
      <div class="bgs-care-btns">
        <button class="bgs-care-btn is-active" data-care="home">가정양육</button>
        <button class="bgs-care-btn" data-care="daycare">어린이집</button>
        <button class="bgs-care-btn" data-care="kindergarten">유치원</button>
      </div>
      <p class="bgs-care-note">※ 0~1세는 어린이집 이용 시 부모급여 대신 보육료 지원 적용</p>
    </div>

    <!-- 소득 구간 -->
    <div class="bgs-section">
      <label class="bgs-label">소득 구간</label>
      <select id="bgsIncome" class="bgs-select">
        <option value="low">중위소득 150% 이하</option>
        <option value="high">중위소득 150% 초과</option>
      </select>
      <p class="bgs-care-note">※ 산모·신생아 건강관리 서비스 조건 판별에만 사용</p>
    </div>
  </div>

  <!-- Main: 결과 영역 -->
  <div slot="main">
    <!-- KPI 3개 -->
    <div class="bgs-kpi-grid">
      <div class="bgs-kpi-card bgs-kpi-card--primary">
        <span class="bgs-kpi-label">이번 달 지원금 합계</span>
        <span id="bgsMonthlyTotal" class="bgs-kpi-value">—</span>
      </div>
      <div class="bgs-kpi-card">
        <span class="bgs-kpi-label">연간 지원금 합계</span>
        <span id="bgsYearlyTotal" class="bgs-kpi-value">—</span>
      </div>
      <div class="bgs-kpi-card">
        <span class="bgs-kpi-label">출생 후 1회성 지원금</span>
        <span id="bgsOneTimeTotal" class="bgs-kpi-value">—</span>
      </div>
    </div>

    <!-- 월별 지원금 상세 테이블 -->
    <div class="bgs-result-block">
      <h3 class="bgs-result-title">월별 지원금 상세</h3>
      <table class="bgs-table" id="bgsMonthlyTable">
        <thead>
          <tr>
            <th>지원금 항목</th>
            <th>월 지급액</th>
            <th>연 지급액</th>
            <th>지급 방식</th>
          </tr>
        </thead>
        <tbody id="bgsMonthlyBody">
          <!-- JS 렌더링 -->
        </tbody>
        <tfoot>
          <tr class="bgs-table-total">
            <td>합계</td>
            <td id="bgsTableMonthSum">—</td>
            <td id="bgsTableYearSum">—</td>
            <td>—</td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- 1회성 지원금 -->
    <div class="bgs-result-block">
      <h3 class="bgs-result-title">출생 후 1회성 지원금</h3>
      <table class="bgs-table" id="bgsOneTimeTable">
        <thead>
          <tr>
            <th>지원금 항목</th>
            <th>금액</th>
            <th>지급 방식</th>
          </tr>
        </thead>
        <tbody id="bgsOneTimeBody">
          <!-- JS 렌더링 -->
        </tbody>
        <tfoot>
          <tr class="bgs-table-total">
            <td>합계</td>
            <td id="bgsOneTimeSum">—</td>
            <td>—</td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- 성장 타임라인 차트 -->
    <div class="bgs-result-block">
      <h3 class="bgs-result-title">자녀 성장에 따른 월 지원금 변화</h3>
      <p class="bgs-chart-note">첫째 자녀 기준 · 선택한 보육 형태 적용</p>
      <div class="bgs-chart-wrap">
        <canvas id="bgsTimelineChart"></canvas>
      </div>
    </div>

    <!-- 다자녀 추가 혜택 (3자녀+ 시 표시) -->
    <div id="bgsMultiChildBenefits" class="bgs-result-block bgs-multi-block is-hidden">
      <h3 class="bgs-result-title">다자녀 추가 혜택 (3자녀 이상)</h3>
      <ul class="bgs-benefit-list">
        <li>공공시설(박물관·수영장 등) 이용료 50% 할인</li>
        <li>전기요금 월 최대 16,000원 할인</li>
        <li>국가장학금 우선 지원 (대학생 자녀)</li>
        <li>7인승 이상 차량 취득세 면제</li>
        <li>지자체별 추가 출산장려금 별도 제공</li>
      </ul>
    </div>

    <!-- SeoContent -->
    <SeoContent
      introTitle={BGS_SEO.introTitle}
      intro={BGS_SEO.intro}
      inputPoints={BGS_SEO.inputPoints}
      criteria={BGS_SEO.criteria}
      faq={BGS_FAQ}
      related={[
        { href: '/tools/birth-support-money/', label: '지자체 출산장려금 상세 계산기' },
        { href: '/tools/parental-leave-pay/', label: '육아휴직 급여 계산기' },
        { href: '/tools/baby-cost-guide-first-year/', label: '육아 첫해 비용 가이드' },
        { href: '/tools/breastfeeding-vs-formula-cost/', label: '모유 vs 분유 비용 비교' },
      ]}
    />
  </div>
</SimpleToolShell>
```

---

## 4. 스크립트: `public/scripts/baby-government-support.js`

### 4-1. 전체 구조 (IIFE)

```javascript
(function () {
  'use strict';

  // Config 주입
  const config = JSON.parse(document.getElementById('bgsConfig').textContent);
  const { localSubsidy, ageOptions } = config;

  // 상태
  const state = {
    childCount: 1,
    children: [{ age: 'age0', birth: 1 }], // birth: 출생순위 (동적 계산)
    region: '서울',
    care: 'home',
    income: 'low',
  };

  // 지원금 데이터 (인라인)
  const DATA = {
    parentalBenefit: { age0: 1000000, age1: 500000 },
    childAllowance: 100000, // 0~7세
    firstMeeting: { 1: 2000000, 2: 3000000, 3: 3000000 },
    daycareSubsidy: { age0: 540000, age1: 475000, age2: 394000, age3to5: 280000 },
    kindergartenSubsidy: { age3to5: 280000 },
    homeCare: { age0: 200000, age1: 150000, age2: 100000 },
    pregnancyMedical: 1000000,
    timeline: {
      home:      [1200000, 750000, 200000, 100000, 100000, 0],
      daycare:   [1640000, 1075000, 594000, 380000, 100000, 0],
      kindergarten: [1200000, 750000, 200000, 380000, 100000, 0],
    },
    timelineLabels: ['0세', '1세', '2세', '3~5세', '6~7세', '8세+'],
  };
```

### 4-2. 자녀 입력 필드 동적 렌더링

```javascript
  function renderChildInputs() {
    const container = document.getElementById('bgsChildrenInputs');
    container.innerHTML = '';
    state.children.forEach((child, i) => {
      const div = document.createElement('div');
      div.className = 'bgs-child-row';
      div.innerHTML = `
        <label class="bgs-label">${state.childCount > 1 ? `${i+1}번째 자녀 나이` : '자녀 나이'}</label>
        <select class="bgs-select bgs-age-select" data-index="${i}">
          ${ageOptions.map(o => `<option value="${o.value}"${child.age===o.value?' selected':''}>${o.label}</option>`).join('')}
        </select>
      `;
      container.appendChild(div);
    });
    container.querySelectorAll('.bgs-age-select').forEach(sel => {
      sel.addEventListener('change', e => {
        state.children[+e.target.dataset.index].age = e.target.value;
        calculate();
      });
    });
  }
```

### 4-3. 계산 함수

```javascript
  function isEligibleForChildAllowance(ageKey) {
    return ['age0','age1','age2','age3to5','age6to7'].includes(ageKey);
  }

  function getMonthlyForChild(child, care) {
    const age = child.age;
    let monthly = 0;

    // 부모급여 (0세, 1세, 가정양육 또는 어린이집이지만 부모급여 우선 확인)
    if (care === 'home') {
      if (age === 'age0') monthly += DATA.parentalBenefit.age0;
      else if (age === 'age1') monthly += DATA.parentalBenefit.age1;
    } else if (care === 'daycare') {
      // 어린이집: 0세·1세는 보육료로 대체
      const sub = DATA.daycareSubsidy[age] || 0;
      if (age === 'age0' || age === 'age1') {
        // 부모급여 대신 보육료
        monthly += sub;
      } else {
        monthly += sub;
      }
    } else if (care === 'kindergarten') {
      if (age === 'age0') monthly += DATA.parentalBenefit.age0;
      else if (age === 'age1') monthly += DATA.parentalBenefit.age1;
      const sub = DATA.kindergartenSubsidy[age] || 0;
      monthly += sub;
    }

    // 가정양육수당 (가정양육, 0~2세)
    if (care === 'home') {
      monthly += DATA.homeCare[age] || 0;
    }

    // 아동수당 (0~7세)
    if (isEligibleForChildAllowance(age)) {
      monthly += DATA.childAllowance;
    }

    return monthly;
  }

  function calcOneTime() {
    const items = [];
    state.children.forEach((child, i) => {
      const birth = i + 1; // 출생순위 = 배열 인덱스+1 (입력 순서 기준)
      const amt = DATA.firstMeeting[Math.min(birth, 2)] || DATA.firstMeeting[2];
      items.push({ label: `첫만남이용권 (${birth}째)`, amount: amt, method: '국민행복카드' });
    });
    // 지자체 출산장려금
    const regionData = localSubsidy[state.region];
    if (regionData) {
      state.children.forEach((child, i) => {
        const birth = i + 1;
        const idx = Math.min(birth - 1, 2);
        const amt = regionData[idx] * 10000;
        if (amt > 0) {
          items.push({ label: `${state.region} 출산장려금 (${birth}째)`, amount: amt, method: '현금' });
        }
      });
    }
    // 임신·출산 진료비
    items.push({ label: '임신·출산 진료비 (국민행복카드)', amount: DATA.pregnancyMedical, method: '바우처' });
    return items;
  }

  function calculate() {
    // 월별 지원금
    const monthlyItems = [];
    let totalMonthly = 0;

    state.children.forEach((child, i) => {
      const monthly = getMonthlyForChild(child, state.care);
      totalMonthly += monthly;
      // 자녀별 항목 분해
      appendMonthlyItems(monthlyItems, child, i, state.care);
    });

    // 1회성
    const oneTimeItems = calcOneTime();
    const totalOneTime = oneTimeItems.reduce((s, x) => s + x.amount, 0);

    renderResults(monthlyItems, oneTimeItems, totalMonthly, totalOneTime);
    renderTimelineChart();
    toggleMultiChildBenefits();
    updateURL();
  }

  function appendMonthlyItems(items, child, idx, care) {
    const age = child.age;
    const prefix = state.childCount > 1 ? `${idx+1}째 ` : '';

    if (care === 'home') {
      if (age === 'age0') items.push({ label: prefix+'부모급여', amount: 1000000, method: '현금' });
      else if (age === 'age1') items.push({ label: prefix+'부모급여', amount: 500000, method: '현금' });
      const hc = DATA.homeCare[age];
      if (hc) items.push({ label: prefix+'가정양육수당', amount: hc, method: '현금' });
    } else if (care === 'daycare') {
      const sub = DATA.daycareSubsidy[age];
      if (sub) items.push({ label: prefix+'보육료 지원', amount: sub, method: '바우처' });
    } else if (care === 'kindergarten') {
      if (age === 'age0') items.push({ label: prefix+'부모급여', amount: 1000000, method: '현금' });
      else if (age === 'age1') items.push({ label: prefix+'부모급여', amount: 500000, method: '현금' });
      const sub = DATA.kindergartenSubsidy[age];
      if (sub) items.push({ label: prefix+'유아학비 지원', amount: sub, method: '바우처' });
    }

    if (isEligibleForChildAllowance(age)) {
      items.push({ label: prefix+'아동수당', amount: 100000, method: '현금' });
    }
  }
```

### 4-4. 렌더링 함수

```javascript
  function fmt(n) { return (n/10000).toFixed(0) + '만원'; }

  function renderResults(monthlyItems, oneTimeItems, totalMonthly, totalOneTime) {
    document.getElementById('bgsMonthlyTotal').textContent = fmt(totalMonthly);
    document.getElementById('bgsYearlyTotal').textContent = fmt(totalMonthly * 12);
    document.getElementById('bgsOneTimeTotal').textContent = fmt(totalOneTime);

    // 월별 테이블
    const tbody = document.getElementById('bgsMonthlyBody');
    tbody.innerHTML = monthlyItems.map(item => `
      <tr>
        <td>${item.label}</td>
        <td class="bgs-num">${fmt(item.amount)}</td>
        <td class="bgs-num">${fmt(item.amount * 12)}</td>
        <td>${item.method}</td>
      </tr>
    `).join('');
    document.getElementById('bgsTableMonthSum').textContent = fmt(totalMonthly);
    document.getElementById('bgsTableYearSum').textContent = fmt(totalMonthly * 12);

    // 1회성 테이블
    const otbody = document.getElementById('bgsOneTimeBody');
    otbody.innerHTML = oneTimeItems.map(item => `
      <tr>
        <td>${item.label}</td>
        <td class="bgs-num">${fmt(item.amount)}</td>
        <td>${item.method}</td>
      </tr>
    `).join('');
    document.getElementById('bgsOneTimeSum').textContent = fmt(totalOneTime);
  }

  function toggleMultiChildBenefits() {
    const block = document.getElementById('bgsMultiChildBenefits');
    if (state.childCount >= 3) block.classList.remove('is-hidden');
    else block.classList.add('is-hidden');
  }
```

### 4-5. 차트 렌더링

```javascript
  let timelineChart = null;

  function renderTimelineChart() {
    const timelineData = DATA.timeline[state.care];

    loadChartJs(() => {
      const ctx = document.getElementById('bgsTimelineChart');
      if (!ctx) return;
      if (timelineChart) timelineChart.destroy();

      timelineChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: DATA.timelineLabels,
          datasets: [{
            label: '월 지원금',
            data: timelineData.map(v => v / 10000),
            borderColor: '#1a56db',
            backgroundColor: 'rgba(26,86,219,0.08)',
            fill: true,
            tension: 0.3,
            pointRadius: 5,
          }],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: ctx => `월 ${ctx.parsed.y}만원`,
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { callback: v => v + '만원' },
            },
          },
        },
      });
    });
  }

  function loadChartJs(cb) {
    if (window.Chart) { cb(); return; }
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js';
    s.onload = cb;
    document.head.appendChild(s);
  }
```

### 4-6. 이벤트 바인딩 + URL 상태

```javascript
  function updateURL() {
    const p = new URLSearchParams();
    p.set('count', state.childCount);
    p.set('ages', state.children.map(c => c.age).join(','));
    p.set('region', state.region);
    p.set('care', state.care);
    p.set('income', state.income);
    history.replaceState(null, '', '?' + p.toString());
  }

  function restoreURL() {
    const p = new URLSearchParams(location.search);
    if (p.get('count')) {
      const cnt = +p.get('count');
      state.childCount = cnt;
      const ages = (p.get('ages') || '').split(',');
      state.children = Array.from({ length: cnt }, (_, i) => ({
        age: ages[i] || 'age0',
        birth: i + 1,
      }));
    }
    if (p.get('region') && localSubsidy[p.get('region')]) state.region = p.get('region');
    if (p.get('care')) state.care = p.get('care');
    if (p.get('income')) state.income = p.get('income');
  }

  function bindEvents() {
    // 자녀 수 버튼
    document.querySelectorAll('.bgs-count-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cnt = +btn.dataset.count;
        state.childCount = cnt;
        // 자녀 배열 조정
        while (state.children.length < cnt) state.children.push({ age: 'age0', birth: state.children.length + 1 });
        state.children = state.children.slice(0, cnt);
        document.querySelectorAll('.bgs-count-btn').forEach(b => b.classList.toggle('is-active', +b.dataset.count === cnt));
        renderChildInputs();
        calculate();
      });
    });

    // 지역
    document.getElementById('bgsRegion').addEventListener('change', e => {
      state.region = e.target.value;
      calculate();
    });

    // 보육 형태
    document.querySelectorAll('.bgs-care-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.care = btn.dataset.care;
        document.querySelectorAll('.bgs-care-btn').forEach(b => b.classList.toggle('is-active', b.dataset.care === state.care));
        calculate();
      });
    });

    // 소득 구간
    document.getElementById('bgsIncome').addEventListener('change', e => {
      state.income = e.target.value;
      calculate();
    });
  }

  // 초기화
  restoreURL();
  // UI 동기화
  document.querySelectorAll('.bgs-count-btn').forEach(b => b.classList.toggle('is-active', +b.dataset.count === state.childCount));
  document.querySelectorAll('.bgs-care-btn').forEach(b => b.classList.toggle('is-active', b.dataset.care === state.care));
  if (localSubsidy[state.region]) document.getElementById('bgsRegion').value = state.region;
  renderChildInputs();
  bindEvents();
  calculate();

})();
```

---

## 5. 스타일: `src/styles/scss/pages/_baby-government-support.scss`

```scss
.bgs-page {
  // 섹션 공통
  .bgs-section {
    margin-bottom: 1.25rem;
  }
  .bgs-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-text-secondary);
    margin-bottom: 0.5rem;
  }
  .bgs-select {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    font-size: 0.9rem;
    background: var(--color-surface);
    color: var(--color-text);
  }

  // 자녀 수 버튼
  .bgs-child-count-btns {
    display: flex;
    gap: 0.5rem;
  }
  .bgs-count-btn {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background: var(--color-surface);
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.15s;
    &.is-active {
      background: var(--color-primary);
      color: #fff;
      border-color: var(--color-primary);
      font-weight: 600;
    }
  }

  // 자녀별 row
  .bgs-child-row {
    margin-bottom: 0.75rem;
  }

  // 보육 형태 버튼
  .bgs-care-btns {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }
  .bgs-care-btn {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background: var(--color-surface);
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.15s;
    &.is-active {
      background: var(--color-primary);
      color: #fff;
      border-color: var(--color-primary);
      font-weight: 600;
    }
  }
  .bgs-care-note {
    font-size: 0.78rem;
    color: var(--color-text-secondary);
    margin-top: 0.25rem;
  }

  // KPI 그리드
  .bgs-kpi-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 0.75rem;
    margin-bottom: 1.5rem;

    @media (max-width: 640px) {
      grid-template-columns: 1fr;
    }
  }
  .bgs-kpi-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    padding: 1rem;
    text-align: center;

    &--primary {
      border-color: var(--color-primary);
      background: #eff6ff;
    }
  }
  .bgs-kpi-label {
    display: block;
    font-size: 0.8rem;
    color: var(--color-text-secondary);
    margin-bottom: 0.4rem;
  }
  .bgs-kpi-value {
    display: block;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-primary);
  }

  // 결과 블록
  .bgs-result-block {
    margin-bottom: 2rem;
  }
  .bgs-result-title {
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
    color: var(--color-text);
  }
  .bgs-chart-note {
    font-size: 0.8rem;
    color: var(--color-text-secondary);
    margin-bottom: 0.5rem;
  }

  // 테이블
  .bgs-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;

    th, td {
      padding: 0.5rem 0.75rem;
      border-bottom: 1px solid var(--color-border);
      text-align: left;
    }
    th {
      background: var(--color-surface-alt, #f8fafc);
      font-weight: 600;
      color: var(--color-text-secondary);
    }
    .bgs-num {
      text-align: right;
      font-weight: 600;
    }
    .bgs-table-total td {
      font-weight: 700;
      background: #eff6ff;
      color: var(--color-primary);
    }
  }

  // 차트
  .bgs-chart-wrap {
    height: 280px;
    position: relative;
  }

  // 다자녀 혜택
  .bgs-multi-block {
    background: #f0fdf4;
    border: 1px solid #86efac;
    border-radius: 12px;
    padding: 1rem 1.25rem;
    &.is-hidden { display: none; }
  }
  .bgs-benefit-list {
    margin: 0;
    padding-left: 1.25rem;
    li {
      margin-bottom: 0.4rem;
      font-size: 0.9rem;
    }
  }
}
```

---

## 6. tools.ts 등록

```typescript
{
  slug: 'baby-government-support',
  title: '육아 정부지원금 계산기',
  description: '부모급여·아동수당·보육료·출산장려금 월 합계 계산',
  category: '육아·출산',
  order: 55.5,
  badges: ['NEW', '2026', '통합계산'],
  previewStats: [
    { label: '0세 부모급여', value: '월 100만원' },
    { label: '아동수당', value: '월 10만원' },
    { label: '첫만남이용권', value: '200만원~' },
  ],
},
```

---

## 7. sitemap.xml 추가

```xml
<url>
  <loc>https://bigyocalc.com/tools/baby-government-support/</loc>
  <lastmod>2026-06-18</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.88</priority>
</url>
```

---

## 8. QA 포인트

- [ ] 자녀 수 1→4명 변경 시 나이 입력 필드 정상 추가/제거
- [ ] 어린이집 선택 시 0세 부모급여 → 보육료 자동 전환
- [ ] 지역 변경 시 1회성 테이블 출산장려금 금액 변경 확인
- [ ] 3자녀 이상 시 다자녀 혜택 블록 노출, 2자녀 이하 시 숨김
- [ ] 차트 보육형태(가정/어린이집/유치원) 변경 시 데이터 반영
- [ ] URL 파라미터 복원 (새 탭에서 링크 열었을 때 동일 결과)
- [ ] 모바일 테이블 가로 스크롤 처리
- [ ] `npm run build` 빌드 에러 없음 확인
