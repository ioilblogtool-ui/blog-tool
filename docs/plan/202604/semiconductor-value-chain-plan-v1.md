# 비교계산소 웹 컨텐츠 기획서 v1
## 반도체 밸류체인 한눈에 보기
### `/reports/semiconductor-value-chain/`

> **작성일**: 2026-04-09  
> **문서 버전**: v1.0  
> **상태**: 기획 완료 → 개발 대기  
> **담당**: 비교계산소 1인 운영  

---

## 1. 문서 개요

| 항목 | 내용 |
|---|---|
| 문서명 | 미국·한국 반도체 밸류체인 한눈에 보기 |
| 콘텐츠 타입 | 독립형 산업 구조 리포트 + 인터랙티브 학습형 웹 컨텐츠 |
| 발행 URL | `/reports/semiconductor-value-chain/` |
| 레이아웃 쉘 | `Compare` (비교형) + 인터랙티브 플로우맵 |
| 연관 리포트 | `/reports/semiconductor-etf-2026/` (ETF 리포트에서 유입) |
| 수익화 연결 | 적립식 계산기 CTA / ETF 리포트 내부 링크 |

### 1-1. 포지셔닝

이 컨텐츠는 **ETF 리포트의 보조 섹션이 아닌 독립형 산업 이해 콘텐츠**다.

핵심 가치: "반도체 산업의 전공정·후공정과 미국·한국 핵심 기업의 연결 구조를 한 화면에서 이해할 수 있는 콘텐츠"

사용자가 실제로 품는 질문들:

- 엔비디아가 GPU를 설계하는 회사인지 만드는 회사인지 모른다
- TSMC와 삼성전자가 왜 경쟁하는지, 어느 단계에 있는지 모른다
- ASML·한미반도체·원익IPS가 왜 중요한지 모른다
- 메모리와 파운드리, 장비와 패키징이 어떻게 연결되는지 모른다
- 미국이 강한 영역과 한국이 강한 영역이 어디인지 모른다

---

## 2. SEO 전략

### 2-1. 타이틀 후보

| 우선순위 | 타이틀 | 전략 |
|---|---|---|
| A안 (추천) | 엔비디아는 왜 공장이 없을까? 반도체 산업 구조 한눈에 보기 | 클릭율, 질문형 |
| B안 | 반도체 밸류체인 완전 정리 — 설계·전공정·후공정, 미국·한국 기업 어디에 있나 | 검색량, 정보형 |
| C안 | 반도체 산업 지도 2026 — 미국·한국·대만 기업 포지션 완전 정리 | 데이터형, 연도 키워드 |

**운영 전략**: A안 타이틀 + B안 메타 디스크립션 조합

### 2-2. 메타 데이터

```
<title>엔비디아는 왜 공장이 없을까? 반도체 산업 구조 한눈에 보기 | 비교계산소</title>

<meta name="description"
  content="반도체 밸류체인 설계→장비→전공정→메모리→후공정→테스트 전 단계를
  한눈에 보여줍니다. NVIDIA·TSMC·삼성전자·SK하이닉스·ASML·한미반도체 등
  미국·한국 핵심 기업의 역할과 위치를 인터랙티브로 이해하세요." />

<meta property="og:title"
  content="엔비디아는 왜 공장이 없을까? 반도체 산업 구조 한눈에 보기" />

<meta property="og:description"
  content="설계부터 완제품까지, 반도체 밸류체인 6단계와 미국·한국 대표 기업 20+개를
  한 화면에서 이해할 수 있는 인터랙티브 산업 구조 리포트" />

<meta property="og:type" content="article" />
<meta property="og:url" content="https://bigyocalc.com/reports/semiconductor-value-chain/" />

<link rel="canonical" href="https://bigyocalc.com/reports/semiconductor-value-chain/" />
```

### 2-3. 타겟 키워드

| 키워드 | 검색 의도 |
|---|---|
| 반도체 밸류체인 | 정보 탐색 |
| 반도체 산업 구조 | 정보 탐색 |
| 엔비디아 공장 없는 이유 | 질문형, 고클릭 |
| 파운드리 뜻 | 정의 검색 |
| TSMC 삼성전자 차이 | 비교 검색 |
| ASML 왜 중요한가 | 질문형 |
| 팹리스 뜻 | 정의 검색 |
| 한미반도체 HBM | 종목 검색 |
| 반도체 전공정 후공정 차이 | 정보 탐색 |
| 미국 반도체 강점 | 정보 탐색 |

---

## 3. 페이지 섹션 구성

### 전체 섹션 순서

```
S1. 히어로
S2. 밸류체인 플로우맵 (핵심 인터랙티브)
S3. 미국 vs 한국 강점 지도
S4. 단계별 기업 상세 카드
S5. 자주 하는 오해 3가지
S6. 관련 리포트 + CTA
```

---

### S1. 히어로

**레이아웃**: 풀폭, 좌측 텍스트 + 우측 밸류체인 미니맵(정적)

```
헤드라인:
  반도체 하나 만들기까지,
  이 회사들이 다 연결되어 있다

서브헤드:
  엔비디아·TSMC·삼성전자·ASML·SK하이닉스·한미반도체.
  서로 어떤 관계인지, 어느 단계에 서 있는지 한눈에 봅니다.

메타 정보:
  업데이트: 2026-04-09 기준  |  기업 수: 20+  |  읽는 시간: 약 5분

CTA 버튼:
  [밸류체인 보기 ↓]   [ETF 리포트 →]
```

---

### S2. 밸류체인 플로우맵 (핵심 인터랙티브)

**이 섹션이 전체 페이지의 핵심이다.**

#### 2-1. 플로우 구조

총 6단계 가로 배치. 단계 간 화살표(→)로 흐름 표현.

```
[1단계: 설계] → [2단계: 장비·소재] → [3단계: 전공정] →
[4단계: 메모리] → [5단계: 후공정·패키징] → [6단계: 테스트·검사]
```

각 단계 컬럼 구성:

```
┌──────────────┐
│ N단계         │  ← 단계 번호
│ 단계명        │  ← 클릭 시 단계 설명 패널 오픈
│ 한 줄 설명    │
│ ─────────── │
│ 🇺🇸 기업A    │  ← 클릭 시 기업 상세 패널 오픈
│   $시총       │
│ 🇰🇷 기업B    │
│   $시총       │
└──────────────┘
```

#### 2-2. 단계별 정의

| 단계 | 이름 | 한 줄 설명 | 대표 기업 | 미국 강도 | 한국 강도 |
|---|---|---|---|---|---|
| 1 | 설계 (팹리스) | 공장 없이 칩 설계만 | NVIDIA, Qualcomm, Broadcom, AMD | ★★★★★ | — |
| 2 | 장비·소재 | 제조 도구와 재료 공급 | ASML, Lam Research, KLA, 원익IPS, 한미반도체 | ★★★★★ | ★★★ |
| 3 | 전공정 (파운드리) | 설계도→웨이퍼 위 회로 인쇄 | TSMC, 삼성파운드리 | ★ | ★★★★ |
| 4 | 메모리 | DRAM·NAND·HBM 생산 | SK하이닉스, 삼성전자, Micron | ★★ | ★★★★★ |
| 5 | 후공정·패키징 | 웨이퍼 절단·칩 패키지화 | 한미반도체, Amkor, ASE | ★★ | ★★★★ |
| 6 | 테스트·검사 | 완성 칩 불량 선별 | ISC, 리노공업, 오킨스 | ★ | ★★★★★ |

#### 2-3. 인터랙션 정의

| 인터랙션 | 동작 |
|---|---|
| 단계 헤더 클릭 | 해당 단계 설명 + 오해 패널 오픈 |
| 기업 카드 클릭 | 기업 상세 패널 오픈 (매출/영업이익/임직원/역할/투자포인트/ETF) |
| 동일 항목 재클릭 | 패널 닫기 |
| 상단 필터 토글 | 전체 / 미국만 / 한국만 (반대 국가 기업 dimming) |
| 강점 오버레이 | 미국 강세 구간 / 한국 강세 구간 하이라이트 |

#### 2-4. 단계별 설명 + 오해 문구

**1단계 — 설계 (팹리스)**
```
설명:
공장 없이 칩 설계만 하는 회사들. 완성된 설계도(IP)를
파운드리에 넘겨 생산을 맡긴다. AI 시대 가치가 가장
빠르게 오른 단계.

자주 하는 오해:
"엔비디아는 GPU를 만드는 회사다"
→ 사실 엔비디아는 설계만 한다.
  실제 웨이퍼는 TSMC가 만든다.
```

**2단계 — 장비·소재**
```
설명:
칩을 만들기 위한 도구와 재료를 공급하는 단계.
장비(ASML·Lam·KLA)와 소재(웨이퍼·특수가스·CMP)로 나뉜다.
"장비 없으면 파운드리도 없다."

자주 하는 오해:
"한국·미국이 장비를 독점한다"
→ EUV 노광장비는 네덜란드 ASML이
  전 세계 독점 공급한다.
```

**3단계 — 전공정 (파운드리)**
```
설명:
설계도를 받아 실리콘 웨이퍼 위에 수백억 개의
트랜지스터를 새기는 단계. 가장 정밀하고
자본 집약적. TSMC가 점유율 60%+ 독점.

자주 하는 오해:
"삼성전자는 스마트폰 회사다"
→ 삼성은 파운드리·메모리·모바일을 동시에 한다.
  TSMC의 경쟁자이자 고객이기도.
```

**4단계 — 메모리**
```
설명:
데이터를 저장·고속 전달하는 칩. AI 가속기에
필수적인 HBM(고대역폭메모리)이 핵심 전장.
SK하이닉스가 HBM 시장 점유율 50%+.

자주 하는 오해:
"메모리는 범용 부품이다"
→ HBM은 AI GPU에 붙여 적층하는 고도 기술.
  NVIDIA H100 한 장에 HBM이 $10,000+어치 들어간다.
```

**5단계 — 후공정·패키징**
```
설명:
웨이퍼를 잘라(다이싱) 칩을 패키지로 묶는 단계.
AI 시대엔 CoWoS·HBM 적층 등 "어드밴스드 패키징"이
성능을 가른다.

자주 하는 오해:
"패키징은 단순 마무리 작업이다"
→ 어드밴스드 패키징은 전공정만큼 정밀.
  TSMC CoWoS 부족이 NVIDIA 납품 지연의 원인.
```

**6단계 — 테스트·검사**
```
설명:
완성된 칩이 정상 작동하는지 검사하는 단계.
테스트 소켓·프로브카드가 핵심 소모품.
한국의 ISC·리노공업·오킨스가 글로벌 점유율 독식.

자주 하는 오해:
"테스트는 쉬운 공정이다"
→ HBM·AI 칩 테스트는 초고속·초정밀.
  소켓 하나 오작동이 수천만 원짜리 칩을 불량 처리.
```

---

### S3. 미국 vs 한국 강점 지도

**레이아웃**: 단계별 강도 바 차트 + 국가별 대표 기업 뱃지

| 단계 | 미국 | 한국 | 비고 |
|---|---|---|---|
| 설계 (팹리스) | ████████ 압도적 | — | 일본·유럽 EDA 툴 |
| 장비 | ██████ 강세 | ███ 일부 | 네덜란드 ASML 독점 |
| 소재 | ████ | ███ | 일본 강세 영역 |
| 파운드리 | ██ | █████ 강세 | 대만(TSMC) 압도적 |
| 메모리 | ███ Micron | ████████ 압도적 | SK하이닉스·삼성 |
| 패키징·OSAT | ████ | █████ | 대만 ASE 강세 |
| 테스트 소켓 | ─ | ████████ 독점적 | ISC·리노공업 |

**핵심 인사이트 문구 (섹션 내 표시)**

```
미국이 압도하는 영역:
칩 설계(팹리스) — 세계 상위 10개 팹리스 기업 중 8개가 미국.
NVIDIA, Qualcomm, Broadcom, AMD, Marvell, Micron이 시장을 지배.

한국이 압도하는 영역:
메모리 — DRAM·NAND 세계 1·2위(삼성·SK하이닉스).
HBM은 SK하이닉스가 글로벌 점유율 50%+.
테스트 소켓 — ISC·리노공업이 글로벌 시장 독식 수준.

아무도 대체 못 하는 기업:
ASML — EUV 노광장비 전 세계 유일 공급사.
TSMC — 첨단 파운드리 점유율 60%+, 대만 기업.
```

---

### S4. 단계별 기업 상세 카드

기업 클릭 시 노출되는 상세 패널. 플로우맵(S2)과 연동.

**카드 포맷**

```
[국기] 기업명        (단계 뱃지)  (시총)
─────────────────────────────
매출        | 영업이익   | 임직원
─────────────────────────────
한 줄 역할 설명 (2~3줄)
─────────────────────────────
왜 중요한가 (1~2줄, 강조 표시)
─────────────────────────────
포함 ETF: [SOXX] [SMH] [RISE...]
[더 알아보기 ↗]
```

**수록 기업 목록 (총 20개)**

*설계 단계 (4개)*

| 국가 | 기업 | 시총 | 매출 | 영업이익 | 임직원 | 포함 ETF |
|---|---|---|---|---|---|---|
| 🇺🇸 | NVIDIA | $4.4T | $215.9B (FY2026) | $134.1B | 42,000+ | SOXX, SMH, QQQ |
| 🇺🇸 | Qualcomm | $163B | $38.7B | $10.1B | 51,000 | SOXX, SMH |
| 🇺🇸 | Broadcom | $1.7T | $51.6B | $12.4B | 40,000 | SOXX, SMH, RISE 미국반도체NYSE |
| 🇺🇸 | AMD | $378B | $25.8B | $1.7B | 26,000 | SOXX, SMH |

*장비·소재 단계 (5개)*

| 국가 | 기업 | 시총 | 매출 | 영업이익 | 임직원 | 포함 ETF |
|---|---|---|---|---|---|---|
| 🇳🇱 | ASML | $558B | €32.7B | €11.3B | 42,000 | SMH, SOXX |
| 🇺🇸 | Lam Research | ~$82B | $18.4B (FY2025) | — | 18,000 | SOXX |
| 🇺🇸 | KLA | $91B | $10.8B | $3.7B | 16,000 | SOXX, SMH |
| 🇺🇸 | Applied Materials | $121B | $27.2B | $7.4B | 34,000 | SOXX, RISE 미국반도체NYSE |
| 🇰🇷 | 원익IPS | ~$1.2B | KRW 0.8T | KRW 0.1T | 1,800 | RISE AI반도체TOP10 |

*전공정 단계 (2개)*

| 국가 | 기업 | 시총 | 매출 | 영업이익 | 임직원 | 포함 ETF |
|---|---|---|---|---|---|---|
| 🇹🇼 | TSMC | $1.9T | NT$3,809B | NT$1,699B | 79,000 | SMH, ACE 글로벌반도체TOP4 |
| 🇰🇷 | 삼성 파운드리 | (삼성전자) | KRW 333.6T(그룹) | KRW 43.6T(그룹) | 270,000(그룹) | RISE AI반도체TOP10, ACE AI반도체TOP3+ |

*메모리 단계 (3개)*

| 국가 | 기업 | 시총 | 매출 | 영업이익 | 임직원 | 포함 ETF |
|---|---|---|---|---|---|---|
| 🇰🇷 | SK하이닉스 | ~$53B | KRW 97.1T | KRW 47.2T | 46,863 | RISE AI반도체TOP10, ACE AI반도체TOP3+ |
| 🇰🇷 | 삼성전자 | ~$163B | KRW 333.6T | KRW 43.6T | 270,000 | RISE AI반도체TOP10, ACE AI반도체TOP3+ |
| 🇺🇸 | Micron | $105B | $38.8B | $9.0B | 48,000 | SOXX, RISE 미국반도체NYSE |

*후공정·패키징 단계 (3개)*

| 국가 | 기업 | 시총 | 매출 | 영업이익 | 임직원 | 포함 ETF |
|---|---|---|---|---|---|---|
| 🇰🇷 | 한미반도체 | ~$4.5B | KRW 0.7T | KRW 0.3T | 900 | RISE AI반도체TOP10, ACE AI반도체TOP3+ |
| 🇺🇸 | Amkor | $5B | $7.1B | $0.5B | 35,000 | XSD |
| 🇰🇷 | 이수페타시스 | ~$1.2B | KRW 0.5T | KRW 0.08T | 1,200 | RISE AI반도체TOP10 |

*테스트·검사 단계 (3개)*

| 국가 | 기업 | 시총 | 매출 | 영업이익 | 임직원 | 포함 ETF |
|---|---|---|---|---|---|---|
| 🇰🇷 | ISC | ~$0.8B | KRW 0.25T | KRW 0.07T | 400 | RISE AI반도체TOP10 |
| 🇰🇷 | 리노공업 | ~$1.8B | KRW 0.4T | KRW 0.18T | 600 | RISE AI반도체TOP10 |
| 🇰🇷 | 오킨스전자 | ~$0.4B | KRW 0.15T | — | 300 | — |

---

### S5. 자주 하는 오해 3가지

단독 섹션. FAQ 어코디언 형태 또는 카드 3열.

```
오해 1.
"엔비디아는 반도체를 만드는 회사다"

→ 엔비디아는 설계(팹리스)만 한다.
  실제 칩 제조는 TSMC가 맡는다.
  H100 한 장당 제조 원가의 60%+가 TSMC 공정 비용.

─────────────────────

오해 2.
"TSMC와 삼성전자는 같은 종류의 회사다"

→ TSMC는 오직 위탁생산(파운드리)만 한다.
  삼성은 파운드리 + 메모리 + 스마트폰을 동시에 한다.
  삼성은 TSMC의 경쟁자이자 최대 고객 중 하나.

─────────────────────

오해 3.
"장비·패키징은 단순 지원 역할이다"

→ ASML의 EUV 노광장비 없이 3nm 이하 칩은 불가능.
  HBM 적층 패키징 없이 AI GPU는 성능을 낼 수 없다.
  "숨은 독점"이 밸류체인 전체를 좌우한다.
```

---

### S6. 관련 리포트 + CTA

```
내부 링크 (리포트 카드 3열)
  ├── 미국·한국 반도체 ETF 비교 2026 →
  ├── SOXX vs SMH vs XSD 비교 →
  └── 반도체 시총 TOP 20 기업 리포트 →

계산기 CTA
  ├── 적립식 투자 수익 계산기 (반도체 ETF 10년 수익 시뮬레이션) →
  └── DCA 계산기 →

면책 고지 (footer)
  이 콘텐츠는 투자 권유가 아닙니다.
  투자 판단은 본인 책임이며, 전문가 상담을 권장합니다.
  데이터 기준일: 2026-04-09
```

---

## 4. 데이터 스키마

### 4-1. 파일 구조

```
src/
  data/
    value-chain/
      steps.json          ← 밸류체인 단계 정의
      companies.json      ← 기업 데이터
      meta.json           ← 데이터 기준일·버전
  pages/
    reports/
      semiconductor-value-chain.astro
  components/
    value-chain/
      FlowMap.astro             ← S2: 메인 인터랙티브
      StepDetail.astro          ← S2: 단계 설명 패널
      CompanyCard.astro         ← S4: 기업 상세 카드
      StrengthMap.astro         ← S3: 미국·한국 강점 지도
      MythSection.astro         ← S5: 오해 섹션
      RelatedLinks.astro        ← S6: 관련 리포트 링크
```

### 4-2. `steps.json` 스키마

```json
{
  "updatedAt": "2026-04-09",
  "steps": [
    {
      "id": "design",
      "num": "1단계",
      "name": "설계 (팹리스)",
      "nameEn": "Fabless Design",
      "shortDesc": "공장 없이 칩 설계만",
      "fullDesc": "공장 없이 칩 설계만 하는 회사들. 완성된 설계도(IP)를 파운드리에 넘겨 생산을 맡긴다. AI 시대 가치가 가장 빠르게 오른 단계.",
      "myth": {
        "claim": "엔비디아는 GPU를 만드는 회사다",
        "fact": "사실 엔비디아는 설계만 한다. 실제 웨이퍼는 TSMC가 만든다."
      },
      "usStrength": 5,
      "krStrength": 0,
      "companyIds": ["nvda", "qcom", "brcm", "amd"]
    },
    {
      "id": "equip",
      "num": "2단계",
      "name": "장비·소재",
      "nameEn": "Equipment & Materials",
      "shortDesc": "제조 도구와 재료 공급",
      "fullDesc": "칩을 만들기 위한 도구와 재료를 공급하는 단계. 장비(ASML·Lam·KLA)와 소재(웨이퍼·특수가스·CMP)로 나뉜다.",
      "myth": {
        "claim": "한국·미국이 장비를 독점한다",
        "fact": "EUV 노광장비는 네덜란드 ASML이 전 세계 독점 공급한다."
      },
      "usStrength": 5,
      "krStrength": 3,
      "companyIds": ["asml", "lrcx", "klac", "amat", "wonik"]
    },
    {
      "id": "foundry",
      "num": "3단계",
      "name": "전공정 (파운드리)",
      "nameEn": "Front-End / Foundry",
      "shortDesc": "설계도 → 웨이퍼 위 회로",
      "fullDesc": "설계도를 받아 실리콘 웨이퍼 위에 수백억 개의 트랜지스터를 새기는 단계. 가장 정밀하고 자본 집약적.",
      "myth": {
        "claim": "삼성전자는 스마트폰 회사다",
        "fact": "삼성은 파운드리·메모리·모바일을 동시에 한다. TSMC의 경쟁자이자 고객."
      },
      "usStrength": 1,
      "krStrength": 4,
      "companyIds": ["tsmc", "samsung-foundry"]
    },
    {
      "id": "memory",
      "num": "4단계",
      "name": "메모리",
      "nameEn": "Memory",
      "shortDesc": "DRAM·NAND·HBM 생산",
      "fullDesc": "데이터를 저장·고속 전달하는 칩. AI 가속기에 필수적인 HBM이 핵심 전장. SK하이닉스가 HBM 시장 점유율 50%+.",
      "myth": {
        "claim": "메모리는 범용 부품이다",
        "fact": "HBM은 AI GPU에 적층하는 고도 기술. NVIDIA H100 한 장에 $10,000+어치 들어간다."
      },
      "usStrength": 2,
      "krStrength": 5,
      "companyIds": ["skhynix", "samsung", "micron"]
    },
    {
      "id": "packaging",
      "num": "5단계",
      "name": "후공정·패키징",
      "nameEn": "Back-End / Packaging",
      "shortDesc": "다이싱·적층·봉지",
      "fullDesc": "웨이퍼를 잘라 칩을 패키지로 묶는 단계. AI 시대엔 CoWoS·HBM 적층 등 어드밴스드 패키징이 성능을 가른다.",
      "myth": {
        "claim": "패키징은 단순 마무리 작업이다",
        "fact": "어드밴스드 패키징은 전공정만큼 정밀. TSMC CoWoS 부족이 NVIDIA 납품 지연의 원인."
      },
      "usStrength": 2,
      "krStrength": 4,
      "companyIds": ["hms", "amkor", "speta"]
    },
    {
      "id": "test",
      "num": "6단계",
      "name": "테스트·검사",
      "nameEn": "Test & Inspection",
      "shortDesc": "불량 선별·소켓 검사",
      "fullDesc": "완성된 칩이 정상 작동하는지 검사하는 단계. 테스트 소켓·프로브카드가 핵심 소모품. 한국 ISC·리노공업이 글로벌 점유율 독식.",
      "myth": {
        "claim": "테스트는 쉬운 공정이다",
        "fact": "HBM·AI 칩 테스트는 초고속·초정밀. 소켓 하나 오작동이 수천만 원짜리 칩을 불량 처리."
      },
      "usStrength": 1,
      "krStrength": 5,
      "companyIds": ["isc", "lino", "okins"]
    }
  ]
}
```

### 4-3. `companies.json` 스키마

```json
{
  "updatedAt": "2026-04-09",
  "companies": [
    {
      "id": "nvda",
      "flag": "🇺🇸",
      "name": "NVIDIA",
      "ticker": "NVDA",
      "exchange": "NASDAQ",
      "country": "US",
      "stepId": "design",
      "marketCapUsd": 4400000000000,
      "marketCapDisplay": "$4.4T",
      "revenue": {
        "value": "215.9B USD",
        "period": "FY2026",
        "growth": "+114% YoY"
      },
      "operatingIncome": {
        "value": "134.1B USD",
        "margin": "62%"
      },
      "employees": "42,000+",
      "hq": "Santa Clara, CA",
      "segment": "GPU / AI 가속기",
      "roleDesc": "AI GPU와 데이터센터 가속기를 설계하는 팹리스. 공장 없이 TSMC에 위탁 생산.",
      "whyItMatters": "설계만으로 반도체 최고 시총. CUDA 생태계가 AI 인프라의 표준이 됐기 때문.",
      "investNote": "AI 인프라 투자 확대 시 직접 수혜. CUDA 생태계 락인이 해자.",
      "etfs": ["SOXX", "SMH", "QQQ"],
      "relatedCompanies": ["tsmc", "skhynix"]
    }
  ]
}
```

### 4-4. `meta.json` 스키마

```json
{
  "version": "1.0",
  "updatedAt": "2026-04-09",
  "dataNote": "시총은 2026-04-09 기준 추산. 매출·영업이익은 최근 발표 연간 실적 기준.",
  "disclaimer": "이 콘텐츠는 투자 권유가 아닙니다. 투자 판단은 본인 책임이며 전문가 상담을 권장합니다.",
  "nextUpdateScheduled": "2026-07-01"
}
```

---

## 5. Astro 컴포넌트 스캐폴딩

### 5-1. 페이지 파일

```astro
---
// src/pages/reports/semiconductor-value-chain.astro

import BaseLayout from '../../layouts/BaseLayout.astro';
import FlowMap from '../../components/value-chain/FlowMap.astro';
import StrengthMap from '../../components/value-chain/StrengthMap.astro';
import MythSection from '../../components/value-chain/MythSection.astro';
import RelatedLinks from '../../components/value-chain/RelatedLinks.astro';

import stepsData from '../../data/value-chain/steps.json';
import companiesData from '../../data/value-chain/companies.json';
import meta from '../../data/value-chain/meta.json';

const seo = {
  title: '엔비디아는 왜 공장이 없을까? 반도체 산업 구조 한눈에 보기 | 비교계산소',
  description:
    '반도체 밸류체인 설계→장비→전공정→메모리→후공정→테스트 전 단계를 한눈에 보여줍니다. NVIDIA·TSMC·삼성전자·SK하이닉스·ASML·한미반도체 등 미국·한국 핵심 기업의 역할과 위치를 인터랙티브로 이해하세요.',
  canonical: 'https://bigyocalc.com/reports/semiconductor-value-chain/',
  ogType: 'article',
  updatedAt: meta.updatedAt,
};

const { steps } = stepsData;
const { companies } = companiesData;
---

<BaseLayout {seo}>
  <!-- S1: Hero -->
  <section class="hero">
    <h1>반도체 하나 만들기까지,<br />이 회사들이 다 연결되어 있다</h1>
    <p>엔비디아·TSMC·삼성전자·ASML·SK하이닉스·한미반도체.<br />서로 어떤 관계인지, 어느 단계에 서 있는지 한눈에 봅니다.</p>
    <p class="meta-info">업데이트: {meta.updatedAt} 기준 | 기업 수: {companies.length}개 | 읽는 시간: 약 5분</p>
  </section>

  <!-- S2: 밸류체인 플로우맵 (핵심) -->
  <FlowMap steps={steps} companies={companies} />

  <!-- S3: 미국 vs 한국 강점 지도 -->
  <StrengthMap steps={steps} />

  <!-- S5: 오해 섹션 -->
  <MythSection steps={steps} />

  <!-- S6: 관련 링크 + CTA -->
  <RelatedLinks updatedAt={meta.updatedAt} disclaimer={meta.disclaimer} />
</BaseLayout>
```

### 5-2. FlowMap.astro (핵심 컴포넌트)

```astro
---
// src/components/value-chain/FlowMap.astro
// Props: steps[], companies[]
// 인터랙션은 client-side JS로 처리 (script is:inline)

interface Props {
  steps: Step[];
  companies: Company[];
}

const { steps, companies } = Astro.props;

function getCompanies(stepId: string) {
  return companies.filter(c => c.stepId === stepId);
}
---

<div class="flow-map-wrap" id="flow-map">

  <!-- 필터 버튼 -->
  <div class="filter-row">
    <button class="f-btn active" data-mode="all">전체 보기</button>
    <button class="f-btn" data-mode="us">🇺🇸 미국 강세 구간</button>
    <button class="f-btn" data-mode="kr">🇰🇷 한국 강세 구간</button>
  </div>

  <!-- 단계 설명 패널 (JS로 show/hide) -->
  <div id="step-detail-panel" class="detail-panel hidden"></div>

  <!-- 기업 상세 패널 (JS로 show/hide) -->
  <div id="company-detail-panel" class="detail-panel hidden"></div>

  <!-- 플로우 -->
  <div class="flow-cols">
    {steps.map((step, i) => (
      <div class="step-col">
        <div class="step-header"
          data-step-id={step.id}
          data-step-json={JSON.stringify(step)}>
          <span class="step-num">{step.num}</span>
          <span class="step-name">{step.name}</span>
          <span class="step-short">{step.shortDesc}</span>
          <div class="strength-bar"
            style={`--us:${step.usStrength * 20}%; --kr:${step.krStrength * 20}%`}
          ></div>
        </div>
        <div class="company-list">
          {getCompanies(step.id).map(co => (
            <div class="co-chip"
              data-co-id={co.id}
              data-country={co.country}
              data-co-json={JSON.stringify(co)}>
              <span class="co-flag">{co.flag}</span>
              <div>
                <div class="co-name">{co.name}</div>
                <div class="co-cap">{co.marketCapDisplay}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {i < steps.length - 1 && <div class="arrow">›</div>}
    ))}
  </div>

</div>

<script is:inline>
// 필터·패널 토글 인터랙션
// (빌드 시 번들링 없이 인라인 실행)
(function() {
  let activeMode = 'all';
  let activeStepId = null;
  let activeCoId = null;

  // 필터 버튼
  document.querySelectorAll('.f-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeMode = btn.dataset.mode;
      document.querySelectorAll('.f-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilter();
    });
  });

  // 단계 헤더
  document.querySelectorAll('.step-header').forEach(hdr => {
    hdr.addEventListener('click', () => {
      const id = hdr.dataset.stepId;
      if (activeStepId === id) {
        activeStepId = null;
        hidePanel('step-detail-panel');
      } else {
        activeStepId = id;
        activeCoId = null;
        hidePanel('company-detail-panel');
        showStepPanel(JSON.parse(hdr.dataset.stepJson));
      }
    });
  });

  // 기업 칩
  document.querySelectorAll('.co-chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = chip.dataset.coId;
      if (activeCoId === id) {
        activeCoId = null;
        hidePanel('company-detail-panel');
      } else {
        activeCoId = id;
        activeStepId = null;
        hidePanel('step-detail-panel');
        showCompanyPanel(JSON.parse(chip.dataset.coJson));
      }
    });
  });

  function applyFilter() {
    document.querySelectorAll('.co-chip').forEach(chip => {
      const c = chip.dataset.country;
      if (activeMode === 'all') chip.classList.remove('dimmed');
      else if (activeMode === 'us' && c !== 'US') chip.classList.add('dimmed');
      else if (activeMode === 'kr' && c !== 'KR') chip.classList.add('dimmed');
      else chip.classList.remove('dimmed');
    });
  }

  function showStepPanel(step) {
    const p = document.getElementById('step-detail-panel');
    p.classList.remove('hidden');
    p.innerHTML = `
      <h3>${step.num} — ${step.name}</h3>
      <p>${step.fullDesc}</p>
      <div class="myth-box">
        <span class="myth-label">자주 하는 오해</span>
        <strong>"${step.myth.claim}"</strong>
        <p>→ ${step.myth.fact}</p>
      </div>
    `;
  }

  function showCompanyPanel(co) {
    const p = document.getElementById('company-detail-panel');
    p.classList.remove('hidden');
    p.innerHTML = `
      <div class="cp-head">
        <span class="cp-flag">${co.flag}</span>
        <div>
          <div class="cp-name">${co.name}</div>
          <div class="cp-role">${co.segment} · ${co.marketCapDisplay}</div>
        </div>
      </div>
      <div class="cp-stats">
        <div><span>매출</span><strong>${co.revenue.value}</strong></div>
        <div><span>영업이익</span><strong>${co.operatingIncome?.value ?? '—'}</strong></div>
        <div><span>임직원</span><strong>${co.employees}</strong></div>
      </div>
      <p class="cp-desc">${co.roleDesc}</p>
      <div class="cp-why">${co.whyItMatters}</div>
      <div class="cp-etfs">
        <span>포함 ETF</span>
        ${co.etfs.map(e => `<span class="etf-pill">${e}</span>`).join('')}
      </div>
    `;
  }

  function hidePanel(id) {
    document.getElementById(id).classList.add('hidden');
  }
})();
</script>
```

### 5-3. StrengthMap.astro

```astro
---
// src/components/value-chain/StrengthMap.astro
interface Props { steps: Step[] }
const { steps } = Astro.props;
---

<section class="strength-map">
  <h2>어느 단계에서 강한가</h2>
  <div class="strength-grid">
    {steps.map(step => (
      <div class="sm-row">
        <span class="sm-label">{step.name}</span>
        <div class="sm-bars">
          <div class="sm-bar us" style={`width: ${step.usStrength * 20}%`}>
            <span class="bar-label">미국</span>
          </div>
          <div class="sm-bar kr" style={`width: ${step.krStrength * 20}%`}>
            <span class="bar-label">한국</span>
          </div>
        </div>
      </div>
    ))}
  </div>
  <div class="strength-note">
    <p>대만(TSMC)은 파운드리 단독 압도. 일본은 소재 영역 강세. 네덜란드(ASML)는 EUV 장비 독점.</p>
  </div>
</section>
```

### 5-4. MythSection.astro

```astro
---
// src/components/value-chain/MythSection.astro
interface Props { steps: Step[] }
const { steps } = Astro.props;

// 대표 오해 3개만 추출
const myths = steps
  .filter(s => ['design', 'foundry', 'packaging'].includes(s.id))
  .map(s => s.myth);
---

<section class="myth-section">
  <h2>자주 하는 오해 3가지</h2>
  <div class="myth-grid">
    {myths.map((myth, i) => (
      <div class="myth-card">
        <div class="myth-num">오해 {i + 1}</div>
        <p class="myth-claim">"{myth.claim}"</p>
        <p class="myth-fact">→ {myth.fact}</p>
      </div>
    ))}
  </div>
</section>
```

---

## 6. 내부 링크 아키텍처

```
/reports/semiconductor-value-chain/     ← 이 페이지
  │
  ├── ← /reports/semiconductor-etf-2026/ (ETF 리포트에서 "더 알아보기" 유입)
  │
  ├── → /reports/semiconductor-etf-2026/ (ETF 비교 리포트)
  ├── → /reports/soxx-vs-smh-2026/ (SOXX vs SMH 비교)
  ├── → /reports/semiconductor-market-cap-2026/ (반도체 시총 순위)
  │
  └── → /calculators/dca/ (적립식 계산기 CTA)
```

**ETF 리포트에서 이 페이지로 유입 경로**

```
/reports/semiconductor-etf-2026/
  S2. ETF 비교 표 하단 →
  "이 ETF들이 담고 있는 기업들이 반도체 밸류체인 어디에 있는지 보기 →"
```

---

## 7. 실행 체크리스트

```
데이터 준비
[ ] src/data/value-chain/steps.json 작성 (6개 단계)
[ ] src/data/value-chain/companies.json 작성 (20개 기업)
[ ] src/data/value-chain/meta.json 작성

컴포넌트 개발
[ ] FlowMap.astro 스캐폴딩
[ ] StrengthMap.astro 스캐폴딩
[ ] MythSection.astro 스캐폴딩
[ ] RelatedLinks.astro 스캐폴딩
[ ] CompanyCard.astro (FlowMap 내부 패널용)

페이지 개발
[ ] semiconductor-value-chain.astro 생성
[ ] Hero 섹션 작성
[ ] SEO 메타 태그 설정
[ ] 모바일 반응형 확인

빌드·배포
[ ] npm run build 에러 없음 확인
[ ] 모바일 뷰 (375px) 레이아웃 확인
[ ] DEPLOY_CHECKLIST.md 항목 체크
[ ] main 브랜치 푸시 → 프로덕션 배포

SEO·배포 후
[ ] 구글 서치 콘솔 URL 검사 + 색인 요청
[ ] /reports/semiconductor-etf-2026/ 에 내부 링크 추가
[ ] OG 이미지 생성 (1200×630)
[ ] 데이터 기준일 표시 확인
[ ] 투자 권유 아님 면책 고지 footer 확인
```

---

## 8. 비고

- 데이터 기준일 표시 필수. 페이지 상단 + footer 양쪽.
- 시총·매출·영업이익은 공식 IR 또는 주요 데이터 소스 기준. 추산치는 `~` 표기.
- 투자 권유 아님 문구 footer 필수.
- 대만(TSMC)·네덜란드(ASML)는 미국/한국 외 기업으로 별도 국기 표시.
- 분기별 실적 업데이트 주기 권장 (최소 반기 1회).
- 파생 페이지: 기업별 단독 리포트 (`/reports/nvidia-2026/` 등) 확장 가능.

좋습니다.
이번 v2는 단순 기획서가 아니라, **업로드한 HTML 느낌을 반영해서 바로 구현 가능한 수준으로 확장한 MD 웹기획서**로 정리하겠습니다.

참고한 방향은 두 개입니다.

* **밸류체인 인터랙티브 메인 화면**: 단계 컬럼, 국가 필터, 기업 칩, 상세 패널, 단계 설명 패널 구조 
* **기업 심층 분석 카드 화면**: 히어로, 밸류체인 포지션, 핵심 지표 카드, 매출 추이 바차트, 투자 포인트/리스크/CTA 구조 

---

# 비교계산소용 최종 MD 웹기획서 v2

## 미국·한국 반도체 밸류체인 한눈에 보기

### HTML 인터랙션 참고 확장본

---

# 1. 문서 개요

| 항목      | 내용                                                                                      |
| ------- | --------------------------------------------------------------------------------------- |
| 문서명     | 미국·한국 반도체 밸류체인 한눈에 보기                                                                   |
| 버전      | v2                                                                                      |
| 콘텐츠 타입  | 인터랙티브 리포트 + 산업 구조 학습형 웹 컨텐츠                                                             |
| 목적      | 반도체 산업의 설계, 장비·소재, 전공정, 메모리, 후공정, 테스트 흐름을 한눈에 보여주고 미국·한국 핵심 기업의 역할과 규모를 직관적으로 이해시키는 콘텐츠 |
| URL 제안  | `/reports/semiconductor-value-chain/`                                                   |
| 구현 방향   | Astro SSG 기반 정적 페이지 + JSON 데이터 바인딩 + 클라이언트 인터랙션                                         |
| 참고 레퍼런스 | 밸류체인 인터랙티브 HTML, 기업 심층 분석 HTML                                                          |

---

# 2. 기획 핵심

## 2-1. 이 콘텐츠의 본질

이 페이지는 “반도체 관련 기업 소개”가 아닙니다.

핵심은 아래입니다.

* 반도체 산업이 **어떤 순서로 흘러가는지**
* 미국과 한국이 **어느 단계에서 강한지**
* 기업들이 **서로 어떻게 연결되는지**
* 투자자가 보는 **핵심 기업/ETF가 왜 중요한지**

즉,
**산업 구조를 시각화해서 이해시키고, 그 위에 기업/투자 정보가 얹히는 구조**로 가야 합니다.

---

## 2-2. v1 대비 v2 확장 포인트

| 구분     | v1        | v2 확장                         |
| ------ | --------- | ----------------------------- |
| 콘텐츠 성격 | 구조 설명 중심  | 구조 + 인터랙션 + 상세 기업 분석 연결       |
| 화면     | 텍스트 기반 기획 | 실제 HTML 컴포넌트 레벨 정의            |
| 기업 정보  | 표 수준      | 클릭형 상세 패널 + 심층 분석 카드          |
| UX     | 개념 정리     | 필터, 하이라이트, 단계 설명, CTA 포함      |
| 데이터    | 개념만 정의    | JSON 구조 및 확장 필드까지 포함          |
| 내부 확장  | ETF 연결    | 기업 상세 리포트, 장비주/메모리/HBM 시리즈 확장 |

---

# 3. 레퍼런스 HTML에서 가져갈 핵심 요소

## 3-1. 메인 인터랙션 구조

업로드한 인터랙티브 HTML은 아래 구조가 좋습니다.

* 상단 **전체 / 미국 강세 구간 / 한국 강세 구간** 필터 버튼
* 단계별 컬럼 구조
* 단계 클릭 시 **단계 설명 박스**
* 기업 클릭 시 **상세 패널**
* 국가별 색상 구분
* 단계별 강세 바 표시 

이 구조는 그대로 살리는 게 좋습니다.

---

## 3-2. 기업 상세 리포트 구조

Lam Research HTML은 아래 패턴이 좋습니다.

* 히어로 영역
* 태그 배지
* 밸류체인 포지션 표시
* KPI 카드 4개
* 연도별 매출 추이
* 핵심 경쟁력 바
* 투자 포인트 / 제품 라인 / 리스크 / 포함 ETF / CTA 

이건 메인 페이지 내 “간이 패널”과 별개로,
**기업 상세 서브페이지 템플릿**으로 확장하는 데 적합합니다.

---

# 4. 최종 페이지 목표

## 4-1. 사용자 목표

사용자가 이 페이지를 보고 아래 질문에 답을 얻어야 합니다.

* 엔비디아는 설계 회사인가 제조 회사인가?
* TSMC와 삼성전자는 반도체 밸류체인에서 어디에 있나?
* SK하이닉스와 마이크론은 같은 그룹인가?
* ASML, Lam Research, KLA, 한미반도체, ISC는 왜 중요한가?
* 미국 강점과 한국 강점은 어디서 갈리나?
* 어떤 ETF가 이 기업들을 담고 있나?

---

## 4-2. 서비스 목표

* 검색 유입 확보
* 반도체 ETF/기업 리포트 허브 역할
* 체류시간 증가
* 기업 상세 페이지 및 ETF 리포트로 내부 이동 유도

---

# 5. 페이지 전체 구조

## 5-1. 최종 섹션 맵

| 순서 | 섹션명            | 역할                      |
| -- | -------------- | ----------------------- |
| 1  | 히어로            | 페이지 주제 정의               |
| 2  | 빠른 필터 바        | 전체/미국/한국/AI/HBM/장비 등 필터 |
| 3  | 인터랙티브 밸류체인 맵   | 핵심 메인 인터랙션              |
| 4  | 단계 설명 패널       | 선택 단계 설명                |
| 5  | 기업 상세 패널       | 선택 기업 KPI 및 설명          |
| 6  | 미국 vs 한국 강점 요약 | 국가별 산업 포지션 설명           |
| 7  | 핵심 기업 규모 비교 표  | 시총/매출/영업이익/직원 수         |
| 8  | 밸류체인 연결 스토리    | 설계→생산→메모리→패키징 연결 이해     |
| 9  | 관련 ETF 연결      | ETF/리포트 이동              |
| 10 | 관련 리포트/계산기     | 내부 링크 허브                |

---

# 6. 히어로 섹션 기획

## 제목

**미국·한국 반도체 밸류체인 한눈에 보기**

## 서브카피

**설계부터 장비, 전공정, 메모리, 후공정, 테스트까지. 반도체 산업의 흐름과 핵심 기업 위치를 한 번에 이해할 수 있습니다.**

## 보조 문구

**엔비디아, TSMC, 삼성전자, SK하이닉스, ASML, Lam Research, 한미반도체가 어디에서 연결되는지 확인해보세요.**

## 추천 UI

* 대표 기업 태그 6개
* “전체 보기”
* “미국 강세 구간”
* “한국 강세 구간”
* “AI/HBM 중심 보기”

---

# 7. 상단 필터 바 기획

참고 HTML의 mode-bar 구조를 확장합니다. 

## 기본 필터

| 필터       | 설명             |
| -------- | -------------- |
| 전체 보기    | 전체 밸류체인 표시     |
| 미국 강세 구간 | 미국 기업/강세 구간 강조 |
| 한국 강세 구간 | 한국 기업/강세 구간 강조 |

## 확장 필터

| 필터         | 설명                                                   |
| ---------- | ---------------------------------------------------- |
| AI 중심      | NVIDIA, HBM, 고성능 패키징 관련 흐름 강조                        |
| 메모리 중심     | 삼성전자, SK하이닉스, Micron 강조                              |
| 장비 중심      | ASML, Lam Research, KLA, Applied Materials, 원익IPS 강조 |
| ETF 포함 기업만 | ETF와 연결된 주요 기업만 표시                                   |

---

# 8. 인터랙티브 밸류체인 맵 기획

## 8-1. 기본 구조

단계별 세로 컬럼 구조를 유지합니다.
현재 HTML의 `flow-wrap → step-col → step-hdr → step-firms` 구조가 직관적입니다. 

## 8-2. 단계 정의

| 단계 ID     | 단계명       | 설명            |
| --------- | --------- | ------------- |
| design    | 설계(팹리스)   | 칩 구조 설계       |
| equipment | 장비·소재     | 제조 장비/소재 공급   |
| foundry   | 전공정(파운드리) | 웨이퍼 가공/생산     |
| memory    | 메모리       | DRAM/NAND/HBM |
| packaging | 후공정·패키징   | 적층/봉지/조립      |
| test      | 테스트·검사    | 검사/불량 선별      |

## 8-3. 표시 방식

* 각 단계는 **단계 번호 + 단계명 + 예시 텍스트 + 강세 바**
* 기업은 **칩 형태 pill**
* 미국/한국/기타 국가별 색상 구분
* 단계 간 흐름은 화살표 연결

## 8-4. 단계 설명 패널

현재 HTML처럼 단계 클릭 시 하단/상단에 설명 패널 노출. 

### 노출 항목

* 단계명
* 한 줄 설명
* 왜 중요한지
* 흔한 오해
* 대표 기업

---

# 9. 기업 칩 표시 정책

## 칩 정보

기업 칩에는 최소 아래를 표시합니다.

* 국기 또는 국가 배지
* 기업명
* 시총 또는 규모 요약

## 예시

| 표시 항목 | 예시                   |
| ----- | -------------------- |
| 기업명   | NVIDIA               |
| 국가    | 🇺🇸                 |
| 축약 지표 | $4.4T                |
| 강조 태그 | AI / HBM / 장비 / 파운드리 |

## 상태

* 기본
* hover
* selected
* dimmed

현재 참고 HTML의 `.firm`, `.firm.sel`, `.firm.dim` 상태 구조를 그대로 가져가면 좋습니다. 

---

# 10. 기업 상세 패널 기획

참고 HTML의 detail 패널 구조를 사용합니다. 

## 패널 노출 항목

| 항목      | 설명               |
| ------- | ---------------- |
| 기업명     | 클릭한 회사명          |
| 국가      | 미국 / 한국 / 기타     |
| 밸류체인 위치 | 설계 / 장비 / 파운드리 등 |
| 시가총액    | 최신 규모            |
| 최근 매출   | 연간 기준            |
| 영업이익    | 연간 기준            |
| 임직원 수   | 최신 기준            |
| 핵심 역할   | 1~2문장 설명         |
| 왜 중요한가  | 투자/산업 관점 핵심 포인트  |
| 포함 ETF  | 관련 ETF pill      |
| CTA     | 기업 상세 보기         |

## CTA 문구

기존 “더 알아보기 ↗”는 유지 가능하지만, 비교계산소 톤으로는 아래가 더 좋습니다.

* 기업 상세 리포트 보기
* 포함 ETF 확인하기
* 이 기업의 투자 포인트 보기

---

# 11. 기업 상세 서브페이지 템플릿

Lam Research HTML을 기업 심층 분석 템플릿으로 씁니다. 

## 템플릿 구성

| 섹션        | 설명                       |
| --------- | ------------------------ |
| Hero      | 기업명, 한 줄 정의, 배지          |
| 밸류체인 위치   | 단계별 포지션                  |
| KPI 카드    | 매출, 최근 분기, 영업이익률, 시장 점유율 |
| 연도별 매출 추이 | 3~5년 바 차트                |
| 핵심 경쟁력    | 시장 점유율, 제품별 강점           |
| 투자 포인트    | AI/HBM/첨단공정 수혜 논리        |
| 리스크 요인    | 규제, CAPEX 사이클, 경쟁        |
| 포함 ETF    | ETF pill                 |
| 관련 CTA    | 비교 기업 / 관련 ETF / 사이클 설명  |

## 적용 대상

* NVIDIA
* TSMC
* 삼성전자
* SK하이닉스
* ASML
* Lam Research
* KLA
* 한미반도체
* 원익IPS
* ISC
* 리노공업

---

# 12. 미국 vs 한국 강점 비교 섹션

## 제목

**미국과 한국은 반도체 산업에서 어디가 강할까**

## 비교 표

| 구분    | 미국                              | 한국                         |
| ----- | ------------------------------- | -------------------------- |
| 강한 영역 | 설계, 장비, 플랫폼                     | 메모리, 일부 장비/부품, 제조 경쟁력      |
| 대표 기업 | NVIDIA, AMD, Broadcom, Lam, KLA | 삼성전자, SK하이닉스, 한미반도체, 원익IPS |
| 핵심 해석 | 설계와 생태계 주도                      | 생산과 메모리 주도                 |
| 투자 관점 | 고성장·고부가                         | 생산/수요 사이클 민감               |

## 보조 카드

* 미국 강세 구간
* 한국 강세 구간
* 서로 연결되는 지점
* AI 시대 최대 수혜 축

---

# 13. 핵심 기업 규모 비교 표

## 목적

인터랙티브에서 감성적으로 이해한 내용을 숫자로 정리

## 표 컬럼

| 컬럼     | 설명                     |
| ------ | ---------------------- |
| 기업     | 회사명                    |
| 국가     | 미국/한국/기타               |
| 단계     | 설계/장비/파운드리/메모리/후공정/테스트 |
| 핵심 기술  | GPU/HBM/EUV/식각/패키징 등   |
| 시총     | 최신 시가총액                |
| 최근 매출  | 연간                     |
| 영업이익   | 연간                     |
| 임직원 수  | 최신                     |
| 포함 ETF | 대표 ETF                 |

## 기능

* 정렬
* 필터
* 모바일 카드 전환
* “기업 상세 보기” 링크

---

# 14. 연결 관계 설명 섹션

## 제목

**반도체는 한 회사가 다 만드는 산업이 아닙니다**

## 설명 흐름 예시

1. NVIDIA가 GPU를 설계
2. TSMC가 첨단 공정으로 생산
3. SK하이닉스/삼성전자/Micron이 HBM 메모리를 공급
4. ASML, Lam Research, KLA 장비가 생산 공정을 지원
5. 한미반도체, Amkor 등이 후공정과 패키징을 담당
6. 최종적으로 AI 서버, 데이터센터, 스마트폰, 자동차에 탑재

## UI 제안

* 선택 기업 기준 연결선 하이라이트
* “NVIDIA 중심으로 보기”
* “HBM 공급망 보기”
* “TSMC 중심 생산 흐름 보기”

---

# 15. ETF 연결 섹션

## 제목

**이 기업들은 어떤 ETF에 들어갈까**

## 구성

| 기업           | 대표 ETF 예시                       |
| ------------ | ------------------------------- |
| NVIDIA       | SOXX, SMH                       |
| Broadcom     | SOXX, SMH, 미국반도체 ETF            |
| Micron       | SOXX, RISE 미국반도체NYSE            |
| SK하이닉스       | RISE AI반도체TOP10, ACE AI반도체TOP3+ |
| 삼성전자         | 국내 반도체 ETF 다수                   |
| 한미반도체        | 국내 AI 반도체 ETF                   |
| Lam Research | SOXX, XSD, PSI                  |

## CTA

* 미국·한국 반도체 ETF 비교 리포트 보기
* SOXX vs SMH 비교 보기
* 한국 반도체 ETF 비교 보기

---

# 16. HTML 느낌 확장 방향

## 16-1. 메인 페이지 스타일 방향

현재 HTML은 깔끔하고 정보 구조가 잘 잡혀 있습니다. 특히 아래가 강점입니다.

* 좁은 폰트 사이즈로 정보 밀도 확보
* pill 버튼/칩 UI
* light neutral background 기반 카드
* 선택/hover 상태 명확
* 단계형 정보 구조가 잘 보임 

## 16-2. v2에서 추가할 것

| 항목               | 추가 방향               |
| ---------------- | ------------------- |
| sticky filter    | 스크롤 시 상단 고정         |
| mini legend      | 미국/한국/기타 색상 범례 고정   |
| search box       | 기업명 검색              |
| compare mode     | 2개 기업 비교            |
| mobile accordion | 단계별 접기/펼치기          |
| graph block      | 간단 매출/시총 미니차트       |
| deep link        | 기업 클릭 시 URL hash 변경 |

---

# 17. 데이터 구조 제안

## JSON 예시

```json
{
  "steps": [
    {
      "id": "design",
      "name": "설계(팹리스)",
      "short": "칩 아키텍처 설계",
      "description": "공장 없이 칩 설계만 담당하는 단계",
      "strength": { "us": 5, "kr": 0 }
    }
  ],
  "companies": [
    {
      "id": "nvidia",
      "name": "NVIDIA",
      "country": "US",
      "step": "design",
      "marketCap": "$4.4T",
      "revenue": "$215.9B",
      "operatingIncome": "$134.1B",
      "employees": "42,000+",
      "tags": ["AI", "GPU", "데이터센터"],
      "summary": "AI GPU와 데이터센터 가속기 설계",
      "whyImportant": "AI 인프라 생태계의 중심",
      "connections": ["tsmc", "sk_hynix", "samsung", "micron"],
      "etfs": ["SOXX", "SMH"],
      "slug": "/reports/company/nvidia/"
    }
  ]
}
```

---

# 18. 컴포넌트 구조 제안

## Astro 기준 파일 구조 예시

```text
src/
 ├─ pages/
 │   └─ reports/
 │       └─ semiconductor-value-chain.astro
 ├─ components/
 │   ├─ semiconductor/
 │   │   ├─ ValueChainHero.astro
 │   │   ├─ ValueChainFilters.tsx
 │   │   ├─ ValueChainFlow.tsx
 │   │   ├─ StepDetailPanel.tsx
 │   │   ├─ CompanyDetailPanel.tsx
 │   │   ├─ CountryStrengthSection.astro
 │   │   ├─ CompanyComparisonTable.tsx
 │   │   └─ RelatedEtfLinks.astro
 ├─ data/
 │   └─ semiconductor.json
```

---

# 19. 실제 카피 초안

## Hero 카피

**반도체 산업은 엔비디아 같은 설계 회사 하나로 끝나지 않습니다.
설계, 장비, 파운드리, 메모리, 후공정, 테스트까지 여러 기업이 연결되어 움직입니다.
미국과 한국의 핵심 기업이 어디에 위치하는지 한눈에 확인해보세요.**

## Step Detail 카피 예시

**설계(팹리스)**
공장 없이 칩 구조와 아키텍처를 설계하는 단계입니다. AI 시대에는 설계 역량과 소프트웨어 생태계가 기업 가치를 크게 좌우합니다.

## Company Detail 카피 예시

**SK하이닉스**
HBM과 DRAM 중심의 글로벌 메모리 기업입니다. AI GPU 한 장당 들어가는 HBM 가치가 커지면서 AI 인프라 수혜의 핵심 기업으로 평가받습니다.

---

# 20. SEO 기획

## 제목 제안

* 미국·한국 반도체 밸류체인 한눈에 보기
* 반도체 전공정 후공정 차이와 핵심 기업 정리
* 엔비디아·TSMC·삼성전자·SK하이닉스는 어디에서 연결될까

## 메타 설명

반도체 산업의 설계, 장비, 전공정, 메모리, 후공정, 테스트 흐름을 한눈에 정리했습니다. 미국과 한국 핵심 기업의 위치, 역할, 규모, 연결 구조를 쉽게 확인할 수 있습니다.

---

# 21. 내부 링크 전략

## 연결 대상

* 미국·한국 반도체 ETF 비교 리포트
* SOXX vs SMH 비교 리포트
* NVIDIA 상세 리포트
* Lam Research 상세 리포트
* SK하이닉스 vs 삼성전자 비교
* HBM 관련 기업 정리
* 파이어족 계산기 / DCA 계산기

---

# 22. 실무 체크리스트

## 콘텐츠

* [ ] 단계별 설명 카피 작성
* [ ] 기업별 한 줄 정의 작성
* [ ] 강점 비교 문구 작성
* [ ] 연결 스토리 작성
* [ ] FAQ 5개 구성

## 디자인

* [ ] 필터 버튼 고정
* [ ] 단계 컬럼 반응형 대응
* [ ] 모바일 카드형 구조
* [ ] 범례 UI 고정
* [ ] selected / dimmed 상태 정리

## 데이터

* [ ] 기업별 시총/매출/영업이익/직원 수
* [ ] ETF 매핑
* [ ] 연결 기업 목록
* [ ] 국가/단계/기술 태그
* [ ] 상세 리포트 URL

## 개발

* [ ] JSON 기반 렌더링
* [ ] URL hash 동기화
* [ ] 필터 상태 관리
* [ ] SSR/SSG 빌드 확인
* [ ] 모바일 성능 점검

---

# 23. 최종 한 줄 기획 정의

**미국·한국 반도체 핵심 기업을 설계, 장비, 전공정, 메모리, 후공정, 테스트 흐름에 따라 시각적으로 배치하고, 각 기업의 역할·규모·ETF 연결까지 한 번에 이해할 수 있게 만든 인터랙티브 산업 지도형 웹 컨텐츠**

---

# 24. 바로 다음 단계 추천

다음은 2개 중 하나로 바로 가면 됩니다.

| 단계 | 결과물                                                               |
| -- | ----------------------------------------------------------------- |
| A  | **실제 페이지 문구 포함 v3** — 섹션별 완성 카피/표/FAQ까지                           |
| B  | **Claude/Codex 구현 프롬프트** — 업로드한 HTML 스타일 반영해서 Astro 컴포넌트로 개발용 명령문 |

원하시면 바로 이어서
**“비교계산소용 최종 MD 웹기획서 v3 + 실제 문구 풀버전”**으로 확장해드리겠습니다.
