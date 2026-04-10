# 결혼 축의금 손익분기점 계산기 설계 문서

> 기획 원문: `docs/plan/202604/wedding-gift-break-even-calculator.md`
> 작성일: 2026-04-08
> 구현 기준: 현재 비교계산소 `/tools/` 계산기 구조를 기준으로 Codex/Claude가 바로 구현 가능한 수준으로 정리

---

## 1. 문서 개요

### 1-1. 대상
- 기획 문서: `docs/plan/202604/wedding-gift-break-even-calculator.md`
- 구현 대상: `결혼 축의금 손익분기점 계산기`
- 권장 slug: `wedding-gift-break-even-calculator`
- URL: `/tools/wedding-gift-break-even-calculator/`

### 1-2. 참고 계산기
- `wedding-budget-calculator`
  - 동일 주제 계산기. 내부 링크 연결 대상 1순위. 마크업 구조 참고
- `parental-leave-short-work-calculator`
  - 간단 모드 / 상세 모드 탭 전환, 리스크 해석 카드 패턴 참고
- `six-plus-six`
  - 결론 카드 + 프리셋 + 해석 문구 패턴 참고
- `dca-investment-calculator`
  - 하단 다음 도구 CTA 블록 + 외부 링크 + 제휴 섹션 배치 패턴 참고

### 1-3. 페이지 역할
이 계산기는 단순 비용 계산기가 아니라 아래 3가지를 한 번에 제공하는 예식 판단 도구다.
- 예식 총비용 계산 (식대 × 보증인원 구조 포함)
- 하객 구성 기반 총축의금 예상
- 손익분기 평균 축의금 / 손익분기 하객 수 역산

즉, 사용자에게는 "내 예식 구조에서 본전이 되려면 어떤 조건이 필요한가"를 숫자로 바로 보여주는 실사용 도구다.

### 1-4. MVP 범위
**1차 출시 (모두 구현)**
- 간단 모드 + 상세 모드 (탭 전환)
- 프리셋 6개
- 상단 요약 카드 (6종)
- 비용 분해 카드
- 해석 문구 카드
- 다음 도구 CTA 블록
- 외부 참고 링크 블록
- 제휴 상품 블록 (1개)
- FAQ + SeoContent

**2차 확장 (구현 이후)**
- 지역/웨딩홀 타입 프리셋 추가
- 결과 이미지 저장
- 신랑측/신부측 총합 분리 시각화

### 1-5. 권장 파일 구조
- `src/data/weddingGiftBreakEven.ts`
- `src/pages/tools/wedding-gift-break-even-calculator.astro`
- `public/scripts/wedding-gift-break-even-calculator.js`
- `src/styles/scss/pages/_wedding-gift-break-even-calculator.scss`
- `public/og/tools/wedding-gift-break-even-calculator.png`

---

## 2. 페이지 목적
- 예식홀 식대·보증인원 구조를 입력받아 총예식비를 계산한다.
- 간단 모드에서는 평균 축의금으로, 상세 모드에서는 하객 구성별 축의금으로 총예상 축의금을 계산한다.
- 예상 손익, 손익분기 평균 축의금, 손익분기 하객 수를 역산해 보여준다.
- "보증인원이 실제 하객보다 클 때 어떻게 달라지는지" 체감하게 만든다.
- 결혼 예산 관련 내부 링크 허브 역할을 수행한다.

---

## 3. 핵심 사용자 시나리오

### 3-1. 예식비 구조가 궁금한 예비부부
- 식대, 보증인원, 예상 하객 수, 평균 축의금을 입력한다.
- 계산기는 총예식비, 총축의금, 예상 손익을 즉시 보여준다.
- 보증인원이 높을 때 손익이 어떻게 달라지는지 체감한다.

### 3-2. 여러 예식홀을 비교하는 사용자
- 프리셋을 골라 각 조건을 빠르게 비교한다.
- 식대 5만원 vs 7만원, 보증인원 250명 vs 300명 조건 차이를 바꿔보며 시뮬레이션한다.

### 3-3. 본전이 되려면 얼마나 필요한지 확인하는 사용자
- 손익분기 평균 축의금, 손익분기 하객 수 카드를 바로 확인한다.
- 현재 입력 기준 흑자/적자 여부와 리스크 레벨을 파악한다.

### 3-4. 하객 구성이 복잡해 정밀 계산이 필요한 사용자
- 상세 모드 탭으로 전환한다.
- 친구 / 직장동료 / 친척 / 부모님 지인별 인원 수와 평균 축의금을 입력한다.
- 노쇼 예상 인원까지 반영해 실제 수령 가능 축의금을 정밀 계산한다.

---

## 4. 입력값 / 출력값 정의

### 4-1. 입력값 (간단 모드)

| 변수명 | 타입 | 설명 | 기본값 |
|--------|------|------|--------|
| `mealCostPerPerson` | `number` | 1인 식대 (원) | 55000 |
| `guaranteedGuests` | `number` | 보증인원 (명) | 300 |
| `expectedGuests` | `number` | 실제 예상 하객 수 (명) | 280 |
| `avgGiftAmount` | `number` | 평균 축의금 (원) | 70000 |
| `venueFee` | `number` | 대관료 (원) | 1000000 |
| `decorationFee` | `number` | 장식/연출료 (원) | 1500000 |
| `otherFixedCost` | `number` | 기타 고정비 (원) | 500000 |

### 4-2. 입력값 (상세 모드)

상세 모드는 간단 모드 입력값(식대·보증인원·대관료·장식비·기타)을 그대로 유지하고, 평균 축의금 대신 아래 구성별 입력을 사용한다.

**하객 구성별 입력 (4개 그룹)**

| 변수명 | 타입 | 설명 | 기본값 |
|--------|------|------|--------|
| `friendCount` | `number` | 친구 인원 | 60 |
| `friendAvgGift` | `number` | 친구 평균 축의금 (원) | 50000 |
| `coworkerCount` | `number` | 직장동료 인원 | 70 |
| `coworkerAvgGift` | `number` | 직장동료 평균 축의금 (원) | 60000 |
| `relativeCount` | `number` | 친척 인원 | 80 |
| `relativeAvgGift` | `number` | 친척 평균 축의금 (원) | 100000 |
| `parentsGuestCount` | `number` | 부모님 지인 인원 | 70 |
| `parentsGuestAvgGift` | `number` | 부모님 지인 평균 축의금 (원) | 100000 |

**상세 모드 보조 입력**

| 변수명 | 타입 | 설명 | 기본값 |
|--------|------|------|--------|
| `noShowCount` | `number` | 노쇼 예상 인원 (명) | 0 |
| `mealTicketLossRate` | `number` | 식권 누수율 (%) | 0 |

- 상세 모드에서는 그룹별 인원 합계가 `expectedGuests`로 자동 표시된다.
- 노쇼는 총축의금에서 `(노쇼 인원 × 하객 구성별 가중 평균 축의금)`을 차감한다.
- 식권 누수율은 식대 총액에 `(1 + 누수율/100)`을 곱해 반영한다.
- 상세 모드 → 간단 모드 전환 시 구성별 가중평균을 `avgGiftAmount`로, 그룹 합계를 `expectedGuests`로 자동 채운다.

### 4-3. 출력값

| 변수명 | 설명 |
|--------|------|
| `effectiveGuestCount` | 식대 적용 인원 = max(보증인원, 실제 하객 수) |
| `totalMealCost` | 식대 총액 (식권 누수 반영 후) |
| `totalFixedCost` | 고정비 총액 (대관료 + 장식 + 기타) |
| `totalWeddingCost` | 총예식비 |
| `totalGiftAmount` | 총예상 축의금 (노쇼 반영 후) |
| `estimatedPnl` | 예상 손익 (흑자/적자) |
| `breakEvenGiftPerPerson` | 손익분기 평균 축의금 |
| `breakEvenGuestCount` | 손익분기 하객 수 |
| `weightedAvgGift` | 가중 평균 축의금 (상세 모드) |
| `riskLevel` | 리스크 레벨: `SAFE` / `NORMAL` / `CAUTION` / `DANGER` |
| `interpretationMessages` | 상황별 해석 문구 목록 |

---

## 5. 섹션 구조

### 5-1. 히어로
- 컴포넌트: `CalculatorHero`
- 카피:
  - eyebrow: `결혼 예산 계산`
  - title: `결혼 축의금 손익분기점 계산기`
  - description: `예식홀 식대, 보증인원, 하객 수, 평균 축의금을 넣으면 결혼식 비용 구조와 본전 가능성을 미리 계산할 수 있습니다.`
- 보조 태그 3개:
  - `보증인원 구조 반영`
  - `손익분기 자동 계산`
  - `하객 구성별 정밀 계산`

### 5-2. 액션 바
- 컴포넌트: `ToolActionBar`
- 버튼: 초기화, 공유 링크 복사

### 5-3. 프리셋 버튼
- 버튼 6개 (칩 형태, 가로 스크롤)

| 프리셋명 | 식대 | 보증 | 하객 | 평균 축의금 | 고정비 합계 |
|---------|-----|-----|-----|-----------|-----------|
| 하객 200명 / 일반형 | 5만 | 200명 | 180명 | 7만 | 250만 |
| 하객 250명 / 일반형 | 5.5만 | 250명 | 230명 | 7만 | 300만 |
| 하객 300명 / 대형 | 5.5만 | 300명 | 280명 | 7만 | 350만 |
| 호텔형 / 300명 | 11만 | 300명 | 280명 | 10만 | 500만 |
| 친구 비중 높은 예식 | 5만 | 250명 | 220명 | 5.5만 | 300만 |
| 친척 비중 높은 예식 | 5만 | 250명 | 240명 | 9만 | 300만 |

### 5-4. 모드 탭 (간단 / 상세)
`wgbe-mode-tab` 블록

```html
<div class="wgbe-mode-tab">
  <button class="wgbe-mode-tab__btn wgbe-mode-tab__btn--active" data-mode="simple">간단 모드</button>
  <button class="wgbe-mode-tab__btn" data-mode="detail">상세 모드</button>
</div>
```

- 탭 전환 시 해당 모드 입력 패널 표시/숨김
- 간단 → 상세 전환: 기존 입력값 유지, 하객 구성 기본값 자동 채움
- 상세 → 간단 전환: 그룹 가중평균 → `avgGiftAmount`, 그룹 합계 → `expectedGuests` 자동 반영

### 5-5. 입력 패널 (간단 모드)
- 1인 식대 (슬라이더 + 숫자 입력, 만 원 단위 표시)
- 보증인원 (숫자 입력)
- 실제 예상 하객 수 (숫자 입력)
- 평균 축의금 (슬라이더 + 숫자 입력, 만 원 단위 표시)
- 대관료 / 장식비 / 기타 고정비 (숫자 입력, 만 원 단위)
- 보증인원 > 실제 하객 수일 때 인라인 경고 문구 표시
  - 예: `⚠ 보증인원이 실제 하객보다 20명 많아 식대 기준이 300명으로 적용됩니다.`

### 5-6. 입력 패널 (상세 모드)
`wgbe-detail-panel` 블록

상단에 간단 모드 공통 입력 (식대·보증·대관·장식·기타)을 그대로 유지한다.

**하객 구성 입력 (4행 그리드)**

```
[그룹명]      [인원 수 ____명]  [평균 축의금 ____만원]
친구          [60명]           [5만원]
직장동료      [70명]           [6만원]
친척          [80명]           [10만원]
부모님 지인   [70명]           [10만원]
─────────────────────────────────────
합계          [280명 자동계산]  [가중평균 7.8만원]
```

**보조 조건**
- 노쇼 예상 인원: 숫자 입력 (기본 0)
- 식권 누수율: 셀렉트 (0% / 3% / 5% / 10%)

### 5-7. 상단 요약 카드
`SummaryCards` 6칸 구성

| 카드명 | 설명 | 강조 여부 |
|-------|------|---------|
| 총예식비 | 식대 + 대관 + 장식 + 기타 | 주요 |
| 총예상 축의금 | 하객 구성 기반 | 주요 |
| 예상 손익 | 흑자 초록 / 적자 빨강 | 강조 (primary) |
| 손익분기 평균 축의금 | 본전이 되는 1인당 축의금 | |
| 손익분기 하객 수 | 현재 평균 기준 필요 하객 수 | |
| 리스크 레벨 | 안정 / 보통 / 주의 / 위험 | 배지 형태 |

### 5-8. 비용 분해 카드
`wgbe-cost-breakdown` 블록

- 식대 적용 인원 강조 (보증인원 vs 실제 하객 수 중 큰 값)
- 식대 총액 (식권 누수 반영 시 `+누수 XX만원` 추가 표기)
- 고정비 합계 (대관 + 장식 + 기타)
- **총예식비 합계 강조**

### 5-9. 해석 문구 카드
`wgbe-interpretation-card` 블록
- 조건에 따라 1~3개 문구 동적 표시
- 문구 유형:
  - 보증인원 초과 경고
  - 손익 결과 (흑자/적자 금액)
  - 손익분기 달성 조건
  - 하객 구성별 팁 (상세 모드)

### 5-10. 안내 문구
`InfoNotice` 사용
- 이 결과는 입력값 기준 모의계산입니다.
- 실제 식대 계약 방식, 식권 누수, 노쇼 등에 따라 달라질 수 있습니다.
- 결혼식 손익을 수치로 확인하는 것은 예산 판단에 도움이 되지만, 결혼의 의미를 비용으로만 환산하지 않도록 주의하세요.

### 5-11. 다음 도구 CTA 블록
`wgbe-next-tool-cta` 블록 (DCA 패턴 참고)
- 메인 CTA: 결혼 예산 계산기 (`/tools/wedding-budget-calculator/`)
- 서브 링크 3개:
  - 연봉 실수령 계산기 (`/tools/salary/`)
  - 출산~2세 지원금 계산기 (`/tools/birth-support-total/`)
  - 가구 소득 계산기 (`/tools/household-income/`)

### 5-12. 외부 참고 링크 블록
`wgbe-external-links` 블록
- 3개, `target="_blank" rel="noopener noreferrer"` 적용
- 링크 성격 명시: `공식 사이트에서 자세히 보기`

| 제목 | 설명 | 출처 |
|-----|------|-----|
| 한국소비자원 — 예식 서비스 표준약관 | 보증인원·식대 계약 조건 관련 소비자 권리 확인 | 한국소비자원 |
| 공정거래위원회 — 예식서비스 표준약관 | 예식 취소·환불·위약금 기준 공식 안내 | 공정거래위원회 |
| 웨딩비 실태 조사 — 한국소비자원 | 국내 평균 결혼 비용 및 예식장 식대 참고 데이터 | 한국소비자원 |

### 5-13. 제휴 상품 블록 (쿠팡 파트너스)
`affiliate-section` / `affiliate-box` 패턴 (CONTENT_GUIDE 6-C 준수)
- 계산기 페이지 제한: **1개 블록, 3개 카드**
- 위치: 외부 참고 링크 아래, SeoContent 바로 위
- 주제 연관성: 결혼 준비 / 신혼부부 재테크

| tag | 상품명 | 설명 |
|-----|-------|------|
| 결혼 준비 | 결혼 준비 A to Z 가이드 | 예식장 선택, 축의금 운용, 신혼집 준비까지 결혼 준비 전 과정을 정리한 가이드북 |
| 웨딩 플래너 | 웨딩 플래너 다이어리 | 예식 일정, 예산, 업체 연락처를 한 권에 정리하는 결혼 준비 전용 다이어리 |
| 신혼 재테크 | 부부의 돈 공부 | 결혼 이후 생활비·적금·투자 설계를 시작하는 신혼부부를 위한 재테크 입문서 |

```astro
<section class="content-section affiliate-section">
  <div class="affiliate-box">
    <div class="affiliate-box__header">
      <span class="affiliate-box__icon">💍</span>
      <div>
        <h3 class="affiliate-box__title">결혼 준비에 도움이 되는 책</h3>
        <p class="affiliate-box__context">예식 예산부터 신혼 재테크까지 한 번에 준비해보세요.</p>
      </div>
    </div>
    <div class="affiliate-product-grid">
      {WGBE_AFFILIATE_PRODUCTS.map((prod) => (
        <a href={prod.href} class="affiliate-product-card"
           target="_blank" rel="noopener sponsored">
          <span class="affiliate-product-tag">{prod.tag}</span>
          <p class="affiliate-product-title">{prod.title}</p>
          <p class="affiliate-product-desc">{prod.desc}</p>
          <span class="affiliate-product-cta">쿠팡에서 보기 →</span>
        </a>
      ))}
    </div>
    <p class="affiliate-disclosure">
      이 링크는 쿠팡파트너스 활동의 일환으로, 구매 시 소정의 수수료를 받을 수 있습니다.
    </p>
  </div>
</section>
```

### 5-14. SEO / FAQ / 관련 링크
`SeoContent` 구성 (필수 props 모두 채움)

```astro
<SeoContent
  introTitle="결혼 축의금 손익분기점 계산기 — 이렇게 활용하세요"
  intro={[
    "예식홀 식대와 보증인원 구조는 결혼식 비용에서 가장 큰 변수입니다. ...",
    "하객 구성(친구·직장동료·친척·부모님 지인)에 따라 평균 축의금이 달라지므로 ...",
  ]}
  inputPoints={[
    "1인 식대와 보증인원 기준으로 총예식비를 자동 계산합니다.",
    "하객 구성별 입력으로 실제에 가까운 총축의금을 예상합니다.",
    "손익분기 평균 축의금과 손익분기 하객 수를 역산해 본전 조건을 알려줍니다.",
  ]}
  criteria={[
    "식대 적용 인원 = max(보증인원, 실제 예상 하객 수)",
    "총예식비 = 식대 총액 + 대관료 + 장식비 + 기타 고정비",
    "손익분기 평균 축의금 = 총예식비 ÷ 실제 하객 수",
    "이 결과는 입력값 기반 모의계산이며 실제 계약 조건과 다를 수 있습니다.",
  ]}
  faq={WGBE_FAQ}
  related={[
    { href: "/tools/wedding-budget-calculator/", label: "결혼 예산 계산기" },
    { href: "/tools/salary/", label: "연봉 실수령 계산기" },
    { href: "/tools/household-income/", label: "가구 소득 계산기" },
    { href: "/tools/birth-support-total/", label: "출산~2세 지원금 계산기" },
    { href: "/tools/six-plus-six/", label: "6+6 부모육아휴직 계산기" },
  ]}
/>
```

---

## 6. 컴포넌트 구조

- `BaseLayout`
- `SiteHeader`
- `CalculatorHero`
- `ToolActionBar`
- `InfoNotice`
- `SeoContent`
- 권장 쉘: `SimpleToolShell`
  - 이유: 입력 패널 + 결과 카드 구조가 명확하고 단일 계산기 흐름에 적합

### 6-1. 페이지 전용 블록 (CSS prefix: `wgbe-`)
- `wgbe-preset-chips` — 프리셋 칩 버튼 영역
- `wgbe-mode-tab` — 간단/상세 모드 탭 전환
- `wgbe-input-group` — 간단 모드 입력 패널
- `wgbe-detail-panel` — 상세 모드 입력 패널
- `wgbe-detail-group-row` — 하객 구성 1행 (그룹명 + 인원 + 평균 축의금)
- `wgbe-detail-summary-row` — 합계 행 (인원 합계 + 가중평균 자동 표시)
- `wgbe-guarantee-warning` — 보증인원 경고 인라인 문구
- `wgbe-cost-breakdown` — 비용 분해 카드
- `wgbe-interpretation-card` — 해석 문구 카드
- `wgbe-risk-badge` — 리스크 레벨 배지 (SAFE/NORMAL/CAUTION/DANGER)
- `wgbe-next-tool-cta` — 다음 도구 CTA 블록
- `wgbe-external-links` — 외부 참고 링크 블록

### 6-2. 페이지 전체 렌더링 트리 (모바일 순서)

```
CalculatorHero
ToolActionBar
wgbe-preset-chips
wgbe-mode-tab
  wgbe-input-group (간단 모드, default)
  wgbe-detail-panel (상세 모드, hidden)
SummaryCards (6칸)
wgbe-cost-breakdown
wgbe-interpretation-card
InfoNotice
wgbe-next-tool-cta
wgbe-external-links
affiliate-section (affiliate-box)
SeoContent
```

PC: SimpleToolShell 기준 왼쪽 입력 패널, 오른쪽 결과 대시보드 (요약 카드 + 비용 분해 + 해석)

---

## 7. 상태 관리 포인트

- 바닐라 JS + DOM 직접 갱신 구조
- `currentMode: 'simple' | 'detail'` 상태 유지
- URL query param 복원 지원

**간단 모드 params**

| param | 의미 |
|-------|------|
| `mc` | 1인 식대 |
| `gg` | 보증인원 |
| `eg` | 예상 하객 수 |
| `ag` | 평균 축의금 |
| `vf` | 대관료 |
| `df` | 장식비 |
| `of` | 기타 고정비 |

**상세 모드 추가 params**

| param | 의미 |
|-------|------|
| `mode` | `detail` (상세 모드 복원 트리거) |
| `fc` | 친구 인원 |
| `fa` | 친구 평균 축의금 |
| `cc` | 직장동료 인원 |
| `ca` | 직장동료 평균 축의금 |
| `rc` | 친척 인원 |
| `ra` | 친척 평균 축의금 |
| `pc` | 부모님 지인 인원 |
| `pa` | 부모님 지인 평균 축의금 |
| `ns` | 노쇼 인원 |
| `ml` | 식권 누수율 |

- `mode=detail`이 있으면 복원 시 상세 모드 탭으로 자동 전환
- 입력 변경 시 동시 갱신 대상:
  - 상단 요약 카드 6개
  - 비용 분해 카드
  - 해석 문구 카드
  - 보증인원 경고 문구
  - 상세 모드 합계 행 (인원 합계, 가중평균)

**입력 방어**
- 보증인원 또는 하객 수 0 이하 방어
- 평균 축의금 0 이하 방어
- 음수 금액 방어
- 1인 식대 0 이하 방어
- 상세 모드: 그룹 인원 합계가 0일 때 계산 중단 + 안내 문구

---

## 8. 계산 로직

### 8-1. 핵심 공식

```js
// 식대 적용 인원
const effectiveGuestCount = Math.max(guaranteedGuests, expectedGuests);

// 식대 총액 (식권 누수 반영)
const totalMealCost = mealCostPerPerson * effectiveGuestCount * (1 + mealTicketLossRate / 100);

// 고정비 합계
const totalFixedCost = venueFee + decorationFee + otherFixedCost;

// 총예식비
const totalWeddingCost = totalMealCost + totalFixedCost;

// 총축의금 (간단 모드)
const totalGiftAmount = avgGiftAmount * expectedGuests;

// 예상 손익
const estimatedPnl = totalGiftAmount - totalWeddingCost;

// 손익분기 평균 축의금
const breakEvenGiftPerPerson = totalWeddingCost / expectedGuests;

// 손익분기 하객 수
const breakEvenGuestCount = totalWeddingCost / avgGiftAmount;
```

### 8-2. 상세 모드 — 총축의금 계산

```js
// 그룹별 합계
const totalGiftAmount =
  (friendCount * friendAvgGift) +
  (coworkerCount * coworkerAvgGift) +
  (relativeCount * relativeAvgGift) +
  (parentsGuestCount * parentsGuestAvgGift);

// 하객 합계 (expectedGuests 대체)
const totalGuestCount = friendCount + coworkerCount + relativeCount + parentsGuestCount;

// 노쇼 반영: 그룹별 비율 가중 차감
const weightedAvgGift = totalGuestCount > 0 ? totalGiftAmount / totalGuestCount : 0;
const noShowDeduction = noShowCount * weightedAvgGift;
const adjustedGiftAmount = Math.max(totalGiftAmount - noShowDeduction, 0);

// 가중평균 (손익분기 계산용)
const avgGiftForBreakEven = totalGuestCount > 0 ? adjustedGiftAmount / (totalGuestCount - noShowCount) : 0;
```

### 8-3. 리스크 레벨 판정

```js
function getRiskLevel(estimatedPnl, totalWeddingCost) {
  const ratio = estimatedPnl / totalWeddingCost;
  if (ratio >= 0.1) return 'SAFE';       // 흑자 10% 이상
  if (ratio >= 0) return 'NORMAL';       // 흑자 0~10%
  if (ratio >= -0.15) return 'CAUTION';  // 적자 15% 이내
  return 'DANGER';                        // 적자 15% 초과
}
```

| 레벨 | 한국어 | 색상 |
|------|-------|------|
| SAFE | 안정 | `--color-brand-primary` |
| NORMAL | 보통 | `--color-brand-mid` |
| CAUTION | 주의 | `--color-warning` |
| DANGER | 위험 | `#E53E3E` |

### 8-4. 해석 문구 결정 로직

```js
const messages = [];

// 보증인원 초과 경고
if (guaranteedGuests > expectedGuests) {
  messages.push(`보증인원이 실제 하객보다 ${guaranteedGuests - expectedGuests}명 많아 식대 기준이 ${guaranteedGuests}명으로 적용됩니다.`);
}

// 손익 결과
if (estimatedPnl < 0) {
  const shortage = Math.abs(estimatedPnl);
  messages.push(`현재 조건 기준으로 약 ${Math.round(shortage / 10000)}만원 적자가 예상됩니다.`);
  messages.push(`평균 축의금이 ${Math.ceil(breakEvenGiftPerPerson / 10000)}만원 이상이 되어야 본전입니다.`);
} else {
  messages.push(`현재 조건으로 약 ${Math.round(estimatedPnl / 10000)}만원 흑자가 예상됩니다.`);
}

// 상세 모드 하객 구성 팁
if (currentMode === 'detail' && parentsGuestCount + relativeCount > totalGuestCount * 0.5) {
  messages.push(`친척·부모님 지인 비중이 높아 평균 축의금 방어력이 큰 편입니다.`);
} else if (currentMode === 'detail' && friendCount > totalGuestCount * 0.4) {
  messages.push(`친구 비중이 높으면 평균 축의금이 낮아질 수 있으니 손익분기점을 확인하세요.`);
}
```

---

## 9. 데이터 파일 구조 (`src/data/weddingGiftBreakEven.ts`)

```ts
// ── 타입 ────────────────────────────────────────────────────────
export type RiskLevel = 'SAFE' | 'NORMAL' | 'CAUTION' | 'DANGER';

export interface WeddingGiftPreset {
  label: string;
  mealCostPerPerson: number;
  guaranteedGuests: number;
  expectedGuests: number;
  avgGiftAmount: number;
  venueFee: number;
  decorationFee: number;
  otherFixedCost: number;
}

export interface AffiliateProduct {
  tag: string;
  title: string;
  desc: string;
  cta: string;
  href: string;
}

export interface ExternalLink {
  title: string;
  desc: string;
  source: string;
  href: string;
}

export interface NextToolCta {
  href: string;
  eyebrow: string;
  title: string;
  desc: string;
  badges: string[];
  cta: string;
  sub: Array<{ href: string; title: string; desc: string; badges: string[] }>;
}

// ── 메타 ────────────────────────────────────────────────────────
export const PAGE_META = {
  title: '결혼 축의금 손익분기점 계산기',
  subtitle: '예식홀 식대, 보증인원, 하객 수, 평균 축의금을 넣어 결혼식 손익을 계산합니다.',
  methodology: '1인 식대 × max(보증인원, 예상 하객 수) 기준 계산. 노쇼 및 식권 누수 반영 가능.',
  caution: '이 결과는 입력값 기반 모의계산입니다. 실제 예식 계약 조건과 다를 수 있습니다.',
  updatedAt: '2026년 4월 기준',
};

// ── 기본값 ──────────────────────────────────────────────────────
export const DEFAULT_INPUTS = {
  mealCostPerPerson: 55000,
  guaranteedGuests: 300,
  expectedGuests: 280,
  avgGiftAmount: 70000,
  venueFee: 1000000,
  decorationFee: 1500000,
  otherFixedCost: 500000,
};

export const DEFAULT_DETAIL_INPUTS = {
  friendCount: 60,
  friendAvgGift: 50000,
  coworkerCount: 70,
  coworkerAvgGift: 60000,
  relativeCount: 80,
  relativeAvgGift: 100000,
  parentsGuestCount: 70,
  parentsGuestAvgGift: 100000,
  noShowCount: 0,
  mealTicketLossRate: 0,
};

// ── 리스크 레벨 ─────────────────────────────────────────────────
export const RISK_LEVEL_LABELS: Record<RiskLevel, string> = {
  SAFE: '안정',
  NORMAL: '보통',
  CAUTION: '주의',
  DANGER: '위험',
};

// ── 프리셋 ──────────────────────────────────────────────────────
export const PRESETS: WeddingGiftPreset[] = [
  {
    label: '하객 200명 / 일반형',
    mealCostPerPerson: 50000,
    guaranteedGuests: 200,
    expectedGuests: 180,
    avgGiftAmount: 70000,
    venueFee: 800000,
    decorationFee: 1200000,
    otherFixedCost: 500000,
  },
  {
    label: '하객 250명 / 일반형',
    mealCostPerPerson: 55000,
    guaranteedGuests: 250,
    expectedGuests: 230,
    avgGiftAmount: 70000,
    venueFee: 1000000,
    decorationFee: 1500000,
    otherFixedCost: 500000,
  },
  {
    label: '하객 300명 / 대형',
    mealCostPerPerson: 55000,
    guaranteedGuests: 300,
    expectedGuests: 280,
    avgGiftAmount: 70000,
    venueFee: 1200000,
    decorationFee: 1800000,
    otherFixedCost: 500000,
  },
  {
    label: '호텔형 / 300명',
    mealCostPerPerson: 110000,
    guaranteedGuests: 300,
    expectedGuests: 280,
    avgGiftAmount: 100000,
    venueFee: 2000000,
    decorationFee: 2000000,
    otherFixedCost: 1000000,
  },
  {
    label: '친구 비중 높은 예식',
    mealCostPerPerson: 50000,
    guaranteedGuests: 250,
    expectedGuests: 220,
    avgGiftAmount: 55000,
    venueFee: 800000,
    decorationFee: 1200000,
    otherFixedCost: 500000,
  },
  {
    label: '친척 비중 높은 예식',
    mealCostPerPerson: 50000,
    guaranteedGuests: 250,
    expectedGuests: 240,
    avgGiftAmount: 90000,
    venueFee: 800000,
    decorationFee: 1200000,
    otherFixedCost: 500000,
  },
];

// ── 다음 도구 CTA ────────────────────────────────────────────────
export const WGBE_NEXT_TOOL: NextToolCta = {
  href: '/tools/wedding-budget-calculator/',
  eyebrow: '이어서 계산해보세요',
  title: '결혼 예산 계산기',
  desc: '예식비만이 아니라 혼수, 신혼집, 허니문까지 결혼 전체 예산을 항목별로 정리하고 감당 가능한 규모를 확인해보세요.',
  badges: ['결혼 전체 예산', '항목별 정리'],
  cta: '결혼 예산 계산기 바로가기',
  sub: [
    {
      href: '/tools/salary/',
      title: '연봉 실수령 계산기',
      desc: '결혼 예산이 우리 소득 기준으로 감당 가능한지 먼저 확인해보세요.',
      badges: ['연봉', '실수령'],
    },
    {
      href: '/tools/birth-support-total/',
      title: '출산~2세 지원금 계산기',
      desc: '결혼 이후 출산·육아 비용과 정부 지원금 흐름을 미리 파악해보세요.',
      badges: ['출산', '육아 지원'],
    },
    {
      href: '/tools/household-income/',
      title: '가구 소득 계산기',
      desc: '맞벌이 가구 소득 기준으로 결혼 준비 예산 규모를 설계할 수 있습니다.',
      badges: ['가구 소득', '맞벌이'],
    },
  ],
};

// ── 외부 참고 링크 ────────────────────────────────────────────────
export const WGBE_EXTERNAL_LINKS: ExternalLink[] = [
  {
    title: '한국소비자원 — 예식서비스 소비자 피해 주의보',
    desc: '보증인원·식대 계약 조건, 예식 취소 시 환불 기준 등 소비자 권리 공식 안내',
    source: '한국소비자원',
    href: 'https://www.kca.go.kr/',
  },
  {
    title: '공정거래위원회 — 예식서비스 표준약관',
    desc: '예식장 계약 시 적용되는 표준약관 원문 확인 (보증인원, 위약금 기준 포함)',
    source: '공정거래위원회',
    href: 'https://www.ftc.go.kr/',
  },
  {
    title: '한국소비자원 — 결혼 준비 비용 실태 조사',
    desc: '국내 평균 예식 비용, 식대 수준, 축의금 실태 참고 데이터',
    source: '한국소비자원',
    href: 'https://www.kca.go.kr/',
  },
];

// ── 제휴 상품 ────────────────────────────────────────────────────
export const WGBE_AFFILIATE_PRODUCTS: AffiliateProduct[] = [
  {
    tag: '결혼 준비',
    title: '결혼 준비 A to Z',
    desc: '예식장 선택, 축의금 운용, 신혼집 준비까지 결혼 준비 전 과정을 정리한 실용 가이드북',
    cta: '쿠팡에서 보기 →',
    href: 'https://www.coupang.com/np/search?q=%EA%B2%B0%ED%98%BC+%EC%A4%80%EB%B9%84+%EA%B0%80%EC%9D%B4%EB%93%9C',
  },
  {
    tag: '웨딩 플래너',
    title: '웨딩 플래너 다이어리',
    desc: '예식 일정, 업체 연락처, 예산 현황을 한 권에 정리하는 결혼 준비 전용 플래너',
    cta: '쿠팡에서 보기 →',
    href: 'https://www.coupang.com/np/search?q=%EC%9B%A8%EB%94%A9+%ED%94%8C%EB%9E%98%EB%84%88+%EB%8B%A4%EC%9D%B4%EC%96%B4%EB%A6%AC',
  },
  {
    tag: '신혼 재테크',
    title: '부부의 돈 공부',
    desc: '결혼 이후 생활비 분담, 적금, 투자 설계를 시작하는 신혼부부를 위한 재테크 입문서',
    cta: '쿠팡에서 보기 →',
    href: 'https://www.coupang.com/np/search?q=%EB%B6%80%EB%B6%80+%EC%9E%AC%ED%85%8C%ED%81%AC+%EB%8F%88',
  },
];

// ── FAQ ─────────────────────────────────────────────────────────
export const WGBE_FAQ = [
  {
    q: '축의금으로 결혼식 비용을 다 회수할 수 있나요?',
    a: '하객 구성, 식대, 보증인원, 예식홀 타입에 따라 크게 달라집니다. 친척·부모님 지인 비중이 높을수록 평균 축의금이 높아지고 손익 방어가 유리합니다.',
  },
  {
    q: '보증인원이 실제 하객보다 더 중요할 수 있나요?',
    a: '네. 식대 청구 기준이 보증인원일 경우, 실제 하객이 적어도 보증인원 기준으로 비용이 발생합니다. 계약 전 반드시 확인해야 합니다.',
  },
  {
    q: '평균 축의금은 얼마로 잡아야 하나요?',
    a: '친구(3~5만원), 직장동료(5~7만원), 친척(7~15만원), 부모님 지인(10~20만원)으로 구성 비중에 따라 달라집니다. 상세 모드에서 그룹별로 나눠 입력하면 더 현실적인 계산이 가능합니다.',
  },
  {
    q: '노쇼(불참)는 얼마나 반영해야 하나요?',
    a: '통상 예상 하객의 5~10%가 참석하지 않는 경우가 많습니다. 상세 모드에서 노쇼 인원을 직접 입력해 반영할 수 있습니다.',
  },
  {
    q: '결혼식 손익만으로 예식장을 결정해도 되나요?',
    a: '손익은 예산 구조를 이해하는 데 도움이 되지만, 날짜·위치·분위기 등 다양한 조건을 함께 고려해야 합니다. 이 계산기는 비용 구조 파악을 위한 참고 도구입니다.',
  },
];
```

---

## 10. tools.ts 등록

```ts
{
  slug: 'wedding-gift-break-even-calculator',
  title: '결혼 축의금 손익분기점 계산기',
  description: '예식홀 식대, 보증인원, 하객 수, 평균 축의금을 넣어 결혼식 손익을 계산합니다.',
  order: /* wedding-budget-calculator 다음 순서 */,
  badges: ['결혼', '예산'],
  previewStats: [
    { label: '식대 × 보증인원', value: '핵심 구조' },
    { label: '손익분기점', value: '자동 계산' },
  ],
}
```

---

## 11. SEO 메타

- `<title>`: 결혼 축의금 손익분기점 계산기 | 예식홀 식대·보증인원·하객 수 계산
- `<meta name="description">`: 예식홀 식대, 보증인원, 실제 하객 수, 평균 축의금을 넣어 결혼식 손익을 계산해보세요. 하객 200명·300명 예시와 손익분기점도 함께 제공합니다.
- OG 이미지: `public/og/tools/wedding-gift-break-even-calculator.png`

---

## 12. sitemap.xml 추가

```xml
<url>
  <loc>https://bigyocalc.com/tools/wedding-gift-break-even-calculator/</loc>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

---

## 13. 구현 순서

1. `src/data/weddingGiftBreakEven.ts` 작성
   - PAGE_META, DEFAULT_INPUTS, DEFAULT_DETAIL_INPUTS
   - PRESETS (6개), RISK_LEVEL_LABELS
   - WGBE_NEXT_TOOL, WGBE_EXTERNAL_LINKS, WGBE_AFFILIATE_PRODUCTS
   - WGBE_FAQ
2. `src/data/tools.ts` 에 항목 추가
3. `src/pages/tools/wedding-gift-break-even-calculator.astro` 마크업 작성
   - SimpleToolShell 기반
   - 모드 탭, 입력 패널(2종), 요약 카드, 비용 분해, 해석 카드 배치
   - 다음 도구 CTA, 외부 링크, 제휴 블록, SeoContent 배치
4. `src/styles/scss/pages/_wedding-gift-break-even-calculator.scss` 작성
   - `src/styles/app.scss`에 import 추가
5. `public/scripts/wedding-gift-break-even-calculator.js` 작성
   - 간단/상세 모드 토글 핸들러
   - 계산 함수 구현
   - 입력 이벤트 → DOM 갱신
   - 프리셋 클릭 핸들러
   - URL query param 저장/복원
6. `public/sitemap.xml` 항목 추가
7. `npm run build` 실행 및 라우트 확인

---

## 14. QA 체크포인트

### 14-1. 계산 정확성
- 보증인원 > 실제 하객 수일 때 식대 적용 인원이 보증인원 기준인지
- 보증인원 ≤ 실제 하객 수일 때 식대 적용 인원이 실제 하객 수 기준인지
- 손익분기 평균 축의금 = 총예식비 ÷ 실제 하객 수가 맞는지
- 손익분기 하객 수 = 총예식비 ÷ 평균 축의금이 맞는지
- 리스크 레벨이 손익 비율에 따라 올바르게 분기되는지
- 식권 누수율 반영 시 식대 총액이 `원래 금액 × (1 + 누수율)`로 계산되는지
- 노쇼 차감이 가중평균 × 노쇼 인원으로 계산되는지
- 상세 모드 → 간단 모드 전환 시 가중평균이 `avgGiftAmount`로 정확히 반영되는지

### 14-2. 입력 방어
- 모든 입력값 0 이하 방어되는지
- 보증인원 경고 문구가 조건에 따라 표시/숨김 되는지
- 기타 고정비 0원 입력 시 계산 오류 없는지
- 상세 모드에서 그룹 인원 합계 0일 때 계산 중단 + 안내되는지

### 14-3. UX
- 프리셋 클릭 시 모든 입력값이 일괄 교체되는지
- 모드 탭 전환 시 결과 카드가 즉시 갱신되는지
- 모바일에서 상세 모드 4행 그리드가 과하게 복잡하지 않은지
- URL 공유 후 복원 시 모드(간단/상세)와 입력값이 동일하게 복구되는지

### 14-4. 콘텐츠 / SEO
- title, H1, meta description에 주요 키워드 포함 여부
- FAQ 5개 모두 WGBE_FAQ에서 SeoContent로 전달되는지
- SeoContent related 5개 링크 URL이 실제 존재하는 라우트인지
- InfoNotice에 `모의계산` 명시 여부
- 제휴 링크에 `rel="noopener sponsored"` 포함 여부
- 쿠팡 파트너스 고지 문구 `affiliate-disclosure` 노출 여부
- 외부 링크에 `target="_blank" rel="noopener noreferrer"` 적용 여부

---

## 15. 최종 구현 방향 정리

이 계산기의 핵심은 **보증인원 × 식대 구조가 손익에 미치는 영향**을 직관적으로 보여주는 것이다.

사용자에게 다음 흐름이 자연스럽게 느껴져야 한다:
1. 프리셋으로 내 조건과 비슷한 예시를 고른다
2. 간단 모드에서 식대·보증인원·예상 하객 수를 조정한다
3. 손익 카드가 즉시 바뀌고 리스크 레벨이 갱신된다
4. "보증인원이 실제 하객보다 많으면 손익이 이렇게 달라진다"를 체감한다
5. 더 정확한 계산이 필요하면 상세 모드로 전환해 하객 구성별로 입력한다
6. 손익분기 축의금/하객 수 카드로 본전 조건을 확인한다
7. 결혼 예산 계산기 CTA로 전체 예산 설계로 자연스럽게 이어진다
