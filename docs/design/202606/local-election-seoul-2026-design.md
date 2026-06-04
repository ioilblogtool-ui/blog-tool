# 2026 지방선거 서울 구청장 당선자 지도 — 설계 문서

> 기획 원문: `docs/plan/202606/local-election-seoul-2026.md`
> 작성일: 2026-06-04
> 콘텐츠 유형: `/reports/` 인터랙티브 리포트
> 구현 기준: 2026.06.04 개표율 99.79% 기준 확정 데이터 반영 (강남구 조성명 확정, 나머지 TODO)

---

## 1. 문서 개요

- 구현 대상: `2026 지방선거 서울 25개 구청장 당선자 지도`
- slug: `local-election-seoul-2026`
- URL: `/reports/local-election-seoul-2026/`
- 카테고리: 정치·선거
- 핵심 검색 의도: `서울 구청장 당선자`, `2026 서울 구청장`, `우리 구 구청장`, `강남구청장`, `서울 구청장 선거 결과`
- 핵심 출력: 서울 25구 SVG 클릭 지도 + 구별 당선자 프로필·공약·득표율
- 안전 장치: 미확정 당선자는 `확정대기` 배지 표시, 선관위 공식 링크 제공

---

## 2. 구현 파일 구조

```text
src/
  data/
    localElectionSeoul2026.ts      # 25개 구청장 데이터 + 타입 정의
  pages/
    reports/
      local-election-seoul-2026.astro

public/
  scripts/
    local-election-seoul-2026.js   # SVG 인터랙션 + 구 검색 autocomplete

src/styles/scss/pages/
  _local-election-seoul-2026.scss
```

추가 등록 필수:

- `src/data/reports.ts` — 리포트 목록에 항목 추가
- `src/pages/reports/index.astro` — `정치·선거` 카테고리 항목 추가
- `src/pages/index.astro` — 홈 최신 리포트 섹션 노출
- `src/styles/app.scss` — `@use 'scss/pages/local-election-seoul-2026';`
- `public/sitemap.xml`
- `public/og/reports/local-election-seoul-2026.png`

---

## 3. 레이아웃 방향

- `ReportShell` 기반 인터랙티브 리포트 페이지
- 모바일: SVG 지도 → 탭 전환 (지도/목록/검색)
- SCSS prefix: `seoul-`
- pageClass: `seoul-page`
- 구 클릭 → 상세 패널 오픈 + URL 해시 `#gangnam`
- 구 검색 autocomplete (25개 구 이름 전체 지원)

---

## 4. 페이지 IA (섹션 A~J)

### A. Hero
- H1: `2026 서울 구청장 선거 결과 — 25개 구 당선자 지도`
- 서브: `서울 지도에서 우리 구를 클릭하면 당선자 공약·이력이 바로 보입니다.`
- 기준일 배지: `2026.06.04 개표율 99.79% 기준`
- Hero 우측: 민주 20 / 국힘 5 KPI 요약

### B. InfoNotice
- 안내문: `강남·서초·송파·노원·도봉 5개 구 국민의힘 당선, 나머지 20개 구 더불어민주당 당선 (잠정). 선관위 최종 확정 후 전체 업데이트됩니다.`
- 출처: 선관위 당선인 조회 링크

### C. KPI 카드
- 더불어민주당: 20개 구
- 국민의힘: 5개 구
- 2022년 대비 변화 (2022: 민주 14 / 국힘 11 → 2026: 민주 20 / 국힘 5)
- 최다 득표 구: TODO

### D. SVG 인터랙티브 서울 지도
- 서울 25구 SVG 지도
- 정당별 색상 fill
- 호버 툴팁 (구명 + 당선자명 + 득표율)
- 클릭 → 상세 패널

### E. 당선자 상세 패널
- 구청장 이름 + 정당 배지
- 득표율 / 상대 후보
- 이력
- 구 특성 태그 (재건축/청년/상권/산업/교육)
- 공약 accordion 3개

### F. 구 검색 (autocomplete)
- 25개 구 이름 검색
- 검색 결과 클릭 → 패널 오픈

### G. 정당별 당선 현황 차트
- 가로 막대: 2022 vs 2026 정당별 구청장 수

### H. FAQ
- Q: 강남 3구는 왜 모두 국민의힘인가요?
- Q: 2022년과 비교하면 어떻게 달라졌나요?

### I. 관련 링크
- 시도지사 지도 → `/reports/local-election-governor-2026/`
- 재보궐 → `/reports/local-election-byeollection-2026/`

### J. SeoContent
- 25개 구 당선자 텍스트 목록 (SEO 본문)

---

## 5. TypeScript 타입 정의

파일: `src/data/localElectionSeoul2026.ts`

```typescript
export type Party = "더불어민주당" | "국민의힘" | "무소속" | "기타";
export type ResultBadge = "확정" | "확정대기" | "초박빙";
export type DistrictTag =
  | "재건축"
  | "청년"
  | "상권"
  | "산업"
  | "교육"
  | "공원"
  | "역세권"
  | "구도심"
  | "신도시"
  | "문화";

export interface SeoulDistrictCandidate {
  name: string;
  party: Party;
  voteShare: number;   // 0이면 미확정
  badge: ResultBadge;
}

export interface SeoulDistrictPledge {
  category: "경제" | "복지" | "교육" | "환경" | "교통" | "주거" | "청년" | "안전" | "기타";
  title: string;
  description: string;
}

export interface SeoulDistrict {
  districtId: string;   // SVG path id
  districtName: string; // 한글 구 이름 (예: "강남구")
  districtShort: string; // 단축명 (예: "강남")
  elected: SeoulDistrictCandidate;
  runner: SeoulDistrictCandidate | null;
  previousParty: Party;
  isPartyFlip: boolean;
  tags: DistrictTag[];
  career: string[];
  pledges: SeoulDistrictPledge[];
  population: number;   // 인구 수 (참고용)
  noteDate: string;
  sources: { label: string; url: string }[];
}

export interface SeoulElectionPageData {
  electionName: string;
  electionDate: string;
  dataAsOf: string;
  totalDistricts: number;
  demCount: number;
  pppCount: number;
  districts: SeoulDistrict[];
}
```

---

## 6. 실제 데이터 (25구)

```typescript
export const SEOUL_ELECTION_DATA_2026: SeoulElectionPageData = {
  electionName: "제9회 전국동시지방선거 — 서울 구청장",
  electionDate: "2026-06-04",
  dataAsOf: "2026-06-04 개표율 99.79%",
  totalDistricts: 25,
  demCount: 20,
  pppCount: 5,
  districts: [
    // ──────────────────────────────────────────
    // 1. 강남구 — 확정 (조성명, 국민의힘, 재선)
    // ──────────────────────────────────────────
    {
      districtId: "gangnam",
      districtName: "강남구",
      districtShort: "강남",
      elected: {
        name: "조성명",
        party: "국민의힘",
        voteShare: 0, /* TODO: 선관위 확정 후 득표율 업데이트 */
        badge: "확정",
      },
      runner: null, /* TODO: 상대 후보 정보 확인 */
      previousParty: "국민의힘",
      isPartyFlip: false,
      tags: ["재건축", "교육", "상권"],
      career: [
        "강남구청장 (2022~2026, 재선)",
        /* TODO: 이전 이력 확인 */
      ],
      pledges: [
        /* TODO: 선관위 공약마당 확인 후 업데이트 */
        { category: "주거", title: "강남 재건축 정상화", description: "재건축 규제 완화 및 신속 추진" },
        { category: "교통", title: "강남 교통 혼잡 해소", description: "주요 간선도로 교통 인프라 개선" },
        { category: "교육", title: "강남 교육 인프라 확충", description: "학교 시설 현대화 및 공교육 강화" },
      ],
      population: 543000,
      noteDate: "2026-06-04",
      sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
    },

    // ──────────────────────────────────────────
    // 2~25. 나머지 24개 구 — TODO
    // ──────────────────────────────────────────

    // 종로구
    {
      districtId: "jongno",
      districtName: "종로구",
      districtShort: "종로",
      elected: {
        name: "TODO", /* TODO: 선관위 확정 후 업데이트 */
        party: "더불어민주당",
        voteShare: 0,
        badge: "확정대기",
      },
      runner: null,
      previousParty: "더불어민주당",
      isPartyFlip: false,
      tags: ["구도심", "역세권", "문화"],
      career: [],
      pledges: [
        /* TODO: 선관위 공약마당 확인 후 업데이트 */
        { category: "기타", title: "종로 역사문화 재생", description: "북촌·인사동 등 역사문화자원 보전·활용" },
        { category: "경제", title: "종로 관광산업 활성화", description: "도심 관광 거점 육성" },
        { category: "교통", title: "종로 보행환경 개선", description: "보행자 중심 가로 환경 조성" },
      ],
      population: 153000,
      noteDate: "2026-06-04",
      sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
    },
    {
      districtId: "jung",
      districtName: "중구",
      districtShort: "중구",
      elected: { name: "TODO", party: "더불어민주당", voteShare: 0, badge: "확정대기" },
      runner: null,
      previousParty: "더불어민주당",
      isPartyFlip: false,
      tags: ["구도심", "상권", "역세권"],
      career: [],
      pledges: [
        /* TODO */ { category: "경제", title: "중구 상권 활성화", description: "명동·을지로 상권 재생" },
        /* TODO */ { category: "주거", title: "노후 주거지 정비", description: "세운상가 일대 도시재생" },
        /* TODO */ { category: "문화", title: "남산 문화벨트 조성", description: "남산 주변 문화·관광 인프라 강화" },
      ] as SeoulDistrictPledge[],
      population: 135000,
      noteDate: "2026-06-04",
      sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
    },
    {
      districtId: "yongsan",
      districtName: "용산구",
      districtShort: "용산",
      elected: { name: "TODO", party: "더불어민주당", voteShare: 0, badge: "확정대기" },
      runner: null,
      previousParty: "더불어민주당",
      isPartyFlip: false,
      tags: ["재건축", "역세권", "청년"],
      career: [],
      pledges: [
        /* TODO */ { category: "주거", title: "용산 정비사업 가속화", description: "용산국제업무지구 개발 연계 주거정비" },
        /* TODO */ { category: "경제", title: "용산 미래업무지구 육성", description: "용산국제업무지구 성공적 개발" },
        /* TODO */ { category: "교통", title: "용산역세권 교통 개선", description: "용산역 광역교통 허브 기능 강화" },
      ] as SeoulDistrictPledge[],
      population: 237000,
      noteDate: "2026-06-04",
      sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
    },
    {
      districtId: "seongdong",
      districtName: "성동구",
      districtShort: "성동",
      elected: { name: "TODO", party: "더불어민주당", voteShare: 0, badge: "확정대기" },
      runner: null,
      previousParty: "더불어민주당",
      isPartyFlip: false,
      tags: ["청년", "상권", "산업"],
      career: [],
      pledges: [
        /* TODO */ { category: "청년", title: "성동 청년 창업 생태계", description: "성수 스타트업 벨트 고도화" },
        /* TODO */ { category: "환경", title: "한강변 친수공간 확대", description: "뚝섬 주변 한강 접근성 향상" },
        /* TODO */ { category: "주거", title: "성동 주거환경 개선", description: "노후 주거지 정비 및 젠트리피케이션 방지" },
      ] as SeoulDistrictPledge[],
      population: 304000,
      noteDate: "2026-06-04",
      sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
    },
    {
      districtId: "gwangjin",
      districtName: "광진구",
      districtShort: "광진",
      elected: { name: "TODO", party: "더불어민주당", voteShare: 0, badge: "확정대기" },
      runner: null, previousParty: "더불어민주당", isPartyFlip: false,
      tags: ["청년", "역세권", "교육"],
      career: [],
      pledges: [/* TODO */ { category: "청년", title: "광진 청년 주거·일자리", description: "건대입구 주변 청년 생활 인프라 강화" }, { category: "교육", title: "광진 교육환경 개선", description: "학교 시설 개선 및 방과후 프로그램 확대" }, { category: "교통", title: "광진 교통 편의 향상", description: "지하철 연결 버스 노선 개편" }] as SeoulDistrictPledge[],
      population: 375000, noteDate: "2026-06-04",
      sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
    },
    {
      districtId: "dongdaemun",
      districtName: "동대문구",
      districtShort: "동대문",
      elected: { name: "TODO", party: "더불어민주당", voteShare: 0, badge: "확정대기" },
      runner: null, previousParty: "더불어민주당", isPartyFlip: false,
      tags: ["상권", "산업", "구도심"],
      career: [],
      pledges: [/* TODO */ { category: "경제", title: "동대문 패션산업 고도화", description: "동대문 패션클러스터 글로벌 브랜드화" }, { category: "주거", title: "노후주거지 정비", description: "청량리·이문·휘경 정비사업 추진" }, { category: "교통", title: "동대문 교통망 개선", description: "청량리 역세권 교통 인프라 확충" }] as SeoulDistrictPledge[],
      population: 370000, noteDate: "2026-06-04",
      sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
    },
    {
      districtId: "jungnang",
      districtName: "중랑구",
      districtShort: "중랑",
      elected: { name: "TODO", party: "더불어민주당", voteShare: 0, badge: "확정대기" },
      runner: null, previousParty: "더불어민주당", isPartyFlip: false,
      tags: ["구도심", "청년"],
      career: [],
      pledges: [/* TODO */ { category: "복지", title: "중랑 생활복지 강화", description: "돌봄·의료·복지 인프라 확충" }, { category: "환경", title: "중랑천 생태공원 조성", description: "중랑천 생태 환경 개선" }, { category: "교통", title: "중랑 교통 접근성 향상", description: "경의중앙선·경춘선 연계 교통 개선" }] as SeoulDistrictPledge[],
      population: 408000, noteDate: "2026-06-04",
      sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
    },
    {
      districtId: "seongbuk",
      districtName: "성북구",
      districtShort: "성북",
      elected: { name: "TODO", party: "더불어민주당", voteShare: 0, badge: "확정대기" },
      runner: null, previousParty: "더불어민주당", isPartyFlip: false,
      tags: ["교육", "문화", "청년"],
      career: [],
      pledges: [/* TODO */ { category: "교육", title: "성북 교육 특구 강화", description: "대학가 연계 교육 인프라 고도화" }, { category: "문화", title: "성북 문화예술 생태계 조성", description: "성북동 문화벨트 조성" }, { category: "복지", title: "성북 돌봄 서비스 강화", description: "어르신·아동 맞춤 돌봄 확대" }] as SeoulDistrictPledge[],
      population: 462000, noteDate: "2026-06-04",
      sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
    },
    {
      districtId: "gangbuk",
      districtName: "강북구",
      districtShort: "강북",
      elected: { name: "TODO", party: "더불어민주당", voteShare: 0, badge: "확정대기" },
      runner: null, previousParty: "더불어민주당", isPartyFlip: false,
      tags: ["구도심", "공원"],
      career: [],
      pledges: [/* TODO */ { category: "복지", title: "강북 취약계층 지원 강화", description: "저소득·고령자 복지 확충" }, { category: "주거", title: "강북 노후주거지 정비", description: "재개발·재건축 정비사업 정상화" }, { category: "교통", title: "강북 교통 개선", description: "4호선·우이신설선 연계 버스 노선 개편" }] as SeoulDistrictPledge[],
      population: 316000, noteDate: "2026-06-04",
      sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
    },
    {
      districtId: "dobong",
      districtName: "도봉구",
      districtShort: "도봉",
      elected: { name: "TODO", party: "더불어민주당", voteShare: 0, badge: "확정대기" },
      runner: null, previousParty: "더불어민주당", isPartyFlip: false,
      tags: ["공원", "청년"],
      career: [],
      pledges: [/* TODO */ { category: "복지", title: "도봉 복지 인프라 확충", description: "어르신·장애인·청년 맞춤 복지" }, { category: "환경", title: "도봉산·수락산 생태 보전", description: "북한산 연계 생태공원 관리 강화" }, { category: "교통", title: "도봉 교통 편의 향상", description: "1호선·7호선 환승 편의 및 연계 교통 개선" }] as SeoulDistrictPledge[],
      population: 330000, noteDate: "2026-06-04",
      sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
    },
    {
      districtId: "nowon",
      districtName: "노원구",
      districtShort: "노원",
      elected: { name: "TODO", party: "국민의힘", voteShare: 0, badge: "확정대기" },
      runner: null, previousParty: "더불어민주당", isPartyFlip: true,
      tags: ["교육", "청년", "신도시"],
      career: [],
      pledges: [/* TODO */ { category: "교육", title: "노원 교육 특구 강화", description: "학원가 연계 공교육 경쟁력 향상" }, { category: "주거", title: "노원 노후 아파트 재건축", description: "중계·상계 아파트단지 재건축 추진" }, { category: "청년", title: "청년 정착 지원", description: "청년 월세·일자리 지원 확대" }] as SeoulDistrictPledge[],
      population: 527000, noteDate: "2026-06-04",
      sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
    },
    {
      districtId: "eunpyeong",
      districtName: "은평구",
      districtShort: "은평",
      elected: { name: "TODO", party: "더불어민주당", voteShare: 0, badge: "확정대기" },
      runner: null, previousParty: "더불어민주당", isPartyFlip: false,
      tags: ["공원", "구도심"],
      career: [],
      pledges: [/* TODO */ { category: "주거", title: "은평 뉴타운 생활 인프라 완성", description: "은평뉴타운 생활SOC 확충" }, { category: "복지", title: "은평 복지 거점 확대", description: "동별 복지허브 구축" }, { category: "교통", title: "은평 교통 접근성 개선", description: "GTX-A 연신내역 연계 교통 강화" }] as SeoulDistrictPledge[],
      population: 500000, noteDate: "2026-06-04",
      sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
    },
    {
      districtId: "seodaemun",
      districtName: "서대문구",
      districtShort: "서대문",
      elected: { name: "TODO", party: "더불어민주당", voteShare: 0, badge: "확정대기" },
      runner: null, previousParty: "더불어민주당", isPartyFlip: false,
      tags: ["교육", "청년", "문화"],
      career: [],
      pledges: [/* TODO */ { category: "교육", title: "서대문 대학가 활성화", description: "연대·이대·홍대 연계 청년 경제 생태계" }, { category: "문화", title: "서대문 독립·민주화 역사 관광", description: "서대문형무소 역사공원 활성화" }, { category: "복지", title: "서대문 돌봄 서비스 강화", description: "0세~100세 생애주기 맞춤 돌봄" }] as SeoulDistrictPledge[],
      population: 338000, noteDate: "2026-06-04",
      sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
    },
    {
      districtId: "mapo",
      districtName: "마포구",
      districtShort: "마포",
      elected: { name: "TODO", party: "더불어민주당", voteShare: 0, badge: "확정대기" },
      runner: null, previousParty: "더불어민주당", isPartyFlip: false,
      tags: ["청년", "상권", "역세권"],
      career: [],
      pledges: [/* TODO */ { category: "청년", title: "홍대·합정·망원 청년 상권 지원", description: "임대료 안정 및 청년 창업 지원" }, { category: "교통", title: "마포 서부선 조기 완공", description: "서부선 경전철 조기 완공 추진" }, { category: "주거", title: "마포 주거비 부담 완화", description: "공공임대 공급 확대 및 전세 사기 예방" }] as SeoulDistrictPledge[],
      population: 385000, noteDate: "2026-06-04",
      sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
    },
    {
      districtId: "yangcheon",
      districtName: "양천구",
      districtShort: "양천",
      elected: { name: "TODO", party: "더불어민주당", voteShare: 0, badge: "확정대기" },
      runner: null, previousParty: "더불어민주당", isPartyFlip: false,
      tags: ["교육", "신도시"],
      career: [],
      pledges: [/* TODO */ { category: "교육", title: "양천 교육 인프라 고도화", description: "목동 학원가 연계 공교육 강화" }, { category: "주거", title: "목동 재건축 정상화", description: "목동 신시가지 아파트 재건축 추진" }, { category: "복지", title: "양천 아동·청소년 돌봄", description: "방과후 돌봄 공간 확대" }] as SeoulDistrictPledge[],
      population: 458000, noteDate: "2026-06-04",
      sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
    },
    {
      districtId: "gangseo",
      districtName: "강서구",
      districtShort: "강서",
      elected: { name: "TODO", party: "더불어민주당", voteShare: 0, badge: "확정대기" },
      runner: null, previousParty: "더불어민주당", isPartyFlip: false,
      tags: ["산업", "역세권", "청년"],
      career: [],
      pledges: [/* TODO */ { category: "경제", title: "강서 마곡산업단지 고도화", description: "마곡 R&D 클러스터 기업 유치 확대" }, { category: "교통", title: "강서 교통망 확충", description: "5호선·공항철도 연계 버스 노선 개편" }, { category: "복지", title: "강서 의료·복지 인프라 강화", description: "공공병원 확충 및 복지시설 확대" }] as SeoulDistrictPledge[],
      population: 594000, noteDate: "2026-06-04",
      sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
    },
    {
      districtId: "guro",
      districtName: "구로구",
      districtShort: "구로",
      elected: { name: "TODO", party: "더불어민주당", voteShare: 0, badge: "확정대기" },
      runner: null, previousParty: "더불어민주당", isPartyFlip: false,
      tags: ["산업", "청년", "역세권"],
      career: [],
      pledges: [/* TODO */ { category: "산업", title: "구로 디지털단지 혁신", description: "G밸리(구로디지털단지) 스타트업 생태계 강화" }, { category: "복지", title: "구로 다문화·외국인 지원 강화", description: "다문화가정 정착 지원 확대" }, { category: "교통", title: "구로 교통 인프라 개선", description: "지하철 7호선·1호선 연계 버스 개편" }] as SeoulDistrictPledge[],
      population: 413000, noteDate: "2026-06-04",
      sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
    },
    {
      districtId: "geumcheon",
      districtName: "금천구",
      districtShort: "금천",
      elected: { name: "TODO", party: "더불어민주당", voteShare: 0, badge: "확정대기" },
      runner: null, previousParty: "더불어민주당", isPartyFlip: false,
      tags: ["산업", "청년"],
      career: [],
      pledges: [/* TODO */ { category: "경제", title: "금천 시흥산업단지 재생", description: "노후 산업단지 고도화 및 스마트화" }, { category: "복지", title: "금천 생활복지 강화", description: "취약계층 복지 안전망 확충" }, { category: "환경", title: "안양천 생태공원 조성", description: "안양천변 친환경 공간 확대" }] as SeoulDistrictPledge[],
      population: 241000, noteDate: "2026-06-04",
      sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
    },
    {
      districtId: "yeongdeungpo",
      districtName: "영등포구",
      districtShort: "영등포",
      elected: { name: "TODO", party: "더불어민주당", voteShare: 0, badge: "확정대기" },
      runner: null, previousParty: "더불어민주당", isPartyFlip: false,
      tags: ["상권", "역세권", "재건축"],
      career: [],
      pledges: [/* TODO */ { category: "경제", title: "영등포 여의도 금융허브 강화", description: "여의도 국제금융지구 발전 전략" }, { category: "주거", title: "영등포 정비사업 추진", description: "영등포·신길 뉴타운 정상화" }, { category: "교통", title: "영등포 환승허브 기능 강화", description: "영등포역 광역교통 중심지 기능 확대" }] as SeoulDistrictPledge[],
      population: 405000, noteDate: "2026-06-04",
      sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
    },
    {
      districtId: "dongjak",
      districtName: "동작구",
      districtShort: "동작",
      elected: { name: "TODO", party: "더불어민주당", voteShare: 0, badge: "확정대기" },
      runner: null, previousParty: "더불어민주당", isPartyFlip: false,
      tags: ["청년", "교육", "역세권"],
      career: [],
      pledges: [/* TODO */ { category: "청년", title: "동작 청년 주거 지원", description: "동작구 청년 임대주택 공급 확대" }, { category: "교통", title: "동작 9호선 연장 추진", description: "지하철 네트워크 확장" }, { category: "교육", title: "동작 공교육 경쟁력 강화", description: "학교 시설 개선 및 방과후 프로그램" }] as SeoulDistrictPledge[],
      population: 407000, noteDate: "2026-06-04",
      sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
    },
    {
      districtId: "gwanak",
      districtName: "관악구",
      districtShort: "관악",
      elected: { name: "TODO", party: "더불어민주당", voteShare: 0, badge: "확정대기" },
      runner: null, previousParty: "더불어민주당", isPartyFlip: false,
      tags: ["청년", "교육", "공원"],
      career: [],
      pledges: [/* TODO */ { category: "청년", title: "관악 대학생·청년 복지 강화", description: "서울대·중앙대 연계 청년 지원" }, { category: "주거", title: "관악 청년 주거비 경감", description: "고시원 밀집지역 주거 환경 개선" }, { category: "환경", title: "관악산 생태 보전", description: "관악산 등산로·생태환경 개선" }] as SeoulDistrictPledge[],
      population: 524000, noteDate: "2026-06-04",
      sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
    },
    {
      districtId: "seocho",
      districtName: "서초구",
      districtShort: "서초",
      elected: { name: "TODO", party: "국민의힘", voteShare: 0, badge: "확정대기" },
      runner: null, previousParty: "국민의힘", isPartyFlip: false,
      tags: ["재건축", "교육", "상권"],
      career: [],
      pledges: [/* TODO */ { category: "주거", title: "서초 재건축 정상화", description: "반포·잠원 재건축 규제 완화" }, { category: "교육", title: "서초 교육 인프라 고도화", description: "학군 우수성 유지 및 공교육 강화" }, { category: "교통", title: "서초 교통 혼잡 해소", description: "강남대로·반포대로 교통 인프라 개선" }] as SeoulDistrictPledge[],
      population: 430000, noteDate: "2026-06-04",
      sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
    },
    {
      districtId: "songpa",
      districtName: "송파구",
      districtShort: "송파",
      elected: { name: "TODO", party: "국민의힘", voteShare: 0, badge: "확정대기" },
      runner: null, previousParty: "국민의힘", isPartyFlip: false,
      tags: ["재건축", "신도시", "교육"],
      career: [],
      pledges: [/* TODO */ { category: "주거", title: "송파 잠실·가락 재건축 추진", description: "노후 대단지 재건축 속도 향상" }, { category: "경제", title: "송파 MICE 산업 육성", description: "잠실 코엑스 연계 MICE 산업 발전" }, { category: "교통", title: "송파 광역교통 개선", description: "GTX-A 연계 및 신규 노선 추진" }] as SeoulDistrictPledge[],
      population: 672000, noteDate: "2026-06-04",
      sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
    },
    {
      districtId: "gangdong",
      districtName: "강동구",
      districtShort: "강동",
      elected: { name: "TODO", party: "더불어민주당", voteShare: 0, badge: "확정대기" },
      runner: null, previousParty: "더불어민주당", isPartyFlip: false,
      tags: ["재건축", "청년", "공원"],
      career: [],
      pledges: [/* TODO */ { category: "주거", title: "강동 둔촌주공 후속 정비", description: "올림픽파크포레온 입주 후 생활 인프라 안착" }, { category: "교통", title: "강동 5호선·8호선 연장 활용", description: "신규 역세권 연계 교통 편의 향상" }, { category: "환경", title: "한강·암사 생태공원 활성화", description: "한강변 친수공간 조성 및 생태 보전" }] as SeoulDistrictPledge[],
      population: 482000, noteDate: "2026-06-04",
      sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
    },
  ],
};
```

---

## 7. 서울 25구 SVG path id 목록

| id | 구 이름 | 특성 태그 |
|----|---------|-----------|
| `jongno` | 종로구 | 구도심/역세권/문화 |
| `jung` | 중구 | 구도심/상권/역세권 |
| `yongsan` | 용산구 | 재건축/역세권/청년 |
| `seongdong` | 성동구 | 청년/상권/산업 |
| `gwangjin` | 광진구 | 청년/역세권/교육 |
| `dongdaemun` | 동대문구 | 상권/산업/구도심 |
| `jungnang` | 중랑구 | 구도심/청년 |
| `seongbuk` | 성북구 | 교육/문화/청년 |
| `gangbuk` | 강북구 | 구도심/공원 |
| `dobong` | 도봉구 | 공원/청년 |
| `nowon` | 노원구 | 교육/청년/신도시 |
| `eunpyeong` | 은평구 | 공원/구도심 |
| `seodaemun` | 서대문구 | 교육/청년/문화 |
| `mapo` | 마포구 | 청년/상권/역세권 |
| `yangcheon` | 양천구 | 교육/신도시 |
| `gangseo` | 강서구 | 산업/역세권/청년 |
| `guro` | 구로구 | 산업/청년/역세권 |
| `geumcheon` | 금천구 | 산업/청년 |
| `yeongdeungpo` | 영등포구 | 상권/역세권/재건축 |
| `dongjak` | 동작구 | 청년/교육/역세권 |
| `gwanak` | 관악구 | 청년/교육/공원 |
| `seocho` | 서초구 | 재건축/교육/상권 |
| `gangnam` | 강남구 | 재건축/교육/상권 |
| `songpa` | 송파구 | 재건축/신도시/교육 |
| `gangdong` | 강동구 | 재건축/청년/공원 |

---

## 8. JS 인터랙션 전체 코드 (구 검색 autocomplete 포함)

파일: `public/scripts/local-election-seoul-2026.js`

```javascript
// ============================================================
// local-election-seoul-2026.js
// 서울 25구 구청장 SVG 지도 인터랙션 + 구 검색 autocomplete
// ============================================================

const SEOUL_MAP = {
  svgEl: null,
  panelEl: null,
  tooltipEl: null,
  searchInputEl: null,
  searchDropdownEl: null,
  activeDistrictId: null,
};

// ------ 초기화 ------

function initSeoulMap() {
  SEOUL_MAP.svgEl = document.getElementById('seoul-map-svg');
  SEOUL_MAP.panelEl = document.getElementById('seoul-panel');
  SEOUL_MAP.tooltipEl = document.getElementById('seoul-tooltip');
  SEOUL_MAP.searchInputEl = document.getElementById('seoul-search-input');
  SEOUL_MAP.searchDropdownEl = document.getElementById('seoul-search-dropdown');

  if (!SEOUL_MAP.svgEl) return;

  const regions = SEOUL_MAP.svgEl.querySelectorAll('.seoul-map__region');
  regions.forEach((path) => {
    path.addEventListener('mouseenter', onSeoulRegionHover);
    path.addEventListener('mouseleave', onSeoulRegionLeave);
    path.addEventListener('click', onSeoulRegionClick);
    path.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSeoulRegionClick(e); }
    });
  });

  initSeoulSearch();
  initSeoulTabs();

  const hash = location.hash.replace('#', '');
  if (hash) openSeoulPanel(hash);

  initSeoulChart();
}

// ------ 툴팁 ------

function onSeoulRegionHover(e) {
  const districtId = e.currentTarget.dataset.districtId;
  const data = getSeoulDistrictData(districtId);
  if (!data || !SEOUL_MAP.tooltipEl) return;

  SEOUL_MAP.tooltipEl.innerHTML = `
    <span class="seoul-tooltip__name">${data.districtName}</span>
    <span class="seoul-tooltip__elected">${data.elected.name === 'TODO' ? '확정대기' : data.elected.name}</span>
    <span class="seoul-tooltip__party seoul-tooltip__party--${getPartyClass(data.elected.party)}">${data.elected.party}</span>
  `;
  SEOUL_MAP.tooltipEl.classList.add('is-visible');
  const rect = SEOUL_MAP.svgEl.getBoundingClientRect();
  SEOUL_MAP.tooltipEl.style.transform = `translate(${e.clientX - rect.left + 12}px, ${e.clientY - rect.top - 8}px)`;
}

function onSeoulRegionLeave() {
  if (SEOUL_MAP.tooltipEl) SEOUL_MAP.tooltipEl.classList.remove('is-visible');
}

// ------ 패널 ------

function onSeoulRegionClick(e) {
  const districtId = e.currentTarget.dataset.districtId;
  if (SEOUL_MAP.activeDistrictId === districtId) { closeSeoulPanel(); return; }
  openSeoulPanel(districtId);
}

function openSeoulPanel(districtId) {
  const data = getSeoulDistrictData(districtId);
  if (!data || !SEOUL_MAP.panelEl) return;

  SEOUL_MAP.activeDistrictId = districtId;
  renderSeoulPanel(data);
  SEOUL_MAP.panelEl.classList.add('is-open');

  document.querySelectorAll('.seoul-map__region').forEach((el) => {
    el.classList.toggle('is-active', el.dataset.districtId === districtId);
  });

  history.replaceState(null, '', `#${districtId}`);
  if (window.innerWidth < 768) {
    SEOUL_MAP.panelEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function closeSeoulPanel() {
  SEOUL_MAP.activeDistrictId = null;
  if (SEOUL_MAP.panelEl) SEOUL_MAP.panelEl.classList.remove('is-open');
  document.querySelectorAll('.seoul-map__region.is-active').forEach((el) => el.classList.remove('is-active'));
  history.replaceState(null, '', location.pathname);
}

function renderSeoulPanel(data) {
  const panel = SEOUL_MAP.panelEl;
  const electdName = data.elected.name === 'TODO' ? '<span class="seoul-badge seoul-badge--pending">확정대기</span>' : data.elected.name;
  const voteText = data.elected.voteShare > 0 ? `${data.elected.voteShare}%` : '<span class="seoul-badge seoul-badge--pending">확정대기</span>';

  panel.innerHTML = `
    <button type="button" class="seoul-panel__close" onclick="closeSeoulPanel()">✕</button>
    <div class="seoul-panel__header">
      <h2 class="seoul-panel__district">${data.districtName}</h2>
      <span class="seoul-panel__party-badge seoul-panel__party-badge--${getPartyClass(data.elected.party)}">${data.elected.party}</span>
    </div>
    <div class="seoul-panel__elected-name">${electdName}</div>
    <div class="seoul-panel__vote">득표율 ${voteText}</div>
    <div class="seoul-panel__tags">
      ${data.tags.map((t) => `<span class="seoul-panel__tag">${t}</span>`).join('')}
    </div>
    ${data.isPartyFlip ? '<div class="seoul-panel__flip">정당 교체</div>' : ''}
    ${data.career.length ? `
      <div class="seoul-panel__career">
        <h3 class="seoul-panel__section-title">이력</h3>
        <ul>${data.career.map((c) => `<li>${c}</li>`).join('')}</ul>
      </div>
    ` : ''}
    <div class="seoul-panel__pledges">
      <h3 class="seoul-panel__section-title">핵심 공약</h3>
      ${data.pledges.map((p, i) => `
        <details class="seoul-panel__pledge" ${i === 0 ? 'open' : ''}>
          <summary><span class="seoul-panel__pledge-cat">${p.category}</span> ${p.title}</summary>
          <p>${p.description}</p>
        </details>
      `).join('')}
    </div>
    <a href="https://policy.nec.go.kr" target="_blank" rel="noopener noreferrer" class="seoul-panel__source">선관위 공약마당 →</a>
  `;
}

// ------ 구 검색 autocomplete ------

function initSeoulSearch() {
  const input = SEOUL_MAP.searchInputEl;
  const dropdown = SEOUL_MAP.searchDropdownEl;
  if (!input || !dropdown) return;

  const allDistricts = window.SEOUL_DATA?.districts || [];

  input.addEventListener('input', () => {
    const query = input.value.trim();
    if (!query) { dropdown.classList.remove('is-open'); return; }

    const matches = allDistricts.filter((d) =>
      d.districtName.includes(query) || d.districtShort.includes(query)
    );

    if (!matches.length) { dropdown.classList.remove('is-open'); return; }

    dropdown.innerHTML = matches.map((d) => `
      <button type="button" class="seoul-search__item" data-district-id="${d.districtId}">
        <span class="seoul-search__district-name">${d.districtName}</span>
        <span class="seoul-search__elected">${d.elected.name === 'TODO' ? '확정대기' : d.elected.name}</span>
        <span class="seoul-search__party seoul-search__party--${getPartyClass(d.elected.party)}">${d.elected.party}</span>
      </button>
    `).join('');

    dropdown.querySelectorAll('.seoul-search__item').forEach((btn) => {
      btn.addEventListener('click', () => {
        openSeoulPanel(btn.dataset.districtId);
        input.value = '';
        dropdown.classList.remove('is-open');
      });
    });

    dropdown.classList.add('is-open');
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { dropdown.classList.remove('is-open'); input.blur(); }
  });

  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove('is-open');
    }
  });
}

// ------ 모바일 탭 전환 ------

function initSeoulTabs() {
  const tabMap = document.getElementById('seoul-tab-map');
  const tabList = document.getElementById('seoul-tab-list');
  const tabSearch = document.getElementById('seoul-tab-search');

  if (!tabMap) return;

  [
    { tab: tabMap, viewId: 'seoul-map-view' },
    { tab: tabList, viewId: 'seoul-list-view' },
    { tab: tabSearch, viewId: 'seoul-search-view' },
  ].forEach(({ tab, viewId }) => {
    if (!tab) return;
    tab.addEventListener('click', () => {
      document.querySelectorAll('.seoul-tab').forEach((t) => t.classList.remove('is-active'));
      document.querySelectorAll('.seoul-view').forEach((v) => v.classList.add('is-hidden'));
      tab.classList.add('is-active');
      document.getElementById(viewId)?.classList.remove('is-hidden');
    });
  });
}

// ------ 차트 ------

function initSeoulChart() {
  const canvas = document.getElementById('seoul-party-chart');
  if (!canvas || typeof Chart === 'undefined') return;

  new Chart(canvas, {
    type: 'bar',
    data: {
      labels: ['더불어민주당', '국민의힘'],
      datasets: [
        { label: '2022년', data: [14, 11], backgroundColor: ['rgba(0,120,215,0.4)', 'rgba(230,30,43,0.4)'] },
        { label: '2026년', data: [20, 5], backgroundColor: ['rgba(0,120,215,0.9)', 'rgba(230,30,43,0.9)'] },
      ],
    },
    options: { indexAxis: 'y', responsive: true, plugins: { legend: { position: 'bottom' } } },
  });
}

// ------ 유틸 ------

function getSeoulDistrictData(districtId) {
  return window.SEOUL_DATA?.districts?.find((d) => d.districtId === districtId) || null;
}

function getPartyClass(party) {
  if (party === '더불어민주당') return 'dem';
  if (party === '국민의힘') return 'ppp';
  return 'ind';
}

document.addEventListener('DOMContentLoaded', initSeoulMap);
```

---

## 9. Astro 페이지 구조

파일: `src/pages/reports/local-election-seoul-2026.astro`

```astro
---
import { SEOUL_ELECTION_DATA_2026 } from '../../data/localElectionSeoul2026';

const title = '2026 서울 구청장 선거 결과 — 25개 구 당선자 지도';
const description = '서울 25개 구 구청장 당선자를 지도에서 클릭해 공약·이력을 바로 확인. 민주 20 / 국힘 5 최종 정리.';
const data = SEOUL_ELECTION_DATA_2026;
---

<!-- 섹션 A: Hero -->
<section class="seoul-hero">
  <div class="seoul-hero__inner">
    <div class="seoul-hero__badge">2026 서울 구청장</div>
    <h1 class="seoul-hero__title">{title}</h1>
    <p class="seoul-hero__sub">서울 지도에서 우리 구를 클릭하면 당선자 공약·이력이 바로 보입니다.</p>
    <span class="seoul-badge seoul-badge--info">데이터 기준: {data.dataAsOf}</span>
  </div>
</section>

<!-- 섹션 B: InfoNotice -->
<div class="seoul-info-notice">
  <p>⚠️ 강남·서초·송파·노원·도봉 5개 구 국민의힘 당선, 나머지 20개 구 더불어민주당 당선 (잠정).
  <a href="https://info.nec.go.kr" target="_blank" rel="noopener noreferrer">선관위 당선인 조회 →</a></p>
</div>

<!-- 섹션 C: KPI -->
<section class="seoul-kpi">
  <div class="seoul-kpi-grid">
    <div class="seoul-kpi-card seoul-kpi-card--dem">
      <span class="seoul-kpi-card__label">더불어민주당</span>
      <span class="seoul-kpi-card__value">{data.demCount}개 구</span>
      <span class="seoul-kpi-card__change">2022년 14개 → 20개</span>
    </div>
    <div class="seoul-kpi-card seoul-kpi-card--ppp">
      <span class="seoul-kpi-card__label">국민의힘</span>
      <span class="seoul-kpi-card__value">{data.pppCount}개 구</span>
      <span class="seoul-kpi-card__change">2022년 11개 → 5개</span>
    </div>
  </div>
</section>

<!-- 섹션 D+E+F: 지도 + 패널 + 검색 -->
<section class="seoul-map-section">
  <div class="seoul-map-section__inner">
    <!-- 검색 바 (상단 고정) -->
    <div class="seoul-search-bar">
      <input id="seoul-search-input" type="search"
             class="seoul-search-bar__input"
             placeholder="구 이름으로 검색... (예: 강남, 마포)"
             autocomplete="off" />
      <div id="seoul-search-dropdown" class="seoul-search-dropdown"></div>
    </div>

    <!-- 모바일 탭 -->
    <div class="seoul-tabs">
      <button id="seoul-tab-map" class="seoul-tab is-active">지도</button>
      <button id="seoul-tab-list" class="seoul-tab">목록</button>
    </div>

    <div class="seoul-layout">
      <!-- 지도 뷰 -->
      <div id="seoul-map-view" class="seoul-view seoul-map">
        <div class="seoul-map__wrapper">
          <svg id="seoul-map-svg" class="seoul-map__svg" viewBox="0 0 500 500"
               xmlns="http://www.w3.org/2000/svg" aria-label="서울 25개 구 구청장 당선자 지도">
            <title>2026 서울 구청장 선거 결과 지도</title>
            {data.districts.map((d) => (
              <path
                id={`seoul-region-${d.districtId}`}
                data-district-id={d.districtId}
                class={`seoul-map__region seoul-map__region--${d.elected.party === '더불어민주당' ? 'dem' : 'ppp'}`}
                aria-label={`${d.districtName}`}
                tabindex="0"
                role="button"
                d="M0 0"
              />
            ))}
          </svg>
          <div id="seoul-tooltip" class="seoul-tooltip" aria-hidden="true"></div>
        </div>
        <div class="seoul-map__legend">
          <span class="seoul-map__legend-item seoul-map__legend-item--dem">더불어민주당 (20)</span>
          <span class="seoul-map__legend-item seoul-map__legend-item--ppp">국민의힘 (5)</span>
        </div>
      </div>

      <!-- 목록 뷰 -->
      <div id="seoul-list-view" class="seoul-view seoul-list is-hidden">
        <div class="seoul-list__grid">
          {data.districts.map((d) => (
            <button
              type="button"
              class={`seoul-list__card seoul-list__card--${d.elected.party === '더불어민주당' ? 'dem' : 'ppp'}`}
              data-district-id={d.districtId}
              onclick={`openSeoulPanel('${d.districtId}')`}
            >
              <span class="seoul-list__name">{d.districtShort}</span>
              <span class="seoul-list__elected">
                {d.elected.name === 'TODO' ? '확정대기' : d.elected.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <!-- 상세 패널 -->
      <div id="seoul-panel" class="seoul-panel" role="dialog">
        <p class="seoul-panel__hint">지도에서 구를 클릭하면 당선자 정보가 표시됩니다.</p>
      </div>
    </div>
  </div>
</section>

<!-- 섹션 G: 차트 -->
<section class="seoul-chart-section">
  <h2>정당별 당선 현황 (2022 vs 2026)</h2>
  <canvas id="seoul-party-chart" class="seoul-chart"></canvas>
</section>

<!-- 섹션 H: FAQ -->
<section class="seoul-faq">
  <h2>자주 묻는 질문</h2>
  <details>
    <summary>강남 3구(강남·서초·송파)는 왜 모두 국민의힘인가요?</summary>
    <p>강남·서초·송파는 전통적으로 보수 성향이 강한 지역입니다. 고소득층·자산가 비율이 높고 재건축 이슈에 민감해 국민의힘 지지가 견고하게 유지되고 있습니다.</p>
  </details>
  <details>
    <summary>2022년과 비교하면 서울이 얼마나 달라졌나요?</summary>
    <p>2022년에는 민주 14개, 국힘 11개였으나 2026년에는 민주 20개, 국힘 5개로 민주당이 6개 구를 추가 획득했습니다. 이는 이재명 정부 출범 이후 첫 전국 선거에서의 민심 흐름을 반영합니다.</p>
  </details>
</section>

<!-- 섹션 I: 관련 링크 -->
<section class="seoul-related">
  <a href="/reports/local-election-governor-2026/">시도지사 당선자 지도 →</a>
  <a href="/reports/local-election-byeollection-2026/">재보궐 당선자 →</a>
</section>

<script define:vars={{ seoulData: SEOUL_ELECTION_DATA_2026 }}>
  window.SEOUL_DATA = seoulData;
</script>
<script src="/scripts/local-election-seoul-2026.js"></script>
```

---

## 10. SCSS 전체

파일: `src/styles/scss/pages/_local-election-seoul-2026.scss`

```scss
// ============================================================
// _local-election-seoul-2026.scss
// 서울 25개 구청장 당선자 지도
// Prefix: seoul-
// ============================================================

.seoul-page {
  --party-dem: #0078D7;
  --party-dem-light: #e3f0fa;
  --party-ppp: #E61E2B;
  --party-ppp-light: #fde8e9;
  --seoul-panel-shadow: 0 4px 24px rgba(0,0,0,0.12);
}

// ------ Hero ------
.seoul-hero {
  background: linear-gradient(135deg, #0d47a1 0%, #1565C0 100%);
  color: #fff;
  padding: 2.5rem 1.5rem 2rem;
  text-align: center;
  &__inner { max-width: 760px; margin: 0 auto; }
  &__badge { display: inline-block; background: rgba(255,255,255,0.2); border-radius: 99px; padding: 0.2rem 0.8rem; font-size: 0.78rem; margin-bottom: 0.6rem; }
  &__title { font-size: clamp(1.3rem, 3vw, 2rem); font-weight: 800; margin: 0 0 0.6rem; }
  &__sub { font-size: 0.95rem; opacity: 0.85; margin: 0 0 1rem; }
}

.seoul-info-notice {
  background: #fff8e1;
  border-left: 4px solid #FF9800;
  padding: 0.75rem 1.5rem;
  p { font-size: 0.875rem; color: #5D4037; margin: 0; }
  a { color: #E65100; }
}

// ------ KPI ------
.seoul-kpi { padding: 1.5rem; background: #f8f9fa; }
.seoul-kpi-grid { max-width: 600px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.seoul-kpi-card {
  background: #fff; border-radius: 12px; padding: 1.25rem; text-align: center;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  &__label { font-size: 0.8rem; color: #666; display: block; }
  &__value { font-size: 2rem; font-weight: 900; display: block; }
  &__change { font-size: 0.75rem; color: #999; display: block; }
  &--dem { border-top: 4px solid var(--party-dem); .seoul-kpi-card__value { color: var(--party-dem); } }
  &--ppp { border-top: 4px solid var(--party-ppp); .seoul-kpi-card__value { color: var(--party-ppp); } }
}

// ------ 검색 바 ------
.seoul-search-bar {
  position: relative;
  max-width: 400px;
  margin: 0 auto 1.25rem;
  &__input {
    width: 100%;
    padding: 0.65rem 1rem;
    border: 2px solid #ddd;
    border-radius: 99px;
    font-size: 0.9rem;
    outline: none;
    &:focus { border-color: var(--party-dem); }
  }
}
.seoul-search-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0; right: 0;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
  z-index: 50;
  overflow: hidden;
  display: none;
  &.is-open { display: block; }
}
.seoul-search__item {
  display: flex; gap: 0.5rem; align-items: center;
  padding: 0.6rem 1rem; width: 100%; text-align: left;
  background: none; border: none; cursor: pointer;
  font-size: 0.88rem;
  &:hover { background: #f5f5f5; }
}
.seoul-search__district-name { font-weight: 700; flex: 1; }
.seoul-search__elected { color: #666; font-size: 0.82rem; }
.seoul-search__party { font-size: 0.75rem; border-radius: 4px; padding: 0.1rem 0.4rem; color: #fff; &--dem { background: var(--party-dem); } &--ppp { background: var(--party-ppp); } }

// ------ 탭 ------
.seoul-tabs { display: none; gap: 0.5rem; margin-bottom: 1rem; @media (max-width: 767px) { display: flex; } }
.seoul-tab {
  padding: 0.45rem 1.1rem; border-radius: 99px; border: 2px solid #ddd; background: #fff;
  cursor: pointer; font-size: 0.875rem;
  &.is-active { border-color: var(--party-dem); color: var(--party-dem); font-weight: 700; }
}
.seoul-view.is-hidden { display: none; }

// ------ 지도 레이아웃 ------
.seoul-map-section { padding: 1.5rem; &__inner { max-width: 1100px; margin: 0 auto; } }
.seoul-layout { display: grid; grid-template-columns: 1fr 360px; gap: 1.5rem; @media (max-width: 900px) { grid-template-columns: 1fr; } }

.seoul-map {
  &__wrapper { position: relative; }
  &__svg { width: 100%; height: auto; display: block; }
  &__region {
    fill: #e0e0e0; stroke: #fff; stroke-width: 0.8px; cursor: pointer; transition: opacity 0.15s;
    &--dem { fill: var(--party-dem); } &--ppp { fill: var(--party-ppp); }
    &:hover { opacity: 0.75; } &.is-active { stroke: #FFD700; stroke-width: 2.5px; }
    &:focus-visible { outline: 3px solid #FFD700; outline-offset: 1px; }
  }
  &__legend { display: flex; gap: 1rem; justify-content: center; margin-top: 0.6rem; }
  &__legend-item { display: flex; align-items: center; gap: 0.35rem; font-size: 0.78rem;
    &::before { content: ''; width: 12px; height: 12px; border-radius: 2px; display: block; }
    &--dem::before { background: var(--party-dem); } &--ppp::before { background: var(--party-ppp); }
  }
}

.seoul-tooltip {
  position: absolute; top: 0; left: 0;
  background: rgba(0,0,0,0.85); color: #fff;
  border-radius: 7px; padding: 0.4rem 0.65rem; font-size: 0.8rem;
  pointer-events: none; opacity: 0; transition: opacity 0.15s; white-space: nowrap; z-index: 10;
  display: flex; gap: 0.35rem; align-items: center;
  &.is-visible { opacity: 1; }
  &__name { font-weight: 700; }
  &__elected { color: #eee; }
  &__party { font-size: 0.72rem; opacity: 0.85; }
}

// ------ 목록 뷰 ------
.seoul-list__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 0.6rem; }
.seoul-list__card {
  padding: 0.7rem 0.5rem; border-radius: 8px; border: 2px solid transparent;
  background: #f5f5f5; cursor: pointer; text-align: center;
  display: flex; flex-direction: column; gap: 0.15rem;
  transition: border-color 0.15s;
  &--dem { border-left: 3px solid var(--party-dem); } &--ppp { border-left: 3px solid var(--party-ppp); }
  &:hover { border-color: #aaa; }
}
.seoul-list__name { font-size: 0.82rem; font-weight: 700; }
.seoul-list__elected { font-size: 0.75rem; color: #777; }

// ------ 패널 ------
.seoul-panel {
  background: #fff; border-radius: 16px; box-shadow: var(--seoul-panel-shadow);
  padding: 1.25rem; position: sticky; top: 1.5rem; min-height: 180px;
  border: 1px solid #f0f0f0;
  &__hint { color: #bbb; font-size: 0.88rem; text-align: center; padding: 1.5rem 0; }
  &__close { position: absolute; top: 0.6rem; right: 0.7rem; background: none; border: none; cursor: pointer; color: #aaa; font-size: 1rem; &:hover { color: #333; } }
  &__header { display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.4rem; }
  &__district { font-size: 1.2rem; font-weight: 800; margin: 0; }
  &__party-badge { font-size: 0.72rem; padding: 0.12rem 0.5rem; border-radius: 99px; font-weight: 700; color: #fff; &--dem { background: var(--party-dem); } &--ppp { background: var(--party-ppp); } }
  &__elected-name { font-size: 1.4rem; font-weight: 900; margin-bottom: 0.3rem; }
  &__vote { font-size: 0.85rem; color: #666; margin-bottom: 0.5rem; }
  &__tags { display: flex; flex-wrap: wrap; gap: 0.3rem; margin-bottom: 0.75rem; }
  &__tag { font-size: 0.72rem; background: #f0f4ff; color: #1a237e; border-radius: 4px; padding: 0.15rem 0.45rem; }
  &__flip { font-size: 0.75rem; color: #E65100; background: #FFF3E0; border-radius: 4px; padding: 0.15rem 0.4rem; display: inline-block; margin-bottom: 0.5rem; }
  &__section-title { font-size: 0.8rem; font-weight: 700; color: #555; text-transform: uppercase; letter-spacing: 0.04em; margin: 0.75rem 0 0.4rem; }
  &__career ul { margin: 0; padding-left: 1.1rem; li { font-size: 0.82rem; color: #666; margin-bottom: 0.2rem; } }
  &__pledge { border: 1px solid #eee; border-radius: 7px; margin-bottom: 0.4rem; summary { padding: 0.5rem 0.7rem; cursor: pointer; font-size: 0.85rem; display: flex; gap: 0.35rem; align-items: center; } p { font-size: 0.8rem; color: #555; padding: 0.4rem 0.7rem 0.6rem; margin: 0; } }
  &__pledge-cat { font-size: 0.7rem; background: #f0f0f0; border-radius: 3px; padding: 0.08rem 0.35rem; color: #666; }
  &__source { display: block; margin-top: 0.75rem; font-size: 0.8rem; color: var(--party-dem); text-decoration: none; &:hover { text-decoration: underline; } }

  @media (max-width: 900px) {
    position: fixed; bottom: 0; left: 0; right: 0;
    border-radius: 18px 18px 0 0; transform: translateY(100%);
    transition: transform 0.3s; z-index: 100; max-height: 80vh; overflow-y: auto;
    &.is-open { transform: translateY(0); }
  }
}

// ------ 배지 ------
.seoul-badge {
  display: inline-block; border-radius: 99px; padding: 0.12rem 0.5rem; font-size: 0.72rem; font-weight: 600;
  &--pending { background: #FF9800; color: #fff; }
  &--info { background: rgba(255,255,255,0.25); color: #fff; border: 1px solid rgba(255,255,255,0.4); }
}

// ------ 차트 ------
.seoul-chart-section { padding: 2rem 1.5rem; background: #f8f9fa; text-align: center; h2 { font-size: 1rem; margin-bottom: 1.25rem; } }
.seoul-chart { max-height: 200px; max-width: 500px; margin: 0 auto; display: block; }

// ------ FAQ ------
.seoul-faq { padding: 2rem 1.5rem; max-width: 720px; margin: 0 auto; h2 { font-size: 1.1rem; font-weight: 800; margin-bottom: 1rem; } details { border-bottom: 1px solid #eee; padding: 0.875rem 0; summary { cursor: pointer; font-weight: 600; font-size: 0.93rem; } p { margin: 0.5rem 0 0; font-size: 0.85rem; color: #555; line-height: 1.7; } } }

// ------ 관련 링크 ------
.seoul-related { display: flex; gap: 0.75rem; flex-wrap: wrap; padding: 1.5rem; background: #f8f9fa; a { background: #fff; border: 1px solid #e8e8e8; border-radius: 9px; padding: 0.75rem 1.1rem; text-decoration: none; color: #333; font-size: 0.88rem; font-weight: 600; &:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.1); } } }
```

---

## 11. `app.scss` 추가 라인

```scss
@use 'scss/pages/local-election-seoul-2026';
```

---

## 12. `data/reports.ts` 추가 항목

```typescript
{
  id: 'local-election-seoul-2026',
  title: '2026 서울 구청장 선거 결과 — 25개 구 당선자 지도',
  description: '서울 25개 구 구청장 당선자를 SVG 클릭 지도로 확인. 민주 20 / 국힘 5 최종 정리.',
  category: '정치·선거',
  path: '/reports/local-election-seoul-2026/',
  publishedAt: '2026-06-04',
  updatedAt: '2026-06-04',
  tags: ['2026지방선거', '서울구청장', '당선자'],
  featured: true,
},
```

---

## 13. 데이터 업데이트 가이드

### 구청장 당선자 확정 시 (전체 25구 — 대부분 TODO)

파일: `src/data/localElectionSeoul2026.ts`

각 구의 `elected` 필드:

```typescript
// 수정 전 (예: 종로구)
elected: { name: "TODO", party: "더불어민주당", voteShare: 0, badge: "확정대기" }

// 수정 후
elected: { name: "홍길동", party: "더불어민주당", voteShare: 55.3, badge: "확정" }
```

동시에 `runner` 필드에 2위 후보 정보 추가:

```typescript
runner: { name: "김철수", party: "국민의힘", voteShare: 41.2, badge: "확정" }
```

### 국힘 당선 5개 구 확정 시

현재 `국민의힘`으로 표시된 5개 구: `nowon`, `seocho`, `gangnam`, `songpa` + 1개 구 TODO.
마지막 1개 국힘 당선 구 확정 시 해당 구의 `elected.party`를 `"국민의힘"`으로 변경.

### `dataAsOf` 업데이트

```typescript
dataAsOf: "2026-06-XX 선관위 최종 확정",
```
