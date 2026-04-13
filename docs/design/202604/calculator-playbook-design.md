# 계산기 공통 설계 플레이북

> 작성일: 2026-04-13
> 목적: `/tools/` 계산기형 콘텐츠의 설계와 구현 품질을 일정하게 맞추기 위한 공통 기준 문서
> 우선 참고 계산기:
> - `diaper-cost`
> - `formula-cost`
> - `fire-calculator`
> - `baby-growth-percentile-calculator`
> - `dca-investment-calculator`
> - `hyundai-bonus`
> 최근 보정 대상:
> - `pregnancy-birth-cost`
> - `national-pension-calculator`
> - `coin-tax-calculator`

---

## 1. 문서 개요

### 1-1. 왜 필요한가

현재 `/reports/` 리포트형 콘텐츠는 구조가 많이 정리되었지만, `/tools/` 계산기형 콘텐츠는 아래 문제가 반복된다.

- 계산기마다 페이지 성격이 다르게 잡혀 결과적으로 완성형이 들쭉날쭉해진다.
- 어떤 페이지는 계산기인데 리포트처럼 무거워지고, 어떤 페이지는 필요한 해석이 빠져 너무 얇아진다.
- 설계 문서마다 입력 구조, KPI 수, 차트 사용 여부, 이어보기/참고 링크 위치가 달라진다.
- 구현 단계에서 `.astro`, `data`, `js`, `scss` 역할 분리가 약해지면 후반 수정 비용이 커진다.

이 문서는 계산기를 새로 만들 때 먼저 "무슨 타입의 계산기인지"를 결정하고, 그 타입에 맞는 공통 구조로 설계와 구현을 고정하기 위한 기준이다.

### 1-2. 핵심 원칙

- 계산기는 먼저 "타입"을 정하고 시작한다.
- 계산기 본문 1섹션은 항상 `핵심 결과`다.
- 계산기 하단은 항상 `이어보기`와 `외부 참고 링크`를 둔다.
- `SimpleToolShell` 기반 구조를 기본값으로 사용한다.
- 데이터 계약을 먼저 설계하고, `.astro`는 조립 역할에 집중한다.
- 차트, 비교표, 제휴 영역은 "타입에 맞을 때만" 넣는다.

---

## 2. 계산기 타입 분류

모든 계산기는 아래 4개 타입 중 하나로 분류한 뒤 설계를 시작한다.

### 2-1. Type A. Simple Calculator

적합 예시:

- `coin-tax-calculator`
- `national-pension-calculator`
- 급여/세금/단일 결과형 계산기

목적:

- 입력값 몇 개로 핵심 결과를 빠르게 보여주는 계산기
- 사용자는 상세 이론보다 "지금 얼마인지"를 먼저 알고 싶다

권장 구조:

1. Hero
2. 입력 패널
3. 핵심 결과 KPI 4~6개
4. 상세 계산표 1개
5. 해석/주의사항
6. 이어보기
7. 외부 참고 링크
8. SEO

금지 경향:

- 차트를 여러 개 넣지 않는다
- 표가 2개 이상으로 늘어나지 않게 한다
- 리포트처럼 긴 비교 섹션을 넣지 않는다

### 2-2. Type B. Compare Calculator

적합 예시:

- `diaper-cost`
- `formula-cost`
- 브랜드/상품/조건 비교형 계산기

목적:

- 같은 조건으로 여러 대상을 비교하는 계산기
- 사용자는 차이와 순위를 한눈에 보고 싶다

권장 구조:

1. Hero
2. 입력/필터
3. 핵심 KPI
4. 비교표
5. 추세 차트 또는 월별 흐름
6. 계산 기준
7. 안내
8. 이어보기
9. 외부 참고 링크
10. 필요 시 제휴

핵심 특징:

- 비교표가 반드시 있어야 한다
- 차트는 "비교 흐름"을 보조하는 역할이어야 한다
- KPI는 최저/최고/차액 같은 비교형 문구가 어울린다

### 2-3. Type C. Guided Calculator

적합 예시:

- `baby-growth-percentile-calculator`
- `pregnancy-birth-cost`
- 결과 숫자만으로 끝나지 않고 해석 가이드를 같이 제공해야 하는 계산기

목적:

- 계산 결과를 바로 행동이나 해석으로 연결해주는 계산기
- 사용자는 숫자보다 "이걸 어떻게 읽어야 하는지"가 중요하다

권장 구조:

1. Hero
2. 입력 패널
3. 핵심 결과
4. 가이드 카드 2~4개
5. 보조 차트 또는 단계별 해석
6. 안내
7. 이어보기
8. 외부 참고 링크
9. SEO

핵심 특징:

- 해석 카드가 중요하다
- 결과를 읽는 문장이 있어야 한다
- 차트가 있더라도 계산기보다 가이드가 중심이어야 한다

### 2-4. Type D. Simulator

적합 예시:

- `fire-calculator`
- `dca-investment-calculator`
- `hyundai-bonus`

목적:

- 입력 가정에 따라 여러 결과, 비교, 시나리오를 동시에 보여주는 고밀도 계산기
- 사용자는 숫자 하나보다 "전략 비교"를 보고 싶다

권장 구조:

1. Hero
2. 입력 패널
3. 결과 우선 KPI
4. 메인 차트
5. 보조 차트 또는 비교표
6. 시나리오 비교
7. 인사이트 카드
8. 안내
9. 이어보기
10. 외부 참고 링크
11. 필요 시 제휴
12. SEO

주의사항:

- 이 타입은 강력하지만 남용하면 계산기가 너무 무거워진다
- 단순 계산에도 이 패턴을 적용하지 않는다

---

## 3. 기준 계산기

### 3-1. 가장 좋은 기본형

- `diaper-cost`
- `formula-cost`

이유:

- 입력 → KPI → 비교표 → 흐름 차트 → 기준 → 안내 → 이어보기 → 참고 링크 흐름이 안정적이다.
- 정보량이 충분하지만 과하지 않다.
- 계산기형 콘텐츠의 기본 템플릿으로 가장 적합하다.

### 3-2. 가장 좋은 가이드형

- `baby-growth-percentile-calculator`

이유:

- 계산 결과와 해석 콘텐츠가 자연스럽게 연결된다.
- "숫자"와 "다음 행동"이 같이 보인다.
- Guided Calculator 기준으로 가장 참고하기 좋다.

### 3-3. 가장 좋은 고급형

- `fire-calculator`

이유:

- 고밀도 입력, 결과, 차트, 시나리오가 잘 정리되어 있다.
- Simulator 타입 설계 기준으로 활용하기 좋다.

### 3-4. 예외형으로 유지할 계산기

- `hyundai-bonus`

이유:

- 계산기이지만 캠페인형 랜딩 성격이 강하다.
- 일반 계산기 템플릿보다는 특정 주제형 시뮬레이터로 보는 편이 맞다.

### 3-5. 무거운 기준작

- `dca-investment-calculator`

이유:

- 정보량과 구조는 좋지만 기본 템플릿으로 삼기엔 무겁다.
- Simulator 상한선 참고용으로 쓰는 것이 적절하다.

---

## 4. 공통 페이지 구조

모든 계산기는 아래 공통 블록을 가능한 한 유지한다.

### 4-1. 공통 상단

```astro
<BaseLayout>
  <SiteHeader />
  <SimpleToolShell calculatorId="..." pageClass="..." resultFirst={...}>
    <Fragment slot="hero">
      <CalculatorHero ... />
      <InfoNotice ... /> <!-- 필요 시 -->
    </Fragment>

    <Fragment slot="actions">
      <ToolActionBar resetId="..." copyId="..." />
    </Fragment>

    <Fragment slot="aside">
      <!-- 입력 패널 -->
    </Fragment>
```

### 4-2. 공통 본문 순서

최소 공통 순서는 아래와 같다.

1. 핵심 결과
2. 보조 결과 또는 상세 표
3. 타입별 메인 콘텐츠
4. 안내
5. 이어보기
6. 외부 참고 링크
7. SEO

### 4-3. 공통 하단 고정 규칙

모든 계산기는 하단에 아래 2개를 기본 탑재한다.

- `계산기 이어보기`
- `외부 참고 링크`

이 둘은 선택사항이 아니라 기본 규칙으로 본다.

---

## 5. 데이터 설계 규칙

계산기 품질은 `data/*.ts` 설계에서 많이 결정된다. 새 계산기는 아래 export를 먼저 만든다.

### 5-1. 필수 export

```ts
export const PAGE_META
export const DEFAULT_INPUT
export const PRESETS
export const FAQ
export const NEXT_CONTENT
export const EXTERNAL_LINKS
export const RELATED_LINKS
```

필요한 경우 추가:

```ts
export const RULES
export const CHART_GUIDES
export const SCENARIO_PRESETS
export const COMPARISON_ROWS
export const AFFILIATE_PRODUCTS
```

### 5-2. 역할 분리 규칙

- `data/*.ts`
  - 텍스트, 숫자 규칙, 프리셋, FAQ, 링크, 카드 데이터
- `pages/tools/*.astro`
  - 페이지 조립, 섹션 순서, 컴포넌트 배치
- `public/scripts/*.js`
  - 계산 로직, DOM 바인딩, URL sync, 차트
- `src/styles/scss/pages/*.scss`
  - 페이지 전용 스타일

### 5-3. 안 좋은 패턴

- 문구를 `.astro`에 과도하게 하드코딩
- FAQ/참고 링크/이어보기를 페이지 하단에서 즉흥 추가
- 계산 규칙 상수를 `js` 파일 곳곳에 흩뿌림

---

## 6. 섹션별 설계 규칙

### 6-1. Hero

반드시 답해야 할 질문:

- 이 계산기는 무엇을 계산하나
- 사용자는 무엇을 얻나
- 한 문장으로 어떤 상황에 쓰는가

권장 구성:

- eyebrow: 카테고리
- title: 사용자가 검색하는 핵심 키워드
- description: 입력값과 결과를 짧게 연결

### 6-2. 입력 패널

원칙:

- 입력은 2~3개 패널로 끊는다
- 하나의 패널에는 하나의 의미만 담는다
- 빠른 프리셋이 있으면 초반 이탈이 줄어든다

입력 패널 이름 예시:

- 기본 입력
- 조건 설정
- 비교 대상 선택
- 가정 옵션

### 6-3. 핵심 결과 KPI

규칙:

- 가장 중요한 숫자를 첫 카드에 둔다
- KPI는 보통 4~6개로 제한한다
- 7개 이상이면 Simulator인지 다시 점검한다

권장 문장:

- `핵심 결과`
- `결과 먼저 보기`
- `현재 기준 요약`

### 6-4. 상세 표

권장:

- Simple Calculator: 표 1개
- Compare Calculator: 비교표 1개 + 필요 시 차트
- Simulator: 표 1~2개 가능

금지:

- 의미가 겹치는 표를 여러 개 연달아 배치

### 6-5. 차트

차트는 아래 조건을 만족할 때만 쓴다.

- 숫자만으로 흐름 이해가 어려울 때
- 비교 대상이 3개 이상일 때
- 시간축 변화가 중요할 때

차트 비권장:

- 단순 세금 계산
- 단일 수치 결과형
- 이미 KPI와 표로 충분한 페이지

### 6-6. InfoNotice

위치:

- 본문 후반 고정

역할:

- 계산기 한계
- 참고용 성격
- 데이터 기준일
- 법/제도 변경 가능성

### 6-7. 이어보기

규칙:

- 메인 CTA 1개 + 서브 카드 2~3개가 가장 안정적
- 같은 카테고리 계산기와 연결한다
- 주제 확장용 리포트 1개 정도는 허용한다

권장 패턴:

- Type A/B/C: 메인 1 + 서브 2~3
- Type D: 메인 1 + 서브 3

### 6-8. 외부 참고 링크

규칙:

- 공공기관, 공식 문서, 협회, 법령 원문 위주
- 2~4개가 적당하다
- 출처, 제목, 설명이 같이 보여야 한다

링크 객체 권장 구조:

```ts
{
  href: "...",
  source: "국세청",
  title: "가상자산소득 과세 개요",
  desc: "과세 시기와 기본공제 기준 확인"
}
```

---

## 7. 구현 규칙

### 7-1. 공통 컴포넌트

우선 재사용:

- `BaseLayout`
- `SiteHeader`
- `CalculatorHero`
- `InfoNotice`
- `ToolActionBar`
- `SimpleToolShell`
- `SeoContent`

### 7-2. resultFirst 사용 기준

`resultFirst={true}` 권장:

- Simple Calculator
- Guided Calculator
- Simulator

`resultFirst={false}` 가능:

- 사용자가 먼저 비교 대상을 많이 선택해야 하는 Compare Calculator

### 7-3. JS 규칙

모든 계산기는 가능하면 아래 흐름을 따른다.

```js
restoreFromUrl();
bindEvents();
runCalculation();
```

핵심 함수 이름도 가급적 통일한다.

- `readForm()`
- `calculate()`
- `updateUI()`
- `applyPreset()`
- `syncUrlParams()`
- `restoreFromUrl()`
- `copyShareLink()`

### 7-4. URL 공유

원칙:

- 입력 상태는 URL로 복원 가능하게 한다
- 복원 불가능한 계산기는 완성도가 낮아 보이기 쉽다

예외:

- 입력 구조가 지나치게 복잡한 대형 시뮬레이터는 핵심 값만 URL에 넣는다

### 7-5. SCSS 규칙

- 페이지별 prefix를 고정한다
- 새 계산기마다 전혀 다른 디자인 언어를 만들지 않는다
- 섹션 간격, 카드 톤, 링크 카드 톤은 최대한 기존 패턴 재사용

예시:

- `dc-` diaper-cost
- `fc-` formula-cost
- `bg-` baby-growth
- `ctc-` coin-tax
- `npc-` national-pension

---

## 8. 설계 문서 작성 규칙

새 계산기 설계 문서는 아래 순서를 따른다.

1. 문서 개요
2. 타입 정의
3. 사용자 질문 한 줄 요약
4. 권장 slug / URL / 파일 구조
5. 데이터 설계
6. 계산 로직
7. 페이지 구조
8. JS 인터랙션
9. SCSS 규칙
10. 등록 작업
11. SEO
12. QA 체크리스트

### 8-1. 설계 문서에 반드시 써야 할 것

- 이 계산기는 Type A/B/C/D 중 무엇인지
- 결과보다 입력이 먼저인지, 결과가 먼저인지
- KPI 개수
- 차트가 필요한 이유
- 이어보기와 참고 링크 대상

### 8-2. 설계 문서에서 피해야 할 것

- "필요하면 차트 추가" 같은 모호한 표현
- 결과 카드 수 미정
- 링크/FAQ/하단 구성 생략
- 데이터 파일 export 정의 생략

---

## 9. 최근 아쉬웠던 계산기 보정 기준

### 9-0. 플레이북 기준 최종 타입 재지정

아래 3개 계산기는 앞으로 설계와 구현에서 다음 타입으로 고정한다.

| 계산기 | 최종 타입 | 이유 |
|---|---|---|
| `pregnancy-birth-cost` | Type C. Guided Calculator | 비용 계산 자체보다 단계별 해석, 준비 가이드, 다음 행동 연결이 중요하다. |
| `national-pension-calculator` | Type A. Simple Calculator | 사용자는 공식 조회 대체가 아니라 빠른 예상 수령액과 수급 시나리오를 먼저 알고 싶다. |
| `coin-tax-calculator` | Type A. Simple Calculator | 핵심은 세후 금액과 예상 세금의 빠른 확인이며, 과도한 시뮬레이터 확장은 중심을 흐리기 쉽다. |

### 9-1. `pregnancy-birth-cost`

권장 타입:

- Type C. Guided Calculator

보정 포인트:

- 비용 계산 자체보다 "단계별 해석"이 중심이 되어야 한다
- 핵심 결과 후에 출산 단계별 가이드 블록이 더 명확해야 한다
- 이어보기는 육아 비용/성장 계산기로 자연스럽게 연결

### 9-2. `national-pension-calculator`

권장 타입:

- Type A. Simple Calculator

보정 포인트:

- 결과를 지나치게 늘리지 말고 핵심 수령액 중심으로 정리
- 상세 계산 근거는 표 하나로 충분
- 참고 링크는 국민연금공단, 제도 안내, 예상연금 공식 페이지 중심

### 9-3. `coin-tax-calculator`

권장 타입:

- Type A. Simple Calculator

보정 포인트:

- 계산 결과 중심을 더 선명하게 유지
- 차트나 과한 비교 콘텐츠로 커지지 않게 제한
- 세율/공제/주의사항/법령 링크를 단순하고 강하게 정리

---

## 10. 새 계산기 만들 때 체크 순서

새 계산기를 만들 때는 아래 순서를 그대로 따른다.

1. 계산기 타입을 먼저 정한다.
2. 사용자 질문을 한 줄로 요약한다.
3. 공통 구조에서 어떤 섹션이 필요한지 확정한다.
4. `data/*.ts` 필수 export를 먼저 정의한다.
5. `.astro`는 섹션 조립만 한다.
6. `js`는 계산/DOM/URL 로직만 맡긴다.
7. 하단 `이어보기`, `외부 참고 링크`를 마지막이 아니라 설계 초반에 정한다.
8. 빌드 전 KPI 개수, 표 개수, 차트 개수를 다시 줄일 수 있는지 점검한다.

---

## 11. 최종 기준 요약

- 계산기는 먼저 "타입"을 정해야 한다.
- 기본형 기준작은 `diaper-cost`, `formula-cost`다.
- 가이드형 기준작은 `baby-growth-percentile-calculator`다.
- 시뮬레이터 기준작은 `fire-calculator`다.
- `hyundai-bonus`와 `dca-investment-calculator`는 예외적 고밀도 타입으로 본다.
- 최근 아쉬운 계산기들은 완성도가 낮다기보다 타입과 공통 구조가 흐려진 경우가 많다.
- 앞으로는 개별 계산기 설계 전에 이 문서를 먼저 보고 타입을 확정한 뒤 설계 문서를 작성한다.

---

## 12. 후속 작업 제안

이 문서 이후 바로 할 만한 작업은 아래 3가지다.

1. `pregnancy-birth-cost`, `national-pension-calculator`, `coin-tax-calculator`를 이 플레이북 기준으로 타입 재지정
2. 계산기 설계 문서 템플릿 초안 생성
3. `Simple`, `Compare`, `Guided`, `Simulator`별 공통 SCSS/마크업 패턴 정리
