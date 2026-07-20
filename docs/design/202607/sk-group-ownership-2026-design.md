# SK그룹 지분구조 리포트 2026 — 설계 문서

> 기획 원본: [`docs/plan/202607/corporate-group-ownership-content-2026-plan.md`](../../plan/202607/corporate-group-ownership-content-2026-plan.md)
> 조사 원자료: [`docs/plan/202607/corporate-group-ownership-research-notes-2026.md`](../../plan/202607/corporate-group-ownership-research-notes-2026.md) — 2장 "SK그룹" 절
> 선례: [`samsung-group-ownership-2026-design.md`](./samsung-group-ownership-2026-design.md) — 이 문서는 선례의 13장 "재사용 지침"을 그대로 따른다. 컴포넌트·타입·페이지 IA·SCSS 클래스 패턴은 재도출하지 않고 이 문서에서는 **SK 고유 데이터와 편차만** 다룬다.
> 작성일: 2026-07-16
> 유형: 비교 리포트 (`/reports/`)

---

## 1. 삼성 설계와의 차이점

- SK는 **법적 지주회사(SK㈜)가 있다** — 삼성과 반대 케이스. `isLegalHoldingCompany: true`.
- 트리가 삼성보다 한 단계 더 넓다: SK㈜ 아래 자식 4개(SK스퀘어·SK이노베이션·SK텔레콤·SKC), 그중 SK스퀘어가 SK하이닉스로 한 단계 더 내려간다. **다중 부모(보조 지분) 사례는 이번 조사에서 확인되지 않아 `secondaryStakes` 없이 단순 트리**로 그린다 — `OwnershipTree` 컴포넌트는 이 필드가 없어도 동작하므로 코드 변경 불필요.
- 상장 계열사 수 자체가 불확실하다(조사 노트 기준 "약 21개, 2025년 자료"). 이번 조사로 종목코드까지 교차검증된 것은 17개뿐이라, **`listedAffiliateCount`는 표에 실제로 채운 17로 설정**하고 InfoNotice에 "약 21개로 알려져 있으나 17개만 확인됨" 고지를 추가한다 — 표시 숫자와 표 행 수가 어긋나면 QA 실패이므로(삼성 설계 14장 QA 원칙과 동일) 반드시 일치시킨다.

## 2. 파일 목록

| 역할 | 경로 |
|---|---|
| 데이터 | `src/data/skGroupOwnership2026.ts` |
| 페이지 | `src/pages/reports/sk-group-ownership-2026.astro` |
| 스타일 | `src/styles/scss/pages/_sk-group-ownership-2026.scss` (클래스 prefix `sko-`) |

`groupOwnershipTypes.ts`, `OwnershipTree.astro`, `_ownership-tree.scss`는 그대로 import — 신규 생성 없음.

## 3. URL 및 메타

```
슬러그: /reports/sk-group-ownership-2026/
타이틀: SK그룹 지분구조 2026 완전 정리 | SK㈜·SK스퀘어·SK하이닉스 지배관계
디스크립션: 최태원 회장 지분부터 SK㈜→SK스퀘어→SK하이닉스 연결까지 지분구조를 정리. 중간지주 구조와 상장 계열사 목록 포함.
```

## 4. 데이터 (`src/data/skGroupOwnership2026.ts`)

### 4-1. 메타
- `isLegalHoldingCompany: true`
- `holdingCompanyNote`: "법적 지주회사 SK㈜ — SK스퀘어(반도체·ICT 중간지주), SK이노베이션(에너지·화학 중간지주) 등 중간지주회사를 통해 계열사를 지배하는 다단계 구조입니다."
- `affiliateCount: 151` (2026-05-01, HIGH — 2023년 219개 정점 대비 대폭 정리)
- `listedAffiliateCount: 17` (표에서 실제 확인된 수 — 21개로 알려졌으나 이번 조사로 종목코드까지 교차검증된 것은 17개)
- `fairTradeRank: 2`

### 4-2. 트리 노드 (7개)

```
owner(최태원 외 특수관계인, rate 없음)
 └─ SK㈜(034730) [25.41%]
     ├─ SK스퀘어(402340) [32.14%]
     │   └─ SK하이닉스(000660) [20.5%]
     ├─ SK이노베이션(096770) [51.09%]
     ├─ SK텔레콤(017670) [30.57%]
     └─ SKC(011790) [40.64%]
```

### 4-3. 오너·핵심 연결 표 (9행)

| 연결 | 지분율 | 신뢰도 |
|---|---|---|
| 최태원 → SK㈜ (개인) | 17.9% | 중간 |
| 최태원 외 특수관계인 → SK㈜ (합산) | 25.41% | 중간 |
| SK㈜ 자사주 | 24.8% | 낮음 (단일 출처) |
| SK㈜ → SK스퀘어 | 32.14% | 중간 |
| SK㈜ → SK이노베이션 | 51.09% | 중간 |
| SK㈜ → SK텔레콤 | 30.57% | 중간 |
| SK㈜ → SKC | 40.64% | 중간 |
| SK스퀘어 → SK하이닉스 (최대주주) | 20.5% | 중간 |
| SK이노베이션 → SK에너지·SK온·SK지오센트릭 (각 100%, 비상장 완전자회사) | 100% | 높음 (구조적 확실) |

### 4-4. 상장 계열사 17개 (종목코드 전부 이번 조사에서 교차검증, HIGH)

SK㈜(034730)·SK하이닉스(000660)·SK스퀘어(402340)·SK텔레콤(017670)·SK이노베이션(096770)·SKC(011790)·SK바이오팜(326030)·SK바이오사이언스(302440)·SK가스(018670)·SK네트웍스(001740)·SK리츠(395400)·SK이터닉스(475150)·SK아이이테크놀로지(361610)·SK디스커버리(006120)·SK오션플랜트(100090)·SK케미칼(285130) — 비금융 16개 + SK증권(001510) 금융 1개.

### 4-5. FAQ (5개)
1. SK는 지주회사 체제인가요? → 예, SK㈜가 법적 지주회사
2. SK㈜와 SK스퀘어는 뭐가 다른가요? → SK㈜는 그룹 전체 지주사, SK스퀘어는 반도체·ICT 투자 전담 중간지주(2021년 SK텔레콤에서 인적분할)
3. SK하이닉스의 최대주주는 누구인가요? → SK스퀘어(20.5%), SK㈜가 아님
4. SK그룹 계열사는 몇 개인가요? → 151개(2026-05-01), 2023년 219개에서 대폭 정리
5. 이 지분율은 언제 기준인가요?

## 5. 페이지 IA·컴포넌트·SCSS

삼성 설계 6~9장과 완전히 동일한 구조 재사용 (섹션 순서, `OwnershipTree` 사용법, `sko-confidence-badge`/`sko-sector-tag` 등 클래스는 `sgo-` → `sko-` prefix만 교체). 반복 서술 생략.

## 6. `reports.ts` / `app.scss` / `sitemap.xml`

- `reports.ts`: `order: 77.1`, `badges: ["신규", "SK", "지분구조", "2026"]`
- `app.scss`: `@use 'scss/pages/sk-group-ownership-2026';` 한 줄만 추가 (`ownership-tree` 공유 파일은 이미 import됨)
- `sitemap.xml`: `/reports/sk-group-ownership-2026/` 1건 추가

## 7. 삼성 페이지 상호 연결

삼성 리포트가 SK 리포트로 CTA를 걸 수 있도록, 구현 시 `samsung-group-ownership-2026.astro`의 CTA·`related` 링크를 실제 SK 경로로 교체한다(삼성 설계 문서 14장 QA에 이미 "다른 그룹 페이지가 만들어진 뒤 링크 활성화"로 예정돼 있던 작업).

## 8. QA 포인트

- [ ] `listedAffiliateCount`(17)와 상장 계열사 표 행 수가 정확히 일치하는지
- [ ] InfoNotice에 "약 21개로 알려져 있으나 17개만 확인" 고지 노출
- [ ] SK㈜ 자사주 24.8% 항목이 낮음(회색) 배지로 표시되는지
- [ ] SK이노베이션 100% 자회사 3곳(SK에너지·SK온·SK지오센트릭)은 트리에 안 그리고 표에만 있는지 확인 (비상장, 트리 노드로 추가하지 않음)
- [ ] 삼성 리포트 CTA/related에 SK 링크가 정상 연결되는지
- [ ] `npm run build` 통과
