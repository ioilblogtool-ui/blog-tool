# 2027 출산·육아 지원제도 변경 리포트 — 설계 문서

> 작성일: 2026-10-07
> 기획 원문: [콘텐츠 기획서](../../plan/202610/childbirth-benefits-changes-2027.md)
> 문서 상태: 설계 작성 완료 / 정책 상태: **재확인 필요**
> 설계 작성 당시에는 구현·테스트·빌드를 수행하지 않았다. 이후 구현 요청에 따른 실제 결과는 아래 구현 기록에 별도 작성했다. 커밋·push·배포는 미수행이며 정책 상태는 계속 재확인 필요다.

## 1. 목표와 범위

| 항목 | 결정 |
|---|---|
| 콘텐츠 유형 | 정보형 비교 리포트 |
| slug | `childbirth-benefits-changes-2027` |
| URL | `/reports/childbirth-benefits-changes-2027/` |
| Category | 복지·지원금, 등록 값 `support` |
| 검색 진입 | 2027 부모급여 / 2027 아동수당 → 신규 제도명 연결 |
| 핵심 질문 | ‘2027년 무엇이 어떻게 바뀌나?’ |
| 비교 기준 | 현행 2026 제도 / 공식 발표된 2027 개편안 |
| 출력 방식 | 정적 요약·조건별 비교표·해석·출처·FAQ |
| 주 CTA | 기존 `/tools/birth-support-money/`, 현재 기능에 맞는 기준연도 문구 |

개인별 금액·자격 판정, 주소 검색, 생년월일 입력, 평생 수령액 계산은 이 리포트의 범위에서 제외한다. 기존 계산기 개편과 지역별 리포트의 오래된 데이터 수정은 별도 작업이다. 리포트와 실제 존재하는 4개 콘텐츠의 양방향 링크는 향후 구현 범위에 포함한다.

기획서의 기존 콘텐츠 검토 결과를 유지한다. 국가 제도 개편과 지역별 장려금 비교는 독립 목적이므로 기존 지역 리포트를 교체하지 않는다. 현재 등록·페이지 목록에서 새 slug와 충돌은 확인되지 않았으며 구현 직전에 재검색한다. 이번 작업은 문서만 추가하고 등록 목록·sitemap·기획서의 과거 작업 기록은 바꾸지 않는다.

## 2. 현재 코드 구조와 적용 방식

확인한 기준은 `AGENTS.md`, `AGENT.md`, `CONTENT_GUIDE.md`, `docs/REPORT_CONTENT_GUIDE.md`, `docs/ARCHITECTURE.md`, `docs/QUALITY_SCORE.md`, `docs/UI_ARCHITECTURE.md`와 기획서다. 기존 국가·지역 정책 리포트, 공통 컴포넌트, 목록 등록 구조, OG 생성 스크립트도 대조했다.

| 실제 컴포넌트·구조 | 현재 지원 | 설계 적용 |
|---|---|---|
| `src/layouts/BaseLayout.astro` | title·description·ogImage·jsonLd, pathname 기반 canonical, SiteFooter 포함 | 실제 Props만 사용. `canonicalUrl`·`ogType`를 임의로 전달하지 않음. 중복 footer 생성 금지 |
| `CalculatorHero.astro` | eyebrow·title·description | 리포트 문구로 재사용. `badges` Props가 없으므로 배지는 별도 마크업 |
| `InfoNotice.astro` | title·lines | 기준일·개편안 상태·출처 배지 의미 안내 |
| `CompareCta.astro` | title·description·links, welfare variant | 필수 Props를 모두 전달해 주 CTA 구성 |
| `SeoContent.astro` | introTitle·intro·inputPoints·criteria·faq·related | FAQ는 실제 타입 `{ question, answer }`. 공통 가이드의 `{ q, a }` 예시를 그대로 전달하지 않음 |
| 기존 신혼부부 정책 리포트 | Article+FAQPage `@graph`, 데이터 분리 | 구조화 데이터 패턴만 참고, 정책 수치는 새 데이터에서 관리 |
| `scripts/generate-og-tools.py` | REPORTS 배열·reports 출력 디렉터리 | 신규 리포트 항목 1개 추가, 기존 생성 함수 재사용 |

### SeoContent의 리포트 문구

현재 컴포넌트는 ‘계산 기준’, ‘관련 계산기’, ‘다음 계산기’ 등의 문구를 고정한다. 전역 문구를 일괄 교체하지 않고 아래 optional Props를 추가해 해당 리포트에서만 지정한다. 기본값은 현재 문자열로 유지한다.

| optional Prop | 이 리포트의 값 | 연결할 위치 |
|---|---|---|
| `introSummary` | 제도별 적용 대상과 정책 상태, 다음 확인 항목을 함께 정리했습니다. | intro 패널 보조 설명 |
| `criteriaTitle` | 자료 기준과 비교 방법 | 기준 패널 H2 |
| `criteriaLinkLabel` | 자료 기준 | 빠른 이동의 criteria 항목 |
| `relatedTitle` | 함께 확인할 계산기와 리포트 | related 패널 H2 |
| `relatedEyebrow` | 다음 확인 | related 패널 eyebrow |
| `relatedLinkLabel` | 관련 콘텐츠 | 빠른 이동의 related 항목 |
| `relatedSummary` | 지원금 계산과 출산 비용, 지역별 지원을 이어서 확인하세요. | related 패널 보조 설명 |

이 페이지에는 `inputPoints`를 넘기지 않아 ‘이 도구를 이렇게 활용하면 좋습니다’ 패널은 생성하지 않는다. `criteria`는 4개 이하로 유지한다. 기존 fixed id인 `overview`, `highlights`, `criteria`, `faq`, `related`를 본문 다른 섹션에서 재사용하지 않는다. FAQ는 최초 항목만 열리는 기존 details 패턴을 유지하며 모든 답변을 정적 HTML에 포함한다.

## 3. 파일 구성과 등록 범위

아래는 향후 생성·수정 대상이며 현재 파일 생성 완료 목록이 아니다.

| 파일 | 책임 |
|---|---|
| `src/data/childbirthBenefitsChanges2027.ts` | 정책 레코드·출처·비교 섹션·메타·intro·FAQ·CTA·갱신 기록 |
| `src/pages/reports/childbirth-benefits-changes-2027.astro` | 정적 렌더·페이지 조립·JSON-LD |
| `src/styles/scss/pages/_childbirth-benefits-changes-2027.scss` | `cbc27-` prefix의 페이지 스타일 |
| `src/components/SeoContent.astro` | 위 선택 문구 Props만 추가 |
| `src/data/reports.ts` | slug·title·description·order 등록 |
| `src/pages/index.astro` | reportMetaBySlug에 category `support` 등록 |
| `src/pages/reports/index.astro` | eyebrow·tags·category `support`·isNew 등록 |
| `src/styles/app.scss` | SCSS `@use` 추가 |
| `public/sitemap.xml` | 실제 공개 단계 URL 등록 |
| `scripts/generate-og-tools.py` | REPORTS 항목 추가 |
| `public/og/reports/childbirth-benefits-changes-2027.png` | 전용 OG, 1200×630 |
| 기존 관련 콘텐츠의 데이터·페이지 | 하단 관련 링크 또는 기존 안내의 역방향 링크만 추가 |

새 `public/scripts/*.js`는 만들지 않는다. 첫 버전은 선택 UI 없이 표·카드·목차 앵커·native details만 사용한다. 차트·API·DB·로그인·외부 정책 수집 자동화는 도입하지 않는다. 목록의 주제 tags와 수치의 출처 배지는 구분하며, 사용자에게 데이터 배지로 표시하는 값은 허용된 네 가지로 제한한다.

## 4. 데이터 모델

### 4-1. 정책의 출처와 확정 상태 분리

`공식`은 출처의 성격이며 시행 확정을 뜻하지 않는다. 하나의 상태 문자열로 예산·법령·세부 지침의 확인 여부를 뭉치지 않는다. 핵심 수치와 조건에도 항목별 근거를 붙여 정책 레코드의 출처가 모든 세부 조건을 입증하는 것으로 오인하지 않게 한다.

```ts
type DataBadge = '공식' | '참고' | '시뮬레이션' | '추정';
type PolicyStatus = 'current' | 'scheduled' | 'budgetProposal' | 'lawAmendmentRequired';
type EvidenceStatus = 'verified' | 'recheckRequired';
type RegionClass = 'general' | 'preferred';
type BirthOrder = 'first' | 'second' | 'thirdOrMore';
type ChildcareMode = 'home' | 'daycare';

interface SourceRecord {
  id: string;
  organization: string;
  title: string;
  url: string;
  publishedAt: string | null;
  checkedAt: string; // YYYY-MM-DD, 실제 확인일
  verification: 'bodyRead' | 'attachmentRead' | 'searchExcerpt';
  limitation: string | null;
}

interface Evidence<T> {
  value: T | null;
  status: EvidenceStatus;
  sourceIds: string[];
  note: string;
}

interface PaymentAmount {
  amountWon: number;
  basis: 'total' | 'monthly' | 'installment';
  birthOrder: BirthOrder | null;
  region: RegionClass | null;
  childcare: ChildcareMode | null;
  cashWon: Evidence<number>;
  voucherWon: Evidence<number>;
}

interface PolicyRecord {
  id: string;
  version: string;
  name: string;
  applicableTarget: Evidence<string>;
  applicableBirthDate: Evidence<{
    from: string | null;
    through: string | null; // 시작일·종료일을 포함한 범위
  }>;
  amounts: Evidence<PaymentAmount[]>;
  paymentCycle: Evidence<{
    kind: 'once' | 'monthly' | 'quarterly';
    installments: number | null;
  }>;
  paymentPeriod: Evidence<string>;
  regionalPreference: Evidence<string>;
  childcareConditions: Evidence<string>;
  policyStatuses: PolicyStatus[];
  confirmation: {
    budget: 'notApplicable' | 'proposal' | 'approved' | 'unknown';
    legislation: 'inForce' | 'amendmentRequired' | 'promulgated' | 'unknown';
    guidance: 'published' | 'pending' | 'unknown';
  };
  badge: DataBadge;
  sourceIds: string[];
  checkedAt: string;
  recheckItems: string[];
}
```

날짜는 문자열로 표시하며 JS Date의 시간대 변환을 적용하지 않는다. 위 타입은 설계 예시이며 현재 소스에 구현된 타입이 아니다.

### 4-2. 필수 필드 대응

| 기획서 필드 | 설계 필드 |
|---|---|
| 제도명 | `name` |
| 적용 대상 | `applicableTarget` |
| 적용 출생일 | `applicableBirthDate` |
| 지급 금액 | `amounts` |
| 지급 주기 | `paymentCycle` |
| 지급 기간 | `paymentPeriod` |
| 지역 우대 | `regionalPreference` |
| 보육 형태 조건 | `childcareConditions` |
| 정책 상태 | `policyStatuses` + `confirmation` |
| 공식 출처 | `sourceIds` + SourceRecord |
| 기준일 | `checkedAt` |

`status='verified'`는 해당 발표에 그 내용이 있다는 확인이다. 예산안의 금액을 확인했더라도 `confirmation.budget='proposal'`은 그대로 유지한다. `scheduled`는 시행 근거와 시행일을 확보한 항목에만 사용하며 예산안의 예정 날짜만으로 부여하지 않는다.

### 4-3. 레코드·비교 행 구성

현행 첫만남이용권·부모급여·아동수당 3개와 신규 아이맞이지원금·아동기본수당 2개를 기본 정책으로 관리한다. ‘기존 출생아 유지’는 현행 급여의 현재 시행 상태와 다른 **개편안 경과조치** 레코드로 분리한다. 현행법의 연령 확대와 신규 수당의 적용 범위도 별도 근거로 연결한다.

신규 총액·월액·추가액은 기획서 3·4절의 공식 발표값을 원 단위 정수로 옮긴다. 아이맞이지원금은 일반/우대 × 첫째/둘째/셋째 이상 6행, 기본수당은 일반/우대 2행, 가정보육 추가는 별도 조건 행으로 저장한다. 50/60만원은 공식 Q&A가 안내한 합계로 근거를 연결한다. 분기 총액을 4로 나눈 회차액이나 가정보육 추가액의 현금 구성은 생성하지 않는다.

현행 아동수당의 지역 분류는 신규 `RegionClass`로 변환하지 않고 현행 제도 설명에 별도로 저장한다. 기존 일반·비수도권·인구감소지역을 신규 우대지역에 자동 매핑하는 함수는 없다.

비교 행은 `id`, `label`, `currentPolicyIds`, `proposalPolicyIds`, `changeSummary`, `recheckItems`를 갖는다. 정책 수치의 복사 문자열을 여러 표에 저장하지 않고 해당 레코드에서 표시값을 만들며, 설명 문장은 데이터에서 관리한다. 데이터 변경 후 카드·표·FAQ·OG가 함께 검토되는 갱신 목록을 유지한다.

### 4-4. 누락 데이터 처리

| 상황 | 표시·동작 |
|---|---|
| 금액·대상 근거 미확인 | `null` + ‘재확인 필요’, 카드 수치의 임의 기본값 금지 |
| 출처 있음·개편 미확정 | 숫자 표시 + ‘정부 개편안·최종 확정 전’ |
| 해당 항목 자체가 적용되지 않음 | ‘해당 없음’, 확인된 적용 제외 근거 병기 |
| 지급수단 일부 미확인 | 총액은 확인 범위대로 표시, 현금·상품권 분해는 ‘재확인 필요’ |
| 출처 열람 일부 실패 | SourceRecord limitation 표시, ‘첨부 확인 완료’로 기록 금지 |
| 자료끼리 불일치 | 충돌 항목 수치 강조 중단·재확인 필요. 나머지 확인된 항목은 유지 |
| 새 정책 자료 미발견 | 법안 부결·미통과로 단정 금지 |

잘못된 ID·음수·비정수 금액·출생일 범위 역전·존재하지 않는 source 참조는 빌드 전 데이터 검사에서 실패시킨다. 미확인 상태는 오류가 아니므로 문서를 렌더할 수 있어야 한다. 미확인을 ‘0원’으로 처리하는 fallback은 두지 않는다.

## 5. 화면 구조와 콘텐츠 계약

| 순서 / 앵커 | 화면 구성 | 반드시 보일 정보 |
|---|---|---|
| Hero | eyebrow ‘출산·육아 제도 변경 리포트’, H1·한 줄 설명 | 부모급여·아동수당 검색 의도 |
| 안내 | InfoNotice와 실제 확인일 | 예산안·추진 단계, 공식 출처 ≠ 지급 확정 |
| `cbc27-summary` | 요약 카드 4개 | 적용 출생일·아이맞이 총액 최대·기본 월액·체계 변경 |
| 목차 | 7개 핵심 섹션과 출처·FAQ 앵커 | 단순 링크, sticky·스크롤 추적 없음 |
| `cbc27-comparison` | 현행/개편안 항목 비교 | 기존 제도·2027 개편안·변화·확정 여부·재확인 필요 |
| `cbc27-birth-date` | 두 출생일 구간 카드 + 상세 비교 | ‘6월 30일까지’와 ‘7월 1일 이후’ 경계, 2026년생 설명 |
| `cbc27-birth-order` | 일반/우대 × 출생순위 표 | 총액·분기 지급안·회차액 미확정 구분 |
| `cbc27-region` | 지역 추가 지원 카드·설명 | 신규 우대 명단·거주 판정 재확인 |
| `cbc27-childcare` | 0~1세 가정보육/어린이집 비교 | 수당만 비교, 보육료 포함 총혜택 아님 |
| `cbc27-sources` | 출처 목록·최종확정 확인 절차·변경 이력 | 출처명·발표일·확인일·열람 제한·미확인 조건 |
| `cbc27-next` | CompareCta welfare | 실제 계산기 지원연도와 일치하는 문구 |
| SeoContent | intro 4단락·기준·FAQ 10개·관련 4개 | 기획서 원고, 정책 상태와 동일한 FAQ |

요약 카드의 최대액은 ‘셋째 이상·우대지역·정부안 총액’ 조건을 같은 카드에 표시한다. 기본수당은 ‘월액·현금/지역상품권 혼합·가정보육 추가 별도’를 가까이에 배치한다. 첫만남이용권·부모급여·아동수당이 각각 신규 제도와 일대일 대응한다고 그리지 않고 전체 급여 체계 개편으로 설명한다.

### 비교표의 반응형 표시

같은 ComparisonRow 데이터로 820px 미만에서는 항목별 정의 목록 카드, 820px 이상에서는 전체 열을 가진 표를 렌더한다. CSS로 비활성 표현을 `display:none` 처리해 접근성 트리에 두 표현이 동시에 남지 않도록 한다. 데이터에서 내용을 공유해 모바일 요약에서 정책 상태나 재확인 항목이 생략되지 않게 한다.

출생순위 3열·보육 형태 4열 표는 우선 줄바꿈으로 읽히게 하되 긴 상세 표는 `overflow-x:auto` 래퍼를 적용한다. 표의 caption·열/행 th·scope를 명시하고 스크롤 영역에 이름과 키보드 포커스를 제공한다. 페이지 전체의 가로 넘침은 허용하지 않는다.

## 6. 스타일·접근성·표현

기존 `container page-shell report-page` 구조와 `panel`, `section-header`, `report-stat-card`를 우선 재사용한다. 페이지 스타일은 `.cbc27-page` 아래에 격리하고 SCSS 토큰을 참조한다. 전역 table min-width 등 기존 규칙의 영향을 페이지 범위에서 제어한다.

반응형은 저장소 아키텍처의 480/640/820px 기준을 적용한다. 요약은 기본 1열, 640px부터 2열, 820px부터 4열이다. 카드·그리드 자식은 `min-width:0`, 표 래퍼는 부모 폭 이내로 제한한다. 출생일 구간 비교는 모바일 1열·640px 이상 2열로 표시한다.

정책 상태는 색이 아니라 명확한 문장으로 전달한다. ‘현행’, ‘2027 개편안’, ‘재확인 필요’는 일반 텍스트·표 열로 두며 새 배지 종류로 구현하지 않는다. 데이터 출처 배지는 네 허용 값만 사용한다. 금액은 `ko-KR` 숫자 형식과 원/만원·총/월 단위를 함께 표시한다.

링크와 summary는 충분한 클릭 영역·focus-visible을 제공한다. h1은 1개, h2/h3 계층을 유지한다. FAQ 접기는 기본 브라우저 기능을 사용하고 답변을 JS로 뒤늦게 삽입하지 않는다. 정보 이해에 필요한 조건은 접힌 영역에만 두지 않는다.

## 7. SEO·메타·OG

| 항목 | 설계 값 |
|---|---|
| Title | `2027 부모급여·아동수당 변경 \| 출산지원금 총정리` — 실제 문자열은 escape 없이 `|`, 29자 |
| Description | 기획서 확정 문구, 94자. 사용자 지정 80~120자 범위 우선 |
| H1 | 2027 부모급여·아동수당, 출산지원금은 어떻게 바뀌나? |
| canonical | BaseLayout이 실제 pathname으로 생성, 제안 경로와 일치 확인 |
| JSON-LD | Article + FAQPage `@graph`; 사이트 WebSite는 BaseLayout의 기존 출력 사용 |
| OG | `/og/reports/childbirth-benefits-changes-2027.png`, 1200×630 |
| intro | 기획서 4단락 원고, 기존 확인 길이 245/249/264/262자·총 1,020자 |
| FAQ | 기획서 10개 질문·답변을 `{question, answer}`로 이관 |

SeoContent는 현재 FAQ JSON-LD를 자동 생성하지 않는다. 페이지 frontmatter에서 화면과 동일한 FAQ 배열로 JSON-LD를 만든다. JSON 출력은 신뢰된 정적 데이터만 사용하고 `<`를 `\u003c`로 치환해 script 경계를 보호한다. FAQ 검색 노출을 보장하는 문구는 없다.

datePublished·dateModified는 실제 공개·실질 콘텐츠 변경일이며 문서 작성일을 공개일로 대입하지 않는다. 출시 전에는 공개일 메타를 미정으로 두고 개발자가 실제 날짜를 기록한다. 정책 checkedAt와 Article dateModified를 같은 의미로 취급하지 않는다.

OG 제목은 ‘2027 부모급여·아동수당’과 ‘변경 개편안’을 사용한다. 최대액만 강조하지 않고 ‘정부 개편안·최종 확정 전’과 확인 기준일을 포함한다. 기본수당을 모두 현금으로 표현하거나 최대 총액을 보편 지급액으로 노출하지 않는다. 허브·홈 description도 같은 상태 표현을 유지한다.

## 8. 내부 링크와 계산기 연결

| 대상 | 이 리포트의 문구 | 역방향 삽입 위치 |
|---|---|---|
| `/tools/birth-support-money/` | 기존 제도 기준 출산지원금 계산하기 | 계산 기준 안내 또는 관련 링크에서 새 리포트 연결 |
| `/tools/pregnancy-birth-cost/` | 임신·출산 비용도 함께 계산하기 | 첫만남이용권·지원금 참고 안내의 관련 링크 |
| `/tools/parental-leave-short-work-calculator/` | 육아휴직·단축근무 소득 확인하기 | 휴직급여와 양육지원 구분 안내의 관련 링크 |
| `/reports/birth-support-by-region-2026/` | 2026 기준 지역별 출산지원금 비교 | 국가 지원 요약의 다음 리포트 연결 |

현재 CTA 설정의 기준연도는 2026으로 명시한다. `supports2027Proposal=false`가 기본이며 실제 계산기의 입력·정책 상태·출생일 경계·결과를 검증한 뒤에만 true로 변경한다. 리포트 URL 연도가 2027이라는 이유로 자동 토글하지 않는다. true일 때만 ‘2027 출산지원금 계산기로 확인’을 사용하고 예산안 비교 기능이라는 설명을 붙인다.

4개 경로 모두 실제 페이지 존재를 구현 직전에 검증한다. 양방향 링크 추가 과정에서는 기존 계산 로직·수치를 수정하지 않는다. 오래된 데이터가 있으면 해당 콘텐츠의 기준연도와 한계를 명시하고 별도 갱신 과제를 기록한다. 하나의 링크를 주 CTA와 관련 목록에 반복 표시해도 고유 연결 대상은 4개로 유지한다.

## 9. 정책 갱신과 공개 판단

1. 공식 예산 의결·법령·사업안내·정정자료를 확인하고 해당 source의 발표일·확인일·검증 수준을 기록한다.
2. 바뀐 Evidence 항목만 수정한다. 예산 확정만으로 모든 조건을 현행 상태로 일괄 승격하지 않는다.
3. 출생 코호트·지역·보육·지급수단·신청 요건의 근거를 각각 대조한다.
4. 요약·비교표·FAQ·CTA·홈/허브·OG의 정책 상태와 기준일을 함께 점검한다.
5. 변경 이력에 항목·이전/새 값·출처·날짜를 기록하고 공개 날짜를 실제 작업에 맞게 반영한다.

기준일은 조회만 했을 때 바꾸지 않고 본문의 정책 검증을 마친 날짜로 관리한다. 출처 발표 날짜는 새로운 확인일로 덮어쓰지 않는다. 법령 공포일과 시행일이 다르면 각각 기록하고 시행 전 자료를 현행으로 표시하지 않는다.

확인된 정부안은 그 상태로 공개할 수 있다. 미확인 항목은 ‘재확인 필요’를 유지하며, 최종 확정까지 콘텐츠를 무조건 빈 페이지로 두는 설계는 아니다. 다만 핵심 수치의 근거 자체가 충돌하거나 출처가 없으면 관련 숫자를 강조하지 않고 재검증한다. 현재 문서는 정책 상태를 재확인 필요로 유지하며 출판·배포를 승인하거나 실행한 기록이 아니다.

## 10. 구현 후 검증 계획과 완료 조건

아래 표는 설계 당시의 검증 계획이다. 이후 실제 수행 결과는 문서 끝의 구현 기록을 참조한다.

| 검증 영역 | 검증 사례와 기대 |
|---|---|
| 데이터 참조 | 모든 정책·출처·비교 행 ID가 고유하고 참조가 존재 |
| 출처와 상태 | `공식` 배지가 붙어도 신규 정부안의 예산·법령 상태가 확정으로 승격되지 않음 |
| 날짜 경계 | 2027-06-30까지 / 2027-07-01부터 두 구간이 중복·누락 없이 문구에 반영 |
| 코호트 해석 | 2026년생이 신규 수당 자동 전환 대상이라고 표시되지 않음 |
| 누락 금액 | null은 재확인 필요, 확인된 0원과 구분 |
| 기간·지급수단 | 총액·월액·분기 회차와 현금·상품권이 구분되고 미확인 분해액이 생성되지 않음 |
| 지역·보육 | 신규 우대지역과 현행 지역을 자동 매핑하지 않으며 보육료 임의 합산 없음 |
| 수치·원고 | 기획서 발표값·현행 설명·FAQ 일치. intro/Title/Description 길이와 FAQ 개수 충족 |
| CTA | 미지원 계산기의 기본 문구는 기존 제도 기준. 2027 문구는 기능 검증 후만 허용 |
| SSR·구조화 데이터 | JS 꺼짐에서도 본문·출처·FAQ 존재, FAQ JSON-LD 내용과 화면 동일 |
| 공통 컴포넌트 | 기존 SeoContent 사용 페이지에서 default 문구·배치 유지, 새 리포트에서는 지정 문구 표시 |
| 모바일·키보드 | 320/480/640/820px·데스크톱, 문서 가로 넘침 없음, 표 래퍼·목차·FAQ 키보드 사용 가능 |
| SEO·등록 | canonical·OG·Article·홈·허브 category `support`·sitemap·4개 고유 링크 확인 |

데이터 검증은 실제 경계·수기 발표값·미확인 처리·CTA 조건을 검사한다. 텍스트가 자기 자신과 같다는 식의 테스트는 만들지 않는다. 정적 문서의 시각·링크 검증은 브라우저에서 수행한다. 공통 Props 변경으로 기존 페이지에 생긴 오류와 기존 저장소 오류를 구분해 기록한다.

향후 명령은 `npm run check:all`, `npm run build`, 필요 시 변경 파일 중심 타입 검사다. 전체 검사 실패를 부분 검사 성공으로 대체해 ‘전체 통과’라고 기록하지 않는다. 최종 QA는 `QUALITY_SCORE.md`·`DEPLOY_CHECKLIST.md`에 따라 수행한다. 빌드 실패 상태로 커밋·push하지 않으며 main push는 실제 배포임을 고려한다.

**현재 완료 범위:** 기획에 따른 화면·데이터·상태·파일·등록·갱신·검증 설계 문서 작성. **남은 작업:** 정책 재확인, 구현, 실제 검증, 공개 판단. 이번 요청에서는 소스 구현·테스트·빌드·OG 생성·커밋·push·배포를 수행하지 않았다.

## 구현·검증 기록 — 2026-10-07

사용자의 구현 요청에 따라 정보형 리포트 소스를 구현했다. 정책 상태는 **재확인 필요**이며 개발 완료와 정책 확정은 별개다.

- 정적 리포트 페이지·정책 데이터·페이지 전용 스타일, 요약 카드, 현행/개편안 비교, 출생일 경계, 출생순위·지역·보육 형태 설명, 공식 출처와 FAQ 10개 구현.
- 모든 신규 급여는 정부 개편안으로 표시. 미확인 지역·경과규정·회차별 금액·신청방법은 null/재확인 필요로 유지.
- 홈·리포트 목록·sitemap·OG 등록 및 실제 기존 콘텐츠 4개와 양방향 링크 연결. CTA는 현재 계산기 기능에 맞춰 2026 기존 제도 기준으로 표시.
- `SeoContent.astro`에 정보형 리포트용 선택 문구 Props를 추가하고 기존 기본 문구는 유지. 이 페이지의 자동 광고 로드는 비활성화.

| 실제 검증 | 결과 |
|---|---|
| 정책 데이터 및 정적 HTML 검증 | `node scripts/check-childbirth-benefits-changes-2027.mjs` 통과. 발표 금액·날짜 경계·지급수단·누락 처리·잘못된 데이터 거부·SEO·FAQ JSON-LD·4개 역방향 링크 확인 |
| 변경 페이지 중심 타입 검사 | `.astro/tsconfig.cbc27.json` 기준 Astro check, 7개 파일 오류 0건 |
| 전체 타입 검사 | 1,167개 파일 오류 397건. 기존 저장소 오류가 남아 전체 통과 아님. 신규 페이지·데이터·SeoContent 자체 오류 없음. 기존 육아휴직 페이지의 readonly 관련 링크 오류는 변경 전에도 존재하는 타입 불일치 |
| 등록 매핑 | `npm run check:mapping` 통과 |
| 프로덕션 빌드 | `npm run build` 성공, 425개 페이지 생성 |
| 브라우저 반응형 | 320/480/640/820/1280px에서 문서 scrollWidth와 clientWidth 일치. 모바일 비교 카드/데스크톱 표 전환, 출생일 카드 가독성 확인 |
| FAQ·콘솔 | FAQ 추가 펼침 확인, 브라우저 오류 로그 없음 |
| OG | 1200×630 생성 후 제목·개편안 문구·기준일·경로 시각 확인 |
| 변경 공백 검사 | `git diff --check` 통과 |

검증용 임시 설정·로그는 무시되는 `.astro/`에 저장했다. 정책 최종 법령·신청방법 등은 공개 후 갱신해야 한다. 배포 QA 전체 완료나 공개 완료로 기록하지 않는다. **커밋·push·배포 미수행.**

## 배포 요청 기록 — 2026-10-07

사용자의 명시적인 배포 요청에 따라 이 리포트만 main에 반영하는 절차를 진행한다. 기존 전체 타입 검사 오류 397건은 구현 결과에서 이미 보고했으며 전체 검사 통과로 기록하지 않는다. 리포트 정책 상태는 재확인 필요로 유지한다.

최종 소스의 프로덕션 빌드 성공(425개 페이지), 정책·정적 HTML·FAQ·메타·양방향 링크 검증 통과, 등록 매핑 통과. 홈 등록과 리포트 복지·지원금 필터에서 표시를 확인했다. 공개일/수정일과 sitemap lastmod는 2026-10-07로 설정했다. 배포 결과와 실제 서비스 확인은 push 이후 별도 확인한다.

배포 범위에서 기존 package-lock.json 변경, 다른 출산지원금 계산기 기획·설계 문서, 페이지 인벤토리 파일은 제외한다.

최종 배포 직전 전체 검사: npm run check:all은 기존과 동일한 오류 397건으로 실패(1,168개 파일, 경고 2건). 매핑 검사는 별도로 통과했다. 전체 타입 검사 통과로 기록하지 않는다.

