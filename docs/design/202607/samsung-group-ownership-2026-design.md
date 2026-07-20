# 삼성그룹 지분구조 리포트 2026 — 설계 문서

> 기획 원본: [`docs/plan/202607/corporate-group-ownership-content-2026-plan.md`](../../plan/202607/corporate-group-ownership-content-2026-plan.md)
> 조사 원자료: [`docs/plan/202607/corporate-group-ownership-research-notes-2026.md`](../../plan/202607/corporate-group-ownership-research-notes-2026.md) — 1장 "삼성그룹" 절
> 작성일: 2026-07-16
> 유형: 비교 리포트 (`/reports/`)
> 클러스터 내 위치: 9개 그룹 리포트 중 **1번째** — 이 문서에서 정하는 데이터 타입·`OwnershipTree` 컴포넌트·SCSS 토큰이 나머지 8개 그룹의 표준 패턴이 된다 (14장 참고)

---

## 1. 이 그룹을 먼저 설계하는 이유

삼성은 9개 그룹 중 **지분구조가 가장 복잡한 축**에 속한다 — 법적 지주회사가 없고, 삼성물산이 금융 계열(삼성생명)과 비금융 계열(삼성전자·삼성바이오로직스·삼성SDS)에 동시에 지분을 걸치며, 일부 자회사(삼성전자·삼성SDS)는 **두 개 이상의 상위 계열사로부터 동시에 지분을 받는 다중 부모 구조**다. 가장 단순한 LG(순수지주회사, 부모 1개씩)부터 설계했다면 정작 필요한 컴포넌트 유연성을 놓쳤을 것이므로, 가장 까다로운 삼성을 먼저 설계해 컴포넌트·데이터 타입을 확정한다.

---

## 2. 파일 목록

| 역할 | 경로 | 비고 |
|---|---|---|
| 데이터 | `src/data/samsungGroupOwnership2026.ts` | |
| 공통 타입 | `src/data/groupOwnershipTypes.ts` | **신규 공유 파일** — 9개 그룹이 import해서 쓸 타입 정의 (13장) |
| 리포트 등록 | `src/data/reports.ts` | |
| 페이지 | `src/pages/reports/samsung-group-ownership-2026.astro` | |
| 신규 공유 컴포넌트 | `src/components/OwnershipTree.astro` | **신규** — 9개 그룹이 공유하는 SVG 지분 트리 (5장) |
| 스타일(페이지) | `src/styles/scss/pages/_samsung-group-ownership-2026.scss` | |
| 스타일(공유 컴포넌트) | `src/styles/scss/_ownership-tree.scss` | **신규** — `OwnershipTree` 전용, 9개 그룹 페이지가 공유 |
| 앱 CSS import | `src/styles/app.scss` | 2줄 추가 |
| 사이트맵 | `public/sitemap.xml` | |

---

## 3. URL 및 메타

```
슬러그: /reports/samsung-group-ownership-2026/
타이틀: 삼성그룹 지분구조 2026 완전 정리 | 삼성물산·삼성생명·삼성전자 지배관계
디스크립션: 이재용 및 특수관계인 지분부터 삼성물산→삼성생명→삼성전자 연결까지 지분구조를 정리. 상장 계열사 18개 전체 목록 포함.
```

`CLAUDE.md` 정보성 리포트 타이틀 공식(`{주제} {연도} 완전 정리 | {핵심 궁금증}`) 적용. 디스크립션 92자 — 80~120자 기준 충족.

---

## 4. 데이터 파일 설계

### 4-1. 공통 타입 (`src/data/groupOwnershipTypes.ts`) — 신규 공유 파일

9개 그룹 데이터 파일이 전부 이 파일을 import한다. 여기서 한 번만 정의한다.

```ts
export type SourceConfidence = "HIGH" | "MEDIUM" | "LOW";

export interface GroupCompany {
  id: string;                 // 그룹 내 고유 id, 예: "samsung-cnt"
  name: string;                // "삼성물산"
  stockCode?: string;          // 비상장이면 undefined. 코드 미검증 시 필드는 채우되 sourceConfidence를 LOW로
  listed: boolean;
  market?: "KOSPI" | "KOSDAQ";
  sector: "NON_FINANCIAL" | "FINANCIAL";
  role: "OWNER_FAMILY" | "CORE_COMPANY" | "AFFILIATE";
  // OwnershipTree 렌더링용 — "주 연결선"이 되는 단일 부모만 지정한다 (다중 부모는 secondaryStakes로)
  primaryParentId: string | null;   // 최상위 노드(오너 일가)만 null
  primaryRatePercent: number | null;
  secondaryStakes?: SecondaryStake[]; // 트리에는 선으로 안 그리고, 노드 하단 보조 텍스트로만 표기
}

export interface SecondaryStake {
  holderName: string;   // "삼성전자 직접 보유"
  ratePercent: number;
}

export interface OwnershipFact {
  label: string;         // "이재용 → 삼성물산"
  ratePercent: number;
  ratePercentLabel?: string; // "22.01%(개인) / 38.07%(특수관계인 합산)"처럼 단순 숫자로 못 담는 경우
  baseDate: string;      // "2026-05-15"
  sourceLabel: string;   // "디지털투데이 2026-05-15 공시 인용 보도"
  sourceUrl: string;
  confidence: SourceConfidence;
}

export interface GroupOwnershipMeta {
  groupId: string;
  groupName: string;
  isLegalHoldingCompany: boolean;
  holdingCompanyNote: string;   // "법적 지주회사 아님 — 삼성물산이 사실상 지배구조 정점"
  affiliateCount: number;
  affiliateCountBaseDate: string;   // "2026-05-01"
  affiliateCountConfidence: SourceConfidence;
  listedAffiliateCount: number;
  fairTradeRank: number;         // 공정자산 기준 재계 순위
  updatedAt: string;
  dataSourceNotice: string;      // 페이지 공통 고지 문구 (모든 그룹 동일 문구 사용 권장)
}
```

`dataSourceNotice`는 9개 그룹이 동일 문구를 쓰는 게 원칙이나, 필드 자체는 그룹별 데이터 파일에 두어 InfoNotice에서 그대로 꺼내 쓴다(공통 상수로 따로 빼면 한 곳만 수정해도 되지만, 그룹별로 문구를 미세 조정할 여지를 남기기 위해 필드로 유지).

### 4-2. `src/data/samsungGroupOwnership2026.ts`

```ts
import type { GroupCompany, OwnershipFact, GroupOwnershipMeta } from "./groupOwnershipTypes";

export const SAMSUNG_META: GroupOwnershipMeta = {
  groupId: "samsung",
  groupName: "삼성",
  isLegalHoldingCompany: false,
  holdingCompanyNote: "법적 지주회사 없음 — 삼성물산이 순환 지분 구조의 사실상 정점",
  affiliateCount: 67,
  affiliateCountBaseDate: "2026-05-01",
  affiliateCountConfidence: "HIGH",
  listedAffiliateCount: 18,
  fairTradeRank: 1,
  updatedAt: "2026-07-16",
  dataSourceNotice: "이 페이지의 지분율은 DART 공시를 인용한 위즈리포트·언론 보도 등 2차 자료를 종합한 것입니다. 표에 표시된 신뢰도(높음·중간·낮음)를 참고하시고, 정확한 수치는 전자공시시스템(dart.fss.or.kr) 원문에서 다시 확인하시길 권합니다.",
};

// ── 지분 연결도(OwnershipTree)에 쓰이는 노드 — 트리 렌더링 전용, "주 연결선"만 표시 ──
export const SAMSUNG_TREE_NODES: GroupCompany[] = [
  {
    id: "owner", name: "이재용 외 특수관계인", listed: false,
    sector: "NON_FINANCIAL", role: "OWNER_FAMILY",
    primaryParentId: null, primaryRatePercent: null,
  },
  {
    id: "samsung-cnt", name: "삼성물산", stockCode: "028260", listed: true, market: "KOSPI",
    sector: "NON_FINANCIAL", role: "CORE_COMPANY",
    primaryParentId: "owner", primaryRatePercent: 38.07,
  },
  {
    id: "samsung-life", name: "삼성생명", stockCode: "032830", listed: true, market: "KOSPI",
    sector: "FINANCIAL", role: "AFFILIATE",
    primaryParentId: "samsung-cnt", primaryRatePercent: 19.34,
  },
  {
    id: "samsung-elec", name: "삼성전자", stockCode: "005930", listed: true, market: "KOSPI",
    sector: "NON_FINANCIAL", role: "AFFILIATE",
    primaryParentId: "samsung-life", primaryRatePercent: 8.51,
    secondaryStakes: [{ holderName: "삼성물산 직접 보유", ratePercent: 5.05 }],
  },
  {
    id: "samsung-bio", name: "삼성바이오로직스", stockCode: "207940", listed: true, market: "KOSPI",
    sector: "NON_FINANCIAL", role: "AFFILIATE",
    primaryParentId: "samsung-cnt", primaryRatePercent: 43.06,
  },
  {
    id: "samsung-sds", name: "삼성SDS", stockCode: "018260", listed: true, market: "KOSPI",
    sector: "NON_FINANCIAL", role: "AFFILIATE",
    primaryParentId: "samsung-cnt", primaryRatePercent: 17.09,
    secondaryStakes: [{ holderName: "삼성전자 직접 보유", ratePercent: 22.59 }],
  },
];

// ── 오너 및 핵심 연결 사실 표 — OwnershipFact[] (신뢰도·출처 포함) ──
export const SAMSUNG_OWNERSHIP_FACTS: OwnershipFact[] = [
  {
    label: "이재용 → 삼성물산 (개인)", ratePercent: 22.01,
    baseDate: "2026-05-15",
    sourceLabel: "디지털투데이, 지분 공시 인용 보도",
    sourceUrl: "https://www.digitaltoday.co.kr/news/articleView.html?idxno=668619",
    confidence: "MEDIUM",
  },
  {
    label: "이재용 외 특수관계인 11인 → 삼성물산 (합산)", ratePercent: 38.07,
    baseDate: "2026-05-15",
    sourceLabel: "디지털투데이, 지분 공시 인용 보도",
    sourceUrl: "https://www.digitaltoday.co.kr/news/articleView.html?idxno=668619",
    confidence: "MEDIUM",
  },
  {
    label: "삼성물산 → 삼성생명", ratePercent: 19.34,
    baseDate: "2025-3분기",
    sourceLabel: "위즈리포트 지분현황",
    sourceUrl: "https://comp.wisereport.co.kr/company/c1070001.aspx?cmp_cd=028260",
    confidence: "MEDIUM",
  },
  {
    label: "삼성생명 → 삼성전자 (최대주주)", ratePercent: 8.51,
    baseDate: "2026-07",
    sourceLabel: "언론 보도, 삼성생명 특별계정 지분 변동 기사",
    sourceUrl: "https://www.datatooza.com/article/20260706163702969252ef343992_80",
    confidence: "MEDIUM",
  },
  {
    label: "삼성물산 → 삼성전자 (직접)", ratePercent: 5.05,
    baseDate: "2025-3분기",
    sourceLabel: "위즈리포트 지분현황",
    sourceUrl: "https://comp.wisereport.co.kr/company/c1070001.aspx?cmp_cd=028260",
    confidence: "MEDIUM",
  },
  {
    label: "삼성물산 → 삼성바이오로직스", ratePercent: 43.06,
    baseDate: "2025-3분기",
    sourceLabel: "위즈리포트 지분현황",
    sourceUrl: "https://comp.wisereport.co.kr/company/c1070001.aspx?cmp_cd=028260",
    confidence: "MEDIUM",
  },
  {
    label: "삼성물산 → 삼성SDS", ratePercent: 17.09,
    baseDate: "2026",
    sourceLabel: "알파스퀘어 종목 정보",
    sourceUrl: "https://alphasquare.co.kr/home/stock-summary?code=018260",
    confidence: "MEDIUM",
  },
  {
    label: "삼성전자 → 삼성SDS", ratePercent: 22.59,
    baseDate: "2026",
    sourceLabel: "알파스퀘어 종목 정보",
    sourceUrl: "https://alphasquare.co.kr/home/stock-summary?code=018260",
    confidence: "MEDIUM",
  },
  {
    label: "삼성전자 최대주주+특수관계인 합산", ratePercent: 17.32,
    baseDate: "2026-07-06",
    sourceLabel: "데이터투자, 삼성생명 특별계정 지분 변동 기사",
    sourceUrl: "https://www.datatooza.com/article/20260706163702969252ef343992_80",
    confidence: "MEDIUM",
  },
];

// ── 상장 계열사 전체 목록 (18개, 2026-05-01 공정위 기준) ──
export interface ListedAffiliateRow {
  name: string;
  stockCode: string;
  market: "KOSPI";
  sector: "NON_FINANCIAL" | "FINANCIAL";
  stockCodeConfidence: SourceConfidence;
}

export const SAMSUNG_LISTED_AFFILIATES: ListedAffiliateRow[] = [
  { name: "삼성전자",       stockCode: "005930", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "삼성물산",       stockCode: "028260", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "삼성바이오로직스", stockCode: "207940", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "삼성SDI",        stockCode: "006400", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "삼성SDS",        stockCode: "018260", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "삼성E&A",        stockCode: "028050", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "삼성전기",       stockCode: "009150", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "MEDIUM" },
  { name: "삼성중공업",     stockCode: "010140", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "에스원",         stockCode: "012750", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "LOW" },
  { name: "제일기획",       stockCode: "030000", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "LOW" },
  { name: "호텔신라",       stockCode: "008770", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "멀티캠퍼스",     stockCode: "067280", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "LOW" },
  { name: "삼성에피스홀딩스", stockCode: "0126Z0", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "삼성FN리츠",     stockCode: "448730", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "삼성생명",       stockCode: "032830", market: "KOSPI", sector: "FINANCIAL",     stockCodeConfidence: "HIGH" },
  { name: "삼성카드",       stockCode: "029780", market: "KOSPI", sector: "FINANCIAL",     stockCodeConfidence: "HIGH" },
  { name: "삼성증권",       stockCode: "016360", market: "KOSPI", sector: "FINANCIAL",     stockCodeConfidence: "HIGH" },
  { name: "삼성화재",       stockCode: "000810", market: "KOSPI", sector: "FINANCIAL",     stockCodeConfidence: "HIGH" },
];
// 비금융 14 + 금융 4 = 18개. LOW 3곳(에스원·제일기획·멀티캠퍼스)은 구현 착수 시 KRX KIND에서 재확인.

export const SAMSUNG_FAQ = [
  {
    question: "삼성은 지주회사 체제인가요?",
    answer: "아닙니다. 삼성은 SK·LG처럼 공정거래법상 법적 지주회사가 없습니다. 대신 삼성물산이 삼성생명·삼성전자·삼성바이오로직스·삼성SDS 등 핵심 계열사 지분을 나눠 보유하며 사실상 지배구조 정점 역할을 합니다.",
  },
  {
    question: "삼성의 실질적인 지배주주는 누구인가요?",
    answer: "이재용 회장이 삼성물산 지분 22.01%를 개인 명의로 보유하고 있고, 특수관계인 11인을 합치면 38.07%입니다(2026-05-15 기준). 삼성물산이 삼성생명·삼성전자 등을 지배하는 구조이므로, 삼성물산 지분이 곧 그룹 전체에 대한 지분 연결상 영향권으로 이어집니다.",
  },
  {
    question: "삼성전자의 최대주주는 삼성물산인가요, 삼성생명인가요?",
    answer: "삼성생명입니다. 삼성생명이 삼성전자 지분 8.51%로 최대주주이고, 삼성물산도 별도로 5.05%를 직접 보유합니다. 최대주주 및 특수관계인 지분을 모두 합치면 17.32%(2026-07-06 기준)입니다.",
  },
  {
    question: "삼성그룹 상장 계열사는 몇 개인가요?",
    answer: "2026년 5월 1일 공정거래위원회 지정 기준 18개입니다(비금융 14개, 금융 4개). 삼성전자·삼성물산·삼성바이오로직스처럼 잘 알려진 곳부터 삼성FN리츠 같은 리츠까지 포함됩니다.",
  },
  {
    question: "이 지분율은 언제 기준인가요?",
    answer: "회사마다 공시 시점이 달라 표마다 기준일을 따로 표기했습니다. 계열사·상장사 수는 2026년 5월 1일 공정거래위원회 지정 기준이며, 개별 지분율은 2025년 3분기~2026년 7월 사이 보도된 자료를 기준으로 합니다. 정확한 현재 수치는 전자공시시스템에서 다시 확인하는 것이 안전합니다.",
  },
];

export const SAMSUNG_SEO_INTRO = [
  "삼성은 국내 최대 기업집단이자 유일하게 법적 지주회사가 없는 4대 그룹입니다. 대신 삼성물산이 삼성생명(금융)과 삼성전자·삼성바이오로직스·삼성SDS(비금융) 지분을 동시에 보유하며 그룹 전체를 사실상 지배합니다. 이 구조 때문에 \"삼성전자의 진짜 주인이 누구인가\"라는 질문에는 이재용 회장 한 사람이 아니라 삼성물산→삼성생명으로 이어지는 지분 연결 전체를 봐야 정확히 답할 수 있습니다.",
  "이재용 회장은 삼성물산 지분 22.01%를 개인 명의로 보유하고, 특수관계인을 합치면 38.07%입니다. 삼성물산은 이 지배력을 바탕으로 삼성생명 19.34%, 삼성바이오로직스 43.06%, 삼성SDS 17.09%를 보유합니다. 특히 삼성전자는 삼성생명(8.51%, 최대주주)과 삼성물산(5.05%, 직접)이 함께 지분을 보유하는 구조라, 단일 회사 하나만 봐서는 지배관계를 온전히 파악하기 어렵습니다.",
  "삼성그룹은 2026년 5월 1일 공정거래위원회 기준 국내 계열사 67개, 그중 상장사는 18개입니다. 삼성전자·삼성물산처럼 시가총액 상위 대형주부터 삼성FN리츠 같은 부동산투자회사까지 폭넓게 포함됩니다.",
];

export const SAMSUNG_SEO_CRITERIA = [
  "지분율은 DART 공시를 인용한 위즈리포트·언론 보도 등 2차 자료를 종합했습니다 — 원문 대조는 전자공시시스템(dart.fss.or.kr)에서 직접 확인하는 것이 가장 정확합니다.",
  "지분 연결도(트리)는 각 회사의 가장 비중이 큰 상위 지분(주 연결선)만 그리고, 그 외 상위 지분은 보조 텍스트로 표기합니다. 삼성전자·삼성SDS처럼 상위 계열사 2곳 이상에서 지분을 보유하는 경우가 이에 해당합니다.",
  "계열사·상장사 수는 2026년 5월 1일 공정거래위원회 \"공시대상기업집단\" 지정 기준입니다.",
  "\"지배한다\"는 표현 대신 \"지분 연결상 영향권\", \"최대주주 및 특수관계인 기준\" 등 공정거래위원회·금융감독원이 실제 쓰는 용어를 사용합니다.",
];
```

---

## 5. 신규 공유 컴포넌트 — `OwnershipTree.astro`

이 컴포넌트가 이번 설계의 핵심 산출물이다. 9개 그룹 리포트가 전부 이 컴포넌트에 데이터만 바꿔 넣어 재사용한다.

### 5-1. 왜 공유 컴포넌트로 만드는가

`samsung-skhynix-800t-investment-comparison-2026` 리포트(선례)는 SVG를 페이지 `.astro` 파일에 직접 인라인으로 작성했다. 하지만 그 리포트는 1회성 SVG(서울 지도)였고, 이번 지분 트리는 **9개 그룹이 동일한 시각 문법(박스+화살표+% 라벨)을 반복 사용**하므로 페이지마다 복붙하면 유지보수 부담이 크다. 기획 문서 1장의 목표("계열사 데이터 재사용 원칙 확립")에 정확히 해당하는 케이스라 컴포넌트로 분리한다.

### 5-2. 레이아웃 알고리즘 (Astro frontmatter에서 빌드 타임에 계산)

노드 수가 적고(그룹당 6~10개) 깊이도 얕아(3~4단계) 복잡한 레이아웃 엔진은 불필요하다. 아래 단순 재귀 알고리즘으로 충분하다.

```ts
// OwnershipTree.astro의 frontmatter
interface LayoutNode extends GroupCompany {
  depth: number;
  x: number;       // px, 좌상단 기준
  y: number;
  children: LayoutNode[];
}

const NODE_W = 148, NODE_H = 64, COL_GAP = 24, ROW_H = 118;

function buildLayout(nodes: GroupCompany[]): { roots: LayoutNode[]; width: number; height: number } {
  const byId = new Map(nodes.map(n => [n.id, n]));
  const childrenOf = new Map<string, GroupCompany[]>();
  nodes.forEach(n => {
    if (n.primaryParentId) {
      const arr = childrenOf.get(n.primaryParentId) ?? [];
      arr.push(n);
      childrenOf.set(n.primaryParentId, arr);
    }
  });

  // 1) 리프 폭(unit) 계산 — 자식이 없으면 1, 있으면 자식 unit 합
  const unitCache = new Map<string, number>();
  function unitsOf(id: string): number {
    if (unitCache.has(id)) return unitCache.get(id)!;
    const kids = childrenOf.get(id) ?? [];
    const u = kids.length === 0 ? 1 : kids.reduce((sum, k) => sum + unitsOf(k.id), 0);
    unitCache.set(id, u);
    return u;
  }

  // 2) x 좌표 배정 — postorder로 왼쪽부터 채우고, 부모는 자식 중앙에 배치
  let cursor = 0;
  function place(id: string, depth: number): LayoutNode {
    const raw = byId.get(id)!;
    const kids = childrenOf.get(id) ?? [];
    if (kids.length === 0) {
      const x = cursor * (NODE_W + COL_GAP);
      cursor += 1;
      return { ...raw, depth, x, y: depth * ROW_H, children: [] };
    }
    const placedKids = kids.map(k => place(k.id, depth + 1));
    const x = (placedKids[0].x + placedKids[placedKids.length - 1].x) / 2;
    return { ...raw, depth, x, y: depth * ROW_H, children: placedKids };
  }

  const roots = nodes.filter(n => n.primaryParentId === null).map(n => place(n.id, 0));
  const maxDepth = Math.max(...nodes.map(n => {
    let d = 0, cur: GroupCompany | undefined = n;
    while (cur?.primaryParentId) { d++; cur = byId.get(cur.primaryParentId); }
    return d;
  }));
  return {
    roots,
    width: cursor * (NODE_W + COL_GAP),
    height: (maxDepth + 1) * ROW_H + NODE_H,
  };
}
```

이 알고리즘은 삼성처럼 한 부모(삼성물산)가 자식 3개(삼성생명·삼성바이오로직스·삼성SDS)를 갖고, 그중 하나(삼성생명)가 다시 자식 1개(삼성전자)를 갖는 비대칭 트리를 정확히 중앙 정렬한다. LS그룹처럼 **뿌리가 여러 개**(㈜LS·E1·예스코홀딩스, 서로 무관)인 경우도 `roots` 배열이 자동으로 여러 개가 되어 나란히 배치되므로 별도 분기 없이 그대로 재사용 가능하다 (13장 참고).

### 5-3. Props

```ts
interface Props {
  nodes: GroupCompany[];   // groupOwnershipTypes.ts의 타입
  ariaLabel: string;       // "삼성그룹 지분 연결도"
}
```

### 5-4. 렌더링 (SVG)

```astro
---
import type { GroupCompany } from "../data/groupOwnershipTypes";
interface Props { nodes: GroupCompany[]; ariaLabel: string; }
const { nodes, ariaLabel } = Astro.props;
// (5-2의 buildLayout 함수를 이 파일 내부 또는 src/utils/ownershipTreeLayout.ts로 분리해 import)
const { roots, width, height } = buildLayout(nodes);
const flat: LayoutNode[] = []; // roots를 평탄화해 전체 노드 순회용 배열 생성 (재귀 flatten)
---
<div class="ownership-tree-wrap">
  <svg viewBox={`0 0 ${width} ${height}`} class="ownership-tree" role="img" aria-label={ariaLabel}>
    <!-- 1) 간선(부모→자식 연결선 + % 라벨) 먼저 그려서 박스 아래 깔리게 -->
    <g class="ownership-tree__edges">
      {flat.filter(n => n.primaryParentId).map(n => {
        const parent = flat.find(p => p.id === n.primaryParentId)!;
        const x1 = parent.x + NODE_W / 2, y1 = parent.y + NODE_H;
        const x2 = n.x + NODE_W / 2, y2 = n.y;
        const midY = (y1 + y2) / 2;
        return (
          <g>
            <path d={`M ${x1} ${y1} V ${midY} H ${x2} V ${y2}`} class="ownership-tree__edge" marker-end="url(#arrow)" />
            <text x={x2} y={midY - 6} class="ownership-tree__edge-label">{n.primaryRatePercent}%</text>
          </g>
        );
      })}
    </g>
    <!-- 2) 노드 박스 -->
    <g class="ownership-tree__nodes">
      {flat.map(n => (
        <g transform={`translate(${n.x}, ${n.y})`} class={`ownership-tree__node ownership-tree__node--${n.role.toLowerCase()}`}>
          <rect width={NODE_W} height={NODE_H} rx="10" />
          <text x={NODE_W / 2} y="24" class="ownership-tree__node-name">{n.name}</text>
          {n.listed && <text x={NODE_W / 2} y="40" class="ownership-tree__node-code">{n.stockCode}</text>}
          {n.secondaryStakes?.map((s, i) => (
            <text x={NODE_W / 2} y={52 + i * 12} class="ownership-tree__node-secondary">
              + {s.holderName} {s.ratePercent}%
            </text>
          ))}
        </g>
      ))}
    </g>
    <defs>
      <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
        <path d="M0,0 L8,4 L0,8 z" class="ownership-tree__arrow-head" />
      </marker>
    </defs>
  </svg>
</div>
```

모바일에서는 `.ownership-tree-wrap { overflow-x: auto; }`로 가로 스크롤 처리 — 트리가 좁으면(삼성 6노드 기준 최대 3열) 대부분 화면 안에 들어오지만, LS(3개 지주사 병렬)처럼 넓어지는 그룹 대비 안전장치.

---

## 6. 페이지 IA (섹션 순서)

```
Hero
 └─ eyebrow: 삼성그룹
 └─ title: 삼성그룹 지분구조 2026 완전 정리
 └─ description: 삼성물산·삼성생명·삼성전자로 이어지는 지분 연결과 상장 계열사 18개를 정리했습니다.

InfoNotice — SAMSUNG_META.dataSourceNotice + 기준일

섹션 1 — 삼성은 지주회사 체제인가? (짧은 설명 단락)
섹션 2 — 지분 연결도 (OwnershipTree 컴포넌트) ★ 핵심
섹션 3 — 오너 및 핵심 지분 연결 표 (SAMSUNG_OWNERSHIP_FACTS, 신뢰도 배지 포함)
섹션 4 — 상장 계열사 전체 목록 (SAMSUNG_LISTED_AFFILIATES, 18개 표, 비금융/금융 구분)
섹션 5 — 관련 CTA → 간접 지분율 계산기, 다른 그룹 리포트(재계 순위 2~4위: SK·현대차·LG)
FAQ + SeoContent
```

---

## 7. 컴포넌트 구조

### 기존 공유 컴포넌트 (그대로 사용)

| 컴포넌트 | 용도 |
|---|---|
| `BaseLayout.astro` | `<head>`, SEO, JSON-LD |
| `SiteHeader.astro` | 전역 헤더 |
| `CalculatorHero.astro` | Hero 섹션 (`eyebrow`/`title`/`description` 3개 prop만 받음) |
| `InfoNotice.astro` | 고지 배너 (`title`/`lines: string[]` prop만 받음 — 배지·타입 prop 없음, 확인 완료) |
| `SeoContent.astro` | SEO 텍스트 + FAQ (`introTitle`/`intro`/`inputPoints`/`criteria`/`faq`/`related`) |

### 신규 공유 컴포넌트

| 컴포넌트 | 용도 |
|---|---|
| `OwnershipTree.astro` | 지분 연결도 SVG (5장) — 9개 그룹 페이지 전부 재사용 |

### 페이지 전용 마크업 (인라인)

| 블록 클래스 | 설명 |
|---|---|
| `.sgo-holding-note` | "지주회사 체제인가?" 설명 카드 |
| `.sgo-fact-table` | 오너·핵심 연결 표 (신뢰도 배지 포함) |
| `.sgo-confidence-badge--high/medium/low` | 신뢰도 배지 (녹/황/회색) |
| `.sgo-listed-table` | 상장 계열사 표 |
| `.sgo-sector-tag--financial/non-financial` | 금융/비금융 구분 태그 |
| `.sgo-cta-group` | 내부 CTA 버튼 묶음 |

---

## 8. SCSS 설계

### 8-1. `src/styles/scss/_ownership-tree.scss` (신규, 공유)

```scss
.ownership-tree-wrap {
  overflow-x: auto;
  padding: 0.5rem 0 1rem;
}

.ownership-tree {
  --ot-line: #cbd5e1;
  --ot-ink: #14213d;
  --ot-muted: #64748b;
  --ot-owner-bg: #f5f7fb;
  --ot-owner-border: #94a3b8;
  --ot-core-bg: #eff4ff;
  --ot-core-border: #1a56db;
  --ot-affiliate-bg: #ffffff;
  --ot-affiliate-border: #cbd5e1;
  --ot-financial-border: #0891b2;
  min-width: 480px; // 노드 3열 기준 최소폭 — 그룹별로 필요시 인라인 style로 override
}

.ownership-tree__edge {
  fill: none;
  stroke: var(--ot-line);
  stroke-width: 1.5;
}
.ownership-tree__edge-label {
  font-size: 11px;
  fill: var(--ot-ink);
  font-weight: 600;
  text-anchor: middle;
}
.ownership-tree__node rect {
  fill: var(--ot-affiliate-bg);
  stroke: var(--ot-affiliate-border);
  stroke-width: 1.5;
}
.ownership-tree__node--owner_family rect    { fill: var(--ot-owner-bg); stroke: var(--ot-owner-border); stroke-dasharray: 3 2; }
.ownership-tree__node--core_company rect    { fill: var(--ot-core-bg); stroke: var(--ot-core-border); stroke-width: 2; }
.ownership-tree__node-name {
  font-size: 12.5px;
  font-weight: 700;
  fill: var(--ot-ink);
  text-anchor: middle;
}
.ownership-tree__node-code, .ownership-tree__node-secondary {
  font-size: 10px;
  fill: var(--ot-muted);
  text-anchor: middle;
}
```

### 8-2. `src/styles/scss/pages/_samsung-group-ownership-2026.scss`

```scss
.sgo-page {
  --sgo-ink: #14213d;
  --sgo-muted: #5d6b82;
  --sgo-line: rgba(20, 33, 61, 0.12);
}

.sgo-fact-table, .sgo-listed-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
  th, td { padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--sgo-line); text-align: left; }
}

.sgo-confidence-badge {
  display: inline-flex; align-items: center; padding: 0.1rem 0.5rem;
  border-radius: 999px; font-size: 0.7rem; font-weight: 600;
}
.sgo-confidence-badge--high   { background: #d1fae5; color: #059669; }
.sgo-confidence-badge--medium { background: #fef3c7; color: #d97706; }
.sgo-confidence-badge--low    { background: #e2e8f0; color: #64748b; }

.sgo-sector-tag {
  font-size: 0.7rem; padding: 0.1rem 0.45rem; border-radius: 6px;
}
.sgo-sector-tag--non-financial { background: #eff4ff; color: #1a56db; }
.sgo-sector-tag--financial     { background: #e0f2fe; color: #0891b2; }

.sgo-cta-group { display: flex; flex-wrap: wrap; gap: 0.75rem; margin: 1.25rem 0; }
```

`confidence` 배지 색상(높음=녹/중간=황/낮음=회색)은 기획 문서 2장에서 정한 신뢰도 3단계와 그대로 매핑 — 다른 8개 그룹도 동일 클래스명(`.sgo-confidence-badge--*`)이 아니라 그룹별 prefix로 재정의하되 **색상 값 자체는 통일**한다(13장).

---

## 9. Astro 페이지 구조

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import OwnershipTree from "../../components/OwnershipTree.astro";
import {
  SAMSUNG_META, SAMSUNG_TREE_NODES, SAMSUNG_OWNERSHIP_FACTS,
  SAMSUNG_LISTED_AFFILIATES, SAMSUNG_FAQ, SAMSUNG_SEO_INTRO, SAMSUNG_SEO_CRITERIA,
} from "../../data/samsungGroupOwnership2026";

const title = "삼성그룹 지분구조 2026 완전 정리 | 삼성물산·삼성생명·삼성전자 지배관계";
const description = "이재용 및 특수관계인 지분부터 삼성물산→삼성생명→삼성전자 연결까지 지분구조를 정리. 상장 계열사 18개 전체 목록 포함.";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: title,
  datePublished: SAMSUNG_META.updatedAt,
};

function confidenceLabel(c: string) {
  return c === "HIGH" ? "높음" : c === "MEDIUM" ? "중간" : "낮음";
}
function confidenceClass(c: string) {
  return c === "HIGH" ? "high" : c === "MEDIUM" ? "medium" : "low";
}
---
<BaseLayout title={title} description={description} jsonLd={jsonLd}>
  <SiteHeader />
  <main class="container page-shell sgo-page">

    <CalculatorHero
      eyebrow="삼성그룹"
      title="삼성그룹 지분구조 2026 완전 정리"
      description="삼성물산·삼성생명·삼성전자로 이어지는 지분 연결과 상장 계열사 18개를 정리했습니다."
    />

    <InfoNotice
      title="데이터 안내"
      lines={[
        SAMSUNG_META.dataSourceNotice,
        `계열사·상장사 수 기준일: ${SAMSUNG_META.affiliateCountBaseDate} (공정거래위원회 지정)`,
        `콘텐츠 업데이트: ${SAMSUNG_META.updatedAt}`,
      ]}
    />

    <!-- 섹션 1: 지주회사 체제인가 -->
    <section class="content-section sgo-holding-note">
      <h2>삼성은 지주회사 체제인가?</h2>
      <p>{SAMSUNG_META.holdingCompanyNote}</p>
    </section>

    <!-- 섹션 2: 지분 연결도 ★ -->
    <section class="content-section">
      <h2>지분 연결도</h2>
      <OwnershipTree nodes={SAMSUNG_TREE_NODES} ariaLabel="삼성그룹 지분 연결도" />
      <p class="sgo-tree-note">가장 비중이 큰 상위 지분(주 연결선)만 표시했습니다. "+"로 표기된 항목은 다른 계열사가 보유한 보조 지분입니다.</p>
    </section>

    <!-- 섹션 3: 오너·핵심 연결 표 -->
    <section class="content-section">
      <h2>오너 및 핵심 지분 연결</h2>
      <table class="sgo-fact-table">
        <thead><tr><th>연결</th><th>지분율</th><th>기준일</th><th>신뢰도</th></tr></thead>
        <tbody>
          {SAMSUNG_OWNERSHIP_FACTS.map(f => (
            <tr>
              <td>{f.label}</td>
              <td>{f.ratePercent}%</td>
              <td>{f.baseDate}</td>
              <td><span class={`sgo-confidence-badge sgo-confidence-badge--${confidenceClass(f.confidence)}`}>{confidenceLabel(f.confidence)}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>

    <!-- 섹션 4: 상장 계열사 목록 -->
    <section class="content-section">
      <h2>상장 계열사 전체 목록 ({SAMSUNG_META.listedAffiliateCount}개)</h2>
      <table class="sgo-listed-table">
        <thead><tr><th>회사명</th><th>종목코드</th><th>시장</th><th>구분</th></tr></thead>
        <tbody>
          {SAMSUNG_LISTED_AFFILIATES.map(c => (
            <tr>
              <td>{c.name}</td>
              <td>{c.stockCode}</td>
              <td>{c.market}</td>
              <td><span class={`sgo-sector-tag sgo-sector-tag--${c.sector === 'FINANCIAL' ? 'financial' : 'non-financial'}`}>{c.sector === 'FINANCIAL' ? '금융' : '비금융'}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>

    <!-- 섹션 5: CTA -->
    <section class="content-section">
      <div class="sgo-cta-group">
        <a href="/tools/indirect-ownership-calculator/">간접 지분율 계산기 →</a>
        <a href="/reports/sk-group-ownership-2026/">SK그룹 지분구조 →</a>
        <a href="/reports/hyundai-motor-group-ownership-2026/">현대차그룹 지분구조 →</a>
        <a href="/reports/lg-group-ownership-2026/">LG그룹 지분구조 →</a>
      </div>
    </section>

    <SeoContent
      introTitle="삼성그룹 지분구조, 숫자 하나로 안 끝나는 이유"
      intro={SAMSUNG_SEO_INTRO}
      criteria={SAMSUNG_SEO_CRITERIA}
      faq={SAMSUNG_FAQ.map(f => ({ question: f.question, answer: f.answer }))}
      related={[
        { href: "/tools/indirect-ownership-calculator/", label: "간접 지분율 계산기" },
        { href: "/reports/sk-group-ownership-2026/", label: "SK그룹 지분구조 2026" },
        { href: "/reports/hyundai-motor-group-ownership-2026/", label: "현대차그룹 지분구조 2026" },
        { href: "/reports/lg-group-ownership-2026/", label: "LG그룹 지분구조 2026" },
        { href: "/reports/group-ownership-hub-2026/", label: "9개 그룹 지분구조 한눈에 비교" },
      ]}
    />
  </main>
</BaseLayout>
```

---

## 10. `reports.ts` 등록

```ts
{
  slug: "samsung-group-ownership-2026",
  title: "삼성그룹 지분구조 2026 완전 정리 | 삼성물산·삼성생명·삼성전자 지배관계",
  description: "이재용 및 특수관계인 지분부터 삼성물산→삼성생명→삼성전자 연결까지 지분구조를 정리. 상장 계열사 18개 전체 목록 포함.",
  order: 77,
  badges: ["삼성", "지분구조", "2026"],
},
```

나머지 8개 그룹은 `order: 77.1`~`77.8`, 허브 페이지는 `order: 77.9`로 이어서 등록 예정(다음 그룹 설계 시).

---

## 11. `app.scss` import

```scss
@use 'scss/ownership-tree';                        // 신규 공유 — 9개 그룹 공통, 한 번만 추가
@use 'scss/pages/samsung-group-ownership-2026';
```

`ownership-tree`는 이후 8개 그룹 설계 시 다시 추가하지 않는다 (이미 import됨).

---

## 12. `sitemap.xml`

```xml
<url>
  <loc>https://bigyocalc.com/reports/samsung-group-ownership-2026/</loc>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
```

---

## 13. 다음 8개 그룹에 그대로 재사용할 패턴 (일반화 지침)

삼성 설계에서 확정된 것 중 **그대로 복제**할 것과 **그룹별로 판단**해야 할 것을 구분한다.

### 그대로 복제
- `groupOwnershipTypes.ts`의 모든 타입 (수정 없이 import만)
- `OwnershipTree.astro`, `_ownership-tree.scss` (컴포넌트·스타일 파일 자체를 재사용, 그룹마다 새로 안 만듦)
- 페이지 IA 5섹션 순서(지주회사 여부 → 지분 연결도 → 핵심 연결 표 → 상장 목록 → CTA)
- `sgo-confidence-badge` 계열 색상 규칙(높음=녹/중간=황/낮음=회색) — 클래스명 prefix만 그룹별로 변경(`sko-`, `lgo-` 등)

### 그룹별 판단 필요
| 그룹 | 이슈 | 삼성 설계에서 이미 답을 마련해둔 것 |
|---|---|---|
| LS | 지주사 3개, 서로 무관 | `buildLayout`이 `roots` 배열을 지원하므로 `primaryParentId: null`인 노드 3개(㈜LS·E1·예스코홀딩스)를 그대로 넣으면 됨 — 컴포넌트 수정 불필요 |
| 현대차 | 순환출자(현대모비스→현대차→기아→현대모비스) | 트리 알고리즘은 DAG 순환을 다루지 못한다. **마지막 간선(기아→현대모비스)은 트리에 넣지 않고 별도 텍스트 설명("순환 고리" 배지)으로 대체** — `GroupCompany`에 `circularNote?: string` 필드 추가 검토 |
| 두산 | 법적 지주회사 아님 | `isLegalHoldingCompany: false` + `holdingCompanyNote`로 이미 대응 가능 (삼성과 동일 패턴) |
| 한화 | 2026년 분할 진행 중 | `dataSourceNotice`에 "OO 시점 기준, 개편 진행 중" 문구를 추가하는 방식으로 대응 — 발행 시점에 재확인 필요 |

### 아직 안 정한 것 (허브 페이지 설계 시 결정)
- `group-ownership-hub-2026` 페이지의 비교표 데이터 파일(`groupOwnershipSummary2026.ts`) 구조 — 9개 그룹 데이터가 모두 나온 뒤에 설계

---

## 14. QA 포인트

- [ ] `OwnershipTree` SVG가 모바일(360px 폭)에서 가로 스크롤로 정상 표시되는지
- [ ] 삼성전자·삼성SDS 노드 아래 보조 지분("+ 삼성물산 직접 5.05%" 등)이 정상 렌더링되는지
- [ ] `sgo-confidence-badge` 3단계 색상(녹/황/회색)이 `SAMSUNG_OWNERSHIP_FACTS`의 `confidence` 값과 정확히 매칭되는지
- [ ] 상장 계열사 표 18개 행 전부 렌더링, 금융/비금융 태그 색상 구분 확인
- [ ] InfoNotice에 2차 출처 고지 문구가 노출되는지 (기획 문서 2장 원칙)
- [ ] "지배한다" 단정 표현이 본문·FAQ에 없는지
- [ ] 내부 CTA 5개(계산기 1 + 그룹 리포트 3 + 허브 1) 링크 확인 — 단, SK·현대차·LG·허브 페이지는 이 문서 작성 시점에 아직 없으므로 **해당 페이지들이 실제로 만들어진 뒤에만 링크를 활성화**(먼저 만들면 404)
- [ ] `npm run build` 통과, 라우트 `/reports/samsung-group-ownership-2026/` 존재 확인
- [ ] `stockCodeConfidence: "LOW"`인 3개 종목코드(에스원·제일기획·멀티캠퍼스)는 구현 착수 전 KRX KIND에서 재확인 후 `HIGH`로 갱신
