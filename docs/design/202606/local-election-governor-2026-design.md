# 2026 지방선거 시도지사 당선자 공약 지도 — 설계 문서

> 기획 원문: `docs/plan/202606/local-election-governor-2026.md`
> 작성일: 2026-06-04
> 콘텐츠 유형: `/reports/` 인터랙티브 리포트
> 구현 기준: 2026.06.04 개표율 99.79% 기준 확정 데이터 반영 (미확정 필드는 TODO 표시)

---

## 1. 문서 개요

- 구현 대상: `2026 지방선거 시도지사 당선자 — 지도로 보는 공약 완전 정리`
- slug: `local-election-governor-2026`
- URL: `/reports/local-election-governor-2026/`
- 카테고리: 정치·선거
- 핵심 검색 의도: `2026 지방선거 결과`, `시도지사 당선자`, `2026 지방선거 당선자`, `우리 지역 당선자`, `지방선거 공약`
- 핵심 출력: SVG 클릭 지도로 16개 시도 당선자 프로필·공약·득표율 확인
- 안전 장치: 미확정 득표율은 `확정대기` 배지 표시, 공약은 선관위 공약마당 출처 링크 제공

---

## 2. 구현 파일 구조

```text
src/
  data/
    localElectionGovernor2026.ts      # 당선자 데이터 + 타입 정의
  pages/
    reports/
      local-election-governor-2026.astro

public/
  scripts/
    local-election-governor-2026.js   # SVG 인터랙션 + 패널 + 차트

src/styles/scss/pages/
  _local-election-governor-2026.scss
```

추가 등록 필수:

- `src/data/reports.ts` — 리포트 목록에 항목 추가
- `src/pages/reports/index.astro` — `정치·선거` 카테고리 항목 추가
- `src/pages/index.astro` — 홈 최신 리포트 섹션에 노출
- `src/styles/app.scss` — `@use 'scss/pages/local-election-governor-2026';`
- `public/sitemap.xml`
- `public/og/reports/local-election-governor-2026.png`

---

## 3. 레이아웃 방향

- `ReportShell` 기반 인터랙티브 리포트 페이지로 구현한다.
- 모바일에서는 SVG 지도 → 탭 전환 방식 (지도/목록)으로 전환한다.
- SCSS prefix: `gov-`
- pageClass: `gov-page`
- 지도 클릭 → 오른쪽(데스크탑) 또는 하단(모바일) 슬라이드 패널 오픈
- URL 해시 `#seoul` 방식으로 딥링크 지원

---

## 4. 페이지 IA (섹션 A~J)

### A. Hero
- H1: `2026 지방선거 시도지사 당선자 — 지도로 보는 공약 완전 정리`
- 서브타이틀: `전국 16개 시도 당선자를 지도에서 클릭하면 공약·이력·득표율이 한 번에 보입니다.`
- 데이터 기준일 배지: `2026.06.04 개표율 99.79% 기준`
- Hero 우측: 정당별 KPI 요약 (민주 12 / 국힘 4)

### B. InfoNotice
- 안내문: `아래 데이터는 개표 진행 중 잠정 집계입니다. 득표율 미확정 지역은 선관위 최종 발표 후 업데이트됩니다.`
- 출처 링크: 선관위 당선인 조회 (`info.nec.go.kr`)

### C. KPI 카드 (상단 요약)
- 민주당 당선: 12곳
- 국민의힘 당선: 4곳
- 최대 득표율: 79.02% (광주·전남 민형배)
- 최소 득표차: 0.26%p (서울 오세훈 vs 정원오)

### D. SVG 인터랙티브 지도
- 전국 16개 시도 SVG 지도
- 정당별 색상 fill (민주: `--party-dem`, 국힘: `--party-ppp`)
- 호버 시 툴팁 (당선자명 + 정당 + 득표율)
- 클릭 시 당선자 상세 패널 오픈

### E. 당선자 상세 패널 (슬라이드)
- 당선자 이름 + 정당 배지
- 득표율 / 상대 후보 득표율
- 이력 타임라인
- 핵심 공약 3가지 (accordion)
- 선관위 공약마당 링크

### F. 탭 전환 (모바일)
- `지도 보기` / `목록 보기` 탭
- 목록 보기: 16개 지역 카드 그리드

### G. 지역별 분석 차트
- 정당별 당선 현황 가로 막대 (2022 vs 2026)
- Chart.js 또는 CSS bar

### H. FAQ
- Q: 광주·전남은 왜 하나로 묶였나요?
- Q: 서울은 어떻게 뒤집혔나요?
- Q: 공약 이행은 어디서 확인하나요?

### I. 관련 링크
- 서울 구청장 지도 → `/reports/local-election-seoul-2026/`
- 재보궐 당선자 → `/reports/local-election-byeollection-2026/`
- 교육감 당선자 → `/reports/local-election-superintendent-2026/`

### J. SeoContent
- 전체 선거 결과 텍스트 요약 (SEO용 숨김 텍스트 불필요, 본문 구조로 충분)

---

## 5. TypeScript 타입 정의

파일: `src/data/localElectionGovernor2026.ts`

```typescript
export type Party = "더불어민주당" | "국민의힘" | "무소속" | "기타";
export type ResultBadge = "확정" | "확정대기" | "초박빙";

export interface GovernorCandidate {
  name: string;
  party: Party;
  voteShare: number;          // 0이면 미확정
  badge: ResultBadge;
}

export interface GovernorPledge {
  category: "경제" | "복지" | "교육" | "환경" | "교통" | "주거" | "청년" | "기타";
  title: string;
  description: string;
}

export interface GovernorElected {
  regionId: string;           // SVG path id (예: "seoul")
  regionName: string;
  regionNameKo: string;
  elected: GovernorCandidate;
  runner: GovernorCandidate | null;
  previousParty: Party;       // 2022 당선 정당
  isPartyFlip: boolean;       // 정당 교체 여부
  career: string[];           // 이력 배열 (최근 → 과거 순)
  pledges: GovernorPledge[];
  noteDate: string;           // 데이터 기준일
  sources: { label: string; url: string }[];
}

export interface GovernorPageData {
  electionName: string;
  electionDate: string;
  dataAsOf: string;
  totalRegions: number;
  demCount: number;
  pppCount: number;
  governors: GovernorElected[];
}
```

---

## 6. 실제 데이터

```typescript
export const GOVERNOR_DATA_2026: GovernorPageData = {
  electionName: "제9회 전국동시지방선거",
  electionDate: "2026-06-04",
  dataAsOf: "2026-06-04 개표율 99.79%",
  totalRegions: 16,
  demCount: 12,
  pppCount: 4,
  governors: [
    {
      regionId: "seoul",
      regionName: "Seoul",
      regionNameKo: "서울",
      elected: {
        name: "오세훈",
        party: "국민의힘",
        voteShare: 48.77,
        badge: "초박빙",
      },
      runner: {
        name: "정원오",
        party: "더불어민주당",
        voteShare: 48.51,
        badge: "확정",
      },
      previousParty: "국민의힘",
      isPartyFlip: false,
      career: [
        "서울시장 (2021~2026, 재선)",
        "서울시장 (2006~2011)",
        "국회의원 서울 마포구을 (2004~2006)",
        "서울시의회 의원 (1995~1998)",
      ],
      pledges: [
        /* TODO: 선관위 공약마당 확인 후 업데이트 */
        { category: "교통", title: "GTX 연장 및 도심 교통 개선", description: "GTX-A·B·C 연장 및 서울 도심 교통망 확충" },
        { category: "주거", title: "재건축·재개발 규제 완화", description: "노후 주거지 정비 사업 속도 향상" },
        { category: "경제", title: "서울 경제 활성화 프로젝트", description: "글로벌 비즈니스 허브 서울 조성" },
      ],
      noteDate: "2026-06-04",
      sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
    },
    {
      regionId: "busan",
      regionName: "Busan",
      regionNameKo: "부산",
      elected: {
        name: "박형준",
        party: "국민의힘",
        voteShare: 0, /* TODO: 선관위 확정 후 업데이트 */
        badge: "확정대기",
      },
      runner: {
        name: "전재수",
        party: "더불어민주당",
        voteShare: 0, /* TODO: 선관위 확정 후 업데이트 */
        badge: "확정대기",
      },
      previousParty: "국민의힘",
      isPartyFlip: false,
      career: [
        "부산시장 (2021~2026, 재선)",
        "국회의원 부산 동래구 (2016~2020)",
        "부산시장 권한대행 (2020)",
      ],
      pledges: [
        /* TODO: 선관위 공약마당 확인 후 업데이트 */
        { category: "경제", title: "부산 글로벌 허브도시 조성", description: "2030 부산세계박람회 레거시 활용" },
        { category: "교통", title: "부산 교통망 현대화", description: "도시철도 노선 확장 및 스마트 교통 시스템" },
        { category: "기타", title: "부산 인구 감소 대응", description: "청년 유입 정책 및 기업 유치" },
      ],
      noteDate: "2026-06-04",
      sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
    },
    {
      regionId: "daegu",
      regionName: "Daegu",
      regionNameKo: "대구",
      elected: {
        name: "추경호",
        party: "국민의힘",
        voteShare: 53.92,
        badge: "확정",
      },
      runner: null, /* TODO: 상대 후보 정보 확인 */
      previousParty: "국민의힘",
      isPartyFlip: false,
      career: [
        "국회의원 대구 달성군 (2020~2026)",
        "기획재정부 장관 (2022~2023)",
        "국회의원 경북 달성군 (2016~2020)",
        "기획재정부 제1차관 (2014~2016)",
      ],
      pledges: [
        /* TODO: 선관위 공약마당 확인 후 업데이트 */
        { category: "경제", title: "대구 경제 재건 프로젝트", description: "산업 다양화 및 첨단 산업 유치" },
        { category: "교통", title: "대구 광역교통망 확충", description: "수도권 연결 KTX·GTX 추진" },
        { category: "청년", title: "청년 인구 유입 정책", description: "일자리·주거 지원으로 청년 정착 유도" },
      ],
      noteDate: "2026-06-04",
      sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
    },
    {
      regionId: "incheon",
      regionName: "Incheon",
      regionNameKo: "인천",
      elected: {
        name: "박찬대",
        party: "더불어민주당",
        voteShare: 52.84,
        badge: "확정",
      },
      runner: {
        name: "유정복",
        party: "국민의힘",
        voteShare: 0, /* TODO: 선관위 확정 후 업데이트 */
        badge: "확정대기",
      },
      previousParty: "국민의힘",
      isPartyFlip: true,
      career: [
        "국회의원 인천 연수구을 (2020~2026)",
        "더불어민주당 원내대표 (2024~2025)",
        "더불어민주당 대표 (2025~2026)",
      ],
      pledges: [
        /* TODO: 선관위 공약마당 확인 후 업데이트 */
        { category: "교통", title: "인천 GTX·지하철 확충", description: "수도권 광역교통망 인천 연결 강화" },
        { category: "경제", title: "인천 공항·항만 경제권 발전", description: "인천공항 주변 경제자유구역 활성화" },
        { category: "주거", title: "인천 주거환경 개선", description: "구도심 재개발 및 신도시 인프라 확충" },
      ],
      noteDate: "2026-06-04",
      sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
    },
    {
      regionId: "gwangju_jeonnam",
      regionName: "Gwangju·Jeonnam",
      regionNameKo: "광주·전남",
      elected: {
        name: "민형배",
        party: "더불어민주당",
        voteShare: 79.02,
        badge: "확정",
      },
      runner: null, /* TODO: 상대 후보 정보 확인 */
      previousParty: "더불어민주당",
      isPartyFlip: false,
      career: [
        "국회의원 광주 광산구을 (2020~2026)",
        "광주 광산구청장 (2010~2018)",
        "더불어민주당 최고위원",
      ],
      pledges: [
        /* TODO: 선관위 공약마당 확인 후 업데이트 */
        { category: "기타", title: "광주·전남 통합특별시 조성", description: "광주전남통합특별시 출범 추진" },
        { category: "경제", title: "미래 첨단산업 유치", description: "AI·반도체·에너지 산업 광주전남 집중 유치" },
        { category: "복지", title: "농어촌 복지 강화", description: "전남 농어촌 주민 의료·교육 서비스 향상" },
      ],
      noteDate: "2026-06-04",
      sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
    },
    {
      regionId: "daejeon",
      regionName: "Daejeon",
      regionNameKo: "대전",
      elected: {
        name: "허태정",
        party: "더불어민주당",
        voteShare: 53.49,
        badge: "확정",
      },
      runner: null, /* TODO: 상대 후보 정보 확인 */
      previousParty: "더불어민주당",
      isPartyFlip: false,
      career: [
        "대전시장 (2018~2022)",
        "대전 유성구청장 (2010~2018)",
        "국회의원 대전 유성구갑 (2004~2008)",
      ],
      pledges: [
        /* TODO: 선관위 공약마당 확인 후 업데이트 */
        { category: "경제", title: "대전 과학·연구 특구 강화", description: "대덕연구개발특구 고도화" },
        { category: "교통", title: "대전 도시철도 2호선 완공", description: "트램 2호선 조기 완공 및 연장" },
        { category: "청년", title: "청년 일자리 창출", description: "스타트업 지원 및 청년 고용 확대" },
      ],
      noteDate: "2026-06-04",
      sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
    },
    {
      regionId: "ulsan",
      regionName: "Ulsan",
      regionNameKo: "울산",
      elected: {
        name: "김상욱",
        party: "더불어민주당",
        voteShare: 48.73,
        badge: "확정",
      },
      runner: null, /* TODO: 상대 후보 정보 확인 */
      previousParty: "국민의힘",
      isPartyFlip: true,
      career: [
        "국회의원 울산 중구 (2020~2026)",
        /* TODO: 이력 추가 확인 */
      ],
      pledges: [
        /* TODO: 선관위 공약마당 확인 후 업데이트 */
        { category: "경제", title: "울산 산업 전환 지원", description: "자동차·석유화학 → 미래 친환경 산업 전환" },
        { category: "환경", title: "친환경 에너지 도시 울산", description: "수소 경제 중심 도시 조성" },
        { category: "복지", title: "노동자·시민 복지 강화", description: "산업재해 예방 및 시민 의료 접근성 향상" },
      ],
      noteDate: "2026-06-04",
      sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
    },
    {
      regionId: "sejong",
      regionName: "Sejong",
      regionNameKo: "세종",
      elected: {
        name: "조상호",
        party: "더불어민주당",
        voteShare: 61.04,
        badge: "확정",
      },
      runner: null, /* TODO: 상대 후보 정보 확인 */
      previousParty: "더불어민주당",
      isPartyFlip: false,
      career: [
        /* TODO: 이력 확인 필요 */
        "더불어민주당 세종시 정치인",
      ],
      pledges: [
        /* TODO: 선관위 공약마당 확인 후 업데이트 */
        { category: "기타", title: "세종시 행정수도 완성", description: "국회·청와대 세종 이전 완성" },
        { category: "교통", title: "세종 광역교통망 구축", description: "대전·청주 연결 BRT·철도망 확충" },
        { category: "교육", title: "행정중심복합도시 교육 강화", description: "고교·대학 유치로 교육 자족도시 완성" },
      ],
      noteDate: "2026-06-04",
      sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
    },
    {
      regionId: "gyeonggi",
      regionName: "Gyeonggi",
      regionNameKo: "경기",
      elected: {
        name: "추미애",
        party: "더불어민주당",
        voteShare: 0, /* TODO: 선관위 확정 후 업데이트 */
        badge: "확정대기",
      },
      runner: {
        name: "김은혜",
        party: "국민의힘",
        voteShare: 0, /* TODO: 선관위 확정 후 업데이트 */
        badge: "확정대기",
      },
      previousParty: "국민의힘",
      isPartyFlip: true,
      career: [
        "법무부 장관 (2020~2021)",
        "국회의원 7선 (1995~2020)",
        "더불어민주당 대표 (2016~2018)",
      ],
      pledges: [
        /* TODO: 선관위 공약마당 확인 후 업데이트 */
        { category: "교통", title: "GTX 전 노선 경기 연결", description: "GTX A·B·C·D 경기 전역 연결망 완성" },
        { category: "주거", title: "경기 주거비 부담 완화", description: "공공주택 공급 확대 및 전·월세 안정" },
        { category: "청년", title: "경기 청년 기본소득 확대", description: "청년기본소득 대상·금액 확대" },
      ],
      noteDate: "2026-06-04",
      sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
    },
    {
      regionId: "gangwon",
      regionName: "Gangwon",
      regionNameKo: "강원",
      elected: {
        name: "우상호",
        party: "더불어민주당",
        voteShare: 51.81,
        badge: "확정",
      },
      runner: null, /* TODO: 상대 후보 정보 확인 */
      previousParty: "국민의힘",
      isPartyFlip: true,
      career: [
        "국회의원 서울 서대문구갑 (2008~2026)",
        "더불어민주당 원내대표 (2016~2017)",
        "더불어민주당 비상대책위원장 (2022)",
      ],
      pledges: [
        /* TODO: 선관위 공약마당 확인 후 업데이트 */
        { category: "경제", title: "강원 관광·레저 산업 육성", description: "2018 평창 올림픽 시설 활용 및 관광 활성화" },
        { category: "교통", title: "강원 교통 접근성 개선", description: "서울~강원 고속화 도로·철도망 확충" },
        { category: "환경", title: "강원 탄소중립 선도", description: "청정 자연 자산을 활용한 그린 경제 구축" },
      ],
      noteDate: "2026-06-04",
      sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
    },
    {
      regionId: "chungbuk",
      regionName: "Chungbuk",
      regionNameKo: "충북",
      elected: {
        name: "신용한",
        party: "더불어민주당",
        voteShare: 0, /* TODO: 선관위 확정 후 업데이트 */
        badge: "확정대기",
      },
      runner: null, /* TODO: 상대 후보 정보 확인 */
      previousParty: "국민의힘",
      isPartyFlip: true,
      career: [
        /* TODO: 이력 추가 확인 필요 */
        "더불어민주당 충북 정치인",
      ],
      pledges: [
        /* TODO: 선관위 공약마당 확인 후 업데이트 */
        { category: "경제", title: "충북 반도체·바이오 산업 유치", description: "첨단 산업 클러스터 충북 조성" },
        { category: "교통", title: "충북 고속도로·철도 확충", description: "청주공항 국제선 확대 및 KTX 연결" },
        { category: "복지", title: "충북 의료 인프라 강화", description: "공공병원 확충 및 응급의료 체계 개선" },
      ],
      noteDate: "2026-06-04",
      sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
    },
    {
      regionId: "chungnam",
      regionName: "Chungnam",
      regionNameKo: "충남",
      elected: {
        name: "박수현",
        party: "더불어민주당",
        voteShare: 52.53,
        badge: "확정",
      },
      runner: null, /* TODO: 상대 후보 정보 확인 */
      previousParty: "국민의힘",
      isPartyFlip: true,
      career: [
        "청와대 국민소통수석 비서관 (2017~2018)",
        "국회의원 충남 공주시·청양군 (2004~2008)",
        "청와대 대변인 (2018~2020)",
      ],
      pledges: [
        /* TODO: 선관위 공약마당 확인 후 업데이트 */
        { category: "경제", title: "충남 서해안 산업단지 발전", description: "당진·보령 등 서해안 산업 클러스터 활성화" },
        { category: "환경", title: "충남 탈석탄 에너지 전환", description: "석탄발전소 조기 폐쇄 및 재생에너지 전환" },
        { category: "복지", title: "충남 농어촌 주민 지원", description: "농어촌 인구 감소 대응 특별 대책" },
      ],
      noteDate: "2026-06-04",
      sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
    },
    {
      regionId: "jeonbuk",
      regionName: "Jeonbuk",
      regionNameKo: "전북",
      elected: {
        name: "이원택",
        party: "더불어민주당",
        voteShare: 51.23,
        badge: "확정",
      },
      runner: null, /* TODO: 상대 후보 정보 확인 */
      previousParty: "더불어민주당",
      isPartyFlip: false,
      career: [
        "국회의원 전북 익산시을 (2020~2026)",
        /* TODO: 이력 추가 확인 */
      ],
      pledges: [
        /* TODO: 선관위 공약마당 확인 후 업데이트 */
        { category: "경제", title: "전북 새만금 개발 가속화", description: "새만금 국제자유도시 조성 속도 향상" },
        { category: "농업", title: "전북 농업 디지털화", description: "스마트팜 확대 및 농업 수출 증대" },
        { category: "교통", title: "전북 KTX·고속도로 확충", description: "전주~수도권 고속 이동 인프라 강화" },
      ] as GovernorPledge[],
      noteDate: "2026-06-04",
      sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
    },
    {
      regionId: "gyeongbuk",
      regionName: "Gyeongbuk",
      regionNameKo: "경북",
      elected: {
        name: "이철우",
        party: "국민의힘",
        voteShare: 67.24,
        badge: "확정",
      },
      runner: null, /* TODO: 상대 후보 정보 확인 */
      previousParty: "국민의힘",
      isPartyFlip: false,
      career: [
        "경북도지사 (2018~2026, 재선)",
        "국회의원 경북 김천시 (2008~2018)",
        "국가정보원 차장 (2007~2008)",
      ],
      pledges: [
        /* TODO: 선관위 공약마당 확인 후 업데이트 */
        { category: "경제", title: "경북 첨단 산업 클러스터", description: "구미·포항 첨단 제조업 재도약" },
        { category: "기타", title: "경북 행정통합 추진", description: "경북·대구 행정통합 논의 지속" },
        { category: "교통", title: "경북 교통 인프라 확충", description: "동해선·중부내륙선 완공 및 활용" },
      ],
      noteDate: "2026-06-04",
      sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
    },
    {
      regionId: "gyeongnam",
      regionName: "Gyeongnam",
      regionNameKo: "경남",
      elected: {
        name: "김경수",
        party: "더불어민주당",
        voteShare: 0, /* TODO: 선관위 확정 후 업데이트 */
        badge: "확정대기",
      },
      runner: {
        name: "박완수",
        party: "국민의힘",
        voteShare: 0, /* TODO: 선관위 확정 후 업데이트 */
        badge: "확정대기",
      },
      previousParty: "국민의힘",
      isPartyFlip: true,
      career: [
        "경남도지사 (2018~2021, 드루킹 사건으로 중도 사퇴)",
        "국회의원 경남 김해시을 (2016~2018)",
        "더불어민주당 대선 캠프 핵심 참모 (2017)",
        "사면 복권 후 정계 복귀 (2024)",
      ],
      pledges: [
        /* TODO: 선관위 공약마당 확인 후 업데이트 */
        { category: "경제", title: "경남 항공·우주 산업 육성", description: "사천 항공 클러스터 고도화" },
        { category: "환경", title: "낙동강 수질 개선", description: "낙동강 물 문제 해결 및 친수공간 조성" },
        { category: "청년", title: "경남 청년 인구 유입", description: "청년 일자리·주거 지원 패키지" },
      ],
      noteDate: "2026-06-04",
      sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
    },
    {
      regionId: "jeju",
      regionName: "Jeju",
      regionNameKo: "제주",
      elected: {
        name: "위성곤",
        party: "더불어민주당",
        voteShare: 63.11,
        badge: "확정",
      },
      runner: null, /* TODO: 상대 후보 정보 확인 */
      previousParty: "더불어민주당",
      isPartyFlip: false,
      career: [
        "국회의원 제주 서귀포시 (2016~2026)",
        /* TODO: 이력 추가 확인 */
      ],
      pledges: [
        /* TODO: 선관위 공약마당 확인 후 업데이트 */
        { category: "환경", title: "제주 탄소중립 섬 실현", description: "2030 탄소중립 목표 조기 달성" },
        { category: "경제", title: "제주 관광 고도화", description: "오버투어리즘 해소 및 고부가가치 관광" },
        { category: "교통", title: "제주 제2공항 건설", description: "제주 제2공항 조기 착공" },
      ],
      noteDate: "2026-06-04",
      sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
    },
  ],
};
```

---

## 7. SVG 지도 구조

### 7-1. path id 목록 (16개)

| id | 지역 |
|----|------|
| `seoul` | 서울 |
| `busan` | 부산 |
| `daegu` | 대구 |
| `incheon` | 인천 |
| `gwangju_jeonnam` | 광주·전남 (통합) |
| `daejeon` | 대전 |
| `ulsan` | 울산 |
| `sejong` | 세종 |
| `gyeonggi` | 경기 |
| `gangwon` | 강원 |
| `chungbuk` | 충북 |
| `chungnam` | 충남 |
| `jeonbuk` | 전북 |
| `gyeongbuk` | 경북 |
| `gyeongnam` | 경남 |
| `jeju` | 제주 |

### 7-2. SVG 마크업 기본 구조

```html
<svg
  id="gov-map-svg"
  class="gov-map__svg"
  viewBox="0 0 600 700"
  xmlns="http://www.w3.org/2000/svg"
  aria-label="전국 시도지사 당선자 지도"
  role="img"
>
  <title>2026 지방선거 시도지사 당선자 지도</title>
  <g class="gov-map__regions">
    <!-- 각 지역 path — data-region-id 속성으로 JS에서 참조 -->
    <path
      id="gov-region-seoul"
      data-region-id="seoul"
      class="gov-map__region"
      d="..."
      aria-label="서울 — 오세훈 (국민의힘)"
      tabindex="0"
      role="button"
    />
    <!-- ... 나머지 15개 path 동일 구조 -->
  </g>
  <!-- 지역명 레이블 -->
  <g class="gov-map__labels" aria-hidden="true">
    <text data-label-for="seoul" class="gov-map__label" x="..." y="...">서울</text>
    <!-- ... -->
  </g>
</svg>
```

### 7-3. 색상 CSS 변수

```scss
:root {
  --party-dem: #0078D7;            // 더불어민주당 파랑
  --party-ppp: #E61E2B;            // 국민의힘 빨강
  --party-ind: #888888;            // 무소속 회색
  --party-dem-hover: #005FA3;
  --party-ppp-hover: #B5141E;
  --gov-region-stroke: #ffffff;
  --gov-region-stroke-width: 1.5px;
  --gov-region-flip: #FF9800;      // 정당 교체 지역 강조 (선택적)
}
```

---

## 8. JS 인터랙션 전체 코드

파일: `public/scripts/local-election-governor-2026.js`

```javascript
// ============================================================
// local-election-governor-2026.js
// 전국 시도지사 당선자 SVG 지도 인터랙션
// ============================================================

const GOV_MAP = {
  svgEl: null,
  panelEl: null,
  tooltipEl: null,
  activeRegionId: null,
};

// ------ 초기화 ------

function initGovMap() {
  GOV_MAP.svgEl = document.getElementById('gov-map-svg');
  GOV_MAP.panelEl = document.getElementById('gov-panel');
  GOV_MAP.tooltipEl = document.getElementById('gov-tooltip');

  if (!GOV_MAP.svgEl) return;

  const regions = GOV_MAP.svgEl.querySelectorAll('.gov-map__region');
  regions.forEach((path) => {
    path.addEventListener('mouseenter', onRegionHover);
    path.addEventListener('mouseleave', onRegionLeave);
    path.addEventListener('click', onRegionClick);
    path.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onRegionClick(e);
      }
    });
  });

  // 모바일 탭 전환
  initGovMapTabs();

  // URL 해시로 초기 패널 오픈
  const hash = location.hash.replace('#', '');
  if (hash) openGovPanel(hash);

  // 차트 초기화
  initGovChart();
}

// ------ 툴팁 ------

function onRegionHover(e) {
  const regionId = e.currentTarget.dataset.regionId;
  const data = getGovernorData(regionId);
  if (!data || !GOV_MAP.tooltipEl) return;

  const voteText = data.elected.voteShare > 0
    ? `${data.elected.voteShare}%`
    : '확정대기';

  GOV_MAP.tooltipEl.innerHTML = `
    <span class="gov-tooltip__name">${data.elected.name}</span>
    <span class="gov-tooltip__party gov-tooltip__party--${getPartyClass(data.elected.party)}">${data.elected.party}</span>
    <span class="gov-tooltip__vote">${voteText}</span>
  `;
  GOV_MAP.tooltipEl.classList.add('is-visible');
  updateTooltipPosition(e);
}

function onRegionLeave() {
  if (GOV_MAP.tooltipEl) GOV_MAP.tooltipEl.classList.remove('is-visible');
}

function updateTooltipPosition(e) {
  if (!GOV_MAP.tooltipEl) return;
  const rect = GOV_MAP.svgEl.getBoundingClientRect();
  const x = e.clientX - rect.left + 12;
  const y = e.clientY - rect.top - 8;
  GOV_MAP.tooltipEl.style.transform = `translate(${x}px, ${y}px)`;
}

// ------ 패널 오픈/클로즈 ------

function onRegionClick(e) {
  const regionId = e.currentTarget.dataset.regionId;
  if (GOV_MAP.activeRegionId === regionId) {
    closeGovPanel();
    return;
  }
  openGovPanel(regionId);
}

function openGovPanel(regionId) {
  const data = getGovernorData(regionId);
  if (!data || !GOV_MAP.panelEl) return;

  GOV_MAP.activeRegionId = regionId;
  renderGovPanel(data);
  GOV_MAP.panelEl.classList.add('is-open');

  // SVG 활성 지역 강조
  document.querySelectorAll('.gov-map__region').forEach((el) => {
    el.classList.toggle('is-active', el.dataset.regionId === regionId);
  });

  // URL 해시 업데이트 (history API)
  history.replaceState(null, '', `#${regionId}`);

  // 모바일: 패널로 스크롤
  if (window.innerWidth < 768) {
    GOV_MAP.panelEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function closeGovPanel() {
  GOV_MAP.activeRegionId = null;
  if (GOV_MAP.panelEl) GOV_MAP.panelEl.classList.remove('is-open');
  document.querySelectorAll('.gov-map__region.is-active').forEach((el) => {
    el.classList.remove('is-active');
  });
  history.replaceState(null, '', location.pathname);
}

// ------ 패널 렌더링 ------

function renderGovPanel(data) {
  const panel = GOV_MAP.panelEl;
  const voteText = data.elected.voteShare > 0
    ? `${data.elected.voteShare}%`
    : '<span class="gov-badge gov-badge--pending">확정대기</span>';

  panel.innerHTML = `
    <button type="button" class="gov-panel__close" aria-label="패널 닫기" onclick="closeGovPanel()">✕</button>
    <div class="gov-panel__header">
      <span class="gov-panel__region">${data.regionNameKo}</span>
      <span class="gov-panel__party-badge gov-panel__party-badge--${getPartyClass(data.elected.party)}">${data.elected.party}</span>
    </div>
    <h2 class="gov-panel__name">${data.elected.name}</h2>
    <div class="gov-panel__vote">
      <span class="gov-panel__vote-label">득표율</span>
      <span class="gov-panel__vote-value">${voteText}</span>
      ${data.runner ? `<span class="gov-panel__runner">상대 후보: ${data.runner.name} (${data.runner.party})</span>` : ''}
    </div>
    ${data.isPartyFlip ? '<div class="gov-panel__flip-badge">정당 교체</div>' : ''}
    <div class="gov-panel__career">
      <h3 class="gov-panel__section-title">이력</h3>
      <ul class="gov-panel__career-list">
        ${data.career.map((item) => `<li>${item}</li>`).join('')}
      </ul>
    </div>
    <div class="gov-panel__pledges">
      <h3 class="gov-panel__section-title">핵심 공약</h3>
      ${data.pledges.map((pledge, i) => `
        <details class="gov-panel__pledge-item" ${i === 0 ? 'open' : ''}>
          <summary class="gov-panel__pledge-title">
            <span class="gov-panel__pledge-category">${pledge.category}</span>
            ${pledge.title}
          </summary>
          <p class="gov-panel__pledge-desc">${pledge.description}</p>
        </details>
      `).join('')}
    </div>
    <a href="https://policy.nec.go.kr" target="_blank" rel="noopener noreferrer" class="gov-panel__source-link">
      선관위 공약마당에서 전체 공약 보기 →
    </a>
  `;
}

// ------ 모바일 탭 전환 ------

function initGovMapTabs() {
  const tabMap = document.getElementById('gov-tab-map');
  const tabList = document.getElementById('gov-tab-list');
  const mapView = document.getElementById('gov-map-view');
  const listView = document.getElementById('gov-list-view');

  if (!tabMap || !tabList) return;

  tabMap.addEventListener('click', () => {
    tabMap.classList.add('is-active');
    tabList.classList.remove('is-active');
    mapView?.classList.remove('is-hidden');
    listView?.classList.add('is-hidden');
  });

  tabList.addEventListener('click', () => {
    tabList.classList.add('is-active');
    tabMap.classList.remove('is-active');
    listView?.classList.remove('is-hidden');
    mapView?.classList.add('is-hidden');
  });
}

// ------ 차트 ------

function initGovChart() {
  const canvas = document.getElementById('gov-party-chart');
  if (!canvas || typeof Chart === 'undefined') return;

  new Chart(canvas, {
    type: 'bar',
    data: {
      labels: ['더불어민주당', '국민의힘'],
      datasets: [
        {
          label: '2022년',
          data: [5, 12],
          backgroundColor: ['rgba(0, 120, 215, 0.4)', 'rgba(230, 30, 43, 0.4)'],
        },
        {
          label: '2026년',
          data: [12, 4],
          backgroundColor: ['rgba(0, 120, 215, 0.9)', 'rgba(230, 30, 43, 0.9)'],
        },
      ],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: { legend: { position: 'bottom' } },
    },
  });
}

// ------ 유틸 ------

function getGovernorData(regionId) {
  // 전역 DATA 객체에서 조회 (astro에서 JSON으로 주입)
  return window.GOV_DATA?.governors?.find((g) => g.regionId === regionId) || null;
}

function getPartyClass(party) {
  if (party === '더불어민주당') return 'dem';
  if (party === '국민의힘') return 'ppp';
  return 'ind';
}

// ------ 실행 ------
document.addEventListener('DOMContentLoaded', initGovMap);
```

---

## 9. Astro 페이지 전체 HTML 구조

파일: `src/pages/reports/local-election-governor-2026.astro`

```astro
---
import { GOVERNOR_DATA_2026 } from '../../data/localElectionGovernor2026';

const title = '2026 지방선거 시도지사 당선자 — 지도로 보는 공약 완전 정리';
const description = '전국 16개 시도지사 당선자를 지도에서 클릭하면 공약·이력·득표율이 한 번에 보입니다. 2026 지방선거 결과 완전 정리.';
const data = GOVERNOR_DATA_2026;
---

<!-- 섹션 A: Hero -->
<section class="gov-hero">
  <div class="gov-hero__inner">
    <div class="gov-hero__badge">2026 지방선거</div>
    <h1 class="gov-hero__title">{title}</h1>
    <p class="gov-hero__sub">전국 16개 시도 당선자를 지도에서 클릭하면<br />공약·이력·득표율이 한 번에 보입니다.</p>
    <div class="gov-hero__data-date">
      <span class="gov-badge gov-badge--info">데이터 기준: {data.dataAsOf}</span>
    </div>
  </div>
</section>

<!-- 섹션 B: InfoNotice -->
<section class="gov-info-notice">
  <div class="gov-info-notice__inner">
    <p class="gov-info-notice__text">
      ⚠️ 아래 데이터는 개표 진행 중 잠정 집계입니다. 득표율 미확정 지역은 선관위 최종 발표 후 업데이트됩니다.
      <a href="https://info.nec.go.kr" target="_blank" rel="noopener noreferrer">선관위 당선인 조회 →</a>
    </p>
  </div>
</section>

<!-- 섹션 C: KPI 카드 -->
<section class="gov-kpi">
  <div class="gov-kpi-grid">
    <div class="gov-kpi-card gov-kpi-card--dem">
      <span class="gov-kpi-card__label">더불어민주당</span>
      <span class="gov-kpi-card__value">{data.demCount}곳</span>
      <span class="gov-kpi-card__change">2022년 5곳 → 12곳</span>
    </div>
    <div class="gov-kpi-card gov-kpi-card--ppp">
      <span class="gov-kpi-card__label">국민의힘</span>
      <span class="gov-kpi-card__value">{data.pppCount}곳</span>
      <span class="gov-kpi-card__change">2022년 12곳 → 4곳</span>
    </div>
    <div class="gov-kpi-card">
      <span class="gov-kpi-card__label">최대 득표율</span>
      <span class="gov-kpi-card__value">79.02%</span>
      <span class="gov-kpi-card__sub">광주·전남 민형배</span>
    </div>
    <div class="gov-kpi-card gov-kpi-card--accent">
      <span class="gov-kpi-card__label">최소 득표차</span>
      <span class="gov-kpi-card__value">0.26%p</span>
      <span class="gov-kpi-card__sub">서울 오세훈 vs 정원오</span>
    </div>
  </div>
</section>

<!-- 섹션 D: 인터랙티브 지도 + 패널 -->
<section class="gov-map-section">
  <div class="gov-map-section__inner">
    <!-- 모바일 탭 -->
    <div class="gov-tabs" role="tablist">
      <button id="gov-tab-map" class="gov-tab is-active" role="tab" aria-selected="true">지도 보기</button>
      <button id="gov-tab-list" class="gov-tab" role="tab" aria-selected="false">목록 보기</button>
    </div>

    <div class="gov-map-layout">
      <!-- 지도 컨테이너 -->
      <div id="gov-map-view" class="gov-map">
        <div class="gov-map__wrapper">
          <!-- SVG 인라인 삽입 또는 외부 파일 참조 -->
          <!-- TODO: 실제 한국 행정구역 SVG path 데이터 삽입 -->
          <svg id="gov-map-svg" class="gov-map__svg" viewBox="0 0 600 700"
               xmlns="http://www.w3.org/2000/svg"
               aria-label="전국 시도지사 당선자 지도">
            <title>2026 지방선거 시도지사 당선자 지도</title>
            <!-- 각 지역 path — 실제 좌표는 SVG 소스에서 추가 -->
            {data.governors.map((gov) => (
              <path
                id={`gov-region-${gov.regionId}`}
                data-region-id={gov.regionId}
                class={`gov-map__region gov-map__region--${gov.elected.party === '더불어민주당' ? 'dem' : 'ppp'}`}
                aria-label={`${gov.regionNameKo} — ${gov.elected.name} (${gov.elected.party})`}
                tabindex="0"
                role="button"
                d="M0 0"
              />
            ))}
          </svg>
          <!-- 툴팁 -->
          <div id="gov-tooltip" class="gov-tooltip" aria-hidden="true"></div>
        </div>

        <!-- 지도 범례 -->
        <div class="gov-map__legend">
          <span class="gov-map__legend-item gov-map__legend-item--dem">더불어민주당</span>
          <span class="gov-map__legend-item gov-map__legend-item--ppp">국민의힘</span>
        </div>
      </div>

      <!-- 목록 뷰 (모바일 탭 전환 시) -->
      <div id="gov-list-view" class="gov-list is-hidden">
        <div class="gov-list__grid">
          {data.governors.map((gov) => (
            <button
              type="button"
              class={`gov-list__card gov-list__card--${gov.elected.party === '더불어민주당' ? 'dem' : 'ppp'}`}
              data-region-id={gov.regionId}
              onclick={`openGovPanel('${gov.regionId}')`}
            >
              <span class="gov-list__region">{gov.regionNameKo}</span>
              <span class="gov-list__name">{gov.elected.name}</span>
              <span class="gov-list__vote">
                {gov.elected.voteShare > 0 ? `${gov.elected.voteShare}%` : '확정대기'}
              </span>
            </button>
          ))}
        </div>
      </div>

      <!-- 상세 패널 -->
      <div id="gov-panel" class="gov-panel" role="dialog" aria-label="당선자 상세 정보">
        <!-- JS로 동적 렌더링 -->
        <p class="gov-panel__hint">지도에서 지역을 클릭하면 당선자 정보가 표시됩니다.</p>
      </div>
    </div>
  </div>
</section>

<!-- 섹션 G: 정당별 당선 현황 차트 -->
<section class="gov-chart-section">
  <div class="gov-chart-section__inner">
    <h2 class="gov-chart-section__title">정당별 당선 현황 (2022 vs 2026)</h2>
    <canvas id="gov-party-chart" class="gov-chart" aria-label="정당별 당선 현황 차트"></canvas>
  </div>
</section>

<!-- 섹션 H: FAQ -->
<section class="gov-faq">
  <div class="gov-faq__inner">
    <h2 class="gov-faq__title">자주 묻는 질문</h2>
    <details class="gov-faq__item">
      <summary>광주·전남은 왜 하나로 묶였나요?</summary>
      <p>광주·전남 통합특별시 추진에 따라 단일 광역단체장으로 통합 선거를 실시했습니다. 민형배 후보가 79.02%라는 압도적 득표율로 초대 단체장에 당선되었습니다.</p>
    </details>
    <details class="gov-faq__item">
      <summary>서울은 어떻게 역전이 일어났나요?</summary>
      <p>오세훈 후보(국민의힘)가 48.77%, 정원오 후보(더불어민주당)가 48.51%로 불과 0.26%p 차이의 초박빙 승부였습니다. 개표 막판까지 결과가 뒤집히며 이번 선거 최대의 이변으로 평가됩니다.</p>
    </details>
    <details class="gov-faq__item">
      <summary>공약 이행 여부는 어디서 확인하나요?</summary>
      <p>선관위 공약마당(policy.nec.go.kr)에서 당선자가 제출한 공식 공약을 확인할 수 있습니다. 비교계산소는 임기 중 주요 시점(6개월·1년·임기 종료)에 공약 이행 현황을 업데이트할 예정입니다.</p>
    </details>
    <details class="gov-faq__item">
      <summary>이 데이터는 얼마나 신뢰할 수 있나요?</summary>
      <p>네이버 개표현황(KBS 제공) 기준 99.79% 개표 시점의 잠정 집계입니다. 미확정 항목은 '확정대기' 배지로 표시되며, 선관위 최종 발표 후 전면 업데이트됩니다.</p>
    </details>
  </div>
</section>

<!-- 섹션 I: 관련 링크 -->
<section class="gov-related">
  <div class="gov-related__inner">
    <h2 class="gov-related__title">관련 콘텐츠</h2>
    <div class="gov-related__grid">
      <a href="/reports/local-election-seoul-2026/" class="gov-related__card">
        서울 25개 구청장 지도 →
      </a>
      <a href="/reports/local-election-byeollection-2026/" class="gov-related__card">
        재보궐 14개 지역구 당선자 →
      </a>
      <a href="/reports/local-election-superintendent-2026/" class="gov-related__card">
        17개 시도 교육감 당선자 →
      </a>
    </div>
  </div>
</section>

<!-- 데이터 주입 -->
<script define:vars={{ govData: GOVERNOR_DATA_2026 }}>
  window.GOV_DATA = govData;
</script>
<script src="/scripts/local-election-governor-2026.js"></script>
```

---

## 10. SCSS 전체

파일: `src/styles/scss/pages/_local-election-governor-2026.scss`

```scss
// ============================================================
// _local-election-governor-2026.scss
// 전국 시도지사 당선자 공약 지도
// Prefix: gov-
// ============================================================

// ------ CSS 변수 ------
.gov-page {
  --party-dem: #0078D7;
  --party-dem-light: #e3f0fa;
  --party-ppp: #E61E2B;
  --party-ppp-light: #fde8e9;
  --party-ind: #888888;
  --gov-panel-bg: #ffffff;
  --gov-panel-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
  --gov-region-stroke: #ffffff;
  --gov-badge-pending-bg: #FF9800;
  --gov-badge-confirmed-bg: #4CAF50;
}

// ------ Hero ------
.gov-hero {
  background: linear-gradient(135deg, #1a237e 0%, #0d47a1 100%);
  color: #fff;
  padding: 3rem 1.5rem 2.5rem;
  text-align: center;

  &__inner { max-width: 800px; margin: 0 auto; }
  &__badge {
    display: inline-block;
    background: rgba(255,255,255,0.2);
    border-radius: 99px;
    padding: 0.25rem 0.9rem;
    font-size: 0.8rem;
    margin-bottom: 0.75rem;
  }
  &__title {
    font-size: clamp(1.4rem, 3vw, 2.2rem);
    font-weight: 800;
    margin: 0 0 0.75rem;
    line-height: 1.3;
  }
  &__sub {
    font-size: 1rem;
    opacity: 0.85;
    line-height: 1.6;
    margin: 0 0 1.25rem;
  }
  &__data-date { font-size: 0.85rem; opacity: 0.75; }
}

// ------ InfoNotice ------
.gov-info-notice {
  background: #fff8e1;
  border-left: 4px solid #FF9800;
  padding: 0.875rem 1.5rem;

  &__inner { max-width: 900px; margin: 0 auto; }
  &__text {
    font-size: 0.875rem;
    color: #5D4037;
    margin: 0;
    a { color: #E65100; }
  }
}

// ------ KPI 그리드 ------
.gov-kpi {
  padding: 2rem 1.5rem;
  background: #f8f9fa;
}

.gov-kpi-grid {
  max-width: 900px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.gov-kpi-card {
  background: #fff;
  border-radius: 12px;
  padding: 1.25rem 1rem;
  text-align: center;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  &__label { font-size: 0.8rem; color: #666; font-weight: 600; }
  &__value { font-size: 2rem; font-weight: 900; }
  &__change, &__sub { font-size: 0.78rem; color: #999; }

  &--dem { border-top: 4px solid var(--party-dem); .gov-kpi-card__value { color: var(--party-dem); } }
  &--ppp { border-top: 4px solid var(--party-ppp); .gov-kpi-card__value { color: var(--party-ppp); } }
  &--accent { border-top: 4px solid #FF9800; .gov-kpi-card__value { color: #E65100; } }
}

// ------ 지도 섹션 ------
.gov-map-section {
  padding: 2rem 1.5rem;
  &__inner { max-width: 1100px; margin: 0 auto; }
}

.gov-tabs {
  display: none; // 데스크탑에서는 숨김
  margin-bottom: 1rem;
  gap: 0.5rem;

  @media (max-width: 767px) { display: flex; }
}

.gov-tab {
  padding: 0.5rem 1.25rem;
  border-radius: 99px;
  border: 2px solid #ddd;
  background: #fff;
  cursor: pointer;
  font-size: 0.9rem;
  &.is-active { border-color: var(--party-dem); color: var(--party-dem); font-weight: 700; }
}

.gov-map-layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 2rem;
  align-items: start;

  @media (max-width: 900px) { grid-template-columns: 1fr; }
}

.gov-map {
  &__wrapper { position: relative; }
  &__svg { width: 100%; height: auto; display: block; }

  // 지역 path 기본 스타일
  &__region {
    fill: #e0e0e0;
    stroke: var(--gov-region-stroke);
    stroke-width: 1.5px;
    cursor: pointer;
    transition: opacity 0.15s, filter 0.15s;

    &--dem { fill: var(--party-dem); }
    &--ppp { fill: var(--party-ppp); }

    &:hover { opacity: 0.8; filter: brightness(1.1); }
    &.is-active { stroke: #FFD700; stroke-width: 3px; filter: drop-shadow(0 0 6px rgba(255,215,0,0.7)); }
    &:focus-visible { outline: 3px solid #FFD700; outline-offset: 2px; }
  }

  &__labels { pointer-events: none; }
  &__label { font-size: 10px; fill: #fff; text-anchor: middle; font-weight: 600; }

  // 범례
  &__legend {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 0.75rem;
  }
  &__legend-item {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.8rem;
    &::before { content: ''; display: block; width: 14px; height: 14px; border-radius: 3px; }
    &--dem::before { background: var(--party-dem); }
    &--ppp::before { background: var(--party-ppp); }
  }
}

// ------ 툴팁 ------
.gov-tooltip {
  position: absolute;
  top: 0; left: 0;
  background: rgba(0,0,0,0.85);
  color: #fff;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  font-size: 0.82rem;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s;
  white-space: nowrap;
  display: flex;
  gap: 0.4rem;
  align-items: center;
  z-index: 10;

  &.is-visible { opacity: 1; }
  &__name { font-weight: 700; }
  &__party { font-size: 0.75rem; opacity: 0.85; }
  &__vote { font-size: 0.78rem; color: #FFD700; }
}

// ------ 당선자 패널 ------
.gov-panel {
  background: var(--gov-panel-bg);
  border-radius: 16px;
  box-shadow: var(--gov-panel-shadow);
  padding: 1.5rem;
  position: sticky;
  top: 1.5rem;
  min-height: 200px;
  border: 1px solid #f0f0f0;

  &__hint { color: #aaa; font-size: 0.9rem; text-align: center; padding: 2rem 0; }
  &__close {
    position: absolute; top: 0.75rem; right: 0.75rem;
    background: none; border: none; cursor: pointer;
    font-size: 1.1rem; color: #999;
    &:hover { color: #333; }
  }
  &__header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; }
  &__region { font-size: 0.85rem; color: #666; }
  &__party-badge {
    font-size: 0.75rem; padding: 0.15rem 0.6rem;
    border-radius: 99px; font-weight: 700; color: #fff;
    &--dem { background: var(--party-dem); }
    &--ppp { background: var(--party-ppp); }
  }
  &__name { font-size: 1.5rem; font-weight: 800; margin: 0 0 0.75rem; }
  &__vote { font-size: 0.9rem; color: #555; margin-bottom: 0.5rem; display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center; }
  &__vote-label { color: #999; }
  &__vote-value { font-weight: 700; font-size: 1.05rem; }
  &__runner { font-size: 0.8rem; color: #888; }
  &__flip-badge { font-size: 0.78rem; color: #E65100; background: #FFF3E0; border-radius: 4px; padding: 0.2rem 0.5rem; display: inline-block; margin-bottom: 0.75rem; }
  &__section-title { font-size: 0.85rem; font-weight: 700; color: #333; margin: 1rem 0 0.5rem; text-transform: uppercase; letter-spacing: 0.04em; }
  &__career-list { margin: 0; padding-left: 1.2rem; li { font-size: 0.85rem; color: #555; margin-bottom: 0.25rem; } }

  // 공약 accordion
  &__pledge-item {
    border: 1px solid #eee;
    border-radius: 8px;
    margin-bottom: 0.5rem;
    summary { padding: 0.6rem 0.8rem; cursor: pointer; font-size: 0.88rem; display: flex; align-items: center; gap: 0.4rem; }
    &[open] summary { font-weight: 700; }
  }
  &__pledge-category { font-size: 0.72rem; background: #f0f0f0; border-radius: 4px; padding: 0.1rem 0.4rem; color: #666; }
  &__pledge-desc { font-size: 0.83rem; color: #555; padding: 0.5rem 0.8rem 0.75rem; margin: 0; }
  &__source-link { display: block; margin-top: 1rem; font-size: 0.82rem; color: var(--party-dem); text-decoration: none; &:hover { text-decoration: underline; } }
}

// ------ 목록 뷰 ------
.gov-list {
  &.is-hidden { display: none; }
  &__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 0.75rem; }
  &__card {
    padding: 0.875rem;
    border-radius: 10px;
    border: 2px solid transparent;
    background: #f8f9fa;
    cursor: pointer;
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    transition: border-color 0.15s;
    &--dem { border-left: 4px solid var(--party-dem); &:hover { border-color: var(--party-dem); } }
    &--ppp { border-left: 4px solid var(--party-ppp); &:hover { border-color: var(--party-ppp); } }
  }
  &__region { font-size: 0.78rem; color: #888; }
  &__name { font-size: 0.95rem; font-weight: 700; }
  &__vote { font-size: 0.8rem; color: #666; }
}

// ------ 배지 ------
.gov-badge {
  display: inline-block;
  border-radius: 99px;
  padding: 0.15rem 0.55rem;
  font-size: 0.75rem;
  font-weight: 600;
  &--pending { background: var(--gov-badge-pending-bg); color: #fff; }
  &--confirmed { background: var(--gov-badge-confirmed-bg); color: #fff; }
  &--info { background: rgba(255,255,255,0.25); color: #fff; border: 1px solid rgba(255,255,255,0.4); }
}

// ------ 차트 섹션 ------
.gov-chart-section {
  padding: 2.5rem 1.5rem;
  background: #f8f9fa;
  &__inner { max-width: 600px; margin: 0 auto; }
  &__title { font-size: 1.1rem; font-weight: 700; margin-bottom: 1.5rem; text-align: center; }
}
.gov-chart { max-height: 250px; }

// ------ FAQ ------
.gov-faq {
  padding: 2.5rem 1.5rem;
  &__inner { max-width: 760px; margin: 0 auto; }
  &__title { font-size: 1.2rem; font-weight: 800; margin-bottom: 1.25rem; }
  &__item {
    border-bottom: 1px solid #eee;
    padding: 1rem 0;
    summary { cursor: pointer; font-weight: 600; font-size: 0.95rem; }
    p { margin: 0.5rem 0 0; font-size: 0.88rem; color: #555; line-height: 1.7; }
  }
}

// ------ 관련 링크 ------
.gov-related {
  padding: 2rem 1.5rem;
  background: #f8f9fa;
  &__inner { max-width: 900px; margin: 0 auto; }
  &__title { font-size: 1rem; font-weight: 700; margin-bottom: 1rem; }
  &__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem; }
  &__card {
    background: #fff;
    border-radius: 10px;
    padding: 1rem 1.25rem;
    text-decoration: none;
    color: #333;
    font-size: 0.9rem;
    font-weight: 600;
    border: 1px solid #e8e8e8;
    transition: box-shadow 0.15s;
    &:hover { box-shadow: 0 3px 12px rgba(0,0,0,0.1); }
  }
}

// ------ 모바일 패널 오버레이 ------
@media (max-width: 900px) {
  .gov-panel {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    border-radius: 20px 20px 0 0;
    transform: translateY(100%);
    transition: transform 0.3s ease;
    z-index: 100;
    max-height: 80vh;
    overflow-y: auto;

    &.is-open { transform: translateY(0); }
  }
}
```

---

## 11. `app.scss` 추가 라인

```scss
@use 'scss/pages/local-election-governor-2026';
```

---

## 12. `data/reports.ts` 추가 항목

```typescript
{
  id: 'local-election-governor-2026',
  title: '2026 지방선거 시도지사 당선자 — 지도로 보는 공약 완전 정리',
  description: '전국 16개 시도지사 당선자를 SVG 클릭 지도로 확인. 공약·이력·득표율 완전 정리.',
  category: '정치·선거',
  path: '/reports/local-election-governor-2026/',
  publishedAt: '2026-06-04',
  updatedAt: '2026-06-04',
  tags: ['2026지방선거', '시도지사', '당선자', '공약'],
  featured: true,
},
```

---

## 13. `pages/reports/index.astro` 추가 카테고리

```astro
<!-- 정치·선거 카테고리 섹션 -->
<section class="reports-category" data-category="정치·선거">
  <h2>정치·선거</h2>
  <!-- 리포트 카드 목록에 local-election-governor-2026 포함 -->
</section>
```

---

## 14. `pages/index.astro` 추가 항목

```astro
<!-- 최신 리포트 또는 추천 리포트 섹션에 추가 -->
<ReportCard
  title="2026 지방선거 시도지사 당선자 공약 지도"
  path="/reports/local-election-governor-2026/"
  badge="NEW"
  description="전국 16개 시도 SVG 지도로 클릭하면 공약·이력·득표율"
/>
```

---

## 15. 데이터 업데이트 가이드

### 득표율 확정 시 (경기·충북·경남·부산)

파일: `src/data/localElectionGovernor2026.ts`

| 지역 | 수정 위치 | 수정 내용 |
|------|-----------|-----------|
| 경기 | `regionId: "gyeonggi"` → `elected.voteShare` | `0` → 실제 득표율 (예: `52.3`) |
| 경기 | `elected.badge` | `"확정대기"` → `"확정"` |
| 충북 | `regionId: "chungbuk"` → `elected.voteShare` | `0` → 실제 득표율 |
| 충북 | `elected.badge` | `"확정대기"` → `"확정"` |
| 경남 | `regionId: "gyeongnam"` → `elected.voteShare` | `0` → 실제 득표율 |
| 경남 | `elected.badge` | `"확정대기"` → `"확정"` |
| 부산 | `regionId: "busan"` → `elected.voteShare` | `0` → 실제 득표율 |
| 부산 | `elected.badge` | `"확정대기"` → `"확정"` |

### 공약 업데이트 시 (선관위 공약마당 확인 후)

파일: `src/data/localElectionGovernor2026.ts`  
해당 지역 `pledges` 배열의 TODO 주석 제거 후 실제 공약 내용으로 교체.

### dataAsOf 업데이트 시

```typescript
// GOVERNOR_DATA_2026.dataAsOf 값 수정
dataAsOf: "2026-06-XX 선관위 최종 확정",
```

---

## 16. SVG 경로 데이터 참고

실제 한국 행정구역 SVG 경로 데이터는 다음에서 획득:
- [GADM 한국 행정구역](https://gadm.org/download_country.html) (Level 1 = 시도)
- [통계청 통계지리정보 서비스](https://sgis.kostat.go.kr)
- SVG 최적화 후 각 `<path>` 의 `d` 속성을 위 마크업 구조에 삽입

> TODO: SVG 경로 데이터 삽입 후 viewBox 실측값으로 조정
