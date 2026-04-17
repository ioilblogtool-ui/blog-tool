# AGENTS.md — 비교계산소 Codex 에이전트 가이드

> OpenAI Codex가 이 저장소에서 작업을 시작할 때 자동으로 읽는 파일입니다.
> 상세 기준은 아래 링크된 문서를 참조하세요.

---

## 프로젝트 한 줄 요약

**비교계산소** (bigyocalc.com) — 연봉·육아·부동산·투자 계산기를 한국어로 제공하는 Astro SSG 사이트.
`main` 브랜치 push = 즉시 프로덕션 배포.

---

## 핵심 명령어

```bash
npm run dev        # 로컬 dev 서버
npm run build      # 빌드 (커밋 전 필수 — 에러 있으면 push 금지)
npm run preview    # 빌드 결과 미리보기
npm run og:generate # OG 이미지 일괄 생성
```

---

## 반드시 읽어야 할 문서

| 문서 | 역할 |
|---|---|
| [`AGENT.md`](./AGENT.md) | 에이전트 공통 가이드 (TOC, 결정 트리, hard rules) |
| [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) | 코드 구조 전체 지도 |
| [`docs/QUALITY_SCORE.md`](./docs/QUALITY_SCORE.md) | 배포 전 품질 루브릭 |
| [`docs/SECURITY.md`](./docs/SECURITY.md) | 보안 규칙 |
| [`DEPLOY_CHECKLIST.md`](./DEPLOY_CHECKLIST.md) | 배포 전 QA 체크리스트 |

---

## 절대 하지 말 것

- `npm run build` 실패 상태로 커밋·push 금지
- 사용자 facing 텍스트 영어 작성 금지 (한국어 전용)
- API 키·시크릿 코드에 하드코딩 금지
- `추정`·`시뮬레이션` 배지 없이 추정값을 공식 데이터처럼 제시 금지
- `--no-verify` 플래그로 git hook 우회 금지
- `main` 브랜치에 직접 force push 금지

---

## 새 페이지 추가 시 최소 등록 체크

- [ ] `src/data/tools.ts` 또는 `src/data/reports.ts` 에 slug 등록
- [ ] `src/styles/app.scss` 에 `@use` 추가
- [ ] `public/sitemap.xml` 에 URL 추가
- [ ] `npm run build` 성공 확인

> 상세 패턴은 [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) 참조
