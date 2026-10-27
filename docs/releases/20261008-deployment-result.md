# 2026-10-08 개발 완료 페이지 배포 결과

사용자의 배포 요청에 따라 검증 완료한 신규 리포트 3개와 관련 검사 오류 수정 52개 파일을 커밋하고 `origin/main`에 정상 push했다.

- 커밋: `a7967c6f158ef976ed9e882ecc1fd9c65098eb2d`
- [GitHub Pages 배포 작업](https://github.com/ioilblogtool-ui/blog-tool/actions/runs/37729194845): build·deploy 모두 성공
- Cloudflare Pages 검사: 성공, 배포 ID `100e6a46-96c3-418d-a85a-42cd7a67832d`
- 로컬 main과 origin/main이 같은 커밋임을 확인했다.

## 운영 검증

| 경로 | 상태 |
|---|---|
| [4대 기획사 비교](https://bigyocalc.com/reports/kpop-big4-agency-comparison-2026/) | 200, 신규 제목·본문·FAQ·메타 반영 |
| [K팝 시장 규모](https://bigyocalc.com/reports/kpop-market-size-2026/) | 200, 신규 제목·본문·FAQ·메타 반영 |
| [삼성전자·마이크론 실적 비교](https://bigyocalc.com/reports/samsung-micron-earnings-2026/) | 200, 신규 제목·본문·FAQ·메타 반영 |
| 홈·리포트 목록 | 200, 신규 3개 링크 반영 |
| 건강보험료 계산기 | 200, 기존 2026 버전 유지 |

운영 브라우저에서 12개 경로, 320·360·640·768·1280px 화면 폭을 점검했다. 페이지 가로 넘침, 내부 링크 누락, 로컬 자원 HTTP 오류, 페이지 실행 오류가 없었다. 홈 K팝 검색·계산기 건강보험 검색·리포트 문화/자산 분류·모바일 메뉴 검색과 Escape 동작이 통과했다. 외부 광고·분석 호출은 브라우저 검증에서 제외했다.

건강보험 2027 개편·패키지 잠금파일의 기존 변경·별도 페이지 목록 CSV는 배포에 포함하지 않고 작업 트리에 보존했다. 이 결과 문서는 배포 후 작성한 로컬 기록이며 배포 커밋 자체에는 포함되지 않는다.
