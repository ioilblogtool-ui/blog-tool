# Agent Guide

## 목적
이 저장소는 블로그 글에서 링크로 연결하거나 iframe으로 삽입할 수 있는 독립 웹페이지를 배포하는 프로젝트다.

## 작업 원칙
- 사용자에게 노출되는 URL에는 `.md`가 포함되지 않는다.
- 목록과 메타 정보는 `src/content/tools/*.md` frontmatter로 관리한다.
- 실제 렌더링 페이지는 `src/pages/tools/*.astro`에서 구현한다.
- 새 도구를 추가할 때는 `Markdown 메타 파일 1개 + Astro 페이지 1개`를 함께 만든다.
- 공통 스타일은 `src/styles/global.css`를 우선 수정한다.
- GitHub Pages 기준 배포 경로는 `/blog-tool/` 하위다.

## 추가 절차
1. `src/content/tools/<slug>.md` 생성
2. `src/pages/tools/<slug>.astro` 생성
3. 필요 시 `public/scripts/tools.js` 확장
4. `npm run build`로 확인
5. GitHub Pages에 배포

## UX/UI 원칙
- iframe 안에서도 읽기 쉬운 간격과 대비를 유지한다.
- 첫 화면에서 도구 목적이 바로 보여야 한다.
- 입력, 결과, 비교 표는 한눈에 구분되어야 한다.
- 상위 사이트 브랜딩보다 개별 도구의 목적 전달을 우선한다.
