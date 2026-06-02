# 비교표 CTA 통합 설계 문서

> 기획 문서: `docs/plan/202606/compare-menu.md`  
> 선행 구현: `/compare/`, `/compare/bonus/`, `/compare/welfare/`  
> 작성일: 2026-06-01  
> 구현 대상: 기존 계산기·리포트 페이지의 비교표 CTA 연결  
> 구현 목적: 기존 검색 유입 페이지에서 비교표 허브로 내부 회전을 만든다.

---

## 1. 문서 개요

| 항목 | 내용 |
| --- | --- |
| 단계 | 8번 CTA 통합 설계 |
| 다음 단계 | 9번 기존 페이지에 관련 비교표 CTA 추가 |
| 핵심 URL | `/compare/`, `/compare/bonus/`, `/compare/welfare/` |
| 목표 | 기존 인기 계산기·리포트에서 새 비교표 허브로 자연스럽게 이동 |
| 1차 적용 범위 | 성과급 8개, 지원금 8개, 인덱스 3개 |
| 제외 범위 | 모든 페이지 일괄 삽입, 본문 중간 과다 CTA, 신규 계산 로직 |

CTA 통합은 새 비교표 페이지를 만든 뒤 가장 중요한 내부링크 작업이다. 검색 유입이 있는 기존 계산기와 리포트에서 사용자가 “다른 선택지도 비교해볼까?”라고 생각하는 순간에 `/compare/bonus/`, `/compare/welfare/`, `/compare/`로 보내는 것이 목적이다.

---

## 2. CTA 원칙

### 2-1. 붙이는 위치

| 위치 | 권장도 | 이유 |
| --- | --- | --- |
| 결과 영역 하단 | 높음 | 계산 결과를 본 직후 비교 욕구가 가장 강함 |
| 관련 콘텐츠 섹션 | 높음 | 기존 패턴을 크게 바꾸지 않고 자연스럽게 추가 가능 |
| 본문 중간 안내 박스 | 중간 | 리포트에서 맥락 전환용으로 유효 |
| Hero 바로 아래 | 낮음 | 사용자가 아직 결과를 보지 않아 비교 CTA가 이르다 |
| 모든 페이지 공통 하단 | 낮음 | 관련성이 낮아 클릭률이 떨어질 수 있음 |

### 2-2. CTA 문구 규칙

CTA는 “비교표 보기”만 반복하지 않는다. 사용자의 현재 페이지 맥락을 이어받아 쓴다.

| 현재 페이지 유형 | CTA 문구 예시 |
| --- | --- |
| 회사별 성과급 계산기 | `다른 회사 성과급도 비교하기` |
| 업종별 성과급 비교 계산기 | `전체 성과급 비교표 보기` |
| 성과급 세후 계산기 | `세전 성과급 계산기로 돌아가기` / `성과급 비교표 보기` |
| 청년 적금 계산기 | `청년 지원금 비교표 보기` |
| 출산지원금 계산기 | `출산·육아 지원금 비교표 보기` |
| 복지급여 계산기 | `청년·출산·복지 지원금 비교 보기` |
| 인덱스 페이지 | `비교표에서 한눈에 보기` |

### 2-3. CTA 개수

한 영역에 CTA는 최대 2개만 둔다.

권장 조합:

```text
Primary: 가장 관련 깊은 하위 비교표
Secondary: 전체 비교표 허브
```

예:

```text
성과급 비교표 보기 → /compare/bonus/
비교표 전체 보기 → /compare/
```

---

## 3. CTA 타입

## 3-1. Inline Link CTA

기존 관련 콘텐츠 리스트에 링크를 1개 추가하는 방식이다. 가장 안전하고 1차 구현에 적합하다.

사용 위치:

- 기존 `related` 배열
- `relatedLinks`
- `nextLinks`
- 페이지 하단 `SeoContent.related`

예시:

```ts
{ href: "/compare/bonus/", label: "성과급 비교표 전체 보기" }
```

장점:

- 스타일 추가가 거의 필요 없다.
- 기존 UI와 충돌 가능성이 낮다.
- 여러 페이지에 빠르게 적용 가능하다.

## 3-2. Compact CTA Card

결과 영역 또는 리포트 본문 하단에 작은 카드로 넣는 방식이다.

사용 위치:

- 계산 결과 하단
- 요약 섹션 아래
- 리포트 “다음에 볼 콘텐츠” 영역

권장 구조:

```html
<aside class="compare-cta-card">
  <span>비교표</span>
  <strong>다른 선택지도 같은 기준으로 비교해보세요</strong>
  <p>회사별 계산기와 업종별 비교 계산기를 한 화면에서 확인할 수 있습니다.</p>
  <a href="/compare/bonus/">성과급 비교표 보기</a>
</aside>
```

## 3-3. Split CTA Pair

결과 이후 선택지가 2개일 때 사용한다.

예:

```text
세후 실수령액 계산하기
성과급 비교표 보기
```

성과급 페이지에서 특히 유효하다.

---

## 4. URL 매핑

| CTA 대상 | 역할 | 연결할 페이지 |
| --- | --- | --- |
| `/compare/` | 전체 비교표 허브 | 메인, tools index, reports index, 일반 비교 리포트 |
| `/compare/bonus/` | 성과급 비교표 | 성과급 계산기, 성과급 비교 계산기, 성과급 리포트 |
| `/compare/welfare/` | 지원금 비교표 | 청년, 복지급여, 출산·육아, 산후 비용 페이지 |

---

## 5. 1차 적용 대상

## 5-1. 성과급 페이지

성과급은 네이버 유입이 이미 검증되어 있으므로 1차 적용 우선순위가 가장 높다.

| 우선순위 | 페이지 | CTA 대상 | 방식 | 문구 |
| --- | --- | --- | --- | --- |
| 1 | `/tools/samsung-bonus/` | `/compare/bonus/` | related 링크 | `성과급 비교표 전체 보기` |
| 2 | `/tools/sk-hynix-bonus/` | `/compare/bonus/` | related 링크 | `삼성전자·하이닉스 성과급 비교 보기` |
| 3 | `/tools/bonus-simulator/` | `/compare/bonus/` | 카드 또는 related 링크 | `업종별 성과급 비교표 보기` |
| 4 | `/tools/bonus-after-tax-calculator/` | `/compare/bonus/` | Split CTA | `성과급 비교표 보기` |
| 5 | `/tools/semiconductor-bonus-comparison/` | `/compare/bonus/` | related 링크 | `전체 성과급 비교표 보기` |
| 6 | `/tools/auto-bonus-comparison/` | `/compare/bonus/` | related 링크 | `전체 성과급 비교표 보기` |
| 7 | `/tools/shipbuilding-bonus-comparison/` | `/compare/bonus/` | related 링크 | `전체 성과급 비교표 보기` |
| 8 | `/tools/finance-bonus-comparison/` | `/compare/bonus/` | related 링크 | `전체 성과급 비교표 보기` |

2차 적용 후보:

- `/tools/oil-refinery-bonus-comparison/`
- `/tools/it-platform-bonus-comparison/`
- `/tools/hyundai-bonus/`
- `/tools/lg-bonus/`
- `/reports/corporate-bonus-comparison-2026/`
- `/reports/samsung-ds-bonus-calculation-guide/`
- `/reports/sk-hynix-bonus-2027/`

---

## 5-2. 지원금 페이지

지원금은 “계산기 결과 → 다른 지원금도 확인” 흐름이 중요하다.

| 우선순위 | 페이지 | CTA 대상 | 방식 | 문구 |
| --- | --- | --- | --- | --- |
| 1 | `/tools/youth-savings-maturity-calculator/` | `/compare/welfare/` | related 링크 | `청년 지원금 비교표 보기` |
| 2 | `/reports/youth-future-savings-2026/` | `/compare/welfare/` | related 링크 | `청년·복지 지원금 비교표 보기` |
| 3 | `/reports/youth-savings-comparison-2026/` | `/compare/welfare/` | related 링크 | `지원금 비교표 전체 보기` |
| 4 | `/tools/welfare-benefit-eligibility/` | `/compare/welfare/` | 카드 또는 related 링크 | `청년·출산·복지 지원금 비교 보기` |
| 5 | `/reports/2026-government-welfare-benefits/` | `/compare/welfare/` | 본문 하단 카드 | `지원금 비교표에서 계산기 고르기` |
| 6 | `/tools/birth-support-total/` | `/compare/welfare/` | related 링크 | `출산·육아 지원금 비교표 보기` |
| 7 | `/tools/birth-support-money/` | `/compare/welfare/` | related 링크 | `출산·육아 지원금 비교표 보기` |
| 8 | `/tools/postnatal-care-cost/` | `/compare/welfare/` | related 링크 | `출산지원금과 산후 비용 함께 보기` |

2차 적용 후보:

- `/tools/parental-leave-pay/`
- `/tools/single-parental-leave-total/`
- `/tools/parental-leave-short-work-calculator/`
- `/tools/pregnancy-birth-cost/`
- `/tools/pregnancy-checkup-cost/`
- `/reports/birth-support-by-region-2026/`
- `/reports/postnatal-care-comparison-2026/`
- `/reports/pregnancy-checkup-cost-2026/`

---

## 5-3. 인덱스 페이지

인덱스 페이지는 새 대메뉴 노출을 보완하는 역할이다.

| 페이지 | CTA 대상 | 방식 | 문구 |
| --- | --- | --- | --- |
| `/` | `/compare/` | 홈 주요 섹션 또는 카드 | `비교표에서 한눈에 보기` |
| `/tools/` | `/compare/` | 카테고리 상단 또는 하단 | `계산기별 비교표 보기` |
| `/reports/` | `/compare/` | 리포트 허브 하단 | `비교표 허브 보기` |

1차 구현에서는 인덱스 3개 중 `/tools/`와 `/reports/`만 적용해도 된다. 홈은 이미 섹션이 많으면 과해질 수 있으므로 레이아웃을 보고 판단한다.

---

## 6. 적용 우선순위

9번 구현에서는 범위를 너무 넓히지 않고 아래 순서로 진행한다.

### 1차 필수

1. 성과급 핵심 5개
   - `/tools/samsung-bonus/`
   - `/tools/sk-hynix-bonus/`
   - `/tools/bonus-simulator/`
   - `/tools/bonus-after-tax-calculator/`
   - `/tools/semiconductor-bonus-comparison/`

2. 지원금 핵심 5개
   - `/tools/youth-savings-maturity-calculator/`
   - `/reports/youth-future-savings-2026/`
   - `/reports/youth-savings-comparison-2026/`
   - `/tools/welfare-benefit-eligibility/`
   - `/tools/birth-support-total/`

3. 인덱스 2개
   - `/tools/`
   - `/reports/`

### 1차 선택

- `/tools/auto-bonus-comparison/`
- `/tools/shipbuilding-bonus-comparison/`
- `/tools/finance-bonus-comparison/`
- `/tools/birth-support-money/`
- `/tools/postnatal-care-cost/`

### 2차 이후

- 성과급 나머지 회사별 계산기
- 출산·육아 세부 계산기
- 부동산·투자·연봉 비교표가 생긴 뒤 해당 영역 CTA 추가

---

## 7. 구현 방식

### 7-1. 가능하면 데이터 배열에 추가

기존 페이지가 `related`, `relatedLinks`, `nextLinks`, `SeoContent.related`를 쓰는 경우에는 해당 배열에 한 줄 추가한다.

예:

```ts
{ href: "/compare/bonus/", label: "성과급 비교표 전체 보기" }
```

이 방식이 9번 구현의 기본이다.

### 7-2. 결과 영역 CTA는 최소 적용

결과 영역에 이미 CTA가 있는 페이지는 무리하게 새 UI를 만들지 않는다. 기존 CTA 묶음에 보조 버튼을 하나 추가하는 정도가 좋다.

예:

```astro
<a class="button button--secondary" href={withBase("/compare/bonus/")}>성과급 비교표 보기</a>
```

### 7-3. 새 공통 컴포넌트는 보류

1차 구현에서는 `CompareCta.astro` 같은 공통 컴포넌트를 만들지 않는다.

이유:

- 페이지별 기존 UI 패턴이 다르다.
- 관련 링크 배열 추가만으로 충분한 페이지가 많다.
- 공통 컴포넌트는 9번 구현 후 반복이 확실할 때 만드는 편이 안전하다.

단, 9번 작업 중 같은 마크업이 4곳 이상 반복되면 아래 컴포넌트를 검토한다.

```text
src/components/CompareCtaCard.astro
```

---

## 8. 문구 세트

### 8-1. 성과급 CTA 문구

| 상황 | 문구 |
| --- | --- |
| 회사별 계산기 | `다른 회사 성과급도 비교하기` |
| 삼성/하이닉스 | `삼성전자·하이닉스 성과급 비교 보기` |
| 업종별 비교 계산기 | `전체 성과급 비교표 보기` |
| 세후 계산기 | `성과급 비교표 보기` |
| 리포트 | `성과급 계산기와 비교표 보기` |

### 8-2. 지원금 CTA 문구

| 상황 | 문구 |
| --- | --- |
| 청년 적금 | `청년 지원금 비교표 보기` |
| 복지급여 | `청년·출산·복지 지원금 비교 보기` |
| 출산지원금 | `출산·육아 지원금 비교표 보기` |
| 산후 비용 | `출산지원금과 산후 비용 함께 보기` |
| 정부지원금 리포트 | `지원금 비교표에서 계산기 고르기` |

### 8-3. 전체 비교표 문구

| 상황 | 문구 |
| --- | --- |
| tools index | `계산기별 비교표 보기` |
| reports index | `비교표 허브 보기` |
| home | `비교표에서 한눈에 보기` |
| 일반 페이지 | `관련 비교표 보기` |

---

## 9. 디자인 기준

### 9-1. 링크형 CTA

기존 related 링크와 동일 스타일을 사용한다. 별도 스타일 추가 없음.

### 9-2. 버튼형 CTA

기존 페이지가 `button`, `button--primary`, `button--secondary`, `button--ghost`를 쓰면 그대로 따른다.

우선순위:

```text
기존 결과 행동: primary
비교표 이동: secondary 또는 ghost
```

### 9-3. 카드형 CTA

새 카드가 필요할 때만 사용한다.

권장 스타일:

- border radius: 8px
- 배경: 흰색 또는 아주 옅은 회색
- 테두리: 기존 line 색상
- CTA는 1개 또는 2개
- 장식성 큰 그래픽 사용 안 함

---

## 10. 추적 기준

배포 후 네이버서치어드바이저와 사이트 로그에서 아래를 본다.

| 지표 | 확인 이유 |
| --- | --- |
| `/compare/bonus/` 유입 페이지 | 어떤 성과급 계산기에서 이동이 많은지 확인 |
| `/compare/welfare/` 유입 페이지 | 청년/출산/복지 중 어느 축이 강한지 확인 |
| `/compare/` 체류와 이탈 | 전체 허브가 단순 링크 모음처럼 소비되는지 확인 |
| 기존 계산기 체류시간 | CTA 추가 후 계산기 사용을 방해하지 않는지 확인 |
| 검색 키워드 변화 | “비교표” 키워드 확장 여부 확인 |

---

## 11. 9번 구현 체크리스트

- [ ] 성과급 핵심 5개 페이지에 `/compare/bonus/` CTA 추가
- [ ] 지원금 핵심 5개 페이지에 `/compare/welfare/` CTA 추가
- [ ] `/tools/`에 `/compare/` CTA 추가
- [ ] `/reports/`에 `/compare/` CTA 추가
- [ ] 기존 계산 CTA보다 비교표 CTA가 과하게 튀지 않는지 확인
- [ ] 모든 CTA 링크가 `withBase()` 또는 기존 URL 패턴을 따르는지 확인
- [ ] 모바일에서 버튼 텍스트가 넘치지 않는지 확인
- [ ] `npm run build` 성공 확인
- [ ] `/compare/bonus/`, `/compare/welfare/`로 실제 이동 가능한지 로컬 확인

---

## 12. 결론

8번 CTA 통합의 핵심은 새 비교표 허브를 “메뉴에서만 접근 가능한 페이지”로 두지 않는 것이다. 이미 검색 유입이 있는 성과급·지원금 계산기에서 비교표로 이어지는 길을 만들어야 `/compare/`, `/compare/bonus/`, `/compare/welfare/`가 사이트 내부 회전의 중심이 된다.

9번 구현은 전 페이지 일괄 작업이 아니라 **성과급 핵심 5개 + 지원금 핵심 5개 + 인덱스 2개**부터 적용하는 것이 가장 안전하다.
