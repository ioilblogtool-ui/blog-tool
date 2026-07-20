export type SourceConfidence = "HIGH" | "MEDIUM" | "LOW";

export interface SecondaryStake {
  holderName: string;
  ratePercent: number;
}

export interface GroupCompany {
  id: string;
  name: string;
  stockCode?: string;
  listed: boolean;
  market?: "KOSPI" | "KOSDAQ";
  sector: "NON_FINANCIAL" | "FINANCIAL";
  role: "OWNER_FAMILY" | "CORE_COMPANY" | "AFFILIATE";
  /** OwnershipTree 렌더링용 — 가장 비중이 큰 상위 지분(주 연결선)만 지정. 최상위 노드는 null. */
  primaryParentId: string | null;
  primaryRatePercent: number | null;
  /** 다른 계열사가 보유한 보조 지분 — 트리에는 선으로 안 그리고 노드 하단 텍스트로만 표기 */
  secondaryStakes?: SecondaryStake[];
  /** 순환출자처럼 트리로 표현 못 하는 역방향 연결을 짧은 설명으로 남길 때 사용 */
  circularNote?: string;
}

export interface OwnershipFact {
  label: string;
  ratePercent: number;
  baseDate: string;
  sourceLabel: string;
  sourceUrl: string;
  confidence: SourceConfidence;
}

export interface ListedAffiliateRow {
  name: string;
  stockCode: string;
  market: "KOSPI" | "KOSDAQ";
  sector: "NON_FINANCIAL" | "FINANCIAL";
  stockCodeConfidence: SourceConfidence;
}

export interface GroupOwnershipMeta {
  groupId: string;
  groupName: string;
  isLegalHoldingCompany: boolean;
  holdingCompanyNote: string;
  affiliateCount: number;
  affiliateCountBaseDate: string;
  affiliateCountConfidence: SourceConfidence;
  listedAffiliateCount: number;
  fairTradeRank: number;
  updatedAt: string;
  dataSourceNotice: string;
}

export interface GroupOwnershipFaqItem {
  question: string;
  answer: string;
}
