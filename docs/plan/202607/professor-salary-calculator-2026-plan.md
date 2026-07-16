# 대학교수 연봉 계산기 2026 — 기획 문서

> 작성일: 2026-07-16
> 유형: 계산기 (`/tools/`)
> 슬러그: `professor-salary-calculator-2026`
> 확인됨: `/reports/professor-salary-2026/`(대학교수 연봉 완전 정리 2026)의 컴패니언 계산기. 리포트의 `PROFESSOR_TYPES`·`RANK_ROWS`·`RESEARCH_INCOME` 데이터를 그대로 재사용하고, 새 연봉 수치를 임의로 만들지 않는다.

---

## 1. 배경 및 목적

7월 네이버 서치어드바이저 데이터에서 `대학교수 연봉` 키워드가 07-15 기준 클릭 33·CTR 55.0%로 키워드 1위, `professor-salary-2026` URL도 클릭 62·CTR 21.6%로 URL 1위에 올랐다. 07-14에도 각각 2위(클릭13·CTR28.3%)였던 걸 감안하면 이틀 연속 급성장 중인 클러스터다.

그런데 이 리포트에는 **전용 계산기가 없다.** 사이트의 다른 인기 연봉 클러스터(교사·의사·약사·공무원·경찰·소방관 등)는 전부 "정리 리포트 + 전용 계산기" 2종 세트로 구성돼 있고, 계산기 쪽이 체류시간·재방문·롱테일 키워드(`조교수 연봉 실수령`, `국립대 교수 호봉` 등) 흡수에 유리하다는 게 기존 패턴에서 검증돼 있다. 대학교수만 계산기가 빠진 상태다.

**목표**
- 대학 유형(국립·사립상위·사립중위·지방사립)과 직급(조교수·부교수·교수·석좌교수), 연차를 입력하면 예상 연봉 범위를 즉시 계산
- 시간강사(비전임)는 급여 구조가 근본적으로 달라(학점당 단가) 별도 입력 모드로 분리
- 리포트의 연구비 수입 데이터를 참고자료로 노출하되, 변동성이 너무 커서(연 3천만~2억+) 계산에 합산하지 않고 별도 표로만 제공 — 허위 정밀도 방지
- 현재 1위로 급부상한 `대학교수 연봉` 키워드 트래픽을 계산기 인터랙션으로 전환, 리포트 ↔ 계산기 상호 링크로 체류시간 확보

### 데이터 신뢰도 메모

리포트(`professorSalary2026.ts`)의 `RANK_ROWS`는 국립대·사립상위권 두 유형만 직급별 수치를 명시하고, 사립중위권·지방사립은 `PROFESSOR_TYPES`에 유형 전체 범위(직급 구분 없음)만 있다. 이 계산기는 사립중위권·지방사립의 직급별 밴드를 **새로 취재하지 않고**, 국립대의 직급별 상대적 비중(전체 밴드 대비 각 직급의 위치 비율)을 사립중위권·지방사립 자체의 전체 범위에 그대로 적용하는 방식으로 추정한다(계산식은 설계 문서 3절 참고). 이 추정 방식이라는 점을 `dataNote`와 FAQ에 명시해 실측 데이터처럼 오인되지 않도록 한다.

---

## 2. SEO 타겟 (구글 + 네이버)

### 메인 키워드

| 키워드 | 검색 의도 | 비고 |
|---|---|---|
| 대학교수 연봉 계산기 | 직접 계산 의도 | 07-15 기준 리포트 키워드 1위(`대학교수 연봉`)의 계산기형 파생 |
| 조교수 연봉 실수령 | 직급별 세부 확인 | 리포트에 없는 "실수령" 검색 의도 흡수 (단, 세후 계산은 하지 않고 `/tools/salary/`로 유도 — 4절 참고) |
| 국립대 교수 호봉 | 국립대 특화 | 07-15 09위 키워드 `국립대 교수 연봉`(클릭5·CTR11.9%)의 계산기형 확장 |
| 사립대 교수 연봉 계산 | 사립대 특화 | |
| 시간강사 강의료 계산기 | 비전임 검색 | 학점당 단가 기반 별도 모드로 대응 |
| 석좌교수 연봉 | 화제성 키워드 | 낮은 볼륨이지만 리포트에서 CTR 반응 확인된 항목 |

### 타겟 독자
- 교수 임용을 준비 중인 박사과정·포닥 연구자 (내 미래 연봉 가늠)
- 이직·전직을 고려하는 현직 교수 (국립 ↔ 사립, 대학 그룹 간 비교)
- 시간강사 처우를 확인하려는 비전임 강사
- `professor-salary-2026` 리포트에서 유입돼 "내 경우는 얼마인지" 직접 계산하고 싶은 독자

---

## 3. 핵심 입력값 / 출력값

### 입력 — 모드 전환 (mode-chip 2종)

**모드 A. 전임교원**
| 항목 | 유형 | 비고 |
|---|---|---|
| 대학 유형 | mode-chip 4종 (국립대 / 사립 상위권 / 사립 중위권 / 지방 사립) | 시간강사는 모드 B로 분리 |
| 직급 | mode-chip 4종 (조교수 / 부교수 / 교수 / 석좌교수) | 석좌교수 선택 시 연차 입력 숨김(협상형 별도 계약이라 연차 개념 미적용) |
| 연차 | 슬라이더 (선택한 직급의 `yearsRange`에 맞춰 동적 min/max) | 밴드 내 상대적 위치로 연봉 보간 |

**모드 B. 시간강사(비전임)**
| 항목 | 유형 | 비고 |
|---|---|---|
| 학기당 강의 학점수 | 슬라이더 (1~9학점) | 기본값 6학점(2~3과목) |
| 학점당 단가 | 숫자 입력 (기본 65만원) | 리포트 `PF_HERO_STATS.adjunctPerCredit` 재사용 |
| 연간 강의 학기 수 | mode-chip (1학기 / 2학기) | 방학 중 미배정 가능성 안내 |

### 출력 (결과 카드)

| 카드 | 내용 |
|---|---|
| 예상 연봉 범위 (모드 A) / 예상 연 강의료 (모드 B) | 메인 KPI, "추정" 배지 고정 |
| 선택 직급·대학유형 밴드 내 위치 | 게이지바 (연차 기반 상대 위치) |
| 같은 직급 다른 대학유형 비교 | 미니 바 차트 또는 표 — 4개 유형 동시 비교 |
| 연구비 등 추가 수입 참고 (모드 A만) | `RESEARCH_INCOME` 표 그대로 노출, 계산에는 미반영 명시 |
| 다음 확인 사항 | 세후 실수령 계산 CTA(`/tools/salary/`), 리포트 링크 |

---

## 4. 핵심 데이터 (2026년 기준, 추정 방식 명시)

기존 리포트 데이터(`PROFESSOR_TYPES`, `RANK_ROWS`, `RESEARCH_INCOME`, `PF_HERO_STATS`)를 전량 재사용하며, 계산기 전용으로 아래만 신규 도출한다.

### 4-1. 직급별 밴드 보간 공식 (사립중위권·지방사립용)

국립대 `RANK_ROWS` 전체 스팬(조교수 최솟값 5,800만 → 석좌교수 최댓값 2억) 대비 각 직급의 상대 위치 비율을 구하고, 이 비율을 사립중위권·지방사립 자체의 `PROFESSOR_TYPES` 전체 범위에 적용한다.

```
nationalSpanMin = RANK_ROWS[조교수].nationalMin  // 58,000,000
nationalSpanMax = RANK_ROWS[석좌교수].nationalMax // 200,000,000
nationalSpan = nationalSpanMax - nationalSpanMin  // 142,000,000

각 직급 R에 대해:
fracMin(R) = (RANK_ROWS[R].nationalMin - nationalSpanMin) / nationalSpan
fracMax(R) = (RANK_ROWS[R].nationalMax - nationalSpanMin) / nationalSpan

사립중위권/지방사립 유형 T에 대해:
estMin(T,R) = PROFESSOR_TYPES[T].annualMin + fracMin(R) × (PROFESSOR_TYPES[T].annualMax - PROFESSOR_TYPES[T].annualMin)
estMax(T,R) = PROFESSOR_TYPES[T].annualMin + fracMax(R) × (PROFESSOR_TYPES[T].annualMax - PROFESSOR_TYPES[T].annualMin)
```

국립대·사립상위권은 `RANK_ROWS`의 실측 수치를 그대로 사용하고 이 공식은 적용하지 않는다(설계 문서 3절에 실제 산출 값 표로 정리).

### 4-2. 연차 → 밴드 내 위치 보간

각 직급의 `yearsRange`를 숫자 슬라이더 범위로 변환:
- 조교수: 1~6년
- 부교수: 6~12년
- 교수: 12~30년 (30은 계산 편의를 위한 상한, "12년차+"를 슬라이더화)
- 석좌교수: 연차 입력 없음 (고정 중간값 표시 + "협상형 별도 계약" 안내)

연차 위치 비율 = (입력 연차 − 구간 최소) / (구간 최대 − 구간 최소), 이 비율을 estMin~estMax 사이에 선형 적용.

### 4-3. 시간강사 계산

```
연 강의료 = 학점당 단가 × 학기당 학점수 × 연간 학기 수
```
`PF_HERO_STATS.adjunctPerCredit`(65만원)을 기본값으로, 사용자가 조정 가능.

---

## 5. 구글·네이버 노출 최적화 체크리스트

`docs/GOOGLE_SEO_RULES.md` 기준 + 네이버 신선도·전문성 신호 보강.

### 필수 (Google)
- [ ] `SeoContent` intro **5단락 이상, 800자 이상**, "추정 방식"(4절 보간 공식)을 일반 독자용 문장으로 풀어 반드시 포함
- [ ] `SeoContent` FAQ **6개 이상**
- [ ] `SeoContent`는 반드시 `<Fragment slot="seo">` 안에 배치
- [ ] `sitemap.xml`에 `/tools/professor-salary-calculator-2026/` 등록, `changefreq`는 `monthly`
- [ ] URL 트레일링 슬래시 포함
- [ ] `tools.ts`에 메타 등록 (order 1.71, teacher/doctor/pharmacist 계산기군 인접 배치), `app.scss`에 SCSS import
- [ ] `FAQPage` JSON-LD 스키마 적용

### 네이버 노출 보강
- [ ] H1/H2에 "대학교수 연봉 계산기", "조교수·부교수·교수", "국립대·사립대" 등 실제 검색어 그대로 병기
- [ ] `updatedAt` 필드로 데이터 기준일 명시
- [ ] 사립중위권·지방사립 직급별 수치는 **추정(보간) 방식임을 표·FAQ에서 명확히 배지 처리** — 국립대·사립상위권(실측/공시 기반)과 시각적으로 구분(예: `공시 기반` vs `추정 보간`)
- [ ] 4개 대학유형 비교표를 `<table>` 마크업으로 제공 — 네이버 표 스니펫 노출 유리

### 타이틀·디스크립션 (공식 검증)

**타이틀:**
`대학교수 연봉 계산기 2026 | 직급·대학유형별 예상 연봉 바로 계산` (39자)

**디스크립션:**
`대학 유형(국립·사립상위·사립중위·지방사립)과 직급·연차 입력하면 2026년 예상 연봉 범위를 바로 계산합니다. 시간강사 강의료 계산, 연구비 수입 참고자료도 함께 제공합니다.` (약 95자)

**체크리스트**
- [x] 계산기 타이틀 공식(`{대상} 계산기 {연도} | {핵심 결과} 바로 계산`) 준수
- [x] 연도(2026) 포함, 50자 이내
- [x] 디스크립션 80자 이상
- [x] "연봉", "계산" 등 실제 검색어를 낯선 전문용어보다 앞에 배치

---

## 6. 내부 링크 전략 (CTA 연결)

### 인바운드 (다른 페이지 → 이 계산기)
| 연결 출발점 | 방법 |
|---|---|
| `/reports/professor-salary-2026/` | "관련 콘텐츠" 섹션에 계산기 카드 최상단 추가 + SeoContent related에도 추가 |
| `/reports/teacher-salary-2026/`, `/reports/doctor-salary-2026/` | 각 리포트의 관련 링크에 "교육·전문직 연봉 계산기" 묶음으로 추가 (선택) |

### 아웃바운드 (이 계산기 → 다른 페이지)
```
{ href: "/reports/professor-salary-2026/", label: "대학교수 연봉 완전 정리 2026 (리포트)" }
{ href: "/tools/salary/", label: "연봉 실수령 계산기" }
{ href: "/reports/teacher-salary-2026/", label: "교사 연봉·호봉 완전 정리 2026" }
{ href: "/reports/doctor-salary-2026/", label: "의사 연봉 완전 비교 2026" }
{ href: "/tools/doctor-salary-calculator/", label: "의사 연봉·실수령 계산기" }
{ href: "/reports/public-servant-salary-2026/", label: "공무원 9급 연봉 2026" }
```

### 링크 배치 위치 (페이지 내 2곳 이상)
1. 결과 섹션 하단 — 내부 CTA 그리드 (아웃바운드, 위 링크)
2. `SeoContent`의 `related` prop

---

## 7. 섹션 구성 (페이지 IA)

| 순서 | 섹션 | 내용 |
|---|---|---|
| 1 | Hero + 모드 전환 | 전임교원 / 시간강사 mode-chip |
| 2 | InfoNotice | 추정 방식(보간 공식) 요약 안내, 공시 기반 vs 추정 보간 구분 |
| 3 | 입력 (aside) | 모드별 입력 폼 (3절) |
| 4 | 결과 KPI | 예상 연봉 범위 / 강의료, 밴드 내 위치 게이지 |
| 5 | 대학유형별 비교표 | 선택 직급 기준 4개 유형 동시 비교 (`<table>`) |
| 6 | 연구비 등 추가 수입 참고 | `RESEARCH_INCOME` 표, "계산에 미반영" 명시 |
| 7 | 내부 CTA 그리드 | 6절 아웃바운드 링크 |
| 8 | FAQ (6개+) | 8절 |
| 9 | SeoContent | 800자 이상 해설 + criteria + related |

---

## 8. FAQ 초안 (6개)

1. 이 계산기의 연봉은 실제 계약 연봉과 같나요?
2. 사립중위권·지방사립의 직급별 수치는 어떻게 계산되나요? (보간 방식 공개)
3. 석좌교수는 왜 연차를 입력하지 않나요?
4. 시간강사 강의료는 왜 따로 계산하나요?
5. 연구비 수입은 왜 계산에 포함되지 않나요?
6. 국립대와 사립대 중 어디가 더 유리한가요?

---

## 9. 구현 메모

### 신규 파일
- `src/data/professorSalaryCalculator2026.ts` — `professorSalary2026.ts`의 `PROFESSOR_TYPES`·`RANK_ROWS`·`RESEARCH_INCOME`·`PF_HERO_STATS` import, 보간 로직·프리셋·FAQ 추가
- `src/pages/tools/professor-salary-calculator-2026.astro`
- `public/scripts/professor-salary-calculator-2026.js`
- `src/styles/scss/pages/_professor-salary-calculator-2026.scss`

### 수정 파일
- `src/data/tools.ts` — 신규 항목 등록 (order 1.71)
- `src/pages/reports/professor-salary-2026.astro` — 관련 콘텐츠 섹션 최상단에 계산기 CTA 카드 추가, SeoContent related에도 추가
- `public/sitemap.xml` — 신규 URL 등록 (`changefreq: monthly`)
- `src/styles/app.scss` — `@use 'scss/pages/professor-salary-calculator-2026';` 추가

---

## 10. QA 포인트

- [ ] 국립대·사립상위권 결과가 리포트(`RANK_ROWS`) 수치와 정확히 일치하는지 (보간 공식 미적용 구간)
- [ ] 사립중위권·지방사립 보간 결과가 각 유형의 `PROFESSOR_TYPES.annualMin~annualMax` 범위를 벗어나지 않는지
- [ ] 석좌교수 선택 시 연차 입력이 숨겨지고 고정 안내 문구가 노출되는지
- [ ] 모드 전환(전임교원 ↔ 시간강사) 시 입력 폼이 올바르게 교체되는지
- [ ] 연구비 수입 표가 계산 결과에 영향을 주지 않는지 (참고자료로만 노출)
- [ ] `SeoContent` intro 800자 이상 / FAQ 6개 이상 확인
- [ ] `npm run build` 통과, `dist/tools/professor-salary-calculator-2026/` 라우트 생성 확인
- [ ] 메타 타이틀 50자 이내, 디스크립션 80~120자 재확인
- [ ] `professor-salary-2026` 리포트에서 계산기로 가는 CTA 링크 정상 작동
