# SK하이닉스 청산 사태 → 사상 첫 상한가 리포트 — 설계 문서

> 기획 원본: [`docs/plan/202607/sk-hynix-liquidation-upper-limit-2026-plan.md`](../../plan/202607/sk-hynix-liquidation-upper-limit-2026-plan.md) (v1)
> 작성일: 2026-07-31
> 유형: 이벤트/타임라인 리포트 (`/reports/`), 정적 페이지(JS 계산 없음), 단발성 콘텐츠 + 후속 소문 갱신 가능
> 참고 템플릿: [`sk-hynix-earnings-ps-outlook-2026-design.md`](./sk-hynix-earnings-ps-outlook-2026-design.md) — 동일한 `op-page` 공유 클래스 + 페이지 전용 프리픽스 패턴을 그대로 이식

---

## 0. 기획 문서 대비 확정 사항

- **"레오폴드" 관련 소문은 다루되 사실처럼 서술하지 않는다.** §7 섹션 5(팩트체크)에서 "국내 주요 언론 확인 안 됨" 한 줄로만 노출한다. 별도 섹션으로 키우지 않는다.
- 기획 문서 §9 CTA에 있던 `/tools/leverage-etf-pnl-calculator/`는 **실제 슬러그가 아니다.** `src/data/tools.ts`를 확인한 결과 실제 슬러그는 `kospi-leverage-etf-calculator`(코스피 레버리지 ETF 손익 계산기)다. 이 설계 문서부터는 정정된 링크를 사용한다.
- `reports.ts` 마지막 `order` 값이 83이므로 이번 리포트는 **`order: 84`**로 등록한다.

---

## 1. 파일 목록

| 역할 | 경로 |
|---|---|
| 데이터 | `src/data/skHynixLiquidationUpperLimit2026.ts` |
| 리포트 등록 | `src/data/reports.ts` |
| 홈 카테고리 등록 | `src/pages/index.astro` (`reportMetaBySlug`) |
| 페이지 | `src/pages/reports/sk-hynix-liquidation-upper-limit-2026.astro` |
| 스크립트 | (없음 — 정적 리포트, 개인화 계산은 기존 `/tools/kospi-leverage-etf-calculator/`로 위임) |
| 스타일 | `src/styles/scss/pages/_sk-hynix-liquidation-upper-limit-2026.scss` |
| 앱 CSS import | `src/styles/app.scss` |
| 사이트맵 | `public/sitemap.xml` |

**클래스 프리픽스:** `sklu-` (SK hynix LiqUidation). `sk-hynix-earnings-ps-outlook-2026.astro`의 실제 구현 패턴과 동일하게 `.op-page`(공유 섹션/카드/메시지 베이스) + `.sklu-page`(페이지 전용 변수·컴포넌트) 이중 클래스 구조를 따른다.

---

## 2. URL 및 메타

```
슬러그: /reports/sk-hynix-liquidation-upper-limit-2026/
타이틀(seoTitle): SK하이닉스 청산 사태 2026 완전 정리 | 사흘 만에 상한가 간 이유
디스크립션: 1주 이상거래로 시작된 826억 원 해외 청산 사고와 레버리지 ETF 78% 폭락, 사흘 만의 사상 첫 상한가까지 타임라인으로 정리. 팩트체크 포함.
```

---

## 3. 데이터 파일 설계

**`src/data/skHynixLiquidationUpperLimit2026.ts`**

```ts
// ── 타입 ──────────────────────────────────────────

export type TimelineEntry = {
  date: string;          // "2026-07-27"
  dateLabel: string;     // "7월 27일 (월)"
  headline: string;
  detail: string;
  sourceLabel: string;
  sourceUrl: string;
};

export type FactcheckRow = {
  rumor: string;
  status: "확인됨" | "해석" | "확인 안 됨";
  note: string;
};

export type RelatedLink = { href: string; label: string };
export type FaqItem = { question: string; answer: string };

// ── 메타 ──────────────────────────────────────────

export const SKLU_META = {
  slug: "sk-hynix-liquidation-upper-limit-2026",
  title: "SK하이닉스 청산 사태부터 사상 첫 상한가까지",
  seoTitle: "SK하이닉스 청산 사태 2026 완전 정리 | 사흘 만에 상한가 간 이유",
  seoDescription:
    "1주 이상거래로 시작된 826억 원 해외 청산 사고와 레버리지 ETF 78% 폭락, 사흘 만의 사상 첫 상한가까지 타임라인으로 정리. 팩트체크 포함.",
  description: "1주 이상거래가 부른 826억 원 해외 청산 사고, 그리고 사흘 만의 사상 첫 30% 상한가.",
  updatedAt: "2026-07-31",
  dataNote:
    "이 페이지는 실제 보도된 사실을 시간순으로 정리한 콘텐츠이며 투자 조언이 아닙니다. 레버리지·파생상품은 원금 손실 위험이 매우 크며, 확인되지 않은 온라인 소문은 별도로 구분해 표시합니다.",
};

// ── 핵심 수치 (Hero KPI) ────────────────────────────

export const SKLU_KEY_METRICS = {
  abnormalPrice: 1_272_000,        // 7/28 NXT 프리마켓 이상 체결가
  liquidationAmountKrw: 82_600_000_000, // 826억원 (5,740만 달러 환산 보도 기준)
  affectedUsers: 900,
  leverageEtfDropMin: 73.4,
  leverageEtfDropMax: 78,
  upperLimitGainPct: 29.95,
  upperLimitPrice: 1_718_000,
};

// ── 타임라인 (섹션 1) ───────────────────────────────

export const SKLU_TIMELINE: TimelineEntry[] = [
  {
    date: "2026-07-27",
    dateLabel: "7월 27일 (월)",
    headline: "정규장 종가 181만 6,000원",
    detail: "사태 발생 전 마지막 정규장 종가.",
    sourceLabel: "서울경제",
    sourceUrl: "https://www.sedaily.com/article/20073867",
  },
  {
    date: "2026-07-28",
    dateLabel: "7월 28일 (화) 오전 8시",
    headline: "넥스트레이드(NXT) 프리마켓, 1주 127만 2,000원 이상 체결",
    detail: "전일 종가 대비 -29.99%인 하한가 수준으로 단 1주가 체결되며 이상거래가 발생했습니다.",
    sourceLabel: "SBS Biz",
    sourceUrl: "https://biz.sbs.co.kr/article/20000325667",
  },
  {
    date: "2026-07-28",
    dateLabel: "7월 28일 (화)",
    headline: "해외 파생상품 826억 원 강제청산",
    detail: "이상 체결가가 가상자산 파생상품 플랫폼 trade.xyz의 'SK하이닉스 연계 무기한선물' 오라클에 반영되며 가격이 17.9% 급락, 약 5,740만 달러(약 826억 원) 규모 롱포지션이 2분 만에 강제청산됐습니다. 900명 이상이 영향을 받은 것으로 추정됩니다.",
    sourceLabel: "아시아경제",
    sourceUrl: "https://www.asiae.co.kr/article/2026073014435134205",
  },
  {
    date: "2026-07-28",
    dateLabel: "7월 28일 (화) 정규장 마감",
    headline: "국내 정규장 종가 -14.6%, 155만원",
    detail: "해외 파생상품만큼 극단적이지는 않았지만 국내 정규장도 하루 만에 큰 폭으로 하락했습니다.",
    sourceLabel: "파이낸셜뉴스",
    sourceUrl: "https://www.fnnews.com/news/202607291318553622",
  },
  {
    date: "2026-07-29",
    dateLabel: "7월 29일 (수)",
    headline: "레버리지 ETF -73~78%, 서킷브레이커 발동",
    detail: "TIGER SK하이닉스 레버리지 등 단일종목 레버리지 상품이 상장가 대비 -73.4~-78%까지 폭락하며 반대매매·강제청산 공포가 확산됐고, 코스피·코스닥 양시장 서킷브레이커가 발동됐습니다.",
    sourceLabel: "ZDNet Korea",
    sourceUrl: "https://zdnet.co.kr/view/?no=20260729143214",
  },
  {
    date: "2026-07-30",
    dateLabel: "7월 30일 (목)",
    headline: "trade.xyz, 피해 전액 보상 발표",
    detail: "청산 피해자에게 손실 전액을 보상하고 가격 산출 방식을 개선하겠다고 밝혔습니다.",
    sourceLabel: "SBS Biz",
    sourceUrl: "https://biz.sbs.co.kr/article/20000325667",
  },
  {
    date: "2026-07-31",
    dateLabel: "7월 31일 (금)",
    headline: "사상 첫 30% 상한가, 171만 8,000원",
    detail: "미국 필라델피아 반도체지수 +8.19% 급등과 AI 투자 지속 기대감에 힘입어 2015년 가격제한폭 30% 확대 이후 처음으로 상한가를 기록했습니다. 삼성전자도 20%대 폭등, 코스피 전체가 급등했습니다.",
    sourceLabel: "머니투데이",
    sourceUrl: "https://www.mt.co.kr/stock/2026/07/31/2026073114355560595",
  },
];

// ── 메커니즘 3단계 (섹션 2) ─────────────────────────

export const SKLU_MECHANISM_STEPS = [
  { order: 1, title: "이상 체결", text: "넥스트레이드 프리마켓에서 유동성이 얕은 시간대에 1주가 하한가 수준으로 체결됐습니다." },
  { order: 2, title: "오라클 반영", text: "해외 파생상품 플랫폼의 가격 오라클이 이 이상치를 그대로 실시간 반영했습니다." },
  { order: 3, title: "자동 강제청산", text: "오라클 가격에 연동된 무기한선물 포지션이 자동으로 강제청산되며 2분 만에 826억 원 규모가 정리됐습니다." },
];

// ── 레버리지 낙폭 비교 (섹션 3) ─────────────────────

export const SKLU_LEVERAGE_COMPARISON = {
  underlyingDropPct: 14.6,        // 7/28 정규장 SK하이닉스 낙폭
  leverageDropMinPct: 73.4,       // 상장가 대비 레버리지 ETF 낙폭
  leverageDropMaxPct: 78,
};

// ── 팩트체크 (섹션 5) ───────────────────────────────

export const SKLU_FACTCHECK: FactcheckRow[] = [
  {
    rumor: "AI 펀드 마진콜이 근본 원인이다",
    status: "해석",
    note: "일부 매체가 원인으로 지목했으나, 감독당국의 공식 조사 결과는 아직 확인되지 않았습니다.",
  },
  {
    rumor: "40년 모아온 22억을 날렸다",
    status: "확인 안 됨",
    note: "일부 SNS 주장에 대해 조작(주작) 의혹이 제기됐으며, 사실 여부는 확정되지 않았습니다.",
  },
  {
    rumor: "'레오폴드'가 배후다",
    status: "확인 안 됨",
    note: "국내 주요 언론 보도에서 관련 내용을 확인할 수 없어, 이 페이지에서는 다루지 않습니다.",
  },
];

// ── FAQ ────────────────────────────────────────────

export const SKLU_FAQ: FaqItem[] = [
  { question: "SK하이닉스 청산 사태는 정확히 어떤 사건인가요?", answer: "넥스트레이드 프리마켓에서 1주가 이상 체결되면서 그 가격이 해외 파생상품 오라클에 반영돼 약 826억 원 규모가 강제청산된 사건입니다." },
  { question: "국내 SK하이닉스 주가도 폭락했나요?", answer: "정규장 기준으로는 7월 28일 하루 -14.6% 하락했으며, 해외 파생상품만큼 극단적이지는 않았습니다." },
  { question: "레버리지 ETF는 왜 더 크게 떨어졌나요?", answer: "레버리지 상품은 기초자산 일별 수익률의 배수를 추종하도록 설계돼 있어 하락폭이 구조적으로 증폭됩니다." },
  { question: "상한가는 어떻게 갔나요?", answer: "7월 31일 미국 반도체지수 급등과 AI 투자 기대감이 겹치며 사상 첫 30% 상한가를 기록했습니다." },
  { question: "피해자는 보상받았나요?", answer: "trade.xyz는 청산 피해자에게 손실 전액을 보상하겠다고 발표했습니다." },
  { question: "'레오폴드' 음모론은 사실인가요?", answer: "확인되지 않았습니다. 국내 주요 언론 보도에서 관련 내용을 찾을 수 없습니다." },
];

export const SKLU_SEO_INTRO = [
  "2026년 7월 28일, 대체거래소 넥스트레이드 프리마켓에서 SK하이닉스 단 1주가 하한가 수준인 127만 2,000원에 체결되는 이상거래가 발생했습니다. 이 가격이 해외 가상자산 파생상품 플랫폼의 오라클에 그대로 반영되며 약 826억 원 규모의 롱포지션이 2분 만에 강제청산됐습니다.",
  "충격은 국내로도 번져 단일종목 레버리지 ETF가 상장가 대비 최대 78%까지 폭락하고 서킷브레이커가 발동됐지만, 사흘 뒤인 7월 31일 SK하이닉스는 미국 반도체지수 급등에 힘입어 사상 첫 30% 상한가로 반전했습니다.",
];

export const SKLU_SEO_CRITERIA = [
  "7/28 넥스트레이드 프리마켓 1주 이상 체결가: 127만 2,000원(-29.99%)",
  "해외 파생상품 강제청산 규모: 약 826억 원(5,740만 달러), 900명 이상 영향",
  "국내 정규장 낙폭(7/28): -14.6%, 레버리지 ETF 낙폭: 상장가 대비 -73.4~-78%",
  "7/31 사상 첫 30% 상한가(+29.95%), 171만 8,000원",
  "이 페이지는 보도된 사실 기준으로 정리했으며, 확인되지 않은 온라인 소문은 별도로 표시합니다",
];

export const SKLU_RELATED_LINKS: RelatedLink[] = [
  { href: "/tools/kospi-leverage-etf-calculator/", label: "코스피 레버리지 ETF 손익 계산기" },
  { href: "/reports/sk-hynix-earnings-ps-outlook-2026/", label: "SK하이닉스 실적·PS 전망 2026" },
  { href: "/reports/korea-semiconductor-etf-2026/", label: "국내 반도체 ETF 비교 2026" },
  { href: "/reports/semiconductor-stocks-forecast-2026-2028/", label: "반도체 실적 전망 2026~2028" },
];
```

---

## 4. 페이지 IA (섹션 순서)

```
Hero
 └─ eyebrow: 급등락 이벤트
 └─ title: SK하이닉스 청산 사태부터 사상 첫 상한가까지
 └─ description: 1주 이상거래가 부른 826억 원 해외 청산 사고, 그리고 사흘 만의 사상 첫 30% 상한가
 └─ KPI 4개: 이상 체결가 / 해외 청산 규모 / 레버리지 ETF 낙폭 / 상한가 상승률

InfoNotice (면책 배너)
 └─ SKLU_META.dataNote

섹션 1 — 타임라인 (7/27~7/31, 세로 타임라인 카드) ★ 핵심
섹션 2 — 어쩌다 1주가 826억 청산을 불렀나 (3단계 플로우 카드)
섹션 3 — 국내 레버리지 ETF는 왜 더 크게 폭락했나 (기초자산 vs 레버리지 비교 카드)
섹션 4 — 그리고 사흘 만에 사상 첫 상한가 (반전 강조 카드)
섹션 5 — 온라인에서 도는 소문, 팩트체크 (상태별 표)
SeoContent (FAQ + 관련 링크)
```

`REPORT_CONTENT_GUIDE.md` 권장 IA 중 "선택 UI/분포 비교"는 이 리포트 성격(시간순 사건 정리)에 맞지 않아 생략하고, 타임라인을 핵심 인터랙션 대체 요소로 사용한다(스크롤 자체가 인터랙션).

---

## 5. 컴포넌트 구조

### 기존 공유 컴포넌트 (그대로 사용)

| 컴포넌트 | 용도 | 실제 Props |
|---|---|---|
| `BaseLayout.astro` | `<head>`, SEO, JSON-LD | `title`, `description`, `jsonLd` |
| `SiteHeader.astro` | 전역 헤더 | — |
| `CalculatorHero.astro` | Hero 섹션 | `eyebrow`, `title`, `description` |
| `InfoNotice.astro` | 면책 배너 | `title: string`, `lines: string[]` |
| `SeoContent.astro` | SEO 텍스트 + FAQ + 관련 링크 | `introTitle`, `intro`, `criteria`, `faq`, `related` |

### 공유 베이스 클래스 (`.op-page` — `_opportunities-202605.scss`에서 정의, 실제 구현 관례상 재사용)

`sk-hynix-earnings-ps-outlook-2026.astro`가 실제로 `<main class="... op-page shep-page">` 이중 클래스를 쓰는 것과 동일하게, 이 페이지도 `op-page`를 함께 부여해 `.op-section`, `.op-message`, `.op-card-grid` 베이스를 재사용한다.

### 페이지 전용 마크업 (인라인, `sklu-` 프리픽스)

| 블록 클래스 | 설명 |
|---|---|
| `.sklu-page` | 페이지 루트 스코프 (로컬 CSS 변수 정의) |
| `.sklu-kpi-grid` | Hero 하단 KPI 카드 4개 |
| `.sklu-kpi-card` | KPI 카드 개별 (상한가 카드는 `--highlight` 변형) |
| `.sklu-timeline` | 섹션 1 — 세로 타임라인 리스트 |
| `.sklu-timeline__item` | 타임라인 개별 항목 (날짜 + 헤드라인 + 본문 + 출처 링크) |
| `.sklu-mechanism-flow` | 섹션 2 — 3단계 플로우 카드 (가로 배치, 모바일은 세로 스택) |
| `.sklu-mechanism-flow__step` | 플로우 개별 단계 카드 |
| `.sklu-leverage-compare` | 섹션 3 — 기초자산 vs 레버리지 낙폭 바 비교 |
| `.sklu-reversal-card` | 섹션 4 — 상한가 반전 강조 카드 (그린 톤) |
| `.sklu-factcheck-table` | 섹션 5 — 팩트체크 표 |
| `.sklu-factcheck-table__status` | 상태 배지 (`확인됨`/`해석`/`확인 안 됨` 별 색상 구분) |

---

## 6. SCSS 설계

**파일:** `src/styles/scss/pages/_sk-hynix-liquidation-upper-limit-2026.scss`

```scss
.sklu-page {
  --sklu-ink: #172033;
  --sklu-muted: #667085;
  --sklu-line: #d8e0ea;
  --sklu-primary: #1a56db;
  --sklu-danger-bg: #fef2f2;
  --sklu-danger-border: #f2938a;
  --sklu-danger-ink: #b42318;
  --sklu-success-bg: #ecfdf3;
  --sklu-success-border: #6ce9a6;
  --sklu-success-ink: #027a48;
  --sklu-warn-bg: #fffaeb;
  --sklu-warn-ink: #92400e;

  .sklu-kpi-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;

    @media (max-width: 900px) {
      grid-template-columns: repeat(2, 1fr);
    }
    @media (max-width: 480px) {
      grid-template-columns: 1fr;
    }
  }

  .sklu-kpi-card {
    border: 1px solid var(--sklu-line);
    border-radius: 12px;
    padding: 1rem;

    &--highlight {
      border-color: var(--sklu-success-border);
      background: var(--sklu-success-bg);
      strong { color: var(--sklu-success-ink); }
    }
  }

  .sklu-timeline {
    list-style: none;
    padding: 0;
    margin: 0;
    border-left: 2px solid var(--sklu-line);

    &__item {
      position: relative;
      padding: 0 0 1.5rem 1.25rem;

      &::before {
        content: "";
        position: absolute;
        left: -5px;
        top: 0.3rem;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--sklu-primary);
      }

      &:last-child { padding-bottom: 0; }
    }

    &__date {
      font-size: 0.8rem;
      color: var(--sklu-muted);
      font-weight: 600;
    }

    &__headline {
      font-size: 1.05rem;
      font-weight: 700;
      margin: 0.15rem 0 0.35rem;
    }

    &__source {
      font-size: 0.78rem;
      color: var(--sklu-muted);
    }
  }

  .sklu-mechanism-flow {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;

    @media (max-width: 720px) {
      grid-template-columns: 1fr;
    }

    &__step {
      border: 1px solid var(--sklu-line);
      border-radius: 12px;
      padding: 1rem;

      strong {
        display: block;
        color: var(--sklu-primary);
        margin-bottom: 0.4rem;
      }
    }
  }

  .sklu-leverage-compare {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin: 1rem 0;

    &__row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    &__label {
      width: 140px;
      font-size: 0.85rem;
      color: var(--sklu-muted);
      flex-shrink: 0;
    }

    &__bar {
      flex: 1;
      height: 14px;
      border-radius: 999px;
      background: var(--sklu-line);
      overflow: hidden;

      span {
        display: block;
        height: 100%;
        background: var(--sklu-danger-ink);
        border-radius: 999px;
      }
    }

    &__value {
      width: 60px;
      text-align: right;
      font-weight: 700;
      font-size: 0.9rem;
    }
  }

  .sklu-reversal-card {
    border: 1px solid var(--sklu-success-border);
    background: var(--sklu-success-bg);
    border-radius: 12px;
    padding: 1.25rem;
    text-align: center;

    strong {
      font-size: 2rem;
      color: var(--sklu-success-ink);
    }
  }

  .sklu-factcheck-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.88rem;

    th, td {
      border-bottom: 1px solid var(--sklu-line);
      padding: 0.6rem 0.75rem;
      text-align: left;
      vertical-align: top;
    }

    &__status {
      display: inline-block;
      padding: 0.15rem 0.5rem;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 700;
      white-space: nowrap;

      &[data-status="확인됨"] { background: var(--sklu-success-bg); color: var(--sklu-success-ink); }
      &[data-status="해석"] { background: var(--sklu-warn-bg); color: var(--sklu-warn-ink); }
      &[data-status="확인 안 됨"] { background: var(--sklu-danger-bg); color: var(--sklu-danger-ink); }
    }
  }

  @media (prefers-color-scheme: dark) {
    --sklu-danger-bg: #3a1414;
    --sklu-success-bg: #0f2e1f;
    --sklu-warn-bg: #3a2e10;
  }
}
```

---

## 7. Astro 페이지 구조

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import { withBase } from "../../utils/base";
import {
  SKLU_META,
  SKLU_KEY_METRICS,
  SKLU_TIMELINE,
  SKLU_MECHANISM_STEPS,
  SKLU_LEVERAGE_COMPARISON,
  SKLU_FACTCHECK,
  SKLU_FAQ,
  SKLU_SEO_INTRO,
  SKLU_SEO_CRITERIA,
  SKLU_RELATED_LINKS,
} from "../../data/skHynixLiquidationUpperLimit2026";

const siteBase = (import.meta.env.SITE ?? "https://bigyocalc.com").replace(/\/$/, "");
const reportUrl = `${siteBase}/reports/${SKLU_META.slug}/`;

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: SKLU_META.title,
    description: SKLU_META.seoDescription,
    dateModified: SKLU_META.updatedAt,
    mainEntityOfPage: reportUrl,
    author: { "@type": "Organization", name: "비교계산소" },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: SKLU_FAQ.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: siteBase },
      { "@type": "ListItem", position: 2, name: "리포트", item: `${siteBase}/reports/` },
      { "@type": "ListItem", position: 3, name: SKLU_META.title, item: reportUrl },
    ],
  },
];
---
<BaseLayout title={SKLU_META.seoTitle} description={SKLU_META.seoDescription} jsonLd={jsonLd}>
  <SiteHeader />

  <main class="container page-shell report-page op-page sklu-page" data-report="sk-hynix-liquidation-upper-limit-2026">
    <CalculatorHero
      eyebrow="급등락 이벤트"
      title={SKLU_META.title}
      description={SKLU_META.description}
    />

    <div class="sklu-kpi-grid">
      <article class="sklu-kpi-card"><strong>이상 체결가</strong><p>{SKLU_KEY_METRICS.abnormalPrice.toLocaleString()}원</p><small>7/28 NXT 프리마켓</small></article>
      <article class="sklu-kpi-card"><strong>해외 청산 규모</strong><p>약 {(SKLU_KEY_METRICS.liquidationAmountKrw / 100_000_000).toFixed(0)}억원</p><small>900명 이상 영향</small></article>
      <article class="sklu-kpi-card"><strong>레버리지 ETF 낙폭</strong><p>-{SKLU_KEY_METRICS.leverageEtfDropMax}%</p><small>상장가 대비 최대</small></article>
      <article class="sklu-kpi-card sklu-kpi-card--highlight"><strong>상한가 상승률</strong><p>+{SKLU_KEY_METRICS.upperLimitGainPct}%</p><small>사상 첫 30% 상한가</small></article>
    </div>

    <InfoNotice
      title="읽기 전에 확인해주세요"
      lines={[
        SKLU_META.dataNote,
      ]}
    />

    <!-- 섹션 1: 타임라인 ★ 핵심 -->
    <section class="op-section">
      <h2>타임라인 — 사흘 사이 무슨 일이 있었나</h2>
      <ul class="sklu-timeline">
        {SKLU_TIMELINE.map((item) => (
          <li class="sklu-timeline__item">
            <div class="sklu-timeline__date">{item.dateLabel}</div>
            <div class="sklu-timeline__headline">{item.headline}</div>
            <p class="op-message">{item.detail}</p>
            <a class="sklu-timeline__source" href={item.sourceUrl} target="_blank" rel="noopener noreferrer">출처: {item.sourceLabel}</a>
          </li>
        ))}
      </ul>
    </section>

    <!-- 섹션 2: 메커니즘 -->
    <section class="op-section">
      <h2>어쩌다 1주가 826억 청산을 불렀나</h2>
      <div class="sklu-mechanism-flow">
        {SKLU_MECHANISM_STEPS.map((step) => (
          <div class="sklu-mechanism-flow__step">
            <strong>{step.order}. {step.title}</strong>
            <p>{step.text}</p>
          </div>
        ))}
      </div>
      <p class="op-message"><small>국내 대체거래소의 유동성 부족(1주 체결)과 해외 파생상품의 오라클 설계 미비가 겹친 구조적 허점으로, 다수 매체가 "인재"로 평가하고 있습니다.</small></p>
    </section>

    <!-- 섹션 3: 레버리지 낙폭 비교 -->
    <section class="op-section">
      <h2>국내 레버리지 ETF는 왜 더 크게 폭락했나</h2>
      <div class="sklu-leverage-compare">
        <div class="sklu-leverage-compare__row">
          <span class="sklu-leverage-compare__label">SK하이닉스(정규장)</span>
          <span class="sklu-leverage-compare__bar"><span style={`width:${SKLU_LEVERAGE_COMPARISON.underlyingDropPct}%`}></span></span>
          <span class="sklu-leverage-compare__value">-{SKLU_LEVERAGE_COMPARISON.underlyingDropPct}%</span>
        </div>
        <div class="sklu-leverage-compare__row">
          <span class="sklu-leverage-compare__label">레버리지 ETF(최대)</span>
          <span class="sklu-leverage-compare__bar"><span style={`width:${SKLU_LEVERAGE_COMPARISON.leverageDropMaxPct}%`}></span></span>
          <span class="sklu-leverage-compare__value">-{SKLU_LEVERAGE_COMPARISON.leverageDropMaxPct}%</span>
        </div>
      </div>
      <p class="op-message">레버리지 상품은 기초자산 일별 수익률의 배수를 추종하도록 설계돼 있어, 기초자산보다 낙폭이 구조적으로 훨씬 크게 증폭됩니다. 반대매매·강제청산 위험도 그만큼 커집니다.</p>
      <div class="sklu-cta-group">
        <a href={withBase("/tools/kospi-leverage-etf-calculator/")}>레버리지 ETF 손익 직접 계산해보기 →</a>
      </div>
    </section>

    <!-- 섹션 4: 반전 -->
    <section class="op-section">
      <h2>그리고 사흘 만에 사상 첫 상한가</h2>
      <div class="sklu-reversal-card">
        <small>7월 31일 정규장</small>
        <strong>+{SKLU_KEY_METRICS.upperLimitGainPct}%</strong>
        <small>{SKLU_KEY_METRICS.upperLimitPrice.toLocaleString()}원 — 2015년 가격제한폭 30% 확대 이후 첫 상한가</small>
      </div>
      <p class="op-message">미국 필라델피아 반도체지수 급등과 AI 투자 지속 기대감이 국내 반도체주 전반의 급반등을 이끌었습니다. 삼성전자도 20%대 폭등했습니다.</p>
    </section>

    <!-- 섹션 5: 팩트체크 -->
    <section class="op-section">
      <h2>온라인에서 도는 소문, 팩트체크</h2>
      <table class="sklu-factcheck-table">
        <thead><tr><th>소문</th><th>상태</th><th>설명</th></tr></thead>
        <tbody>
          {SKLU_FACTCHECK.map((row) => (
            <tr>
              <td>{row.rumor}</td>
              <td><span class="sklu-factcheck-table__status" data-status={row.status}>{row.status}</span></td>
              <td>{row.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>

    <SeoContent
      introTitle="SK하이닉스 청산 사태·상한가 핵심 정리"
      intro={SKLU_SEO_INTRO}
      criteria={SKLU_SEO_CRITERIA}
      faq={SKLU_FAQ}
      related={SKLU_RELATED_LINKS}
    />
  </main>
</BaseLayout>
```

---

## 8. reports.ts 등록

```ts
{
  slug: "sk-hynix-liquidation-upper-limit-2026",
  title: "SK하이닉스 청산 사태 2026 완전 정리 | 사흘 만에 상한가 간 이유",
  description: "1주 이상거래로 시작된 826억 원 해외 청산 사고와 레버리지 ETF 78% 폭락, 사흘 만의 사상 첫 상한가까지 타임라인으로 정리. 팩트체크 포함.",
  order: 84,
  badges: ["신규", "SK하이닉스", "청산사태", "상한가"],
},
```

## 8-1. index.astro `reportMetaBySlug` 등록 (누락 시 "기타"로 표시됨 — 필수)

```ts
"sk-hynix-liquidation-upper-limit-2026": { category: "asset", isNew: true },
```

---

## 9. app.scss import

```scss
@use 'scss/pages/sk-hynix-liquidation-upper-limit-2026';
```

---

## 10. sitemap.xml

```xml
<url>
  <loc>https://bigyocalc.com/reports/sk-hynix-liquidation-upper-limit-2026/</loc>
  <lastmod>2026-07-31</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>
</url>
```

`changefreq: weekly` — 감독당국 조사 결과나 후속 소문이 나오면 섹션 5(팩트체크)를 갱신할 가능성이 있어 잦은 갱신을 signal한다.

---

## 11. 내부 CTA 목록

| 위치 | 문구 | href |
|---|---|---|
| 섹션 3 하단 | 레버리지 ETF 손익 직접 계산해보기 | `/tools/kospi-leverage-etf-calculator/` |
| SeoContent related | SK하이닉스 실적·PS 전망 2026 | `/reports/sk-hynix-earnings-ps-outlook-2026/` |
| SeoContent related | 국내 반도체 ETF 비교 2026 | `/reports/korea-semiconductor-etf-2026/` |
| SeoContent related | 반도체 실적 전망 2026~2028 | `/reports/semiconductor-stocks-forecast-2026-2028/` |

---

## 12. 데이터 정확성 / QA 포인트

- [ ] 타임라인 7개 항목의 수치·날짜가 기획 문서 §1 표와 정확히 일치하는지 확인
- [ ] "레오폴드" 관련 문구가 §7 섹션 5 표 안 한 줄(`확인 안 됨`)로만 존재하고, 그 외 어디에도 사실처럼 서술되지 않았는지 확인 — 가장 중요한 체크포인트
- [ ] "AI 펀드 마진콜이 원인" 문구가 "해석"으로만 표시되고 확정 사실처럼 서술되지 않았는지 확인
- [ ] 레버리지 ETF 손익 계산기 링크가 실제 슬러그(`kospi-leverage-etf-calculator`)와 일치하는지 확인 (기획 문서의 오기 정정됨, §0 참고)
- [ ] InfoNotice에 "투자 조언 아님" 및 레버리지 손실 위험 문구 포함 확인
- [ ] 출처 링크(타임라인 각 항목의 `sourceUrl`)가 실제 접근 가능한지 확인
- [ ] `reportMetaBySlug`에 슬러그 등록 확인 (누락 시 홈 화면 "기타" 카테고리로 표시되는 사고 방지)
- [ ] 모바일에서 KPI 4카드 → 2열 → 1열, 메커니즘 플로우 3카드 → 1열 전환 확인
- [ ] `npm run build` 통과, 라우트 `/reports/sk-hynix-liquidation-upper-limit-2026/` 존재 확인

---

## 13. 배포 및 갱신 일정

| 시점 | 작업 |
|---|---|
| 1차 배포 | 2026-07-31~08-01 이내 — 시의성 이벤트이므로 최대한 빠르게 |
| 후속 갱신 1 | 감독당국(금융당국·거래소)의 공식 조사 결과가 나오면 섹션 2·5 갱신 |
| 후속 갱신 2 | 새로운 온라인 소문이 확인되면 섹션 5 팩트체크 표에 행 추가 |
| 리스크 | 화제성이 빠르게 식을 수 있는 시의성 콘텐츠 — 배포 지연 시 검색 유입 효과 급감 |

---

## 14. 핵심 메시지 (1문장 요약)

> 1주짜리 이상거래가 해외 파생상품 시장에서 826억 원 규모의 강제청산을 불렀고, 그 충격이 국내 레버리지 ETF를 78%까지 끌어내렸지만, 사흘 뒤 SK하이닉스는 사상 첫 상한가로 반전했다 — 그 사이 떠도는 "레오폴드" 같은 소문은 확인되지 않았다.
