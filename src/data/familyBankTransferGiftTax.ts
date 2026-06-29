export type FamilyTransferBadge = "공식" | "참고" | "주의" | "고위험";
export type TransferRiskLevel = "낮음" | "중간" | "높음" | "매우 높음";

export type FamilyTransferMeta = {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  updatedAt: string;
  caution: string;
};

export type SummaryCard = {
  label: string;
  value: string;
  note: string;
  badge: FamilyTransferBadge;
};

export type RiskTableItem = {
  transferType: string;
  risk: TransferRiskLevel;
  badge: FamilyTransferBadge;
  interpretation: string;
  checkPoint: string;
};

export type RelationGuide = {
  id: string;
  label: string;
  title: string;
  summary: string;
  deductionLabel: string;
  keyPoints: string[];
  caution: string;
};

export type DeductionLimit = {
  relation: string;
  amountLabel: string;
  note: string;
  badge: FamilyTransferBadge;
};

export type ChecklistItem = {
  title: string;
  reason: string;
  example: string;
};

export type CaseStudy = {
  id: string;
  title: string;
  amountLabel: string;
  risk: TransferRiskLevel;
  situation: string;
  interpretation: string;
  evidence: string[];
};

export type AuditPoint = {
  title: string;
  body: string;
  badge: FamilyTransferBadge;
};

export type RelatedLink = {
  label: string;
  href: string;
  description: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type SourceLink = {
  label: string;
  href: string;
  note: string;
};

export type FamilyBankTransferGiftTaxReport = {
  meta: FamilyTransferMeta;
  summaryCards: SummaryCard[];
  riskTable: RiskTableItem[];
  relationGuides: RelationGuide[];
  deductionLimits: DeductionLimit[];
  checklist: ChecklistItem[];
  cases: CaseStudy[];
  auditPoints: AuditPoint[];
  relatedLinks: RelatedLink[];
  faq: FaqItem[];
  sources: SourceLink[];
};

export const familyBankTransferGiftTax: FamilyBankTransferGiftTaxReport = {
  meta: {
    slug: "family-bank-transfer-gift-tax",
    title: "가족 간 계좌이체 증여세 기준 리포트",
    seoTitle: "가족 간 계좌이체 증여세 기준 리포트 | 부모·자녀·부부 이체, 얼마부터 문제될까?",
    description:
      "부모·자녀·부부·형제 사이 계좌이체가 증여세 대상이 되는지 생활비, 전세자금, 주택자금, 차용증, 이자, 상환 증빙 기준으로 정리했습니다.",
    ogTitle: "가족 간 계좌이체 증여세 기준",
    ogDescription:
      "생활비인지, 빌린 돈인지, 증여인지 헷갈리는 가족 간 이체를 관계·용도·증빙 기준으로 정리.",
    updatedAt: "2026년 6월 기준",
    caution:
      "이 리포트는 일반적인 판단 기준을 정리한 참고용 콘텐츠입니다. 실제 증여세 과세 여부는 자금 출처, 사용처, 가족관계, 상환 기록, 세무조사 시점의 사실관계에 따라 달라질 수 있습니다.",
  },
  summaryCards: [
    {
      label: "단일 안전금액",
      value: "없음",
      note: "금액만으로 판단하지 않고 목적·사용처·증빙을 함께 봅니다.",
      badge: "주의",
    },
    {
      label: "배우자 공제",
      value: "10년 6억 원",
      note: "부부간 목돈 이전 시 먼저 확인할 기준입니다.",
      badge: "공식",
    },
    {
      label: "성인 자녀 공제",
      value: "10년 5,000만 원",
      note: "부모가 성인 자녀에게 증여할 때 대표 기준입니다.",
      badge: "공식",
    },
    {
      label: "차용 증빙",
      value: "이자·상환 기록",
      note: "차용증만으로 끝나지 않고 실제 상환 흐름이 중요합니다.",
      badge: "참고",
    },
  ],
  riskTable: [
    {
      transferType: "생활비·교육비 목적의 정기 이체",
      risk: "중간",
      badge: "주의",
      interpretation: "실제 생활비·교육비로 사용됐는지가 핵심입니다. 사용하지 않고 예금·투자자산으로 쌓이면 증여 이슈가 생길 수 있습니다.",
      checkPoint: "카드값, 월세, 교육비 납부 내역",
    },
    {
      transferType: "명절 용돈·소액 축의금",
      risk: "낮음",
      badge: "참고",
      interpretation: "사회통념상 인정되는 범위의 일시적 금전 지급은 리스크가 낮은 편입니다.",
      checkPoint: "금액 규모와 반복성",
    },
    {
      transferType: "자녀 전세보증금 지원",
      risk: "높음",
      badge: "고위험",
      interpretation: "목돈이 자녀 명의 보증금으로 남기 때문에 자금출처 확인 대상이 될 수 있습니다.",
      checkPoint: "증여 신고 또는 차용 증빙",
    },
    {
      transferType: "주택 구입자금 지원",
      risk: "매우 높음",
      badge: "고위험",
      interpretation: "부동산 취득자금은 자산으로 남고 금액도 커서 증여 여부와 자금출처 소명이 중요합니다.",
      checkPoint: "취득자금 출처와 신고 이력",
    },
    {
      transferType: "주식·코인 투자금 지원",
      risk: "높음",
      badge: "고위험",
      interpretation: "가족 명의 투자계좌에 자금이 들어가고 수익이 귀속되면 증여로 볼 여지가 커집니다.",
      checkPoint: "투자계좌 명의와 원천자금",
    },
    {
      transferType: "부모 병원비 대납",
      risk: "중간",
      badge: "주의",
      interpretation: "부양 목적과 실제 병원비 사용 내역이 명확하면 설명 가능성이 높아집니다.",
      checkPoint: "병원 영수증과 납부 내역",
    },
    {
      transferType: "가족 간 돈 빌려줌",
      risk: "높음",
      badge: "고위험",
      interpretation: "차용으로 보려면 계약서보다 실제 이자 지급과 원금 상환 흐름이 더 중요합니다.",
      checkPoint: "차용증, 이자, 원금 상환 기록",
    },
    {
      transferType: "부부 생활비 이체",
      risk: "낮음",
      badge: "참고",
      interpretation: "공동 생활비 계좌로 들어가 실제 생활비로 쓰인다면 리스크는 낮은 편입니다.",
      checkPoint: "공동 생활비 지출 내역",
    },
    {
      transferType: "부부 명의 자산 취득자금 이전",
      risk: "높음",
      badge: "고위험",
      interpretation: "생활비와 달리 배우자 명의 부동산·주식·금융자산 취득으로 이어지면 증여 검토가 필요합니다.",
      checkPoint: "명의와 자금 출처 일치 여부",
    },
  ],
  relationGuides: [
    {
      id: "parent-child",
      label: "부모 → 자녀",
      title: "생활비와 자산 취득자금을 분리해서 봅니다",
      summary: "성인 자녀에게 보내는 목돈은 전세보증금, 주택 구입, 투자자금으로 남는 순간 증여 리스크가 커집니다.",
      deductionLabel: "성인 5,000만 원 / 미성년 2,000만 원",
      keyPoints: ["생활비·교육비 사용 내역", "최근 10년 증여 이력", "전세·주택자금 여부"],
      caution: "자녀 명의 자산으로 남는 돈은 생활비보다 훨씬 보수적으로 봐야 합니다.",
    },
    {
      id: "child-parent",
      label: "자녀 → 부모",
      title: "부양 목적과 실제 사용처가 중요합니다",
      summary: "부모 생활비나 병원비 지원은 사용처가 명확할수록 설명이 쉬워집니다. 다만 부모 명의 자산 취득자금으로 쓰이면 별도 검토가 필요합니다.",
      deductionLabel: "직계존속 5,000만 원",
      keyPoints: ["병원비·생활비 영수증", "부모 계좌 잔액 축적 여부", "부모 명의 자산 취득 여부"],
      caution: "지원금이 실제 지출되지 않고 예금이나 자산으로 남으면 증여 이슈가 생길 수 있습니다.",
    },
    {
      id: "spouse",
      label: "부부 간",
      title: "생활 공동체 비용과 자산 이전을 구분합니다",
      summary: "생활비 계좌 이체는 일반적인 공동 생활자금으로 설명될 수 있지만, 배우자 명의 자산 취득자금은 증여 공제와 함께 검토해야 합니다.",
      deductionLabel: "배우자 6억 원",
      keyPoints: ["공동 생활비 계좌", "배우자 명의 자산 취득", "10년 합산 증여액"],
      caution: "부부간 이체라고 해서 모든 목돈 이전이 자동으로 문제없는 것은 아닙니다.",
    },
    {
      id: "siblings",
      label: "형제·친족",
      title: "공제한도가 작고 설명 부담이 큽니다",
      summary: "형제·친족 간 목돈 이전은 부모·자녀나 부부보다 공제한도가 작고, 대여라면 증빙을 더 꼼꼼히 남겨야 합니다.",
      deductionLabel: "기타 친족 1,000만 원",
      keyPoints: ["목돈 이체 목적", "차용증 작성 시점", "이자·상환 내역"],
      caution: "사업자금·보증금 지원은 차용과 증여 중 어떤 구조인지 먼저 정해야 합니다.",
    },
  ],
  deductionLimits: [
    { relation: "배우자", amountLabel: "6억 원", note: "부부간 증여는 10년 합산 6억 원 공제를 검토합니다.", badge: "공식" },
    { relation: "성인 자녀", amountLabel: "5,000만 원", note: "만 19세 이상 자녀에게 적용되는 대표 공제 기준입니다.", badge: "공식" },
    { relation: "미성년 자녀", amountLabel: "2,000만 원", note: "만 19세 미만 자녀는 10년 합산 2,000만 원 기준을 봅니다.", badge: "공식" },
    { relation: "직계존속", amountLabel: "5,000만 원", note: "자녀가 부모에게 증여하는 경우 등 직계존속 공제 기준입니다.", badge: "공식" },
    { relation: "기타 친족", amountLabel: "1,000만 원", note: "형제·자매 등 기타 친족은 공제한도가 작습니다.", badge: "공식" },
  ],
  checklist: [
    {
      title: "차용증 작성일",
      reason: "돈이 오간 뒤 나중에 만든 문서처럼 보이지 않도록 실제 대여 시점과 맞아야 합니다.",
      example: "이체일과 같은 날 또는 이체 전 작성",
    },
    {
      title: "원금과 상환일",
      reason: "얼마를 빌렸고 언제 갚을지 특정되어야 차용 관계를 설명하기 쉽습니다.",
      example: "원금 5,000만 원, 36개월 분할 상환",
    },
    {
      title: "이자율과 지급일",
      reason: "무이자·저리 대여는 이자 상당액 증여 이슈가 생길 수 있어 약정과 지급 흐름이 중요합니다.",
      example: "매월 말 이자 지급",
    },
    {
      title: "원금 상환 기록",
      reason: "실제 갚고 있는지가 차용과 증여를 가르는 핵심 자료가 될 수 있습니다.",
      example: "매월 100만 원씩 원금상환 메모로 이체",
    },
    {
      title: "계좌이체 메모",
      reason: "단독 증빙은 아니지만 이체 목적을 설명하는 보조 자료가 됩니다.",
      example: "대여금, 이자, 원금상환 등으로 기록",
    },
    {
      title: "사용처 증빙",
      reason: "생활비·병원비·교육비라면 실제 해당 목적에 사용됐다는 자료가 필요합니다.",
      example: "병원 영수증, 월세 이체 내역, 학원비 결제 내역",
    },
  ],
  cases: [
    {
      id: "monthly-support",
      title: "부모가 성인 자녀에게 매달 100만 원 생활비 이체",
      amountLabel: "월 100만 원",
      risk: "중간",
      situation: "자녀가 독립해 월세와 생활비를 부담하는 상황에서 부모가 매달 일정 금액을 보냅니다.",
      interpretation: "실제 생활비로 쓰인 내역이 있으면 설명 가능성이 높지만, 사용하지 않고 금융자산으로 쌓이면 증여로 볼 여지가 있습니다.",
      evidence: ["월세 이체 내역", "카드값·공과금 지출", "생활비 계좌 흐름"],
    },
    {
      id: "jeonse-deposit",
      title: "부모가 자녀 전세보증금 1억 원 지원",
      amountLabel: "1억 원",
      risk: "높음",
      situation: "자녀 명의 전세계약을 위해 부모가 보증금 일부를 대신 보냅니다.",
      interpretation: "목돈이 자녀 명의 보증금으로 남기 때문에 증여 신고 또는 차용 구조를 명확히 정해야 합니다.",
      evidence: ["전세계약서", "증여세 신고 내역", "차용증·상환 내역"],
    },
    {
      id: "spouse-living",
      title: "부부간 생활비 계좌로 매달 300만 원 이체",
      amountLabel: "월 300만 원",
      risk: "낮음",
      situation: "한 배우자가 공동 생활비 계좌에 매달 돈을 넣고 가족 생활비로 사용합니다.",
      interpretation: "실제 생활비 계좌로 쓰인다면 리스크는 낮은 편입니다. 다만 배우자 명의 투자자산으로 쌓이는 구조와는 구분해야 합니다.",
      evidence: ["공동 생활비 계좌", "카드대금·관리비 지출", "가족 생활비 내역"],
    },
    {
      id: "sibling-business",
      title: "형이 동생에게 사업자금 5,000만 원 이체",
      amountLabel: "5,000만 원",
      risk: "높음",
      situation: "동생의 사업 초기자금으로 형제가 목돈을 지원합니다.",
      interpretation: "기타 친족 공제한도를 초과할 수 있어 증여인지 대여인지 구조를 명확히 해야 합니다.",
      evidence: ["차용증", "이자 지급 내역", "사업자금 사용처", "원금 상환 기록"],
    },
    {
      id: "medical-cost",
      title: "자녀가 부모 병원비 2,000만 원 대납",
      amountLabel: "2,000만 원",
      risk: "중간",
      situation: "부모 치료비를 자녀가 병원에 직접 납부하거나 부모 계좌로 보내 납부합니다.",
      interpretation: "부양 목적과 병원비 사용 내역이 명확하면 설명 가능성이 높습니다. 부모 계좌에 남는 돈과는 구분해야 합니다.",
      evidence: ["병원 영수증", "진료비 납부 내역", "부모 계좌 사용 흐름"],
    },
  ],
  auditPoints: [
    {
      title: "돈이 어디서 나왔는가",
      body: "증여자 또는 대여자의 소득·예금·대출 등 원천자금을 설명할 수 있어야 합니다.",
      badge: "주의",
    },
    {
      title: "실제 어디에 쓰였는가",
      body: "생활비, 병원비, 교육비라면 해당 목적의 지출 자료가 있어야 설명이 쉬워집니다.",
      badge: "참고",
    },
    {
      title: "반복적으로 이체됐는가",
      body: "매달 반복되는 이체는 생활비일 수도 있지만, 사용처 없이 축적되면 증여로 볼 수 있습니다.",
      badge: "주의",
    },
    {
      title: "빌린 돈이라면 갚고 있는가",
      body: "차용증보다 중요한 것은 실제 이자 지급과 원금 상환의 계좌 기록입니다.",
      badge: "고위험",
    },
    {
      title: "명의와 실질 소유가 일치하는가",
      body: "가족 명의로 취득했지만 실제 자금 부담자가 다르면 자금출처 확인이 필요할 수 있습니다.",
      badge: "고위험",
    },
  ],
  relatedLinks: [
    {
      label: "증여세 계산기",
      href: "/tools/gift-tax-calculator/",
      description: "관계별 10년 합산 공제한도와 예상 증여세를 계산합니다.",
    },
    {
      label: "자녀 생애 증여 플랜",
      href: "/reports/child-lifetime-gift-plan/",
      description: "0세부터 결혼·주택자금까지 자녀 증여 흐름을 정리합니다.",
    },
    {
      label: "부부간 주식 증여세 계산기",
      href: "/tools/spouse-stock-gift-tax-calculator/",
      description: "배우자 6억 공제와 해외주식 양도세 절세 효과를 비교합니다.",
    },
    {
      label: "자녀 증여세 계산기",
      href: "/tools/gift-tax-child-calculator/",
      description: "성년·미성년 자녀 공제와 결혼·출산 공제를 확인합니다.",
    },
  ],
  faq: [
    {
      question: "가족 간 계좌이체는 얼마부터 증여세가 나오나요?",
      answer:
        "금액만으로 바로 결정되지는 않습니다. 관계별 10년 합산 공제한도, 이체 목적, 실제 사용처, 상환 여부, 증빙을 함께 봐야 합니다.",
    },
    {
      question: "부모님이 자녀에게 생활비를 보내면 증여인가요?",
      answer:
        "실제 생활비·교육비로 사용된 통상 범위의 금전은 증여세 이슈가 작을 수 있습니다. 다만 사용하지 않고 예금·투자자산으로 축적되면 증여로 볼 여지가 있습니다.",
    },
    {
      question: "부부간 계좌이체도 증여세가 나오나요?",
      answer:
        "부부 생활비나 공동 생활자금은 일반적인 거래로 설명될 수 있습니다. 하지만 배우자 명의 주택, 주식, 금융자산 취득자금으로 목돈이 이동하면 배우자 공제한도와 증여 여부를 검토해야 합니다.",
    },
    {
      question: "자녀 전세자금을 부모가 지원하면 증여세가 나오나요?",
      answer:
        "전세보증금은 자녀 명의 자산으로 남는 목돈이므로 증여 리스크가 높은 편입니다. 증여로 신고할지, 차용으로 처리할지, 일부 증여와 일부 차용으로 나눌지 검토가 필요합니다.",
    },
    {
      question: "차용증만 쓰면 증여세를 피할 수 있나요?",
      answer:
        "차용증은 시작점일 뿐입니다. 실제 이자 지급, 원금 상환, 계좌 메모, 상환 능력 등 돈을 빌리고 갚는 흐름이 함께 있어야 차용 관계를 설명하기 쉽습니다.",
    },
    {
      question: "가족 간 무이자 대여도 괜찮나요?",
      answer:
        "무이자 또는 낮은 이자로 돈을 빌려주면 이자 상당액에 대한 증여 이슈가 생길 수 있습니다. 금액과 기간이 크다면 적정 이자와 지급 내역을 검토해야 합니다.",
    },
    {
      question: "계좌이체 메모는 도움이 되나요?",
      answer:
        "도움은 되지만 단독 증빙은 아닙니다. 대여금, 이자, 원금상환 같은 메모와 함께 실제 계약서, 이자 지급, 원금 상환 기록이 있어야 설명력이 커집니다.",
    },
    {
      question: "현금으로 주면 더 안전한가요?",
      answer:
        "그렇지 않습니다. 현금은 오히려 자금 출처와 사용처를 설명하기 어려울 수 있습니다. 계좌 기록과 사용처 증빙을 남기는 편이 일반적으로 설명에 유리합니다.",
    },
    {
      question: "증여세 신고를 안 하면 언제 문제가 되나요?",
      answer:
        "부동산 취득, 전세보증금 형성, 세무조사, 자금출처 확인 과정에서 과거 가족 간 자금 이동이 확인될 수 있습니다.",
    },
    {
      question: "가족 간 돈 거래 기록은 얼마나 보관해야 하나요?",
      answer:
        "증여재산공제가 10년 합산 기준이고 자금출처 확인이 뒤늦게 문제될 수 있으므로, 큰 금액의 증빙은 장기간 보관하는 편이 좋습니다.",
    },
  ],
  sources: [
    {
      label: "상속세 및 증여세법 제46조",
      href: "https://www.law.go.kr/법령/상속세및증여세법/제46조",
      note: "비과세되는 증여재산 기준",
    },
    {
      label: "상속세 및 증여세법 제53조",
      href: "https://www.law.go.kr/법령/상속세및증여세법/제53조",
      note: "관계별 증여재산공제 기준",
    },
    {
      label: "상속세 및 증여세법 제41조의4",
      href: "https://www.law.go.kr/법령/상속세및증여세법/제41조의4",
      note: "금전 무상대출 등에 따른 이익의 증여 기준",
    },
  ],
};
