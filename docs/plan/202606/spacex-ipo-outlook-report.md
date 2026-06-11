# 스페이스X 상장(IPO) 전망 정리 리포트 — 기획·설계

## 개요
- slug: `spacex-ipo-outlook-2026`
- 형식: `/reports/` 인터랙티브 리포트 (계산기 아님)
- 목적: 비상장 기업 스페이스X의 밸류에이션 추이, 주주 구성, IPO(상장) 전망 루머를 정리하고, 국내 투자자가 실제로 접근 가능한 간접 투자 방법을 안내
- 타겟 독자: 미국 비상장주식·우주산업 테마에 관심 있는 개인 투자자

## 핵심 원칙 (REPORT_CONTENT_GUIDE 기준)
- 스페이스X는 비상장 기업 — 시가총액·지분율은 모두 텐더오퍼·언론 보도 기반 **추정치**임을 전 섹션에서 명확히 라벨링
- IPO 일정은 공식 발표 없음 — "루머/전망/추정" 라벨 필수
- 국내 우주 관련주(한화시스템 등)는 SpaceX와 지분 관계가 없는 **테마 연관주**임을 명시 (오인 방지, AdSense 저품질 회피)

## 페이지 구성 (IA)
1. Hero — "스페이스X 상장(IPO) 전망 정리 리포트"
2. InfoNotice — 비상장·추정치·루머 기준 안내
3. KPI 카드 — 최신 추정 기업가치, 설립연도, 머스크 지분 추정, 연매출 추정, Starlink 가입자, 직원 수
4. 회사 프로필 박스 — 설립자/본사/주요 사업부(Falcon 9·Heavy, Starship, Dragon, Starlink)
5. 밸류에이션 추이 타임라인 — 2002~2025 텐더오퍼/투자라운드 기준 추정 기업가치 변화
6. 주주 구성 — 머스크 vs 기관투자자(Founders Fund, Sequoia, Google 등) vs 임직원, bar 비교
7. 매출 구조 — Starlink vs 발사 서비스 비중 (2024 추정)
8. IPO 전망 — 머스크 발언 타임라인, Starlink 분리 상장 가능성, 애널리스트 전망 (모두 "추정/루머" 카드)
9. 국내 투자자 접근 방법 — ① 해외 비상장주식 플랫폼(자격 제한) ② Pre-IPO 펀드 ③ 간접 ETF/펀드(Destiny Tech100, ARK Venture Fund) ④ 국내 우주 테마 연관주(주의 문구)
10. FAQ (6문항)
11. 관련 리포트 링크

## 데이터/구현 파일
- `src/data/spacexIpoOutlook.ts` — META, KPI, PROFILE, VALUATION_TIMELINE, SHAREHOLDERS, REVENUE_MIX, IPO_OUTLOOK, KOREA_ACCESS, FAQ, RELATED_LINKS
- `src/pages/reports/spacex-ipo-outlook-2026.astro` — vitalik-buterin 리포트 구조 참고, prefix `spx-`
- `src/styles/scss/pages/_spacex-ipo-outlook-2026.scss` — 다크 프로필 박스 + 카드 패턴 재사용 (스페이스X 블랙/오렌지 톤)
- `src/data/reports.ts`, `public/sitemap.xml`, `src/styles/app.scss` 등록

## 관련 링크 후보
- `/reports/us-rich-top10-patterns/` (일론 머스크 프로필 포함)
- `/reports/etf-vs-direct-stock-10year-2026/`
- `/reports/us-stock-korean-real-return-2026/`
