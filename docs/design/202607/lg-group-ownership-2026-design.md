# LG그룹 지분구조 리포트 2026 — 설계 문서

> 기획 원본: [`docs/plan/202607/corporate-group-ownership-content-2026-plan.md`](../../plan/202607/corporate-group-ownership-content-2026-plan.md)
> 조사 원자료: [`docs/plan/202607/corporate-group-ownership-research-notes-2026.md`](../../plan/202607/corporate-group-ownership-research-notes-2026.md) — 3장 "LG그룹" 절
> 선례: [`samsung-group-ownership-2026-design.md`](./samsung-group-ownership-2026-design.md) 13장 재사용 지침
> 작성일: 2026-07-16
> 유형: 비교 리포트 (`/reports/`)

---

## 1. 이 그룹의 특징 — 9개 그룹 중 가장 단순한 구조

LG는 순수지주회사 체제의 교과서적 사례다. 다중 부모(삼성의 secondaryStakes)도, 순환출자(현대차의 circularNote)도, 복수 지주사(LS의 다중 roots)도 없다 — ㈜LG 아래로 자회사들이 한 방향으로만 뻗는 단순 트리. **`OwnershipTree` 컴포넌트의 어떤 특수 필드도 쓰지 않는 첫 사례**이며, 이 점 자체가 페이지의 서사("LG는 왜 지배구조가 가장 단순하다고 평가받는가")가 된다.

## 2. 파일 목록

| 역할 | 경로 |
|---|---|
| 데이터 | `src/data/lgGroupOwnership2026.ts` |
| 페이지 | `src/pages/reports/lg-group-ownership-2026.astro` |
| 스타일 | `src/styles/scss/pages/_lg-group-ownership-2026.scss` (prefix `lgo-`) |

## 3. URL 및 메타

```
슬러그: /reports/lg-group-ownership-2026/
타이틀: LG그룹 지분구조 2026 완전 정리 | ㈜LG·LG전자·LG화학 지배관계
디스크립션: 구광모 회장 지분부터 ㈜LG→LG전자·LG화학·LG유플러스로 뻗는 순수지주회사 구조를 정리. 상장 계열사 12개 목록 포함.
```

## 4. 데이터

### 4-1. 메타
- `isLegalHoldingCompany: true`
- `holdingCompanyNote`: "순수지주회사 ㈜LG — 별도 사업을 하지 않고 자회사 지분만 보유합니다. 다중 부모·순환출자 없이 ㈜LG에서 한 방향으로 뻗는 가장 단순한 구조입니다."
- `affiliateCount: 63` (2025-05-01 기준, MEDIUM — 2026-05-01 갱신치 미확인)
- `listedAffiliateCount: 12` (HIGH — 이번 조사에서 12개 전부 종목코드 교차검증)
- `fairTradeRank: 4`

### 4-2. 트리 노드 (7개, 특수 필드 없음)

```
owner(구광모 외 특수관계인)
 └─ ㈜LG(003550) [42.54%]
     ├─ LG전자(066570) [33.7%]
     ├─ LG화학(051910) [33.3%]
     │   └─ LG에너지솔루션(373220) [79.3%]
     ├─ LG유플러스(032640) [38.25%]
     └─ LG생활건강(051900) [34.7%]
```

### 4-3. 오너·핵심 연결 표 (9행)
구광모(개인 16.60%·합산 42.54%), ㈜LG→LG전자(33.7%)·LG화학(33.3%)·LG유플러스(38.25%, HIGH — 회사 공식 IR)·LG생활건강(34.7%)·LG씨엔에스(45%, 2025년 상장 후), LG화학→LG에너지솔루션(79.3%), LG전자→로보스타(33.4%, 상장 12개 목록의 로보스타와 연결).

### 4-4. 상장 계열사 12개
㈜LG(003550)·LG전자(066570)·LG화학(051910)·LG에너지솔루션(373220)·LG이노텍(011070)·LG디스플레이(034220)·LG유플러스(032640)·LG생활건강(051900)·LG헬로비전(037560)·LG씨엔에스(064400) — 전부 KOSPI, HIGH. 로보스타(090360, KOSDAQ, HIGH). HSAD(035000, KOSDAQ 추정, **LOW** — 시장 구분 미확인).

이전 그룹들과 달리 **로보스타처럼 지주사 직속이 아니라 사업회사(LG전자)의 자회사가 상장된 케이스**가 있다는 점을 InfoNotice나 표 각주에 짚어준다.

### 4-5. FAQ (5개)
1. LG는 왜 지배구조가 가장 단순하다고 평가받나요?
2. ㈜LG는 무슨 사업을 하나요? → 순수지주회사, 별도 사업 없음
3. LG에너지솔루션은 ㈜LG 소유인가요? → 아니오, LG화학을 거친 손자회사
4. LG그룹 상장 계열사는 몇 개인가요?
5. 이 지분율은 언제 기준인가요?

## 5. 페이지 IA·컴포넌트·SCSS

삼성 설계 6~9장과 동일 구조, `sgo-` → `lgo-` prefix 교체. 순환출자 카드(현대차 전용) 같은 그룹 전용 섹션은 없음 — 가장 표준적인 5섹션 구성 그대로.

## 6. `reports.ts` / `app.scss` / `sitemap.xml`
- `order: 77.3`, `badges: ["신규", "LG", "지분구조", "2026"]`
- 삼성·SK·현대차 리포트 CTA에 LG 링크 추가

## 7. QA 포인트
- [ ] 트리에 `secondaryStakes`/`circularNote` 등 특수 필드가 전혀 없는지 (이 그룹의 "단순함" 서사와 일치해야 함)
- [ ] LG전자→로보스타 지분이 트리가 아니라 표에만 있는지 (트리는 지주사 직계만 유지)
- [ ] HSAD 종목코드가 LOW 신뢰도로 표시되는지
- [ ] `npm run build` 통과
