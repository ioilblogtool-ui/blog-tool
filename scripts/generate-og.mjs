import fs from 'fs';
import path from 'path';

// tools.ts에서 slug, title, description, eyebrow, previewStats만 추출한 인라인 데이터
const tools = [
  { slug: "salary", title: "연봉 인상 계산기", description: "현재 연봉과 인상 시나리오별 월 실수령 변화를 비교하는 계산 페이지", eyebrow: "연봉·이직", previewStats: [{ label: "월 실수령", value: "341만" }, { label: "+5% 후", value: "358만" }] },
  { slug: "retirement", title: "퇴직금 계산기", description: "평균임금 기준 퇴직금과 세후 추정액을 계산하는 페이지", eyebrow: "연봉·이직", previewStats: [{ label: "퇴직금 세전", value: "4,166만" }, { label: "세후 추정", value: "약 3,950만" }] },
  { slug: "negotiation", title: "이직 계산기", description: "현재 연봉과 목표 연봉의 세전 실수령 차이를 비교하는 페이지", eyebrow: "연봉·이직", previewStats: [{ label: "월 실수령 차이", value: "+52만" }, { label: "인상률", value: "20%" }] },
  { slug: "parental-leave", title: "육아휴직 계산기", description: "육아휴직 급여와 복직 후 수입을 비교해 버퍼를 계산하는 페이지", eyebrow: "육아휴직·출산", previewStats: [{ label: "가구 수령액", value: "월 200만+" }, { label: "버퍼 기간", value: "12개월" }] },
  { slug: "household-income", title: "가구 소득 계산기", description: "가구 연 총소득, 월 체감, 실수령 추정, 평균·기준 중위소득 대비 위치를 계산하는 페이지", eyebrow: "연봉·이직", previewStats: [{ label: "중위소득 대비", value: "138%" }, { label: "월 실수령", value: "약 560만" }] },
  { slug: "bonus-simulator", title: "대기업 성과급 시뮬레이터", description: "삼성전자, SK하이닉스, 현대자동차의 직급별 성과급과 2026~2028 총보상 시나리오를 비교하는 페이지", eyebrow: "성과급 비교", previewStats: [{ label: "삼성 총보상", value: "1.1억" }, { label: "하이닉스", value: "1.8억" }] },
  { slug: "samsung-bonus", title: "삼성전자 성과급 계산기", description: "개인·부부 모드로 삼성전자 OPI, TAI, 복지 포함 총보상과 월 체감액을 계산하는 페이지", eyebrow: "성과급 비교", previewStats: [{ label: "OPI+TAI", value: "3,600만" }, { label: "월 체감", value: "+300만" }] },
  { slug: "sk-hynix-bonus", title: "SK하이닉스 성과급 계산기", description: "개인·부부 모드로 SK하이닉스의 PS, PI, 복지 포함 총보상과 월 체감액을 계산하는 페이지", eyebrow: "성과급 비교", previewStats: [{ label: "PS+PI", value: "6,000만" }, { label: "월 체감", value: "+500만" }] },
  { slug: "hyundai-bonus", title: "현대자동차 성과금 계산기", description: "개인·부부 모드로 현대자동차 성과금 패키지와 자사주 포함 총보상, 월 체감액을 계산하는 페이지", eyebrow: "성과급 비교", previewStats: [{ label: "성과금 총액", value: "2,800만" }, { label: "월 체감", value: "+233만" }] },
  { slug: "birth-support-total", title: "출산~2세 총지원금 계산기", description: "첫만남이용권, 부모급여, 아동수당을 합쳐 아이 두 돌 전까지 받을 수 있는 총액을 계산하는 페이지", eyebrow: "육아휴직·출산", previewStats: [{ label: "2세까지 총액", value: "약 2,100만" }, { label: "월 평균", value: "87만" }] },
  { slug: "single-parental-leave-total", title: "한 명만 육아휴직 총수령액 계산기", description: "육아휴직 급여, 부모급여, 아동수당, 첫만남이용권을 합쳐 아이 두 돌까지 가구 총수령액을 계산하는 페이지", eyebrow: "육아휴직·출산", previewStats: [{ label: "가구 총수령", value: "약 3,800만" }, { label: "월 평균", value: "158만" }] },
  { slug: "parental-leave-pay", title: "육아휴직 급여 계산기", description: "월 통상임금 기준으로 일반 육아휴직 사용 시 월별 급여와 총액을 계산하는 페이지", eyebrow: "육아휴직·출산", previewStats: [{ label: "첫 3개월", value: "월 250만" }, { label: "4개월~", value: "월 150만" }] },
  { slug: "six-plus-six", title: "6+6 부모육아휴직제 계산기", description: "부모 모두 육아휴직을 쓸 때 특례 적용 여부와 일반 육아휴직 대비 차액을 비교하는 페이지", eyebrow: "육아휴직·출산", previewStats: [{ label: "특례 총액", value: "약 900만" }, { label: "일반 대비", value: "+300만" }] },
];

const outDir = './public/og/tools';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const categoryColors = {
  '연봉·이직':    { bg: '#0F6E56', text: '#E1F5EE' },
  '성과급 비교':  { bg: '#854F0B', text: '#FAEEDA' },
  '육아휴직·출산':{ bg: '#0F6E56', text: '#E1F5EE' },
  '기타':         { bg: '#444441', text: '#D3D1C7' },
};

tools.forEach(tool => {
  const cat = tool.eyebrow ?? '기타';
  const color = categoryColors[cat] ?? categoryColors['기타'];
  const stats = (tool.previewStats ?? []).slice(0, 3);

  const statElements = stats.map((stat, i) => {
    const x = 60 + i * 220;
    return `
      <rect x="${x}" y="420" width="200" height="72" rx="8" fill="#222220"/>
      <text x="${x + 12}" y="446" font-family="system-ui, sans-serif" font-size="11" fill="#5F5E5A">${stat.label}</text>
      <text x="${x + 12}" y="476" font-family="system-ui, sans-serif" font-size="24" font-weight="500" fill="#1D9E75">${stat.value}</text>
    `;
  }).join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <rect width="1200" height="630" fill="#18181A"/>
  <circle cx="1100" cy="0" r="200" fill="#0F6E56" fill-opacity="0.07"/>
  <circle cx="100" cy="630" r="140" fill="#1D9E75" fill-opacity="0.05"/>

  <rect x="60" y="52" width="22" height="22" rx="4" fill="#1D9E75"/>
  <rect x="90" y="52" width="22" height="22" rx="4" fill="none" stroke="#1D9E75" stroke-width="1.5"/>
  <rect x="60" y="82" width="22" height="22" rx="4" fill="none" stroke="#1D9E75" stroke-width="1.5"/>
  <rect x="90" y="82" width="22" height="22" rx="4" fill="#0F6E56"/>
  <line x1="96" y1="93" x2="108" y2="93" stroke="white" stroke-width="2" stroke-linecap="round"/>
  <line x1="102" y1="87" x2="102" y2="99" stroke="white" stroke-width="2" stroke-linecap="round"/>
  <text x="124" y="66" font-family="system-ui, sans-serif" font-size="15" font-weight="500" fill="#FFFFFF">비교계산소</text>

  <rect x="60" y="160" width="${cat.length * 14 + 28}" height="30" rx="15" fill="${color.bg}"/>
  <text x="${60 + 14}" y="180" font-family="system-ui, sans-serif" font-size="13" font-weight="500" fill="${color.text}">${cat}</text>

  <text x="60" y="260" font-family="system-ui, sans-serif" font-size="46" font-weight="500" fill="#FFFFFF" letter-spacing="-0.8">${tool.title}</text>

  <text x="60" y="320" font-family="system-ui, sans-serif" font-size="18" fill="#5F5E5A">${tool.description ?? ''}</text>

  ${statElements}

  <line x1="60" y1="530" x2="1140" y2="530" stroke="#2E2E2C" stroke-width="1"/>
  <text x="60" y="580" font-family="system-ui, sans-serif" font-size="14" fill="#444442">비교계산소 — 숫자로 더 잘 판단하세요</text>
  <text x="1140" y="580" font-family="system-ui, sans-serif" font-size="13" fill="#444442" text-anchor="end">bigyocalc.com/tools/${tool.slug}</text>
</svg>`;

  fs.writeFileSync(path.join(outDir, `${tool.slug}.svg`), svg, 'utf8');
  console.log(`생성: ${tool.slug}.svg`);
});

console.log('OG 이미지 생성 완료');
