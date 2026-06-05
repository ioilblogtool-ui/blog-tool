// ============================================================
// localElectionWinnersAssets2026.ts
// 2026 시도지사 당선자 재산 공개 비교 리포트
// 기준: 선관위 재산공개 자료 (확인 후 업데이트 필요)
// TODO: 선관위 재산공개 확정 후 각 당선자 금액 업데이트
// ============================================================

export type WinnerAssetBadge = "공개" | "확인중";

export interface WinnerAsset {
  regionId: string;
  regionNameKo: string;
  name: string;
  party: "더불어민주당" | "국민의힘";
  position: string;           // "서울시장" | "경기도지사" 등
  totalAsset: number;          // 만원 단위, 0이면 미공개
  realEstate: number;
  deposit: number;
  stock: number;
  debt: number;
  includesSpouse: boolean;
  assetChangeYoY?: number;     // 전년 대비 변화액 (만원)
  declarationDate: string;     // 재산신고 기준일
  badge: WinnerAssetBadge;
  sourceUrl: string;
  noteText?: string;
}

export interface WinnersAssetsReportMeta {
  seoTitle: string;
  seoDescription: string;
  h1: string;
  eyebrow: string;
  declarationBasis: string;
  updatedAt: string;
  caution: string;
}

export interface WinnersKpiCard {
  label: string;
  value: string;
  sub: string;
  tone: "neutral" | "accent" | "warn" | "muted";
}

export interface WinnersFaqItem {
  q: string;
  a: string;
}

export interface WinnersRelatedLink {
  label: string;
  href: string;
  description: string;
}

// ── 유틸 함수 ────────────────────────────────────────────────
export function fmtManwon(v: number): string {
  if (!v) return "확인중";
  if (v >= 10000) {
    const eok = v / 10000;
    return `${eok.toLocaleString("ko-KR", { maximumFractionDigits: 1 })}억`;
  }
  return `${v.toLocaleString("ko-KR")}만원`;
}

export function fmtManwonOrDash(v: number): string {
  if (!v) return "—";
  return fmtManwon(v);
}

// ── 당선자 재산 데이터 ────────────────────────────────────────
// TODO: 선관위 재산공개 확정 자료에서 금액 업데이트 필요
// 오세훈 서울시장: 보도 기준 약 72.9억 (seoulMayorCandidateAssets2026 참고)
const NEC_URL = "https://info.nec.go.kr/";

export const WINNERS_ASSETS: WinnerAsset[] = [
  {
    // TODO: 선관위 당선자 재산공개 확정 후 세부항목 업데이트
    regionId: "seoul",
    regionNameKo: "서울",
    name: "오세훈",
    party: "국민의힘",
    position: "서울시장",
    totalAsset: 728960, // 보도확인값 약 72.9억 (후보 등록 기준)
    realEstate: 0,
    deposit: 0,
    stock: 0,
    debt: 0,
    includesSpouse: true,
    declarationDate: "2026-06-03",
    badge: "확인중",
    sourceUrl: NEC_URL,
    noteText: "보도 기준 총재산 약 72.9억. 부동산·예금 세부항목은 선관위 원문 확인 필요.",
  },
  {
    // TODO: 선관위 당선자 재산공개 확정 후 업데이트
    regionId: "busan",
    regionNameKo: "부산",
    name: "전재수",
    party: "더불어민주당",
    position: "부산시장",
    totalAsset: 0,
    realEstate: 0,
    deposit: 0,
    stock: 0,
    debt: 0,
    includesSpouse: true,
    declarationDate: "2026-06-03",
    badge: "확인중",
    sourceUrl: NEC_URL,
    noteText: "선관위 재산공개 자료 확인 후 업데이트 예정.",
  },
  {
    // TODO: 선관위 당선자 재산공개 확정 후 업데이트
    regionId: "daegu",
    regionNameKo: "대구",
    name: "추경호",
    party: "국민의힘",
    position: "대구시장",
    totalAsset: 0,
    realEstate: 0,
    deposit: 0,
    stock: 0,
    debt: 0,
    includesSpouse: true,
    declarationDate: "2026-06-03",
    badge: "확인중",
    sourceUrl: NEC_URL,
    noteText: "선관위 재산공개 자료 확인 후 업데이트 예정.",
  },
  {
    // TODO: 선관위 당선자 재산공개 확정 후 업데이트
    regionId: "incheon",
    regionNameKo: "인천",
    name: "박찬대",
    party: "더불어민주당",
    position: "인천시장",
    totalAsset: 0,
    realEstate: 0,
    deposit: 0,
    stock: 0,
    debt: 0,
    includesSpouse: true,
    declarationDate: "2026-06-03",
    badge: "확인중",
    sourceUrl: NEC_URL,
    noteText: "선관위 재산공개 자료 확인 후 업데이트 예정.",
  },
  {
    // TODO: 선관위 당선자 재산공개 확정 후 업데이트
    // 광주·전남 통합특별시 (2026.07.01 출범)
    regionId: "gwangju-jeonnam",
    regionNameKo: "광주·전남",
    name: "민형배",
    party: "더불어민주당",
    position: "광주전남특별시장",
    totalAsset: 0,
    realEstate: 0,
    deposit: 0,
    stock: 0,
    debt: 0,
    includesSpouse: true,
    declarationDate: "2026-06-03",
    badge: "확인중",
    sourceUrl: NEC_URL,
    noteText: "광주·전남 통합특별시 초대 시장. 선관위 재산공개 자료 확인 후 업데이트 예정.",
  },
  {
    // TODO: 선관위 당선자 재산공개 확정 후 업데이트
    regionId: "daejeon",
    regionNameKo: "대전",
    name: "허태정",
    party: "더불어민주당",
    position: "대전시장",
    totalAsset: 0,
    realEstate: 0,
    deposit: 0,
    stock: 0,
    debt: 0,
    includesSpouse: true,
    declarationDate: "2026-06-03",
    badge: "확인중",
    sourceUrl: NEC_URL,
    noteText: "선관위 재산공개 자료 확인 후 업데이트 예정.",
  },
  {
    // TODO: 선관위 당선자 재산공개 확정 후 업데이트
    regionId: "ulsan",
    regionNameKo: "울산",
    name: "김상욱",
    party: "더불어민주당",
    position: "울산시장",
    totalAsset: 0,
    realEstate: 0,
    deposit: 0,
    stock: 0,
    debt: 0,
    includesSpouse: true,
    declarationDate: "2026-06-03",
    badge: "확인중",
    sourceUrl: NEC_URL,
    noteText: "선관위 재산공개 자료 확인 후 업데이트 예정.",
  },
  {
    // TODO: 선관위 당선자 재산공개 확정 후 업데이트
    regionId: "sejong",
    regionNameKo: "세종",
    name: "조상호",
    party: "더불어민주당",
    position: "세종시장",
    totalAsset: 0,
    realEstate: 0,
    deposit: 0,
    stock: 0,
    debt: 0,
    includesSpouse: true,
    declarationDate: "2026-06-03",
    badge: "확인중",
    sourceUrl: NEC_URL,
    noteText: "선관위 재산공개 자료 확인 후 업데이트 예정.",
  },
  {
    // TODO: 선관위 당선자 재산공개 확정 후 업데이트
    // 추미애 경기도지사: 보도 기준 약 22.8억 (gyeonggiGovernorCandidateAssets2026 참고)
    regionId: "gyeonggi",
    regionNameKo: "경기",
    name: "추미애",
    party: "더불어민주당",
    position: "경기도지사",
    totalAsset: 0,
    realEstate: 0,
    deposit: 0,
    stock: 0,
    debt: 0,
    includesSpouse: true,
    declarationDate: "2026-06-03",
    badge: "확인중",
    sourceUrl: NEC_URL,
    noteText: "선관위 재산공개 자료 확인 후 업데이트 예정.",
  },
  {
    // TODO: 선관위 당선자 재산공개 확정 후 업데이트
    regionId: "gangwon",
    regionNameKo: "강원",
    name: "우상호",
    party: "더불어민주당",
    position: "강원도지사",
    totalAsset: 0,
    realEstate: 0,
    deposit: 0,
    stock: 0,
    debt: 0,
    includesSpouse: true,
    declarationDate: "2026-06-03",
    badge: "확인중",
    sourceUrl: NEC_URL,
    noteText: "선관위 재산공개 자료 확인 후 업데이트 예정.",
  },
  {
    // TODO: 선관위 당선자 재산공개 확정 후 업데이트
    regionId: "chungbuk",
    regionNameKo: "충북",
    name: "신용한",
    party: "더불어민주당",
    position: "충북도지사",
    totalAsset: 0,
    realEstate: 0,
    deposit: 0,
    stock: 0,
    debt: 0,
    includesSpouse: true,
    declarationDate: "2026-06-03",
    badge: "확인중",
    sourceUrl: NEC_URL,
    noteText: "선관위 재산공개 자료 확인 후 업데이트 예정.",
  },
  {
    // TODO: 선관위 당선자 재산공개 확정 후 업데이트
    regionId: "chungnam",
    regionNameKo: "충남",
    name: "박수현",
    party: "더불어민주당",
    position: "충남도지사",
    totalAsset: 0,
    realEstate: 0,
    deposit: 0,
    stock: 0,
    debt: 0,
    includesSpouse: true,
    declarationDate: "2026-06-03",
    badge: "확인중",
    sourceUrl: NEC_URL,
    noteText: "선관위 재산공개 자료 확인 후 업데이트 예정.",
  },
  {
    // TODO: 선관위 당선자 재산공개 확정 후 업데이트
    regionId: "jeonbuk",
    regionNameKo: "전북",
    name: "이원택",
    party: "더불어민주당",
    position: "전북도지사",
    totalAsset: 0,
    realEstate: 0,
    deposit: 0,
    stock: 0,
    debt: 0,
    includesSpouse: true,
    declarationDate: "2026-06-03",
    badge: "확인중",
    sourceUrl: NEC_URL,
    noteText: "선관위 재산공개 자료 확인 후 업데이트 예정.",
  },
  {
    // TODO: 선관위 당선자 재산공개 확정 후 업데이트
    regionId: "gyeongbuk",
    regionNameKo: "경북",
    name: "이철우",
    party: "국민의힘",
    position: "경북도지사",
    totalAsset: 0,
    realEstate: 0,
    deposit: 0,
    stock: 0,
    debt: 0,
    includesSpouse: true,
    declarationDate: "2026-06-03",
    badge: "확인중",
    sourceUrl: NEC_URL,
    noteText: "선관위 재산공개 자료 확인 후 업데이트 예정.",
  },
  {
    // TODO: 선관위 당선자 재산공개 확정 후 업데이트
    regionId: "gyeongnam",
    regionNameKo: "경남",
    name: "박완수",
    party: "국민의힘",
    position: "경남도지사",
    totalAsset: 0,
    realEstate: 0,
    deposit: 0,
    stock: 0,
    debt: 0,
    includesSpouse: true,
    declarationDate: "2026-06-03",
    badge: "확인중",
    sourceUrl: NEC_URL,
    noteText: "선관위 재산공개 자료 확인 후 업데이트 예정.",
  },
  {
    // TODO: 선관위 당선자 재산공개 확정 후 업데이트
    regionId: "jeju",
    regionNameKo: "제주",
    name: "위성곤",
    party: "더불어민주당",
    position: "제주도지사",
    totalAsset: 0,
    realEstate: 0,
    deposit: 0,
    stock: 0,
    debt: 0,
    includesSpouse: true,
    declarationDate: "2026-06-03",
    badge: "확인중",
    sourceUrl: NEC_URL,
    noteText: "선관위 재산공개 자료 확인 후 업데이트 예정.",
  },
];

// ── FAQ ──────────────────────────────────────────────────────
export const WINNERS_ASSETS_FAQ: WinnersFaqItem[] = [
  {
    q: "재산신고액은 어디서 확인하나요?",
    a: "중앙선거관리위원회 선거통계시스템(info.nec.go.kr)에서 당선자별 재산 공개 자료를 확인할 수 있습니다. 당선 후 공직자 재산공개는 정부공직자윤리위원회를 통해서도 확인됩니다.",
  },
  {
    q: "배우자 재산은 포함인가요?",
    a: "공직선거 후보자 재산 신고에는 후보자 본인 외 배우자와 직계존비속의 재산이 포함됩니다. 이 페이지의 신고재산은 배우자 포함 기준입니다.",
  },
  {
    q: "공직자 재산공개 시기는 언제인가요?",
    a: "당선자는 취임 후 공직자 재산공개 의무가 적용됩니다. 정기 공개는 매년 3월 말 관보 및 공보에 게재되며, 취임 후 최초 신고는 취임일로부터 1개월 이내입니다.",
  },
  {
    q: "부동산 신고액이 현재 시세인가요?",
    a: "아닙니다. 부동산 신고액은 공개자료의 신고 기준 금액이며 실제 현재 시세, 실거래가, 호가와 다를 수 있습니다.",
  },
  {
    q: "재산이 0으로 표시된 당선자는 재산이 없는 건가요?",
    a: "아닙니다. 현재 선관위 재산공개 자료 확인 중으로, 확인이 완료되면 업데이트됩니다. '확인중' 배지가 표시된 항목은 공식 수치로 대체될 예정입니다.",
  },
  {
    q: "채무가 있으면 어떻게 봐야 하나요?",
    a: "총재산만 보지 말고 채무를 함께 확인해야 합니다. 순자산(총재산 - 채무)이 실질적인 재산 규모를 더 잘 반영합니다.",
  },
];

// ── 관련 링크 ────────────────────────────────────────────────
export const WINNERS_ASSETS_RELATED_LINKS: WinnersRelatedLink[] = [
  {
    label: "2026 지방선거 시도지사 당선자 지도",
    href: "/reports/local-election-governor-2026/",
    description: "시도지사 당선자 전체 결과를 지도로 한눈에 확인합니다.",
  },
  {
    label: "서울시장 후보 재산 비교",
    href: "/reports/seoul-mayor-candidate-assets-2026/",
    description: "오세훈·정원오 서울시장 후보 재산 신고액을 상세 비교합니다.",
  },
  {
    label: "광역단체장 후보 재산 비교",
    href: "/reports/governor-mayor-candidate-assets-comparison-2026/",
    description: "전국 시도지사 후보 재산을 지역별로 비교합니다.",
  },
  {
    label: "2026 지방선거 후보 재산 순위 TOP 50",
    href: "/reports/local-election-candidate-assets-ranking-2026/",
    description: "지방선거 후보 재산 순위 상위 50명을 한눈에 비교합니다.",
  },
];

// ── 리포트 메타 ──────────────────────────────────────────────
export const WINNERS_ASSETS_META: WinnersAssetsReportMeta = {
  seoTitle: "2026 시도지사 당선자 재산 공개 — 오세훈·추미애·전재수 등 16명 완전 비교 | 비교계산소",
  seoDescription:
    "오세훈 서울시장, 추미애 경기지사, 전재수 부산시장 등 2026 지방선거 시도지사 당선자 16명의 재산 공개 내역을 한눈에 비교합니다.",
  h1: "2026 시도지사 당선자 재산 공개 완전 비교",
  eyebrow: "선거 데이터 리포트",
  declarationBasis: "선관위 후보자 재산신고 공개 자료 기준",
  updatedAt: "2026.06.05",
  caution:
    "이 페이지는 선관위 재산공개 자료를 바탕으로 당선자 16명의 재산을 정리한 참고 리포트입니다. 현재 일부 당선자의 세부 자료는 확인 중이며, 확인 완료 시 업데이트됩니다. 재산 신고액은 실제 시세와 다를 수 있습니다.",
};
