# AI 도구 월비용 계산기 — 설계 문서

> 기획 원문: `docs/plan-docs/202604/worker-ai-tool-cost-2026.md`
> 작성일: 2026-04-27
> 구현 기준: Codex가 이 문서만 보고 `/tools/` 계산기 페이지를 바로 구현할 수 있는 수준으로 고정
> 참고 계산기: `ai-stack-cost-calculator`, `ai-automation-hourly-roi`, `ai-subscription-cost`

---

## 1. 문서 개요

### 1-1. 대상

- 구현 대상: `AI 도구 월비용 계산기`
- 설계 문서명: `worker-ai-tool-cost-2026.md`
- 구현 slug: `ai-subscription-cost`
- URL: `/tools/ai-subscription-cost/`
- 콘텐츠 유형: 인터랙티브 계산기 (`/tools/`)
- 카테고리: `AI·생산성`
- 핵심 사용자: 직장인, 개발자, 프리랜서, 1인 창업자, 스타트업 팀

### 1-2. 페이지 정의

ChatGPT, Claude, GitHub Copilot, Perplexity, Notion AI, Midjourney, Gemini, Cursor 같은 AI 도구를 여러 개 구독하는 사용자가 월 구독비, 연간 비용, 팀 단위 비용, 시간 절감 가치, ROI, 중복 구독 여부를 한 번에 점검하는 계산기다.

### 1-3. 구현 원칙

- 가격은 실시간 견적이 아니라 `기본 추천값`이다.
- 모든 도구 가격은 사용자가 직접 수정할 수 있어야 한다.
- 달러 결제 도구가 많으므로 환율 입력값을 핵심 변수로 노출한다.
- 시간 절감 효과는 사용자 입력 기반 추정값이므로 결과 영역에 `추정` 표현을 반복한다.
- 중복 구독 탐지는 해지 권고가 아니라 `점검 경고`로 표현한다.
- 팀 계산은 지원하되 기본 화면은 개인 사용자가 빠르게 이해할 수 있게 둔다.
- URL 공유와 초기값 복원이 가능해야 한다.

---

## 2. 파일 구조

```txt
src/
  data/
    aiSubscriptionCost.ts
  pages/
    tools/
      ai-subscription-cost.astro

public/
  scripts/
    ai-subscription-cost.js
  og/
    tools/
      ai-subscription-cost.png

src/styles/scss/pages/
  _ai-subscription-cost.scss
```

### 2-1. 추가 반영 파일

- `src/data/tools.ts`
- `src/pages/tools/index.astro`
- `src/pages/index.astro`가 별도 노출 매핑을 갖는 경우 함께 확인
- `src/styles/app.scss`
- `public/sitemap.xml`

---

## 3. 레이아웃 및 쉘

### 3-1. 공통 컴포넌트

- `BaseLayout`
- `SimpleToolShell`
- `CalculatorHero`
- `InfoNotice`
- `ToolActionBar`
- `SeoContent`

### 3-2. 권장 설정

```astro
<SimpleToolShell
  calculatorId="ai-subscription-cost"
  pageClass="ai-subscription-page"
  resultFirst={true}
>
```

### 3-3. UX 방향

- 첫 화면에서 `월 총 구독비`, `연간 비용`, `월 순효과`가 바로 보이게 한다.
- 입력 영역은 긴 체크리스트형이므로 그룹을 명확히 나눈다.
- 모바일에서는 결과 요약 → 사용 유형/환율 → 도구 선택 → ROI 입력 순서가 자연스럽다.
- 카드는 8px 이하 radius를 사용하고, 과한 마케팅형 hero보다 실사용 계산기 화면을 우선한다.

---

## 4. 데이터 설계

### 4-1. 타입 정의

```ts
export type SubscriptionMode = "personal" | "team";

export type ToolCategory =
  | "chatbot"
  | "coding"
  | "research"
  | "document"
  | "image"
  | "workspace"
  | "custom";

export type CurrencyCode = "USD" | "KRW";
export type PricingUnit = "account" | "seat" | "custom";

export interface AiSubscriptionTool {
  id: string;
  name: string;
  category: ToolCategory;
  categoryLabel: string;
  defaultMonthlyUsd: number;
  defaultMonthlyKrw?: number;
  currency: CurrencyCode;
  pricingUnit: PricingUnit;
  isEditable: boolean;
  defaultSelected?: boolean;
  note: string;
  officialUrl?: string;
}

export interface DuplicateRule {
  id: string;
  toolIds?: string[];
  categoryIds?: ToolCategory[];
  threshold: number;
  title: string;
  message: string;
  recommendation: string;
}

export interface SubscriptionPreset {
  id: string;
  label: string;
  description: string;
  mode: SubscriptionMode;
  headcount: number;
  selectedToolIds: string[];
  monthlySavedHours: number;
  hourlyValueKrw: number;
}

export interface RoiBand {
  min: number;
  max?: number;
  label: string;
  tone: "danger" | "caution" | "good" | "strong";
  message: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
  description: string;
}
```

### 4-2. 데이터 export

```ts
export const reportMeta = {
  slug: "ai-subscription-cost",
  title: "AI 도구 월비용 계산기",
  description:
    "ChatGPT, Claude, Copilot, Perplexity, Notion AI 등 여러 AI 도구 구독료를 합산하고 월간·연간 비용, ROI, 중복 구독 여부를 계산합니다.",
  defaultExchangeRate: 1400,
};

export const aiTools: AiSubscriptionTool[] = [];
export const duplicateRules: DuplicateRule[] = [];
export const presets: SubscriptionPreset[] = [];
export const roiBands: RoiBand[] = [];
export const faqItems: FaqItem[] = [];
export const relatedLinks: RelatedLink[] = [];
```

### 4-3. 기본 도구 목록

MVP 기본 도구:

| 카테고리 | 도구 | 기본값 기준 |
| --- | --- | --- |
| 범용 AI 챗봇 | ChatGPT Plus | USD 직접 수정 가능 |
| 범용 AI 챗봇 | Claude Pro | USD 직접 수정 가능 |
| 개발 보조 | GitHub Copilot Pro | USD 직접 수정 가능 |
| 리서치 | Perplexity Pro | USD 직접 수정 가능 |
| 문서/업무 | Notion AI | 직접 입력 우선 |
| 이미지 생성 | Midjourney | 직접 입력 우선 |
| 구글 생태계 | Google AI Pro | USD 직접 수정 가능 |
| 개발 IDE | Cursor | 직접 입력 우선 |
| 직접 추가 | 사용자 입력 도구 | KRW 또는 USD 선택 |

주의:

- 실제 구현 전 가격은 공식 페이지에서 다시 확인한다.
- 가격 변동이 잦은 도구는 `note`에 `요금제 변경 가능성이 있어 직접 수정 권장` 문구를 넣는다.
- 부가세, 카드 해외결제 수수료, 환율 차이는 별도 안내한다.

---

## 5. 계산 로직

### 5-1. 월 구독비

```txt
도구별 원화 월비용 =
  USD 도구: 월 USD × 환율 × 좌석 수
  KRW 도구: 월 KRW × 좌석 수

월 총 구독비 = 선택 도구별 원화 월비용 합계
```

팀 모드:

```txt
seat 단위 도구 비용 = 도구 월비용 × 사용 인원 수
account 단위 도구 비용 = 도구 월비용
```

### 5-2. 연간 비용

```txt
연간 비용 = 월 총 구독비 × 12
```

### 5-3. 시간 절감 가치

```txt
월 시간 절감 가치 = 월 절감 시간 × 시간당 가치
```

팀 모드에서는 기본적으로 팀 전체 절감 시간을 입력하게 한다. 개인별 절감 시간을 입력하는 옵션은 v2로 둔다.

### 5-4. 월 순효과

```txt
월 순효과 = 월 시간 절감 가치 - 월 총 구독비
```

### 5-5. ROI 점수

```txt
ROI 점수 = 월 시간 절감 가치 ÷ 월 총 구독비 × 100
```

월 총 구독비가 0원일 때는 ROI를 계산하지 않고 `도구를 선택하면 ROI를 계산합니다`로 표시한다.

### 5-6. ROI 해석

| ROI 점수 | 해석 |
| ---: | --- |
| 300 이상 | 매우 효율적. 구독 유지 가치가 큰 편 |
| 150~299 | 효율적. 핵심 도구 중심 유지 |
| 100~149 | 본전 수준. 중복 도구 점검 필요 |
| 100 미만 | 비용 대비 효과 낮음. 사용 빈도 재검토 |

---

## 6. 결과 메시지 설계

### 6-1. KPI 카드

상단 결과 카드 5개:

- 월 총 구독비
- 연간 환산 비용
- 1인당 월 비용
- 월 시간 절감 가치
- 월 순효과

### 6-2. 결과 문구

개인 개발자 예시:

```txt
현재 AI 도구 구독비는 월 약 7만 원 수준입니다.
월 12시간 이상 업무 시간을 줄이고 있다면 비용 대비 효율은 높은 편입니다.
다만 ChatGPT와 Claude를 모두 사용 중이라면 실제 사용 빈도가 낮은 쪽은 격월 구독을 검토해볼 수 있습니다.
```

콘텐츠 제작자 예시:

```txt
콘텐츠 제작 기준으로는 AI 구독비가 어느 정도 회수되고 있습니다.
리서치 도구와 범용 챗봇의 검색 기능이 겹칠 수 있으므로, 실제 사용 빈도 기준으로 중복 비용을 점검하세요.
```

팀 예시:

```txt
팀 단위 구독은 개인 구독보다 결제 관리와 보안 측면에서 유리할 수 있습니다.
모든 팀원이 같은 도구를 쓰기보다 개발자·기획자·디자이너별로 필요한 도구를 나누면 비용 효율이 좋아질 수 있습니다.
```

---

## 7. 중복 구독 탐지

### 7-1. 탐지 규칙

| 조합 | 판단 | 추천 |
| --- | --- | --- |
| ChatGPT + Claude | 범용 LLM 중복 가능 | 글쓰기·코딩·분석 중 주력 용도 기준으로 선택 |
| ChatGPT + Perplexity | 검색/리서치 일부 중복 | 리서치 빈도가 높으면 유지, 단순 검색이면 축소 |
| Copilot + Cursor | 개발 보조 중복 가능 | IDE 사용 패턴 기준으로 하나를 주력화 |
| Notion AI + ChatGPT | 문서 작성 중복 가능 | Notion DB/문서 자동화가 많으면 Notion AI 유지 |
| Midjourney + 이미지 생성 AI | 이미지 생성 중복 가능 | 고품질 제작 빈도 기준으로 판단 |
| Gemini + ChatGPT | 범용 AI 중복 가능 | Google Workspace 연동이 핵심이면 Gemini 유지 |

### 7-2. UI 표현

- 결과 영역 아래 `중복 구독 점검` 섹션으로 표시한다.
- 위험 표현보다 `점검`, `겹칠 수 있음`, `사용 빈도 확인` 같은 완화된 문구를 사용한다.
- `해지하세요` 같은 단정 표현은 쓰지 않는다.

---

## 8. 추천 결과 유형

### 8-1. 비용 절약형

- 조건: ROI 100 미만 또는 중복 경고 2개 이상
- 메시지: 범용 챗봇 1개 중심으로 통합하고, 리서치·이미지 도구는 필요할 때만 단기 구독하도록 제안

### 8-2. 개발자 생산성형

- 조건: coding 도구 포함, 절감 시간이 높음
- 메시지: Claude 또는 ChatGPT + Copilot 조합을 중심으로 보고, Cursor까지 함께 쓰는 경우 실제 사용 빈도를 확인

### 8-3. 콘텐츠 제작형

- 조건: chatbot + research + image 조합
- 메시지: 글쓰기, 리서치, 이미지 제작 빈도를 기준으로 구독 유지 여부 판단

### 8-4. 팀 운영형

- 조건: team 모드, headcount 2 이상
- 메시지: 팀 플랜, 권한 관리, 결제 통합, 보안 정책을 함께 검토

---

## 9. 페이지 구성

### 9-1. 전체 IA

1. `CalculatorHero`
2. `InfoNotice`
3. 결과 요약 카드
4. 사용 유형/환율/시간 가치 입력
5. AI 도구 체크리스트
6. 직접 추가 도구
7. 중복 구독 점검
8. ROI 해석
9. 직무별 추천 조합
10. 관련 계산기 CTA
11. `SeoContent` + FAQ

### 9-2. Hero

- eyebrow: `AI 구독비 계산`
- title: `AI 도구 월비용 계산기`
- description: `ChatGPT, Claude, Copilot, Perplexity, Notion AI 같은 AI 도구 구독료를 합산하고, 월간·연간 비용과 시간 절감 대비 ROI를 확인합니다.`
- badges: `["AI툴", "구독료", "ROI", "중복점검"]`

### 9-3. InfoNotice

필수 안내:

- 도구 가격은 기본 참고값이며 실제 결제액과 다를 수 있다.
- 달러 결제 도구는 환율, 부가세, 카드 해외결제 수수료에 따라 원화 청구액이 달라진다.
- 시간 절감 효과는 사용자 입력 기반 추정값이다.
- 결과는 구독 유지/해지 판단의 참고용이며 실제 업무 효율은 사용 빈도와 업무 유형에 따라 달라진다.

### 9-4. 입력 영역

기본 입력:

- 사용 유형: 개인 / 팀
- 사용 인원 수
- 환율
- 월 절감 시간
- 시간당 가치

도구 선택:

- 카테고리별 체크박스
- 도구별 월 비용 입력
- 좌석 수 입력은 팀 모드에서만 표시
- 직접 추가 도구 3개까지 지원

### 9-5. CTA

- `/tools/ai-stack-cost-calculator/`  
  `업무 단계별 AI 스택 비용 계산하기`
- `/tools/ai-automation-hourly-roi/`  
  `AI 자동화 ROI 계산하기`
- `/reports/ai-job-salary-impact-2026/`  
  `AI 활용이 직무 가치에 미치는 영향 보기`

---

## 10. JavaScript 설계

### 10-1. 파일

`public/scripts/ai-subscription-cost.js`

### 10-2. 역할

- 상태 관리
- 도구 선택/해제
- 도구별 가격 수정
- 팀 모드 인원 수 반영
- 직접 추가 도구 처리
- 월/연간/ROI 계산
- 중복 구독 탐지
- URL 파라미터 저장/복원
- reset/copy link 처리

### 10-3. DOM id

```txt
ais-data
ais-mode
ais-headcount
ais-exchange-rate
ais-saved-hours
ais-hourly-value
ais-tool-list
ais-custom-tool-list
ais-monthly-cost
ais-yearly-cost
ais-per-person-cost
ais-saved-value
ais-net-effect
ais-roi-score
ais-duplicate-alerts
ais-recommendation
```

### 10-4. URL 파라미터

```txt
/tools/ai-subscription-cost/?mode=personal&fx=1400&tools=chatgpt-plus,claude-pro&hours=12&value=30000
```

허용값:

- `mode`: `personal`, `team`
- `fx`: 800~2500
- `headcount`: 1~100
- `hours`: 0~500
- `value`: 0~300000
- `tools`: 등록된 tool id allowlist

문자열 파라미터는 allowlist로 검증한다.

---

## 11. SCSS 설계

### 11-1. 파일

`src/styles/scss/pages/_ai-subscription-cost.scss`

### 11-2. prefix

기존 설계와 맞춰 페이지 루트는 `.ai-subscription-page`를 사용한다.

주요 클래스:

```scss
.ai-subscription-page {}
.ais-result-grid {}
.ais-input-panel {}
.ais-tool-list {}
.ais-tool-row {}
.ais-duplicate-alert {}
.ais-roi-band {}
.ais-cta-band {}
```

### 11-3. 레이아웃

- 최대 본문 폭: `1120px`
- 결과 KPI는 desktop 5열 또는 3+2열, mobile 1열
- 도구 체크리스트는 desktop 2열, mobile 1열
- 직접 추가 도구 입력은 compact row로 구성
- 버튼/입력 텍스트가 모바일에서 줄 밖으로 넘치지 않게 min-width를 과하게 주지 않는다.

### 11-4. 색상과 상태

- ROI 높음: 긍정 badge
- ROI 본전: caution badge
- ROI 낮음: danger badge
- 중복 구독 점검: warning이 아니라 neutral/caution 톤

---

## 12. SEO 설계

### 12-1. title

`AI 도구 월비용 계산기 | ChatGPT·Claude·Copilot 구독료 합산`

### 12-2. description

`ChatGPT, Claude, GitHub Copilot, Perplexity, Notion AI 등 AI 도구 구독료를 선택하면 월간·연간 비용, 팀 단위 비용, 시간 절감 대비 ROI, 중복 구독 여부를 계산합니다.`

### 12-3. H2 후보

- `AI 도구 구독비, 왜 계산해야 할까?`
- `ChatGPT·Claude·Copilot 월비용 합산`
- `개발자가 많이 쓰는 AI 도구 조합`
- `콘텐츠 제작자가 많이 쓰는 AI 도구 조합`
- `팀 단위 AI 구독비 계산`
- `AI 도구 ROI 계산 공식`
- `AI 구독비를 줄이는 방법`

### 12-4. FAQ

최소 6개:

1. ChatGPT와 Claude를 둘 다 구독할 필요가 있나요?
2. AI 구독비는 비용인가요, 투자일까요?
3. 팀원 모두 같은 AI 도구를 써야 하나요?
4. 달러 결제 AI 도구는 왜 원화 비용이 달라지나요?
5. AI 도구 비용은 세금 처리나 비용 처리에 쓸 수 있나요?
6. AI 도구 ROI는 어떻게 계산하나요?
7. 여러 도구를 번갈아 구독하는 것이 더 저렴한가요?

---

## 13. 등록 체크리스트

- [ ] `src/data/aiSubscriptionCost.ts` 작성
- [ ] `src/pages/tools/ai-subscription-cost.astro` 작성
- [ ] `public/scripts/ai-subscription-cost.js` 작성
- [ ] `src/styles/scss/pages/_ai-subscription-cost.scss` 작성
- [ ] `src/data/tools.ts`에 `ai-subscription-cost` 등록
- [ ] `src/pages/tools/index.astro` 주제 매핑 확인
- [ ] `src/styles/app.scss`에 `@use 'scss/pages/ai-subscription-cost';` 추가
- [ ] `public/sitemap.xml`에 `/tools/ai-subscription-cost/` 추가
- [ ] OG 이미지 `public/og/tools/ai-subscription-cost.png` 생성 또는 fallback 확인
- [ ] `npm run build` 성공 확인

---

## 14. QA 체크리스트

- [ ] 가격을 공식 확정값처럼 단정하지 않는가
- [ ] 모든 도구 가격이 사용자가 직접 수정 가능한가
- [ ] 환율, 부가세, 카드 수수료로 실제 청구액이 달라질 수 있음을 안내하는가
- [ ] 시간 절감 효과와 ROI가 추정값임을 표시하는가
- [ ] 중복 구독 경고가 해지 권고처럼 보이지 않는가
- [ ] 팀 모드에서 seat/account 과금 차이가 계산에 반영되는가
- [ ] URL 파라미터가 allowlist와 범위 검증을 거치는가
- [ ] 모바일 320px에서 도구명과 금액 입력이 넘치지 않는가
- [ ] `NaN`, `Infinity`, 음수 결과가 표시되지 않는가
- [ ] `npm run build`가 통과하는가

---

## 15. 구현 순서

1. `src/data/aiSubscriptionCost.ts`에 도구, 프리셋, 중복 규칙, FAQ 작성
2. `src/pages/tools/ai-subscription-cost.astro`에서 `SimpleToolShell` 기반 마크업 작성
3. 결과 KPI와 입력 폼을 먼저 정적 렌더링
4. `public/scripts/ai-subscription-cost.js`에서 상태 관리와 계산 로직 구현
5. URL 복원, 링크 복사, 초기화 연결
6. `_ai-subscription-cost.scss` 작성 후 `app.scss`에 import
7. 도구 등록, sitemap 등록
8. `npm run build`

---

## 16. 최종 구현 방향

이 계산기는 AI 도구 가격표가 아니라 사용자의 고정비 점검 도구다. 핵심은 `얼마 쓰는지`, `연간 얼마로 커지는지`, `절감 시간 기준으로 본전인지`, `비슷한 도구를 중복 구독하고 있는지`를 빠르게 보여주는 것이다.

가격은 빠르게 바뀔 수 있으므로 기본값은 참고용으로만 제공하고, 사용자가 직접 수정할 수 있게 만드는 것이 가장 중요하다. 결과는 구독 해지 판단을 대신하지 않고, 사용 빈도와 업무 가치 기준으로 비용을 재검토하도록 돕는 방향으로 작성한다.
