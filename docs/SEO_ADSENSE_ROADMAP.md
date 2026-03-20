# 비교계산소 SEO / 광고 준비 로드맵

## 문서 목적
- 비교계산소의 SEO, 검색 노출, 광고 준비 작업을 단계별로 정리한다.
- 실제 작업 진행 시 체크리스트와 기록 문서로 함께 사용한다.

## 프로젝트 목표
- 검색엔진이 잘 읽을 수 있는 기술 구조를 만든다.
- 계산기 + 가이드 콘텐츠 구조를 정리해 검색 유입 기반을 만든다.
- Search Console로 인덱싱 상태를 관리한다.
- AdSense 심사 준비가 가능한 수준까지 사이트 품질과 콘텐츠를 확보한다.

## 전체 로드맵

| 단계 | 목표 | 우선순위 |
| --- | --- | --- |
| Phase 1 | 기술 SEO 기본 세팅 | 최고 |
| Phase 2 | 정보 구조 / 콘텐츠 구조 정리 | 최고 |
| Phase 3 | Search Console 등록 및 인덱싱 관리 | 최고 |
| Phase 4 | 구조화 데이터 / 리치 결과 대응 | 중상 |
| Phase 5 | AdSense 승인 준비 | 중상 |
| Phase 6 | 광고 적용 후 운영 최적화 | 중 |

---

## Phase 1 — 기술 SEO 기본 세팅

### 목표
- 크롤링 가능
- 인덱싱 가능
- 정식 도메인과 canonical 정리
- robots.txt / sitemap.xml 준비

### 작업 항목

#### 1. 정식 도메인 단일화
- 정식 주소를 `https://bigyocalc.com` 하나로 고정
- `www.bigyocalc.com` 사용 시 한쪽으로 301 리디렉션
- `pages.dev` 주소도 `bigyocalc.com`으로 리디렉션

#### 2. canonical 정리
- 모든 페이지에 canonical URL 삽입
- 계산기 상세, 가이드, 허브 페이지 모두 canonical 일관성 유지

#### 3. robots.txt 생성
- 최소 예시:

```txt
User-agent: *
Allow: /

Sitemap: https://bigyocalc.com/sitemap.xml
```

#### 4. sitemap.xml 생성
- 포함 대상
  - 홈
  - `/tools/`
  - `/guides/`
  - 계산기 상세 페이지
  - 가이드 페이지
  - 카테고리 / 허브 페이지

#### 5. 메타 태그 기본 세팅
- 모든 페이지에 최소 포함
  - `<title>`
  - `<meta name="description">`
  - canonical
  - Open Graph
  - Twitter Card

### 체크리스트
- [x] `https://bigyocalc.com/robots.txt` 접근 가능
- [x] `https://bigyocalc.com/sitemap.xml` 접근 가능
- [x] 확인한 주요 페이지 source에 canonical 존재
- [x] 대표 도메인 기준 중복 노출 이슈 없음
- [x] 404 페이지 별도 존재

### 진행 기록
- 상태: 진행 중
- 작업일: 2026-03-20
- 메모:
  - `robots.txt` 실접속 확인 완료
  - `sitemap.xml` 실접속 확인 완료
  - 홈 `/`, `/tools/`, `/tools/salary/` canonical 확인 완료
  - `https://bigyocalc.com/not-found-test`가 `404`가 아니라 `200`으로 응답함`r`n  - 없는 페이지가 홈 canonical로 처리되고 있어 404 분기 작업 필요`r`n  - `www.bigyocalc.com`은 `bigyocalc.com`으로 정상 리디렉션 확인`r`n  - `bigyocalc.pages.dev`는 외부 공개되지 않아 중복 노출 이슈 없음

---

## Phase 2 — 정보 구조와 페이지 설계

### 목표
- 검색엔진과 사용자가 모두 이해하기 쉬운 구조 만들기
- 계산기 + 가이드 + 내부링크 구조 정리

### 추천 구조

#### 메인 허브
- `/`
- `/tools/`
- `/guides/`

#### 계산기 상세
- `/tools/childcare-total`
- `/tools/parental-leave-pay`
- `/tools/6plus6`
- `/tools/single-parental-leave-total`

#### 설명형 콘텐츠
- `/guides/parent-benefit-2026`
- `/guides/child-allowance-2026`
- `/guides/parental-leave-2026`
- `/guides/6plus6-explained`

### 왜 필요한가
- 계산기 페이지만으로는 검색 유입 한계가 있음
- 설명형 가이드가 붙어야
  - 검색 유입
  - 내부 링크
  - 체류 시간
  - 광고 승인용 신뢰도
  를 함께 올릴 수 있음

### 작업 항목
- [ ] `/tools/` 허브 구조 확정
- [ ] `/guides/` 허브 설계
- [ ] 계산기 4종 상세 페이지 정보 구조 정리
- [ ] 가이드와 계산기 간 내부 링크 구조 설계
- [ ] 홈에서 핵심 계산기 / 가이드 노출 구조 정리

### 진행 기록
- 상태:
- 작업일:
- 메모:

---

## Phase 3 — Search Console 등록 및 인덱싱 운영

### 목표
- Search Console 등록
- sitemap 제출
- 핵심 페이지 인덱싱 확인

### 작업 항목

#### 1. Search Console 등록
- 권장 방식: Domain property
- DNS 검증

#### 2. sitemap 제출
- 제출 주소:
  - `https://bigyocalc.com/sitemap.xml`

#### 3. 초기 점검 대상 페이지
- 홈
- tools 허브
- 핵심 계산기 4개
- 핵심 가이드 3~5개

#### 4. URL Inspection 테스트
- 점검 항목
  - 인덱싱 가능 여부
  - 크롤링 차단 여부
  - canonical 인식
  - 구조화 데이터 오류 여부

### 운영 루틴
- 새 페이지 배포 후 URL Inspection 확인
- 중요 페이지는 인덱싱 요청
- Coverage / Pages 리포트 주기 점검

### 체크리스트
- [ ] Domain property 등록 완료
- [ ] sitemap 제출 완료
- [ ] 홈 URL Inspection 확인
- [ ] tools 허브 URL Inspection 확인
- [ ] 계산기 4종 URL Inspection 확인
- [ ] 핵심 가이드 URL Inspection 확인

### 진행 기록
- 상태:
- 작업일:
- 메모:

---

## Phase 4 — 구조화 데이터와 리치 결과 대응

### 목표
- 검색엔진이 페이지 의미를 더 잘 이해하도록 JSON-LD 적용

### 추천 구조화 데이터

#### 1. Organization
- 홈 적용
- 사이트명 / 로고 / 도메인

#### 2. WebSite
- 홈 적용
- 사이트 기본 정보

#### 3. BreadcrumbList
- 계산기 상세 / 가이드 상세 페이지 적용

#### 4. FAQPage
- 실제 FAQ 섹션이 있는 페이지에만 적용

### 주의
- FAQ / HowTo 리치 결과를 과도하게 기대하지 않기
- JSON-LD 넣는다고 리치 결과가 보장되지는 않음

### 작업 항목
- [ ] Organization 적용
- [ ] WebSite 적용
- [ ] Breadcrumb 적용
- [ ] FAQ 섹션이 있는 페이지에 FAQPage 적용
- [ ] Rich Results Test 점검

### 진행 기록
- 상태:
- 작업일:
- 메모:

---

## Phase 5 — 콘텐츠 기획: 광고 승인과 검색 유입 동시 준비

### 목표
- 광고 심사에 필요한 기본 페이지와 콘텐츠 볼륨 확보

### 필수 페이지
- 홈
- About
- Privacy Policy
- Contact
- 이용약관(선택이지만 권장)

### 필수 콘텐츠
- 계산기 상세 4종
- 각 계산기 설명 가이드
- 정책 요약 콘텐츠
- FAQ

### 추천 초기 볼륨
- 계산기 상세 4개
- 가이드 8~12개
- 정책 페이지 3개 이상

### 추천 가이드 주제
- 부모급여 2026 총정리
- 아동수당 2026 총정리
- 육아휴직 급여 계산 방법
- 6+6 부모육아휴직제 조건
- 한 명만 육아휴직할 때 총액 예시
- 첫째 vs 둘째 지원금 차이
- 맞벌이 / 외벌이 케이스 비교
- 신청 순서 / 지급 시기 정리

### 작업 항목
- [ ] About 작성
- [ ] Privacy 작성
- [ ] Contact 작성
- [ ] 계산기 4개 상세 페이지 보완
- [ ] 가이드 8~12개 작성
- [ ] FAQ 구조 정리

### 진행 기록
- 상태:
- 작업일:
- 메모:

---

## Phase 6 — AdSense 붙이기 전 준비

### 목표
- AdSense 심사 가능 상태까지 사이트 정리

### 작업 항목

#### 1. AdSense 계정 생성 및 사이트 등록
- `bigyocalc.com` 등록
- 코드 삽입 또는 연결 절차 진행

#### 2. ads.txt 준비
- 예시:

```txt
google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
```

#### 3. 광고 전 최종 점검
- 콘텐츠가 너무 적지 않은지
- 빈 페이지가 많은지
- 공사중 페이지가 있는지
- 자동 생성 / 중복 콘텐츠가 많은지
- 소개 / 정책 / 문의 페이지가 있는지

### 주의
- Search Essentials 준수 = 노출 보장 아님
- AdSense 심사도 승인 보장 아님

### 체크리스트
- [ ] AdSense 사이트 등록
- [ ] ads.txt 반영
- [ ] 정책 페이지 완료
- [ ] 콘텐츠 볼륨 확보
- [ ] 공사중 페이지 정리

### 진행 기록
- 상태:
- 작업일:
- 메모:

---

## 비교계산소 기준 실무 실행 순서

### 1주차
- 기술 SEO 세팅
- canonical
- robots.txt
- sitemap.xml
- pages.dev 리디렉션
- title / description 기본 템플릿
- Search Console 등록

### 2주차
- 정보 구조 정리
- `/tools/` 허브
- `/guides/` 허브
- 계산기 상세 4개 랜딩 정리
- 내부 링크 설계

### 3~4주차
- 가이드 8~12개 작성
- FAQ 페이지 또는 FAQ 섹션 추가
- About / Privacy / Contact 완성

### 5주차
- 구조화 데이터 적용
- Rich Results Test 점검
- Breadcrumb / FAQPage / Organization / WebSite 정리

### 6주차
- AdSense 사이트 추가
- ads.txt 반영
- 광고 위치 초안 설계
- 승인 대기

---

## 페이지별 요구사항

### 홈
- 목표: 브랜드 허브 / 내부 링크 중심
- 핵심 계산기 4종 링크
- 최신 가이드 링크
- 브랜드 소개
- FAQ 일부

### 계산기 상세
- 목표: 검색 유입 + 전환
- 계산기
- 사용 설명
- 예시 케이스
- FAQ
- 관련 가이드 링크

### 가이드 페이지
- 목표: 검색 유입 확보
- 정책 설명
- 계산기 연결
- 표 / 예시
- FAQ
- 내부 링크

---

## 현재 부족한 부분 요약

### 기술
- [x] canonical 주요 페이지 확인 완료
- [x] sitemap / robots 기본 접근 확인 완료
- [x] 도메인 중복 정리 확인 완료
- [ ] Search Console 미등록
- [ ] 404 처리 미흡

### 콘텐츠
- [ ] 계산기 설명 페이지 부족
- [ ] 정책 / 문의 / 소개 페이지 부족
- [ ] 내부 링크 부족

### 광고 준비
- [ ] ads.txt 없음
- [ ] 정책 페이지 부족
- [ ] 심사 전 콘텐츠량 부족

---

## 가장 추천하는 우선순위
1. Search Console + sitemap + canonical + robots.txt
2. 404 페이지와 중복 도메인 정리
3. 계산기 4종 각각에 대응하는 가이드 페이지 작성
4. About / Privacy / Contact / FAQ
5. AdSense 신청 + ads.txt + 광고 위치 최적화

---

## 한 줄 결론
지금 비교계산소는 검색엔진이 잘 읽는 기술 구조와 광고 심사를 통과할 만한 콘텐츠 구조를 먼저 갖춰야 한다.  
기술 SEO 기본 세팅은 일부 확인됐지만, 404 처리, Search Console 등록, 가이드 콘텐츠 확장이 다음 핵심 작업이다.


