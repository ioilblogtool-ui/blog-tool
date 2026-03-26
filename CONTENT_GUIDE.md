# 비교계산소 콘텐츠 가이드

> **대상**: Claude / Codex 등 AI 코딩 어시스턴트가 새 페이지를 작성하거나 기존 페이지를 수정할 때 반드시 참고하는 기준 문서입니다.
> **원칙**: 콘텐츠 본질 충실 → UX·UI 일관성 → 수익화 절제 → SEO 최적화 순으로 우선순위를 둡니다.

---

## 1. 사이트 정체성

| 항목 | 내용 |
|------|------|
| 서비스명 | 비교계산소 |
| 도메인 | bigyocalc.com |
| 언어 | **전체 한국어** (변수명·주석 제외) |
| 타깃 | 연봉·취업·재테크에 관심 있는 2030 직장인 |
| 포지션 | "숫자로 보는 금융·커리어 비교" — 신뢰 가능한 추정치 기반 인터랙티브 콘텐츠 |

---

## 2. 콘텐츠 유형과 페이지 구조

사이트의 모든 페이지는 세 가지 유형 중 하나입니다. 새 페이지를 만들 때 아래 섹션 순서를 기본 골격으로 사용합니다.

### 2-A. 계산기 (Calculator)
경로: `/tools/<slug>/`

```
① CalculatorHero      — 제목 + 한 줄 설명
② InfoNotice          — 데이터 기준 안내 (추정·참고 명시)
③ 입력 영역           — 슬라이더 / 숫자 입력 / 선택
④ 결과 카드 (KpiCard / SummaryCards)
⑤ 상세 비교 (차트 / 표 / 타임라인)
⑥ SeoContent          — 상세 안내 + FAQ + 관련 계산기
```

### 2-B. 비교 리포트 (Report)
경로: `/reports/<slug>/`

```
① CalculatorHero      — 제목 + 리포트 요약 설명
② InfoNotice          — 데이터 출처·기준일 명시
③ KPI 요약 그리드     — 핵심 수치 3~4개 (report-stat-card)
④ 인터랙티브 영역     — 바 차트 / 랭킹 카드 / 필터·정렬
⑤ 인사이트 블록      — 업종별·항목별 분석 (sc-ins-card 등)
⑥ 제휴 마케팅 블록   — 선택적, 1개 (affiliate-box)
⑦ SeoContent          — 상세 안내 + 계산 기준 + FAQ + 관련 계산기
```

### 2-C. 웹 콘텐츠 / 랭킹 페이지 (Content)
경로: `/reports/<slug>/` (리포트 섹션 활용)

```
① CalculatorHero
② InfoNotice
③ KPI 요약
④ 랭킹 카드 목록 (상위 / 하위 분할 가능)
⑤ 비교 테이블 (한눈에 보기)
⑥ 인사이트 / 분석 블록
⑦ 제휴 마케팅 블록   — 선택적, 최대 2개
⑧ SeoContent
```

---

## 3. 공통 컴포넌트 사용 규칙

| 컴포넌트 | 역할 | 필수 여부 |
|---------|------|----------|
| `BaseLayout` | `<head>` SEO, OG 태그 | 필수 |
| `SiteHeader` | 상단 네비게이션 | 필수 |
| `CalculatorHero` | 페이지 타이틀 영역 | 필수 |
| `InfoNotice` | 추정·참고 데이터 고지 | 필수 (데이터 포함 페이지) |
| `SeoContent` | SEO 안내 + FAQ + 관련 링크 | 필수 (모든 페이지 하단) |
| `SummaryCards` / `KpiCard` | 결과 수치 표시 | 계산기 페이지 |

### SeoContent 필수 props

```astro
<SeoContent
  introTitle="페이지 제목 — 읽는 법"
  intro={["2문단 이상의 페이지 설명"]}
  inputPoints={["이 페이지에서 할 수 있는 것 3가지"]}
  criteria={["데이터 기준 4가지 이내"]}
  faq={faqItems}
  related={[
    { href: "/tools/...", label: "관련 계산기명" },
    { href: "/reports/...", label: "관련 리포트명" },
  ]}
/>
```

- FAQ는 데이터 파일(`src/data/`)에 `{ q, a }` 배열로 관리
- `related` 링크는 3~5개, 동일 카테고리 내 연관성 높은 것 우선

---

## 4. 디자인 · UX 원칙

### 4-A. 레이아웃
- **모바일 퍼스트**: 입력 → 요약 결과 → 상세 비교 순으로 스크롤
- 섹션 구분은 `<section class="content-section">` + `section-header section-header--compact`
- eyebrow(소제목) → h2 순서 유지
- 반응형 3단계: 모바일 0~767px / 태블릿 768~1023px / PC 1024px+
- 컨테이너 좌우 패딩: 모바일 16px / 태블릿 24px / PC 최대 1160px
- 카드 패딩: 모바일 16~18px / 태블릿 20px / PC 24px
- 섹션 간격: 모바일 16~20px / 태블릿 20~24px / PC 24~32px

### 4-B. 색상·디자인 토큰
- 모든 색상·간격은 `src/styles/scss/_tokens.scss` 토큰 사용
- 새 색상을 임의로 인라인 스타일로 추가하지 않는다
- 예외: 차트 바 색상처럼 데이터에 묶인 색상은 인라인 허용

### 4-C. 가독성
- 숫자 결과는 크게, 단위(만원·%)는 작게 처리
- 긴 표는 가로 스크롤 래퍼(`overflow-x: auto`) 필수
- 카드 그리드: 모바일 1열 → 태블릿 2열 → 데스크톱 3~4열

### 4-D. 인터랙션
- 계산기 입력은 실시간 반영 (별도 제출 버튼 없음)
- URL 파라미터로 상태 보존 → 공유 가능
- 차트/바 필터·정렬은 클라이언트 JS로 즉시 반응
- 로딩 스피너 불필요 (모든 연산은 동기)

### 4-E. 재미 요소 (Engagement)
아래 중 페이지 성격에 맞는 1~2개를 선택적으로 추가합니다.

| 요소 | 적용 기준 | 예시 |
|------|----------|------|
| 내 위치 확인 | 순위·비교 리포트 | "내 연봉 입력 → 상위 N% 표시" |
| 티어 라벨 | 연봉·성과급 비교 | S / A / B / C 티어 배지 |
| 바 차트 내 내 마커 | 바 차트 비교 | 내 값 위치에 세로선 표시 |
| 애니메이션 진입 | 모든 페이지 | 카드 fade-in (CSS only) |
| 복사·공유 버튼 | 계산기 결과 | ToolActionBar 컴포넌트 |
| 소감 한 줄 | 결과 카드 하단 | "상위 12%입니다 — 평균보다 700만 높습니다" |

**금지**: 팝업, 자동 재생 오디오, 과도한 애니메이션, 클릭 유도 다크 패턴

---

## 5. 데이터·수치 표기 원칙

- 추정치는 반드시 `추정`, `참고`, `약` 표기 → InfoNotice에도 명시
- 공식 발표 수치와 추정치를 같은 카드에 섞을 때는 각각 출처 표기
- 최신 기준일을 데이터 파일 `updatedAt` 필드에 기록
- 기업별 연봉: 잡플래닛·블라인드 집계 + 공개 채용 공고 기반임을 명시
- 퍼센트 반올림: `Math.round()` 사용, 소수점 표시 불필요

---

## 6. 제휴 마케팅 (Affiliate) 규칙

### 6-A. 원칙
- **페이지당 최대 2개** 블록 (리포트 1개, 웹 콘텐츠 최대 2개)
- 계산기 페이지는 **1개 이하** (콘텐츠 밀도가 낮아 어색함)
- 콘텐츠 흐름을 방해하지 않는 위치에 삽입 (인사이트 블록 뒤, SeoContent 앞)

### 6-B. 지원 채널
- **쿠팡파트너스**: 도서, 업무 장비, 생활용품 등
- **여행·숙박**: 익스피디아, 야놀자, 에어비앤비 파트너 링크 (여행 관련 콘텐츠 시)
- 향후 추가 채널은 이 섹션에 업데이트

### 6-C. 마크업 패턴

```astro
<section class="content-section affiliate-section">
  <div class="affiliate-box">                  <!-- 기본 / affiliate-box--alt 교차 사용 -->
    <div class="affiliate-box__header">
      <span class="affiliate-box__icon">📚</span>
      <div>
        <h3 class="affiliate-box__title">추천 도서 타이틀</h3>
        <p class="affiliate-box__context">콘텐츠 연관성 한 줄 설명</p>
      </div>
    </div>
    <div class="affiliate-product-grid">
      {products.map((prod) => (
        <a href={prod.url} class="affiliate-product-card"
           target="_blank" rel="noopener noreferrer nofollow">
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

### 6-D. 제휴 상품 선정 기준
- 콘텐츠 주제와 **직접 관련** (연봉 리포트 → 취업·재테크 도서, 개발자 도구)
- 광고처럼 보이지 않도록 카드 수는 **3~4개** 이내
- `rel="noopener noreferrer nofollow"` 필수

---

## 7. 구글 애드센스

- 자동 광고 적용 완료 (auto ads)
- `<head>`에 애드센스 스크립트 삽입, `public/ads.txt` 등록 완료
- 코드 작성 시 광고 슬롯용 `<div id="ad-*">` 예비 마크업 추가 **불필요** (자동 광고가 위치 결정)
- 제휴 블록과 애드센스 광고가 연속으로 붙지 않도록 간격 확보

---

## 8. SEO 가이드

### 8-A. 메타 태그
- `BaseLayout`의 `title` / `description` prop 반드시 설정
- title 형식: `"페이지 주제 — 비교계산소"` (자동 접미사 없으면 수동 추가)
- description: 120~160자, 핵심 키워드 + 행동 유도 포함

### 8-B. 구조화 데이터
- `BaseLayout`에 JSON-LD 자동 삽입됨 — 별도 구현 불필요
- FAQ 데이터를 SeoContent에 넘기면 FAQ 스키마 자동 적용

### 8-C. URL
- 모두 소문자 케밥케이스: `/tools/salary/`, `/reports/it-salary-top10/`
- 새 페이지 추가 시 `public/sitemap.xml` 동시 업데이트 필수

### 8-D. 헤딩 구조
- h1 → `CalculatorHero`의 title (페이지 당 1개)
- h2 → 각 섹션 제목
- h3 → 카드·항목 내 소제목
- 헤딩 레벨 건너뛰기 금지

### 8-E. 이미지
- OG 이미지: `public/og/<slug>.png` (1200×630)
- alt 텍스트 필수, 장식용 이미지는 `alt=""`

### 8-F. 키워드 전략
- 각 데이터 파일 `meta` 객체에 주요 키워드 포함하여 관리
- 동일 주제 유사 페이지 간에는 `SeoContent.related`로 내부 링크 연결

---

## 9. 데이터 파일 구조 규칙 (`src/data/`)

모든 페이지의 콘텐츠 데이터는 `.astro` 파일이 아닌 `src/data/` 의 `.ts` 파일에 분리합니다.

```ts
// 필수 meta 객체 형태
export const PAGE_META = {
  title: "페이지 제목",
  subtitle: "한 줄 설명 (description에 사용)",
  methodology: "데이터 출처·산정 방식",
  caution: "추정치 사용 시 주의사항",
  updatedAt: "2026년 3월 기준",
};

// FAQ 배열 형태
export const PAGE_FAQ = [
  { q: "질문?", a: "답변." },
];
```

- 데이터와 로직은 분리: 데이터 파일에는 계산 로직 최소화
- 기업명·수치가 많은 데이터는 배열로 관리, 페이지에서 `.map()` 렌더링

---

## 10. 스타일 규칙 (`src/styles/`)

- 새 페이지 스타일: `src/styles/scss/pages/_<slug>.scss` 생성
- `src/styles/app.scss` 하단에 `@use 'scss/pages/<slug>'` 추가
- 기존 공통 클래스 우선 사용, 페이지 전용 클래스는 `sc-` (salary-compare), `it-` (it-top10) 등 페이지 prefix 부여
- `!important` 사용 금지
- 반응형: `@media (min-width: 768px)`, `@media (min-width: 1024px)` 두 브레이크포인트만 사용

---

## 11. 새 페이지 체크리스트

코드 작성 전 확인:

- [ ] 콘텐츠 유형 결정 (계산기 / 비교 리포트 / 웹 콘텐츠)
- [ ] `src/data/<slug>.ts` 데이터 파일 생성 + meta/FAQ 포함
- [ ] `src/data/tools.ts` 또는 `src/data/reports.ts`에 항목 추가
- [ ] `src/pages/tools/<slug>.astro` 또는 `src/pages/reports/<slug>.astro` 생성
- [ ] `src/styles/scss/pages/_<slug>.scss` 생성 + `app.scss` import 추가
- [ ] `public/sitemap.xml`에 URL 추가
- [ ] 제휴 블록: 0~2개 내에서 콘텐츠 연관성 확인
- [ ] SeoContent: introTitle / intro / faq / related 모두 채움
- [ ] InfoNotice: 추정·참고 데이터 고지 포함
- [ ] `npm run build` 성공 확인

---

## 12. 유사 페이지 간 포맷 일관성

동일 주제의 페이지(예: 연봉 관련 계산기들, 신입 초봉 리포트들)는 아래를 통일합니다.

| 항목 | 통일 기준 |
|------|----------|
| KPI 카드 수 | 3~4개 |
| KPI 카드 클래스 | `report-stat-card` / `report-stat-card--primary` (1개) |
| 섹션 헤더 패턴 | eyebrow + h2 (+ 선택적 p) |
| FAQ 개수 | 4~6개 |
| related 링크 수 | 3~5개 |
| 제휴 블록 위치 | 메인 콘텐츠 뒤, SeoContent 앞 |
| 추정치 표기 | `약`, `추정`, `참고` 중 하나 |

---

## 13. 절대 하면 안 되는 것

- 모든 user-facing 텍스트를 영어로 작성 (변수명·주석 제외)
- 추정치를 공식 데이터처럼 표기 (InfoNotice + 카드 내 `추정` 레이블 필수)
- 제휴 블록을 페이지당 3개 이상 삽입
- `!important` CSS 사용
- 계산기에 제출 버튼 추가 (실시간 계산이 원칙)
- `main` 브랜치에 빌드 오류 포함 커밋 (모든 push는 프로덕션 배포)
- SeoContent 없이 페이지 완성 처리
