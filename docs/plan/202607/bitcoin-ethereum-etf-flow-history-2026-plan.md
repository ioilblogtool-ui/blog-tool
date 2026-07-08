# 비트코인·이더리움 ETF 자금 흐름 — 출시부터 지금까지 기획서

## 1. 문서 개요

| 항목 | 내용 |
|---|---|
| 콘텐츠명 | 비트코인·이더리움 ETF, 출시부터 지금까지 — 순유입은 가격을 얼마나 움직였나 |
| 예상 URL | `/reports/bitcoin-ethereum-etf-flow-history-2026/` |
| 콘텐츠 유형 | 정보성 리포트 (출시 이후 회고형 타임라인, 정적 페이지) |
| 카테고리 | crypto |
| 연결 리포트 | `/reports/bitmine-vs-strategy-2026/`, `/reports/ethereum-undervaluation-thesis-2026/`, `/reports/bitcoin-annual-return-history/`, `/reports/ethereum-historical-returns-2015-2026/` |
| 연결 계산기 | `/tools/coin-dca-calculator/` |
| 작성 기준일 | 2026-07-07 |

## 2. 기획 배경

원래 이 주제("ETF 순유입이 가격에 미치는 영향")를 처음 제안했을 때 우려했던 지점은 **순유입 데이터가 거의 매일 바뀌어서 정적 리포트로는 금방 낡는다**는 것이었다. 이번에 사용자가 "출시되고 지금까지의 이야기"로 방향을 좁혀줘서, 이 문제를 회고형 타임라인으로 우회한다 — 매일 갱신하는 라이브 트래커가 아니라, **"BTC ETF는 2024년 1월, ETH ETF는 2024년 7월에 나온 뒤 지금(2026년 7월)까지 무슨 일이 있었나"**를 정리하는 방식이다. 이는 이미 잘 작동하고 있는 사이트의 `이더리움 역사 수익률`, `비트코인 연도별 수익률 역사` 리포트와 동일한 회고형 서사 패턴이라 유지보수 부담이 훨씬 적다.

오늘 만든 두 리포트(`비트마인 vs 스트래티지`, `이더리움 저평가론`)에서 이미 "2026년 이더리움 현물 ETF 순유출"을 회의론 근거로 언급했는데, 이 리포트는 그 배경이 되는 ETF 자금 흐름 전체 역사를 깊게 다뤄 세 리포트를 자연스럽게 묶는다.

**중요 — 데이터 신선도 원칙:** 이 리포트의 누적 순유입액·월별 유출입 수치는 **조회 시점 기준 스냅샷**이며 매일 계속 변한다. 구현 시 반드시 "OO월 기준"을 모든 수치 옆에 명시하고, 라이브 업데이트를 약속하지 않는다. 향후 분기 단위로 수동 갱신하는 것을 권장한다(매일·매주 갱신은 운영 부담 대비 실익이 낮음).

## 3. 팩트 체크 결과 (2026-07-07 기준, 스냅샷)

### 출시 시점
- **비트코인 현물 ETF**: 2024년 1월 미국에서 승인·출시 (BlackRock IBIT, Fidelity FBTC, ARK 21Shares ARKB, Grayscale GBTC 전환 등)
- **이더리움 현물 ETF**: 2024년 7월 미국에서 승인·출시 (BlackRock ETHA, Fidelity FETH 등)

### 누적 순유입 (조회 시점 기준 스냅샷 — 구현 시 재확인 필수)
- 비트코인 ETF 누적 순유입액은 2025년 10월 약 630억 달러로 최고치를 기록한 뒤, 2026년 상반기 조정을 거치며 약 530억~570억 달러 수준으로 감소.
- 2026년 6월, 비트코인 현물 ETF에서 약 45억 달러 순유출 — 2024년 1월 출시 이후 최대 월간 유출 규모로 보도됨.
- 이더리움 ETF는 출시 첫해(2024년 7월) 월 최대 약 54억 달러 순유입을 기록한 바 있으나, 전체 누적 규모는 비트코인 ETF 대비 훨씬 작고 월별 변동성이 큰 편.

### 가격 흐름 (사이트 내 기존 리포트 데이터 재사용 — 새 숫자 생성 금지)
- **BTC**: ETF 출시 시점(2024년 초) $42,208 → 2024년 말 $93,800(+122%) → 2025년 말 $94,200(횡보) → 2026년 7월 현재 $60,000(연초 대비 -36.3%). ETF 출시 이후 누적으로는 여전히 플러스.
- **ETH**: 2024년 초 $2,351 → 2024년 말(ETF 출시 이후) $3,340(+42%) → 2025년 말 $2,971(-11.6%) → 2026년 7월 현재 $1,581(연초 대비 -47.3%). ETF 출시 이후 누적으로는 마이너스 구간.
- 두 자산의 ETF 출시 이후 성과 차이(BTC 플러스 vs ETH 마이너스)가 이 리포트의 핵심 대비 포인트.

### 핵심 사건 타임라인 (초안)
1. 2024-01: 비트코인 현물 ETF 승인·출시
2. 2024-07: 이더리움 현물 ETF 승인·출시, 월 54억 달러 순유입(당시 최대)
3. 2025-10: 비트코인 ETF 누적 순유입 약 630억 달러로 정점
4. 2026-06: 비트코인 ETF 월간 45억 달러 순유출 — 출시 이후 최대 월간 유출
5. 2026-06 말: 순유출 행진 종료, 일시적 순유입 전환과 함께 BTC 가격 $63,000대 반등

## 4. 타깃 키워드

### 메인 키워드
- 비트코인 ETF 순유입
- 이더리움 ETF 순유입
- 비트코인 이더리움 ETF 자금 흐름

### 보조 키워드
- 비트코인 ETF 출시 이후
- 이더리움 ETF 순유출
- IBIT 자금 흐름
- ETHA 자금 흐름

### 롱테일 질문형 키워드
- 비트코인 ETF는 언제 나왔나요
- ETF 순유입이 비트코인 가격에 영향을 주나요
- 비트코인과 이더리움 중 ETF 성과가 더 좋은 건 어디인가요

## 5. 검색 의도 분석

| 검색 의도 | 사용자가 알고 싶은 것 | 대응 콘텐츠 |
|---|---|---|
| 배경 이해 | ETF가 언제 왜 나왔는지 | 출시 시점·배경 섹션 |
| 규모 확인 | 지금까지 얼마나 들어왔는지 | 누적 순유입 스냅샷 |
| 영향 확인 | 자금 흐름과 가격이 정말 연동되는지 | 사건 타임라인 + 가격 대조 |
| 비교 | BTC ETF와 ETH ETF 중 뭐가 더 성공적인지 | BTC vs ETH 성과 비교 |
| 최신 확인 | 지금은 어떤 상황인지 | 2026년 상반기 순유출 섹션 |

## 6. SEO 메타 초안

### Title 후보
1. `비트코인·이더리움 ETF 2026 | 출시부터 지금까지 자금 흐름 총정리`
2. `비트코인 이더리움 ETF 순유입 2026 | 출시 이후 가격은 얼마나 변했나`

권장안: **`비트코인·이더리움 ETF 2026 | 출시부터 지금까지 자금 흐름 총정리`**

### Description 후보
`2024년 출시된 비트코인·이더리움 현물 ETF의 누적 순유입액과 주요 유출입 사건을 정리하고, 같은 기간 가격 흐름과 나란히 대조했습니다. BTC는 여전히 플러스, ETH는 마이너스입니다.` (약 100자)

### H1
`비트코인·이더리움 ETF, 출시부터 지금까지`

## 7. 페이지 구성

### 7-1. Hero
- Eyebrow: `ETF 자금 흐름`
- H1: `비트코인·이더리움 ETF, 출시부터 지금까지`
- 요약 3개: 출시 시점, 누적 순유입 규모, BTC/ETH 성과 대비

### 7-2. 출시 시점과 배경
- BTC ETF 카드: 2024년 1월, 주요 상품(IBIT, FBTC, ARKB, GBTC)
- ETH ETF 카드: 2024년 7월, 주요 상품(ETHA, FETH)

### 7-3. 누적 순유입 스냅샷 ★ (조회 시점 명시)
- BTC 누적: 약 530억~570억 달러 (2025-10 정점 630억 달러 대비 조정)
- ETH 누적: BTC 대비 훨씬 작은 규모, 월별 변동성 큼
- "이 수치는 계속 바뀝니다" 안내 문구 필수

### 7-4. 핵심 사건 타임라인
- 5개 사건(3-핵심 사건 타임라인 초안 참조)을 시간순 카드로 배치
- 각 사건 옆에 해당 시점 가격 맥락을 함께 표기

### 7-5. 가격으로 보면 — ETF 출시 이후 BTC vs ETH
| 자산 | ETF 출시 시점 가격 | 2026년 7월 현재 | 출시 이후 누적 |
|---|---|---|---|
| BTC | $42,208 (2024년 초) | $60,000 | 여전히 플러스 |
| ETH | $2,351 (2024년 초) | $1,581 | 마이너스 |

### 7-6. FAQ (5개)
1. 비트코인·이더리움 ETF는 언제 출시됐나요?
2. ETF 순유입이 많으면 가격이 오르나요?
3. 지금(2026년 상반기) ETF 자금 흐름은 어떤가요?
4. 비트코인과 이더리움 중 ETF 성과는 어디가 더 좋았나요?
5. 이 리포트의 순유입 수치는 실시간인가요?

### 7-7. CTA
- `비트코인 연도별 수익률 보기` → `/reports/bitcoin-annual-return-history/`
- `이더리움 역사 수익률 보기` → `/reports/ethereum-historical-returns-2015-2026/`
- `이더리움 저평가론 보기` → `/reports/ethereum-undervaluation-thesis-2026/`
- `코인 적립식 투자 계산기` → `/tools/coin-dca-calculator/`

## 8. 데이터/콘텐츠 구조 제안

예상 파일: `src/data/bitcoinEthereumEtfFlowHistory2026.ts`

```ts
export const BEF_META = { slug, title, seoTitle, seoDescription, description, updatedAt, dataNote };
export const BEF_LAUNCH_PROFILES = [ /* BTC, ETH 출시 카드 2개 */ ];
export const BEF_CUMULATIVE_SNAPSHOT = [ /* BTC, ETH 누적 순유입 스냅샷 */ ];
export const BEF_EVENT_TIMELINE = [ /* 5개 사건 */ ];
export const BEF_PRICE_COMPARISON = [ /* 7-5 표 */ ];
export const BEF_FAQ = [ /* 5개 */ ];
export const BEF_RELATED_LINKS = [ /* 7-7 CTA */ ];
```

가격 데이터는 `bitcoinAnnualReturn.ts`(`BTC_YEARS`)와 `ethereumHistoricalReturns20152026.ts`(`ethereumReturnRows`)에서 2024~2026년 행을 import해서 파생 — `bitmineVsStrategy2026.ts`, `ethereumUndervaluationThesis2026.ts`와 동일한 재사용 원칙.

## 9. 내부 링크 전략

- `/reports/bitcoin-annual-return-history/` — 비트코인 연도별 수익률
- `/reports/ethereum-historical-returns-2015-2026/` — 이더리움 역사 수익률
- `/reports/bitmine-vs-strategy-2026/` — 기업 트레저리와 ETF 수요 비교 맥락
- `/reports/ethereum-undervaluation-thesis-2026/` — ETH ETF 순유출을 회의론 근거로 다룬 리포트와 연결
- `/tools/coin-dca-calculator/` — 코인 적립식 투자 계산기

## 10. 구현 파일 후보

| 파일 | 역할 |
|---|---|
| `src/data/bitcoinEthereumEtfFlowHistory2026.ts` | 리포트 데이터 |
| `src/pages/reports/bitcoin-ethereum-etf-flow-history-2026.astro` | 리포트 페이지 |
| `src/styles/scss/pages/_bitcoin-ethereum-etf-flow-history-2026.scss` | 전용 스타일 |
| `src/data/reports.ts` | 리포트 목록 등록 |
| `src/pages/index.astro` + `src/pages/reports/index.astro` | 카테고리(crypto) 등록 — 양쪽 모두 |
| `src/styles/app.scss` | 스타일 import 등록 |
| `public/sitemap.xml` | 사이트맵 등록 |

## 11. 리포트 목록 등록 초안

```ts
{
  slug: "bitcoin-ethereum-etf-flow-history-2026",
  title: "비트코인·이더리움 ETF 2026 | 출시부터 지금까지 자금 흐름 총정리",
  description: "2024년 출시된 비트코인·이더리움 현물 ETF의 누적 순유입액과 주요 유출입 사건을 정리하고, 같은 기간 가격 흐름과 나란히 대조했습니다. BTC는 여전히 플러스, ETH는 마이너스입니다.",
  order: 71,
  badges: ["비트코인", "이더리움", "ETF", "2026"],
}
```

카테고리 등록: `"bitcoin-ethereum-etf-flow-history-2026": { category: "crypto", isNew: true }` (양쪽 파일)

## 12. 구조화 데이터

- `Article`
- `FAQPage` (7-6 FAQ 5개)

## 13. 품질/주의사항

- **가장 중요**: 누적 순유입액·월별 유출입 수치는 매일 바뀌는 스냅샷이다. 모든 수치 옆에 "OO월 기준"을 명시하고, InfoNotice에 "실시간 데이터가 아니며 최신 수치는 CoinGlass 등에서 확인" 문구를 넣는다. 라이브 업데이트를 암시하는 표현(예: "실시간", "현재")은 피한다.
- 구현 시점에 순유입 수치를 반드시 재검색해 최신 스냅샷으로 갱신한다(이 기획서의 수치는 2026-07-07 검색 기준).
- BTC/ETH 가격은 `bitcoinAnnualReturn.ts`·`ethereumHistoricalReturns20152026.ts`와 동일 출처를 인용해 오늘 만든 두 리포트(`bitmine-vs-strategy-2026`, `ethereum-undervaluation-thesis-2026`)와 수치가 어긋나지 않게 한다.
- "ETF 순유입이 가격을 움직인다"는 인과관계를 단정하지 않는다 — 시점상 상관관계로만 서술하고, 다른 변수(거시경제, 규제, 기업 트레저리 수요 등)도 함께 작용했을 수 있음을 명시한다.
- 향후 갱신 주기는 분기 단위를 권장(월간·주간 갱신은 이 사이트의 정적 리포트 운영 방식과 맞지 않음).

## 14. 구현 우선순위

1. 정적 리포트 페이지 구현 (Hero + 출시 배경)
2. 누적 순유입 스냅샷 + 신선도 안내 구현
3. 사건 타임라인 구현
4. BTC vs ETH 가격 비교표 구현
5. FAQ 구현
6. 관련 리포트·계산기 CTA 배치
7. 리포트 목록·카테고리(양쪽)·사이트맵 등록
8. `npm run build` 검증

## 15. 기대 효과

- "비트코인 ETF", "이더리움 ETF" 자금 흐름 검색 수요를 회고형 콘텐츠로 흡수 (라이브 트래커 운영 부담 없이)
- 오늘 만든 `비트마인 vs 스트래티지`, `이더리움 저평가론` 리포트와 상호 CTA로 크립토 클러스터 완성
- BTC/ETH ETF 성과 대비라는 명확한 대비 포인트로 클릭 유인

## 16. 참고 출처

- [비트코인 ETF 자금 유입 2026년 6월: IBIT, 역대 최장 유출 행진 종료](https://www.nestree.io/bitcoin-etf-outflows-june-2026-ibit-recovery/)
- [비트코인 현물 ETF, 출시 이후 역대 최대 순유출 - ZDNet korea](https://zdnet.co.kr/view/?no=20260622092113)
- [美 비트코인 현물 ETF, 6월 45억 달러 순유출···출시 이후 최대 규모 - 뉴스웨이](https://www.newsway.co.kr/news/view?ud=2026070115011563528)
- [비트코인 현물 ETF, 12거래일 만에 드디어 '순유입'…6.3만달러 일시 회복 - 뉴스1](https://www.news1.kr/finance/blockchain-fintech/6218023)
- [이더리움 현물 ETF, 7월 순유입 54억달러…출시 이후 최대치 - 한국경제](https://www.hankyung.com/article/202508016092B)
- [비트코인·이더리움 ETF 자금 흐름, 업비트서 한눈에 본다 - 한국경제](https://www.hankyung.com/article/202606257298i)
