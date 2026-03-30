export type OfficialsCompareMode = "asset" | "annualComp" | "monthlyComp" | "assetToComp";
export type OfficialsGroup = "presidential-office" | "prime-minister-office" | "cabinet" | "other-core";
export type AssetBreakdownFilter = "all" | "real-estate" | "financial" | "debt";

export type GovernmentOfficialEntry = {
  slug: string;
  personName: string;
  roleTitle: string;
  group: OfficialsGroup;
  totalAssetsManwon: number;
  buildingManwon?: number;
  landManwon?: number;
  jeonseRightManwon?: number;
  depositsManwon?: number;
  securitiesManwon?: number;
  debtsManwon?: number;
  estimatedNetWorthManwon?: number | null;
  financialAssetShareKnown?: number | null;
  annualCompManwon: number;
  monthlyCompManwon: number;
  assetToComp: number;
  hasPartialBreakdown: boolean;
  summary: string;
  memo?: string;
  tags: string[];
  sourceLabel: string;
  sourceUrl: string;
};

export type OfficialsGroupInsight = {
  key: OfficialsGroup;
  title: string;
  body: string;
};

export type LeeGovernmentOfficialsAssetsSalary2026Data = {
  meta: {
    slug: string;
    title: string;
    subtitle: string;
    methodology: string;
    caution: string;
    updatedAt: string;
  };
  entries: GovernmentOfficialEntry[];
  patternPoints: { title: string; body: string }[];
  groupInsights: OfficialsGroupInsight[];
  faq: { q: string; a: string }[];
  referenceLinks: {
    official: { label: string; href: string }[];
    media: { label: string; href: string }[];
  };
};

const annualCompByRole = {
  president: 27177,
  primeMinister: 21069,
  deputyPrimeMinister: 15940,
  minister: 15493,
  viceMinisterLevel: 15046,
} as const;

function monthlyFromAnnual(annualCompManwon: number) {
  return Math.round((annualCompManwon / 12) * 10) / 10;
}

function createEntry(
  entry: Omit<GovernmentOfficialEntry, "monthlyCompManwon" | "assetToComp" | "hasPartialBreakdown" | "estimatedNetWorthManwon" | "financialAssetShareKnown">,
): GovernmentOfficialEntry {
  const knownAssets = [
    entry.buildingManwon,
    entry.landManwon,
    entry.jeonseRightManwon,
    entry.depositsManwon,
    entry.securitiesManwon,
  ].filter((value) => typeof value === "number") as number[];
  const breakdownFields = [...knownAssets, entry.debtsManwon].filter((value) => typeof value === "number");
  const knownGrossAssets = knownAssets.length > 0 ? knownAssets.reduce((sum, value) => sum + value, 0) : null;
  const financialAssets = Number(entry.depositsManwon || 0) + Number(entry.securitiesManwon || 0);

  return {
    ...entry,
    monthlyCompManwon: monthlyFromAnnual(entry.annualCompManwon),
    assetToComp: Math.round((entry.totalAssetsManwon / entry.annualCompManwon) * 10) / 10,
    hasPartialBreakdown: breakdownFields.length > 0,
    estimatedNetWorthManwon: typeof knownGrossAssets === "number" ? knownGrossAssets - Number(entry.debtsManwon || 0) : null,
    financialAssetShareKnown: typeof knownGrossAssets === "number" && knownGrossAssets > 0
      ? Math.round((financialAssets / knownGrossAssets) * 1000) / 10
      : null,
  };
}

const entries: GovernmentOfficialEntry[] = [
  createEntry({ slug: "lee-jaemyung", personName: "이재명", roleTitle: "대통령", group: "presidential-office", totalAssetsManwon: 497721, buildingManwon: 230000, jeonseRightManwon: 4800, depositsManwon: 30641, annualCompManwon: annualCompByRole.president, summary: "공개 재산은 약 49.8억원 수준이며, 기사 요약 기준으로는 부동산과 예금이 함께 확인되는 구조입니다.", memo: "분당 아파트 16억8500만원, 부동산 자산 총 23억원 수준 보도 반영", tags: ["대통령", "공개재산", "부동산", "예금"], sourceLabel: "뉴시스", sourceUrl: "https://www.newsis.com/view/NISX20260325_0003563035?utm_source=chatgpt.com" }),
  createEntry({ slug: "kim-minseok", personName: "김민석", roleTitle: "국무총리", group: "prime-minister-office", totalAssetsManwon: 33090, buildingManwon: 16300, landManwon: 1200, jeonseRightManwon: 40800, depositsManwon: 14844, securitiesManwon: 2774, debtsManwon: 74000, annualCompManwon: annualCompByRole.primeMinister, summary: "총재산 자체는 낮지만 전세권과 채무가 같이 커서 레버리지 구조가 강하게 읽히는 사례입니다.", memo: "배우자 목동 다세대, 오피스텔 전세권, 빌딩 전세권 기사 요약 반영", tags: ["국무총리", "전세권", "채무", "레버리지"], sourceLabel: "연합뉴스", sourceUrl: "https://www.yna.co.kr/view/AKR20260325119900001?utm_source=chatgpt.com" }),
  createEntry({ slug: "kang-hoonsik", personName: "강훈식", roleTitle: "대통령비서실장", group: "presidential-office", totalAssetsManwon: 81780, jeonseRightManwon: 40000, depositsManwon: 34698, securitiesManwon: 2086, debtsManwon: 15000, annualCompManwon: annualCompByRole.minister, summary: "부동산 보유보다 전세권·예금 중심 구조로 읽히며, 기사 기준 채권 보유도 함께 언급된 케이스입니다.", memo: "채권 2억원은 본 비교표 기본 컬럼에서 제외", tags: ["대통령실", "예금", "전세권", "채무"], sourceLabel: "머니투데이", sourceUrl: "https://www.mt.co.kr/politics/2026/03/26/2026032513533119398?utm_source=chatgpt.com" }),
  createEntry({ slug: "kim-yongbeom", personName: "김용범", roleTitle: "정책실장", group: "presidential-office", totalAssetsManwon: 452720, buildingManwon: 15678, depositsManwon: 22923, annualCompManwon: annualCompByRole.minister, summary: "총재산 규모가 큰 편이며 기사 요약 기준으로는 서초동 아파트와 예금 중심으로 정보가 확인됩니다.", memo: "세부 자산 분해값은 2차 원문 보강 권장", tags: ["대통령실", "정책실장", "고자산", "부분공개"], sourceLabel: "머니투데이", sourceUrl: "https://www.mt.co.kr/politics/2026/03/26/2026032513533119398?utm_source=chatgpt.com" }),
  createEntry({ slug: "wee-sunglac", personName: "위성락", roleTitle: "국가안보실장", group: "presidential-office", totalAssetsManwon: 614370, annualCompManwon: annualCompByRole.minister, summary: "총재산만 먼저 확인되는 고자산군으로, 세부 구성은 2차 원문 보강이 필요한 인물입니다.", memo: "기사 요약 단계에서는 총재산 외 세부 항목 미확인", tags: ["대통령실", "국가안보실", "고자산", "원문보강"], sourceLabel: "머니투데이", sourceUrl: "https://www.mt.co.kr/politics/2026/03/26/2026032513533119398?utm_source=chatgpt.com" }),
  createEntry({ slug: "ha-jungwoo", personName: "하정우", roleTitle: "AI미래기획수석", group: "presidential-office", totalAssetsManwon: 425000, depositsManwon: 250000, annualCompManwon: annualCompByRole.viceMinisterLevel, summary: "예금 급증이 핵심 포인트로 보도된 사례이며, 주식 매각 대금이 예금으로 이동한 점이 강조됩니다.", memo: "건물·채무·증권 잔액은 2차 원문 보강 대상", tags: ["대통령실", "AI", "예금중심", "부분공개"], sourceLabel: "연합뉴스", sourceUrl: "https://www.yna.co.kr/view/AKR20260325107000001?utm_source=chatgpt.com" }),
  createEntry({ slug: "han-sungsook", personName: "한성숙", roleTitle: "중소벤처기업부 장관", group: "cabinet", totalAssetsManwon: 2230160, buildingManwon: 97412, landManwon: 67418, depositsManwon: 65019, securitiesManwon: 51362, debtsManwon: 3500, annualCompManwon: annualCompByRole.minister, summary: "1차 공개 대상 중 자산 절대액이 가장 큰 축에 속하며, 부동산·금융자산이 모두 확인되는 대표 사례입니다.", memo: "채권 2억4500만원, 금 1500만원, 가상자산 2029만원은 메모성 참고값", tags: ["장관", "고자산", "토지", "증권"], sourceLabel: "조선비즈", sourceUrl: "https://biz.chosun.com/industry/business-venture/2026/03/26/7PEVDVDPY5HWXHKTQ7UVXRQCRI/?utm_source=chatgpt.com" }),
  createEntry({ slug: "choi-hwiyoung", personName: "최휘영", roleTitle: "문화체육관광부 장관", group: "cabinet", totalAssetsManwon: 1774970, buildingManwon: 56270, landManwon: 15355, depositsManwon: 1120000, securitiesManwon: 30000, annualCompManwon: annualCompByRole.minister, summary: "예금 비중이 매우 크게 읽히는 고자산군으로, 절대 재산 규모와 유동성 자산 비중이 함께 눈에 띕니다.", memo: "예금 112억원대, 증권 3억원 수준 기사 반영", tags: ["장관", "고자산", "예금", "금융자산"], sourceLabel: "연합뉴스", sourceUrl: "https://www.yna.co.kr/view/AKR20260325089000005?utm_source=chatgpt.com" }),
  createEntry({ slug: "kim-junggwan", personName: "김정관", roleTitle: "산업통상자원부 장관", group: "cabinet", totalAssetsManwon: 781020, buildingManwon: 290000, depositsManwon: 327341, securitiesManwon: 159643, annualCompManwon: annualCompByRole.minister, summary: "건물, 예금, 증권이 모두 큰 편이라 실물자산과 금융자산이 균형 있게 큰 구조로 읽힙니다.", memo: "가락동 아파트 29억원, 예금·증권 규모 큰 편", tags: ["장관", "산업부", "증권", "예금"], sourceLabel: "연합뉴스", sourceUrl: "https://www.yna.co.kr/view/AKR20260325157700003?utm_source=chatgpt.com" }),
  createEntry({ slug: "ahn-gyubaek", personName: "안규백", roleTitle: "국방부 장관", group: "cabinet", totalAssetsManwon: 740390, buildingManwon: 71096, jeonseRightManwon: 3000, depositsManwon: 481400, securitiesManwon: 136339, annualCompManwon: annualCompByRole.minister, summary: "예금과 증권이 큰 비중을 차지해 금융자산 중심으로 읽히는 사례이며, 국방부 장관군에서는 상단 자산 규모입니다.", memo: "정치자금 예금계좌 4억3814만원은 메모성 참고값", tags: ["장관", "금융자산", "예금", "증권"], sourceLabel: "조선비즈", sourceUrl: "https://biz.chosun.com/policy/politics/2026/03/26/FMBDKREORFFFTMS6MI2OPX7BIU/?utm_source=chatgpt.com" }),
  createEntry({ slug: "jung-eunkyung", personName: "정은경", roleTitle: "보건복지부 장관", group: "cabinet", totalAssetsManwon: 580950, buildingManwon: 256000, depositsManwon: 90557, securitiesManwon: 11510, annualCompManwon: annualCompByRole.minister, summary: "잠실·세종 아파트 보유와 예금이 함께 확인되며, 실물자산 중심 해석이 가능한 장관급 사례입니다.", memo: "기사 요약 기준 예금 9억원대, 증권 1.15억원", tags: ["장관", "부동산", "예금", "보건복지부"], sourceLabel: "연합뉴스", sourceUrl: "https://www.yna.co.kr/view/AKR20260325126500530?utm_source=chatgpt.com" }),
  createEntry({ slug: "koo-yoonchul", personName: "구윤철", roleTitle: "경제부총리 겸 재정경제부 장관", group: "cabinet", totalAssetsManwon: 518810, buildingManwon: 150000, jeonseRightManwon: 66000, depositsManwon: 309580, securitiesManwon: 400, debtsManwon: 66000, annualCompManwon: annualCompByRole.deputyPrimeMinister, summary: "예금 비중이 큰 편이며 전세권과 동일 규모 채무가 같이 잡혀 있어 자산·부채 구조를 함께 봐야 하는 사례입니다.", memo: "채권 5억5500만원은 본 기본 컬럼에서 제외", tags: ["부총리", "예금", "전세권", "채무"], sourceLabel: "연합뉴스", sourceUrl: "https://www.yna.co.kr/view/AKR20260325128700002?utm_source=chatgpt.com" }),
  createEntry({ slug: "jung-dongyoung", personName: "정동영", roleTitle: "통일부 장관", group: "cabinet", totalAssetsManwon: 258440, buildingManwon: 90757, landManwon: 67113, jeonseRightManwon: 115500, depositsManwon: 37358, debtsManwon: 265717, annualCompManwon: annualCompByRole.minister, summary: "건물·토지·전세권이 모두 보이지만 채무가 더 크게 잡혀 있어 순자산 해석이 특히 중요한 구조입니다.", memo: "평창동 아파트 전세권 11.5억원, 태양광발전소 포함 건물 기사 반영", tags: ["장관", "토지", "전세권", "채무"], sourceLabel: "연합뉴스", sourceUrl: "https://www.yna.co.kr/view/AKR20260325133800504?utm_source=chatgpt.com" }),
  createEntry({ slug: "cho-hyun", personName: "조현", roleTitle: "외교부 장관", group: "cabinet", totalAssetsManwon: 208050, buildingManwon: 139606, depositsManwon: 36609, annualCompManwon: annualCompByRole.minister, summary: "건물 비중이 큰 장관급 사례이며, 기사에서는 사인간 채권도 별도 항목으로 확인됩니다.", memo: "사인간 채권 8억원은 채무가 아니므로 본 기본 비교 컬럼에서 제외", tags: ["장관", "부동산", "외교부", "부분공개"], sourceLabel: "연합뉴스", sourceUrl: "https://www.yna.co.kr/view/AKR20260325133000504?utm_source=chatgpt.com" }),
  createEntry({ slug: "song-miryeong", personName: "송미령", roleTitle: "농림축산식품부 장관", group: "cabinet", totalAssetsManwon: 202320, depositsManwon: 42029, securitiesManwon: 1229, annualCompManwon: annualCompByRole.minister, summary: "예금·증권은 확인되지만 건물 세부 가액이 기사 요약에서는 충분히 분리되지 않아 2차 보강 필요성이 큽니다.", memo: "서울 2채·나주 1채 등 3채 아파트 보유 기사 반영", tags: ["장관", "부분공개", "예금", "원문보강"], sourceLabel: "다음", sourceUrl: "https://v.daum.net/v/2EhAmPAilz?utm_source=chatgpt.com" }),
];

export const leeGovernmentOfficialsAssetsSalary2026: LeeGovernmentOfficialsAssetsSalary2026Data = {
  meta: {
    slug: "lee-jaemyung-government-officials-assets-salary-2026",
    title: "2026 이재명 정부 핵심 공직자 재산·보수 비교 리포트",
    subtitle: "정기 재산변동 공개 기준 15명의 총재산, 세부 자산, 공직 보수를 한 화면에서 비교하는 인터랙티브 리포트입니다.",
    methodology: "2026년 3월 26일 정기 재산변동 공개 기사 요약값을 1차 오픈용으로 재구성했습니다. 공직 연 보수는 2026년 정무직 보수표 기사 기준 직위별 연봉을 반영한 비교용 값이며, 순자산과 금융자산 비중은 알려진 세부 자산 기준 추정치입니다.",
    caution: "기사에 명시된 세부 항목만 반영했기 때문에 공란은 미공개 또는 2차 원문 보강 대상입니다. 정치적 평가가 아니라 공개 수치 비교용 페이지로 읽는 편이 적절합니다.",
    updatedAt: "2026-03-30 업데이트",
  },
  entries,
  patternPoints: [
    { title: "총재산 상단과 고정 보수 상단은 다른 축입니다", body: "대통령이 연 보수에서는 가장 높지만 총재산 상단은 장관급 민간 경력 인사와 일부 핵심 참모가 형성합니다. 직위 서열과 자산 절대액이 항상 같지는 않습니다." },
    { title: "장관급 내부에서도 자산 구성 차이가 큽니다", body: "한성숙·최휘영·김정관처럼 고자산군 안에서도 건물, 예금, 증권 비중이 다르게 나타납니다. 절대액만 보지 말고 구성 필드를 함께 읽는 편이 해석에 유리합니다." },
    { title: "전세권·채무가 큰 인물은 순자산 해석이 더 중요합니다", body: "김민석, 정동영, 구윤철처럼 전세권과 채무가 같이 큰 사례는 총재산만으로 해석하면 왜곡될 수 있습니다. 이번 2차 보강에서는 알려진 세부 항목 기준 추정 순자산을 같이 보여 줍니다." },
    { title: "공란은 억지로 채우지 않는 편이 맞습니다", body: "위성락, 하정우, 송미령, 이재명 일부 항목처럼 기사 요약에서 분리값이 충분하지 않은 경우는 비워두고, 관보 원문 기준으로 후속 보강하는 편이 데이터 품질에 유리합니다." },
  ],
  groupInsights: [
    { key: "presidential-office", title: "대통령실", body: "대통령실은 총재산 편차가 크고, 세부값이 부분 공개인 인물 비중도 있습니다. 참모진은 보수보다 자산 분포 차이가 더 크게 읽힙니다." },
    { key: "prime-minister-office", title: "국무총리실", body: "국무총리는 공직 보수 상단이지만 공개 재산 구조에서는 전세권과 채무가 동시에 크게 보이는 점이 특징입니다." },
    { key: "cabinet", title: "내각", body: "내각은 고자산군이 가장 많이 몰린 그룹입니다. 민간 경력 장관이 포함되면서 자산 절대액과 금융자산 비중이 함께 커지는 경향이 보입니다." },
    { key: "other-core", title: "기타 핵심 인사", body: "1차 오픈에서는 별도 분류 인원이 많지 않지만, 향후 수석급·위원장급을 확장할 때 유연하게 수용할 수 있도록 그룹 슬롯을 유지합니다." },
  ],
  faq: [
    { q: "왜 일부 세부 자산 칸이 비어 있나요?", a: "이번 1차 오픈은 기사 요약 기준으로 작성했기 때문에 기사에 명시된 항목만 넣었습니다. 공란은 미공개라기보다 관보 원문 보강이 필요한 경우가 많습니다." },
    { q: "공직 보수는 실수령액인가요?", a: "아닙니다. 2026년 정무직 공무원 보수 기사 기준 연봉을 만원 단위 비교값으로 넣은 세전 기준입니다. 수당, 세금, 개인별 지급 차이는 반영하지 않았습니다." },
    { q: "순자산과 금융자산 비중은 공식값인가요?", a: "아닙니다. 이번 보강 컬럼은 기사로 확인된 건물, 토지, 전세권, 예금, 증권, 채무만 합산한 추정치입니다. 세부 항목이 비어 있는 인물은 정확도가 낮거나 미공개로 처리됩니다." },
    { q: "정치적 평가를 위한 페이지인가요?", a: "아닙니다. 비교계산소 기준으로 공개 숫자를 비교해 읽는 인터랙티브 리포트이며, 정치적 해석보다 수치 구조 파악에 초점을 맞췄습니다." },
  ],
  referenceLinks: {
    official: [{ label: "정책브리핑 · 2026년 고위공직자 정기재산변동사항 공개", href: "https://www.korea.kr/briefing/policyBriefingView.do?newsId=156750948&utm_source=chatgpt.com" }],
    media: [
      { label: "뉴시스 · 이재명 대통령 재산 공개", href: "https://www.newsis.com/view/NISX20260325_0003563035?utm_source=chatgpt.com" },
      { label: "연합뉴스 · 김민석 총리 재산 공개", href: "https://www.yna.co.kr/view/AKR20260325119900001?utm_source=chatgpt.com" },
      { label: "머니투데이 · 대통령실 참모진 재산 공개", href: "https://www.mt.co.kr/politics/2026/03/26/2026032513533119398?utm_source=chatgpt.com" },
      { label: "연합뉴스 · 장관급 재산 공개 모음", href: "https://www.yna.co.kr/view/AKR20260325128700002?utm_source=chatgpt.com" },
    ],
  },
};

export function formatManwon(value?: number | null) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "미공개";
  if (value >= 10000) {
    const eok = value / 10000;
    return `${Number.isInteger(eok) ? eok.toFixed(0) : eok.toFixed(1)}억원`;
  }
  return `${Number(value).toLocaleString("ko-KR")}만원`;
}

export function formatRatio(value?: number | null) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "-";
  return `${Number(value).toLocaleString("ko-KR", { maximumFractionDigits: 1 })}배`;
}

export function formatPercent(value?: number | null) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "미공개";
  return `${Number(value).toLocaleString("ko-KR", { maximumFractionDigits: 1 })}%`;
}

export function getGroupLabel(group: OfficialsGroup) {
  if (group === "presidential-office") return "대통령실";
  if (group === "prime-minister-office") return "국무총리실";
  if (group === "cabinet") return "내각";
  return "기타 핵심 인사";
}

export function getBreakdownValue(entry: GovernmentOfficialEntry, filter: AssetBreakdownFilter) {
  if (filter === "real-estate") return Number(entry.buildingManwon || 0) + Number(entry.landManwon || 0) + Number(entry.jeonseRightManwon || 0);
  if (filter === "financial") return Number(entry.depositsManwon || 0) + Number(entry.securitiesManwon || 0);
  if (filter === "debt") return Number(entry.debtsManwon || 0);
  return entry.totalAssetsManwon;
}
