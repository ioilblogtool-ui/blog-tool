# HBM4 vs HBM5 세대 비교·수혜기업 리포트 — 설계 문서

> 기획 원문: `docs/plan/202608/hbm4-vs-hbm5-beneficiary-comparison.md`
> 작성일: 2026-07-22
> 구현 기준: Claude/Codex가 이 문서를 보고 바로 구현에 착수할 수 있는 수준으로 고정

---

## 1. 문서 개요

### 1-1. 대상

- 구현 대상: `HBM4 vs HBM5 세대 비교·수혜기업 리포트`
- slug: `hbm4-vs-hbm5-beneficiary-comparison`
- URL: `/reports/hbm4-vs-hbm5-beneficiary-comparison/`
- 참고 리포트: `semiconductor-value-chain`(기업 데이터·컴포넌트 재사용 대상), `semiconductor-etf-2026`, `samsung-vs-skhynix-earnings-bonus-2026`

### 1-2. 문서 역할

기획 문서를 현재 비교계산소 `/reports/` 구조와 **기존 `semiconductorValueChain.ts`의 실제 데이터 구조**에 맞게 구현 직전 수준으로 재구성한다. 신규 컴포넌트를 최소화하고 기존 `VC_COMPANIES` 데이터를 그대로 재사용한다.

### 1-3. 페이지 성격

- **독립형 세대 비교 리포트**: HBM3E→HBM4→HBM4E→HBM5 스펙 변화 + 수혜기업 지도
- **핵심 흐름**: `세대별 스펙 비교 → 전환 타임라인 → 삼성 vs SK하이닉스 포지션 → 수혜기업 지도 → 오해 해소 → 관련 리포트 연결`
- **SEO 포지셔닝**: "HBM4 HBM5 차이" 세대 비교 검색 + "HBM 수혜주" 투자 정보 탐색 동시 커버

---

## 2. 기존 데이터 재사용 계획 (신규 중복 정의 금지)

`src/data/semiconductorValueChain.ts`에 이미 존재하는 기업 데이터를 **그대로 import**해서 재사용한다.

```ts
import { VC_COMPANIES, VC_META } from "./semiconductorValueChain";

// HBM 관련 기업만 필터링해서 재사용 (신규 기업 프로필 데이터를 중복 작성하지 않음)
const HBM_RELATED_COMPANY_IDS = [
  "samsung",       // 메모리 제조
  "skhynix",       // 메모리 제조
  "micron",        // 메모리 제조
  "tsmc",          // 파운드리(베이스 다이 위탁)
  "hms",           // 한미반도체(패키징 장비)
  "amkor",         // 후공정
  "speta",         // 이수페타시스(후공정)
  "isc",           // 테스트
  "lino",          // 리노공업(테스트)
  "okins",         // 오킨스전자(테스트)
];
// 실제 id 값은 semiconductorValueChain.ts의 VC_COMPANIES 배열에서 구현 착수 전 재확인한다.
```

> 환율 상수(`VC_META.usdKrw`)와 면책 문구(`VC_META.disclaimer`)도 새로 정의하지 않고 그대로 재사용한다.

---

## 3. 구현 파일 구조

```text
src/
  data/
    hbm4VsHbm5Comparison.ts     ← 세대(generations) 데이터 + 타임라인 + 오해 카드
                                   (기업 데이터는 semiconductorValueChain.ts에서 import)
  pages/
    reports/
      hbm4-vs-hbm5-beneficiary-comparison.astro

public/
  scripts/
    hbm4-vs-hbm5-beneficiary-comparison.js   ← 필요 시(세대 카드 토글용, 없어도 무방한 경량 인터랙션)

src/styles/scss/pages/
  _hbm4-vs-hbm5-beneficiary-comparison.scss
```

추가 등록: `src/data/reports.ts`, `src/pages/reports/index.astro`, `src/styles/app.scss`, `public/sitemap.xml`, `src/pages/index.astro`의 `reportMetaBySlug`(category: `asset`)

---

## 4. 구현 범위

### 4-1. MVP 범위

- 세대별 스펙 비교표(HBM3E→HBM4→HBM4E→HBM5) — 정적 마크업
- 세대 전환 타임라인 — 정적 마크업
- 삼성전자 vs SK하이닉스 포지션 비교표
- 수혜기업 지도 — `VC_COMPANIES`에서 필터링한 카드 리스트(클릭 시 상세 펼침, 순수 CSS `<details>` 또는 최소 JS 토글)
- 자주 하는 오해 3가지 카드
- FAQ

### 4-2. MVP 제외 범위

- `semiconductor-value-chain`의 FlowMap 같은 복잡한 플로우맵 재구현(불필요 — 세대 비교는 표 형태가 더 적합)
- 실시간 시총·주가 API 연동
- 국가 필터 토글(이 리포트는 세대 비교가 핵심이라 국가 필터는 과잉 기능)

---

## 5. 페이지 목적 및 사용자 시나리오

### 5-1. 페이지 목적

HBM 세대(HBM3E→HBM4→HBM4E→HBM5)별 스펙 변화를 숫자로 명확히 비교하고, 메모리 제조사뿐 아니라 파운드리·패키징·테스트까지 포함한 밸류체인 전체의 수혜기업을 정리한다.

### 5-2. 사용자 시나리오

- **반도체 ETF 투자자**: "HBM4 HBM5 차이" 검색 → 세대 비교표 확인 → 수혜기업 지도에서 보유 종목 확인 → ETF 리포트로 이동
- **삼성전자 vs SK하이닉스 콘텐츠 기존 독자**: `samsung-vs-skhynix-earnings-bonus-2026`에서 유입 → HBM 기술 경쟁 관점 추가 확인
- **일반 검색 유입**: "HBM5 언제 나오나" 검색 → "목업 공개 단계"라는 정확한 현황 확인

---

## 6. 데이터 구조 (`src/data/hbm4VsHbm5Comparison.ts`)

```ts
export type HbmGenerationStatus = "legacy" | "production" | "earlyProduction" | "mockupOnly";

export interface HbmGeneration {
  id: "hbm3e" | "hbm4" | "hbm4e" | "hbm5";
  name: string;
  interfaceWidthBit: number | null;
  maxDataRateGbps: number | null;
  maxBandwidthTBs: number | null;
  status: HbmGenerationStatus;
  statusLabel: string;      // "양산 중" / "목업 공개(스펙 미확정)" 등
  leadCompanyId: string | null; // semiconductorValueChain.ts의 VC_COMPANIES id 참조
  note: string;
}

export interface HbmTimelineEntry {
  date: string;         // "2026-02"
  label: string;
  description: string;
}

export interface HbmPositionRow {
  aspect: string;        // "HBM3E 시대" 등
  samsung: string;
  skhynix: string;
}

export interface HbmMythCard {
  claim: string;
  fact: string;
}

export interface HbmFaqItem {
  question: string;
  answer: string;
}

export const HBM_GENERATIONS: HbmGeneration[] = [
  {
    id: "hbm3e",
    name: "HBM3E",
    interfaceWidthBit: 1024,
    maxDataRateGbps: 9.6,
    maxBandwidthTBs: 1.2,
    status: "legacy",
    statusLabel: "양산 중(이전 세대)",
    leadCompanyId: "skhynix",
    note: "2024~2025년 주력, SK하이닉스가 시장 주도",
  },
  {
    id: "hbm4",
    name: "HBM4",
    interfaceWidthBit: 2048,
    maxDataRateGbps: 11.7,
    maxBandwidthTBs: 2.0,
    status: "production",
    statusLabel: "양산 중",
    leadCompanyId: "samsung",
    note: "삼성전자 2026-02 세계 최초 양산 출하, 인터페이스 폭 HBM3E 대비 2배",
  },
  {
    id: "hbm4e",
    name: "HBM4E",
    interfaceWidthBit: 2048,
    maxDataRateGbps: 16,
    maxBandwidthTBs: 4.0,
    status: "earlyProduction",
    statusLabel: "양산 초기",
    leadCompanyId: null,
    note: "삼성 48GB 용량 공개, SK하이닉스 TSMC 최선단 공정으로 전환",
  },
  {
    id: "hbm5",
    name: "HBM5",
    interfaceWidthBit: null,
    maxDataRateGbps: null,
    maxBandwidthTBs: null,
    status: "mockupOnly",
    statusLabel: "목업 공개(스펙 미확정)",
    leadCompanyId: "samsung",
    note: "삼성전자 실물 목업 공개, 베이스 다이 2nm 공정 예고",
  },
];

export const HBM_TIMELINE: HbmTimelineEntry[] = [
  { date: "2024~2025", label: "HBM3E 주력", description: "SK하이닉스 시장 주도" },
  { date: "2026-02", label: "삼성전자 HBM4 양산", description: "세계 최초 양산 출하" },
  { date: "2026-06", label: "SK하이닉스 HBM4 공급 발표", description: "삼성 발표 3주 만에 공급 발표, 컴퓨텍스에서 HBM4E·HBF 공개" },
  { date: "2026-06", label: "삼성전자 HBM5 목업 공개", description: "베이스 다이 2nm 공정 예고" },
  { date: "2026-07~", label: "HBM4 시장 확대", description: "삼성·SK·마이크론 점유율 경쟁 심화" },
];

export const HBM_POSITION_TABLE: HbmPositionRow[] = [
  { aspect: "HBM3E 시대", samsung: "추격 입장", skhynix: "시장 주도" },
  { aspect: "HBM4 양산", samsung: "2026년 2월 세계 최초 양산 출하", skhynix: "3주 뒤 공급 발표로 추격" },
  { aspect: "베이스 다이 공정", samsung: "자사 파운드리 4나노", skhynix: "TSMC 최선단 공정으로 전환" },
  { aspect: "HBM5 관련", samsung: "실물 목업 최초 공개, 2nm 베이스 다이 예고", skhynix: "컴퓨텍스에서 차세대 폼팩터(HBF 등) 공개" },
  { aspect: "2026년 종합 평가", samsung: "격차 좁히며 추격", skhynix: "방열 등 기존 강점으로 대응" },
];

export const HBM_MYTH_CARDS: HbmMythCard[] = [
  { claim: "HBM은 다 똑같은 메모리다", fact: "세대(HBM3E→HBM4→HBM5)마다 인터페이스 폭과 속도가 크게 달라지고, AI 칩 한 장에 들어가는 HBM 가치도 세대마다 달라진다." },
  { claim: "SK하이닉스가 항상 1위다", fact: "HBM3E 시대는 SK하이닉스가 주도했지만, HBM4부터는 삼성전자가 세계 최초 양산으로 추격하며 격차가 좁혀졌다." },
  { claim: "HBM5는 이미 출시됐다", fact: "2026년 7월 기준 HBM5는 실물 목업 공개 단계이며, 정식 양산 스펙과 시점은 아직 확정되지 않았다." },
];

export const HBM_FAQ: HbmFaqItem[] = [
  { question: "HBM4와 HBM5의 가장 큰 차이는 무엇인가요?", answer: "HBM4는 HBM3E 대비 인터페이스 폭이 2배로 늘어난 세대이며, HBM5는 아직 실물 목업 공개 단계로 베이스 다이에 2나노 공정 적용이 예고된 차세대 규격입니다. 정식 양산 스펙은 2026년 7월 기준 확정되지 않았습니다." },
  { question: "삼성전자와 SK하이닉스 중 누가 앞서 있나요?", answer: "HBM3E 시대는 SK하이닉스가 주도했지만, HBM4부터는 삼성전자가 2026년 2월 세계 최초로 양산 출하하며 격차를 좁혀 2026년 기준 백중세로 평가됩니다." },
  { question: "HBM 세대 전환의 수혜는 메모리 회사에만 있나요?", answer: "아닙니다. 베이스 다이를 위탁 생산하는 파운드리, 적층·패키징을 담당하는 후공정 기업, 테스트 소켓을 공급하는 검사장비 기업까지 밸류체인 전반에 영향이 미칩니다." },
  { question: "이 리포트의 종목 정보는 투자 추천인가요?", answer: "아닙니다. 공개된 보도자료와 언론 보도를 기준으로 정리한 참고 정보이며, 투자 판단과 책임은 본인에게 있습니다." },
];

export const HBM_META = {
  slug: "hbm4-vs-hbm5-beneficiary-comparison",
  title: "HBM4 vs HBM5 차이 2026 | 스펙 비교와 수혜기업 총정리",
  description: "HBM3E부터 HBM5까지 세대별 인터페이스 폭·전송속도·대역폭 변화를 비교하고, 삼성전자·SK하이닉스부터 패키징·테스트 기업까지 수혜기업을 정리했습니다.",
  updatedAt: "2026-07-22",
};
```

---

## 7. 페이지 IA

1. **Hero** — "HBM4 vs HBM5 세대 비교·수혜기업 리포트"
2. **InfoNotice** — 투자 권유 아님 + HBM5 목업 단계 고지 + 데이터 기준일
3. **세대별 스펙 비교표** (핵심 섹션 1)
4. **세대 전환 타임라인**
5. **삼성전자 vs SK하이닉스 포지션 비교표**
6. **수혜기업 지도** (`VC_COMPANIES` 필터링 카드, 핵심 섹션 2)
7. **자주 하는 오해 3가지**
8. **SeoContent(FAQ 포함)** + 관련 리포트·계산기 CTA

---

## 8. 섹션 상세

### 8-1. 세대별 스펙 비교표

레이아웃: PC는 표, 모바일은 세대별 카드 스택(`.hbm-gen-card`).

| 컬럼 | 내용 |
|---|---|
| 세대 | HBM3E/HBM4/HBM4E/HBM5 |
| 인터페이스 폭 | 1,024-bit / 2,048-bit / 2,048-bit / 미확정 |
| 데이터 전송속도 | 9.6 / 11.7 / 16 / 미확정 Gbps |
| 대역폭 | 1.2 / 2.0 / 4.0 / 미확정 TB/s |
| 상태 배지 | `statusLabel` 그대로 렌더링, `mockupOnly`는 별도 회색 배지 스타일 |

`interfaceWidthBit`가 `null`인 세대는 "확정 전"으로 표시하고 수치 대신 대시(—)를 렌더링한다.

### 8-2. 세대 전환 타임라인

세로 타임라인 컴포넌트. `HBM_TIMELINE` 배열을 날짜순으로 렌더링. 각 항목은 `date`(칩) + `label`(굵게) + `description`(본문) 3단 구성.

### 8-3. 삼성전자 vs SK하이닉스 포지션

`HBM_POSITION_TABLE`을 2열 비교표로 렌더링(항목 / 삼성전자 / SK하이닉스). 기존 `samsung-vs-skhynix-earnings-bonus-2026`과 겹치지 않도록 이 표는 **HBM 기술 경쟁에만 집중**하고 실적·성과급 수치는 다루지 않는다.

### 8-4. 수혜기업 지도

`VC_COMPANIES`에서 `HBM_RELATED_COMPANY_IDS`에 해당하는 항목만 필터링해 카드로 렌더링. 카드 구성은 `semiconductor-value-chain`의 기업 상세 패널과 동일한 필드(시총, 매출, 역할, 포함 ETF)를 재사용하되, 이 리포트에서는 "HBM 세대 전환 시 포인트"라는 문구 한 줄을 추가로 표시한다(신규 필드, `hbm4VsHbm5Comparison.ts`에서 기업 id별 매핑 테이블로 별도 관리).

```ts
export const HBM_BENEFICIARY_NOTES: Record<string, string> = {
  samsung: "HBM4 세계 최초 양산 + HBM5 목업 공개로 주도권 확대",
  skhynix: "TSMC 파운드리 전환으로 HBM4 이후 대응력 강화",
  micron: "메모리 3강 구도 유지, ASP 상승 수혜",
  tsmc: "SK하이닉스 HBM4·HBM4E 베이스 다이 위탁 생산 물량 증가",
  hms: "HBM 적층 패키징 장비(TC본더) 수요 확대",
  amkor: "어드밴스드 패키징 물량 증가",
  speta: "패키징 기판 수요 확대",
  isc: "고속·고발열 HBM 테스트 소켓 수요 확대",
  lino: "HBM 테스트 소켓 단가 방어력",
  okins: "HBM 검사 공정 확대 수혜",
};
```

### 8-5. 자주 하는 오해 3가지

`HBM_MYTH_CARDS`를 3열(모바일 1열) 카드로 렌더링.

---

## 9. JavaScript 설계 (경량 — 인터랙션 최소)

이 리포트는 계산기가 아니므로 JS 의존도를 낮춘다. 세대 비교표의 "확정 전" 셀 강조, 모바일 카드 토글 정도만 처리한다.

```js
// public/scripts/hbm4-vs-hbm5-beneficiary-comparison.js
(() => {
  // 모바일 세대 카드에서 "자세히 보기" 토글(선택적 — <details> 태그로 대체 가능하면 JS 생략)
  document.querySelectorAll('[data-hbm-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-hbm-toggle');
      const panel = document.getElementById(targetId);
      if (!panel) return;
      const isHidden = panel.hasAttribute('hidden');
      if (isHidden) panel.removeAttribute('hidden');
      else panel.setAttribute('hidden', '');
      btn.setAttribute('aria-expanded', String(isHidden));
    });
  });
})();
```

> 가능하면 네이티브 `<details>/<summary>`로 대체해 JS 없이 구현하는 것을 우선 검토한다.

---

## 10. SCSS 설계 (핵심 발췌)

```scss
.hbm-page {
  .hbm-gen-table-wrap {
    overflow-x: auto;
    margin-top: 20px;
  }

  .hbm-gen-table {
    width: 100%;
    min-width: 640px;
    border-collapse: collapse;
    font-size: 0.86rem;

    th, td {
      padding: 10px 12px;
      border-bottom: 1px solid #e8ede9;
      text-align: center;
    }

    th {
      background: #f8fcfa;
      font-weight: 800;
      color: #374151;
    }

    td:first-child, th:first-child {
      text-align: left;
    }
  }

  .hbm-status-badge {
    display: inline-flex;
    border-radius: 999px;
    padding: 3px 9px;
    font-size: 0.72rem;
    font-weight: 800;

    &--production { background: #dcfce7; color: #166534; }
    &--earlyProduction { background: #fef3c7; color: #92400e; }
    &--legacy { background: #f3f4f6; color: #4b5563; }
    &--mockupOnly { background: #e0e7ff; color: #3730a3; }
  }

  .hbm-timeline {
    display: grid;
    gap: 16px;
    margin-top: 20px;
    padding-left: 20px;
    border-left: 2px solid #e8ede9;
  }

  .hbm-timeline-item {
    position: relative;

    &::before {
      content: '';
      position: absolute;
      left: -25px;
      top: 4px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #0f6e56;
    }

    .hbm-timeline-date {
      font-size: 0.74rem;
      font-weight: 800;
      color: #0f6e56;
    }

    .hbm-timeline-label {
      font-weight: 800;
      color: #111827;
      margin: 2px 0 4px;
    }

    .hbm-timeline-desc {
      font-size: 0.84rem;
      color: #6b7280;
    }
  }

  .hbm-position-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    font-size: 0.86rem;

    th, td {
      padding: 10px 12px;
      border-bottom: 1px solid #e8ede9;
    }
  }

  .hbm-beneficiary-grid {
    display: grid;
    gap: 12px;
    margin-top: 20px;

    @media (min-width: 768px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    @media (min-width: 1100px) {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  .hbm-beneficiary-card {
    border: 1px solid #e8ede9;
    border-radius: 12px;
    padding: 14px 16px;
    background: #fff;

    .hbm-beneficiary-note {
      margin-top: 8px;
      font-size: 0.8rem;
      color: #0f6e56;
      font-weight: 700;
    }
  }

  .hbm-myth-grid {
    display: grid;
    gap: 12px;
    margin-top: 20px;

    @media (min-width: 768px) {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
}
```

---

## 11. SEO 설계

```text
title: HBM4 vs HBM5 차이 2026 | 스펙 비교와 수혜기업 총정리
description: HBM3E부터 HBM5까지 세대별 인터페이스 폭·전송속도·대역폭 변화를 비교하고, 삼성전자·SK하이닉스부터 패키징·테스트 기업까지 수혜기업을 정리했습니다.
H1: HBM4 vs HBM5, 무엇이 달라지나
```

키워드: HBM4 HBM5 차이, HBM 수혜주, HBM4 스펙, 삼성전자 SK하이닉스 HBM 경쟁, HBM 패키징 수혜기업

JSON-LD: `Article` + `FAQPage`

---

## 12. SeoContent 초안

### intro

1. HBM(고대역폭메모리)은 AI 반도체의 핵심 부품으로, 세대가 바뀔 때마다 인터페이스 폭과 전송속도가 크게 달라집니다. 이 리포트는 현재 양산 중인 HBM4부터 목업 단계인 HBM5까지, 세대별 스펙 변화를 숫자로 비교하고 어떤 기업이 수혜를 받는지 정리했습니다.

2. HBM3E 시대는 SK하이닉스가 시장을 주도했지만, 2026년 2월 삼성전자가 HBM4를 세계 최초로 양산 출하하면서 격차가 좁혀졌습니다. HBM4E에서는 삼성이 48GB 용량을 공개했고, SK하이닉스도 TSMC의 최선단 공정으로 베이스 다이 생산 방식을 전환하며 대응하고 있습니다.

3. HBM 세대 전환의 수혜는 메모리 제조사에만 머무르지 않습니다. 베이스 다이를 위탁 생산하는 파운드리, 적층·패키징을 담당하는 후공정 기업, 테스트 소켓을 공급하는 검사장비 기업까지 밸류체인 전반에 영향이 미칩니다.

4. HBM5는 2026년 7월 기준 삼성전자가 실물 목업을 공개한 단계이며, 베이스 다이에 2나노 공정을 적용할 계획이 알려졌을 뿐 정식 양산 스펙과 시점은 확정되지 않았습니다.

### criteria

- 세대별 스펙과 경쟁 구도는 2026년 7월 기준 공개된 언론 보도를 기준으로 정리했습니다.
- HBM5는 목업 공개 단계이며 정식 스펙이 아닙니다.
- 이 콘텐츠는 투자 권유가 아니며, 투자 판단과 책임은 본인에게 있습니다.

### FAQ

`HBM_FAQ` 데이터를 그대로 SeoContent의 `faq` prop에 전달한다.

---

## 13. 관련 링크

- `/reports/semiconductor-value-chain/`
- `/reports/semiconductor-etf-2026/`, `/reports/korea-semiconductor-etf-2026/`
- `/reports/samsung-vs-skhynix-earnings-bonus-2026/`
- `/reports/semiconductor-stocks-forecast-2026-2028/`
- `/tools/dca-investment-calculator/`

---

## 14. QA 체크리스트

- [ ] `VC_COMPANIES`에서 HBM 관련 기업 id가 실제로 존재하는지 재확인(id 오타 시 카드 누락)
- [ ] HBM5 행/카드에 "확정 전" 표시가 일관되게 적용되고 숫자 대신 대시(—)로 렌더링됨
- [ ] 상태 배지 4종(legacy/production/earlyProduction/mockupOnly) 색상과 라벨 일치
- [ ] 타임라인이 날짜순으로 정렬되어 렌더링됨
- [ ] 삼성전자 vs SK하이닉스 표가 실적/성과급 수치를 다루지 않고 기술 경쟁에만 집중함(다른 리포트와 콘텐츠 중복 없음)
- [ ] 투자 권유 아님 문구가 히어로 하단과 footer 양쪽에 노출
- [ ] 모바일에서 스펙 비교표가 가로 스크롤 또는 카드 스택으로 정상 전환
- [ ] `reports.ts`, `reports/index.astro`, `index.astro`(reportMetaBySlug), `app.scss`, `sitemap.xml` 등록 완료
- [ ] `npm run build` 성공
