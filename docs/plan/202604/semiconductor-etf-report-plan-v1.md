# 비교계산소 반도체 ETF 리포트 — 웹기획서 v1

> **사이트**: bigyocalc.com  
> **작성일**: 2026-04-09  
> **시리즈**: 투자 데이터 리포트  
> **목표**: SEO 트래픽 확보 + 적립식 계산기 전환

---

## 1. 콘텐츠 전략 개요

### 포지셔닝

"ETF 설명글"이 아닌 **"구성 종목 뜯어보는 데이터 비교 리포트"**

- 타겟 독자: 반도체 ETF 입문자, 미국 vs 한국 ETF 고민 중인 국내 투자자, 엔비디아·삼성·TSMC 중심으로 ETF 고르는 사람
- 차별화: ETF 나열이 아닌 "이 ETF 사면 어떤 회사에 투자하는 건지"를 즉시 보여주는 포맷
- 수익화 연결: 적립식 투자 계산기, DCA 계산기, 포트폴리오 비교 툴 내부 링크

---

## 2. 리포트 시리즈 구조

### 제작 순서

| 순서 | 파일 | 제목 | 상태 |
|------|------|------|------|
| 1 | `/reports/semiconductor-etf-2026/` | 미국·한국 반도체 ETF 비교 2026 (메인) | 🟡 기획 완료 |
| 2 | `/reports/soxx-vs-smh-2026/` | SOXX vs SMH vs XSD 비교 | ⬜ 대기 |
| 3 | `/reports/korea-semiconductor-etf-2026/` | 한국 반도체 ETF 총정리 | ⬜ 대기 |
| 4 | `/reports/semiconductor-market-cap-2026/` | 반도체 시총 TOP 20 기업 리포트 | ⬜ 대기 |

---

## 3. 메인 리포트 상세 기획

### 3-1. 기본 정보

```
URL:        /reports/semiconductor-etf-2026/
레이아웃:   Compare (비교형)
타이틀:     미국·한국 반도체 ETF 비교 2026 — 구성 종목, 실적, 시총, 장단점 총정리
설명:       SOXX, SMH, TIGER, RISE, ACE 구성 종목을 한눈에 비교합니다
```

### 3-2. SEO 타이틀 후보

| 우선순위 | 타이틀 | 비고 |
|----------|--------|------|
| 1 | 미국·한국 반도체 ETF 비교 2026 — SOXX, SMH, TIGER, RISE, ACE 구성 종목 총정리 | 검색성·확장성 최강 |
| 2 | 반도체 ETF 하나 사면 결국 어떤 회사를 담게 될까? 미국·한국 ETF 완전 비교 | 클릭율 유리 |
| 3 | 반도체 ETF 10종 비교 — 보유 종목, 보수, 엔비디아 비중, 삼성전자 포함 여부 정리 | 데이터 특화 |

**추천: 1번**

### 3-3. 타겟 키워드

- 미국 반도체 ETF 추천
- 한국 반도체 ETF 비교
- SOXX SMH 차이
- 엔비디아 포함 ETF
- 삼성전자 ETF
- SK하이닉스 ETF
- 반도체 ETF 2026

---

## 4. 페이지 섹션 구성

### Section 1 — 히어로 (Hero)

```
레이아웃: 풀폭 히어로
헤드라인: 반도체 ETF, 어떤 회사를 담고 있나?
서브헤드: 미국·한국 반도체 ETF 10종의 구성 종목, 실적, 시총을 한눈에 비교합니다
CTA 버튼: [ETF 비교 바로가기 ↓] [계산기 열기 →]
업데이트 날짜 표시: 2026-04-09 기준
```

### Section 2 — 빠른 요약 카드 (Summary Cards)

4개 카드 가로 배치

| 카드 | 내용 |
|------|------|
| 미국 대표 ETF | SOXX / SMH / XSD / PSI |
| 한국 대표 ETF | TIGER 반도체 / RISE AI반도체TOP10 / ACE AI반도체TOP3+ / RISE 미국반도체NYSE |
| 대표 구성 기업 | NVIDIA, TSMC, Broadcom, Samsung, SK hynix, ASML |
| 핵심 차이 | 대형주 집중형 / 분산형 / 국내형 / 미국형 / 글로벌형 |

### Section 3 — ETF 비교 표 (Main Comparison Table)

**이 섹션이 리포트의 핵심**

| 컬럼 | 설명 |
|------|------|
| ETF명 | 티커 + 한글명 |
| 국가/시장 | 미국 / 한국 |
| 운용사 | iShares, VanEck, KB, 미래에셋, 한국투자 등 |
| 추종 구조 | 대표 30종목 / 집중형 / 분산형 등 |
| 대표 구성 기업 | 상위 3~5종목 |
| 장점 | 1~2줄 |
| 단점 | 1~2줄 |
| 추천 투자 성향 | 1줄 |

**ETF 목록**

```
미국 상장
- SOXX (iShares PHLX Semiconductor ETF)
- SMH (VanEck Semiconductor ETF)
- XSD (SPDR S&P Semiconductor ETF)
- PSI (Invesco Semiconductors ETF)

한국 상장
- TIGER 미국필라델피아반도체나스닥
- TIGER 반도체
- RISE AI반도체TOP10
- RISE 미국반도체NYSE
- ACE AI반도체TOP3+
- ACE 글로벌반도체TOP4 Plus
```

**인터랙션**: 미국/한국 토글 탭

### Section 4 — 구성 종목 비교 (Holdings Comparison)

**미국 ETF 구성 종목**

| ETF | 상위 종목 (비중 기준) |
|-----|----------------------|
| SMH | NVIDIA 19.23%, TSMC 11.59%, Broadcom 8.06%, Intel 4.98%, AMD 4.89%, KLA 4.78%, ASML 4.73% |
| SOXX | 미국 상장 반도체 30종목 기반 (수정 시가총액 가중) |
| RISE 미국반도체NYSE | Broadcom 8.43%, NVIDIA 8.10%, Micron 7.38%, AMD 6.65%, Applied Materials 5.72%, Marvell 5.40%, Intel 4.68% |

**한국 ETF 구성 종목**

| ETF | 상위 종목 (비중 기준) |
|-----|----------------------|
| RISE AI반도체TOP10 | 삼성전자 15.36%, SK하이닉스 15.27%, ISC 13.00%, 이수페타시스 10.16%, 리노공업 9.41%, 원익IPS 9.29%, 한미반도체 9.02% |
| ACE AI반도체TOP3+ | 삼성전자, SK하이닉스, 한미반도체 |
| TIGER 반도체 | 국내 반도체 대표주 / 장비주 |

**데이터 기준일**: 2026-04-09

### Section 5 — 글로벌 반도체 시총 순위 (Market Cap Ranking)

**2026-04-09 기준**

| 순위 | 기업 | 시가총액 | 국가 | 사업 포지션 | 주요 포함 ETF |
|------|------|----------|------|------------|--------------|
| 1 | NVIDIA | $4.425T | 미국 | GPU / AI 가속기 | SOXX, SMH |
| 2 | TSMC | $1.897T | 대만 | 파운드리 1위 | SMH, SOXX |
| 3 | Broadcom | $1.662T | 미국 | 팹리스 / 네트워킹 | SOXX, SMH, RISE 미국반도체NYSE |
| 4 | Samsung Electronics | $908.95B | 한국 | 메모리 / 파운드리 | RISE AI반도체TOP10, ACE |
| 5 | ASML | $557.98B | 네덜란드 | 반도체 노광장비 | SMH, SOXX |
| 6 | SK hynix | $478.29B | 한국 | HBM / DRAM / NAND | RISE AI반도체TOP10, ACE |
| 7 | Micron | $458.68B | 미국 | DRAM / NAND | SOXX, RISE 미국반도체NYSE |
| 8 | AMD | $377.96B | 미국 | CPU / GPU | SOXX, SMH |
| 9 | Lam Research | $309.59B | 미국 | 반도체 장비 | SOXX |
| 10 | Applied Materials | $306.11B | 미국 | 반도체 장비 | SOXX, RISE 미국반도체NYSE |

**비주얼**: 가로 바 차트 또는 버블 차트 (시총 크기 비례)

### Section 6 — 기업 실적 카드 (Company Cards)

**카드 포맷**

```
기업명 (국가 뱃지)
사업 포지션
────────────────
최근 연매출  | 최근 영업이익
직원 수     | 본사 위치
────────────────
최근 포인트 (1~2줄)
포함 ETF 뱃지
```

**대상 기업 5종**

**① NVIDIA**
- 사업 포지션: AI GPU / 가속기 / 데이터센터
- FY2026 매출: $215.9B
- 직원 수: 42,000+
- 본사: Santa Clara, CA
- 최근 포인트: AI 인프라 수요로 고성장 지속
- 포함 ETF: SOXX, SMH, RISE 미국반도체NYSE

**② TSMC**
- 사업 포지션: 글로벌 파운드리 1위
- 2025 연매출: NT$3,809.05B
- 본사: Hsinchu, Taiwan
- 최근 포인트: 2025년 Foundry 2.0 기준 점유율 선두
- 포함 ETF: SMH, SOXX, ACE 글로벌반도체TOP4 Plus

**③ Samsung Electronics**
- 사업 포지션: 메모리 / 파운드리 / 모바일
- 2025 연매출: KRW 333.6T
- 2025 영업이익: KRW 43.6T
- 본사: 수원 / 서울
- 최근 포인트: AI 메모리 수요로 실적 개선
- 포함 ETF: RISE AI반도체TOP10, ACE AI반도체TOP3+

**④ SK hynix**
- 사업 포지션: HBM / DRAM / NAND
- 2025 연매출: KRW 97.1467T
- 2025 영업이익: KRW 47.2063T
- 직원 수: 46,863명 (2024)
- 본사: 이천
- 최근 포인트: HBM 경쟁력 강화, 2025 사상 최대 실적
- 포함 ETF: RISE AI반도체TOP10, ACE AI반도체TOP3+

**⑤ ASML**
- 사업 포지션: 반도체 노광장비 (EUV 독점)
- 2025 순매출: €32.7B
- 2025 영업이익: €11.3B
- 본사: Veldhoven, Netherlands
- 최근 포인트: 첨단 공정 장비 핵심, 수출규제 이슈
- 포함 ETF: SMH, SOXX, ACE 글로벌반도체TOP4 Plus

**인터랙션**: GPU / 메모리 / 장비 / 파운드리 탭 필터

### Section 7 — ETF 장단점 요약 (Pros & Cons)

**미국 ETF**

```
SOXX
장점: 미국 반도체 정석형, 대표성 높음, 설명하기 쉬움
단점: 대형주 영향력 큼, 집중도 체감
추천: 처음 반도체 ETF 시작하는 사람

SMH
장점: NVIDIA·TSMC·Broadcom 중심 강한 성장 노출, 상승장 탄력
단점: 상위 종목 쏠림 큼, 특정 기업 조정 시 변동성 확대
추천: 수익률에 민감한 사람

XSD
장점: 상대적 분산형, 대형주 편중 완화
단점: 직관성 다소 낮음
추천: 대형주 편중 싫은 사람
```

**한국 ETF**

```
RISE AI반도체TOP10
장점: 국내 HBM·테스트·장비·후공정까지 반영, 이해하기 쉬움
단점: 10종목 집중으로 변동성 큼
추천: 국내 AI 반도체 집중 투자자

ACE AI반도체TOP3+
장점: 삼성·SK하이닉스·한미반도체 핵심 압축
단점: 집중도 매우 높음
추천: 핵심 3종 원하는 사람

RISE 미국반도체NYSE
장점: 원화로 미국 반도체 접근 쉬움
단점: 환율 구조 이해 필요
추천: 미국 반도체 원화 투자자
```

### Section 8 — 어떤 투자자에게 맞는가 (Matching Guide)

```
매칭 로직 (인터랙티브 또는 정적 표)

"엔비디아 집중 원함"  → SMH
"분산 원함"          → XSD, PSI
"국내 HBM 원함"      → RISE AI반도체TOP10
"원화로 미국 반도체"  → RISE 미국반도체NYSE, TIGER 미국필라델피아반도체나스닥
"글로벌 압축형"       → ACE 글로벌반도체TOP4 Plus
"처음 시작"          → SOXX
```

### Section 9 — 관련 내부 링크 + CTA (Internal Link & CTA)

```
내부 링크
- SOXX vs SMH 상세 비교 리포트 →
- 한국 반도체 ETF 비교 리포트 →
- 반도체 시총 TOP 20 기업 리포트 →
- 2016 vs 2026 한국 평균 연봉 비교 →

계산기 CTA
- 적립식 투자 수익 계산기 →
- DCA 계산기 →
- 포트폴리오 비교 툴 →
```

---

## 5. 데이터 관리

### 5-1. 데이터 소스

| 항목 | 소스 | 업데이트 주기 |
|------|------|--------------|
| ETF 구성 종목 / 비중 | 각 운용사 공식 페이지 | 분기별 |
| 기업 매출 / 영업이익 | 기업 IR / 연간실적 공시 | 연 1회 (연간결산) |
| 직원 수 | 연차보고서 / 회사 소개 자료 | 연 1회 |
| 시가총액 순위 | CompaniesMarketCap 등 | 페이지 업데이트 시 |
| 최근 뉴스 / 업황 | Reuters, 공식 실적 발표 | 리포트 업데이트 시 |

### 5-2. 데이터 파일 구조 (Astro SSG 기준)

```
src/
  data/
    etf/
      us-etf.json          ← 미국 ETF 목록 + 구성 종목
      kr-etf.json          ← 한국 ETF 목록 + 구성 종목
    companies/
      semiconductor.json   ← 기업 실적 / 시총 / 직원 수
    meta/
      updated-at.json      ← 데이터 기준일
```

### 5-3. 데이터 스키마 초안

**us-etf.json**

```json
{
  "updatedAt": "2026-04-09",
  "etfs": [
    {
      "ticker": "SMH",
      "name": "VanEck Semiconductor ETF",
      "manager": "VanEck",
      "market": "US",
      "type": "집중형",
      "ytd": 20.99,
      "ter": 0.35,
      "holdings": [
        { "ticker": "NVDA", "name": "NVIDIA", "weight": 19.23 },
        { "ticker": "TSM",  "name": "TSMC",   "weight": 11.59 }
      ],
      "pros": ["NVIDIA·TSMC 중심 강한 성장 노출", "상승장 탄력"],
      "cons": ["상위 종목 쏠림 큼", "특정 기업 조정 시 변동성 확대"],
      "bestFor": "수익률에 민감한 사람"
    }
  ]
}
```

**semiconductor.json**

```json
{
  "updatedAt": "2026-04-09",
  "companies": [
    {
      "name": "NVIDIA",
      "ticker": "NVDA",
      "country": "US",
      "segment": "GPU",
      "marketCapUsd": 4425000000000,
      "revenue": { "value": 215.9, "unit": "B USD", "period": "FY2026" },
      "operatingIncome": null,
      "employees": 42000,
      "hq": "Santa Clara, CA",
      "recentNote": "AI 인프라 수요로 고성장 지속",
      "includedIn": ["SOXX", "SMH", "RISE 미국반도체NYSE"]
    }
  ]
}
```

---

## 6. Astro 페이지 컴포넌트 스캐폴딩

### 6-1. 파일 구조

```
src/
  pages/
    reports/
      semiconductor-etf-2026.astro   ← 메인 리포트
  components/
    reports/
      EtfCompareTable.astro          ← Section 3: ETF 비교 표
      HoldingsCompare.astro          ← Section 4: 구성 종목 비교
      MarketCapRanking.astro         ← Section 5: 시총 순위
      CompanyCard.astro              ← Section 6: 기업 카드
      ProsConsGrid.astro             ← Section 7: 장단점
      InvestorMatcher.astro          ← Section 8: 투자자 매칭
      ReportInternalLinks.astro      ← Section 9: 내부 링크
```

### 6-2. 페이지 레이아웃 예시

```astro
---
// semiconductor-etf-2026.astro
import BaseLayout from '../../layouts/BaseLayout.astro';
import EtfCompareTable from '../../components/reports/EtfCompareTable.astro';
import MarketCapRanking from '../../components/reports/MarketCapRanking.astro';
import CompanyCard from '../../components/reports/CompanyCard.astro';
import { usEtfs, krEtfs } from '../../data/etf/us-etf.json';
import { companies } from '../../data/companies/semiconductor.json';

const seo = {
  title: '미국·한국 반도체 ETF 비교 2026 — SOXX, SMH, TIGER, RISE, ACE 구성 종목 총정리',
  description: 'SOXX, SMH, TIGER 반도체, RISE AI반도체TOP10, ACE AI반도체TOP3+ 등 10종 ETF의 구성 종목, 운용사, 장단점을 한눈에 비교합니다.',
  canonical: 'https://bigyocalc.com/reports/semiconductor-etf-2026/',
  ogType: 'article',
};
---

<BaseLayout {seo}>
  <!-- Section 1: Hero -->
  <!-- Section 2: Summary Cards -->
  <EtfCompareTable usEtfs={usEtfs} krEtfs={krEtfs} />
  <!-- Section 4: Holdings Compare -->
  <MarketCapRanking companies={companies} />
  {companies.slice(0, 5).map(c => <CompanyCard company={c} />)}
  <!-- Section 7~9 -->
</BaseLayout>
```

---

## 7. URL 슬러그 컨벤션

```
메인:  /reports/semiconductor-etf-2026/
파생1: /reports/soxx-vs-smh-2026/
파생2: /reports/korea-semiconductor-etf-2026/
파생3: /reports/semiconductor-market-cap-2026/
```

기존 `/reports/[topic]-2016-vs-2026/` 패턴과 분리하여 `-2026/` 단독 슬러그 사용  
→ 연간 업데이트 시 `/reports/semiconductor-etf-2027/` 으로 신규 발행 + 구버전 리다이렉트

---

## 8. 내부 링크 아키텍처

```
메인 리포트 (semiconductor-etf-2026)
├── → SOXX vs SMH 비교 (soxx-vs-smh-2026)
├── → 한국 반도체 ETF 정리 (korea-semiconductor-etf-2026)
├── → 반도체 시총 순위 (semiconductor-market-cap-2026)
├── → 적립식 투자 계산기 (/calculators/dca/)
└── → 2016 vs 2026 평균 연봉 (/reports/salary-2016-vs-2026/)
```

---

## 9. 다음 실행 단계 체크리스트

```
[ ] 데이터 파일 작성: src/data/etf/us-etf.json
[ ] 데이터 파일 작성: src/data/etf/kr-etf.json
[ ] 데이터 파일 작성: src/data/companies/semiconductor.json
[ ] Astro 페이지 생성: semiconductor-etf-2026.astro
[ ] 컴포넌트 스캐폴딩: EtfCompareTable.astro
[ ] 컴포넌트 스캐폴딩: MarketCapRanking.astro
[ ] 컴포넌트 스캐폴딩: CompanyCard.astro
[ ] npm run build 빌드 오류 없음 확인
[ ] DEPLOY_CHECKLIST.md 체크 완료
[ ] main 브랜치 푸시 → 프로덕션 배포
[ ] 내부 링크 추가: 적립식 계산기 → 이 리포트 연결
[ ] 구글 서치 콘솔 URL 검사 + 색인 요청
```

---

## 10. 비고

- 데이터 기준일 표시 필수 (업데이트마다 갱신)
- 투자 권유 아님 주석 footer에 명시
- 한국 ETF 정보: 거래소 및 운용사 공식 페이지 출처 표기
- 미국 ETF 정보: iShares, VanEck 공식 페이지 출처 표기