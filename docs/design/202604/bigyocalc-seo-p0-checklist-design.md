# 비교계산소 SEO P0 작업 체크리스트 + Codex 실행 프롬프트

## 문서 목적

이 문서는 `bigyocalc.com` 기준으로 SEO P0 작업을 실제 개발과 운영에 바로 옮기기 위한 실행 문서입니다.
핵심은 아래 5가지를 우선 처리하는 것입니다.

1. 대표 URL을 명확히 만든다
2. 검색엔진이 페이지를 잘 읽게 만든다
3. 신규/수정 페이지 반영 속도를 높인다
4. 계산기와 리포트의 내부 연결을 강화한다
5. 반복 가능한 발행 후 운영 루틴을 만든다

---

## 적용 범위

### 우선 적용 대상

- `/`
- `/tools/`
- `/reports/`
- 주요 계산기 상세 페이지
- 주요 리포트 상세 페이지

### 우선 제외 가능 대상

- 테스트 페이지
- 임시 실험 페이지
- 중복 결과 페이지
- 내부 운영용 경로

---

## P0 목표

| 구분 | 목표 |
| --- | --- |
| canonical | 대표 URL 고정 |
| metadata | title / description 고유화 |
| indexing | sitemap / robots / noindex 기준 정리 |
| content clarity | 상단 요약문 보강 |
| internal links | 계산기 ↔ 리포트 ↔ 허브 연결 강화 |

---

## 작업 단계

## 1. canonical 정책 정리

### 목표

모든 공개 페이지가 어떤 URL을 대표 URL로 사용할지 명확히 정의합니다.

### 작업 항목

- [ ] 모든 공개 상세 페이지에 self-canonical 적용
- [ ] query string URL은 대표 URL로 canonical 통합
- [ ] `/tools/*`, `/reports/*` 템플릿에 canonical 공통 처리
- [ ] sitemap에는 canonical URL만 포함되도록 점검
- [ ] 공유용 결과 URL이 있으면 `index` 대상인지 별도 정책 확정

### 우선 확인할 파라미터

- `?salary=`
- `?compare=`
- `?region=`
- `?utm_`
- 기타 결과 공유용 query string

### 완료 기준

- [ ] 페이지 소스에 canonical 1개만 존재
- [ ] canonical URL이 현재 대표 경로와 일치
- [ ] 파라미터 URL 접속 시 canonical이 대표 URL로 고정

---

## 2. title / meta description 정리

### 목표

검색 결과에서 페이지 의미를 바로 이해하게 만들고 CTR 개선 기반을 만듭니다.

### 작업 항목

- [ ] 모든 공개 페이지에 고유 `title` 반영
- [ ] 모든 공개 페이지에 고유 `meta description` 반영
- [ ] 계산기 제목은 `키워드 + 계산기 + 기준연도` 구조로 통일
- [ ] 리포트 제목은 `주제 + 비교/리포트 + 기준연도` 구조로 통일
- [ ] 홈, 허브, 상위 유입 페이지부터 우선 적용

### 권장 포맷

- 계산기: `육아휴직 급여 계산기 | 2026 최신 기준`
- 리포트: `결혼비용 2016 vs 2026 | 10년 비교 리포트`

### 완료 기준

- [ ] 중복 title 없음
- [ ] 중복 description 없음
- [ ] title 앞부분에 핵심 키워드 포함
- [ ] description이 실제 본문 내용과 일치

---

## 3. sitemap / robots 점검

### 목표

검색엔진이 대표 URL을 빠르게 발견하고 잘못된 경로를 줄이도록 합니다.

### 작업 항목

- [ ] `sitemap.xml` 생성 경로 확인
- [ ] 대표 URL만 sitemap에 포함
- [ ] robots.txt에 sitemap 경로 명시
- [ ] robots가 공개 페이지를 막고 있지 않은지 확인
- [ ] 테스트/비공개 경로는 별도 정책 적용

### robots 예시

```txt
User-agent: *
Allow: /

Sitemap: https://bigyocalc.com/sitemap.xml
```

### 완료 기준

- [ ] `sitemap.xml` 정상 응답
- [ ] `robots.txt` 정상 응답
- [ ] robots에 sitemap URL 선언 존재
- [ ] 중복 URL과 테스트 URL이 sitemap에 없음

---

## 4. index / noindex 기준 정리

### 목표

색인 대상과 제외 대상을 혼동 없이 관리합니다.

### 작업 항목

- [ ] 페이지 유형별 `index` / `noindex` 기준표 작성
- [ ] 공개 상세 페이지는 `index,follow`
- [ ] 결과성 중복 페이지는 `noindex,follow` 검토
- [ ] 테스트/임시 페이지 noindex 처리
- [ ] 공통 SEO 컴포넌트나 레이아웃에서 적용 가능하도록 구조화

### 완료 기준

- [ ] 검색 제외 대상 페이지에 noindex가 실제 반영
- [ ] robots 차단과 noindex 목적이 혼용되지 않음
- [ ] 새 페이지 생성 시 정책 적용 경로가 명확함

---

## 5. 상단 요약문 보강

### 목표

페이지 초반만 읽어도 무엇을 하는 페이지인지 이해되게 만듭니다.

### 작업 항목

- [ ] 계산기 상단에 3~5줄 요약문 추가
- [ ] 리포트 상단에 기준 시점과 데이터 성격 요약 추가
- [ ] 기준 연도, 대상 사용자, 사용 방법 포함
- [ ] H1 아래 첫 문단이 검색 의도와 맞도록 정리

### 완료 기준

- [ ] 상단만 읽어도 페이지 목적이 이해됨
- [ ] “무엇을 할 수 있는지”가 바로 보임
- [ ] 기준일 또는 업데이트일을 확인 가능

---

## 6. 내부링크 기본 구조 적용

### 목표

계산기, 리포트, 허브 사이 이동성과 탐색성을 기본 이상으로 만듭니다.

### 작업 항목

- [ ] 계산기 하단에 관련 리포트 2~3개 연결
- [ ] 리포트 하단에 관련 계산기 2~3개 연결
- [ ] `/tools/`, `/reports/` 허브에서 대표 상세 링크 강화
- [ ] 앵커 텍스트를 구체 키워드형으로 교체
- [ ] “자세히 보기” 같은 일반 문구 최소화

### 완료 기준

- [ ] 모든 주요 상세 페이지에 최소 2개 이상 내부링크 존재
- [ ] 허브에서 대표 상세 페이지로 이동 가능
- [ ] 링크 문구만 읽어도 목적을 알 수 있음

---

## 7. 발행 후 운영 루틴

### 목표

새 페이지 발행이나 대규모 수정 뒤 반영 누락을 줄입니다.

### 발행 당일 체크

- [ ] sitemap 반영 확인
- [ ] Google Search Console URL 검사 요청
- [ ] 네이버 수집 요청
- [ ] RSS 반영 확인
- [ ] 모바일 렌더링 확인
- [ ] canonical / noindex 오적용 여부 확인

### 주간 체크

- [ ] 색인 제외 사유 점검
- [ ] canonical 선택 상태 확인
- [ ] CTR 낮은 페이지 title / description 수정
- [ ] 신규 페이지 검색 반영 여부 확인

---

## 역할 분담

### 개발

- [ ] canonical 공통 처리
- [ ] title / description 렌더링 구조 정리
- [ ] sitemap / robots 점검
- [ ] noindex 반영 구조 정리
- [ ] 내부링크 컴포넌트 또는 템플릿화

### 운영 / 콘텐츠

- [ ] 페이지별 title 작성
- [ ] meta description 작성
- [ ] 상단 요약문 작성
- [ ] 관련 링크 선정
- [ ] GSC / 네이버 제출 운영

---

## 우선순위

1. canonical
2. title / description
3. sitemap / robots
4. index / noindex 기준
5. 상단 요약문
6. 내부링크
7. 발행 후 운영 루틴

---

## P0 완료 기준

아래 항목이 충족되면 P0 완료로 봅니다.

- [ ] 주요 계산기 / 리포트에 canonical 적용 완료
- [ ] 주요 페이지 title / description 고유화 완료
- [ ] sitemap / robots 정상 운영 확인
- [ ] index / noindex 기준표 확정
- [ ] 주요 페이지 상단 요약문 반영 완료
- [ ] 계산기 ↔ 리포트 ↔ 허브 내부링크 기본 구조 반영
- [ ] 발행 후 SEO 체크리스트 운영 시작

---

## 비교계산소 기준 권장 작업 순서

### 1차

- canonical 정책 확정
- 공통 SEO 컴포넌트 구조 확인
- sitemap / robots 점검

### 2차

- title / description 전수 점검
- index / noindex 기준 정리
- 상단 요약문 템플릿 적용

### 3차

- 내부링크 블록 추가
- 허브 페이지 연결 강화
- 발행 후 체크리스트 운영 시작

---

## Codex 실행 프롬프트 모음

아래 프롬프트는 Codex에 그대로 넣어서 단계별로 작업시키기 위한 용도입니다.

### Prompt 1. SEO 구조 현황 진단

```txt
비교계산소 저장소에서 SEO P0 관점으로 현재 구조를 점검해줘.
우선 아래 항목만 확인해서 요약해줘.
1. canonical 처리 방식
2. title / meta description 처리 방식
3. sitemap.xml 생성 방식
4. robots.txt 상태
5. noindex 적용 방식
6. tools / reports 내부링크 구조

결과는
- 현재 상태
- 문제점
- 우선 수정 파일
형태로 정리해줘.
필요하면 실제 파일을 읽고 확인해줘.
```

### Prompt 2. canonical + metadata 공통 구조 수정

```txt
비교계산소에서 SEO P0 작업을 진행해줘.
우선 canonical, title, meta description 공통 구조를 점검하고,
필요하면 레이아웃이나 SEO 관련 공통 컴포넌트를 수정해줘.

조건:
- 공개 페이지는 self-canonical 적용
- query string URL은 대표 URL canonical 유지
- 페이지별 title / description 주입 구조가 명확해야 함
- 기존 페이지 동작은 최대한 유지

작업 후에는
- 수정 파일
- 적용 방식
- 남은 TODO
를 정리해줘.
```

### Prompt 3. sitemap / robots / noindex 정책 반영

```txt
비교계산소에서 SEO P0 기준으로 sitemap, robots, noindex 정책을 정리해줘.

해야 할 일:
- sitemap.xml이 대표 URL만 포함하는지 점검
- robots.txt 점검 및 sitemap 경로 확인
- index / noindex 정책이 필요한 페이지 유형 정리
- 필요하면 관련 파일 수정

결과는
- 현재 상태
- 수정 내용
- 배포 후 확인할 체크포인트
형태로 알려줘.
```

### Prompt 4. 상단 요약문 + 내부링크 보강

```txt
비교계산소에서 SEO P0 작업으로 계산기와 리포트 페이지의 상단 요약문과 내부링크를 보강해줘.

목표:
- 계산기 상단에 3~5줄 설명 추가
- 리포트 상단에 기준 시점 / 데이터 설명 추가
- 계산기 하단에 관련 리포트 2~3개 연결
- 리포트 하단에 관련 계산기 2~3개 연결

우선 영향 큰 페이지부터 적용하고,
공통화할 수 있으면 컴포넌트화까지 검토해줘.
```

### Prompt 5. title / description 샘플 대량 작성

```txt
비교계산소 주요 페이지를 읽고 SEO P0 기준으로 title / meta description 초안을 작성해줘.

대상:
- 홈
- tools 허브
- reports 허브
- 계산기 10개
- 리포트 10개

출력 형식:
- URL 또는 slug
- title 초안
- meta description 초안
- 한 줄 메모

중복 없이, 검색 의도와 기준 연도가 드러나게 작성해줘.
```

### Prompt 6. P0 전체 작업 한 번에 맡기기

```txt
비교계산소에서 SEO P0 작업을 실제로 진행해줘.
작업 범위는 canonical, title / description 구조, sitemap / robots 점검, noindex 정책, 상단 요약문, 내부링크까지야.

진행 순서:
1. 현재 구조 파악
2. 공통 구조 수정
3. 대표 페이지 우선 반영
4. 빌드 / 검증
5. 남은 TODO 정리

중간에 필요한 가정은 합리적으로 두고 진행해도 되고,
작업이 끝나면 수정 파일과 확인 포인트를 함께 알려줘.
```

---

## 추가 메모

- P0는 “완벽한 SEO”가 아니라 “대표성, 설명력, 색인 기본기”를 먼저 세우는 단계로 봅니다.
- 우선 canonical과 metadata 구조를 먼저 안정화해야 이후 FAQ, JSON-LD, 허브 강화가 효율적으로 붙습니다.
- 계산기 사이트 특성상 query string 중복 관리가 일반 블로그보다 더 중요합니다.
