# 카카오 성과급 갈등 2026 리포트 — 설계 문서

## 1. 개요

- **슬러그**: `reports/kakao-union-bonus-2026`
- **유형**: 리포트 페이지 (`/reports/` 계열), **정성형 — 금액 환산 계산기 없음**
- **레이아웃**: `BaseLayout` 직접 사용
- **prefix**: `kku-` (Kakao Union)
- **연관 문서**: [`union-performance-bonus-comparison-2026-plan.md`](../../plan/202606/union-performance-bonus-comparison-2026-plan.md), [`hyundai-motor-union-bonus-2026-design.md`](./hyundai-motor-union-bonus-2026-design.md), [`samsung-biologics-union-bonus-2026-design.md`](./samsung-biologics-union-bonus-2026-design.md) (자매 리포트)

## 2. 목적 및 핵심 컨셉

- 현대차·삼바 리포트는 "노조 요구안을 숫자로 환산"하는 계산형이었지만, 카카오는 **확정된 비율(%) 자체가 협상 쟁점**이라 똑같은 1인당 환산 계산기를 만들면 오히려 부정확한 인상을 줄 수 있음
- 기획 단계부터 사용자 지침대로 "카카오는 확정 요구 비율이 없으므로 금액 환산 콘텐츠로 만들지 않고 갈등/보상체계 설명형으로 작성"
- 핵심 컨셉: **"노조 요구 4가지 vs 회사 제안"을 나란히 비교**하고, 쟁점이 성과급 비율(%) 한 가지가 아니라 RSU 처리 방식, 고용안정, 투명성까지 4갈래로 얽혀있다는 것을 구조적으로 보여줌
- "성과급 집단행동"으로만 보이지 않게, 노조가 스스로 강조한 "핵심은 고용안정"이라는 프레이밍을 그대로 반영

## 3. 데이터 신뢰성 원칙 (Fact / Interpretation 구분)

| 구분 | 항목 | 출처 |
|---|---|---|
| Fact | 2026.6.10 카카오 창사 첫 파업(본사 차원), 4시간 부분파업, 본사+카카오페이+카카오엔터프라이즈+디케이테크인+엑스엘게임즈 5개 법인 참여, 약 1,500명 참여 | 비즈워치, ZDNet |
| Fact | 2026.5.20 5개 법인 파업 찬반투표 전부 가결 | 서울경제, 한국경제 |
| Fact | 노조 요구 4가지: ① 영업이익 13~14% 수준(1인당 약 1,000만원) 성과급 체계, ② RSU를 성과급 재원에서 제외하고 별도 지급, ③ 계열사 매각·분사·구조조정 시 고용안정 보장, ④ 보상 산정 기준·의사결정 투명성 강화 | 쿠키뉴스 |
| Fact | 회사 제안: 영업이익 10% 수준 성과급, RSU를 성과 보상의 일부로 포함 | 쿠키뉴스 |
| Fact | 2026.5.18 경기지방노동위원회 조정 실패, 조정기일 5.27로 연장 | 다음뉴스 |
| Fact | 노조 측 "성과급 집단 프레임 경계, 핵심은 고용안정"이라는 공식 입장 | 쿠키뉴스 |
| Fact (예정) | 노조가 "부분 파업으론 부족" 입장을 밝히며 6.29 대규모 총파업 예고 | 경기일보 |
| Interpretation | "단순 비율 차이(10% vs 13~14%)보다 RSU 처리 방식과 고용안정 요구가 협상을 더 어렵게 만든다"는 해석은 별도 섹션으로 분리 | — |

> **이 리포트에서 하지 않는 것**: 1인당 환산액 계산기, "노조 요구가 받아들여지면 얼마"라는 금액 시뮬레이션. 영업이익 %는 협상 중인 수치라 확정치로 다루지 않음. "1인당 약 1,000만원"이라는 보도 수치는 노조 측 주장으로만 인용하고 직접 계산 도구화하지 않음.
>
> **게시 전 재확인 필요**: 5.27 조정 결과, 6.10 부분파업 이후 협상 진행 상황, 6.29 총파업 실제 진행 여부 — 시점에 따라 빠르게 바뀔 수 있어 게시 직전 최신 보도로 업데이트.

## 4. 데이터 파일 구조

### `src/data/kakaoUnionBonus2026.ts`

```ts
export interface DemandItem {
  id: string;
  title: string;
  unionPosition: string;
  companyPosition: string;
  gapNote: string;
}

export const DEMAND_ITEMS: DemandItem[] = [
  {
    id: "bonus-rate",
    title: "성과급 비율",
    unionPosition: "영업이익의 13~14% 수준 (1인당 약 1,000만원 보도)",
    companyPosition: "영업이익의 10% 수준",
    gapNote: "비율 자체는 3~4%p 차이지만 RSU 포함 여부에 따라 체감 격차는 더 커짐",
  },
  {
    id: "rsu",
    title: "RSU(양도제한조건부주식) 처리",
    unionPosition: "성과급 재원에서 제외하고 별도 지급",
    companyPosition: "성과 보상의 일부로 포함",
    gapNote: "같은 '성과급 10%'라도 RSU 포함 여부에 따라 실질 현금 보상이 크게 달라짐",
  },
  {
    id: "employment",
    title: "고용안정",
    unionPosition: "계열사 매각·분사·구조조정 시 고용안정 보장",
    companyPosition: "구조조정은 경영 판단 영역이라는 원칙적 입장",
    gapNote: "노조가 가장 강조하는 항목 — \"핵심은 성과급이 아니라 고용안정\"",
  },
  {
    id: "transparency",
    title: "보상 투명성",
    unionPosition: "보상 산정 기준과 의사결정 과정 공개 요구",
    companyPosition: "공식 입장 명확히 보도되지 않음",
    gapNote: "정보 비대칭 자체가 신뢰 문제로 이어지고 있음",
  },
];

export interface TimelineItem {
  date: string;
  label: string;
  sourceName: string;
  sourceUrl: string;
}

export const TIMELINE: TimelineItem[] = [
  { date: "2026-05-18", label: "경기지방노동위원회 조정 실패, 조정기일 5.27로 연장", sourceName: "다음뉴스", sourceUrl: "https://v.daum.net/v/20260525181741526" },
  { date: "2026-05-20", label: "본사 포함 5개 법인 파업 찬반투표 전부 가결", sourceName: "한국경제", sourceUrl: "https://www.hankyung.com/article/202605208898g" },
  { date: "2026-06-10", label: "카카오 창사 첫 파업 — 4시간 부분파업, 약 1,500명 참여", sourceName: "비즈워치", sourceUrl: "https://news.bizwatch.co.kr/article/mobile/2026/06/10/0020" },
  { date: "2026-06-29(예정)", label: "노조, 대규모 총파업 카운트다운 예고", sourceName: "경기일보", sourceUrl: "https://www.kyeonggi.com/article/20260610580179" },
];

export interface UnionDemandFact {
  label: string;
  value: string;
  sourceName: string;
  sourceUrl: string;
}

export const UNION_DEMAND_FACTS: UnionDemandFact[] = [
  { label: "파업 형태", value: "창사 첫 파업, 4시간 부분파업 (2026.6.10)", sourceName: "비즈워치", sourceUrl: "https://news.bizwatch.co.kr/article/mobile/2026/06/10/0020" },
  { label: "참여 법인", value: "본사·카카오페이·카카오엔터프라이즈·디케이테크인·엑스엘게임즈 5곳", sourceName: "ZDNet Korea", sourceUrl: "https://zdnet.co.kr/view/?no=20260610162159" },
  { label: "참여 인원", value: "약 1,500명", sourceName: "비즈워치", sourceUrl: "https://news.bizwatch.co.kr/article/mobile/2026/06/10/0020" },
  { label: "파업투표 결과", value: "5개 법인 모두 찬성 가결 (2026.5.20)", sourceName: "한국경제", sourceUrl: "https://www.hankyung.com/article/202605208898g" },
  { label: "조정 현황", value: "경기지노위 조정 실패, 조정기일 연장", sourceName: "다음뉴스", sourceUrl: "https://v.daum.net/v/20260525181741526" },
  { label: "노조 공식 입장", value: "\"성과급 집단 프레임 경계, 핵심은 고용안정\"", sourceName: "쿠키뉴스", sourceUrl: "https://www.kukinews.com/article/view/kuk202605130165" },
];

export interface FaqItem { question: string; answer: string; }
export const KKU_FAQ: FaqItem[] = [
  // 8개 — 6번 섹션 초안 참고
];

export const KKU_META = {
  slug: "kakao-union-bonus-2026",
  title: "카카오 성과급 갈등 2026 | 첫 부분파업, 무엇이 쟁점인가",
  seoTitle: "카카오 성과급 갈등 2026 | 첫 부분파업 핵심 쟁점 정리",
  description: "카카오 노조의 성과급 비율, RSU 처리, 고용안정, 투명성 요구를 회사 입장과 나란히 비교. 창사 첫 부분파업까지 이어진 갈등의 핵심을 정리합니다.",
  updatedAt: "2026-06-26",
};
```

## 5. 화면 구성 (페이지 IA)

```
[CalculatorHero]
  eyebrow: "창사 첫 부분파업"
  title: "카카오 성과급 갈등 2026, 무엇이 쟁점인가"
  description: "성과급 비율 하나의 문제가 아닙니다. 노조 요구 4가지와 회사 입장을 나란히 비교해보세요."
  badges: ["갈등 정리", "2026", "5개 법인"]

[InfoNotice — info, warning 아님]
  "이 페이지는 협상 진행 중인 사안을 다룹니다. 금액은 노조 측 주장 인용이며 확정치가 아닙니다.
   협상 경과에 따라 내용이 빠르게 바뀔 수 있어 최신 보도를 함께 확인하시길 권장합니다."

[파업 현황 핵심 요약 — Fact 카드 그리드]
  UNION_DEMAND_FACTS 6개 카드

[핵심 쟁점 4가지 비교] ★ 메인 섹션 (계산기 대신 이 섹션이 중심)
  - DEMAND_ITEMS 4개를 카드 또는 2열 비교 테이블로
  - 각 항목: 쟁점명 / 노조 입장 / 회사 입장 / 격차 노트
  - 탭이나 select 없이 4개 카드를 한 번에 다 보여줌 (선택 인터랙션 불필요 — 콘텐츠 자체가 적은 4항목)

[타임라인 섹션]
  - TIMELINE 4단계를 세로 타임라인 컴포넌트로
  - 5.18 조정 실패 → 5.20 파업투표 가결 → 6.10 부분파업 → 6.29 총파업 예고

[해석 카드 — 왜 성과급 갈등이 아니라 고용 갈등인가]
  - "노조가 직접 강조한 프레이밍: 핵심은 고용안정"
  - "RSU 포함 여부가 같은 비율도 다르게 만든다"
  - "다른 대기업과 달리 정확한 % 자체가 아직 협상 중"

[다른 노조 갈등과 비교]
  - 현대차·삼바 리포트 링크 + 짧은 비교 문장
    "현대차·삼바는 비율(%) 자체가 쟁점이었다면, 카카오는 비율 + RSU + 고용안정까지 얽혀있다"

[관련 링크]
  - reports/hyundai-motor-union-bonus-2026
  - reports/samsung-biologics-union-bonus-2026
  - tools/it-bigtech-bonus-comparison (IT 빅테크 성과급 비교)

[SeoContent]
  - intro 5문단 이상 / 800자 이상
  - criteria 대신 "쟁점 정리 기준" 안내
  - FAQ 8개 이상
  - related 링크 포함
```

## 6. 컴포넌트 구조

```
<BaseLayout>
  <SiteHeader />
  <main class="container page-shell report-page kku-page">
    <CalculatorHero ... />
    <InfoNotice type="info" ... />

    <section class="content-section kku-facts-section">
      <h2>카카오 파업, 어디까지 왔나</h2>
      <div class="kku-facts-grid">...</div>  <!-- UNION_DEMAND_FACTS 6개 -->
    </section>

    <section class="content-section kku-demand-section" id="demands">
      <h2>노조 요구 4가지 vs 회사 입장</h2>
      <div class="kku-demand-grid">
        {DEMAND_ITEMS.map(item => (
          <article class="kku-demand-card">
            <h3>{item.title}</h3>
            <div class="kku-demand-row">
              <span class="kku-demand-tag kku-demand-tag--union">노조</span>
              <p>{item.unionPosition}</p>
            </div>
            <div class="kku-demand-row">
              <span class="kku-demand-tag kku-demand-tag--company">회사</span>
              <p>{item.companyPosition}</p>
            </div>
            <p class="kku-demand-gap">{item.gapNote}</p>
          </article>
        ))}
      </div>
    </section>

    <section class="content-section kku-timeline-section">
      <h2>갈등 타임라인</h2>
      <ol class="kku-timeline">
        {TIMELINE.map(item => (
          <li class="kku-timeline-item">
            <span class="kku-timeline-date">{item.date}</span>
            <p class="kku-timeline-label">{item.label}</p>
            <a href={item.sourceUrl} class="kku-timeline-source">출처: {item.sourceName}</a>
          </li>
        ))}
      </ol>
    </section>

    <section class="content-section kku-interpretation-section">
      <h2>왜 단순 성과급 갈등이 아닐까</h2>
      <div class="kku-interpretation-grid">...</div>  <!-- 3개 카드 -->
    </section>

    <section class="content-section kku-compare-section">
      <h2>다른 대기업 노조 갈등과 비교하면</h2>
      <p>현대차·삼성바이오로직스는 비율(%) 자체가 핵심 쟁점이었다면, 카카오는 비율과 RSU 처리, 고용안정까지 얽혀 있어 단순 수치 비교로는 설명이 어렵습니다.</p>
      <div class="kku-sibling-links">
        <a href="/reports/hyundai-motor-union-bonus-2026/">현대차 성과급 30% 요구 계산</a>
        <a href="/reports/samsung-biologics-union-bonus-2026/">삼성바이오로직스 성과급 20% 요구 계산</a>
      </div>
    </section>

    <SeoContent introItems={...} criteria={...} faqItems={KKU_FAQ} related={...} />
    <CompareCta />
  </main>
  <SiteFooter />
</BaseLayout>
```

- **인터랙션 없음** — 이 리포트는 select/tabs 없이 정적 카드·타임라인으로만 구성. REPORT_CONTENT_GUIDE의 "선택형 리포트"가 아니라 "정리형 리포트" 패턴. JS 파일 자체가 필요 없을 수 있음 (필요 시 아코디언 등 최소한의 UI만).

## 7. JS 로직 — 선택적

이 리포트는 계산이 없어 JS 의존도가 낮음. 후보:
- 타임라인 항목 클릭 시 출처 링크로 이동 (기본 `<a>` 태그로 충분, 별도 JS 불필요)
- 굳이 인터랙션을 넣는다면 "노조 입장만 보기 / 회사 입장만 보기" 토글 정도가 가능하지만, 콘텐츠가 4항목뿐이라 과한 UI일 수 있음 → **생략 권장**
- `public/scripts/kakao-union-bonus-2026.js` 파일을 만들지 않고 페이지를 정적으로 구현하는 것을 1차 권장안으로 함

## 8. SCSS (`src/styles/scss/pages/_kakao-union-bonus-2026.scss`)

prefix: `kku-`

```scss
.kku-page { }

.kku-facts-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  @media (min-width: 640px) { grid-template-columns: repeat(2, 1fr); }
  @media (min-width: 1024px) { grid-template-columns: repeat(3, 1fr); }
}
.kku-fact-card {
  background: var(--surface-strong);
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  padding: 0.875rem 1rem;
  .kku-fact-label { font-size: 0.8125rem; color: var(--muted); }
  .kku-fact-value { font-weight: 600; color: var(--text); margin-top: 0.25rem; }
  .kku-fact-source { font-size: 0.75rem; color: var(--accent); margin-top: 0.375rem; display: inline-block; }
}

// 요구 4항목 카드
.kku-demand-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  @media (min-width: 768px) { grid-template-columns: repeat(2, 1fr); }
}
.kku-demand-card {
  background: var(--surface-strong);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  padding: 1.125rem 1.25rem;
  h3 { margin: 0 0 0.75rem; font-size: 1.0625rem; color: var(--text); }
}
.kku-demand-row {
  display: flex;
  gap: 0.625rem;
  align-items: flex-start;
  margin-bottom: 0.625rem;
  p { margin: 0; font-size: 0.9375rem; color: var(--text); }
}
.kku-demand-tag {
  flex-shrink: 0;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  color: #fff;
  &--union { background: var(--accent); }
  &--company { background: var(--muted); }
}
.kku-demand-gap {
  margin: 0.5rem 0 0;
  font-size: 0.8125rem;
  color: var(--muted);
  border-top: 1px dashed var(--line);
  padding-top: 0.5rem;
}

// 타임라인
.kku-timeline {
  list-style: none;
  margin: 1.5rem 0;
  padding: 0;
  border-left: 2px solid var(--line);
}
.kku-timeline-item {
  position: relative;
  padding: 0 0 1.25rem 1.25rem;
  &::before {
    content: "";
    position: absolute;
    left: -5px;
    top: 4px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--accent);
  }
}
.kku-timeline-date { font-size: 0.8125rem; font-weight: 700; color: var(--accent); }
.kku-timeline-label { margin: 0.25rem 0; color: var(--text); }
.kku-timeline-source { font-size: 0.75rem; color: var(--muted); }

// 해석 카드 (현대차/삼바와 동일 패턴)
.kku-interpretation-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.875rem;
  @media (min-width: 768px) { grid-template-columns: repeat(3, 1fr); }
}
.kku-interpretation-card {
  background: var(--surface-strong);
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  padding: 1rem 1.125rem;
  .kku-interpretation-title { font-weight: 600; color: var(--text); margin-bottom: 0.375rem; }
  p:last-child { color: var(--muted); }
}

// 자매 리포트 링크
.kku-sibling-links {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  margin-top: 1rem;
  @media (min-width: 640px) { flex-direction: row; }
  a {
    flex: 1;
    display: block;
    text-align: center;
    padding: 0.75rem 1rem;
    border: 1px solid var(--line);
    border-radius: var(--radius-sm);
    background: var(--surface-strong);
    color: var(--accent);
    font-weight: 600;
  }
}
```

## 9. 등록 체크리스트

| 파일 | 작업 |
|---|---|
| `src/data/reports.ts` | 리포트 항목 추가, order는 `samsung-biologics-union-bonus-2026`(3.521) 다음 |
| `src/styles/app.scss` | `@use 'scss/pages/kakao-union-bonus-2026';` 추가 |
| `public/sitemap.xml` | `/reports/kakao-union-bonus-2026/` URL 추가 |
| `src/data/hyundaiMotorUnionBonus2026.ts`, `src/data/samsungBiologicsUnionBonus2026.ts` | RELATED_LINKS에 카카오 리포트 상호 추가 |

## 10. JSON-LD 구조

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "카카오 성과급 갈등 2026, 무엇이 쟁점인가",
      "description": "...",
      "dateModified": "2026-06-26"
    },
    {
      "@type": "FAQPage",
      "mainEntity": [/* KKU_FAQ */]
    }
  ]
}
```

## 11. SEO 포인트

- `<title>`: `카카오 성과급 갈등 2026 | 첫 부분파업 핵심 쟁점 정리`
- `<description>`: 카카오 노조의 성과급 비율, RSU 처리, 고용안정, 투명성 요구를 회사 입장과 나란히 비교. 창사 첫 부분파업까지 이어진 갈등의 핵심을 정리합니다.
- 1차 키워드: `카카오 성과급`, `카카오 노조`
- 2차 키워드: `카카오 파업`, `카카오 보상체계`, `카카오 고용안정`

## 12. FAQ 초안 (8개)

1. **카카오는 왜 창사 첫 파업을 했나요?** — 성과급 비율, RSU 처리 방식, 고용안정, 보상 투명성을 둘러싼 노사 갈등이 봉합되지 않으면서 2026년 6월 10일 본사 포함 5개 법인이 4시간 부분파업에 들어갔습니다.
2. **카카오 성과급 비율은 얼마로 정해졌나요?** — 아직 확정되지 않았습니다. 회사는 영업이익의 10% 수준을 제안했고, 노조는 13~14% 수준(1인당 약 1,000만원)을 요구하고 있어 협상이 진행 중입니다.
3. **RSU가 왜 쟁점인가요?** — 회사는 RSU(양도제한조건부주식)를 성과 보상의 일부로 포함하자는 입장이고, 노조는 RSU를 성과급 재원에서 빼고 별도로 지급해야 한다는 입장입니다. 같은 비율의 성과급이라도 RSU 포함 여부에 따라 실질 현금 보상이 크게 달라집니다.
4. **카카오 노조가 가장 강조하는 요구는 무엇인가요?** — 노조는 스스로 "성과급 집단행동" 프레임을 경계하며, 계열사 매각·분사·구조조정 과정에서의 고용안정 보장이 핵심이라고 밝혔습니다.
5. **파업에 참여한 법인은 어디인가요?** — 카카오 본사, 카카오페이, 카카오엔터프라이즈, 디케이테크인, 엑스엘게임즈 등 5개 법인이 파업 찬반투표를 가결했고, 6월 10일 부분파업에 동참했습니다.
6. **노동위원회 조정은 어떻게 진행되고 있나요?** — 2026년 5월 18일 경기지방노동위원회 조정이 실패했고, 조정기일이 5월 27일로 연장됐습니다. 이후 진행 상황은 최신 보도로 확인이 필요합니다.
7. **앞으로 파업이 더 커질 수 있나요?** — 노조는 "부분 파업으로는 부족하다"는 입장을 밝히며 6월 29일 대규모 총파업을 예고했습니다. 협상 진전이 없으면 파업 시간 확대나 전면파업으로 이어질 가능성이 있습니다.
8. **현대차·삼성바이오로직스 갈등과 어떻게 다른가요?** — 현대차·삼바는 성과급 비율(%) 자체가 핵심 쟁점이었다면, 카카오는 비율 외에도 RSU 처리 방식과 고용안정 요구까지 얽혀 있어 단순 수치 비교만으로는 설명하기 어렵습니다.

## 13. 구현 순서

1. `src/data/kakaoUnionBonus2026.ts` — 위 스키마대로 작성
2. `src/pages/reports/kakao-union-bonus-2026.astro` — BaseLayout 사용, **계산기 섹션 없이** 정적 구성
3. (선택) `public/scripts/kakao-union-bonus-2026.js` — 인터랙션 없으면 생략 가능
4. `src/styles/scss/pages/_kakao-union-bonus-2026.scss` — prefix `kku-`
5. 등록: `reports.ts`, `app.scss`, `sitemap.xml`, 현대차·삼바 리포트에 상호링크 추가
6. `npm run build` 검증
7. 브라우저 검증: 타임라인·요구 카드 가독성, 모바일 레이아웃 확인 (인터랙션 테스트는 해당 없음)

## 14. QA 포인트

- [ ] 금액(1인당 약 1,000만원)이 "노조 측 주장"으로 명확히 인용 처리되어 있는지, 계산 도구로 오인되지 않는지
- [ ] 노조/회사 태그 색상이 일관되게 적용되는지 (`--accent` = 노조, `--muted` = 회사)
- [ ] 타임라인이 모바일에서도 날짜·내용이 겹치지 않고 읽히는지
- [ ] "협상 진행 중" 안내가 InfoNotice에 명확히 들어있는지 (게시 시점 기준 최신 진행 상황 재확인)
- [ ] 다른 두 리포트(현대차·삼바)와 상호링크가 양방향으로 연결됐는지
- [ ] 출처 링크 전체 유효성 재확인 (게시 직전)
- [ ] `npm run build` 빌드 에러 없음
