# 2026 지방선거 교육감 당선자 지도 — 설계 문서

> 기획 원문: `docs/plan/202606/local-election-superintendent-2026.md`
> 작성일: 2026-06-04
> 콘텐츠 유형: `/reports/` 인터랙티브 리포트
> 구현 기준: 2026.06.04 개표율 99.79% 기준 확정 데이터 반영 (서울 정근식 확정, 나머지 16개 시도 TODO)

---

## 1. 문서 개요

- 구현 대상: `2026 지방선거 교육감 당선자 — 17개 시도 진보/보수 성향 지도`
- slug: `local-election-superintendent-2026`
- URL: `/reports/local-election-superintendent-2026/`
- 카테고리: 정치·선거
- 핵심 검색 의도: `2026 교육감 선거 결과`, `교육감 당선자`, `서울 교육감`, `정근식 당선`, `진보 보수 교육감`
- 핵심 출력: 17개 시도 교육감 당선자 SVG 클릭 지도 + 진보/보수 성향 분류
- 안전 장치: 미확정 교육감은 `확정대기` 배지, 성향 분류에 주관적 판단 포함 안내

---

## 2. 구현 파일 구조

```text
src/
  data/
    localElectionSuperintendent2026.ts   # 교육감 데이터 + 타입 정의
  pages/
    reports/
      local-election-superintendent-2026.astro

public/
  scripts/
    local-election-superintendent-2026.js  # SVG 재사용 + 교육감 전용 인터랙션

src/styles/scss/pages/
  _local-election-superintendent-2026.scss
```

### 시도지사 SVG 재사용 전략

교육감 지도는 시도지사 지도(`local-election-governor-2026.astro`)와 동일한 SVG 구조를 사용한다.

- SVG path id는 동일 (`seoul`, `busan`, ..., `jeju`)
- JS는 별도 파일이나 `initGovMap()` 패턴을 그대로 적용 (`initEduMap()` 명칭만 변경)
- CSS 변수만 다름: 민주/국힘 색 대신 `--edu-progressive` / `--edu-conservative` 사용
- 데이터 소스만 `window.GOV_DATA` → `window.EDU_DATA`로 교체

추가 등록 필수:

- `src/data/reports.ts` — 항목 추가
- `src/pages/reports/index.astro` — `정치·선거` 카테고리
- `src/pages/index.astro` — 홈 노출
- `src/styles/app.scss` — `@use 'scss/pages/local-election-superintendent-2026';`
- `public/sitemap.xml`
- `public/og/reports/local-election-superintendent-2026.png`

---

## 3. 레이아웃 방향

- `ReportShell` 기반 인터랙티브 리포트 페이지
- 시도지사 SVG 지도 컴포넌트 재사용
- 진보(파랑) / 보수(빨강) / 중도(보라) 색상 체계
- SCSS prefix: `edu-`
- pageClass: `edu-page`
- 패널 구조: 교육감명 + 성향 배지 + 핵심 교육 공약 accordion

---

## 4. 페이지 IA (섹션 A~J)

### A. Hero
- H1: `2026 지방선거 교육감 당선자 — 17개 시도 진보·보수 성향 지도`
- 서브: `지도에서 지역을 클릭하면 교육감 성향·이력·공약이 한눈에 보입니다.`
- 기준일 배지: `2026.06.04 개표율 99.79% 기준`

### B. InfoNotice
- 안내문: `서울 정근식(진보, 재선) 외 16개 시도 교육감은 선관위 최종 발표 후 업데이트됩니다.`
- 성향 분류 기준 안내: 후보자 공약·소속 단체·언론 보도 종합 기준이며 공식 정치 정당 기준이 아님
- 출처: 선관위 당선인 조회 링크

### C. KPI 카드
- 서울 확정: 정근식 (진보)
- 나머지 16개 시도: 확정대기
- 교육감 선거 특징: 정당 표시 없는 선거

### D. SVG 인터랙티브 지도 (시도지사 SVG 재사용)
- 17개 시도 SVG (16개 시도지사 지도에 세종 포함 → 동일 구조)
- 성향별 색상: 진보 `--edu-progressive`, 보수 `--edu-conservative`, 확정대기 `--edu-pending`
- 호버 툴팁: 교육감명 + 성향
- 클릭 → 상세 패널

### E. 교육감 상세 패널
- 이름 + 성향 배지
- 이력 타임라인
- 핵심 교육 공약 (accordion)
- 교육감 선거 공약마당 링크

### F. 탭 전환 (모바일)
- 지도 보기 / 목록 보기 탭

### G. 진보/보수 현황 차트
- 성향별 교육감 수 bar chart (확정 데이터 기준)

### H. FAQ
- Q: 교육감은 정당 소속이 없나요?
- Q: 진보·보수 분류 기준은 무엇인가요?
- Q: 정근식은 어떤 교육정책을 추진했나요?

### I. 관련 링크
- 시도지사 지도, 서울 구청장 지도, 재보궐 당선자

### J. SeoContent
- 서울 정근식 교육감 상세 텍스트 (SEO)

---

## 5. TypeScript 타입 정의

파일: `src/data/localElectionSuperintendent2026.ts`

```typescript
export type EduOrientation = "진보" | "보수" | "중도" | "확정대기";
export type ResultBadge = "확정" | "확정대기" | "재선";

export interface EduPledge {
  category:
    | "교육과정"
    | "학생인권"
    | "교원처우"
    | "학교시설"
    | "돌봄"
    | "직업교육"
    | "디지털교육"
    | "기타";
  title: string;
  description: string;
}

export interface EduSuperintendent {
  regionId: string;         // SVG path id (시도지사 지도와 동일)
  regionName: string;
  regionNameKo: string;
  name: string;
  orientation: EduOrientation;
  badge: ResultBadge;
  voteShare: number;        // 0이면 미확정
  career: string[];
  pledges: EduPledge[];
  isReelection: boolean;
  noteDate: string;
  sources: { label: string; url: string }[];
}

export interface EduPageData {
  electionName: string;
  electionDate: string;
  dataAsOf: string;
  totalRegions: number;
  progressiveCount: number;
  conservativeCount: number;
  pendingCount: number;
  superintendents: EduSuperintendent[];
}
```

---

## 6. 실제 데이터

```typescript
export const SUPERINTENDENT_DATA_2026: EduPageData = {
  electionName: "제9회 전국동시지방선거 — 시도교육감선거",
  electionDate: "2026-06-04",
  dataAsOf: "2026-06-04 개표율 99.79%",
  totalRegions: 17,
  progressiveCount: 1,    // 현재 확정: 서울만 확정
  conservativeCount: 0,   /* TODO: 선관위 확정 후 업데이트 */
  pendingCount: 16,

  superintendents: [
    // ─────────────────────────────────────────
    // 서울 — 정근식 (진보, 재선) ✅ 확정
    // ─────────────────────────────────────────
    {
      regionId: "seoul",
      regionName: "Seoul",
      regionNameKo: "서울",
      name: "정근식",
      orientation: "진보",
      badge: "재선",
      voteShare: 0, /* TODO: 선관위 확정 후 득표율 업데이트 */
      career: [
        "서울대학교 사회학과 교수 (1994~2022)",
        "서울시 교육감 당선 (2022년 제8회 지방선거)",
        "서울시 교육감 재선 당선 (2026년 제9회 지방선거)",
        "전국교직원노동조합 지지 기반",
        "서울특별시교육청 교육감 (2022~현재)",
      ],
      pledges: [
        /* TODO: 선관위 공약마당 확인 후 상세 업데이트 */
        {
          category: "학생인권",
          title: "서울 학생인권 조례 유지·강화",
          description: "학생인권조례 수호 및 학교 민주주의 확산",
        },
        {
          category: "교육과정",
          title: "혁신학교 정책 지속 추진",
          description: "서울형 혁신학교 확대 및 질 관리 강화",
        },
        {
          category: "돌봄",
          title: "방과후·돌봄 공공화",
          description: "방과후학교 및 초등돌봄교실 공공 운영 체계 강화",
        },
      ],
      isReelection: true,
      noteDate: "2026-06-04",
      sources: [
        { label: "선관위 당선인 정보", url: "https://info.nec.go.kr" },
        { label: "서울시교육청", url: "https://www.sen.go.kr" },
      ],
    },

    // ─────────────────────────────────────────
    // 나머지 16개 시도 — TODO
    // ─────────────────────────────────────────
    {
      regionId: "busan",
      regionName: "Busan",
      regionNameKo: "부산",
      name: "TODO", /* TODO: 선관위 확정 후 업데이트 */
      orientation: "확정대기",
      badge: "확정대기",
      voteShare: 0,
      career: [],
      pledges: [{ category: "기타", title: "TODO", description: "선관위 공약마당 확인 후 기재" }] as EduPledge[],
      isReelection: false, /* TODO */
      noteDate: "2026-06-04",
      sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
    },
    {
      regionId: "daegu",
      regionName: "Daegu",
      regionNameKo: "대구",
      name: "TODO",
      orientation: "확정대기", badge: "확정대기", voteShare: 0,
      career: [],
      pledges: [{ category: "기타", title: "TODO", description: "TODO" }] as EduPledge[],
      isReelection: false, noteDate: "2026-06-04",
      sources: [{ label: "선관위", url: "https://info.nec.go.kr" }],
    },
    {
      regionId: "incheon",
      regionName: "Incheon",
      regionNameKo: "인천",
      name: "TODO",
      orientation: "확정대기", badge: "확정대기", voteShare: 0,
      career: [],
      pledges: [{ category: "기타", title: "TODO", description: "TODO" }] as EduPledge[],
      isReelection: false, noteDate: "2026-06-04",
      sources: [{ label: "선관위", url: "https://info.nec.go.kr" }],
    },
    {
      regionId: "gwangju_jeonnam",
      regionName: "Gwangju·Jeonnam",
      regionNameKo: "광주·전남",
      name: "TODO",
      orientation: "확정대기", badge: "확정대기", voteShare: 0,
      career: [],
      pledges: [{ category: "기타", title: "TODO", description: "TODO" }] as EduPledge[],
      isReelection: false, noteDate: "2026-06-04",
      sources: [{ label: "선관위", url: "https://info.nec.go.kr" }],
    },
    {
      regionId: "daejeon",
      regionName: "Daejeon",
      regionNameKo: "대전",
      name: "TODO",
      orientation: "확정대기", badge: "확정대기", voteShare: 0,
      career: [],
      pledges: [{ category: "기타", title: "TODO", description: "TODO" }] as EduPledge[],
      isReelection: false, noteDate: "2026-06-04",
      sources: [{ label: "선관위", url: "https://info.nec.go.kr" }],
    },
    {
      regionId: "ulsan",
      regionName: "Ulsan",
      regionNameKo: "울산",
      name: "TODO",
      orientation: "확정대기", badge: "확정대기", voteShare: 0,
      career: [],
      pledges: [{ category: "기타", title: "TODO", description: "TODO" }] as EduPledge[],
      isReelection: false, noteDate: "2026-06-04",
      sources: [{ label: "선관위", url: "https://info.nec.go.kr" }],
    },
    {
      regionId: "sejong",
      regionName: "Sejong",
      regionNameKo: "세종",
      name: "TODO",
      orientation: "확정대기", badge: "확정대기", voteShare: 0,
      career: [],
      pledges: [{ category: "기타", title: "TODO", description: "TODO" }] as EduPledge[],
      isReelection: false, noteDate: "2026-06-04",
      sources: [{ label: "선관위", url: "https://info.nec.go.kr" }],
    },
    {
      regionId: "gyeonggi",
      regionName: "Gyeonggi",
      regionNameKo: "경기",
      name: "TODO",
      orientation: "확정대기", badge: "확정대기", voteShare: 0,
      career: [],
      pledges: [{ category: "기타", title: "TODO", description: "TODO" }] as EduPledge[],
      isReelection: false, noteDate: "2026-06-04",
      sources: [{ label: "선관위", url: "https://info.nec.go.kr" }],
    },
    {
      regionId: "gangwon",
      regionName: "Gangwon",
      regionNameKo: "강원",
      name: "TODO",
      orientation: "확정대기", badge: "확정대기", voteShare: 0,
      career: [],
      pledges: [{ category: "기타", title: "TODO", description: "TODO" }] as EduPledge[],
      isReelection: false, noteDate: "2026-06-04",
      sources: [{ label: "선관위", url: "https://info.nec.go.kr" }],
    },
    {
      regionId: "chungbuk",
      regionName: "Chungbuk",
      regionNameKo: "충북",
      name: "TODO",
      orientation: "확정대기", badge: "확정대기", voteShare: 0,
      career: [],
      pledges: [{ category: "기타", title: "TODO", description: "TODO" }] as EduPledge[],
      isReelection: false, noteDate: "2026-06-04",
      sources: [{ label: "선관위", url: "https://info.nec.go.kr" }],
    },
    {
      regionId: "chungnam",
      regionName: "Chungnam",
      regionNameKo: "충남",
      name: "TODO",
      orientation: "확정대기", badge: "확정대기", voteShare: 0,
      career: [],
      pledges: [{ category: "기타", title: "TODO", description: "TODO" }] as EduPledge[],
      isReelection: false, noteDate: "2026-06-04",
      sources: [{ label: "선관위", url: "https://info.nec.go.kr" }],
    },
    {
      regionId: "jeonbuk",
      regionName: "Jeonbuk",
      regionNameKo: "전북",
      name: "TODO",
      orientation: "확정대기", badge: "확정대기", voteShare: 0,
      career: [],
      pledges: [{ category: "기타", title: "TODO", description: "TODO" }] as EduPledge[],
      isReelection: false, noteDate: "2026-06-04",
      sources: [{ label: "선관위", url: "https://info.nec.go.kr" }],
    },
    {
      regionId: "gyeongbuk",
      regionName: "Gyeongbuk",
      regionNameKo: "경북",
      name: "TODO",
      orientation: "확정대기", badge: "확정대기", voteShare: 0,
      career: [],
      pledges: [{ category: "기타", title: "TODO", description: "TODO" }] as EduPledge[],
      isReelection: false, noteDate: "2026-06-04",
      sources: [{ label: "선관위", url: "https://info.nec.go.kr" }],
    },
    {
      regionId: "gyeongnam",
      regionName: "Gyeongnam",
      regionNameKo: "경남",
      name: "TODO",
      orientation: "확정대기", badge: "확정대기", voteShare: 0,
      career: [],
      pledges: [{ category: "기타", title: "TODO", description: "TODO" }] as EduPledge[],
      isReelection: false, noteDate: "2026-06-04",
      sources: [{ label: "선관위", url: "https://info.nec.go.kr" }],
    },
    {
      regionId: "jeju",
      regionName: "Jeju",
      regionNameKo: "제주",
      name: "TODO",
      orientation: "확정대기", badge: "확정대기", voteShare: 0,
      career: [],
      pledges: [{ category: "기타", title: "TODO", description: "TODO" }] as EduPledge[],
      isReelection: false, noteDate: "2026-06-04",
      sources: [{ label: "선관위", url: "https://info.nec.go.kr" }],
    },
  ],
};
```

---

## 7. 진보/보수 성향 색상 CSS 변수

```scss
:root {
  --edu-progressive: #2196F3;         // 진보 — 파랑
  --edu-progressive-light: #E3F2FD;
  --edu-progressive-hover: #1565C0;
  --edu-conservative: #FF5722;        // 보수 — 주황빨
  --edu-conservative-light: #FBE9E7;
  --edu-conservative-hover: #BF360C;
  --edu-moderate: #9C27B0;            // 중도 — 보라
  --edu-moderate-light: #F3E5F5;
  --edu-pending: #B0BEC5;             // 확정대기 — 회색
  --edu-pending-light: #ECEFF1;
  --edu-reelection-badge: #FF9800;    // 재선 배지
}
```

---

## 8. JS 인터랙션 전체 코드 (시도지사 지도 JS 재사용 전략)

파일: `public/scripts/local-election-superintendent-2026.js`

시도지사 지도 JS(`local-election-governor-2026.js`)의 함수명 패턴을 그대로 적용하되 `GOV_` → `EDU_`, `gov-` → `edu-` 로 교체한다.

```javascript
// ============================================================
// local-election-superintendent-2026.js
// 17개 시도 교육감 SVG 지도 인터랙션
// 시도지사 지도 JS(local-election-governor-2026.js) 패턴 재사용
// ============================================================

const EDU_MAP = {
  svgEl: null,
  panelEl: null,
  tooltipEl: null,
  activeRegionId: null,
};

// ------ 초기화 ------

function initEduMap() {
  EDU_MAP.svgEl = document.getElementById('edu-map-svg');
  EDU_MAP.panelEl = document.getElementById('edu-panel');
  EDU_MAP.tooltipEl = document.getElementById('edu-tooltip');

  if (!EDU_MAP.svgEl) return;

  const regions = EDU_MAP.svgEl.querySelectorAll('.edu-map__region');
  regions.forEach((path) => {
    path.addEventListener('mouseenter', onEduRegionHover);
    path.addEventListener('mouseleave', onEduRegionLeave);
    path.addEventListener('click', onEduRegionClick);
    path.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onEduRegionClick(e); }
    });
  });

  initEduMapTabs();

  const hash = location.hash.replace('#', '');
  if (hash) openEduPanel(hash);

  initEduChart();
}

// ------ 툴팁 ------

function onEduRegionHover(e) {
  const regionId = e.currentTarget.dataset.regionId;
  const data = getEduData(regionId);
  if (!data || !EDU_MAP.tooltipEl) return;

  const orientationClass = getOrientationClass(data.orientation);
  EDU_MAP.tooltipEl.innerHTML = `
    <span class="edu-tooltip__region">${data.regionNameKo}</span>
    <span class="edu-tooltip__name">${data.name === 'TODO' ? '확정대기' : data.name}</span>
    <span class="edu-tooltip__orientation edu-tooltip__orientation--${orientationClass}">${data.orientation}</span>
  `;
  EDU_MAP.tooltipEl.classList.add('is-visible');
  const rect = EDU_MAP.svgEl.getBoundingClientRect();
  EDU_MAP.tooltipEl.style.transform = `translate(${e.clientX - rect.left + 12}px, ${e.clientY - rect.top - 8}px)`;
}

function onEduRegionLeave() {
  if (EDU_MAP.tooltipEl) EDU_MAP.tooltipEl.classList.remove('is-visible');
}

// ------ 패널 오픈/클로즈 ------

function onEduRegionClick(e) {
  const regionId = e.currentTarget.dataset.regionId;
  if (EDU_MAP.activeRegionId === regionId) { closeEduPanel(); return; }
  openEduPanel(regionId);
}

function openEduPanel(regionId) {
  const data = getEduData(regionId);
  if (!data || !EDU_MAP.panelEl) return;

  EDU_MAP.activeRegionId = regionId;
  renderEduPanel(data);
  EDU_MAP.panelEl.classList.add('is-open');

  document.querySelectorAll('.edu-map__region').forEach((el) => {
    el.classList.toggle('is-active', el.dataset.regionId === regionId);
  });

  history.replaceState(null, '', `#${regionId}`);
  if (window.innerWidth < 768) {
    EDU_MAP.panelEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function closeEduPanel() {
  EDU_MAP.activeRegionId = null;
  if (EDU_MAP.panelEl) EDU_MAP.panelEl.classList.remove('is-open');
  document.querySelectorAll('.edu-map__region.is-active').forEach((el) => el.classList.remove('is-active'));
  history.replaceState(null, '', location.pathname);
}

// ------ 패널 렌더링 ------

function renderEduPanel(data) {
  const panel = EDU_MAP.panelEl;
  const orientationClass = getOrientationClass(data.orientation);
  const nameText = data.name === 'TODO'
    ? '<span class="edu-badge edu-badge--pending">확정대기</span>'
    : data.name;
  const voteText = data.voteShare > 0 ? `${data.voteShare}%` : '<span class="edu-badge edu-badge--pending">확정대기</span>';

  panel.innerHTML = `
    <button type="button" class="edu-panel__close" onclick="closeEduPanel()">✕</button>
    <div class="edu-panel__header">
      <span class="edu-panel__region">${data.regionNameKo}</span>
      <span class="edu-panel__orientation-badge edu-panel__orientation-badge--${orientationClass}">${data.orientation}</span>
      ${data.isReelection ? '<span class="edu-panel__reelection-badge">재선</span>' : ''}
    </div>
    <h2 class="edu-panel__name">${nameText}</h2>
    <div class="edu-panel__vote">
      <span class="edu-panel__vote-label">득표율</span>
      <span class="edu-panel__vote-value">${voteText}</span>
    </div>
    ${data.career.length > 0 ? `
      <div class="edu-panel__career">
        <h3 class="edu-panel__section-title">이력</h3>
        <ul>${data.career.map((c) => `<li>${c}</li>`).join('')}</ul>
      </div>
    ` : ''}
    <div class="edu-panel__pledges">
      <h3 class="edu-panel__section-title">핵심 교육 공약</h3>
      ${data.pledges.map((p, i) => `
        <details class="edu-panel__pledge" ${i === 0 ? 'open' : ''}>
          <summary>
            <span class="edu-panel__pledge-cat">${p.category}</span>
            ${p.title}
          </summary>
          <p>${p.description}</p>
        </details>
      `).join('')}
    </div>
    <a href="https://policy.nec.go.kr" target="_blank" rel="noopener noreferrer" class="edu-panel__source">
      선관위 공약마당에서 전체 공약 보기 →
    </a>
  `;
}

// ------ 모바일 탭 전환 (시도지사 지도 동일 패턴) ------

function initEduMapTabs() {
  const tabMap = document.getElementById('edu-tab-map');
  const tabList = document.getElementById('edu-tab-list');
  const mapView = document.getElementById('edu-map-view');
  const listView = document.getElementById('edu-list-view');
  if (!tabMap || !tabList) return;

  tabMap.addEventListener('click', () => {
    tabMap.classList.add('is-active'); tabList.classList.remove('is-active');
    mapView?.classList.remove('is-hidden'); listView?.classList.add('is-hidden');
  });
  tabList.addEventListener('click', () => {
    tabList.classList.add('is-active'); tabMap.classList.remove('is-active');
    listView?.classList.remove('is-hidden'); mapView?.classList.add('is-hidden');
  });
}

// ------ 차트 ------

function initEduChart() {
  const canvas = document.getElementById('edu-orientation-chart');
  if (!canvas || typeof Chart === 'undefined') return;

  // 현재는 서울(진보 1) + 나머지 미확정 — 확정 후 데이터 업데이트
  const progressiveCount = window.EDU_DATA?.progressiveCount || 0;
  const conservativeCount = window.EDU_DATA?.conservativeCount || 0;
  const pendingCount = window.EDU_DATA?.pendingCount || 0;

  new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: ['진보', '보수', '확정대기'],
      datasets: [{
        data: [progressiveCount, conservativeCount, pendingCount],
        backgroundColor: ['#2196F3', '#FF5722', '#B0BEC5'],
        borderWidth: 2,
        borderColor: '#fff',
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
        tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${ctx.raw}명` } },
      },
    },
  });
}

// ------ 유틸 ------

function getEduData(regionId) {
  return window.EDU_DATA?.superintendents?.find((s) => s.regionId === regionId) || null;
}

function getOrientationClass(orientation) {
  if (orientation === '진보') return 'progressive';
  if (orientation === '보수') return 'conservative';
  if (orientation === '중도') return 'moderate';
  return 'pending';
}

document.addEventListener('DOMContentLoaded', initEduMap);
```

---

## 9. Astro 페이지 구조

파일: `src/pages/reports/local-election-superintendent-2026.astro`

```astro
---
import { SUPERINTENDENT_DATA_2026 } from '../../data/localElectionSuperintendent2026';

const title = '2026 지방선거 교육감 당선자 — 17개 시도 진보·보수 성향 지도';
const description = '서울 정근식(진보, 재선) 등 2026 지방선거 17개 시도 교육감 당선자를 지도에서 클릭해 공약·이력·성향을 한눈에 확인.';
const data = SUPERINTENDENT_DATA_2026;

function getOrientationClass(o: string) {
  if (o === '진보') return 'progressive';
  if (o === '보수') return 'conservative';
  if (o === '중도') return 'moderate';
  return 'pending';
}
---

<!-- 섹션 A: Hero -->
<section class="edu-hero">
  <div class="edu-hero__inner">
    <div class="edu-hero__badge">2026 교육감 선거</div>
    <h1 class="edu-hero__title">{title}</h1>
    <p class="edu-hero__sub">지도에서 지역을 클릭하면 교육감 성향·이력·공약이 한눈에 보입니다.</p>
    <span class="edu-badge edu-badge--info">데이터 기준: {data.dataAsOf}</span>
  </div>
</section>

<!-- 섹션 B: InfoNotice -->
<div class="edu-info-notice">
  <p>
    ⚠️ 서울 정근식(진보, 재선) 확정. 나머지 16개 시도 교육감은 선관위 최종 확인 후 업데이트.
    진보·보수 분류는 후보자 공약·소속 단체 기준이며 공식 정당 소속 기준이 아닙니다.
    <a href="https://info.nec.go.kr" target="_blank" rel="noopener noreferrer">선관위 당선인 조회 →</a>
  </p>
</div>

<!-- 섹션 C: KPI -->
<section class="edu-kpi">
  <div class="edu-kpi-grid">
    <div class="edu-kpi-card edu-kpi-card--progressive">
      <span class="edu-kpi-card__label">진보</span>
      <span class="edu-kpi-card__value">{data.progressiveCount}명</span>
      <span class="edu-kpi-card__sub">서울 정근식 확정</span>
    </div>
    <div class="edu-kpi-card edu-kpi-card--conservative">
      <span class="edu-kpi-card__label">보수</span>
      <span class="edu-kpi-card__value">{data.conservativeCount}명</span>
      <span class="edu-kpi-card__sub">확인 중</span>
    </div>
    <div class="edu-kpi-card edu-kpi-card--pending">
      <span class="edu-kpi-card__label">확정대기</span>
      <span class="edu-kpi-card__value">{data.pendingCount}개 시도</span>
      <span class="edu-kpi-card__sub">선관위 최종 발표 후 업데이트</span>
    </div>
  </div>
</section>

<!-- 섹션 D+E+F: 지도 + 패널 + 탭 -->
<section class="edu-map-section">
  <div class="edu-map-section__inner">

    <!-- 모바일 탭 -->
    <div class="edu-tabs" role="tablist">
      <button id="edu-tab-map" class="edu-tab is-active" role="tab">지도 보기</button>
      <button id="edu-tab-list" class="edu-tab" role="tab">목록 보기</button>
    </div>

    <!-- 지도 범례 (성향별 색상) -->
    <div class="edu-legend">
      <span class="edu-legend__item edu-legend__item--progressive">진보</span>
      <span class="edu-legend__item edu-legend__item--conservative">보수</span>
      <span class="edu-legend__item edu-legend__item--moderate">중도</span>
      <span class="edu-legend__item edu-legend__item--pending">확정대기</span>
    </div>

    <div class="edu-map-layout">
      <!-- 지도 뷰 — 시도지사 SVG와 동일 구조 재사용 -->
      <div id="edu-map-view" class="edu-map">
        <div class="edu-map__wrapper">
          <svg id="edu-map-svg" class="edu-map__svg" viewBox="0 0 600 700"
               xmlns="http://www.w3.org/2000/svg"
               aria-label="17개 시도 교육감 당선자 지도">
            <title>2026 교육감 선거 결과 지도</title>
            {data.superintendents.map((s) => (
              <path
                id={`edu-region-${s.regionId}`}
                data-region-id={s.regionId}
                class={`edu-map__region edu-map__region--${getOrientationClass(s.orientation)}`}
                aria-label={`${s.regionNameKo} — ${s.name === 'TODO' ? '확정대기' : s.name} (${s.orientation})`}
                tabindex="0"
                role="button"
                d="M0 0"
              />
            ))}
          </svg>
          <div id="edu-tooltip" class="edu-tooltip" aria-hidden="true"></div>
        </div>
      </div>

      <!-- 목록 뷰 -->
      <div id="edu-list-view" class="edu-list is-hidden">
        <div class="edu-list__grid">
          {data.superintendents.map((s) => (
            <button
              type="button"
              class={`edu-list__card edu-list__card--${getOrientationClass(s.orientation)}`}
              onclick={`openEduPanel('${s.regionId}')`}
            >
              <span class="edu-list__region">{s.regionNameKo}</span>
              <span class="edu-list__name">{s.name === 'TODO' ? '확정대기' : s.name}</span>
              <span class={`edu-list__orientation edu-list__orientation--${getOrientationClass(s.orientation)}`}>
                {s.orientation}
              </span>
            </button>
          ))}
        </div>
      </div>

      <!-- 상세 패널 -->
      <div id="edu-panel" class="edu-panel" role="dialog" aria-label="교육감 상세 정보">
        <p class="edu-panel__hint">지도에서 지역을 클릭하면 교육감 정보가 표시됩니다.</p>
      </div>
    </div>
  </div>
</section>

<!-- 섹션 G: 차트 -->
<section class="edu-chart-section">
  <h2>교육감 성향별 현황</h2>
  <canvas id="edu-orientation-chart" class="edu-chart"></canvas>
  <p class="edu-chart-section__note">* 서울만 확정. 나머지는 선관위 확정 후 업데이트.</p>
</section>

<!-- 섹션 H: FAQ -->
<section class="edu-faq">
  <h2>자주 묻는 질문</h2>
  <details>
    <summary>교육감은 정당 소속이 없나요?</summary>
    <p>네. 교육감 선거는 정당 공천이 금지되어 있습니다. 후보자는 개인 자격으로 출마하며, 진보·보수 분류는 후보자의 공약, 전교조·교총 지지 여부, 교육 정책 성향 등을 언론·시민사회가 종합 평가한 비공식 분류입니다.</p>
  </details>
  <details>
    <summary>진보·보수 교육감의 차이점은 무엇인가요?</summary>
    <p>일반적으로 진보 교육감은 학생인권 조례 지지, 혁신학교 확대, 비경쟁 교육을 강조하고, 보수 교육감은 학력 신장, 직업교육 강화, 학교 자율화를 강조하는 경향이 있습니다. 그러나 실제 정책은 개인차가 크고, 이분법적 분류에는 한계가 있습니다.</p>
  </details>
  <details>
    <summary>정근식 서울 교육감은 어떤 교육정책을 추진했나요?</summary>
    <p>정근식 교육감(서울대 사회학과 교수 출신)은 2022년 당선 이후 학생인권조례 유지, 서울형 혁신학교 확대, 방과후·돌봄 공공화, 학교 민주주의 강화를 중점 추진했습니다. 2026년 재선으로 정책 연속성을 이어가게 됩니다.</p>
  </details>
</section>

<!-- 섹션 I: 관련 링크 -->
<section class="edu-related">
  <a href="/reports/local-election-governor-2026/">시도지사 당선자 지도 →</a>
  <a href="/reports/local-election-seoul-2026/">서울 구청장 지도 →</a>
  <a href="/reports/local-election-byeollection-2026/">재보궐 당선자 →</a>
</section>

<script define:vars={{ eduData: SUPERINTENDENT_DATA_2026 }}>
  window.EDU_DATA = eduData;
</script>
<script src="/scripts/local-election-superintendent-2026.js"></script>
```

---

## 10. SCSS 전체

파일: `src/styles/scss/pages/_local-election-superintendent-2026.scss`

```scss
// ============================================================
// _local-election-superintendent-2026.scss
// 17개 시도 교육감 당선자 지도
// Prefix: edu-
// 시도지사 SCSS 구조 참고하여 색상 변수만 교체
// ============================================================

.edu-page {
  // 성향 색상 변수
  --edu-progressive: #2196F3;
  --edu-progressive-light: #E3F2FD;
  --edu-progressive-hover: #1565C0;
  --edu-conservative: #FF5722;
  --edu-conservative-light: #FBE9E7;
  --edu-conservative-hover: #BF360C;
  --edu-moderate: #9C27B0;
  --edu-moderate-light: #F3E5F5;
  --edu-pending: #B0BEC5;
  --edu-pending-light: #ECEFF1;
  --edu-reelection-badge: #FF9800;
  --edu-panel-shadow: 0 4px 24px rgba(0,0,0,0.12);
}

// ------ Hero ------
.edu-hero {
  background: linear-gradient(135deg, #1565C0 0%, #283593 100%);
  color: #fff; padding: 2.5rem 1.5rem 2rem; text-align: center;
  &__inner { max-width: 760px; margin: 0 auto; }
  &__badge { display: inline-block; background: rgba(255,255,255,0.2); border-radius: 99px; padding: 0.2rem 0.8rem; font-size: 0.78rem; margin-bottom: 0.6rem; }
  &__title { font-size: clamp(1.25rem, 2.8vw, 1.95rem); font-weight: 800; margin: 0 0 0.6rem; line-height: 1.35; }
  &__sub { font-size: 0.93rem; opacity: 0.85; margin: 0 0 1rem; }
}

.edu-info-notice {
  background: #E8F5E9; border-left: 4px solid #4CAF50; padding: 0.75rem 1.5rem;
  p { font-size: 0.875rem; color: #1B5E20; margin: 0; line-height: 1.6; } a { color: #2E7D32; }
}

// ------ KPI ------
.edu-kpi { padding: 1.5rem; background: #f8f9fa; }
.edu-kpi-grid { max-width: 650px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 0.875rem; }
.edu-kpi-card {
  background: #fff; border-radius: 12px; padding: 1.1rem; text-align: center; box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  &__label { font-size: 0.78rem; color: #777; display: block; }
  &__value { font-size: 1.9rem; font-weight: 900; display: block; }
  &__sub { font-size: 0.72rem; color: #aaa; display: block; }
  &--progressive { border-top: 4px solid var(--edu-progressive); .edu-kpi-card__value { color: var(--edu-progressive); } }
  &--conservative { border-top: 4px solid var(--edu-conservative); .edu-kpi-card__value { color: var(--edu-conservative); } }
  &--pending { border-top: 4px solid var(--edu-pending); .edu-kpi-card__value { color: #78909C; } }
}

// ------ 지도 범례 ------
.edu-legend {
  display: flex; flex-wrap: wrap; gap: 0.75rem; justify-content: center;
  padding: 0.75rem 1.5rem;
  &__item {
    display: flex; align-items: center; gap: 0.35rem; font-size: 0.8rem;
    &::before { content: ''; width: 14px; height: 14px; border-radius: 3px; display: block; }
    &--progressive::before { background: var(--edu-progressive); }
    &--conservative::before { background: var(--edu-conservative); }
    &--moderate::before { background: var(--edu-moderate); }
    &--pending::before { background: var(--edu-pending); }
  }
}

// ------ 지도 ------
.edu-map-section { padding: 1.5rem; &__inner { max-width: 1100px; margin: 0 auto; } }
.edu-tabs { display: none; gap: 0.5rem; margin-bottom: 1rem; @media (max-width: 767px) { display: flex; } }
.edu-tab {
  padding: 0.45rem 1.1rem; border-radius: 99px; border: 2px solid #ddd; background: #fff; cursor: pointer; font-size: 0.875rem;
  &.is-active { border-color: var(--edu-progressive); color: var(--edu-progressive); font-weight: 700; }
}
.edu-map-layout { display: grid; grid-template-columns: 1fr 380px; gap: 2rem; @media (max-width: 900px) { grid-template-columns: 1fr; } }
.edu-map {
  &__wrapper { position: relative; }
  &__svg { width: 100%; height: auto; display: block; }
  &__region {
    fill: var(--edu-pending); stroke: #fff; stroke-width: 1.5px; cursor: pointer; transition: opacity 0.15s;
    &--progressive { fill: var(--edu-progressive); }
    &--conservative { fill: var(--edu-conservative); }
    &--moderate { fill: var(--edu-moderate); }
    &--pending { fill: var(--edu-pending); }
    &:hover { opacity: 0.8; filter: brightness(1.1); }
    &.is-active { stroke: #FFD700; stroke-width: 3px; }
    &:focus-visible { outline: 3px solid #FFD700; }
  }
}

// ------ 툴팁 ------
.edu-tooltip {
  position: absolute; top: 0; left: 0;
  background: rgba(0,0,0,0.85); color: #fff;
  border-radius: 8px; padding: 0.45rem 0.65rem; font-size: 0.8rem;
  pointer-events: none; opacity: 0; transition: opacity 0.15s; white-space: nowrap;
  display: flex; gap: 0.35rem; align-items: center; z-index: 10;
  &.is-visible { opacity: 1; }
  &__region { font-size: 0.72rem; opacity: 0.75; }
  &__name { font-weight: 700; }
  &__orientation {
    font-size: 0.7rem; border-radius: 4px; padding: 0.08rem 0.35rem;
    &--progressive { background: var(--edu-progressive); }
    &--conservative { background: var(--edu-conservative); }
    &--moderate { background: var(--edu-moderate); }
    &--pending { background: var(--edu-pending); color: #333; }
  }
}

// ------ 목록 뷰 ------
.edu-list.is-hidden { display: none; }
.edu-list__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 0.6rem; }
.edu-list__card {
  padding: 0.7rem 0.5rem; border-radius: 8px; border: 2px solid transparent;
  background: #f5f5f5; cursor: pointer; text-align: center;
  display: flex; flex-direction: column; gap: 0.15rem;
  &--progressive { border-left: 3px solid var(--edu-progressive); }
  &--conservative { border-left: 3px solid var(--edu-conservative); }
  &--pending { border-left: 3px solid var(--edu-pending); }
  &:hover { border-color: #ccc; }
}
.edu-list__region { font-size: 0.78rem; font-weight: 700; }
.edu-list__name { font-size: 0.82rem; color: #555; }
.edu-list__orientation {
  font-size: 0.7rem; padding: 0.1rem 0.35rem; border-radius: 4px; display: inline-block; color: #fff;
  &--progressive { background: var(--edu-progressive); }
  &--conservative { background: var(--edu-conservative); }
  &--moderate { background: var(--edu-moderate); }
  &--pending { background: var(--edu-pending); color: #333; }
}

// ------ 패널 ------
.edu-panel {
  background: #fff; border-radius: 16px; box-shadow: var(--edu-panel-shadow);
  padding: 1.5rem; position: sticky; top: 1.5rem; min-height: 200px; border: 1px solid #f0f0f0;
  &__hint { color: #aaa; font-size: 0.9rem; text-align: center; padding: 2rem 0; }
  &__close { position: absolute; top: 0.75rem; right: 0.75rem; background: none; border: none; cursor: pointer; color: #bbb; font-size: 1.05rem; &:hover { color: #333; } }
  &__header { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.4rem; }
  &__region { font-size: 0.85rem; color: #888; }
  &__orientation-badge {
    font-size: 0.75rem; padding: 0.15rem 0.55rem; border-radius: 99px; font-weight: 700; color: #fff;
    &--progressive { background: var(--edu-progressive); }
    &--conservative { background: var(--edu-conservative); }
    &--moderate { background: var(--edu-moderate); }
    &--pending { background: var(--edu-pending); color: #333; }
  }
  &__reelection-badge { font-size: 0.72rem; padding: 0.12rem 0.45rem; border-radius: 99px; background: var(--edu-reelection-badge); color: #fff; font-weight: 700; }
  &__name { font-size: 1.5rem; font-weight: 800; margin: 0 0 0.5rem; }
  &__vote { font-size: 0.88rem; color: #666; margin-bottom: 0.75rem; display: flex; gap: 0.4rem; align-items: center; }
  &__vote-label { color: #aaa; }
  &__vote-value { font-weight: 700; }
  &__section-title { font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: #aaa; letter-spacing: 0.04em; margin: 0.875rem 0 0.4rem; }
  &__career ul { margin: 0; padding-left: 1.1rem; li { font-size: 0.82rem; color: #555; margin-bottom: 0.2rem; } }
  &__pledge { border: 1px solid #eee; border-radius: 7px; margin-bottom: 0.4rem; summary { padding: 0.5rem 0.7rem; cursor: pointer; font-size: 0.85rem; display: flex; gap: 0.35rem; align-items: center; } p { font-size: 0.8rem; color: #555; padding: 0.4rem 0.7rem 0.6rem; margin: 0; } }
  &__pledge-cat { font-size: 0.68rem; background: #f0f0f0; border-radius: 3px; padding: 0.08rem 0.3rem; color: #666; }
  &__source { display: block; margin-top: 1rem; font-size: 0.8rem; color: var(--edu-progressive); text-decoration: none; &:hover { text-decoration: underline; } }

  @media (max-width: 900px) {
    position: fixed; bottom: 0; left: 0; right: 0;
    border-radius: 20px 20px 0 0; transform: translateY(100%);
    transition: transform 0.3s; z-index: 100; max-height: 80vh; overflow-y: auto;
    &.is-open { transform: translateY(0); }
  }
}

// ------ 배지 ------
.edu-badge {
  display: inline-block; border-radius: 99px; padding: 0.12rem 0.5rem; font-size: 0.72rem; font-weight: 600;
  &--pending { background: #FF9800; color: #fff; }
  &--info { background: rgba(255,255,255,0.25); color: #fff; border: 1px solid rgba(255,255,255,0.4); }
}

// ------ 차트 ------
.edu-chart-section { padding: 2rem 1.5rem; background: #f8f9fa; text-align: center; h2 { font-size: 1rem; margin-bottom: 1.25rem; } &__note { font-size: 0.78rem; color: #aaa; margin-top: 0.75rem; } }
.edu-chart { max-height: 240px; max-width: 260px; margin: 0 auto; display: block; }

// ------ FAQ ------
.edu-faq { padding: 2rem 1.5rem; max-width: 720px; margin: 0 auto; h2 { font-size: 1.1rem; font-weight: 800; margin-bottom: 1rem; } details { border-bottom: 1px solid #eee; padding: 0.875rem 0; summary { cursor: pointer; font-weight: 600; font-size: 0.92rem; } p { margin: 0.5rem 0 0; font-size: 0.85rem; color: #555; line-height: 1.7; } } }

// ------ 관련 링크 ------
.edu-related { display: flex; gap: 0.75rem; flex-wrap: wrap; padding: 1.5rem; background: #f8f9fa; a { background: #fff; border: 1px solid #e8e8e8; border-radius: 9px; padding: 0.75rem 1.1rem; text-decoration: none; color: #333; font-size: 0.88rem; font-weight: 600; &:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.1); } } }
```

---

## 11. `app.scss` 추가 라인

```scss
@use 'scss/pages/local-election-superintendent-2026';
```

---

## 12. `data/reports.ts` 추가 항목

```typescript
{
  id: 'local-election-superintendent-2026',
  title: '2026 지방선거 교육감 당선자 — 17개 시도 진보·보수 성향 지도',
  description: '서울 정근식(진보, 재선) 등 2026 교육감 선거 17개 시도 당선자 성향·이력·공약 지도.',
  category: '정치·선거',
  path: '/reports/local-election-superintendent-2026/',
  publishedAt: '2026-06-04',
  updatedAt: '2026-06-04',
  tags: ['2026지방선거', '교육감', '당선자', '정근식'],
  featured: false,
},
```

---

## 13. `pages/index.astro` 추가 항목

```astro
<ReportCard
  title="2026 교육감 당선자 — 17개 시도 성향 지도"
  path="/reports/local-election-superintendent-2026/"
  badge="NEW"
  description="서울 정근식(진보, 재선) 등 전국 교육감 성향·공약 지도"
/>
```

---

## 14. 데이터 업데이트 가이드

### 16개 시도 교육감 확정 시

파일: `src/data/localElectionSuperintendent2026.ts`

각 TODO 시도마다:

1. `name` → 실제 교육감 이름
2. `orientation` → `"진보"` 또는 `"보수"` 또는 `"중도"`
3. `badge` → `"확정"` 또는 `"재선"`
4. `voteShare` → 실제 득표율
5. `career` → 교육감 이력 배열
6. `pledges` → 교육 공약 3개
7. `isReelection` → 재선 여부 `true` / `false`

```typescript
// 수정 전 (예: 부산)
{ name: "TODO", orientation: "확정대기", badge: "확정대기", voteShare: 0 }

// 수정 후
{ name: "홍길순", orientation: "보수", badge: "확정", voteShare: 54.2 }
```

### 성향별 집계 카운트 업데이트

```typescript
// SUPERINTENDENT_DATA_2026 최상단 필드
progressiveCount: 1,    // 확정된 진보 교육감 수로 업데이트
conservativeCount: 0,   // 확정된 보수 교육감 수로 업데이트
pendingCount: 16,       // 미확정 수로 업데이트
```

### 서울 정근식 득표율 확정 시

```typescript
// superintendents[0] (서울)
voteShare: 실제득표율,  // 0 → 실제 득표율
```

### `dataAsOf` 최종 업데이트

```typescript
dataAsOf: "2026-06-XX 선관위 최종 확정",
```

---

## 15. 시도지사 SVG 재사용 체크리스트

시도지사 지도 SVG 구현 완료 후 교육감 지도에서:

- [ ] 동일한 SVG path 데이터 복사 (17개 시도 — 시도지사 16개 + 세종 별도 path 확인)
- [ ] `id` 속성: `gov-region-{id}` → `edu-region-{id}` 로 교체
- [ ] `class` 속성: `gov-map__region` → `edu-map__region` 로 교체
- [ ] `data-region-id` 속성: 동일하게 유지
- [ ] CSS fill 변수: 정당 색 → 성향 색 (`--edu-progressive`, `--edu-conservative`, `--edu-pending`)
- [ ] JS 전역 변수: `GOV_MAP` → `EDU_MAP`, `window.GOV_DATA` → `window.EDU_DATA`
- [ ] 함수명: `initGovMap()` → `initEduMap()`, `openGovPanel()` → `openEduPanel()` 등
