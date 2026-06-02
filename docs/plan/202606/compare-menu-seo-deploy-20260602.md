# 비교 메뉴 SEO 강화 및 배포 계획

> 작성일: 2026-06-02  
> 대상: `/compare/`, `/compare/bonus/`, `/compare/welfare/`  
> 목표: 비교 메뉴를 검색 유입과 내부 이동의 중심 허브로 강화한 뒤 배포 전 SEO 상태를 검증한다.

---

## 1. 오늘의 목표

오늘 작업은 새 주제를 늘리기보다 이미 만든 비교 메뉴를 더 잘 노출되게 다듬는 데 집중한다.

핵심 목표는 세 가지다.

1. `/compare/`를 비교표 전체 허브로 더 명확하게 만든다.
2. `/compare/welfare/`를 상황별 지원금 계산기로 더 빠르게 이어지게 만든다.
3. 구글과 네이버가 비교 메뉴의 구조를 이해하도록 메타, sitemap, 구조화데이터, 내부 링크를 점검한다.

---

## 2. 현재 상태 요약

### 2-1. 이미 좋은 점

- `BaseLayout.astro`에 기본 SEO 태그가 들어가 있다.
  - `title`
  - `description`
  - `canonical`
  - `robots index,follow`
  - OG/Twitter 태그
  - 기본 `WebSite` JSON-LD
- 네이버 사이트 인증 메타가 있다.
- `public/robots.txt`에서 sitemap을 안내한다.
- `public/sitemap.xml`에 아래 비교 페이지가 등록되어 있다.
  - `/compare/`
  - `/compare/bonus/`
  - `/compare/welfare/`
- `SiteHeader.astro`, 홈, 계산기 목록, 리포트 목록에서 비교표 링크가 이미 노출된다.
- 비교 페이지 3개 모두 상세 안내, 기준 설명, FAQ, 관련 링크 영역을 가지고 있다.

### 2-2. 배포 전 보강할 점

- 비교 페이지별 JSON-LD가 부족하다.
  - `CollectionPage`
  - `ItemList`
  - `FAQPage`
  - `BreadcrumbList`
- `/compare/welfare/`는 상황별 CTA가 `/compare/bonus/#company`만큼 촘촘하지 않다.
- `/compare/` 첫 화면에서 "어디로 가야 하는지"를 더 강하게 안내할 수 있다.
- 오늘 수정한 비교 페이지는 sitemap `lastmod`를 `2026-06-02`로 갱신하는 편이 좋다.
- 배포 전 빌드 산출물에서 실제 HTML 메타와 JSON-LD를 확인해야 한다.

---

## 3. 오늘 작업 순서

### 1단계. 비교 페이지 SEO 현황 점검

대상 파일:

- `src/pages/compare/index.astro`
- `src/pages/compare/bonus/index.astro`
- `src/pages/compare/welfare/index.astro`
- `src/layouts/BaseLayout.astro`
- `public/sitemap.xml`
- `public/robots.txt`

확인 항목:

- title에 핵심 검색어가 들어가 있는가
- description이 검색 의도와 클릭 유도에 맞는가
- canonical이 정상 생성되는가
- sitemap에 URL이 있는가
- FAQ가 화면에는 있는가
- 구조화데이터가 충분한가

완료 기준:

- 개선할 항목을 작업 목록으로 확정한다.

---

### 2단계. `/compare/` 메인 허브 강화

목표:

- 사용자가 `/compare/`에 들어왔을 때 `성과급 비교표`와 `지원제도 비교표` 중 어디로 가야 할지 바로 판단하게 만든다.

작업 후보:

- 첫 화면 CTA 문구 강화
- "많이 찾는 비교" 섹션의 검색 의도 정리
- 성과급, 세후 성과급, 청년지원금, 출산지원금, 복지급여를 빠른 이동 카드로 정리
- `/tools/`와 `/reports/`로 흩어진 콘텐츠를 비교 기준으로 다시 묶기

완료 기준:

- `/compare/`에서 주요 비교 페이지와 핵심 계산기로 1클릭 이동 가능
- 모바일에서 카드와 CTA가 과밀하지 않음

---

### 3단계. `/compare/welfare/` 상황별 CTA 강화

목표:

- 지원제도 비교표를 단순 목록이 아니라 "내 상황에 맞는 계산기 선택 화면"으로 만든다.

상황별 연결:

| 상황 | 주요 CTA | 연결 후보 |
| --- | --- | --- |
| 청년 | 만기 수령액 계산 | `/tools/youth-savings-maturity-calculator/` |
| 청년 | 청년 적금 비교 리포트 | `/reports/youth-savings-comparison-2026/` |
| 출산 | 출산지원금 계산 | `/tools/birth-support-total/` |
| 육아 | 육아휴직 급여 계산 | `/tools/parental-leave-pay/` |
| 복지 | 복지급여 자격 확인 | `/tools/welfare-benefit-eligibility/` |
| 주거 | 청약/주거자금 계산 | `/tools/apt-cheonyak-gajum-calculator/`, `/tools/home-purchase-fund/` |

완료 기준:

- 청년, 출산·육아, 복지, 주거 섹션에서 다음 행동이 명확함
- `/compare/bonus/#company`와 비슷한 수준의 전환 동선 확보

---

### 4단계. 비교 페이지 구조화데이터 추가

목표:

- 검색엔진이 비교 페이지의 성격과 내부 항목을 더 잘 이해하게 만든다.

추가 후보:

- `/compare/`
  - `CollectionPage`
  - `ItemList`
  - `FAQPage`
  - `BreadcrumbList`
- `/compare/bonus/`
  - `CollectionPage`
  - `ItemList`
  - `FAQPage`
  - `BreadcrumbList`
- `/compare/welfare/`
  - `CollectionPage`
  - `ItemList`
  - `FAQPage`
  - `BreadcrumbList`

구현 방식:

- 각 페이지 frontmatter에서 `jsonLd` 객체를 만들고 `BaseLayout`의 `jsonLd` prop으로 전달한다.
- FAQ 구조화데이터는 기존 FAQ 배열을 재사용한다.
- ItemList는 기존 데이터 배열을 재사용한다.

완료 기준:

- 빌드된 HTML에 각 페이지별 JSON-LD가 포함됨
- 화면 텍스트와 구조화데이터 내용이 서로 충돌하지 않음

---

### 5단계. sitemap 및 내부 링크 점검

목표:

- 배포 후 구글/네이버가 새 비교 메뉴를 빠르게 재수집할 수 있게 한다.

작업:

- `public/sitemap.xml`에서 비교 페이지 `lastmod`를 `2026-06-02`로 갱신
- `/compare/`, `/compare/bonus/`, `/compare/welfare/` URL 중복 여부 확인
- `SiteHeader.astro` 비교표 메뉴 문구 확인
- 홈 비교표 섹션 링크 확인
- `/tools/index.astro`, `/reports/index.astro` 비교 CTA 확인

완료 기준:

- sitemap에 비교 페이지 3개가 한 번씩 등록됨
- 헤더, 홈, tools, reports에서 비교 허브로 이동 가능

---

### 6단계. 배포 전 검증

필수 명령:

```bash
npm run build
```

확인할 산출물:

- `dist/compare/index.html`
- `dist/compare/bonus/index.html`
- `dist/compare/welfare/index.html`

검증 항목:

- title
- meta description
- canonical
- OG title/description/url
- JSON-LD
- FAQ 본문
- 핵심 내부 링크

브라우저 확인:

- `/compare/`
- `/compare/bonus/`
- `/compare/welfare/`
- 모바일 폭에서 CTA 줄바꿈과 가로 스크롤 여부 확인

완료 기준:

- `npm run build` 성공
- 비교 페이지 3개 산출물 존재
- 배포 전 치명 SEO 누락 없음

---

## 4. 오늘 추천 진행 단위

한 번에 전부 고치기보다 아래 순서로 끊어 진행한다.

1. SEO 현황 점검 결과 확정
2. `/compare/` 메인 허브 강화
3. `/compare/welfare/` CTA 강화
4. 구조화데이터 추가
5. sitemap 갱신
6. 빌드 및 브라우저 검증

---

## 5. 배포 판단 기준

배포 가능:

- `npm run build` 성공
- 비교 페이지 3개가 sitemap에 있음
- canonical과 description이 정상
- FAQ와 관련 링크가 화면에 있음
- 주요 CTA가 모바일에서 깨지지 않음

배포 보류:

- 빌드 실패
- 비교 페이지 canonical 누락
- sitemap 누락 또는 잘못된 URL
- 모바일에서 CTA/카드가 겹침
- 추정값이 공식 데이터처럼 보이는 문구 발견

---

## 6. 1단계 점검 결과

점검일: 2026-06-02

### 6-1. 확인한 파일

- `src/layouts/BaseLayout.astro`
- `src/pages/compare/index.astro`
- `src/pages/compare/bonus/index.astro`
- `src/pages/compare/welfare/index.astro`
- `src/data/compareHub.ts`
- `src/data/compareBonus.ts`
- `src/data/compareWelfare.ts`
- `public/sitemap.xml`
- `public/robots.txt`

### 6-2. 통과 항목

- `BaseLayout.astro`에 기본 SEO 태그가 있다.
  - meta description
  - robots `index,follow`
  - canonical
  - OG title, description, url, image
  - Twitter card
  - 네이버 사이트 인증 메타
  - 기본 `WebSite` JSON-LD
- `/compare/`, `/compare/bonus/`, `/compare/welfare/` 모두 개별 title과 description이 있다.
- 비교 페이지 3개 모두 `SeoContent`를 사용한다.
- FAQ 데이터가 존재한다.
  - `/compare/`: 3개
  - `/compare/bonus/`: 5개
  - `/compare/welfare/`: 5개
- `public/robots.txt`에 sitemap이 연결되어 있다.
- `public/sitemap.xml`에 비교 페이지 3개가 등록되어 있다.
  - `https://bigyocalc.com/compare/`
  - `https://bigyocalc.com/compare/bonus/`
  - `https://bigyocalc.com/compare/welfare/`

### 6-3. 보강 필요 항목

- 비교 페이지 3개에 `jsonLd` prop 전달이 없다.
- 화면에 FAQ는 있지만 `FAQPage` 구조화데이터가 없다.
- 비교 허브 성격을 설명하는 `CollectionPage` 또는 `ItemList` 구조화데이터가 없다.
- breadcrumb 구조화데이터가 없다.
- sitemap의 비교 페이지 `lastmod`는 `2026-06-01` 기준이므로 오늘 배포 변경 후 `2026-06-02`로 갱신하는 것이 좋다.

### 6-4. 1단계 결론

기본 SEO 상태는 배포 가능한 수준이다. 다만 오늘 비교 메뉴를 더 강화해 배포할 예정이라면 검색엔진 이해도를 높이는 작업은 `구조화데이터 추가`와 `sitemap lastmod 갱신`이 핵심이다.

다음 작업은 `/compare/` 메인 허브 강화로 진행한다.

---

## 7. 2단계 진행 기록

진행일: 2026-06-02

대상 파일:

- `src/pages/compare/index.astro`
- `src/styles/scss/pages/_compare-hub.scss`

반영 내용:

- `/compare/` 상단 안내 아래에 `빠른 선택` 섹션을 추가했다.
- 빠른 선택 카드 3개를 구성했다.
  - 성과급: `/compare/bonus/`, `/tools/bonus-after-tax-calculator/`
  - 지원금: `/compare/welfare/`, `/tools/welfare-benefit-eligibility/`
  - 집·대출: `#realEstate`, `/tools/jeonse-vs-wolse-calculator/`
- `많이 찾는 비교` 카드에 보조 CTA를 추가했다.
  - 성과급 허브
  - 지원금 허브
  - 세후 계산
  - 만기 계산
  - 주거 비교
  - 투자 비교
  - 연봉 비교
- 모바일에서 빠른 선택 카드와 카드 내부 버튼이 한 줄 폭으로 접히도록 스타일을 보강했다.

검증 예정:

- `npm run build`
- `/compare/` 산출물에서 빠른 선택 카드와 보조 CTA 링크 확인

---

## 8. 3단계 진행 기록

진행일: 2026-06-02

대상 파일:

- `src/pages/compare/welfare/index.astro`
- `src/styles/scss/pages/_compare-welfare.scss`

반영 내용:

- `/compare/welfare/` 상단에 `상황별 선택` 섹션을 추가했다.
- 상황별 카드 4개를 구성했다.
  - 청년: 청년 적금 만기 수령액 계산, 청년 적금 제도 비교
  - 출산·육아: 출산지원금 계산, 육아휴직 급여 계산
  - 복지: 복지급여 자격 확인, 정부 지원금 리포트
  - 주거: 집 마련 자금, 청약 가점
- 주요 섹션별 보조 액션 바를 추가했다.
  - 청년 지원금 섹션
  - 출산·육아 지원금 섹션
  - 복지급여 섹션
  - 주거·정책금융 섹션
- 모바일에서 상황별 카드와 액션 버튼이 한 줄 폭으로 접히도록 스타일을 보강했다.

검증 예정:

- `npm run build`
- `/compare/welfare/` 산출물에서 상황별 선택 카드와 섹션 액션 링크 확인

---

## 9. 4단계 진행 기록

진행일: 2026-06-02

대상 파일:

- `src/pages/compare/index.astro`
- `src/pages/compare/bonus/index.astro`
- `src/pages/compare/welfare/index.astro`

반영 내용:

- 비교 메뉴 3개 페이지에 페이지별 `jsonLd` 객체를 추가했다.
- 각 페이지 `BaseLayout`에 `jsonLd` prop을 전달하도록 연결했다.
- `/compare/`에는 아래 구조화 데이터를 추가했다.
  - `CollectionPage`
  - `BreadcrumbList`
  - `ItemList`
  - `FAQPage`
- `/compare/bonus/`에는 성과급 계산기와 리포트 목록 기반 구조화 데이터를 추가했다.
  - 회사별 성과급 계산기
  - 업종별 성과급 비교
  - 성과급 관련 리포트
- `/compare/welfare/`에는 지원금 계산기와 리포트 목록 기반 구조화 데이터를 추가했다.
  - 청년 지원금
  - 출산·육아 지원금
  - 복지급여
  - 주거지원
- `ItemList`는 화면에서 쓰는 기존 데이터 배열을 재사용해 실제 노출 링크와 JSON-LD 링크가 따로 관리되지 않도록 했다.
- `FAQPage`는 기존 FAQ 배열을 재사용해 화면 FAQ와 구조화 데이터가 같은 내용을 바라보도록 했다.

검증:

- `npm run build` 성공
- `dist/compare/index.html`에서 `CollectionPage`, `BreadcrumbList`, `ItemList`, `FAQPage` 확인
- `dist/compare/bonus/index.html`에서 `CollectionPage`, `BreadcrumbList`, `ItemList`, `FAQPage` 확인
- `dist/compare/welfare/index.html`에서 `CollectionPage`, `BreadcrumbList`, `ItemList`, `FAQPage` 확인

추가 확인:

- 빌드 중 `src/pages/tools/stock-brokerage-fee-calculator.astro`에서 오래된 컴포넌트 prop 사용으로 실패하던 부분을 현재 `InfoNotice`, `SeoContent` 규격에 맞게 정리했다.

---

## 10. 5단계 진행 기록

진행일: 2026-06-02

대상:

- `public/sitemap.xml`
- `dist/sitemap.xml`
- `src/components/SiteHeader.astro`
- `src/pages/index.astro`
- `src/pages/tools/index.astro`
- `src/pages/reports/index.astro`

반영 내용:

- `public/sitemap.xml`에서 비교 메뉴 3개 URL의 `lastmod`를 `2026-06-02`로 갱신했다.
  - `https://bigyocalc.com/compare/`
  - `https://bigyocalc.com/compare/bonus/`
  - `https://bigyocalc.com/compare/welfare/`
- 헤더 데스크톱 드롭다운에서 비교 메뉴 3개 URL이 노출되는 것을 확인했다.
- 헤더 모바일 메뉴에서 비교 메뉴 3개 URL이 노출되는 것을 확인했다.
- 홈 화면의 비교표 섹션에서 `/compare/bonus/`, `/compare/welfare/`로 이어지는 것을 확인했다.
- `/tools/` 목록 상단 CTA에서 비교 메뉴 3개 URL로 이어지는 것을 확인했다.
- `/reports/` 목록 상단 CTA에서 비교 메뉴 3개 URL로 이어지는 것을 확인했다.

검증:

- `npm run build` 성공
- `dist/sitemap.xml`에서 비교 메뉴 3개 URL의 `lastmod`가 `2026-06-02`로 출력되는 것 확인
- `dist/compare/index.html`, `dist/compare/bonus/index.html`, `dist/compare/welfare/index.html` 존재 확인
- `dist/index.html`, `dist/tools/index.html`, `dist/reports/index.html`에서 `/compare` 계열 링크 출력 확인
