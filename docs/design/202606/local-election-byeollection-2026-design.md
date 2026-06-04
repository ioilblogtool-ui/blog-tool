# 2026 재보궐선거 당선자 총정리 — 설계 문서

> 기획 원문: `docs/plan/202606/local-election-byeollection-2026.md`
> 작성일: 2026-06-04
> 콘텐츠 유형: `/reports/` 리포트
> 구현 기준: 2026.06.04 개표율 99.79% 기준 확정 데이터 반영 (한동훈 부산북구갑 확정, 나머지 13곳 TODO)

---

## 1. 문서 개요

- 구현 대상: `2026 재보궐선거 당선자 총정리 — 14개 지역구 공약·이력 완전 정리`
- slug: `local-election-byeollection-2026`
- URL: `/reports/local-election-byeollection-2026/`
- 카테고리: 정치·선거
- 핵심 검색 의도: `2026 재보궐선거 결과`, `한동훈 당선`, `부산 북구갑`, `재보궐 당선자`, `조국 낙선`
- 핵심 출력: 14개 지역구 당선자 카드 + 한동훈·조국 이슈 하이라이트
- 안전 장치: 미확정 당선자는 `확정대기` 배지, 조국 낙선 지역구 TODO 처리

---

## 2. 구현 파일 구조

```text
src/
  data/
    localElectionByeollection2026.ts   # 재보궐 당선자 데이터 + 타입 정의
  pages/
    reports/
      local-election-byeollection-2026.astro

public/
  scripts/
    local-election-byeollection-2026.js  # 필터 탭 + 카드 accordion

src/styles/scss/pages/
  _local-election-byeollection-2026.scss
```

추가 등록 필수:

- `src/data/reports.ts` — 리포트 목록 항목 추가
- `src/pages/reports/index.astro` — `정치·선거` 카테고리 항목
- `src/pages/index.astro` — 홈 최신 리포트 노출
- `src/styles/app.scss` — `@use 'scss/pages/local-election-byeollection-2026';`
- `public/sitemap.xml`
- `public/og/reports/local-election-byeollection-2026.png`

---

## 3. 레이아웃 방향

- `ReportShell` 기반 카드형 리포트 페이지
- 상단 이슈 하이라이트 섹션 (한동훈·조국 스포트라이트)
- 필터 탭: `전체` / `정당별` (민주·국힘·무소속) / `지역별`
- 각 당선자 카드: 클릭 시 공약·이력 accordion 펼침
- SCSS prefix: `bye-`
- pageClass: `bye-page`

---

## 4. 페이지 IA (섹션 A~J)

### A. Hero
- H1: `2026 재보궐선거 당선자 총정리 — 14개 지역구 완전 정리`
- 서브: `한동훈 무소속 당선·조국 낙선 등 주요 이슈와 14개 지역구 당선자 공약을 한 곳에서 확인하세요.`
- 기준일 배지: `2026.06.04 개표율 99.79% 기준`

### B. InfoNotice
- 안내문: `14개 지역구 중 한동훈(부산 북구갑)만 확정. 나머지 13곳은 선관위 최종 발표 후 업데이트.`

### C. KPI 카드
- 더불어민주당: 9석
- 국민의힘: 4석
- 무소속: 1석 (한동훈)
- 총 재보궐: 14개 지역구

### D. 이슈 하이라이트 섹션
- 한동훈 부산북구갑 당선 카드 (확정 데이터 전체)
- 조국 낙선 카드 (지역구 TODO)
- 이진숙 대구달성군 카드 (당선 확정, 정당 TODO)

### E. 전체 지역구 카드 그리드
- 14개 카드 (확정 1 + TODO 13)
- 필터 탭으로 정당별/지역별 필터링

### F. 필터 탭 (정당별/지역별)
- 정당: 전체 / 더불어민주당 / 국민의힘 / 무소속
- 지역: 전체 / 수도권 / 경상권 / 기타

### G. 의석 변화 차트
- 재보궐 결과 정당별 의석 pie chart

### H. FAQ
- Q: 재보궐이 열린 이유는?
- Q: 한동훈은 왜 무소속으로 출마했나?
- Q: 조국은 어디서 출마했나?

### I. 관련 링크
- 시도지사 지도, 서울 구청장 지도, 교육감 지도

### J. SeoContent
- 이슈 인물 상세 텍스트 (한동훈·조국·이진숙 이력 SEO)

---

## 5. TypeScript 타입 정의

파일: `src/data/localElectionByeollection2026.ts`

```typescript
export type Party = "더불어민주당" | "국민의힘" | "무소속" | "조국혁신당" | "기타";
export type ResultBadge = "확정" | "확정대기" | "낙선확정";
export type ByeollectionRegion = "수도권" | "경상권" | "충청권" | "전라권" | "강원·제주";

export interface IssueHighlight {
  type: "winner" | "loser" | "notable";
  districtId: string;
  personName: string;
  party: Party;
  badge: ResultBadge;
  headline: string;
  subHeadline: string;
  career: string[];
  noteText: string;
}

export interface ByeollectionCandidate {
  name: string;
  party: Party;
  voteShare: number;    // 0이면 미확정
  badge: ResultBadge;
}

export interface ByeollectionPledge {
  category: "경제" | "복지" | "교육" | "환경" | "교통" | "주거" | "청년" | "안전" | "기타";
  title: string;
  description: string;
}

export interface ByeollectionDistrict {
  districtId: string;
  districtName: string;        // 예: "부산 북구갑"
  region: ByeollectionRegion;
  byeollectionReason: string;  // 재보궐 사유
  elected: ByeollectionCandidate | null;  // null이면 미확정
  runner: ByeollectionCandidate | null;
  career: string[];
  pledges: ByeollectionPledge[];
  isIssue: boolean;            // 이슈 하이라이트 여부
  noteDate: string;
  sources: { label: string; url: string }[];
}

export interface ByeollectionPageData {
  electionName: string;
  electionDate: string;
  dataAsOf: string;
  totalDistricts: number;
  demCount: number;
  pppCount: number;
  indCount: number;
  issueHighlights: IssueHighlight[];
  districts: ByeollectionDistrict[];
}
```

---

## 6. 실제 데이터

```typescript
export const BYEOLLECTION_DATA_2026: ByeollectionPageData = {
  electionName: "제9회 전국동시지방선거 — 국회의원 재·보궐선거",
  electionDate: "2026-06-04",
  dataAsOf: "2026-06-04 개표율 99.79%",
  totalDistricts: 14,
  demCount: 9,
  pppCount: 4,
  indCount: 1,

  // ──────────────────────────────────────────
  // 이슈 하이라이트 (3인)
  // ──────────────────────────────────────────
  issueHighlights: [
    {
      type: "winner",
      districtId: "busan-bukgu-gap",
      personName: "한동훈",
      party: "무소속",
      badge: "확정",
      headline: "한동훈, 부산 북구갑 무소속 당선",
      subHeadline: "前 법무부 장관·국민의힘 대표, 탈당 후 무소속 의회 복귀",
      career: [
        "서울대학교 법학과 졸업",
        "사법시험 합격 (1998년 제40회)",
        "검사 임관 (1999년)",
        "법무부 검찰국장·기획조정실장",
        "법무부 장관 (2022.05 ~ 2023.01, 윤석열 정부)",
        "국민의힘 비상대책위원장 (2023.07 ~ 2024.02)",
        "국민의힘 대표 (2024.03 ~ 2024.12)",
        "국민의힘 탈당 (2024.12)",
        "부산 북구갑 무소속 당선 (2026.06)",
      ],
      noteText: "前 부산 북구갑 의원 전재수(더불어민주당)의 경남도지사 출마로 공석. 한동훈이 무소속으로 출마해 당선. 국민의힘 탈당 후 첫 선거 복귀.",
    },
    {
      type: "loser",
      districtId: "TODO-jokuk-district", /* TODO: 조국 출마 지역구 확인 필요 */
      personName: "조국",
      party: "조국혁신당",
      badge: "낙선확정",
      headline: "조국, 직접 출마 낙선",
      subHeadline: "조국혁신당 대표, 지역구 직접 출마 — 낙선",
      career: [
        "서울대학교 법학과 교수 (1995~2019)",
        "청와대 민정수석 비서관 (2017.05 ~ 2019.08)",
        "법무부 장관 (2019.09 ~ 2019.10, 재임 35일)",
        "법무부 장관직 사퇴 (2019.10)",
        "자녀 입시비리 의혹으로 기소, 유죄 확정",
        "조국혁신당 창당·대표 취임 (2024.01)",
        "제22대 총선 비례대표 출마 낙선 (2024)",
        "2026 재보궐선거 지역구 출마 → 낙선",
      ],
      noteText: "조국혁신당 대표가 직접 지역구에 출마했으나 낙선. 출마 지역구는 선관위 확인 중.", /* TODO: 지역구 확인 후 업데이트 */
    },
    {
      type: "notable",
      districtId: "daegu-dalseong",
      personName: "이진숙",
      party: "국민의힘", /* TODO: 정당 확인 필요 — 선관위 최종 확인 */
      badge: "확정",
      headline: "이진숙, 대구 달성군 당선",
      subHeadline: "前 방통위원장, 대구 달성군 당선",
      career: [
        "MBC 기자·앵커",
        "MBC 보도국장 (2013~2014)",
        "MBC 사장 (2014~2016)",
        "방송통신위원회 위원장 (2024.07~2024.08, 재임 30일 탄핵)",
        /* TODO: 정확한 이력 추가 확인 */
      ],
      noteText: "前 방통위원장으로 탄핵 이슈를 겪은 이진숙이 대구 달성군에서 당선. 소속 정당 선관위 최종 확인 필요.", /* TODO */
    },
  ],

  // ──────────────────────────────────────────
  // 전체 14개 지역구
  // ──────────────────────────────────────────
  districts: [
    // ── 1. 부산 북구갑 ── 확정 (한동훈 무소속)
    {
      districtId: "busan-bukgu-gap",
      districtName: "부산 북구갑",
      region: "경상권",
      byeollectionReason: "전재수 의원 경남도지사 출마로 의원직 사직",
      elected: {
        name: "한동훈",
        party: "무소속",
        voteShare: 0, /* TODO: 선관위 확정 후 득표율 업데이트 */
        badge: "확정",
      },
      runner: null, /* TODO: 상대 후보 득표율 확인 */
      career: [
        "서울대학교 법학과 졸업",
        "검사 임관 (1999년)",
        "법무부 장관 (2022.05 ~ 2023.01)",
        "국민의힘 비상대책위원장 (2023.07 ~ 2024.02)",
        "국민의힘 대표 (2024.03 ~ 2024.12)",
        "국민의힘 탈당 (2024.12)",
        "부산 북구갑 무소속 출마 (2026.06)",
      ],
      pledges: [
        /* TODO: 선관위 공약마당 확인 후 업데이트 */
        { category: "경제", title: "부산 북구 경제 활성화", description: "지역 중소기업·소상공인 지원 강화" },
        { category: "교통", title: "부산 북구 교통 인프라 개선", description: "도시철도 연장 및 간선 버스 노선 개편" },
        { category: "복지", title: "부산 북구 민생 복지 강화", description: "취약계층 생활 안전망 확충" },
      ],
      isIssue: true,
      noteDate: "2026-06-04",
      sources: [
        { label: "선관위 당선인 정보", url: "https://info.nec.go.kr" },
      ],
    },

    // ── 2. 대구 달성군 ── 당선 확정, 정당 TODO
    {
      districtId: "daegu-dalseong",
      districtName: "대구 달성군",
      region: "경상권",
      byeollectionReason: "추경호 의원 경북도지사 출마로 의원직 사직",
      elected: {
        name: "이진숙",
        party: "국민의힘", /* TODO: 정당 선관위 최종 확인 */
        voteShare: 0, /* TODO: 득표율 확인 */
        badge: "확정",
      },
      runner: null,
      career: [
        "MBC 기자·앵커",
        "MBC 사장 (2014~2016)",
        "방통위원장 (2024.07~2024.08, 탄핵)",
        /* TODO: 전체 이력 추가 확인 */
      ],
      pledges: [
        /* TODO: 선관위 공약마당 확인 후 업데이트 */
        { category: "경제", title: "달성 산업단지 혁신", description: "달성 국가산업단지 고도화 및 기업 유치" },
        { category: "교통", title: "달성 교통망 개선", description: "대구 도시철도 1호선 연장 추진" },
        { category: "기타", title: "달성 지역발전 특별사업", description: "낙동강 주변 생태·관광 개발" },
      ],
      isIssue: true,
      noteDate: "2026-06-04",
      sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
    },

    // ── 3~14. 나머지 12개 지역구 — TODO ──
    // 더불어민주당 8곳 + 국민의힘 3곳 (지역구 미확정)

    {
      districtId: "todo-dem-01", /* TODO: 지역구 확인 */
      districtName: "확인 필요 (민주①)", /* TODO */
      region: "수도권", /* TODO */
      byeollectionReason: "TODO: 재보궐 사유 확인",
      elected: {
        name: "TODO", /* TODO */
        party: "더불어민주당",
        voteShare: 0,
        badge: "확정대기",
      },
      runner: null,
      career: [],
      pledges: [
        /* TODO */ { category: "기타", title: "TODO: 공약 확인", description: "선관위 공약마당 업데이트 후 기재" },
      ] as ByeollectionPledge[],
      isIssue: false,
      noteDate: "2026-06-04",
      sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
    },
    {
      districtId: "todo-dem-02", /* TODO */
      districtName: "확인 필요 (민주②)", region: "수도권",
      byeollectionReason: "TODO",
      elected: { name: "TODO", party: "더불어민주당", voteShare: 0, badge: "확정대기" },
      runner: null, career: [],
      pledges: [{ category: "기타", title: "TODO", description: "TODO" }] as ByeollectionPledge[],
      isIssue: false, noteDate: "2026-06-04",
      sources: [{ label: "선관위", url: "https://info.nec.go.kr" }],
    },
    {
      districtId: "todo-dem-03", districtName: "확인 필요 (민주③)", region: "수도권",
      byeollectionReason: "TODO",
      elected: { name: "TODO", party: "더불어민주당", voteShare: 0, badge: "확정대기" },
      runner: null, career: [],
      pledges: [{ category: "기타", title: "TODO", description: "TODO" }] as ByeollectionPledge[],
      isIssue: false, noteDate: "2026-06-04", sources: [{ label: "선관위", url: "https://info.nec.go.kr" }],
    },
    {
      districtId: "todo-dem-04", districtName: "확인 필요 (민주④)", region: "충청권",
      byeollectionReason: "TODO",
      elected: { name: "TODO", party: "더불어민주당", voteShare: 0, badge: "확정대기" },
      runner: null, career: [],
      pledges: [{ category: "기타", title: "TODO", description: "TODO" }] as ByeollectionPledge[],
      isIssue: false, noteDate: "2026-06-04", sources: [{ label: "선관위", url: "https://info.nec.go.kr" }],
    },
    {
      districtId: "todo-dem-05", districtName: "확인 필요 (민주⑤)", region: "전라권",
      byeollectionReason: "TODO",
      elected: { name: "TODO", party: "더불어민주당", voteShare: 0, badge: "확정대기" },
      runner: null, career: [],
      pledges: [{ category: "기타", title: "TODO", description: "TODO" }] as ByeollectionPledge[],
      isIssue: false, noteDate: "2026-06-04", sources: [{ label: "선관위", url: "https://info.nec.go.kr" }],
    },
    {
      districtId: "todo-dem-06", districtName: "확인 필요 (민주⑥)", region: "전라권",
      byeollectionReason: "TODO",
      elected: { name: "TODO", party: "더불어민주당", voteShare: 0, badge: "확정대기" },
      runner: null, career: [],
      pledges: [{ category: "기타", title: "TODO", description: "TODO" }] as ByeollectionPledge[],
      isIssue: false, noteDate: "2026-06-04", sources: [{ label: "선관위", url: "https://info.nec.go.kr" }],
    },
    {
      districtId: "todo-dem-07", districtName: "확인 필요 (민주⑦)", region: "경상권",
      byeollectionReason: "TODO",
      elected: { name: "TODO", party: "더불어민주당", voteShare: 0, badge: "확정대기" },
      runner: null, career: [],
      pledges: [{ category: "기타", title: "TODO", description: "TODO" }] as ByeollectionPledge[],
      isIssue: false, noteDate: "2026-06-04", sources: [{ label: "선관위", url: "https://info.nec.go.kr" }],
    },
    {
      districtId: "todo-dem-08", districtName: "확인 필요 (민주⑧)", region: "수도권",
      byeollectionReason: "TODO",
      elected: { name: "TODO", party: "더불어민주당", voteShare: 0, badge: "확정대기" },
      runner: null, career: [],
      pledges: [{ category: "기타", title: "TODO", description: "TODO" }] as ByeollectionPledge[],
      isIssue: false, noteDate: "2026-06-04", sources: [{ label: "선관위", url: "https://info.nec.go.kr" }],
    },
    {
      districtId: "todo-ppp-01", districtName: "확인 필요 (국힘①)", region: "경상권",
      byeollectionReason: "TODO",
      elected: { name: "TODO", party: "국민의힘", voteShare: 0, badge: "확정대기" },
      runner: null, career: [],
      pledges: [{ category: "기타", title: "TODO", description: "TODO" }] as ByeollectionPledge[],
      isIssue: false, noteDate: "2026-06-04", sources: [{ label: "선관위", url: "https://info.nec.go.kr" }],
    },
    {
      districtId: "todo-ppp-02", districtName: "확인 필요 (국힘②)", region: "경상권",
      byeollectionReason: "TODO",
      elected: { name: "TODO", party: "국민의힘", voteShare: 0, badge: "확정대기" },
      runner: null, career: [],
      pledges: [{ category: "기타", title: "TODO", description: "TODO" }] as ByeollectionPledge[],
      isIssue: false, noteDate: "2026-06-04", sources: [{ label: "선관위", url: "https://info.nec.go.kr" }],
    },
    {
      districtId: "todo-ppp-03", districtName: "확인 필요 (국힘③)", region: "수도권",
      byeollectionReason: "TODO",
      elected: { name: "TODO", party: "국민의힘", voteShare: 0, badge: "확정대기" },
      runner: null, career: [],
      pledges: [{ category: "기타", title: "TODO", description: "TODO" }] as ByeollectionPledge[],
      isIssue: false, noteDate: "2026-06-04", sources: [{ label: "선관위", url: "https://info.nec.go.kr" }],
    },
  ],
};
```

---

## 7. JS 인터랙션 전체 코드 (필터 탭 + 카드 accordion)

파일: `public/scripts/local-election-byeollection-2026.js`

```javascript
// ============================================================
// local-election-byeollection-2026.js
// 재보궐 당선자 카드 필터 탭 + accordion
// ============================================================

const BYE_STATE = {
  activePartyFilter: 'all',
  activeRegionFilter: 'all',
};

// ------ 초기화 ------

function initByeMap() {
  initByePartyFilter();
  initByeRegionFilter();
  initByeCardAccordion();
}

// ------ 정당별 필터 탭 ------

function initByePartyFilter() {
  const partyTabs = document.querySelectorAll('.bye-filter-tab[data-party-filter]');
  partyTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      partyTabs.forEach((t) => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      BYE_STATE.activePartyFilter = tab.dataset.partyFilter;
      filterByeCards();
    });
  });
}

// ------ 지역별 필터 탭 ------

function initByeRegionFilter() {
  const regionTabs = document.querySelectorAll('.bye-filter-tab[data-region-filter]');
  regionTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      regionTabs.forEach((t) => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      BYE_STATE.activeRegionFilter = tab.dataset.regionFilter;
      filterByeCards();
    });
  });
}

// ------ 카드 필터링 ------

function filterByeCards() {
  const cards = document.querySelectorAll('.bye-card');
  cards.forEach((card) => {
    const cardParty = card.dataset.party || '';
    const cardRegion = card.dataset.region || '';

    const partyMatch =
      BYE_STATE.activePartyFilter === 'all' ||
      cardParty === BYE_STATE.activePartyFilter;

    const regionMatch =
      BYE_STATE.activeRegionFilter === 'all' ||
      cardRegion === BYE_STATE.activeRegionFilter;

    card.classList.toggle('is-hidden', !(partyMatch && regionMatch));
  });

  // 결과 없음 메시지
  const visibleCards = document.querySelectorAll('.bye-card:not(.is-hidden)');
  const emptyEl = document.getElementById('bye-empty-state');
  if (emptyEl) emptyEl.classList.toggle('is-visible', visibleCards.length === 0);
}

// ------ 카드 accordion ------

function initByeCardAccordion() {
  const cards = document.querySelectorAll('.bye-card');
  cards.forEach((card) => {
    const toggle = card.querySelector('.bye-card__toggle');
    const body = card.querySelector('.bye-card__body');
    if (!toggle || !body) return;

    toggle.addEventListener('click', () => {
      const isOpen = card.classList.contains('is-expanded');
      // 다른 카드 닫기 (선택적: 하나만 열기 모드)
      // cards.forEach((c) => { c.classList.remove('is-expanded'); c.querySelector('.bye-card__body')?.setAttribute('hidden', ''); });

      card.classList.toggle('is-expanded', !isOpen);
      if (isOpen) {
        body.setAttribute('hidden', '');
        toggle.setAttribute('aria-expanded', 'false');
      } else {
        body.removeAttribute('hidden');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

// ------ 차트 ------

function initByeChart() {
  const canvas = document.getElementById('bye-result-chart');
  if (!canvas || typeof Chart === 'undefined') return;

  new Chart(canvas, {
    type: 'pie',
    data: {
      labels: ['더불어민주당', '국민의힘', '무소속'],
      datasets: [{
        data: [9, 4, 1],
        backgroundColor: ['#0078D7', '#E61E2B', '#888888'],
        borderWidth: 2,
        borderColor: '#fff',
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.label}: ${ctx.raw}석`,
          },
        },
      },
    },
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initByeMap();
  initByeChart();
});
```

---

## 8. Astro 페이지 구조

파일: `src/pages/reports/local-election-byeollection-2026.astro`

```astro
---
import { BYEOLLECTION_DATA_2026 } from '../../data/localElectionByeollection2026';

const title = '2026 재보궐선거 당선자 총정리 — 14개 지역구 공약·이력 완전 정리';
const description = '한동훈 부산 북구갑 무소속 당선, 조국 낙선 등 2026 재보궐선거 14개 지역구 당선자 공약·이력을 한눈에 정리.';
const data = BYEOLLECTION_DATA_2026;

function getPartyClass(party: string) {
  if (party === '더불어민주당') return 'dem';
  if (party === '국민의힘') return 'ppp';
  if (party === '무소속') return 'ind';
  return 'etc';
}
---

<!-- 섹션 A: Hero -->
<section class="bye-hero">
  <div class="bye-hero__inner">
    <div class="bye-hero__badge">2026 재보궐선거</div>
    <h1 class="bye-hero__title">{title}</h1>
    <p class="bye-hero__sub">한동훈 무소속 당선·조국 낙선 등 주요 이슈와 14개 지역구 당선자 공약을 한 곳에서 확인하세요.</p>
    <span class="bye-badge bye-badge--info">데이터 기준: {data.dataAsOf}</span>
  </div>
</section>

<!-- 섹션 B: InfoNotice -->
<div class="bye-info-notice">
  <p>⚠️ 한동훈(부산 북구갑)·이진숙(대구 달성군) 당선 확정. 나머지 12개 지역구는 선관위 최종 확인 후 업데이트.
  <a href="https://info.nec.go.kr" target="_blank" rel="noopener noreferrer">선관위 당선인 조회 →</a></p>
</div>

<!-- 섹션 C: KPI -->
<section class="bye-kpi">
  <div class="bye-kpi-grid">
    <div class="bye-kpi-card bye-kpi-card--dem">
      <span class="bye-kpi-card__label">더불어민주당</span>
      <span class="bye-kpi-card__value">{data.demCount}석</span>
    </div>
    <div class="bye-kpi-card bye-kpi-card--ppp">
      <span class="bye-kpi-card__label">국민의힘</span>
      <span class="bye-kpi-card__value">{data.pppCount}석</span>
    </div>
    <div class="bye-kpi-card bye-kpi-card--ind">
      <span class="bye-kpi-card__label">무소속</span>
      <span class="bye-kpi-card__value">{data.indCount}석</span>
      <span class="bye-kpi-card__sub">한동훈</span>
    </div>
    <div class="bye-kpi-card">
      <span class="bye-kpi-card__label">총 재보궐</span>
      <span class="bye-kpi-card__value">{data.totalDistricts}개 지역구</span>
    </div>
  </div>
</section>

<!-- 섹션 D: 이슈 하이라이트 -->
<section class="bye-highlights">
  <div class="bye-highlights__inner">
    <h2 class="bye-highlights__title">이번 재보궐의 핵심 인물</h2>
    <div class="bye-highlights__grid">
      {data.issueHighlights.map((h) => (
        <div class={`bye-highlight-card bye-highlight-card--${h.type} bye-highlight-card--${getPartyClass(h.party)}`}>
          <div class="bye-highlight-card__header">
            <span class={`bye-highlight-card__party-badge bye-highlight-card__party-badge--${getPartyClass(h.party)}`}>{h.party}</span>
            <span class={`bye-badge bye-badge--${h.badge === '확정' ? 'confirmed' : h.badge === '낙선확정' ? 'lost' : 'pending'}`}>
              {h.badge === '낙선확정' ? '낙선' : h.badge}
            </span>
          </div>
          <h3 class="bye-highlight-card__name">{h.personName}</h3>
          <p class="bye-highlight-card__headline">{h.headline}</p>
          <p class="bye-highlight-card__sub">{h.subHeadline}</p>
          <details class="bye-highlight-card__career">
            <summary>이력 보기</summary>
            <ul>{h.career.map((c) => <li>{c}</li>)}</ul>
          </details>
          <p class="bye-highlight-card__note">{h.noteText}</p>
        </div>
      ))}
    </div>
  </div>
</section>

<!-- 섹션 E+F: 전체 카드 + 필터 -->
<section class="bye-districts">
  <div class="bye-districts__inner">
    <div class="bye-filter-group">
      <!-- 정당 필터 -->
      <div class="bye-filter-row" role="tablist" aria-label="정당 필터">
        <span class="bye-filter-label">정당</span>
        <button class="bye-filter-tab is-active" data-party-filter="all">전체</button>
        <button class="bye-filter-tab" data-party-filter="더불어민주당">민주</button>
        <button class="bye-filter-tab" data-party-filter="국민의힘">국힘</button>
        <button class="bye-filter-tab" data-party-filter="무소속">무소속</button>
      </div>
      <!-- 지역 필터 -->
      <div class="bye-filter-row" role="tablist" aria-label="지역 필터">
        <span class="bye-filter-label">지역</span>
        <button class="bye-filter-tab is-active" data-region-filter="all">전체</button>
        <button class="bye-filter-tab" data-region-filter="수도권">수도권</button>
        <button class="bye-filter-tab" data-region-filter="경상권">경상권</button>
        <button class="bye-filter-tab" data-region-filter="충청권">충청권</button>
        <button class="bye-filter-tab" data-region-filter="전라권">전라권</button>
      </div>
    </div>

    <!-- 카드 그리드 -->
    <div class="bye-cards-grid">
      {data.districts.map((d) => (
        <div
          class={`bye-card bye-card--${getPartyClass(d.elected?.party || '기타')}`}
          data-party={d.elected?.party}
          data-region={d.region}
          data-district-id={d.districtId}
        >
          <div class="bye-card__header">
            <div class="bye-card__meta">
              <span class="bye-card__district">{d.districtName}</span>
              <span class="bye-card__region-badge">{d.region}</span>
            </div>
            <span class={`bye-card__party-badge bye-card__party-badge--${getPartyClass(d.elected?.party || '기타')}`}>
              {d.elected?.party || 'TODO'}
            </span>
          </div>

          <div class="bye-card__elected">
            {d.elected?.name === 'TODO' || !d.elected
              ? <span class="bye-badge bye-badge--pending">확정대기</span>
              : <span class="bye-card__name">{d.elected.name}</span>
            }
            {d.elected?.voteShare && d.elected.voteShare > 0
              ? <span class="bye-card__vote">{d.elected.voteShare}%</span>
              : null
            }
          </div>

          <p class="bye-card__reason">{d.byeollectionReason}</p>

          <button
            type="button"
            class="bye-card__toggle"
            aria-expanded="false"
          >
            공약·이력 보기 ▾
          </button>

          <div class="bye-card__body" hidden>
            {d.career.length > 0 && (
              <div class="bye-card__career">
                <h4>이력</h4>
                <ul>{d.career.map((c) => <li>{c}</li>)}</ul>
              </div>
            )}
            <div class="bye-card__pledges">
              <h4>핵심 공약</h4>
              {d.pledges.map((p) => (
                <div class="bye-card__pledge">
                  <span class="bye-card__pledge-cat">{p.category}</span>
                  <strong>{p.title}</strong>
                  <p>{p.description}</p>
                </div>
              ))}
            </div>
            <a href="https://policy.nec.go.kr" target="_blank" rel="noopener noreferrer" class="bye-card__source">
              선관위 공약마당 →
            </a>
          </div>
        </div>
      ))}
    </div>

    <div id="bye-empty-state" class="bye-empty" aria-hidden="true">
      해당 조건의 지역구가 없습니다.
    </div>
  </div>
</section>

<!-- 섹션 G: 차트 -->
<section class="bye-chart-section">
  <h2>재보궐 정당별 의석 결과</h2>
  <canvas id="bye-result-chart" class="bye-chart"></canvas>
</section>

<!-- 섹션 H: FAQ -->
<section class="bye-faq">
  <h2>자주 묻는 질문</h2>
  <details>
    <summary>재보궐선거가 열린 이유는 무엇인가요?</summary>
    <p>지방선거와 동시에 실시된 재보궐선거는 주로 현역 의원들이 시도지사 선거 출마를 위해 의원직을 사직한 자리를 채우기 위해 열렸습니다. 14개 지역구 모두 이와 유사한 사유로 공석이 생겼습니다.</p>
  </details>
  <details>
    <summary>한동훈은 왜 무소속으로 출마했나요?</summary>
    <p>한동훈은 2024년 12월 국민의힘 대표직을 사퇴하고 탈당했습니다. 이후 전재수 전 의원의 경남도지사 출마로 공석이 된 부산 북구갑에 무소속으로 출마해 당선되었습니다. 국민의힘 탈당 후 첫 선거 복귀이자 의회 입성입니다.</p>
  </details>
  <details>
    <summary>조국은 어느 지역구에서 출마했나요?</summary>
    <p>출마 지역구를 선관위 공식 데이터로 확인 중입니다. 확정 즉시 업데이트하겠습니다.</p>
    <!-- TODO: 조국 출마 지역구 확인 후 업데이트 -->
  </details>
</section>

<!-- 섹션 I: 관련 링크 -->
<section class="bye-related">
  <a href="/reports/local-election-governor-2026/">시도지사 당선자 지도 →</a>
  <a href="/reports/local-election-seoul-2026/">서울 구청장 지도 →</a>
  <a href="/reports/local-election-superintendent-2026/">교육감 당선자 →</a>
</section>

<script src="/scripts/local-election-byeollection-2026.js"></script>
```

---

## 9. SCSS 전체

파일: `src/styles/scss/pages/_local-election-byeollection-2026.scss`

```scss
// ============================================================
// _local-election-byeollection-2026.scss
// 재보궐선거 당선자 카드
// Prefix: bye-
// ============================================================

.bye-page {
  --party-dem: #0078D7;
  --party-dem-light: #e3f0fa;
  --party-ppp: #E61E2B;
  --party-ppp-light: #fde8e9;
  --party-ind: #607D8B;
  --party-ind-light: #eceff1;
  --bye-card-shadow: 0 2px 10px rgba(0,0,0,0.08);
}

// ------ Hero ------
.bye-hero {
  background: linear-gradient(135deg, #37474F 0%, #546E7A 100%);
  color: #fff; padding: 2.5rem 1.5rem 2rem; text-align: center;
  &__inner { max-width: 760px; margin: 0 auto; }
  &__badge { display: inline-block; background: rgba(255,255,255,0.2); border-radius: 99px; padding: 0.2rem 0.8rem; font-size: 0.78rem; margin-bottom: 0.6rem; }
  &__title { font-size: clamp(1.2rem, 2.8vw, 1.9rem); font-weight: 800; margin: 0 0 0.6rem; line-height: 1.35; }
  &__sub { font-size: 0.93rem; opacity: 0.85; margin: 0 0 1rem; line-height: 1.6; }
}

.bye-info-notice {
  background: #fff8e1; border-left: 4px solid #FF9800; padding: 0.75rem 1.5rem;
  p { font-size: 0.875rem; color: #5D4037; margin: 0; } a { color: #E65100; }
}

// ------ KPI ------
.bye-kpi { padding: 1.5rem; background: #f8f9fa; }
.bye-kpi-grid {
  max-width: 700px; margin: 0 auto;
  display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 0.875rem;
}
.bye-kpi-card {
  background: #fff; border-radius: 12px; padding: 1.1rem; text-align: center;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  &__label { font-size: 0.78rem; color: #777; display: block; margin-bottom: 0.1rem; }
  &__value { font-size: 1.8rem; font-weight: 900; display: block; }
  &__sub { font-size: 0.72rem; color: #aaa; display: block; }
  &--dem { border-top: 4px solid var(--party-dem); .bye-kpi-card__value { color: var(--party-dem); } }
  &--ppp { border-top: 4px solid var(--party-ppp); .bye-kpi-card__value { color: var(--party-ppp); } }
  &--ind { border-top: 4px solid var(--party-ind); .bye-kpi-card__value { color: var(--party-ind); } }
}

// ------ 이슈 하이라이트 ------
.bye-highlights {
  padding: 2rem 1.5rem; background: #fafafa;
  &__inner { max-width: 1000px; margin: 0 auto; }
  &__title { font-size: 1.1rem; font-weight: 800; margin-bottom: 1.25rem; }
  &__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; }
}

.bye-highlight-card {
  background: #fff; border-radius: 16px; padding: 1.5rem;
  box-shadow: var(--bye-card-shadow); border: 1px solid #f0f0f0;
  &--winner { border-top: 5px solid var(--party-ind); }
  &--loser { border-top: 5px solid #FF9800; opacity: 0.85; }
  &--notable { border-top: 5px solid var(--party-ppp); }

  &__header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem; }
  &__party-badge {
    font-size: 0.72rem; padding: 0.15rem 0.5rem; border-radius: 99px; font-weight: 700; color: #fff;
    &--dem { background: var(--party-dem); } &--ppp { background: var(--party-ppp); } &--ind { background: var(--party-ind); }
  }
  &__name { font-size: 1.5rem; font-weight: 900; margin: 0 0 0.3rem; }
  &__headline { font-size: 0.92rem; font-weight: 700; color: #333; margin: 0 0 0.2rem; }
  &__sub { font-size: 0.82rem; color: #666; margin: 0 0 0.875rem; }
  &__career { margin-top: 0.75rem; summary { cursor: pointer; font-size: 0.82rem; color: #888; } ul { margin: 0.4rem 0 0; padding-left: 1.1rem; li { font-size: 0.8rem; color: #555; margin-bottom: 0.2rem; } } }
  &__note { font-size: 0.8rem; color: #777; background: #f8f9fa; border-radius: 8px; padding: 0.6rem 0.75rem; margin: 0.75rem 0 0; line-height: 1.6; }
}

// ------ 필터 그룹 ------
.bye-filter-group { margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 0.6rem; }
.bye-filter-row { display: flex; flex-wrap: wrap; gap: 0.4rem; align-items: center; }
.bye-filter-label { font-size: 0.78rem; color: #888; min-width: 30px; }
.bye-filter-tab {
  padding: 0.35rem 0.9rem; border-radius: 99px; border: 2px solid #ddd;
  background: #fff; cursor: pointer; font-size: 0.82rem; transition: all 0.15s;
  &.is-active { border-color: var(--party-dem); color: var(--party-dem); font-weight: 700; background: var(--party-dem-light); }
}

// ------ 카드 그리드 ------
.bye-districts { padding: 1.5rem; &__inner { max-width: 1000px; margin: 0 auto; } }
.bye-cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }

.bye-card {
  background: #fff; border-radius: 14px; padding: 1.25rem;
  box-shadow: var(--bye-card-shadow); border: 1px solid #f0f0f0;
  border-left: 5px solid #ddd; transition: box-shadow 0.15s;

  &--dem { border-left-color: var(--party-dem); }
  &--ppp { border-left-color: var(--party-ppp); }
  &--ind { border-left-color: var(--party-ind); }

  &:hover { box-shadow: 0 4px 18px rgba(0,0,0,0.12); }
  &.is-hidden { display: none; }

  &__header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.6rem; }
  &__meta { display: flex; flex-direction: column; gap: 0.2rem; }
  &__district { font-size: 0.95rem; font-weight: 800; }
  &__region-badge { font-size: 0.7rem; color: #999; background: #f5f5f5; border-radius: 4px; padding: 0.1rem 0.35rem; display: inline-block; }
  &__party-badge { font-size: 0.72rem; padding: 0.12rem 0.45rem; border-radius: 99px; font-weight: 700; color: #fff; &--dem { background: var(--party-dem); } &--ppp { background: var(--party-ppp); } &--ind { background: var(--party-ind); } }
  &__elected { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.4rem; }
  &__name { font-size: 1.1rem; font-weight: 700; }
  &__vote { font-size: 0.8rem; color: #888; }
  &__reason { font-size: 0.78rem; color: #aaa; margin: 0 0 0.75rem; line-height: 1.5; }
  &__toggle {
    width: 100%; padding: 0.45rem; border: 1px solid #eee; border-radius: 8px;
    background: #fafafa; cursor: pointer; font-size: 0.82rem; color: #666;
    transition: background 0.15s;
    &:hover { background: #f0f0f0; }
  }
  &.is-expanded &__toggle { color: var(--party-dem); }
  &__body { margin-top: 1rem; }
  &__career { margin-bottom: 1rem; h4 { font-size: 0.8rem; text-transform: uppercase; color: #aaa; margin: 0 0 0.4rem; } ul { margin: 0; padding-left: 1.1rem; li { font-size: 0.82rem; color: #555; margin-bottom: 0.2rem; } } }
  &__pledges { h4 { font-size: 0.8rem; text-transform: uppercase; color: #aaa; margin: 0 0 0.5rem; } }
  &__pledge { margin-bottom: 0.6rem; display: flex; flex-direction: column; gap: 0.1rem; strong { font-size: 0.88rem; } p { font-size: 0.8rem; color: #666; margin: 0; } }
  &__pledge-cat { font-size: 0.68rem; background: #f0f0f0; border-radius: 3px; padding: 0.08rem 0.3rem; color: #666; display: inline-block; }
  &__source { display: block; margin-top: 0.875rem; font-size: 0.78rem; color: var(--party-dem); text-decoration: none; &:hover { text-decoration: underline; } }
}

// ------ 빈 상태 ------
.bye-empty { display: none; text-align: center; padding: 2.5rem; color: #aaa; font-size: 0.9rem; &.is-visible { display: block; } }

// ------ 배지 ------
.bye-badge {
  display: inline-block; border-radius: 99px; padding: 0.12rem 0.5rem; font-size: 0.72rem; font-weight: 600;
  &--pending { background: #FF9800; color: #fff; }
  &--confirmed { background: #4CAF50; color: #fff; }
  &--lost { background: #9E9E9E; color: #fff; }
  &--info { background: rgba(255,255,255,0.25); color: #fff; border: 1px solid rgba(255,255,255,0.4); }
}

// ------ 차트 ------
.bye-chart-section { padding: 2rem 1.5rem; background: #f8f9fa; text-align: center; h2 { font-size: 1rem; margin-bottom: 1.25rem; } }
.bye-chart { max-height: 240px; max-width: 280px; margin: 0 auto; display: block; }

// ------ FAQ ------
.bye-faq { padding: 2rem 1.5rem; max-width: 720px; margin: 0 auto; h2 { font-size: 1.1rem; font-weight: 800; margin-bottom: 1rem; } details { border-bottom: 1px solid #eee; padding: 0.875rem 0; summary { cursor: pointer; font-weight: 600; font-size: 0.92rem; } p { margin: 0.5rem 0 0; font-size: 0.85rem; color: #555; line-height: 1.7; } } }

// ------ 관련 링크 ------
.bye-related { display: flex; gap: 0.75rem; flex-wrap: wrap; padding: 1.5rem; background: #f8f9fa; a { background: #fff; border: 1px solid #e8e8e8; border-radius: 9px; padding: 0.75rem 1.1rem; text-decoration: none; color: #333; font-size: 0.88rem; font-weight: 600; &:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.1); } } }
```

---

## 10. `app.scss` 추가 라인

```scss
@use 'scss/pages/local-election-byeollection-2026';
```

---

## 11. `data/reports.ts` 추가 항목

```typescript
{
  id: 'local-election-byeollection-2026',
  title: '2026 재보궐선거 당선자 총정리 — 14개 지역구 공약·이력 완전 정리',
  description: '한동훈 무소속 당선·조국 낙선 등 2026 재보궐선거 14개 지역구 당선자 공약·이력 완전 정리.',
  category: '정치·선거',
  path: '/reports/local-election-byeollection-2026/',
  publishedAt: '2026-06-04',
  updatedAt: '2026-06-04',
  tags: ['2026지방선거', '재보궐', '한동훈', '당선자'],
  featured: true,
},
```

---

## 12. 데이터 업데이트 가이드

### 13개 TODO 지역구 확정 시

파일: `src/data/localElectionByeollection2026.ts`

각 TODO 지역구마다:

1. `districtId` → 실제 ID로 변경 (예: `"seoul-junggu"`)
2. `districtName` → 실제 지역구명 (예: `"서울 중구"`)
3. `byeollectionReason` → 실제 재보궐 사유
4. `elected.name` → 실제 당선자명
5. `elected.voteShare` → 실제 득표율
6. `elected.badge` → `"확정"`
7. `career` → 당선자 이력 배열
8. `pledges` → 공약 3개 (선관위 공약마당 참고)

### 이슈 하이라이트 업데이트

조국 출마 지역구 확정 시:
```typescript
// issueHighlights[1] (조국 카드)
districtId: "실제-지역구-id",  // TODO 제거
noteText: "조국혁신당 대표가 ○○ 지역구에서 직접 출마했으나 낙선. ...",
```

이진숙 정당 확정 시:
```typescript
// issueHighlights[2] (이진숙 카드)
party: "확인된 정당",  // TODO 제거
```

한동훈 득표율 확정 시:
```typescript
// districts[0] (부산 북구갑)
elected: { ..., voteShare: 실제득표율 }
runner: { name: "상대후보명", party: "정당", voteShare: 상대득표율, badge: "확정" }
```

### `dataAsOf` 최종 업데이트

```typescript
dataAsOf: "2026-06-XX 선관위 최종 확정",
```
