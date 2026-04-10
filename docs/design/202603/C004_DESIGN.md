# C004 설계 문서

## 1. 문서 개요

### 1-1. 대상
- 기획 문서: `docs/plan/202603/C004_PLAN.md`
- 구현 대상: 서울 신축·준신축 대단지 국평 아파트 검색·비교 리포트

### 1-2. 문서 역할
- 기획 문서를 실제 구현 직전 수준으로 구체화한 설계 문서다.
- 비교계산소 기준의 화면 구조, 컴포넌트, 데이터 구조, 계산 로직, 구현 순서를 고정한다.
- Claude/Codex가 바로 `src/data/`, `src/pages/reports/`, `public/scripts/`, `src/styles/` 작업으로 이어갈 수 있게 한다.

### 1-3. 페이지 성격
- 계산기보다 `리포트형 인터랙티브 비교 페이지`
- 핵심 흐름: `지역/단지 탐색 -> 가격 비교 -> 체감 비교 -> 매매 자금 계산기 CTA`
- 무거운 지도형 UI 대신 `선택 UI + 카드 + 표 + 가벼운 차트` 중심으로 구성한다.

### 1-4. 권장 slug
- `seoul-84-apartment-prices`
- URL: `/reports/seoul-84-apartment-prices/`

### 1-5. 권장 파일 구조
- `src/data/seoul84ApartmentPrices.ts`
- `src/pages/reports/seoul-84-apartment-prices.astro`
- `public/scripts/seoul-84-apartment-prices.js`
- `src/styles/scss/pages/_seoul-84-apartment-prices.scss`
- `public/og/reports/seoul-84-apartment-prices.png`

---

## 2. 구현 범위

### 2-1. MVP 범위
- 서울 1차 6개 구 데이터를 고정으로 제공한다.
  - 강남구, 서초구, 송파구, 마포구, 성동구, 강동구
- 대단지 아파트 20개를 표와 비교 카드로 제공한다.
- 필터 5종을 제공한다.
  - 지역
  - 단지명 검색
  - 가격 기준 선택: 최고가 / 평균가
  - 정렬: 높은 가격순 / 낮은 가격순 / 이름순
  - 등급: 신축 / 준신축
- 2~4개 단지 비교 기능을 제공한다.
- KPI 카드, 구별 평균 비교, 연봉 대비 체감 비교를 제공한다.
- `부동산 매매 자금 계산기` CTA를 연결한다.

### 2-2. MVP 제외 범위
- 실시간 API 연동
- 최근 거래 사례 타임라인
- 지도 시각화
- 재건축 예정 단지 확장 포함
- 서울 외 지역 확장

---

## 3. 화면 구조

### 3-1. 전체 IA
1. `CalculatorHero`
2. `InfoNotice`
3. KPI 요약 카드
4. 검색/필터 패널
5. 검색 결과 표
6. 선택 단지 비교 카드
7. 구별 평균 비교 차트
8. 연봉 대비 체감 비교
9. 인사이트 카드
10. CTA 섹션
11. 외부 참고 링크 섹션
12. 제휴 상품 섹션
13. `SeoContent`

### 3-2. 모바일 우선 화면 순서
- Hero
- 참고 문구
- KPI
- 필터
- 결과 리스트
- 비교 카드
- 차트
- 체감 비교
- CTA
- 외부 참고 링크
- 제휴 상품
- SEO

### 3-3. PC 레이아웃
- 상단은 일반 리포트형 1열 구조를 유지한다.
- 필터와 결과 영역은 한 섹션 안에서 위아래 순서로 구성한다.
- 비교 카드와 체감 비교는 2열 카드 그리드를 사용한다.
- 긴 표는 `overflow-x: auto`를 적용한다.

### 3-4. 섹션별 역할

#### Hero
- eyebrow: `Interactive Report`
- H1: `서울 신축·준신축 국평 아파트, 어디가 얼마일까?`
- 설명:
  - 서울 6개 구 대단지 아파트의 전용 84㎡ 가격을 비교한다.
  - 최고가와 평균가를 함께 보여주고 체감 비교까지 제공한다.

#### InfoNotice
- 필수 문구
  - 입주 완료 단지 기준
  - 전용 84㎡ 계열 기준
  - 재건축 예정 단지 제외
  - 가격은 최근 1년 기준 정리값이며 참고용
  - 실제 거래 판단 전 국토교통부 실거래가, KB부동산 등 외부 소스 재확인 필요

#### KPI 요약
- 카드 4개 권장
  - 최고 평균가 단지
  - 6개 구 평균가 범위
  - 비교 대상 단지 수
  - 평균 직장인 기준 체감 연수 중앙값

#### 검색/필터 패널
- 계산기형 입력 폼이 아니라 `리포트 컨트롤 패널`로 구성한다.
- 컨트롤 구성
  - 지역 `select`
  - 단지명 `input[type="search"]`
  - 가격 기준 라디오칩
  - 등급 필터 칩
  - 정렬 `select`
  - 초기화 버튼

#### 검색 결과 표
- 기본은 표 레이아웃으로 제공한다.
- 컬럼
  - 지역
  - 단지명
  - 세대수
  - 등급
  - 최고가
  - 평균가
  - 평당가
  - 비교 선택
- 모바일 1차 구현도 카드 리스트 대신 표 + 가로 스크롤 우선으로 간다.

#### 비교 카드
- 2~4개 단지를 선택하면 카드로 렌더링한다.
- 카드 노출값
  - 단지명
  - 지역
  - 등급
  - 세대수
  - 최고가
  - 평균가
  - 평당가
  - 연봉 대비 체감값
- 카드 하단에 `이 가격이면 자금 계산기로 바로 계산` 링크 버튼을 둔다.

#### 구별 평균 비교
- 1차는 Chart.js 없이 CSS bar row 우선
- 기준값: `districtSummaries.avgOfAvgPriceEok`
- 항목 수가 6개라서 CSS 막대만으로도 충분하다.

#### 연봉 대비 체감 비교
- 탭: `평균 직장인 / 삼성전자 / SK하이닉스`
- 각 단지별 `몇 년치 연봉`을 카드 또는 bar row로 노출한다.
- 해석 문구 예시:
  - `래미안원베일리는 평균 직장인 기준 144.3년치 수준입니다.`
- CTA 전환용 보조 문구를 함께 둔다.

#### 인사이트 카드
- 3~4개 카드
- 예시 주제
  - 반포권과 강남권의 가격 차이
  - 송파권 주요 단지의 가격대 분포
  - 마포·성동의 체감 진입 장벽 비교
  - 평균가와 최고가 차이가 큰 단지의 해석 포인트

#### CTA 섹션
- 제목: `이 단지, 실제로 사려면 자금이 얼마나 필요할까?`
- 버튼: `/tools/home-purchase-fund/`
- 전달 파라미터 후보
  - `price`
  - `regionType`
- CTA는 검색 결과 하단, 비교 카드 하단, 본문 하단 중 최소 2곳에 배치 가능하다.

#### 외부 참고 링크 섹션
- 비교 결과 하단 또는 CTA 하단에 배치한다.
- 링크 유형을 분리한다.
  - 가격 참고 링크: 국토교통부 실거래가 공개시스템, KB부동산, 네이버부동산 등
  - 대출/세금 참고 링크: 정책 대출 안내, 취득세 안내, 세금 계산 참고 자료
- 목적은 `실거래가 재확인`과 `매수 판단 보조`다.
- 외부 링크는 모두 새 창으로 열고, 공식 서비스 우선으로 구성한다.

#### 제휴 상품 섹션
- 페이지 최하단에 1개 박스로만 배치한다.
- 성격은 `입주 준비 체크 상품`이다.
- 노출 수량은 3~4개 이내로 제한한다.
- 본문 흐름을 방해하지 않도록 CTA와 SEO 사이 또는 SEO 바로 위에 배치한다.
- 배너형보다 카드형 구성으로 간다.
- 제휴 고지 문구를 반드시 포함한다.

---

## 4. 컴포넌트 구조

### 4-1. 공용 컴포넌트
- `BaseLayout`
- `SiteHeader`
- `CalculatorHero`
- `InfoNotice`
- `SeoContent`
- 기존 `report-stat-card` 스타일
- 기존 `panel`, `section-header`, `content-section` 스타일

### 4-2. 페이지 전용 블록
- `sapr-filter-panel`
- `sapr-results-table`
- `sapr-compare-grid`
- `sapr-district-bars`
- `sapr-salary-compare`
- `sapr-insight-grid`
- `sapr-cta-box`
- `sapr-reference-links`
- `sapr-affiliate-box`

설명:
- `sapr-` = `seoul apartment price report`

### 4-3. Astro 페이지 구성 방식
- `.astro`에서 초기 데이터 주입
- `script[type="application/json"]`로 전체 데이터 전달
- `public/scripts/seoul-84-apartment-prices.js`에서 필터/검색/비교 렌더
- 1차는 별도 Astro 컴포넌트 분리 없이 페이지 내부 마크업으로 시작
- 반복이 많은 블록만 2차에 분리

---

## 5. 데이터 구조 설계

### 5-1. 메인 데이터 파일 구조
```ts
export type DistrictKey =
  | "gangnam"
  | "seocho"
  | "songpa"
  | "mapo"
  | "seongdong"
  | "gangdong";

export type ApartmentGrade = "신축" | "준신축";
export type SalaryMode = "avgWorker" | "samsung" | "hynix";

export type ApartmentPriceEntry = {
  id: string;
  districtKey: DistrictKey;
  districtLabel: string;
  apartmentName: string;
  householdCount: number;
  grade: ApartmentGrade;
  areaType: "84";
  approvalYear?: number;
  highPriceEok: number | null;
  avgPriceEok: number | null;
  pricePerPyeongMan: number | null;
  diffHighVsAvgEok: number | null;
  compareEnabled: boolean;
  salaryYearsAvgWorker: number | null;
  salaryYearsSamsung: number | null;
  salaryYearsHynix: number | null;
  tags?: string[];
};

export type DistrictSummary = {
  districtKey: DistrictKey;
  districtLabel: string;
  avgOfAvgPriceEok: number | null;
  maxAvgPriceEok: number | null;
  topApartmentName: string;
  entryCount: number;
};

export type Seoul84ApartmentReportData = {
  meta: {
    slug: string;
    title: string;
    description: string;
    methodology: string;
    caution: string;
    updatedAt: string;
  };
  salaryBases: {
    avgWorker: number;
    samsung: number;
    hynix: number;
  };
  filterOptions: {
    districts: { value: DistrictKey; label: string }[];
    grades: ApartmentGrade[];
    sortOptions: { value: string; label: string }[];
    priceModes: { value: "high" | "avg"; label: string }[];
  };
  entries: ApartmentPriceEntry[];
  districtSummaries: DistrictSummary[];
  faq: { q: string; a: string }[];
  insights: { title: string; body: string }[];
  relatedLinks: { href: string; label: string }[];
  referenceLinks: {
    price: { label: string; href: string }[];
    loanTax: { label: string; href: string }[];
  };
  affiliateProducts: {
    tag: string;
    title: string;
    desc: string;
    url: string;
  }[];
};
```

### 5-2. 데이터 운영 규칙
- 가격 단위 원본은 `억` 기준 숫자로 저장한다.
- 화면 포맷은 렌더 단계에서 처리한다.
- 미확정 값은 `null` 사용
- 강동구 일부처럼 평균가가 없으면 UI에 `-`로 표시한다.

### 5-3. 등록 파일
- 메인 데이터: `src/data/seoul84ApartmentPrices.ts`
- 리포트 목록 등록: `src/data/reports.ts`

---

## 6. 계산 로직 정리

### 6-1. 평당가 계산
```ts
pricePerPyeongMan = avgPriceEok !== null
  ? Math.round((avgPriceEok * 10000) / 25.41)
  : null;
```
- `avgPriceEok * 10000` = 만원 단위 변환
- `25.41` = 전용 84㎡의 평 환산값

### 6-2. 최고가 - 평균가 차이
```ts
diffHighVsAvgEok =
  highPriceEok !== null && avgPriceEok !== null
    ? Math.round((highPriceEok - avgPriceEok) * 100) / 100
    : null;
```

### 6-3. 연봉 대비 체감 연수
- 기준 연봉
  - 평균 직장인: `43,320,000`
  - 삼성전자: `158,000,000`
  - SK하이닉스: `185,000,000`

```ts
salaryYears = avgPriceEok !== null
  ? Math.round(((avgPriceEok * 100000000) / salaryBase) * 10) / 10
  : null;
```

### 6-4. 구별 평균가 계산
```ts
avgOfAvgPriceEok =
  validEntries.length > 0
    ? Math.round(
        (validEntries.reduce((sum, item) => sum + item.avgPriceEok!, 0) / validEntries.length) * 100
      ) / 100
    : null;
```

### 6-5. KPI 계산
- 최고 평균가 단지: `avgPriceEok !== null` 항목 중 최댓값
- 구 평균 범위: `districtSummaries.avgOfAvgPriceEok` 최소~최대
- 체감 중앙값: `salaryYearsAvgWorker` 존재값의 중앙값

---

## 7. 상태 관리 및 인터랙션

### 7-1. 클라이언트 상태
```ts
type ViewState = {
  district: "all" | DistrictKey;
  query: string;
  grade: "all" | ApartmentGrade;
  sort: "price_desc" | "price_asc" | "name";
  priceMode: "high" | "avg";
  salaryMode: SalaryMode;
  compareIds: string[];
};
```

### 7-2. 동작 규칙
- 초기값
  - `district=all`
  - `query=""`
  - `grade=all`
  - `sort=price_desc`
  - `priceMode=avg`
  - `salaryMode=avgWorker`
  - `compareIds=[]`
- 비교 선택 최대 4개
- 5번째 선택은 막고 안내 문구 표시
- 필터 변경 시 결과는 즉시 갱신

### 7-3. URL 파라미터
- 권장 파라미터
  - `district`
  - `q`
  - `grade`
  - `sort`
  - `price`
  - `salary`
  - `compare`

예시:
```txt
/reports/seoul-84-apartment-prices/?district=seocho&price=avg&salary=samsung&compare=raemian-one-bailey,acro-river-park
```

### 7-4. 렌더 순서
1. URL 상태 파싱
2. 필터 UI 반영
3. 데이터 필터링
4. 정렬
5. 결과 표 렌더
6. 비교 카드 렌더
7. 구별 요약 렌더
8. 체감 비교 렌더
9. URL 갱신

---

## 8. 구현 단계

### 8-1. 1단계: 데이터 파일 작성
- `src/data/seoul84ApartmentPrices.ts` 생성
- 기획 문서의 20개 단지 데이터 입력
- `meta`, `faq`, `insights`, `relatedLinks`, `referenceLinks`, `affiliateProducts` 포함
- 파생값은 파일 내부에서 미리 계산해서 export

### 8-2. 2단계: 리포트 페이지 생성
- `src/pages/reports/seoul-84-apartment-prices.astro`
- 포함 섹션
  - Hero
  - InfoNotice
  - KPI
  - 필터/결과
  - 비교 카드
  - 구별 평균 비교
  - 체감 비교
  - CTA
  - 외부 참고 링크
  - 제휴 상품
  - SeoContent

### 8-3. 3단계: 스크립트 구현
- `public/scripts/seoul-84-apartment-prices.js`
- 담당 기능
  - 필터 상태 초기화
  - 검색/정렬
  - 비교 선택
  - URL 동기화
  - 표/카드/bar row 렌더

### 8-4. 4단계: 스타일 작성
- `src/styles/scss/pages/_seoul-84-apartment-prices.scss`
- `src/styles/app.scss`에 import 추가
- 확인 포인트
  - 표 가독성
  - 비교 카드 2열 배치
  - 모바일 자연스러운 스크롤
  - reference-links / affiliate-box 하단 배치 정리

### 8-5. 5단계: 리포트 허브 연결
- `src/data/reports.ts` 등록
- `src/pages/reports/index.astro` 노출 확인
- `public/sitemap.xml` 추가

### 8-6. 6단계: CTA 연결 최적화
- `home-purchase-fund` 링크 연결
- 가능하면 가격/지역 타입 관련 쿼리 전달
- 지역 매핑 예시
  - 강남/서초/송파 -> `regulated`
  - 모호하면 1차는 `price`만 전달

### 8-7. 7단계: 외부 참고 링크 / 제휴 박스 반영
- `reference-links` 블록 추가
- 카테고리 분리
  - `price reference`
  - `loan/tax reference`
- 외부 링크는 공식 서비스 우선, 새 창 열기
- `affiliate-box`는 1개만 배치
- 제휴 상품은 3~4개 이내
- disclosure 문구와 가격/재고 변동 가능 문구 포함

---

## 9. SEO/콘텐츠 설계

### 9-1. 메타
- title:
  - `서울 국평 아파트 가격 비교 리포트 | 강남·서초·송파·마포·성동·강동 84㎡ 시세`
- description:
  - `서울 신축·준신축 대단지 아파트의 전용 84㎡ 가격을 최고가와 평균가 기준으로 비교합니다. 연봉 대비 체감 비교와 매매 자금 계산기 연결까지 한 번에 확인하세요.`

### 9-2. SeoContent 구성
- `introTitle`: `서울 국평 시세를 읽는 가장 빠른 방법`
- `intro`: 2문단 이상
- `inputPoints`
  - 어떤 지역과 단지를 비교하는지
  - 최고가와 평균가 차이를 어떻게 읽어야 하는지
  - 연봉 대비 체감 비교가 무엇을 보여주는지
- `criteria`
  - 입주 완료 단지 기준
  - 전용 84㎡ 계열 기준
  - 재건축 예정 단지 제외
  - 최근 1년 정리값 기준
- `faq`: 6개 이상
- `related`
  - `/tools/home-purchase-fund/`
  - `/reports/`
  - 추후 시리즈 페이지

### 9-3. FAQ 초안
- 국평은 왜 84㎡ 기준으로 보나요?
- 최고가와 평균가는 어떻게 다른가요?
- 왜 재건축 예정 단지는 제외했나요?
- 평균 직장인 기준 몇 년치 연봉 계산은 무엇을 의미하나요?
- 실제 매수 판단 전 무엇을 더 확인해야 하나요?
- 이 데이터는 언제 업데이트되나요?

---

## 10. QA 체크리스트

### 10-1. 데이터
- [ ] 20개 단지 명칭/세대수/지역 매칭 확인
- [ ] 평균가 누락 항목 `null` 처리 확인
- [ ] 평당가 반올림 방식 고정
- [ ] 연봉 대비 체감 연수 계산 검증

### 10-2. UI
- [ ] 모바일 첫 화면에서 페이지 목적이 바로 보임
- [ ] 필터 조작 후 결과가 즉시 갱신됨
- [ ] 비교 선택 4개 제한이 정상 동작함
- [ ] 표 가로 스크롤이 깨지지 않음
- [ ] CTA가 과하게 광고처럼 보이지 않음
- [ ] `reference-links` 블록이 CTA와 시각적으로 구분됨
- [ ] `affiliate-box`가 본문 흐름을 방해하지 않고 최하단에 배치됨

### 10-3. SEO/운영
- [ ] `reports.ts` 등록
- [ ] `sitemap.xml` 반영
- [ ] `SeoContent` 노출 확인
- [ ] `InfoNotice`에 참고/기준 문구 포함
- [ ] OG 이미지 경로 설정
- [ ] 외부 링크에 `target="_blank" rel="noopener noreferrer"` 적용
- [ ] 제휴 링크에 `nofollow` 및 disclosure 문구 적용
- [ ] `npm run build` 통과

---

## 11. 구현 메모

### 11-1. 페이지 포지션
- 계산기가 아니라 `부동산 비교 리포트`
- 비교계산소의 강점인 `체감 숫자 비교`와 `다음 계산 행동`을 반드시 연결한다.

### 11-2. 기존 리포트와의 차이
- 단순 랭킹형 콘텐츠가 아니라 `필터 + 결과 표 + 비교 선택` 구조
- 차트보다 `선택 후 바로 해석 가능한 카드` 비중이 높다.

### 11-3. 구현 우선순위
1. 데이터 구조 확정
2. 필터/검색/정렬 동작
3. 비교 카드
4. 체감 비교
5. CTA 연결
6. 외부 참고 링크/제휴 박스
7. SEO/허브 등록

### 11-4. 확장 방향
- 구별 단독 리포트 시리즈
- 최근 거래 데이터 확장
- 서울 외 수도권 확장
- 매매 자금 계산기와의 파라미터 연동 강화
