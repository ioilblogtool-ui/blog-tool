# 반도체 ETF 리포트 설계 문서

> 기획 원문: `docs/plan/202604/semiconductor-etf-report-plan-v1.md`
> 작성일: 2026-04-09
> 구현 기준: Claude/Codex가 이 문서를 보고 바로 페이지 구현에 착수할 수 있는 수준으로 고정

---

## 1. 문서 개요

### 1-1. 대상

- 기획 문서: `docs/plan/202604/semiconductor-etf-report-plan-v1.md`
- 구현 대상: `미국·한국 반도체 ETF 비교 2026 — 구성 종목, 실적, 시총, 장단점 총정리`
- 참고 리포트:
  - `us-rich-top10-patterns` (카드 + 탭 패턴)
  - `korea-rich-top10-assets` (비교 표 패턴)
  - `large-company-salary-growth-by-years-2026` (데이터 테이블 + 탭 패턴)

### 1-2. 문서 역할

- 기획 문서를 현재 비교계산소 `/reports/` 구조에 맞게 실제 구현 직전 수준으로 재구성한 설계 문서다.
- 화면 구조, 데이터 스키마, 섹션 목적, 인터랙션, CTA 흐름, SEO, QA 기준을 고정한다.
- 이후 구현자는 이 문서를 기준으로 `src/data/`, `src/pages/reports/`, `public/scripts/`, `src/styles/` 작업을 진행한다.

### 1-3. 페이지 성격

- 계산기보다 `리포트형 인터랙티브 비교 페이지`
- 핵심 흐름: `ETF 개요 파악 → 구성 종목 확인 → 시총 순위 이해 → 기업 실적 탐색 → 장단점 비교 → 투자자 성향 매칭 → 관련 계산기 연결`
- SEO 유입형이지만 블로그형 긴 글이 아니라 `비교 표 + 카드 + 탭 필터` 중심 구조로 간다.
- 차별화: ETF 나열이 아닌 "이 ETF 사면 어떤 회사에 투자하는 건지"를 즉시 보여주는 포맷

### 1-4. 권장 slug

- `semiconductor-etf-2026`
- URL: `/reports/semiconductor-etf-2026/`

### 1-5. 권장 파일 구조

```
src/
  data/
    etf/
      us-etf.ts                           ← 미국 ETF 목록 + 구성 종목 + 장단점
      kr-etf.ts                           ← 한국 ETF 목록 + 구성 종목 + 장단점
    companies/
      semiconductor.ts                    ← 기업 실적 / 시총 / 직원 수
  pages/
    reports/
      semiconductor-etf-2026.astro        ← 메인 리포트 페이지

public/
  scripts/
    semiconductor-etf-2026.js            ← 클라이언트 인터랙션
  og/
    reports/
      semiconductor-etf-2026.png         ← OG 이미지

src/styles/scss/pages/
  _semiconductor-etf-2026.scss           ← 페이지 전용 스타일
```

---

## 2. 현재 프로젝트 기준 정리

### 2-1. 리포트 공통 구조

현재 `/reports/` 콘텐츠는 아래 흐름을 따른다.

1. `CalculatorHero` (또는 리포트용 Hero 인라인)
2. `InfoNotice`
3. 상단 요약 카드 (KPI)
4. 핵심 비교 표 또는 선택 UI
5. 상세 탐색 카드
6. 패턴/해설 블록
7. FAQ
8. 관련 계산기 / 리포트 CTA
9. `SeoContent`

### 2-2. 현재 구현 패턴

- 메타 등록: `src/data/reports.ts`
- 허브 노출: `src/pages/reports/index.astro`
- 페이지 데이터: `src/data/<topic>.ts`
- 페이지 마크업: `src/pages/reports/<slug>.astro`
- 클라이언트 인터랙션: `public/scripts/<slug>.js`
- 페이지 전용 스타일: `src/styles/scss/pages/_<slug>.scss`
- 사이트맵: `public/sitemap.xml`

### 2-3. 이번 리포트가 따라야 할 방향

- `us-rich-top10-patterns`에서 가져올 것
  - 상단 select 또는 탭 → 하단 detail card 연동
  - 카드 기반 정보 압축, 무거운 차트 최소화
- `large-company-salary-growth-by-years-2026`에서 가져올 것
  - 탭 필터 (미국/한국 토글)
  - 데이터 테이블 패턴
- 이번 페이지에서 새롭게 강조할 것
  - `ETF → 구성 종목 → 기업 실적` 3단계 탐색 흐름
  - 글로벌 반도체 시총 시각화 (CSS bar row 우선)
  - 투자 성향별 ETF 매칭 가이드

---

## 3. 구현 범위

### 3-1. MVP 범위

- 미국 ETF 4종, 한국 ETF 6종 고정 데이터 제공
  - SOXX, SMH, XSD, PSI
  - TIGER 미국필라델피아반도체나스닥, TIGER 반도체
  - RISE AI반도체TOP10, RISE 미국반도체NYSE
  - ACE AI반도체TOP3+, ACE 글로벌반도체TOP4 Plus
- 글로벌 반도체 시총 TOP 10 기업 카드 (고정 데이터)
- 대표 기업 실적 카드 5종 (NVIDIA, TSMC, Samsung, SK hynix, ASML)
- ETF 비교 표 (미국 / 한국 탭 전환)
- 구성 종목 비교 표
- 투자 성향 매칭 (정적 표 우선, 인터랙티브 선택은 선택 구현)
- 장단점 요약 카드
- FAQ
- 관련 계산기 / 리포트 내부 링크

### 3-2. MVP 제외 범위

- 실시간 ETF 시세 / NAV 연동
- 실적 자동 업데이트 API
- 포트폴리오 시뮬레이션 계산기 (내부 링크로 연결만)
- 차트 라이브러리 (Chart.js): 별도 필요 판단 시 도입, 기본은 CSS bar row
- 시계열 수익률 차트

---

## 4. 페이지 목적

- 반도체 ETF 입문자가 "ETF 하나 사면 어떤 회사에 투자하는 건지"를 한 페이지에서 바로 파악하게 한다.
- 미국 ETF와 한국 ETF를 나란히 비교하고, 구성 종목과 투자 성향별로 선택할 수 있는 기준을 제공한다.
- 리포트에서 끝나지 않고 적립식 투자 계산기, DCA 계산기로 자연스럽게 이어지게 한다.

---

## 5. 핵심 사용자 시나리오

### 5-1. 반도체 ETF 입문자

- `반도체 ETF 추천`, `SOXX SMH 차이` 검색 후 유입한다.
- 먼저 미국 대표 ETF와 한국 대표 ETF를 비교 표로 훑는다.
- 구성 종목 섹션에서 각 ETF가 어떤 기업을 담는지 확인한다.
- 장단점 요약과 투자 성향 매칭에서 자신에게 맞는 ETF를 결정한다.

### 5-2. 엔비디아 / 삼성전자 집중 투자자

- `엔비디아 포함 ETF`, `삼성전자 ETF` 검색 후 유입한다.
- 구성 종목 비중 표에서 원하는 기업의 비중을 바로 확인한다.
- 상위 기업 실적 카드로 투자 근거를 보완한다.

### 5-3. 미국 vs 한국 ETF 고민 사용자

- `미국 반도체 ETF vs 한국 반도체 ETF`를 직접 비교하고 싶어한다.
- 비교 표에서 운용사, 추종 구조, 대표 종목, 장단점을 나란히 본다.
- 투자 성향 매칭 섹션에서 결론을 내린다.

### 5-4. 일반 검색 유입 사용자

- `반도체 ETF 2026`, `반도체 시총 순위` 검색으로 들어와 핵심 수치와 비교만 빠르게 읽는다.

---

## 6. 입력값 / 출력값 정의

### 6-1. 입력값

이 리포트는 계산기가 아니므로 사용자 입력은 최소화한다.

| 입력 | 설명 | 기본값 |
|------|------|--------|
| `marketTab` | 미국 / 한국 ETF 탭 전환 | `us` |
| `companyTab` | 기업 카드 필터 (전체/GPU/메모리/장비/파운드리) | `all` |
| `investorType` | 투자 성향 매칭 select (선택 구현) | — |

URL 파라미터 동기화: MVP에서는 미구현, 이후 확장 대비로만 정의.

### 6-2. 출력값

| 출력 | 설명 |
|------|------|
| ETF 비교 표 | 탭 기준 미국/한국 ETF 목록 렌더링 |
| 구성 종목 표 | ETF별 상위 보유 종목 및 비중 |
| 시총 순위 bar row | TOP 10 기업 시총 시각화 |
| 기업 실적 카드 | 필터 탭 기준 기업 카드 노출 |
| 투자 성향 매칭 결과 | 성향에 맞는 ETF 강조 표시 |

---

## 7. 데이터 구조

### 7-1. `src/data/etf/us-etf.ts`

```ts
export type EtfMarket = 'US' | 'KR';
export type EtfType = '집중형' | '분산형' | '균등형' | '글로벌형';

export interface EtfHolding {
  ticker: string;
  name: string;
  weight: number; // 비중 (%)
}

export interface EtfRecord {
  ticker: string;
  name: string;          // 한글명 포함 전체 명칭
  manager: string;       // 운용사
  market: EtfMarket;
  type: EtfType;
  ter?: number;          // 총보수 (%)
  ytd?: number;          // YTD 수익률 (%, 선택)
  holdings: EtfHolding[];
  pros: string[];
  cons: string[];
  bestFor: string;       // 추천 투자 성향 1줄
}

export const US_ETFS: EtfRecord[] = [
  {
    ticker: 'SMH',
    name: 'VanEck Semiconductor ETF',
    manager: 'VanEck',
    market: 'US',
    type: '집중형',
    ter: 0.35,
    holdings: [
      { ticker: 'NVDA', name: 'NVIDIA',   weight: 19.23 },
      { ticker: 'TSM',  name: 'TSMC',     weight: 11.59 },
      { ticker: 'AVGO', name: 'Broadcom', weight: 8.06  },
      { ticker: 'INTC', name: 'Intel',    weight: 4.98  },
      { ticker: 'AMD',  name: 'AMD',      weight: 4.89  },
      { ticker: 'KLAC', name: 'KLA',      weight: 4.78  },
      { ticker: 'ASML', name: 'ASML',     weight: 4.73  },
    ],
    pros: ['NVIDIA·TSMC·Broadcom 중심 강한 성장 노출', '상승장 탄력'],
    cons: ['상위 종목 쏠림 큼', '특정 기업 조정 시 변동성 확대'],
    bestFor: '수익률에 민감한 사람',
  },
  {
    ticker: 'SOXX',
    name: 'iShares PHLX Semiconductor ETF',
    manager: 'iShares',
    market: 'US',
    type: '분산형',
    ter: 0.35,
    holdings: [
      // 상위 5종목 예시 (수정 시가총액 가중 기준)
      { ticker: 'NVDA', name: 'NVIDIA',   weight: 8.5  },
      { ticker: 'AVGO', name: 'Broadcom', weight: 8.4  },
      { ticker: 'AMD',  name: 'AMD',      weight: 8.2  },
      { ticker: 'QCOM', name: 'Qualcomm', weight: 8.1  },
      { ticker: 'TSM',  name: 'TSMC',     weight: 8.0  },
    ],
    pros: ['미국 반도체 정석형', '대표성 높음', '30종목 균형 분산'],
    cons: ['대형주 영향력 큼', 'SMH 대비 상승 탄력 낮을 수 있음'],
    bestFor: '처음 반도체 ETF를 시작하는 사람',
  },
  {
    ticker: 'XSD',
    name: 'SPDR S&P Semiconductor ETF',
    manager: 'SPDR',
    market: 'US',
    type: '균등형',
    ter: 0.35,
    holdings: [],
    pros: ['상대적 분산형', '대형주 편중 완화'],
    cons: ['직관성 다소 낮음', '유동성 SMH·SOXX 대비 낮음'],
    bestFor: '대형주 집중 편중이 싫은 사람',
  },
  {
    ticker: 'PSI',
    name: 'Invesco Semiconductors ETF',
    manager: 'Invesco',
    market: 'US',
    type: '분산형',
    ter: 0.56,
    holdings: [],
    pros: ['미국 반도체 설계·제조·장비 고르게 분산'],
    cons: ['보수율 상대적으로 높음', '인지도 낮음'],
    bestFor: '업종 전반에 고르게 분산하고 싶은 사람',
  },
];
```

### 7-2. `src/data/etf/kr-etf.ts`

```ts
import type { EtfRecord } from './us-etf';

export const KR_ETFS: EtfRecord[] = [
  {
    ticker: 'TIGER-반도체',
    name: 'TIGER 미국필라델피아반도체나스닥',
    manager: '미래에셋',
    market: 'KR',
    type: '집중형',
    holdings: [],
    pros: ['원화로 미국 필라델피아 반도체 지수 추종', '접근성 높음'],
    cons: ['환율 구조 이해 필요', 'SOXX와 유사해 차별성 낮음'],
    bestFor: '원화로 미국 반도체 지수에 투자하고 싶은 사람',
  },
  {
    ticker: 'RISE-AI반도체TOP10',
    name: 'RISE AI반도체TOP10',
    manager: 'KB자산운용',
    market: 'KR',
    type: '집중형',
    holdings: [
      { ticker: '005930', name: '삼성전자',   weight: 15.36 },
      { ticker: '000660', name: 'SK하이닉스', weight: 15.27 },
      { ticker: '095340', name: 'ISC',        weight: 13.00 },
      { ticker: '007660', name: '이수페타시스',weight: 10.16 },
      { ticker: '058470', name: '리노공업',   weight: 9.41  },
      { ticker: '240810', name: '원익IPS',    weight: 9.29  },
      { ticker: '042700', name: '한미반도체', weight: 9.02  },
    ],
    pros: ['국내 HBM·테스트·장비·후공정까지 반영', '이해하기 쉬움'],
    cons: ['10종목 집중으로 변동성 큼'],
    bestFor: '국내 AI 반도체 밸류체인에 집중 투자하고 싶은 사람',
  },
  {
    ticker: 'RISE-미국반도체NYSE',
    name: 'RISE 미국반도체NYSE',
    manager: 'KB자산운용',
    market: 'KR',
    type: '분산형',
    holdings: [
      { ticker: 'AVGO', name: 'Broadcom',           weight: 8.43 },
      { ticker: 'NVDA', name: 'NVIDIA',             weight: 8.10 },
      { ticker: 'MU',   name: 'Micron',             weight: 7.38 },
      { ticker: 'AMD',  name: 'AMD',                weight: 6.65 },
      { ticker: 'AMAT', name: 'Applied Materials',  weight: 5.72 },
      { ticker: 'MRVL', name: 'Marvell',            weight: 5.40 },
      { ticker: 'INTC', name: 'Intel',              weight: 4.68 },
    ],
    pros: ['원화로 미국 반도체 접근 쉬움', 'NYSE 상장 반도체 전반 분산'],
    cons: ['환율 구조 이해 필요'],
    bestFor: '원화로 미국 반도체에 분산 투자하고 싶은 사람',
  },
  {
    ticker: 'ACE-AI반도체TOP3',
    name: 'ACE AI반도체TOP3+',
    manager: '한국투자신탁운용',
    market: 'KR',
    type: '집중형',
    holdings: [
      { ticker: '005930', name: '삼성전자',   weight: 0 },
      { ticker: '000660', name: 'SK하이닉스', weight: 0 },
      { ticker: '042700', name: '한미반도체', weight: 0 },
    ],
    pros: ['삼성·SK하이닉스·한미반도체 핵심 압축'],
    cons: ['집중도 매우 높음', '3종목 리스크 그대로 흡수'],
    bestFor: '핵심 3종목으로 압축 투자하고 싶은 사람',
  },
  {
    ticker: 'ACE-글로벌반도체TOP4',
    name: 'ACE 글로벌반도체TOP4 Plus',
    manager: '한국투자신탁운용',
    market: 'KR',
    type: '글로벌형',
    holdings: [],
    pros: ['TSMC, ASML 등 글로벌 핵심 기업 포함', '해외 노출'],
    cons: ['구성 종목 변경 가능성 있음', '글로벌형 특성상 환율 영향'],
    bestFor: '국내·미국·글로벌 반도체를 한 ETF로 압축하고 싶은 사람',
  },
  {
    ticker: 'TIGER-반도체KR',
    name: 'TIGER 반도체',
    manager: '미래에셋',
    market: 'KR',
    type: '분산형',
    holdings: [],
    pros: ['국내 반도체 대표주 + 장비주 고르게 포함', '유동성 양호'],
    cons: ['삼성전자 의존도 큼'],
    bestFor: '국내 반도체 전반에 분산 투자하고 싶은 사람',
  },
];
```

### 7-3. `src/data/companies/semiconductor.ts`

```ts
export type CompanySegment = 'GPU' | '메모리' | '파운드리' | '팹리스' | '장비';
export type CompanyCountry = 'US' | 'KR' | 'TW' | 'NL';

export interface CompanyRevenue {
  value: number;
  unit: string;   // 'B USD', 'T KRW', 'B EUR', 'NT$B' 등
  period: string; // 'FY2026', '2025' 등
}

export interface CompanyRecord {
  rank: number;
  name: string;
  ticker: string;
  country: CompanyCountry;
  segment: CompanySegment;
  marketCapUsd: number;       // 시가총액 (USD)
  revenue?: CompanyRevenue;
  operatingIncome?: CompanyRevenue;
  employees?: number;
  hq: string;
  recentNote: string;         // 최근 포인트 1~2줄
  includedIn: string[];       // 포함 ETF 티커 목록
}

export const SEMICONDUCTOR_COMPANIES: CompanyRecord[] = [
  {
    rank: 1,
    name: 'NVIDIA',
    ticker: 'NVDA',
    country: 'US',
    segment: 'GPU',
    marketCapUsd: 4_425_000_000_000,
    revenue: { value: 215.9, unit: 'B USD', period: 'FY2026' },
    employees: 42_000,
    hq: 'Santa Clara, CA',
    recentNote: 'AI 인프라 수요로 고성장 지속. 데이터센터 GPU 압도적 점유율.',
    includedIn: ['SOXX', 'SMH', 'RISE-미국반도체NYSE'],
  },
  {
    rank: 2,
    name: 'TSMC',
    ticker: 'TSM',
    country: 'TW',
    segment: '파운드리',
    marketCapUsd: 1_897_000_000_000,
    revenue: { value: 3_809.05, unit: 'NT$B', period: '2025' },
    hq: 'Hsinchu, Taiwan',
    recentNote: '2025년 Foundry 2.0 기준 파운드리 점유율 선두. AI칩 제조 핵심.',
    includedIn: ['SMH', 'SOXX', 'ACE-글로벌반도체TOP4'],
  },
  {
    rank: 3,
    name: 'Broadcom',
    ticker: 'AVGO',
    country: 'US',
    segment: '팹리스',
    marketCapUsd: 1_662_000_000_000,
    hq: 'San Jose, CA',
    recentNote: '네트워킹 반도체 및 AI ASIC 설계. VMware 인수 후 소프트웨어 비중 확대.',
    includedIn: ['SOXX', 'SMH', 'RISE-미국반도체NYSE'],
  },
  {
    rank: 4,
    name: 'Samsung Electronics',
    ticker: '005930',
    country: 'KR',
    segment: '메모리',
    marketCapUsd: 908_950_000_000,
    revenue: { value: 333.6, unit: 'T KRW', period: '2025' },
    operatingIncome: { value: 43.6, unit: 'T KRW', period: '2025' },
    hq: '수원 / 서울',
    recentNote: 'AI 메모리 수요로 실적 개선. HBM 경쟁력 강화 과제.',
    includedIn: ['RISE-AI반도체TOP10', 'ACE-AI반도체TOP3'],
  },
  {
    rank: 5,
    name: 'ASML',
    ticker: 'ASML',
    country: 'NL',
    segment: '장비',
    marketCapUsd: 557_980_000_000,
    revenue: { value: 32.7, unit: 'B EUR', period: '2025' },
    operatingIncome: { value: 11.3, unit: 'B EUR', period: '2025' },
    hq: 'Veldhoven, Netherlands',
    recentNote: 'EUV 노광장비 독점. 첨단 공정 핵심 공급사. 수출규제 이슈 지속.',
    includedIn: ['SMH', 'SOXX', 'ACE-글로벌반도체TOP4'],
  },
  {
    rank: 6,
    name: 'SK hynix',
    ticker: '000660',
    country: 'KR',
    segment: '메모리',
    marketCapUsd: 478_290_000_000,
    revenue: { value: 97.1467, unit: 'T KRW', period: '2025' },
    operatingIncome: { value: 47.2063, unit: 'T KRW', period: '2025' },
    employees: 46_863,
    hq: '이천',
    recentNote: 'HBM 경쟁력 강화. 2025년 사상 최대 실적. AI 메모리 수혜 핵심.',
    includedIn: ['RISE-AI반도체TOP10', 'ACE-AI반도체TOP3'],
  },
  {
    rank: 7,
    name: 'Micron',
    ticker: 'MU',
    country: 'US',
    segment: '메모리',
    marketCapUsd: 458_680_000_000,
    hq: 'Boise, ID',
    recentNote: 'HBM 진입 확대. DRAM·NAND 시장 3위권. AI 메모리 투자 확대.',
    includedIn: ['SOXX', 'RISE-미국반도체NYSE'],
  },
  {
    rank: 8,
    name: 'AMD',
    ticker: 'AMD',
    country: 'US',
    segment: '팹리스',
    marketCapUsd: 377_960_000_000,
    hq: 'Santa Clara, CA',
    recentNote: 'CPU·GPU 시장에서 Intel·NVIDIA와 경쟁. AI 가속기 MI 시리즈 확대.',
    includedIn: ['SOXX', 'SMH', 'RISE-미국반도체NYSE'],
  },
  {
    rank: 9,
    name: 'Lam Research',
    ticker: 'LRCX',
    country: 'US',
    segment: '장비',
    marketCapUsd: 309_590_000_000,
    hq: 'Fremont, CA',
    recentNote: '식각·증착 반도체 장비 1위. 첨단 공정 장비 핵심 공급사.',
    includedIn: ['SOXX'],
  },
  {
    rank: 10,
    name: 'Applied Materials',
    ticker: 'AMAT',
    country: 'US',
    segment: '장비',
    marketCapUsd: 306_110_000_000,
    hq: 'Santa Clara, CA',
    recentNote: '반도체 장비 시장 선두권. CVD·PVD 등 다양한 공정 장비 커버.',
    includedIn: ['SOXX', 'RISE-미국반도체NYSE'],
  },
];

// 데이터 기준일
export const DATA_UPDATED_AT = '2026-04-09';
```

---

## 8. 페이지 구조

### 8-1. 전체 IA

1. Hero
2. `InfoNotice` (데이터 기준일 + 투자 권유 아님 주의)
3. 요약 카드 4종 (미국 ETF / 한국 ETF / 대표 기업 / 핵심 차이)
4. ETF 비교 표 (미국 / 한국 탭)
5. 구성 종목 비교 표
6. 글로벌 반도체 시총 TOP 10 (CSS bar row)
7. 기업 실적 카드 5종 (세그먼트 탭 필터)
8. ETF 장단점 요약 카드
9. 투자 성향 매칭 가이드
10. FAQ
11. 관련 계산기 / 리포트 CTA
12. `SeoContent`

### 8-2. 모바일 우선 순서

- Hero
- 기준 안내 (InfoNotice)
- 요약 카드 (2열 2행)
- ETF 비교 표 (탭 전환, 가로 스크롤 허용)
- 구성 종목 표 (가로 스크롤 허용)
- 시총 bar row (1열 세로 스택)
- 기업 카드 (1열 세로 스택, 탭 필터)
- 장단점 카드 (1열)
- 매칭 가이드 (1열 표)
- FAQ
- CTA
- SEO

### 8-3. PC 레이아웃

- 요약 카드: 4열 1행
- ETF 비교 표: 전체폭
- 구성 종목 표: 전체폭
- 시총 bar row: 좌 60% + 우 40% 레이아웃 또는 전체폭
- 기업 카드: 2~3열 그리드
- 장단점 카드: 2열 (미국 / 한국)
- CTA: 3열 카드

---

## 9. 섹션별 구현 상세

### 9-1. Hero

```
eyebrow: 투자 데이터 리포트
H1: 반도체 ETF, 어떤 회사를 담고 있나?
서브카피: 미국·한국 반도체 ETF 10종의 구성 종목, 실적, 시총을 한눈에 비교합니다
CTA 버튼: [ETF 비교 바로가기 ↓]  [적립식 계산기 →]
기준일 표시: 2026-04-09 기준
```

### 9-2. InfoNotice

필수 문구:
- 구성 종목 데이터는 각 운용사 공식 자료 기반의 비교용 참고 데이터임
- 실제 ETF 비중은 변동될 수 있으며 투자 전 공식 팩트시트를 확인할 것
- 투자 권유가 아님
- 기준 시점: `2026-04-09`

### 9-3. 요약 카드 4종

| 카드 | 내용 |
|------|------|
| 미국 대표 ETF | SOXX / SMH / XSD / PSI |
| 한국 대표 ETF | TIGER / RISE AI반도체TOP10 / ACE AI반도체TOP3+ / RISE 미국반도체NYSE 외 |
| 대표 구성 기업 | NVIDIA, TSMC, Broadcom, Samsung, SK hynix, ASML |
| 핵심 차이 | 대형주 집중형 / 분산형 / 국내형 / 미국형 / 글로벌형 |

### 9-4. ETF 비교 표 (미국 / 한국 탭)

**컬럼 구성**

| 컬럼 | 설명 |
|------|------|
| ETF명 | 티커 + 한글명 |
| 국가/시장 | 미국 / 한국 |
| 운용사 | iShares, VanEck, KB, 미래에셋 등 |
| 추종 구조 | 집중형 / 분산형 / 균등형 / 글로벌형 |
| 대표 구성 기업 | 상위 3~5종목 |
| 장점 | 1~2줄 |
| 단점 | 1~2줄 |
| 추천 투자 성향 | 1줄 |

**인터랙션**: `[미국 ETF]` `[한국 ETF]` 탭 전환  
모바일: 가로 스크롤 허용

### 9-5. 구성 종목 비교 표

ETF별 상위 보유 종목과 비중을 나열하는 표.

| 컬럼 | 설명 |
|------|------|
| ETF | 티커 |
| 상위 종목 1 | 종목명 (비중%) |
| 상위 종목 2 | 종목명 (비중%) |
| 상위 종목 3 | 종목명 (비중%) |
| ... | ... |

미국 / 한국 ETF를 각각 별도 표로 분리.  
모바일: 가로 스크롤 허용.

### 9-6. 글로벌 반도체 시총 TOP 10

CSS bar row 방식으로 구현 (Chart.js 사용 안 함).  

각 행 구성:
```
순위  기업명 (국가 뱃지)  사업 포지션
     ████████████████░░░░░░  $4.43T
     주요 포함 ETF 뱃지
```

시총 bar의 max 기준: NVIDIA 시총을 100%로 설정.

### 9-7. 기업 실적 카드 5종

**탭 필터**: `전체` `GPU` `메모리` `파운드리` `팹리스` `장비`

**카드 구성**

```
기업명 (국가 뱃지)
사업 포지션
────────────────
시가총액: $X.XXX T
최근 연매출: XXX (기준 기간)
직원 수 / 본사 위치 (있는 경우)
────────────────
최근 포인트 (1~2줄)
포함 ETF 뱃지 행
```

표시 기업: NVIDIA, TSMC, Samsung Electronics, SK hynix, ASML

### 9-8. ETF 장단점 요약 카드

미국 ETF 3종 (SOXX, SMH, XSD) + 한국 ETF 3종 (RISE AI반도체TOP10, ACE AI반도체TOP3+, RISE 미국반도체NYSE)  
각 카드: ETF명 + 장점 (badge/list) + 단점 (badge/list) + 추천 한 줄

2열 레이아웃 (미국 | 한국), 모바일 1열.

### 9-9. 투자 성향 매칭 가이드

정적 표 우선 구현. select 인터랙션은 선택.

| 성향 | 추천 ETF |
|------|---------|
| 엔비디아 집중 원함 | SMH |
| 분산 원함 | XSD, PSI |
| 국내 HBM 원함 | RISE AI반도체TOP10 |
| 원화로 미국 반도체 | RISE 미국반도체NYSE, TIGER 미국필라델피아반도체나스닥 |
| 글로벌 압축형 | ACE 글로벌반도체TOP4 Plus |
| 처음 시작 | SOXX |

### 9-10. FAQ

5개 고정:
1. SOXX와 SMH의 차이는 무엇인가?
2. 한국 ETF와 미국 ETF 중 어떤 것을 사야 하나?
3. 삼성전자나 SK하이닉스에 투자하려면 어떤 ETF가 맞나?
4. 반도체 ETF에서 NVIDIA 비중이 가장 높은 것은?
5. 이 데이터는 얼마나 자주 업데이트되나?

### 9-11. 관련 계산기 / 리포트 CTA

계산기 CTA 2개:
- `적립식 투자 수익 계산기`
- `DCA 계산기`

리포트 CTA 2개:
- `SOXX vs SMH 비교 리포트` (예정, 링크 비활성)
- `한국 반도체 ETF 총정리` (예정, 링크 비활성)

---

## 10. 인터랙션 설계 (`public/scripts/semiconductor-etf-2026.js`)

### 10-1. 필요한 인터랙션

| 인터랙션 | 설명 |
|---------|------|
| ETF 탭 전환 | `[미국 ETF]` / `[한국 ETF]` 클릭 시 비교 표 교체 |
| 기업 탭 필터 | 세그먼트 탭 클릭 시 기업 카드 필터링 |
| 투자 성향 select | (선택) 성향 선택 시 매칭 ETF 강조 |

### 10-2. 스크립트 책임 범위

- `data-tab` 속성 기반 탭 전환 처리
- `data-segment` 속성 기반 카드 show/hide
- URL 파라미터 동기화: MVP 제외

### 10-3. 데이터 주입 방식

```astro
<!-- .astro 파일에서 JSON 주입 -->
<script type="application/json" id="se-us-etfs">
  {JSON.stringify(US_ETFS)}
</script>
<script type="application/json" id="se-kr-etfs">
  {JSON.stringify(KR_ETFS)}
</script>
```

JS에서 `JSON.parse(document.getElementById(...).textContent)` 로 읽음.

---

## 11. 스타일 가이드 (`_semiconductor-etf-2026.scss`)

### 11-1. CSS prefix

`se26-` 사용 (Semiconductor ETF 2026)

### 11-2. 톤 앤 매너

- 금융 데이터 리포트 느낌: 딥 네이비, 화이트, 포인트 컬러
- 색상 방향
  - 미국 ETF: 딥 블루 계열
  - 한국 ETF: 딥 그린 계열
  - 시총 bar: 포인트 컬러 (accent)
  - 경고/주의 문구: 앰버
- 과한 gradient, 장식용 배지 남용 금지

### 11-3. 반응형 포인트

- 768px 이하
  - 요약 카드 2열 2행
  - 비교 표 가로 스크롤
  - 기업 카드 1열
  - 장단점 카드 1열
- 1024px 이상
  - 요약 카드 4열 1행
  - 기업 카드 2~3열
  - 장단점 카드 2열

---

## 12. SEO 설계

### 12-1. 메타 초안

```
seoTitle: 미국·한국 반도체 ETF 비교 2026 — SOXX, SMH, TIGER, RISE, ACE 구성 종목 총정리
seoDescription: SOXX, SMH, TIGER 반도체, RISE AI반도체TOP10, ACE AI반도체TOP3+ 등 10종 ETF의 구성 종목, 운용사, 장단점을 한눈에 비교합니다.
canonical: https://bigyocalc.com/reports/semiconductor-etf-2026/
ogType: article
```

### 12-2. 메인 키워드

- 미국 반도체 ETF 추천
- 한국 반도체 ETF 비교
- SOXX SMH 차이
- 반도체 ETF 2026

### 12-3. 서브 키워드

- 엔비디아 포함 ETF
- 삼성전자 ETF
- SK하이닉스 ETF
- RISE AI반도체TOP10

### 12-4. 롱테일 키워드

- 반도체 ETF 하나 사면 어떤 회사에 투자하나
- SOXX SMH TIGER 반도체 ETF 구성 종목 비교
- 한국 미국 반도체 ETF 차이
- 엔비디아 비중 높은 ETF

---

## 13. 구현 체크리스트

### 13-1. 데이터

- [ ] `src/data/etf/us-etf.ts` 생성 및 4종 ETF 데이터 입력
- [ ] `src/data/etf/kr-etf.ts` 생성 및 6종 ETF 데이터 입력
- [ ] `src/data/companies/semiconductor.ts` 생성 및 TOP 10 기업 데이터 입력
- [ ] `DATA_UPDATED_AT` 상수 확인

### 13-2. 페이지

- [ ] `src/pages/reports/semiconductor-etf-2026.astro` 생성
- [ ] 공통 컴포넌트 (`CalculatorHero`, `InfoNotice`, `SeoContent`) 재사용
- [ ] 탭 전환 마크업 (`data-tab`, `data-panel` 속성) 구성
- [ ] 기업 카드 세그먼트 필터 마크업 (`data-segment` 속성) 구성

### 13-3. 스크립트

- [ ] `public/scripts/semiconductor-etf-2026.js` 생성
- [ ] ETF 탭 전환 로직
- [ ] 기업 카드 필터 로직
- [ ] JS 없이도 기본 콘텐츠 읽기 가능 확인 (첫 탭 기본 노출)

### 13-4. 스타일

- [ ] `src/styles/scss/pages/_semiconductor-etf-2026.scss` 생성
- [ ] `src/styles/app.scss`에 import 추가
- [ ] 모바일 우선 반응형 적용
- [ ] 비교 표 가로 스크롤 처리

### 13-5. 사이트 반영

- [ ] `src/data/reports.ts` 등록
- [ ] `src/pages/reports/index.astro` 허브 노출 확인
- [ ] `public/sitemap.xml` 추가
- [ ] `npm run build` 빌드 오류 없음 확인

---

## 14. QA 기준

### 14-1. 콘텐츠 QA

- 제목, 서브카피, 메타 문구가 기획 의도와 맞는가
- InfoNotice에 "투자 권유 아님" 문구와 기준일이 표시되는가
- ETF 장단점 카드의 톤이 과장 없이 일관적인가

### 14-2. 데이터 QA

- ETF 구성 종목 비중 합계가 각 ETF 내에서 모순되지 않는가
- 기업 시총 bar row의 상대 비율이 실제 순위와 맞는가
- FAQ 답변이 비교 표 데이터와 충돌하지 않는가

### 14-3. UI QA

- 모바일에서 비교 표와 구성 종목 표가 가로 스크롤 없이 잘리지 않는가
- 기업 카드 높이 차가 과도하지 않은가
- CTA가 본문 흐름을 끊지 않고 자연스럽게 이어지는가

### 14-4. 인터랙션 QA

- ETF 탭 전환 시 active 상태가 명확한가
- 기업 필터 탭 전환 시 카드 show/hide가 올바른가
- JS 없이도 첫 번째 탭 콘텐츠가 기본 노출되는가

---

## 15. 개발 메모

- 데이터 파일은 `.json` 대신 `.ts`로 관리: 타입 안전성 확보, Astro import에서 바로 사용 가능.
- 구성 종목 비중 데이터는 운용사 공식 팩트시트 기준으로 작성. 데이터 파일 상단 주석에 출처 URL 명시 권장.
- Chart.js는 MVP에서 사용하지 않음. 시총 bar row는 CSS `width: calc(시총/최대시총 * 100%)` 방식으로 처리.
- 이후 파생 리포트 (`soxx-vs-smh-2026`, `korea-semiconductor-etf-2026`)는 이 데이터 파일을 import해서 재사용 가능.
- 투자 권유 아님 주석: `<footer>` 또는 `InfoNotice`에 반드시 포함.
