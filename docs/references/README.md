# references/ — 외부 레퍼런스

> 이 프로젝트에서 사용하는 라이브러리·프레임워크·데이터 출처의 공식 링크와 핵심 요약을 관리합니다.

---

## 프레임워크 · 빌드

| 이름 | 버전 | 공식 문서 | 비고 |
|---|---|---|---|
| Astro | 4.x | https://docs.astro.build | SSG 기준, island 미사용 |
| TypeScript | 5.x | https://www.typescriptlang.org/docs | 데이터 파일에만 사용 |
| SASS/SCSS | latest | https://sass-lang.com/documentation | 중첩·변수 사용 |

---

## 클라이언트 라이브러리

| 이름 | 버전 | CDN URL | 용도 |
|---|---|---|---|
| Chart.js | 4.4.x | `https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js` | 차트 렌더링 |

### Chart.js 자주 쓰는 패턴

```js
// 기본 초기화 패턴
const canvas = document.getElementById('my-chart');
canvas.height = 300;
new Chart(canvas, {
  type: 'bar', // 'line', 'doughnut', 'bar' (indexAxis:'y' → horizontal)
  data: { labels: [], datasets: [{ data: [], backgroundColor: [] }] },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
  },
});
```

---

## 배포 · 인프라

| 이름 | 용도 | 링크 |
|---|---|---|
| Cloudflare Pages | 프로덕션 배포 | https://pages.cloudflare.com |
| GitHub Actions | CI/CD | `.github/workflows/deploy.yml` |

---

## 데이터 출처 (콘텐츠)

| 카테고리 | 주요 출처 | URL |
|---|---|---|
| 국민연금 | 국민연금공단 | https://www.nps.or.kr |
| 보건복지부 | 보건복지부 | https://www.mohw.go.kr |
| 공무원 봉급표 | 인사혁신처 | https://www.mpm.go.kr |
| 부동산 | 국토교통부 실거래가 | https://rt.molit.go.kr |
| 연봉·복지 | 금융감독원 전자공시 | https://dart.fss.or.kr |
| OECD 지표 | OECD Stats | https://stats.oecd.org |
| 반도체 ETF | 각 운용사 공시 | - |

---

## OG 이미지 생성

| 이름 | 버전 | 설치 |
|---|---|---|
| Python Pillow | 10.x | `pip install Pillow` |

스크립트: `scripts/generate-og-tools.py`

```bash
python scripts/generate-og-tools.py
```

출력: `public/og/tools/*.png`, `public/og/reports/*.png` (1200×630)

---

## SEO · 분석

| 서비스 | 용도 | 설정 위치 |
|---|---|---|
| Google Search Console | 색인·크롤링 모니터링 | 외부 대시보드 |
| Microsoft Clarity | 사용자 행동 분석 | `BaseLayout.astro` |
| Google AdSense | 수익화 | `BaseLayout.astro` |
