# 청년미래적금 vs 청년도약계좌 vs 청년희망적금 비교 리포트 설계 문서

> 기획 원문: `docs/plan/202605/youth-savings-comparison-2026.md`
> 작성일: 2026-05-31
> 구현 기준: Claude/Codex가 이 문서를 보고 바로 페이지 구현에 착수할 수 있는 수준으로 고정

---

## 1. 문서 개요

### 1-1. 대상
- 기획 문서: `docs/plan/202605/youth-savings-comparison-2026.md`
- 구현 대상: `청년미래적금 vs 청년도약계좌 vs 청년희망적금 비교 리포트 2026`
- 참고 구조: 기존 `/reports/` 하위 리포트 패턴 동일하게 따름

### 1-2. 문서 역할
- 기획 문서를 비교계산소 `/reports/` 구조에 맞게 실제 구현 직전 수준으로 재구성한 설계 문서다.
- 화면 구조, 데이터 스키마, 섹션 목적, 인터랙션, SEO, QA 기준을 고정한다.
- 이후 구현자는 이 문서를 기준으로 `src/data/`, `src/pages/reports/`, `public/scripts/`, `src/styles/` 작업을 진행한다.

### 1-3. 페이지 성격
- `리포트형 비교 콘텐츠` — 계산기 없는 순수 정보 비교
- 핵심 흐름: `KPI 요약 → 3개 상품 핵심 비교표 → 소득별 유불리 탭 → 만기 수령액 시뮬레이션 → 중복 가입 가이드 → 주의사항 → FAQ → CTA`
- 핵심 인터랙션: 소득 구간 탭 (2,400만 / 3,600만 / 5,000만 원) 선택 시 추천 상품 카드 하이라이트

### 1-4. 권장 slug
- `youth-savings-comparison-2026`
- URL: `/reports/youth-savings-comparison-2026/`

### 1-5. 권장 파일 구조
- `src/data/youthSavingsComparison2026.ts`
- `src/pages/reports/youth-savings-comparison-2026.astro`
- `public/scripts/youth-savings-comparison-2026.js`
- `src/styles/scss/pages/_youth-savings-comparison-2026.scss`
- `public/og/reports/youth-savings-comparison-2026.png`

---

## 2. 현재 프로젝트 기준 정리

### 2-1. 리포트 공통 구조
1. `CalculatorHero`
2. `InfoNotice`
3. 상단 KPI 요약 카드
4. 핵심 비교표 / 차트
5. 섹션별 상세 비교
6. 해설 카드 보드
7. FAQ
8. 관련 계산기 / 리포트 CTA
9. `SeoContent`

### 2-2. 현재 구현 패턴
- 메타 등록: `src/data/reports.ts`
- 허브 노출: `src/pages/reports/index.astro`
- 페이지 데이터: `src/data/<report>.ts`
- 페이지 마크업: `src/pages/reports/<slug>.astro`
- 클라이언트 인터랙션: `public/scripts/<slug>.js`
- 페이지 전용 스타일: `src/styles/scss/pages/_<slug>.scss`
- 사이트맵: `public/sitemap.xml`

### 2-3. 이번 리포트 방향
- 이미지 없이 표·카드·CSS bar 중심으로 구성
- `소득 구간 탭`이 핵심 인터랙션 (Chart.js 불필요)
- 데이터는 금융위원회·서민금융진흥원 공개 자료만 사용
- 청년희망적금은 현재 신규 가입 불가임을 명확히 표시

---

## 3. 구현 범위

### 3-1. MVP 범위
- KPI 요약 카드 3종
- 3개 상품 핵심 비교표 (가로 3열)
- 소득 구간별 유불리 탭 + 추천 카드
- 월 70만 원 기준 만기 수령액 시뮬레이션 (CSS bar row)
- 중복 가입 가능 여부 카드
- 주의사항 카드 3종
- FAQ 5개
- 관련 콘텐츠 CTA

### 3-2. MVP 제외 범위
- 월 납입액 직접 입력 계산기 (2차 확장)
- ISA 절세 조합 비교 (2차 확장)
- 은행별 금리 비교 (2차 확장)

---

## 4. 상품 데이터 정의

### 4-1. 3개 상품 핵심 데이터

| 항목 | 청년미래적금 | 청년도약계좌 | 청년희망적금 |
|------|------------|------------|------------|
| 출시 | 2026년 | 2023년 | 2022년 |
| 가입 가능 여부 | ✅ 가입 가능 | ✅ 가입 가능 | ❌ 신규 종료 |
| 가입 나이 | 만 19~34세 | 만 19~34세 | 만 19~34세 |
| 개인소득 요건 | 연 7,500만 원 이하 | 연 7,500만 원 이하 | 연 3,600만 원 이하 |
| 가구소득 요건 | 중위소득 250% 이하 | 중위소득 250% 이하 | 없음 |
| 월 납입 한도 | 50만 원 | 70만 원 | 50만 원 |
| 기본 금리 | 연 4.5% (예시) | 연 4.5% | 연 5.0% |
| 정부 기여금 | 소득별 월 최대 3.3만 원 | 소득별 월 최대 2.4만 원 | 저축 장려금 (만기) |
| 비과세 | ✅ | ✅ | ✅ |
| 만기 | 3년 | 5년 | 2년 |
| 특징 | 3년 단기 + 기여금 | 5년 장기 + 기여금 | 2년 단기 (종료) |

> ⚠️ 위 수치는 설계 기준 예시값. 구현 전 금융위원회·서민금융진흥원 공식 자료로 반드시 업데이트

### 4-2. 청년도약계좌 소득별 기여금 구간

| 개인소득 구간 | 월 기여금 |
|-------------|---------|
| 2,400만 원 이하 | 2.4만 원 |
| 3,600만 원 이하 | 2.3만 원 |
| 4,800만 원 이하 | 2.2만 원 |
| 6,000만 원 이하 | 0원 (비과세만) |
| 7,500만 원 이하 | 0원 (비과세만) |

> ⚠️ 구현 전 서민금융진흥원 공식 자료로 업데이트 필요

### 4-3. 월 70만 원 기준 만기 수령액 시뮬레이션

| 상품 | 납입 기간 | 본인 납입 총액 | 정부 기여금 | 이자 (세후) | 예상 수령액 |
|------|---------|------------|----------|----------|----------|
| 청년미래적금 | 3년 | 약 1,800만 원 | 약 120만 원 | 약 130만 원 | 약 2,050만 원 |
| 청년도약계좌 | 5년 | 약 4,200만 원 | 약 144만 원 | 약 480만 원 | 약 4,824만 원 |
| 청년희망적금 | 2년 | 약 1,200만 원 | 약 36만 원 | 약 60만 원 | 약 1,296만 원 |

> ⚠️ 위 수치는 설계 참고용 추정값. 구현 전 공식 자료 기준으로 정확한 수치로 교체 필수
> 청년미래적금 월 한도 50만 원이므로 50만 원 기준으로 재산출 필요

### 4-4. 소득 구간별 추천 결론

| 소득 구간 | 추천 상품 | 이유 |
|---------|---------|------|
| 연 2,400만 원 이하 | 청년도약계좌 우선 | 기여금 최대 + 5년 장기 복리 효과 |
| 연 3,600만 원 이하 | 청년도약계좌 or 미래적금 병행 검토 | 도약계좌 기여금 + 미래적금 단기 유동성 |
| 연 5,000만 원 이하 | 청년미래적금 우선 | 도약계좌 기여금 없음, 미래적금 3년 단기 비과세 |
| 연 7,500만 원 이하 | 청년미래적금 | 유일하게 비과세 혜택 가능 |

---

## 5. 데이터 구조 (`src/data/youthSavingsComparison2026.ts`)

### 5-1. 타입 전체 정의

```ts
export type ProductId = 'future' | 'leap' | 'hope';

export interface ReportMeta {
  seoTitle: string;
  seoDescription: string;
  ogTitle: string;
  ogDescription: string;
  dataSourceLabel: string;
  updatedAt: string;
  caution: string;
}

export interface KpiCard {
  label: string;
  value: string;
  sub: string;
  tone?: 'neutral' | 'accent' | 'warn';
}

export interface ProductRecord {
  id: ProductId;
  name: string;                  // 청년미래적금
  nameShort: string;             // 미래적금
  available: boolean;            // 현재 가입 가능 여부
  unavailableReason?: string;    // 가입 불가 사유
  launchYear: number;
  ageMin: number;
  ageMax: number;
  incomeLimit: number;           // 만 원, 개인소득 상한
  householdIncomeNote: string;   // 가구소득 조건 설명
  monthlyLimitMan: number;       // 만 원, 월 납입 한도
  baseRatePct: number;           // 기본 금리 (%)
  maxContributionMan: number;    // 만 원, 정부 기여금 월 최대
  taxFree: boolean;
  termMonths: number;            // 만기 (개월)
  highlight: string;             // 한 줄 특징
  color: string;                 // UI 색상 hex
}

export interface IncomeContributionRow {
  productId: ProductId;
  incomeLabel: string;           // "2,400만 원 이하"
  incomeMax: number;             // 만 원
  monthlyContributionMan: number;// 만 원
}

export interface SimulationRow {
  productId: ProductId;
  monthlyInputMan: number;       // 기준 납입액 (50만 원)
  totalInputMan: number;         // 본인 납입 총액
  totalContributionMan: number;  // 정부 기여금 합계
  totalInterestMan: number;      // 세후 이자
  totalReceiveMan: number;       // 예상 수령액 합계
  isEstimate: boolean;
}

export interface IncomeRecommendCard {
  incomeLabel: string;
  incomeMax: number;
  recommendedProductId: ProductId;
  reason: string;
  tip?: string;
}

export interface DuplicateRow {
  combination: string;           // "미래적금 + 도약계좌"
  possible: boolean;
  note: string;
}

export interface CautionCard {
  title: string;
  description: string;
  icon: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface RelatedLink {
  label: string;
  href: string;
  description: string;
}

export interface YouthSavingsReportData {
  meta: ReportMeta;
  kpis: KpiCard[];
  products: ProductRecord[];
  incomeContributions: IncomeContributionRow[];
  simulations: SimulationRow[];
  incomeRecommendCards: IncomeRecommendCard[];
  duplicateRows: DuplicateRow[];
  cautionCards: CautionCard[];
  faq: FaqItem[];
  relatedLinks: RelatedLink[];
}
```

### 5-2. 데이터 설계 원칙
- 금리·기여금은 공식 자료 기준으로 고정 입력. 추정값에는 `isEstimate: true` 처리.
- 청년희망적금은 `available: false`로 처리하고 비교표에 회색 처리.
- 만기 수령액 시뮬레이션은 단순 원리금 계산 기준이며, 실제 은행 우대금리 적용 시 달라질 수 있음을 명시.
- 모든 금액 단위는 `만 원` 기준으로 통일, 화면 표시만 억/만 원으로 포맷.

### 5-3. 초기 데이터 범위
- 상품 레코드: 3개
- 소득별 기여금 행: 청년도약계좌 5개 구간
- 시뮬레이션 행: 3개 (상품별 1개씩)
- 소득별 추천 카드: 4개 구간
- 중복 가입 행: 4개 조합
- 주의사항 카드: 3개
- FAQ: 5개

---

## 6. 페이지 구조

### 6-1. 전체 IA
1. `CalculatorHero`
2. `InfoNotice` (데이터 기준 안내 + 면책)
3. KPI 요약 카드 (3종)
4. 3개 상품 핵심 비교표
5. 소득 구간별 유불리 탭 + 추천 카드
6. 월 납입 기준 만기 수령액 시뮬레이션
7. 중복 가입 가능 여부
8. 주의사항 카드 (3종)
9. FAQ (5개)
10. 관련 콘텐츠 CTA
11. `SeoContent`

### 6-2. 모바일 우선 순서
- Hero
- InfoNotice
- KPI 카드 (3열 → 1열 스택)
- 핵심 비교표 (가로 스크롤)
- 소득 구간 탭 (3개 버튼)
- 추천 카드 (선택된 구간만 표시)
- 수령액 시뮬레이션 (세로 스택)
- 중복 가입 행 (세로 스택)
- 주의사항 카드 (세로 스택)
- FAQ
- CTA
- SEO

### 6-3. PC 레이아웃
- KPI 카드: 3열 가로
- 핵심 비교표: 전체폭, 3열 가로 비교
- 소득 탭 + 추천 카드: 탭 위 / 카드 아래
- 수령액 시뮬레이션: 3열 카드
- 중복 가입: 2열 테이블
- 주의사항 카드: 3열 그리드
- CTA: 3열 카드

---

## 7. 섹션별 구현 상세

### 7-1. Hero
- eyebrow: `청년 금융 상품 비교 리포트`
- H1: `청년미래적금 vs 청년도약계좌 완전 비교 2026`
- 서브카피: `가입 조건·정부 지원금·만기 수령액을 한번에 비교합니다`
- 설명:
  - 청년미래적금, 청년도약계좌, 청년희망적금의 조건과 혜택을 동일 기준으로 정리했습니다.
  - 소득 구간별 유불리와 만기 수령액 시뮬레이션을 확인하세요.

### 7-2. InfoNotice
- 필수 면책 문구:
  - 본 리포트는 금융위원회·서민금융진흥원 공개 자료를 기준으로 정리한 참고용 비교 콘텐츠입니다.
  - 금리·정부 기여금·가입 조건은 정책 변경에 따라 달라질 수 있습니다. 가입 전 공식 자료를 반드시 재확인하세요.
  - 만기 수령액 시뮬레이션은 단순 원리금 계산 기준이며 실제 수령액과 차이가 있을 수 있습니다.

### 7-3. KPI 요약 카드 (3종)

| 카드 | 값 | 설명 |
|------|-----|------|
| 청년미래적금 최대 혜택 | 월 기여금 + 비과세 | 소득 낮을수록 기여금 높음 |
| 청년도약계좌 만기 수령액 | 약 N천만 원 | 월 70만 원, 5년 기준 |
| 청년희망적금 | 신규 가입 종료 | 기존 가입자만 유지 가능 |

### 7-4. 3개 상품 핵심 비교표

#### 가로 3열 고정 비교 테이블

| 항목 | 청년미래적금 | 청년도약계좌 | 청년희망적금 |
|------|-----------|-----------|-----------|
| 가입 가능 | ✅ | ✅ | ❌ 종료 |
| 가입 나이 | 만 19~34세 | 만 19~34세 | 만 19~34세 |
| 개인소득 | 연 7,500만 원 이하 | 연 7,500만 원 이하 | 연 3,600만 원 이하 |
| 월 납입 | 최대 50만 원 | 최대 70만 원 | 최대 50만 원 |
| 기본 금리 | 연 4.5% | 연 4.5% | 연 5.0% |
| 정부 기여금 | 월 최대 3.3만 원 | 월 최대 2.4만 원 | 저축장려금 |
| 비과세 | ✅ | ✅ | ✅ |
| 만기 | 3년 | 5년 | 2년 |

- 청년희망적금 열 전체를 딤 처리 (`is-unavailable` 클래스)
- 각 행에서 상대적으로 유리한 항목에 하이라이트 처리

#### 모바일 처리
- 가로 스크롤 허용 (min-width: 640px)
- 상품명 행 sticky 검토

### 7-5. 소득 구간별 유불리 탭

#### 탭 3종
- `연 2,400만 원 이하` (기본 선택)
- `연 3,600만 원 이하`
- `연 5,000만 원 이하`

#### 탭 선택 시 표시 내용
- 해당 소득 구간의 추천 상품 카드 (강조 테두리)
- 청년도약계좌 해당 구간 정부 기여금 금액
- 추천 이유 1~2문장
- Tip 문구 (있는 경우)

#### 구현 방식
- JS로 탭 active 전환 + 추천 카드 하이라이트
- 탭 미선택 상태 없이 항상 1개 활성

### 7-6. 만기 수령액 시뮬레이션

- 섹션 제목: `월 50만 원 납입 기준 만기 수령액 비교`
- 설명: 세후 기준 단순 원리금 계산이며, 은행 우대금리 적용 시 달라질 수 있습니다.
- 3개 상품 카드 나열:
  - 상품명
  - 납입 기간
  - 본인 납입 총액
  - 정부 기여금 합계
  - 세후 이자
  - **예상 수령액 (강조)**
  - CSS 가로 바 (비례 너비)
- 청년희망적금은 딤 처리 + "신규 가입 불가" 배지

### 7-7. 중복 가입 가능 여부

- 섹션 제목: `중복 가입이 가능한가요?`
- 4개 조합 행:
  1. 미래적금 + 도약계좌 — ✅/❌ + 설명
  2. 미래적금 + ISA — 설명
  3. 도약계좌 + ISA — 설명
  4. 미래적금 + IRP — 설명

### 7-8. 주의사항 카드 (3종)

1. **소득 요건 착각** — 개인소득 기준 vs 가구소득 기준이 함께 적용됨. 부모와 합산하는 경우 주의
2. **중도 해지 불이익** — 정부 기여금 반환 + 비과세 혜택 소멸. 납입 여유가 있을 때만 가입
3. **가입 가능 기간** — 청년미래적금은 한시 상품일 수 있음. 공식 가입 마감일 확인 필요

### 7-9. FAQ (5개, 항상 visible)

1. 청년미래적금과 청년도약계좌 둘 다 가입할 수 있나요?
2. 소득이 없는 대학생도 가입할 수 있나요?
3. 청년희망적금은 지금도 가입 가능한가요?
4. 정부 기여금은 언제 지급되나요?
5. 중도 해지하면 어떻게 되나요?

### 7-10. 관련 콘텐츠 CTA (3개)

- `연금저축·IRP 비교 2026` → `/reports/pension-irp-comparison-2026/`
- `2026 연말정산 절세 전략` → `/reports/2026-year-end-tax-saving-guide/`
- `정부 복지지원금 완전 정복` → `/reports/2026-government-welfare-benefits/`

---

## 8. 인터랙션 설계 (`public/scripts/youth-savings-comparison-2026.js`)

### 8-1. 필요한 인터랙션
- 소득 구간 탭 전환 (탭 클릭 → 추천 카드 하이라이트)
- 탭 active 상태 전환

### 8-2. 스크립트 책임 범위
- `script[type="application/json"]`으로 데이터 주입
- 탭 클릭 이벤트 → `data-income-group` 속성으로 추천 카드 필터링
- DOM 업데이트만 담당
- Chart.js 불필요 (CSS bar row로 처리)

### 8-3. 구현 단순화 원칙
- 데이터는 페이지 내 JSON으로 전달, 외부 fetch 없음
- 소득 탭: 탭 클릭 시 해당 `data-income-group` 카드만 `is-visible` 토글
- JS 미동작 시 기본값(2,400만 원 이하 탭) 카드만 보이도록 처리

---

## 9. 스타일 가이드 (`_youth-savings-comparison-2026.scss`)

### 9-1. CSS prefix
- `ysc-` 사용
  - Youth Savings Comparison

### 9-2. 색상 방향
- 청년미래적금: `#6366f1` (인디고) — 신상품 강조
- 청년도약계좌: `#0891b2` (시안) — 기존 주력 상품
- 청년희망적금: `#9ca3af` (회색) — 종료 상품 딤 처리
- 추천 카드 하이라이트: `border: 2px solid` 해당 상품 색상
- 수령액 바: 금액 비례 너비, 인디고 그라데이션

### 9-3. 반응형 포인트
- 768px 이하:
  - KPI 카드 1열 스택
  - 비교표 가로 스크롤 (min-width: 640px)
  - 소득 탭 전체폭 flex
  - 수령액 카드 1열
  - 주의사항 카드 1열
- 1024px 이상:
  - KPI 카드 3열
  - 수령액 카드 3열
  - 주의사항 카드 3열
  - CTA 3열

---

## 10. SEO 설계

### 10-1. 메타 초안
- `seoTitle`: `청년미래적금 vs 청년도약계좌 완전 비교 2026 — 가입 조건·수령액·유불리 총정리 | 비교계산소`
- `seoDescription`: `청년미래적금, 청년도약계좌, 청년희망적금 가입 조건·정부 지원금·만기 수령액을 한 번에 비교합니다. 소득별 유불리 분석과 수령액 시뮬레이션 포함.`

### 10-2. 메인 키워드
- 청년미래적금
- 청년미래적금 청년도약계좌 비교
- 청년미래적금 가입조건
- 청년미래적금 수령액

### 10-3. 서브 키워드
- 청년도약계좌 소득 기여금
- 청년 저축 상품 비교 2026
- 청년도약계좌 vs 청년희망적금

### 10-4. 롱테일 키워드
- 청년미래적금 중도해지
- 청년미래적금 청년도약계좌 중복 가입
- 청년미래적금 얼마 받나
- 소득 없는 대학생 청년도약계좌 가입

---

## 11. 구현 체크리스트

### 11-1. 데이터
- [ ] `src/data/youthSavingsComparison2026.ts` 생성
- [ ] 금융위·서민금융진흥원 공식 자료로 3개 상품 레코드 확정 입력
- [ ] 소득별 기여금 구간 테이블 입력
- [ ] 만기 수령액 시뮬레이션 값 입력 (50만 원 기준)
- [ ] 소득별 추천 카드 4종 입력
- [ ] 중복 가입 가능 여부 4종 입력
- [ ] 주의사항 카드 3종 입력
- [ ] FAQ 5개 입력
- [ ] KPI 카드 3종 값 확정

### 11-2. 페이지
- [ ] `src/pages/reports/youth-savings-comparison-2026.astro` 생성
- [ ] `CalculatorHero`, `InfoNotice`, `SeoContent` 적용
- [ ] KPI 카드 마크업
- [ ] 3개 상품 비교표 마크업
- [ ] 소득 구간 탭 + 추천 카드 마크업
- [ ] 수령액 시뮬레이션 카드 마크업
- [ ] 중복 가입 행 마크업
- [ ] 주의사항 카드 마크업
- [ ] FAQ 마크업 (항상 visible)
- [ ] CTA 마크업

### 11-3. 스크립트
- [ ] `public/scripts/youth-savings-comparison-2026.js` 생성
- [ ] 소득 탭 이벤트 처리
- [ ] 추천 카드 하이라이트 토글
- [ ] JS 미동작 시 기본 탭 카드 visible 유지

### 11-4. 스타일
- [ ] `_youth-savings-comparison-2026.scss` 생성
- [ ] `src/styles/app.scss`에 import 추가
- [ ] 모바일 우선 반응형 적용
- [ ] 비교표 가로 스크롤 처리
- [ ] 청년희망적금 딤 처리 스타일

### 11-5. 사이트 반영
- [ ] `src/data/reports.ts` 등록 (order: 25.3, category: asset)
- [ ] `src/pages/reports/index.astro` reportMetaBySlug 추가
- [ ] `public/sitemap.xml` 추가
- [ ] `npm run build` 확인

---

## 12. QA 기준

### 12-1. 콘텐츠 QA
- KPI 카드 값이 비교표 데이터와 모순되지 않는가
- 청년희망적금 `신규 가입 불가` 배지가 명확하게 표시되는가
- InfoNotice 면책 문구가 노출되는가
- 만기 수령액이 `추정` 또는 `참고용` 임을 명시하는가
- 데이터 기준일이 명시되어 있는가

### 12-2. 데이터 QA
- 소득별 기여금 구간이 실제 서민금융진흥원 공시와 일치하는가
- 비교표 금리·기여금이 최신 자료와 일치하는가
- 중복 가입 가능 여부가 최신 정책과 일치하는가

### 12-3. UI QA
- 모바일에서 비교표가 가로 스크롤로 안전하게 표시되는가
- 소득 탭 전환 시 추천 카드가 정상 하이라이트되는가
- 청년희망적금 열/카드가 딤 처리되는가
- KPI 카드가 모바일 1열로 자연스럽게 쌓이는가

### 12-4. 인터랙션 QA
- 탭 전환 시 카드 전환이 부드럽게 동작하는가
- JS 없이도 기본 탭(2,400만 원 이하) 카드가 노출되는가
- FAQ가 항상 visible 상태로 표시되는가

---

## 13. 개발 메모

- 이 리포트의 생명력은 **데이터 정확성**에 달려 있다. 금융 상품 조건 오류는 신뢰도 직결 이슈.
- 구현 시작 전 반드시 금융위원회 보도자료·서민금융진흥원 공식 페이지에서 최신 수치를 확인한다.
- 청년미래적금은 2026년 신상품으로 출시 초기 정보가 유동적일 수 있으므로, 데이터 기준일을 페이지에 명시하고 `updatedAt` 필드로 관리한다.
- 구현 시작 순서:
  1. 금융위·서민금융진흥원 공식 자료 수집 → 데이터 확정
  2. `src/data/youthSavingsComparison2026.ts` 작성
  3. `.astro` 페이지 마크업 조립
  4. 소득 탭 JS 구현
  5. 스타일 적용
  6. 사이트맵·리포트 허브 등록
- 향후 2차에서 **청년미래적금 계산기** (`/tools/youth-future-savings-calculator/`) 연결을 고려해 CTA 슬롯을 미리 확보해둔다.
